import re
from img_map import CATEGORY_FALLBACK_IMAGES

filepath = r'C:\Users\Admin\.gemini\antigravity\scratch\choco-radar-ua\src\data\chocolateData.ts'
content = open(filepath, encoding='utf-8').read()

# We will assign unique, high-aesthetic photo showcases to makers that do not currently have imageUrl
# Split by maker objects in MAKERS array
p_start = content.index('export const MAKERS: CraftMaker[] = [')
p_end = content.index('export const PRODUCTS: ChocolateProduct[] = [')

before = content[:p_start]
makers_block = content[p_start:p_end]
after = content[p_end:]

# Category counter to distribute varied images
counters = {k: 0 for k in CATEGORY_FALLBACK_IMAGES}

def update_maker_block(match):
    block = match.group(0)
    if '"imageUrl":' in block:
        return block
    
    # Determine main category or segment
    cat_match = re.search(r'"mainCategory":\s*"([^"]+)"', block)
    cat = cat_match.group(1) if cat_match else 'plytky-shokoladu'
    
    # Fallback to category list
    if cat not in CATEGORY_FALLBACK_IMAGES:
        cat = 'plytky-shokoladu'
    
    img_list = CATEGORY_FALLBACK_IMAGES[cat]
    idx = counters[cat] % len(img_list)
    counters[cat] += 1
    chosen_img = img_list[idx]
    
    # Insert imageUrl before closing brace of maker object
    # Find last property line before '}'
    subbed = re.sub(r'(\s*)(\}\s*,?\s*)$', rf',\1  "imageUrl": "{chosen_img}"\1\2', block)
    return subbed

# Match each maker block: \n  {\n ... \n  },?
updated_makers = re.sub(r'(\n  \{\n[\s\S]*?\n  \},?)', update_maker_block, makers_block)

new_content = before + updated_makers + after
open(filepath, 'w', encoding='utf-8').write(new_content)
print("Updated chocolateData.ts successfully!")
