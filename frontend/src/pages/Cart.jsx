import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function fmtRs(n) {
  const v = Number(n || 0);
  return `Rs. ${Math.round(v)}`;
}

export default function Cart() {
  const nav = useNavigate();
  const { items, incQty, decQty, removeFromCart, clearCart, subtotal, toCheckoutPayload } =
    useCart();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const deliveryFee = useMemo(() => {
    if (!items.length) return 0;
    return 30;
  }, [items.length]);

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handleCheckout = async () => {
    setErr("");

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("pratmandu_token");

    if (!token) {
      nav("/login");
      return;
    }

    if (!items.length) {
      setErr("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const payload = toCheckoutPayload();

      const { data } = await api.post("/orders/checkout", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearCart();
      nav("/profile", { state: { justOrdered: true, order: data?.order } });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Checkout failed. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7f7f7",
    },
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "28px 18px 70px",
    },
    title: {
      fontSize: 42,
      fontWeight: 800,
      color: "#111",
      margin: "14px 0 18px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 22,
      alignItems: "start",
    },
    card: {
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      border: "1px solid rgba(0,0,0,0.06)",
    },
    cartBox: {
      padding: 18,
    },
    itemRow: {
      display: "grid",
      gridTemplateColumns: "120px 1fr 130px",
      gap: 16,
      padding: "16px 10px",
      borderBottom: "1px solid rgba(0,0,0,0.07)",
      alignItems: "center",
    },
    img: {
      width: 110,
      height: 78,
      objectFit: "cover",
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.08)",
      background: "#fafafa",
    },
    name: {
      fontSize: 22,
      fontWeight: 800,
      margin: 0,
      color: "#111",
      lineHeight: 1.1,
    },
    priceSmall: {
      marginTop: 6,
      fontSize: 16,
      color: "#333",
      opacity: 0.9,
    },
    rightPrice: {
      fontSize: 18,
      fontWeight: 800,
      color: "#111",
      textAlign: "right",
      marginBottom: 10,
    },
    qtyBox: {
      display: "grid",
      gridTemplateColumns: "44px 1fr 44px",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: 10,
      overflow: "hidden",
      height: 40,
      maxWidth: 170,
      background: "#fff",
    },
    qtyBtn: {
      border: "none",
      background: "#fff",
      fontSize: 22,
      fontWeight: 900,
      color: "#d10000",
      cursor: "pointer",
    },
    qtyMid: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 800,
      color: "#111",
      borderLeft: "1px solid rgba(0,0,0,0.12)",
      borderRight: "1px solid rgba(0,0,0,0.12)",
    },
    removeBtn: {
      marginTop: 10,
      border: "none",
      cursor: "pointer",
      padding: "10px 16px",
      borderRadius: 12,
      color: "#fff",
      fontWeight: 800,
      background: "linear-gradient(135deg,#ff3b30,#d10000)",
      boxShadow: "0 10px 20px rgba(209,0,0,0.22)",
      width: 120,
      justifySelf: "end",
    },
    actionsRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      padding: "18px 10px 6px",
      marginTop: 6,
    },
    outlineBtn: {
      height: 46,
      borderRadius: 12,
      border: "2px solid rgba(209,0,0,0.7)",
      background: "#fff",
      color: "#d10000",
      fontWeight: 900,
      cursor: "pointer",
      fontSize: 16,
    },
    solidBtn: {
      height: 46,
      borderRadius: 12,
      border: "none",
      background: "linear-gradient(135deg,#ff3b30,#d10000)",
      color: "#fff",
      fontWeight: 900,
      cursor: "pointer",
      fontSize: 16,
      boxShadow: "0 12px 24px rgba(209,0,0,0.22)",
    },
    summary: {
      padding: 18,
    },
    summaryTitle: {
      fontSize: 26,
      fontWeight: 900,
      margin: "6px 0 12px",
      color: "#111",
    },
    line: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 4px",
      borderTop: "1px solid rgba(0,0,0,0.07)",
      fontSize: 16,
      color: "#222",
    },
    totalLine: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 4px",
      borderTop: "1px solid rgba(0,0,0,0.10)",
      fontSize: 18,
      fontWeight: 900,
      color: "#111",
    },
    checkoutBtn: {
      marginTop: 16,
      width: "100%",
      height: 50,
      borderRadius: 14,
      border: "none",
      cursor: "pointer",
      color: "#fff",
      fontSize: 18,
      fontWeight: 900,
      background: "linear-gradient(135deg,#ff3b30,#d10000)",
      boxShadow: "0 14px 26px rgba(209,0,0,0.24)",
      opacity: loading ? 0.7 : 1,
    },
    hint: {
      marginTop: 10,
      fontSize: 14,
      color: "#d10000",
      fontWeight: 700,
    },
    empty: {
      padding: 28,
      textAlign: "center",
      color: "#333",
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: 900,
      marginBottom: 8,
    },
    emptyLink: {
      display: "inline-block",
      marginTop: 14,
      padding: "10px 16px",
      borderRadius: 12,
      background: "linear-gradient(135deg,#ff3b30,#d10000)",
      color: "#fff",
      fontWeight: 900,
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.title}>Cart</div>

        <div style={styles.grid}>
          <div style={{ ...styles.card, ...styles.cartBox }}>
            {!items.length ? (
              <div style={styles.empty}>
                <div style={styles.emptyTitle}>Your cart is empty</div>
                <div>Add items from Menu to place an order.</div>
                <Link to="/menu" style={styles.emptyLink}>
                  Go to Menu
                </Link>
              </div>
            ) : (
              <>
                {items.map((it) => {
                  const id = it._id || it.id;
                  const img = it.image || it.img || it.photo || "";
                  const name = it.name || it.title || "Item";
                  const price = Number(it.price || 0);
                  const qty = Number(it.qty || 1);

                  return (
                    <div key={id} style={styles.itemRow}>
                      <img
                        src={img}
                        alt={name}
                        style={styles.img}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <div>
                        <p style={styles.name}>{name}</p>
                        <div style={styles.priceSmall}>{fmtRs(price)}</div>

                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                          }}
                        >
                          <div style={styles.qtyBox}>
                            <button
                              style={styles.qtyBtn}
                              onClick={() => decQty(id)}
                              aria-label="decrease"
                              type="button"
                            >
                              –
                            </button>
                            <div style={styles.qtyMid}>{qty}</div>
                            <button
                              style={styles.qtyBtn}
                              onClick={() => incQty(id)}
                              aria-label="increase"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", justifyItems: "end" }}>
                        <div style={styles.rightPrice}>{fmtRs(price)}</div>
                        <button
                          style={styles.removeBtn}
                          onClick={() => removeFromCart(id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div style={styles.actionsRow}>
                  <button
                    style={styles.outlineBtn}
                    onClick={() => nav("/menu")}
                    type="button"
                  >
                    Add more items
                  </button>
                  <button
                    style={styles.solidBtn}
                    onClick={clearCart}
                    type="button"
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </div>

          <div style={{ ...styles.card, ...styles.summary }}>
            <div style={styles.summaryTitle}>Order Summary</div>

            <div style={styles.line}>
              <span>Subtotal</span>
              <span>{fmtRs(subtotal)}</span>
            </div>

            <div style={styles.line}>
              <span>Delivery Fee</span>
              <span>{fmtRs(deliveryFee)}</span>
            </div>

            <div style={styles.totalLine}>
              <span>Total</span>
              <span>{fmtRs(total)}</span>
            </div>

            <button
              style={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={loading || !items.length}
              type="button"
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>

            {err ? <div style={styles.hint}>{err}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}