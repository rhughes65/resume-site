
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onClick(project)}
    >
      <div className="aspect-video w-full overflow-hidden border-b border-slate-800">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="mono text-[10px] text-amber-500/60 uppercase tracking-widest">
            {project.category}
          </span>
          <span className="mono text-[10px] text-slate-600">[{project.date}]</span>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 group-hover:text-amber-500 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm uppercase font-bold leading-tight line-clamp-3 mb-6">
          {project.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800">
          <div className="flex gap-2">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag} className="mono text-[9px] text-slate-600 uppercase">#{tag}</span>
            ))}
          </div>
          <span className="mono text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
            READ_MORE -&gt;
          </span>
        </div>
      </div>
    </div>
  );
};
