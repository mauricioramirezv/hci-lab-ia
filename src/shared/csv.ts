export function csvCell(value: unknown) {
  const text = String(value ?? '');
  return '"'+(/^[=+\-@\t\r]/.test(text) ? "'"+text : text).replaceAll('"','""')+'"';
}
