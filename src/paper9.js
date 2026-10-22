import { ref, program } from './sources.js';
import { spherePractice } from './paper-practice.js';
const delegateCode = `#include <iostream>
using namespace std;
class Number {
    int n;
public:
    Number() : Number(2) { cout << "D "; }
    Number(int v) : n(v) { cout << "C" << n << " "; }
    ~Number() { cout << "X" << n << " "; }
};
int main() {
    Number a;
    { Number b(4); }
    cout << "M ";
}`;
export default {
  id:'09',title:'생성자 선택과 실행 순서',subtitle:'초기화·위임·소멸 시점과 반복문 경계를 함께 연습',
  questions:[
    {type:'single',prompt:'다음 중 표준 C++에서 정상적인 매개변수 없는 main의 정의는?',choices:['int main() { }','void main(void) { }','main() { return 0; }','float main() { return 0; }'],answer:0,explanation:'int main()의 끝에 도달하면 0 반환 효과가 있으므로 빈 본문도 가능하다. 다른 선택지는 반환형이 잘못되었거나 생략되었다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'아래 프로그램의 출력은?',code:'#include <iostream>\nint main() {\n    /*\n    std::cout << "A";\n    std::cout << "B";\n    */\n    std::cout << "C"; // 설명\n}',choices:['ABC','AB','C','C0'],answer:2,explanation:'여러 줄 주석 안의 A, B 출력문은 실행되지 않는다. main 끝의 0 반환은 출력에 더해지지 않는다.',sources:[ref('ch2','4')],verify:{stdout:'C'}},
    {type:'short',prompt:'using을 추가하지 말고 a와 b에 입력을 순서대로 저장하도록 빈칸 한 줄을 쓰시오.',code:'#include <iostream>\nint main() {\n    int a, b;\n    __________\n    std::cout << a * b;\n}',answers:['std::cin >> a >> b;'],check:'tokens',explanation:'std::cin과 >>를 연속해서 사용한다. 먼저 a, 다음 b에 저장된다.',sources:[ref('ch2','17, 21–23')],verify:{fill:'std::cin >> a >> b;',stdin:'3 6\n',stdout:'18'}},
    {type:'short',prompt:'cout과 endl을 모두 접두어 없이 사용하도록 빈칸에 using 지시문 한 줄을 쓰시오. 개별 이름을 나열하지 않는다.',code:'#include <iostream>\n__________\nint main() {\n    cout << "Start" << endl;\n}',answers:['using namespace std;'],check:'tokens',explanation:'using namespace std;는 이 범위에서 std의 이름들을 접두어 없이 찾을 수 있게 한다. using std::cout;만으로 endl까지 가져오지는 않는다.',sources:[ref('ch2','17–19')],verify:{fill:'using namespace std;',stdout:'Start\n'}},
    {type:'ox',prompt:'널 문자와 문자열 입력을 O/X로 판단하시오.',statements:['char s[] = "A";의 배열 크기는 2이다.','strlen은 널 문자 자체도 길이에 포함한다.','char s[5] = "A";의 문자열 길이는 1이다.','string 객체에 cin >> s로 입력하면 공백을 포함하는지 여부는 입력 방식과 무관하다.'],answer:['O','X','O','X'],explanation:'문자 A와 널 문자가 2칸을 차지하지만 문자열 길이는 1이다. cin >>는 string을 대상으로 해도 공백에서 토큰 입력이 끝나므로 입력 방식이 중요하다.',sources:[ref('ch2','28–35')]},
    {type:'short',prompt:'C 문자열 함수 strlen, strcmp가 선언된 cstring을 포함하는 전처리 지시문을 쓰시오.',answers:['#include <cstring>'],check:'tokens',explanation:'<cstring>은 C 문자열 함수용 헤더이다. 함수 사용에 앞서 #include로 준비한다.',sources:[ref('ch2','29, 41–42')]},
    {type:'multi',prompt:'C90과 표준 C++에 대해 옳은 설명을 모두 고르시오. 컴파일러 확장은 제외한다.',choices:['C90에서 //는 표준 주석이다.','C++에서 /* ... */ 주석을 사용할 수 있다.','C++에서 실행문 뒤의 지역 변수 선언이 허용된다.','C++의 main 반환형 int를 생략해도 표준이다.','C++는 적절한 C 표준 라이브러리 헤더를 포함하여 printf를 사용할 수 있다.'],answer:[1,2,4],explanation:'C++는 두 주석과 실행문 사이의 선언, C 라이브러리 사용을 지원한다. C90의 주석 규칙과 main의 반환형 생략을 혼동하지 않는다.',sources:[ref('ch2','4, 7, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'기본 cout 출력에서 cout << 4 << 2;의 출력은?',choices:['6','42','4 2','오류'],answer:1,explanation:'<<로 두 값을 이어 출력할 뿐 덧셈이나 자동 공백 삽입을 하지 않는다. 따라서 42이다.',sources:[ref('ch2','8–9')]},
    {type:'single',prompt:'다음 중 클래스 선언부와 구현부에 대한 옳은 설명은?',choices:['함수 본문을 클래스 안에 작성하면 무조건 컴파일 오류이다.','클래스 선언 뒤에는 세미콜론을 적지 않는다.','클래스 밖 구현에서 :: 대신 .을 사용한다.','클래스 안에 멤버 함수 본문을 정의하는 것도 가능하다.'],answer:3,explanation:'멤버 함수는 클래스 안에서도 정의할 수 있다. 클래스 밖에서 구현한다면 클래스이름::함수이름을 쓰며, 클래스 정의 끝에는 세미콜론이 필요하다.',sources:[ref('ch5','11–12, 74')]},
    {type:'single',prompt:'기존 클래스의 특성을 바탕으로 새 클래스를 정의하는 관계를 가리키는 개념은?',choices:['상속','주석','형 변환','컴파일'],answer:0,explanation:'상속은 수업의 객체지향 핵심 개념 중 하나이다. 나머지는 프로그램 표기나 처리 과정의 다른 개념이다.',sources:[ref('ch5','13'),ref('ch1','25')]},
    {type:'single',prompt:'아래 두 생성자가 있다. Circle a;를 실행할 때 옳은 설명은?',code:'Circle() : Circle(2) { cout << "D"; }\nCircle(int r) { radius = r; cout << "T"; }',choices:['a와 이름 없는 객체 두 개를 만든다.','D만 출력하고 radius는 초기화하지 않는다.','같은 a를 대상 생성자로 초기화한 뒤 위임 생성자 본문을 실행하여 TD를 출력한다.','DT를 출력한다.'],answer:2,explanation:'위임 생성자는 같은 객체의 초기화를 다른 생성자에 맡긴다. 대상 Circle(int)의 본문 T가 먼저, 위임한 Circle()의 본문 D가 다음이다.',sources:[ref('ch5','29–36')]},
    {type:'single',prompt:'소멸자 ~Sphere()에 cout 문장이 없다. 객체가 소멸하면 화면에 무엇이 반드시 출력되는가?',choices:['"소멸"이라는 문구','아무 문구도 자동 출력된다고 보장할 수 없다.','클래스 이름 Sphere','0'],answer:1,explanation:'소멸자 호출과 화면 출력은 다르다. 출력문을 작성하지 않았다면 소멸 시 특정 글자가 자동으로 출력되는 것은 아니다.',sources:[ref('ch5','49–51')]},
    {type:'single',prompt:'f()에서 자동 지역 객체 하나를 생성하고 main에서 f(); f();를 실행한다. 생성자와 소멸자는 각 몇 번 호출되는가?',choices:['각 1번','생성자 2번, 소멸자 1번','생성자 1번, 소멸자 2번','각 2번'],answer:3,explanation:'각 함수 호출마다 새 지역 객체를 만들고 해당 호출이 끝날 때 소멸한다. 예외 없이 두 호출을 모두 마치는 상황에서 각각 두 번이다.',sources:[ref('ch5','52–55')]},
    {type:'multi',prompt:'접근 지정자와 멤버에 대한 옳은 설명을 모두 고르시오. friend 없는 예제 기준이다.',stars:3,choices:['private 멤버의 값이 0 이하가 되는 것은 언어가 자동으로 금지한다.','main에서 public 멤버에 직접 접근할 수 있다.','class에서 지정자를 생략하면 private이다.','protected 멤버는 어느 외부 함수에서나 직접 접근할 수 있다.','같은 클래스의 멤버 함수는 자신의 private 멤버를 수정할 수 있다.'],answer:[1,2,4],explanation:'private은 접근 경로를 제한하며 값의 범위를 자동 검사하지 않는다. 값 검사는 함수의 조건문 등으로 별도 구현한다. main의 직접 접근은 public에 허용된다.',sources:[ref('ch5','59–67')]},
    {type:'single',prompt:'단락 평가를 고려한 다음 코드의 출력은?',code:program('    int n = 0;\n    if (false && (++n > 0)) cout << "A";\n    cout << n;'),choices:['0','1','A1','A0'],answer:0,explanation:'&&는 왼쪽이 거짓이면 오른쪽을 평가하지 않는다. ++n은 실행되지 않아 n은 0이고 A도 출력하지 않는다.',sources:[ref('ch3','19, 30–32')],verify:{stdout:'0'}},
    {type:'output',prompt:'정수 나눗셈과 do-while을 고려하여 출력을 쓰시오.',code:program('    int n = 17, count = 0;\n    do {\n        n /= 2;\n        count++;\n    } while (n > 1);\n    cout << n << " " << count;'),answers:['1 4'],explanation:'n은 정수 나눗셈으로 8, 4, 2, 1이 된다. 네 번 실행한 뒤 조건이 거짓이라 1과 4를 출력한다.',sources:[ref('ch3','24–25, 28, 53, 55')],verify:{stdout:'1 4'}},
    {type:'output',prompt:'다음 코드의 출력을 세 줄로 쓰시오.',code:program('    for (int i = 3; i >= 1; i--) {\n        for (int j = 1; j <= i; j++) cout << i;\n        cout << endl;\n    }'),answers:['333\n22\n1'],explanation:'출력하는 값은 j가 아니라 i이다. i=3이면 3을 세 번, i=2이면 2를 두 번, i=1이면 1을 한 번 출력한다.',sources:[ref('ch3','52, 57')],verify:{stdout:'333\n22\n1\n'}},
    {type:'short',prompt:'클래스 밖 생성자 정의에서 초기화 목록으로 radius를 r로 초기화하도록 빈칸을 작성하시오. 중괄호는 이미 있다.',code:'#include <iostream>\nusing namespace std;\nclass Circle {\n    int radius;\npublic:\n    Circle(int r);\n    int get() { return radius; }\n};\n__________ { }\nint main() {\n    Circle c(3);\n    cout << c.get();\n}',answers:['Circle::Circle(int r) : radius(r)','Circle::Circle(int r) : radius{r}'],check:'tokens',expectedOutput:'3',explanation:'생성자에는 반환형을 적지 않는다. 클래스 밖의 소속 Circle::를 붙이고, : radius(r)로 멤버를 초기화한다.',sources:[ref('ch5','23–27, 32–34')],verify:{fill:'Circle::Circle(int r) : radius(r)',stdout:'3'}},
    {type:'output',prompt:'위임 생성자와 안쪽 블록의 소멸 시점을 고려하여 출력 순서를 쓰시오.',code:delegateCode,answers:['C2 D C4 X4 M X2'],explanation:'a는 Number(2)로 위임해 C2 뒤 D를 출력한다. b는 C4를 출력하고 안쪽 블록 끝에서 X4로 소멸한다. M 뒤 main의 a가 X2로 소멸한다.',sources:[ref('ch5','29–36, 49–55')],verify:{stdout:'C2 D C4 X4 M X2 '}},
    spherePractice,
  ],
};
