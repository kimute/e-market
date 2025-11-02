import ListProduct from "@/components/list-product";
//import ProductListPaginationByClick from "@/components/product-list-pagination-by-click";
import ProductListPaginationBynfinitescroll from "@/components/product-list-pagination-by-infinitescroll";
import { getProducts } from "@/lib/data/products";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function Products() {
  const initialProducts = await getProducts();
  return (
    <div className="relative">
      <ProductListPaginationBynfinitescroll initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 rounded-full flex items-center justify-center size-16 fixed bottom-28 right-8 text-white transition-colors hover:bg-orange-400 z-50 shadow-lg"
      >
        <PlusIcon className="size-10 text-white"/>
      </Link>
    </div>
  );
}
