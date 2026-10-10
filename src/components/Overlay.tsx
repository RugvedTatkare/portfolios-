import { useEffect } from 'react';
import { portfolio } from '../data/portfolio';

const sections = [
  ['01', 'The Lobby', 'A first look at the world behind the work.'],
  ['02', 'About Me', 'A little about how I think and build.'],
  ['03', 'Skills', 'Tools, disciplines and things I keep exploring.'],
  ['04', 'Project Lockers', 'Three builds. Three different problems.'],
  ['05', 'The Walkout', 'Leaving the gallery and heading for the court.'],
  ['06', 'The Stadium', 'Where the next point begins.'],
];

type Project = (typeof portfolio.projects)[number];

function fade(progress: number, center: number, width = 0.13) {
  return Math.max(0, 1 - Math.abs(progress - center) / width);
}

function goToProgress(ratio: number) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: maxScroll * ratio, behavior: 'smooth' });
}

export function Overlay({ progress, selectedProject, onCloseProject }: {
  progress: number;
  selectedProject: Project | null;
  onCloseProject: () => void;
}) {
  const hero = fade(progress, 0.03, 0.2);
  const about = fade(progress, 0.2, 0.13);
  const skills = fade(progress, 0.38, 0.13);
  const projects = fade(progress, 0.54, 0.145);
  const finale = fade(progress, 0.76, 0.12);
  const stadium = fade(progress, 0.94, 0.12);
  const active = progress < 0.13 ? 0 : progress < 0.3 ? 1 : progress < 0.46 ? 2 : progress < 0.68 ? 3 : progress < 0.86 ? 4 : 5;

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseProject();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, onCloseProject]);

  return <>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Back to the lobby" onClick={(event) => { event.preventDefault(); goToProgress(0); }}>R.</a>
      <nav aria-label="Main navigation">
        <a href="#top" onClick={(event) => { event.preventDefault(); goToProgress(0); }}>Home</a>
        <a href="#journey" onClick={(event) => { event.preventDefault(); goToProgress(0.2); }}>Journey</a>
        <a href="#projects" onClick={(event) => { event.preventDefault(); goToProgress(0.54); }}>Projects</a>
        <a href="#gallery" onClick={(event) => { event.preventDefault(); goToProgress(0.76); }}>Gallery</a>
        <a href="#contact" onClick={(event) => { event.preventDefault(); goToProgress(0.96); }}>Contact</a>
      </nav>
      <div className="topbar-meta"><span>PORTFOLIO / 2026</span><span>{portfolio.location.toUpperCase()}</span></div>
      <a className="topbar-link" href={portfolio.socials.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
    </header>

    <div className="menu-mark" aria-hidden="true"><span/><span/><span/></div>

    <aside className="section-rail" aria-label="Journey sections">
      {sections.map((section, i) => <div key={section[0]} className={i === active ? 'is-active' : ''}>
        <b>{section[0]}</b><span>{section[1]}</span>
      </div>)}
    </aside>

    <div className="copy copy--hero" style={{ opacity: hero, transform: `translate3d(0,calc(-43% + ${(1 - hero) * 18}px),0)` }}>
      <p className="eyebrow">A portfolio, in motion.</p>
      <h1>A Different<br/>Game<span>.</span></h1>
      <p className="hero-line">Data · Design · Tennis · Beyond</p>
      <p className="hero-desc">I’m Rugved — a data science student and creative builder interested in turning complex ideas into useful digital experiences.</p>
      <p className="hero-credential">{portfolio.education}</p>
      <button onClick={() => goToProgress(0.2)}>Walk into my world <span>→</span></button>
    </div>

    <section className="copy copy--about" style={{ opacity: about }}>
      <p className="eyebrow">02 / About Me</p>
      <h2>Curious by nature.<br/>Builder by instinct.</h2>
      <p>{portfolio.about}</p>
      <div className="line-list">
        <span>{portfolio.education}</span>
        <span>{portfolio.academic}</span>
        <span>Latest semester GPA / 9.55 out of 10</span>
        <span>Based in {portfolio.location}</span>
      </div>
    </section>

    <section className="copy copy--skills" style={{ opacity: skills }}>
      <p className="eyebrow">03 / Skills & Interests</p>
      <h2>Analysis with a<br/>creative point of view.</h2>
      <p>A mix of statistical thinking, machine learning, data storytelling and application development — with an ongoing interest in business and design.</p>
      <div className="line-list">
        <span>Python · SQL · JavaScript</span>
        <span>Machine Learning & Statistical Analysis</span>
        <span>Power BI · Tableau · Plotly</span>
        <span>React · Flask · Streamlit</span>
        <span>PostgreSQL · MySQL · Supabase</span>
      </div>
    </section>

    <section className="copy copy--projects" style={{ opacity: projects }}>
      <p className="eyebrow">04 / Project Lockers</p>
      <h2>Every build gets<br/>its own locker.</h2>
      <p>Walk up to a kit locker and click it to open the full project breakdown.</p>
      <div className="project-list">
        {portfolio.projects.map((project) => <article className="project" key={project.number}>
          <div className="project-head">
            <b>{project.number}</b>
            <span>{project.title}</span>
          </div>
          <small>{project.type}</small>
          <p>{project.description}</p>
          <div className="project-foot"><strong>{project.metric}</strong><span>{project.stack}</span></div>
        </article>)}
      </div>
    </section>

    <section className="copy copy--finale" style={{ opacity: finale }}>
      <p className="eyebrow">05 / The Walkout</p>
      <h2>Keep the discipline.<br/>Play the bigger game.</h2>
      <p>Outside the code, I enjoy design leadership, collaborating across teams and helping make creative ideas real.</p>
      <div className="line-list">
        {portfolio.experience.map((item) => <span key={item.title}>{item.title} · {item.organization}</span>)}
        {portfolio.certifications.map((certification) => <span key={certification}>{certification}</span>)}
      </div>
    </section>

    <section className="copy copy--stadium" style={{ opacity: stadium }}>
      <p className="eyebrow">06 / The Stadium</p>
      <h2>The next point<br/>starts here.</h2>
      <p>Open to interesting problems, creative collaborations and opportunities to build something meaningful.</p>
      <div className="stadium-actions">
        <button onClick={() => goToProgress(0.54)}>Revisit the projects <span>→</span></button>
        <a href={portfolio.socials.email}>Get in touch ↗</a>
      </div>
      <div className="social-links">
        <a href={portfolio.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={portfolio.socials.email}>Email ↗</a>
      </div>
    </section>

    {selectedProject && (
      <div
        className="project-detail-backdrop"
        role="presentation"
        onClick={(event) => { if (event.target === event.currentTarget) onCloseProject(); }}
      >
        <section className="project-detail" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
          <button className="project-detail-close" aria-label="Close project details" onClick={onCloseProject}>×</button>
          <div className="project-detail-scroll">
            <p className="project-detail-eyebrow">PLAYER LOCKER / {selectedProject.number}</p>
            <h2 id="project-detail-title">{selectedProject.title}</h2>
            <p className="project-detail-type">{selectedProject.type}</p>
            <div className="project-detail-result">
              <span>KEY RESULT</span>
              <strong>{selectedProject.metric}</strong>
            </div>
            <div className="project-detail-section">
              <span className="project-detail-label">THE CHALLENGE</span>
              <p>{selectedProject.challenge}</p>
            </div>
            <div className="project-detail-section">
              <span className="project-detail-label">HOW IT WORKS</span>
              <p>{selectedProject.approach}</p>
            </div>
            <div className="project-detail-section">
              <span className="project-detail-label">INSIDE THE BUILD</span>
              <ul>{selectedProject.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </div>
            <div className="project-detail-section">
              <span className="project-detail-label">TECH STACK</span>
              <div className="project-stack">{selectedProject.stack.split(' · ').map((tech) => <span key={tech}>{tech}</span>)}</div>
            </div>
            <div className="project-detail-section">
              <span className="project-detail-label">OUTCOME</span>
              <p>{selectedProject.outcome}</p>
            </div>
            <div className="project-detail-actions">
              <a href={portfolio.socials.github} target="_blank" rel="noreferrer">Explore GitHub ↗</a>
              <button onClick={onCloseProject}>Back to the locker room <span>→</span></button>
            </div>
          </div>
        </section>
      </div>
    )}

    <div className="bottom-caption">
      <b>{sections[active][0]}</b><span>{sections[active][1]}</span><i/>
      <span>{sections[active][2]}</span><em>SCROLL TO EXPLORE ↓</em>
    </div>
    <div className="progress-dots">{sections.map((section, i) => <span key={section[0]} className={i === active ? 'is-active' : ''}/>)}</div>
  </>;
}
