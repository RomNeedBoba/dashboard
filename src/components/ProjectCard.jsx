// src/components/ProjectCard.jsx
import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{project.name}</h3>
      <p className="text-gray-600">{project.likes} Likes</p>
    </div>
  );
};

export default ProjectCard;
