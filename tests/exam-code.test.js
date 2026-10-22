import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newExamCodeCases } from './helpers/exam-code-cases.js';

const compilerAvailable = spawnSync('g++', ['--version'], { encoding: 'utf8' }).status === 0;
test('rounds 6–15: compiled C++ answers match all stated outputs, alternate fill-ins and separate files', { skip: !compilerAvailable, timeout: 180000 }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'cpp-exam-test-'));
  try {
    for (const example of newExamCodeCases) {
      const caseDir = join(dir, example.id), exe = join(caseDir, 'run');
      mkdirSync(caseDir);
      const files = example.files || { 'case.cpp': example.code };
      for (const [name, source] of Object.entries(files)) writeFileSync(join(caseDir, name), source);
      const sources = Object.keys(files).filter(name => name.endsWith('.cpp')).map(name => join(caseDir, name));
      const build = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-pedantic', ...sources, '-o', exe], { encoding: 'utf8', timeout: 15000 });
      assert.equal(build.status, 0, `${example.id}: ${build.stderr}`);
      for (const run of example.cases) {
        const result = spawnSync(exe, [], { input: run.stdin || '', encoding: 'utf8', timeout: 3000 });
        assert.equal(result.status, 0, `${example.id}: ${result.stderr}`);
        assert.equal(result.stdout.replace(/\r\n/g, '\n'), run.stdout, example.id);
      }
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
