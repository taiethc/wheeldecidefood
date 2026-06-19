import { mockRestaurants } from "@/lib/mockRestaurants";
import { formatCuisine, formatPriceLevel } from "@/lib/restaurantDisplay";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        Date Night Roulette
      </h1>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <h2 className="text-lg font-medium">
              {restaurant.displayName.text}
            </h2>
            <p className="text-sm text-gray-600">
              {formatCuisine(restaurant.types)}
            </p>
            <p className="mt-2 text-sm">
              {formatPriceLevel(restaurant.priceLevel)} · ⭐ {restaurant.rating}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
