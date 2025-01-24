/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "./FeaturedProducts";
import { createClient } from "@/utils/supabase/client";

function ProductCard({ product }: { product: Product }) {
  const [flavors, setFlavors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [dynamicPrice, setDynamicPrice] = useState<number>(product.price);

  // Store all variants to filter dynamically
  const [variants, setVariants] = useState<
    { flavor: string; size: string; price: number }[]
  >([]);

  const fetchProductVariants = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select("flavor, size, price")
      .eq("product_id", product.id);

    if (error) {
      console.error("Error fetching product variants:", error);
      return;
    }

    setVariants(data);

    // Extract unique flavors and sizes
    const uniqueFlavors = Array.from(new Set(data.map((item) => item.flavor)));
    const uniqueSizes = Array.from(new Set(data.map((item) => item.size)));

    setFlavors(uniqueFlavors);
    setSizes(uniqueSizes);

    // Set defaults
    if (uniqueFlavors.length > 0) setSelectedFlavor(uniqueFlavors[0]);
    if (uniqueSizes.length > 0) setSelectedSize(uniqueSizes[0]);

    // Set default price for the first variant
    const defaultVariant = data.find(
      (item) => item.flavor === uniqueFlavors[0] && item.size === uniqueSizes[0]
    );
    setDynamicPrice(defaultVariant?.price || product.price);
  };

  const updateOptions = () => {
    // Filter sizes based on selected flavor
    const validSizes = Array.from(
      new Set(
        variants
          .filter((variant) => variant.flavor === selectedFlavor)
          .map((variant) => variant.size)
      )
    );
    setSizes(validSizes);

    // Adjust selected size if no longer valid
    if (!validSizes.includes(selectedSize)) {
      setSelectedSize(validSizes[0]);
    }

    // Filter flavors based on selected size
    const validFlavors = Array.from(
      new Set(
        variants
          .filter((variant) => variant.size === selectedSize)
          .map((variant) => variant.flavor)
      )
    );
    setFlavors(validFlavors);

    // Adjust selected flavor if no longer valid
    if (!validFlavors.includes(selectedFlavor)) {
      setSelectedFlavor(validFlavors[0]);
    }

    // Update the price for the selected variant
    const selectedVariant = variants.find(
      (variant) =>
        variant.flavor === selectedFlavor && variant.size === selectedSize
    );
    setDynamicPrice(selectedVariant?.price || product.price);
  };

  useEffect(() => {
    fetchProductVariants();
  }, [product.id]);

  useEffect(() => {
    updateOptions();
  }, [selectedFlavor, selectedSize]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden">
        {product.cover_image && (
          <img
            src={product.cover_image}
            alt={product.title}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105 size-auto"
          />
        )}
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center mb-2">
          {product.rating ? (
            <>
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {product.rating.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-600">No Rating</span>
          )}
        </div>
        <p className="text-gray-600 font-medium mb-2">
          ₹{dynamicPrice.toFixed(2)}
        </p>
        {flavors.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor={`flavor-${product.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Flavor
            </label>
            <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
              <SelectTrigger id={`flavor-${product.id}`}>
                <SelectValue placeholder="Select a flavor" />
              </SelectTrigger>
              <SelectContent>
                {flavors.map((flavor) => (
                  <SelectItem key={flavor} value={flavor}>
                    {flavor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {sizes.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor={`size-${product.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Size
            </label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger id={`size-${product.id}`}>
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Link
          href={`/product/${product.id}?flavor=${selectedFlavor}&size=${selectedSize}`}
          className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
