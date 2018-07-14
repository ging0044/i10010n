"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i10010n = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.init = init;
exports.define = define;
exports.ID = ID;

var _Error = require("./Error");

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * String representing a locale
 * @typedef {string} Locale
 */

/**
 * Template array, representing the strings around each of the values inserted into a template string
 * @typedef {string[]} Template
 */

/**
 * Array of new orders to insert data into template string. Index of array becomes value at index.
 * @typedef {number[]} Order
 */

/**
 * Locale-specific data for a translation
 * @typedef {Object} LocaleData
 * @property {Template} t - {@link Template} array
 * @property {Order} [v] - {@link Order} array
 */

/**
 * JSON representation of {@link Template}
 * @typedef {string} TemplateID
 */

/**
 * The LocaleData values of a string, by locale
 * @typedef {Object.<Locale, LocaleData>} TemplateData
 */

/**
 * Database of string translations to different locales
 * @typedef {Object.<TemplateID, TemplateData>} DB
 */

/**
 * Returns tagging function for given locale
 *
 * @param {Locale} locale string for name of desired {@link Locale}
 * @returns {Function} function to tag template literal
 */
var i10010n = exports.i10010n = function i10010n(locale) {
  return function (template) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return getTranslation(getLocaleData(getDB(), template, locale), args);
  };
};

/**
 * Initialization function. Should be run before trying to use {@link i10010n()}
 *
 * @param {Object} params
 * @param {DB} [params.db] - {@link DB} object, containing translation data
 * @param {Locale} [params.defaultLocale] - the {@link Locale} to fall back to
 * @param {Function} [params.logger] - function to use to log errors
 * @param {Function} [params.getTemplateData] - function used as substitute for DB, tries to get needed data before accessing DB. Receives {@link Template} and {@link Locale} as parameters
 * @param {Function} [params.addTemplateData] - this function is called when a template not found in the DB is encountered. Receives {@link Template} and {@link Locale} as parameters
 */
function init(params) {
  i10010n.db = params.db;
  i10010n.defaultLocale = params.defaultLocale;
  log.logger = params.logger || function () {};
  i10010n.getTemplateData = params.getTemplateData;
  i10010n.addTemplateData = params.addTemplateData;

  return i10010n;
}

/**
 * Returns config object for given template
 *
 * This function should be used as a tagging function for a template string:
 * <pre><code>
 * define `this is the ${"template"} I would like to define`
 * </code></pre>
 *
 * @param {Template} template array of strings that make up {@link Template} literal
 * @param {*} ...args values to insert into template literal
 * @returns {LocaleData} {@link LocaleData} object to be used in DB
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
 * Returns the i10010n ID for the given template
 *
 * @param {Template} template {@link Template} array
 * @returns {TemplateID} to be used as {@link TemplateID} in DB
 */
function ID(template) {
  return JSON.stringify(template);
}

/**
 * Gets i10010n DB, or empty object. Logs if no DB found
 *
 * @returns {DB} i10010n {@link DB}
 */
function getDB() {
  if (i10010n.db) {
    return i10010n.db;
  }

  log(_Error2.default.MISSING_DB, {}, formatLog("No DB found!"));

  return {};
}

/**
 * Gets data for given template from given DB
 *
 * @param {DB} db {@link DB} which contains all translation data
 * @param {Template} template {@link Template} array received by tagging function
 * @return {TemplateData} DB entry with key of {@link TemplateID} of {@link Template}
 */
function getTemplateData(db, template) {
  var templateData = db[ID(template)];
  if (templateData) {
    return templateData;
  }

  log(_Error2.default.MISSING_TEMPLATE_DATA, {
    template: template
  }, formatLog("No template data found for template:", template));

  return {};
}

/**
 * Gets entry from templateData for provided locale
 *
 * @param {DB} db {@link DB} containing translation data
 * @param {Template} template {@link Template} array given to tagging function
 * @param {Locale} locale {@link Locale} string
 * @returns {LocaleData} with {@link Template} for {@link Locale}, and value {@link Order}
 */
function getLocaleData(db, template, locale) {
  if (!locale) {
    log(_Error2.default.MISSING_LOCALE, {
      template: template
    }, formatLog("No locale specified for template:", template));
  }

  var templateData = void 0;

  try {
    templateData = i10010n.getTemplateData ? i10010n.getTemplateData(template, locale) : getTemplateData(db, template);
  } catch (e) {
    log(_Error2.default.USER_FUNCTION_FAILED, {
      template: template,
      locale: locale,
      user_function: "getTemplateData"
    }, formatLog("User getTemplateData function failed:", e));
  }

  if (templateData && templateData[locale]) {
    return templateData[locale];
  }

  if (locale && locale !== i10010n.defaultLocale) {
    if (i10010n.addTemplateData) {
      try {
        i10010n.addTemplateData(template, locale);
      } catch (e) {
        log(_Error2.default.USER_FUNCTION_FAILED, {
          template: template,
          locale: locale,
          user_function: "addTemplateData"
        }, formatLog("User addTemplateData function failed:", e));
      }
    }

    log(_Error2.default.MISSING_LOCALE_DATA, {
      template: template,
      locale: locale
    }, formatLog("No locale data for \"" + locale + "\" found in templateData:", templateData, "Falling back to base template:", template));
  }

  return { t: template };
}

/**
 * Puts together string for locale based on localeData and values
 *
 * @param {LocaleData} localeData {@link LocaleData} object
 * @param {Array<*>} values array of values to be inserted into template string
 * @returns {string} generated string in given locale
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
 * @param {Order} valueOrder array of numbers defining new {@link Order}
 * @param {number} index current index
 * @returns {number} index number
 */
function getIndex(valueOrder, index) {
  return valueOrder[index] === undefined ? index : valueOrder[index];
}

/**
 * Deals with arrays in values of template string
 *
 * @param {(string[]|string)} value array or string, the value to insert into the final string
 * @returns {string} joined array, otherwise original value
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
 * @param {string} stuff the stuff to log, which will be joined with \n
 * @returns {*} whatever the logging function returns. By default, undefined
 */
function formatLog() {
  for (var _len3 = arguments.length, stuff = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    stuff[_key3] = arguments[_key3];
  }

  return "i10010n: " + stuff.map(function (x) {
    return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && JSON.stringify(x) || x;
  }).join("\n");
}

function log(error, data, message) {
  log.logger(error, data, message);
}