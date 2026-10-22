export const sources = {
  book: { title: '교재 · 명품 C++ Programming (3판, 황기태)', file: 'C++ Programming.pdf' },
  ch1: { title: '1장 · C++ 기본', file: 'DKL - 컴언어2_01장(CPP 기본) V60_260904_140837.pdf' },
  ch2: { title: '2장 · C++ 구조 및 구성요소', file: 'DKL - 컴언어2_02장(CPP 구조 및 구성요소) V60_260911_133920.pdf' },
  ch3: { title: '3장 · 연산자, 제어문, 배열', file: 'DKL - 컴언어2_03장(C언어 Review_연산자, 제어문, 배열) V40_260917_140242.pdf' },
  ch4: { title: '4장 · 함수, 배열, 포인터', file: 'DKL - 컴언어2_04장(C언어 Reveiw 2_배열, 함수, 포인터) V21_260923_163548.pdf' },
  ch5: { title: '5장 · 클래스와 객체', file: 'DKL - 컴언어2_05장(클래스와 객체) V42_261008_131653.pdf' },
  practice2: { title: '2장 실습문제', file: 'DKL - 컴언어2_02장(CPP 구조 및 구성요소) 실습문제_260917_024540.pdf' },
  practice3: { title: '3장 실습문제', file: 'DKL - 컴언어2_03장(C언어 Review_연산자, 제어문, 배열) 실습문제_260917_142706.pdf' },
  practice4: { title: '4장 실습문제', file: 'DKL - 컴언어2_04장(C언어 Reveiw 2_배열, 함수, 포인터) 실습문제_260923_163557.pdf' },
  practice5: { title: '5장 실습문제', file: 'DKL - 컴언어2_05장(클래스와 객체) 실습문제_261008_141829.pdf' },
};

// Page numbers were checked against the visible scanned book, not extracted text.
export const bookQuestionPages = {
  1: '55–56', 2: '54–56', 3: '60–64', 4: '60–64', 5: '68–75', 6: '69, 78–79',
  9: '99–103', 11: '107–111, 115–117', 12: '119–121', 13: '121–124', 14: '125–128, 133–134',
};
export const bookStudyPages = {
  access: '125–128, 133–134', main: '54–56', namespace: '60–64', strings: '68–75, 78–79',
  classes: '96–106', 'lifetime-functions': '107–111, 115–121', 'lifetime-order': '121–124',
};

export const blueprint = [
  'main의 리턴형과 표준 형식', '주석·return 0 생략', 'std:: 없이 코드 수정', 'using 선언 범위를 구분해 수정',
  'C 문자열·string O/X', '<cstring> 전처리 지시문', 'C와 C++ 비교 · 모두 고르기', '기본 문법 확인',
  '클래스 선언부·구현부', '클래스 도입과 객체지향 개념', '생성자의 특징', '소멸자의 특징',
  '전역·지역 객체의 생성과 소멸', 'public·private·protected', '코드 속 함정 찾기',
  '반복문 출력 ①', '반복문 출력 ②', '코드 한 줄 채우기', '실행 결과 작성', '기존 실습문제 그대로 풀기',
];

export const emphasis = [
  { source: 'ch2', pages: '4–5', mark: '노란 강조', text: 'main의 리턴형 int, return 생략, 주석' },
  { source: 'ch2', pages: '9, 17', mark: '노란 강조·별', text: '줄바꿈과 using 선언에 따른 std:: 생략 범위' },
  { source: 'ch2', pages: '28, 34, 42', mark: '노란·빨간 강조', text: '문자열 두 방식, string 클래스, 헤더 포함 방법' },
  { source: 'ch3', pages: '19, 23, 40–41, 45', mark: '빨간 별·표시', text: '0과 참·거짓, 대입 연산, 연산 결과, 제어문' },
  { source: 'ch5', pages: '9, 11, 13', mark: '빨간 강조', text: '클래스와 객체, 선언·구현, 객체지향 핵심 개념' },
  { source: 'ch5', pages: '59, 62–63', mark: '노란 별 3개 · 필수', text: 'public·private·protected와 class의 기본 접근 지정. 63쪽의 세 별을 모든 회차 14번에 반영.' },
];

export const standardNotes = [
  { text: 'void main()의 MSVC 확장 허용과 표준 C++의 int main()을 구분합니다.', url: 'https://learn.microsoft.com/en-us/cpp/cpp/main-function-command-line-args?view=msvc-170', title: 'Microsoft · main 함수' },
  { text: 'C 비교 문항은 C90 기준입니다. C99 이후에는 // 주석, 선언과 문장 혼용, main 끝에서 0 반환이 허용되므로 모든 C에 일반화하지 않습니다.', url: 'https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf', title: 'WG14 · C99 통합 초안 (§5.1.2.2.3, §6.4.9, §6.8.2)' },
  { text: '접근 지정자 문제는 수업의 일반 클래스 범위이며 friend는 사용하지 않습니다. 정확한 키워드는 protective가 아닌 protected입니다.', url: 'https://learn.microsoft.com/en-us/cpp/cpp/member-access-control-cpp?view=msvc-170', title: 'Microsoft · 멤버 접근 제어' },
];

export const ref = (id, pages) => ({ id, pages });
export const program = body => `#include <iostream>\nusing namespace std;\n\nint main()\n{\n${body}\n    return 0;\n}`;
