import { contentPoint, heatCells, median, scrollDepth } from '../../src/features/tracking/domain';
describe('Tracking geometry and aggregation', () => {
  it('converts viewport coordinates into content coordinates after scroll and borders', () => {
    expect(contentPoint(175,245,{left:100,top:150},0,400,2,2)).toEqual({x:73,y:493});
  });
  it('records visible bottom depth rather than wheel delta', () => {
    expect(scrollDepth(0,400,1600)).toBe(25);
    expect(scrollDepth(1200,400,1600)).toBe(100);
    expect(scrollDepth(1600,400,1600)).toBe(100);
  });
  it('weights pointer maps by elapsed time, not number of movement events', () => {
    const cells=heatCells([{x:2,y:3,at:0,weight:200},{x:4,y:5,at:200,weight:150},{x:90,y:90,at:350,weight:50}]);
    expect(cells[0].value).toBe(350);expect(cells[1].value).toBe(50);
  });
  it('computes median validation error without inventing accuracy', () => {
    expect(median([20,5,300])).toBe(20);expect(median([4,8])).toBe(6);
  });
});
