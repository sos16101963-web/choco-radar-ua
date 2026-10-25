lines = open(r'C:\Users\Admin\.gemini\antigravity\scratch\choco-radar-ua\src\data\chocolateData.ts', encoding='utf-8').readlines()
makers = []
curr_m = {}
for l in lines:
    if 'export const PRODUCTS' in l:
        if curr_m: makers.append(curr_m)
        break
    if '"id":' in l and '{' in prev_line:
        if curr_m: makers.append(curr_m)
        curr_m = {'id': l.split(':')[1].strip().strip(',').strip('"')}
    if '"name":' in l: curr_m['name'] = l.split(':')[1].strip().strip(',').strip('"')
    if '"categories":' in l: curr_m['cats'] = []
    if '"imageUrl":' in l: curr_m['imageUrl'] = l.split(':', 1)[1].strip().strip(',').strip('"')
    if '"mainCategory":' in l: curr_m['mainCategory'] = l.split(':')[1].strip().strip(',').strip('"')
    prev_line = l

without_img = [m for m in makers if 'imageUrl' not in m]
print(f"Total makers: {len(makers)}, Without image: {len(without_img)}")
for m in without_img[:15]:
    print(m.get('id'), '|', m.get('mainCategory'), '|', m.get('name'))
