import TeeTimes from "./TeeTimes";
import Logout from "./Logout";

import { useState } from "react";
import { useEffect } from "react";

import Cookies from "js-cookie";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Courier New", Courier, monospace;
  width: 50%;
`;

const StyledDiv = styled.div`
  display: flex;
`;

function Profile() {
  //hämta användare

  interface MyObject {
    id: number;
    email: string;
    created: string;
  }

  const [user, setUser] = useState<MyObject[] | null>(null);

  async function fetchUser() {
    const token: string | undefined = Cookies.get("token");

    const response = await fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result: MyObject[] = await response.json();
    // console.log(result);
    setUser(result);
  }

  useEffect(() => {
    console.log(user);
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user != null ? (
        <StyledDiv>
          <Container>
            <h3>Dina uppgifter</h3>
            <p>Email: {user[0].email}</p>
            <p>Konto skapat: {user[0].created}</p>
            <Logout />
          </Container>
          <Container>
            <TeeTimes value={false} />
          </Container>
        </StyledDiv>
      ) : (
        <p>Du är inte inloggad</p>
      )}
    </>
  );
}
export default Profile;
