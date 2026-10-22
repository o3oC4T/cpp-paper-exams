import test from 'node:test';
import assert from 'node:assert/strict';
import { papers } from '../src/bank.js';
import { sources } from '../src/sources.js';
import { answered, grade, codeTokens, score, normalizeOutput } from '../src/grading.js';
import { freshState, loadState, saveState } from '../src/storage.js';

test('fifteen complete papers preserve the requested 20-slot blueprint and mandatory stars', () => {
  assert.equal(papers.length, 15);
  const ids = new Set();
  for (const p of papers) {
    assert.equal(p.questions.length, 20);
    assert.equal(p.questions[4].type, 'ox');
    assert.equal(p.questions[6].type, 'multi');
    assert.equal(p.questions[13].stars, 3);
    assert.deepEqual(p.questions.slice(15).map(q => q.type), ['output', 'output', 'short', 'output', 'written']);
    assert.ok(p.questions[19].original);
    for (const [i, q] of p.questions.entries()) {
      assert.equal(q.number, i + 1); assert.ok(!ids.has(q.id)); ids.add(q.id);
      assert.ok(q.prompt && q.explanation && q.sources.length);
      for (const source of q.sources) assert.ok(sources[source.id] && source.pages);
      if (q.type === 'single') assert.ok(Number.isInteger(q.answer) && q.choices[q.answer]);
      if (q.type === 'multi') { assert.ok(q.answer.length > 1); assert.ok(q.answer.every(i => q.choices[i])); }
      if (q.type === 'ox') assert.equal(q.answer.length, q.statements.length);
      if (q.type === 'written') assert.ok(q.solution && q.rubric.length >= 3);
      if (q.type === 'output') assert.equal(normalizeOutput(q.answers[0]), normalizeOutput(q.verify.stdout));
    }
  }
  assert.equal(ids.size, 300);
});

test('all objective answer keys grade correctly, and all-or-nothing selections work', () => {
  for (const paper of papers) for (const q of paper.questions) {
    if (['single', 'multi', 'ox'].includes(q.type)) assert.equal(grade(q, q.answer), 'correct', q.id);
    if (q.answers) assert.equal(grade(q, q.answers[0]), 'correct', q.id);
  }
  const q = papers[0].questions[6];
  assert.equal(grade(q, [...q.answer].reverse()), 'correct');
  assert.equal(grade(q, [q.answer[0]]), 'wrong');
  assert.equal(grade(q, [...q.answer, 3]), 'wrong');
  const ox = papers[0].questions[4];
  assert.equal(answered(ox, ['O']), false);
  assert.equal(grade(ox, ['O']), 'blank');
});

test('code comparison keeps tokens and literal content; unknown equivalents need human review', () => {
  const q = papers[0].questions[2];
  assert.equal(grade(q, 'std::cout<<"Hello"<<std::endl;'), 'correct');
  assert.equal(grade(q, 'std::cout << "Hello \\n";'), 'review');
  assert.notEqual(codeTokens('a == b'), codeTokens('a = = b'));
  assert.notEqual(codeTokens('using namespace std;'), codeTokens('usingnamespace std;'));
  assert.notEqual(codeTokens('cout << "A B";'), codeTokens('cout << "AB";'));
});

test('output tolerates line-ending and horizontal whitespace, but preserves separate lines', () => {
  const q = papers[4].questions[16];
  assert.equal(grade(q, '1  2  3 \r\n2\t4\t6\r\n'), 'correct');
  assert.equal(grade(q, '1 2 3 2 4 6'), 'wrong');
});

test('manual reviews and paper answers affect score without pretending compilation', () => {
  const p = papers[0], state = freshState(), q = p.questions[19];
  state.answers[q.id] = 'alternative C++ answer';
  assert.equal(score(p, state).review, 1);
  state.self[q.id] = 'correct'; assert.equal(score(p, state).correct, 1);
  state.self[q.id] = 'wrong'; assert.equal(score(p, state).wrong, 1);
  delete state.answers[q.id]; state.self[q.id] = 'correct';
  assert.equal(score(p, state).correct, 1); // Written on actual paper.
});

test('saved drafts are separated by paper, malformed storage recovers, failures are visible to caller', () => {
  const data = new Map(), storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const state = freshState(); state.answers['01-3'] = '<script>not executed</script>';
  assert.equal(saveState('01', state, storage), true);
  assert.equal(loadState('01', storage).answers['01-3'], state.answers['01-3']);
  assert.deepEqual(loadState('02', storage).answers, {});
  data.set('cpp-paper-exams:v1:01', 'not json');
  assert.deepEqual(loadState('01', storage), freshState());
  assert.equal(saveState('01', state, {setItem(){ throw Error('quota'); }}), false);
});
