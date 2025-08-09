// local fallback DB used when no DATABASE_URL is provided
// tests are IO based: call the user's function with args and compare deep equality to expect
export const fallbackChallenges = [
  {
    id: "sum-two",
    title: "Sum of Two Numbers",
    description: "Implement add(a, b) that returns the sum of two numbers. Handle negative and decimal values.",
    difficulty: "easy",
    entryFunction: "add",
    starterCode: `// Implement add(a, b) and return their sum.
function add(a, b) {
  // your code here
  return a + b
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "adds small positives", args: [2, 3], expect: 5 },
      { name: "adds negative and positive", args: [-5, 10], expect: 5 },
      { name: "works with decimals", args: [2.5, 0.5], expect: 3 },
    ],
    hiddenIOTests: [{ name: "adds large numbers", args: [1000000, 2345678], expect: 3345678 }],
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    description:
      "Write reverseString(s) that returns a new string with characters in reverse order, without using built-in reverse().",
    difficulty: "medium",
    entryFunction: "reverseString",
    starterCode: `function reverseString(s) {
  // your code here
  let out = ""
  for (let i = s.length - 1; i >= 0; i--) out += s[i]
  return out
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "basic reverse", args: ["abc"], expect: "cba" },
      { name: "empty string", args: [""], expect: "" },
    ],
    hiddenIOTests: [{ name: "palindrome remains same", args: ["racecar"], expect: "racecar" }],
  },
  {
    id: "factorial",
    title: "Factorial",
    description: "Implement factorial(n) that returns n! for non-negative integers. Handle n=0.",
    difficulty: "medium",
    entryFunction: "factorial",
    starterCode: `function factorial(n) {
  if (n < 0) throw new Error("n must be non-negative")
  let res = 1
  for (let i = 2; i <= n; i++) res *= i
  return res
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "factorial(0) is 1", args: [0], expect: 1 },
      { name: "factorial(5) is 120", args: [5], expect: 120 },
    ],
    hiddenIOTests: [{ name: "factorial(10)", args: [10], expect: 3628800 }],
  },
  {
    id: "is-palindrome",
    title: "Palindrome Check",
    description: "Implement isPalindrome(s) that returns true if the string is a palindrome ignoring case.",
    difficulty: "easy",
    entryFunction: "isPalindrome",
    starterCode: `function isPalindrome(s) {
  const t = (s || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  let i = 0, j = t.length - 1
  while (i < j) {
    if (t[i] !== t[j]) return false
    i++; j--
  }
  return true
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "racecar", args: ["racecar"], expect: true },
      { name: "hello", args: ["hello"], expect: false },
      { name: "Mixed Case", args: ["Able was I ere I saw Elba"], expect: true },
    ],
    hiddenIOTests: [{ name: "empty", args: [""], expect: true }],
  },
  {
    id: "fibonacci-n",
    title: "Nth Fibonacci",
    description: "Implement fib(n) returning the nth Fibonacci number, with fib(0)=0, fib(1)=1.",
    difficulty: "medium",
    entryFunction: "fib",
    starterCode: `function fib(n) {
  if (n < 0) throw new Error("n must be non-negative")
  if (n <= 1) return n
  let a = 0, b = 1
  for (let i = 2; i <= n; i++) {
    const c = a + b
    a = b; b = c
  }
  return b
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "fib(0)", args: [0], expect: 0 },
      { name: "fib(1)", args: [1], expect: 1 },
      { name: "fib(10)", args: [10], expect: 55 },
    ],
    hiddenIOTests: [{ name: "fib(20)", args: [20], expect: 6765 }],
  },
  {
    id: "is-anagram",
    title: "Anagram Check",
    description: "Implement isAnagram(a, b) to check if two strings are anagrams (ignore spaces and case).",
    difficulty: "medium",
    entryFunction: "isAnagram",
    starterCode: `function isAnagram(a, b) {
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("")
  return norm(a) === norm(b)
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "listen/silent", args: ["listen", "silent"], expect: true },
      { name: "hello/ohlle", args: ["hello", "ohlle"], expect: true },
      { name: "rat/car", args: ["rat", "car"], expect: false },
    ],
    hiddenIOTests: [{ name: "Astronomer/Moon starer", args: ["Astronomer", "Moon starer"], expect: true }],
  },
  {
    id: "array-max",
    title: "Array Max",
    description: "Implement arrayMax(arr) that returns the maximum number in an array.",
    difficulty: "easy",
    entryFunction: "arrayMax",
    starterCode: `function arrayMax(arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error("arr must be non-empty")
  let m = -Infinity
  for (const x of arr) if (x > m) m = x
  return m
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "simple", args: [[1, 2, 3]], expect: 3 },
      { name: "negatives", args: [[-10, -3, -7]], expect: -3 },
    ],
    hiddenIOTests: [{ name: "mixed", args: [[5, 100, 99, 1000, 6]], expect: 1000 }],
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    description: "Implement countVowels(s) returning the number of vowels (a, e, i, o, u) in a string.",
    difficulty: "easy",
    entryFunction: "countVowels",
    starterCode: `function countVowels(s) {
  const m = (s || "").toLowerCase().match(/[aeiou]/g)
  return m ? m.length : 0
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "hello", args: ["hello"], expect: 2 },
      { name: "sky", args: ["sky"], expect: 0 },
    ],
    hiddenIOTests: [{ name: "AEIOU", args: ["AEIOU"], expect: 5 }],
  },
  {
    id: "is-prime",
    title: "Prime Check",
    description: "Implement isPrime(n) returning true if n is a prime number.",
    difficulty: "hard",
    entryFunction: "isPrime",
    starterCode: `function isPrime(n) {
  if (n <= 1) return false
  if (n <= 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}
`,
    image: "/placeholder.svg?height=300&width=300",
    publicIOTests: [
      { name: "2 is prime", args: [2], expect: true },
      { name: "9 is not", args: [9], expect: false },
    ],
    hiddenIOTests: [{ name: "97 is prime", args: [97], expect: true }],
  },
]
