export function stage(text) {
  console.log(text);
}

export function step(text) {
  console.log(`  ${text}`);
}

export function error(err) {
  console.error(err);
}
