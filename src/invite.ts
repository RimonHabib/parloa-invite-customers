import path from 'path';
import CustomerDataPerser, { Customer } from './customer-data-parser';
import DistanceCalculator, { DistanceUnits, GeoPoint } from './distance-calculator';

type InviteOptions = {
  filePath?: string;
  radius?: number;
  unit?: DistanceUnits;
  min?: number;
  max?: number;
  sort?: 'ASC' | 'DESC';
};

export default class Invite {
  private options: InviteOptions;
  private parloaLocation: GeoPoint = {
    lat: 52.493256,
    long: 13.446082,
  };
  public inviteList: string[] = [];
  constructor(
    private readonly distanceCalculator: DistanceCalculator,
    private readonly customerDataPerser: CustomerDataPerser,
  ) {
    // set default options
    this.setOptions({
      filePath: path.resolve(__dirname, './customers.txt'),
      radius: 100,
      unit: 'kilometer',
      min: 0,
      max: Infinity,
      sort: 'ASC',
    });
  }

  /**
   * Options setter
   * @param options
   */
  setOptions(options: InviteOptions) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Option getter
   * @returns Options
   */
  getOptions(): InviteOptions {
    return this.options;
  }

  private async generateList() {
    try {
      // Parse & calculate distance in same loop, using callback
      await this.customerDataPerser.parse(this.options.filePath, (customer: Customer) => {
        // exit early if inviteList reaches to Max
        if (this.inviteList.length === this.options.max) return;

        // get customer data
        const { id, lat, long } = customer;

        // calculate distance and push it to InviteList if distance is within set radius
        this.distanceCalculator
          .getDistance(
            this.parloaLocation,
            {
              lat,
              long,
            },
            {
              unit: this.options.unit,
            },
          )
          .then((distance) => {
            if (distance <= this.options.radius) this.inviteList.push(id);
          })
          .catch((error) => {
            console.warn(error);
          });
      });
    } catch (error) {
      throw error;
    }
  }

  public async getList(options?: InviteOptions) {
    if (options) this.setOptions(options);
    await this.generateList();

    // Put a warning if invite list is too small
    if (this.inviteList.length < this.options.min) {
      console.warn('Customer list is too small');
    }

    // Sort & return the list
    if (this.options.sort === 'ASC') {
      return this.inviteList.sort();
    } else {
      return this.inviteList.sort().reverse();
    }
  }
}

