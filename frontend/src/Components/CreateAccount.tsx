import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDiv = styled.div`
  border: 1px solid black;
  padding: 25px;
  width: fit-content;
  font-family: "Courier New", Courier, monospace;
  margin: 1rem;
`;

const MarginDiv = styled.div`
  margin-top: 2px;
`;

const StyledP = styled.p`
  font-size: 1.2rem;
`;

const LINK = styled(Link)`
  color: blue;
`;

function CreateAccount() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //visa användare om ett konto har skapats eller inte
  const [created, setCreated] = useState<boolean>(false);
  const [notCreated, setNotCreated] = useState<boolean>(true);

  //skapa konto
  async function createAccount(email: string, password: string): Promise<void> {
    const response = await fetch("/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log(response.status);

    // Kolla om responsen är en 400 Bad Request
    if (response.status === 400) {
      console.error("Fel vid skapande av användare:");
      setNotCreated(false);
      return; // Avsluta funktionen här om det är en 400 Bad Request
    }

    //Kolla om något annat fel än 400 skickades
    try {
      if (!response.ok) {
        throw new Error("Något gick fel.");
      } else {
        console.log("Användare skapades.");
        setCreated(true);
        Cookies.set("token", result.token, { sameSite: "strict" });
        Cookies.set("user", email, { sameSite: "strict" });
        navigate("/account");
      }
    } catch (error) {
      console.error("Ett fel inträffade:", error);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    // console.log(email);
    // console.log(password);
    createAccount(email, password);

    setEmail("");
    setPassword("");
  }

  return (
    <>
      <Container>
        <StyledDiv>
          <StyledP>
            Om du redan har ett konto kan du logga in{" "}
            <LINK to="/account/login">här</LINK>.
          </StyledP>
        </StyledDiv>
        <StyledDiv>
          <h2>Skapa konto</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>E-post:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <MarginDiv>
              <label>Lösenord:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p>Lösenordet måste vara minst 6 tecken.</p>
            </MarginDiv>
            <button type="submit">Skapa konto</button>
          </form>
          {!notCreated && <p>Skapandet av kontot misslyckades.</p>}
          {created && <p>Skapandet av kontot lyckades.</p>}
        </StyledDiv>
      </Container>
    </>
  );
}
export default CreateAccount;
