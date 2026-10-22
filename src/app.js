import { papers, types } from './bank.js';
import { sources, blueprint, emphasis, standardNotes } from './sources.js';
import { answered, grade, score, answerText } from './grading.js';
import { freshState, loadState, saveState } from './storage.js';
import { studySections, practiceReview } from './study.js';
import { renderConcepts, bindConceptEvents, conceptHomeCard } from './concepts.js';

const main = document.querySelector('#main');
bindConceptEvents(main);
const memory = new Map();
let paper, state, toastTimer;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const code = value => `<pre class="code"><code>${esc(value)}</code></pre>`;
const getState = id => {
  if (!memory.has(id)) memory.set(id, loadState(id));
  return memory.get(id);
};
const countAnswered = (p, s) => p.questions.filter(q => answered(q, s.answers[q.id])).length;
const labels = { correct: '정답', wrong: '오답', blank: '미응답', review: '직접 확인' };

function toast(text) {
  document.querySelector('#toast').textContent = text;
  document.querySelector('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => document.querySelector('#toast').classList.remove('visible'), 3500);
}

async function confirmAction(title, message, button) {
  const dialog = document.querySelector('#confirm-dialog');
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-message').textContent = message;
  document.querySelector('#dialog-confirm').textContent = button;
  dialog.returnValue = '';
  const result = new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true }));
  dialog.showModal();
  return result;
}

function save() {
  const ok = saveState(paper.id, state);
  const status = document.querySelector('#save-status');
  if (status) {
    status.textContent = ok ? '이 브라우저에 저장됨' : '저장 실패 · 답안을 복사해 보관해 주세요';
    status.classList.toggle('save-error', !ok);
  }
}

function renderHome() {
  paper = null; state = null;
  const completed = papers.filter(p => getState(p.id).submitted).length;
  const written = papers.reduce((sum, p) => sum + countAnswered(p, getState(p.id)), 0);
  const totalQuestions = papers.reduce((sum, p) => sum + p.questions.length, 0);
  const percent = Number((written / totalQuestions * 100).toFixed(1));
  const next = papers.find(p => !getState(p.id).submitted && countAnswered(p, getState(p.id))) || papers.find(p => !getState(p.id).submitted) || papers[0];
  main.innerHTML = `<div class="home wrap">
    <div class="dashboard-heading"><div><p class="eyebrow">YOUR STUDY SPACE</p><h1>학습 대시보드</h1><p>개념을 확인하고, 코드의 흐름을 직접 따라가 보세요.</p></div><span class="course-badge">지필 시험 연습</span></div>
    <section class="overview-stats" aria-label="학습 현황">
      <div class="stat-card"><span class="stat-icon" aria-hidden="true">✓</span><div><span>제출한 시험</span><strong>${completed}<small> / ${papers.length}회</small></strong></div><span class="stat-detail">회차별 복습</span></div>
      <div class="stat-card"><span class="stat-icon violet" aria-hidden="true">{ }</span><div><span>작성한 답</span><strong>${written}<small> / ${totalQuestions}문항</small></strong></div><span class="stat-detail">자동 저장</span></div>
      <div class="stat-card"><span class="stat-icon amber" aria-hidden="true">≡</span><div><span>핵심 정리</span><strong>10<small>개 주제</small></strong></div><a class="stat-link" href="#/study" aria-label="핵심 정리 공부하기">↗</a></div>
    </section>
    <section class="hero">
      <div><p class="eyebrow"><span class="live-dot"></span> C++ MIDTERM PRACTICE</p><h2>한 문제씩,<br>확실하게 익히는 C++.</h2><p class="hero-copy">강의의 강조 표시와 교재를 담은 20문항 × ${papers.length}회.<br>직접 답을 쓰고, 해설로 이해를 확인하세요.</p><a class="button" href="#/exam/${next.id}">${Number(next.id)}회 ${getState(next.id).submitted ? '다시 살펴보기' : countAnswered(next, getState(next.id)) ? '이어서 풀기' : '시작하기'} <span aria-hidden="true">→</span></a></div>
      <div class="hero-progress"><div class="progress-ring" style="--progress:${written / totalQuestions * 360}deg" role="img" aria-label="전체 ${totalQuestions}문항 중 ${written}문항 작성"><div><strong>${percent}<small>%</small></strong><span>전체 답안 작성</span></div></div><span class="progress-caption">조금씩 쌓이는 나의 기록</span></div>
    </section>
    ${conceptHomeCard()}
    <div class="dashboard-grid"><section class="exam-list" aria-labelledby="list-title"><div class="section-heading"><div><h2 id="list-title">모의고사 목록 <span>${String(papers.length).padStart(2, '0')}</span></h2><p>회차마다 새로운 20문항을 준비했어요.</p></div><span class="completion">${completed} / ${papers.length}회 완료</span></div>
    <div class="paper-cards">${papers.map(p => {
      const s = getState(p.id); const n = countAnswered(p, s); const result = score(p, s);
      return `<article class="paper-card"><span class="paper-number">${p.id}</span><div class="paper-info"><div class="card-top"><h3>${p.title}</h3><span class="tag ${s.submitted ? 'green' : n ? 'blue' : ''}">${s.submitted ? '제출 완료' : n ? '작성 중' : '시작 전'}</span></div><p>${p.subtitle}</p><div class="card-meta"><span>20문항</span><span>개념 · 코드 수정 · 서술형</span></div></div>
        <div class="paper-progress"><div class="progress-copy">${s.submitted ? `정답 ${result.correct} / 20` : `${n} / 20 작성`}</div><div class="card-progress"><span style="width:${n * 5}%"></span></div>${s.submitted && result.review ? `<small>직접 확인 ${result.review}개</small>` : ''}</div>
        <a class="button ${p.id === next.id ? '' : 'secondary'} small" href="#/exam/${p.id}" aria-label="${Number(p.id)}회 ${s.submitted ? '결과와 해설 보기' : n ? '이어서 풀기' : '시작하기'}">${s.submitted ? '해설 보기' : n ? '이어서 풀기' : '시작하기'} <span aria-hidden="true">→</span></a>
      </article>`;
    }).join('')}</div></section>
    <aside class="dashboard-aside"><section class="study-strip"><span class="panel-label">STUDY NOTE</span><div class="star-mark" aria-hidden="true">★★★</div><h2>중요한 개념부터<br>차근차근.</h2><p>별 3개 접근 지정자는 매 회차에.<br>비교표와 예제로 먼저 정리하세요.</p><ul class="topic-preview"><li><span>01</span>public · private · protected</li><li><span>02</span>생성자와 소멸자</li><li><span>03</span>코드 실행 순서</li></ul><a href="#/study" class="button full secondary">핵심 정리 공부하기 →</a></section><section class="print-tip"><span aria-hidden="true">↳</span><h3>종이에 풀어도 좋아요.</h3><p>시험 화면의 <strong>시험지 인쇄</strong>로<br>실제 시험처럼 연습해 보세요.</p></section></aside></div>
    <footer class="home-footer"><span><i></i> 답안은 이 브라우저에 자동 저장됩니다.</span><span>기기·브라우저 간 공유는 되지 않습니다.</span></footer>
  </div>`;
}

function renderGuide() {
  paper = null; state = null;
  main.innerHTML = `<div class="wrap guide"><a href="#/" class="back-link">← 시험 목록</a><p class="eyebrow">ABOUT THESE PAPERS</p><h1>자료를 이렇게 반영했어요.</h1><p class="lead">강의 PDF의 실제 화면과 색 강조를 확인해 만든 ${papers.length}회분의 연습 시험입니다.</p>
    <section class="guide-card"><h2>20문항의 순서를 유지했습니다.</h2><ol class="blueprint">${blueprint.map(topic => `<li>${esc(topic)}</li>`).join('')}</ol><p class="small-note">8번은 세부 유형이 제공되지 않아 기초 입출력으로 보완했습니다. 15번의 정확한 원문도 제공되지 않아 수업 범위의 대입·빈 반복문·참/거짓 함정으로 구성했습니다. 실제 시험 문항을 복원한 것은 아닙니다.</p></section>
    <section class="guide-card"><h2>색 강조와 별표</h2><p>기본 인쇄 글자색뿐 아니라 추가로 그린 펜 표시를 확인했습니다. 별 3개가 보이는 5장 63쪽의 세 접근 지정자는 모든 회차 14번에 포함됩니다.</p>
      <div class="source-table"><table><thead><tr><th>자료 · PDF 쪽수</th><th>화면에서 확인한 표시</th><th>반영 내용</th></tr></thead><tbody>${emphasis.map(e => `<tr><td>${esc(sources[e.source].title)}<br><span class="muted">${e.pages}쪽</span></td><td>${esc(e.mark)}</td><td>${esc(e.text)}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="guide-card"><h2>교재와 함께 확인했습니다.</h2><p>황기태의 『명품 C++ Programming』 3판에서 2장 C++ 프로그래밍의 기본, 3장 클래스와 객체의 해당 부분을 대조했습니다. 해설과 핵심 정리에 C++ Programming.pdf의 쪽수를 함께 표시했습니다.</p><p>시험 범위와 강조 사항은 강의 자료를 우선합니다. 강의의 5장 ‘클래스와 객체’는 책의 3장에 해당합니다. 책 뒤쪽의 내용을 추가 시험 범위로 확대하지 않았습니다.</p></section>
    <section class="guide-card"><h2>20번은 기존 실습문제입니다.</h2><ul>${papers.map(p => `<li>${Number(p.id)}회: ${esc(p.questions[19].original)}</li>`).join('')}</ul><p>1·2회는 PDF에 따로 있는 ‘시험 버전’과 같은 문제의 ‘실습 버전’ 작성 조건을 함께 제공합니다. 문제에 있는 변수·함수 이름과 출력 문구를 따릅니다.</p></section>
    <section class="guide-card"><h2>채점 방식</h2><ul><li>회차마다 20문항, 연습용으로 각 5점입니다. 실제 시험의 배점은 아닙니다.</li><li>‘모두 고르기’와 O/X 묶음은 해당 문항을 모두 맞혀야 5점입니다.</li><li>출력은 줄바꿈과 내용을 비교합니다. 줄 끝 공백·CRLF/LF·연속된 가로 공백은 허용합니다.</li><li>한 줄 코드는 알려진 답안과 기호·이름을 비교합니다. 다른 표현은 오답으로 단정하지 않고 ‘직접 확인’으로 남깁니다.</li><li>20번 서술형은 예시 답안과 기준을 보고 직접 채점합니다. 종이 답안도 제출 후 직접 채점할 수 있습니다.</li><li>코드를 서버로 전송하거나 컴파일하지 않습니다. 답안은 현재 브라우저에만 저장됩니다.</li></ul></section>
    <section class="guide-card"><h2>혼동하기 쉬운 기준</h2>${standardNotes.map(n => `<p>${esc(n.text)} <a href="${n.url}" target="_blank" rel="noopener noreferrer">${esc(n.title)} ↗</a></p>`).join('')}</section>
    <section class="guide-card"><h2>해설에서 찾을 수 있는 자료</h2><p>쪽수는 PDF의 첫 페이지를 1쪽으로 센 번호입니다. 원본 PDF는 수업 자료 폴더에서 확인하세요.</p><ul class="file-list">${Object.values(sources).map(s => `<li><strong>${s.title}</strong><br><span>${esc(s.file)}</span></li>`).join('')}</ul></section>
  </div>`;
}

function renderStudy() {
  paper = null; state = null;
  main.innerHTML = `<div class="wrap study"><a href="#/" class="back-link">← 시험 목록</a><p class="eyebrow">STUDY BEFORE THE TEST</p><div class="study-title"><div><h1>중요한 부분부터,<br><span class="highlight">한 번에 정리.</span></h1><p class="lead">색으로 강조한 개념을 비교표와 코드로 익히세요.<br>정답을 외우기 전에, 왜 그런지 확인하는 공간입니다.</p></div><div class="study-callout"><span>★★★</span><strong>가장 먼저 복습</strong><p>5장 63쪽<br>public · private · protected</p></div></div>
    <p class="study-note">『명품 C++ Programming』 3판의 해당 개념과 함께 정리했습니다. 각 주제 아래에서 강의 자료와 책의 쪽수를 확인하세요.</p>
    <a class="concept-study-link" href="#/learn">개념이 아직 낯설다면? 단계별 설명과 실행 추적으로 공부하기 →</a>
    <div class="study-layout"><aside class="study-nav" aria-label="핵심 정리 목차"><h2>학습 목차</h2>${studySections.map((s, i) => `<button data-study-jump="${s.id}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.title.split(':')[0])}</button>`).join('')}<button data-study-jump="practice"><span>10</span>실습 손코딩 체크</button><a class="button full small" href="#/exam/01">1회 풀어보기 →</a></aside>
    <div class="study-main">${studySections.map((s, i) => `<section id="study-${s.id}" class="study-section"><div class="study-section-meta"><span class="eyebrow">NOTE ${String(i + 1).padStart(2, '0')}</span><span class="study-badge">${esc(s.badge)}</span></div><h2>${esc(s.title)}</h2><p class="study-intro">${esc(s.intro)}</p>
      ${s.table ? `<div class="source-table"><table><thead><tr>${s.table.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
      ${s.note ? `<p class="study-note">${esc(s.note)}</p>` : ''}<ul class="study-points">${s.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul><div class="trap-note"><strong>헷갈리지 않기</strong><p>${esc(s.trap)}</p></div>
      ${(s.examples || []).map(e => `<h3 class="example-title">${esc(e.title)}</h3>${code(e.code)}<div class="sample"><span>실행 결과</span>${code(e.output)}</div>`).join('')}
      ${s.standard ? `<p class="study-note"><a href="${standardNotes[1].url}" target="_blank" rel="noopener noreferrer">C99 표준 근거 · WG14 N1256 ↗</a></p>` : ''}
      <footer class="study-source"><span>관련 유형: ${s.examNumbers}</span><details><summary>강의 자료·교재 쪽수 확인</summary>${s.sources.map(r => `<p>${esc(sources[r.id].title)} · ${r.pages}쪽<br>${esc(sources[r.id].file)}</p>`).join('')}</details></footer></section>`).join('')}
      <section id="study-practice" class="study-section"><p class="eyebrow">NOTE 10</p><h2>20번 실습: 손으로 다시 작성하기</h2><p>먼저 종이에 코드를 작성한 뒤, 각 시험의 20번 해설과 비교하세요. 아래는 기억해야 할 작성 기준입니다.</p>${practiceReview.map(p => `<article class="practice-review"><span class="study-badge">${Number(p.paper)}회 · ${esc(p.title)}</span><h3>${esc(p.prompt).replace(/\n/g, '<br>')}</h3><ul>${p.rubric.map(r => `<li>${esc(r)}</li>`).join('')}</ul><p class="study-note">${p.sources.map(s => `${sources[s.id].title} ${s.pages}쪽`).join(' · ')}</p><a class="text-link" href="#/exam/${p.paper}">${Number(p.paper)}회 모의고사 열기 →</a></article>`).join('')}</section>
    </div></div></div>`;
}

function questionBody(q) {
  return `<h3 id="title-${q.id}" class="question-prompt">${esc(q.prompt).replace(/\n/g, '<br>')}</h3>
    ${q.original ? `<p class="original-label">실습 원문 · ${esc(q.original)}</p>` : ''}
    ${q.instructions ? `<ul class="instructions">${q.instructions.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
    ${q.code ? code(q.code) : ''}
    ${q.expectedOutput ? `<div class="sample"><span>출력 결과</span>${code(q.expectedOutput)}</div>` : ''}
    ${q.sample ? `<div class="sample"><span>실행 예시${(q.sampleIncludesInput ?? (q.number === 20 && paper?.id !== '03')) ? ' · 입력값 포함' : ''}</span>${code(q.sample)}</div>` : ''}`;
}

function answerInput(q) {
  const value = state.answers[q.id]; const disabled = state.submitted ? 'disabled' : '';
  if (q.type === 'single' || q.type === 'multi') return `<fieldset class="options" aria-labelledby="title-${q.id}"><legend class="sr-only">${q.number}번 답</legend>${q.choices.map((choice, i) => `<label class="option"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" name="${q.id}" data-q="${q.id}" value="${i}" ${q.type === 'single' ? value === i ? 'checked' : '' : Array.isArray(value) && value.includes(i) ? 'checked' : ''} ${disabled}><span class="option-number">${i + 1}</span><span>${esc(choice)}</span></label>`).join('')}</fieldset>`;
  if (q.type === 'ox') return `<div class="ox-list">${q.statements.map((statement, i) => `<fieldset class="ox-item"><legend>${i + 1}. ${esc(statement)}</legend><div>${['O', 'X'].map(choice => `<label class="ox-choice"><input type="radio" name="${q.id}-${i}" data-q="${q.id}" data-part="${i}" value="${choice}" ${value?.[i] === choice ? 'checked' : ''} ${disabled}><span>${choice}</span></label>`).join('')}</div></fieldset>`).join('')}</div>`;
  return `<label for="answer-${q.id}" class="answer-label">${q.type === 'written' ? '작성한 코드' : q.type === 'output' ? '내가 예상한 실행 결과' : '내가 작성한 한 줄'}</label><textarea id="answer-${q.id}" data-q="${q.id}" name="${q.id}" rows="${q.type === 'written' ? 13 : q.type === 'output' ? 4 : 2}" spellcheck="false" autocapitalize="off" autocomplete="off" ${state.submitted ? 'readonly' : ''} placeholder="${q.type === 'written' ? '여기에 코드를 쓰거나 종이에 작성하세요.' : '답을 입력하세요.'}">${esc(typeof value === 'string' ? value : '')}</textarea>${q.type === 'short' || q.type === 'written' ? '<p class="input-hint">코드 입력 중 Tab은 들여쓰기 · Esc 다음 Tab은 다음 항목으로 이동</p>' : '<p class="input-hint">줄바꿈은 구분해서 작성하세요.</p>'}`;
}

function feedback(q) {
  const result = grade(q, state.answers[q.id], state.self[q.id]);
  return `<div class="answer-review ${result}"><div class="review-heading"><strong>${labels[result]}</strong>${state.self[q.id] ? '<span>직접 채점함</span>' : ''}</div>
    ${result === 'review' ? '<p>아래 답안과 비교해 직접 채점해 주세요. 같은 동작을 하는 다른 코드도 정답일 수 있습니다.</p>' : ''}
    <span class="answer-key-label">${q.type === 'written' ? '예시 답안' : '정답'}</span>${code(answerText(q))}
    <p class="explanation">${esc(q.explanation)}</p>
    ${q.rubric ? `<h4>채점 기준</h4><ul>${q.rubric.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
    ${['short', 'written'].includes(q.type) ? `<div class="self-grade" role="group" aria-label="${q.number}번 직접 채점"><span>내 답안 확인</span><button class="button small secondary" data-self="correct" data-id="${q.id}" aria-pressed="${state.self[q.id] === 'correct'}">맞았어요</button><button class="button small secondary" data-self="wrong" data-id="${q.id}" aria-pressed="${state.self[q.id] === 'wrong'}">다시 볼게요</button>${state.self[q.id] ? `<button class="text-button" data-self="reset" data-id="${q.id}">판정 취소</button>` : ''}</div>` : ''}
    <details class="source-details"><summary>해설 근거 · PDF 쪽수</summary>${q.sources.map(s => `<p><strong>${esc(sources[s.id].title)} · ${s.pages}쪽</strong><br><span>${esc(sources[s.id].file)}</span></p>`).join('')}${q.standardNote ? `<p>${esc(standardNotes[1].text)} <a href="${standardNotes[1].url}" target="_blank" rel="noopener noreferrer">표준 문서 ↗</a></p>` : ''}</details>
  </div>`;
}

function summaryHTML() {
  const result = score(paper, state);
  return `<div class="result-card" id="result-card"><div><p class="eyebrow">YOUR RESULT</p><h2>확인된 점수 <strong>${result.correct * 5}<small> / 100</small></strong></h2><p>정답 ${result.correct} · 오답 ${result.wrong} · 미응답 ${result.blank} · 직접 확인 ${result.review}</p></div><p class="result-note">코드 답안은 해설을 보고 ‘맞았어요’ 또는 ‘다시 볼게요’로 직접 채점할 수 있습니다.<br>직접 확인과 미응답은 아직 점수에 포함되지 않았습니다.</p></div>`;
}

function renderPaper() {
  main.innerHTML = `<div class="exam-wrap"><div class="exam-top"><a class="back-link" href="#/">← 시험 목록</a><span>${Number(paper.id)}회 · 20문항</span><button class="button small secondary" data-print="paper">시험지 인쇄</button></div>
    <div class="exam-layout"><aside class="answer-nav" aria-label="답안 현황"><span class="eyebrow">PAPER ${paper.id}</span><h2>${esc(paper.title)}</h2><div id="progress-text"></div><div class="nav-progress"><span id="progress-bar"></span></div><div class="question-grid">${paper.questions.map(q => `<a href="#q-${q.id}" data-jump="${q.id}">${q.number}</a>`).join('')}</div>
      <div class="legend"><span><i class="done"></i>작성함</span><span><i class="flag"></i>다시 볼 문제</span></div>
      ${state.submitted ? '<button class="button full" data-action="retry">이 회차 다시 풀기</button><button class="button secondary full" data-action="edit">답안 수정하기</button><button class="text-button full" data-print="answers">해설 인쇄</button>' : '<button class="button full" data-action="submit">답안 제출하기 →</button>'}
      <p id="save-status" class="save-status" role="status">이 브라우저에 자동 저장</p><p class="side-note">종이에 풀었다면 빈 답안으로 제출한 뒤 정답을 확인하세요.</p>
    </aside><div class="exam-content"><section class="exam-title"><p class="eyebrow">컴퓨터언어 II · 중간고사 대비</p><h1>${Number(paper.id)}회 모의고사</h1><p>${esc(paper.subtitle)}</p><div class="exam-rules"><span>20문항 · 각 5점</span><span>자료: 1–5장</span><span>컴파일 없이 작성</span></div><p class="exam-note">코드는 표준 C++를 기준으로 읽습니다. C와 비교하는 7번은 C90 기준입니다. 접근 지정자 문제에는 friend를 사용하지 않습니다.</p></section>
      ${state.submitted ? summaryHTML() : ''}
      <div class="questions">${paper.questions.map(q => `<article class="question" id="q-${q.id}" aria-labelledby="title-${q.id}"><div class="question-header"><span class="question-number">${String(q.number).padStart(2, '0')}</span><span class="question-type">${types[q.type]}</span>${q.stars ? '<span class="star-tag" title="5장 63쪽의 노란 별 3개 반영">★★★</span>' : ''}<span class="points">5점</span><button class="flag-button" data-flag="${q.id}" aria-pressed="${!!state.flags[q.id]}" aria-label="${q.number}번 다시 볼 문제 표시">${state.flags[q.id] ? '★ 표시됨' : '☆ 다시 보기'}</button></div>${questionBody(q)}${answerInput(q)}<div id="feedback-${q.id}">${state.submitted ? feedback(q) : ''}</div></article>`).join('')}</div>
      <div class="exam-bottom">${state.submitted ? '<a class="button secondary" href="#/">시험 목록으로</a><button class="button" data-action="retry">이 회차 다시 풀기</button>' : '<p>다 풀었나요? 제출하면 정답과 해설이 열립니다.</p><button class="button" data-action="submit">답안 제출하기 →</button>'}</div>
    </div></div></div>`;
  updateProgress();
}

function updateProgress() {
  if (!paper) return;
  const count = countAnswered(paper, state);
  document.querySelector('#progress-text').textContent = `${count} / 20문항 작성`;
  document.querySelector('#progress-bar').style.width = `${count * 5}%`;
  for (const q of paper.questions) {
    const link = document.querySelector(`[data-jump="${q.id}"]`);
    const complete = answered(q, state.answers[q.id]);
    const result = state.submitted ? grade(q, state.answers[q.id], state.self[q.id]) : '';
    link.className = [complete ? 'answered' : '', state.flags[q.id] ? 'flagged' : '', result].join(' ');
    link.setAttribute('aria-label', `${q.number}번, ${state.submitted ? labels[result] : complete ? '작성함' : '미응답'}${state.flags[q.id] ? ', 다시 볼 문제' : ''}`);
  }
}

main.addEventListener('input', event => {
  const el = event.target;
  if (!paper || state.submitted || !el.dataset.q) return;
  const q = paper.questions.find(q => q.id === el.dataset.q);
  if (q.type === 'multi') {
    state.answers[q.id] = [...main.querySelectorAll(`input[data-q="${q.id}"]:checked`)].map(el => Number(el.value));
  } else if (q.type === 'ox') {
    const parts = Array.isArray(state.answers[q.id]) ? [...state.answers[q.id]] : [];
    parts[Number(el.dataset.part)] = el.value;
    state.answers[q.id] = parts;
  } else if (q.type === 'single') state.answers[q.id] = Number(el.value);
  else state.answers[q.id] = el.value;
  delete state.self[q.id];
  save(); updateProgress();
});

let tabEscape = false;
main.addEventListener('keydown', event => {
  const el = event.target;
  if (el.tagName !== 'TEXTAREA' || el.readOnly || !paper) return;
  const q = paper.questions.find(q => q.id === el.dataset.q);
  if (!['short', 'written'].includes(q.type)) return;
  if (event.key === 'Escape') { tabEscape = true; return; }
  if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
    if (tabEscape) { tabEscape = false; return; }
    event.preventDefault();
    el.setRangeText('\t', el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  tabEscape = false;
});
main.addEventListener('focusin', () => { tabEscape = false; });

main.addEventListener('click', async event => {
  const studyJump = event.target.closest('[data-study-jump]');
  if (studyJump) { document.querySelector(`#study-${studyJump.dataset.studyJump}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  const jump = event.target.closest('[data-jump]');
  if (jump) {
    event.preventDefault();
    document.querySelector(`#q-${jump.dataset.jump}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (!paper) return;
  const flag = event.target.closest('[data-flag]');
  if (flag) {
    state.flags[flag.dataset.flag] = !state.flags[flag.dataset.flag];
    flag.setAttribute('aria-pressed', state.flags[flag.dataset.flag]);
    flag.textContent = state.flags[flag.dataset.flag] ? '★ 표시됨' : '☆ 다시 보기';
    save(); updateProgress(); return;
  }
  const self = event.target.closest('[data-self]');
  if (self && state.submitted) {
    const q = paper.questions.find(q => q.id === self.dataset.id);
    if (self.dataset.self === 'reset') delete state.self[q.id];
    else state.self[q.id] = self.dataset.self;
    save();
    document.querySelector(`#feedback-${q.id}`).innerHTML = feedback(q);
    document.querySelector('#result-card').outerHTML = summaryHTML();
    updateProgress();
    document.querySelector(`#feedback-${q.id} [data-self="${self.dataset.self === 'reset' ? 'correct' : self.dataset.self}"]`)?.focus({ preventScroll: true });
    return;
  }
  const print = event.target.closest('[data-print]');
  if (print) { printExam(print.dataset.print === 'answers'); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'submit') {
    const count = countAnswered(paper, state);
    if (!await confirmAction('답안을 제출할까요?', count < 20 ? `${20 - count}문항이 미응답입니다. 그대로 제출하면 정답과 해설을 볼 수 있습니다.` : '20문항을 작성했습니다. 제출하면 정답과 해설을 볼 수 있습니다.', '제출하고 해설 보기')) return;
    state.submitted = true; save(); renderPaper();
    document.querySelector('#result-card').scrollIntoView({ block: 'center' });
  } else if (action === 'retry') {
    if (!await confirmAction('이 회차를 다시 풀까요?', '이 회차의 기존 답안과 채점 결과를 지우고 새로 시작합니다. 다른 회차는 유지됩니다.', '지우고 다시 풀기')) return;
    state = freshState(); memory.set(paper.id, state); save(); renderPaper(); window.scrollTo(0, 0);
  } else if (action === 'edit') {
    state.submitted = false; save(); renderPaper(); window.scrollTo(0, 0);
    toast('답안을 수정한 뒤 다시 제출할 수 있어요.');
  }
});

function printExam(withAnswers) {
  if (withAnswers && !state.submitted) return;
  document.querySelector('#print-root').innerHTML = `<header class="print-header"><p>컴퓨터언어 II · 중간고사 대비</p><h1>${Number(paper.id)}회 모의고사 ${withAnswers ? '정답과 해설' : ''}</h1><p>${esc(paper.title)} · 20문항 · 각 5점</p>${withAnswers ? '' : '<p>이름: ____________________　 날짜: ____________________</p>'}</header><p class="print-note">표준 C++ 기준. 7번 C 비교는 C90 기준. 접근 지정자는 friend 없는 일반 클래스 기준.</p>${paper.questions.map(q => `<section class="print-question"><h2>${q.number}. ${types[q.type]} <small>(5점)</small></h2>${questionBody(q)}${q.choices ? `<ol class="print-options">${q.choices.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}${q.statements ? `<ol>${q.statements.map(s => `<li>${esc(s)}　 ( O / X )</li>`).join('')}</ol>` : ''}${withAnswers ? `<h4>정답 / 예시 답안</h4>${code(answerText(q))}<p>${esc(q.explanation)}</p>${q.rubric ? `<ul>${q.rubric.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}<p class="print-source">${q.sources.map(s => `${esc(sources[s.id].title)} ${s.pages}쪽`).join(' · ')}</p>` : q.type === 'written' ? '<div class="writing-space large">답안 작성</div>' : ['short', 'output'].includes(q.type) ? '<div class="writing-space">답안 작성</div>' : '<div class="print-answer">답: ____________________</div>'}</section>`).join('')}`;
  document.body.classList.add('printing');
  window.print();
}
window.addEventListener('afterprint', () => { document.body.classList.remove('printing'); });

function route() {
  const hash = location.hash || '#/';
  const isConcept = hash === '#/learn' || hash.startsWith('#/learn/');
  const navHash = hash.startsWith('#/exam/') ? '#/' : isConcept ? '#/learn' : hash;
  let conceptTitle;
  document.querySelectorAll('.site-header nav a').forEach(a => a.setAttribute('aria-current', a.hash === navHash ? 'page' : 'false'));
  if (hash === '#/guide') renderGuide();
  else if (hash === '#/study') renderStudy();
  else if (isConcept) { paper = null; state = null; conceptTitle = renderConcepts(main, hash.split('/').slice(2)); }
  else if (hash.startsWith('#/exam/')) {
    paper = papers.find(p => p.id === hash.split('/')[2]);
    if (paper) { state = getState(paper.id); renderPaper(); }
    else main.innerHTML = '<div class="wrap guide"><h1>시험을 찾을 수 없습니다.</h1><a href="#/">시험 목록으로 돌아가기</a></div>';
  } else renderHome();
  document.title = isConcept ? `${conceptTitle} · 컴퓨터언어 II` : paper ? `${Number(paper.id)}회 모의고사 · 컴퓨터언어 II` : hash === '#/study' ? '핵심 정리 · 컴퓨터언어 II' : '컴퓨터언어 II · 지필 모의고사';
  const routeLabel = document.querySelector('#route-label');
  if (routeLabel) routeLabel.textContent = isConcept ? '개념 공부' : paper ? `${Number(paper.id)}회 모의고사` : hash === '#/study' ? '핵심 정리' : hash === '#/guide' ? '출제 기준' : '학습 대시보드';
  window.scrollTo(0, 0);
  const questionNumber = Number(hash.split('/')[3]);
  if (paper && Number.isInteger(questionNumber) && questionNumber >= 1 && questionNumber <= 20) {
    document.getElementById(`q-${paper.id}-${questionNumber}`)?.scrollIntoView({block:'start'});
  }
}
window.addEventListener('hashchange', route);
window.addEventListener('pagehide', () => { if (paper && state) save(); });
route();
