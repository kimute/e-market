"use server"

import { redirect } from "next/navigation";
import validator from "validator";
import z from "zod";


const checkPhoneNumber = (phone: string) => validator.isMobilePhone(phone, "ja-JP")

// Since phone number and token are not validated together, 
// let’s create separate schemas for each.
// For phone, add a validator check.
const phoneSchema = z.string().trim().refine(checkPhoneNumber,"Worng form format");
// When retrieving action data, the type is string by default, 
// so use coerce to convert it into a number.
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prevState: any, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");

    if (prevState.token) {
        // Second submission: if the token is valid, redirect to home
        const result = tokenSchema.safeParse(token);
        if (result.success) {
            redirect('/')
        } else {
            const flatten = z.flattenError(result.error);
            // If it fails, keep the phone value and return it
            return {
                token: true,
                phone: prevState.phone, // preserve the previous phone number
                FieldErrors: flatten.formErrors
            }
        }

    } else {
        // First submission: validate phone number, then show token field
        const phoneResult = phoneSchema.safeParse(phone);
        // If validation succeeds, return and keep the phone value
        if (phoneResult.success) {
            return {
                token: true,
                phone: phone?.toString() || "" // save the phone number
            }
        } else {
            const flatten = z.flattenError(phoneResult.error);
            console.log("flatten :",flatten )
            return {
                token: false,
                FieldErrors: flatten.formErrors
            }
        }
    }
}