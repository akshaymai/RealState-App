// const array1 = [10, 20, 30, 40];

// const result=array1.reduce((accumulator,currentvalue,currentIndex)=>{

//     console.log({accumulator,currentvalue,currentIndex});
//     return accumulator+currentvalue
// },220)
// console.log(result);

// var compose = function (functions) {
//     return function (x) {
//       for(let i =functions.length ;i--; i>0){
//         console.log(functions[i]);
//         x = functions[i](x)
//       } 
    
//       return x
//     };
// }

// // const fn=compose([x => x + 1, x => 2 * x])
// // console.log(fn(3));

// const compose1=function (functions){
//     return function (x){
//         for(let i=functions.length;i--;i>0){
//             x=functions[i](x)
//         }
//         return x
//     }
// }
// const fn=compose1([x => x + 1, x => 2 * x])
// console.log(fn(3));

function once(fn) {
  console.log(fn);
  let called = false;
  let result;

  return function(...args) {
      if (!called) {
          result = fn(...args);
          called = true;
          return result;
      } else {
          return undefined;
      }
  };
}

// Example usage:
const fn = (a, b, c) => (a + b + c);
const calls = [[1, 2, 3], [2, 3, 6]];

const onceFn = once(fn);
const output = calls.map(args => {
  const value = onceFn(...args);
  return { calls: value !== undefined ? 1 : 0, value };
});

console.log(output);
