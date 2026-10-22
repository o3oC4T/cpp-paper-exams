import { ref, program } from './sources.js';
import { studentPractice } from './paper-practice.js';
const objectsCode = `#include <iostream>
using namespace std;
class Counter {
    int value;
public:
    Counter(int n) : value(n) { }
    void add(int n) { value += n; }
    int get() { return value; }
};
int main() {
    Counter a(1), b(5);
    cout << a.get() << " " << b.get() << endl;
    a.add(2);
    cout << a.get() << " " << b.get();
}`;
export default {
  id:'08',title:'클래스 선언부터 직접 작성',subtitle:'객체별 멤버 값, 접근 권한과 Student 클래스 손코딩',
  questions:[
    {type:'single',prompt:'int main(void)의 void가 나타내는 뜻은?',choices:['main이 값을 반환하지 않는다는 뜻이다.','main의 반환형을 void로 바꾼다.','main이 실행되지 않는다는 뜻이다.','매개변수가 없다는 뜻이며 반환형은 여전히 int이다.'],answer:3,explanation:'괄호 안의 void는 매개변수가 없다는 뜻이다. 함수 이름 앞의 int가 반환형이다.',sources:[ref('ch2','4–5'),ref('ch4','13')]},
    {type:'single',prompt:'main의 return 0; 생략에 대한 설명으로 옳은 것은?',choices:['모든 int 함수의 끝에서 자동으로 0을 반환한다.','int main의 끝에 도달하면 return 0;과 같은 효과가 있다.','return 0;을 생략하면 문자열 "0"을 출력한다.','return이 없으면 주석 문장만 실행한다.'],answer:1,explanation:'끝에 도달했을 때 0을 반환하는 특별한 규칙은 main에 적용한다. 일반적인 int 함수 전체에 적용하지 않는다.',sources:[ref('ch2','4–5'),ref('ch4','14, 20')]},
    {type:'short',prompt:'using 없이 name에 공백을 포함한 한 줄을 입력받도록 빈칸을 작성하시오. std::getline을 명시하여 사용한다.',code:'#include <iostream>\n#include <string>\nint main() {\n    std::string name;\n    __________\n    std::cout << name;\n}',answers:['std::getline(std::cin, name);'],check:'tokens',explanation:'string 객체의 한 줄 입력은 getline(cin, name) 형태이다. 이 문제는 using을 쓰지 않으므로 함수와 입력 객체 모두 std::를 명시한다.',sources:[ref('ch2','17, 34–35')],verify:{fill:'std::getline(std::cin, name);',stdin:'Kim Min\n',stdout:'Kim Min'}},
    {type:'short',prompt:'using std::endl;만 있다. using을 추가하지 말고 "OK"와 줄바꿈을 출력하도록 빈칸 한 줄을 쓰시오.',code:'#include <iostream>\nusing std::endl;\nint main() {\n    __________\n}',answers:['std::cout << "OK" << endl;','std::cout << "OK" << std::endl;'],check:'tokens',explanation:'endl을 가져왔어도 cout은 가져오지 않았다. cout에 std::를 붙이며, 이미 가져온 endl에도 std::를 명시해도 된다.',sources:[ref('ch2','9, 17')],verify:{fill:'std::cout << "OK" << endl;',stdout:'OK\n'}},
    {type:'ox',prompt:'다음 C 문자열과 string의 대입 설명을 O/X로 판단하시오.',statements:['char a[4] = "cat";은 널 문자를 포함할 공간이 충분하다.','char a[4] = "cat"; 이후 a = "dog";로 배열 전체를 대입할 수 있다.','std::string s = "cat"; 이후 s = "dog";는 가능하다.','char a[3] = {\'c\', \'a\', \'t\'};는 널 종료가 보장되는 C 문자열이다.'],answer:['O','X','O','X'],explanation:'문자 배열 전체에 =로 새 문자열을 대입할 수 없다. string 객체는 대입을 지원한다. 문자 세 개만 넣은 배열은 끝의 널 문자가 없으므로 널 종료 문자열이 아니다.',sources:[ref('ch2','28–35')]},
    {type:'short',prompt:'다음 코드에서 std::strlen을 사용할 헤더 포함문을 빈칸에 쓰시오.',code:'#include <iostream>\n__________\nint main() {\n    char word[] = "test";\n    std::cout << std::strlen(word);\n}',answers:['#include <cstring>'],check:'tokens',explanation:'strlen은 <cstring>의 C 문자열 함수이며 널 문자 앞의 4개 문자를 센다.',sources:[ref('ch2','29, 41–42')],verify:{fill:'#include <cstring>',stdout:'4'}},
    {type:'multi',prompt:'C90 기준과 표준 C++를 비교할 때 옳은 것을 모두 고르시오.',choices:['C++는 C90보다 지역 변수 선언 위치가 자유롭다.','C++는 C의 printf와 scanf를 전혀 사용할 수 없다.','C90은 /* ... */ 주석을 사용할 수 있다.','C++는 클래스와 멤버 함수를 사용할 수 있다.','C90에서 class 키워드는 C++와 같은 클래스 정의 문법이다.'],answer:[0,2,3],explanation:'C++는 클래스 문법을 지원하고 C 입출력도 사용할 수 있다. C90에는 C++의 class 문법이 없으며 블록 안에서 선언을 실행문 앞에 둔다.',sources:[ref('ch2','7, 24–25'),ref('ch3','4–5'),ref('ch5','9–13')],standardNote:true},
    {type:'single',prompt:'#include <iostream>에 대한 설명 중 옳은 것은?',choices:['main 안에서 호출해야 하는 함수이다.','이 문장만 있으면 std::를 항상 생략한다.','입출력 관련 선언을 포함하도록 하는 전처리 지시문이다.','실행할 때마다 사용자에게 파일 이름을 입력받는다.'],answer:2,explanation:'#include는 전처리 지시문이다. 헤더 포함과 이름 공간 지정은 다른 역할이다.',sources:[ref('ch2','6, 18, 39–42')]},
    {type:'single',prompt:'다음 클래스에서 클래스 선언부에 적힌 멤버 함수 원형은 어느 것인가?',code:'class Circle {\n    int radius;\npublic:\n    double getArea();\n};',choices:['class Circle','int radius;','public:','double getArea();'],answer:3,explanation:'함수의 반환형·이름·매개변수 목록을 적고 세미콜론으로 끝낸 double getArea();가 멤버 함수 원형이다. radius는 멤버 변수이다.',sources:[ref('ch5','11–12')]},
    {type:'single',prompt:'Circle a, b;로 만든 두 객체의 일반적인 비정적 멤버 radius에 대한 설명으로 옳은 것은?',choices:['같은 클래스로 만들었으므로 radius 저장 공간도 하나이다.','두 객체는 각자 radius 값을 가지며 한쪽 변경이 자동으로 다른 쪽에 복사되지 않는다.','멤버 변수는 클래스 정의만으로 모든 객체가 공유한다.','객체에는 값이 없고 함수만 존재한다.'],answer:1,explanation:'이 수업의 일반 비정적 멤버는 객체마다 별도로 존재한다. 클래스는 타입이며 객체는 그 타입으로 만든 실체이다.',sources:[ref('ch5','9–16')]},
    {type:'single',prompt:'다음 클래스의 Num a;에 대한 설명으로 옳은 것은?',code:'class Num {\n    int value;\npublic:\n    Num() : value(3) { }\n};',choices:['value(3)는 생성자 본문 전에 멤버를 3으로 초기화한다.','value(3)는 main의 지역 변수 value를 선언한다.','Num()은 void를 적지 않아 컴파일 오류이다.','생성자 본문이 비었으므로 value는 반드시 미초기화이다.'],answer:0,explanation:': value(3)는 멤버 초기화 목록이다. 생성자의 중괄호 안이 비어도 멤버 초기화는 수행된다.',sources:[ref('ch5','23, 32–35')]},
    {type:'single',prompt:'수업의 일반 클래스 소멸자에서 허용되지 않는 것은?',choices:['이름 앞에 ~를 붙이기','소멸자 본문에 cout 작성하기','매개변수 목록을 달리해 소멸자를 여러 개 정의하기','범위를 나갈 때 자동으로 호출되기'],answer:2,explanation:'소멸자는 매개변수와 반환형이 없고 수업의 일반 클래스에서 매개변수에 따른 중복 정의를 하지 않는다.',sources:[ref('ch5','49–50')]},
    {type:'single',prompt:'main의 자동 지역 객체 a가 살아 있는 동안 안쪽 블록에서 b를 생성했다. 안쪽 블록만 끝났을 때 옳은 것은?',choices:['a와 b가 동시에 소멸한다.','a만 소멸한다.','어떤 객체도 소멸하지 않는다.','b는 소멸하지만 a는 자신의 범위가 끝날 때까지 살아 있다.'],answer:3,explanation:'자동 지역 객체의 수명은 선언된 범위에 연결된다. 안쪽 블록 종료는 바깥 main의 객체까지 소멸시키지 않는다.',sources:[ref('ch5','52–57')]},
    {type:'ox',prompt:'세 접근 지정자와 기본값을 O/X로 판단하시오. friend는 사용하지 않는다.',stars:3,statements:['protected는 C++의 올바른 접근 지정자이다.','protective는 protected와 같은 접근 지정자이다.','class에서 지정자를 생략한 멤버는 main이 직접 사용할 수 있다.','C++ struct에서도 private:을 명시할 수 있다.'],answer:['O','X','X','O'],explanation:'정확한 키워드는 protected이다. class의 기본은 private이고, struct의 기본은 public이지만 명시적으로 private을 사용할 수 있다.',sources:[ref('ch5','59–63, 76–77')]},
    {type:'single',prompt:'아래 if 안의 =를 그대로 두었을 때 출력은?',code:program('    int n = 0;\n    if (n = 3) cout << "A";\n    else cout << "B";\n    cout << n;'),choices:['B0','A3','A0','B3'],answer:1,explanation:'n=3은 비교가 아니라 대입이다. n에 3을 저장하고 그 값 3은 조건에서 참이므로 A3을 출력한다. 대입 조건은 학습을 위해 의도적으로 사용했다.',sources:[ref('ch3','19, 23, 26–27')],verify:{stdout:'A3'}},
    {type:'output',prompt:'반복 종료 후 sum과 i의 값을 쓰시오.',code:program('    int sum = 0;\n    int i;\n    for (i = 5; i >= 1; i -= 2) sum += i;\n    cout << sum << " " << i;'),answers:['9 -1'],explanation:'본문에서 더하는 i는 5, 3, 1이다. 마지막 증감식 뒤 i=-1이 되어 조건이 거짓이므로 합 9와 -1을 출력한다.',sources:[ref('ch3','28, 52')],verify:{stdout:'9 -1'}},
    {type:'output',prompt:'각 행의 합을 구하는 코드의 출력을 쓰시오.',code:program('    int a[2][3] = {{1, 3, 5}, {2, 4, 6}};\n    for (int r = 0; r < 2; r++) {\n        int sum = 0;\n        for (int c = 0; c < 3; c++) sum += a[r][c];\n        cout << sum << " ";\n    }'),answers:['9 12'],explanation:'sum은 각 행을 시작할 때 0으로 초기화된다. 0행은 1+3+5=9, 1행은 2+4+6=12이다.',sources:[ref('ch3','57, 71–75'),ref('ch4','26–33')],verify:{stdout:'9 12 '}},
    {type:'short',prompt:'클래스 밖의 멤버 함수 정의가 되도록 빈칸에 반환형·소속·함수 이름을 포함한 한 줄을 쓰시오. {는 이미 있다.',code:'#include <iostream>\nusing namespace std;\nclass Circle {\npublic:\n    int radius;\n    double getArea();\n};\n__________ {\n    return 3.14 * radius * radius;\n}\nint main() {\n    Circle a;\n    a.radius = 2;\n    cout << a.getArea();\n}',answers:['double Circle::getArea()'],check:'tokens',expectedOutput:'12.56',explanation:'선언과 같은 double 반환형을 쓰고 Circle::getArea()로 소속을 명시한다. 클래스 이름이나 객체 이름을 점으로 연결하지 않는다.',sources:[ref('ch5','11–12, 15–16')],verify:{fill:'double Circle::getArea()',stdout:'12.56'}},
    {type:'output',prompt:'두 객체의 상태가 어떻게 바뀌는지 추적하여 출력을 쓰시오.',code:objectsCode,answers:['1 5\n3 5'],explanation:'처음 a와 b의 값은 각각 1, 5이다. a.add(2)는 a의 멤버만 3으로 바꾸고 b는 5를 유지한다.',sources:[ref('ch5','9–16, 23–27')],verify:{stdout:'1 5\n3 5'}},
    studentPractice,
  ],
};
