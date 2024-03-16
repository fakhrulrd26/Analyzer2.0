import type { ZodIssue } from 'zod'

export default function (issues: ZodIssue[]): Array<{ property: string, rule: string }> {
  return issues.map(function (issue: ZodIssue) {
    return {
      property: issue.path.join('.'),
      rule: issue.message
    }
  })
}
