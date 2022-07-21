export default function setPropertyFilter(obj, key, value) {
  return {
    ...obj,
    [key]: value,
  };
}
