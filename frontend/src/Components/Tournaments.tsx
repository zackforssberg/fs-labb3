import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IMG = styled.img`
  height: 400px;
`;

const StyledP = styled.p`
  width: 30vw;
  margin-left: 2rem;
  margin-right: 2rem;
  text-align: center;
  font-size: larger;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
`;

const StyledDiv = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledH1 = styled.h1`
  margin-top: 2rem;
  font-family: "Courier New", Courier, monospace;
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
  font-size: larger;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
`;

function Tournaments() {
  return (
    <>
      <StyledDiv>
        <Line />
        <StyledH1>ÅRETS TÄVLINGAR</StyledH1>
        <Container>
          <InnerContainer>
            <IMG src="/REACT-Championchip.png" alt="" />
            <StyledP>
              2024 kommer ITHS Golfklubb att stå värd för React Championship.
              Tävlingen samlar golfens elit för att kämpa om mästartiteln på en
              av Sveriges mest utmanande banor. Upplev spänningen och skönheten
              i denna högklassiga golftävling på nära håll!
            </StyledP>
            <LinkP>Läs mer</LinkP>
          </InnerContainer>
          <InnerContainer>
            <IMG src="/Javascript-open.png" alt="" />
            <StyledP>
              Javascript Open 2024 äger rum på ITHS Golfklubb. Se de bästa
              golfarna tävla på en av landets finaste banor. Var med och upplev
              spänningen och dramatiken när nästa mästare kröns i denna
              prestigefyllda turnering!
            </StyledP>
            <LinkP>Läs mer</LinkP>
          </InnerContainer>
        </Container>
      </StyledDiv>
    </>
  );
}
export default Tournaments;
