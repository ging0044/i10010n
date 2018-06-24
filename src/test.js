import { init, ID, define } from "./";

const i18n = init(
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

console.assert(i18n("en") `this ${"is"} a ${"test"}` === "this is a test");
console.assert(i18n("yoda") `this ${"is"} a ${"test"}` === "a test, this is");

const things3 = [
  "a thing",
  "another",
  "one more"
];

const en = i18n("en") `\
here are 3 things:
${things3.map((thing, i) => i18n("en") `- at index ${i} is ${thing}\n`)}`;

console.assert(
  en
  ===
  "here are 3 things:\n- at index 0 is a thing\n- at index 1 is another\n- at index 2 is one more",
  en
);

const yoda = i18n("yoda") `\
here are 3 things:
${things3.map((thing, i) => i18n("yoda") `- at index ${i} is ${thing}\n`)}`;

console.log(
  yoda
  ===
  "3 things, here are:\n- at index 0, a thing is\n- at index 1, another is\n- at index 2, one more is",
  yoda
);