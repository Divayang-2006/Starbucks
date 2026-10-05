# Running the Claude Design batch scripts in Figma

These are **Figma Plugin API** scripts. Figma has no paste-and-run console, so they
need a plugin to run inside. This folder is that plugin — set it up once, then swap
a new batch into it whenever Claude Design issues one.

**You need the Figma desktop app.** The browser version cannot import a local
plugin manifest. Everything below assumes desktop.

---

## One-time setup (about two minutes)

1. Open the Figma desktop app and open your Starbucks file.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Choose `figma-plugin/manifest.json` from this repo.

It now appears under **Plugins → Development → Starbucks DS Batch Runner**, for
every file, permanently. You never repeat this.

Open the log window too — the scripts print a detailed summary you will want:
**Plugins → Development → Open console.**

---

## Running a batch

### 1. Save a restore point. Do this every time.

**Menu → File → Save to version history…** and name it `before 01-tokens`.

These scripts rewrite variables, styles and frames. Ctrl+Z usually undoes a plugin
run in one step, but a named version is the thing that actually saves you when a
script half-applies. Ten seconds, every batch.

### 2. Load the batch

Absolute path, so it works from whatever directory your terminal happens to be in:

```bash
powershell -File "C:\Users\divay\OneDrive\Desktop\Starbucks\figma-plugin\load-batch.ps1" 01
```

It takes the newest `01-*.js` from your Downloads folder and copies it over
`figma-plugin/code.js`. Newest matters — Claude Design re-issues revised copies
under the same filename, and you have already had two revisions of 01 and two of 03.

Point it elsewhere if your downloads live somewhere else:

```bash
powershell -File "C:\Users\divay\OneDrive\Desktop\Starbucks\figma-plugin\load-batch.ps1" 03 -From "D:\downloads"
```

A relative path only works if you have already `cd`-ed into the repo:

```bash
cd "C:\Users\divay\OneDrive\Desktop\Starbucks"
```

### 3. Run it

In Figma: **Plugins → Development → Starbucks DS Batch Runner**.

Watch the console. Each script ends with a summary — what it created, updated,
removed, and which audit findings it closes. If something fails, these scripts are
written to fail loudly with a message rather than half-apply, and the message tells
you what broke.

The scripts deliberately leave the plugin open so you can run the next one without
reopening. Press **Esc** to close it when you are done.

### 4. Look at what changed

Batch 1 creates a page called `01-Foundations` with two boards. Later batches touch
the components page and the screens. Check the new pages first — the console
summary tells you which ones moved.

---

## The SVG files that ship alongside

The scripts inline the vector data they need, because a plugin cannot read files off
your disk. Any `.svg` shipped next to a script is a **reference copy** for you, or
something to drag into Figma by hand.

If a batch ever fails saying it cannot find an asset, that is a bug — the fix is to
ask Claude Design to inline the path data rather than reference a file.

---

## Order, and what depends on what

Run them in order the first time. Each is independently re-runnable afterwards.

| Batch | Creates | Safe to re-run |
|---|---|---|
| `01-tokens` | Variable collections, text/effect/paint styles, both Foundations boards | Yes — variables update in place, boards are rebuilt |
| `02-card` | The membership card component, 14 variants, Badge / Tier | Yes |
| `03-curtain` | The Curtain header, 6 variants, the awning mask | Yes |
| `04-components` | Tab bar, product tile, list row, chip, and the rest | Yes |
| `05-screens` | Swaps all 31 cards and 14 headers to instances, applies the sweeps, rebuilds Map | Yes, but this is the one to version-save before |

Batch 1 must run before 2–5, because everything after it binds to the styles and
variables it creates. If you run 02 on a file with no tokens, it will either fail or
build unbound.

---

## Reviewing, and asking for changes

Two ways to close the loop, and the second is better.

**Screenshot back.** Select a frame, export as PNG, paste it into the Claude Design
chat with what you want changed. Fine for "this looks wrong".

**Have the file read directly.** Start your Figma MCP bridge, give Claude Code the
channel id, and it can read every node and measure real values — the same way the
audit was produced. That catches things a screenshot cannot: a chip that looks
selected but is bound to the wrong variable, geometry off by a pixel, a style that
was set as a raw fill rather than a style reference. Given that the whole point of
this phase is that the file could not be trusted as a spec, verifying by measurement
rather than by eye is worth the extra step.

---

## If something goes wrong

**Plugin does not appear in the menu** — you imported the manifest into a different
Figma account or the desktop app was reinstalled. Re-import.

**"font not available: Urbanist SemiBold"** — the script checks fonts before writing
anything, so nothing was changed. Urbanist, Instrument Serif and Bebas Neue are all
Google Fonts and Figma should supply them automatically; if it does not, install
them locally and restart the desktop app.

**A script throws partway** — restore your named version, then send the exact console
error to Claude Design. The scripts are numbered and independently runnable
specifically so one failure costs you one batch, not the set.

**The boards render as a stack of thin slivers** — that is the `resize()` sizing-mode
bug. It was reported fixed in the patched 01; if you see it, you are running an old
copy. Re-download and re-run `load-batch.ps1 01`.
