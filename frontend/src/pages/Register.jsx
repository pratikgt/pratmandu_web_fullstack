import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="container pagepad">
        <div className="authWrap">
          <div className="authCard">
            <h2 className="authTitle">Create Account</h2>
            <p className="authSub">Register to order food faster.</p>

            {err ? <div className="authErr">{err}</div> : null}

            <form onSubmit={submit} className="authForm">
              <label className="authLabel">Full Name</label>
              <input
                className="authInput"
                value={form.fullname}
                onChange={(e) => setForm((p) => ({ ...p, fullname: e.target.value }))}
                placeholder="Your name"
              />

              <label className="authLabel">Email</label>
              <input
                className="authInput"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="example@gmail.com"
              />

              <label className="authLabel">Password</label>
              <div className="authPassRow">
                <input
                  className="authInput"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Min 6 chars"
                />
                <button
                  type="button"
                  className="authPassBtn"
                  onClick={() => setShowPass((s) => !s)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <button className="btn btn--cta w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <div className="authBottom">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}