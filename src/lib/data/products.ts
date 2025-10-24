import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      description: true,
      price: true,
      createdAt: true,
      photo: true,
      id: true,
    },
    take: 3, // 첫 페이지에서 5개만 가져오기
    orderBy:{
      createdAt:"desc"
    }
  });
  return products;
}

export async function getProductById(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

