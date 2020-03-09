function getRandomSample(array, count) {
  var indices = [];
  var result = new Array(count);
  for (let i = 0; i < count; i++) {
    let j = Math.floor(Math.random() * (array.length - i) + i);
    result[i] = array[indices[j] === undefined ? j : indices[j]];
    indices[j] = indices[i] === undefined ? i : indices[i];
  }
  return result;
}

export { getRandomSample };
