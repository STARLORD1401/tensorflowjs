import React from "react";
import "./App.css";
import FacialLandmarkDetection from "./FacialLandmarkDetection";
import LinearRegression from "./LinearRegression";
import TensorTest from "./TensorTest";
import RecommendationData from "./RecommendationData";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Tensorflow JS App </h2>
        {/* <FacialLandmarkDetection /> */}
        {/* <LinearRegression /> */}
        {/* <TensorTest /> */}
        <RecommendationData />
      </header>
    </div>
  );
}

export default App;
