import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartwithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartwithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  let cart: CartwithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: {
            id: localCartId,
          },
          include: {
            items: {
              include: { product: true },
            },
          },
        })
      : null;
  }

  if (!cart) return null;
  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);
  let newCart: Cart;

  //the above type `Cart` is the same we get below in `prisma.cart.create()` , which is an unpopulated cart
  if (session) {
    newCart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
    //Note: should encrypt the cookie in production
    cookies().set("localCartId", newCart.id);
  }

  return {
    ...newCart,
    size: 0,
    items: [],
    subtotal: 0,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  /* A DB transaction is process where you can do multiple operations but if one of them fails 
  the whole transaction will be rolled back and none of the changes will be applied  */

  // tx below is a prisma client refered as the transaction
  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(userCart.items, localCart.items);

      // delete existing cart of this user to replace it with mergedCartItems
      await tx.cartItem.deleteMany({
        where: { cartID: userCart.id },
      });

      // creating a new cart with the following items, keeping the old IDs !
      //VERY IMPORTANT
      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => ({
          cartID: userCart.id, //the anonymous cart didn't have an ID (since it was local) now it take the id of the cart from the DB
          productID: item.productID,
          quantity: item.quantity,
        })),
      });
    } else {
      // migrating that local cart to the DB (because now there's a user logged in)
      await tx.cart.create({
        data: {
          userId: userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productID: item.productID,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    //
    await tx.cart.delete({
      where: { id: localCartId },
    });
    //deleting the local cart cookie
    cookies().set("localCartId", "");
  });
}

/* 
Using a reducer like this could have worked but has a time complexity of O(n^2)
Which will become slow on large data... Always use performant algorithms in case the data scales.
 */
function mergeCartItems(...cartItems: CartItem[][]) {
  /**
   * This function merges two or multiple carts together
   *
   * @params array of cartItems [[],[],[],...]
   * @returns a new cartItem
   */

  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productID === item.productID);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}

/* This function uses an algorithm of constant time complexity O(n) making it more performant */
// function mergeCartItems(...cartItems: CartItem[][]): CartItem[] {
//   /**
//    * This function merges two or multiple carts together
//    *
//    * @params array of cartItems [[],[],[],...]
//    * @returns a new cartItem
//    */

//   const mergedItems: { [productID: string]: CartItem } = {};

//   cartItems.forEach((items) => {
//     items.forEach((item) => {
//       const existingItem = mergedItems[item.productID];
//       if (existingItem) {
//         existingItem.quantity += item.quantity;
//       } else {
//         mergedItems[item.productID] = { ...item };
//       }
//     });
//   });

//   return Object.values(mergedItems);
// }
