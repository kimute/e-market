import { safeParseAsync } from './../../../../node_modules/zod/src/v4/classic/parse';
"use server";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

import { Twilio } from "twilio";
import db from "@/lib/db";
import setSession from "@/lib/session/setSession";

interface ActionState {
    token: boolean;
    phoneNumber?: string; // Store phone number in state
}
// Since phone number and token are not validated together, 
// let’s create separate schemas for each.
// For phone, add a validator check.
const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ja-JP"),
        "Wrong phone format"
    );

async function tokenExist(token: number) {
    const exist = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        select: {
            id: true,
        },
    });
    return Boolean(exist);
}

// Function to verify if token belongs to specific phone number
async function tokenBelongsToPhone(token: number, phoneNumber: string) {
    const tokenRecord = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        include: {
            user: {
                select: {
                    phone: true,
                },
            },
        },
    });

    return tokenRecord?.user.phone === phoneNumber;
}

// When retrieving action data, the type is string by default, 
// so use coerce to convert it into a number.
const tokenSchema = z.coerce
    .number()
    .min(100000)
    .max(999999)
    .refine(tokenExist, "Token does not exists");

async function getToken() {
    // Generate random 6-digit number
    const token = crypto.randomInt(100000, 999999).toString();
    const exist = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: {
            id: true,
        },
    });
    if (exist) {
        // Regenerate if same token exists
        return getToken();
    } else {
        // Return token if same token doesn't exist
        return token;
    }
}

export async function smsLogin(prev: ActionState, formData: FormData) {
    const phoneNumber = formData.get("phoneNumber");
    const token = formData.get("token");
    // Validate phone number if token is not present
    if (!prev.token) {
        // Phone number validation
        const phoneResult = await phoneSchema.safeParseAsync(phoneNumber);
        // Return false if phone number is incorrect
        if (!phoneResult.success) {
            const flatten = z.flattenError(phoneResult.error);
            return {
                token: false,
                fieldErrors: {},
            };
        } else {
            // delete previous token
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: phoneResult.data,
                    },
                },
            });
            // create new token
            const token = await getToken();
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            where: { phone: phoneResult.data },
                            create: {
                                phone: phoneResult.data,
                                username: crypto.randomBytes(10).toString("hex"),
                            },
                        },
                    },
                },
            });

            // send the token using twilio
            const client = new Twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
            await client.messages.create({
                body: `Your Market verification code is: ${token}`,
                from: process.env.TWILIO_PHONE_NUMBER, // Use trial number from Twilio
                to: process.env.MY_PHONE_NUMBER!, //phoneResult.data, <- Use your registered number in Twilio, can use other numbers after upgrade
            });
            return {
                token: true,
                phoneNumber: phoneResult.data, // Store phone number in state
            };
        }
    } else {
        // Error if phone number is not in state
        if (!prev.phoneNumber) {
            return {
                token: false,
                error: { fieldErrors: {}, formErrors: ["Phone number is required"] },
            };
        }

        const tokenResult = await tokenSchema.safeParseAsync(token);
        if (!tokenResult.success) {
            const flatten = z.flattenError(tokenResult.error);
            return {
                token: true,
                phoneNumber: prev.phoneNumber,
                error: z.flattenError(tokenResult.error),
            };
        } else {
            // Check if token belongs to the phone number
            const isValidToken = await tokenBelongsToPhone(tokenResult.data, prev.phoneNumber);
            if (!isValidToken) {
                return {
                    token: true,
                    phoneNumber: prev.phoneNumber,
                    error: { fieldErrors: {}, formErrors: ["Invalid token for this phone number"] },
                };
            }

            const tokenRecord = await db.sMSToken.findUnique({
                where: {
                    token: tokenResult.data.toString(),
                },
                select: {
                    id: true,
                    userId: true,
                },
            });

            await setSession(tokenRecord!.userId);
            await db.sMSToken.delete({
                where: {
                    id: tokenRecord!.id,
                },
            });

            redirect("/profile");
        }
    }
}
