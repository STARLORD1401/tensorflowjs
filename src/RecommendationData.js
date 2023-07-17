import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

function RecommendationData() {
  const [input, setInput] = useState({ sports: 0, music: 0, politics: 0 });
  const [prediction, setPrediction] = useState("");
  const loadModel = async () => {
    const model = await tf.loadGraphModel(
      "https://raw.githubusercontent.com/STARLORD1401/tensorflowjs/main/src/recommendation_data_model/model.json"
    );
    let pred = model.predict(
      tf.tensor2d(
        [input.sports / 100, input.music / 100, input.politics / 100],
        [1, 3]
      )
    );
    pred = pred.argMax(1).dataSync()[0];
    setPrediction(pred === 0 ? "Music" : pred === 1 ? "Politics" : "Sports");
  };

  useEffect(() => {}, []);
  return (
    <div className="Tensor-module">
      <div className="Tensor-module-title">
        What is this person's area of interest?
      </div>
      <div className="Input-box">
        <div className="Tensor-input-label">Sports %</div>
        <input
          className="Tensor-input"
          type="number"
          value={input.sports}
          onChange={(e) => {
            setInput({ ...input, sports: e.target.value });
          }}
        />
        <div className="Tensor-input-label">Music %</div>
        <input
          className="Tensor-input"
          type="number"
          value={input.music}
          onChange={(e) => {
            setInput({ ...input, music: e.target.value });
          }}
        />
        <div className="Tensor-input-label">Politics %</div>
        <input
          className="Tensor-input"
          type="number"
          value={input.politics}
          onChange={(e) => {
            setInput({ ...input, politics: e.target.value });
          }}
        />
        <button
          className="Tensor-btn"
          onClick={(e) => {
            loadModel();
          }}
        >
          <AutoAwesomeIcon />
        </button>
      </div>
      <div className="Prediction-box">prediction: {prediction}</div>
    </div>
  );
}

export default RecommendationData;
