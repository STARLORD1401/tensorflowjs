import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import exampleImage from "./assets/images/img_1.jpg";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

function TensorTest() {
  const [input, setInput] = useState({ age: 0, affordability: 1 });
  const [prediction, setPrediction] = useState("");
  const canvasRef = useRef(null);
  const loadTestModel = async () => {
    const model = await tf.loadGraphModel(
      "https://raw.githubusercontent.com/STARLORD1401/tensorflowjs/main/src/logistic_reg_model/model.json"
    );
    const prediction = model.predict(
      tf.tensor2d([input.age / 100, input.affordability], [1, 2])
    );
    setPrediction(prediction.dataSync()[0] >= 0.5 ? "Yes" : "No");

    // Get content image
    // let image = new Image(256, 256);
    // image.src = exampleImage;

    // // Convert image to tensor and add batch dimension
    // let tfTensor = tf.browser.fromPixels(image);
    // tfTensor = tfTensor.div(255.0);
    // tfTensor = tfTensor.expandDims(0);
    // tfTensor = tfTensor.cast("float32");

    // const pred = model.predict(tfTensor);
    // // Convert tensor to image
    // let outputTensor = pred.squeeze();

    // // Scale to range [0,1] from [-1,1]
    // outputTensor = outputTensor.mul(0.5);
    // outputTensor = outputTensor.add(0.5);
    // console.log(outputTensor.dataSync());
    // await tf.browser.toPixels(outputTensor, canvasRef.current);
  };
  useEffect(() => {
    // run();
  }, []);
  return (
    <div className="Tensor-module">
      <div className="Tensor-module-title">
        Will the person buy the insurance?
      </div>
      <div className="Input-box">
        <div className="Tensor-input-label">Age:</div>
        <input
          className="Tensor-input"
          type="number"
          value={input.age}
          onChange={(e) => {
            setInput({ ...input, age: e.target.value });
          }}
        />
        <div className="Tensor-input-label">Affordability:</div>
        <div className="Tensor-input-selector">
          <button
            onClick={(e) => {
              setInput({ ...input, affordability: 1 });
            }}
            className={`Tensor-selection-button ${
              input.affordability === 1 ? "Active" : "Inactive"
            }`}
          >
            Yes
          </button>
          <button
            onClick={(e) => {
              setInput({ ...input, affordability: 0 });
            }}
            className={`Tensor-selection-button ${
              input.affordability === 0 ? "Active" : "Inactive"
            }`}
          >
            No
          </button>
        </div>
        <button
          className="Tensor-btn"
          onClick={(e) => {
            loadTestModel();
          }}
        >
          <AutoAwesomeIcon />
        </button>
      </div>
      <div className="Prediction-box">prediction: {prediction}</div>
      {/* <canvas className="Tensor-canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default TensorTest;
