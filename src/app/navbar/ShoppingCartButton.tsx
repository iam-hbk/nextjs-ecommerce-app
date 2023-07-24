"use client";
import { ShoppingCart } from "@/lib/db/cart";
import { formaPrice } from "@/lib/format";
import Link from "next/link";
import React from "react";
import { BsCart4 } from "react-icons/bs";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  function closeDropDown() {
    const elem = document.activeElement as HTMLElement;
    if (elem) elem.blur();
  }
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="btn-ghost btn-circle btn">
        <div className="indicator">
          <BsCart4 size={24} />
          <span className="badge badge-sm indicator-item bg-gray-950 text-gray-50 py-3 ">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-30 mt-3 w-[25vw] min-w-[200px] bg-primary text-primary-content shadow-xl"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text">
            Subtotal: {formaPrice(cart?.subtotal || 0)}
          </span>
          <div className="card-actions">
            <Link
              href={"/cart"}
              className="btn-secondary btn-block btn"
              onClick={closeDropDown}
            >
              View cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
