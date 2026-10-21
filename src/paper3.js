import { ref, program } from './sources.js';

const triangleMain = `int main(void) {
    Triangle tri;              // 객체 tri 생성 (객체가 생성되면 메모리가 할당되어짐)
    tri.width = 10;            // tri 객체의 width 값 지정
    tri.height = 4;            // tri 객체의 height 값 지정
    cout << "삼각형의 면적은 " << tri.getArea() << endl;
    return 0;
}`;
const triangleSolution = `#include <iostream>
using namespace std;

class Triangle {
public:
    int width, height;
    double getArea();
};

double Triangle::getArea()
{
    return width * height / 2.0;
}

${triangleMain}`;

export default {
  id: '03', title: '실전처럼 마무리', subtitle: '개념을 코드에 적용하고 출력과 서술형까지 연결',
  questions: [
    { type: 'single', prompt: 'Visual Studio에서 void main()이 빌드되는 경우에 대한 설명으로 가장 정확한 것은?',
      choices: ['컴파일되었으므로 모든 표준 C++ 컴파일러에서 반드시 허용된다.', 'main의 리턴형은 어떤 자료형이든 쓸 수 있다는 뜻이다.', 'Visual Studio에서는 int main()을 쓰면 비표준이다.', '컴파일러의 확장 허용과 표준 여부는 다르며, 표준 main의 리턴형은 int이다.'], answer: 3,
      explanation: '수업은 int main()을 표준 형식, void main()을 비표준 형식으로 구분한다. MSVC의 확장 기능으로 빌드된다는 사실만으로 표준 문법이라고 판단하지 않는다.', sources: [ref('ch2', '4–5')] },
    { type: 'single', prompt: 'C++ 프로그램의 기본 설명으로 틀린 것을 고르시오.',
      choices: ['주석으로 처리한 문장은 실행되지 않는다.', 'main에서 return 0;을 쓰면 정상 종료 상태를 반환하는 데 사용된다.', '#include는 프로그램 실행 중에 헤더를 읽는 함수 호출이다.', 'main은 return 0;을 생략하고 끝에 도달해도 0을 반환한다.'], answer: 2,
      explanation: '#include는 전처리 지시문이다. 실행 중 호출하는 함수가 아니라, 컴파일 전 전처리 과정에서 헤더 내용을 포함하도록 지시한다.', sources: [ref('ch2', '4, 6, 39')] },
    { type: 'short', prompt: 'using namespace std;를 사용하지 않는 코드이다. 주석에 표시한 잘못된 줄만 수정하시오.',
      code: '#include <iostream>\n#include <string>\nint main() {\n    string name = "Kim";  // 이 줄만 수정\n    std::cout << name;\n    return 0;\n}',
      answers: ['std::string name = "Kim";'], check: 'tokens',
      explanation: 'string 클래스도 std 이름 공간에 있다. <string>을 포함하는 것과 std::로 이름을 지정하는 것은 서로 다른 역할이다.', sources: [ref('ch2', '17, 34–35')] },
    { type: 'short', prompt: '출력문은 변경하지 않는다. using namespace std;를 쓰지 않고, 필요한 이름 하나만 가져오도록 빈칸을 채우시오.',
      code: '#include <iostream>\n__________\nint main() {\n    cout << "Ready" << std::endl;\n    return 0;\n}',
      answers: ['using std::cout;'], check: 'tokens',
      explanation: '이 코드에서 접두어가 생략된 이름은 cout뿐이다. using std::cout;은 그 이름 하나를 가져온다. endl은 이미 std::endl로 적혀 있다.', sources: [ref('ch2', '17')] },
    { type: 'ox', prompt: '문자 배열과 string에 대한 각 설명을 O/X로 판단하시오.',
      statements: ['char s[] = "Hi";의 배열 원소 수는 3이다.', 'char a[5] = {\'H\', \'i\', \'\\0\'};는 널 종료된 C 문자열을 저장한다.', '문자 배열을 선언하는 것 자체만으로도 반드시 <cstring>이 필요하다.', 'string은 문자열 길이에 맞춰 내부 저장 공간을 관리하는 클래스로 수업에서 설명한다.'], answer: ['O', 'O', 'X', 'O'],
      explanation: '"Hi"를 문자 배열에 초기화하면 H, i, 널 문자가 저장된다. 문자 배열 선언 자체는 언어 문법이고 <cstring>은 strlen·strcmp 같은 라이브러리 함수를 사용할 때 필요하다. string은 <string>에 선언된다.', sources: [ref('ch2', '28–29, 34')] },
    { type: 'short', prompt: 'strcmp를 std 이름 공간에서 사용하려 한다. .h 확장자를 쓰지 않는 표준 C++ 헤더 포함문 한 줄을 쓰시오.',
      answers: ['#include <cstring>'], check: 'tokens',
      explanation: 'C 문자열 처리 함수용 <cstring>을 포함한다. 헤더 이름과 string 클래스의 <string>을 구분한다.', sources: [ref('ch2', '29, 41–43')] },
    { type: 'multi', prompt: 'C90과 표준 C++의 차이에 대한 다음 설명 중 옳은 것을 모두 고르시오. 컴파일러 확장은 고려하지 않는다.',
      choices: ['C90의 블록에서는 선언을 실행문보다 먼저 두어야 한다.', 'C++는 실행문 중간에 변수를 선언할 수 있다.', 'C++는 //와 /* ... */를 모두 주석으로 사용한다.', 'C++의 main은 끝에 return 0;이 없으면 무조건 오류이다.', 'C++에서 C 방식의 입출력은 사용할 수 없다.'], answer: [0, 1, 2],
      explanation: 'C++는 변수 선언 위치가 더 자유롭고 두 주석 형식을 지원한다. main 끝의 return 0; 생략도 허용하며 C 입출력 함수도 사용할 수 있다. C90의 제한은 C99 이후의 C와 구분한다.', sources: [ref('ch2', '4, 7, 24–25'), ref('ch3', '4–5')], standardNote: true },
    { type: 'single', prompt: '다음 중 C++에서 한 줄을 바꾸는 데 사용할 수 있는 것은?',
      choices: ["'\\n'", "'/n'", 'newLine', "'n'"], answer: 0,
      explanation: '줄바꿈 문자는 역슬래시를 사용하는 \'\\n\'이다. /n은 줄바꿈 이스케이프가 아니다. std::endl도 줄바꿈에 사용할 수 있다.', sources: [ref('ch2', '9')] },
    { type: 'single', prompt: 'class와 객체의 관계 및 클래스 선언에 대한 설명으로 옳은 것을 고르시오.',
      choices: ['클래스 선언 한 번마다 그 클래스의 모든 객체가 자동 생성된다.', '클래스는 객체를 만드는 틀이며, 객체마다 멤버 변수의 저장 공간을 가진다.', '클래스 구현부에서 함수 원형만 선언하면 모든 동작이 완성된다.', '접근 지정자를 생략한 class의 멤버는 기본적으로 public이다.'], answer: 1,
      explanation: '클래스는 설계도이며 객체는 그 틀로 만든 실체이다. 같은 클래스로 여러 객체를 만들 수 있고 각 객체의 멤버 변수는 독립적으로 값을 가진다. class의 기본 접근은 private이다.', sources: [ref('ch5', '9–12, 16–17')] },
    { type: 'single', prompt: '클래스 도입과 관련하여 수업에서 배운 객체지향 핵심 개념이 아닌 것은?',
      choices: ['상속', '캡슐화', '정보 은닉', '조건부 컴파일', '다형성'], answer: 3,
      explanation: '조건부 컴파일은 전처리 단계의 기능이다. 수업 자료 5장 13쪽의 객체지향 개념 네 가지와는 구분한다.', sources: [ref('ch5', '13, 90–91')] },
    { type: 'single', prompt: '생성자에 대한 설명 중 옳은 것을 고르시오.',
      choices: ['객체가 소멸한 뒤에 초기화를 수행한다.', '생성자 이름 앞에는 반드시 ~를 붙인다.', '매개변수 목록이 다르면 생성자를 여러 개 정의할 수 있다.', '매개변수 있는 생성자가 있으면 매개변수 없는 생성자도 항상 자동 제공된다.'], answer: 2,
      explanation: '생성자는 객체 생성 시 초기화한다. 이름은 클래스 이름과 같고 반환형이 없으며 중복 정의가 가능하다. 이미 사용자가 생성자를 선언하면 기본 생성자가 자동 추가되지는 않는다.', sources: [ref('ch5', '23–24, 38–40')] },
    { type: 'single', prompt: '생성자와 소멸자를 비교한 설명 중 틀린 것을 고르시오.',
      choices: ['생성자는 초기화, 소멸자는 마무리 작업에 사용한다.', '둘 다 반환형을 적지 않는다.', '생성자는 매개변수를 가질 수 있지만 소멸자는 가질 수 없다.', '소멸자도 서로 다른 매개변수를 주어 여러 개로 중복 정의할 수 있다.'], answer: 3,
      explanation: '수업 범위의 일반 클래스에서는 소멸자를 매개변수로 중복 정의할 수 없다. ~클래스이름() 형태의 매개변수 없는 소멸자를 사용한다.', sources: [ref('ch5', '24, 49–50')] },
    { type: 'single', prompt: '한 소스 파일에서 전역 객체 g1, g2를 그 순서로 선언한다. main 안에서는 a, b를 그 순서로 만들고 정상 종료한다. 소멸 순서로 올바른 것은?',
      choices: ['g1 → g2 → a → b', 'b → a → g2 → g1', 'a → b → g1 → g2', 'g2 → g1 → b → a'], answer: 1,
      explanation: 'main의 자동 지역 객체가 먼저 역순으로 소멸하고, 이후 전역 객체가 생성의 역순으로 소멸한다. 한 파일의 예제라는 조건을 두어 다른 파일 사이의 초기화 순서 문제를 제외했다.', sources: [ref('ch5', '52–55')] },
    { type: 'ox', prompt: '접근 지정자에 대한 설명을 O/X로 판단하시오. friend는 사용하지 않는다.', stars: 3,
      statements: ['public 멤버는 외부 함수 main에서 객체를 통해 접근할 수 있다.', 'protected 멤버는 외부 함수 main에서도 public처럼 직접 접근할 수 있다.', 'private 멤버는 자기 클래스의 멤버 함수에서 사용할 수 있다.', 'protected 멤버는 파생 클래스의 멤버 함수에서도 사용할 수 있다.'], answer: ['O', 'X', 'O', 'O'],
      explanation: '외부 main의 직접 접근은 public에 허용된다. private은 자기 클래스 내부, protected는 자기 클래스 및 파생 클래스 내부에서 접근한다. class에서 접근 지정자를 생략하면 private이다.', sources: [ref('ch5', '59–63')] },
    { type: 'single', prompt: '다음 코드에 대한 설명 중 틀린 것을 고르시오.',
      code: program('    bool flag = -3;\n    int n = 10 / 3;\n    cout << flag << " " << n;'),
      choices: ['-3은 0이 아니므로 flag는 true가 된다.', '정수끼리의 10 / 3은 3이다.', 'boolalpha를 사용하지 않은 기본 출력에서 true는 1로 출력된다.', '음수는 언제나 거짓이므로 출력은 0 3이다.'], answer: 3,
      explanation: '참·거짓을 가르는 기준은 양수·음수가 아니라 0인지 여부이다. 0이 아닌 -3은 참으로 변환된다. 따라서 결과는 1 3이다.', sources: [ref('ch3', '10, 19, 24–25')], verify: { stdout: '1 3' } },
    { type: 'output', prompt: '다음 반복문의 실행 결과를 쓰시오.',
      code: program('    int n = 5, sum = 0;\n    while (n > 0) {\n        sum += n;\n        n -= 2;\n    }\n    cout << sum << " " << n;'),
      answers: ['9 -1'], explanation: '5, 3, 1을 더해 sum은 9이다. 마지막 n -= 2 후 n은 -1이며 조건이 거짓이 되어 종료한다.', sources: [ref('ch3', '28, 54')], verify: { stdout: '9 -1' } },
    { type: 'output', prompt: '다음 중첩 반복문의 출력 결과를 줄별로 쓰시오.',
      code: program('    for (int i = 2; i <= 4; i++) {\n        for (int j = 1; j < i; j++)\n            cout << j;\n        cout << endl;\n    }'),
      answers: ['1\n12\n123'], explanation: 'j < i이므로 i가 2일 때 1, 3일 때 12, 4일 때 123을 출력한다. j <= i와 구분한다.', sources: [ref('ch3', '52, 57')], verify: { stdout: '1\n12\n123\n' } },
    { type: 'short', prompt: '배열의 최댓값 -2를 출력하도록 빈칸 한 줄을 채우시오. 현재 원소와 max를 비교해 필요한 경우에만 갱신한다.',
      code: program('    int a[4] = { -8, -2, -5, -9 };\n    int max = a[0];\n    for (int i = 1; i < 4; i++) {\n        __________\n    }\n    cout << max;'), expectedOutput: '-2',
      answers: ['if (a[i] > max) max = a[i];', 'if (max < a[i]) max = a[i];', 'if (a[i] > max) { max = a[i]; }', 'if (max < a[i]) { max = a[i]; }'], check: 'tokens',
      explanation: '현재 값이 max보다 클 때만 갱신한다. 초기값을 a[0]으로 두었으므로 모든 입력이 음수여도 처리된다. 동작이 같은 다른 조건식도 정답이 될 수 있다.', sources: [ref('ch3', '47–48, 68–69'), ref('practice4', '9')], verify: { fill: 'if (a[i] > max) max = a[i];', stdout: '-2' } },
    { type: 'output', prompt: '연산자 우선순위와 후위 증가를 고려하여 다음 코드의 출력 결과를 세 줄로 쓰시오.',
      code: program('    int a = 5, b = 10;\n    cout << a + b / 3 * 3 << endl;\n    int c = a++;\n    cout << c << " " << a << endl;\n    a += b;\n    cout << a << " " << 5.0 / a;'),
      answers: ['14\n5 6\n16 0.3125'], explanation: '10 / 3은 정수 나눗셈으로 3이어서 첫 결과는 5 + 3 × 3 = 14이다. c에는 증가 전 5가 들어가고 a는 6이 된다. a += b 후 16이며 5.0 / 16은 0.3125이다.', sources: [ref('ch3', '24–28, 37, 40–43')], verify: { stdout: '14\n5 6\n16 0.3125' } },
    { type: 'written', prompt: 'main()의 실행결과가 다음과 같도록 Triangle 클래스 작성하기\n주어진 너비(width)와 높이(height)를 가지고 Triangle 면적 계산하기',
      original: '5장 실습문제 2', code: triangleMain, sample: '삼각형의 면적은 20',
      instructions: ['제시된 main은 유지하고 Triangle 클래스를 작성한다.'],
      solution: triangleSolution,
      explanation: '5장 실습문제 3쪽의 문제, main 코드와 출력값을 유지했다. main에서 width와 height에 직접 접근하므로 public 멤버여야 한다. getArea는 너비 × 높이 ÷ 2를 계산한다. 아래 코드는 실행 가능한 전체 답안 예시이며 클래스 내부 구현도 가능하다.',
      rubric: ['Triangle 클래스를 선언하고 끝에 세미콜론을 썼는가?', 'main에서 직접 사용하는 width와 height가 public인가?', 'public getArea()가 삼각형 넓이를 반환하는가?', '제시된 main을 바꾸지 않고 삼각형의 면적은 20을 출력하는가?'], sources: [ref('practice5', '3'), ref('ch5', '11–12, 18–19')],
      verify: { code: triangleSolution, stdout: '삼각형의 면적은 20\n' } },
  ],
};
