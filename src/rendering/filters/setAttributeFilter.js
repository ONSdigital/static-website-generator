export default function setAttributeFilter(obj, key, value) {
  return {
    ...obj,
    [key]: value,
  };
}
