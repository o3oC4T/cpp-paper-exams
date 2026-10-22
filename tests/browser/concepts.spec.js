import { test, expect } from '@playwright/test';
import { courses } from '../../src/concept-content.js';
import { traces } from '../../src/concept-models.js';

test('every lesson and source opens without runtime errors and exam links jump to the selected question', async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#/learn'); await expect(page.locator('.concept-card')).toHaveCount(8);
  for(const c of courses) for(const s of c.steps) {
    await page.goto(`/#/learn/${c.id}/${s.id}`);
    await expect(page.locator('.concept-lesson h2')).toHaveText(s.title);
    await expect(page.locator('.concept-nav [aria-current="step"]')).toHaveCount(1);
    await expect(page.locator('.concept-takeaway')).toBeVisible();
  }
  await page.goto('/#/learn/access/exam');
  await page.locator('.concept-sources summary').click();
  await expect(page.locator('.concept-sources')).toContainText('59–67, 76–77쪽');
  await page.locator('.concept-sources a[href="#/exam/01/14"]').click();
  await expect(page.locator('#q-01-14')).toBeInViewport();
  await page.goto('/#/learn/missing/bad'); await expect(page.getByRole('heading',{name:'학습 페이지를 찾을 수 없습니다.'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('each trace reaches its true output, can go backwards and resets', async ({page})=>{
  for(const c of courses) for(const s of c.steps.filter(s=>s.trace)) {
    const t=traces[s.trace]; await page.goto(`/#/learn/${c.id}/${s.id}`);
    await expect(page.locator('[data-concept-action="trace-prev"]')).toBeDisabled();
    for(let n=1;n<t.frames.length;n++) await page.locator('[data-concept-action="trace-next"]').click();
    await expect(page.locator('#trace-output')).toHaveText(t.frames.at(-1).output);
    await expect(page.locator('[data-concept-action="trace-next"]')).toBeDisabled();
    await page.locator('[data-concept-action="trace-prev"]').click();
    await expect(page.locator('#trace-count')).toHaveText(`${t.frames.length-2} / ${t.frames.length-1}`);
    await page.locator('[data-concept-action="trace-reset"]').click();
    await expect(page.locator('#trace-output')).toHaveText('아직 출력 없음');
  }
  await page.goto('/#/learn/control/trace'); await page.locator('#trace-limit').selectOption('6');
  while(!await page.locator('[data-concept-action="trace-next"]').isDisabled()) await page.locator('[data-concept-action="trace-next"]').click();
  await expect(page.locator('#trace-output')).toHaveText('21 7');
  await page.locator('#trace-limit').selectOption('1'); await expect(page.locator('#trace-count')).toHaveText('0 / 8');
});

test('circle and pointer sandboxes separate pending values, targets and writes',async({page})=>{
  await page.goto('/#/learn/classes/sandbox');
  await page.locator('#circle-target').selectOption('pizza'); await page.locator('#circle-radius').fill('8');
  await expect(page.locator('[data-object="pizza"] code')).toHaveText('radius = 5');
  await expect(page.locator('#circle-pending')).toHaveText('pizza.setRadius(8);');
  await page.getByRole('button',{name:'함수 호출하기',exact:true}).click();
  await expect(page.locator('[data-object="pizza"] code')).toHaveText('radius = 8');
  await expect(page.locator('[data-object="donut"] code')).toHaveText('radius = 2');
  await page.locator('#circle-radius').fill('0'); await page.getByRole('button',{name:'함수 호출하기',exact:true}).click();
  await expect(page.locator('#circle-message')).toContainText('기존 값 8');
  await page.goto('/#/learn/pointers/target');
  await page.locator('#pointer-target').selectOption('b'); await page.getByRole('button',{name:'p에 주소 대입',exact:true}).click();
  await expect(page.locator('#pointer-values')).toContainText('→ b');
  await page.locator('#pointer-number').fill('12'); await page.getByRole('button',{name:'*p에 값 대입',exact:true}).click();
  await expect(page.locator('#pointer-values>div').nth(0)).toContainText('3');
  await expect(page.locator('#pointer-values>div').nth(1)).toContainText('12');
  await page.locator('#pointer-number').fill(''); await page.getByRole('button',{name:'*p에 값 대입',exact:true}).click();
  await expect(page.locator('#pointer-message')).toContainText('0~20');
});

test('all quiz keys grade correctly, incomplete forms give feedback, editing removes old verdicts',async({page})=>{
  await page.goto('/#/learn/classes/check');
  await page.getByRole('button',{name:'정답과 이유 확인하기',exact:true}).click();
  await expect(page.locator('#quiz-message')).toContainText('아직 5문항');
  for(const c of courses) {
    await page.goto(`/#/learn/${c.id}/check`);
    for(const q of c.checks) await page.locator(`input[name="${q.id}"][value="${q.answer}"]`).check();
    await page.locator('#concept-quiz button[type="submit"]').click();
    await expect(page.locator('.concept-feedback.correct')).toHaveCount(c.checks.length);
    await page.reload(); await expect(page.locator('.concept-feedback.correct')).toHaveCount(c.checks.length);
    const q=c.checks[0]; await page.locator(`input[name="${q.id}"][value="${(q.answer+1)%q.options.length}"]`).check();
    await expect(page.locator('.concept-feedback')).toHaveCount(0);
    await page.locator('#concept-quiz button[type="submit"]').click();
    await expect(page.locator('.concept-feedback.wrong')).toHaveCount(1);
  }
});

test('read progress and resume persist independently from existing exam drafts',async({page})=>{
  await page.goto('/#/exam/01'); await page.locator('#answer-01-3').fill('my existing draft');
  await page.goto('/#/learn/classes/type');
  await page.locator('[data-concept-action="done"]').click(); await page.reload();
  await expect(page.locator('[data-concept-action="done"]')).toHaveAttribute('aria-pressed','true');
  await page.goto('/#/learn'); await expect(page.locator('#all-progress')).toContainText('1 / 47');
  await expect(page.getByRole('link',{name:'이어서 공부하기 →',exact:true})).toHaveAttribute('href','#/learn/classes/type');
  await page.goto('/#/exam/01'); await expect(page.locator('#answer-01-3')).toHaveValue('my existing draft');
});

test('blocked storage leaves the learning UI usable and reports its limit',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked');};Storage.prototype.setItem=()=>{throw Error('blocked');};});
  await page.goto('/#/learn/classes/type');
  await page.locator('[data-concept-action="done"]').click();
  await expect(page.locator('#concept-save')).toContainText('저장을 사용할 수 없어요');
  await page.goto('/#/learn'); await expect(page.locator('#all-progress')).toContainText('1 / 47');
});

test('small phones and desktop layouts keep content inside the page; study printing remains readable',async({page})=>{
  for(const width of [360,760,1280,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const route of ['/#/learn','/#/learn/classes/trace','/#/learn/classes/sandbox','/#/learn/access/where','/#/learn/lifetime/check']) {
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route}`).toBe(true);
    }
  }
  await page.goto('/#/learn/classes/definition'); await page.emulateMedia({media:'print'});
  await expect(page.locator('.concept-lesson')).toBeVisible(); await expect(page.locator('.concept-nav')).not.toBeVisible();
});
