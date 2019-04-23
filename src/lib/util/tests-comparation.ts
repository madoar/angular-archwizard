
export function isPrimitivesArraysMatchAtAnyOrder(actualArray: any[], expectedArray: any[]) {
  // check if every element of array2 is element of array1
  // to ensure [1, 1] !== [1, 2]
  expectedArray.forEach(x => expect(actualArray).toContain(x));

  // check if every element of array1 is element of array2
  // to ensure [1, 2] !== [1, 1]
  actualArray.forEach(x => expect(expectedArray).toContain(x));

  // check if they have equal length to ensure [1] !== [1, 1]
  expect(actualArray.length).toBe(expectedArray.length);
}
