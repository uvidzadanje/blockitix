import { User, UserModel } from "../models/User";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";

export class UserService {

    async create(user: User): Promise<User>
    {
        let createdUser = await UserModel.create(user);

        return createdUser;
    }

    async get(address: string): Promise<User | null>
    {
        let user = await UserModel.findOne({address});

        return user;
    }
}