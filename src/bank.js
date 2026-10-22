import paper1 from './paper1.js';
import paper2 from './paper2.js';
import paper3 from './paper3.js';
import paper4 from './paper4.js';
import paper5 from './paper5.js';
import paper6 from './paper6.js';
import paper7 from './paper7.js';
import paper8 from './paper8.js';
import paper9 from './paper9.js';
import paper10 from './paper10.js';
import { blueprint, bookQuestionPages, ref } from './sources.js';

export const papers = [paper1, paper2, paper3, paper4, paper5, paper6, paper7, paper8, paper9, paper10].map(paper => ({
  ...paper,
  questions: paper.questions.map((q, i) => ({ ...q, number: i + 1, id: `${paper.id}-${i + 1}`, topic: blueprint[i],
    sources: [...q.sources, ...(!q.sources.some(s => s.id === 'book') && bookQuestionPages[i + 1] ? [ref('book', bookQuestionPages[i + 1])] : [])],
  })),
}));

export const types = {
  single: '하나 고르기', multi: '모두 고르기', ox: 'O / X', short: '한 줄 작성', output: '실행 결과', written: '코드 서술형',
};
