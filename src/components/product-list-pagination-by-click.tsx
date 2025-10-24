"use client";
import { useState } from "react";
import { Prisma } from "@/generated/prisma";
import { getProducts } from "@/lib/data/products";
import ListProduct from "./list-product";
import { loadMoreProducts } from "@/app/(tabs)/home/actions";

export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductListPaginationByClick({
  initialProducts,
}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  // server action id better than useEffect
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await loadMoreProducts(page + 1);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <div className="p-5 flex flex-col gap-5 pb-24">
        {products.map((product) => (
          <ListProduct key={product.id} {...product} />
        ))}
        {isLastPage ? (
          <p className="text-center text-neutral-500">no more items</p>
        ) : (
          <button
            onClick={onLoadMoreClick}
            disabled={isLoading}
            className="sticky text-sm font-semibold bg-orange-500 text-white mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
