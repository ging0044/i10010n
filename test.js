"use strict";

var _db;

var _templateObject = _taggedTemplateLiteral(["this ", " a ", ""], ["this ", " a ", ""]),
    _templateObject2 = _taggedTemplateLiteral(["a ", ", this ", ""], ["a ", ", this ", ""]),
    _templateObject3 = _taggedTemplateLiteral(["- at index ", " is ", "\n"], ["- at index ", " is ", "\\n"]),
    _templateObject4 = _taggedTemplateLiteral(["- at index ", ", ", " is\n"], ["- at index ", ", ", " is\\n"]),
    _templateObject5 = _taggedTemplateLiteral(["here are 3 things:\n", ""], ["here are 3 things:\\n", ""]),
    _templateObject6 = _taggedTemplateLiteral(["3 things, here are:\n", ""], ["3 things, here are:\\n", ""]),
    _templateObject7 = _taggedTemplateLiteral(["here are 3 things:\n", ""], ["\\\nhere are 3 things:\n", ""]);

var _ = require("./");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var i10010n = (0, _.init)({
  db: (_db = {}, _defineProperty(_db, (0, _.ID)(_templateObject, 0, 1), {
    "yoda": (0, _.define)(_templateObject2, 1, 0)
  }), _defineProperty(_db, (0, _.ID)(_templateObject3, 0, 1), {
    "yoda": (0, _.define)(_templateObject4, 0, 1)
  }), _defineProperty(_db, (0, _.ID)(_templateObject5, 0), {
    "yoda": (0, _.define)(_templateObject6, 0)
  }), _db),
  defaultLocale: "en"
});

console.assert(i10010n("en")(_templateObject, "is", "test") === "this is a test");
console.assert(i10010n("yoda")(_templateObject, "is", "test") === "a test, this is");

var things3 = ["a thing", "another", "one more"];

var en = i10010n("en")(_templateObject7, things3.map(function (thing, i) {
  return i10010n("en")(_templateObject3, i, thing);
}));

console.assert(en === "here are 3 things:\n- at index 0 is a thing\n- at index 1 is another\n- at index 2 is one more\n", en);

var yoda = i10010n("yoda")(_templateObject7, things3.map(function (thing, i) {
  return i10010n("yoda")(_templateObject3, i, thing);
}));

console.assert(yoda === "3 things, here are:\n- at index 0, a thing is\n- at index 1, another is\n- at index 2, one more is\n", yoda);