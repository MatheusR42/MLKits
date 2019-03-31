const outputs = [];
const predictedPoint = 0;
const k = 100;
const COL_POSITION = 0;
const COL_BUCKET = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const result = _.chain(outputs)
    //get bucket and distance between predicted point
    .map(row => [row[COL_BUCKET], distance(row[COL_POSITION], predictedPoint)])

    //sort by distance
    .sortBy(row => row[1])

    //get nearest values
    .slice(0, k)

    //count how many times each bucket appears
    .countBy(row => row[0])
    
    //get the bucket that repeat most
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();

  alert(`Droping from position ${predictedPoint} your ball probability will fall in ${result} bucket`);
}

function distance(point, point2) {
  return Math.abs(point - point2)
}


function splitDataSet(dataset, testCount) {
  const shuffled = _.shuffle(dataset);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}


