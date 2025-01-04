/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  rating?: number;
  tags: string[];
  cover_image?: string;
  available_on: string[];
  certification?: string;
  in_stock: boolean;
  sizes?: string;
  created_at: string;
  detailed_description: string;
  usage: string[];
  benefits: string[];
};

export type FeaturedProduct = {
  position: number;
  products: Product; // This remains as a single Product
};

export async function FeaturedProducts() {
  // Create a Supabase client instance
  const supabase = await createClient();

  // Fetch featured products with their corresponding product details
  const { data, error } = await supabase
    .from("featured_products")
    .select(
      `
      position,
      products:products (
        id,
        title,
        description,
        price,
        category,
        rating,
        tags,
        cover_image,
        available_on,
        certification,
        in_stock,
        sizes,
        created_at,
        detailed_description,
        usage,
        benefits
      )
    `
    )
    .order("position", { ascending: true }); // Order by position for featured products

  if (error) {
    console.error("Error fetching featured products:", error);
    return null; // Handle error gracefully
  }

  // Ensure the returned data matches the expected type
  const featuredProducts = (data || []).map((item) => ({
    position: item.position,
    products: item.products as unknown as Product, // Explicitly cast the nested object to Product type
  })) as FeaturedProduct[];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-green-600">Trending</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-12">
          {featuredProducts.map((featuredProduct) => {
            const product = featuredProduct.products;
            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-2">
                  <div className="relative h-72 w-full overflow-hidden">
                    <img
                      src={product.cover_image || "/placeholder.png"}
                      alt={product.title}
                      className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {product.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-600">
                        {product.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ₹ {product.price.toFixed(2)}
                    </p>
                    <div className="mt-4 text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors duration-300">
                      View Product &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
