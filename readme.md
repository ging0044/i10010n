# `i10010n`

## coming "soon"
- Pluralization (this might take some thinking)
  - Maybe a generic variation system to allow for more flexibility
- Tool to generate JSON configurations

## what does it do?
`i10010n` allows you to easily translate your application, and dynamically use translated text when sending strings, making strings, doing other stuff with strings...

## config
The config file is fairly basic. It is also a javascript file, not JSON. Obviously.
> Note: You can do it in JSON, but it'll take more work. See the DB used by [i18n-yummy](https://github.com/WebReflection/i18n-yummy) for more details.

First, you're going to want to import some functions from `i10010n`:

```js
import { define, ID } from "i10010n";
```

Then, you can configure the various template strings to support, as well as the different locales it's available in:

```js
import { define, ID } from "i10010n";

export default {
    [ID `i ${0} template strings`]: {
        "yoda": define `template strings, i ${0}`
    }
}
```
> Note: you can put anything you want in the ID template string values, but putting the indexes makes things a little clearer

You don't have to define the base language, since your template strings are already in that language. Probably.

## usage

Elsewhere, you can do this:

```js
import { init } from "i10010n";
import i10010nConf from "./theplacewhereimadetheconf";

const i10010n = init(i18nConf);

console.log(
    i10010n("yoda") `i ${"love"} template strings`
);
// "template strings, i love"
```

## if you're not english
You don't have to use English for the base language.

To specify a different base locale than "en", you can just say so when you initialize i18n, like so:

```js
const i10010n = init(i10010nConf, "yoda");
```

Setting things up this way would mean that you write your base template strings in yoda, and anything else will be a translation of that.

## advanced(ish) usage
Let's say you have an array of things you want to put in a translated template string. You can do this:

```js
const things3 = ["i18n", "internationalization", "yoda"];

console.log(
    i18n("yoda") `i like 3 things:\n${
        things3.map(thing => i18n("yoda") `i like ${thing}\n`;
    }`
);
/*
"3 things, i like:
i18n, i like
internationalization, i like
yoda, i like"
*/
```

It's like magic! Or `Array.prototype.join`!

## credits
This project is quite inspired by [i18n-yummy](https://github.com/WebReflection/i18n-yummy). I did rewrite everything from scratch (it's more than 9 lines, as you can probably tell), and changed some of the concepts, but the epiphany came from that.

One difference is that there is no static locale setting. You must provide the locale with each function call. This means that you do not need to have multiple instances of `i10010n` in an application that may respond in different languages from the same instance.
