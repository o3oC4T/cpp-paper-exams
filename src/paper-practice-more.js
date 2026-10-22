import { ref } from './sources.js';

const passwordSolution = `#include <iostream>
#include <string>
using namespace std;
int main() {
    string first, second;
    cout << "새 암호를 입력하세요>>";
    getline(cin, first);
    cout << "새 암호를 다시 한번 입력하세요>>";
    getline(cin, second);
    if (first == second) cout << "같습니다" << endl;
    else cout << "다릅니다" << endl;
}`;
const minMaxSolution = `#include <iostream>
using namespace std;
int main() {
    int a[10] = {0};
    cout << "정수 10개를 차례대로 입력하시오 >> ";
    for (int i = 0; i < 10; i++) cin >> a[i];
    cout << "배열 : ";
    for (int i = 0; i < 10; i++) cout << a[i] << " ";
    cout << endl;
    int maxIndex = 0, minIndex = 0;
    for (int i = 1; i < 10; i++) {
        if (a[i] > a[maxIndex]) maxIndex = i;
        if (a[i] < a[minIndex]) minIndex = i;
    }
    cout << "최대값 : 인덱스=" << maxIndex << ", 값=" << a[maxIndex] << endl;
    cout << "최소값 : 인덱스=" << minIndex << ", 값=" << a[minIndex] << endl;
}`;
const realMaxSolution = `#include <iostream>
using namespace std;
double getMax(double a[], int size) {
    double maximum = a[0];
    for (int i = 1; i < size; i++)
        if (a[i] > maximum) maximum = a[i];
    return maximum;
}
int main() {
    double a[10] = {0};
    cout << "10개 실수를 입력하세요>>";
    for (int i = 0; i < 10; i++) cin >> a[i];
    cout << "가장 큰 수 = " << getMax(a, 10) << endl;
}`;
const endPrompt = '공백 포함 문장을 입력하세요(end 입력시 종료)>>';
const endSolution = `#include <iostream>
#include <cstring>
using namespace std;
int main() {
    char line[100];
    while (true) {
        cout << "${endPrompt}";
        cin.getline(line, 100);
        if (strcmp(line, "end") == 0) break;
    }
    cout << "프로그램을 종료합니다." << endl;
}`;
const personDeclaration = `class Person {
private:
    int height = 0;
    int weight = 0;
public:
    void setHeight(int h);
    void setWeight(int w);
    void setBoth(int h, int w);
    int getHeight();
    int getWeight();
};`;
const personImplementation = `void Person::setHeight(int h) { height = h; }
void Person::setWeight(int w) { weight = w; }
void Person::setBoth(int h, int w) { height = h; weight = w; }
int Person::getHeight() { return height; }
int Person::getWeight() { return weight; }`;
const personMain = `int main(void) {
    Person A;
    A.setHeight(180);
    A.setWeight(75);
    Person B;
    B.setHeight(169);
    B.setWeight(62);
    Person C;
    C.setBoth(181, 72);
    cout << "사람 A : " << A.getHeight() << "cm / " << A.getWeight() << "kg" << endl;
    cout << "사람 B : " << B.getHeight() << "cm / " << B.getWeight() << "kg" << endl;
    cout << "사람 C : " << C.getHeight() << "cm / " << C.getWeight() << "kg" << endl;
}`;
const personFiles = {
    'Person.h': `#ifndef PERSON_H
#define PERSON_H
${personDeclaration}
#endif`,
    'Person.cpp': `#include "Person.h"
${personImplementation}`,
    'main.cpp': `#include <iostream>
#include "Person.h"
using namespace std;
${personMain}`,
};

export const passwordPractice = {
  type:'written', original:'2장 실습문제 5', prompt:'string 클래스로 두 문자열을 입력받고, 같으면 “같습니다”, 다르면 “다릅니다”를 출력하시오.',
  instructions:['원문 예시처럼 공백을 포함한 한 줄 전체를 각각 입력받는다.', '대소문자와 공백을 그대로 비교하고 아래 입력 안내 문구를 사용한다.'],
  sample:'새 암호를 입력하세요>>ABC  EDF\n새 암호를 다시 한번 입력하세요>>ABC  EDF\n같습니다\n\n새 암호를 입력하세요>>abcdefg\n새 암호를 다시 한번 입력하세요>>abcdefG\n다릅니다', sampleIncludesInput:true,
  solution:passwordSolution, explanation:'2장 실습문제 6쪽의 같은 문자열·대소문자가 다른 문자열 예시를 따른다. string 객체는 ==로 내용을 비교한다. 공백도 입력 내용이므로 getline(cin, ...)을 사용한다. 실행 예시는 프로그램을 두 번 실행한 것이다.',
  rubric:['두 입력값을 string 객체에 저장하는가?','getline으로 중간 공백까지 입력받는가?','대소문자와 공백을 포함해 문자열 전체를 비교하는가?','같은 입력과 다른 입력에서 각각 지정한 결과를 출력하는가?'], sources:[ref('practice2','6'),ref('ch2','34–35')],
  verify:{code:passwordSolution,cases:[{stdin:'ABC  EDF\nABC  EDF\n',stdout:'새 암호를 입력하세요>>새 암호를 다시 한번 입력하세요>>같습니다\n'},{stdin:'abcdefg\nabcdefG\n',stdout:'새 암호를 입력하세요>>새 암호를 다시 한번 입력하세요>>다릅니다\n'},{stdin:'A B\nA  B\n',stdout:'새 암호를 입력하세요>>새 암호를 다시 한번 입력하세요>>다릅니다\n'}]},
};
export const minMaxPractice = {
  type:'written', original:'3장 실습문제 6', prompt:'정수형 배열에 정수 10개를 입력받고, 최댓값과 최솟값을 가진 원소의 인덱스와 값을 출력하시오.',
  instructions:['정수형 배열의 모든 원소를 0으로 초기화한 뒤 입력받는다.', 'for문으로 배열을 탐색하고 입력한 배열, 최댓값·최솟값의 인덱스와 값을 출력한다.', '인덱스는 0부터 센다. 같은 최댓값·최솟값이 여러 개라면 그 값을 가진 인덱스 중 하나를 출력하면 된다.'],
  sample:'정수 10개를 차례대로 입력하시오 >> 10 -3 18 -55 100 47 -268 99 0 0\n배열 : 10 -3 18 -55 100 47 -268 99 0 0\n최대값 : 인덱스=4, 값=100\n최소값 : 인덱스=6, 값=-268', sampleIncludesInput:true,
  solution:minMaxSolution, explanation:'3장 실습문제 7쪽의 배열 초기화·for문·인덱스 출력 조건을 따른다. 입력 후 첫 원소의 인덱스를 두 기준으로 잡는다. 값 자체를 0으로 가정하면 전부 음수이거나 전부 양수인 입력에서 잘못된 결과를 낼 수 있다. 예시 답안은 같은 값 중 첫 인덱스를 남긴다.',
  rubric:['배열 10칸을 0으로 초기화하고 정수 10개를 입력받는가?','배열 원소를 for문으로 비교하는가?','최댓값과 최솟값 각각의 인덱스 및 해당 원소를 정확히 출력하는가?','음수만 있거나 최솟값이 양수인 입력에서도 실제 배열 원소를 기준으로 계산하는가?'], sources:[ref('practice3','7')],
  verify:{code:minMaxSolution,cases:[{stdin:'10 -3 18 -55 100 47 -268 99 0 0\n',stdout:'정수 10개를 차례대로 입력하시오 >> 배열 : 10 -3 18 -55 100 47 -268 99 0 0 \n최대값 : 인덱스=4, 값=100\n최소값 : 인덱스=6, 값=-268\n'},{stdin:'-10 -9 -8 -7 -6 -5 -4 -3 -2 -1\n',stdout:'정수 10개를 차례대로 입력하시오 >> 배열 : -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 \n최대값 : 인덱스=9, 값=-1\n최소값 : 인덱스=0, 값=-10\n'},{stdin:'9 8 7 6 5 4 3 2 1 10\n',stdout:'정수 10개를 차례대로 입력하시오 >> 배열 : 9 8 7 6 5 4 3 2 1 10 \n최대값 : 인덱스=9, 값=10\n최소값 : 인덱스=8, 값=1\n'}]},
};
export const realMaxPractice = {
  type:'written', original:'3장 실습문제 7', prompt:'실수 10개를 배열에 입력받고, 배열을 전달받아 가장 큰 수를 반환하는 함수를 작성하시오.',
  instructions:['실수형 배열을 선언하고 초기화한 뒤 반복문으로 입력받는다.', '별도의 함수가 배열 원소를 비교하여 최댓값을 반환하고, main에서 그 반환값을 출력한다.', '원문에 함수 이름은 지정되지 않았다. 예시 답안에서는 getMax를 사용한다.'],
  sample:'10개 실수를 입력하세요>>-10.1 0.0 3.4 5.68 9.18 -0.15 8.45 12.0 149.7 -88.8\n가장 큰 수 = 149.7',sampleIncludesInput:true,
  solution:realMaxSolution,explanation:'3장 실습문제 8쪽의 배열 전달·최댓값 반환 조건을 따른다. double 배열과 double 반환형으로 소수 부분을 유지한다. 첫 원소에서 비교를 시작하면 음수만 입력된 경우도 처리한다. main이 직접 최댓값을 계산하거나 함수에서 출력만 하고 반환하지 않는 답안은 조건에 맞지 않는다.',
  rubric:['실수 배열 10칸을 초기화하고 입력받는가?','배열을 매개변수로 받는 별도 함수를 작성하는가?','반복문으로 비교하고 실제 최댓값을 실수로 반환하는가?','main이 함수의 반환값을 출력하며 음수만 있는 입력에서도 맞는가?'],sources:[ref('practice3','8'),ref('ch4','24–34')],
  verify:{code:realMaxSolution,cases:[{stdin:'-10.1 0.0 3.4 5.68 9.18 -0.15 8.45 12.0 149.7 -88.8\n',stdout:'10개 실수를 입력하세요>>가장 큰 수 = 149.7\n'},{stdin:'-2.5 -1.25 -3 -4 -5 -6 -7 -8 -9 -10\n',stdout:'10개 실수를 입력하세요>>가장 큰 수 = -1.25\n'}]},
};
export const endPractice = {
  type:'written',original:'3장 실습문제 8',prompt:'공백을 포함한 문장을 반복해서 입력받다가 한 줄 전체가 "end"이면 종료하는 프로그램을 작성하시오.',
  instructions:['while 무한루프, cin.getline(), strcmp()를 모두 사용한다.', 'strcmp의 비교 결과를 조건문에서 검사하여 반복문을 탈출한다.', '이 연습에서는 한 줄은 공백 포함 영문 99자 이하이며 입력은 end 줄로 끝난다고 가정한다. 입력받은 문장을 별도로 다시 출력하지 않는다.'],
  sample:`${endPrompt}To be or Not to be\n${endPrompt}Someone like you\n${endPrompt}end\n프로그램을 종료합니다.`,sampleIncludesInput:true,
  solution:endSolution,explanation:'3장 실습문제 9쪽의 무한루프·getline·strcmp·탈출 조건을 따른다. strcmp가 0을 반환할 때 두 문자열이 같다. end가 문장 일부에 들어 있거나 End처럼 대소문자가 다르면 종료 조건이 아니다. 화면 예시에 보이는 문장은 사용자가 입력한 내용이다.',
  rubric:['char 배열과 cin.getline으로 공백 포함 한 줄을 입력받는가?','while 무한루프 안에서 입력을 반복하는가?','strcmp(line, "end") == 0일 때 조건문으로 탈출하는가?','입력 안내를 반복하고 종료 문구를 한 번 출력하는가?'],sources:[ref('practice3','9'),ref('ch2','29–32')],
  verify:{code:endSolution,cases:[{stdin:'To be or Not to be\nSomeone like you\nend\n',stdout:endPrompt.repeat(3)+'프로그램을 종료합니다.\n'},{stdin:'end\n',stdout:endPrompt+'프로그램을 종료합니다.\n'},{stdin:'weekend\nEnd\n\nend\n',stdout:endPrompt.repeat(4)+'프로그램을 종료합니다.\n'}]},
};
export const splitPersonPractice = {
  type:'written',original:'5장 실습문제 6',prompt:'아래 프로그램을 Person.h, Person.cpp, main.cpp 세 파일로 분리하시오.',
  instructions:['Person 선언부는 Person.h, 멤버 함수 구현부는 Person.cpp, main은 main.cpp에 둔다.', '클래스의 접근 지정자·멤버·함수 이름과 main의 동작을 유지하고 필요한 헤더를 포함한다.', '답안 한 칸에 // Person.h, // Person.cpp, // main.cpp로 파일 경계를 표시하여 작성한다.'],
  code:`#include <iostream>\nusing namespace std;\n${personDeclaration}\n${personImplementation}\n${personMain}`,
  sample:'사람 A : 180cm / 75kg\n사람 B : 169cm / 62kg\n사람 C : 181cm / 72kg',sampleIncludesInput:false,
  solution:Object.entries(personFiles).map(([name,source])=>`// ${name}\n${source}`).join('\n\n'),
  explanation:'5장 실습문제 7–8쪽의 Person을 파일별로 분리한다. 두 cpp 파일 모두 Person.h로 클래스 선언을 확인한다. Person.cpp의 정의에는 Person::가 필요하며, main에서 구현 파일 자체를 #include하지 않는다. 예시 답안은 헤더의 중복 포함을 막는 포함 가드도 사용한다. 출력문은 원문 코드의 공백을 따른다.',
  rubric:['세 파일의 역할을 정확히 나누었는가?','두 cpp 파일에서 Person.h를 포함하고 Person.cpp 정의에 Person::를 유지했는가?','private 멤버와 public 함수 원형, 선언부의 초기값을 유지했는가?','Person.cpp와 main.cpp를 함께 빌드하면 원문과 같은 세 줄이 출력되는가?'],sources:[ref('practice5','7–8'),ref('ch5','79–91'),ref('book','135–138')],
  verify:{files:personFiles,stdout:'사람 A : 180cm / 75kg\n사람 B : 169cm / 62kg\n사람 C : 181cm / 72kg\n'},
};
