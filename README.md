# Parloa Invite Customers
This program is written to help Parloa to invite it's customers 
by getting customer ids from exported within defined distance radius.


## Clone the repository
```
git clone git@github.com:RimonHabib/parloa-invite-customers.git
```

## Install Dependency
```
npm install
```

## Run Tests
```
npm run test
```

## Run the program
```
npm start
```

## Options

To get customer id list, these options can be used

```
InviteOptions = {
  filePath?: string; // Absolute location of the text file path
  radius?: number; // Customer's distance, default: 100
  unit?: DistanceUnits; // Distance Unit, default: kilometer
  min?: number; // Minimum number of customers, default: 0
  max?: number; // Maximum number of customers, default: Infinity
  sort?: 'ASC' | 'DESC'; // Sorting order, default: 'ASC'
};
```