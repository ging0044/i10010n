"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.init = init;
exports.define = define;
exports.ID = ID;
/**
 * Returns tagging function for given locale
 * 
 * @param locale string for name of desired locale
 * @returns function to tag template literal
 */
var i18n = function i18n(locale) {
  return function (template) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return getTranslation(getLocaleData(getDB(), template, locale), args);
  };
};

/**
 * Initialization function
 * 
 * @param db i18n DB
 * @param defaultLocale locale which just uses given template
 * @param logger function to log i18n errors, if not supplied, console.error
 * @return actual i18n function
 */
function init(db, defaultLocale, logger) {
  i18n.db = db;
  i18n.defaultLocale = defaultLocale || "en";
  log.logger = logger || console.error;

  return i18n;
}

/**
 * Returns config object for given template
 *
 * @param template array of strings that make up template literal
 * @param args values to insert into template literal
 * @returns {{t: *, v: *[]}}, object to be used in DB
 */
function define(template) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return {
    t: template,
    v: args
  };
}

/**
 * Returns the i18n ID for the given template
 *
 * @param template template array
 * @returns string to be used as index in DB
 */
function ID(template) {
  return JSON.stringify(template);
}

/**
 * Gets i18n DB, or empty object. Logs if no DB found
 * 
 * @returns i18n DB
 */
function getDB() {
  if (i18n.db) {
    return i18n.db;
  }

  log("No DB found!");
  return {};
}

/**
 * Gets data for given template from given DB
 * 
 * @param db value from {@link getDB()}
 * @param template template array given received by tagging function
 * @return DB entry with key uuid(template)
 */
function getTemplateData(db, template) {
  var templateData = db[ID(template)];
  if (templateData) {
    return templateData;
  }

  log("No template data found for template:", template);

  return {};
}

/**
 * Gets entry from templateData for provided locale
 * 
 * @param db value from {@link getDB()}
 * @param template template array givven to tagging function
 * @param locale locale string
 * @returns object with template for locale, and value order
 */
function getLocaleData(db, template, locale) {
  var templateData = getTemplateData(db, template);

  if (templateData[locale]) {
    return templateData[locale];
  }

  if (locale !== i18n.defaultLocale) {
    log("No locale data found in templateData:", templateData, "Falling back to base template:", template);
  }

  return { t: template };
}

/**
 * Puts together string for locale based on localeData and values
 * 
 * @param localeData object returned by {@link getLocaleData()}
 * @param values array of values made up of values inserted into template string
 * @returns generated string in given locale
 */
function getTranslation(localeData, values) {
  var t = localeData.t,
      _localeData$v = localeData.v,
      v = _localeData$v === undefined ? [] : _localeData$v;

  return t.reduce(function (acc, str, i) {
    return acc + getValue(values[getIndex(v, i - 1)]) + str;
  });
}

/**
 * Returns changed order index if applicable, or index
 *
 * @param valueOrder array of numbers defining new order
 * @param index current index
 * @returns index number
 */
function getIndex(valueOrder, index) {
  return valueOrder[index] === undefined ? index : valueOrder[index];
}

/**
 * Deals with arrays in values of template string
 * 
 * @param value array or string, the value to insert into the final string
 * @returns joined array, otherwise original value
 */
function getValue(value) {
  if (Array.isArray(value)) {
    return value.join('');
  }
  return value;
}

/**
 * Logs stuff using whatever logging function was provided
 * 
 * @param stuff the stuff to log, which will be joined with \n
 * @returns whatever the logging function returns. By default, undefined
 */
function log() {
  for (var _len3 = arguments.length, stuff = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    stuff[_key3] = arguments[_key3];
  }

  log.logger("i18n: " + stuff.map(function (x) {
    return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && JSON.stringify(x) || x;
  }).join("\n"));
}