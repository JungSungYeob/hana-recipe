export const saveLocalStorage = <T>(key: string, value: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
// // 문자열을 저장
// saveLocalStorage<string>("userName", "John");

// // 객체를 저장
// saveLocalStorage<{ name: string, age: number }>("user", { name: "John", age: 30 });

// // 배열을 저장
// saveLocalStorage<string[]>("tasks", ["task1", "task2"]);

export const loadLocalStorage = <T>(key: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  }
  return null;
};
