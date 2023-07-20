import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

function LogisticRegression() {
  const [input, setInput] = useState({ age: 0, affordability: 1 });
  const [prediction, setPrediction] = useState("");
  const loadTestModel = async () => {
    const model = await tf.loadGraphModel(
      "https://raw.githubusercontent.com/STARLORD1401/tensorflowjs/main/src/models/logistic_reg_model/model.json"
    );
    const prediction = model.predict(
      tf.tensor2d([input.age / 100, input.affordability], [1, 2])
    );
    setPrediction(prediction.dataSync()[0] >= 0.5 ? "Yes" : "No");
  };
  useEffect(() => {}, []);
  return (
    <div className="Tensor-module">
      <div className="Tensor-module-title">
        Will this person buy an insurance?
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

export default LogisticRegression;
