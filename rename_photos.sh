#!/bin/bash

# ==============================================================================
# PHOTO INGESTION, RENAMING, DOWNSIZING & PORTFOLIO UPLOAD PIPELINE
# ==============================================================================
# Repurposed from original rename_photos.sh
# Preserves previous naming convention: <folder>_image_001.jpg
# Adds:
#   1. Copying from specified source folder to target gallery folder
#   2. Sequential renaming starting from highest existing index
#   3. Downsizing with aspect ratio preservation (2048px max edge, 82% quality)
#   4. Automatic HTML injection into the corresponding gallery page
#   5. Automatic update-collections.js execution
# ==============================================================================

set -e

# Detect Repository Directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/update-collections.js" ]; then
    REPO_DIR="$SCRIPT_DIR"
elif [ -f "$SCRIPT_DIR/git_test/update-collections.js" ]; then
    REPO_DIR="$SCRIPT_DIR/git_test"
elif [ -f "$PWD/update-collections.js" ]; then
    REPO_DIR="$PWD"
elif [ -d "/Users/minhlocnguyen/repos/git_test" ]; then
    REPO_DIR="/Users/minhlocnguyen/repos/git_test"
else
    echo "Error: Could not locate git_test repository root containing update-collections.js."
    exit 1
fi

# Usage display
print_usage() {
    echo "Usage:"
    echo "  $0 <source_folder> <target_gallery>"
    echo ""
    echo "Galleries available:"
    echo "  bw_photos        (Black & White  -> black-and-white.html)"
    echo "  colour_photos    (Colour         -> colour.html)"
    echo "  places_photos    (Places         -> places.html)"
    echo "  portrait_photos  (Portraits      -> portraits.html)"
    echo ""
    echo "Examples:"
    echo "  $0 ~/Desktop/new_shots bw_photos"
    echo "  $0 /Volumes/SD_CARD/export portraits"
    echo ""
    echo "Legacy mode (in-place rename in gallery folder):"
    echo "  $0 bw_photos"
}

if [ -z "$1" ]; then
    print_usage
    exit 1
fi

# Normalize any gallery input (handles paths, trailing slashes, shorthands)
normalize_gallery() {
    local raw="$1"
    raw="${raw%/}"
    raw="${raw/#\~/$HOME}"
    local base="$(basename "$raw")"
    
    case "$base" in
        bw|b_w|black_white|blackwhite|bw_photos|black-and-white|black-and-white.html)
            echo "bw_photos"
            ;;
        colour|color|colour_photos|color_photos|colour.html|color.html)
            echo "colour_photos"
            ;;
        places|place|places_photos|places.html)
            echo "places_photos"
            ;;
        portraits|portrait|portrait_photos|portraits.html)
            echo "portrait_photos"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Resolve arguments flexibly
g1="$(normalize_gallery "$1")"
g2=""
[ -n "$2" ] && g2="$(normalize_gallery "$2")"
LOCATION_TAG=""

if [ -n "$2" ]; then
    if [ -n "$g2" ]; then
        SOURCE_DIR="$1"
        GALLERY_FOLDER="$g2"
        LOCATION_TAG="$3"
    elif [ -n "$g1" ]; then
        # Swapped argument order: ./rename_photos.sh bw_photos ~/Desktop/photos [location]
        SOURCE_DIR="$2"
        GALLERY_FOLDER="$g1"
        LOCATION_TAG="$3"
    else
        echo "Error: Could not identify target gallery from '$2' (or '$1')."
        echo "Available galleries: bw_photos, colour_photos, places_photos, portrait_photos"
        print_usage
        exit 1
    fi
else
    # Single argument mode
    if [ -n "$g1" ]; then
        SOURCE_DIR=""
        GALLERY_FOLDER="$g1"
    elif [ -d "$1" ]; then
        SOURCE_DIR="$1"
        echo "Source directory detected: $1"
        echo "Please specify target gallery:"
        echo "  1) bw_photos       (Black & White)"
        echo "  2) colour_photos   (Colour)"
        echo "  3) places_photos   (Places)"
        echo "  4) portrait_photos (Portraits)"
        read -r -p "Enter gallery name or number [1-4]: " chosen
        case "$chosen" in
            1|bw*) GALLERY_FOLDER="bw_photos" ;;
            2|col*) GALLERY_FOLDER="colour_photos" ;;
            3|pl*) GALLERY_FOLDER="places_photos" ;;
            4|port*) GALLERY_FOLDER="portrait_photos" ;;
            *)
                GALLERY_FOLDER="$(normalize_gallery "$chosen")"
                if [ -z "$GALLERY_FOLDER" ]; then
                    echo "Invalid choice '$chosen'. Exiting."
                    exit 1
                fi
                ;;
        esac
    else
        print_usage
        exit 1
    fi
fi

# Map target gallery to HTML page & alt prefix
case "$GALLERY_FOLDER" in
    bw_photos)
        HTML_PAGE="black-and-white.html"
        ALT_PREFIX="Black and white photograph"
        ;;
    colour_photos)
        HTML_PAGE="colour.html"
        ALT_PREFIX="Colour photograph"
        ;;
    places_photos)
        HTML_PAGE="places.html"
        ALT_PREFIX="Places photograph"
        ;;
    portrait_photos)
        HTML_PAGE="portraits.html"
        ALT_PREFIX="Portrait"
        ;;
    *)
        HTML_PAGE=""
        ALT_PREFIX="Photograph"
        ;;
esac

TARGET_DIR="$REPO_DIR/$GALLERY_FOLDER"
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating target directory: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

FOLDER_NAME="$GALLERY_FOLDER"
PREFIX="${FOLDER_NAME}_image_"

echo "========================================================"
echo " PHOTOGRAPHY PIPELINE: $FOLDER_NAME"
echo " Target Directory:     $TARGET_DIR"
echo " HTML Page:            $HTML_PAGE"
echo "========================================================"

# STEP 1: Copy photos from SOURCE_DIR if provided
if [ -n "$SOURCE_DIR" ]; then
    SOURCE_DIR="${SOURCE_DIR%/}"
    SOURCE_DIR="${SOURCE_DIR/#\~/$HOME}"
    if [ ! -d "$SOURCE_DIR" ] && [ ! -f "$SOURCE_DIR" ]; then
        echo "Error: Source does not exist: $SOURCE_DIR"
        exit 1
    fi

    copied_count=0
    target_real="$(cd "$TARGET_DIR" && pwd)"

    if [ -f "$SOURCE_DIR" ]; then
        # Single file provided
        src_real="$(cd "$(dirname "$SOURCE_DIR")" && pwd)/$(basename "$SOURCE_DIR")"
        echo "[1/5] Ingesting single photo: $(basename "$SOURCE_DIR")..."
        if [ "$src_real" != "$target_real/$(basename "$SOURCE_DIR")" ]; then
            dest_file="$TARGET_DIR/$(basename "$SOURCE_DIR")"
            if [ -e "$dest_file" ]; then
                dest_file="$TARGET_DIR/incoming_${copied_count}_$(basename "$SOURCE_DIR")"
            fi
            cp "$SOURCE_DIR" "$dest_file"
            ((copied_count++))
            echo "Successfully copied $(basename "$SOURCE_DIR") into $GALLERY_FOLDER."
        else
            echo "Photo is already in $GALLERY_FOLDER."
        fi
    elif [ -d "$SOURCE_DIR" ]; then
        # Folder provided
        echo "[1/5] Ingesting photos from folder: $SOURCE_DIR..."
        shopt -s nullglob nocaseglob
        for src_file in "$SOURCE_DIR"/*.{jpg,jpeg,png,heic,webp}; do
            [ -f "$src_file" ] || continue
            src_dir_real="$(cd "$(dirname "$src_file")" && pwd)"
            if [ "$src_dir_real" != "$target_real" ]; then
                dest_file="$TARGET_DIR/$(basename "$src_file")"
                if [ -e "$dest_file" ]; then
                    dest_file="$TARGET_DIR/incoming_${copied_count}_$(basename "$src_file")"
                fi
                cp "$src_file" "$dest_file"
                ((copied_count++))
            fi
        done
        shopt -u nullglob nocaseglob

        if [ "$copied_count" -eq 0 ]; then
            echo "Note: No new photos found to copy in $SOURCE_DIR (supported: .jpg, .jpeg, .png, .heic, .webp)."
        else
            echo "Successfully copied $copied_count photo(s) into $GALLERY_FOLDER."
        fi
    fi
else
    echo "[1/5] Running in-place mode on $GALLERY_FOLDER..."
fi

cd "$TARGET_DIR" || exit 1

# STEP 2: Normalize uppercase/alternative extensions to .jpg
echo "[2/5] Normalizing extensions..."
shopt -s nullglob nocaseglob
for f in *.jpg *.jpeg *.png *.heic *.webp; do
    [ -e "$f" ] || continue
    ext="${f##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    
    # If format is HEIC or PNG, convert to JPG using sips
    if [ "$ext_lower" = "heic" ] || [ "$ext_lower" = "png" ]; then
        base="${f%.*}"
        sips -s format jpeg "$f" --out "${base}.jpg" >/dev/null 2>&1
        rm -f "$f"
        continue
    fi

    if [ "$ext" != "jpg" ]; then
        mv "$f" "${f%.$ext}.jpg"
    fi
done
shopt -u nullglob nocaseglob

# STEP 3: Renaming photos (preserving previous rule)
echo "[3/5] Renaming new photos with standard prefix: ${PREFIX}XXX.jpg..."
highest=0
shopt -s nullglob
for file in "${PREFIX}"[0-9][0-9][0-9].jpg; do
    if [ -e "$file" ]; then
        num=$(echo "$file" | grep -oE '[0-9]{3}' | sed 's/^0*//')
        num=${num:-0}
        if [ "$num" -gt "$highest" ]; then
            highest=$num
        fi
    fi
done
shopt -u nullglob

i=$((highest + 1))
renamed_count=0
new_files=()

shopt -s nullglob
for f in *.jpg; do
    [ -e "$f" ] || continue

    # Skip files that are already correctly named
    if [[ "$f" =~ ^${PREFIX}[0-9]{3}\.jpg$ ]]; then
        continue
    fi

    new_name="$(printf "${PREFIX}%03d.jpg" $i)"
    mv "$f" "$new_name"
    new_files+=("$new_name")
    ((i++))
    ((renamed_count++))
done
shopt -u nullglob

echo "Renamed $renamed_count new photos (indexes from $((highest + 1)) to $((i - 1)))."

# STEP 4: Downsize and Optimize for Web Portfolio
# Standard: 2048px on max edge, 82% quality, strict aspect ratio preservation
echo "[4/5] Checking & optimizing photos for web portfolio (max 2048px, quality 82%)..."
downsized_count=0

shopt -s nullglob
for file in "${PREFIX}"*.jpg; do
    [ -f "$file" ] || continue
    
    dim_w=$(sips -g pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/ {print $2}')
    dim_h=$(sips -g pixelHeight "$file" 2>/dev/null | awk '/pixelHeight/ {print $2}')
    [ -n "$dim_w" ] && [ -n "$dim_h" ] || continue
    
    size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    max_edge=$dim_w
    if [ "$dim_h" -gt "$max_edge" ]; then
        max_edge=$dim_h
    fi

    if [ "$max_edge" -gt 2048 ]; then
        sips -Z 2048 -s formatOptions 82 "$file" --out "$file" >/dev/null 2>&1
        dim_w_after=$(sips -g pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/ {print $2}')
        dim_h_after=$(sips -g pixelHeight "$file" 2>/dev/null | awk '/pixelHeight/ {print $2}')
        size_after=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        kb_before=$((size_before / 1024))
        kb_after=$((size_after / 1024))
        echo "  - $file: ${dim_w}x${dim_h} (${kb_before}KB) -> ${dim_w_after}x${dim_h_after} (${kb_after}KB)"
        ((downsized_count++))
    elif [ "$size_before" -gt 1500000 ]; then
        sips -s formatOptions 84 "$file" --out "$file" >/dev/null 2>&1
        size_after=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        kb_before=$((size_before / 1024))
        kb_after=$((size_after / 1024))
        echo "  - $file (compressed): ${kb_before}KB -> ${kb_after}KB"
        ((downsized_count++))
    fi
done
shopt -u nullglob

if [ "$downsized_count" -eq 0 ]; then
    echo "  All photos in $GALLERY_FOLDER are already optimized."
fi

# STEP 5: Add code to HTML
if [ -n "$HTML_PAGE" ] && [ -f "$REPO_DIR/$HTML_PAGE" ]; then
    echo "[5/5] Checking and injecting image tags into $HTML_PAGE..."
    
    node -e "
      const fs = require('fs');
      const path = require('path');
      const htmlPath = process.argv[1];
      const folder = process.argv[2];
      const altPrefix = process.argv[3];
      const targetDir = process.argv[4];
      const locationTag = process.argv[5] || '';

      let html = fs.readFileSync(htmlPath, 'utf8');

      // Find all matching jpg files in the gallery folder on disk, sorted numerically
      const filesOnDisk = fs.readdirSync(targetDir)
        .filter(f => f.toLowerCase().endsWith('.jpg') && f.startsWith(folder + '_image_'))
        .sort((a, b) => {
          const numA = parseInt((a.match(/(\d+)/) || [0, 0])[1], 10);
          const numB = parseInt((b.match(/(\d+)/) || [0, 0])[1], 10);
          return numA - numB;
        });

      const newTags = [];

      filesOnDisk.forEach((f) => {
        const src = folder + '/' + f;
        if (!html.includes(src)) {
          const numMatch = f.match(/(\d{3})\.jpg$/);
          const num = numMatch ? parseInt(numMatch[1], 10) : '';
          const alt = altPrefix + ' ' + num;
          const locAttr = locationTag ? ' data-location=\"' + locationTag.replace(/\"/g, '&quot;') + '\"' : '';
          newTags.push('    <img class=\"gallery-trigger\" src=\"' + src + '\" alt=\"' + alt + '\"' + locAttr + ' loading=\"lazy\" decoding=\"async\">');
        }
      });

      if (newTags.length > 0) {
        const mainClose = html.lastIndexOf('</main>');
        if (mainClose !== -1) {
          html = html.slice(0, mainClose) + newTags.join('\n') + '\n  ' + html.slice(mainClose);
          fs.writeFileSync(htmlPath, html, 'utf8');
          console.log('  Successfully injected ' + newTags.length + ' image tag(s) into ' + path.basename(htmlPath) + ':');
          newTags.forEach(t => console.log('    + ' + t.trim()));
        } else {
          console.log('  Warning: Could not locate </main> tag in ' + path.basename(htmlPath));
        }
      } else {
        console.log('  All ' + filesOnDisk.length + ' images are already present in ' + path.basename(htmlPath) + '.');
      }
    " "$REPO_DIR/$HTML_PAGE" "$GALLERY_FOLDER" "$ALT_PREFIX" "$TARGET_DIR" "$LOCATION_TAG"
else
    echo "[5/5] Skipping HTML injection (no matching HTML page found for $GALLERY_FOLDER)."
fi

# STEP 6: Run update-collections.js and update-locations.js
echo ""
echo "Updating collection metadata and system alert feed..."
cd "$REPO_DIR" && node update-collections.js

if [ -f "$REPO_DIR/update-locations.js" ]; then
    echo "Updating photo locations registry..."
    cd "$REPO_DIR" && node update-locations.js
fi

echo ""
echo "========================================================"
echo " PIPELINE COMPLETE!"
echo " Photos processed: $renamed_count"
echo " Next available index in $GALLERY_FOLDER starts at: $i"
echo "========================================================"

