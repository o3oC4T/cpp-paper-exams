import { ref, program } from './sources.js';

const orderCode = `#include <iostream>
using namespace std;
class Trace {
    int id;
public:
    Trace(int n) { id = n; cout << "+" << id << endl; }
    ~Trace() { cout << "-" << id << endl; }
};
Trace g(1);
void f() { Trace c(3); }
int main() {
    Trace a(2);
    f();
    cout << "M" << endl;
    return 0;
}`;

const areaSolution = `#include <iostream>
using namespace std;

void getArea(double radius)
{
    cout << 3.14 * radius * radius << endl;
}

int main()
{
    double radius;
    cout << "반지름을 입력하세요>>";
    cin >> radius;
    while (radius < 0) {
        cout << "반지름을 다시 입력하세요>>";
        cin >> radius;
    }
    getArea(radius);
    return 0;
}`;

export default {
  id: '01', title: '기본기를 정확하게', subtitle: '표준 형식과 개념의 경계를 확인하는 첫 번째 시험',
  questions: [
    { type: 'single', prompt: '표준 C++의 main 함수에 대한 설명으로 옳은 것을 고르시오.',
      choices: ['리턴형은 void로 쓰는 것이 표준이다.', '리턴형은 int이며, 함수 끝에 도달할 때 return 0;을 생략할 수 있다.', 'main에는 반드시 매개변수가 있어야 한다.', '리턴형을 생략한 main()이 표준이다.'], answer: 1,
      explanation: '표준 main의 리턴형은 int이다. int main()의 끝까지 실행되면 return 0;과 같은 효과를 가진다. Visual Studio가 void main()을 확장 문법으로 허용해도 표준이라는 뜻은 아니다.', sources: [ref('ch2', '4–5')] },
    { type: 'single', prompt: 'C++의 주석과 return에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['// 뒤는 그 줄의 끝까지 주석이다.', '/* ... */는 여러 줄에 걸친 주석에 사용할 수 있다.', '주석에 적은 cout 문은 화면에 출력되지 않는다.', '모든 int 함수는 return을 생략하면 자동으로 0을 반환한다.'], answer: 3,
      explanation: '끝에 도달했을 때 0을 반환하는 특례는 main에 해당한다. 일반적인 int 반환 함수 전체에 적용되는 규칙이 아니다.', sources: [ref('ch2', '4'), ref('ch4', '14, 20')] },
    { type: 'short', prompt: 'using namespace std;를 추가하지 말고, 잘못된 출력문 한 줄만 수정하시오.',
      code: '#include <iostream>\nint main() {\n    cout << "Hello" << endl;\n    return 0;\n}',
      answers: ['std::cout << "Hello" << std::endl;'], check: 'tokens',
      explanation: 'cout와 endl은 모두 std 이름 공간에 있다. using 지시문이나 개별 using 선언이 없으므로 두 이름에 각각 std::를 붙인다.', sources: [ref('ch2', '17–18')] },
    { type: 'short', prompt: '출력문은 그대로 두고, 빈칸에 한 줄을 추가하여 코드를 완성하시오.',
      code: '#include <iostream>\n__________\nint main() {\n    cout << "C++" << endl;\n    return 0;\n}',
      answers: ['using namespace std;'], check: 'tokens',
      explanation: 'using namespace std;를 선언하면 해당 범위에서 cout와 endl을 std:: 없이 사용할 수 있다. 이 선언은 헤더 포함을 대신하지 않는다.', sources: [ref('ch2', '17–19')] },
    { type: 'ox', prompt: '문자열에 대한 각 설명이 옳으면 O, 틀리면 X를 고르시오.',
      statements: ['C 문자열은 널 문자 \'\\0\'으로 끝나는 문자 배열로 표현할 수 있다.', 'char s[3] = {\'a\', \'b\', \'c\'};는 널 종료된 C 문자열이다.', 'std::string을 사용하려면 <string>을 포함한다.', '<cstring>은 std::string 클래스를 선언하는 헤더이다.'], answer: ['O', 'X', 'O', 'X'],
      explanation: '문자 배열이라고 항상 C 문자열인 것은 아니다. s에는 널 문자가 없다. <cstring>은 strlen·strcmp 같은 C 문자열 함수용이고, string 클래스의 헤더는 <string>이다.', sources: [ref('ch2', '28–29, 34')] },
    { type: 'short', prompt: '표준 C++ 방식으로 strlen, strcmp 등 C 문자열 함수를 사용하려 한다. 필요한 헤더를 포함하는 전처리 지시문 한 줄을 쓰시오.',
      answers: ['#include <cstring>'], check: 'tokens',
      explanation: '#include <cstring>이다. <string>과 혼동하지 않는다. std::strlen처럼 사용할 수 있으며 using namespace std;는 필수인 유일한 방법이 아니다.', sources: [ref('ch2', '29, 41–42')] },
    { type: 'multi', prompt: '전통적인 C90과 표준 C++를 비교한 설명으로 옳은 것을 모두 고르시오. 컴파일러 확장은 제외한다.',
      choices: ['C90은 /* ... */ 주석을 지원한다.', 'C++는 // 주석과 /* ... */ 주석을 모두 지원한다.', 'C++에서는 실행문 뒤에 지역 변수를 선언할 수 있다.', 'C90에서도 실행문 뒤에 같은 블록의 변수를 자유롭게 선언할 수 있다.', 'C++의 int main()은 끝에서 return 0;을 생략할 수 있다.'], answer: [0, 1, 2, 4],
      explanation: 'C90에서는 블록의 선언이 문장들보다 먼저 온다. C++는 선언과 실행문을 섞을 수 있다. 이 비교를 C99 이후까지 일반화하면 안 된다. C99부터 //, 선언과 문장 혼용, main 끝에서 0 반환이 지원된다.', sources: [ref('ch3', '4–5'), ref('ch2', '4, 24–25')], standardNote: true },
    { type: 'single', prompt: 'C++에서 키보드 입력에 사용하는 표준 스트림 객체는 무엇인가?',
      choices: ['cout', 'cin', 'endl', 'return'], answer: 1,
      explanation: 'cin은 표준 입력 스트림 객체이고 cout은 표준 출력 스트림 객체이다.', sources: [ref('ch2', '7–8, 21')] },
    { type: 'single', prompt: '다음 코드의 클래스 선언부와 구현부에 대한 설명 중 옳은 것을 고르시오.',
      code: 'class Circle {\npublic:\n    int radius;\n    double getArea();\n};\n\ndouble Circle::getArea() {\n    return 3.14 * radius * radius;\n}',
      choices: ['클래스 선언부에는 멤버 변수만 쓸 수 있다.', 'double getArea();는 함수의 계산 과정을 구현한 것이다.', 'Circle::은 getArea가 Circle의 멤버 함수임을 나타낸다.', '클래스 선언을 마치는 };에서 세미콜론은 반드시 제거해야 한다.'], answer: 2,
      explanation: '선언부에서는 멤버 변수·멤버 함수 원형과 접근 권한을 정하고, 구현부에서는 함수의 동작을 작성한다. 클래스 밖에서 구현할 때 클래스 이름과 ::를 쓴다. 클래스 안에 함수를 구현하는 것도 가능하다.', sources: [ref('ch5', '11–12, 74')] },
    { type: 'single', prompt: '수업 자료에서 설명한 클래스 도입의 객체지향 핵심 개념에 해당하지 않는 것은?',
      choices: ['캡슐화', '정보 은닉', '상속', '다형성', '전역 변수의 무제한 공유'], answer: 4,
      explanation: '5장 13쪽에 제시된 네 개념은 캡슐화, 정보 은닉, 상속, 다형성이다. 전역 변수의 무제한 공유는 그 목록에 해당하지 않는다.', sources: [ref('ch5', '13')] },
    { type: 'single', prompt: '생성자에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['객체가 생성될 때 필요한 초기화를 담당한다.', '이름이 클래스 이름과 같다.', '리턴형을 void로 선언해야 한다.', '매개변수 목록을 다르게 하여 여러 개를 선언할 수 있다.'], answer: 2,
      explanation: '생성자는 리턴형을 적지 않으며 void도 쓰지 않는다. 객체 생성 시 초기화에 쓰이고 매개변수에 따른 중복 선언이 가능하다.', sources: [ref('ch5', '23–24')] },
    { type: 'multi', prompt: '일반 클래스 Book의 소멸자에 대한 설명으로 옳은 것을 모두 고르시오.',
      choices: ['이름은 ~Book이다.', '매개변수가 없다.', '반환형을 쓰지 않는다.', '~Book(int n)으로 중복 정의할 수 있다.', '객체가 소멸할 때 마무리 작업에 사용한다.'], answer: [0, 1, 2, 4],
      explanation: '수업 범위의 일반 클래스 소멸자는 ~클래스이름() 형태이다. 매개변수와 리턴형이 없으며 중복 정의할 수 없다. 생성 시 초기화하는 생성자와 달리 소멸 시 정리 작업을 담당한다.', sources: [ref('ch5', '49–50')] },
    { type: 'single', prompt: '한 소스 파일에서 전역 객체 g를 선언하고, main 안의 a가 살아 있는 동안 f를 호출하여 지역 객체 b를 만든다. 정상 종료할 때 옳은 설명은?',
      choices: ['b는 f가 끝나도 프로그램 종료까지 살아 있다.', 'g는 main에 진입한 뒤에야 생성된다.', 'b는 f가 끝날 때 소멸하고, a는 main을 빠져나갈 때 소멸한다.', 'g는 a보다 먼저 소멸한다.'], answer: 2,
      explanation: '수업 예제의 전역 객체는 main 실행 전에 생성되고 정상 종료 시 소멸한다. 자동 지역 객체는 해당 범위를 나갈 때 소멸한다. 따라서 b, a, g 순으로 소멸한다.', sources: [ref('ch5', '52–55')] },
    { type: 'ox', prompt: '접근 지정자의 설명을 O/X로 판단하시오. friend는 사용하지 않는 일반적인 클래스를 가정한다.', stars: 3,
      statements: ['public 멤버는 클래스 밖의 main에서도 접근할 수 있다.', 'private 멤버는 클래스 밖의 main에서 객체 이름으로 직접 접근할 수 있다.', 'protected 멤버는 해당 클래스와 파생 클래스의 멤버 함수에서 접근할 수 있다.', 'class에서 접근 지정자를 생략하면 기본값은 private이다.'], answer: ['O', 'X', 'O', 'O'],
      explanation: 'public은 외부 접근 가능, private은 해당 클래스 내부, protected는 해당 클래스와 파생 클래스 내부에서 접근 가능하다. class의 기본 접근은 private이다. 정확한 철자는 protected이다.', sources: [ref('ch5', '59–63')] },
    { type: 'single', prompt: '다음 코드를 보고 틀린 설명을 고르시오.',
      code: program('    int x = 0;\n    if (x = 3)\n        cout << "A";\n    else\n        cout << "B";\n    cout << " " << x;'),
      choices: ['조건에 사용된 =는 대입 연산자이다.', '조건을 평가할 때 x에 3이 저장된다.', '화면에는 A 3이 출력된다.', '조건은 x와 3이 같은지 비교하는 식이다.'], answer: 3,
      explanation: '비교는 ==이다. x = 3은 3을 저장하고 값 3을 가진다. 0이 아닌 값은 조건에서 참이므로 A 3이 출력된다.', sources: [ref('ch3', '19, 23, 27, 30')], verify: { stdout: 'A 3' } },
    { type: 'output', prompt: '다음 코드의 실행 결과를 쓰시오. 반복문이 끝난 뒤의 i 값도 추적하시오.',
      code: program('    int sum = 0, i;\n    for (i = 1; i <= 5; i++)\n        sum += i;\n    cout << sum << " " << i;'),
      answers: ['15 6'], explanation: '1부터 5까지 더해 sum은 15가 된다. 마지막 증감식 후 i는 6이고 i <= 5가 거짓이 되어 반복을 끝낸다.', sources: [ref('ch3', '51–52')], verify: { stdout: '15 6' } },
    { type: 'output', prompt: '다음 중첩 반복문의 출력 결과를 줄바꿈까지 구분하여 쓰시오.',
      code: program('    for (int i = 1; i <= 3; i++) {\n        for (int j = 1; j <= i; j++)\n            cout << "*";\n        cout << endl;\n    }'),
      answers: ['*\n**\n***'], explanation: '바깥 반복의 i가 1, 2, 3일 때 안쪽 반복은 각각 1, 2, 3회 실행된다. 각 행이 끝날 때 줄을 바꾼다.', sources: [ref('ch3', '57'), ref('ch1', '82–83')], verify: { stdout: '*\n**\n***\n' } },
    { type: 'short', prompt: '실행 결과가 10이 되도록 빈칸 한 줄을 채우시오. 매 반복에서 현재 배열 원소 하나를 sum에 더해야 한다.',
      code: program('    int a[4] = { 1, 2, 3, 4 };\n    int sum = 0;\n    for (int i = 0; i < 4; i++) {\n        __________\n    }\n    cout << sum;'), expectedOutput: '10',
      answers: ['sum += a[i];', 'sum = sum + a[i];', 'sum += *(a + i);', 'sum = a[i] + sum;'], check: 'tokens',
      explanation: '현재 인덱스 i에 해당하는 원소를 누적해야 한다. sum = a[i];는 누적이 아니라 덮어쓰기이다. 같은 의미의 다른 표현도 가능하다.', sources: [ref('ch3', '28, 68–69')], verify: { fill: 'sum += a[i];', stdout: '10' } },
    { type: 'output', prompt: '생성자·소멸자와 main에서 출력하는 모든 줄을 순서대로 쓰시오.', code: orderCode,
      answers: ['+1\n+2\n+3\n-3\nM\n-2\n-1'],
      explanation: '전역 g(1), main의 a(2), f의 c(3) 순으로 생성된다. f가 끝나 c가 소멸하고 M을 출력한다. 이후 a, g 순으로 소멸한다.', sources: [ref('ch5', '52–55')], verify: { stdout: '+1\n+2\n+3\n-3\nM\n-2\n-1\n' } },
    { type: 'written', prompt: '반지름을 입력 받아 원의 넓이를 출력하는 함수를 작성하기 (원주율은 3.14로 계산)',
      original: '4장 실습문제 1 · 시험 버전',
      instructions: ['반지름 radius를 매개변수로 받아 원의 넓이를 계산하고, 계산된 값을 출력하는 getArea 함수 작성', 'getArea의 함수의 리턴값으로 void 지정', 'main 함수에서는 사용자로부터 반지름을 입력 받고, 0보다 작은 음수 입력 시에는 재입력 받음', '입력 받은 반지름을 getArea 함수 호출시 인자로 전달'],
      sample: '반지름을 입력하세요>>5\n78.5\n\n반지름을 입력하세요>>-3\n반지름을 다시 입력하세요>>5\n78.5',
      explanation: '시험 버전 3쪽의 문제·실행 예시와 실습 버전 2쪽의 작성 조건을 함께 사용했다. 음수일 때만 재입력하므로 0은 허용한다. 모범답안과 변수 이름이나 반복문 모양이 달라도 요구 동작이 같으면 정답으로 판단한다.',
      solution: areaSolution, rubric: ['void getArea 함수와 반지름 매개변수를 사용했는가?', '넓이를 3.14 × 반지름 × 반지름으로 계산해 출력했는가?', 'main에서 음수이면 재입력하고, 유효한 반지름을 함수에 전달했는가?', '제시한 두 입력 예시에서 문구와 결과가 일치하는가?'], sources: [ref('practice4', '2–3')],
      verify: { code: areaSolution, cases: [ { stdin: '5\n', stdout: '반지름을 입력하세요>>78.5\n' }, { stdin: '-3\n5\n', stdout: '반지름을 입력하세요>>반지름을 다시 입력하세요>>78.5\n' }, { stdin: '0\n', stdout: '반지름을 입력하세요>>0\n' } ] } },
  ],
};
