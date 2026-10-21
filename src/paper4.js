import { ref, program } from './sources.js';

const swapSolution = `#include <iostream>
using namespace std;

void swap(int* a, int* b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    int a = 5, b = 7;
    cout << "a = " << a << ", b = " << b << endl;
    swap(&a, &b);
    cout << "a = " << a << ", b = " << b << endl;
    return 0;
}`;

export default {
  id: '04', title: '조건을 끝까지 읽기', subtitle: '한 단어와 한 기호가 바꾸는 코드의 의미를 확인',
  questions: [
    { type: 'single', prompt: '일반적인 콘솔 프로그램의 표준 C++ main 정의에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['main의 반환형은 int이다.', 'int main() { return 0; }는 표준 형식이다.', 'int main() { }처럼 끝에 도달하는 main도 0을 반환한다.', 'int를 쓰지 않은 main() { }도 반환형이 자동 추론되어 표준이다.'], answer: 3,
      explanation: '표준 C++에서 main의 리턴형 int를 생략해서는 안 된다. return 문을 생략할 수 있다는 설명과 리턴형 선언을 생략한다는 설명을 구분한다.', sources: [ref('ch2', '4–5'), ref('ch4', '13')] },
    { type: 'single', prompt: '다음 코드에 대한 설명 중 옳은 것을 고르시오.',
      code: '#include <iostream>\nint main() {\n    std::cout << "A"; // std::cout << "B";\n    std::cout << "C";\n}',
      choices: ['// 주석이 다음 줄까지 이어져 A만 출력한다.', 'AC를 출력하고, main 끝에서 0을 반환한다.', 'ABC를 출력한다.', 'return 0;이 없어서 main을 실행할 수 없다.'], answer: 1,
      explanation: '// 뒤의 B 출력문만 그 줄 끝까지 주석 처리된다. 다음 줄의 C 출력문은 실행된다. main에는 끝에서 0을 반환하는 특례가 있다.', sources: [ref('ch2', '4')], verify: { stdout: 'AC' } },
    { type: 'short', prompt: 'using을 전혀 쓰지 않는 코드이다. 빈칸에 10과 줄바꿈을 출력하는 한 줄을 작성하시오. endl을 사용한다.',
      code: '#include <iostream>\nint main() {\n    __________\n    return 0;\n}',
      answers: ['std::cout << 10 << std::endl;'], check: 'tokens',
      explanation: 'cout와 endl에 각각 std::를 붙인다. <iostream>을 포함했다고 이름 공간의 접두어까지 생략되는 것은 아니다.', sources: [ref('ch2', '9, 17')], verify: { fill: 'std::cout << 10 << std::endl;', stdout: '10\n' } },
    { type: 'short', prompt: 'using std::cin;만 선언되어 있다. 잘못된 출력문 한 줄만 수정하시오. using 선언은 추가하지 않는다.',
      code: '#include <iostream>\nusing std::cin;\nint main() {\n    int age;\n    cin >> age;\n    cout << age;\n    return 0;\n}',
      answers: ['std::cout << age;'], check: 'tokens',
      explanation: '개별 using 선언은 cin에만 적용된다. cout에는 여전히 std::가 필요하다.', sources: [ref('ch2', '17, 21')] },
    { type: 'ox', prompt: 'C 문자열과 string에 대한 설명을 O/X로 판단하시오.',
      statements: ['<cstring>은 strlen 같은 C 문자열 함수의 선언을 제공한다.', 'char text[4] = "C++";는 끝의 널 문자까지 저장할 수 있다.', 'char text[3] = {\'C\', \'+\', \'+\'};에도 널 문자가 자동으로 한 칸 더 붙는다.', 'string 객체에 문자열을 대입하려면 반드시 strcpy를 사용해야 한다.'], answer: ['O', 'O', 'X', 'X'],
      explanation: '크기 3인 배열에 세 문자를 나열해 초기화하면 세 칸만 존재하며 널 문자가 추가되지 않는다. string 클래스는 = 대입을 지원한다. C 문자열 처리 함수의 헤더와 string 클래스의 헤더를 구분한다.', sources: [ref('ch2', '28–29, 34')] },
    { type: 'short', prompt: '다음 코드에서 strcmp의 선언을 제공하도록 빈칸에 전처리 지시문을 작성하시오. 표준 C++ 헤더 형식을 사용한다.',
      code: '#include <iostream>\n__________\nint main() {\n    std::cout << (std::strcmp("cat", "cat") == 0);\n    return 0;\n}',
      answers: ['#include <cstring>'], check: 'tokens',
      explanation: '#include <cstring>이다. strcmp는 두 C 문자열의 내용이 같으면 0을 반환한다. 여기서 출력은 비교식의 결과 1이다.', sources: [ref('ch2', '29, 41–43')], verify: { fill: '#include <cstring>', stdout: '1' } },
    { type: 'multi', prompt: 'C90과 표준 C++를 비교하여 옳은 설명을 모두 고르시오. 확장 문법은 제외한다.',
      choices: ['C90은 //를 표준 한 줄 주석으로 제공한다.', 'C++는 C90의 /* ... */ 주석도 사용할 수 있다.', 'C++의 main은 함수 끝에서 return 0;을 생략할 수 있다.', 'C90은 블록의 선언 부분 뒤에 실행문을 둔다.', 'C++에서는 cout만 사용할 수 있고 printf는 금지된다.'], answer: [1, 2, 3],
      explanation: 'C++는 두 주석 형식을 지원하고 C 입출력도 사용할 수 있다. C90의 선언 위치 및 // 제한은 C99 이후의 규칙과 구분해야 한다.', sources: [ref('ch2', '4, 7, 24'), ref('ch3', '5')], standardNote: true },
    { type: 'single', prompt: 'C++ 소스 파일의 일반적인 확장자는?',
      choices: ['.exe', '.obj', '.cpp', '.sln'], answer: 2,
      explanation: '.cpp는 C++ 소스 파일에 쓰는 확장자이다. 수업에서 .obj는 목적 파일, .exe는 실행 파일로 구분한다.', sources: [ref('ch1', '30–33, 54')] },
    { type: 'single', prompt: '다음 선언부의 멤버 함수 set을 클래스 밖에서 정의할 때 첫 줄로 옳은 것은?',
      code: 'class Box {\n    int value;\npublic:\n    void set(int n);\n};',
      choices: ['void Box::set(int n)', 'Box void set(int n)', 'void set::Box(int n)', 'class Box::set(int n)'], answer: 0,
      explanation: '반환형, 클래스이름::멤버함수이름, 매개변수 순으로 적는다. set은 Box의 멤버 함수이므로 구현부에서 private 멤버 value에 접근할 수 있다.', sources: [ref('ch5', '11–12, 65–66')] },
    { type: 'single', prompt: '수업에서 클래스 도입과 함께 설명한 객체지향 개념에 해당하지 않는 것은?',
      choices: ['상속', '다형성', '정보 은닉', '외부에서 모든 내부 데이터에 무제한 접근', '캡슐화'], answer: 3,
      explanation: '캡슐화와 정보 은닉은 내부 데이터를 보호하고 외부 접근을 제어하는 것과 관련된다. 무제한 접근은 그 목적과 반대이다.', sources: [ref('ch5', '5, 13, 59')] },
    { type: 'single', prompt: '다음 코드에서 객체 c를 만들 때 호출되는 생성자는?',
      code: 'class Circle {\npublic:\n    Circle();\n    Circle(int r);\n};\n// 두 생성자의 구현은 이미 제공되었다고 가정한다.\n// main 안의 문장:\nCircle c(7);',
      choices: ['Circle()', 'Circle(int r)', '~Circle()', '두 생성자가 언제나 모두 차례로 호출된다.'], answer: 1,
      explanation: '객체 생성에 정수 인자 7을 주었으므로 int 매개변수를 받는 Circle(int r)이 선택된다. 위임을 작성하지 않은 일반 예제에서 다른 생성자까지 자동으로 모두 실행되지는 않는다.', sources: [ref('ch5', '23, 26–27')] },
    { type: 'single', prompt: '소멸자의 용도와 형식에 대한 설명으로 옳은 것은?',
      choices: ['클래스 이름 앞에 ~를 붙이며, 매개변수와 반환형 없이 객체 소멸 시 마무리 작업을 한다.', '객체 생성 직전에 int 값을 반환하는 함수이다.', '객체의 생성자 이름을 그대로 사용하며 인수 개수로 구분한다.', '한 클래스에 서로 다른 매개변수의 소멸자를 여러 개 둔다.'], answer: 0,
      explanation: '소멸자는 ~클래스이름() 형태이다. 객체가 사용한 자원을 정리하는 등 마무리 작업을 하며 생성자와 달리 매개변수로 중복 정의하지 않는다.', sources: [ref('ch5', '49–50')] },
    { type: 'single', prompt: '전역 객체 g가 있고 f 내부에 자동 지역 객체 x가 있다. main에서 f를 한 번도 호출하지 않고 정상 종료할 때 옳은 설명은?',
      choices: ['x는 f의 정의를 읽을 때 자동 생성된다.', 'g는 만들어지지 않고 x만 생성된다.', 'g는 생성·소멸하지만 x는 생성되지 않는다.', 'x는 main 종료 후에 생성된다.'], answer: 2,
      explanation: '자동 지역 객체는 함수가 호출되어 선언을 실행할 때 생성된다. 호출되지 않은 f의 지역 객체는 생기지 않는다. 전역 g는 수업 예제처럼 main 전에 생성되고 정상 종료 시 소멸한다.', sources: [ref('ch5', '52–55')] },
    { type: 'ox', prompt: '접근 지정자에 관한 설명을 O/X로 판단하시오. friend가 없는 일반 클래스를 가정한다.', stars: 3,
      statements: ['private은 자기 클래스의 멤버 함수에서 접근할 수 있다.', 'public 멤버도 클래스 밖에서는 접근할 수 없다.', 'protected는 파생 클래스 내부에서의 접근을 허용한다.', 'class에서 지정자를 쓰지 않은 멤버는 private으로 처리한다.'], answer: ['O', 'X', 'O', 'O'],
      explanation: 'public의 공개 범위는 클래스 밖까지 포함한다. private과 protected 모두 자기 클래스 내부에서 접근 가능하며 protected는 파생 클래스 내부에도 허용된다.', sources: [ref('ch5', '59–63')] },
    { type: 'single', prompt: '다음 코드에 대한 설명 중 틀린 것을 고르시오.',
      code: '#include <iostream>\nusing namespace std;\nclass Counter {\n    int value;\npublic:\n    void set(int n) { value = n; }\n    int get() { return value; }\n};\nint main() {\n    Counter c;\n    c.set(3);\n    cout << c.get();\n    return 0;\n}',
      choices: ['set과 get은 public 멤버 함수이다.', 'value는 접근 지정자를 생략했으므로 public이다.', 'set 내부에서는 value를 변경할 수 있다.', '실행 결과는 3이다.'], answer: 1,
      explanation: 'class의 기본 접근은 private이다. public:이 나타나기 전 선언된 value는 private이고, 같은 클래스의 set과 get은 value에 접근할 수 있다.', sources: [ref('ch5', '60–63, 65–66')], verify: { stdout: '3' } },
    { type: 'output', prompt: '반복문 이후의 i와 count를 순서대로 쓰시오.',
      code: program('    int i = 0, count = 0;\n    for (i = 0; i < 6; i++) {\n        if (i == 2) continue;\n        if (i == 4) break;\n        count++;\n    }\n    cout << i << " " << count;'),
      answers: ['4 3'], explanation: 'count가 증가하는 i는 0, 1, 3이다. i=2는 continue로 건너뛰고 i=4는 break로 즉시 종료하므로 i는 4로 남는다.', sources: [ref('ch3', '51–52, 58–59')], verify: { stdout: '4 3' } },
    { type: 'output', prompt: '다음 중첩 반복문의 출력 결과를 줄별로 쓰시오.',
      code: program('    for (int i = 3; i >= 1; i--) {\n        for (int j = 0; j < i; j++)\n            cout << i;\n        cout << endl;\n    }'),
      answers: ['333\n22\n1'], explanation: 'i=3에서 3을 세 번, i=2에서 2를 두 번, i=1에서 1을 한 번 출력한다.', sources: [ref('ch3', '52, 57')], verify: { stdout: '333\n22\n1\n' } },
    { type: 'short', prompt: '매 반복에서 홀수일 때만 sum에 더하여 최종 출력이 9가 되도록 빈칸 한 줄을 채우시오.',
      code: program('    int sum = 0;\n    for (int i = 1; i <= 5; i++) {\n        __________\n    }\n    cout << sum;'), expectedOutput: '9',
      answers: ['if (i % 2 == 1) sum += i;', 'if (i % 2 != 0) sum += i;', 'if (i % 2) sum += i;', 'if (i % 2 == 1) { sum += i; }'], check: 'tokens',
      explanation: 'i는 1부터 5까지의 양수이다. i % 2가 1인 경우 1, 3, 5를 더한다. 같은 조건과 누적을 표현한 다른 코드도 가능하다.', sources: [ref('ch3', '19, 24, 47–48, 52')], verify: { fill: 'if (i % 2 == 1) sum += i;', stdout: '9' } },
    { type: 'output', prompt: '배열과 포인터가 가리키는 원소를 추적하여 실행 결과를 쓰시오.',
      code: program('    int a[4] = { 10, 20, 30, 40 };\n    int* p = &a[1];\n    cout << p[0] << " " << *(p + 1) << endl;\n    *p = 25;\n    cout << a[1] << " " << a[2];'),
      answers: ['20 30\n25 30'], explanation: 'p는 a[1]을 가리킨다. 따라서 p[0]은 20이고 *(p+1)은 a[2]의 30이다. *p에 25를 저장하면 a[1]만 바뀐다.', sources: [ref('ch4', '68–70, 75–81')], verify: { stdout: '20 30\n25 30' } },
    { type: 'written', prompt: '두 변수 a, b의 값을 바꿔주는 swap 함수 만들기\n포인터를 이용하여 두 변수의 값을 바꾸기 (a=5, b=7)', original: '4장 실습문제 5',
      sample: 'a = 5, b = 7\na = 7, b = 5', solution: swapSolution,
      explanation: '4장 실습문제 8쪽의 포인터 swap 문제이다. 값의 복사본이 아니라 주소를 인수로 넘기고, 역참조로 원래 변수를 변경한다. 아래는 전체 프로그램의 답안 예시이다.',
      rubric: ['swap 함수가 두 정수의 주소를 매개변수로 받는가?', '임시 변수로 원래 값을 보관한 뒤 두 값을 교환하는가?', 'main에서 a=5, b=7로 시작하고 swap(&a, &b)를 호출하는가?', '함수 호출 뒤 원래 변수의 값이 a=7, b=5가 되는가?'], sources: [ref('practice4', '8')], verify: { code: swapSolution, stdout: 'a = 5, b = 7\na = 7, b = 5\n' } },
  ],
};
