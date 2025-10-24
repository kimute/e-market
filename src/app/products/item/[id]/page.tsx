import { getProductById } from "@/lib/data/products";
import { formatPriceToEn } from "@/lib/util";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { getIsOwner } from "@/lib/session/getIsOwner";
import { deleteProduct } from "./actions";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paramId } = await params;
  const id = Number(paramId);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  return (
    <div className="max-w-md mx-auto p-5">
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}`}
          alt={product.title}
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4 flex gap-3 items-center border-b border-neutral-600">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon className="size-10" />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-neutral-500">{product.description}</p>
      </div>
      <div className="fixed  bottom-0 left-0 right-0 backdrop-blur-sm bg-black/50 flex items-center justify-around py-3">
        <span className="text-lg font-semibold">
          {formatPriceToEn(product.price)}
        </span>

        {isOwner ? (
          <form action={deleteProduct.bind(null, id)}>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Product
            </button>
          </form>
        ) : null}

        <form>
          <button
            type="submit"
            className="bg-orange-500 text-white px-5 py-2 rounded-md"
          >
            Chat
          </button>
        </form>
      </div>
    </div>
  );
}
