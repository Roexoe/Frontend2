import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <Logo />
      </div>
      <div className="search-container">
        <SearchBar />
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    </header>
  );
};

export default Header;
