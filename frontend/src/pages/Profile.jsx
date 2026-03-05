import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user: ctxUser } = useAuth();
  const [user, setUser] = useState(ctxUser);
  const [loading, setLoading] = useState(!ctxUser);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data?.user || res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <Navbar cartCount={0} />
      <main className="container pagepad">
        <h2 className="section__title">Profile</h2>

        {loading ? (
          <div className="muted">Loading...</div>
        ) : (
          <div className="profileCard">
            <div className="profileRow">
              <div className="profileLabel">Fullname</div>
              <div className="profileVal">{user?.fullname || "-"}</div>
            </div>
            <div className="profileRow">
              <div className="profileLabel">Email</div>
              <div className="profileVal">{user?.email || "-"}</div>
            </div>
            <div className="profileRow">
              <div className="profileLabel">Role</div>
              <div className="profileVal">{user?.role || "user"}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}