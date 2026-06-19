import { mockRestaurants } from "@/lib/mockRestaurants";
import RestaurantPicker from "@/components/RestaurantPicker";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        Date Night Roulette
      </h1>
      <RestaurantPicker restaurants={mockRestaurants} />
    </div>
  );
}
