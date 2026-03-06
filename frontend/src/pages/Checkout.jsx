import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth() || {};

  const deliveryFee = items.length ? 30 : 0;
  const grandTotal = total + deliveryFee;

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    phone: "",
    address: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const orderPayload = useMemo(() => {
    return {
      customer: {
        fullname: form.fullname,
        phone: form.phone,
        address: form.address,
        note: form.note,
      },
      items: items.map((x) => ({
        id: x._id || x.id,
        title: x.title || x.name,
        qty: x.qty,
        price: x.price,
      })),
      subtotal: total,
      deliveryFee,
      total: grandTotal,
    };
  }, [form, items, total, deliveryFee, grandTotal]);

  if (!items.length) {
    return (
      <div className="page">
        <main className="container pagepad">
          <h2 className="section__title">Checkout</h2>
          <div className="emptyBox">
            <div className="muted">No items in cart.</div>
          </div>
        </main>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.fullname.trim() || !form.phone.trim() || !form.address.trim()) {
      setErr("Please fill fullname, phone and address.");
      return;
    }

    setLoading(true);
    try {
      // backend route expected later: POST /api/orders
      const res = await api.post("/orders", orderPayload);
      clearCart();
      navigate("/profile", { state: { order: res.data } });
    } catch (ex) {
      const msg =
        ex?.response?.data?.message ||
        ex?.message ||
        "Order failed. Backend /api/orders not ready yet.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="container pagepad">
        <h2 className="section__title">Checkout</h2>

        <div className="mt-6 grid" style={{ gridTemplateColumns: "1fr 360px", gap: 18 }}>
          <form onSubmit={placeOrder} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-600 mb-3">Delivery details</div>

            {err ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Fullname</label>
                <input
                  value={form.fullname}
                  onChange={(e) => setForm((p) => ({ ...p, fullname: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="98xxxxxxxx"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="Area, street, landmark"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Note (optional)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  rows="3"
                  placeholder="Any instructions..."
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              type="submit"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </form>

          <aside className="rounded-xl border border-gray-200 bg-white p-4 h-fit">
            <div className="text-sm text-gray-600 mb-3">Order summary</div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Rs. {deliveryFee}</span>
              </div>

              <div className="border-t border-gray-200 my-2" />

              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>Rs. {grandTotal}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              If your backend doesn’t have <code>/api/orders</code> yet, the order will show an error.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}