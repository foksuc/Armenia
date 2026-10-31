"""Build a separate static preview; leave the original source files untouched."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parent.parent
out = root / 'dist'
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for name in ('index.html', 'style.css', 'script.js'):
    shutil.copy2(root / name, out / name)
shutil.copytree(root / 'v2', out / 'v2', ignore=shutil.ignore_patterns('README.md', 'build.py', 'ASSETS.md'))
