const categories = ["All", "Pizza", "Burgers", "Sushi", "Desserts", "Drinks", "Healthy", "Fast Food"];

export default function CategoryScroller() {
  return (
    <div className="flex overflow-x-auto gap-3 py-2 mb-4 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-4 py-2 bg-white text-sm text-secondary rounded-full hover:bg-primary hover:text-white transition-all"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
