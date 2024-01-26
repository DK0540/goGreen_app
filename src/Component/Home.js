import React, { useState, useEffect } from "react";

import { HomeContainer, List, ListItem } from "../styles";

const Home = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    // Update the filtered users when the 'users' or 'searchTerm' changes
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  return (
    <HomeContainer>
      <h2>Home Page</h2>

      <List>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <ListItem key={index}>{user.name}</ListItem>
          ))
        ) : (
          <ListItem>No matching users found.</ListItem>
        )}
      </List>
    </HomeContainer>
  );
};

export default Home;
