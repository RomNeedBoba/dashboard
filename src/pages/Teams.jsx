import React from "react";
import TeamCard from "../components/TeamCard.jsx"; // ✅ Import the component

const Teams = () => {
  const teams = [
    { name: "Team Alpha", likes: 120 },
    { name: "Team Beta", likes: 95 },
    { name: "Team Gamma", likes: 200 },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <div className="grid grid-cols-3 gap-4">
        {teams.map((team, idx) => (
          <TeamCard key={idx} team={team} />
        ))}
      </div>
    </div>
  );
};

export default Teams;
