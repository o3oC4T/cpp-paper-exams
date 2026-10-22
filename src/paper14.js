import { ref, program } from './sources.js';
import { endPractice } from './paper-practice-more.js';
const trace = `#include <iostream>
using namespace std;
class Counter {
    int value;
public:
    Counter() : Counter(2) { cout << "default "; }
    Counter(int n) : value(n) { cout << "new" << value << " "; }
    void add(int n) { value += n; }
    int get() { return value; }
    ~Counter() { cout << "end" << value << " "; }
};
int main() {
    Counter a;
    Counter b(5);
    a.add(b.get());
    cout << a.get() << ":" << b.get() << " ";
}`;
export default {
  id:'14',title:'문자열과 실행 흐름 점검',subtitle:'문자열 비교·반복 종료·생성자 위임을 함께 연습',
  questions:[
    {type:'single',prompt:'표준 C++ 프로그램의 진입 함수 이름과 반환형을 올바르게 짝지은 것은?',choices:['start / void','main / double','main / int','Main / int'],answer:2,explanation:'진입 함수의 이름은 소문자 main이며 반환형은 int이다. C++ 식별자는 대소문자를 구분한다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'이 프로그램의 화면 출력에 관한 설명으로 옳은 것은?',code:'#include <iostream>\nint main() {\n    /* 아래 출력문은 실행된다. */\n    std::cout << 2;\n    return 0;\n}',choices:['2를 출력하며 반환값 0은 화면에 추가하지 않는다.','20을 출력한다.','주석이 있으므로 모든 출력문이 무시된다.','return 0;만 실행되어 0을 출력한다.'],answer:0,explanation:'닫힌 주석 뒤의 cout은 실행된다. 출력문과 프로그램의 반환값 전달은 서로 다른 동작이다.',sources:[ref('ch2','4–5, 8–9')],verify:{stdout:'2'}},
    {type:'short',prompt:'using을 쓰지 않고 word를 대괄호로 감싸서 [code] 형식으로 출력하시오.',code:'#include <iostream>\n#include <string>\nint main() {\n    std::string word = "code";\n    __________\n}',answers:['std::cout << "[" << word << "]";','std::cout << \'[\' << word << \']\';'],check:'tokens',explanation:'cout에 std::를 붙이고 여는 괄호, 변수 값, 닫는 괄호를 차례대로 출력한다. 변수 이름 자체를 문자열에 넣지 않는다.',sources:[ref('ch2','8–9, 17, 34–35')],verify:{fill:'std::cout << "[" << word << "]";',stdout:'[code]'}},
    {type:'short',prompt:'안쪽 블록의 using을 유지한다. 블록 밖에서 9를 출력하도록 빈칸을 채우시오.',code:'#include <iostream>\nint main() {\n    {\n        using namespace std;\n        cout << "8 ";\n    }\n    __________\n}',answers:['std::cout << 9;'],check:'tokens',explanation:'안쪽 블록의 using 지시문은 그 블록을 벗어난 문장에 적용되지 않는다. 밖에서는 std::cout을 사용한다.',sources:[ref('ch2','17–19')],verify:{fill:'std::cout << 9;',stdout:'8 9'}},
    {type:'ox',prompt:'아래 두 C 문자열의 비교를 O/X로 판단하시오. 필요한 헤더를 포함했다.',code:'char a[] = "go";\nchar b[] = "go";',statements:["a == b는 두 배열의 문자열 내용을 비교하는 연산이다.","strcmp(a, b)는 0을 반환한다.","strlen(a)는 2이다.","strcmp가 0을 반환하면 두 문자열의 내용이 다르다는 뜻이다."],answer:["X","O","O","X"],explanation:'C 문자열의 내용 비교는 strcmp로 한다. 배열 이름을 ==로 비교하면 문자열 각 문자를 비교하는 것이 아니며, strcmp의 0은 같음을 뜻한다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'C 문자열의 길이를 반환할 함수에서 필요한 헤더 포함문 한 줄을 쓰시오. 헤더 이름은 cstring이다.',code:'__________\nint textLength(const char* text) {\n    return std::strlen(text);\n}',answers:['#include <cstring>'],check:'tokens',explanation:'std::strlen의 선언은 <cstring>에 있다. 이 코드는 함수 정의 조각이며 main이 없는 것 자체가 함수 정의의 문법 오류는 아니다.',sources:[ref('ch2','29, 41–42')]},
    {type:'multi',prompt:'C90과 C++를 비교한 학습 노트 중 고쳐 쓰지 않아도 되는 것을 모두 고르시오.',choices:['C90과 C++는 모두 /* ... */ 주석을 지원한다.','C++는 지역 변수 선언과 실행문을 같은 블록에서 섞을 수 있다.','C90에서도 //는 표준 주석이다.','C++에서 main의 반환형은 void가 표준이다.','C++는 C에서 제공하는 표준 라이브러리 기능도 사용할 수 있다.'],answer:[0,1,4],explanation:'공통 주석, C++의 선언 위치, C 라이브러리 사용은 맞다. //를 C90 표준으로 적거나 void main을 표준으로 적은 설명은 수정해야 한다.',sources:[ref('ch2','4–5, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'입력 한 줄이 “Kim Min”일 때 string name; cin >> name;으로 읽은 name은?',choices:['Kim Min','Min','빈 문자열','Kim'],answer:3,explanation:'기본 설정의 >>는 앞 공백을 건너뛴 뒤 다음 공백까지 한 토큰을 읽는다. 한 줄 전체가 필요하면 getline을 사용한다.',sources:[ref('ch2','30–35')]},
    {type:'single',prompt:'다음 정의에서 Cell::를 빼고 int get()으로 바꾸면 무엇이 달라지는가?',code:'class Cell {\n    int value;\npublic:\n    int get();\n};\nint Cell::get() { return value; }',choices:['get이 자동으로 생성자가 된다.','Cell의 멤버 정의가 아닌 일반 함수 정의가 되므로 value도 이 방식으로 읽을 수 없다.','아무 차이가 없다.','value가 자동 전역 변수가 된다.'],answer:1,explanation:'클래스 밖의 정의에는 소속 Cell::가 필요하다. 이를 생략한 일반 함수에는 Cell 멤버 value가 직접 이름으로 보이지 않는다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'객체지향의 “정보 은닉”과 직접 연결되는 선택은?',choices:['모든 데이터를 전역 변수로 옮긴다.','모든 멤버를 주석 안으로 넣는다.','외부에 필요한 함수는 공개하고 내부 상태의 직접 접근은 제한한다.','클래스와 객체를 같은 단어로 취급한다.'],answer:2,explanation:'정보 은닉은 외부가 알아야 할 인터페이스와 내부 구현을 구별하는 설계이다. 단순히 코드를 숨기거나 주석 처리한다는 뜻이 아니다.',sources:[ref('ch5','13, 59–67')]},
    {type:'single',prompt:'위임 생성자에서 다른 생성자를 호출하는 올바른 형태는?',choices:['Box() : Box(3) { }','void Box() : Box(3) { }','Box() : ~Box(3) { }','Box() return Box(3);'],answer:0,explanation:'생성자 서두에서 : Box(3)처럼 같은 클래스의 다른 생성자에 초기화를 위임한다. 반환형을 붙이거나 소멸자로 위임하지 않는다.',sources:[ref('ch5','29–36'),ref('book','112')]},
    {type:'single',prompt:'소멸자 본문에서 cout << value;를 실행한다. 객체의 value를 2에서 7로 바꾼 뒤 소멸하면 어떤 값을 읽는가?',choices:['처음 값 2만 읽는다.','소멸자의 value는 항상 0이다.','멤버 값을 읽을 수 없다.','소멸자 실행 시점에 저장된 값 7을 읽는다.'],answer:3,explanation:'소멸자도 자신의 멤버 값을 사용할 수 있다. 변경된 현재 값으로 실행하므로 초기값으로 되돌아간다고 가정하면 안 된다.',sources:[ref('ch5','49–55')]},
    {type:'single',prompt:'for문 본문 블록 안에서 자동 지역 객체를 한 개씩 만든다. 두 번 반복한다면 그 객체의 수명 설명으로 옳은 것은?',choices:['첫 반복에서 만든 객체가 두 번째 반복에서도 같은 객체로 유지된다.','각 반복에서 생성되고 각 본문 블록 끝에서 소멸한다.','생성은 두 번, 소멸은 프로그램 끝에서 한 번이다.','블록 안에 있으면 소멸자를 호출하지 않는다.'],answer:1,explanation:'자동 지역 객체는 선언문을 실행할 때 생성되고 그 블록을 나갈 때 소멸한다. 반복마다 새 객체의 수명이 시작된다.',sources:[ref('ch5','52–55')]},
    {type:'multi',prompt:'세 접근 지정자의 표기와 의미 중 옳은 것을 모두 고르시오. friend는 없다.',stars:3,choices:['public은 main의 직접 접근을 허용한다.','private은 같은 클래스 멤버 함수의 접근도 모두 금지한다.','protected는 올바른 C++ 키워드이다.','class에서 지정자를 생략한 멤버는 private이다.','struct에서는 private:을 사용할 수 없다.'],answer:[0,2,3],explanation:'public·private·protected를 정확히 구별한다. private은 자기 클래스의 멤버 함수가 접근할 수 있고 struct에도 접근 지정자를 명시할 수 있다.',sources:[ref('ch5','59–63, 76–77')]},
    {type:'single',prompt:'비교 연산자 ==를 사용한 다음 코드의 출력은?',code:program('    int n = 0;\n    if (n == 3) cout << "A";\n    else cout << "B";\n    cout << ":" << n;'),choices:['B:0','A:3','B:3','A:0'],answer:0,explanation:'==는 비교이므로 n을 바꾸지 않는다. 0==3은 거짓이라 B를 출력하고 n은 그대로 0이다.',sources:[ref('ch3','26–32')],verify:{stdout:'B:0'}},
    {type:'output',prompt:'매 반복의 sum을 차례대로 쓰시오.',code:program('    int sum = 0;\n    for (int i = 1; i <= 4; i++) {\n        sum += i;\n        cout << sum << " ";\n    }'),answers:['1 3 6 10'],explanation:'각 반복에서 누적한 직후 출력한다. 마지막 합만 출력하는 코드가 아니므로 1, 3, 6, 10이 모두 나온다.',sources:[ref('ch3','28, 52')],verify:{stdout:'1 3 6 10 '}},
    {type:'output',prompt:'안쪽 반복마다 0으로 초기화하는 sum의 출력을 쓰시오.',code:program('    for (int i = 1; i <= 2; i++) {\n        for (int j = 1; j <= 2; j++) {\n            int sum = 0;\n            sum += i + j;\n            cout << sum << " ";\n        }\n        cout << endl;\n    }'),answers:['2 3\n3 4'],explanation:'sum은 안쪽 본문에 들어올 때마다 새로 0이 된다. 이전 반복의 합을 유지하지 않아 각 i+j만 출력한다.',sources:[ref('ch3','52, 57')],verify:{stdout:'2 3 \n3 4 \n'}},
    {type:'short',prompt:'strcmp를 사용하여 a와 b의 내용이 같을 때 1을 반환하도록 빈칸을 채우시오.',code:'#include <iostream>\n#include <cstring>\nusing namespace std;\nint same(const char* a, const char* b) {\n    __________\n}\nint main() { cout << same("red", "red") << " " << same("red", "Red"); }',answers:['return strcmp(a, b) == 0;','return std::strcmp(a, b) == 0;'],check:'tokens',expectedOutput:'1 0',explanation:'strcmp의 0이 같음을 뜻하므로 ==0 비교 결과를 반환한다. bool 결과는 int의 1 또는 0으로 변환되며 대소문자를 구별한다.',sources:[ref('ch2','29'),ref('ch4','19–22')],verify:{fill:'return strcmp(a, b) == 0;',stdout:'1 0'}},
    {type:'output',prompt:'위임 생성자의 순서와 변경된 멤버 값을 함께 고려하여 출력을 쓰시오.',code:trace,answers:['new2 default new5 7:5 end5 end7'],explanation:'a는 인자 생성자로 위임하여 new2 뒤 default를 출력한다. b는 new5, a.add로 a는 7이 된다. 7:5 뒤 생성 역순으로 b의 end5, a의 end7을 출력한다.',sources:[ref('ch5','29–36, 49–55'),ref('book','112, 119–124')],verify:{stdout:'new2 default new5 7:5 end5 end7 '}},
    endPractice,
  ],
};
