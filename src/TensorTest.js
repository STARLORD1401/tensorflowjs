import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import exampleImage from "./assets/images/img_1.jpg";
function TensorTest() {
  const canvasRef = useRef(null);
  const loadTestModel = async () => {
    const model = await tf.loadGraphModel(
      "https://raw.githubusercontent.com/STARLORD1401/tensorflowjs/main/src/tfjs_model/model.json"
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
    await tf.browser.toPixels(outputTensor, canvasRef.current);
  };
  useEffect(() => {
    loadTestModel();
    // run();
  }, []);
  return (
    <div className="Tensor-module">
      <canvas className="Tensor-canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default TensorTest;
