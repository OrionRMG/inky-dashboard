from inky.auto import auto
from PIL import Image
import sys

image_path = sys.argv[1]  # passed in from Node

inky_display = auto()
img = Image.open(image_path)
inky_display.set_image(img)
inky_display.show()