/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ImageGallery } from "@/app/components/ImageGallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params); // Unwrap the params Promise
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);

  const fetchProductDetails = async () => {
    const supabase = createClient();
    const productId = resolvedParams.id;

    try {
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          "id, title, price, description, category, rating, detailed_description, cover_image"
        )
        .eq("id", productId)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        return;
      }

      // Fetch product images
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId);

      if (imageError) {
        console.error("Error fetching product images:", imageError);
      }

      // Fetch product variants (flavors and sizes)
      const { data: variantData, error: variantError } = await supabase
        .from("product_variants")
        .select("flavor, size, price")
        .eq("product_id", productId);

      if (variantError) {
        console.error("Error fetching product variants:", variantError);
      }

      // Set product details
      setProduct({
        id: productData.id,
        name: productData.title,
        price: productData.price,
        description: productData.detailed_description,
        category: productData.category,
        rating: productData.rating,
        coverImage: productData.cover_image,
      });

      // Set images, flavors, sizes
      setImages(imageData?.map((img: any) => img.image_url) || []);
      const uniqueFlavors = Array.from(
        new Set(variantData?.map((variant: any) => variant.flavor) || [])
      );
      const uniqueSizes = Array.from(
        new Set(variantData?.map((variant: any) => variant.size) || [])
      );

      setFlavors(uniqueFlavors);
      setSizes(uniqueSizes);

      // Set default flavor and size
      const initialFlavor =
        searchParams.get("flavor") || uniqueFlavors[0] || "";
      const initialSize = searchParams.get("size") || uniqueSizes[0] || "";
      setSelectedFlavor(initialFlavor);
      setSelectedSize(initialSize);

      // Update dynamic price if initial flavor/size is selected
      if (initialFlavor && initialSize) {
        const matchingVariant = variantData?.find(
          (variant: any) =>
            variant.flavor === initialFlavor && variant.size === initialSize
        );
        setDynamicPrice(matchingVariant?.price || productData.price);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const updateDynamicPrice = async () => {
    const supabase = createClient();
    const productId = resolvedParams.id;

    try {
      const { data: variantData, error: variantError } = await supabase
        .from("product_variants")
        .select("price")
        .eq("product_id", productId)
        .eq("flavor", selectedFlavor)
        .eq("size", selectedSize)
        .single();

      if (variantError) {
        console.error("Error fetching variant price:", variantError);
        setDynamicPrice(product?.price || null); // Fallback to base price
      } else {
        setDynamicPrice(variantData?.price || product?.price || null);
      }
    } catch (error) {
      console.error("Error updating dynamic price:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  useEffect(() => {
    if (selectedFlavor && selectedSize) {
      updateDynamicPrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlavor, selectedSize]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageGallery
                images={images.length > 0 ? images : [product.coverImage]}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-gray-600 mb-2">
                ₹
                {dynamicPrice !== null
                  ? dynamicPrice.toFixed(2)
                  : product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Category: {product.category}
              </p>
              <div className="flex items-center mb-6">
                <p className="text-sm font-semibold text-yellow-500 mr-2">
                  {product.rating
                    ? `Rating: ${product.rating.toFixed(1)}`
                    : "No Rating"}
                </p>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              <div className="sm:flex sm:flex-row flex-col items-start sm:items-center mb-6 gap-4">
                {flavors.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Flavor
                    </h2>
                    <Select
                      value={selectedFlavor}
                      onValueChange={setSelectedFlavor}
                    >
                      <SelectTrigger className="w-full">
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
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Size
                    </h2>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger className="w-full">
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
              </div>
              <Button className="w-full">Add to Cart</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
