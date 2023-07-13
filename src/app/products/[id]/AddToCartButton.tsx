"use client";

import React, { useState, useTransition } from "react";
import { BsCart4 } from "react-icons/bs";

interface AddToCartButtonProps {
  productId: string;
  addToCartFx: (product: string) => Promise<void>; //Promise because that's an async function
}

/*
 The server action *addToCart* would be called here but there is currently a BUG preventing that from NEXT devs
 when combined with Authentication. instead we will call it in the parent component (page) of this component and pass it 
 as a param.
*/

export default function AddToCartButton({
  productId,
  addToCartFx,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  /* The useTransition hook is used because when you call a server action in a client component
  there are some unfriendly behaviour that can occur when there is an error, the hook sets
  a boundary of the error to this component
            - @timneutkens - Next.js lead Dev on Twitter
  */
  const [success, setSuccess] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn-primary btn"
        onClick={() => {
          setSuccess(false);
          startTransition(async () => {
            await addToCartFx(productId);
            setSuccess(true);
          });
        }}
      >
        Add to Cart
        <BsCart4 size={20} />
      </button>
      {isPending && <span className="loading loading-spinner loading-md" />}
      {!isPending && success && (
        <span className="text-success">Added to Cart.</span>
      )}
    </div>
  );
}
