



export function rawTLX(values: number[]) {
  if (values.length !== 6 || values.some(v => !Number.isFinite(v) || v < 0 || v > 100)) throw new Error('invalidWorkload');
  return values.reduce((s,v) => s+v,0)/6;
}
