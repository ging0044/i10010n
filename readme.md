# i18n-_-js
## what does it do
i18n.js allows you to easily translate your application, and dynamically use translated text when sending strings, making strings, doing other stuff with strings...

## config
The config file is fairly basic. It is also a javascript file, not json. Obviously.

First, you're going to want to import some functions from i18n.js:

```js
import { define, ID } from "i18n-_-js";
```

Then, you can configure the various template strings to support, as well as the different locales it's available in:

```js
import { define, ID } from "i18n-_-js";

export default {
    [ID `i ${0} template strings`]: {
        "yoda": [define `template strings, i ${0}`]
    }
}
```
> Note: you can put anything you want in the ID template string, but putting the index makes things a little clearer

You don't have to define the base language, since your template strings are already in that language. Probably.

## usage

Elsewhere, you can do this:

```js
import { init } from "i18n-_-js";
import i18nConf from "./theplacewhereimadetheconf";

const i18n = init(i18nConf);

console.log(
    i18n("yoda") `i ${"love"} template strings`
);
// "template strings, i love"
```

## if you're not english
You don't have to use English for the base language.

To specify a different base locale than "en", you can just say so when you initialize i18n, like so:

```js
const i18n = init(i18nConf, "yoda");
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

One difference is that there is no static locale setting. You must provide the locale with each function call. This means that you do not need to have multiple instances of i18n.
