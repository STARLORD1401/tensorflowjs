import * as Papa from "papaparse";
import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import exampleImage from "./assets/images/img_1.jpg";
import { draw } from "@tensorflow/tfjs-core/dist/ops/browser";
function TensorTest() {
  const canvasRef = useRef(null);
  // Papa.parsePromise = function (file) {
  //   return new Promise(function (complete, error) {
  //     Papa.parse(file, {
  //       header: true,
  //       download: true,
  //       dynamicTyping: true,
  //       complete,
  //       error,
  //     });
  //   });
  // };
  // const oneHot = (outcome) => Array.from(tf.oneHot(outcome, 2).dataSync());
  // const prepareData = async () => {
  //   const csv = await Papa.parsePromise(
  //     "https://raw.githubusercontent.com/curiousily/Logistic-Regression-with-TensorFlow-js/master/src/data/diabetes.csv"
  //   );

  //   return csv.data;
  // };
  // const createDataSets = (data, features, testSize, batchSize) => {
  //   const X = data.map((r) =>
  //     features.map((f) => {
  //       const val = r[f];
  //       return val === undefined ? 0 : val;
  //     })
  //   );
  //   const y = data.map((r) => {
  //     const outcome = r.Outcome === undefined ? 0 : r.Outcome;
  //     return oneHot(outcome);
  //   });

  //   const splitIdx = parseInt((1 - testSize) * data.length, 10);

  //   const ds = tf.data
  //     .zip({ xs: tf.data.array(X), ys: tf.data.array(y) })
  //     .shuffle(data.length, 42);

  //   return [
  //     ds.take(splitIdx).batch(batchSize),
  //     ds.skip(splitIdx + 1).batch(batchSize),
  //     tf.tensor(X.slice(splitIdx)),
  //     tf.tensor(y.slice(splitIdx)),
  //   ];
  // };
  // const trainLogisticRegression = async (featureCount, trainDs, validDs) => {
  //   const model = tf.sequential();
  //   model.add(
  //     tf.layers.dense({
  //       units: 2,
  //       activation: "softmax",
  //       inputShape: [featureCount],
  //     })
  //   );

  //   const optimizer = tf.train.adam(0.001);
  //   model.compile({
  //     optimizer: optimizer,
  //     loss: "binaryCrossentropy",
  //     metrics: ["accuracy"],
  //   });
  //   const trainLogs = [];
  //   console.log("Training...");
  //   await model.fitDataset(trainDs, {
  //     epochs: 5,
  //     validationData: validDs,
  //     callbacks: {
  //       onEpochEnd: async (epoch, logs) => {
  //         trainLogs.push(logs);
  //       },
  //     },
  //   });
  //   return model;
  // };
  // const run = async () => {
  //   const data = await prepareData();
  //   const features = ["Glucose", "Age", "Insulin", "BloodPressure"];
  //   const [trainDs, validDs, xTest, yTest] = createDataSets(
  //     data,
  //     features,
  //     0.1,
  //     16
  //   );
  //   const model = await trainLogisticRegression(
  //     features.length,
  //     trainDs,
  //     validDs
  //   );
  //   console.log(xTest.dataSync());
  //   const preds = model.predict(xTest).argMax(1);
  //   console.log(preds.dataSync());
  // };
  const loadTestModel = async () => {
    const model = await tf.loadGraphModel(
      "https://raw.githubusercontent.com/daved01/tensorflowjs-web-app-demo/main/models/fullyConvolutionalModelTfjs/model.json"
    );
    // Get content image
    let image = new Image(256, 256);
    image.src = exampleImage;

    // Convert image to tensor and add batch dimension
    let tfTensor = tf.browser.fromPixels(image);
    tfTensor = tfTensor.div(255.0);
    tfTensor = tfTensor.expandDims(0);
    tfTensor = tfTensor.cast("float32");

    const pred = model.predict(tfTensor);
    // Convert tensor to image
    let outputTensor = pred.squeeze();

    // Scale to range [0,1] from [-1,1]
    outputTensor = outputTensor.mul(0.5);
    outputTensor = outputTensor.add(0.5);
    console.log(outputTensor.dataSync());
    canvasRef.current.width = "256px";
    canvasRef.current.height = "256px";
    const canvas = document.getElementById("canvas");
    await tf.browser.toPixels(outputTensor, canvas);
    // await tf.browser.toPixels(outputTensor, canvasRef.current.getContext("2d"));
  };
  useEffect(() => {
    loadTestModel();
    // run();
  }, []);
  return (
    <div className="Tensor-module">
      <canvas className="Tensor-canvas" id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default TensorTest;
