/**
 * derivedLabel — converts a ContentBlock.key to a human-readable label.
 * All 63 explicit key→label mappings from spec Section 6.5, plus a fallback rule.
 *
 * Fallback: take the last dot-segment of the key, replace hyphens/underscores
 * with spaces, then title-case each word.
 *
 * Example: "some.nested.custom-key" → "Custom Key"
 */

const EXPLICIT_LABELS: Record<string, string> = {
  "hero.heading": "Page Heading",
  "hero.subheading": "Page Subheading",
  "hero.cta.primary": "Primary Button Label",
  "hero.cta.secondary": "Secondary Button Label",
  "about.intro": "Introduction",
  "about.history": "Company History",
  "about.mission": "Mission Statement",
  "about.vision": "Vision Statement",
  "values.quality": "Core Value — Quality",
  "values.reliability": "Core Value — Reliability",
  "values.transparency": "Core Value — Transparency",
  "values.customization": "Core Value — Customization",
  "values.partnership": "Core Value — Partnership",
  "values.continuous-improvement": "Core Value — Continuous Improvement",
  "manufacturing.intro": "Manufacturing Introduction",
  "stage.1": "Production Stage 1",
  "stage.2": "Production Stage 2",
  "stage.3": "Production Stage 3",
  "stage.4": "Production Stage 4",
  "stage.5": "Production Stage 5",
  "stage.6": "Production Stage 6",
  "stage.7": "Production Stage 7",
  "stage.8": "Production Stage 8",
  "stage.9": "Production Stage 9",
  "workflow.step.1": "Workflow Step 1",
  "workflow.step.2": "Workflow Step 2",
  "workflow.step.3": "Workflow Step 3",
  "workflow.step.4": "Workflow Step 4",
  "workflow.step.5": "Workflow Step 5",
  "workflow.step.6": "Workflow Step 6",
  "workflow.step.7": "Workflow Step 7",
  "workflow.step.8": "Workflow Step 8",
  "workflow.step.9": "Workflow Step 9",
  "workflow.step.10": "Workflow Step 10",
  "service.1": "Service 1",
  "service.2": "Service 2",
  "service.3": "Service 3",
  "service.4": "Service 4",
  "service.5": "Service 5",
  "service.6": "Service 6",
  "service.7": "Service 7",
  "service.8": "Service 8",
  "service.9": "Service 9",
  "service.10": "Service 10",
  "service.11": "Service 11",
  "service.12": "Service 12",
  "service.13": "Service 13",
  "service.14": "Service 14",
  "service.15": "Service 15",
  "service.16": "Service 16",
  "service.17": "Service 17",
  "service.18": "Service 18",
  "service.19": "Service 19",
  "oem.moq": "Minimum Order Quantity Note",
  "quality.intro": "Quality Introduction",
  "qc.point.1": "Quality Checkpoint 1",
  "qc.point.2": "Quality Checkpoint 2",
  "qc.point.3": "Quality Checkpoint 3",
  "qc.point.4": "Quality Checkpoint 4",
  "qc.point.5": "Quality Checkpoint 5",
  "qc.point.6": "Quality Checkpoint 6",
  "qc.point.7": "Quality Checkpoint 7",
  "qc.point.8": "Quality Checkpoint 8",
  "qc.point.9": "Quality Checkpoint 9",
  "qc.point.10": "Quality Checkpoint 10",
  "qc.point.11": "Quality Checkpoint 11",
  "qc.point.12": "Quality Checkpoint 12",
  "sustainability.body": "Sustainability Statement",
  "initiative.1": "Sustainability Initiative 1",
  "initiative.2": "Sustainability Initiative 2",
  "initiative.3": "Sustainability Initiative 3",
  "initiative.4": "Sustainability Initiative 4",
  "initiative.5": "Sustainability Initiative 5",
  "initiative.6": "Sustainability Initiative 6",
  "initiative.7": "Sustainability Initiative 7",
  "initiative.8": "Sustainability Initiative 8",
  "differentiator.1": "Differentiator 1",
  "differentiator.2": "Differentiator 2",
  "differentiator.3": "Differentiator 3",
  "differentiator.4": "Differentiator 4",
  "differentiator.5": "Differentiator 5",
  "differentiator.6": "Differentiator 6",
  "differentiator.7": "Differentiator 7",
  "differentiator.8": "Differentiator 8",
  "differentiator.9": "Differentiator 9",
  "differentiator.10": "Differentiator 10",
  "contact.message": "Contact Page Message",
};

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function derivedLabel(key: string): string {
  if (EXPLICIT_LABELS[key]) return EXPLICIT_LABELS[key];

  // Fallback: last dot-segment, hyphens/underscores → spaces, then title-case
  const segments = key.split(".");
  const lastSegment = segments[segments.length - 1];
  const spaced = lastSegment.replace(/[-_]/g, " ");
  return titleCase(spaced);
}
