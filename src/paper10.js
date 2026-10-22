import { ref, program } from './sources.js';
import { bmiPractice } from './paper-practice.js';
const mixedCode = `#include <iostream>
using namespace std;
class Value {
    int n;
public:
    Value(int v) : n(v) { cout << "C" << n << " "; }
    ~Value() { cout << "D" << n << " "; }
    void set(int v) { n = v; }
    int get() { return n; }
};
Value g(0);
int main() {
    Value a(2);
    {
        Value b(4);
        a.set(b.get() + 1);
    }
    cout << a.get() << " ";
}`;
export default {
  id:'10',title:'종합 실전 점검',subtitle:'조건식·실행 순서의 함정과 초기화 목록을 포함한 마지막 연습',
  questions:[
    {type:'single',prompt:'int main() { return 3; }에 대한 설명으로 옳은 것은?',choices:['main은 반환값이 반드시 0이어야 하므로 문법 오류이다.','화면에 3이 자동 출력된다.','main의 이름을 생략한 코드이다.','표준 형식의 main이며 종료 상태로 3을 반환한다.'],answer:3,explanation:'main의 반환형은 int이고 반환값이 반드시 0이어야 하는 것은 아니다. return 3;은 종료 상태 전달이며 화면 출력이 아니다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'아래 프로그램의 실제 출력은?',code:'#include <iostream>\nint main() {\n    std::cout << "A";\n    return 0;\n    std::cout << "B"; // return 이후\n}',choices:['A','AB','A0B','0'],answer:0,explanation:'return을 만나면 main이 종료되므로 뒤의 B 출력문은 실행하지 않는다. return의 0도 화면에 출력하지 않는다.',sources:[ref('ch2','4–5'),ref('ch4','20')],verify:{stdout:'A'}},
    {type:'short',prompt:'using 없이 n의 두 배와 줄바꿈을 출력하도록 빈칸을 쓰시오. 줄바꿈은 std::endl을 사용한다.',code:'#include <iostream>\nint main() {\n    int n = 6;\n    __________\n}',answers:['std::cout << n * 2 << std::endl;','std::cout << 2 * n << std::endl;','std::cout << (n * 2) << std::endl;'],check:'tokens',explanation:'cout과 endl에 std::를 붙이고 n에 2를 곱한 식을 출력한다. 계산 없이 12만 적는 것은 n의 두 배를 구하는 조건과 다르다.',sources:[ref('ch2','9, 17')],verify:{fill:'std::cout << n * 2 << std::endl;',stdout:'12\n'}},
    {type:'short',prompt:'출력문은 그대로 두고 using std::cout;도 유지한다. 필요한 이름 하나만 추가하도록 빈칸을 채우시오.',code:'#include <iostream>\nusing std::cout;\n__________\nint main() {\n    int n;\n    cin >> n;\n    cout << n;\n}',answers:['using std::cin;'],check:'tokens',explanation:'cin만 추가로 가져오면 된다. cout의 개별 using은 cin에 적용되지 않는다.',sources:[ref('ch2','17, 21')],verify:{fill:'using std::cin;',stdin:'9\n',stdout:'9'}},
    {type:'ox',prompt:'char s[6] = "cat"; 선언 후 s[1] = \'\\0\';을 실행했다. 각 설명을 O/X로 판단하시오.',statements:['sizeof(s)는 여전히 6이다.','strlen(s)는 1이다.','s[2]에 있던 \'t\'도 자동으로 지워져 널 문자가 된다.','첫 널 문자가 앞쪽에 생겼으므로 C 문자열로 읽는 내용은 "c"이다.'],answer:['O','O','X','O'],explanation:'배열 크기는 변하지 않는다. 첫 널 문자가 s[1]에 있으므로 strlen은 그 앞의 c 하나만 센다. s[2]의 t는 저장 공간에 남지만 문자열의 끝 뒤에 있다.',sources:[ref('ch2','28–29')]},
    {type:'short',prompt:'아래의 C 문자열 비교 함수 사용을 위해 빈칸에 헤더 포함문을 작성하시오.',code:'#include <iostream>\n__________\nint main() {\n    std::cout << (std::strcmp("same", "same") == 0);\n}',answers:['#include <cstring>'],check:'tokens',explanation:'strcmp는 <cstring>의 함수이다. 두 문자열이 같으면 0을 반환하므로 ==0 비교 결과는 참이고 기본 출력은 1이다.',sources:[ref('ch2','29, 41–43')],verify:{fill:'#include <cstring>',stdout:'1'}},
    {type:'multi',prompt:'C90과 표준 C++의 설명 중 옳은 것을 모두 고르시오.',choices:['C90은 블록의 선언을 실행문보다 앞에 둔다.','C++는 실행문 뒤에 지역 변수를 선언할 수 있다.','C++의 // 주석 안에 있는 코드는 실행된다.','C++에서 C 표준 입출력 함수를 사용하는 것이 금지된다.','C++ main의 끝에 도달하면 return 0;과 같은 효과가 있다.'],answer:[0,1,4],explanation:'C90의 블록 선언 위치 제한과 C++의 자유로운 선언을 구별한다. 주석은 실행되지 않고 C++에서도 C 입출력을 사용할 수 있다. C99 이후 C의 규칙과는 구분한다.',sources:[ref('ch2','4, 7, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'정수 나눗셈을 고려했을 때 cout << 7 / 2;의 출력은?',choices:['3.5','4','3','7/2'],answer:2,explanation:'두 피연산자가 int이므로 정수 나눗셈을 하고 소수 부분이 버려진 3이 출력된다.',sources:[ref('ch3','24–25')]},
    {type:'single',prompt:'클래스 선언을 헤더에 분리할 때 #ifndef, #define, #endif로 포함 가드를 두는 목적은?',choices:['객체를 프로그램 전체에서 하나만 생성하게 한다.','같은 번역 단위에서 헤더의 클래스 정의가 중복 포함되는 것을 막는다.','모든 멤버를 public으로 바꾼다.','클래스 밖 구현에서 ::를 생략하게 한다.'],answer:1,explanation:'포함 가드는 전처리 단계에서 동일 헤더 내용의 중복 처리를 막는다. 생성되는 객체 수나 접근 권한과는 관계없다.',sources:[ref('ch5','79–91')]},
    {type:'single',prompt:'수업의 객체지향 핵심 개념 네 가지를 모두 포함한 것은?',choices:['캡슐화 · 정보 은닉 · 상속 · 다형성','전처리 · 컴파일 · 링크 · 실행','정수 · 실수 · 문자 · 문자열','조건 · 반복 · 입력 · 출력'],answer:0,explanation:'강의 5장 13쪽에서 제시한 개념은 캡슐화, 정보 은닉, 상속, 다형성이다. 프로그램 개발 과정이나 기본 문법 목록과 구별한다.',sources:[ref('ch5','13')]},
    {type:'single',prompt:'아래 클래스에서 Number a(3);의 get()이 반환하는 값은?',code:'class Number {\n    int value = 10;\npublic:\n    Number(int n) : value(n) { }\n    int get() { return value; }\n};',choices:['10','0','초기화되지 않은 값','3'],answer:3,explanation:'명시한 멤버 초기화 목록 value(n)이 사용되어 3으로 초기화된다. 이 생성자에서는 선언부의 기본 멤버 초기값 10을 사용하지 않는다.',sources:[ref('ch5','32–37')]},
    {type:'single',prompt:'생성자와 소멸자에 대한 비교 중 옳은 것은?',choices:['둘 다 반환형 void를 반드시 쓴다.','둘 다 자유롭게 매개변수를 받을 수 있다.','생성자는 인자에 따라 여러 개를 정의할 수 있지만 일반 클래스의 소멸자는 매개변수로 중복 정의하지 않는다.','소멸자는 객체가 생성되기 전에 실행한다.'],answer:2,explanation:'생성자는 매개변수 목록을 달리할 수 있다. 소멸자는 반환형과 매개변수가 없고 수명 종료 시 호출된다.',sources:[ref('ch5','23–24, 49–50')]},
    {type:'single',prompt:'한 파일의 전역 객체 g, main의 자동 지역 객체 a, main이 호출한 f의 자동 지역 객체 b가 있다. f가 반환한 직후 살아 있는 객체는?',choices:['b만','g와 a','g와 b','a와 b'],answer:1,explanation:'f의 자동 지역 객체 b는 함수 반환 때 소멸한다. main의 a와 전역 g는 각각 자신의 수명이 끝나기 전이므로 살아 있다.',sources:[ref('ch5','52–55')]},
    {type:'ox',prompt:'아래 클래스에서 각 설명을 O/X로 판단하시오. friend는 사용하지 않는다.',stars:3,code:'class Sample {\n    int a;\npublic:\n    int b;\nprotected:\n    int c;\n};',statements:['a의 접근 지정은 private이다.','main에서 Sample 객체의 b에 값을 대입할 수 있다.','main에서 Sample 객체의 c에 직접 값을 대입할 수 있다.','Sample 자신의 멤버 함수는 a에 직접 접근할 수 없다.'],answer:['O','O','X','X'],explanation:'생략한 접근은 private이고 public: 이후 b는 public이다. protected: 이후 c는 main에서 직접 접근할 수 없다. 같은 클래스의 멤버 함수는 private인 a를 사용할 수 있다.',sources:[ref('ch5','59–63')]},
    {type:'single',prompt:'다음 두 조건식의 출력 결과로 옳은 것은?',code:program('    int x = 30;\n    cout << (10 < x < 20) << " " << (10 < x && x < 20);'),choices:['0 0','0 1','1 1','1 0'],answer:3,explanation:'10<x<20은 (10<x)<20으로 묶인다. 첫 비교의 true는 다음 비교에서 1이 되어 1<20은 참이다. 의도한 범위 검사는 &&로 두 비교를 연결해야 하며 x=30이면 거짓이다.',sources:[ref('ch3','30–32, 37–39')],verify:{stdout:'1 0'}},
    {type:'output',prompt:'break를 만난 순간의 sum과 i를 쓰시오.',code:program('    int sum = 0;\n    int i;\n    for (i = 1; i <= 10; i++) {\n        if (sum >= 6) break;\n        sum += i;\n    }\n    cout << sum << " " << i;'),answers:['6 4'],explanation:'i=1,2,3에서 합은 1,3,6이 된다. i=4로 들어온 직후 sum>=6이 참이라 break하며, 4를 더하거나 다음 증감식을 실행하지 않는다.',sources:[ref('ch3','52, 58')],verify:{stdout:'6 4'}},
    {type:'output',prompt:'switch의 break와 빠져나가지 않는 case를 구분하여 출력을 쓰시오.',code:program('    for (int i = 1; i <= 3; i++) {\n        switch (i) {\n        case 1: cout << "A"; break;\n        case 2: cout << "B";\n        default: cout << "C";\n        }\n        cout << i << " ";\n    }'),answers:['A1 BC2 C3'],explanation:'i=1의 break는 switch만 끝내므로 뒤에서 1도 출력한다. i=2는 B 뒤 break가 없어 default의 C까지 이어 출력한다. i=3은 default에서 시작한다.',sources:[ref('ch3','49, 52, 58')],verify:{stdout:'A1 BC2 C3 '}},
    {type:'short',prompt:'n!을 재귀 호출로 계산하도록 빈칸 한 줄을 쓰시오. 조건문은 수정하지 않는다.',code:'#include <iostream>\nusing namespace std;\nint fact(int n) {\n    if (n == 0) return 1;\n    __________\n}\nint main() {\n    cout << fact(4);\n}',answers:['return n * fact(n - 1);','return fact(n - 1) * n;'],check:'tokens',expectedOutput:'24',explanation:'0!에서 1을 반환하고, 나머지는 n*(n-1)!을 반환한다. n이 줄어들어 종료 조건으로 가야 하며 호출 결과를 return해야 한다.',sources:[ref('ch4','19–22'),ref('practice4','4–5')],verify:{fill:'return n * fact(n - 1);',stdout:'24'}},
    {type:'output',prompt:'멤버 값의 변경과 객체 소멸 시점을 함께 고려하여 전체 출력을 쓰시오.',code:mixedCode,answers:['C0 C2 C4 D4 5 D5 D0'],explanation:'전역 g, 지역 a, 안쪽 b의 순서로 생성된다. a.set으로 a의 n이 5가 된다. b 소멸의 D4 뒤 5를 출력하고, a의 소멸자는 변경된 값으로 D5를 출력한다. 마지막은 g의 D0이다.',sources:[ref('ch5','15–16, 23–27, 49–55')],verify:{stdout:'C0 C2 C4 D4 5 D5 D0 '}},
    bmiPractice,
  ],
};
