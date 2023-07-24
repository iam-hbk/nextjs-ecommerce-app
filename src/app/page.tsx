import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  // to get the search params in nextJS this param should be exactly spelt like below
  searchParams: { page: string };
}

export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currentPage = parseInt(page);

  const pageSize = 6; //number of items per page
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  if (products.length < 1) {
    return (
      <div className="bg-error text-error-content">
        There nothing to show here
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      {currentPage === 1 && (
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
      )}

      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
