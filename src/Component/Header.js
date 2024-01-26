import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { HeaderContainer, Nav } from "../styles";

const Header = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const handleChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim() === "") {
      handleSearch();
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/user">User Page</Link>
          </li>
        </ul>
      </Nav>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
    </HeaderContainer>
  );
};

export default Header;
