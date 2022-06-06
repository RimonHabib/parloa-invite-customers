import CustomerDataPerser from '../customer-data-parser';
import DistanceCalculator from '../distance-calculator';
import Invite from '../invite';

describe('Invite', () => {
  let invite;

  beforeEach(() => {
    invite = new Invite(new DistanceCalculator(), new CustomerDataPerser());
  });

  it('Should return invite list', async () => {
    const list = await invite.getList();
    expect(list.length).toBeGreaterThan(1);
  });

  // 10k radius
  it('Should return 1 customer', async () => {
    const list = await invite.getList({
      radius: 10,
      min: 2,
    });
    expect(list.length).toBe(1);
    expect(invite.getOptions().radius).toBe(10);
  });

  it('Should return 0 customer', async () => {
    const list = await invite.getList({
      radius: 0,
      unit: 'mile',
    });
    expect(list.length).toBe(0);
    expect(invite.getOptions().unit).toBe('mile');
  });

  it('Should return 10 customer max', async () => {
    const list = await invite.getList({
      radius: Infinity,
      max: 10,
    });
    expect(list.length).toBe(10);
  });

  it('Should return in correct order', async () => {
    const acendingOrderList = await invite.getList();
    const decendingOrderList = await invite.getList({ sort: 'DESC' });
    expect(acendingOrderList.reverse()).toEqual(decendingOrderList);
  });

  it('Should throw an error', async () => {
    await expect(invite.getList({ filePath: 'WrongFilePath' })).rejects.toThrow();
  });
});

