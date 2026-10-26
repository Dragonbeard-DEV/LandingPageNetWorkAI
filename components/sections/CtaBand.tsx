import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  title: string;
  text: string;
  buttonLabel: string;
  href?: string;
};

/** Full-width brand-blue band inviting the visitor to get in touch. */
export function CtaBand({ title, text, buttonLabel, href = "/contact" }: Props) {
  return (
    <section aria-labelledby="cta-band-title" className="bg-brand-500 text-white">
      <Container className="py-16 md:py-20">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 id="cta-band-title" className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-white">{text}</p>
          </div>
          <Button href={href} variant="inverse" className="shrink-0">
            {buttonLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
