import { useRef, useEffect, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
import "./App.css";
function FacialLandmarkDetection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamSwitch, setWebcamSwitch] = useState(false);
  useEffect(() => {
    runFaceMesh();
    console.log(canvasRef.current ? true : false);

    // eslint-disable-next-line
  }, [webcamSwitch]);

  const runFaceMesh = async () => {
    const model = facemesh.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    };
    const detector = await facemesh.createDetector(model, detectorConfig);
    setInterval(() => {
      detect(detector);
    }, 10);
  };

  const detect = async (detector) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current !== null
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const face = await detector.estimateFaces(video);
      const ctx = canvasRef.current?.getContext("2d");
      ctx &&
        requestAnimationFrame(() => {
          drawMesh(face, ctx);
        });
    }
  };
  return (
    <div className="Tensor-module" style={{ position: "relative" }}>
      <div className="Tensor-webcam-module">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            zIndex: 9,
            width: 640,
            height: 480,
            borderRadius: "20px",
          }}
        />
        {webcamSwitch && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              backdropFilter: "blur(5px)",
              zIndex: 9,
              width: 640,
              height: 480,
              borderRadius: "20px",
            }}
          />
        )}
      </div>

      <div className="Tensor-input-selector">
        <button
          onClick={(e) => {
            setWebcamSwitch(true);
          }}
          className={`Tensor-selection-button ${
            webcamSwitch ? "Active" : "Inactive"
          }`}
        >
          ON
        </button>
        <button
          onClick={(e) => {
            setWebcamSwitch(false);
          }}
          className={`Tensor-selection-button ${
            !webcamSwitch ? "Active" : "Inactive"
          }`}
        >
          OFF
        </button>
      </div>
    </div>
  );
}

export default FacialLandmarkDetection;
