"use server";

import { getCart } from "@/lib/db/cart";

export async function addToCart(productId: string) {
  /* 
    Don't create a new cart each time the website is visited anonymously
    that will fill the DB with empty anonympus carts,
    instead create one only when an item/product is added to it. 
    */
  const cart = await getCart();
}
