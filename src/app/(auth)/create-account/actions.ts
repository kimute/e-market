"use server"

import db from "@/lib/db";
import z, { email } from "zod"
import bcrypt from "bcrypt";
import getSession from "@/lib/session/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const checkUserName = (username: string) => !username.includes("admin");

// const checkUniqueUsername = async (username: string) => {
//     const user = await db.user.findUnique({
//         where: {
//             username,
//         },
//         select: {
//             id: true,
//         },
//     });
//     return !Boolean(user); // / Boolean(user) is true if user exists, false if not
// };

// When you want to check data from the DB (API), you can create a function like below.
// Since it's a fetch function, you should use await formSchema.safeParseAsync when parsing.
// const checkUniqueEmail = async (email: string) => {
//     const user = await db.user.findUnique({
//         where: {
//             email,
//         },
//         select: {
//             id: true,
//             email: true,
//         },
//     });
//     return Boolean(user) === false;
// };

const chekPassword = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

// better than this .refine(checkUserName, "admin not allowed"),
//.refine((username) => !username.includes("admin"), "admin not allowed"),

const formSchema = z.object({
    // zod v4  invalid_type_error , required_error ->deprecated
    username: z.string({
        error: (issue) => issue.input === undefined ? "required" : "not a string"
    }).min(3, "too short").max(10, "too long").refine(checkUserName, "admin not allowed")
        // superRefine allows for async validation and more complex validation logic
        // Unlike .refine(), superRefine gives you access to the validation context
        // This enables you to add custom issues with specific error codes and paths
        .superRefine(async (username, context) => {
            // Check if username already exists in the database
            const user = await db.user.findUnique({
                where: {
                    username,
                },
                select: {
                    id: true,
                },
            });

            // If user exists, add a custom validation issue
            if (user) {
                // context.addIssue() allows you to add custom validation errors
                context.addIssue({
                    code: "custom",                              // Error code type
                    message: "This username is already taken",   // User-friendly error message
                    path: ["username"],                          // Field path for the error
                    fatal: true                                  // Stop validation on this error
                })
                // z.NEVER indicates that validation should never succeed after this point
                return z.NEVER; // if check faild none of next validation check do not work any more
            }
        }),
    // transfomation: trim, toLowerCase, transform((unsername) => `aa${username}`):add aa in front of username
    email: z.email().lowercase().trim().toLowerCase().superRefine(async (email, context) => {
        const isEmialExist = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (isEmialExist) {
            context.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            })
            return z.NEVER
        }
    }),
    password: z.string().min(3).max(10),
    confirm_password: z.string().min(3).max(10),
}).refine(chekPassword, { error: "both password shoud be same", path: ["confirm_password"] })
// message is deprecated zod v4 using error: "" instead
// If you use .refine(checkPassword, "both passwords should be the same"),
// it treats it as a form-level error. So update it like this instead:
// .refine(checkPassword, { message: "both passwords should be the same", path: ["confirm_password"] })

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    }
    // Using parse like below is fine, but you need to wrap it with try-catch for error handling
    // const result = formSchema.parse(data);
    // Personally, I prefer safeParse since it doesn’t throw errors, 
    // you just need to check whether result success is true
    // The result object looks like this:
    // {
    //     success: true,
    //     data: {
    //       username: '',
    //       email: '',
    //       password: '',
    //       confirm_password: ''
    //     }
    //   }
    // use blow instead of const result = formSchema.safeParse(data);
    const result = await formSchema.safeParseAsync(data);
    console.log("result:", result)
    // error pattern
    // {
    //     "origin": "string",
    //     "code": "too_small",
    //     "minimum": 3,
    //     "inclusive": true,
    //     "path": [
    //       "confirm_password"
    //     ],
    //     "message": "Too small: expected string to have >=3 characters"
    //   }


    if (!result.success) {
        // * z.flatten is deprecated
        const flatten = z.flattenError(result.error);
        // If you return the value like this, 
        // you can display each field’s error state through the state from useActionState
        return { fieldErrors: flatten.fieldErrors };

    } else {
        // hash password
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        console.log(user) //TODO: delete
        // login ? give the user a cookie (with id)
        // Once the cookie is sent to the user, the browser will automatically send it to the server afterward (post or get, etc.)
        // Since this app doesn't have a session server, we use iron-session
        const session = await getSession();
        session.id = user.id;
        await session.save();
        revalidatePath("/profile");
        return redirect("/profile");
    }

}