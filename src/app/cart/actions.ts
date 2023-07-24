"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function setProductQty(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await createCart());

  const itemsInCart = cart.items.find((item) => item.productID == productId);

  /*
    now if the product quantity is set to 0, it should be removed from the cart
    TODO:  Add a REMOVE button to the product UI also which will execute the same function with usecase of 0
    if the product is already in the cart and qty is not 0, then update it the qty
    if the product is not in the cart and the qty is > than 0 then create a new one
  */
  if (quantity === 0) {
    if (itemsInCart) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            delete: { id: itemsInCart.id },
          },
        },
      });
    }
  } else {
    if (itemsInCart) {
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            update: { where: { id: itemsInCart.id }, data: { quantity } },
          },
        },
      });
    } else {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            create: { productID: productId, quantity },
          },
        },
      });
    }
  }
  revalidatePath("/cart");
}
