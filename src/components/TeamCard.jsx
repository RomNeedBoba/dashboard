// src/components/TeamCard.jsx
import React from "react";

const TeamCard = ({ team }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{team.name}</h3>
      <p className="text-gray-600">{team.likes} Likes</p>
    </div>
  );
};

export default TeamCard;
