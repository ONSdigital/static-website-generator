const DEFAULT_OPTIONS = {
  scope: "default",
  suffix: ".id",
  skipFirst: false,
};

export default function createUniqueIdFilter(data) {
  const counters = new Map();

  return function uniqueIdFilter(base, options = null) {
    base = !!base ? base : "";
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    const key = `${options.scope}/${base}`;
    const counter = (counters.get(key) ?? 0) + 1;
    counters.set(key, counter);

    if (options.skipFirst && counter === 1 && base !== "") {
      return base;
    }

    return `${base}${options.suffix ?? ""}.${counter}`;
  }
}
