import { ref, program } from './sources.js';
import { additionPractice } from './paper-practice.js';
const valuesCode = `#include <iostream>
using namespace std;
void byValue(int n) { n *= 2; cout << n << " "; }
void byAddress(int* p) { *p += 3; }
int main() {
    int a = 4, b = 9;
    int* p = &a;
    byValue(a);
    byAddress(p);
    p = &b;
    *p = a;
    cout << a << " " << b;
}`;
export default {
  id:'07',title:'값과 주소를 구별하기',subtitle:'입력·이름 공간·포인터 전달과 지역 변수의 차이를 점검',
  questions:[
    {type:'single',prompt:'아래 main의 반환형만 표준에 맞게 고치려면 double 대신 무엇을 써야 하는가?',code:'double main() { return 0; }',choices:['char','void','int','반환형 없이 main만 적음'],answer:2,explanation:'표준 main의 반환형은 int이다. 반환하는 식이 0이라고 해서 다른 반환형이 허용되는 것은 아니다.',sources:[ref('ch2','4–5')]},
    {type:'single',prompt:'주석 기호와 문자열을 구분했을 때 아래 프로그램의 출력은?',code:'#include <iostream>\nint main() {\n    std::cout << "/*A*/";\n    // std::cout << "B";\n    std::cout << "C";\n}',choices:['C','AC','ABC','/*A*/C'],answer:3,explanation:'따옴표 안의 /*A*/는 문자열 데이터라 그대로 출력된다. // 뒤의 B 출력문만 주석이다.',sources:[ref('ch2','4, 8–9')],verify:{stdout:'/*A*/C'}},
    {type:'short',prompt:'using 없이 name이라는 string 객체에 "Park"를 저장하도록 빈칸을 채우시오.',code:'#include <iostream>\n#include <string>\nint main() {\n    __________\n    std::cout << name;\n}',answers:['std::string name = "Park";','std::string name("Park");','std::string name{"Park"};'],check:'tokens',explanation:'string도 std 이름 공간에 있다. 헤더 <string>을 포함하는 것과 이름에 std::를 붙이는 것은 별개이다.',sources:[ref('ch2','17, 34–35')],verify:{fill:'std::string name = "Park";',stdout:'Park'}},
    {type:'short',prompt:'using은 f 안에만 있다. using을 추가하지 말고 main에서 2를 출력하도록 빈칸을 작성하시오.',code:'#include <iostream>\nvoid f() {\n    using namespace std;\n    cout << 1;\n}\nint main() {\n    f();\n    __________\n}',answers:['std::cout << 2;'],check:'tokens',explanation:'f의 블록 안에 둔 using 지시문은 main에 적용되지 않는다. 따라서 main에서는 std::cout을 사용한다.',sources:[ref('ch2','13, 17–19')],verify:{fill:'std::cout << 2;',stdout:'12'}},
    {type:'ox',prompt:'문자열 입력과 헤더에 대한 설명을 O/X로 판단하시오.',statements:['string s에 cin >> s를 쓰면 공백을 포함한 한 줄 전체가 항상 들어간다.','char 배열에는 cin.getline(배열, 크기)로 한 줄을 읽을 수 있다.','string 객체에는 getline(cin, 객체)로 한 줄을 읽을 수 있다.','<cstring>과 <string>은 이름만 다르고 완전히 같은 헤더이다.'],answer:['X','O','O','X'],explanation:'>>는 공백에서 토큰 입력을 끊는다. 문자 배열은 cin.getline, string은 getline(cin, s)를 쓰며 두 문자열 방식의 헤더도 구별한다.',sources:[ref('ch2','30–35, 41–43')]},
    {type:'short',prompt:'std::strcmp를 사용하려 한다. string 클래스용 헤더가 아닌 C 문자열 함수용 전처리 지시문 한 줄을 쓰시오.',answers:['#include <cstring>'],check:'tokens',explanation:'strcmp를 비롯한 C 문자열 함수는 <cstring>으로 준비한다.',sources:[ref('ch2','29, 41–43')]},
    {type:'multi',prompt:'C90과 표준 C++를 비교한 설명 중 옳은 것을 모두 고르시오. 컴파일러 확장은 제외한다.',choices:['C++는 /* ... */와 //를 모두 사용할 수 있다.','C90은 같은 블록의 실행문 뒤에 새 변수를 선언하는 것이 표준이다.','C++의 int main은 끝에 도달하면 0을 반환한다.','C90에서 main의 끝에 도달하면 반드시 0을 반환한다.','C99 이후에는 C에도 // 주석이 허용되므로 C90 규칙과 구분해야 한다.'],answer:[0,2,4],explanation:'C90과 C99 이후의 C를 구분한다. 두 주석과 main 끝의 0 반환은 C++에서 허용되며, C90의 선언 위치 제한과 반환 규칙은 다르다.',sources:[ref('ch2','4, 24–25'),ref('ch3','4–5')],standardNote:true},
    {type:'single',prompt:'입력한 정수를 n에 저장하는 올바른 문장은? cin을 사용할 이름 공간과 헤더는 준비되어 있다.',choices:['cin << n;','cin >> n;','cout >> n;','cin(n);'],answer:1,explanation:'입력 스트림에서 값을 꺼내 변수에 저장할 때 cin >> n;을 쓴다. cout << n;은 출력이다.',sources:[ref('ch2','21–23')]},
    {type:'single',prompt:'클래스 밖에서 정의한 int Counter::get()의 Counter::는 무엇을 나타내는가?',choices:['get이 Counter 클래스의 멤버임을 나타낸다.','Counter라는 객체 하나를 새로 생성한다.','get의 반환형이 Counter라는 뜻이다.','get을 지금 한 번 호출한다.'],answer:0,explanation:'::는 이 함수의 클래스 소속을 나타낸다. 객체 생성, 반환형 지정, 함수 호출과 구별한다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'데이터와 그 데이터를 다루는 함수를 하나의 클래스에 함께 묶는 개념은?',choices:['링크','형 변환','캡슐화','전처리'],answer:2,explanation:'클래스 안에 상태와 동작을 묶는 것은 캡슐화이다. 외부의 직접 접근을 제한하는 정보 은닉과 연관되지만 질문의 핵심은 함께 묶는 것이다.',sources:[ref('ch5','9, 13')]},
    {type:'single',prompt:'생성자를 한 개도 직접 선언하지 않은, int 멤버 하나만 있는 일반 클래스의 자동 지역 객체를 Box b;로 만들었다. 옳은 설명은?',choices:['int 멤버가 무조건 0이 된다.','어떤 객체도 생성되지 않는다.','기본 생성자는 생기지만 소멸자는 생기지 않는다.','기본 생성자가 제공되지만 int 멤버가 원하는 값으로 초기화된다고 보장할 수 없다.'],answer:3,explanation:'컴파일러의 기본 생성자 제공과 기본형 멤버의 값 초기화는 구별해야 한다. 이 조건에서 main의 Box b;에 있는 int 멤버를 0으로 가정하면 안 된다.',sources:[ref('ch5','38–40')]},
    {type:'single',prompt:'수업의 일반 클래스에서 소멸자를 직접 작성하지 않은 경우에 대한 설명으로 옳은 것은?',choices:['컴파일러가 소멸자를 제공할 수 있으며 지역 객체는 범위 종료 시 소멸한다.','객체는 영원히 소멸하지 않는다.','매번 main에서 ~클래스()를 직접 호출해야 한다.','생성자도 함께 금지된다.'],answer:0,explanation:'소멸자를 직접 적지 않아도 컴파일러가 제공한다. 자동 지역 객체의 수명 종료와 수동 소멸자 호출은 별개의 문제이다.',sources:[ref('ch5','49–55')]},
    {type:'single',prompt:'호출하지 않은 함수 f의 본문에 자동 지역 객체 x가 선언되어 있다. 프로그램이 정상 종료될 때 옳은 설명은?',choices:['x는 전역 객체처럼 main 전에 생성된다.','선언문을 실행하지 않았으므로 x의 생성·소멸 모두 일어나지 않는다.','소멸자만 호출된다.','main의 모든 지역 객체보다 x가 먼저 생성된다.'],answer:1,explanation:'자동 지역 객체는 그 선언문을 실제 실행할 때 생성된다. 함수 정의를 적어놓은 것만으로 생성하지 않는다.',sources:[ref('ch5','52–55')]},
    {type:'multi',prompt:'접근 제어에 대한 옳은 설명을 모두 고르시오. friend는 사용하지 않는다.',stars:3,choices:['main은 public 멤버 함수를 호출할 수 있다.','public 함수가 있으면 같은 클래스의 모든 private 변수도 main에 공개된다.','자기 클래스의 멤버 함수는 private 멤버에 접근할 수 있다.','public 상속에서 파생 클래스 내부는 자신의 기반 부분의 protected 멤버에 접근할 수 있다.','class의 기본 접근은 public이다.'],answer:[0,2,3],explanation:'public 함수로 내부 데이터를 사용하는 것과 private 변수에 직접 접근하는 것은 다르다. protected는 수업의 기본적인 파생 클래스 내부 접근을 허용하며 class의 기본은 private이다.',sources:[ref('ch5','59–63')]},
    {type:'single',prompt:'아래 조건식의 실행 결과와 n의 값으로 옳은 것은?',code:program('    int n = -2;\n    if (n) cout << "T";\n    else cout << "F";\n    cout << " " << n;'),choices:['F 0','T 1','F -2','T -2'],answer:3,explanation:'조건에서 0이 아닌 값은 참이다. 음수 -2도 참이고, 조건으로 읽었다고 n 자체가 1로 바뀌지는 않는다.',sources:[ref('ch3','19, 30–32')],verify:{stdout:'T -2'}},
    {type:'output',prompt:'while과 continue의 순서를 따라 출력 결과를 쓰시오.',code:program('    int i = 0;\n    while (i < 5) {\n        i++;\n        if (i == 3) continue;\n        cout << i << " ";\n    }'),answers:['1 2 4 5'],explanation:'i를 증가시킨 뒤 3이면 출력만 건너뛴다. while 조건은 다음 반복 전에 검사하므로 i=5일 때의 본문도 실행된다.',sources:[ref('ch3','54, 59')],verify:{stdout:'1 2 4 5 '}},
    {type:'output',prompt:'이중 반복문에서 break가 끝내는 범위를 고려하여 두 줄의 출력을 쓰시오.',code:program('    for (int i = 1; i <= 2; i++) {\n        for (int j = 1; j <= 3; j++) {\n            if (j == 2) break;\n            cout << i << j << " ";\n        }\n        cout << endl;\n    }'),answers:['11\n21'],explanation:'j가 2가 되면 안쪽 for만 끝난다. 각 행에서는 j=1일 때만 i와 j를 연속 출력하므로 11, 21이 된다.',sources:[ref('ch3','57–58')],verify:{stdout:'11 \n21 \n'}},
    {type:'short',prompt:'배열 a의 두 번째 원소를 반환하도록 포인터 p를 사용하여 빈칸을 작성하시오.',code:'#include <iostream>\nusing namespace std;\nint second(int* p) {\n    __________\n}\nint main() {\n    int a[3] = {4, 8, 12};\n    cout << second(a);\n}',answers:['return p[1];','return *(p + 1);','return *(1 + p);'],check:'tokens',expectedOutput:'8',explanation:'p는 a[0]을 가리킨다. 두 번째 원소는 인덱스 1이므로 p[1] 또는 *(p+1)로 읽는다.',sources:[ref('ch4','66–75')],verify:{fill:'return p[1];',stdout:'8'}},
    {type:'output',prompt:'값 전달과 주소 전달 뒤의 최종 출력 결과를 쓰시오.',code:valuesCode,answers:['8 7 7'],explanation:'byValue는 복사된 n을 8로 만들어 출력하지만 a는 4이다. byAddress가 a를 7로 바꾸고, p가 b로 옮겨진 뒤 *p=a가 b에 7을 저장한다.',sources:[ref('ch4','17–20, 41–42, 58–59')],verify:{stdout:'8 7 7'}},
    additionPractice,
  ],
};
