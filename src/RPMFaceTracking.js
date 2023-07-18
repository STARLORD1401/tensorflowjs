import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import LinkIcon from "@mui/icons-material/Link";
import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { Color, Euler, Matrix4, SkinnedMesh } from "three";
import { useGLTF } from "@react-three/drei";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
var faceLandmarker;
var results;
var video;
var lastVideoTime = -1;
let rotation;
var headMesh;
let blendShapes = [];
function RPMFaceTracking() {
  const webcamRef = useRef(null);
  useEffect(() => {
    setup();
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
      detect();
    }
  };
  const detect = () => {
    let nowInMs = Date.now();
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
  };
  return (
    <div className="Tensor-module">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="Tensor-input-label">
          Enter your Ready Player Me URL:
        </div>
        <input className="Tensor-input" />
        <button className="Tensor-btn">
          <LinkIcon style={{ fontSize: "30px" }} />
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
            height: "480px",
            width: "640px",
            backgroundColor: "black",
            borderRadius: "20px",
          }}
          camera={{
            fov: 25,
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight
            position={[1, 1, 1]}
            color={new Color(1, 1, 0)}
            intensity={0.5}
          />
          <pointLight
            position={[-1, 0, 1]}
            color={new Color(0.5, 0.1, 1)}
            intensity={0.5}
          />
          <Avatar />
        </Canvas>
      </div>
    </div>
  );
}

export default RPMFaceTracking;

function Avatar() {
  const avatar = useGLTF(
    "https://models.readyplayer.me/64b657f0356e99f2cb4ccae6.glb?morphTargets=ARKit&textureAtlas=1024"
  );
  const { nodes } = useGraph(avatar.scene);
  useEffect(() => {
    headMesh = nodes.Wolf3D_Avatar;
  }, [nodes]);

  useFrame((_, delta) => {
    blendShapes?.forEach((blendShape) => {
      let index = headMesh.morphTargetDictionary[blendShape.categoryName];
      if (index >= 0) {
        headMesh.morphTargetInfluences[index] = blendShape.score;
      }
    });
    nodes.Head.rotation.set(rotation?.x, rotation?.y, rotation?.z);
    nodes.Neck.rotation.set(
      rotation?.x / 5 + 0.3,
      rotation?.y / 5,
      rotation?.z / 5
    );
    nodes.Spine2.rotation.set(
      rotation?.x / 10,
      rotation?.y / 10,
      rotation?.z / 10
    );
  });

  return <primitive object={avatar.scene} position={[0, -1.7, 4]}></primitive>;
}
