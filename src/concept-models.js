// These are bounded visualizations of the displayed C++ programs, not an interpreter.
const program = body => `#include <iostream>\nusing namespace std;\n\nint main() {\n${body}\n}`;
const frame = (line, note, values, output = '') => ({ line, note, values, output });

export function loopTrace(limit = 3) {
  const code = program(`    int sum = 0;\n    int i;\n    for (i = 1; i <= ${limit}; i++) {\n        sum += i;\n    }\n    cout << sum << " " << i;`);
  const frames = [frame(0, '아직 main의 첫 문장을 실행하지 않았습니다.', {}), frame(5, '누적할 변수 sum을 0으로 초기화합니다.', {sum: 0}), frame(6, 'i의 저장 공간만 준비했습니다. 아직 값을 읽으면 안 됩니다.', {sum: 0, i: '미초기화'}), frame(7, '초기식 i = 1은 반복을 시작할 때 한 번만 실행합니다.', {sum: 0, i: 1})];
  let sum = 0;
  for (let i = 1; i <= limit; i++) {
    frames.push(frame(7, `${i} <= ${limit}은 참. 반복문의 본문으로 들어갑니다.`, {sum, i}));
    sum += i;
    frames.push(frame(8, `sum에 현재 i인 ${i}을 더합니다.`, {sum, i}));
    frames.push(frame(7, '본문이 끝났으므로 증감식 i++를 실행합니다. 그 뒤 조건을 다시 검사합니다.', {sum, i: i + 1}));
  }
  frames.push(frame(7, `${limit + 1} <= ${limit}은 거짓. 본문을 더 실행하지 않습니다.`, {sum, i: limit + 1}));
  frames.push(frame(10, '반복 종료 후의 sum과 i를 출력합니다. 마지막으로 더한 i와 종료 시 i는 다릅니다.', {sum, i: limit + 1}, `${sum} ${limit + 1}`));
  return { code, frames };
}

export const circleClass = `class Circle {
    int radius;
public:
    Circle(int r) { radius = r; }
    void setRadius(int r) {
        if (r > 0) radius = r;
    }
    int getRadius() { return radius; }
};`;

export function updateCircle(objects, target, radius) {
  if (!['donut', 'pizza'].includes(target) || !Number.isInteger(radius) || radius < 0 || radius > 8) return {...objects};
  return radius > 0 ? {...objects, [target]: radius} : {...objects};
}

export function updatePointer(state, action, value) {
  if (action === 'point' && ['a','b'].includes(value)) return {...state, p: value};
  if (action === 'write' && Number.isInteger(value) && value >= 0 && value <= 20) return {...state, [state.p]: value};
  return {...state};
}

export const traces = {
  basics: {
    code: '#include <iostream>\nusing std::cout;\n\nint main() {\n    cout << "A";\n    // cout << "B";\n    cout << "C" << std::endl;\n}',
    frames: [frame(0, 'include와 using은 아래 이름들을 사용할 준비입니다. 실행 결과는 아직 없습니다.', {}), frame(5, '문자열 A를 출력합니다. 아직 줄바꿈은 없습니다.', {}, 'A'), frame(6, '이 줄은 주석입니다. B를 출력하는 문장으로 실행하지 않습니다.', {}, 'A'), frame(7, 'C를 이어 쓰고 std::endl로 줄을 바꿉니다.', {}, 'AC\n'), frame(8, 'int main의 끝에 도달하면 0을 반환한 것과 같습니다. 0을 화면에 출력한다는 뜻은 아닙니다.', {'종료 상태': 0}, 'AC\n')],
  },
  strings: {
    code: '#include <iostream>\n#include <cstring>\n#include <string>\nusing namespace std;\nint main() {\n    char a[] = "Hi";\n    string b = "Hello";\n    cout << sizeof(a) << " " << strlen(a) << endl;\n    b = "C++";\n    cout << b;\n}',
    frames: [frame(0, '배열 크기와 문자열 길이를 구별하며 읽어보세요.', {}), frame(6, '문자 H, i, 널 문자 세 칸이 만들어집니다. 널 문자도 저장 공간을 차지합니다.', {'a[0]': "'H'", 'a[1]': "'i'", 'a[2]': "'\\0'"}), frame(7, 'b는 문자 배열 자체가 아니라 string 객체입니다.', {'a': "H | i | \\0", b: 'Hello'}), frame(8, 'sizeof는 배열 전체 3바이트, strlen은 널 문자 앞의 문자 수 2를 얻습니다.', {'sizeof(a)': 3, 'strlen(a)': 2, b: 'Hello'}, '3 2\n'), frame(9, 'string 객체에는 =로 새 문자열을 대입할 수 있습니다.', {a: "H | i | \\0", b: 'C++'}, '3 2\n'), frame(10, '바뀐 b의 내용을 출력합니다.', {a: "H | i | \\0", b: 'C++'}, '3 2\nC++')],
  },
  control: loopTrace(),
  pointers: {
    code: program('    int a = 3, b = 8;\n    int* p = &a;\n    *p = 7;\n    p = &b;\n    *p = *p + 2;\n    cout << a << " " << b;'),
    frames: [frame(0, 'p에 들어 있는 주소와 그 주소의 값을 따로 보세요.', {}), frame(5, '독립된 정수 변수 a와 b를 만듭니다.', {a: 3, b: 8}), frame(6, 'p에는 3이 아니라 a의 주소를 저장합니다.', {a: 3, b: 8, p: '→ a'}), frame(7, '*p에 대입하므로 p가 가리키는 a의 값이 바뀝니다.', {a: 7, b: 8, p: '→ a'}), frame(8, 'p 자체에 주소를 대입합니다. a와 b의 값은 그대로이고 대상만 바뀝니다.', {a: 7, b: 8, p: '→ b'}), frame(9, '현재 *p는 b입니다. 8을 읽고 2를 더해서 같은 b에 저장합니다.', {a: 7, b: 10, p: '→ b'}), frame(10, '마지막 a와 b를 출력합니다.', {a: 7, b: 10, p: '→ b'}, '7 10')],
  },
  functions: {
    code: '#include <iostream>\nusing namespace std;\nint addOne(int n) {\n    n = n + 1;\n    return n;\n}\nint main() {\n    int x = 4;\n    int y = addOne(x);\n    cout << x << " " << y;\n}',
    frames: [frame(0, '함수 정의를 읽었다고 함수 본문을 실행하는 것은 아닙니다.', {}), frame(8, 'main의 x를 4로 초기화합니다.', {x: 4}), frame(9, 'addOne을 호출합니다. y의 초기화는 반환값을 받을 때 완료됩니다.', {x: 4, y: '반환 대기'}), frame(3, 'x의 값 4를 복사해서 별도 매개변수 n을 만듭니다.', {x: 4, n: 4, y: '반환 대기'}), frame(4, 'n만 5가 됩니다. main의 x는 4 그대로입니다.', {x: 4, n: 5, y: '반환 대기'}), frame(5, '5를 반환하고 이 호출의 n은 수명을 마칩니다. return은 화면 출력이 아닙니다.', {x: 4, '반환값': 5, y: '반환 대기'}), frame(9, '호출한 자리로 돌아와 반환값 5로 y를 초기화합니다.', {x: 4, y: 5}), frame(10, 'cout이 있어야 결과가 화면에 나옵니다.', {x: 4, y: 5}, '4 5')],
  },
  classes: {
    code: `#include <iostream>\nusing namespace std;\n${circleClass}\nint main() {\n    Circle donut(2);\n    Circle pizza(5);\n    donut.setRadius(4);\n    cout << donut.getRadius() << " " << pizza.getRadius();\n}`,
    frames: [frame(0, 'Circle의 정의만으로 donut과 pizza가 생기지는 않습니다.', {}), frame(13, '2를 생성자에 전달해서 donut의 radius를 2로 초기화합니다.', {'donut.radius': 2}), frame(14, 'pizza는 별개의 객체입니다. 자신의 radius에 5를 저장합니다.', {'donut.radius': 2, 'pizza.radius': 5}), frame(15, '호출 대상은 점 앞의 donut입니다. 4 > 0이므로 donut의 radius만 바뀝니다.', {'donut.radius': 4, 'pizza.radius': 5}), frame(16, '두 함수는 각 객체의 값을 반환합니다. 반환받은 4와 5를 cout으로 출력합니다.', {'donut.radius': 4, 'pizza.radius': 5}, '4 5')],
  },
  lifetime: {
    code: '#include <iostream>\nusing namespace std;\nclass Mark {\n    int id;\npublic:\n    Mark(int n) { id = n; cout << "C" << id << " "; }\n    ~Mark() { cout << "D" << id << " "; }\n};\nMark g(0);\nint main() {\n    Mark a(1);\n    {\n        Mark b(2);\n        cout << "X ";\n    }\n    cout << "Y ";\n}',
    frames: [frame(0, '한 파일 안의 전역 객체와 자동 지역 객체를 비교합니다.', {}), frame(9, 'main에 들어가기 전에 전역 객체 g가 생성됩니다.', {g: '생존 · id 0'}, 'C0 '), frame(11, 'main 안의 a가 생성됩니다.', {g: '생존 · id 0', a: '생존 · id 1'}, 'C0 C1 '), frame(13, '안쪽 블록에서 b를 생성합니다.', {g: '생존 · id 0', a: '생존 · id 1', b: '생존 · id 2'}, 'C0 C1 C2 '), frame(14, 'X를 출력합니다. 세 객체 모두 아직 살아 있습니다.', {g: '생존', a: '생존', b: '생존'}, 'C0 C1 C2 X '), frame(15, 'b가 속한 블록을 나갑니다. 이때 b의 소멸자가 호출됩니다.', {g: '생존', a: '생존', b: '소멸'}, 'C0 C1 C2 X D2 '), frame(16, 'b 소멸 뒤에 Y를 출력합니다.', {g: '생존', a: '생존', b: '소멸'}, 'C0 C1 C2 X D2 Y '), frame(17, 'main을 나가며 자동 지역 객체 a가 소멸합니다.', {g: '생존', a: '소멸', b: '소멸'}, 'C0 C1 C2 X D2 Y D1 '), frame(9, '정상 종료 과정에서 전역 객체 g가 소멸합니다. 9번 선언문을 재실행하는 것은 아닙니다.', {g: '소멸', a: '소멸', b: '소멸'}, 'C0 C1 C2 X D2 Y D1 D0 ')],
  },
  access: {
    code: `#include <iostream>\nusing namespace std;\n${circleClass}\nint main() {\n    Circle donut(2);\n    donut.setRadius(0);\n    cout << donut.getRadius();\n}`,
    frames: [frame(0, 'main에서는 private radius를 직접 읽거나 바꿀 수 없습니다.', {}), frame(13, 'public 생성자가 private 멤버 radius를 2로 초기화합니다.', {'donut.radius': 2}), frame(14, 'public 함수 setRadius에 0을 전달합니다. private 멤버를 다루는 것은 이 멤버 함수입니다.', {'donut.radius': 2, r: 0}), frame(8, '조건 0 > 0이 거짓이므로 대입하지 않습니다. private이 아니라 이 if가 값 검사를 합니다.', {'donut.radius': 2, r: 0}), frame(15, 'public 함수가 private 값을 반환하므로 출력은 2입니다.', {'donut.radius': 2}, '2')],
  },
};
