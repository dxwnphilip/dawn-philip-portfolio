import React, { useState, useEffect } from 'react';

// --- Type Definitions ---
type View = 'home' | 'contact' | 'resume' | 'work';

interface ProjectMedia {
  type: 'image' | 'video' | 'gif' | 'color';
  value: string;
  alt: string;
  width?: string;  // For homepage carousel
  height?: string; // For homepage carousel
}

interface Project {
  id: number;
  title: string;
  tags: string[];
  description: string;
  media: ProjectMedia[];
}

// --- Custom Hook for Dark Mode ---
const useDarkMode = (): [string, () => void] => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};

// --- Theme Toggle Component ---
const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 ease-in-out text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};

// --- Data for Projects (Single Source of Truth) ---
const projects: Project[] = [
  {
    id: 1,
    title: 'ഒരു song, ഇരു vibe',
    tags: ['Motion Graphics', 'Illustration'],
    description:  "This motion graphics element is designed as a powerful visual metaphor for how music's meaning can be transformed.",
    media: [
      { type: 'gif', value: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif', alt: 'Abstract motion graphic', width: 'w-64 h-48 md:w-80 md:h-64', height: '' }
    ],
  },
  {
    id: 2,
    title: 'Work 2',
    tags: ['Video Editing', 'Illustration'],
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    media: [
      { type: 'image', value: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop', alt: 'Work 2 sample image', width: 'w-64 h-32 md:w-96 md:h-56', height: '' }
    ],
  },
   {
    id: 3,
    title: 'Work 3',
    tags: ['Title animation', 'Graphic Design'],
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    media: [
      { type: 'video', value: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-a-man-with-head-down-4290-large.mp4', alt: 'Work 3 sample video', width: 'w-24 h-64 md:w-32 md:h-80', height: '' }
    ],
  },
  {
    id: 4,
    title: 'Work 4',
    tags: ['Photography', 'Marketing campaign'],
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    media: [
      { type: 'gif', value: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif', alt: 'Abstract swirling animation', width: 'w-64 h-48 md:w-80 md:h-64', height: '' }
    ],
  },
];

// --- Sub-Components ---

/**
 * Renders the home page with a dynamic work carousel that activates on hover.
 * The carousel is built directly from the projects list.
 */
const HomePage: React.FC<{ setView: (view: View) => void; projects: Project[] }> = ({ setView, projects }) => {
  // Use the first media item from each project for the carousel.
  // Filter out any projects that might not have media.
  const homeWorks = projects.map(p => p.media[0]).filter(Boolean as unknown as (value: ProjectMedia | undefined) => value is ProjectMedia);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!homeWorks.length) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isHovering) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % homeWorks.length);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isHovering, homeWorks.length]);

  if (!homeWorks.length) {
    return (
       <div
        className="flex flex-col md:flex-row items-center justify-center cursor-pointer"
        onClick={() => setView('work')}
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter">Dawn</h1>
        <div className="w-8 h-8 my-4 md:my-0 md:mx-8"></div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter">Philip</h1>
      </div>
    );
  }

  const currentWork = homeWorks[currentIndex];
  const isMedia = currentWork.type === 'image' || currentWork.type === 'gif' || currentWork.type === 'video';
  const workWidth = currentWork.width ?? 'w-48 h-48 md:w-64 md:h-64'; // Provide a default size
  const workHeight = currentWork.height ?? '';

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setView('work')}
    >
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter transition-all duration-700 ease-in-out">
        Dawn
      </h1>
      <div
        key={currentIndex}
        className={`transition-all duration-700 ease-in-out rounded-2xl flex-shrink-0 ${isHovering ? `${workWidth} ${workHeight} my-4 md:my-0 md:mx-8` : 'w-0 h-0 m-0'}`}
        aria-hidden={!isHovering}
      >
        <div
          className={`w-full h-full transition-opacity duration-500 ease-in-out rounded-2xl ${isHovering ? 'opacity-100' : 'opacity-0'} ${isMedia ? '' : currentWork.value}`}
          style={{
            backgroundImage: isMedia ? `url(${currentWork.value})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label={currentWork.alt}
        >
          {currentWork.type === 'video' && (
            <video src={currentWork.value} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-2xl" />
          )}
        </div>
      </div>
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter transition-all duration-700 ease-in-out">
        Philip
      </h1>
    </div>
  );
};


/**
 * Renders the contact information.
 */
const ContactPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center -z-10">
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-gray-200 dark:text-gray-800">Dawn</h1>
      <div className="w-8 h-8 my-4 md:my-0 md:mx-8"></div>
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-gray-200 dark:text-gray-800">Philip</h1>
    </div>
    <a href="tel:+919539696530" className="text-2xl md:text-4xl font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 ease-in-out mb-4">
      +91 95396 96530
    </a>
    <a href="mailto:dawnphilip.inc@gmail.com" className="text-2xl md:text-4xl font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 ease-in-out mb-4">
      dawnphilip.inc@gmail.com
    </a>
    <a 
      href="https://www.linkedin.com/in/dawnphilip/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-2xl md:text-4xl font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 ease-in-out"
    >
      LinkedIn
    </a>
  </div>
);

const Rating: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex text-red-500 dark:text-red-400 text-lg">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < score ? 'opacity-100' : 'opacity-30'}>●</span>
    ))}
  </div>
);

/**
 * Renders the full, SEO-friendly resume.
 */
const ResumePage: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto text-gray-800 dark:text-gray-200 text-sm animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-8">
        <section>
          <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">EDUCATION</h2>
          <p className="font-bold">St. Xavier’s College, Mumbai</p>
          <p>BA Mass Communication and Journalism</p>
          <p>8.92 CGPA</p>
          <p>2020-2023</p>
        </section>
        <section>
          <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">CERTIFICATION</h2>
          <p className="font-bold">Google Ads Creative</p>
          <p>Google</p>
          <p>2023</p>
        </section>
      </div>
      <div className="md:col-span-2 space-y-8">
        <section>
          <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">WORK EXPERIENCE</h2>
          <div className="space-y-4">
            <div>
              <p className="font-bold">Radio Mango ( Malayala Manorama )</p>
              <p className="font-bold">Graphic Designer</p>
              <p className="italic">JUL 2024 - Present</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Produced original digital animations for films, brand IPs, and YouTube videos, meeting company standards and client requirements.</li>
                <li>Actively engaged in production shoots and collaborated with directors, producers, and scriptwriters.</li>
                <li>Identified and designed long form videos to cater to different demographic and used effective thumbnail strategy to increase traffic on YouTube.</li>
                <li>Collaborated with marketing team to develop high-impact visuals for brand IPs that increased customer engagement.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">Moher</p>
              <p className="font-bold">Graphic Designer</p>
              <p className="italic">SEPT 2023 - APR 2024</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Created graphic assets, such as story templates, website assets, and advertisements for seasonal campaigns.</li>
                <li>Effectively utilized principles of design, typography, and color theory to optimize visual impact and user experience.</li>
                <li>Employed visual storytelling and graphic design technologies to create engaging user experiences on websites.</li>
                <li>Increased social media engagement by 40% by strategizing post schedule timing.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">Turrino Advertising</p>
              <p className="italic">APR 2024 - JUL 2024</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Designed logo animations, and produced visual content for a variety of projects.</li>
                <li>Generated campaign concepts based on user personas and kept abreast of market trends.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div className="md:col-span-1 space-y-8">
        <section>
          <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">ABOUT</h2>
          <p>I'm a Mass Media graduate with a profound passion for visual storytelling, actively seeking opportunities in motion graphics and content creation.</p>
        </section>
      </div>
      <div className="md:col-span-2 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">SKILLS</h2>
            <ul className="space-y-1">
              <li>Adobe After Effects</li>
              <li>Adobe Premier Pro</li>
              <li>Typography design</li>
              <li>Creative direction</li>
              <li>Motion Graphics</li>
              <li>Video editing</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">SOFTWARE</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center"><span>Illustrator</span> <Rating score={5} /></li>
              <li className="flex justify-between items-center"><span>Photoshop</span> <Rating score={4} /></li>
              <li className="flex justify-between items-center"><span>InDesign</span> <Rating score={4} /></li>
              <li className="flex justify-between items-center"><span>Final Cut Pro</span> <Rating score={5} /></li>
              <li className="flex justify-between items-center"><span>DaVinci Resolve</span> <Rating score={3} /></li>
              <li className="flex justify-between items-center"><span>Figma</span> <Rating score={4} /></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
);

/**
 * An individual, expandable work item for the Work page.
 */
const WorkItem: React.FC<{ 
  project: Project; 
  isExpanded: boolean; 
  onToggle: () => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}> = ({ project, isExpanded, onToggle, activeTag, onTagClick }) => {
  const MediaItem: React.FC<{ item: ProjectMedia }> = ({ item }) => {
    switch (item.type) {
      case 'color':
        return <div className={`w-full h-full rounded-2xl ${item.value}`} />;
      case 'video':
        return <video src={item.value} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-2xl" />;
      case 'image':
      case 'gif':
      default:
        return <img src={item.value} alt={item.alt} className="w-full h-full object-cover rounded-2xl" />;
    }
  };
  
  return (
    <div className="border-b border-black dark:border-white last:border-b-0">
      <div onClick={onToggle} className="cursor-pointer flex justify-between items-center py-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{project.title}</h2>
        <div className="text-right text-xs md:text-base text-gray-600 dark:text-gray-400">
          {project.tags.map((tag, index) => (
            <React.Fragment key={tag}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className={`hover:text-black dark:hover:text-white transition-colors duration-200 ease-in-out ${activeTag === tag ? 'font-bold text-black dark:text-white' : ''}`}
              >
                {tag}
              </button>
              {index < project.tags.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : ''}`}>
        <div className="overflow-hidden">
           <div className="flex flex-col md:flex-row gap-8 pb-8 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="aspect-square">
                     {project.media.length > 0 && <MediaItem item={project.media[0]} />}
                  </div>
              </div>
              <div className="w-full md:w-2/3">
                  <p>{project.description}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the new Work page with tag filters and expandable project list.
 */
const WorkPage: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const filteredProjects = activeTag ? projects.filter(p => p.tags.includes(activeTag)) : projects;
    
    const handleTagClick = (tag: string) => {
      setActiveTag(prevTag => (prevTag === tag ? null : tag));
      // Collapse any open item when filter changes for a cleaner UI
      setExpandedId(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto text-gray-800 dark:text-gray-200 animate-fade-in">
            <div className="border-t border-black dark:border-white">
                {filteredProjects.map(project => (
                    <WorkItem
                        key={project.id}
                        project={project}
                        isExpanded={expandedId === project.id}
                        onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
                        activeTag={activeTag}
                        onTagClick={handleTagClick}
                    />
                ))}
            </div>
        </div>
    );
};


/**
 * The main application component for Dawn Philip's portfolio.
 */
const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [theme, toggleTheme] = useDarkMode();

  const NavButton: React.FC<{ targetView: View; children: React.ReactNode }> = ({ targetView, children }) => {
    const isInactive = view !== 'home' && view !== targetView;
    return (
      <button
        onClick={() => setView(targetView)}
        className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ease-in-out ${isInactive ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400' : 'text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400'}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white font-sans min-h-screen antialiased">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
        .font-nav-brand { 
            font-family: 'Monsieur La Doulaise', cursive;
        }
      `}</style>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 p-8 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <nav className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
          <div className="flex-1 flex justify-start items-center gap-4">
            <NavButton targetView="contact">Contact</NavButton>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="flex-1 flex justify-center">
            <button
                onClick={() => setView('home')}
                className="text-3xl md:text-5xl font-nav-brand font-bold tracking-tight text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300 ease-in-out"
            >
                dawn philip
            </button>
          </div>
          <div className="flex-1 flex justify-end flex-col items-end md:flex-row md:items-center md:space-x-2">
            <NavButton targetView="work">Work</NavButton>
            <span className="hidden md:inline text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-500">,</span>
            <NavButton targetView="resume">Resume</NavButton>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      {view === 'home' && (
        <main className="flex items-center justify-center w-full min-h-screen px-4">
          <HomePage setView={setView} projects={projects} />
        </main>
      )}
      {view === 'contact' && (
         <main className="flex items-center justify-center w-full min-h-screen px-4">
          <ContactPage />
        </main>
      )}
      {(view === 'resume' || view === 'work') && (
        <main className="pt-36 pb-16 px-4 md:px-8">
            {view === 'work' && <WorkPage />}
            {view === 'resume' && <ResumePage />}
        </main>
      )}
    </div>
  );
};

export default App;