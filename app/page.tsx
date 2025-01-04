import { FeaturedProducts } from "./components/FeaturedProducts";
import HeroSection from "./components/HeroSection";
import ProductsShowcase from "./components/ProductsShowcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroSection />
        <FeaturedProducts />
        <ProductsShowcase />
      </main>
    </div>
  );
}
