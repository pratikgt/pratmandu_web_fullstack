import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar({ cartCount: cartCountProp = 0, onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const { count } = useCart();

  const cartCount = Number.isFinite(count) ? count : cartCountProp;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = e.currentTarget.search.value.trim();
    if (onSearch) onSearch(q);
    navigate("/menu");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          <img className="nav__logo" src={logo} alt="Pratmandu" />
          <span className="nav__title">Pratmandu</span>
        </NavLink>

        <form className="nav__search" onSubmit={handleSubmit}>
          <span className="nav__searchIcon">⌕</span>
          <input
            name="search"
            className="nav__searchInput"
            placeholder="Search momo, chowmein, restaurants..."
            autoComplete="off"
          />
        </form>

        <nav className="nav__links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
          >
            Menu
          </NavLink>

          <NavLink to="/cart" className="nav__cart">
            <span className="nav__cartIcon">🛒</span>
            {cartCount > 0 ? <span className="nav__badge">{cartCount}</span> : null}
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
              >
                Profile
              </NavLink>

              <button
                className="nav__link nav__btn"
                type="button"
                onClick={() => {
                  if (logout) logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}