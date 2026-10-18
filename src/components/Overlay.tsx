import { useEffect, useState, type KeyboardEvent } from 'react';
import { portfolio } from '../data/portfolio';

const sections = [
  ['01', 'Home', 'A clear introduction to the person behind the work.', 0],
  ['02', 'About', 'The background and perspective behind how I build.', 0.2],
  ['03', 'Skills & Approach', 'The tools and ways of thinking I bring to a problem.', 0.38],
  ['04', 'Selected Projects', 'Case studies in security, fraud, careers and legal NLP.', 0.54],
  ['05', 'Experience', 'Leadership, collaboration and continued learning.', 0.76],
  ['06', 'Contact', 'Start a conversation about something meaningful.', 0.94],
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

export function Overlay({ progress, selectedProject, onSelectProject, onNavigate, onCloseProject, matchPlaying, onToggleMatch, exploreMode, onToggleExplore, inStadiumZone, tennisGameActive, tennisScore, onToggleTennisGame, onTennisHit }: {
  progress: number;
  selectedProject: Project | null;
  onSelectProject: (number: string) => void;
  onNavigate: (ratio: number) => void;
  onCloseProject: () => void;
  matchPlaying: boolean;
  onToggleMatch: () => void;
  exploreMode: boolean;
  onToggleExplore: () => void;
  inStadiumZone: boolean;
  tennisGameActive: boolean;
  tennisScore: { rugved: number; opponent: number };
  onToggleTennisGame: () => void;
  onTennisHit: () => void;
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
        <a href="#about" onClick={(event) => { event.preventDefault(); goto(0.2); }}>About</a>
        <a href="#skills" onClick={(event) => { event.preventDefault(); goto(0.38); }}>Skills</a>
        <a href="#projects" onClick={(event) => { event.preventDefault(); goto(0.54); }}>Projects</a>
        <a href="#experience" onClick={(event) => { event.preventDefault(); goto(0.76); }}>Experience</a>
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

    <div className="copy copy--hero" style={{ opacity: hero, visibility: active === 0 ? 'visible' : 'hidden' }}>
      <p className="eyebrow">DATA SCIENCE / CREATIVE TECHNOLOGY / PRODUCT</p>
      <h1>Where data<br/>meets design<span>.</span></h1>
      <p className="hero-line">ANALYTICS · PRODUCT THINKING · VISUAL STORYTELLING</p>
      <p className="hero-desc">I’m Rugved Tatkare — a B.Tech Data Science student at NMIMS Mumbai who enjoys taking complex problems from analysis to useful, thoughtfully designed digital experiences.</p>
      <p className="hero-credential">{portfolio.education}</p>
      <div className="hero-actions">
        <button onClick={() => goto(0.54)}>Explore selected work <span>↗</span></button>
        <button className="button-secondary" onClick={() => goto(0.2)}>Read my story <span>↓</span></button>
      </div>
    </div>

    <aside className="editorial-sidecard hero-sidecard" style={{ opacity: hero, visibility: active === 0 ? 'visible' : 'hidden' }} aria-label="Portfolio focus">
      <div className="sidecard-kicker"><span className="sidecard-live-dot" /> HOW I APPROACH A PROBLEM</div>
      <article className="hero-lens">
        <span className="hero-lens-number">01</span>
        <div><strong>ANALYSE</strong><p>Find the signal in the data, understand the context and define the real problem.</p></div>
      </article>
      <article className="hero-lens">
        <span className="hero-lens-number">02</span>
        <div><strong>BUILD</strong><p>Turn the idea into a working model, application, dashboard or prototype.</p></div>
      </article>
      <article className="hero-lens">
        <span className="hero-lens-number">03</span>
        <div><strong>REFINE</strong><p>Care about clarity, usability and how the finished experience feels to people.</p></div>
      </article>
      <div className="sidecard-footer"><span>BASED IN</span><strong>{portfolio.location}</strong></div>
    </aside>

    <section className="copy copy--about" style={{ opacity: about, visibility: active === 1 ? 'visible' : 'hidden' }}>
      <p className="eyebrow">02 / ABOUT</p>
      <h2>Curious by nature.<br/>Purpose in the build.</h2>
      <p>{portfolio.about}</p>
      <div className="line-list fact-list">
        <div><span className="fact-label">EDUCATION</span><strong>{portfolio.educationDetail}</strong></div>
        <div><span className="fact-label">ACADEMIC SNAPSHOT</span><strong>{portfolio.academic}</strong></div>
        <div><span className="fact-label">CURRENT FOCUS</span><strong>{portfolio.currently}</strong></div>
      </div>
    </section>

    <aside className="editorial-sidecard about-sidecard" style={{ opacity: about, visibility: active === 1 ? 'visible' : 'hidden' }} aria-label="About Rugved at a glance">
      <div className="sidecard-kicker">A LITTLE MORE CONTEXT</div>
      <h3>Three things that shape my work.</h3>
      <div className="about-quality">
        <span className="quality-mark">A</span>
        <div><strong>Analytical thinking</strong><p>I like breaking an open-ended question into smaller, testable parts.</p></div>
      </div>
      <div className="about-quality">
        <span className="quality-mark">B</span>
        <div><strong>Making ideas tangible</strong><p>I enjoy carrying a concept beyond the notebook into an interface or working prototype.</p></div>
      </div>
      <div className="about-quality">
        <span className="quality-mark">C</span>
        <div><strong>Creative collaboration</strong><p>Design work and committee experience have taught me to think about the audience, not just the output.</p></div>
      </div>
      <div className="about-interest-row"><span>INTERESTS</span><p>Data & analytics · Product thinking · Design · Business</p></div>
    </aside>

    <section className="copy copy--skills" style={{ opacity: skills, visibility: active === 2 ? 'visible' : 'hidden' }}>
      <p className="eyebrow">03 / SKILLS & APPROACH</p>
      <h2>A toolkit built<br/>around problem-solving.</h2>
      <p>A mix of statistical thinking, machine learning, data storytelling and application development — with an ongoing interest in business and design.</p>
      <div className="line-list skill-list">
        {portfolio.skillGroups.map((group) => <button key={group.label} className={activeSkill === group.label ? 'is-selected' : ''} onClick={() => setActiveSkill(activeSkill === group.label ? null : group.label)} aria-pressed={activeSkill === group.label}>
          <span>{group.label}</span><span className="skill-plus">{activeSkill === group.label ? '−' : '+'}</span>
          {activeSkill === group.label && <small><strong className="skill-items">{group.items}</strong><br />{group.description}</small>}
        </button>)}
      </div>
      <p className="skill-hint">{activeSkill ? 'Toolkit detail opened · Click again to collapse.' : 'Select any toolkit row to explore it.'}</p>
    </section>

    <aside className="editorial-sidecard skills-sidecard" style={{ opacity: skills, visibility: active === 2 ? 'visible' : 'hidden' }} aria-label="Creative and collaboration toolkit">
      <div className="sidecard-kicker">THE WORK AROUND THE CODE</div>
      <h3>Technical skills, applied to real problems.</h3>
      <div className="toolkit-block">
        <span className="toolkit-label">PROJECT DELIVERY</span>
        <p>Data preparation · Modelling · APIs · Dashboards</p>
        <small>From cleaning and analysing data to building usable applications around the results.</small>
      </div>
      <div className="toolkit-block">
        <span className="toolkit-label">CREATIVE COLLABORATION</span>
        <p>Design review · Content planning · Cross-team coordination</p>
        <small>Experience through Digital Creatives at IETE-SF, NMIMS.</small>
      </div>
      <div className="toolkit-block">
        <span className="toolkit-label">COMMUNITY & LEARNING</span>
        <p>Tutoring · Explaining ideas · Educational activities</p>
        <small>Volunteer experience supporting students through Being Child Care NGO.</small>
      </div>
    </aside>



    <section className="copy copy--projects" style={{ opacity: projects, visibility: active === 3 && !exploreMode ? 'visible' : 'hidden' }}>
      <div className="projects-heading">
        <div>
          <p className="eyebrow">04 / SELECTED PROJECTS</p>
          <h2>Selected work.<br/>Real problems.</h2>
        </div>
        <p className="projects-intro">Four projects across database security, UPI fraud detection, career recommendations and legal NLP. Open a case study to explore the challenge, approach, technology and reported results.</p>
      </div>
      <div className="project-showcase-grid">
        {portfolio.projects.map((project) => <article className="project-card interactive-project" key={project.number} role="button" tabIndex={0} onClick={() => onSelectProject(project.number)} onKeyDown={activateOnKeyboard(() => onSelectProject(project.number))} aria-label={`Open details for ${project.title}`}>
          <div className="project-card-top"><span className="project-card-number">{project.number}</span><span className="project-card-type">{project.type}</span><span className="project-card-open">↗</span></div>
          <h3>{project.title}</h3>
          <p className="project-card-description">{project.description}</p>
          <div className="project-card-result"><span>HIGHLIGHT</span><strong>{project.metric}</strong></div>
          <div className="project-card-stack">{project.stack.split(' · ').map((tech) => <span key={tech}>{tech}</span>)}</div>
          <div className="project-card-footer"><span>VIEW CASE STUDY</span><span>↗</span></div>
        </article>)}
      </div>
      <div className="project-section-note"><span>04 PROJECTS</span><i /> <span>SELECT A CARD OR A 3D LOCKER TO EXPLORE THE DETAILS</span></div>
    </section>

    <section className="copy copy--finale" style={{ opacity: finale, visibility: active === 4 ? 'visible' : 'hidden' }}>
      <div className="experience-heading">
        <div>
          <p className="eyebrow">05 / EXPERIENCE & LEADERSHIP</p>
          <h2>Leadership that<br/>goes beyond code.</h2>
        </div>
        <p>Building a good project is one thing. Communicating the idea, working with people and helping a team bring it to life are part of the work too.</p>
      </div>
      <div className="experience-showcase">
        {portfolio.experience.map((item, index) => <article className="experience-card" key={item.title}>
          <div className="experience-card-meta"><span>0{index + 1} / EXPERIENCE</span><span>{'period' in item ? item.period : 'COMMUNITY'}</span></div>
          <h3>{item.title}</h3>
          <p className="experience-organization">{item.organization}</p>
          <p className="experience-description">{item.description}</p>
        </article>)}
      </div>
      <div className="certification-strip">
        <div className="certification-heading"><span>CERTIFICATIONS</span><small>Completed courses</small></div>
        <div className="certification-list">{portfolio.certifications.map((certification) => <span key={certification}>{certification}</span>)}</div>
      </div>
      <div className="coursework-strip">
        <div className="coursework-heading"><span>RELEVANT COURSEWORK</span><small>Academic foundations</small></div>
        <div className="coursework-list">{portfolio.coursework.map((item) => <article className="coursework-item" key={item.category}><strong>{item.category}</strong><p>{item.topics}</p></article>)}</div>
      </div>
      <button className="walkout-cta" onClick={() => goto(0.94)}>Let’s connect <span>→</span></button>
    </section>

    <section className="copy copy--stadium" style={{ opacity: stadium, visibility: active === 5 ? 'visible' : 'hidden' }}>
      <p className="eyebrow">06 / CONTACT</p>
      <h2>Let’s make<br/>something useful.</h2>
      <p>If you’re working on an interesting problem, exploring a product idea, or looking for a collaborator at the intersection of data and design, I’d love to hear about it.</p>
      <div className="stadium-actions">
        <a className="contact-primary-link" href={portfolio.socials.email}>Start a conversation <span>↗</span></a>
        <button onClick={() => goto(0.54)}>Revisit selected work <span>→</span></button>
      </div>
    </section>

    <aside className="editorial-sidecard contact-sidecard" style={{ opacity: stadium, visibility: active === 5 ? 'visible' : 'hidden' }} aria-label="Contact details">
      <div className="sidecard-kicker">SAY HELLO</div>
      <span className="contact-card-caption">EMAIL</span>
      <a className="contact-email" href={portfolio.socials.email}>rugved1206@gmail.com <span>↗</span></a>
      <div className="contact-card-rule" />
      <span className="contact-card-caption">FIND ME ELSEWHERE</span>
      <a className="contact-social-link" href={portfolio.socials.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><b>Professional updates & conversations</b><i>↗</i></a>
      <a className="contact-social-link" href={portfolio.socials.github} target="_blank" rel="noreferrer"><span>GitHub</span><b>Projects and code</b><i>↗</i></a>
      <div className="contact-card-footer"><span>BASED IN</span><strong>{portfolio.location}</strong></div>
    </aside>

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
            <div className="locker-explore-icon locker-explore-icon--live"><span>{inStadiumZone ? '▦' : '⌖'}</span></div>
            <div className="locker-explore-copy">
              <strong>{tennisGameActive ? 'COURT 01 / PRACTICE MODE' : inStadiumZone ? 'YOU MADE IT TO THE STADIUM' : 'FREE LOOK / EXPLORATION MODE'}</strong>
              <span>{tennisGameActive
                ? 'Drag to look · WASD / arrows to move · Press Space or Hit Ball when it comes close.'
                : inStadiumZone
                  ? 'Explore the court, check the live scoreboard, or start a playable tennis rally.'
                  : 'Click-drag anywhere on the scene to turn · WASD / arrows to walk · Shift to move faster · Click a project board to expand its details.'}</span>
            </div>
            {inStadiumZone && <button className="play-tennis-button" onClick={onToggleTennisGame}>{tennisGameActive ? 'End practice' : 'Play tennis'} <span>{tennisGameActive ? 'Ⅱ' : '→'}</span></button>}
            <button className="return-tour-button" onClick={onToggleExplore}>Return to guided tour <span>↗</span></button>
          </>
        )}
      </aside>
    )}

    {exploreMode && !selectedProject && (
      <div className="explore-dpad" aria-label="Touch movement controls">
        <button className="explore-dpad-up" aria-label="Move forward" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('w', 'keydown'); }} onPointerUp={() => sendMovementKey('w', 'keyup')} onPointerLeave={() => sendMovementKey('w', 'keyup')} onPointerCancel={() => sendMovementKey('w', 'keyup')}>↑</button>
        <button className="explore-dpad-left" aria-label="Move left" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('a', 'keydown'); }} onPointerUp={() => sendMovementKey('a', 'keyup')} onPointerLeave={() => sendMovementKey('a', 'keyup')} onPointerCancel={() => sendMovementKey('a', 'keyup')}>←</button>
        <button className="explore-dpad-down" aria-label="Move backward" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('s', 'keydown'); }} onPointerUp={() => sendMovementKey('s', 'keyup')} onPointerLeave={() => sendMovementKey('s', 'keyup')} onPointerCancel={() => sendMovementKey('s', 'keyup')}>↓</button>
        <button className="explore-dpad-right" aria-label="Move right" onPointerDown={(event) => { event.preventDefault(); sendMovementKey('d', 'keydown'); }} onPointerUp={() => sendMovementKey('d', 'keyup')} onPointerLeave={() => sendMovementKey('d', 'keyup')} onPointerCancel={() => sendMovementKey('d', 'keyup')}>→</button>
      </div>
    )}

    {exploreMode && inStadiumZone && tennisGameActive && !selectedProject && (
      <aside className="tennis-play-hud" aria-label="Practice tennis controls">
        <div className="tennis-play-score">
          <span>COURT 01 / PRACTICE</span>
          <strong>{tennisScore.rugved}<i> — </i>{tennisScore.opponent}</strong>
          <small>RUGVED <b>·</b> OPPONENT</small>
        </div>
        <p>Move with WASD. Click-drag to aim your view. Hit when the ball comes close.</p>
        <button onClick={onTennisHit}>HIT BALL <span>SPACE ↗</span></button>
      </aside>
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
