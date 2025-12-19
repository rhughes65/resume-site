
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import contentData from './src/content.json';
import { ProjectCard } from './components/ProjectCard';
import { Project, Experience } from './types';

// Cast content data to verified types
const EXPERIENCES = contentData.EXPERIENCES as Experience[];
const PROJECTS = contentData.PROJECTS as Project[];

// Load all markdown files
const markdownFiles = import.meta.glob('./src/projects/*.md', { query: '?raw', import: 'default' });

type View = 'projects' | 'jobs' | 'project-detail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectContent, setProjectContent] = useState<string>('');

  // Handle browser history navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        if (state.view === 'project-detail' && state.projectId) {
          const project = PROJECTS.find(p => p.id === state.projectId);
          if (project) {
            setSelectedProject(project);
            setCurrentView('project-detail');
            loadMockProjectContent(project); // Reuse separate loading logic
          }
        } else if (state.view) {
          setCurrentView(state.view);
          setSelectedProject(null);
        }
      } else {
        // Default to projects if no state (e.g. initial load or empty history)
        setCurrentView('projects');
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial load handling based on hash
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const projectId = hash.replace('#project-', '');
      const project = PROJECTS.find(p => p.id === projectId);
      if (project) {
        // Replace initial state so back button works correctly
        window.history.replaceState({ view: 'project-detail', projectId }, '', hash);
        setSelectedProject(project);
        setCurrentView('project-detail');
        loadMockProjectContent(project);
      }
    } else if (hash === '#jobs') {
      window.history.replaceState({ view: 'jobs' }, '', '#jobs');
      setCurrentView('jobs');
    } else {
      window.history.replaceState({ view: 'projects' }, '', '#projects');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadMockProjectContent = async (project: Project) => {
    setProjectContent(''); // Reset content while loading
    if (project.markdownFile) {
      try {
        const loadMarkdown = markdownFiles[`./src/projects/${project.markdownFile}`];
        if (loadMarkdown) {
          const content = await loadMarkdown() as string;
          setProjectContent(content);
        } else {
          setProjectContent(project.description);
        }
      } catch (e) {
        console.error("Failed to load markdown", e);
        setProjectContent(project.description);
      }
    } else {
      setProjectContent(project.description);
    }
  }

  const handleProjectClick = async (project: Project) => {
    window.history.pushState({ view: 'project-detail', projectId: project.id }, '', `#project-${project.id}`);
    setSelectedProject(project);
    setCurrentView('project-detail');
    window.scrollTo(0, 0);
    loadMockProjectContent(project);
  };

  const handleNavClick = (target: View) => {
    const hash = target === 'projects' ? '#projects' : `#${target}`;
    window.history.pushState({ view: target }, '', hash);
    setCurrentView(target);
    setSelectedProject(null);
  };

  const NavButton = ({ target, label, code }: { target: View, label: string, code: string }) => (
    <button
      onClick={() => handleNavClick(target)}
      className={`px-6 py-2 mono text-xs uppercase tracking-widest border transition-all ${currentView === target || (target === 'projects' && currentView === 'project-detail')
        ? 'bg-amber-500 text-black border-amber-500 font-bold'
        : 'border-slate-800 text-slate-400 hover:border-amber-500/50 hover:text-slate-200'
        }`}
    >
      <span className="mr-2 opacity-50">{code}</span> {label}
    </button>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div
            className="cursor-pointer group"
            onClick={() => handleNavClick('projects')}
          >
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              ROSALIE<span className="text-amber-500">_HUGHES</span>
            </h1>
            <div className="mono text-[10px] text-slate-400 group-hover:text-amber-500/50 transition-colors">
              CORE_SYSTEMS_ENGINEER // V3.1
            </div>
          </div>

          <nav className="flex gap-2">
            <NavButton target="projects" label="Projects" code="PRJ" />
            <NavButton target="jobs" label="Experience" code="EXP" />
            <a
              href="mailto:rosaliejanhughes@yahoo.com"
              className="px-6 py-2 mono text-xs uppercase border border-slate-800 text-slate-300 hover:bg-slate-900 transition-all flex items-center"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* PROJECTS VIEW */}
        {(currentView === 'projects') && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-12 border-l-4 border-amber-500 pl-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">System Registry</h2>
              <p className="mono text-slate-400 mt-2">Active project database and hardware documentation.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* JOBS VIEW */}
        {currentView === 'jobs' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-12 border-l-4 border-amber-500 pl-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Service Record</h2>
              <p className="mono text-slate-400 mt-2">Professional mission history and technical roles.</p>
            </div>

            <div className="space-y-12">
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} className="p-8 bg-slate-900/40 border border-slate-800 relative">
                  <div className="absolute top-0 right-0 p-4 mono text-[10px] text-slate-600">MOD_{idx}</div>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <h3 className="text-3xl font-black uppercase leading-none">{exp.role}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-amber-500 font-bold uppercase text-sm">{exp.company}</span>
                        <span className="text-slate-500 mono text-xs">// {exp.location}</span>
                      </div>
                    </div>
                    <div className="bg-slate-800 px-4 py-1 mono text-xs text-slate-300 border border-slate-700">
                      {exp.period}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-6">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start text-slate-400 text-lg uppercase font-medium">
                        <span className="w-1.5 h-1.5 bg-amber-500 mt-2 flex-shrink-0"></span>
                        <p className="leading-tight">{item}</p>
                      </li>
                    ))}
                  </ul>
                  {exp.images && exp.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {exp.images.map((img, i) => (
                        <div key={i} className="bg-slate-950 p-1 border border-slate-800">
                          <img
                            src={img}
                            alt={`${exp.company} work ${i + 1}`}
                            className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECT DETAIL VIEW */}
        {currentView === 'project-detail' && selectedProject && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => handleNavClick('projects')}
              className="mb-8 mono text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2"
            >
              [ BACK_TO_REGISTRY ]
            </button>

            <div className="border border-slate-800 bg-slate-900/40 p-1">
              <div className="bg-slate-950 p-2">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full aspect-video object-cover grayscale brightness-75 border border-slate-800"
                />
              </div>
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="mono text-xs bg-amber-500 text-black px-2 py-0.5 font-bold uppercase">
                  {selectedProject.category}
                </span>
                <span className="mono text-xs text-slate-500">ID: {selectedProject.id.toUpperCase()}</span>
                <span className="mono text-xs text-slate-500">DATE: {selectedProject.date}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-none">
                {selectedProject.title}
              </h1>

              <div className="p-8 border-l-4 border-slate-800 bg-slate-900/20 mb-12">
                <p className="text-2xl text-slate-200 uppercase font-bold leading-tight tracking-tight italic">
                  {selectedProject.description}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-slate-400 space-y-8 uppercase text-lg font-medium leading-relaxed">
                <ReactMarkdown>{projectContent}</ReactMarkdown>
              </div>

              <div className="mt-20 pt-10 border-t border-slate-800">
                <h4 className="mono text-xs text-slate-500 mb-6 uppercase tracking-widest">Technical Tags</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 mono text-xs uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 px-6 py-12 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 mono text-[10px]">
          <div>© 2024 ROSALIE HUGHES // ALL SYSTEMS OPERATIONAL</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-amber-500">LINKEDIN</a>
            <a href="#" className="hover:text-amber-500">GITHUB</a>
            <a href="mailto:rosaliejanhughes@yahoo.com" className="hover:text-amber-500">EMAIL</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
