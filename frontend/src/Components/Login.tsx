import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

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

function Login() {
  const navigate = useNavigate();

  function checkLoggedInStatus() {
    const token: string | undefined = Cookies.get("token");
    if (token != "") {
      navigate("/account");
    }
  }

  useEffect(() => {
    checkLoggedInStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  //logga in
  async function login(email: string, password: string): Promise<void> {
    const token: string = uuidv4();

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, token }),
    });

    console.log(response.status);

    // Kolla om responsen är en 400 Bad Request
    if (response.status === 400) {
      console.error("Fel vid inloggning.");
      setLoginSuccess(false);
      setAccessDenied(true);
      return; // Avsluta funktionen här om det är en 400 Bad Request
    }

    //Kolla om något annat fel än 400 skickades
    try {
      if (!response.ok) {
        throw new Error("Något gick fel.");
      } else {
        console.log("Inloggning lyckades.");
        setAccessDenied(false);
        setLoginSuccess(true);
        Cookies.set("token", token, { sameSite: "strict" });
        Cookies.set("user", email, { sameSite: "strict" });
        navigate("/account");
      }
    } catch (error) {
      console.error("Ett fel inträffade:", error);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    login(email, password);

    setEmail("");
    setPassword("");
  }

  return (
    <>
      <Container>
        <StyledDiv>
          <StyledP>
            Du är inte inloggad, om du inte har något konto kan du skapa ett{" "}
            <LINK to="/account/create">här</LINK>.
          </StyledP>
        </StyledDiv>
        <StyledDiv>
          <h2>Logga in</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>E-post:</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <MarginDiv>
              <label>Lösenord:</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </MarginDiv>
            <button type="submit">Logga in</button>
          </form>
          {loginSuccess && <p>Inloggningen lyckades.</p>}
          {accessDenied && <p>Inloggningen misslyckades.</p>}
        </StyledDiv>
      </Container>
    </>
  );
}
export default Login;
