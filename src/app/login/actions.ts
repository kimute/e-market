"use server"

import { PASSWORD_MIN_LENGTH } from "@/lib/constants"
import db from "@/lib/db";
import z from "zod"
import bcrypt from "bcrypt";
import getSession from "@/lib/session/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//find user by email
const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: { email },
        select: {
            id: true,
        },
    });
    return Boolean(user);
};



const formSchema = z.object({
    email: z.email().toLowerCase().refine(checkEmailExists, "An account with this email does not exist."),
    password: z.string({
        error: "input your password"
    }).min(PASSWORD_MIN_LENGTH, "password is too short")
})

export async function login(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    }
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        // * z.flatten is deprecated
        const flatten = z.flattenError(result.error);
        // If you return the value like this, 
        // you can display each field’s error state through the state from useActionState
        return { fieldErrors: flatten.fieldErrors };

    } else {
        // find a user with email
        // if the user is found, check password hash
        //log the user in
        // finally redirect
        const validatedFields = await formSchema.safeParseAsync(data);
        if (!validatedFields.success) {
            return validatedFields.error.flatten();
        } else {
            // if the user is found, check password hash
            const user = await db.user.findUnique({
                where: { email: validatedFields.data.email },
                select: {
                    id: true,
                    password: true,
                },
            });
            const isCheckResultOk = await bcrypt.compare(
                validatedFields.data.password,
                user!.password ?? "xxxx"
            );
            if (isCheckResultOk) {
                const session = await getSession();
                session.id = user!.id;
                await session.save();
                // if the password is correct, log the user in
                // redirect to the profile page
                revalidatePath("/profile");
                redirect("/profile");
            } else {
                return {
                    fieldErrors: {
                        password: ["Invalid password"],
                        email: [],
                    },
                };
            }
        }
    }


}