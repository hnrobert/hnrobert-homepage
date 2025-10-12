'use client';

import React from 'react';

interface ContributionsData {
  year: number;
  total: number;
  commits: number;
  issues: number;
  pullRequests: number;
  reviews: number;
}

interface ContributionsCardProps {
  totalCommits: number;
  contributionsData: ContributionsData;
}

export const ContributionsCard: React.FC<ContributionsCardProps> = ({
  totalCommits,
  contributionsData,
}) => {
  return (
    <div className="stat-box stat-box-wide">
      <div className="stat-item">
        <div className="stat-number">{totalCommits.toLocaleString()}</div>
        <div className="stat-label">Total Commits</div>
      </div>
      <div className="contributions-detail">
        <div className="contributions-title">Contributions Last Year</div>
        <div className="contributions-grid">
          <div className="contribution-item">
            <span className="contribution-number">
              {contributionsData.commits.toLocaleString()}
            </span>
            <span className="contribution-label">Commits</span>
          </div>
          <div className="contribution-item">
            <span className="contribution-number">
              {contributionsData.pullRequests.toLocaleString()}
            </span>
            <span className="contribution-label">PRs</span>
          </div>
          <div className="contribution-item">
            <span className="contribution-number">
              {contributionsData.issues.toLocaleString()}
            </span>
            <span className="contribution-label">Issues</span>
          </div>
          <div className="contribution-item">
            <span className="contribution-number">
              {contributionsData.reviews.toLocaleString()}
            </span>
            <span className="contribution-label">Reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};
