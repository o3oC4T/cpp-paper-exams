import { ref } from './sources.js';

const sortSolution = `#include <iostream>
using namespace std;
int main() {
    int a[5];
    cout << "숫자 5개를 입력하세요 : ";
    for (int i = 0; i < 5; i++) cin >> a[i];
    cout << "original" << endl;
    for (int i = 0; i < 5; i++) cout << a[i] << " ";
    cout << endl;
    for (int i = 0; i < 4; i++) {
        int minIndex = i;
        for (int j = i + 1; j < 5; j++)
            if (a[j] < a[minIndex]) minIndex = j;
        int temp = a[i];
        a[i] = a[minIndex];
        a[minIndex] = temp;
    }
    cout << "After selection sort" << endl;
    for (int i = 0; i < 5; i++) cout << a[i] << " ";
    cout << endl;
    return 0;
}`;
const addSolution = `#include <iostream>
using namespace std;
void addPointer(int* sum, int plus) {
    *sum += plus;
    cout << "더한 결과는 " << *sum << "입니다." << endl;
}
void addValue(int sum, int plus) {
    sum += plus;
    cout << "더한 결과는 " << sum << "입니다." << endl;
}
int main() {
    int sum = 5, plus = 7;
    addValue(sum, plus);
    cout << "sum = " << sum << endl;
    addPointer(&sum, plus);
    cout << "sum = " << sum << endl;
    return 0;
}`;
const studentSolution = `#include <iostream>
using namespace std;
class Student {
public:
    int age = 0, height = 0, weight = 0;
    int getAge() { return age; }
    int getHeight() { return height; }
    int getWeight() { return weight; }
};
int main() {
    Student A, B, C;
    A.age = 20; A.height = 180; A.weight = 75;
    B.age = 22; B.height = 169; B.weight = 62;
    cout << "학생 A : " << A.getAge() << "살 / " << A.getHeight() << "cm / " << A.getWeight() << "kg" << endl;
    cout << "학생 B : " << B.getAge() << "살 / " << B.getHeight() << "cm / " << B.getWeight() << "kg" << endl;
    cout << "학생 C : " << C.getAge() << "살 / " << C.getHeight() << "cm / " << C.getWeight() << "kg" << endl;
    return 0;
}`;
const sphereMain = `int main(void) {
    Sphere golfBall;
    double golfBall_area = golfBall.getArea();
    cout << "골프 공의 겉 면적은 " << golfBall_area << endl;
    Sphere basketBall(12);
    double basketBall_area = basketBall.getArea();
    cout << "농구 공의 겉 면적은 " << basketBall_area << endl;
    return 0;
}`;
const sphereSolution = `#include <iostream>
using namespace std;
class Sphere {
    double radius;
public:
    Sphere() {
        radius = 2;
        cout << "반지름이 " << radius << "cm 인 구 생성" << endl;
    }
    Sphere(double r) {
        radius = r;
        cout << "반지름이 " << radius << "cm 인 구 생성" << endl;
    }
    double getArea() { return 4 * 3.14 * radius * radius; }
};
${sphereMain}`;
const personMain = `int main(void) {
    Person normal;
    double normal_BMI = normal.getBMI();
    cout << "BMI = " << normal_BMI << endl;
    Person check(1.6, 68);
    double check_BMI = check.getBMI();
    cout << "BMI = " << check_BMI << endl;
}`;
const personSolution = `#include <iostream>
using namespace std;
class Person {
    double height, weight;
public:
    Person() : height(1.8), weight(69) {
        cout << "키 : " << height << "m" << endl;
        cout << "체중 : " << weight << "kg" << endl;
    }
    Person(double h, double w) : height(h), weight(w) {
        cout << "키 : " << height << "m" << endl;
        cout << "체중 : " << weight << "kg" << endl;
    }
    double getBMI() { return weight / (height * height); }
};
${personMain}`;

export const sortingPractice = {
  type:'written', prompt:'정수 5개를 차례대로 입력 받아 오름차순으로 정렬하기', original:'4장 실습문제 3',
  instructions:['입력한 정수를 original 아래에 입력 순서대로 출력한다.', '선택 정렬을 수행하고 After selection sort 아래에 오름차순 결과를 출력한다.'],
  sample:'숫자 5개를 입력하세요 : 10 3 8 1 6\noriginal\n10 3 8 1 6\nAfter selection sort\n1 3 6 8 10', sampleIncludesInput:true,
  solution:sortSolution, explanation:'4장 실습문제 6쪽의 문제와 화면을 기준으로 한다. i 위치부터 끝까지 가장 작은 원소의 인덱스를 찾고, 그 원소를 a[i]와 교환한다. 입력 순서를 출력한 다음에 정렬하며, 같은 값이나 음수도 비교에 포함한다.',
  rubric:['정수를 정확히 5개 입력받는가?','정렬 전에 original과 입력 순서의 원소를 출력하는가?','선택 정렬에서 미정렬 구간의 최소 원소를 찾아 교환하는가?','예시에서 1 3 6 8 10이 나오고 중복값·음수에도 동작하는가?'], sources:[ref('practice4','6')],
  verify:{code:sortSolution,cases:[{stdin:'10 3 8 1 6\n',stdout:'숫자 5개를 입력하세요 : original\n10 3 8 1 6 \nAfter selection sort\n1 3 6 8 10 \n'},{stdin:'-2 3 -2 0 -9\n',stdout:'숫자 5개를 입력하세요 : original\n-2 3 -2 0 -9 \nAfter selection sort\n-9 -2 -2 0 3 \n'}]},
};
export const additionPractice = {
  type:'written', prompt:'정수형 변수 sum에 plus값을 더해서 출력하는 함수 2개 만들기', original:'4장 실습문제 4',
  instructions:['sum = 5, plus = 7로 시작한다.', '한 함수는 sum의 값을 int로, 다른 함수는 sum의 주소를 포인터로 전달받는다.', '화면의 출력 순서에 맞춰 값 전달 함수를 먼저 호출하고, 주소 전달 함수를 다음에 호출한다. 각 호출 뒤 main의 sum도 출력한다.'],
  sample:'더한 결과는 12입니다.\nsum = 5\n더한 결과는 12입니다.\nsum = 12', sampleIncludesInput:false,
  solution:addSolution, explanation:'4장 실습문제 7쪽의 두 전달 방식과 실행 예시를 따른다. 값 전달 함수의 매개변수만 바뀌면 main의 sum은 5이다. 주소 전달 함수에서 *sum에 대입하면 main의 sum도 12가 된다. 함수 이름은 원문에서 지정하지 않아 예시에서는 addValue와 addPointer로 구분했다.',
  rubric:['int로 값을 받는 함수와 int*로 주소를 받는 함수를 각각 작성했는가?','값 전달 함수는 받은 값에 plus를 더해 12를 출력하되 main의 sum은 5인가?','주소 전달 함수는 역참조로 main의 sum을 실제로 바꾸는가?','네 줄의 출력 순서와 내용이 예시와 맞는가?'],sources:[ref('practice4','7')],verify:{code:addSolution,stdout:'더한 결과는 12입니다.\nsum = 5\n더한 결과는 12입니다.\nsum = 12\n'},
};
export const studentPractice = {
  type:'written',prompt:'main()의 실행 결과가 다음과 같도록 Student 클래스를 작성하고 A, B, C 객체의 정보를 출력하시오.',original:'5장 실습문제 1',
  instructions:['멤버 변수 age, height, weight를 선언할 때 모두 0으로 초기화한다.', '각 값을 반환하는 getAge(), getHeight(), getWeight()를 구현한다.', 'main에서 A와 B의 멤버 변수에 직접 접근하여 예시 값을 설정한다. C는 초기값을 유지한다.'],
  sample:'학생 A : 20살 / 180cm / 75kg\n학생 B : 22살 / 169cm / 62kg\n학생 C : 0살 / 0cm / 0kg',sampleIncludesInput:false,
  solution:studentSolution,explanation:'5장 실습문제 2쪽의 멤버 이름, 선언 시 초기화 조건과 실행 결과를 따른다. 이 문제는 main에서 멤버 변수에 직접 접근하도록 요구하므로 해당 변수는 public으로 둔다. 세 객체의 멤버 값은 각각 독립적이며 C에는 선언부의 초기값 0이 남는다.',
  rubric:['Student에 age, height, weight가 있고 선언 시 모두 0으로 초기화했는가?','세 getter가 각각 해당 객체의 값을 반환하는가?','A와 B의 값을 main에서 직접 설정할 수 있는 접근 권한인가?','C를 별도로 바꾸지 않았을 때도 0살 / 0cm / 0kg이 출력되는가?'],sources:[ref('practice5','2')],verify:{code:studentSolution,stdout:'학생 A : 20살 / 180cm / 75kg\n학생 B : 22살 / 169cm / 62kg\n학생 C : 0살 / 0cm / 0kg\n'},
};
export const spherePractice = {
  type:'written',prompt:'기본 생성자와 매개변수 있는 생성자를 이용하여 Sphere 클래스를 작성하시오. 아래 main은 변경하지 않는다.',original:'5장 실습문제 3',code:sphereMain,
  instructions:['인자 없는 생성자는 반지름을 2cm로 초기화하고, 인자 있는 생성자는 전달된 반지름을 저장한다.', '각 생성자에서 예시의 구 생성 문구를 출력한다.', 'getArea()는 구의 겉넓이 4 × 3.14 × 반지름 × 반지름을 반환한다.'],
  sample:'반지름이 2cm 인 구 생성\n골프 공의 겉 면적은 50.24\n반지름이 12cm 인 구 생성\n농구 공의 겉 면적은 1808.64',sampleIncludesInput:false,
  solution:sphereSolution,explanation:'5장 실습문제 4쪽의 main과 출력에 맞춘다. 원의 넓이와 구의 겉넓이를 구별하고, 생성자는 값을 초기화하면서 문구를 출력한다. getArea는 계산 결과를 반환하며 main이 그 반환값을 출력한다.',
  rubric:['Sphere()와 인자 있는 생성자를 모두 제공하는가?','golfBall은 반지름 2, basketBall은 반지름 12를 저장하는가?','getArea가 4 * 3.14 * radius * radius를 반환하는가?','생성 문구가 각 면적 출력 전에 나오며 main을 바꾸지 않았는가?'],sources:[ref('practice5','4')],verify:{code:sphereSolution,stdout:'반지름이 2cm 인 구 생성\n골프 공의 겉 면적은 50.24\n반지름이 12cm 인 구 생성\n농구 공의 겉 면적은 1808.64\n'},
};
export const bmiPractice = {
  type:'written',prompt:'생성자 서두의 초기화 목록으로 멤버 변수를 초기화하는 Person 클래스를 작성하시오. 아래 main은 변경하지 않는다.',original:'5장 실습문제 4',code:personMain,
  instructions:['기본 생성자는 키 1.8m와 체중 69kg으로 초기화한다.', '인자 있는 생성자는 전달된 키와 체중으로 초기화한다. 두 생성자 모두 초기화 목록을 사용한다.', '생성자에서 키와 체중을 출력하고, getBMI()는 체중 / (키 × 키)를 실수로 반환한다.'],
  sample:'키 : 1.8m\n체중 : 69kg\nBMI = 21.2963\n키 : 1.6m\n체중 : 68kg\nBMI = 26.5625',sampleIncludesInput:false,
  solution:personSolution,explanation:'5장 실습문제 5쪽의 생성자 초기화 조건, main과 출력을 따른다. 키는 이미 m 단위이며 double로 보관한다. weight / (height * height)를 계산하고, 출력 자릿수는 기본 cout 형식을 사용하면 예시와 일치한다. 이 문제는 C++ 계산과 초기화를 연습하는 문제이다.',
  rubric:['키와 체중을 실수 값을 보관할 수 있는 멤버로 선언했는가?','두 생성자 모두 : height(...), weight(...) 형태의 초기화 목록을 쓰는가?','getBMI의 계산 순서와 반환형이 실수 결과를 유지하는가?','제공 main을 유지하고 키·체중·BMI의 출력 순서와 값이 맞는가?'],sources:[ref('practice5','5')],verify:{code:personSolution,stdout:'키 : 1.8m\n체중 : 69kg\nBMI = 21.2963\n키 : 1.6m\n체중 : 68kg\nBMI = 26.5625\n'},
};
