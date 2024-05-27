import styled from "styled-components";

const FooterContainer = styled.div`
  height: 45vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
`;

const IMG = styled.img`
  height: 250px;
`;

const StyledH3 = styled.h3`
  margin-bottom: 1rem;
`;

const Line = styled.div`
  width: 80vw;
  border-bottom: 1px solid black;
  margin: 2rem;
  margin-top: 6rem;
`;

const LinkP = styled.p`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  padding-bottom: 3rem;
`;

function Footer() {
  return (
    <>
      <FooterContainer>
        <Line />
        <IMG src="/ITHS-logga.png" alt="raba" />
        <StyledH3>ITHS Golfklubb</StyledH3>
        <p>Golfvägen 123</p>
        <p>456 78, Golftorp</p>
        <p>042-123 45</p>
        <LinkP>info@ithsgolf.se</LinkP>
      </FooterContainer>
    </>
  );
}
export default Footer;
