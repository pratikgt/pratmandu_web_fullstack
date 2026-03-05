import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <Link to="/" className="text-brand">
        Go Home
      </Link>
    </div>
  );
}