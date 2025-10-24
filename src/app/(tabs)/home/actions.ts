"use server"

import db from "@/lib/db";

export async function loadMoreProducts(page: number) {
    const products = await db.product.findMany({
      select: {
        title: true,
        price: true,
        description: true,
        createdAt: true,
        photo: true,
        id: true,
      },
      skip: page * 5, // 25개씩 증가하려면 *25
      take: 5, // 첫번째 페이지에서 1개만 가져오려면 1
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  }