const outputs = [];
const COL_POSITION = 0;
const COL_BUCKET = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);


  _.range(1, 101).forEach(k => {
    const acuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[COL_POSITION], k) === testPoint[COL_BUCKET])
      .size()
      .divide(testSetSize)
      .value();
    
      console.log(`With K=${k} the accuracy was ${acuracy}`);
  })
  
  // alert(`Droping from position ${predictedPoint} your ball probability will fall in ${result} bucket`);
}

function knn(data, predictedPoint, k) {
  return _.chain(data)
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
}

function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a,b]) => (a - b) ** 2)
    .sum()
    .value() ** .5
}


function splitDataSet(dataset, testCount) {
  const shuffled = _.shuffle(dataset);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}


