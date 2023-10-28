import mongoose from "mongoose";


export enum UserRole {
    CREATOR,
    BUYER
}

export interface User {
    address: string;
    username: string;
    role: UserRole
}

const UserSchema = new mongoose.Schema<User>({
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: UserRole
    }
})

export const UserModel = mongoose.model<User>("users", UserSchema);