import { ref, program } from './sources.js';
import { sortingPractice } from './paper-practice.js';

const traceCode = `#include <iostream>
using namespace std;
class Mark {
    int n;
public:
    Mark(int v) : n(v) { cout << "+" << n << " "; }
    ~Mark() { cout << "-" << n << " "; }
};
Mark g(9);
int main() {
    Mark a(1);
    { Mark b(2); Mark c(3); }
    cout << "M ";
}`;
export default {
  id:'06', title:'문법을 코드로 확인하기', subtitle:'기본 규칙을 다시 적용하고 선택 정렬까지 손으로 완성',
  questions:[
    {type:'single',prompt:'빈칸을 채워 표준 C++의 매개변수 없는 main을 정의하려 한다. 알맞은 것은?',code:'__________ main() {\n    return 0;\n}',choices:['void','int','double','생략한다'],answer:1,explanation:'표준 main의 반환형은 int이다. return 0;의 생략 허용과 반환형 생략은 다른 문제이다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'아래 프로그램의 출력과 종료에 대한 설명으로 옳은 것은?',code:'#include <iostream>\nint main() {\n    std::cout << "X";\n    /* std::cout << "Y"; */\n    std::cout << "Z";\n}',choices:['XYZ를 출력한다.','XZ0을 출력한다.','XZ를 출력하고 main 끝에서 0을 반환한다.','return이 없으므로 컴파일 오류이다.'],answer:2,explanation:'Y 출력은 주석이고, 실제 출력은 XZ이다. main의 끝에서 반환되는 0은 화면 출력에 포함되지 않는다.',sources:[ref('ch2','4–6')],verify:{stdout:'XZ'}},
    {type:'short',prompt:'using을 추가하지 않고 a와 b의 합을 출력한 뒤 endl로 줄을 바꾸도록 빈칸 한 줄을 쓰시오.',code:'#include <iostream>\nint main() {\n    int a = 4, b = 7;\n    __________\n}',answers:['std::cout << a + b << std::endl;','std::cout << (a + b) << std::endl;'],check:'tokens',explanation:'cout과 endl 모두 std 소속이다. 합 a+b는 <<보다 먼저 계산되며 괄호를 적어도 된다.',sources:[ref('ch2','9, 17')],verify:{fill:'std::cout << a + b << std::endl;',stdout:'11\n'}},
    {type:'short',prompt:'using std::cin;은 유지한다. 새로운 using 없이 입력값 n을 출력하도록 빈칸을 채우시오.',code:'#include <iostream>\nusing std::cin;\nint main() {\n    int n;\n    cin >> n;\n    __________\n}',answers:['std::cout << n;'],check:'tokens',explanation:'cin을 가져와도 cout까지 가져오는 것은 아니다. cout에는 std::가 필요하다.',sources:[ref('ch2','17, 21')],verify:{fill:'std::cout << n;',stdin:'8\n',stdout:'8'}},
    {type:'ox',prompt:'문자 배열과 길이에 대한 설명을 O/X로 판단하시오.',statements:['char s[6] = "cat";에서 sizeof(s)는 6이다.','같은 s에 대해 strlen(s)는 4이다.','"cat"을 문자 배열에 저장할 때 끝의 널 문자를 위한 공간이 필요하다.','문자 \'0\'과 널 문자 \'\\0\'은 같은 값이다.'],answer:['O','X','O','X'],explanation:'배열 용량은 6, 널 문자 앞의 문자열 길이는 3이다. 널 문자도 저장 공간은 차지하지만 strlen의 길이에는 포함되지 않는다. 숫자 모양의 문자 0은 널 문자와 다르다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'std::strlen을 사용하는 데 필요한 표준 C++ 헤더 포함문을 작성하시오. 헤더 이름은 cstring이다.',answers:['#include <cstring>'],check:'tokens',explanation:'전처리 지시문 #include <cstring>을 쓴다. 문자열 클래스용 <string>과 구별한다.',sources:[ref('ch2','29, 41–42')]},
    {type:'multi',prompt:'C90과 표준 C++의 차이 중 옳은 것을 모두 고르시오. 컴파일러 확장은 제외한다.',choices:['C90은 /* ... */ 주석을 지원한다.','C++는 같은 블록에서 실행문 뒤에도 변수를 선언할 수 있다.','C90에서도 //가 표준 주석이다.','C++에서는 적절한 헤더와 함께 printf를 사용할 수 있다.','C++에서는 int main의 int를 생략할 수 있다.'],answer:[0,1,3],explanation:'C90은 블록의 선언을 실행문보다 앞에 두며 //는 표준 주석이 아니다. C++는 선언 위치가 더 자유롭고 C 입출력 함수도 사용한다. C99 이후의 C와 혼동하지 않는다.',sources:[ref('ch2','4, 7, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'아래 코드에 3 8을 입력했을 때 출력은?',code:program('    int a, b;\n    cin >> a >> b;\n    cout << b - a;'),choices:['-5','38','11','5'],answer:3,explanation:'cin은 먼저 a에 3, 다음 b에 8을 저장한다. 출력식은 b-a이므로 5이다.',sources:[ref('ch2','21–23')],verify:{stdin:'3 8\n',stdout:'5'}},
    {type:'single',prompt:'class Score 안에 int get();이 선언되어 있다. 클래스 밖에서 이 멤버 함수를 구현하는 올바른 시작 부분은?',choices:['int Score::get() {','int get.Score() {','Score.get int() {','void Score::get() {'],answer:0,explanation:'선언의 반환형 int를 유지하고 Score::로 소속을 명시한다. 함수 몸체는 그 뒤 중괄호 안에 작성한다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'멤버 변수를 private으로 두고 public 함수를 통해서 사용하게 하는 설계와 가장 직접 관련된 개념은?',choices:['함수 호출의 반복','정보 은닉','전처리','전역 변수 공유'],answer:1,explanation:'내부 상태의 직접 접근을 제한하고 외부 인터페이스로 사용하게 하는 것은 정보 은닉에 해당한다. 수업의 객체지향 개념에는 캡슐화·정보 은닉·상속·다형성이 있다.',sources:[ref('ch5','13, 59–63')]},
    {type:'single',prompt:'Box()와 Box(int n)가 public으로 정의되어 있다. Box a; Box b(6);에 대한 설명으로 옳은 것은?',choices:['두 객체 모두 Box()만 호출한다.','각 객체가 두 생성자를 모두 순서대로 호출한다.','a는 Box(), b는 Box(int)를 호출한다.','b는 생성자를 호출하지 않는다.'],answer:2,explanation:'객체를 만들 때 전달한 인자 목록에 맞는 생성자를 선택한다. 이 예제는 위임 생성자가 아니므로 모든 생성자를 차례로 실행하지 않는다.',sources:[ref('ch5','23–27, 38')]},
    {type:'single',prompt:'일반 클래스 Box의 소멸자 선언으로 올바른 것은?',choices:['void ~Box();','~Box(int n);','Box~();','~Box();'],answer:3,explanation:'소멸자는 ~클래스이름()이며 반환형과 매개변수를 쓰지 않는다.',sources:[ref('ch5','49–50')]},
    {type:'single',prompt:'한 소스 파일에서 전역 객체 g1, g2를 이 순서로 선언했고 main 안에서 자동 지역 객체 a를 만든다. 정상 종료 시 소멸 순서는?',choices:['a → g2 → g1','g1 → g2 → a','g2 → a → g1','a → g1 → g2'],answer:0,explanation:'main을 나가며 a가 먼저 소멸하고 정상 종료 과정에서 전역 객체가 생성의 역순인 g2, g1 순으로 소멸한다.',sources:[ref('ch5','52–55')]},
    {type:'ox',prompt:'접근 지정자에 관한 설명을 O/X로 판단하시오. friend 없는 수업의 기본 예제 기준이다.',stars:3,statements:['class의 기본 멤버 접근은 private이다.','C++ struct의 기본 멤버 접근도 private이다.','main에서 protected 멤버에 직접 접근할 수 있다.','public 멤버 함수는 자기 클래스의 private 멤버를 사용할 수 있다.'],answer:['O','X','X','O'],explanation:'class의 기본은 private, struct의 기본은 public이다. 외부 main은 protected에 직접 접근하지 못하지만 클래스 자신의 멤버 함수는 private에 접근할 수 있다.',sources:[ref('ch5','59–63, 76–77')]},
    {type:'single',prompt:'다음 코드의 동작을 바르게 설명한 것은?',code:program('    int i;\n    int sum = 0;\n    for (i = 1; i <= 4; i++);\n    { sum += i; }\n    cout << sum;'),choices:['i가 항상 0이기 때문이다.','for의 본문은 빈 문장이고, 뒤 블록은 i가 5일 때 한 번 실행되기 때문이다.','sum += i는 대입이 아니기 때문이다.','중괄호가 있으므로 블록을 네 번 실행하기 때문이다.'],answer:1,explanation:'for 뒤 세미콜론이 빈 본문이다. 반복 종료 시 i는 5이고, 뒤의 독립된 블록이 한 번 실행되어 sum은 5가 된다.',sources:[ref('ch3','28, 52')],verify:{stdout:'5'}},
    {type:'output',prompt:'continue를 고려하여 최종 출력값을 쓰시오.',code:program('    int sum = 0;\n    for (int i = 1; i <= 6; i++) {\n        if (i % 2 != 0) continue;\n        sum += i;\n    }\n    cout << sum;'),answers:['12'],explanation:'홀수에서는 continue로 더하기를 건너뛴다. 짝수 2+4+6만 누적하여 12이다.',sources:[ref('ch3','24–25, 52, 59')],verify:{stdout:'12'}},
    {type:'output',prompt:'출력을 줄바꿈까지 구분하여 쓰시오.',code:program('    for (int i = 1; i <= 3; i++) {\n        for (int j = 1; j <= i; j++) cout << j;\n        cout << endl;\n    }'),answers:['1\n12\n123'],explanation:'각 행의 안쪽 반복은 j=1에서 다시 시작하고 현재 i까지 출력한다. 따라서 행마다 1, 12, 123이 나온다.',sources:[ref('ch3','52, 57')],verify:{stdout:'1\n12\n123\n'}},
    {type:'short',prompt:'p가 가리키는 정수에 3을 더하도록 빈칸을 채우시오. x의 최종 출력은 8이다.',code:'#include <iostream>\nusing namespace std;\nvoid increase(int* p) {\n    __________\n}\nint main() {\n    int x = 5;\n    increase(&x);\n    cout << x;\n}',answers:['*p += 3;','*p = *p + 3;','(*p) += 3;'],check:'tokens',expectedOutput:'8',explanation:'포인터의 주소 자체가 아니라 가리키는 대상의 값을 바꾸므로 *p에 대입한다. p += 3은 포인터 이동이다.',sources:[ref('ch4','41–42, 55–58')],verify:{fill:'*p += 3;',stdout:'8'}},
    {type:'output',prompt:'전역 객체와 안쪽 블록을 고려하여 출력 순서를 쓰시오.',code:traceCode,answers:['+9 +1 +2 +3 -3 -2 M -1 -9'],explanation:'g가 먼저 생성된다. 안쪽 블록에서는 b, c 순으로 만들고 c, b 순으로 소멸한다. M 뒤 a, 마지막 전역 g가 소멸한다.',sources:[ref('ch5','49–55')],verify:{stdout:'+9 +1 +2 +3 -3 -2 M -1 -9 '}},
    sortingPractice,
  ],
};
