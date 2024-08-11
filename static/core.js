function inferLocale() {
  const browserNavigation = new URL(window.location.href).searchParams.get(
    "lang",
  );
  let locale =
    browserNavigation ??
    (navigator.language || navigator.userLanguage) ??
    document.documentElement.lang ??
    "en";
  return locale;
}

const locale = inferLocale();

/** @type {Record<string,Record<string,string|string[]>[]>} */
const dictionaries = {
  "en-*": {
    "When you were born?": "When you were born?",
    Copy: "Copy",
    "Week of the year": "Week of the year",
    "Year of your life": "Year of your life",
    "Life Calendar": "Life Calendar",
    '["Week ",""]': ["Week ", ""],
    '["Copied"]': ["Copied"],
  },
  "es-*": {
    "When you were born?": "¿Cuando naciste?",
    Copy: "Copiar",
    "Week of the year": "Semana del año",
    "Year of your life": "Años de tu vida",
    "Life Calendar": "Calendario de la vida",
    '["Week ",""]': ["Semana ", ""],
    '["Copied"]': ["Copiado"],
  },
  get default() {
    return dictionaries["en-*"];
  },
  get en() {
    return dictionaries["en-*"];
  },
  get es() {
    return dictionaries["es-*"];
  },
};

/**
 * @param {string} locale
 */
const getDictionary = (locale) => {
  for (const [key, dictionary] of Object.entries(dictionaries)) {
    const keyExp = new RegExp(`^${key.replace("*", ".+")}$`, "i");
    if (keyExp.test(locale)) {
      return dictionary;
    }
  }
  return null;
};

const dictionary = getDictionary(locale) ?? dictionaries.default;

/** @type {typeof String.raw} */
export const l = (template, ...substitutions) => {
  const key = JSON.stringify(template);
  const localConfig = dictionary[key];

  if (localConfig === undefined) {
    console.log(`Missing translate to ${JSON.stringify(key)}`);
  }

  return String.raw(
    localConfig ? { raw: localConfig } : template,
    ...substitutions,
  );
};

export const lLiteral = (template) => {
  const key = template;
  const localConfig = dictionary[key];

  if (localConfig === undefined) {
    console.log(`Missing translate to ${JSON.stringify(key)}`);
  }

  return String.raw({ raw: [localConfig ?? template] });
};

/**
 * @example
 * l.of('key')
 */
l.of = lLiteral;

// Componentes

class TextLocale extends HTMLElement {
  connectedCallback() {
    this.innerText = l.of(`${this.dataset.text ?? this.innerText}`);
  }
}

window.customElements.define("text-locale", TextLocale);
