import DistanceCalculator, { GeoPoint } from '../distance-calculator';

describe('Distance Calculator', () => {
  const distanceCalculator = new DistanceCalculator();
  it('should calculate distance', async () => {
    let start: GeoPoint = {
      lat: 23.8358829,
      long: 90.369288,
    };
    let end = start;
    let distance = await distanceCalculator.getDistance(start, end);
    expect(distance).toBe(0);

    end = {
      lat: 23.831787235725727,
      long: 90.36273509736007,
    };

    distance = await distanceCalculator.getDistance(start, end);
    expect(Math.round(distance)).toBe(1);

    // change unit to meter
    distance = await distanceCalculator.getDistance(start, end, { unit: 'm' });
    expect(Math.round(distance)).toBe(807);
  });

  it('Should throw an error', async () => {
    //Invalid long input
    let start = {
      lat: 23.8358829,
      long: parseInt('x.369288'),
    };
    let end = start;
    await expect(distanceCalculator.getDistance(start, end)).rejects.toThrow();
  });
});
