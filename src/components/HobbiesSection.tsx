"use client";

import React, { useEffect, useState } from "react";
import { configService } from "../data/config";
import { HobbiesList, HobbyData, processHobbiesData } from "./hobbies";

export const HobbiesSection: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [hobbiesData, setHobbiesData] = useState<HobbyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    try {
      const hobbies = configService.getHobbies();
      const processedData = processHobbiesData(hobbies);
      setHobbiesData(processedData);
    } catch (error) {
      console.error("Error loading hobbies data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isClient || isLoading) {
    return (
      <section className="section">
        <div className="glass-card">
          <h2 className="section-title">Hobbies</h2>
          <div className="hobbies-loading">Loading hobbies...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="hobbies">
      <div className="glass-card">
        <h2 className="section-title">Hobbies</h2>
        <HobbiesList hobbies={hobbiesData} />
      </div>
    </section>
  );
};
