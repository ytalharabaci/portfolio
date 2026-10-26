#!/usr/bin/env python3
import os
import sys
import re
import argparse
import urllib.request
import urllib.parse
from PIL import Image

def fetch_remote_images(directory, quality=85):
    if not os.path.isdir(directory):
        return

    md_files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith(".md")]
    if not md_files:
        return

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    }

    url_pattern = re.compile(r"!\[([^\]]*)\]\((https?://[^\s\)]+)\)")
    downloaded_map = {}

    for md_path in md_files:
        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        matches = url_pattern.findall(content)
        if not matches:
            continue

        print(f"Found {len(matches)} remote image(s) in {os.path.basename(md_path)}")

        for alt, img_url in matches:
            if img_url in downloaded_map:
                continue

            parsed = urllib.parse.urlparse(img_url)
            raw_name = os.path.basename(parsed.path) or "remote_image"
            base_name = os.path.splitext(raw_name)[0]
            base_name = re.sub(r"[^a-zA-Z0-9_-]+", "-", base_name).strip("-") or "gorsel"
            
            webp_name = f"{base_name}.webp"
            target_path = os.path.join(directory, webp_name)
            counter = 2
            while os.path.exists(target_path) and target_path not in downloaded_map.values():
                webp_name = f"{base_name}-{counter}.webp"
                target_path = os.path.join(directory, webp_name)
                counter += 1

            print(f"  Downloading: {img_url} -> {webp_name}...")
            try:
                req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req, timeout=15) as resp:
                    with Image.open(resp) as img:
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGBA")
                        else:
                            img = img.convert("RGB")

                        if img.width > 1200:
                            ratio = 1200 / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((1200, new_height), Image.Resampling.LANCZOS)

                        img.save(target_path, "WEBP", quality=quality)
                        print(f"  Saved WebP to: {target_path}")
                        downloaded_map[img_url] = f"./{webp_name}"
            except Exception as e:
                print(f"  Failed to download {img_url}: {e}")

        if downloaded_map:
            for remote_url, local_ref in downloaded_map.items():
                content = content.replace(f"({remote_url})", f"({local_ref})")
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated references in {os.path.basename(md_path)}")

def optimize_images(directory, quality=80, delete_original=False, fetch_remote=False):
    if not os.path.isdir(directory):
        print(f"Error: Directory '{directory}' does not exist.")
        return

    if fetch_remote:
        print(f"Fetching and converting remote images in: {directory}")
        print("-" * 50)
        fetch_remote_images(directory, quality=quality)
        print("-" * 50)

    print(f"Scanning directory: {directory}")
    print(f"WebP Quality: {quality}%")
    print(f"Delete original images: {'Yes' if delete_original else 'No'}")
    print("-" * 50)

    image_extensions = ('.png', '.jpg', '.jpeg', '.bmp', '.tiff')
    converted_count = 0
    failed_count = 0

    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(image_extensions) and not file.lower().endswith('.webp'):
                filepath = os.path.join(root, file)
                basename = os.path.splitext(file)[0]
                webp_path = os.path.join(root, f"{basename}.webp")

                print(f"Processing: {file}...")
                try:
                    with Image.open(filepath) as img:
                        # Special handling for potentially huge images to prevent layout breaks or bloat
                        if img.width > 2000:
                            ratio = 2000 / img.width
                            new_height = int(img.height * ratio)
                            print(f"  Resizing from {img.width}x{img.height} to 2000x{new_height}")
                            img = img.resize((2000, new_height), Image.Resampling.LANCZOS)
                        
                        img.save(webp_path, "WEBP", quality=quality)
                        print(f"  Saved WebP to: {webp_path}")
                        converted_count += 1

                    if delete_original:
                        os.remove(filepath)
                        print(f"  Deleted original file: {file}")

                except Exception as e:
                    print(f"  Error processing {file}: {e}")
                    failed_count += 1

    print("-" * 50)
    print(f"Done! Converted: {converted_count}, Failed: {failed_count}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimize blog post images by converting them to WebP.")
    parser.add_argument("directory", help="Path to the directory containing images (e.g. blog post media folder)")
    parser.add_argument("-q", "--quality", type=int, default=80, help="WebP quality (default: 80)")
    parser.add_argument("-d", "--delete", action="store_true", help="Delete the original image files after successful conversion")
    parser.add_argument("-f", "--fetch-remote", action="store_true", help="Download external images found in markdown files and convert them to local WebP")

    args = parser.parse_args()
    optimize_images(args.directory, args.quality, args.delete, args.fetch_remote)
