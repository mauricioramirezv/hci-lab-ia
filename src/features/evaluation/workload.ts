

export const tlxDimensions = ['Exigencia mental','Exigencia física','Exigencia temporal','Rendimiento: 0 excelente, 100 deficiente','Esfuerzo','Frustración'];

export function rawTLX(values: number[]) {
  if (values.length !== 6 || values.some(v => !Number.isFinite(v) || v < 0 || v > 100)) throw new Error('Se requieren seis valores entre 0 y 100.');
  return values.reduce((s,v) => s+v,0)/6;
}
