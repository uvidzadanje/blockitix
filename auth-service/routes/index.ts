import { Express, NextFunction } from "express";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import * as ErrorController from "../controllers/error.controller"
import authRoute from "./auth.route";
import staticDataRoute from "./static-data.route";

export default function (app: Express) {
    app.use("/auth", authRoute);
    app.use("/static-data", staticDataRoute);
    
    app.use((req, res, next) => {
        next(new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND));
    });
    app.use(ErrorController.errorHandler);
}

