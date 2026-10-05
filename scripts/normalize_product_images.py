"""
Turn raw generated product shots into shipping menu assets.

The generator gets one job — a correct, well-lit product on a plain background.
Framing, scale, background colour and canvas size are *not* negotiated with it,
because they are deterministic and it is bad at them. They happen here, which is
the only way ten tiles end up matching each other to the pixel.

Two outputs per source:

- `cutout/`  the product on transparency, trimmed to its own bounding box. This
             is the master. Nothing about the app is baked into it.
- `tile/`    2048x2048, product normalised to a fixed height and baseline, with
             a contact shadow drawn in code. Drop-in for `ProductThumb`.

Background removal is connectivity-based, not colour-based. A pixel is dropped
only if it is background-*coloured* **and** reachable from the frame edge without
crossing the product. That distinction is the whole ballgame: latte foam sits
about 8 levels from the cream background, so any pure colour-distance threshold
wide enough to catch the background also eats the foam. Reachability doesn't
care how pale the foam is — it is walled in by the cup.

The measured backgrounds are flat (border spread 2-3 levels) but differ between
images by up to 5 levels, which is why they go rather than get normalised.

Run with the UNI-Ai venv, which already has Pillow and numpy:

    & "C:\\Users\\divay\\OneDrive\\Desktop\\UNI-Ai\\activity_image_processing\\venv\\Scripts\\python.exe" scripts/normalize_product_images.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(__file__).resolve().parent.parent / "assets" / "product-imgs"
OUT_CUTOUT = SRC / "cutout"
OUT_TILE = SRC / "tile"
OUT_QC = SRC / "_qc"

# --- Background classification -------------------------------------------------
#
# Distance is per-channel max from the estimated background colour. Everything
# under T_LO is background outright; T_LO..T_HI ramps the alpha so the cut edge
# is anti-aliased instead of stair-stepped.
#
# T_HI is tight on purpose. The measured background spread is 2-3 levels (max 7),
# so 10 keeps a comfortable margin, and every level above that is a level of
# tolerance the flood can use to squeeze through a soft edge. At 16 it found a
# weak spot in the Frappuccino's clear dome and ate a notch out of the rim.
T_LO = 4
T_HI = 10

# --- Soft-shadow removal -------------------------------------------------------
#
# The generator bakes a contact shadow into the plate. It is far enough from the
# background colour to survive T_HI, so it comes through as an opaque pale smear
# — invisible against the white card, obvious against the green PDP scrim.
#
# A neutral shadow is the background scaled down: every channel multiplied by
# roughly the same factor. Coffee, foam and glass all shift hue as well as
# brightness, so the ratio spread separates them cleanly.
SHADOW_MIN_RATIO = 0.62   # darker than this is not a shadow, it is the product
SHADOW_MAX_RATIO = 1.03   # allow a touch of noise above 1.0
SHADOW_MAX_SPREAD = 0.10  # per-channel ratio spread; neutral means near-zero
# Only hunt for shadow near the base. A clear glass body is also "background
# scaled down", and removing that would gut every mug in the set.
#
# The band is measured up from where the *vessel* ends, not from where the opaque
# mask ends — the mask bottom is the bottom of the shadow, so measuring from it
# starts the band below the shadow's own top edge and leaves a band of smear with
# a tell-tale straight top. The vessel is found by asking which pixels are not
# explainable as the background scaled down; a shadow is, glass and coffee aren't.
SHADOW_ZONE = 0.08        # fraction of product height above the vessel base
VESSEL_MIN_SPREAD = 0.08  # ratio spread that marks a pixel as genuinely coloured
VESSEL_MAX_RATIO = 0.55   # or simply far too dark to be a shadow on cream

# A soft edge lets the flood squeeze through a narrow channel and hollow out the
# subject — it found one in the Frappuccino's clear dome. Eroding the background
# mask severs any channel thinner than this, after which the orphaned pocket is
# no longer reachable from the frame and gets dropped.
LEAK_SEVER = 12

# Minimum alpha at which colour decontamination is worth doing. See the note at
# the call site — the divide is unstable as coverage approaches zero.
DECONTAMINATE_FLOOR = 0.35

# Radius for the closing that repairs edge notches. Must stay well under the
# width of a real gap — a mug handle's opening is 40px and up at this scale.
REPAIR_CLOSE = 16

# --- Tile geometry -------------------------------------------------------------
#
# The numbers the whole catalogue is locked to. Every product is scaled to the
# same on-canvas height regardless of real cup size, so a Short and a Venti sit
# identically in the grid.
TILE = 2048
PRODUCT_HEIGHT = 0.72   # fraction of canvas height
PRODUCT_BASELINE = 0.86  # where the base of the product sits, top-down
MAX_WIDTH = 0.82        # guard so a wide item (a mug, a bag) cannot overflow

# Shadows in this app are green-tinted, never neutral black — see `Elevation` in
# src/theme/colors.ts. A grey shadow on a cream surface is the clearest tell of a
# cheap clone, and that rule applies to baked pixels as much as to RN styles.
SHADOW_RGB = (30, 57, 50)  # Brand.house #1E3932
SHADOW_OPACITY = 0.12
SHADOW_BLUR = 26
SHADOW_DX = 12  # key is upper-left, so the contact shadow falls slightly right

# QC contact sheet renders tiles at their true 96pt size on the real card white.
QC_THUMB = 96
QC_SCALE = 3
SURFACE_RAISED = (255, 255, 255)
SURFACE_APP = (247, 245, 240)


def _propagate_rows(cur: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Flood `cur` sideways along each row, blocked wherever `mask` is False.

    Vectorised across every row at once. Each maximal run of True in `mask` gets
    a label; a run lights up entirely if it contains any already-flooded pixel.
    Alternating this with the column version converges in a handful of passes,
    where naive pixel dilation would need one pass per pixel of path length.
    """
    h, w = mask.shape
    run_id = np.cumsum(~mask, axis=1, dtype=np.int64)
    label = run_id + (np.arange(h, dtype=np.int64) * (w + 1))[:, None]
    n = h * (w + 1) + 1
    hit = np.bincount(label[mask], weights=cur[mask].astype(np.float64), minlength=n) > 0
    return mask & hit[label]


def _flood(mask: np.ndarray, seed: np.ndarray) -> np.ndarray:
    """Region of `mask` reachable from `seed` under 4-connectivity."""
    cur = seed & mask
    while True:
        nxt = _propagate_rows(cur, mask)
        nxt = _propagate_rows(
            np.ascontiguousarray(nxt.T), np.ascontiguousarray(mask.T)
        ).T
        nxt = nxt | cur
        if nxt.sum() == cur.sum():
            return cur
        cur = nxt


def _erode(mask: np.ndarray, radius: int) -> np.ndarray:
    return ~_dilate(~mask, radius)


def _dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    out = mask.copy()
    for _ in range(radius):
        d = out.copy()
        d[1:, :] |= out[:-1, :]
        d[:-1, :] |= out[1:, :]
        d[:, 1:] |= out[:, :-1]
        d[:, :-1] |= out[:, 1:]
        out = d
    return out


def cut_out(path: Path) -> tuple[Image.Image, dict]:
    """Strip the background. Returns the trimmed RGBA product and a QC report."""
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = rgb.shape

    # Background colour from the four corners. The corners are the only region
    # guaranteed empty by the shooting spec.
    k = 40
    corners = np.concatenate([
        rgb[:k, :k].reshape(-1, 3), rgb[:k, -k:].reshape(-1, 3),
        rgb[-k:, :k].reshape(-1, 3), rgb[-k:, -k:].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0)

    dist = np.abs(rgb - bg).max(axis=2)

    bg_like = dist < T_HI
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = border[-1, :] = True
    border[:, 0] = border[:, -1] = True
    outside = _flood(bg_like, border)

    # Sever narrow leaks. Erode the background, keep only what the frame can still
    # reach, then regrow inside the original mask. A pocket the flood reached only
    # through a hairline gap loses its supply line and stays with the product.
    core = _flood(_erode(outside, LEAK_SEVER), border)
    if core.any():
        outside = _flood(outside, _dilate(core, LEAK_SEVER))

    # Second pass for the baked contact shadow. Anchor the band to the vessel, not
    # to the opaque mask, then let the background keep spreading into anything
    # shadow-shaped within reach of the base.
    ratio = rgb / np.maximum(bg, 1.0)
    r_min, r_max = ratio.min(axis=2), ratio.max(axis=2)
    shadow_like = (
        (r_min > SHADOW_MIN_RATIO)
        & (r_max <= SHADOW_MAX_RATIO)
        & ((r_max - r_min) < SHADOW_MAX_SPREAD)
    )
    # Genuinely coloured or genuinely dark — either way, not cream in shadow.
    vessel = (~outside) & (((r_max - r_min) > VESSEL_MIN_SPREAD) | (r_min < VESSEL_MAX_RATIO))
    v_rows = np.flatnonzero(vessel.any(axis=1))
    if len(v_rows):
        v_top, v_base = int(v_rows[0]), int(v_rows[-1])
        start = max(0, v_base - round((v_base - v_top) * SHADOW_ZONE))
        zone = np.zeros((h, w), dtype=bool)
        zone[start:, :] = True
        outside = _flood(bg_like | (shadow_like & zone), border)
        core = _flood(_erode(outside, LEAK_SEVER), border)
        if core.any():
            outside = _flood(outside, _dilate(core, LEAK_SEVER))

    # Alpha: opaque everywhere the flood didn't reach, ramped across a 2px band
    # at the boundary so the cut edge is soft rather than aliased.
    alpha = (~outside).astype(np.float32)
    ramp = np.clip((dist - T_LO) / (T_HI - T_LO), 0.0, 1.0)
    band = _dilate(outside, 2) & ~outside
    alpha[band] = ramp[band]

    # Drop stray islands — the generator's corner watermark is the reason. Seed
    # from the full column through the product's centroid: a drink is a tall
    # connected silhouette, so that seed always lands on the real subject.
    solid = alpha > 0.5
    if solid.any():
        cx = int(np.argwhere(solid)[:, 1].mean())
        seed = np.zeros((h, w), dtype=bool)
        seed[:, cx] = solid[:, cx]
        main = _flood(solid, seed)
        stray = solid & ~main
        stray_frac = stray.sum() / max(solid.sum(), 1)
        # Only ever discard specks. Anything larger is a real part of the product
        # that happens to be detached, and silently deleting it would be worse
        # than leaving a watermark in.
        if 0 < stray_frac < 0.02:
            alpha[_dilate(stray, 2)] = 0.0
    else:
        stray_frac = 0.0

    # Colour decontamination. Edge pixels are a blend of product and cream; left
    # alone they ring the cutout with a pale halo the moment it lands on a dark
    # scrim. Un-premultiply against the known background to recover the product's
    # own colour.
    # Smooth the coverage before using it. The ramp is computed per-pixel from a
    # noisy distance, and un-premultiplying against a jittery alpha is what turns
    # a clear plastic dome into black speckle.
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(0.6)
        ),
        dtype=np.float32,
    ) / 255.0

    a = alpha[..., None]
    # Only recover colour where there is enough coverage to divide by. Below the
    # floor the division amplifies sensor noise faster than it removes fringe,
    # and those pixels are nearly invisible anyway.
    edge = (alpha > DECONTAMINATE_FLOOR) & (alpha < 0.98)
    clean = rgb.copy()
    with np.errstate(divide="ignore", invalid="ignore"):
        recovered = (rgb - (1.0 - a) * bg) / np.maximum(a, 1e-3)
    clean[edge] = np.clip(recovered[edge], 0, 255)

    # Repair edge notches. Where a pale cup wall runs right up against the pale
    # background the boundary carries no contrast at all, and the flood bites a
    # chunk out of the silhouette. Closing the mask fills an indentation narrower
    # than the radius while leaving a real gap — a mug handle — alone.
    if REPAIR_CLOSE:
        solid = alpha > 0.5
        added = _erode(_dilate(solid, REPAIR_CLOSE), REPAIR_CLOSE) & ~solid
        if added.any():
            alpha[added] = 1.0
            # The bitten-out region really is pale cup wall, so its own pixels are
            # the right colour to put back. No decontamination — nothing was mixed.
            clean[added] = rgb[added]

    out = np.dstack([clean, alpha * 255.0]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")

    # Trim on solid pixels only, so any surviving wisp of the generator's own
    # soft shadow cannot drag the bounding box down and throw off the baseline.
    bbox = Image.fromarray((alpha > 0.5).astype(np.uint8) * 255, "L").getbbox()
    if bbox:
        img = img.crop(bbox)

    return img, {
        "bg": tuple(bg.astype(int)),
        "kept_pct": float(np.mean(alpha > 0.5) * 100),
        "stray_pct": float(stray_frac * 100),
        "size": img.size,
    }


def make_tile(cutout: Image.Image) -> Image.Image:
    """Place a cutout on the locked canvas geometry, with a drawn contact shadow."""
    cw, ch = cutout.size
    scale = min(
        (TILE * PRODUCT_HEIGHT) / ch,
        (TILE * MAX_WIDTH) / cw,
    )
    nw, nh = max(1, round(cw * scale)), max(1, round(ch * scale))
    product = cutout.resize((nw, nh), Image.LANCZOS)

    base_y = round(TILE * PRODUCT_BASELINE)
    top = base_y - nh
    left = round((TILE - nw) / 2)

    canvas = Image.new("RGBA", (TILE, TILE), (0, 0, 0, 0))

    shadow = Image.new("L", (TILE, TILE), 0)
    ImageDraw.Draw(shadow).ellipse(
        [
            left + nw * 0.08 + SHADOW_DX,
            base_y - nw * 0.075,
            left + nw * 0.92 + SHADOW_DX,
            base_y + nw * 0.075,
        ],
        fill=round(255 * SHADOW_OPACITY),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(SHADOW_BLUR))
    canvas.paste(Image.new("RGBA", (TILE, TILE), SHADOW_RGB + (255,)), (0, 0), shadow)

    canvas.paste(product, (left, top), product)
    return canvas


def contact_sheet(tiles: list[tuple[str, Image.Image]]) -> Image.Image:
    """Every tile at its true 96pt size, on the real card white over the app cream.

    This is the only honest test. A product shot judged at 2048 always looks
    fine; the question is whether it survives at the size it actually ships.
    """
    cell = QC_THUMB * QC_SCALE
    pad = 12 * QC_SCALE
    cols = 5
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new(
        "RGB",
        (cols * (cell + pad) + pad, rows * (cell + pad) + pad),
        SURFACE_APP,
    )
    for i, (_, tile) in enumerate(tiles):
        card = Image.new("RGB", (cell, cell), SURFACE_RAISED)
        thumb = tile.resize((cell, cell), Image.LANCZOS)
        card.paste(thumb, (0, 0), thumb)
        x = pad + (i % cols) * (cell + pad)
        y = pad + (i // cols) * (cell + pad)
        sheet.paste(card, (x, y))
    return sheet


def main() -> int:
    sources = sorted(SRC.glob("*.png"))
    if not sources:
        print(f"No PNGs in {SRC}", file=sys.stderr)
        return 1

    for d in (OUT_CUTOUT, OUT_TILE, OUT_QC):
        d.mkdir(parents=True, exist_ok=True)

    tiles: list[tuple[str, Image.Image]] = []
    for path in sources:
        cutout, report = cut_out(path)
        tile = make_tile(cutout)

        cutout.save(OUT_CUTOUT / path.name)
        tile.save(OUT_TILE / path.name)
        tiles.append((path.stem, tile))

        print(
            f"{path.stem:<32} bg=#{report['bg'][0]:02X}{report['bg'][1]:02X}"
            f"{report['bg'][2]:02X}  kept={report['kept_pct']:5.1f}%"
            f"  strays={report['stray_pct']:4.2f}%  cutout={report['size'][0]}x{report['size'][1]}"
        )

    contact_sheet(tiles).save(OUT_QC / "contact-sheet.png")
    print(f"\n{len(tiles)} processed -> {OUT_CUTOUT}, {OUT_TILE}")
    print(f"QC sheet -> {OUT_QC / 'contact-sheet.png'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
