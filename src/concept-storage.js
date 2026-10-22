import { courses } from './concept-content.js';

export const conceptKey = 'cpp-paper-concepts-v1';
export function freshProgress() { return {done: {}, answers: {}, checked: {}, last: null}; }
export function readProgress(storage) {
  const clean = freshProgress();
  try {
    const raw = JSON.parse(storage.getItem(conceptKey));
    if (!raw || typeof raw !== 'object') return clean;
    for (const c of courses) {
      for (const s of c.steps) if (raw.done?.[`${c.id}/${s.id}`] === true) clean.done[`${c.id}/${s.id}`] = true;
      for (const q of c.checks) {
        const key = `${c.id}/${q.id}`, answer = raw.answers?.[key];
        if (Number.isInteger(answer) && answer >= 0 && answer < q.options.length) clean.answers[key] = answer;
      }
      if (raw.checked?.[c.id] === true && c.checks.every(q => Object.hasOwn(clean.answers, `${c.id}/${q.id}`))) clean.checked[c.id] = true;
    }
    if (typeof raw.last === 'string' && courses.some(c => [...c.steps.map(s => s.id), 'check'].some(s => raw.last === `${c.id}/${s}`))) clean.last = raw.last;
  } catch { /* A damaged or blocked store should not prevent learning. */ }
  return clean;
}
export function writeProgress(progress, storage) {
  try { storage.setItem(conceptKey, JSON.stringify(progress)); return true; }
  catch { return false; }
}
export const completedSteps = (progress, course) => course.steps.filter(s => progress.done[`${course.id}/${s.id}`]).length;
export const quizScore = (progress, course) => course.checks.filter(q => progress.answers[`${course.id}/${q.id}`] === q.answer).length;
