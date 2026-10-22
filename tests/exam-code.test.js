import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newExamCodeCases } from './helpers/exam-code-cases.js';

const compilerAvailable = spawnSync('g++', ['--version'], { encoding: 'utf8' }).status === 0;
test('rounds 6–10: compiled C++ answers match all stated outputs and alternate fill-ins', { skip: !compilerAvailable, timeout: 120000 }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'cpp-exam-test-'));
  try {
    for (const example of newExamCodeCases) {
      const source = join(dir, 'case.cpp'), exe = join(dir, 'case');
      writeFileSync(source, example.code);
      const build = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-pedantic', source, '-o', exe], { encoding: 'utf8', timeout: 15000 });
      assert.equal(build.status, 0, `${example.id}: ${build.stderr}`);
      for (const run of example.cases) {
        const result = spawnSync(exe, [], { input: run.stdin || '', encoding: 'utf8', timeout: 3000 });
        assert.equal(result.status, 0, `${example.id}: ${result.stderr}`);
        assert.equal(result.stdout.replace(/\r\n/g, '\n'), run.stdout, example.id);
      }
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
