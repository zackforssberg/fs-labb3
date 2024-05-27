import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

import styled from "styled-components";

const StyledDiv = styled.div`
  width: fit-content;
  font-family: "Courier New", Courier, monospace;
`;

function Logout() {
  const navigate = useNavigate();

  const [outlogSuccess, setOutlogSuccess] = useState<boolean>(false);

  async function logout() {
    const token: string | undefined = Cookies.get("token");

    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    console.log(response.status);

    try {
      if (!response.ok) {
        throw new Error("Något gick fel.");
      } else {
        console.log("Utloggning lyckades.");
        setOutlogSuccess(true);
        Cookies.set("token", "", { sameSite: "strict" });
        Cookies.set("user", "", { sameSite: "strict" });
        navigate("/account/login");
      }
    } catch (error) {
      console.error("Ett fel inträffade:", error);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    console.log(Cookies.get("user"));

    logout();
  }

  return (
    <>
      <StyledDiv>
        <h3>Logga ut</h3>
        <input type="button" value="Logga ut" onClick={handleSubmit} />
        {outlogSuccess && <p>Du är utloggad.</p>}
      </StyledDiv>
    </>
  );
}
export default Logout;
