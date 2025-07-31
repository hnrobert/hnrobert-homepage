"use client";

import React from "react";
import { Parallax } from "react-scroll-parallax";
import { HobbyData } from "./types";

interface HobbyCardWithImageProps {
  hobby: HobbyData;
  index: number;
}

export const HobbyCardWithImage: React.FC<HobbyCardWithImageProps> = ({
  hobby,
  index,
}) => {
  const isEven = index % 2 === 0;

  return (
    <div className="hobby-card-with-image" data-hobby-id={`hobby-${index}`}>
      <Parallax
        translateY={[-20, 20]}
        easing="easeOut"
        speed={-1}
        shouldAlwaysCompleteAnimation={true}
        disabled={false}
        style={{ width: "100%" }}
      >
        <div className={`hobby-card ${isEven ? "card-left" : "card-right"}`}>
          {/* 背景图片 */}
          <div className="hobby-background-image">
            <img
              src={hobby.imagePath}
              alt={hobby.name}
              className="background-img"
              loading="lazy"
            />
            <div className="image-gradient-overlay"></div>
          </div>

          {/* 内容区域 */}
          <div className="hobby-content-area">
            <div className="hobby-text-content">
              <span className="hobby-emoji-large">{hobby.emoji}</span>
              <h3 className="hobby-title">{hobby.name}</h3>
            </div>
          </div>
        </div>
      </Parallax>
    </div>
  );
};
