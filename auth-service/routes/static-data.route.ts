import express from "express";
import { StaticDataController } from "../controllers/static-data.controller";

const staticDataController = new StaticDataController();
const router = express.Router();

router.get("/cities", staticDataController.getCities);
router.get("/event-categories", staticDataController.getEventCategories);

export default router;