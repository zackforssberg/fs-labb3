import Footer from "../Components/Footer";
import Tournaments from "../Components/Tournaments";

import styled from "styled-components";

const BgContainer = styled.div`
  background-image: url("/golfbollar-1920.jpg");
  background-position: center;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledH1 = styled.h1`
  color: white;
  font-size: 4rem;
  font-family: "Courier New", Courier, monospace;
`;

function About() {
  return (
    <>
      <BgContainer>
        <StyledH1>Välkommen till ITHS Golfklubb</StyledH1>
      </BgContainer>
      <Tournaments />
      <Footer />
    </>
  );
}

export default About;
