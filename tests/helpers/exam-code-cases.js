import { papers } from '../../src/bank.js';

// Compile every accepted fill-in spelling, not just the first answer.
export const newExamCodeCases = papers.slice(5).flatMap(p => p.questions.flatMap(q => {
  if (!q.verify) return [];
  const v = q.verify;
  const fills = v.fill ? q.answers : [null];
  return fills.map((fill, index) => ({
    id: `${q.id}-${index + 1}`,
    code: fill ? q.code.replace('__________', fill) : (v.code || q.code),
    files: v.files,
    cases: v.cases || [{ stdin: v.stdin || '', stdout: v.stdout }],
  }));
}));
