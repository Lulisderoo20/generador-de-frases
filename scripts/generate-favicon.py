from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
source = ROOT / "assets" / "icon-512.png"
target = ROOT / "assets" / "favicon.ico"

image = Image.open(source).convert("RGBA")
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
image.save(target, format="ICO", sizes=sizes)

print(target)
