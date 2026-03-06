// Restaurant controller
import * as RestaurantModule from "../models/Restaurant.js";

const Restaurant = RestaurantModule.default || RestaurantModule.Restaurant;

export async function listRestaurants(req, res) {
  try {
    const items = await Restaurant.find().sort({ createdAt: -1 });
    return res.json({ restaurants: items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load restaurants" });
  }
}

export async function getRestaurant(req, res) {
  try {
    const { id } = req.params;
    const item = await Restaurant.findById(id);
    if (!item) return res.status(404).json({ message: "Restaurant not found" });
    return res.json({ restaurant: item });
  } catch (err) {
    return res.status(400).json({ message: "Invalid restaurant id" });
  }
}

export async function createRestaurant(req, res) {
  try {
    const { name, location, rating, coverImage } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "name and location required" });
    }

    const created = await Restaurant.create({
      name: String(name).trim(),
      location: String(location).trim(),
      rating: rating === undefined ? undefined : Number(rating),
      coverImage: coverImage ? String(coverImage).trim() : "",
    });

    return res.status(201).json({ restaurant: created });
  } catch (err) {
    return res.status(500).json({ message: "Create restaurant failed" });
  }
}

export async function updateRestaurant(req, res) {
  try {
    const { id } = req.params;
    const { name, location, rating, coverImage } = req.body;

    const item = await Restaurant.findById(id);
    if (!item) return res.status(404).json({ message: "Restaurant not found" });

    if (name !== undefined) item.name = String(name).trim();
    if (location !== undefined) item.location = String(location).trim();
    if (rating !== undefined) item.rating = Number(rating);
    if (coverImage !== undefined) item.coverImage = String(coverImage).trim();

    await item.save();

    return res.json({ restaurant: item });
  } catch (err) {
    return res.status(400).json({ message: "Update restaurant failed" });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const { id } = req.params;
    const item = await Restaurant.findById(id);
    if (!item) return res.status(404).json({ message: "Restaurant not found" });

    await item.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ message: "Delete restaurant failed" });
  }
}