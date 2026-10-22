import { ref, program } from './sources.js';
import { splitPersonPractice } from './paper-practice-more.js';
const trace = `#include <iostream>
using namespace std;
class Mark {
    int n;
public:
    Mark(int v) : n(v) { cout << "C" << n << " "; }
    ~Mark() { cout << "D" << n << " "; }
};
Mark global(8);
int main() {
    Mark outer(1);
    for (int i = 2; i <= 3; i++) {
        Mark inner(i);
        cout << "L ";
    }
    cout << "M ";
}`;
const ctorCode = `#include <iostream>
using namespace std;
class Number {
    int value;
public:
    Number(int n) : value(n) { value += 1; }
    int get() { return value; }
};
int main() { Number x(3); cout << x.get(); }`;
export default {
  id:'15',title:'선언부터 실행 종료까지',subtitle:'생성자·접근 제어·반복문을 종합하고 클래스 파일 분리로 마무리',
  questions:[
    {type:'single',prompt:'int main() { return -1; }에서 main의 반환형과 화면 출력에 대한 옳은 설명은?',choices:['반환형은 int이고 출력문이 없으므로 -1을 화면에 자동 출력하지 않는다.','음수를 반환하면 main의 반환형은 unsigned int로 바뀐다.','반환값이 -1이라서 반환형은 void이다.','return은 항상 반환값을 화면에도 출력한다.'],answer:0,explanation:'반환형은 정의 앞에 명시한 int이다. return은 종료 상태를 전달하며 cout처럼 화면에 값을 출력하는 문장이 아니다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'첫 줄의 //가 적용되는 범위를 고려한 출력은?',code:'#include <iostream>\nint main() {\n    // std::cout << "P"; std::cout << "Q";\n    std::cout << "R";\n}',choices:['PQR','QR','출력 없음','R'],answer:3,explanation:'//는 그 줄 끝까지 주석으로 만든다. 같은 줄의 Q 출력문도 실행되지 않으며 다음 줄의 R만 출력한다.',sources:[ref('ch2','4')],verify:{stdout:'R'}},
    {type:'short',prompt:'using 없이 배열 a의 두 번째 원소와 std::endl을 출력하도록 빈칸을 채우시오.',code:'#include <iostream>\nint main() {\n    int a[3] = {5, 10, 15};\n    __________\n}',answers:['std::cout << a[1] << std::endl;','std::cout << *(a + 1) << std::endl;'],check:'tokens',explanation:'두 번째 원소의 인덱스는 1이다. cout과 endl의 std 소속을 각각 명시한다.',sources:[ref('ch2','9, 17'),ref('ch4','66–75')],verify:{fill:'std::cout << a[1] << std::endl;',stdout:'10\n'}},
    {type:'short',prompt:'string만 가져온 using 선언은 유지한다. 새로운 using 없이 name을 출력하시오.',code:'#include <iostream>\n#include <string>\nusing std::string;\nint main() {\n    string name = "Lee";\n    __________\n}',answers:['std::cout << name;'],check:'tokens',explanation:'using std::string;은 string이라는 이름만 가져온다. 출력 스트림은 std::cout으로 지정한다.',sources:[ref('ch2','17, 34–35')],verify:{fill:'std::cout << name;',stdout:'Lee'}},
    {type:'ox',prompt:'char s[] = "a b";의 저장 내용에 대한 설명을 O/X로 판단하시오.',statements:['문자열 안의 공백도 한 문자로 저장된다.','strlen(s)는 공백을 제외한 2이다.','sizeof(s)는 널 문자를 포함하여 4이다.','s[3]에는 널 문자가 들어 있다.'],answer:['O','X','O','O'],explanation:'공백은 문자열의 일부이다. a, 공백, b가 길이 3을 이루고 마지막 널 문자까지 배열 크기는 4이다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'C 문자열에서 strlen과 strcmp를 같은 파일에 사용한다. 두 함수를 위해 필요한 표준 C++ 헤더 지시문 하나를 쓰시오.',answers:['#include <cstring>'],check:'tokens',explanation:'두 함수 모두 <cstring>에 선언된다. 헤더 지시문은 #include로 시작하며 끝에 일반 문장의 세미콜론을 붙이지 않는다.',sources:[ref('ch2','29, 41–43')]},
    {type:'multi',prompt:'C90과 C++의 공통점·차이를 정확하게 설명한 것을 모두 고르시오.',choices:['두 언어에서 /* ... */를 주석으로 사용할 수 있다.','C90에서 실행문 뒤의 변수 선언을 못 하므로 C++도 못 한다.','C++에서 클래스는 변수와 함수를 함께 멤버로 가질 수 있다.','C++에서 C 표준 입출력 함수를 사용해도 된다.','C++에서는 main의 int 반환형을 생략하는 것이 표준이다.'],answer:[0,2,3],explanation:'C++의 클래스와 자유로운 선언 위치, C 라이브러리 사용을 C90 규칙과 구분한다. main의 표준 반환형 int는 생략하지 않는다.',sources:[ref('ch2','4–5, 24–25'),ref('ch3','4–5'),ref('ch5','9–13')],standardNote:true},
    {type:'single',prompt:'boolalpha를 설정하지 않은 기본 cout에서 cout << (3 > 8);의 출력은?',choices:['false','0','1','3>8'],answer:1,explanation:'비교 결과는 false이다. 기본 스트림 설정은 bool을 숫자로 출력하므로 0이 나온다.',sources:[ref('ch3','19, 30–32')]},
    {type:'single',prompt:'Person.h에 클래스 선언을 두고 Person.cpp와 main.cpp로 분리했다. 올바른 구성은?',choices:['main.cpp에서 Person.cpp를 반드시 #include한다.','Person.cpp의 멤버 정의에서 Person::를 모두 제거한다.','Person.cpp와 main.cpp가 Person.h를 포함하고 두 cpp 파일을 함께 빌드한다.','Person.h에 main만 두고 클래스는 main.cpp에서 숨긴다.'],answer:2,explanation:'각 cpp 파일이 클래스 선언을 보도록 헤더를 포함한다. 멤버 구현과 main을 따로 컴파일한 뒤 함께 연결하며 구현 cpp 자체를 헤더처럼 포함하지 않는다.',sources:[ref('ch5','79–91'),ref('book','135–138')]},
    {type:'single',prompt:'기존 클래스의 공통 특성을 바탕으로 새 클래스를 구성하는 “상속”에 대한 설명으로 옳은 것은?',choices:['같은 값을 반복 입력하는 것을 뜻한다.','헤더를 두 번 포함하는 기능이다.','지역 객체를 전역 객체로 바꾸는 문법이다.','클래스 사이에서 특성을 이어받아 확장하는 관계이다.'],answer:3,explanation:'상속은 수업에서 소개한 객체지향 개념이다. 입력 반복, 헤더 포함, 객체 수명 변경과는 다른 개념이다.',sources:[ref('ch5','13')]},
    {type:'single',prompt:'멤버 초기화 목록과 생성자 본문의 순서를 고려한 출력은?',code:ctorCode,choices:['4','3','1','초기화되지 않은 값'],answer:0,explanation:'먼저 value(n)으로 3을 초기화하고 생성자 본문에서 1을 더한다. 초기화 목록이 본문 뒤에 실행되는 것은 아니다.',sources:[ref('ch5','32–37'),ref('book','113–114')],verify:{stdout:'4'}},
    {type:'single',prompt:'아래 소멸자 선언의 오류를 올바르게 수정하는 방법은?',code:'class Task {\npublic:\n    int ~Task();\n};',choices:['int를 void로 바꾼다.','~Task를 Task로 바꿔 소멸자를 유지한다.','반환형 int를 제거하여 ~Task();로 쓴다.','괄호에 int n을 추가한다.'],answer:2,explanation:'소멸자는 반환형을 적지 않는다. void로 바꾸어도 올바른 소멸자 선언이 되지 않으며 매개변수도 없다.',sources:[ref('ch5','49–50')]},
    {type:'single',prompt:'main의 if(false) 블록 안에만 자동 지역 객체 hidden이 선언되어 있다. 정상 실행 시 옳은 것은?',choices:['전역 객체처럼 먼저 생성된다.','그 선언문을 실행하지 않으므로 생성·소멸 모두 발생하지 않는다.','소멸자만 호출된다.','main이 종료될 때 처음 생성된다.'],answer:1,explanation:'자동 지역 객체는 선언문을 실제로 실행해야 생성된다. 실행하지 않은 분기의 객체는 생성되지 않으므로 소멸도 없다.',sources:[ref('ch5','52–55')]},
    {type:'ox',prompt:'class와 struct의 접근 제어를 종합하여 O/X로 판단하시오. friend는 없다.',stars:3,statements:['class의 멤버 함수도 기본 접근은 private이다.','struct에서 지정자를 생략한 멤버 변수는 public이다.','private 멤버를 읽는 public getter가 있으면 main은 그 getter를 호출할 수 있다.','getter가 있다는 이유만으로 원래 private 변수에 main이 직접 접근할 수 있다.'],answer:['O','O','O','X'],explanation:'기본 접근 규칙은 멤버 변수와 멤버 함수 모두에 적용된다. public getter를 통한 접근과 private 변수의 직접 접근을 구별한다.',sources:[ref('ch5','59–67, 76–77')]},
    {type:'single',prompt:'조건식 안의 대입을 그대로 실행했을 때 출력은?',code:program('    int n = 5;\n    if (n = 0) cout << "T";\n    else cout << "F";\n    cout << n;'),choices:['T5','F5','T0','F0'],answer:3,explanation:'n=0은 n을 0으로 바꾸고 값 0을 가진다. 조건은 거짓이므로 F 뒤 0을 출력한다. 이 대입 조건은 비교와의 차이를 확인하기 위한 의도된 코드이다.',sources:[ref('ch3','19, 26–32')],verify:{stdout:'F0'}},
    {type:'output',prompt:'배열에서 0을 만나면 멈추는 코드의 sum과 i를 쓰시오.',code:program('    int a[5] = {3, 4, 0, 8, 9};\n    int sum = 0, i = 0;\n    while (i < 5 && a[i] != 0) {\n        sum += a[i];\n        i++;\n    }\n    cout << sum << " " << i;'),answers:['7 2'],explanation:'인덱스 0, 1의 3과 4만 더한다. i=2에서 a[2]가 0이라 본문에 들어가지 않으므로 sum=7, i=2이다.',sources:[ref('ch3','30–32, 54, 68–69')],verify:{stdout:'7 2'}},
    {type:'output',prompt:'조건에 따라 별과 점을 출력하는 코드를 세 줄로 쓰시오.',code:program('    for (int r = 0; r < 3; r++) {\n        for (int c = 0; c < 3; c++) {\n            if (r == c) cout << "*";\n            else cout << ".";\n        }\n        cout << endl;\n    }'),answers:['*..\n.*.\n..*'],explanation:'행과 열 인덱스가 같을 때만 별을 출력한다. (0,0), (1,1), (2,2)가 대각선의 별 위치이다.',sources:[ref('ch3','46–48, 57')],verify:{stdout:'*..\n.*.\n..*\n'}},
    {type:'short',prompt:'클래스 밖에서 setter를 정의하도록 빈칸에 반환형·클래스 소속·함수 이름과 매개변수를 쓰시오.',code:'#include <iostream>\nusing namespace std;\nclass Level {\n    int value = 0;\npublic:\n    void set(int n);\n    int get() { return value; }\n};\n__________ { value = n; }\nint main() { Level x; x.set(6); cout << x.get(); }',answers:['void Level::set(int n)'],check:'tokens',expectedOutput:'6',explanation:'일반 멤버 함수 set의 반환형은 선언과 같은 void이다. 생성자와 달리 일반 함수의 반환형을 생략하면 안 되며 클래스 밖에서는 Level::를 붙인다.',sources:[ref('ch5','11–12, 59–67')],verify:{fill:'void Level::set(int n)',stdout:'6'}},
    {type:'output',prompt:'반복문 안의 객체와 전역 객체를 고려하여 전체 출력 순서를 쓰시오.',code:trace,answers:['C8 C1 C2 L D2 C3 L D3 M D1 D8'],explanation:'전역 global, main의 outer 순으로 생성한다. 각 반복의 inner는 C2 L D2, C3 L D3으로 생성·소멸한다. M 뒤 outer, 마지막에 global이 소멸한다.',sources:[ref('ch5','49–55')],verify:{stdout:'C8 C1 C2 L D2 C3 L D3 M D1 D8 '}},
    splitPersonPractice,
  ],
};
