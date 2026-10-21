import { test, expect } from '@playwright/test';
import { papers } from '../../src/bank.js';

test('published page cannot combine its layout with stale standalone CSS or scripts', async ({page}) => {
  const legacyRequests = [];
  await page.route('**/src/**', route => {
    legacyRequests.push(route.request().url());
    return route.fulfill({contentType:'text/css',body:'body { display: none !important; }'});
  });
  await page.goto('/');
  await expect(page.locator('.overview-stats')).toBeVisible();
  await expect(page.locator('.paper-card')).toHaveCount(5);
  expect(await page.locator('.site-header').evaluate(el => getComputedStyle(el).position)).toBe('fixed');
  expect(await page.locator('.site-header nav svg').first().evaluate(el => el.getBoundingClientRect().width)).toBe(18);
  await page.getByRole('link', {name:'핵심 정리',exact:true}).click();
  await expect(page.locator('.study-section')).toHaveCount(10);
  expect(legacyRequests).toEqual([]);
});

test('five papers each expose 20 questions, mandatory stars, sources and no answer before submission', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.paper-card')).toHaveCount(5);
  for (const p of papers) {
    await page.goto(`/#/exam/${p.id}`);
    await expect(page.locator('.question')).toHaveCount(20);
    await expect(page.locator(`#q-${p.id}-14 .star-tag`)).toHaveText('★★★');
    await expect(page.locator('.answer-review')).toHaveCount(0);
    await expect(page.locator('.source-details')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: `${Number(p.id)}회 모의고사`, exact: true })).toBeVisible();
  }
  await page.goto('/#/guide');
  await expect(page.getByText('5장 · 클래스와 객체', {exact:true})).toBeVisible();
  await expect(page.getByText('노란 별 3개 · 필수', {exact:true})).toBeVisible();
});

test('typing, Tab, focus changes, flags and reload preserve independent drafts', async ({ page, context }) => {
  await page.goto('/#/exam/01');
  const input = page.locator('#answer-01-3');
  await input.fill('std::cout'); await input.press('Tab'); await input.press('End'); await input.type(' << "Hi";');
  await expect(input).toHaveValue('std::cout\t << "Hi";');
  await expect(input).toBeFocused();
  await input.press('Escape'); await input.press('Tab'); await expect(input).not.toBeFocused();
  await page.locator('[data-flag="01-3"]').click();
  const other = await context.newPage(); await other.goto('about:blank'); await page.bringToFront();
  await expect(input).toHaveValue('std::cout\t << "Hi";'); await other.close();
  await page.reload(); await expect(input).toHaveValue('std::cout\t << "Hi";');
  await expect(page.locator('[data-flag="01-3"]')).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#/exam/02'); await expect(page.locator('#answer-02-3')).toHaveValue('');
  await page.goto('/#/exam/01'); await expect(input).toHaveValue('std::cout\t << "Hi";');
});

test('all five answer sheets submit, self-grade, and retain results on reload', async ({ page }) => {
  for (const p of papers) {
    await page.goto(`/#/exam/${p.id}`);
    for (const q of p.questions) {
      if (q.type === 'single') await page.locator(`input[data-q="${q.id}"][value="${q.answer}"]`).check();
      else if (q.type === 'multi') for (const value of q.answer) await page.locator(`input[data-q="${q.id}"][value="${value}"]`).check();
      else if (q.type === 'ox') for (const [i, value] of q.answer.entries()) await page.locator(`input[data-q="${q.id}"][data-part="${i}"][value="${value}"]`).check();
      else await page.locator(`#answer-${q.id}`).fill(q.type === 'written' ? q.solution : q.answers[0]);
    }
    await expect(page.locator('#progress-text')).toHaveText('20 / 20문항 작성');
    await page.locator('[data-action="submit"]').first().click();
    await page.getByRole('button', {name:'제출하고 해설 보기',exact:true}).click();
    await expect(page.locator('#result-card')).toContainText('95');
    await expect(page.locator('#result-card')).toContainText('직접 확인 1');
    await page.locator(`[data-id="${p.id}-20"][data-self="correct"]`).click();
    await expect(page.locator('#result-card')).toContainText('정답 20');
    await page.reload(); await expect(page.locator('#result-card')).toContainText('정답 20');
  }
});

test('unknown code and output errors stay distinct; manual verdict is invalidated on editing', async ({ page }) => {
  await page.goto('/#/exam/01');
  await page.locator('#answer-01-3').fill('std::cout << "Hello\\n";');
  await page.locator('#answer-01-16').fill('15 5');
  await page.locator('[data-action="submit"]').first().click();
  await expect(page.locator('#dialog-message')).toContainText('18문항이 미응답');
  await page.getByRole('button', {name:'제출하고 해설 보기',exact:true}).click();
  await expect(page.locator('#feedback-01-3 .review-heading strong')).toHaveText('직접 확인');
  await expect(page.locator('#feedback-01-16 .review-heading strong')).toHaveText('오답');
  await page.locator('[data-id="01-3"][data-self="correct"]').click();
  await page.locator('[data-action="edit"]').click();
  await page.locator('#answer-01-3').fill('invalid new answer');
  await page.locator('[data-action="submit"]').first().click();
  await page.getByRole('button', {name:'제출하고 해설 보기',exact:true}).click();
  await expect(page.locator('#feedback-01-3 .review-heading strong')).toHaveText('직접 확인');
});

test('paper print excludes stored answers and grading; answer key is a separate print', async ({ page }) => {
  await page.goto('/#/exam/03');
  await page.locator('#answer-03-3').fill('DO_NOT_PRINT_MY_DRAFT');
  await page.evaluate(() => { window.print = () => {}; });
  await page.getByRole('button', {name:'시험지 인쇄',exact:true}).click();
  await expect(page.locator('#print-root .print-question')).toHaveCount(20);
  await expect(page.locator('#print-root')).not.toContainText('DO_NOT_PRINT_MY_DRAFT');
  await expect(page.locator('#print-root')).not.toContainText('정답 / 예시 답안');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#main')).not.toBeVisible();
  await expect(page.locator('#print-root')).toBeVisible();
  await page.emulateMedia({media:'screen'});
  await page.locator('[data-action="submit"]').first().click();
  await page.getByRole('button', {name:'제출하고 해설 보기',exact:true}).click();
  await page.getByRole('button', {name:'해설 인쇄',exact:true}).click();
  await expect(page.locator('#print-root')).toContainText('정답 / 예시 답안');
});

test('reset is confirmed and affects only selected paper; stored HTML is plain text', async ({ page }) => {
  await page.goto('/#/exam/01');
  await page.locator('#answer-01-3').fill('<img src=x onerror="window.injected=true">');
  await page.goto('/#/exam/02'); await page.locator('#answer-02-3').fill('keep this');
  await page.goto('/#/exam/01'); await page.reload();
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await expect(page.locator('#answer-01-3')).toHaveValue('<img src=x onerror="window.injected=true">');
  await page.locator('[data-action="submit"]').first().click();
  await page.getByRole('button',{name:'제출하고 해설 보기',exact:true}).click();
  await page.locator('[data-action="retry"]').first().click(); await page.getByRole('button',{name:'취소',exact:true}).click();
  await expect(page.locator('#answer-01-3')).toHaveValue('<img src=x onerror="window.injected=true">');
  await page.locator('[data-action="retry"]').first().click(); await page.getByRole('button',{name:'지우고 다시 풀기',exact:true}).click();
  await expect(page.locator('#answer-01-3')).toHaveValue('');
  await page.goto('/#/exam/02'); await expect(page.locator('#answer-02-3')).toHaveValue('keep this');
});

test('storage failure is visible and never silently clears an active answer', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded','QuotaExceededError'); }; });
  await page.goto('/#/exam/01');
  await page.locator('#answer-01-3').fill('answer stays here');
  await expect(page.locator('#save-status')).toContainText('저장 실패');
  await expect(page.locator('#answer-01-3')).toHaveValue('answer stays here');
});

test('1280px desktop has no horizontal page overflow or script errors', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width:1280,height:900});
  for (const route of ['/', '/#/exam/03', '/#/guide', '/#/study']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('study notes cover highlighted topics, jump to sections, cite PDF pages, and preserve exam drafts', async ({page}) => {
  await page.goto('/#/exam/01');
  await page.locator('#answer-01-3').fill('my saved answer');
  await page.getByRole('link',{name:'핵심 정리',exact:true}).click();
  await expect(page.locator('.study-section')).toHaveCount(10);
  await expect(page.locator('#study-access')).toContainText('5장 63쪽');
  await expect(page.locator('#study-access')).toContainText('public');
  await expect(page.locator('#study-access')).toContainText('private');
  await expect(page.locator('#study-access')).toContainText('protected');
  await page.locator('[data-study-jump="lifetime-functions"]').click();
  await expect(page.locator('#study-lifetime-functions h2')).toBeInViewport();
  await expect(page.locator('#study-lifetime-functions')).toContainText('~Book');
  await page.locator('#study-lifetime-functions summary').click();
  await expect(page.locator('#study-lifetime-functions details')).toContainText('23–27, 38–40, 49–50쪽');
  await expect(page.locator('#study-lifetime-functions details')).toContainText('C++ Programming.pdf');
  await expect(page.locator('#study-lifetime-functions details')).toContainText('107–111, 115–121쪽');
  await expect(page.locator('.practice-review')).toHaveCount(5);
  await page.goto('/#/exam/01');
  await expect(page.locator('#answer-01-3')).toHaveValue('my saved answer');
});

test('normal study printing shows the study page instead of a previous exam print', async ({page}) => {
  await page.goto('/#/exam/01');
  await page.evaluate(() => { window.print = () => {}; });
  await page.getByRole('button', {name:'시험지 인쇄',exact:true}).click();
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await page.goto('/#/study');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.locator('#study-access')).toBeVisible();
  await expect(page.locator('.study-nav')).not.toBeVisible();
  await expect(page.locator('#print-root')).not.toBeVisible();
});
