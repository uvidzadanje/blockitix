import { NextFunction, Request, Response } from "express";
import { StaticDataService } from "../services/static-data.service";
import { sendResponse } from "../utils/response";

const staticDataService: StaticDataService = new StaticDataService();

export class StaticDataController {
    async getCities(req: Request, res: Response, next: NextFunction)
    {
        try {
            const cities = await staticDataService.getCities();

            return sendResponse(res, cities);
        } catch (error) {
            next(error);
        }
    }

    async getEventCategories(req: Request, res: Response, next: NextFunction)
    {
        try {
            const eventCategories = await staticDataService.getEventCategories();

            return sendResponse(res, eventCategories);
        } catch (error) {
            next(error);
        }
    }
}