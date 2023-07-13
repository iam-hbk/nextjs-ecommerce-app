import FormSubmitButton from "@/components/Button";
import { prisma } from "@/lib/db/prisma";
import { error } from "console";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Product - TecHBK",
};

async function addProduct(formData: FormData) {
  "use server";
  
  const name = formData.get("name")?.toString();
  const desc = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);
  
  if (!name || !desc || !imageUrl || !price)
    throw Error("Please fill in all the required fields !");
  await prisma.product.create({
    data: {
      name,
      description: desc,
      imageUrl,
      price,
    },
  });

  // redirect("/");
}
export default function AddProductPage() {
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add products</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="input-bordered input mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="textarea-bordered textarea w-full"
        ></textarea>
        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="url"
          className="input-bordered input mb-3 w-full"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="input-bordered input mb-3 w-full"
        />
        <FormSubmitButton className="btn-block">
          Add Product
        </FormSubmitButton>
      </form>
    </div>
  );
}
