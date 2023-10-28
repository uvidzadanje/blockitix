import { z } from "zod";
import { UserRole } from "../models/User";

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username is required!",
    }).min(3, {
        message: "Username must be greater then 3 characters"
    }),

    address: z.string({
        required_error: "Address is required!"
    }).regex(/(0x[A-Fa-f0-9]{40})/g, {
        message: "Address is not in good format"
    }),

    role: z.nativeEnum(UserRole)
})

export const loginSchema = z.object({
    address: z.string({
        required_error: "Address is required!"
    }).regex(/(0x[a-f0-9]{40})/g, {
        message: "Address is not in good format"
    }),
})
