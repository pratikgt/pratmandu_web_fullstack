import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useCart } from "./context/CartContext.jsx";

export default function App() {
  const { count } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar cartCount={count} />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}