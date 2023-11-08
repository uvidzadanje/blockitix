import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { UserService } from "../services/user.service";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { sendResponse } from "../utils/response";
import { registerSchema } from "../utils/validation";

const userService = new UserService();

export class AuthController {
    // async login(req: Request, res: Response, next: NextFunction)
    // {
    //     try {
    //         await loginSchema.parseAsync(req.body);
    //         const user = req.body as UserLoginDto;

    //         const userFromDB = (await userService.get(user.email))[0] as User;

    //         if(!userFromDB) {
    //             throw new ApplicationError(httpErrorTypes.UNAUTHORIZED);
    //         }

    //         if(!(await compareValues(user.password, userFromDB.password))) {
    //             throw new ApplicationError(httpErrorTypes.UNAUTHORIZED);
    //         }

    //         const token = signToken(userFromDB, "1d");

    //         return sendResponse(res, token);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

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

    // async isAuth(req: Request, res: Response, next: NextFunction)
    // {
    //     try {
    //         const token = req.headers["authorization"] as string | undefined | null;

    //         if(!token || token === "undefined" || token === "null")
    //             throw new ApplicationError(httpErrorTypes.UNAUTHORIZED);
            
    //         const data = encodeToken(token);

    //         req.body.auth = data;

    //         return next();
    //     } catch (error) {
    //         next(error);
    //     }
    // }

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