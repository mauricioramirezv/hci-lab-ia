"""Read-only PDF audit and raster previews for the browser-print test artifact."""
import sys
from pathlib import Path

workspace = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(workspace / '.tools' / 'pdf'))
import pymupdf

pdf = Path(sys.argv[1]).resolve()
destination = Path(sys.argv[2]).resolve()
if not pdf.is_relative_to(workspace) or not destination.is_relative_to(workspace):
    raise ValueError('Audit paths must stay within the workspace')
destination.mkdir(parents=True, exist_ok=True)
document = pymupdf.open(pdf)
outside = []
texts = []
for i, page in enumerate(document):
    text = page.get_text()
    texts.append(text)
    for block in page.get_text('blocks'):
        if block[0] < 0 or block[1] < 0 or block[2] > page.rect.width + 1 or block[3] > page.rect.height + 1:
            outside.append(i + 1)
    page.get_pixmap(matrix=pymupdf.Matrix(1, 1)).save(str(destination / f'page-{i+1:02}.png'))
all_text = '\n'.join(texts)
(destination / 'text.txt').write_text(all_text, encoding='utf-8')
print({'pages': len(document), 'outside_page': outside, 'replacement_glyphs': all_text.count('\ufffd'), 'placeholder_count': all_text.count('{{'), 'starts': all_text[:160]})
# Four-page contact sheets; retain individual rasters for inspecting tables.
for start in range(0, len(document), 4):
    sheet = pymupdf.open()
    canvas = sheet.new_page(width=640, height=930)
    for slot in range(min(4, len(document)-start)):
        pix = document[start+slot].get_pixmap(matrix=pymupdf.Matrix(.5, .5))
        x, y = (slot % 2) * 320, (slot // 2) * 465
        canvas.insert_image(pymupdf.Rect(x, y, x+315, y+445), stream=pix.tobytes('png'))
        canvas.insert_text((x+5, y+457), f'Page {start+slot+1}', fontsize=9)
    canvas.get_pixmap().save(str(destination / f'sheet-{start+1:02}.png'))
