import Profile from "../Components/Profile";
import Footer from "../Components/Footer";
import Event from "../Components/Event";
import Tournaments from "../Components/Tournaments";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

function Account() {
  return (
    <>
      <Container>
        <Profile />
      </Container>
      <Event />
      <Tournaments />
      <Footer />
    </>
  );
}

export default Account;
