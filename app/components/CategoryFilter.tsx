import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export function CategoryFilter({
  categories,
  onSelectCategory,
  selectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === "All" ? "default" : "outline"}
        onClick={() => onSelectCategory("All")}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
