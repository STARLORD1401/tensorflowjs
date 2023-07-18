import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { drawConnectors } from "@mediapipe/drawing_utils/drawing_utils";
function FacialLandmarkDetectionMediaPipe() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;
  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#fff",
          lineWidth: 1,
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#fff",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#fff",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#fff",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#fff",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#fff",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#fff",
        });
      }
    }
    canvasCtx.restore();
  }

  // setInterval(())
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);
    // eslint-disable-next-line
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      // eslint-disable-next-line
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    // eslint-disable-next-line
  }, []);
  return (
    <center>
      <div className="Tensor-module">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius: "20px",
          }}
        />
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius: "20px",
          }}
        ></canvas>
      </div>
    </center>
  );
}

export default FacialLandmarkDetectionMediaPipe;
