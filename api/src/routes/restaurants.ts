import express from "express";
import controller from "~/controllers/restaurants";

const router = express.Router();

router.get("/", controller.getAllRestaurants);
router.get("/:id", controller.getRestaurant);

router.post("/", controller.createRestaurant);

router.delete("/", controller.deleteAllRestaurants);

export default router;
