const base64chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Функция сериализации массива чисел (1-300) в компактную строку Base64
 * @param {number[]} numbers - Массив чисел от 1 до 300
 * @returns {string} Строка в кодировке Base64
 */

const serialize = (numbers) => {
  let str = "";
  for (const num of numbers) {
    str += num.toString(2).padStart(9, "0");
  }

  const padLength = (6 - (str.length % 6)) % 6;
  str += "0".repeat(padLength);

  let result = "";
  for (let i = 0; i < str.length; i += 6) {
    const chunk = str.slice(i, i + 6);
    const charCode = parseInt(chunk, 2);
    result += base64chars[charCode];
  }
  return result;
};

/**
 * Функция десериализации строки Base64 обратно в массив чисел
 * @param {string} encoded - Строка в кодировке Base64
 * @returns {number[]} Массив чисел от 1 до 300
 */

const deserialize = (encoded) => {
  let padLength = 0;
  if (/\d$/.test(encoded)) {
    padLength = parseInt(encoded.slice(-1), 10);
    encoded = encoded.slice(0, -1);
  }

  let binaryString = "";
  for (const char of encoded) {
    const index = base64chars.indexOf(char);
    if (index === -1) throw new Error("Invalid character in input");
    binaryString += index.toString(2).padStart(6, "0");
  }

  if (padLength > 0) {
    binaryString = binaryString.slice(0, -padLength);
  }

  const numbers = [];
  for (let i = 0; i < binaryString.length; i += 9) {
    const chunk = binaryString.slice(i, i + 9);
    if (chunk.length === 9) {
      numbers.push(parseInt(chunk, 2));
    }
  }

  return numbers;
};

const arr = [65, 25, 6, 9, 5, 6, 11, 1];
console.log("Исходный массив:", arr);
const serialized = serialize(arr);
console.log("Строка base64:", serialized);
console.log(
  "Длина base64",
  serialized.length,
  "ДлинаJson:",
  JSON.stringify(arr).length
);

const deserialized = deserialize(serialized);
console.log("deserialized:", deserialized);

/**
 * Примеры тестов: простейшие короткие, случайные - 50 чисел, 100 чисел, 500 чисел,
 * 1000 чисел, граничные - все числа 1 знака, все числа из 2х знаков,
 *  все числа из 3х знаков, каждого числа по 3 - всего чисел 900.
 */

const runTest = (tests) => {
  tests.forEach(({ text, numbers }) => {
    console.log(`------------- ${text} ------------`);
    const original = numbers.join(",");
    console.log("исходная строка", original);

    const serialized = serialize(numbers);
    console.log("сжатая строка", serialized);

    const compressionRatio = (
      (1 - serialized.length / numbers.join(",").length) *
      100
    ).toFixed(2);
    console.log(`коэффициент сжатия: ${compressionRatio} %`);
  });
};

const tests = [
  { text: "Одно число", numbers: [6] },
  { text: "Несколько чисел", numbers: [4, 5, 6] },
  {
    text: "50 случайных чисел",
    numbers: Array.from(
      { length: 50 },
      () => Math.floor(Math.random() * 300) + 1
    ),
  },
  {
    text: "100 чисел",
    numbers: Array.from(
      { length: 100 },
      () => Math.floor(Math.random() * 300) + 1
    ),
  },
  {
    text: "500 чисел",
    numbers: Array.from(
      { length: 500 },
      () => Math.floor(Math.random() * 300) + 1
    ),
  },
  {
    text: "1000 чисел",
    numbers: Array.from(
      { length: 1000 },
      () => Math.floor(Math.random() * 300) + 1
    ),
  },
  {
    text: "все числа 1 знака",
    numbers: Array.from({ length: 9 }, (_, i) => i + 1),
  },
  {
    text: "все числа из 2х знаков",
    numbers: Array.from({ length: 90 }, (_, i) => i + 10),
  },
  {
    text: "все числа из 3х знаков",
    numbers: Array.from({ length: 201 }, (_, i) => i + 100),
  },
  {
    text: "каждого числа по 3 - всего чисел 900",
    numbers: Array.from({ length: 300 }, (_, i) => [
      i + 1,
      i + 1,
      i + 1,
    ]).flat(),
  },
];

runTest(tests);
