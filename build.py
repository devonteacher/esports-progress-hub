#!/usr/bin/env python3
"""
Build a single self-contained HTML file from the multi-file source.

Inlines styles.css and the three JS files (in load order) into one file at
dist/esports-progress-hub.html — handy for handing out on Teams, a USB stick,
or anywhere it needs to run offline with no other files.

Usage:  python3 build.py
"""
from pathlib import Path

root = Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "assets/css/styles.css").read_text(encoding="utf-8")
data = (root / "assets/js/data.js").read_text(encoding="utf-8")
filegen = (root / "assets/js/filegen.js").read_text(encoding="utf-8")
app = (root / "assets/js/app.js").read_text(encoding="utf-8")

html = html.replace('<link rel="stylesheet" href="assets/css/styles.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="assets/js/data.js"></script>', f"<script>\n{data}\n</script>")
html = html.replace('<script src="assets/js/filegen.js"></script>', f"<script>\n{filegen}\n</script>")
html = html.replace('<script src="assets/js/app.js"></script>', f"<script>\n{app}\n</script>")

out = root / "dist" / "esports-progress-hub.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"Built {out} ({len(html):,} bytes)")
