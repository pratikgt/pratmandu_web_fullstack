import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

import rest1 from "../assets/rest1.jpg";
import rest2 from "../assets/rest2.jpg";

import dishMomo from "../assets/dish_momo.jpg";
import dishChowmein from "../assets/dish_chowmein.jpg";
import dishDalbhat from "../assets/dish_dalbhat.jpg";
import dishSekuwa from "../assets/dish_sekuwa.jpg";

export default function Menu() {
  const [cartCount, setCartCount] = useState(2);

  const restaurants = useMemo(
    () => [
      {
        id: "r1",
        name: "Himalayan Momo House",
        rating: 4.7,
        city: "Kathmandu",
        banner: rest1,
        tags: ["Momo", "Fast", "Budget"],
      },
      {
        id: "r2",
        name: "Newa Kitchen",
        rating: 4.5,
        city: "Patan",
        banner: rest2,
        tags: ["Newari", "Spicy", "Combo"],
      },
    ],
    []
  );

  const dishesByRestaurant = useMemo(
    () => ({
      r1: [
        { title: "Buff Momo", price: 180, rating: 4.6, img: dishMomo, category: "Momo" },
        { title: "Chicken Chowmein", price: 150, rating: 4.5, img: dishChowmein, category: "Chowmein" },
        { title: "Veg Dal Bhat", price: 200, rating: 4.7, img: dishDalbhat, category: "Dal Bhat" },
      ],
      r2: [
        { title: "Paneer Sekuwa", price: 220, rating: 4.4, img: dishSekuwa, category: "Sekuwa" },
        { title: "Veg Dal Bhat", price: 210, rating: 4.6, img: dishDalbhat, category: "Dal Bhat" },
        { title: "Chicken Chowmein", price: 170, rating: 4.4, img: dishChowmein, category: "Chowmein" },
      ],
    }),
    []
  );

  const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId);
  const dishesRaw = dishesByRestaurant[activeRestaurantId] || [];

  const dishes = useMemo(() => {
    let list = [...dishesRaw];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [dishesRaw, search, sort]);

  const addToCart = () => setCartCount((c) => c + 1);

  return (
    <div className="page">
      <main className="container pagepad">
        <div className="menuTop">
          <h2 className="section__title" style={{ margin: 0 }}>
            Menu
          </h2>

          <div className="menuControls">
            <div className="menuSearch">
              <span className="menuSearch__icon">⌕</span>
              <input
                className="menuSearch__input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
              />
            </div>

            <select
              className="menuSelect"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Sort: Popular</option>
              <option value="rating">Sort: Rating</option>
              <option value="priceLow">Sort: Price (Low)</option>
              <option value="priceHigh">Sort: Price (High)</option>
            </select>
          </div>
        </div>

        <div className="menuLayout">
          <aside className="menuSide">
            <div className="menuSide__title">Restaurants</div>

            <div className="restList">
              {restaurants.map((r) => {
                const active = r.id === activeRestaurantId;

                return (
                  <button
                    key={r.id}
                    className={active ? "restItem active" : "restItem"}
                    onClick={() => setActiveRestaurantId(r.id)}
                  >
                    <div className="restItem__thumb">
                      <img src={r.banner} alt={r.name} />
                    </div>

                    <div className="restItem__info">
                      <div className="restItem__name">{r.name}</div>

                      <div className="restItem__meta">
                        <span className="restItem__star">★</span>
                        <span>{r.rating}</span>
                        <span className="restItem__dot">•</span>
                        <span>{r.city}</span>
                      </div>

                      <div className="restItem__tags">
                        {r.tags.slice(0, 3).map((t) => (
                          <span key={t} className="pill">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="menuMain">
            <div className="menuBanner">
              <img
                className="menuBanner__img"
                src={activeRestaurant.banner}
                alt={activeRestaurant.name}
              />

              <div className="menuBanner__overlay" />

              <div className="menuBanner__content">
                <div className="menuBanner__name">
                  {activeRestaurant.name}
                </div>

                <div className="menuBanner__meta">
                  <span className="menuBanner__star">★</span>
                  <span>{activeRestaurant.rating}</span>
                  <span className="menuBanner__dot">•</span>
                  <span>{activeRestaurant.city}</span>
                </div>

                <div className="menuBanner__note">
                  Pick your dish and add to cart.
                </div>
              </div>
            </div>

            <div className="menuSectionTitle">Dishes</div>

            {dishes.length === 0 ? (
              <div className="emptyBox">
                No dishes found. Try different search.
              </div>
            ) : (
              <div className="grid grid--4 menuGrid">
                {dishes.map((p) => (
                  <ProductCard
                    key={p.title + p.price}
                    title={p.title}
                    price={p.price}
                    rating={p.rating}
                    image={p.img}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}