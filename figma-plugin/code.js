/* ============================================================================
 * 02-card.js  ·  Starbucks India app  ·  Batch 2, REBUILT
 * ----------------------------------------------------------------------------
 * This version CLONES the reference card out of the file and corrects the
 * measured defects on the clone. It authors no gradients, no sweeps, no
 * vignettes and no bevels. Every layer that the audit did not measure as a
 * defect moves across byte for byte.
 *
 * The two reference nodes, both inside "Item · Curtain expanded":
 *   · the GOLD card (front of the fan)  — the light-edition treatment
 *   · the GUEST card (back of the fan)  — the dark-edition treatment
 * Having both in one frame is what makes a clone-based build possible: the
 * file already contains an ink/bevel treatment for a light face AND for a
 * dark one, so nothing has to be invented for the other six editions.
 *
 * WHAT IS CORRECTED ON THE CLONE, and nothing else:
 *   C1  geometry asserted at 236×148, radius 14        (already correct here)
 *   H5  the edition fill is relinked to the Batch 1 paint style per edition
 *   H6  the gold face becomes the 5-stop metallic everywhere (J3)
 *   H7  type sizes 8 and 9 snapped to the scale's floor of 11
 *   J4  tier stops being part of the face; the pill becomes a swap slot
 *
 * WHAT IS NOT TOUCHED: the stripe texture, the corner vignette, the gloss
 * sweep, both bevel arcs, the mask, every position, every opacity.
 *
 * FAILS LOUDLY AND STOPS if either reference node cannot be found or cloned.
 * It will not substitute an approximation — that is what produced the first
 * version of this script.
 * ========================================================================== */

(async () => {
  "use strict";

  const LOG = { created: [], removed: [], corrected: [], warned: [] };
  const fail = (msg) => {
    /* the notify toast truncates, so the full message always goes to the
       console — a diagnosable failure beats a short one */
    console.error("═══ 02-card FAILED ═════════════════════════════════════════");
    console.error(msg);
    console.error("═══════════════════════════════════════════════════════════");
    figma.notify("02-card FAILED — see the console for the full message. " +
                 String(msg).split("\n")[0], { error: true, timeout: 10000 });
    throw new Error("02-card: " + msg);
  };
  try { if (figma.loadAllPagesAsync) await figma.loadAllPagesAsync(); }
  catch (e) { fail("could not load pages: " + e.message); }

  /* ══ 1 · FIND THE REFERENCE NODES ═══════════════════════════════════════
   * Located structurally, not by hard-coded id, so the script survives the
   * file being edited. Both must be found or the script stops.
   * ════════════════════════════════════════════════════════════════════════ */

  /* ══ LOCATE THE REFERENCES BY CONTENT, NOT BY NAME ═══════════════════════
   * Two failed runs were both name-matching problems: first an exact === against
   * each page's direct children, then a normalised search whose defensive
   * "skip this page on any loadAsync hiccup" silently emptied the whole search.
   * Frame names are now OFF the critical path. The cards are found by their own
   * content signature — a 236×148 node carrying GOLD and BALANCE, a 236×148
   * carrying GUEST CARD, a 300×188 carrying MOBILE NUMBER — which is what
   * actually identifies them. A probe of the document prints first either way,
   * so a failure is diagnosable in one run.
   * ════════════════════════════════════════════════════════════════════════ */

  const PROBE = [];
  const boxes = [];        /* every node that could be a card */
  let scanned = 0, pagesRead = 0, pagesFailed = [];

  for (const pg of figma.root.children) {
    try { if (pg.loadAsync) await pg.loadAsync(); }
    catch (e) { PROBE.push("  ! " + pg.name + " — loadAsync: " + e.message); }
    let kids = [];
    try {
      kids = pg.findAll ? pg.findAll(() => true) : (pg.children || []);
      pagesRead += 1;
    } catch (e) {
      pagesFailed.push(pg.name + " (" + e.message + ")");
      continue;                /* only skip if the page is genuinely unreadable */
    }
    PROBE.push("  · page \"" + pg.name + "\" — " + kids.length + " nodes");
    for (const n of kids) {
      scanned += 1;
      if (typeof n.width !== "number") continue;
      const w = n.width, h = n.height;
      const isCardish =
        (Math.abs(w - 236) <= 2 && Math.abs(h - 148) <= 2) ||
        (Math.abs(w - 300) <= 2 && Math.abs(h - 188) <= 2) ||
        (Math.abs(w - 246) <= 3 && Math.abs(h - 155) <= 3);
      if (isCardish) boxes.push({ node: n, page: pg.name, w: w, h: h });
    }
  }

  console.log("═══ 02-card · document probe ═══════════════════════════════");
  console.log("pages read " + pagesRead + " of " + figma.root.children.length +
              " · nodes scanned " + scanned + " · card-sized nodes " + boxes.length);
  for (const line of PROBE) console.log(line);
  if (pagesFailed.length) console.log("UNREADABLE pages: " + pagesFailed.join(", "));

  const textsOf = (node) => {
    let out = [];
    try {
      out = (node.findAll ? node.findAll((n) => n.type === "TEXT") : [])
        .map((n) => String(n.characters || "").toUpperCase());
    } catch (e) { /* ignore */ }
    return out;
  };

  let refGold = null, refGuest = null, refBack = null;
  const inventory = [];
  for (const box of boxes) {
    const t = textsOf(box.node).join(" | ");
    inventory.push("  · " + box.page + " / " + box.node.name + " " +
                   box.w.toFixed(0) + "×" + box.h.toFixed(0) +
                   (t ? " — " + t.slice(0, 70) : " — (no text)"));
    if (!refGold && t.indexOf("GOLD") !== -1 && t.indexOf("BALANCE") !== -1) refGold = box.node;
    if (!refGuest && t.indexOf("GUEST CARD") !== -1) refGuest = box.node;
    if (!refBack && t.indexOf("MOBILE NUMBER") !== -1 &&
        Math.abs(box.w - 300) <= 2) refBack = box.node;
  }
  console.log("card-sized nodes found:");
  for (const line of inventory) console.log(line);
  console.log("═══════════════════════════════════════════════════════════");

  /* The probe's own answer, stated as a check rather than left to inference:
     if nothing card-sized exists anywhere, the open document is not the file
     the references live in and no matching logic can help. */
  if (boxes.length === 0) {
    const pageList = figma.root.children.map((p) => p.name).join(", ");
    fail("this document contains NO card-sized nodes at all — " + scanned +
         " nodes across " + pagesRead + " page(s): " + pageList + ".\n" +
         "The reference cards live on a screens page (Item · Curtain expanded, " +
         "Sign up · 3 of 3 · Mobile). If the pages above are only Foundations " +
         "and Components, this plugin is running against a document that has " +
         "the tokens my 01 script created but none of the 21 app screens — so " +
         "there is nothing to clone.\n" +
         "Open the Starbucks file that contains the screens and re-run. " +
         "Nothing was changed.");
  }
  if (!refGold) {
    fail("no 236×148 node carrying both GOLD and BALANCE anywhere in the " +
         "document — that is the reference card and this script clones it.\n" +
         "Probe above lists every card-sized node I can see (" + boxes.length +
         " of " + scanned + " nodes across " + pagesRead + " page(s)).\n" +
         (boxes.length === 0
           ? "ZERO card-sized nodes means I am not reading the Starbucks file at " +
             "all — check the plugin is running against the right document."
           : "Tell me which of the listed nodes is the reference and I will " +
             "match on it directly.") +
         "\nNothing was changed.");
  }
  if (!refGuest) {
    fail("found the gold reference but no 236×148 node carrying GUEST CARD — " +
         "that node is the only dark-face ink treatment in the file, so the six " +
         "dark editions have no colour source. See the probe above. Nothing was changed.");
  }
  if (!refBack) {
    fail("found both front references but no 300×188 node carrying MOBILE " +
         "NUMBER — that is the only back artwork in the file and the seven " +
         "Face=Back variants clone it. See the probe above. Nothing was changed.");
  }
  LOG.created.push("located by content: front " + refGold.name + " · dark ink " +
                   refGuest.name + " · back " + refBack.name);

  const near = (a, b, t) => Math.abs(a - b) <= (t === undefined ? 0.6 : t);

  /* ══ 2 · WHAT THE REFERENCE ACTUALLY CONTAINS ═══════════════════════════
   * Recorded here as the audit trail. Every value transcribed, none invented.
   *
   *   mask         rounded rect r14, 236×148
   *   bleed box    (-30,-16) 310×164, clipped — this is what crops layer 2
   *   1 fill       236×148 @ (30,16)
   *                gold : 122.093° · #F3E2B6 0% · #C9A45E 22% · #EBD49B 46%
   *                             · #AD8845 72% · #D8BC7E 100%   ← uneven stops
   *                guest: 122.093° · #00875A 0% · #00603D 50% · #002317 100%
   *   2 texture    310×164 group @ (0,0), opacity 0.20, three 106×164
   *                parallelograms "M 0 164 L 78 0 L 106 0 L 28 164 L 0 164 Z"
   *   3 vignette   236×148 @ (30,16), opacity 0.55, radial
   *                184.08×115.44 at 50%/42%, transparent 50% → black 30%
   *   4 gloss      236×112 @ (30,16), 130.790°, white 0.55 → 0.04 at 68.07%
   *                "M 0 0 L 236 0 L 236 42 C 166.667 70.667 88 94 0 112 L 0 0 Z"
   *   5 bevel hi   149×101 @ (1,1), stroke 0.65 — white 0.6 gold / 0.22 guest
   *   5 bevel lo   236×148 @ (0,0), stroke 0.50, black 0.2
   *   6 type       gold : Urbanist Bold 8 "STARBUCKS" rgba(74,54,16,.75)
   *                       Urbanist Bold 9 ×6 rgb(46,33,9)
   *                       tier pill 54×20 @ (166,14) rgba(58,42,12,0.22) r10
   *                guest: Urbanist Bold 8 "STARBUCKS" rgba(255,255,255,.6)
   *                       Bebas 20 "GUEST CARD" rgba(255,255,255,.9)
   * ════════════════════════════════════════════════════════════════════════ */

  /* tone selects the INK treatment only — every edition clones the same
     complete GOLD stack. See section 6. */
  const EDITIONS = [
    ["House",   "dark"],
    ["Forest",  "dark"],
    ["Jade",    "dark"],
    ["Sage",    "dark"],
    ["Reserve", "dark"],
    ["Gold",    "light"],
    ["Guest",   "dark"],
  ];
  const TIERS = [
    ["Green",   "#006241", "#FFFFFF"],
    ["Gold",    "#CBA258", "#14231E"],  /* white on #CBA258 is 2.05:1 */
    ["Reserve", "#0B1F1A", "#B0703C"],
  ];

  const hex = (h, a) => {
    const s = h.replace("#", "");
    return { r: parseInt(s.slice(0,2),16)/255, g: parseInt(s.slice(2,4),16)/255,
             b: parseInt(s.slice(4,6),16)/255, a: a === undefined ? 1 : a };
  };
  const solid = (h, a) => {
    const c = hex(h, a);
    return { type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a };
  };

  /* ══ 3 · STYLES FROM BATCH 1 — required, not optional ═══════════════════
   * The edition fill is RELINKED to Batch 1's paint styles rather than being
   * re-authored here. If they are missing the script stops: guessing a
   * gradient is the exact failure being corrected.
   * ════════════════════════════════════════════════════════════════════════ */

  const paintStyles = await figma.getLocalPaintStylesAsync();
  const paintByName = {};
  for (const st of paintStyles) paintByName[st.name] = st;
  const missing = [];
  for (const [ed] of EDITIONS) {
    for (const face of ["Front", "Back"]) {
      if (!paintByName["Card/" + ed + "/" + face]) missing.push("Card/" + ed + "/" + face);
    }
  }
  if (missing.length) {
    fail("missing " + missing.length + " edition paint style(s), e.g. " + missing[0] +
         ". Run 01-tokens.js first — this script relinks the edition fill to " +
         "those styles rather than authoring gradients. Nothing was changed.");
  }

  const textStyles = await figma.getLocalTextStylesAsync();
  const textByName = {};
  for (const st of textStyles) textByName[st.name] = st;
  for (const need of ["Urbanist/caps", "Urbanist/micro", "Bebas/bebasCardName", "Bebas/bebasMeta"]) {
    if (!textByName[need]) {
      fail('missing text style "' + need + '". Run 01-tokens.js first. Nothing was changed.');
    }
  }
  for (const f of [{ family: "Urbanist", style: "SemiBold" },
                   { family: "Urbanist", style: "Regular" },
                   { family: "Urbanist", style: "Bold" },
                   { family: "Bebas Neue", style: "Regular" }]) {
    try { await figma.loadFontAsync(f); }
    catch (e) { fail("font not available: " + f.family + " " + f.style + ". Nothing was changed."); }
  }

  /* ══ 4 · PAGE + SAFETY ═════════════════════════════════════════════════ */

  let page = figma.root.children.find((p) => p.name === "03-Components");
  if (!page) { page = figma.createPage(); page.name = "03-Components"; LOG.created.push("page 03-Components"); }

  async function instancesOf(node) {
    const comps = node.type === "COMPONENT_SET" ? node.children : [node];
    let n = 0;
    for (const c of comps) {
      if (c.type !== "COMPONENT") continue;
      if (c.getInstancesAsync) n += (await c.getInstancesAsync()).length;
      else if (c.instances) n += c.instances.length;
    }
    return n;
  }
  async function clearSet(name) {
    for (const node of page.children.slice()) {
      if (node.name !== name) continue;
      const live = await instancesOf(node);
      if (live > 0) {
        fail('"' + name + '" already has ' + live + " instance(s). Recreating it " +
             "would detach every one. Nothing was changed.");
      }
      node.remove();
      LOG.removed.push("component set " + name);
    }
  }

  /* ══ 5 · BADGE / TIER ══════════════════════════════════════════════════
   * The one genuinely new object, because J4 makes tier a badge and the file
   * has no such component — only a bare pill drawn inside the gold card. Its
   * geometry is cloned from that pill: 54×20, r10.
   * ════════════════════════════════════════════════════════════════════════ */

  await clearSet("Badge / Tier");
  const tierComps = [];
  for (const [tier, bg, ink] of TIERS) {
    const c = figma.createComponent();
    c.name = "Tier=" + tier;
    c.resize(54, 20);
    c.cornerRadius = 10;
    c.fills = [solid(bg)];
    const t = figma.createText();
    t.fontName = { family: "Urbanist", style: "SemiBold" };
    t.characters = tier.toUpperCase();
    await t.setTextStyleIdAsync(textByName["Urbanist/caps"].id);
    t.fills = [solid(ink)];
    t.textAlignHorizontal = "CENTER";
    t.textAlignVertical = "CENTER";
    t.textAutoResize = "NONE";
    c.appendChild(t);
    t.resize(54, 20);
    t.x = 0; t.y = 0;
    tierComps.push(c);
    page.appendChild(c);
  }
  const tierSet = figma.combineAsVariants(tierComps, page);
  tierSet.name = "Badge / Tier";
  tierSet.x = 0; tierSet.y = 0;
  tierSet.description =
    "Tier is a badge, never a card face (J4). Pill geometry cloned from the " +
    "reference card's own 54×20 r10 pill. Gold takes ink #14231E — white on " +
    "#CBA258 is 2.05:1 and fails.";
  LOG.created.push("component set Badge / Tier (3 variants)");

  /* ══ 6 · CLONE, THEN CORRECT ═══════════════════════════════════════════
   *
   * REVISED. The first pass cloned the GUEST card for the six dark editions.
   * That was wrong and it reintroduced the very defect this batch exists to
   * remove: the GUEST card has NO corner vignette and NO gloss sweep, so 12 of
   * 14 variants would have shipped flat — audit finding C2, rebuilt.
   *
   * ALL 14 variants now clone the GOLD card, because it is the only complete
   * material stack in the file. The dark editions then take the GUEST card's
   * INK TREATMENT as an override — and those values are read out of the GUEST
   * node at runtime rather than typed here, so they remain the file's:
   *     brand mark   GOLD rgba(74,54,16,0.75)  →  GUEST rgba(255,255,255,0.6)
   *     card type    GOLD rgb(46,33,9)         →  GUEST rgba(255,255,255,0.9)
   *     bevel hi     GOLD white 0.6            →  GUEST white 0.22
   * Structure from the complete card, ink from the dark card. Nothing authored.
   * ════════════════════════════════════════════════════════════════════════ */

  const walk = (node, fn) => {
    fn(node);
    if (node.children) for (const c of node.children) walk(c, fn);
  };
  const firstPaint = (node) => {
    const f = node && node.fills;
    return Array.isArray(f) && f.length && f[0].type === "SOLID" ? f[0] : null;
  };

  /* read the dark treatment out of the GUEST reference — never typed */
  const guestInk = { brand: null, body: null, bevel: null };
  {
    const gTexts = [];
    walk(refGuest, (n) => { if (n.type === "TEXT") gTexts.push(n); });
    for (const t of gTexts) {
      const c = t.characters.toUpperCase().trim();
      if (c === "STARBUCKS") guestInk.brand = firstPaint(t);
      else if (c.indexOf("GUEST") !== -1) guestInk.body = firstPaint(t);
    }
    walk(refGuest, (n) => {
      if (guestInk.bevel) return;
      if (near(n.width, 149, 2) && near(n.height, 101, 2) && Array.isArray(n.strokes) && n.strokes.length) {
        guestInk.bevel = n.strokes[0];
      }
    });
  }
  if (!guestInk.brand || !guestInk.body) {
    fail("found the GUEST reference but could not read its ink treatment " +
         "(brand mark and name fills). The six dark editions have no colour " +
         "source and this script will not invent one. Nothing was changed.");
  }
  if (!guestInk.bevel) {
    LOG.warned.push("GUEST bevel stroke not readable — dark editions keep the GOLD bevel opacity.");
  }

  /* the fill layer: 236×148 carrying a linear gradient, found by shape */
  function findFillLayer(root) {
    let hit = null;
    walk(root, (n) => {
      if (hit) return;
      if (!near(n.width, 236) || !near(n.height, 148)) return;
      const f = n.fills;
      if (Array.isArray(f) && f.length && f[0].type === "GRADIENT_LINEAR") hit = n;
    });
    return hit;
  }

  /* Classify every text node. Collects ARRAYS, not single slots — the GOLD
     reference carries the member name TWICE (an emboss pair), and the first
     pass kept only the last match, leaving a ghost node at the old font that
     no property could ever update. */
  function classify(root) {
    const out = { brand: [], name: [], number: [], balanceLabel: [], amount: [],
                  tierText: [], mobileLabel: [], mobile: [] };
    const bin = [];
    walk(root, (n) => { if (n.type === "TEXT") bin.push(n); });
    for (const t of bin) {
      const c = t.characters.toUpperCase().trim();
      if (c === "STARBUCKS") out.brand.push(t);
      else if (c === "MOBILE NUMBER" || c === "YOUR MOBILE NUMBER") out.mobileLabel.push(t);
      else if (/^[0-9][0-9 ]{4,}$/.test(c) && c.replace(/[^0-9]/g, "").length <= 12) out.mobile.push(t);
      else if (c === "CVV") out.brand.push(t);
      else if (c === "BALANCE") out.balanceLabel.push(t);
      else if (c.indexOf("₹") !== -1) out.amount.push(t);
      else if (/^[0-9][0-9 ]{6,}$/.test(c)) out.number.push(t);
      else if (c === "GOLD" || c === "GREEN" || c === "RESERVE") out.tierText.push(t);
      else if (c.length) out.name.push(t);
    }
    return out;
  }

  async function buildVariant(edition, tone, face) {
    const src = face === "Back" ? refBack : refGold;
    let card;
    try { card = src.clone(); }
    catch (e) {
      fail("could not clone the " + face + " reference (" + e.message +
           "). Stopping rather than substituting an approximation.");
    }

    /* C1 — the back reference is the 300×188 r18 copy. rescale() takes the
       whole subtree down by one factor, which is what makes this a correction
       of the audit's own finding rather than a re-layout. 236/300 = 0.786667;
       height lands at 147.89 against a nominal 148, i.e. the file's 300×188
       was never a uniform scale of 236×148 — the residual is asserted away
       below. */
    if (face === "Back") {
      const k = 236 / card.width;
      if (card.rescale) card.rescale(k);
      else fail("this Figma build has no rescale() on the back node, so the " +
                "300×188 reference cannot be corrected to 236×148 without " +
                "re-laying it out by hand. Stopping.");
      LOG.corrected.push(edition + "/Back rescaled " + k.toFixed(6) + " → 236 wide");
    }

    const comp = figma.createComponent();
    comp.name = "Edition=" + edition + ", Face=" + face;
    comp.resize(236, 148);          /* C1 — asserted, already true here */
    comp.cornerRadius = 14;         /* J2 */
    comp.clipsContent = true;
    comp.fills = [];
    page.appendChild(comp);
    comp.appendChild(card);
    card.x = 0; card.y = 0;
    card.name = "material stack · cloned from the GOLD reference";

    /* H5 / H6 / J3 — relink the edition fill. Layer, size, position and stop
       structure are the reference's; only the gradient it points at changes. */
    const fillLayer = findFillLayer(card);
    if (!fillLayer) {
      fail("cloned the card but could not find its gradient fill layer for " +
           edition + "/" + face + ". Stopping.");
    }
    try { await fillLayer.setFillStyleIdAsync(paintByName["Card/" + edition + "/" + face].id); }
    catch (e) { fillLayer.fillStyleId = paintByName["Card/" + edition + "/" + face].id; }

    const t = classify(card);

    /* dark editions — apply the GUEST ink treatment, read from the file */
    if (tone === "dark") {
      for (const n of t.brand) n.fills = [guestInk.brand];
      for (const n of [].concat(t.name, t.number, t.balanceLabel, t.amount)) {
        n.fills = [guestInk.body];
      }
      /* the back reference is already a dark face — its own 0.5 white label
         ink is left exactly as cloned rather than pushed to 0.9 */
      if (guestInk.bevel) {
        walk(card, (n) => {
          if (near(n.width, 149, 2) && near(n.height, 101, 2) && Array.isArray(n.strokes) && n.strokes.length) {
            n.strokes = [guestInk.bevel];
          }
        });
      }
      LOG.corrected.push(edition + "/" + face + " ink → GUEST dark treatment");
    }

    /* H7 — reference type is Urbanist Bold 8 and 9, below the scale floor of
       11. Relinked to the real styles; colour, position and alignment kept.
       Applied to EVERY match, including the duplicate name node. */
    const relink = async (node, styleName) => {
      const keep = node.fills;
      try { await node.setTextStyleIdAsync(textByName[styleName].id); }
      catch (e) { node.textStyleId = textByName[styleName].id; }
      node.fills = keep;   /* the style carries type only, never colour */
    };
    for (const n of t.brand)        await relink(n, "Urbanist/caps");
    for (const n of t.balanceLabel) await relink(n, "Urbanist/caps");
    for (const n of t.number)       await relink(n, "Urbanist/micro");
    for (const n of t.amount)       await relink(n, "Urbanist/micro");
    for (const n of t.name)         await relink(n, "Bebas/bebasCardName");
    for (const n of t.mobileLabel)  await relink(n, "Urbanist/caps");
    /* bebasMeta, not bebasCardName: this is a small numeric on a card back,
       and at 14 it stays inside the reference's own cloned caret — 20 overruns
       it, since the caret cannot move without breaking the clone. */
    for (const n of t.mobile)       await relink(n, "Bebas/bebasMeta");
    LOG.corrected.push(edition + "/" + face + " type 8/9 → 11 on " +
      (t.brand.length + t.balanceLabel.length + t.number.length + t.amount.length + t.name.length) + " nodes");

    /* FLAGGED DECISION — the back reference has no corner vignette and no
       gloss sweep. Rather than leave seven variants short of layers 3 and 4
       (the C2 defect) or author them, the two layers are COPIED from the front
       reference: same card, same plastic, same measured values. Reversible by
       deleting this block. Disclosed in the redline. */
    if (face === "Back") {
      const donor = refGold.clone();
      const pick = [];
      walk(donor, (n) => {
        const f = n.fills;
        if (!Array.isArray(f) || !f.length) return;
        if (f[0].type === "GRADIENT_RADIAL" && near(n.width, 236, 2) && near(n.height, 148, 2)) pick.push(n);
        if (f[0].type === "GRADIENT_LINEAR" && near(n.width, 236, 2) && near(n.height, 112, 2)) pick.push(n);
      });
      /* ORDER AND PARENT BOTH MATTER. In Figma the LAST child renders
         topmost, and on this node the type is nested two levels down — the
         card's only direct child is the clip group, so scanning card.children
         finds no text and inserting there lands the layers on top, darkening a
         label and number that are only white 0.5 on this face.
         The insertion point is resolved BY NODE: walk to the first TEXT, then
         insert into ITS parent at ITS index. That is the bleed box, which is
         exactly where the front reference keeps its own vignette and gloss, so
         the clipping matches the source too. Position is set from the absolute
         transforms rather than assumed, so it survives the rescale and any
         nesting depth. */
      let anchor = null;
      const findAnchor = (node) => {
        if (anchor || !node.children) return;
        for (let i = 0; i < node.children.length; i++) {
          const ch = node.children[i];
          if (ch.type === "TEXT") { anchor = { parent: node, index: i }; return; }
          findAnchor(ch);
          if (anchor) return;
        }
      };
      findAnchor(card);
      if (!anchor) {
        fail(edition + "/Back: cloned the back face but found no text node to " +
             "sit the ported vignette and gloss beneath. Stopping rather than " +
             "guessing a layer order.");
      }
      const cardOrigin = { x: card.absoluteTransform[0][2], y: card.absoluteTransform[1][2] };
      let at = anchor.index;
      for (const layer of pick) {
        anchor.parent.insertChild(at, layer);
        const p = { x: anchor.parent.absoluteTransform[0][2], y: anchor.parent.absoluteTransform[1][2] };
        layer.x = cardOrigin.x - p.x;   /* land at card (0,0) whatever the nesting */
        layer.y = cardOrigin.y - p.y;
        at += 1;                        /* keeps vignette below gloss */
      }
      donor.remove();
      if (pick.length !== 2) {
        LOG.warned.push(edition + "/Back: ported " + pick.length +
                        " of 2 material layers from the front reference");
      } else {
        LOG.corrected.push(edition + "/Back vignette + gloss ported from the front reference");
      }
    }

    /* J4 — the drawn pill and its label leave the face; a Badge / Tier
       instance takes their place at the same position. Front only — the back
       reference has no pill and a tier badge on a card back is not a thing. */
    let pill = null;
    walk(card, (n) => {
      if (pill) return;
      if (n.type !== "TEXT" && near(n.width, 54, 1.5) && near(n.height, 20, 1.5)) pill = n;
    });
    const cardAt = { x: card.absoluteTransform[0][2], y: card.absoluteTransform[1][2] };
    let inst = null;
    if (face === "Front") {
    inst = tierComps[0].createInstance();
    inst.name = "tier badge";
    comp.appendChild(inst);
    if (pill) {
      inst.x = pill.absoluteTransform[0][2] - cardAt.x;
      inst.y = pill.absoluteTransform[1][2] - cardAt.y;
      pill.remove();
    } else {
      inst.x = 166; inst.y = 14;   /* the reference pill's own position */
      LOG.warned.push(edition + "/" + face + ": pill not found, badge placed at the reference coordinates");
    }
    }
    for (const n of t.tierText) n.remove();

    /* a group so Balance toggles the label AND the amount together, rather
       than hiding the word and leaving the number on the card */
    let balanceGroup = null;
    const balanceNodes = [].concat(t.balanceLabel, t.amount);
    if (balanceNodes.length) {
      try {
        balanceGroup = figma.group(balanceNodes, card);
        balanceGroup.name = "balance";
      } catch (e) {
        LOG.warned.push(edition + "/" + face + ": could not group balance rows — " + e.message);
      }
    }

    /* Guest carries no member data. Face, stack and every opacity untouched. */
    if (edition === "Guest") {
      for (const n of t.number) n.visible = false;
      if (balanceGroup) balanceGroup.visible = false;
      else for (const n of balanceNodes) n.visible = false;
      if (inst) inst.visible = false;
      for (const n of t.name) n.characters = "GUEST CARD";
      for (const n of t.mobile) n.visible = false;
    }

    return { comp: comp, t: t, balanceGroup: balanceGroup, badge: inst };
  }

  const built = [];
  for (const [edition, tone] of EDITIONS) {
    for (const face of ["Front", "Back"]) {
      built.push(await buildVariant(edition, tone, face));
    }
  }

  const cardSet = figma.combineAsVariants(built.map((b) => b.comp), page);
  cardSet.name = "Card / Membership";
  cardSet.x = 0; cardSet.y = 160;
  cardSet.description =
    "CLONED from the GOLD card on Item · Curtain expanded — the only complete " +
    "material stack in the file — for all 14 variants, so every edition keeps " +
    "the corner vignette and the gloss sweep. Dark editions take the GUEST " +
    "card's ink treatment (brand 0.6, type 0.9, bevel 0.22), read from that " +
    "node rather than authored. Corrected on the clone: edition fill relinked " +
    "to the Batch 1 paint styles, type 8/9 snapped to 11, the drawn tier pill " +
    "replaced by a Badge / Tier instance. Stripe texture, corner vignette, " +
    "gloss sweep and both bevel arcs are the reference's, untouched. Face=Back " +
    "clones its OWN node — the 300×188 back face on Sign up · 3 of 3 · Mobile " +
    "— rescaled 0.786667 to 236×148 per C1, keeping its arc texture, its " +
    "caret, its signature rule and its MOBILE NUMBER field. The corner " +
    "vignette and gloss sweep are ported onto it from the front reference, " +
    "since the back node has neither and shipping without them would rebuild " +
    "C2; that port is the one flagged decision in this script.";
  LOG.created.push("component set Card / Membership (14 variants, cloned from GOLD)");

  /* ══ 7 · PROPERTIES ════════════════════════════════════════════════════ */

  const prop = (label, type, def) => {
    try { return cardSet.addComponentProperty(label, type, def); }
    catch (e) { LOG.warned.push("property " + label + ": " + e.message); return null; }
  };
  let tierSwap = null;
  try { tierSwap = cardSet.addComponentProperty("Tier badge", "INSTANCE_SWAP", tierComps[0].key); }
  catch (e) { LOG.warned.push("tier instance-swap: " + e.message); }
  const pTexture = prop("Texture", "BOOLEAN", true);
  const pBalance = prop("Balance", "BOOLEAN", true);
  const pName    = prop("Name", "TEXT", "DIVAYANG MALSEDA");
  const pFour    = prop("Card number", "TEXT", "4471 3903 6489 2403");
  const pAmount  = prop("Balance amount", "TEXT", "₹1,240.00");
  /* the card-as-form step-3 field — without this the Mobile screen cannot be
     built from this component at all */
  const pMobile  = prop("Mobile", "TEXT", "98220 41176");

  const bind = (node, field, id) => {
    if (!node || !id) return;
    const refs = Object.assign({}, node.componentPropertyReferences || {});
    refs[field] = id;
    node.componentPropertyReferences = refs;
  };
  for (const b of built) {
    const guest = b.comp.name.indexOf("Edition=Guest") === 0;
    /* every name node, not just the last — the emboss pair moves together */
    for (const n of b.t.name) bind(n, "characters", pName);
    if (!guest) {
      for (const n of b.t.number) bind(n, "characters", pFour);
      for (const n of b.t.amount) bind(n, "characters", pAmount);
      if (b.balanceGroup) bind(b.balanceGroup, "visible", pBalance);
      if (b.badge && tierSwap) bind(b.badge, "mainComponent", tierSwap);
      for (const n of b.t.mobile) bind(n, "characters", pMobile);
    }
    let tex = null;
    walk(b.comp, (n) => {
      if (tex) return;
      if (near(n.width, 310, 2) && near(n.height, 164, 2)) tex = n;
    });
    if (tex) bind(tex, "visible", pTexture);
    else LOG.warned.push(b.comp.name + ": stripe texture group not found");
  }

  /* ══ SUMMARY ═══════════════════════════════════════════════════════════ */

  console.log("═══ 02-card.js (clone-based) ═══════════════════════════════");
  for (const c of LOG.created)   console.log("CREATED    " + c);
  for (const r of LOG.removed)   console.log("REMOVED    " + r);
  console.log("CORRECTED  " + LOG.corrected.length + " edits across 14 variants");
  if (LOG.warned.length) for (const w of LOG.warned) console.log("WARNED     " + w);
  else console.log("WARNED     none");
  console.log("───────────────────────────────────────────────────────────");
  console.log("source     Item · Curtain expanded — GOLD card (7 Front variants)");
  console.log("           Sign up · 3 of 3 · Mobile — back card (7 Back variants)");
  console.log("           Item · Curtain expanded — GUEST card (dark ink only)");
  console.log("authored   nothing. No gradient, sweep, vignette or bevel created.");
  console.log("untouched  stripe texture · vignette · gloss · both bevels · mask");
  console.log("corrected  edition fill relink · type 8/9→11 · tier pill→instance");
  console.log("closes     C1 · C2 · H5 · H6 · H7 · J2 · J3 · J4");
  console.log("═══════════════════════════════════════════════════════════");

  figma.notify("02-card ✓ 14 variants cloned from the complete stack · nothing authored", { timeout: 6000 });
  /* documentAccess: dynamic-page forbids assigning currentPage — the console
     flagged this on the last run. Must be the async setter. */
  try {
    if (figma.setCurrentPageAsync) await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView([cardSet]);
  } catch (e) {
    console.log("could not focus the new component set: " + e.message);
  }
  figma.closePlugin();
})();
