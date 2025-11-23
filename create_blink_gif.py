#!/usr/bin/env python3
from PIL import Image
import os

# Paths
open_eyes = 'public/images/image1.jpg'
closed_eyes = 'public/images/image2.jpg'
output_gif = 'public/images/blink.gif'

# Load images
img_open = Image.open(open_eyes)
img_closed = Image.open(closed_eyes)

# Create click-optimized blinking sequence
# Pattern starts with a blink for instant click feedback:
# - Double blink FIRST (immediate feedback when clicked/restarted)
# - Long pause (4s)
# - Single blink
# - Medium pause (3s)
# - Eyes open (2s)
# Total: ~9.5 seconds per loop

frames = []
durations = []

# 1. START WITH DOUBLE BLINK (instant click feedback!)
frames.append(img_closed)
durations.append(70)
frames.append(img_open)
durations.append(100)
frames.append(img_closed)
durations.append(70)
frames.append(img_open)
durations.append(150)

# 2. Long pause - eyes open (4 seconds)
frames.append(img_open)
durations.append(4000)

# 3. Single blink
frames.append(img_closed)
durations.append(70)
frames.append(img_open)
durations.append(150)

# 4. Medium pause - eyes open (3 seconds)
frames.append(img_open)
durations.append(3000)

# 5. Final pause before loop (2 seconds)
frames.append(img_open)
durations.append(2000)

# Save as interlaced animated GIF for progressive loading
frames[0].save(
    output_gif,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,  # Loop forever
    optimize=True,
    interlace=True,  # Enable interlacing for progressive loading
    quality=85  # Good quality while keeping file size reasonable
)

file_size = os.path.getsize(output_gif) / (1024 * 1024)  # Convert to MB

print(f"✅ Click-optimized interlaced GIF created successfully: {output_gif}")
print(f"   Frames: {len(frames)}")
print(f"   Total duration per loop: {sum(durations)}ms (~{sum(durations)/1000:.1f}s)")
print(f"   File size: {file_size:.2f}MB")
print(f"   Interlaced: Yes (progressive loading enabled)")
print(f"   Pattern: STARTS with double blink → pause → single blink → pause")
print(f"   Click behavior: Immediate blink feedback!")
