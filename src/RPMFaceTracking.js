import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { Color, Euler, Matrix4 } from "three";
import { useGLTF } from "@react-three/drei";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
var faceLandmarker;
var results;
var video;
let lastVideoTime;
let rotation;
var headMesh;
let blendShapes = [];
function RPMFaceTracking({ avatarURL, setIndex }) {
  const webcamRef = useRef(null);
  useEffect(() => {
    setup();
    // eslint-disable-next-line
  }, [faceLandmarker]);
  const setup = async () => {
    if (webcamRef.current !== null) {
      video = webcamRef.current.video;
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        numFaces: 1,
      });
      video && detect();
    }
  };
  const detect = () => {
    let nowInMs = Date.now();
    try {
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, nowInMs);
        if (
          results.facialTransformationMatrixes &&
          results.facialTransformationMatrixes.length > 0 &&
          results.faceBlendshapes &&
          results.faceBlendshapes.length > 0
        ) {
          const matrix = new Matrix4().fromArray(
            results.facialTransformationMatrixes[0]?.data
          );
          rotation = new Euler().setFromRotationMatrix(matrix);
          blendShapes = results.faceBlendshapes[0].categories;
        }
      }
      requestAnimationFrame(detect);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="Tensor-module" style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className="Tensor-btn"
          onClick={(e) => {
            setIndex(0);
          }}
        >
          <ArrowBackIcon style={{ fontSize: "30px" }} />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          height: "480px",
          width: "640px",
        }}
      >
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            height: "480px",
            width: "640px",
            borderRadius: "20px",
          }}
        />
        <Canvas
          style={{
            position: "absolute",
            backgroundImage: "linear-gradient(#c561fb, #61dafb)",
            height: "70vh",
            width: "80vw",
            borderRadius: "20px",
          }}
          camera={{
            fov: 35,
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight
            position={[1, 1, 1]}
            color={new Color(0.38, 0.85, 1)}
            intensity={0.5}
          />
          <pointLight
            position={[-1, 0, 1]}
            color={new Color(0.5, 0.1, 1)}
            intensity={0.5}
          />
          <Avatar avatarURL={avatarURL} />
        </Canvas>
      </div>
    </div>
  );
}

export default RPMFaceTracking;

function Avatar({ avatarURL }) {
  const avatar = useGLTF(`${avatarURL}`);
  const { nodes } = useGraph(avatar.scene);
  useEffect(() => {
    headMesh = nodes.Wolf3D_Avatar;
    console.log(avatar.scene);
    //eslint-disable-next-line
  }, [nodes, avatarURL]);
  useFrame((_, delta) => {
    blendShapes.forEach((blendShape) => {
      let index = headMesh?.morphTargetDictionary[blendShape.categoryName];
      if (index >= 0) {
        headMesh.morphTargetInfluences[index] = blendShape.score;
      }
    });
    nodes?.Head.rotation.set(rotation?.x, rotation?.y, rotation?.z);
    nodes?.Neck.rotation.set(
      rotation?.x / 5 + 0.3,
      rotation?.y / 5,
      rotation?.z / 5
    );
    nodes?.Spine2.rotation.set(
      rotation?.x / 10,
      rotation?.y / 10,
      rotation?.z / 10
    );
  });

  return (
    <primitive object={avatar.scene} position={[0, -1.67, 0.4]}></primitive>
  );
}
