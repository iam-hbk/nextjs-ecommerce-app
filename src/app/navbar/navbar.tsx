import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/Logo.svg";
// import logoText from "@/assets/logo text.svg";
import { Jomhuria } from "next/font/google";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/db/cart";
import ShoppingCartButton from "./ShoppingCartButton";

const jomhuria = Jomhuria({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

async function searchProducts(formData: FormData) {
  "use server";
  const searchQuery = formData.get("searchQuery")?.toString();
  if (searchQuery) {
    redirect(`/search?query=${searchQuery}`);
  }
}

export default async function Navbar() {
  const cart = await getCart();
  return (
    <div className="bg-base-100 shadow-lg">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link
            href="/"
            className="btn-ghost btn flex h-fit flex-row  gap-2 py-2"
          >
            <Image
              src={logo}
              height={110}
              width={110}
              className="max-w-[75px] rounded-full"
              alt="TecH BK"
            />
            <span
              className={`inline text-7xl normal-case  ${jomhuria.className}`}
            >
              Tec
              <span className="inline text-primary">H BK</span>
            </span>
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                placeholder="Search"
                name="searchQuery"
                className="input-bordered input w-full min-w-[100px] text-base"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
        </div>
      </div>
    </div>
  );
}
