"use client";
import { useEffect, useRef, useState } from "react";
import { Prisma } from "@/generated/prisma";
import { getProducts } from "@/lib/data/products";
import ListProduct from "./list-product";
import { loadMoreProducts } from "@/app/(tabs)/home/actions";
import Loader from "./Loader";

export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductListPaginationBynfinitescroll({
  initialProducts,
}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  // server action id better than useEffect
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  // const onLoadMoreClick = async () => {
  //   setIsLoading(true);
  //   const newProducts = await loadMoreProducts(page + 1);
  //   if (newProducts.length !== 0) {
  //     setPage((prev) => prev + 1);
  //     setProducts((prev) => [...prev, ...newProducts]);
  //   } else {
  //     setIsLastPage(true);
  //   }
  //   setIsLoading(false);
  // };
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        // check isInterdecting
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          //stop observe
          observer.unobserve(trigger.current);
          setIsLoading(true);
          //add more products
          const newProducts = await loadMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },{
        threshold: 1.0
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    // need cleanup fuction. <-it call when user leave page
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div>
      <div className="p-5 flex flex-col gap-5 pb-24">
        {products.map((product) => (
          <ListProduct key={product.id} {...product} />
        ))}
        {isLastPage ? (
          <p className="text-center text-neutral-500">no more items</p>
        ) : (
          isLoading ? <Loader/> :
          <span
            ref={trigger}
            className="mx-auto px-3 py-2"
          />
        )}
      </div>
    </div>
  );
}
