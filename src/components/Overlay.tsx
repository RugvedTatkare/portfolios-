import { useEffect, useState, type KeyboardEvent } from 'react';
import { portfolio } from '../data/portfolio';

const sections = [
  ['01', 'The Lobby', 'A first look at the world behind the work.', 0],
  ['02', 'About Me', 'A little about how I think and build.', 0.2],
  ['03', 'Skills', 'Tools, disciplines and things I keep exploring.', 0.38],
  ['04', 'Project Lockers', 'Three builds. Three different problems.', 0.54],
  ['05', 'The Walkout', 'Leaving the gallery and heading for the court.', 0.76],
  ['06', 'The Stadium', 'Where the next point begins.', 0.94],
] as const;

type Project = (typeof portfolio.projects)[number];

function activateOnKeyboard(action: () => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
}

function sendMovementKey(key: string, type: 'keydown' | 'keyup') {
  window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true, cancelable: true }));
}

export function Overlay({ progress, selectedProject, onSelectProject, onNavigate, onCloseProject, matchPlaying, onToggleMatch, exploreMode, onToggleExplore }: {
  progress: number;
  selectedProject: Project | null;
  onSelectProject: (number: string) => void;
  onNavigate: (ratio: number) => void;
  onCloseProject: () => void;
  matchPlaying: boolean;
  onToggleMatch: () => void;
  exploreMode: boolean;
  onToggleExplore: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  // Exactly one editorial panel is visible at a time; panels switch at the midpoint between scroll stops.
  const active = progress < 0.1 ? 0 : progress < 0.29 ? 1 : progress < 0.46 ? 2 : progress < 0.65 ? 3 : progress < 0.85 ? 4 : 5;
  const hero = active === 0 ? 1 : 0;
  const about = active === 1 ? 1 : 0;
  const skills = active === 2 ? 1 : 0;
  const projects = active === 3 ? 1 : 0;
  const finale = active === 4 ? 1 : 0;
  const stadium = active === 5 ? 1 : 0;
  const matchVisible = active === 5;
  const goto = (ratio: number) => {
    setMobileMenuOpen(false);
    onNavigate(ratio);
  };

  useEffect(() => {
    if (!selectedProject && !mobileMenuOpen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseProject();
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, mobileMenuOpen, onCloseProject]);

  const navItems = sections.map((section) => ({ label: section[1], ratio: section[3] }));

  return <>
    <header className="topbar">
      <a className="brand interactive-control" href="#top" aria-label="Back to the lobby" onClick={(event) => { event.preventDefault(); goto(0); }}>R.</a>
      <nav aria-label="Main navigation">
        <a href="#top" onClick={(event) => { event.preventDefault(); goto(0); }}>Home</a>
        <a href="#journey" onClick={(event) => { event.preventDefault(); goto(0.2); }}>Journey</a>
        <a href="#projects" onClick={(event) => { event.preventDefault(); goto(0.54); }}>Projects</a>
        <a href="#gallery" onClick={(event) => { event.preventDefault(); goto(0.76); }}>Gallery</a>
        <a href="#contact" onClick={(event) => { event.preventDefault(); goto(0.94); }}>Contact</a>
      </nav>
      <div className="topbar-meta"><span>PORTFOLIO / 2026</span><span>{portfolio.location.toUpperCase()}</span></div>
      <a className="topbar-link interactive-control" href={portfolio.socials.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
      <button className="menu-mark" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><span/><span/><span/></button>
    </header>

    {mobileMenuOpen && (
      <nav className="mobile-menu-panel" aria-label="Mobile navigation">
        {navItems.map((item) => <button key={item.label} onClick={() => goto(item.ratio)}>{item.label}<span>↗</span></button>)}
        <a href={portfolio.socials.github} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub ↗</a>
      </nav>
    )}

    <aside className="section-rail" aria-label="Journey sections">
      {sections.map((section, i) => <button key={section[0]} className={i === active ? 'is-active' : ''} onClick={() => goto(section[3])} aria-label={`Go to ${section[1]}`}>
        <b>{section[0]}</b><span>{section[1]}</span>
      </button>)}
    </aside>

    <div className="copy copy--hero" style={{ opacity: hero, visibility: active === 0 ? 'visible' : 'hidden', transform: 'translate3d(0,-43%,0)' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0)}>A portfolio, in motion.</p>
      <h1 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0)} onKeyDown={activateOnKeyboard(() => goto(0))}>A Different<br/>Game<span>.</span></h1>
      <p className="hero-line interactive-text" onClick={() => goto(0.38)}>Data · Design · Tennis · Beyond</p>
      <p className="hero-desc interactive-text" onClick={() => goto(0.2)}>I’m Rugved — a data science student and creative builder interested in turning complex ideas into useful digital experiences.</p>
      <p className="hero-credential interactive-text" onClick={() => goto(0.2)}>{portfolio.education}</p>
      <button onClick={() => goto(0.2)}>Walk into my world <span>→</span></button>
    </div>

    <section className="copy copy--about" style={{ opacity: about, visibility: active === 1 ? 'visible' : 'hidden' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0.2)}>02 / About Me</p>
      <h2 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0.2)} onKeyDown={activateOnKeyboard(() => goto(0.2))}>Curious by nature.<br/>Builder by instinct.</h2>
      <p className="interactive-text" onClick={() => goto(0.38)}>{portfolio.about}</p>
      <div className="line-list">
        <button onClick={() => goto(0.2)}>{portfolio.education}</button>
        <button onClick={() => goto(0.2)}>{portfolio.academic}</button>
        <button onClick={() => goto(0.2)}>Latest semester GPA / 9.55 out of 10</button>
        <button onClick={() => goto(0.94)}>Based in {portfolio.location} · Get in touch ↗</button>
      </div>
    </section>

    <section className="copy copy--skills" style={{ opacity: skills, visibility: active === 2 ? 'visible' : 'hidden' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0.38)}>03 / Skills & Interests</p>
      <h2 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0.38)} onKeyDown={activateOnKeyboard(() => goto(0.38))}>Analysis with a<br/>creative point of view.</h2>
      <p className="interactive-text" onClick={() => goto(0.54)}>A mix of statistical thinking, machine learning, data storytelling and application development — with an ongoing interest in business and design.</p>
      <div className="line-list skill-list">
        {[
          ['Python · SQL · JavaScript', 'Building blocks for analysis, data processing and web experiences.'],
          ['Machine Learning & Statistical Analysis', 'Modelling, feature engineering, evaluation and exploratory analysis.'],
          ['Power BI · Tableau · Plotly', 'Turning data into clear dashboards and interactive visual stories.'],
          ['React · Flask · Streamlit', 'Interfaces and APIs that make project ideas usable.'],
          ['PostgreSQL · MySQL · Supabase', 'Data storage, queries, authentication and application backends.'],
        ].map(([label, description]) => <button key={label} className={activeSkill === label ? 'is-selected' : ''} onClick={() => setActiveSkill(activeSkill === label ? null : label)} aria-pressed={activeSkill === label}>
          <span>{label}</span><span className="skill-plus">{activeSkill === label ? '−' : '+'}</span>
          {activeSkill === label && <small>{description}</small>}
        </button>)}
      </div>
      <p className="skill-hint">{activeSkill ? 'Toolkit detail opened · Click again to collapse.' : 'Select any toolkit row to explore it.'}</p>
    </section>

    <section className="copy copy--projects" style={{ opacity: projects, visibility: active === 3 && !exploreMode ? 'visible' : 'hidden' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0.54)}>04 / Project Lockers</p>
      <h2 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0.54)} onKeyDown={activateOnKeyboard(() => goto(0.54))}>Every build gets<br/>its own locker.</h2>
      <p className="interactive-text" onClick={() => goto(0.54)}>Click any 3D project board or a project row to open its complete breakdown.</p>
      <div className="project-list">
        {portfolio.projects.map((project) => <article className="project interactive-project" key={project.number} role="button" tabIndex={0} onClick={() => onSelectProject(project.number)} onKeyDown={activateOnKeyboard(() => onSelectProject(project.number))} aria-label={`Open details for ${project.title}`}>
          <div className="project-head"><b>{project.number}</b><span>{project.title}</span><span className="project-open-mark">↗</span></div>
          <small>{project.type}</small>
          <p>{project.description}</p>
          <div className="project-foot"><strong>{project.metric}</strong><span>{project.stack}</span></div>
        </article>)}
      </div>
    </section>

    <section className="copy copy--finale" style={{ opacity: finale, visibility: active === 4 ? 'visible' : 'hidden' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0.76)}>05 / The Walkout</p>
      <h2 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0.76)} onKeyDown={activateOnKeyboard(() => goto(0.76))}>Keep the discipline.<br/>Play the bigger game.</h2>
      <p className="interactive-text" onClick={() => goto(0.94)}>Outside the code, I enjoy design leadership, collaborating across teams and helping make creative ideas real.</p>
      <div className="line-list">
        {portfolio.experience.map((item) => <button key={item.title} onClick={() => goto(0.2)}>{item.title} · {item.organization} ↗</button>)}
        {portfolio.certifications.map((certification) => <button key={certification} onClick={() => goto(0.38)}>{certification} ↗</button>)}
      </div>
      <button className="walkout-cta" onClick={() => goto(0.94)}>Walk out onto the court <span>→</span></button>
    </section>

    <section className="copy copy--stadium" style={{ opacity: stadium, visibility: active === 5 ? 'visible' : 'hidden' }}>
      <p className="eyebrow interactive-text" onClick={() => goto(0.94)}>06 / The Stadium</p>
      <h2 className="interactive-text" role="button" tabIndex={0} onClick={() => goto(0.94)} onKeyDown={activateOnKeyboard(() => goto(0.94))}>The next point<br/>starts here.</h2>
      <p className="interactive-text" onClick={() => goto(0.54)}>Open to interesting problems, creative collaborations and opportunities to build something meaningful.</p>
      <div className="stadium-actions">
        <button onClick={() => goto(0.54)}>Revisit the projects <span>→</span></button>
        <a href={portfolio.socials.email}>Get in touch ↗</a>
      </div>
      <div className="social-links">
        <a href={portfolio.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={portfolio.socials.email}>Email ↗</a>
      </div>
    </section>

    {active === 3 && !selectedProject && (
      <aside className={`locker-explore-panel ${exploreMode ? 'is-exploring' : ''}`} aria-label="Locker room exploration controls">
        {!exploreMode ? (
          <>
            <div className="locker-explore-icon"><span>↗</span></div>
            <div className="locker-explore-copy">
              <strong>STEP INTO THE LOCKER ROOM</strong>
              <span>Leave the guided camera and get close to each project's locker.</span>
            </div>
            <button onClick={onToggleExplore}>Explore lockers <span>→</span></button>
          </>
        ) : (
          <>
            <div className="locker-explore-icon locker-explore-icon--live"><span>⌖</span></div>
            <div className="locker-explore-copy">
              <strong>FREE LOOK / EXPLORATION MODE</strong>
              <span><b>Drag</b> to look around · <b>W A S D</b> or <b>↑ ← ↓ →</b> to move · <b>Shift</b> to move faster · Click a project locker for details.</span>
            </div>
            <button onClick={onToggleExplore}>Return to guided tour <span>↗</span></button>
          </>
        )}
      </aside>
    )}

    {exploreMode && active === 3 && !selectedProject && (
      <div className="explore-dpad" aria-label="Touch movement controls">
        <button className="explore-dpad-up" aria-label="Move forward" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('w', 'keydown'); }} onPointerUp={() => sendMovementKey('w', 'keyup')} onPointerLeave={() => sendMovementKey('w', 'keyup')} onPointerCancel={() => sendMovementKey('w', 'keyup')}>↑</button>
        <button className="explore-dpad-left" aria-label="Move left" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('a', 'keydown'); }} onPointerUp={() => sendMovementKey('a', 'keyup')} onPointerLeave={() => sendMovementKey('a', 'keyup')} onPointerCancel={() => sendMovementKey('a', 'keyup')}>←</button>
        <button className="explore-dpad-down" aria-label="Move backward" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('s', 'keydown'); }} onPointerUp={() => sendMovementKey('s', 'keyup')} onPointerLeave={() => sendMovementKey('s', 'keyup')} onPointerCancel={() => sendMovementKey('s', 'keyup')}>↓</button>
        <button className="explore-dpad-right" aria-label="Move right" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('d', 'keydown'); }} onPointerUp={() => sendMovementKey('d', 'keyup')} onPointerLeave={() => sendMovementKey('d', 'keyup')} onPointerCancel={() => sendMovementKey('d', 'keyup')}>→</button>
      </div>
    )}

    {matchVisible && (
      <aside className="match-control" aria-label="Tennis match controls">
        <span className={matchPlaying ? 'live-dot is-live' : 'live-dot'} />
        <div className="match-control-copy"><strong>{matchPlaying ? 'LIVE RALLY' : 'MATCH PAUSED'}</strong><small>COURT 01 · MORNING SESSION</small></div>
        <button onClick={onToggleMatch} aria-pressed={matchPlaying} aria-label={matchPlaying ? 'Pause tennis match' : 'Resume tennis match'}>{matchPlaying ? 'Ⅱ Pause' : '▶ Resume'}</button>
      </aside>
    )}

    {selectedProject && (
      <div className="project-detail-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onCloseProject(); }}>
        <section className="project-detail" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
          <button className="project-detail-close" aria-label="Close project details" onClick={onCloseProject}>×</button>
          <div className="project-detail-scroll">
            <p className="project-detail-eyebrow">PLAYER LOCKER / {selectedProject.number}</p>
            <h2 id="project-detail-title">{selectedProject.title}</h2>
            <p className="project-detail-type">{selectedProject.type}</p>
            <div className="project-detail-result"><span>KEY RESULT</span><strong>{selectedProject.metric}</strong></div>
            <div className="project-detail-section"><span className="project-detail-label">THE CHALLENGE</span><p>{selectedProject.challenge}</p></div>
            <div className="project-detail-section"><span className="project-detail-label">HOW IT WORKS</span><p>{selectedProject.approach}</p></div>
            <div className="project-detail-section"><span className="project-detail-label">INSIDE THE BUILD</span><ul>{selectedProject.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
            <div className="project-detail-section"><span className="project-detail-label">TECH STACK</span><div className="project-stack">{selectedProject.stack.split(' · ').map((tech) => <span key={tech}>{tech}</span>)}</div></div>
            <div className="project-detail-section"><span className="project-detail-label">OUTCOME</span><p>{selectedProject.outcome}</p></div>
            <div className="project-detail-actions">
              <a href={portfolio.socials.github} target="_blank" rel="noreferrer">Explore GitHub ↗</a>
              <button onClick={onCloseProject}>Back to the locker room <span>→</span></button>
            </div>
          </div>
        </section>
      </div>
    )}

    <button className="bottom-caption" onClick={() => goto(sections[Math.min(active + 1, sections.length - 1)][3])} aria-label="Continue to next section">
      <b>{sections[active][0]}</b><span>{sections[active][1]}</span><i/><span>{sections[active][2]}</span><em>CLICK OR SCROLL ↓</em>
    </button>
    <div className="progress-dots">{sections.map((section, i) => <button key={section[0]} className={i === active ? 'is-active' : ''} aria-label={`Go to ${section[1]}`} onClick={() => goto(section[3])}/>)}</div>
  </>;
}
