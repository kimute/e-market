"use server"

import z from "zod"


const checkUserName = (username: string) => !username.includes("admin");


const chekPassword = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

// better than this .refine(checkUserName, "admin not allowed"),
//.refine((username) => !username.includes("admin"), "admin not allowed"),

const formSchema = z.object({
    // zod v4  invalid_type_error , required_error ->deprecated
    username: z.string({
        error: (issue) => issue.input === undefined ? "required" : "not a string"
    }).min(3, "too short").max(10, "too long").refine(checkUserName, "admin not allowed"),
    // transfomation: trim, toLowerCase, transform((unsername) => `aa${username}`):add aa in front of username
    email: z.email().lowercase().trim().toLowerCase(),
    password: z.string().min(3).max(10),
    confirm_password: z.string().min(3).max(10),
}).refine(chekPassword, { error: "both password shoud be same", path:["confirm_password"] })
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
    const result = formSchema.safeParse(data);

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

    }

}