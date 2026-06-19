"use client";

import { useMemo, useState } from "react";
import {
  formatCuisine,
  formatPriceLevel,
  PRICE_LEVELS_IN_ORDER,
} from "@/lib/restaurantDisplay";
import Wheel from "@/components/Wheel";

type Restaurant = {
  id: string;
  displayName: { text: string; languageCode: string };
  types: string[];
  priceLevel: string;
  rating: number;
  location: { latitude: number; longitude: number };
  dineIn: boolean;
  takeout: boolean;
};

export default function RestaurantPicker({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const cuisineOptions = useMemo(
    () =>
      Array.from(new Set(restaurants.map((r) => formatCuisine(r.types)))).sort(),
    [restaurants]
  );

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [maxPriceIndex, setMaxPriceIndex] = useState(
    PRICE_LEVELS_IN_ORDER.length - 1
  );
  const [requireDineIn, setRequireDineIn] = useState(false);
  const [requireTakeout, setRequireTakeout] = useState(false);

  function toggleCuisine(cuisine: string) {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisine = formatCuisine(restaurant.types);
    const matchesCuisine =
      selectedCuisines.length === 0 || selectedCuisines.includes(cuisine);
    const priceIndex = PRICE_LEVELS_IN_ORDER.indexOf(restaurant.priceLevel);
    const matchesPrice = priceIndex <= maxPriceIndex;
    const matchesDineIn = !requireDineIn || restaurant.dineIn;
    const matchesTakeout = !requireTakeout || restaurant.takeout;
    return matchesCuisine && matchesPrice && matchesDineIn && matchesTakeout;
  });

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="w-full max-w-2xl">
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/50">
          Filters
        </h2>

        <div className="mb-8 flex flex-col items-center">
          <p className="mb-3 text-lg font-semibold">Max price</p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRICE_LEVELS_IN_ORDER.map((level, index) => (
              <button
                key={level}
                type="button"
                onClick={() => setMaxPriceIndex(index)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  index <= maxPriceIndex
                    ? "border-[#CC785C] bg-[#CC785C] text-white"
                    : "border-white/20 text-white/60"
                }`}
              >
                {formatPriceLevel(level)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-3 text-lg font-semibold">Cuisine</p>
          <div className="flex flex-wrap justify-center gap-2">
            {cuisineOptions.map((cuisine) => {
              const isSelected = selectedCuisines.includes(cuisine);
              return (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    isSelected
                      ? "border-[#CC785C] bg-[#CC785C] text-white"
                      : "border-white/20 text-white/60"
                  }`}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            {selectedCuisines.length === 0
              ? "No cuisine selected = all cuisines included."
              : `${selectedCuisines.length} cuisine(s) selected.`}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="mb-3 text-lg font-semibold">Service</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setRequireDineIn((prev) => !prev)}
              className={`rounded-full border px-3 py-1 text-sm ${
                requireDineIn
                  ? "border-[#CC785C] bg-[#CC785C] text-white"
                  : "border-white/20 text-white/60"
              }`}
            >
              Dine-in
            </button>
            <button
              type="button"
              onClick={() => setRequireTakeout((prev) => !prev)}
              className={`rounded-full border px-3 py-1 text-sm ${
                requireTakeout
                  ? "border-[#CC785C] bg-[#CC785C] text-white"
                  : "border-white/20 text-white/60"
              }`}
            >
              Takeout
            </button>
          </div>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <p className="text-sm text-white/50">
          No restaurants match your filters. Try widening them.
        </p>
      ) : (
        <Wheel restaurants={filteredRestaurants} />
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <h2 className="text-lg font-medium">
              {restaurant.displayName.text}
            </h2>
            <p className="text-sm text-white/60">
              {formatCuisine(restaurant.types)}
            </p>
            <p className="mt-2 text-sm">
              {formatPriceLevel(restaurant.priceLevel)} · ⭐ {restaurant.rating}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {[
                restaurant.dineIn && "Dine-in",
                restaurant.takeout && "Takeout",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
