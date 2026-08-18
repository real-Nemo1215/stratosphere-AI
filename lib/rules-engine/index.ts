import type { CloudResource, Finding, Rule } from "./types";
import { RULES, RULES_BY_ID } from "./rules";

/** Run a single rule against one resource. Pure, side-effect free. */
export function runRule(
  rule: Rule,
  resource: CloudResource,
  now?: Date
): Finding | null {
  try {
    return rule.evaluate(resource, now);
  } catch (err) {
    console.error(
      `[rules-engine] rule ${rule.id} threw on resource ${resource.id}:`,
      err
    );
    return null;
  }
}

/** Run all rules against a single resource. */
export function scanResource(resource: CloudResource, now?: Date): Finding[] {
  return RULES.map((r) => runRule(r, resource, now)).filter(
    (f): f is Finding => f !== null
  );
}

/** Run all rules against a whole account's resources. Sorted by waste desc. */
export function scanAccount(resources: CloudResource[], now?: Date): Finding[] {
  const findings: Finding[] = [];
  for (const r of resources) findings.push(...scanResource(r, now));
  return findings.sort(
    (a, b) => b.estimatedMonthlyWasteUsd - a.estimatedMonthlyWasteUsd
  );
}

/** Sum of all estimated monthly waste across findings. */
export function totalEstimatedWaste(findings: Finding[]): number {
  return round2(findings.reduce((s, f) => s + f.estimatedMonthlyWasteUsd, 0));
}

const round2 = (n: number) => Number(n.toFixed(2));

export * from "./types";
export { RULES, RULES_BY_ID } from "./rules";