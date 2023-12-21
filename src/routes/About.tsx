import { Container } from "../components/Container.tsx";
import { MenuLink } from "../components/MenuLink.tsx";

function About() {
  return (
    <Container>
      <h1>About us</h1>
      <MenuLink href={"/"}>Back</MenuLink>
    </Container>
  );
}

export default About;
