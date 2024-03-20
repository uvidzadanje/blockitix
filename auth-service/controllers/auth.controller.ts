import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { UserService } from "../services/user.service";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { sendResponse } from "../utils/response";
import { registerSchema } from "../utils/validation";

const userService = new UserService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction)
    {
        try {
            const user = req.body as User;

            await registerSchema.parseAsync(user);

            const payload = await userService.create(user);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async getAuthInfo(req: Request, res: Response, next: NextFunction)
    {
        try {
            const user = await userService.get(req.params.address);

            if(!user)
                throw new ApplicationError(httpErrorTypes.UNAUTHORIZED);

            return sendResponse(res, user);
        } catch (error) {
            next(error);
        }
    }
}