// header.tsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white h-16 p-4 shadow-md fixed left-0 w-full z-10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link className="text-2xl font-bold" to="/">
          HRnet
        </Link>
        <Link to="/employees" className="hover:underline underline-offset-4">
          Current employees
        </Link>
      </nav>
    </header>
  );
};

export default Header;
