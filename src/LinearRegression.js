import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
function LinearRegression() {
  const [input, setInput] = useState(0);
  const [prediction, setPrediction] = useState(0);
  const trainModel = async () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
    const x = tf.tensor2d([1, 2, 3, 4, 5, 2, 8], [7, 1]);
    const y = tf.tensor2d([2, 4, 6, 8, 10, 4, 16], [7, 1]);
    await model.fit(x, y, { epochs: 700, shuffle: true });
    setPrediction(
      Math.ceil(
        model.predict(tf.tensor2d([parseInt(input)], [1, 1])).dataSync()
      )
    );
  };
  useEffect(() => {
    // eslint-disable-next-line
  }, []);
  return (
    <div className="Tensor-module">
      <div className="Input-box">
        <input
          className="Tensor-input"
          type="number"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="Tensor-btn"
          onClick={(e) => {
            trainModel();
          }}
        >
          <AutoAwesomeIcon />
        </button>
      </div>
      <div className="Prediction-box">prediction: {prediction}</div>
    </div>
  );
}

export default LinearRegression;
