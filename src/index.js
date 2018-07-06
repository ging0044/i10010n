/**
 * Returns tagging function for given locale
 * 
 * @param locale string for name of desired locale
 * @returns function to tag template literal
 */
export const i10010n = (locale) =>
  (template, ...args) =>
      getTranslation(
        getLocaleData(
          getDB(),
          template,
          locale
        ),
        args
      );

/**
 * Initialization function
 * 
 * @param db i10010n DB
 * @param defaultLocale locale which just uses given template
 * @param logger function to log i10010n errors, if not supplied, console.error
 * @return actual i10010n function
 */
export function init(db, defaultLocale, logger) {
  i10010n.db = db;
  i10010n.defaultLocale = defaultLocale || "en";
  log.logger = logger || console.error;

  return i10010n;
}

/**
 * Returns config object for given template
 *
 * @param template array of strings that make up template literal
 * @param args values to insert into template literal
 * @returns {{t: *, v: *[]}}, object to be used in DB
 */
export function define(template, ...args) {
  return {
    t: template,
    v: args
  };
}

/**
 * Returns the i10010n ID for the given template
 *
 * @param template template array
 * @returns string to be used as index in DB
 */
export function ID(template) {
  return JSON.stringify(template);
}

/**
 * Gets i10010n DB, or empty object. Logs if no DB found
 * 
 * @returns i10010n DB
 */
function getDB() {
  if (i10010n.db) {
    return i10010n.db;
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
  const templateData = db[ID(template)];
  if (templateData) {
    return templateData;
  }

  log(
    "No template data found for template:",
    template
  );

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
  const templateData = getTemplateData(db, template);

  if (templateData[locale]) {
    return templateData[locale];
  }

  if (locale !== i10010n.defaultLocale) {
    log(
      "No locale data found in templateData:",
      templateData,
      "Falling back to base template:",
      template
    );
  }

  return { t: template }
}

/**
 * Puts together string for locale based on localeData and values
 * 
 * @param localeData object returned by {@link getLocaleData()}
 * @param values array of values made up of values inserted into template string
 * @returns generated string in given locale
 */
function getTranslation(localeData, values) {
  const { t, v = [] } = localeData;
  return t.reduce((acc, str, i) => {
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
  return valueOrder[index] === undefined
    ? index
    : valueOrder[index];
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
function log(...stuff) {
  log.logger(`\
i10010n: ${
stuff.map(x =>
  (
    typeof x === "object"
    &&
    JSON.stringify(x)
  ) || x)
  .join("\n")
}`);
}
