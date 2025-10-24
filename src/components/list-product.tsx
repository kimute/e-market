import { formatDate, formatPriceToEn } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  description?: string;
  photo: string;
  createdAt: Date;
}

export default function ListProduct({
  id,
  title,
  price,
  description,
  photo,
  createdAt,
}: ListProductProps) {
    console.log('photo url:',photo)
  return (
    <Link
      href={`/products/item/${id}`}
      className="flex gap-5 hover:bg-neutral-800/50 rounded-md p-3 transition-colors"
    >
      <div className="relative size-28 rounded-md overflow-hidden bg-neutral-700 shrink-0">
        <Image
          src={photo}
          alt={title}
          fill
          sizes="112px"
          className="object-cover"
          priority={false}
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-orange-500 font-bold text-lg">
            {formatPriceToEn(price)}
          </span>
          <span className="text-neutral-500 text-xs">
            {formatDate(createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}