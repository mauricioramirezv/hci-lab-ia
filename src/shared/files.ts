

export function download(name: string, body: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([body], {type}));
  const a = document.createElement('a'); a.href=url; a.download=name; a.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

export function csvCell(value: unknown) {
  const text = String(value ?? '');
  return '"'+(/^[=+\-@\t\r]/.test(text) ? "'"+text : text).replaceAll('"','""')+'"';
}
