// Token comparison is only a convenience for one-line answers, not compilation.
export function codeTokens(value) {
  return JSON.stringify(String(value).match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|\d+(?:\.\d+)?|::|<<|>>|\+=|-=|\*=|==|!=|<=|>=|\+\+|--|&&|\|\||[^\s]/g) || []);
}

export function normalizeOutput(value) {
  return String(value).replace(/\r\n?/g, '\n').trim().split('\n').map(line => line.trim().replace(/[ \t]+/g, ' ')).join('\n');
}

export function answered(q, value) {
  if (q.type === 'single') return Number.isInteger(value) && value >= 0 && value < q.choices.length;
  if (q.type === 'multi') return Array.isArray(value) && value.length > 0;
  if (q.type === 'ox') return Array.isArray(value) && q.statements.every((_, i) => ['O', 'X'].includes(value[i]));
  return typeof value === 'string' && value.trim().length > 0;
}

export function grade(q, value, self) {
  if (['short', 'written'].includes(q.type) && ['correct', 'wrong'].includes(self)) return self;
  if (!answered(q, value)) return 'blank';
  if (q.type === 'single') return value === q.answer ? 'correct' : 'wrong';
  if (q.type === 'multi') {
    const selected = [...new Set(value)].sort((a, b) => a - b);
    return JSON.stringify(selected) === JSON.stringify([...q.answer].sort((a, b) => a - b)) ? 'correct' : 'wrong';
  }
  if (q.type === 'ox') return q.answer.every((answer, i) => value[i] === answer) ? 'correct' : 'wrong';
  if (q.type === 'written') return 'review';
  const match = q.type === 'output' ? normalizeOutput : codeTokens;
  if (q.answers.some(answer => match(answer) === match(value))) return 'correct';
  // Equivalent C++ can have many forms. Never claim a compiler verdict.
  return q.type === 'short' ? 'review' : 'wrong';
}

export function score(paper, state) {
  const counts = { correct: 0, wrong: 0, blank: 0, review: 0 };
  for (const q of paper.questions) counts[grade(q, state.answers[q.id], state.self[q.id])]++;
  return counts;
}

export function answerText(q) {
  if (q.type === 'single') return `${q.answer + 1}. ${q.choices[q.answer]}`;
  if (q.type === 'multi') return q.answer.map(i => `${i + 1}. ${q.choices[i]}`).join('\n');
  if (q.type === 'ox') return q.answer.map((a, i) => `${i + 1}. ${a}`).join('   ');
  if (q.type === 'written') return q.solution;
  return q.answers[0];
}
