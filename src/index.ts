import CustomerDataPerser from './customer-data-parser';
import DistanceCalculator from './distance-calculator';
import Invite from './invite';

const invite = new Invite(new DistanceCalculator(), new CustomerDataPerser());
invite
  .getList()
  .then((customers) => {
    console.table(customers);
  })
  .catch((error) => {
    console.error(error);
  });

