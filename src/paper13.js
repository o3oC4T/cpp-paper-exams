import { ref, program } from './sources.js';
import { realMaxPractice } from './paper-practice-more.js';
const trace = `#include <iostream>
using namespace std;
class Gate {
    int n;
public:
    Gate(int v) : n(v) { cout << "+" << n << " "; }
    ~Gate() { cout << "-" << n << " "; }
};
void f(bool early) {
    Gate b(2);
    if (early) return;
    Gate c(3);
}
int main() {
    Gate a(1);
    f(true);
    f(false);
    cout << "M ";
}`;
export default {
  id:'13',title:'반환값과 수명 추적',subtitle:'함수의 반환·반복의 경계·객체가 사라지는 순간을 확인',
  questions:[
    {type:'single',prompt:'다음 중 main의 반환형을 표준에 맞게 지정한 정의는?',choices:['bool main() { return false; }','int main() { return false; }','void main() { }','char main() { return 0; }'],answer:1,explanation:'main 앞의 반환형은 int여야 한다. 두 번째 정의는 false가 int의 0으로 변환되어 반환된다. 반환하는 식의 타입과 함수 선언의 반환형을 구별한다.',sources:[ref('ch2','4–5'),ref('ch3','19')]},
    {type:'single',prompt:'따옴표와 주석을 구별한 아래 출력은?',code:'#include <iostream>\nint main() {\n    std::cout << "//"; // 첫 출력\n    std::cout << "ok";\n}',choices:['ok','//','//ok','출력 없음'],answer:2,explanation:'문자열 리터럴 안의 //는 출력할 문자이다. 닫는 따옴표 뒤의 //부터 줄 끝까지가 주석이다.',sources:[ref('ch2','4, 8–9')],verify:{stdout:'//ok'}},
    {type:'short',prompt:'using 없이 value를 2.0으로 나눈 실수 결과를 출력하도록 한 줄을 쓰시오.',code:'#include <iostream>\nint main() {\n    int value = 9;\n    __________\n}',answers:['std::cout << value / 2.0;','std::cout << (value / 2.0);'],check:'tokens',explanation:'cout에 std::를 붙인다. 나누는 값이 2.0이므로 실수 나눗셈을 하여 4.5가 나온다.',sources:[ref('ch2','17'),ref('ch3','24–25')],verify:{fill:'std::cout << value / 2.0;',stdout:'4.5'}},
    {type:'short',prompt:'using std::cin;만 유지하고, main에서 입력값을 출력하는 빈칸을 채우시오. 줄바꿈 문자를 사용한다.',code:'#include <iostream>\nusing std::cin;\nint main() {\n    int count;\n    cin >> count;\n    __________\n}',answers:['std::cout << count << "\\n";','std::cout << count << \'\\n\';'],check:'tokens',explanation:'cin의 using 선언은 cout을 가져오지 않는다. cout에 std::를 붙이며 문자열 또는 문자 형태의 줄바꿈을 사용할 수 있다.',sources:[ref('ch2','9, 17')],verify:{fill:'std::cout << count << "\\n";',stdin:'12\n',stdout:'12\n'}},
    {type:'ox',prompt:'string 객체의 입력과 수정에 관한 설명을 O/X로 판단하시오.',statements:["string s에 getline(cin, s)를 사용하면 중간 공백도 읽을 수 있다.","cin >> s는 기본 설정에서 한 단어를 읽는 데 사용할 수 있다.","string은 char 배열과 마찬가지로 s = \"new\" 대입을 할 수 없다.","<cstring>만 포함하면 항상 std::string의 선언이 보장된다."],answer:["O","O","X","X"],explanation:'string은 문자열 대입을 지원하며 헤더는 <string>이다. getline과 >>는 공백을 처리하는 방식이 다르다.',sources:[ref('ch2','30–35, 41–43')]},
    {type:'short',prompt:'널 문자 앞까지만 길이를 재는 다음 코드의 빈칸에 헤더 포함문을 쓰시오.',code:'#include <iostream>\n__________\nint main() {\n    char s[5] = {\'a\', \'b\', \'\\0\', \'c\', \'\\0\'};\n    std::cout << std::strlen(s);\n}',answers:['#include <cstring>'],check:'tokens',explanation:'strlen은 <cstring>의 함수이며 첫 널 문자까지 센다. 뒤쪽 c는 배열에 남아 있어도 이 문자열의 길이는 2이다.',sources:[ref('ch2','28–29, 41–42')],verify:{fill:'#include <cstring>',stdout:'2'}},
    {type:'multi',prompt:'C90과 표준 C++의 for문·선언·주석에 관한 옳은 설명을 모두 고르시오.',choices:['C++의 for (int i = 0; i < 3; i++)는 허용된다.','C90에서도 위의 for 초기절 변수 선언이 표준이다.','C90에서 for 앞에 int i;를 선언해 사용하는 것은 가능하다.','C++에서 /* ... */ 대신 반드시 //만 써야 한다.','C99 이후의 C에서는 for 초기절 선언 규칙이 C90과 달라질 수 있다.'],answer:[0,2,4],explanation:'C90은 for 초기절에서 새 변수를 선언하는 문법을 지원하지 않는다. C++와 C99 이후에는 허용된다. C++는 두 종류의 주석을 모두 지원한다.',sources:[ref('ch3','4–5, 52'),ref('ch2','4, 24–25')],standardNote:true},
    {type:'single',prompt:'double result = 7 / 2; cout << result;의 기본 출력은?',choices:['3.5','3','4','7/2'],answer:1,explanation:'오른쪽 7/2가 먼저 정수 나눗셈으로 3이 되고, 그 결과를 double에 저장한다. 저장할 변수의 타입이 오른쪽 연산을 소급해서 바꾸지는 않는다.',sources:[ref('ch3','24–25')]},
    {type:'single',prompt:'int get();라는 멤버 함수 원형과 int Cell::get() { return value; }의 역할을 바르게 짝지은 것은?',choices:['둘 다 함수 호출','앞은 객체 생성, 뒤는 함수 호출','앞은 선언, 뒤는 클래스 밖 정의','앞은 정의, 뒤는 주석'],answer:2,explanation:'원형은 함수의 이름·반환형·매개변수 목록을 선언한다. 본문이 있는 Cell::get 정의는 실제 동작을 구현한다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'수업의 다형성 개념을 가장 잘 설명하는 것은?',choices:['항상 모든 객체가 같은 멤버 값을 가져야 한다.','다른 객체는 같은 이름의 동작을 절대 가질 수 없다.','클래스의 모든 멤버를 public으로 만드는 것이다.','같은 형태의 요청이나 인터페이스가 대상에 따라 다른 동작으로 나타날 수 있다.'],answer:3,explanation:'다형성은 수업에서 제시한 객체지향 개념 중 하나이다. 여기서는 개념의 의미를 구분하며 뒤 단원의 구체적인 구현 문법을 요구하지 않는다.',sources:[ref('ch5','13')]},
    {type:'single',prompt:'아래 코드에서 main의 Bottle b;가 허용되지 않는 직접적인 이유는?',code:'class Bottle {\n    Bottle() { }\n};\nint main() { Bottle b; }',choices:['생성자가 기본 private 영역에 있어 main에서 접근할 수 없다.','생성자에는 반드시 int 반환형이 필요하다.','생성자 본문이 비어 있으면 객체를 만들 수 없다.','인자 없는 생성자는 C++에 없다.'],answer:0,explanation:'생성자도 접근 제어를 받는다. class에서 접근 지정자를 생략하면 private이므로 이 생성자를 main에서 사용할 수 없다.',sources:[ref('ch5','23–27, 59–63'),ref('book','107–111, 125–128')]},
    {type:'single',prompt:'~Book() { cout << "bye"; }가 public 소멸자이다. 이 코드에 대한 옳은 설명은?',choices:['bye는 생성할 때만 출력한다.','반환형을 쓰지 않은 것이 올바르며 소멸할 때 bye를 출력한다.','소멸자 이름을 Book으로 바꿔야 한다.','소멸자 본문에서는 출력문을 쓸 수 없다.'],answer:1,explanation:'소멸자는 반환형을 적지 않고 ~클래스이름으로 선언한다. 본문의 출력문은 그 소멸자가 실행될 때 수행한다.',sources:[ref('ch5','49–51')]},
    {type:'single',prompt:'같은 블록에서 자동 지역 객체 first, second, third를 이 순서로 생성했다. 정상적으로 블록을 나갈 때 소멸 순서는?',choices:['first → second → third','second → first → third','third → second → first','이름의 알파벳 순서'],answer:2,explanation:'같은 범위에 있는 자동 지역 객체는 생성된 순서의 역순으로 소멸한다. 변수 이름의 정렬 순서와는 관계없다.',sources:[ref('ch5','52–55')]},
    {type:'ox',prompt:'접근 제어의 의미를 O/X로 판단하시오. friend는 없다.',stars:3,statements:["protected는 모든 일반 외부 함수에 접근을 허용한다.","private 변수도 자신의 클래스 멤버 함수에서 수정할 수 있다.","public 상속의 파생 클래스 멤버는 자신의 기반 부분의 protected 멤버에 접근할 수 있다.","public:을 쓰면 그 뒤의 멤버 함수가 클래스 밖의 일반 함수로 바뀐다."],answer:["X","O","O","X"],explanation:'접근 지정자는 멤버의 접근 권한을 정한다. public 함수도 여전히 멤버 함수이고 protected는 임의의 외부 함수에 공개한다는 뜻이 아니다.',sources:[ref('ch5','59–63')]},
    {type:'single',prompt:'||의 단락 평가를 고려한 출력은?',code:program('    int x = 1, y = 0;\n    if (x || ++y) cout << "Y";\n    cout << y;'),choices:['Y1','0','1','Y0'],answer:3,explanation:'왼쪽 x가 참이므로 ||의 오른쪽 ++y는 실행하지 않는다. 조건은 참이라 Y를 출력하고 y는 0이다.',sources:[ref('ch3','19, 30–32')],verify:{stdout:'Y0'}},
    {type:'output',prompt:'조건이 처음부터 만족하지 않아도 실행되는 부분을 고려하여 출력을 쓰시오.',code:program('    int i = 0;\n    do {\n        i++;\n        cout << i;\n    } while (i < 0);'),answers:['1'],explanation:'do-while은 본문을 한 번 실행한 뒤 조건을 검사한다. i=1을 출력하고 1<0이 거짓이므로 종료한다.',sources:[ref('ch3','53–55')],verify:{stdout:'1'}},
    {type:'output',prompt:'안쪽 반복이 감소하는 다음 코드의 출력을 세 줄로 쓰시오.',code:program('    for (int i = 1; i <= 3; i++) {\n        for (int j = i; j >= 1; j--) cout << j;\n        cout << endl;\n    }'),answers:['1\n21\n321'],explanation:'각 행마다 j는 현재 i에서 1까지 감소한다. 바깥 i의 값만 반복 출력하는 코드와 구별한다.',sources:[ref('ch3','52, 57')],verify:{stdout:'1\n21\n321\n'}},
    {type:'short',prompt:'매개변수 index가 지정한 배열 원소를 반환하도록 빈칸을 채우시오. 인덱스는 유효하다.',code:'#include <iostream>\nusing namespace std;\nint readAt(int a[], int index) {\n    __________\n}\nint main() {\n    int values[3] = {6, 2, 9};\n    cout << readAt(values, 2);\n}',answers:['return a[index];','return *(a + index);'],check:'tokens',expectedOutput:'9',explanation:'함수가 받은 배열의 index 위치를 읽어 반환한다. 인덱스 2는 세 번째 원소이므로 이 호출의 결과는 9이다.',sources:[ref('ch4','24–34, 66–75')],verify:{fill:'return a[index];',stdout:'9'}},
    {type:'output',prompt:'return으로 일찍 나가는 호출과 끝까지 실행하는 호출의 전체 출력 순서를 쓰시오.',code:trace,answers:['+1 +2 -2 +2 +3 -3 -2 M -1'],explanation:'첫 f에서는 b 생성 후 바로 return하므로 b만 소멸한다. 두 번째 f에서는 b, c를 만들고 c, b 순서로 소멸한다. M 뒤 main의 a가 소멸한다.',sources:[ref('ch5','49–55')],verify:{stdout:'+1 +2 -2 +2 +3 -3 -2 M -1 '}},
    realMaxPractice,
  ],
};
