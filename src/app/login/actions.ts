"use server"

import { PASSWORD_MIN_LENGTH } from "@/lib/constants"
import z from "zod"

const formSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string({
        error: "input your password"
    }).min(PASSWORD_MIN_LENGTH, "password is too short")
})

export async function login(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    }
    const result = formSchema.safeParse(data);
    if (!result.success) {
        // * z.flatten is deprecated
        const flatten = z.flattenError(result.error);
        // If you return the value like this, 
        // you can display each field’s error state through the state from useActionState
        return { fieldErrors: flatten.fieldErrors };

    }


}