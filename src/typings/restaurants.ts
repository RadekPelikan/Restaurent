type Iaddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  optional?: string;
};

export type Irestaurant = {
  id: number;
  name: string;
  capacity: number;
  address: Iaddress;
};
