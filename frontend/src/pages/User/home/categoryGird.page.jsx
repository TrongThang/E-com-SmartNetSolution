import { Link } from "react-router-dom";

export default function CategoryGrid({ categories = [], columns = 5 }) {

  const normalizedImage = (image) => {
    const normalizedImage = image
      ? image.startsWith("data:image")
        ? image
        : image.startsWith("http")
          ? image
          : `data:image/jpeg;base64,${image}`
      : null
    return normalizedImage
  }
  
  return (
    <div
      className="grid gap-5 flex justify-center items-center  "
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {categories.map((category, index) => (
        <Link to={`/search?category=${category.category_id}`} key={index} className="group">
          <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100 hover:scale-105">
            <div className="mb-3 rounded-full bg-blue-50 p-4">
              <img
                src={normalizedImage(category.image)}
                alt={category.name}
                className="h-12 w-12 object-contain"
              />
            </div>
            <span className="text-center text-sm font-medium text-gray-700 group-hover:text-blue-600">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}