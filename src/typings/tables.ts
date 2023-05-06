export type Itable = {
  id: number;
  tableNumber: number;
  capacity: number;
  isOutside: boolean;
  isAvailable: boolean;
  restaurantId: number;
  position: {
    x: number;
    y: number;
    floor: number;
  };
};
