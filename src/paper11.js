import { ref, program } from './sources.js';
import { passwordPractice } from './paper-practice-more.js';
const trace = `#include <iostream>
using namespace std;
class Item {
    int id;
public:
    Item(int n) : id(n) { cout << "C" << id << " "; }
    ~Item() { cout << "D" << id << " "; }
};
void visit() { Item x(2); cout << "F "; }
int main() {
    Item a(1);
    visit();
    visit();
    cout << "M ";
}`;
const ctorCode = `#include <iostream>
using namespace std;
class Lamp {
    int level;
public:
    Lamp() : level(1) { }
    Lamp(int n) : level(n) { }
    int get() { return level; }
};
int main() { Lamp a; Lamp b(4); cout << a.get() << " " << b.get(); }`;
export default {
  id:'11',title:'입력부터 조건 판단까지',subtitle:'문자열·이름 공간·조건식의 차이를 실제 코드에 적용',
  questions:[
    {type:'single',prompt:'아래 정의에서 main이 매개변수를 받지 않고 int를 반환하도록 A, B를 채운 올바른 조합은?',code:'A main(B) { return 0; }',choices:['A=void, B=int','A=int, B=void','A=double, B=void','A=생략, B=void'],answer:1,explanation:'이름 앞의 int는 반환형, 괄호 안의 void는 매개변수가 없다는 뜻이다. int main()도 매개변수 없는 표준 형식이다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'주석 처리된 줄을 제외한 실제 출력은?',code:program('    int n = 3;\n    // n = 10;\n    n += 5;\n    cout << n;'),choices:['3','10','15','8'],answer:3,explanation:'//로 시작한 대입문은 실행되지 않는다. n=3에 5를 더하므로 8이며 return 0은 출력이 아니다.',sources:[ref('ch2','4–5')],verify:{stdout:'8'}},
    {type:'short',prompt:'using을 쓰지 않고 total을 “합=9” 형식으로 출력한 뒤 std::endl로 줄을 바꾸시오.',code:'#include <iostream>\nint main() {\n    int total = 9;\n    __________\n}',answers:['std::cout << "합=" << total << std::endl;'],check:'tokens',explanation:'문자열과 변수는 <<로 이어 출력하고 cout, endl 각각에 std::를 붙인다. total을 문자열 안에 적으면 변수 값이 출력되지 않는다.',sources:[ref('ch2','8–9, 17')],verify:{fill:'std::cout << "합=" << total << std::endl;',stdout:'합=9\n'}},
    {type:'short',prompt:'기존 using과 출력문을 유지하고, 아직 가져오지 않은 이름 하나의 using 선언을 추가하시오.',code:'#include <iostream>\nusing std::cout;\n__________\nint main() { cout << "done" << endl; }',answers:['using std::endl;'],check:'tokens',explanation:'cout만 가져온 상태이므로 endl을 따로 가져온다. using std::endl;은 특정 이름을 가져오는 선언이다.',sources:[ref('ch2','17–19')],verify:{fill:'using std::endl;',stdout:'done\n'}},
    {type:'ox',prompt:'char s[] = "";에 대한 각 설명을 O/X로 판단하시오. 필요한 헤더는 포함했다.',statements:['s에는 널 문자가 저장된다.','sizeof(s)는 0이다.','strlen(s)는 0이다.','빈 C 문자열은 널 문자를 저장할 공간이 없어도 된다.'],answer:['O','X','O','X'],explanation:'빈 문자열도 끝을 표시하는 널 문자 한 칸이 필요하다. 따라서 배열 크기는 1이고 실제 문자 수는 0이다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'길이 차를 계산하는 코드에 필요한 cstring 헤더 포함문을 쓰시오.',code:'#include <iostream>\n__________\nint main() {\n    std::cout << std::strlen("hello") - std::strlen("cat");\n}',answers:['#include <cstring>'],check:'tokens',explanation:'strlen 선언은 <cstring>에서 준비한다. 널 문자를 제외한 길이 5와 3의 차는 2이다.',sources:[ref('ch2','29, 41–42')],verify:{fill:'#include <cstring>',stdout:'2'}},
    {type:'multi',prompt:'아래 코드 조각을 C90과 C++로 읽을 때 옳은 설명을 모두 고르시오. 확장 문법은 제외한다.',code:'int n = 1;\nn++;\nint twice = n * 2;',choices:['C++에서는 실행문 뒤의 twice 선언을 허용한다.','C90에서는 같은 블록에서 이 순서의 선언과 실행문 혼용을 허용하지 않는다.','C90에서 오류가 나면 C++에서도 반드시 오류이다.','C++에서 // 주석을 추가해도 주석 자체는 실행되지 않는다.','C90에는 /* ... */ 주석도 없다.'],answer:[0,1,3],explanation:'C90은 같은 블록의 선언을 실행문 앞에 두지만 C++는 혼용할 수 있다. 두 언어 모두 /* ... */를 지원하며 // 지원 여부는 C90과 C99 이후를 구분한다.',sources:[ref('ch2','4, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'cout << "A" << endl << "B";의 출력으로 옳은 것은?',choices:['AB 한 줄','A, B가 각각 다른 줄에 출력됨','A endl B 한 줄','A B 한 줄'],answer:1,explanation:'endl은 줄바꿈을 수행한다. 자동 공백을 넣거나 endl이라는 글자를 출력하지 않는다.',sources:[ref('ch2','8–9')]},
    {type:'single',prompt:'아래 클래스 정의에서 빠진 기호는?',code:'class Meter {\npublic:\n    int read();\n}\nint main() { }',choices:['클래스 닫는 } 뒤의 ;','public 뒤의 ::','read 뒤의 ~','main 앞의 class'],answer:0,explanation:'클래스 정의는 };로 마친다. 멤버 함수 원형의 세미콜론과 클래스 전체를 닫는 세미콜론은 각각 필요하다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'Score가 점수와 점수 변경 함수를 함께 가지고, main은 그 함수를 통해 점수를 바꾸게 했다. 가장 알맞은 설명은?',choices:['모든 객체가 점수 하나를 자동 공유한다.','클래스를 쓰면 조건 검사 코드가 불필요하다.','데이터와 함수를 묶는 캡슐화와 직접 접근을 제한하는 정보 은닉을 적용한 것이다.','점수 변경 함수는 멤버 변수를 사용할 수 없다.'],answer:2,explanation:'클래스는 데이터와 동작을 묶고 접근 제어로 외부 인터페이스를 정한다. 점수 범위 검사는 필요한 경우 함수 안에서 구현해야 한다.',sources:[ref('ch5','9, 13, 59–67')]},
    {type:'single',prompt:'인자에 따른 생성자 선택을 고려한 출력은?',code:ctorCode,choices:['1 1','4 4','4 1','1 4'],answer:3,explanation:'a는 인자 없는 생성자로 level=1, b는 int 인자를 받는 생성자로 level=4가 된다. 두 객체는 별도의 멤버 값을 가진다.',sources:[ref('ch5','23–27')],verify:{stdout:'1 4'}},
    {type:'single',prompt:'Lamp 클래스 안에 ~Lamp();를 선언했다. 클래스 밖 소멸자 정의의 올바른 시작은?',choices:['void Lamp::~Lamp() {','Lamp::~Lamp() {','~Lamp::Lamp(int n) {','Lamp::~Lamp(void x) {'],answer:1,explanation:'클래스 소속 Lamp:: 뒤에 ~Lamp()를 쓰며 반환형과 매개변수는 쓰지 않는다.',sources:[ref('ch5','49–50')]},
    {type:'single',prompt:'f에서 자동 지역 객체 x를 만든 뒤 return;으로 일찍 빠져나온다. 예외나 강제 종료가 없는 경우 옳은 것은?',choices:['x는 return으로 나갈 때 소멸한다.','return은 x의 소멸을 항상 생략한다.','x는 main의 끝까지 살아 있다.','x의 소멸자는 컴파일할 때 실행된다.'],answer:0,explanation:'자동 지역 객체는 정상적인 return으로 범위를 나갈 때도 소멸한다. 반드시 함수의 마지막 중괄호까지 실행해야만 소멸하는 것은 아니다.',sources:[ref('ch5','52–55')]},
    {type:'ox',prompt:'아래 클래스의 접근 권한을 O/X로 판단하시오. friend는 없다.',stars:3,code:'class Data {\npublic:\n    int a;\nprivate:\n    int b;\npublic:\n    int getB() { return b; }\nprotected:\n    int c;\n};',statements:['main은 Data 객체의 a에 직접 값을 대입할 수 있다.','두 번째 public: 때문에 앞의 b도 public으로 바뀐다.','getB는 b를 읽을 수 있다.','main은 c에 직접 접근할 수 있다.'],answer:['O','X','O','X'],explanation:'접근 지정자는 그 뒤부터 다음 지정자 전까지 적용된다. public을 다시 써도 앞서 private으로 선언한 b가 바뀌지 않으며, 자신의 멤버 함수 getB는 b에 접근할 수 있다.',sources:[ref('ch5','59–63')]},
    {type:'single',prompt:'if 뒤 세미콜론을 그대로 두었을 때 실행 결과는?',code:program('    int x = 2;\n    if (x == 5);\n    cout << "A" << x;'),choices:['아무 출력 없음','A5','A2','2'],answer:2,explanation:'if가 제어하는 문장은 세미콜론 하나인 빈 문장이다. 뒤의 cout은 조건과 관계없이 실행되어 A2를 출력한다.',sources:[ref('ch3','46–48')],verify:{stdout:'A2'}},
    {type:'output',prompt:'while이 끝난 뒤 i까지 포함하여 출력을 쓰시오.',code:program('    int i = 3;\n    while (i > 0) {\n        cout << i << " ";\n        i--;\n    }\n    cout << ":" << i;'),answers:['3 2 1 :0'],explanation:'본문에서는 3, 2, 1을 출력한다. 마지막 감소 후 i=0이 되어 반복을 끝내고 :0을 출력한다.',sources:[ref('ch3','53–55')],verify:{stdout:'3 2 1 :0'}},
    {type:'output',prompt:'같은 i, j를 건너뛰는 코드의 출력을 두 줄로 쓰시오.',code:program('    for (int i = 1; i <= 2; i++) {\n        for (int j = 1; j <= 3; j++) {\n            if (i == j) continue;\n            cout << i << j << " ";\n        }\n        cout << endl;\n    }'),answers:['12 13\n21 23'],explanation:'continue는 안쪽 반복의 현재 출력을 건너뛴다. 11과 22만 제외되고 각 바깥 반복 끝에서 줄을 바꾼다.',sources:[ref('ch3','57–59')],verify:{stdout:'12 13 \n21 23 \n'}},
    {type:'short',prompt:'포인터로 두 값을 교환하도록 빠진 대입문을 쓰시오. 포인터 a와 b 자체는 이동하지 않는다.',code:'#include <iostream>\nusing namespace std;\nvoid exchange(int* a, int* b) {\n    int temp = *a;\n    __________\n    *b = temp;\n}\nint main() {\n    int x = 2, y = 9;\n    exchange(&x, &y);\n    cout << x << " " << y;\n}',answers:['*a = *b;','(*a) = (*b);'],check:'tokens',expectedOutput:'9 2',explanation:'원래 *a는 temp에 보관했다. 먼저 *b 값을 *a로 옮기고 마지막에 temp를 *b로 옮긴다. a=b는 대상 값이 아니라 포인터만 바꾼다.',sources:[ref('ch4','55–59'),ref('practice4','8')],verify:{fill:'*a = *b;',stdout:'9 2'}},
    {type:'output',prompt:'같은 함수를 두 번 호출할 때 생성·소멸과 출력의 순서를 쓰시오.',code:trace,answers:['C1 C2 F D2 C2 F D2 M D1'],explanation:'visit를 호출할 때마다 새로운 x를 생성하고 F를 출력한 뒤 x를 소멸시킨다. 두 호출이 끝난 다음 M, 마지막에 main의 a 소멸 D1이 나온다.',sources:[ref('ch5','49–55')],verify:{stdout:'C1 C2 F D2 C2 F D2 M D1 '}},
    passwordPractice,
  ],
};
