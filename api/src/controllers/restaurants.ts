import { Request, Response } from "express";
import handleError from "~/helpers/handleError";
import { prisma } from "~/index";

const prepareRestaurant = (restaurant: any) => {
  const restaurantObj = {
    id: restaurant.id,
    name: restaurant.name,
  } as any;

  if (restaurant.address) {
    restaurantObj.address = {
      street: restaurant.address.street,
      city: restaurant.address.city,
      country: restaurant.address.country,
      postalCode: restaurant.address.postalCode,
    };
  }

  if (restaurant.table) {
    restaurantObj.table = restaurant.table.map((table: any) => ({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      isOutside: table.isOutside,
      isAvailable: table.isAvailable,
    }));
  }
  return restaurantObj;
};

const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    // const auth = req.oidc.isAuthenticated() ? "Logged in" : "Logged out";

    // console.log({ auth });

    const includeParams = req.query.include as string[];
    const include = {
      address: includeParams?.includes("address"),
      table: includeParams?.includes("table"),
    };

    const restaurants = await prisma.restaurant.findMany({ include });

    const items = restaurants.map(prepareRestaurant);

    res.json({
      count: restaurants.length,
      items,
    });
  } catch (err: any) {
    handleError[500](res, err.message);
  }
};

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const includeParams = req.query.include as string[];
    const include = {
      address: includeParams?.includes("address"),
      table: includeParams?.includes("table"),
    };

    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include,
    });

    if (!restaurant) {
      return handleError[404](res, "Restaurant not found");
    }

    const item = prepareRestaurant(restaurant);

    res.json(item);
  } catch (err: any) {
    handleError[500](res, err.message);
  }
};

const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, address, tables } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address: {
          create: address,
        },
        table: {
          create: tables,
        },
      },
    });

    const item = prepareRestaurant(restaurant);

    res.status(201).json(item);
  } catch (err: any) {
    handleError[500](res, err.message);
  }
};

const deleteAllRestaurants = async (req: Request, res: Response) => {
  try {
    const deletedItems = await prisma.restaurant.findMany({
      select: { id: true, name: true },
    });
    const { count } = await prisma.restaurant.deleteMany({});

    res.json({
      count,
      items: deletedItems,
    });
  } catch (err: any) {
    handleError[500](res, err.message);
  }
};

export default {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  deleteAllRestaurants,
};
