import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

import rest1 from "../assets/rest1.jpg";
import rest2 from "../assets/rest2.jpg";

import dishMomo from "../assets/dish_momo.jpg";
import dishChowmein from "../assets/dish_chowmein.jpg";
import dishDalbhat from "../assets/dish_dalbhat.jpg";
import dishSekuwa from "../assets/dish_sekuwa.jpg";

function pickDishImg(cat) {
  const c = String(cat || "").toLowerCase();
  if (c.includes("momo")) return dishMomo;
  if (c.includes("chow")) return dishChowmein;
  if (c.includes("dal")) return dishDalbhat;
  if (c.includes("sekuwa")) return dishSekuwa;
  return dishMomo;
}

function pickRestBanner(idx, coverImage) {
  if (coverImage) return coverImage;
  return idx % 2 === 0 ? rest1 : rest2;
}

export default function Menu() {
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurantId, setActiveRestaurantId] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  const [loadingR, setLoadingR] = useState(false);
  const [loadingM, setLoadingM] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRestaurants = async () => {
      try {
        setErr("");
        setLoadingR(true);
        const { data } = await api.get("/restaurants");

        const list = Array.isArray(data?.restaurants) ? data.restaurants : [];
        const mapped = list.map((r, idx) => ({
          _id: r._id,
          name: r.name,
          rating: typeof r.rating === "number" ? r.rating : 4.5,
          city: r.location || r.city || "Kathmandu",
          banner: pickRestBanner(idx, r.coverImage),
          tags: Array.isArray(r.tags) ? r.tags : [],
        }));

        if (!mounted) return;
        setRestaurants(mapped);
        if (mapped[0]?._id) setActiveRestaurantId(mapped[0]._id);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load restaurants");
      } finally {
        if (!mounted) return;
        setLoadingR(false);
      }
    };

    loadRestaurants();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMenu = async () => {
      if (!activeRestaurantId) return;

      try {
        setErr("");
        setLoadingM(true);

        const { data } = await api.get(`/menu?restaurantId=${activeRestaurantId}`);
        const list = Array.isArray(data?.menu) ? data.menu : [];

        const mapped = list.map((m) => ({
          _id: m._id,
          name: m.name,
          price: Number(m.price ?? 0),
          rating: typeof m.rating === "number" ? m.rating : undefined,
          category: m.category || "Food",
          image: m.image || pickDishImg(m.category),
          restaurantId: m.restaurantId || activeRestaurantId,
        }));

        if (!mounted) return;
        setMenuItems(mapped);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Failed to load menu");
        setMenuItems([]);
      } finally {
        if (!mounted) return;
        setLoadingM(false);
      }
    };

    loadMenu();

    return () => {
      mounted = false;
    };
  }, [activeRestaurantId]);

  const activeRestaurant = restaurants.find((r) => r._id === activeRestaurantId);

  const dishes = useMemo(() => {
    let list = [...menuItems];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          String(d.name).toLowerCase().includes(q) ||
          String(d.category).toLowerCase().includes(q)
      );
    }

    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [menuItems, search, sort]);

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

        {err ? (
          <div className="emptyBox" style={{ borderColor: "#ef4444", color: "#b91c1c" }}>
            {err}
          </div>
        ) : null}

        <div className="menuLayout">
          <aside className="menuSide">
            <div className="menuSide__title">Restaurants</div>

            {loadingR ? (
              <div className="emptyBox">Loading restaurants...</div>
            ) : restaurants.length === 0 ? (
              <div className="emptyBox">No restaurants found.</div>
            ) : (
              <div className="restList">
                {restaurants.map((r) => {
                  const active = r._id === activeRestaurantId;

                  return (
                    <button
                      key={r._id}
                      className={active ? "restItem active" : "restItem"}
                      onClick={() => setActiveRestaurantId(r._id)}
                      type="button"
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
                          {(r.tags || []).slice(0, 3).map((t) => (
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
            )}
          </aside>

          <section className="menuMain">
            {activeRestaurant ? (
              <div className="menuBanner">
                <img
                  className="menuBanner__img"
                  src={activeRestaurant.banner}
                  alt={activeRestaurant.name}
                />

                <div className="menuBanner__overlay" />

                <div className="menuBanner__content">
                  <div className="menuBanner__name">{activeRestaurant.name}</div>

                  <div className="menuBanner__meta">
                    <span className="menuBanner__star">★</span>
                    <span>{activeRestaurant.rating}</span>
                    <span className="menuBanner__dot">•</span>
                    <span>{activeRestaurant.city}</span>
                  </div>

                  <div className="menuBanner__note">Pick your dish and add to cart.</div>
                </div>
              </div>
            ) : (
              <div className="emptyBox">Select a restaurant to view menu.</div>
            )}

            <div className="menuSectionTitle">Dishes</div>

            {loadingM ? (
              <div className="emptyBox">Loading dishes...</div>
            ) : dishes.length === 0 ? (
              <div className="emptyBox">No dishes found. Try different search.</div>
            ) : (
              <div className="grid grid--4 menuGrid">
                {dishes.map((p) => (
                  <ProductCard
                    key={p._id}
                    item={{
                      ...p,
                      restaurantName: activeRestaurant?.name,
                    }}
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