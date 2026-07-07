import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import {
  ShieldCheckIcon,
  ClockIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface CoreValue {
  name: string;
  description: string;
}

interface AboutCoreValuesProps {
  values: CoreValue[];
}

const VALUE_ICONS = [
  ShieldCheckIcon,
  ClockIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ArrowPathIcon,
];

export default function AboutCoreValues({ values }: AboutCoreValuesProps) {
  return (
    <Section variant="light" aria-labelledby="about-core-values-heading">
      <Container>
        <h2
          id="about-core-values-heading"
          className="font-display text-h2 text-navy mb-12 text-center"
        >
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, i) => {
            const Icon = VALUE_ICONS[i] ?? ShieldCheckIcon;
            return (
              <Reveal key={value.name} direction="up" delay={i * 0.08}>
                <Card as="article" className="h-full">
                  <Icon
                    className="w-8 h-8 text-crimson mb-4"
                    aria-hidden="true"
                  />
                  <h4 className="font-display text-h4 text-navy mb-3">
                    {value.name}
                  </h4>
                  <p className="font-sans text-body text-ink-muted leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
