import ListProduct from "@/components/list-product";
import ProductListPaginationByClick from "@/components/product-list-pagination-by-click";
import ProductListPaginationBynfinitescroll from "@/components/product-list-pagination-by-infinitescroll";
import { getProducts } from "@/lib/data/products";

export default async function Products() {
  const initialProducts = await getProducts();
  return (
    <div className="p-5 flex flex-col gap-5">
      <ProductListPaginationBynfinitescroll initialProducts={initialProducts}/>
    </div>
  );
}
