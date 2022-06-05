import path from 'path';
import CustomerDataPerser from '../customer-data-parser';

describe('Customer Data Parser', () => {
  const parser = new CustomerDataPerser();
  it('should return a customer', async () => {
    const customer = await parser.parse(path.resolve(__dirname, './test-data-1.txt'));
    expect(customer).toEqual([
      {
        id: '51730bbd-9bce-4d28-ae30-580e2ddd1be8',
        lat: 50.43483821,
        long: 11.96975958,
      },
    ]);
  });

  // Wrong file path
  it('should throw an error', async () => {
    await expect(parser.parse('wringFilePath')).rejects.toThrow();
  });
});

