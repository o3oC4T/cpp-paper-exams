import { ref, program } from './sources.js';

const pointerCode = `#include <iostream>
using namespace std;
void addValue(int n) { n += 5; }
void addPointer(int* n) { *n += 5; }
int main() {
    int x = 10;
    addValue(x);
    cout << x << endl;
    addPointer(&x);
    cout << x << endl;
    return 0;
}`;
const factorialSolution = `#include <iostream>
using namespace std;

int getFactorial(int n)
{
    if (n == 0)
        return 1;
    return n * getFactorial(n - 1);
}

int main()
{
    int n;
    cout << "양의 정수를 입력하세요>>";
    cin >> n;
    while (n < 0) {
        cout << "양의 정수를 다시 입력하세요>>";
        cin >> n;
    }
    cout << getFactorial(n) << endl;
    return 0;
}`;

export default {
  id: '02', title: '헷갈리는 차이 잡기', subtitle: '기본 생성자, 선언 범위, 반복문의 작은 차이에 집중',
  questions: [
    { type: 'single', prompt: '다음 중 표준 C++에서 main의 정의로 올바른 것은?',
      choices: ['void main() { }', 'double main() { return 0; }', 'int main(void) { }', 'main() { return 0; }'], answer: 2,
      explanation: 'C++의 int main(void)는 매개변수가 없는 int main()과 같은 뜻이다. 이 함수의 끝에서는 return 0;을 생략할 수 있다. 리턴형 생략이나 void·double 리턴형은 표준 main의 형식이 아니다.', sources: [ref('ch2', '4–5'), ref('ch4', '13')] },
    { type: 'single', prompt: '다음 코드에 대한 설명으로 옳은 것을 고르시오.',
      code: '#include <iostream>\nint main() {\n    // std::cout << "A";\n    /* std::cout << "B"; */\n    std::cout << "C";\n}',
      choices: ['A, B, C가 차례로 출력된다.', 'C만 출력되며 main 끝에서 0을 반환한다.', 'return 0;이 없으므로 반드시 컴파일 오류이다.', '여러 줄 주석 기호는 C++에서 쓸 수 없다.'], answer: 1,
      explanation: '두 출력문은 주석에 들어 있다. 실제 실행되는 출력문은 C를 출력하는 문장 하나이며, main 끝까지 도달하면 0을 반환한다.', sources: [ref('ch2', '4')], verify: { stdout: 'C' } },
    { type: 'short', prompt: 'using 지시문을 추가하지 않고, 밑줄 부분을 입력문 한 줄로 바꾸시오.',
      code: '#include <iostream>\nint main() {\n    int n;\n    __________\n    std::cout << n;\n    return 0;\n}',
      answers: ['std::cin >> n;'], check: 'tokens',
      explanation: '입력 객체도 std에 속하므로 std::cin을 쓴다. 입력에는 >> 연산자를 사용한다.', sources: [ref('ch2', '17, 21')] },
    { type: 'short', prompt: 'using std::cout;만 선언되어 있다. using 선언을 더 추가하지 말고, 출력문 한 줄을 수정하시오.',
      code: '#include <iostream>\nusing std::cout;\nint main() {\n    cout << 7 << endl;\n    return 0;\n}',
      answers: ['cout << 7 << std::endl;', 'std::cout << 7 << std::endl;'], check: 'tokens',
      explanation: 'using std::cout;은 cout에만 적용된다. endl에는 std::가 필요하다. using을 썼다고 std::cout처럼 접두어를 다시 적는 것이 금지되지는 않는다.', sources: [ref('ch2', '17')] },
    { type: 'ox', prompt: '각 설명을 O/X로 판단하시오.',
      statements: ['char s[6] = "Grace";에는 널 문자까지 저장된다.', 'strlen("Grace")의 값은 널 문자까지 포함한 6이다.', 'string s = "A"; 이후 s = "Hello";처럼 다른 문자열을 대입할 수 있다.', 'cin >> s;는 공백이 있는 한 줄 전체를 항상 읽는다.'], answer: ['O', 'X', 'O', 'X'],
      explanation: 'Grace의 문자 수는 5이며 C 문자열 저장 공간은 널 문자까지 6칸 필요하다. strlen은 널 문자를 세지 않는다. >> 입력은 공백에서 끊기고, 공백을 포함한 줄은 getline 계열로 읽는다.', sources: [ref('ch2', '28–30, 32–35')] },
    { type: 'short', prompt: '다음 빈칸에 C 문자열 함수의 표준 C++ 헤더를 포함하는 한 줄을 쓰시오.',
      code: '__________\n#include <iostream>\nint main() {\n    std::cout << std::strlen("C++");\n    return 0;\n}',
      answers: ['#include <cstring>'], check: 'tokens',
      explanation: 'strlen의 선언을 제공하는 C++ 헤더는 <cstring>이다. 문제의 std::strlen 표기는 using namespace std; 없이 사용할 수 있는 형태이다.', sources: [ref('ch2', '29, 41–43')], verify: { fill: '#include <cstring>', stdout: '3' } },
    { type: 'multi', prompt: 'C90과 표준 C++의 비교에서 옳은 것을 모두 고르시오. C90의 확장 기능은 제외한다.',
      choices: ['C++에서는 printf와 scanf를 전혀 사용할 수 없다.', 'C90에서 //는 표준 주석 형식이 아니다.', 'C++에서 변수 선언은 반드시 함수 맨 앞에만 모아야 한다.', 'C++의 main에서 return 0;을 생략하는 것은 허용된다.', 'C90과 C++ 모두 /* ... */ 주석을 쓸 수 있다.'], answer: [1, 3, 4],
      explanation: 'C++에서도 적절한 헤더와 함께 C 입출력 함수를 사용할 수 있다. C++의 변수 선언은 실행문 사이에도 가능하다. C90 기준의 주석 차이를 C99 이후에 그대로 적용하지 않는다.', sources: [ref('ch2', '4, 7, 24'), ref('ch3', '4–5')], standardNote: true },
    { type: 'single', prompt: '다음 문장의 빈칸에 알맞은 출력 연산자는?',
      code: 'cout ____ "Hello";', choices: ['>>', '==', '<<', '&&'], answer: 2,
      explanation: 'cout에는 스트림 삽입 연산자 <<를 사용한다.', sources: [ref('ch2', '8–9')] },
    { type: 'single', prompt: '클래스의 선언과 구현에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['선언부에는 멤버 함수의 원형을 쓸 수 있다.', '구현부에서 멤버 함수의 구체적인 동작을 작성한다.', '선언부에서 멤버의 접근 권한을 지정한다.', '선언부와 구현부는 반드시 서로 다른 파일에 있어야만 컴파일된다.'], answer: 3,
      explanation: '두 부분을 나누어 이해하되, 반드시 별도 파일이어야 하는 것은 아니다. 같은 파일에 쓸 수도 있고 함수 몸체를 클래스 안에 정의할 수도 있다.', sources: [ref('ch5', '11–12, 74, 79–80')] },
    { type: 'single', prompt: '수업의 “C++ 클래스가 도입된 이유”에 나오는 네 개념에 포함되지 않는 것은?',
      choices: ['정보 은닉', '매크로 치환', '다형성', '캡슐화', '상속'], answer: 1,
      explanation: '매크로 치환은 전처리기의 기능이다. 이 문항이 묻는 수업의 네 개념은 캡슐화·정보 은닉·상속·다형성이다.', sources: [ref('ch5', '13'), ref('ch4', '28')] },
    { type: 'single', prompt: '다음 코드에서 Box b;를 사용할 수 없는 이유로 옳은 것은?',
      code: 'class Box {\npublic:\n    Box(int n) { }\n};\nint main() {\n    Box b;\n    return 0;\n}',
      choices: ['클래스 이름을 생성자 이름으로 썼기 때문이다.', '생성자는 매개변수를 가질 수 없기 때문이다.', '생성자를 하나 선언했으므로 매개변수 없는 생성자가 자동 추가되지 않기 때문이다.', '생성자에 void를 적지 않았기 때문이다.'], answer: 2,
      explanation: 'Box(int)를 선언하면 컴파일러가 Box()를 자동으로 추가하지 않는다. Box b(3);처럼 인자를 주거나 Box()를 직접 정의해야 한다.', sources: [ref('ch5', '38–40')], verify: { compileError: true } },
    { type: 'single', prompt: '클래스 Counter의 소멸자 원형으로 올바른 것은?',
      choices: ['void ~Counter();', '~Counter(int n);', '~Counter();', 'int Counter();'], answer: 2,
      explanation: '~Counter();가 맞다. 소멸자는 이름 앞에 ~를 붙이고 매개변수와 반환형을 쓰지 않는다. 객체 수명 종료 시 정리에 사용한다.', sources: [ref('ch5', '49–50')] },
    { type: 'single', prompt: '다음 코드의 자동 지역 객체 생성·소멸 순서에 대한 설명으로 옳은 것은? 각 객체에는 메시지를 출력하는 생성자와 소멸자가 있다고 가정한다.',
      code: 'void f() {\n    Trace a;\n    {\n        Trace b;\n        Trace c;\n    }\n}',
      choices: ['a, b, c 순서로 생성되고 c, b, a 순서로 소멸한다.', 'a, b, c 순서로 생성되고 a, b, c 순서로 소멸한다.', 'c는 f가 호출되기 전에 생성된다.', 'b와 c는 프로그램이 끝나야 소멸한다.'], answer: 0,
      explanation: '선언 위치에 도달하면 a, b, c가 생성된다. 안쪽 블록을 벗어날 때 c, b가 역순으로 소멸하고, f가 끝날 때 a가 소멸한다.', sources: [ref('ch5', '52–55')] },
    { type: 'ox', prompt: '접근 지정자의 설명을 O/X로 판단하시오. friend는 없다고 가정한다.', stars: 3,
      statements: ['public은 클래스 밖의 함수에서도 접근할 수 있는 멤버를 지정한다.', 'protected는 private과 달리 파생 클래스의 멤버 함수에서 접근할 수 있다.', 'private으로 선언한 멤버는 그 클래스 자신의 멤버 함수에서도 접근할 수 없다.', 'public: 뒤의 모든 멤버는 다른 접근 지정자가 나오기 전까지 public이다.'], answer: ['O', 'O', 'X', 'O'],
      explanation: 'private은 외부의 직접 접근을 막지만 자기 클래스의 멤버 함수는 접근할 수 있다. protected는 파생 클래스 내부에도 허용한다. 접근 지정자의 효과는 다음 지정자까지 이어진다.', sources: [ref('ch5', '59–63')] },
    { type: 'single', prompt: '다음 코드에 대한 설명 중 틀린 것을 고르시오.',
      code: program('    int i;\n    for (i = 0; i < 3; i++);\n    cout << i;'),
      choices: ['for 뒤의 세미콜론은 빈 문장이다.', 'cout은 반복문의 몸체로 세 번 실행된다.', '반복이 끝나면 i는 3이다.', '출력은 3이다.'], answer: 1,
      explanation: 'for 바로 뒤의 ; 때문에 반복문의 몸체는 빈 문장이다. cout은 반복문 다음 문장이어서 한 번만 실행된다.', sources: [ref('ch3', '52')], verify: { stdout: '3' } },
    { type: 'output', prompt: 'continue와 break를 구분하여 출력 결과를 쓰시오.',
      code: program('    int sum = 0;\n    for (int i = 1; i <= 8; i++) {\n        if (i % 2 == 0) continue;\n        if (i > 5) break;\n        sum += i;\n    }\n    cout << sum;'),
      answers: ['9'], explanation: '짝수는 continue로 건너뛰고 7에서 break로 끝낸다. 실제 더한 수는 1, 3, 5이므로 합은 9이다.', sources: [ref('ch3', '51, 58–59')], verify: { stdout: '9' } },
    { type: 'output', prompt: '다음 코드의 출력 결과를 두 줄로 쓰시오.',
      code: program('    int a = 3, b = 3;\n    while (a < 3)\n        a++;\n    do {\n        b++;\n    } while (b < 3);\n    cout << a << endl;\n    cout << b << endl;'),
      answers: ['3\n4'], explanation: 'while은 처음 조건이 거짓이라 실행하지 않는다. do while은 몸체를 먼저 한 번 실행하므로 b만 4가 된다.', sources: [ref('ch3', '53–55')], verify: { stdout: '3\n4\n' } },
    { type: 'short', prompt: 'Circle의 멤버 함수를 클래스 밖에서 구현하려 한다. 빈칸에 함수 정의의 첫 줄을 쓰시오. 실행 결과는 12.56이다.',
      code: '#include <iostream>\nusing namespace std;\nclass Circle {\npublic:\n    int radius;\n    double getArea();\n};\n__________\n{\n    return 3.14 * radius * radius;\n}\nint main() {\n    Circle c;\n    c.radius = 2;\n    cout << c.getArea();\n    return 0;\n}', expectedOutput: '12.56',
      answers: ['double Circle::getArea()', 'double Circle::getArea(void)'], check: 'tokens',
      explanation: '반환형 double, 소속 Circle::, 함수 이름 getArea()가 필요하다. 바로 다음에 몸체가 있으므로 이 줄 끝에 세미콜론을 붙이지 않는다.', sources: [ref('ch5', '11–12, 15')], verify: { fill: 'double Circle::getArea()', stdout: '12.56' } },
    { type: 'output', prompt: '다음 프로그램의 실행 결과를 줄별로 쓰시오.', code: pointerCode,
      answers: ['10\n15'], explanation: 'addValue의 n은 x 값의 복사본이므로 x가 바뀌지 않는다. addPointer는 x의 주소를 받아 *n을 통해 x를 15로 바꾼다.', sources: [ref('ch4', '17–18, 55–58'), ref('practice4', '7')], verify: { stdout: '10\n15\n' } },
    { type: 'written', prompt: '양의 정수를 입력 받아 ! (Factorial)을 계산하는 재귀함수 작성하기', original: '4장 실습문제 2 · 시험 버전',
      instructions: ['n!을 계산하여 결과값을 리턴하는 getFactorial 함수 작성', 'n이 0이면 return 1 실행하고 n이 0이 아니면 getFactorial(n-1)을 호출', 'main 함수에서는 사용자로부터 양의 정수 하나를 입력 받고, 입력 받은 숫자가 0보다 작으면 재입력 시도', '입력 받은 숫자를 인수로 하여 getFactorial 함수를 호출하고 리턴 받은 결과값을 출력'],
      sample: '양의 정수를 입력하세요>>6\n720', solution: factorialSolution,
      explanation: '4쪽의 실습 조건과 5쪽 시험 버전의 첫 실행 예시를 사용했다. 문구는 “양의 정수”이지만 구체적인 조건은 음수 재입력이고 0! = 1을 명시한다. 계산은 재귀 호출이어야 한다. int 범위를 넘는 큰 입력은 이 연습의 채점 대상이 아니다.',
      rubric: ['getFactorial에 n 매개변수와 정수 반환형이 있는가?', 'n == 0에서 1을 반환하는 종료 조건이 있는가?', 'n * getFactorial(n - 1)을 이용하는 재귀 계산인가?', '음수 재입력 및 함수 결과 출력이 있고, 6 입력 시 720이 나오는가?'], sources: [ref('practice4', '4–5')],
      verify: { code: factorialSolution, cases: [{ stdin: '6\n', stdout: '양의 정수를 입력하세요>>720\n' }, { stdin: '-3\n5\n', stdout: '양의 정수를 입력하세요>>양의 정수를 다시 입력하세요>>120\n' }, { stdin: '0\n', stdout: '양의 정수를 입력하세요>>1\n' }] } },
  ],
};
