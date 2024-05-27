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
`;

function Event() {
  return (
    <>
      <StyledDiv>
        <Line />
        <StyledH1>EVENT</StyledH1>
        <Container>
          <InnerContainer>
            <IMG src="/Typescript.png" alt="" />
            <StyledP>
              Typescript Golf Clubs kommer att ha en demodag på ITHS Golfklubb.
              Upplev den senaste golfutrustningen och få experthjälp från deras
              representanter. Ta chansen att förbättra ditt spel och utforska
              vad Typescript Golf Clubs har att erbjuda!
            </StyledP>
            <LinkP>Läs mer</LinkP>
          </InnerContainer>
          <InnerContainer>
            <IMG src="/ACADEMY.png" alt="" />
            <StyledP>
              Academy Club, etablerat 1988, bjuder in till en träningsdag på
              ITHS Golfklubb. Upplev förstklassig träning och coaching med deras
              erfarna tränare. Ta chansen att förbättra ditt spel och bli en del
              av deras framgångsrika gemenskap!
            </StyledP>
            <LinkP>Läs mer</LinkP>
          </InnerContainer>
        </Container>
      </StyledDiv>
    </>
  );
}
export default Event;
