import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

// Styled components for styling
const UserProfileContainer = styled.div`
  background-color: #38a196;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
  position: relative;

  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

const UserName = styled.h2`
  color: white;
  margin-bottom: 10px;
`;

const ContactDetails = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ContactItem = styled.li`
  margin-bottom: 5px;

  a {
    color: white;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AppInfo = styled.p`
  color: white;
`;

const GoHomeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #007bff;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const CopyrightText = styled.p`
  color: red;
  text-align: center;
  font-size: 10px;
  background-color: #0707071a;
  padding: 0px;
`;

const UserProfile = ({ userName }) => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/home");
  };

  return (
    <UserProfileContainer>
      <UserName>Welcome, {userName}</UserName>
      <AppInfo>
        This is an application for uploading details. If you need any help,
        please contact us:
      </AppInfo>
      <ContactDetails>
        <ContactItem>
          <strong>Email:</strong>{" "}
          <a href="mailto:srinidhi@gmail.com">srinidhi@gmail.com</a>
        </ContactItem>
        <ContactItem>
          <strong>Contact Details:</strong>{" "}
          <a href="tel:9972049933">9972049933</a>
        </ContactItem>
        <ContactItem>
          <strong>Website:</strong>{" "}
          <a
            href="https://srinidhiinfotech.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            srinidhiinfotech.in
          </a>
        </ContactItem>
      </ContactDetails>
      <GoHomeButton onClick={goHome}>
        <FaHome />
      </GoHomeButton>
      <CopyrightText>
        Copyright © 2024 Srinidhi Innovative InfoSoft Pvt Ltd All rights
        reserved.
      </CopyrightText>
    </UserProfileContainer>
  );
};

export default UserProfile;

////////////////////////////////////////////////////old
// import React from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { FaHome } from "react-icons/fa";
// // Styled components for styling
// const UserProfileContainer = styled.div`
//   background-color: #38a196;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   max-width: 500px;
//   margin: auto;
//   position: relative;

//   @media (max-width: 768px) {
//     max-width: 90%;
//   }
// `;

// const UserName = styled.h2`
//   color: white;
//   margin-bottom: 10px;
// `;

// const ContactDetails = styled.ul`
//   list-style-type: none;
//   padding: 0;
// `;

// const ContactItem = styled.li`
//   margin-bottom: 5px;
// `;

// const AppInfo = styled.p`
//   color: white;
// `;

// const GoHomeButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background-color: #007bff;
//   color: #fff;
//   padding: 8px 12px;
//   border: none;
//   border-radius: 50%;
//   cursor: pointer;
// `;
// const UserProfile = ({ userName }) => {
//   const navigate = useNavigate();
//   const goHome = () => {
//     navigate("/home");
//   };
//   return (
//     <UserProfileContainer>
//       <UserName>Welcome, {userName}</UserName>
//       <AppInfo>
//         This is an application for uploading details. If you need any help,
//         please contact us:
//       </AppInfo>
//       <ContactDetails>
//         <ContactItem>
//           <strong>Email:</strong> srinidhi@gmail.com
//         </ContactItem>
//         <ContactItem>
//           <strong>Contact Details:</strong> 9972049933
//         </ContactItem>
//         <ContactItem>
//           <strong>Website:</strong> srinidhiinfotech.in
//         </ContactItem>
//       </ContactDetails>
//       <GoHomeButton onClick={goHome}>
//         <FaHome />
//       </GoHomeButton>
//     </UserProfileContainer>
//   );
// };

// export default UserProfile;
