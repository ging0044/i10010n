import { init, ID, define, plural, amount } from "./";

const i10010n = init(
  {
    [ID `this ${0} a ${1}`]: {
      "yoda": define `a ${1}, this ${0}`
    },
    [ID `- at index ${0} is ${1}\n`]: {
      "yoda": define `- at index ${0}, ${1} is\n`
    },
    [ID `here are 3 things:\n${0}`]: {
      "yoda": define `3 things, here are:\n${0}`
    }
  }
);

console.assert(i10010n("en") `this ${"is"} a ${"test"}` === "this is a test");
console.assert(i10010n("yoda") `this ${"is"} a ${"test"}` === "a test, this is");

const things3 = [
  "a thing",
  "another",
  "one more"
];

const en = i10010n("en") `\
here are 3 things:
${things3.map((thing, i) => i10010n("en") `- at index ${i} is ${thing}\n`)}`;

console.assert(
  en
  ===
  "here are 3 things:\n- at index 0 is a thing\n- at index 1 is another\n- at index 2 is one more\n",
  en
);

const yoda = i10010n("yoda") `\
here are 3 things:
${things3.map((thing, i) => i10010n("yoda") `- at index ${i} is ${thing}\n`)}`;

console.assert(
  yoda
  ===
  "3 things, here are:\n- at index 0, a thing is\n- at index 1, another is\n- at index 2, one more is\n",
  yoda
);