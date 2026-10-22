import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { courses } from '../src/concept-content.js';
import { traces, loopTrace, circleClass, updateCircle, updatePointer } from '../src/concept-models.js';
import { sources } from '../src/sources.js';
import { conceptKey, readProgress, writeProgress, freshProgress } from '../src/concept-storage.js';

test('every lesson has a source, valid activity and usable answer key', () => {
  assert.equal(new Set(courses.map(c=>c.id)).size,courses.length);
  for (const c of courses) {
    assert.ok(c.refs.every(r=>sources[r.id] && r.pages));
    assert.equal(new Set(c.steps.map(s=>s.id)).size,c.steps.length);
    assert.equal(new Set(c.checks.map(q=>q.id)).size,c.checks.length);
    for (const s of c.steps) {
      assert.ok(s.lead && s.takeaway);
      if (s.trace) assert.ok(traces[s.trace]);
    }
    for (const q of c.checks) assert.ok(q.options[q.answer] && q.explanation);
  }
  for (const t of Object.values(traces)) for (const f of t.frames) {
    assert.ok(f.line===0 || t.code.split('\n')[f.line-1]!==undefined);
  }
});

test('concept storage sanitizes stale or damaged answers and never writes exam records', () => {
  const state=freshProgress(); state.done['classes/type']=true; state.last='classes/type';
  state.answers['classes/type']=1;
  const data=new Map([['cpp-paper-exams-v1:01','existing answer']]);
  const store={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  assert.equal(writeProgress(state,store),true);
  assert.deepEqual(readProgress(store),state);
  assert.equal(data.get('cpp-paper-exams-v1:01'),'existing answer');
  data.set(conceptKey,JSON.stringify({done:{'classes/type':true,'missing/step':true},answers:{'classes/type':99},checked:{classes:true},last:'javascript:bad'}));
  const cleaned=readProgress(store);
  assert.deepEqual(cleaned.done,{'classes/type':true}); assert.deepEqual(cleaned.answers,{}); assert.deepEqual(cleaned.checked,{}); assert.equal(cleaned.last,null);
  data.set(conceptKey,'broken json'); assert.deepEqual(readProgress(store),freshProgress());
  assert.equal(writeProgress(state,{setItem(){throw Error('quota');}}),false);
});

test('pointer writes follow the selected target; invalid values cannot corrupt state', () => {
  let state={a:3,b:8,p:'a'};
  state=updatePointer(state,'point','b'); assert.deepEqual(state,{a:3,b:8,p:'b'});
  state=updatePointer(state,'write',0); assert.deepEqual(state,{a:3,b:0,p:'b'});
  assert.deepEqual(updatePointer(state,'write',NaN),state);
  assert.deepEqual(updatePointer(state,'point','unknown'),state);
  const objects={donut:2,pizza:5};
  assert.deepEqual(updateCircle(objects,'donut',0),objects);
  assert.deepEqual(updateCircle(objects,'pizza',8),{donut:2,pizza:8});
  assert.deepEqual(updateCircle(objects,'donut',2.5),objects);
});

const compilerAvailable=spawnSync('g++',['--version'],{encoding:'utf8'}).status===0;
test('compiled C++17 programs agree with the eight traces, all loop limits and every circle input', {skip:!compilerAvailable,timeout:120000}, () => {
  const dir=mkdtempSync(join(tmpdir(),'cpp-concept-test-'));
  function run(source) {
    const file=join(dir,'case.cpp'), exe=join(dir,'case'); writeFileSync(file,source);
    const compiled=spawnSync('g++',['-std=c++17','-Wall','-Wextra','-pedantic',file,'-o',exe],{encoding:'utf8'});
    assert.equal(compiled.status,0,compiled.stderr);
    const result=spawnSync(exe,[],{encoding:'utf8'}); assert.equal(result.status,0,result.stderr); return result.stdout;
  }
  try {
    for (const [id,t] of Object.entries(traces)) assert.equal(run(t.code),t.frames.at(-1).output,id);
    for (let n=1;n<=6;n++) {const t=loopTrace(n);assert.equal(run(t.code),t.frames.at(-1).output,`loop ${n}`);}
    const code=`#include <iostream>\nusing namespace std;\n${circleClass}\nint main(){for(int r=0;r<=8;r++){Circle donut(2),pizza(5);donut.setRadius(r);cout<<donut.getRadius()<<" "<<pizza.getRadius()<<"\\n";}for(int r=0;r<=8;r++){Circle donut(2),pizza(5);pizza.setRadius(r);cout<<donut.getRadius()<<" "<<pizza.getRadius()<<"\\n";}}`;
    const expected=['donut','pizza'].flatMap(target=>Array.from({length:9},(_,r)=>{const s=updateCircle({donut:2,pizza:5},target,r);return `${s.donut} ${s.pizza}\n`;})).join('');
    assert.equal(run(code),expected);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
