import { getCart } from "@/lib/db/cart";
import React from "react";
import CartEntry from "./CartEntry";
import { setProductQty } from "./actions";
import { formaPrice } from "@/lib/format";

type Props = {};

export const metadata = {
  title: "Your cart - TecH BK",
};

export default async function CartPage({}: Props) {
  const cart = await getCart();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((item) => (
        <CartEntry
          setProductQuantity={setProductQty}
          cartItem={item}
          key={item.id}
        />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total:{formaPrice(cart?.subtotal || 0)}
        </p>
        <button className="btn-primary btn sm:w-[200px]">Checkout</button>
      </div>
    </div>
  );
}
