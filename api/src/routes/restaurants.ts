import express from "express";
import controller from "~/controllers/restaurants";

const router = express.Router();

router.get("/", controller.getRestaurants);
router.get("/:id", controller.getRestaurant);

export default router;
