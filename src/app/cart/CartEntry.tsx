"use client";
import { CartItemWithProduct } from "@/lib/db/cart";
import { formaPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import React, { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const qtyOptions: JSX.Element[] = [];
  for (let i = 1; i <= 19; i++) {
    qtyOptions.push(
      <option className="p-2" value={i} key={i}>
        {i}
      </option>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link href={`/products/${product.id}`} className="font-bold">
            {product.name}
          </Link>
          <div>Price: {formaPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-4">
            Quantity:
            <select
              className="select-bordered select w-full max-w-[80px] "
              defaultValue={quantity}
              onChange={(e) => {
                const newQty = parseInt(e.currentTarget.value);

                startTransition(async () => {
                  await setProductQuantity(product.id, newQty);
                });
              }}
            >
              <option value={0}>0 (remove)</option>
              {qtyOptions}
            </select>
          </div>
          <div className="flex items-center gap-3">
            Total:{" "}
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              formaPrice(product.price * quantity)
            )}
          </div>
          {/* No need for a success text because we see the value being updated in the dropdown by the DOM. a loading state is enough */}
          {}
        </div>
      </div>
      {/* <button className="btn-error btn self-end">Remove</button> */}
      <div className="divider" />
    </div>
  );
}
