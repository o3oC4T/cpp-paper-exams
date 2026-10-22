import { ref, program } from './sources.js';
import { minMaxPractice } from './paper-practice-more.js';
const trace = `#include <iostream>
using namespace std;
void change(int n, int* p) {
    n += 2;
    *p += n;
    cout << n << ":" << *p << " ";
}
int main() {
    int a = 3, b = 10;
    change(a, &b);
    cout << a << " " << b;
}`;
export default {
  id:'12',title:'배열과 함수의 연결',subtitle:'배열의 인덱스·값 전달·주소 전달을 구별하는 연습',
  questions:[
    {type:'single',prompt:'어떤 컴파일러에서 void main()을 허용했다. 표준 C++ 여부에 대한 판단으로 옳은 것은?',choices:['컴파일됐으므로 모든 표준 C++ 환경에서 반드시 허용된다.','void main이 표준이고 int main은 확장이다.','컴파일러의 확장 허용과 별개로 표준 main의 반환형은 int이다.','main은 반환형을 적으면 안 된다.'],answer:2,explanation:'확장 문법을 허용하는 컴파일러가 있어도 언어 표준의 규칙과 구별한다. 표준 main의 반환형은 int이다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'주석 안에 있는 return을 고려한 출력은?',code:'#include <iostream>\nint main() {\n    std::cout << "L";\n    /* return 0; */\n    std::cout << "R";\n}',choices:['LR','L','LR0','아무 출력 없음'],answer:0,explanation:'주석 속 return은 실행되지 않는다. L 뒤 R을 출력하고 main 끝에 도달한다.',sources:[ref('ch2','4–5')],verify:{stdout:'LR'}},
    {type:'short',prompt:'using을 추가하지 않고 두 실수를 x, y에 차례로 입력받는 한 줄을 쓰시오.',code:'#include <iostream>\nint main() {\n    double x, y;\n    __________\n    std::cout << x / y;\n}',answers:['std::cin >> x >> y;'],check:'tokens',explanation:'입력 스트림 cin 앞에 std::를 붙이고 >>의 오른쪽에 저장할 변수를 차례로 적는다. x, y는 double이므로 9와 2를 입력하면 4.5이다.',sources:[ref('ch2','17, 21–23')],verify:{fill:'std::cin >> x >> y;',stdin:'9 2\n',stdout:'4.5'}},
    {type:'short',prompt:'std의 이름을 한꺼번에 가져오지 말고, 출력문에서 필요한 이름 하나만 가져오시오.',code:'#include <iostream>\n__________\nint main() { cout << 7 << "\\n"; }',answers:['using std::cout;'],check:'tokens',explanation:'이 코드는 endl을 사용하지 않는다. 필요한 이름 cout만 using std::cout;으로 가져오면 된다.',sources:[ref('ch2','17–19')],verify:{fill:'using std::cout;',stdout:'7\n'}},
    {type:'ox',prompt:'문자 배열을 수정한 뒤의 상태를 O/X로 판단하시오.',code:'char s[] = "abc";\ns[0] = \'z\';',statements:["배열 크기가 3으로 줄어든다.","문자열 내용은 \"zbc\"가 된다.","s[0]은 문자열 전체의 주소를 저장하는 원소이다.","문자 하나를 바꾸었으므로 문자열 끝의 널 문자는 남는다."],answer:["X","O","X","O"],explanation:'s[0]은 char 원소 하나이다. a를 z로 바꿔도 나머지 b, c, 널 문자는 그대로이고 배열 크기는 4이다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'std::strcmp의 결과가 0인지 확인하는 코드에서 빠진 헤더 포함문을 쓰시오.',code:'#include <iostream>\n__________\nint main() { std::cout << (std::strcmp("ab", "ac") == 0); }',answers:['#include <cstring>'],check:'tokens',explanation:'strcmp를 사용하려면 <cstring>을 포함한다. 다른 두 문자열의 비교 결과는 0이 아니므로 ==0은 거짓이고 0이 출력된다.',sources:[ref('ch2','29, 41–42')],verify:{fill:'#include <cstring>',stdout:'0'}},
    {type:'multi',prompt:'C90에서 쓰던 코드를 C++로 옮기는 상황에 대한 올바른 설명을 모두 고르시오.',choices:['C++에서는 printf를 쓰는 모든 코드를 cout으로 바꾸어야 한다.','/* 설명 */ 형태의 주석은 두 언어에서 사용할 수 있다.','C90의 선언 위치 규칙을 C99 이후 C까지 동일하다고 단정하면 안 된다.','C++에서는 클래스의 멤버 함수를 정의할 수 있다.','C90의 class와 C++의 class는 완전히 같은 키워드이다.'],answer:[1,2,3],explanation:'C++에서도 적절한 헤더와 함께 C 표준 입출력을 사용할 수 있다. 두 언어의 공통 문법과 차이를 구별하고, C의 표준 버전도 명시해야 한다.',sources:[ref('ch2','24–25'),ref('ch3','4–5'),ref('ch5','9–13')],standardNote:true},
    {type:'single',prompt:'int n;에 cin >> n;으로 입력할 때 아래 입력의 맨 앞 공백에 대한 설명으로 옳은 것은?',code:'입력:     42',choices:['공백을 n의 값으로 저장한다.','일반적인 기본 설정에서는 앞의 공백을 건너뛰고 42를 읽는다.','앞에 공백이 있으면 항상 0을 저장한다.','42를 읽기 위해 반드시 getline만 사용해야 한다.'],answer:1,explanation:'기본 설정의 정수 입력 >>는 앞의 공백을 건너뛰고 수를 읽는다. 공백을 포함한 문자열 한 줄을 읽는 경우와 구별한다.',sources:[ref('ch2','21–23, 30–32')]},
    {type:'single',prompt:'선언이 int read();인 Sensor의 멤버 함수를 클래스 밖에서 구현했다. 오류 원인은?',code:'double Sensor::read() { return 1.5; }',choices:['::를 사용했기 때문이다.','클래스 밖에서는 멤버 함수를 구현할 수 없기 때문이다.','함수 이름을 read로 적었기 때문이다.','선언의 int와 정의의 double 반환형이 일치하지 않기 때문이다.'],answer:3,explanation:'함수 정의는 클래스 안의 선언과 반환형 및 매개변수 목록이 맞아야 한다. Sensor::는 소속을 나타내는 올바른 표기이다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'Car라는 클래스로 car1과 car2를 만들었다. 클래스와 객체의 관계로 옳은 것은?',choices:['Car는 타입이고 car1, car2는 그 타입의 서로 다른 객체이다.','car1은 타입이고 Car는 지역 변수이다.','Car라는 클래스는 객체를 하나만 만들 수 있다.','car1의 비정적 멤버 값을 바꾸면 car2도 반드시 바뀐다.'],answer:0,explanation:'클래스는 객체의 구조와 동작을 정의하는 타입이다. 같은 타입으로 만든 여러 객체는 일반 비정적 멤버를 각각 가진다.',sources:[ref('ch5','9–16')]},
    {type:'single',prompt:'생성자를 직접 작성한 아래 클래스에서 Box a;가 안 되는 이유는?',code:'class Box {\npublic:\n    Box(int n) { }\n};',choices:['생성자 본문이 비어 있기 때문이다.','생성자 이름이 클래스와 같기 때문이다.','직접 선언한 생성자가 있으므로 인자 없는 생성자가 자동으로 추가되지 않기 때문이다.','생성자를 public에 두었기 때문이다.'],answer:2,explanation:'Box(int)를 선언한 뒤 Box()가 자동 추가된다고 가정하면 안 된다. Box a;를 허용하려면 이 예제에서는 인자 없는 생성자를 별도로 제공해야 한다.',sources:[ref('ch5','38–40')]},
    {type:'single',prompt:'T 객체의 생성자는 "C", 소멸자는 "D"를 출력한다. T a; 한 개를 만들고 main이 정상 종료할 때 출력은?',choices:['DC','CD','CC','C만 출력'],answer:1,explanation:'객체를 만들 때 생성자, 자동 지역 객체의 범위를 나갈 때 소멸자가 호출된다. 출력문이 있다면 C 뒤 D가 나온다.',sources:[ref('ch5','23–24, 49–55')]},
    {type:'single',prompt:'함수 안에서 x를 선언한 뒤 그 안쪽 블록에 y를 선언했다. y의 블록을 나왔고 아직 함수 안이다. 살아 있는 객체는?',choices:['y만','둘 다 소멸','x와 y 모두','x만'],answer:3,explanation:'y는 안쪽 범위 종료 때 소멸한다. 바깥 함수 범위의 x는 함수에서 나갈 때까지 살아 있다.',sources:[ref('ch5','52–55')]},
    {type:'multi',prompt:'아래 struct에서 접근 권한상 main이 객체 v로 사용할 수 있는 문장을 모두 고르시오. friend는 없다.',stars:3,code:'struct Value {\n    int x;\nprivate:\n    int y;\npublic:\n    void setY(int n) { y = n; }\n    int getY() { return y; }\nprotected:\n    int z;\n};',choices:['v.x = 1;','v.y = 2;','v.setY(2);','v.getY();','v.z = 3;'],answer:[0,2,3],explanation:'struct의 기본 접근은 public이라 x에 직접 접근할 수 있다. 명시한 private y와 protected z는 main의 직접 접근을 막지만 public 함수는 호출할 수 있다.',sources:[ref('ch5','59–63, 76–77')]},
    {type:'single',prompt:'중괄호를 추가하지 않았을 때 else가 연결되는 if와 출력으로 옳은 것은?',code:program('    int x = 1, y = 0;\n    if (x > 0)\n        if (y > 0) cout << "A";\n        else cout << "B";'),choices:['안쪽 if에 연결되어 B','바깥 if에 연결되어 아무 출력 없음','안쪽 if에 연결되어 A','두 if 모두에 연결되어 AB'],answer:0,explanation:'else는 아직 else가 없는 가장 가까운 if에 연결된다. x>0은 참이고 y>0은 거짓이므로 B를 출력한다.',sources:[ref('ch3','46–48')],verify:{stdout:'B'}},
    {type:'output',prompt:'배열에서 음수를 건너뛴 뒤의 합을 쓰시오.',code:program('    int a[5] = {2, -4, 3, -1, 4};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) {\n        if (a[i] < 0) continue;\n        sum += a[i];\n    }\n    cout << sum;'),answers:['9'],explanation:'-4와 -1에서 누적을 건너뛰고 2, 3, 4만 더한다. 인덱스가 아니라 배열 원소의 부호를 검사한다.',sources:[ref('ch3','52, 59, 68–69')],verify:{stdout:'9'}},
    {type:'output',prompt:'각 원소를 수정한 뒤 출력하는 두 행을 쓰시오.',code:program('    int a[2][2] = {{1, 2}, {3, 4}};\n    for (int r = 0; r < 2; r++) {\n        for (int c = 0; c < 2; c++) {\n            a[r][c] += r + c;\n            cout << a[r][c] << " ";\n        }\n        cout << endl;\n    }'),answers:['1 3\n4 6'],explanation:'0행에서는 각각 0과 1, 1행에서는 각각 1과 2를 더한다. 배열의 행과 열 인덱스는 0부터 시작한다.',sources:[ref('ch3','57, 71–75')],verify:{stdout:'1 3 \n4 6 \n'}},
    {type:'short',prompt:'음수 n의 부호를 바꾼 값을 반환하도록 빈칸을 채우시오. n은 -100부터 100 사이이다.',code:'#include <iostream>\nusing namespace std;\nint magnitude(int n) {\n    if (n < 0) {\n        __________\n    }\n    return n;\n}\nint main() { cout << magnitude(-6) << " " << magnitude(4); }',answers:['return -n;','return 0 - n;'],check:'tokens',expectedOutput:'6 4',explanation:'음수인 분기에서 -n을 반환하면 양수 크기가 된다. 반환하지 않고 n만 계산하면 호출자에게 결과를 전달하지 못한다.',sources:[ref('ch4','14, 19–22')],verify:{fill:'return -n;',stdout:'6 4'}},
    {type:'output',prompt:'값 매개변수 n과 포인터 p가 바꾸는 대상을 구별하여 출력을 쓰시오.',code:trace,answers:['5:15 3 15'],explanation:'n은 a의 복사본이므로 5가 되어도 a는 3이다. p는 b를 가리키므로 b에 5를 더해 15가 된다. 함수 안의 5:15 뒤 main이 3 15를 출력한다.',sources:[ref('ch4','17–20, 55–59')],verify:{stdout:'5:15 3 15'}},
    minMaxPractice,
  ],
};
