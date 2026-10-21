import { ref, program } from './sources.js';

const maxSolution = `#include <iostream>
using namespace std;

int main()
{
    int a[5];
    cout << "숫자를 입력하세요 :";
    for (int i = 0; i < 5; i++)
        cin >> a[i];
    int max = a[0];
    for (int i = 1; i < 5; i++) {
        if (a[i] > max)
            max = a[i];
    }
    cout << "가장 큰 수는 " << max << "입니다." << endl;
    return 0;
}`;
const itemCode = `#include <iostream>
using namespace std;
class Item {
    int id;
public:
    Item(int n) { id = n; cout << "C" << id << endl; }
    ~Item() { cout << "D" << id << endl; }
};
int main() {
    Item a(1);
    {
        Item b(2);
    }
    cout << "X" << endl;
    return 0;
}`;

export default {
  id: '05', title: '마지막 빈틈 확인', subtitle: '설명부터 손코딩까지, 전 범위를 다시 점검하는 최종 회차',
  questions: [
    { type: 'single', prompt: '다음 네 가지 main 정의 중 표준 C++ 형식이 아닌 것은?',
      choices: ['int main() { return 0; }', 'int main(void) { return 0; }', 'int main() { }', 'void main() { }'], answer: 3,
      explanation: '표준 C++ main의 리턴형은 int이다. 매개변수가 없는 int main()과 int main(void)는 모두 가능하며, 끝에 도달하는 main에서는 return 0;을 생략할 수 있다.', sources: [ref('ch2', '4–5'), ref('ch4', '13')] },
    { type: 'single', prompt: 'C++ 기본 문법 설명 중 틀린 것을 고르시오.',
      choices: ['/* ... */ 사이의 문장은 주석 처리된다.', '// 주석은 그 줄의 끝에서 끝난다.', 'main의 return 0; 생략 허용은 main의 리턴형 int를 생략해도 된다는 뜻이다.', '#include는 전처리기에게 내리는 지시이다.'], answer: 2,
      explanation: 'return 문과 함수의 리턴형 선언은 다르다. main 끝의 return 0;을 생략할 수 있어도 정의의 int는 적어야 한다.', sources: [ref('ch2', '4–6')] },
    { type: 'short', prompt: 'using을 사용하지 않고 3과 줄바꿈을 출력하려 한다. 빈칸을 완성하시오. endl을 사용한다.',
      code: '#include <iostream>\nint main() {\n    int n = 3;\n    __________\n    return 0;\n}',
      answers: ['std::cout << n << std::endl;'], check: 'tokens',
      explanation: '이름 공간을 가져오지 않았으므로 cout와 endl 모두 std:: 접두어를 붙인다.', sources: [ref('ch2', '9, 17')], verify: { fill: 'std::cout << n << std::endl;', stdout: '3\n' } },
    { type: 'short', prompt: 'using std::cout;은 유지한다. 출력문을 수정하지 않고, endl만 추가로 가져오도록 빈칸을 채우시오. using namespace std;는 사용하지 않는다.',
      code: '#include <iostream>\nusing std::cout;\n__________\nint main() {\n    cout << "Done" << endl;\n    return 0;\n}',
      answers: ['using std::endl;'], check: 'tokens',
      explanation: 'using std::endl;처럼 개별 이름을 가져올 수 있다. using namespace std;와 가져오는 범위가 다르다.', sources: [ref('ch2', '17')], verify: { fill: 'using std::endl;', stdout: 'Done\n' } },
    { type: 'ox', prompt: '문자열에 관한 각 설명을 O/X로 판단하시오.',
      statements: ['<string>에는 C++의 string 클래스가 선언된다.', 'C 문자열의 끝을 나타내는 문자는 숫자 모양의 \'0\'이다.', 'char s[10] = "Hi";에서 문자열 길이는 10이다.', '<cstring>의 strcmp와 strlen은 C 문자열을 다루는 함수이다.'], answer: ['O', 'X', 'X', 'O'],
      explanation: 'C 문자열의 종료는 문자 \'0\'이 아니라 널 문자 \'\\0\'이다. 배열의 저장 용량 10과 문자열 길이 2는 다르다. strlen은 종료 널 문자 전까지의 길이를 센다.', sources: [ref('ch2', '28–29, 34')] },
    { type: 'short', prompt: 'C++에서 C 문자열 처리 함수를 쓰기 위한 헤더 이름이 cstring이다. 이를 포함하도록 #으로 시작하는 전처리 지시문 한 줄을 쓰시오.',
      answers: ['#include <cstring>'], check: 'tokens',
      explanation: '#include <cstring>이며 뒤에 세미콜론을 쓰지 않는다. 이것은 using 지시문이나 함수 호출이 아니다.', sources: [ref('ch2', '29, 39, 41–42')] },
    { type: 'multi', prompt: 'C90과 표준 C++에 대한 설명 중 옳은 것을 모두 고르시오. C90의 컴파일러 확장은 제외한다.',
      choices: ['C++는 C90 방식의 /* ... */ 주석을 사용하지 못한다.', 'C++는 실행문 뒤에 지역 변수를 선언할 수 있다.', 'C90에서는 //를 표준 주석으로 사용하지 않는다.', 'C++는 main 끝에서 return 0;을 생략할 수 있다.', '모든 시대의 C 표준은 반드시 C90의 변수 선언 제한을 그대로 따른다.'], answer: [1, 2, 3],
      explanation: 'C++에서는 두 주석 방식, 실행문 사이의 선언, main 끝의 return 생략이 허용된다. C99 이후에는 C에도 //, 선언과 문장 혼용 및 main 끝에서 0 반환 규칙이 있으므로 5번은 틀리다.', sources: [ref('ch2', '4, 24–25'), ref('ch3', '5')], standardNote: true },
    { type: 'single', prompt: 'C++에서 cout, cin을 사용하기 위해 포함하는 표준 입출력 헤더는?',
      choices: ['<cstring>', '<iostream>', '<string>', '<class>'], answer: 1,
      explanation: '표준 입출력 스트림의 헤더는 <iostream>이다.', sources: [ref('ch2', '6–8, 21')] },
    { type: 'single', prompt: '클래스 선언부와 구현부를 나눠 작성할 때 옳은 설명은?',
      choices: ['선언부의 함수 원형 끝에는 세미콜론을 적는다.', '클래스 밖의 멤버 함수 구현에서는 소속 클래스 이름을 절대 쓰지 않는다.', '접근 권한은 main 안에서만 지정한다.', '멤버 변수와 멤버 함수는 같은 클래스에 함께 선언할 수 없다.'], answer: 0,
      explanation: 'double getArea();처럼 원형에는 세미콜론을 붙인다. 클래스 밖의 정의에서는 double Circle::getArea() { ... }처럼 소속을 표시한다.', sources: [ref('ch5', '11–12')] },
    { type: 'single', prompt: '다음 중 수업 자료의 객체지향 핵심 개념 네 가지에 포함되지 않는 것은?',
      choices: ['다형성', '순차 실행만으로 프로그램 분해', '상속', '정보 은닉', '캡슐화'], answer: 1,
      explanation: '5장 13쪽의 네 개념은 캡슐화, 정보 은닉, 상속, 다형성이다. 순차 실행만으로 프로그램을 나누는 것은 해당 목록의 개념이 아니다.', sources: [ref('ch5', '13'), ref('ch1', '25')] },
    { type: 'single', prompt: '생성자가 필요한 이유와 특징에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['객체 생성 시 멤버 변수 초기화 등에 사용한다.', '클래스 이름과 같은 이름을 사용한다.', '어떤 생성자를 직접 선언하더라도 컴파일러가 매개변수 없는 생성자를 항상 추가한다.', '매개변수 목록을 달리하여 중복 정의할 수 있다.'], answer: 2,
      explanation: '생성자를 직접 하나라도 선언한 경우에는 매개변수 없는 기본 생성자가 무조건 추가되는 것이 아니다. 자료의 자동 생성 조건을 함께 기억해야 한다.', sources: [ref('ch5', '23–24, 38–40')] },
    { type: 'single', prompt: '일반 클래스의 소멸자에 대한 설명 중 틀린 것을 고르시오.',
      choices: ['객체가 소멸할 때 사용하던 자원을 정리하는 데 쓴다.', '이름 앞에 ~를 붙인다.', '매개변수와 반환형을 쓰지 않는다.', '소멸자를 작성하지 않으면 어떤 클래스도 객체를 만들 수 없다.'], answer: 3,
      explanation: '수업 자료는 소멸자를 직접 선언하지 않으면 컴파일러가 기본 소멸자를 자동 생성한다고 설명한다. 반드시 직접 작성해야만 객체를 생성할 수 있는 것은 아니다.', sources: [ref('ch5', '49–50')] },
    { type: 'single', prompt: 'f() 안에 자동 지역 객체 t 하나가 있다. main에서 f(); f();를 연속으로 실행한다. 두 호출 사이에 t의 수명은 어떻게 되는가?',
      choices: ['첫 호출에서 생성된 t를 두 번째 호출이 계속 공유한다.', 't는 main이 끝날 때 두 번 한꺼번에 소멸한다.', '첫 호출 종료 때 소멸하고, 두 번째 호출에서 새로 생성된다.', '함수를 여러 번 부르면 지역 객체의 소멸자는 실행되지 않는다.'], answer: 2,
      explanation: '자동 지역 객체의 수명은 해당 함수 호출의 범위에 묶인다. 각 호출에서 생성되고 각 함수 종료 시 소멸한다. 전역 객체처럼 프로그램 전체에 걸쳐 살아 있지 않는다.', sources: [ref('ch5', '52–55')] },
    { type: 'ox', prompt: '다음 접근 지정자 설명을 O/X로 판단하시오. friend는 사용하지 않는다.', stars: 3,
      statements: ['main에서 객체의 public 멤버를 직접 사용할 수 있다.', '파생 클래스의 멤버 함수는 기반 클래스의 private 멤버를 직접 사용할 수 있다.', 'protected는 자기 클래스와 파생 클래스 내부에서의 접근을 허용한다.', '접근 지정자를 생략한 class 멤버의 기본 접근은 private이다.'], answer: ['O', 'X', 'O', 'O'],
      explanation: '파생 클래스라고 해서 기반 클래스의 private 멤버에 직접 접근할 수 있는 것은 아니다. protected는 그 접근을 허용한다. 외부 main에서의 직접 접근은 public에 허용된다.', sources: [ref('ch5', '59–63')] },
    { type: 'single', prompt: '다음 코드에 대한 설명 중 틀린 것을 고르시오.',
      code: program('    int n = 2;\n    if (n > 0)\n        if (n > 3)\n            cout << "A";\n        else\n            cout << "B";'),
      choices: ['n > 0은 참이다.', 'n > 3은 거짓이다.', 'else는 안쪽 if (n > 3)와 연결된다.', 'else는 바깥 if (n > 0)와 연결되므로 아무것도 출력하지 않는다.'], answer: 3,
      explanation: '중괄호가 없는 이 구조에서 else는 가장 가까운 짝 없는 if인 if (n > 3)와 연결된다. 바깥 조건은 참, 안쪽 조건은 거짓이므로 B를 출력한다.', sources: [ref('ch3', '46–48')], verify: { stdout: 'B' } },
    { type: 'output', prompt: '다음 코드의 실행 결과를 쓰시오.',
      code: program('    int n = 1, count = 0;\n    do {\n        n *= 2;\n        count++;\n    } while (n < 10);\n    cout << n << " " << count;'),
      answers: ['16 4'], explanation: '몸체를 실행한 후 n은 2, 4, 8, 16이 된다. 네 번째 실행 뒤 n < 10이 거짓이라 종료한다.', sources: [ref('ch3', '28, 53, 55')], verify: { stdout: '16 4' } },
    { type: 'output', prompt: '다음 반복문의 출력 결과를 두 줄로 쓰시오.',
      code: program('    for (int i = 1; i <= 2; i++) {\n        for (int j = 1; j <= 3; j++)\n            cout << i * j << " ";\n        cout << endl;\n    }'),
      answers: ['1 2 3\n2 4 6'], explanation: '첫 행은 1×1, 1×2, 1×3이고 둘째 행은 2×1, 2×2, 2×3이다. 각 행 마지막 공백은 채점에서 무시한다.', sources: [ref('ch3', '52, 57')], verify: { stdout: '1 2 3 \n2 4 6 \n' } },
    { type: 'short', prompt: 'Rectangle의 getArea가 너비와 높이를 이용해 면적을 반환하도록 빈칸 한 줄을 작성하시오. 이 프로그램의 출력은 15이다.',
      code: '#include <iostream>\nusing namespace std;\nclass Rectangle {\npublic:\n    int width, height;\n    int getArea();\n};\nint Rectangle::getArea() {\n    __________\n}\nint main() {\n    Rectangle r;\n    r.width = 3;\n    r.height = 5;\n    cout << r.getArea();\n    return 0;\n}', expectedOutput: '15',
      answers: ['return width * height;', 'return height * width;', 'return (width * height);'], check: 'tokens',
      explanation: '함수의 반환형이 int이므로 면적 계산값을 return으로 돌려준다. cout만으로 출력하거나 15를 그대로 반환하는 것은 문제의 “너비와 높이를 이용”하는 조건을 만족하지 않는다.', sources: [ref('ch5', '18–19')], verify: { fill: 'return width * height;', stdout: '15' } },
    { type: 'output', prompt: '객체 생성과 블록 종료를 고려하여 출력되는 모든 줄을 쓰시오.', code: itemCode,
      answers: ['C1\nC2\nD2\nX\nD1'], explanation: 'a와 b 순으로 생성된다. 안쪽 블록이 끝나면 b가 먼저 소멸하여 D2를 출력한다. 그 다음 X, 마지막으로 main 종료 시 a의 D1이 출력된다.', sources: [ref('ch5', '49–55')], verify: { stdout: 'C1\nC2\nD2\nX\nD1\n' } },
    { type: 'written', prompt: '정수 5개를 입력 받아서 가장 큰 수를 출력하기', original: '4장 실습문제 6',
      sample: '숫자를 입력하세요 :2 100 58 6 47\n가장 큰 수는 100입니다.', solution: maxSolution,
      explanation: '4장 실습문제 9쪽의 문제와 예시이다. 정수에는 음수도 있으므로 최댓값을 첫 입력으로 초기화한다. 배열 없이 입력 때마다 비교하는 방식도 요구를 만족하면 정답이다.',
      rubric: ['정수를 정확히 5개 입력받는가?', '다섯 수를 모두 비교하는가?', '모든 수가 음수인 경우에도 실제 최댓값을 찾는가?', '예시 입력에서 가장 큰 수는 100입니다.를 출력하는가?'], sources: [ref('practice4', '9')],
      verify: { code: maxSolution, cases: [{ stdin: '2 100 58 6 47\n', stdout: '숫자를 입력하세요 :가장 큰 수는 100입니다.\n' }, { stdin: '-8 -2 -9 -3 -4\n', stdout: '숫자를 입력하세요 :가장 큰 수는 -2입니다.\n' }, { stdin: '7 7 7 7 7\n', stdout: '숫자를 입력하세요 :가장 큰 수는 7입니다.\n' }] } },
  ],
};
