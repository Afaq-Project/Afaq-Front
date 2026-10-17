import { content } from "../../content/en";
import { Container } from "./Container";
import { SectionPlaceholder } from "./SectionPlaceholder";

/** Page footer. Placeholder until the footer step. */
export function LandingFooter() {
  const { footer } = content;

  return (
    <footer className="bg-offwhite py-12 border-neutral-100 border-t">
      <Container>
        <SectionPlaceholder name={footer.name} anchor="footer" />
      </Container>
    </footer>
  );
}
