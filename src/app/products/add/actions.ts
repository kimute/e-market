"use server"

import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";


const productSchema = z.object({
    photo: z.string({
        message: "Photo is required"
    }),
    title: z.string({
        message: "Title is required"
    }),
    description: z.string({
        message: "Description is required"
    }),
    price: z.coerce.number({
        message: "Price is required"
    }), // html 에서 입력받은 숫자는 전송시 문자열로 전송되므로 강제 형변환이 필요함
});



export default async function uploadProduct(formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
        const flatten = z.flattenError(result.error);
        return {
            error: flatten.fieldErrors
        };
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    price: result.data.price,
                    description: result.data.description,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: Number(session.id),
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            revalidateTag('products')
            redirect(`/products/item/${product.id}`);
        }
    }

    console.log(result.data);


}


// Request to Cloudflare for image upload preparation
// Returns id and uploadURL
// page.tsx uploads the file to uploadURL
// Image Delivery URL uses the returned id to display the image
// This id is then saved to the database through Prisma
export async function getUploadUrl() {
    // Validate environment variables
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiKey = process.env.CLOUDFLARE_API_KEY;

    if (!accountId || !apiKey) {
        throw new Error("Cloudflare environment variables are not configured.");
    }

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudflare API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Cloudflare upload URL creation failed:", error);
        throw new Error("An error occurred while preparing image upload.");
    }
}