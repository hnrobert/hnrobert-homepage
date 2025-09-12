"use client";

import React from "react";
import { HobbyData } from "./types";
import { HobbyCardWithImage } from "./HobbyCardWithImage";
import { HobbyCardWithoutImage } from "./HobbyCardWithoutImage";

interface HobbiesListProps {
  hobbies: HobbyData[];
}

export const HobbiesList: React.FC<HobbiesListProps> = ({ hobbies }) => {
  const hobbiesWithImages = hobbies.filter((hobby) => hobby.hasImage);
  const hobbiesWithoutImages = hobbies.filter((hobby) => !hobby.hasImage);

  return (
    <div className="hobbies-container">
      {/* 有图片的爱好 */}
      {hobbiesWithImages.length > 0 && (
        <div className="hobbies-with-images-section">
          {hobbiesWithImages.map((hobby, index) => (
            <HobbyCardWithImage
              key={`with-image-${index}`}
              hobby={hobby}
              index={index}
            />
          ))}
        </div>
      )}

      {/* 没有图片的爱好 */}
      {hobbiesWithoutImages.length > 0 && (
        <div className="hobbies-without-images-section">
          <div className="simple-hobbies-grid">
            {hobbiesWithoutImages.map((hobby, index) => (
              <HobbyCardWithoutImage
                key={`without-image-${index}`}
                hobby={hobby}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
