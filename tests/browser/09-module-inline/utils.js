
export function makePromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
