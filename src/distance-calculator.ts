export type GeoPoint = {
  lat: number;
  long: number;
};

export type DistanceUnits =
  | 'meter'
  | 'm'
  | 'kilometer'
  | 'km'
  | 'mile'
  | 'mi'
  | 'nauticalmile'
  | 'nmi';

type DistanceOptions = {
  unit?: DistanceUnits;
  // only haversine method is implemented, but keeping room for some other formula
  method?: 'haversine';
};

export default class DistanceCalculator {
  protected options: DistanceOptions;

  protected earthRadius = {
    meter: 6371000,
    m: 6371000,
    kilometer: 6371,
    km: 6371,
    mile: 3960,
    mi: 3960,
    nauticalmile: 3440,
    nmi: 3440,
  };

  protected methodMap = {
    haversine: this.haversine,
  };

  /**
   * Conversts angular value from degree to radian
   * @param degree
   * @returns
   */
  private degreeToRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }

  /**
   * Implementation of haversine formula to calculate distance between two points
   *
   * @param start: GeoPoint object, { lat: 1.2345, long: 1.2345 }
   * @param end: GeoPoint object, { lat: 1.2345, long: 1.2345 }
   * @returns number: distance between start and end geoPoint
   */
  private async haversine(start: GeoPoint, end: GeoPoint, unit: DistanceUnits) {
    const lat1Radian = this.degreeToRadian(start.lat);
    const lat2Radian = this.degreeToRadian(end.lat);
    const latDeltaRadian = this.degreeToRadian(end.lat - start.lat);
    const longDeltaRadian = this.degreeToRadian(end.long - start.long);

    //prettier-ignore
    const a = 
    Math.sin(latDeltaRadian / 2) * Math.sin(latDeltaRadian / 2) +
    Math.cos(lat1Radian) *
    Math.cos(lat2Radian) *
    Math.sin(longDeltaRadian / 2) * Math.sin(longDeltaRadian / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.earthRadius[unit] * c;
  }

  /**
   *
   * @param start
   * @param end
   * @param options
   */
  public async getDistance(start: GeoPoint, end: GeoPoint, options?: DistanceOptions) {
    // Setting default options
    const defaultOptions: DistanceOptions = {
      unit: 'kilometer',
      method: 'haversine',
    };

    // Overriding default options with given options
    this.setOptions({ ...defaultOptions, ...options });

    // Throw error if lat, long is not a number
    if (isNaN(start.lat) || isNaN(start.long) || isNaN(end.lat) || isNaN(end.long)) {
      throw Error(`Invalid geolocation data input`);
    }

    // Return distance calculated with preffered method
    return await this.methodMap[this.options.method].bind(this)(start, end, this.options.unit);
  }

  /**
   * Option setter
   * @param options
   */
  public setOptions(options: DistanceOptions) {
    this.options = options;
  }

  /**
   * Option getter
   * @returns Options
   */
  public getOptions(): DistanceOptions {
    return this.options;
  }
}

