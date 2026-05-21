#!/usr/bin/env python3
"""
Bades Brand Asset Generator
Generates all brand assets from bd.svg source
"""

import os
import subprocess
import shutil
from pathlib import Path

# Source logo
SOURCE_SVG = Path(__file__).parent / "bd.svg"
OUTPUT_DIR = Path(__file__).parent / "packages" / "front" / "public"

# Sizes needed
SIZES = {
    "favicon": 32,
    "app-icon": 192,
    "app-icon-512": 512,
    "logo-bar": 120,
}

def ensure_dir(path):
    path.mkdir(parents=True, exist_ok=True)

def generate_png_from_svg(svg_path, output_path, size):
    """Generate PNG from SVG using rsvg-convert or ImageMagick"""
    if not svg_path.exists():
        print(f"Source SVG not found: {svg_path}")
        return False

    ensure_dir(output_path.parent)

    # Try rsvg-convert first (better quality)
    try:
        subprocess.run([
            "rsvg-convert",
            "-w", str(size),
            "-h", str(size),
            str(svg_path),
            "-o", str(output_path)
        ], check=True, capture_output=True)
        print(f"Generated: {output_path}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # Fallback to ImageMagick
    try:
        subprocess.run([
            "magick", "convert",
            "-background", "none",
            "-resize", f"{size}x{size}",
            str(svg_path),
            str(output_path)
        ], check=True, capture_output=True)
        print(f"Generated: {output_path}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"Warning: Could not generate {output_path} - no SVG converter found")
        return False

def copy_svg_as_is(src, dst):
    """Copy SVG directly"""
    ensure_dir(dst.parent)
    shutil.copy2(src, dst)
    print(f"Copied: {dst}")

def main():
    if not SOURCE_SVG.exists():
        print(f"Error: Source SVG not found at {SOURCE_SVG}")
        return 1

    print(f"Generating Bades brand assets from {SOURCE_SVG}")
    print(f"Output directory: {OUTPUT_DIR}")

    # Create output directories
    ensure_dir(OUTPUT_DIR / "images")
    ensure_dir(OUTPUT_DIR / "images" / "integrations")
    ensure_dir(OUTPUT_DIR / "images" / "logo")

    # Copy main SVG
    copy_svg_as_is(SOURCE_SVG, OUTPUT_DIR / "bd.svg")
    copy_svg_as_is(SOURCE_SVG, OUTPUT_DIR / "favicon.svg")

    # Generate PNGs at different sizes
    for name, size in SIZES.items():
        output_name = f"{name}.png"
        generate_png_from_svg(
            SOURCE_SVG,
            OUTPUT_DIR / "images" / output_name,
            size
        )

    # Generate square icons for app
    for size in [16, 32, 48, 64, 128, 256]:
        output_name = f"icon-{size}.png"
        generate_png_from_svg(
            SOURCE_SVG,
            OUTPUT_DIR / "images" / "icons" / output_name,
            size
        )

    # For integrations (usually need transparent background)
    # These typically use company logos, so we create placeholder
    print("\nNote: Integration logos should be added manually or via brand guidelines")

    print("\nDone! Brand assets generated.")
    return 0

if __name__ == "__main__":
    exit(main())