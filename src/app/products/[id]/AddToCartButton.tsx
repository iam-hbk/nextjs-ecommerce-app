"use client";

import React from "react";
import { BsCart4 } from "react-icons/bs";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <button className="btn-primary btn" onClick={() => {}}>
        Add to Cart
        <BsCart4 size={20} />
      </button>
    </div>
  );
}
