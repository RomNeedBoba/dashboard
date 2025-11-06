import React from "react";
import ProjectCard from "../components/ProjectCard.jsx"; // ✅ Import it!

const Projects = () => {
  const projects = [
    { name: "Project Apollo", likes: 250 },
    { name: "Project Orion", likes: 180 },
    { name: "Project Gemini", likes: 320 },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
