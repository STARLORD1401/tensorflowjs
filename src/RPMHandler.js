import React, { useState } from "react";
import RPMAvatarCreator from "./RPMAvatarCreator";
import RPMFaceTracking from "./RPMFaceTracking";
function RPMHandler() {
  const [index, setIndex] = useState(0);
  const [avatarURL, setAvatarURL] = useState("");
  const RPMmodules = [
    <RPMAvatarCreator setIndex={setIndex} setAvatarURL={setAvatarURL} />,
    <RPMFaceTracking avatarURL={avatarURL} setIndex={setIndex} />,
  ];
  return <div>{RPMmodules[index]}</div>;
}

export default RPMHandler;
