let nextId = 1;

export default function uniqueIdFilter(base) {
  return `${!!base ? base : ""}.id.${nextId++}`;
}
