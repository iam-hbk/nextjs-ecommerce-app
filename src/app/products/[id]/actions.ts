"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function addProductToCart(productId: string) {
  /* 
    Don't create a new cart each time the website is visited anonymously
    that will fill the DB with empty anonympus carts,
    instead create one only when an item/product is added to it. 
    */
  const cart = (await getCart()) ?? (await createCart());

  /* check if the item is already in the cart before deciding to add it or update it */
  const itemsInCart = cart.items.find((item) => item.productID == productId);
  if (itemsInCart) {
    await prisma.cartItem.update({
      where: {
        id: itemsInCart.id,
      },
      data: {
        quantity: { increment: 1 },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartID: cart.id,
        productID: productId,
        quantity: 1,
      },
    });
  }
  /* Because this is a server component, we don't have state... redux or useState are not there
so we can't refresh the page or update the new values/ the UI (e.g cart in the navbar )
we use the revalidatePath() f(x) to refresh the page
*/
  revalidatePath("/products/[id]"); //it contains the path not the URL
  revalidatePath("/cart")
}
