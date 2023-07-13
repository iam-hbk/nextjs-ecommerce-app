import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  if (products.length < 1) {
    return (
      <div className="bg-error text-error-content">
        There nothing to show here
        {JSON.stringify(products)}
      </div>
    );
  }
  return (
    <div>
      <div className="hero rounded-xl  bg-gradient-to-tr from-blue-900 to-blue-300 py-5">
        <div className="bg-blur hero-content  flex-col rounded-xl border  border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-lg backdrop-blur-xl lg:flex-row">
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            width={400}
            height={800}
            className="w-full max-w-xs rounded-lg  shadow-2xl "
            priority
          />
          <div>
            <h1 className="text-5xl font-bold text-primary-content">
              {products[0].name}
            </h1>
            <p className="py-6 text-primary-content">
              {products[0].description}
            </p>
            <Link
              href={"/products/" + products[0].id}
              className="btn-primary btn"
            >
              Check it out
            </Link>
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.slice(1).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
