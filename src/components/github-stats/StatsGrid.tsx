'use client';

import React from 'react';
import { StatsCard } from './StatsCard';
import { ContributionsCard } from './ContributionsCard';

interface StatsGridProps {
  followers: number;
  totalStars: number;
  publicRepos: number;
  contributedRepos: number;
  totalCommits: number;
  contributionsData: {
    year: number;
    total: number;
    commits: number;
    issues: number;
    pullRequests: number;
    reviews: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  followers,
  totalStars,
  publicRepos,
  contributedRepos,
  totalCommits,
  contributionsData,
}) => {
  return (
    <div className="stats-main-grid">
      {/* 方框1: Followers & Total Stars */}
      <StatsCard
        items={[
          { number: followers, label: 'Followers' },
          { number: totalStars, label: 'Total Stars' },
        ]}
      />

      {/* 方框2: Public Repos & Contributed Repos */}
      <StatsCard
        items={[
          { number: publicRepos, label: 'Public Repos' },
          { number: contributedRepos, label: 'Contributed Repos' },
        ]}
      />

      {/* 方框3: Total Commits & Last Year Contributions */}
      <ContributionsCard
        totalCommits={totalCommits}
        contributionsData={contributionsData}
      />
    </div>
  );
};
