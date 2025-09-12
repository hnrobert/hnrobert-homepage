"use client";

import React from "react";
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
      <div className="hobby-item-simple">
        <span className="hobby-emoji-simple">{hobby.emoji}</span>
        <span className="hobby-label-simple">{hobby.name}</span>
      </div>
    </div>
  );
};
