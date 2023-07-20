import React, { useState } from "react";
import "./App.css";
import FacialLandmarkDetection from "./FacialLandmarkDetection";
import LinearRegression from "./LinearRegression";
import RecommendationData from "./RecommendationData";
import LogisticRegression from "./LogisticRegression";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import FacialLandmarkDetectionMediaPipe from "./FacialLandmarkDetectionMediaPipe";

import RPMHandler from "./RPMHandler";
function App() {
  const tfModules = [
    <RPMHandler />,
    <FacialLandmarkDetectionMediaPipe />,
    <FacialLandmarkDetection />,
    <LinearRegression />,
    <LogisticRegression />,
    <RecommendationData />,
  ];
  const [index, setIndex] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <h2>Tensorflow JS App </h2>
        <div className="Tensor-input-selector">
          <button
            onClick={(e) => {
              setIndex(index === 0 ? tfModules.length - 1 : index - 1);
            }}
            className={`Tensor-selection-button Inactive`}
          >
            <NavigateBeforeIcon />
          </button>
          <button
            onClick={(e) => {
              setIndex(index === tfModules.length - 1 ? 0 : index + 1);
            }}
            className={`Tensor-selection-button Inactive`}
          >
            <NavigateNextIcon />
          </button>
        </div>
        {tfModules[index]}
      </header>
    </div>
  );
}

export default App;
