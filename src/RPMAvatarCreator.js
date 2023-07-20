import React, { useEffect } from "react";
import { AvatarCreatorViewer } from "@readyplayerme/rpm-react-sdk";

function RPMAvatarCreator({ setAvatarURL, setIndex }) {
  const handleOnAvatarExported = async (url) => {
    console.log("Avatar URL: ", url);
    setAvatarURL(url);
    setIndex(1);
  };
  const avatarConfig = {
    meshLod: 2,
    quality: "medium",
    textureAtlas: 1024,
    morphTargets: ["ARKit"],
    pose: "A",
    useHands: false,
  };
  useEffect(() => {
    setAvatarURL("");
    // eslint-disable-next-line
  }, []);
  return (
    <div className="Tensor-module">
      <AvatarCreatorViewer
        subdomain="character-creator-cevzkt"
        onAvatarExported={handleOnAvatarExported}
        avatarConfig={avatarConfig}
      />
    </div>
  );
}

export default RPMAvatarCreator;
