import Home from "./Views/Home";
import BookTime from "./Views/BookTime";
import Account from "./Views/Account";
import Login from "./Components/Login";
import CreateAccount from "./Components/CreateAccount";

import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import styled from "styled-components";

const StyledNav = styled.nav`
  height: 20vh;
  display: flex;
  align-items: center;
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledLi = styled.li`
  list-style-type: none;
  margin: 1rem;
`;

const StyledLink = styled(Link)`
  font-size: 2rem;
  color: black;
`;

const StyledImg = styled.img`
  height: 20vh;
`;

function Root() {
  return (
    <>
      <StyledNav>
        <StyledImg src="/ITHS-logga.png" alt="" />
        <StyledUl>
          <StyledLi>
            <StyledLink to="/">Hem</StyledLink>
          </StyledLi>
          <StyledLi>
            <StyledLink to="/booking">Boka tid</StyledLink>
          </StyledLi>
          <StyledLi>
            <StyledLink to="/account/login">Konto</StyledLink>
          </StyledLi>
        </StyledUl>
      </StyledNav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function Nav() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <BookTime />, path: "/booking" },
        { element: <Account />, path: "/account" },
        { element: <Login />, path: "/account/login" },
        { element: <CreateAccount />, path: "/account/create" },
      ],
      element: <Root />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Nav;
