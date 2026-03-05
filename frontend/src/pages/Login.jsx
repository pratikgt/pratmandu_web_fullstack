import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login({
        email: form.email,
        password: form.password,
      });

      navigate("/profile");
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        "Login failed";

      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="container pagepad">
        <div className="authWrap">
          <div className="authLeft">
            <div className="authHero">
              <div className="authHero__badge">Pratmandu</div>
              <h2 className="authHero__title">Welcome back</h2>
              <p className="authHero__sub">
                Login to order your favorite food in Kathmandu.
              </p>
            </div>
          </div>

          <div className="authCard">
            <div className="authCard__head">
              <div className="authCard__title">Login</div>
              <div className="authCard__desc">
                Enter your details to continue
              </div>
            </div>

            {err ? <div className="authError">{err}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  className="field__input"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="example@gmail.com"
                  type="email"
                  required
                />
              </label>

              <label className="field">
                <span className="field__label">Password</span>

                <div className="field__pass">
                  <input
                    className="field__input field__input--pass"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    type={showPass ? "text" : "password"}
                    required
                  />

                  <button
                    type="button"
                    className="field__toggle"
                    onClick={() => setShowPass((s) => !s)}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                className="btn btn--primary btn--full authBtn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="authAlt">
                Don’t have an account?{" "}
                <Link className="authAlt__link" to="/register">
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}