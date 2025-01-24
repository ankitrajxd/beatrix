import React from "react";
import { ProductGrid } from "./ProductGrid";

const ProductsShowcase = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Products</h2>
        <ProductGrid />
      </div>
    </section>
  );
};

export default ProductsShowcase;
