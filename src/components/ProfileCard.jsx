// src/components/ProfileCard.jsx
import React from "react";

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default ProfileCard;
