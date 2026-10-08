import { portfolio } from '../data/portfolio';

const sections=[['01','Entrance','First glimpse of the journey ahead.'],['02','About','A closer look into who I am.'],['03','Skills','What drives me and what I love.'],['04','Projects','Work that moves ideas forward.'],['05','Final Stretch','Same mindset. Bigger opportunities.'],['06','The Stadium','Where ideas, passion and opportunity come together.']];

function fade(progress:number,center:number,width=.13){return Math.max(0,1-Math.abs(progress-center)/width)}

export function Overlay({progress}:{progress:number}){
 const hero=fade(progress,.03,.2),about=fade(progress,.2,.13),skills=fade(progress,.4,.13),projects=fade(progress,.59,.13),finale=fade(progress,.76,.12),stadium=fade(progress,.94,.12);
 const active=progress<.13?0:progress<.3?1:progress<.49?2:progress<.68?3:progress<.86?4:5;
 return <>
  <header className="topbar">
   <a className="brand" href="#top">R.</a>
   <nav><a href="#top">Home</a><a href="#journey">Journey</a><a href="#projects">Projects</a><a href="#gallery">Gallery</a><a href="#contact">Contact</a></nav>
   <div className="topbar-meta"><span>PORTFOLIO / 2026</span><span>MUMBAI, INDIA</span></div>
   <a className="topbar-link" href={portfolio.socials.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
  </header>
  <div className="menu-mark"><span/><span/><span/></div>
  <aside className="section-rail">{sections.map((s,i)=><div key={s[0]} className={i===active?'is-active':''}><b>{s[0]}</b><span>{s[1]}</span></div>)}</aside>
  <div className="copy copy--hero" style={{opacity:hero,transform:`translate3d(0,${(1-hero)*18}px,0)`}}>
   <p className="eyebrow">A portfolio, in motion.</p>
   <h1>A Different<br/>Game<span>.</span></h1>
   <p className="hero-line">Tech · Design · Tennis · Beyond</p>
   <p className="hero-desc">Student, creator and a tennis enthusiast building at the intersection of data, design, business and sport.</p>
   <button onClick={()=>window.scrollTo({top:window.innerHeight*.95,behavior:'smooth'})}>Explore my journey <span>→</span></button>
  </div>
  <section className="copy copy--about" style={{opacity:about}}><p className="eyebrow">02 / About Me</p><h2>Curious by nature.<br/>Builder by instinct.</h2><p>{portfolio.about}</p><div className="line-list"><span>Data Science</span><span>Design & Creatives</span><span>Tennis</span><span>Building for what’s next</span></div></section>
  <section className="copy copy--skills" style={{opacity:skills}}><p className="eyebrow">03 / Skills & Interests</p><h2>Analytics on one side.<br/>Creativity on the other.</h2><p>A mix of analytics, design, business and a constant curiosity to explore new things.</p><div className="line-list"><span>Data & Analytics</span><span>Design & Creativity</span><span>Business & Entrepreneurship</span><span>Tennis</span></div></section>
  <section className="copy copy--projects" style={{opacity:projects}}><p className="eyebrow">04 / Projects</p><h2>Things worth<br/>putting in play.</h2><p>A collection of projects that reflect my learning, creativity and problem solving.</p><div className="project-list">{portfolio.projects.map(p=><div className="project" key={p.number}><b>{p.number}</b><span>{p.title}</span><small>{p.type}</small></div>)}</div></section>
  <section className="copy copy--finale" style={{opacity:finale}}><p className="eyebrow">05 / The Final Stretch</p><h2>Same mindset.<br/>Bigger opportunities.</h2><p>Turning curiosity into opportunity, one idea at a time.</p><div className="line-list"><span>Growth</span><span>Impact</span><span>Opportunities</span><span>What’s Next</span></div></section>
  <section className="copy copy--stadium" style={{opacity:stadium}}><p className="eyebrow">06 / The Stadium</p><h2>Where ideas,<br/>passion and opportunity<br/>come together.</h2><button onClick={()=>window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}>See my projects <span>→</span></button></section>
  <div className="bottom-caption"><b>{sections[active][0]}</b><span>{sections[active][1]}</span><i/> <span>{sections[active][2]}</span><em>Scroll to explore ↓</em></div>
  <div className="progress-dots">{sections.map((_,i)=><span key={i} className={i===active?'is-active':''}/>)}</div>
 </>;
}