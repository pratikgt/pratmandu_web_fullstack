import { useEffect, useMemo, useState } from "react";

import rest1 from "../assets/rest1.jpg";
import rest2 from "../assets/rest2.jpg";

import dishMomo from "../assets/dish_momo.jpg";
import dishChowmein from "../assets/dish_chowmein.jpg";
import dishDalbhat from "../assets/dish_dalbhat.jpg";
import dishSekuwa from "../assets/dish_sekuwa.jpg";

const mockRestaurants = [
  {
    _id: "r1",
    name: "Himalayan Momo House",
    location: "Kathmandu",
    rating: 4.7,
    coverImage: rest1,
    tags: ["Momo", "Fast", "Budget"],
  },
  {
    _id: "r2",
    name: "Newa Kitchen",
    location: "Patan",
    rating: 4.5,
    coverImage: rest2,
    tags: ["Newari", "Popular", "Spicy"],
  },
];

const mockMenuItems = [
  {
    _id: "m1",
    restaurantId: "r1",
    name: "Steam Momo",
    category: "Momo",
    price: 180,
    image: dishMomo,
    rating: 4.8,
  },
  {
    _id: "m2",
    restaurantId: "r1",
    name: "Chicken Chowmein",
    category: "Chowmein",
    price: 220,
    image: dishChowmein,
    rating: 4.6,
  },
  {
    _id: "m3",
    restaurantId: "r2",
    name: "Dal Bhat Set",
    category: "Dal Bhat",
    price: 280,
    image: dishDalbhat,
    rating: 4.7,
  },
  {
    _id: "m4",
    restaurantId: "r2",
    name: "Buff Sekuwa",
    category: "Sekuwa",
    price: 320,
    image: dishSekuwa,
    rating: 4.9,
  },
];

function fmtRs(n) {
  return `Rs. ${Number(n || 0)}`;
}

export default function Menu() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [dishSearch, setDishSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setRestaurants(mockRestaurants);
    setSelectedRestaurant(mockRestaurants[0]);
  }, []);

  const filteredDishes = useMemo(() => {
    if (!selectedRestaurant) return [];

    let items = mockMenuItems.filter(
      (item) => item.restaurantId === selectedRestaurant._id
    );

    if (dishSearch.trim()) {
      const q = dishSearch.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "priceLow") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      items = [...items].sort((a, b) => b.price - a.price);
    } else {
      items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return items;
  }, [selectedRestaurant, dishSearch, sortBy]);

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-extrabold text-[#1f2937]">Menu</h1>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex h-12 w-full items-center rounded-xl border border-gray-200 bg-white px-4 shadow-sm md:w-[300px]">
              <span className="mr-2 text-sm text-gray-400">⌕</span>
              <input
                type="text"
                placeholder="Search dishes..."
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm outline-none"
            >
              <option value="popular">Sort: Popular</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#1f2937]">Restaurants</h2>

            <div className="space-y-3">
              {restaurants.map((restaurant) => {
                const active = selectedRestaurant?._id === restaurant._id;

                return (
                  <button
                    key={restaurant._id}
                    type="button"
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-[#e1251b] bg-[#fff5f4]"
                        : "border-gray-200 bg-white hover:border-[#e1251b]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-[#1f2937]">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-gray-500">{restaurant.location}</p>
                        <p className="mt-1 text-xs font-semibold text-[#e1251b]">
                          {restaurant.rating}★
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-5 rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <h2 className="text-lg font-bold text-[#1f2937]">
                {selectedRestaurant
                  ? selectedRestaurant.name
                  : "Select a restaurant"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedRestaurant
                  ? `${selectedRestaurant.location} • Rating ${selectedRestaurant.rating}`
                  : "Choose a restaurant from the left side."}
              </p>
            </div>

            <h3 className="mb-4 text-lg font-bold text-[#1f2937]">Dishes</h3>

            {filteredDishes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-[#fafafa] p-5 text-center text-sm text-gray-500">
                No dishes found.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDishes.map((item) => (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-cover"
                    />

                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#1f2937]">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>

                        <span className="rounded-full bg-[#fff1f0] px-2 py-1 text-[11px] font-bold text-[#e1251b]">
                          {item.rating}★
                        </span>
                      </div>

                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-base font-extrabold text-[#e1251b]">
                          {fmtRs(item.price)}
                        </span>
                        <span className="text-xs text-green-600">Available</span>
                      </div>

                      <button
                        type="button"
                        className="w-full rounded-lg bg-[#e1251b] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}