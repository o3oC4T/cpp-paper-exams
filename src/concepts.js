import { papers } from './bank.js';
import { courses, totalSteps, totalChecks } from './concept-content.js';
import { sources } from './sources.js';
import { traces, loopTrace, updateCircle, updatePointer } from './concept-models.js';
import { readProgress, writeProgress, freshProgress, completedSteps, quizScore } from './concept-storage.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich = value => esc(value).replace(/`([^`]+)`/g, '<code>$1</code>');
const code = (value, label = 'C++ 코드') => `<figure class="concept-code"><figcaption>${esc(label)}</figcaption><pre><code>${esc(value)}</code></pre></figure>`;
const href = (c, s) => `#/learn/${c.id}/${s || c.steps[0].id}`;
let progress;
let current;
let traceIndex = 0;
let limit = 3;
let objects = {donut:2, pizza:5};
let pointer = {a:3, b:8, p:'a'};

function getProgress() {
  if (!progress) { try { progress = readProgress(localStorage); } catch { progress = freshProgress(); } }
  return progress;
}
function persist() {
  let saved = false;
  try { saved = writeProgress(progress, localStorage); } catch { /* Keep in-memory progress. */ }
  const status = document.querySelector('#concept-save');
  if (status) { status.textContent = saved ? '학습 기록이 이 브라우저에 저장됩니다.' : '브라우저 저장을 사용할 수 없어요. 현재 화면에서는 계속 공부할 수 있습니다.'; status.classList.toggle('save-error', !saved); }
}
const savedNotice = () => '<p id="concept-save" class="concept-save" role="status">학습 기록이 이 브라우저에 저장됩니다.</p>';

export function conceptHomeCard() {
  return `<section class="concept-entry"><div><span class="eyebrow">CONCEPT LAB</span><h2>외우기 전에, 한 줄씩 이해하기.</h2><p>8개 단원 · ${totalSteps}개 설명 · 코드 실행 추적 · 이해 확인 ${totalChecks}문항</p></div><a class="button" href="#/learn">개념 공부 시작하기 <span aria-hidden="true">→</span></a></section>`;
}

export function renderConcepts(main, path) {
  getProgress();
  const [courseId, stepId] = path;
  current = courses.find(c => c.id === courseId);
  if (!courseId) { renderIndex(main); return '개념 공부'; }
  if (!current || (stepId && stepId !== 'check' && !current.steps.some(s => s.id === stepId))) {
    main.innerHTML = '<div class="wrap concept-page"><h1>학습 페이지를 찾을 수 없습니다.</h1><a class="button" href="#/learn">개념 공부 목록으로</a></div>';
    return '개념 공부';
  }
  const c = current, activeId = stepId || c.steps[0].id;
  const index = c.steps.findIndex(s => s.id === activeId), lesson = c.steps[index];
  traceIndex = 0; limit = 3; objects = {donut:2,pizza:5}; pointer = {a:3,b:8,p:'a'};
  progress.last = `${c.id}/${activeId}`;
  main.innerHTML = `<div class="wrap concept-page">
    <a href="#/learn" class="back-link">← 개념 공부 목록</a>
    <header class="concept-heading"><div><p class="eyebrow">CONCEPT ${c.icon} <span>· ${esc(c.tag)}</span></p><h1>${esc(c.title)}</h1><p>${esc(c.subtitle)}</p></div><span class="concept-course-count" id="course-count">${completedSteps(progress,c)} / ${c.steps.length}개 읽음</span></header>
    <div class="concept-layout"><nav class="concept-nav" aria-label="단원 학습 목차"><button class="concept-nav-toggle" data-concept-action="toggle-nav" aria-expanded="false">단원 목차 펼치기 ↓</button><p>이 단원의 순서</p>${c.steps.map((s,i)=>`<a href="${href(c,s.id)}" ${activeId === s.id ? 'aria-current="step"' : ''}><span class="step-number">${String(i+1).padStart(2,'0')}</span><span>${esc(s.title)}</span><span class="step-done" data-done-mark="${s.id}">${progress.done[`${c.id}/${s.id}`] ? '<span aria-label="읽음">✓</span>' : ''}</span></a>`).join('')}<a href="${href(c,'check')}" ${activeId === 'check' ? 'aria-current="step"' : ''}><span class="step-number">✓</span><span>이해 확인 ${c.checks.length}문항</span></a><div class="concept-nav-footer"><a href="#/study">핵심 정리 모아보기 ↗</a><a href="#/learn">다른 단원 고르기 ↗</a></div></nav>
    <div class="concept-main">${lesson ? lessonHTML(c,lesson,index) : checksHTML(c)}${savedNotice()}</div></div></div>`;
  if (lesson?.trace) paintTrace();
  if (lesson?.sandbox === 'circle') paintCircle();
  if (lesson?.sandbox === 'pointer') paintPointer();
  persist();
  return `${c.title} · 개념 공부`;
}

function renderIndex(main) {
  const done = courses.reduce((n,c)=>n+completedSteps(progress,c),0);
  main.innerHTML = `<div class="wrap concept-page concept-index">
    <header class="concept-heading"><div><p class="eyebrow">READ · TRACE · TRY</p><h1>코드가 이해되는 순간까지.</h1><p>설명을 읽고, 실행을 따라가고, 직접 바꿔보는 개념 공부.</p></div><span class="course-badge">강의 1–5장</span></header>
    <section class="concept-welcome"><div><p class="eyebrow">CONCEPT LAB</p><h2>한 줄의 코드가<br>어떤 값을 바꿀까요?</h2><p>정답을 보기 전에 다음 상태를 예상해보세요.<br>시험에 나오는 이유까지 차근차근 연결합니다.</p><a class="button" href="#/learn/${progress.last || 'classes/type'}">${progress.last ? '이어서 공부하기' : '클래스부터 이해하기'} →</a><a class="concept-start" href="#/learn/basics/build">기본 문법부터 순서대로 →</a></div><div class="concept-preview" aria-label="두 객체의 값 예시"><div><span>donut</span><code>radius = 4</code></div><div><span>pizza</span><code>radius = 5</code></div><p><code>donut.setRadius(4);</code><br>호출한 객체의 값만 바뀌어요.</p></div></section>
    <div class="concept-overview"><span><strong>8</strong>개 단원</span><span><strong>${totalSteps}</strong>개 단계별 설명</span><span><strong>${totalChecks}</strong>개 이해 확인</span><span id="all-progress"><strong>${done}</strong> / ${totalSteps}개 읽음</span></div>
    <div class="concept-section-heading"><h2>나에게 필요한 개념부터</h2><p>처음에는 01부터, 클래스가 어렵다면 06부터 시작해도 좋아요.</p></div>
    <div class="concept-courses">${courses.map(c=>{const count = completedSteps(progress,c); return `<article class="concept-card"><div class="concept-card-top"><span class="concept-number">${c.icon}</span><span class="study-badge">${esc(c.tag)}</span></div><h3><a href="${href(c)}">${esc(c.title)}</a></h3><p>${esc(c.description)}</p><div class="concept-card-meta"><span>${c.steps.length}단계 · 약 ${c.time}</span><span>${count} / ${c.steps.length} 읽음</span></div><progress value="${count}" max="${c.steps.length}" aria-label="${esc(c.title)} 읽은 단계"></progress><div class="concept-card-bottom"><span>${progress.checked[c.id] ? `이해 확인 ${quizScore(progress,c)} / ${c.checks.length}` : `이해 확인 ${c.checks.length}문항`}</span><a href="${href(c,c.steps.find(s=>!progress.done[`${c.id}/${s.id}`])?.id || 'check')}" class="text-link">${count ? '이어서' : '시작하기'} →</a></div></article>`;}).join('')}</div>
    <section class="concept-scope"><h2>이번 시험 자료에 맞췄어요.</h2><p>현재 폴더의 강의 1~5장과 모의고사 20문항 유형을 기준으로 구성했습니다. 각 단원 아래에서 강의 PDF 쪽수와 관련 문제를 확인할 수 있어요. 쪽수는 PDF 첫 페이지부터 센 번호입니다.</p><p>참고 사이트의 객체 포인터·동적 생성·참조·복사 생성자는 이번 강의의 장 구성과 다릅니다. 이곳은 기본 포인터와 배열, 함수, 클래스, 생성자·소멸자와 접근 지정자까지 현재 자료에 맞춰 설명합니다.</p><p>실습은 표시된 예제의 동작을 보여주는 시각화입니다. 값을 고르거나 단계를 이동할 수 있으며, 임의의 C++ 코드를 실행하는 컴파일러는 아닙니다.</p><a class="text-link" href="https://o3oc4t.github.io/cpp-midterm-practice/classes.html" target="_blank" rel="noopener noreferrer">참고한 학습 방식 · 클래스 이해하기 ↗</a></section>
    ${savedNotice()}</div>`;
  persist();
}

function lessonHTML(c,s,index) {
  const next = c.steps[index+1]?.id || 'check';
  return `<article class="concept-lesson" data-lesson="${s.id}"><div class="concept-lesson-meta"><span>STEP ${String(index+1).padStart(2,'0')} / ${c.steps.length}</span><span>${esc(c.tag)}</span></div><h2>${esc(s.title)}</h2><p class="concept-lead">${rich(s.lead)}</p>${s.paragraphs.map(p=>`<p>${rich(p)}</p>`).join('')}
    ${s.flow ? `<ol class="concept-flow">${s.flow.map(v=>`<li>${rich(v)}</li>`).join('')}</ol>`:''}
    ${s.cells ? `<div class="memory-cells">${s.cells.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>`:''}
    ${s.code ? code(s.code,s.codeLabel || '코드 예제 · 문맥이 생략된 코드는 해당 함수 안에서 사용') : ''}
    ${s.annotations ? `<dl class="concept-annotations">${s.annotations.map(([k,v])=>`<div><dt><code>${esc(k)}</code></dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:''}
    ${s.output !== undefined ? `<div class="concept-output"><span>실행 결과</span><pre>${esc(s.output)}</pre></div>` : ''}
    ${s.table ? `<div class="source-table"><table><thead><tr>${s.table.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}
    ${s.trace ? traceHTML(s.trace) : ''}
    ${s.sandbox === 'circle' ? circleHTML() : s.sandbox === 'pointer' ? pointerHTML() : ''}
    ${s.practice ? `<div class="practice-links">${papers.map(p=>`<a class="button secondary small" href="#/exam/${p.id}/20">${Number(p.id)}회 20번 풀기 →</a>`).join('')}</div>`:''}
    <aside class="concept-takeaway"><strong>이 단계에서 가져갈 것</strong><p>${rich(s.takeaway)}</p></aside>
    ${s.external ? `<p class="concept-reference"><a href="${s.external.url}" target="_blank" rel="noopener noreferrer">${esc(s.external.title)} ↗</a></p>`:''}
    ${sourcesHTML(c)}
    <footer class="concept-bottom"><button class="button secondary" data-concept-action="done" data-step="${s.id}" aria-pressed="${!!progress.done[`${c.id}/${s.id}`]}">${progress.done[`${c.id}/${s.id}`] ? '✓ 읽은 단계' : '이 단계 읽음 표시'}</button><div>${index>0 ? `<a class="text-link" href="${href(c,c.steps[index-1].id)}">← 이전</a>`:''}<a class="button" href="${href(c,next)}">${next === 'check' ? '이해 확인하기' : '다음 단계'} →</a></div></footer>
    </article>`;
}

function sourcesHTML(c) {
  return `<footer class="concept-sources"><details><summary>강의 자료 쪽수 · ${c.exams.join(', ')}번 유형 연결</summary><p>이 단원의 근거 · PDF 첫 페이지가 1쪽입니다.</p>${c.refs.map(r=>`<p>${esc(sources[r.id].title)} · ${esc(r.pages)}쪽<br><small>${esc(sources[r.id].file)}</small></p>`).join('')}<p>1회 모의고사에서 바로 연습하기</p><div class="practice-links">${c.exams.map(n=>`<a href="#/exam/01/${n}">${n}번 →</a>`).join('')}</div></details></footer>`;
}

function checksHTML(c) {
  const checked = !!progress.checked[c.id];
  const next = courses[courses.indexOf(c)+1];
  return `<article class="concept-lesson"><div class="concept-lesson-meta"><span>CHECK YOUR UNDERSTANDING</span><span>${c.checks.length}문항</span></div><h2>설명 없이도 판단할 수 있나요?</h2><p class="concept-lead">답을 고르고 확인해보세요. 틀린 이유까지 이해하면 이 단원이 내 것이 됩니다.</p><form id="concept-quiz">${c.checks.map((q,i)=>{const key=`${c.id}/${q.id}`, selected = progress.answers[key]; return `<fieldset class="concept-check"><legend><span>${i+1}</span>${esc(q.prompt)}</legend>${q.options.map((o,n)=>`<label><input type="radio" name="${q.id}" value="${n}" ${selected===n ? 'checked':''}><span>${esc(o)}</span></label>`).join('')}${checked ? `<div class="concept-feedback ${selected===q.answer?'correct':'wrong'}"><strong>${selected===q.answer?'정답':'다시 확인'} · ${esc(q.options[q.answer])}</strong><p>${esc(q.explanation)}</p></div>`:''}</fieldset>`;}).join('')}<p id="quiz-message" role="status">${checked ? `${c.checks.length}문항 중 ${quizScore(progress,c)}문항 정답입니다. 답을 바꾸고 다시 확인할 수 있어요.` : '선택한 답은 자동으로 저장됩니다.'}</p><button type="submit" class="button">${checked ? '다시 채점하기' : '정답과 이유 확인하기'}</button></form>${sourcesHTML(c)}<footer class="concept-bottom"><a class="text-link" href="${href(c)}">← 설명 다시 보기</a><a class="button secondary" href="${next ? href(next) : '#/learn'}">${next ? `다음 단원 · ${esc(next.title)}` : '개념 공부 목록으로'} →</a></footer></article>`;
}

function traceHTML(id) {
  return `<section class="trace-widget" data-trace="${id}" aria-label="코드 실행 추적"><div class="trace-top"><h3>한 단계씩 따라가기</h3><span>예제 시각화</span></div>${id==='control' ? '<label class="trace-limit">반복 끝값 <select id="trace-limit" aria-label="반복 끝값">'+[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===3?'selected':''}>${n}</option>`).join('')+'</select><span>바꾸면 첫 단계로 돌아갑니다.</span></label>' : ''}<div class="trace-body"><div id="trace-code" class="trace-code" tabindex="0" aria-label="줄 번호가 있는 C++ 예제"></div><div class="trace-state"><h4>지금의 값</h4><div id="trace-values" class="memory-cells"></div><div class="concept-output"><span>현재까지의 출력</span><pre id="trace-output"></pre></div></div></div><p id="trace-note" role="status"></p><div class="trace-controls"><button type="button" class="button secondary small" data-concept-action="trace-prev">← 이전 단계</button><span id="trace-count"></span><button type="button" class="button small" data-concept-action="trace-next">한 단계 진행 →</button><button type="button" class="text-button" data-concept-action="trace-reset">처음으로</button></div></section>`;
}
function paintTrace() {
  const widget = document.querySelector('[data-trace]'); if (!widget) return;
  const model = widget.dataset.trace==='control' ? loopTrace(limit) : traces[widget.dataset.trace];
  const f = model.frames[traceIndex];
  document.querySelector('#trace-code').innerHTML = model.code.split('\n').map((line,i)=>`<div class="trace-line ${f.line===i+1?'active':''}" ${f.line===i+1?'aria-current="step"':''}><span aria-hidden="true">${i+1}</span><code>${esc(line) || ' '}</code></div>`).join('');
  document.querySelector('#trace-values').innerHTML = Object.entries(f.values).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('') || '<p class="empty-state">아직 생성된 변수가 없습니다.</p>';
  const out = document.querySelector('#trace-output'); out.textContent = f.output || '아직 출력 없음'; out.classList.toggle('empty-state', !f.output);
  document.querySelector('#trace-note').textContent = f.note;
  document.querySelector('#trace-count').textContent = `${traceIndex} / ${model.frames.length-1}`;
  document.querySelector('[data-concept-action="trace-prev"]').disabled = traceIndex===0;
  document.querySelector('[data-concept-action="trace-next"]').disabled = traceIndex===model.frames.length-1;
}
function circleHTML() {
  return `<section class="concept-sandbox" aria-label="두 객체 실습"><div class="sandbox-controls"><label>호출 대상<select id="circle-target"><option value="donut">donut</option><option value="pizza">pizza</option></select></label><label>전달할 r = <output id="circle-radius-label">4</output><input id="circle-radius" type="range" min="0" max="8" value="4"></label></div><div class="sandbox-pending"><code id="circle-pending">donut.setRadius(4);</code><button class="button small" data-concept-action="circle-apply">함수 호출하기</button></div><div id="circle-objects" class="object-pair"></div><p id="circle-message" role="status">객체와 값을 고르고 함수를 호출해보세요.</p><button class="text-button" data-concept-action="circle-reset">처음 값 2, 5로 되돌리기</button></section>`;
}
function paintCircle() {
  document.querySelector('#circle-objects').innerHTML = Object.entries(objects).map(([name,r])=>`<div class="object-card" data-object="${name}"><span class="object-name">${name}</span><span class="object-type">Circle 객체</span><div class="object-circle" style="--radius:${25+r*7}px" aria-hidden="true"></div><code>radius = ${r}</code><small>getRadius() → ${r}</small></div>`).join('');
}
function pointerHTML() {
  return `<section class="concept-sandbox" aria-label="포인터 대상 변경 실습"><div id="pointer-values" class="memory-cells"></div><div class="sandbox-controls"><label>새로 가리킬 변수<select id="pointer-target"><option value="a">a</option><option value="b">b</option></select></label><button class="button secondary small" data-concept-action="pointer-point">p에 주소 대입</button><label>*p에 저장할 값<input id="pointer-number" type="number" min="0" max="20" value="7"></label><button class="button small" data-concept-action="pointer-write">*p에 값 대입</button></div><p id="pointer-message" role="status">p는 처음에 a를 가리킵니다. 값을 대입하면 a가 바뀝니다.</p><button class="text-button" data-concept-action="pointer-reset">처음 상태로 되돌리기</button></section>`;
}
function paintPointer() {
  document.querySelector('#pointer-values').innerHTML = [['a',pointer.a],['b',pointer.b],['p',`→ ${pointer.p}`],['*p',pointer[pointer.p]]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
}

export function bindConceptEvents(main) {
  main.addEventListener('click', event => {
    const button = event.target.closest('[data-concept-action]'); if (!button || !current) return;
    const action = button.dataset.conceptAction;
    if (action==='toggle-nav') {
      const expanded = document.querySelector('.concept-nav').classList.toggle('expanded');
      button.setAttribute('aria-expanded', String(expanded)); button.textContent = expanded ? '단원 목차 접기 ↑' : '단원 목차 펼치기 ↓';
    } else if (action==='done') {
      const key=`${current.id}/${button.dataset.step}`; progress.done[key]=!progress.done[key];
      button.setAttribute('aria-pressed',String(progress.done[key])); button.textContent=progress.done[key]?'✓ 읽은 단계':'이 단계 읽음 표시';
      document.querySelector(`[data-done-mark="${button.dataset.step}"]`).innerHTML=progress.done[key]?'<span aria-label="읽음">✓</span>':'';
      document.querySelector('#course-count').textContent=`${completedSteps(progress,current)} / ${current.steps.length}개 읽음`; persist();
    } else if (action.startsWith('trace-')) {
      const id=document.querySelector('[data-trace]').dataset.trace, model=id==='control'?loopTrace(limit):traces[id];
      traceIndex=action==='trace-reset'?0:Math.max(0,Math.min(model.frames.length-1,traceIndex+(action==='trace-next'?1:-1))); paintTrace();
    } else if (action==='circle-apply') {
      const target=document.querySelector('#circle-target').value, r=Number(document.querySelector('#circle-radius').value);
      objects=updateCircle(objects,target,r); paintCircle();
      document.querySelector('#circle-message').textContent=r>0?`${target}.setRadius(${r}); → ${target}의 radius만 ${r}로 바뀌었습니다.`:`${target}.setRadius(0); → 0 > 0은 거짓이라 기존 값 ${objects[target]}을 유지합니다.`;
    } else if (action==='circle-reset') {
      objects={donut:2,pizza:5}; paintCircle(); document.querySelector('#circle-message').textContent='객체 값을 2, 5로 되돌렸습니다.';
    } else if (action==='pointer-point') {
      const target=document.querySelector('#pointer-target').value; pointer=updatePointer(pointer,'point',target); paintPointer();
      document.querySelector('#pointer-message').textContent=`p = &${target}; → 주소만 바뀝니다. a는 ${pointer.a}, b는 ${pointer.b} 그대로입니다.`;
    } else if (action==='pointer-write') {
      const input=document.querySelector('#pointer-number');
      if (!input.value.trim() || !input.checkValidity()) { document.querySelector('#pointer-message').textContent='0~20 사이의 정수를 입력하세요.'; input.focus(); return; }
      const value=Number(input.value); pointer=updatePointer(pointer,'write',value); paintPointer();
      document.querySelector('#pointer-message').textContent=`*p = ${value}; → 현재 대상 ${pointer.p}의 값이 ${value}로 바뀝니다.`;
    } else if (action==='pointer-reset') {
      pointer={a:3,b:8,p:'a'}; paintPointer(); document.querySelector('#pointer-message').textContent='a = 3, b = 8, p → a로 되돌렸습니다.';
    }
  });
  main.addEventListener('input', event=>{
    if (event.target.matches('#circle-radius, #circle-target')) {
      const r=document.querySelector('#circle-radius').value, target=document.querySelector('#circle-target').value;
      document.querySelector('#circle-radius-label').textContent=r; document.querySelector('#circle-pending').textContent=`${target}.setRadius(${r});`;
    }
  });
  main.addEventListener('change', event=>{
    if (event.target.id==='trace-limit') {limit=Number(event.target.value); traceIndex=0; paintTrace();}
    if (event.target.closest('#concept-quiz') && current) {
      progress.answers[`${current.id}/${event.target.name}`]=Number(event.target.value);
      delete progress.checked[current.id];
      // Remove stale verdicts as soon as the user edits any answer.
      main.querySelectorAll('.concept-feedback').forEach(el=>el.remove());
      document.querySelector('#quiz-message').textContent='답을 변경했습니다. 정답과 이유 확인하기를 눌러 다시 채점하세요.';
      main.querySelector('#concept-quiz button[type="submit"]').textContent='정답과 이유 확인하기'; persist();
    }
  });
  main.addEventListener('submit', event=>{
    if (event.target.id!=='concept-quiz' || !current) return;
    event.preventDefault();
    const unanswered=current.checks.filter(q=>!Object.hasOwn(progress.answers,`${current.id}/${q.id}`));
    if (unanswered.length) {
      document.querySelector('#quiz-message').textContent=`아직 ${unanswered.length}문항을 고르지 않았어요. 모두 답한 뒤 확인해보세요.`;
      main.querySelector(`input[name="${unanswered[0].id}"]`).focus(); return;
    }
    progress.checked[current.id]=true;
    main.querySelector('.concept-lesson').outerHTML=checksHTML(current); persist();
    document.querySelector('#quiz-message').scrollIntoView({block:'center'});
    main.querySelector('#concept-quiz button[type="submit"]').focus({preventScroll:true});
  });
}
