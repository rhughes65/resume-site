
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import contentData from './src/content.json';
import { ProjectCard } from './components/ProjectCard';
import { Project, Experience, Education, Certification, TechnicalSkill } from './types';

// Cast content data to verified types
const EXPERIENCES = contentData.EXPERIENCES as Experience[];
const PROJECTS = contentData.PROJECTS as Project[];
const EDUCATION = contentData.EDUCATION as Education[];
const CERTIFICATIONS = contentData.CERTIFICATIONS as Certification[];
const TECHNICAL_SKILLS = contentData.TECHNICAL_SKILLS as TechnicalSkill[];

// Load all markdown files
const markdownFiles = import.meta.glob('./src/projects/*.md', { query: '?raw', import: 'default' });

type View = 'home' | 'projects' | 'jobs' | 'education' | 'project-detail' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
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
        // Default to home if no state
        setCurrentView('home');
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
    } else if (hash === '#education') {
      window.history.replaceState({ view: 'education' }, '', '#education');
      setCurrentView('education');
    } else if (hash === '#projects') {
      window.history.replaceState({ view: 'projects' }, '', '#projects');
      setCurrentView('projects');
    } else if (hash === '#contact') {
      window.history.replaceState({ view: 'contact' }, '', '#contact');
      setCurrentView('contact');
    } else {
      window.history.replaceState({ view: 'home' }, '', '');
      setCurrentView('home');
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
    const hash = target === 'home' ? '' : target === 'projects' ? '#projects' : `#${target}`;
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
            onClick={() => handleNavClick('home')}
          >
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              ROSALIE<span className="text-amber-500">_HUGHES</span>
            </h1>
            <div className="mono text-[10px] text-slate-400 group-hover:text-amber-500/50 transition-colors">
              MECHANICAL_AND_MECHATRONICS_ENGINEERING_STUDENT // V3.1
            </div>
          </div>

          <nav className="flex gap-2">
            <NavButton target="projects" label="Projects" code="PRJ" />
            <NavButton target="jobs" label="Experience" code="EXP" />
            <NavButton target="education" label="Education" code="EDU" />
            <NavButton target="contact" label="Contact" code="CNT" />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500 max-w-4xl mx-auto text-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl mb-12">
              <img
                src="/imgs/self2.JPG"
                alt="Headshot"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-tight">
              Engineering Student
            </h2>
            <h3 className="text-xl md:text-3xl text-amber-500 font-bold uppercase tracking-widest mb-8">
              Colorado State University
            </h3>

            <div className="max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-400 font-medium italic tracking-tight">
                "If you haven't failed yet, you haven't tried anything." <span className="not-italic text-sm block mt-2 text-slate-500">– Reshma Saujani</span>
              </p>
            </div>

            <div className="mt-12 flex gap-4">
              <button
                onClick={() => handleNavClick('projects')}
                className="px-8 py-3 bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors"
              >
                View Projects
              </button>
            </div>
          </div>
        )}

        {/* PROJECTS VIEW */}
        {(currentView === 'projects') && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-12 border-l-4 border-amber-500 pl-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Project Registry</h2>
              <p className="mono text-slate-400 mt-2">Project database and leadership experience.</p>
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
              <p className="mono text-slate-400 mt-2">Professional experience and technical roles.</p>
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

        {/* EDUCATION VIEW */}
        {currentView === 'education' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-12 border-l-4 border-amber-500 pl-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Education</h2>
              <p className="mono text-slate-400 mt-2">Academic credentials and certifications.</p>
            </div>

            <div className="space-y-12">
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className="p-8 bg-slate-900/40 border border-slate-800 relative">
                  <div className="absolute top-0 right-0 p-4 mono text-[10px] text-slate-600">EDU_{idx}</div>
                  <div className="mb-6">
                    <h3 className="text-3xl font-black uppercase leading-none">{edu.institution}</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                      <span className="text-amber-500 font-bold uppercase text-sm">{edu.degree}</span>
                      <span className="bg-slate-800 px-3 py-0.5 mono text-xs text-slate-300 border border-slate-700 w-fit">
                        {edu.period}
                      </span>
                    </div>
                    {edu.gpa && (
                      <div className="mono text-xs text-slate-500 mt-2">GRADE: {edu.gpa}</div>
                    )}
                  </div>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="space-y-3">
                      {edu.achievements.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start text-slate-400 text-lg uppercase font-medium">
                          <span className="w-1.5 h-1.5 bg-amber-500 mt-2 flex-shrink-0"></span>
                          <p className="leading-tight">{item}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {/* CERTIFICATIONS */}
              <div className="p-8 bg-slate-900/40 border border-slate-800 relative">
                <div className="absolute top-0 right-0 p-4 mono text-[10px] text-slate-600">CERTS</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-slate-200">Certifications</h3>
                <ul className="space-y-4">
                  {CERTIFICATIONS.map((cert, idx) => (
                    <li key={idx} className="flex flex-col gap-1">
                      <span className="text-amber-500 font-bold uppercase text-sm leading-tight">{cert.name}</span>
                      {cert.date && <span className="mono text-[10px] text-slate-500">{cert.date}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {/* TECHNICAL SKILLS */}
              <div className="p-8 bg-slate-900/40 border border-slate-800 relative">
                <div className="absolute top-0 right-0 p-4 mono text-[10px] text-slate-600">SKILLS</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-slate-200">Technical Skills</h3>
                <ul className="space-y-6">
                  {TECHNICAL_SKILLS.map((skill, idx) => (
                    <li key={idx}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 flex-shrink-0"></span>
                        <span className="font-bold uppercase text-slate-300">{skill.name}</span>
                      </div>
                      <p className="pl-3.5 text-xs mono text-slate-500 uppercase">{skill.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
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
                  className="w-full aspect-video object-cover border border-slate-800"
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
        {currentView === 'contact' && (
          <div className="max-w-xl mx-auto animate-in fade-in duration-500">
            <div className="mb-12 border-l-4 border-amber-500 pl-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Contact</h2>
              <p className="mono text-slate-400 mt-2">Send a clear transmission.</p>
            </div>

            <div className="flex flex-col gap-8">
              <p className="text-2xl text-slate-300 uppercase font-bold leading-tight">
                Interested in collaboration or have an opportunity?
              </p>

              <a
                href="mailto:rosaliejanhughes@yahoo.com"
                className="w-full py-6 bg-amber-500 text-black font-black text-xl uppercase tracking-widest hover:bg-amber-400 transition-colors text-center block"
              >
                Email Me Directly
              </a>

              <div className="mono text-xs text-slate-500 uppercase mt-4">
                // rosaliejanhughes@yahoo.com
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 px-6 py-12 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 mono text-[10px]">
          <div>© 2024 ROSALIE HUGHES // ALL SYSTEMS OPERATIONAL</div>
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/rosalie-hughes/" className="hover:text-amber-500">LINKEDIN</a>
            <a href="https://github.com/rhughes65" className="hover:text-amber-500">GITHUB</a>
            <a href="mailto:rosaliejanhughes@yahoo.com" className="hover:text-amber-500">EMAIL</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
