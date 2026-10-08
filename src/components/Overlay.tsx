import { portfolio } from '../data/portfolio';

const sections = [
  { at: 0.02, label: 'Entrance' },
  { at: 0.18, label: 'About' },
  { at: 0.38, label: 'Skills' },
  { at: 0.58, label: 'Projects' },
  { at: 0.78, label: 'The Stadium' },
];

function opacity(progress: number, center: number, width = 0.12) {
  const d = Math.abs(progress - center);
  return Math.max(0, 1 - d / width);
}

export function Overlay({ progress }: { progress: number }) {
  const hero = opacity(progress, 0.03, 0.18);
  const about = opacity(progress, 0.19, 0.13);
  const skills = opacity(progress, 0.39, 0.13);
  const projects = opacity(progress, 0.60, 0.15);
  const finale = Math.max(0, Math.min(1, (progress - 0.75) / 0.16));

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Rugved home">R.</a>
        <div className="topbar-meta">
          <span>Portfolio / 2026</span>
          <span>{portfolio.location}</span>
        </div>
        <a className="topbar-link" href={portfolio.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <aside className="progress-rail" aria-hidden="true">
        <div className="progress-rail__line"><span style={{ transform: `scaleY(${progress})` }} /></div>
        {sections.map((s) => (
          <span key={s.label} className="progress-rail__label" style={{ opacity: progress > s.at - 0.08 ? 1 : 0.35 }}>
            {s.label}
          </span>
        ))}
      </aside>

      <div className="hud">
        <span>SCROLL TO WALK</span>
        <span>{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
      </div>

      <section className="copy copy--hero" style={{ opacity: hero, transform: `translate3d(0,${(1 - hero) * 18}px,0)` }}>
        <p className="eyebrow">A portfolio, in motion.</p>
        <h1>Rugved<span>.</span></h1>
        <p className="hero-line">{portfolio.intro}</p>
        <p className="micro">Walk forward. There is more to see.</p>
      </section>

      <section className="copy copy--about" style={{ opacity: about }}>
        <p className="eyebrow">01 / About</p>
        <h2>Curious by nature.<br />Builder by instinct.</h2>
        <p>{portfolio.about}</p>
      </section>

      <section className="copy copy--skills" style={{ opacity: skills }}>
        <p className="eyebrow">02 / The toolkit</p>
        <h2>Data on one side.<br />Design on the other.</h2>
        <div className="tag-grid">
          {portfolio.skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="copy copy--projects" style={{ opacity: projects }}>
        <p className="eyebrow">03 / Selected work</p>
        <h2>Things I’ve<br />enjoyed building.</h2>
        <div className="project-list">
          {portfolio.projects.map((project) => (
            <article key={project.number} className="project">
              <span>{project.number}</span>
              <div>
                <h3>{project.title}</h3>
                <p>{project.type}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="copy copy--finale" style={{ opacity: finale, transform: `translateY(${(1 - finale) * 20}px)` }}>
        <p className="eyebrow">04 / Match point</p>
        <h2>Welcome<br />to the stadium.</h2>
        <p>Projects, experiments and ideas — all in play.</p>
        <div className="final-links">
          <a href={portfolio.socials.github} target="_blank" rel="noreferrer">Explore GitHub ↗</a>
          <a href={portfolio.socials.email}>Get in touch ↗</a>
        </div>
      </section>
    </>
  );
}