"use client";

import { useEffect, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import ProductCard from "./ProductCard";
import { Product } from "./FeaturedProducts";

export function ProductGrid() {
  const [products, setProducts] = useState([] as Product[]);
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter((category): category is string => category !== undefined)
    ),
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileCategory, setMobileCategory] = useState("All");

  // Fetching data from Supabase
  useEffect(() => {
    async function getProducts() {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*");
      setProducts(data ?? []);
    }
    getProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
        <div className="hidden md:block">
          <CategoryFilter
            categories={categories}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="md:hidden">
          <Select
            value={mobileCategory}
            onValueChange={(value) => {
              setMobileCategory(value);
              setSelectedCategory(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
