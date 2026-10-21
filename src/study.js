import { ref, bookStudyPages } from './sources.js';
import { papers } from './bank.js';
const question = (paper, number) => papers[paper - 1].questions[number - 1];

export const studySections = [
  { id: 'access', title: 'public · private · protected', badge: '★★★ 필수',
    intro: '5장 63쪽에 세 개의 노란 별이 표시된 부분입니다. “어디에서 접근하는가”를 기준으로 구분하세요.',
    table: { headers: ['접근 지정자', '자기 클래스 내부', '파생 클래스 내부', '외부 main'], rows: [
      ['public', '가능', '가능', '가능'], ['protected', '가능', '가능', '불가능'], ['private', '가능', '불가능', '불가능'],
    ] },
    points: ['class에서 접근 지정자를 생략하면 private입니다. C++ struct의 기본 접근은 public입니다.', 'public: 등의 지정은 다음 접근 지정자가 나올 때까지 이어집니다.', '멤버 변수는 private으로 두고 public 멤버 함수를 통해 사용하도록 하는 예제를 수업에서 다뤘습니다.', '정확한 키워드는 protected입니다. protective는 C++ 접근 지정자가 아닙니다.'],
    note: '표는 public 상속에서 기반 클래스 멤버의 직접 접근을 비교합니다. friend는 사용하지 않는 수업의 기본 예제 범위입니다.',
    trap: 'public 함수가 있다고 해서 그 함수가 사용하는 private 변수까지 외부에 공개되는 것은 아닙니다.',
    examples: [{ title: 'public 함수를 통해 private 값 읽기', code: question(4, 15).code, output: '3' }], sources: [ref('ch5', '59–66, 76–77')], examNumbers: '9 · 14 · 15번' },
  { id: 'main', title: 'main과 주석: 생략할 수 있는 것을 구분', badge: '노란 강조',
    intro: '리턴형 int와 return 0;은 서로 다른 것입니다. 실행되는 문장과 주석도 구분해야 합니다.',
    table: { headers: ['코드 / 설명', '판단'], rows: [
      ['int main() { return 0; }', '표준 C++ 형식'], ['int main(void) { }', '표준 형식. 매개변수가 없고 끝에서 0 반환'], ['void main() { }', '표준 C++ 형식 아님. MSVC 확장 허용과 별개'], ['main() { }', '리턴형 생략은 표준 C++ 형식 아님'], ['// 설명', '그 줄 끝까지 주석'], ['/* 설명 */', '여러 줄 주석에 사용 가능'],
    ] },
    points: ['main의 끝까지 실행되면 return 0;과 같은 효과입니다.', '이 규칙을 모든 int 함수에 적용하면 안 됩니다.', '#include는 실행 중 호출되는 함수가 아니라 전처리 지시문입니다.', '전역 객체 생성자는 main 실행 전에 호출될 수 있습니다. “모든 일이 main의 첫 줄에서 처음 시작된다”고 단정하지 마세요.'],
    trap: 'return 0; 생략 가능 ≠ main의 int 생략 가능.',
    examples: [{ title: '주석을 제외하고 읽기', code: question(4, 2).code, output: 'AC' }], sources: [ref('ch2', '4–6'), ref('ch4', '13–14'), ref('ch5', '52–55')], examNumbers: '1 · 2번' },
  { id: 'namespace', title: 'using은 어떤 이름까지 가져오는가?', badge: '노란 별',
    intro: '헤더 포함과 이름 공간 지정은 역할이 다릅니다. <iostream>을 포함했다고 cout의 std::까지 자동 생략되는 것은 아닙니다.',
    table: { headers: ['준비한 선언', '출력문'], rows: [
      ['using 없음', 'std::cout << "Hello" << std::endl;'], ['using namespace std;', 'cout << "Hello" << endl;'], ['using std::cout;', 'cout << "Hello" << std::endl;'],
    ] },
    points: ['namespace는 이름 충돌을 구분하기 위한 이름 공간입니다. 표준 라이브러리의 이름 공간은 std입니다.', 'using std::cout;은 cout 하나만 가져옵니다. cin과 endl까지 가져오지는 않습니다.', 'using namespace std;를 사용한 범위에서도 std::cout처럼 접두어를 명시해도 됩니다.', 'std::string도 같은 규칙입니다. <string> 포함과 std:: 접두어 지정은 따로 생각하세요.'],
    trap: 'cout만 고치고 endl을 그대로 남겨두는 실수를 조심하세요.',
    examples: [{ title: 'cout만 개별 선언한 경우', code: question(2, 4).code.replace('cout << 7 << endl;', 'cout << 7 << std::endl;'), output: '7' }], sources: [ref('ch2', '13, 17–19, 34')], examNumbers: '3 · 4번' },
  { id: 'strings', title: '문자열 두 방식과 헤더 두 개', badge: '노란·빨간 강조',
    intro: 'C 문자열은 널 종료된 문자 배열, C++ string은 문자열을 다루는 클래스입니다. 배열의 크기와 문자열 길이도 구분하세요.',
    table: { headers: ['구분', 'C 문자열', 'string 클래스'], rows: [
      ['표현 예', 'char text[] = "Hi";', 'std::string text = "Hi";'], ['끝 / 길이', "끝에 '\\0' 필요", '클래스가 길이와 저장 공간 관리'], ['관련 헤더', '<cstring>: strlen·strcmp 등 함수', '<string>: string 클래스'], ['값 대입', '배열 자체에는 일반적인 = 복사 불가', 'text = "Hello"; 가능'], ['공백 포함 입력', 'cin.getline(배열, 크기)', 'getline(cin, 문자열객체)'],
    ] },
    points: ['char s[] = "Hi";의 크기는 3칸, strlen(s)는 2입니다. 널 문자는 길이에 포함되지 않습니다.', "char s[3] = { 'a', 'b', 'c' };는 널 종료 문자열이 아닙니다. 배열 밖에 널 문자가 저절로 생기지 않습니다.", '문자 배열을 선언하는 것 자체에는 <cstring>이 필요하지 않습니다. 해당 헤더의 함수를 사용할 때 포함합니다.', 'cin >> name은 공백에서 끊깁니다. 공백을 포함하는 한 줄 입력은 getline 계열과 구분합니다.', 'C 문자열 함수용 전처리 지시문은 #include <cstring>입니다. 끝에 세미콜론을 쓰지 않습니다.'],
    trap: "'0'은 숫자 모양의 문자이고 '\\0'은 널 문자입니다. <string>과 <cstring>을 바꿔 외우지 마세요.",
    examples: [{ title: '배열 용량과 문자열 길이', code: '#include <iostream>\n#include <cstring>\n#include <string>\nusing namespace std;\nint main() {\n    char a[] = "Hi";\n    string b = "Hello";\n    cout << sizeof(a) << " " << strlen(a) << endl;\n    cout << b;\n    return 0;\n}', output: '3 2\nHello' }], sources: [ref('ch2', '28–35, 41–43')], examNumbers: '5 · 6번' },
  { id: 'c-vs-cpp', title: 'C와 C++ 비교: C의 기준을 확인', badge: '버전 구분',
    intro: '강의의 전통적인 C와 C++ 비교를 연습하기 위해 모의고사 7번에는 C90 기준이라고 명시했습니다.',
    table: { headers: ['항목', 'C90', 'C++'], rows: [
      ['/* ... */ 주석', '가능', '가능'], ['// 주석', '표준 C90에는 없음', '가능'], ['같은 블록에서 실행문 뒤 변수 선언', '선언을 문장보다 먼저 둠', '가능'], ['main 끝에 도달하면 자동으로 0 반환', '보장하는 규칙 없음', 'int main에서 보장'], ['C의 printf·scanf 사용', '가능', '가능'],
    ] },
    points: ['C++에서는 cin·cout뿐 아니라 적절한 헤더와 함께 printf·scanf도 사용할 수 있습니다.', 'C99 이후에는 C에도 // 주석, 선언과 문장 혼용, main 끝에서 0 반환 규칙이 있습니다. “C는 항상 불가능”이라고 일반화하지 않습니다.', '표준 문법인지, 특정 컴파일러가 확장으로 허용하는 문법인지 구분하세요.'],
    trap: '모두 고르기는 맞는 것을 빠뜨려도, 틀린 것을 하나 더 골라도 틀립니다.', sources: [ref('ch2', '4, 7, 24–25'), ref('ch3', '4–5')], standard: true, examNumbers: '7번' },
  { id: 'classes', title: '클래스는 틀, 객체는 실체', badge: '빨간 강조',
    intro: '클래스에는 멤버 변수와 멤버 함수가 있습니다. 선언부에서 무엇을 제공하는지 정하고, 구현부에서 어떻게 동작하는지 작성합니다.',
    table: { headers: ['구분', '핵심'], rows: [
      ['클래스', '객체를 만들기 위한 설계도 / 사용자 정의 타입'], ['객체', '클래스를 바탕으로 만들어진 실체. 각 객체가 멤버 변수의 값을 가짐'], ['선언부', '멤버 변수, 멤버 함수 원형, 접근 권한'], ['구현부', '멤버 함수 몸체. 클래스 밖이면 클래스이름::함수이름'], ['수업의 핵심 개념 4개', '캡슐화 · 정보 은닉 · 상속 · 다형성'],
    ] },
    points: ['클래스 선언의 끝은 };입니다. 멤버 함수 원형에도 세미콜론을 붙입니다.', '클래스 안에 멤버 함수를 구현할 수도 있습니다. 선언부와 구현부를 반드시 다른 파일에 두어야 하는 것은 아닙니다.', '객체의 멤버는 객체이름.멤버 형태로 접근합니다. 접근 지정자의 제한은 그대로 적용됩니다.', '이번 수업의 “네 개념”에는 정보 은닉이 포함됩니다. 다른 교재의 목록으로 임의 교체하지 않습니다.'],
    trap: '클래스를 선언했다고 그 클래스의 모든 객체가 자동으로 생성되는 것은 아닙니다.',
    examples: [{ title: '클래스 밖에서 멤버 함수 구현', code: question(2, 18).code.replace('__________', 'double Circle::getArea()'), output: '12.56' }], sources: [ref('ch5', '9–19, 74')], examNumbers: '9 · 10 · 18번' },
  { id: 'lifetime-functions', title: '생성자와 소멸자 비교', badge: '시험 유형 핵심',
    intro: '객체가 생길 때 초기화하는 함수와, 객체의 수명이 끝날 때 정리하는 함수를 구분합니다.',
    table: { headers: ['항목', '생성자', '소멸자'], rows: [
      ['역할', '멤버 값 초기화, 필요한 준비', '사용한 자원 정리, 마무리'], ['호출 시점', '객체 생성 시', '객체 소멸 시'], ['클래스가 Book일 때 이름', 'Book', '~Book'], ['매개변수', '있을 수도 없을 수도 있음', '없음'], ['반환형', '적지 않음. void도 아님', '적지 않음. void도 아님'], ['중복 정의', '매개변수 목록을 달리하여 가능', '수업의 일반 클래스에서 불가능'],
    ] },
    points: ['사용자가 생성자를 하나도 선언하지 않으면 컴파일러가 기본 생성자를 자동으로 제공합니다.', '매개변수 있는 생성자를 직접 선언했으면 매개변수 없는 생성자가 항상 추가되는 것은 아닙니다.', 'Circle c;는 인자 없는 생성자, Circle c(7);는 int 인자를 받을 수 있는 생성자를 찾습니다.', '여러 생성자를 선언해도 수업의 일반적인 객체 생성에서는 인자에 맞는 하나가 선택됩니다. 모든 생성자를 차례대로 실행하는 것이 아닙니다.', '소멸자를 직접 선언하지 않으면 컴파일러가 자동으로 제공합니다. 직접 작성해야만 객체가 소멸하는 것은 아닙니다.', '생성자가 자동 제공된다는 말이 모든 int 멤버를 항상 원하는 값으로 초기화해 준다는 뜻은 아닙니다. 수업 예제처럼 필요한 초기화를 작성하세요.'],
    trap: 'void Book()이나 void ~Book()이 아닙니다. 둘 다 반환형 자체를 적지 않습니다.', sources: [ref('ch5', '23–27, 38–40, 49–50')], examNumbers: '11 · 12번' },
  { id: 'lifetime-order', title: '생성·소멸 순서는 범위부터 표시', badge: '출력 추적',
    intro: '먼저 객체가 전역인지 자동 지역인지 표시하고, 중괄호를 나갈 때 소멸할 객체를 확인하세요.',
    table: { headers: ['객체', '생성', '소멸'], rows: [
      ['전역 객체 (수업의 한 파일 예제)', 'main 실행 전에 선언 순서대로', '정상 종료 시 생성의 역순'], ['자동 지역 객체', '해당 선언을 실행할 때', '그 범위를 나갈 때 역순'], ['호출되지 않은 함수의 자동 지역 객체', '생성되지 않음', '생성되지 않았으므로 소멸도 없음'],
    ] },
    points: ['지역 객체는 함수가 호출될 때마다 새로 생기고 그 호출이 끝나면 소멸합니다.', '안쪽 { }의 지역 객체는 main 끝까지 기다리지 않고 그 블록이 끝날 때 소멸합니다.', '전역 객체와 자동 지역 객체를 섞어서 전체 선언 순서만 뒤집지 마세요. 각 객체의 범위를 기준으로 추적합니다.'],
    trap: '아래 코드에서 D2는 X보다 먼저 나옵니다. b의 범위는 안쪽 블록입니다.',
    examples: [{ title: '중괄호를 나가는 시점 따라가기', code: question(5, 19).code, output: question(5, 19).answers[0] }], sources: [ref('ch5', '49–57')], examNumbers: '13 · 19번' },
  { id: 'tracing', title: '연산·반복문: 작은 기호를 놓치지 않기', badge: '빨간 별·표시',
    intro: '실행 결과 문제는 변수 값을 한 줄씩 갱신하고, 조건이 거짓이 되는 마지막 순간까지 적어 보세요.',
    table: { headers: ['확인할 것', '기억할 규칙'], rows: [
      ['= / ==', '대입 / 같은지 비교'], ['조건식의 숫자', '0은 거짓, 0이 아닌 값은 참. 음수도 참'], ['정수 나눗셈', '10 / 3은 3. 10.0 / 3과 다름'], ['c = a++;', 'c에 증가 전 값 저장 후 a 증가'], ['for 뒤의 ;', '빈 몸체가 될 수 있음. 들여쓰기만 보고 판단하지 않기'], ['continue / break', '이번 반복을 건너뜀 / 반복문 탈출'], ['while / do while', '먼저 조건 검사 / 몸체 먼저 실행'], ['안쪽 반복문', '바깥 반복마다 초기식부터 다시 시작'],
    ] },
    points: ['for의 순서는 초기식 → 조건식 → 몸체 → 증감식 → 조건식입니다. continue를 만나도 for의 증감식으로 진행합니다.', '같은 우선순위의 /와 *는 왼쪽부터 계산합니다. 10 / 3 * 3은 정수 연산으로 9입니다.', '배열 인덱스는 0부터 크기-1까지입니다. 포인터 p[i]는 *(p+i)와 같습니다.', '반복이 끝난 뒤 변수 값을 묻는 문제에서는 마지막 증감이나 break 위치를 확인하세요.'],
    trap: '줄바꿈이 있는 출력은 행별로 써야 합니다. 공백과 출력 횟수도 함께 추적하세요.',
    examples: [{ title: 'continue와 break가 만드는 마지막 값', code: question(4, 16).code, output: '4 3' }], sources: [ref('ch3', '19, 23–30, 40–59, 68–69'), ref('ch4', '68–81')], examNumbers: '15–19번' },
].map(section => ({ ...section,
  sources: [...section.sources, ...(bookStudyPages[section.id] ? [ref('book', bookStudyPages[section.id])] : [])],
}));

export const practiceReview = papers.map(p => ({ paper: p.id, title: p.questions[19].original, prompt: p.questions[19].prompt, rubric: p.questions[19].rubric, sources: p.questions[19].sources }));
