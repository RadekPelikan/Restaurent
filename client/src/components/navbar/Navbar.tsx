import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

type INavbar = {
  children?: ReactNode;
};

const Navbar: FC<INavbar> = () => {
  return (
    <div className="absolute left-0 right-0">
      <div className="container">
        <nav>
          <ul className="flex  gap-12 justify-between">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
