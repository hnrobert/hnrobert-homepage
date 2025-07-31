"use client";

import React from "react";
import { Parallax } from "react-scroll-parallax";
import { HobbyData } from "./types";

interface HobbyCardWithoutImageProps {
  hobby: HobbyData;
  index: number;
}

export const HobbyCardWithoutImage: React.FC<HobbyCardWithoutImageProps> = ({
  hobby,
  index,
}) => {
  return (
    <div
      className="hobby-card-without-image"
      data-hobby-id={`hobby-no-image-${index}`}
    >
      <Parallax
        translateY={[-30, 30]}
        opacity={[0, 1]}
        easing="easeOut"
        speed={-2}
        shouldAlwaysCompleteAnimation={true}
        disabled={false}
        style={{ width: "100%" }}
      >
        <div className="hobby-item-simple">
          <span className="hobby-emoji-simple">{hobby.emoji}</span>
          <span className="hobby-label-simple">{hobby.name}</span>
        </div>
      </Parallax>
    </div>
  );
};
