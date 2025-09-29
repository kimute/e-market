"use server"

import z from "zod"

const formSchema = z.object({
    username: z.string().min(3).max(10),
    email: z.email().lowercase().trim(),
    password: z.string().min(3).max(10),
    confirm_password: z.string().min(3).max(10),


})

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