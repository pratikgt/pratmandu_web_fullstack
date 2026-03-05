import { useMemo } from "react";
import ProductCard from "../components/ProductCard";

import heroBg from "../assets/hero.jpg";

import catMomo from "../assets/momo.png";
import catDalbhat from "../assets/dalbhat.png";
import catChowmein from "../assets/chowmein.png";
import catSekuwa from "../assets/sekuwa.png";
import catSnacks from "../assets/snacks.png";
import catDrinks from "../assets/drinks.png";

import dishMomo from "../assets/dish_momo.jpg";
import dishChowmein from "../assets/dish_chowmein.jpg";
import dishDalbhat from "../assets/dish_dalbhat.jpg";
import dishSekuwa from "../assets/dish_sekuwa.jpg";

import rest1 from "../assets/rest1.jpg";
import rest2 from "../assets/rest2.jpg";

export default function Home() {
  const categories = useMemo(
    () => [
      { name: "Momo", img: catMomo },
      { name: "Dal Bhat", img: catDalbhat },
      { name: "Chowmein", img: catChowmein },
      { name: "Sekuwa", img: catSekuwa },
      { name: "Snacks", img: catSnacks },
      { name: "Drinks", img: catDrinks },
    ],
    []
  );

  const popular = useMemo(
    () => [
      { id: "p-buff-momo", title: "Buff Momo", price: 180, rating: 4.6, image: dishMomo, category: "Momo" },
      { id: "p-chowmein", title: "Chicken Chowmein", price: 150, rating: 4.5, image: dishChowmein, category: "Chowmein" },
      { id: "p-dalbhat", title: "Veg Dal Bhat", price: 200, rating: 4.7, image: dishDalbhat, category: "Dal Bhat" },
      { id: "p-sekuwa", title: "Paneer Sekuwa", price: 220, rating: 4.4, image: dishSekuwa, category: "Sekuwa" },
    ],
    []
  );

  const restaurants = useMemo(
    () => [
      { name: "Himalayan Momo House", rating: 4.7, city: "Kathmandu", img: rest1 },
      { name: "Newa Kitchen", rating: 4.5, city: "Patan", img: rest2 },
    ],
    []
  );

  return (
    <div className="page">
      <main>
        <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="hero__overlay" />
          <div className="container hero__content">
            <div className="hero__left">
              <h1 className="hero__headline">
                Order Food in <br />
                <span className="hero__accent">Kathmandu Instantly</span>
              </h1>
              <p className="hero__sub">Fresh meals from your favorite restaurants</p>
              <button className="btn btn--cta" type="button">
                Order Now
              </button>
            </div>

            <div className="hero__right">
              <div className="hero__plateRow">
                <div className="hero__plateShadow" />
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section__title">Categories</h2>
            <div className="cats">
              {categories.map((c) => (
                <button key={c.name} className="cat" type="button">
                  <img className="cat__img" src={c.img} alt={c.name} />
                  <div className="cat__name">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <h2 className="section__title">Popular Dishes</h2>
            <div className="grid grid--4">
              {popular.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <h2 className="section__title">Featured Restaurants</h2>

            <div className="grid grid--2">
              {restaurants.map((r) => (
                <div key={r.name} className="rest">
                  <img className="rest__img" src={r.img} alt={r.name} />
                  <div className="rest__overlay" />
                  <div className="rest__content">
                    <div className="rest__name">{r.name}</div>
                    <div className="rest__meta">
                      <span className="rest__star">★</span>
                      <span>{r.rating}</span>
                      <span className="rest__dot">•</span>
                      <span>{r.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}