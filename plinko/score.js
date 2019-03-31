const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const k = 10;
  
  _.range(0, 3).forEach(feature => {
    const data = outputs.map(row => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSetSize);
    
    const acuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();
    
      console.log(`With feature ${feature} the accuracy was ${acuracy}`);
  })
  
  // alert(`Droping from position ${predictedPoint} your ball probability will fall in ${result} bucket`);
}

function knn(trainingSet, point, k) {
  return _.chain(trainingSet)
    //get bucket and distance between predicted point
    .map(row => {
      return [
        distance(_.initial(row), point),
        _.last(row),
      ]
    })
    //sort by distance
    .sortBy(row => _.first(row))

    //get nearest values
    .slice(0, k)

    //count how many times each bucket appears
    .countBy(row => _.last(row))
    
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


function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min)
    }
  }

  return clonedData;
}