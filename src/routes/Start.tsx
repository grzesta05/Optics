import { Container } from "../components/Container.tsx";
import { MenuLink } from "../components/MenuLink.tsx";

function Start() {
  return (
    <Container>
      <h1>Start the app!</h1>
      <MenuLink href={"/"}>Back</MenuLink>
    </Container>
  );
}

export default Start;
