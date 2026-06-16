/* Esports Progress Hub — application logic (router, pages, calculators, planner).
   Loads after data.js and filegen.js. */

/* ===================== HELPERS ===================== */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));}
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild;}
const $=(id)=>document.getElementById(id);

/* ===================== ROUTER ===================== */
const NAV = [
  {group:"Progress",items:[
    {id:"home",label:"Home"},
    {id:"gradecalc",label:"Grade Calculator"},
    {id:"ucas",label:"UCAS Calculator"},
    {id:"tracker",label:"Target Tracker"},
    {id:"planner",label:"Study Planner"}
  ]},
  {group:"Your course",items:[
    {id:"units",label:"Units Overview"},
    {id:"grading",label:"How Grading Works"},
    {id:"rules",label:"Assessment Rules"},
    {id:"study",label:"Study & Revision Skills"}
  ]},
  {group:"Your future",items:[
    {id:"careers",label:"Careers Hub"},
    {id:"linkedin",label:"LinkedIn & CV"},
    {id:"he",label:"University & UCAS"},
    {id:"apprentice",label:"Apprenticeships & Work"}
  ]}
];

function buildNav(){
  const nav=$('nav'); nav.innerHTML='';
  NAV.forEach(g=>{
    nav.appendChild(el('<div class="nav-group">'+esc(g.group)+'</div>'));
    g.items.forEach(it=>{
      const b=el('<button class="nav-item" data-route="'+it.id+'">'+esc(it.label)+'</button>');
      b.onclick=()=>route(it.id);
      nav.appendChild(b);
    });
  });
}

let currentRoute='home';
function route(id, arg){
  currentRoute=id;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.route===(id.startsWith('unit:')?'units':id)));
  const page=PAGES[id.split(':')[0]];
  const crumb=$('crumb');
  if(page.crumb){crumb.hidden=false;crumb.innerHTML=page.crumb(arg);}
  else crumb.hidden=true;
  $('pageTitle').textContent=typeof page.title==='function'?page.title(arg):page.title;
  $('pageSub').textContent=typeof page.sub==='function'?page.sub(arg):(page.sub||'');
  $('content').innerHTML='';
  page.render($('content'),arg);
  window.scrollTo({top:0});
}

/* ===================== PAGES ===================== */
const PAGES = {};

/* ---------- HOME ---------- */
PAGES.home = {
  title:"BTEC Esports Progress Hub",
  sub:"Everything you need to push your grades higher and plan what comes next — your units, your grade calculators, careers, and routes into work and university.",
  render(c){
    c.appendChild(el(`
      <div class="grid cols-2" style="margin-bottom:16px">
        <div class="hero-card">
          <h3>Aim higher than the minimum</h3>
          <p>Higher grades come from how you write and evidence your work, not how much you write. This hub shows you exactly what each band demands, where your grade stands, and where it can take you.</p>
        </div>
        <div class="quick" id="homeQuick"></div>
      </div>`));
    const q=$('homeQuick');
    [["gradecalc","Work out your overall grade"],["units","Explore your units and what each one needs"],["careers","See where this course can take you"],["ucas","Convert your grades to UCAS points"]]
      .forEach(([r,t])=>{const b=el('<button>'+esc(t)+' <span class="arrow">→</span></button>');b.onclick=()=>route(r);q.appendChild(b);});

    c.appendChild(el(`
      <div class="ladder">
        <div><h4 class="pass-t">Pass — Show it</h4><p>Describe, identify, explain. You show the assessor you know what something is and how it works. Accurate, complete, clearly presented.</p></div>
        <div><h4 class="merit-t">Merit — Connect it</h4><p>Analyse, compare, justify. You link factors together, weigh options against each other, and back every claim with evidence.</p></div>
        <div><h4 class="dist-t">Distinction — Judge it</h4><p>Evaluate, appraise, conclude. You make reasoned judgements, weigh alternatives, and draw conclusions the evidence supports.</p></div>
      </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px">
      <h3>Where to start</h3>
      <div class="prose"><p>New here? Open the <b>Grade Calculator</b> and enter the grades you have so far — you'll see your projected qualification grade straight away. Then visit your <b>Units</b> to see what the next band needs, and the <b>Careers Hub</b> to see why it matters. The whole hub works offline, so you can use it anywhere.</p></div>
    </div>`));
  }
};

/* ---------- UNITS OVERVIEW ---------- */
PAGES.units = {
  title:"Units Overview",
  sub:"Your mandatory units and chosen optionals. Tap any unit for its learning aims, assignment guidance, grade-band breakdown, resources and careers.",
  render(c){
    const note=el(`<div class="notice" style="margin-top:0;margin-bottom:18px">The optional units shown reflect a typical production- and business-focused delivery. Your teaching team confirms which optionals your group studies — if these differ from your timetable, ask your lecturer.</div>`);
    c.appendChild(note);
    [["Year 1 — Foundation Diploma",1],["Year 2 — Extended Diploma (adds to Year 1)",2]].forEach(([heading,yr])=>{
      c.appendChild(el('<h3 style="font-family:var(--font-display);text-transform:uppercase;color:var(--navy);margin:18px 0 12px">'+esc(heading)+'</h3>'));
      const grid=el('<div class="unit-grid"></div>');
      UNITS.filter(u=>u.year===yr).forEach(u=>{
        const tile=el(`<button class="unit-tile">
          <div class="un">Unit ${u.n} · ${u.glh} GLH</div>
          <div class="ut">${esc(u.title)}</div>
          <div class="ub">${esc(u.brief)}</div>
          <div class="um"><span class="tag ${yr===1?'y1':'y2'}">${u.aims.length} learning aims</span></div>
        </button>`);
        tile.onclick=()=>route('unit:'+u.n, u.n);
        grid.appendChild(tile);
      });
      c.appendChild(grid);
    });
  }
};

/* ---------- UNIT DETAIL ---------- */
PAGES.unit = {
  crumb:(n)=>{return '<a href="#" onclick="route(\'units\');return false">Units Overview</a> › Unit '+n;},
  title:(n)=>{const u=UNITS.find(x=>x.n==n);return 'Unit '+u.n+': '+u.title;},
  sub:(n)=>{const u=UNITS.find(x=>x.n==n);return u.brief;},
  render(c,n){
    const u=UNITS.find(x=>x.n==n);
    c.appendChild(el(`<div style="margin-bottom:16px">
      <span class="pill">${u.glh} guided learning hours</span>
      <span class="pill">${u.year===1?'Year 1':'Year 2'}</span>
      <span class="pill">Internally assessed</span>
      <span class="pill">Worth up to ${UNIT_PTS[String(u.glh)].D} points at Distinction</span>
    </div>`));

    c.appendChild(el(`<div class="grid cols-2">
      <div class="card">
        <h3>Learning aims</h3>
        <div id="uaims"></div>
      </div>
      <div class="card">
        <h3>Assignment guidance</h3>
        <div class="prose"><p style="font-size:.9rem;color:var(--muted);margin-bottom:10px"><b>How it's assessed:</b> ${esc(u.assessment)}</p><p>${esc(u.guidance)}</p></div>
      </div>
    </div>`));
    const aims=$('uaims');
    u.aims.forEach(([a,t])=>aims.appendChild(el(`<div class="aim"><div class="a">${a}</div><div class="t">${esc(t)}</div></div>`)));

    // grade band breakdown
    c.appendChild(el(`<div class="card" style="margin-top:16px">
      <h3>What each grade band needs</h3>
      <div class="ladder" style="margin-top:6px">
        <div><h4 class="pass-t">Pass</h4><p>Address every Pass criterion accurately and completely. Use the command verb: if it says <i>describe</i> or <i>explain</i>, show clear, correct knowledge of each learning aim.</p></div>
        <div><h4 class="merit-t">Merit</h4><p>Go beyond describing: <i>analyse</i>, <i>compare</i> and <i>justify</i>. Connect factors together and support every claim with evidence or a worked example.</p></div>
        <div><h4 class="dist-t">Distinction</h4><p><i>Evaluate</i> and <i>draw conclusions</i>. Weigh alternatives and trade-offs, judge what worked and why, and reach conclusions the evidence supports.</p></div>
      </div>
      <p style="font-size:.84rem;color:var(--muted);margin-top:12px">Always check the exact criteria on your assignment brief — these are the patterns the command verbs follow, not a substitute for the brief.</p>
    </div>`));

    c.appendChild(el(`<div class="grid cols-2" style="margin-top:16px">
      <div class="card"><h3>Study resources</h3><div class="reslist" id="ures"></div></div>
      <div class="card"><h3>Where this unit leads</h3><div id="ucar"></div>
        <p style="font-size:.84rem;color:var(--muted);margin-top:12px">See the <a href="#" onclick="route('careers');return false">Careers Hub</a> for full role profiles.</p>
      </div>
    </div>`));
    const res=$('ures');
    u.resources.forEach(([rn,url,rd])=>{
      res.appendChild(el(`<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><div class="rn">${esc(rn)}</div><div class="rd">${esc(rd)}</div></a>`));
    });
    const car=$('ucar');
    u.careers.forEach(role=>car.appendChild(el('<span class="pill">'+esc(role)+'</span>')));

    // nav between units
    const ids=UNITS.map(x=>x.n);
    const i=ids.indexOf(Number(n));
    const navrow=el('<div style="display:flex;justify-content:space-between;margin-top:20px;gap:10px"></div>');
    if(i>0){const b=el('<button class="btn btn-ghost">← Unit '+ids[i-1]+'</button>');b.onclick=()=>route('unit:'+ids[i-1],ids[i-1]);navrow.appendChild(b);}else navrow.appendChild(el('<span></span>'));
    if(i<ids.length-1){const b=el('<button class="btn btn-ghost">Unit '+ids[i+1]+' →</button>');b.onclick=()=>route('unit:'+ids[i+1],ids[i+1]);navrow.appendChild(b);}
    c.appendChild(navrow);
  }
};

/* ---------- HOW GRADING WORKS ---------- */
PAGES.grading = {
  title:"How Grading Works",
  sub:"Understand how individual unit grades become an overall qualification grade — and where the points really come from.",
  render(c){
    c.appendChild(el(`<div class="card"><h3>The two-step system</h3>
      <div class="prose">
        <p>Every unit is graded <b>Unclassified, Pass, Merit or Distinction</b>. Each grade is worth a number of points, and bigger units (more guided learning hours) are worth more points. Your <b>overall qualification grade</b> comes from adding up all your unit points and comparing the total against Pearson's grade thresholds.</p>
        <p>Two things matter most: <b>bigger units carry more weight</b>, and <b>every band you climb is worth more than the last</b>. Moving a 120 GLH unit from Merit to Distinction adds 12 points — twice what a 60 GLH unit adds.</p>
      </div></div>`));

    c.appendChild(el(`<div class="grid cols-2" style="margin-top:16px">
      <div class="card"><h3>Points per unit</h3>
        <table class="pts-table">
          <tr><th>Grade</th><th>60 GLH</th><th>90 GLH</th><th>120 GLH</th></tr>
          <tr><td>Unclassified</td><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>Pass</td><td>6</td><td>9</td><td>12</td></tr>
          <tr><td>Merit</td><td>10</td><td>15</td><td>20</td></tr>
          <tr><td>Distinction</td><td><b>16</b></td><td><b>24</b></td><td><b>32</b></td></tr>
        </table>
        <p style="font-size:.84rem;color:var(--muted);margin-top:10px">All Esports units are internally assessed.</p>
      </div>
      <div class="card"><h3>Qualification thresholds</h3>
        <table class="pts-table">
          <tr><th colspan="2">Foundation (Y1)</th><th colspan="2">Extended (Y2)</th></tr>
          <tr><td>P</td><td>54</td><td>PPP</td><td>108</td></tr>
          <tr><td>M</td><td>78</td><td>MMM</td><td>156</td></tr>
          <tr><td>D</td><td>108</td><td>DDD</td><td>216</td></tr>
          <tr><td>D*</td><td>138</td><td>D*D*D*</td><td>270</td></tr>
        </table>
        <p style="font-size:.84rem;color:var(--muted);margin-top:10px">Intermediate grades (MPP, DMM, etc.) sit between these.</p>
      </div>
    </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>The rules that override points</h3>
      <div class="prose"><ul>
        <li><b>Every mandatory unit must be at least a Pass.</b> A U in any mandatory unit makes the whole qualification Unclassified — no matter how many points you have.</li>
        <li><b>Unclassified (U):</b> if any mandatory unit is U, the whole qualification is U.</li>
        <li><b>Year 1 grades carry forward.</b> The Extended Diploma is graded across all 15 units from both years, so a strong Year 1 is banked into your final grade.</li>
      </ul></div>
      <button class="btn btn-primary" id="g2c" style="margin-top:6px">Open the Grade Calculator →</button>
    </div>`));
    $('g2c').onclick=()=>route('gradecalc');
  }
};

/* ---------- ASSESSMENT RULES ---------- */
PAGES.rules = {
  title:"Assessment Rules",
  sub:"Deadlines, resubmissions and authenticity decide grades just as much as your writing. The essentials from your course handbook, in one place.",
  render(c){
    const cards=[
      ["Submitting your work","All work is submitted electronically via <b>Teams Assignments</b> by the due date, with the declaration that the work is your own. Every assignment needs a cover page, a contents page and page numbers, with your name, your lecturer's name and the unit number in the header or footer of each page."],
      ["Deadlines","If you might miss a deadline, speak to your subject lecturer <b>before</b> the deadline day — in extenuating circumstances an extension may be negotiated. Missing a deadline without arrangement triggers a Conduct and Support plan and contact with your next of kin. If you are absent, log it on your eILP before 10.00am."],
      ["Resubmissions","One resubmission opportunity may be authorised by the Lead Internal Verifier, and only if you met the initial deadline, your lecturer judges you can improve the work without further guidance, and your declaration of authenticity is signed. A resubmission can target any grade."],
      ["Retakes","If a resubmission still does not achieve a Pass, you may be offered a retake: a <b>new task targeting Pass criteria only</b>. No further resubmission or retake follows it — which is why getting it right first time matters."],
      ["Your own work","Reproducing text without acknowledging and referencing your sources — <b>including the use of AI</b> — is malpractice, treated the same as copying. Never give another student your work to use or copy: if their submission resembles yours, both of you face an investigation."],
      ["Where your grades live","Unit grades are recorded in the college's Universal Tracker, visible on your eILP — these are the grades sent to the awarding body. Use them with the Grade Calculator to track your overall result through the year."]
    ];
    const grid=el('<div class="grid cols-2"></div>');
    cards.forEach(([h,b])=>grid.appendChild(el('<div class="card"><h4>'+esc(h)+'</h4><p style="font-size:.92rem">'+b+'</p></div>')));
    c.appendChild(grid);
  }
};

/* ---------- STUDY & REVISION SKILLS ---------- */
PAGES.study = {
  title:"Study & Revision Skills",
  sub:"Practical techniques to plan your time, evidence your work like a professional, and revise so it sticks.",
  render(c){
    c.appendChild(el(`<div class="grid cols-2">
      <div class="card"><h3>Evidence like a producer</h3><div class="prose"><p>Assessors grade what you <i>show</i>, not what you did. For practical units especially, the planning evidence is where marks are won and lost.</p><ul>
        <li>Keep a working folder: drafts, screenshots, shot lists, plans, data — date everything.</li>
        <li>Annotate your own work: a short voiceover or note explaining a decision is evidence of analysis.</li>
        <li>Map your evidence to the criteria before you submit — tick off each P/M/D criterion.</li>
      </ul></div></div>
      <div class="card"><h3>Climb the command verbs</h3><div class="prose"><p>Read the verb in each criterion and write to match it. The most common reason work stays at Pass is writing that <i>describes</i> when the criterion asked you to <i>evaluate</i>.</p></div>
        <div id="verbBands"></div>
      </div>
    </div>`));
    const vb=$('verbBands');
    Object.entries(VERB_BANDS).forEach(([k,v])=>{
      vb.appendChild(el(`<div style="margin-top:10px"><span class="band ${k}">${esc(v.label)}</span>
        <div style="font-size:.86rem;color:var(--muted);margin:4px 0">${esc(v.desc)}</div>
        <div>${v.verbs.map(x=>'<span class="pill">'+esc(x)+'</span>').join('')}</div></div>`));
    });

    c.appendChild(el(`<div class="grid cols-2" style="margin-top:16px">
      <div class="card"><h3>Revision that works</h3><div class="prose"><ul>
        <li><b>Spaced practice</b> — revisit a topic across several short sessions, not one long cram. Memory strengthens with each return.</li>
        <li><b>Retrieval practice</b> — close the notes and try to recall, then check. Struggling to remember is what builds the memory.</li>
        <li><b>Past briefs</b> — for externally-influenced thinking, rehearse with realistic scenarios and mark yourself against the criteria.</li>
        <li><b>Teach it</b> — explaining a concept to someone else exposes the gaps faster than re-reading.</li>
      </ul></div></div>
      <div class="card"><h3>Plan your time</h3><div class="prose"><ul>
        <li>Put every assignment deadline from your assessment plan into one calendar at the start of the trimester.</li>
        <li>Work backwards: set your own draft-complete date a few days before each deadline.</li>
        <li>Break big units (Unit 2, Unit 5) into per-learning-aim chunks — they're too large to tackle in one go.</li>
        <li>Protect resubmission eligibility by always meeting the first deadline, even with imperfect work.</li>
      </ul></div></div>
    </div>`));
  }
};

/* ---------- CAREERS HUB ---------- */
const ROLES = [
  {t:"Performance Analyst",s:"£22k–£45k+ · esports orgs, agencies",d:"Break down VODs and data to find what wins and what loses. Builds directly on Unit 2.",units:[2,12]},
  {t:"Shoutcaster / Commentator",s:"Freelance to salaried · broadcasters, events",d:"Inform and entertain live audiences. Presenting and broadcast journalism are close cousins.",units:[11,6]},
  {t:"Stream Producer / Broadcast Technician",s:"£20k–£40k+ · production companies, platforms",d:"Run the technical broadcast — scenes, overlays, multi-camera, encoding.",units:[6,8]},
  {t:"Video Editor / Content Creator",s:"Freelance to £35k+ · media, marketing, in-house",d:"Produce highlight reels, promos and social content. Transferable far beyond esports.",units:[8,7]},
  {t:"Social Media / Digital Marketing Manager",s:"£24k–£45k+ · brands, agencies, orgs",d:"Grow audiences and run campaigns with measurable results.",units:[10,7]},
  {t:"Brand / Marketing Designer",s:"£22k–£40k+ · agencies, in-house",d:"Build visual identities and activation content. Strong portfolio routes.",units:[7,8]},
  {t:"Event Manager / Producer",s:"£24k–£45k+ · event companies, venues",d:"Plan and run live events end to end. Project-management skills transfer everywhere.",units:[5,3]},
  {t:"Esports Coach",s:"Freelance to salaried · orgs, academies, education",d:"Develop players through planned sessions and honest reflection.",units:[12,2]},
  {t:"Founder / Entrepreneur",s:"Variable · self-employed",d:"Start your own org, agency or product. Risk and reward both high.",units:[3,18]},
  {t:"Community / Player Welfare",s:"£22k–£38k+ · orgs, platforms",d:"Keep communities healthy and players well. Growing as the industry matures.",units:[4,1]}
];
PAGES.careers = {
  title:"Careers Hub",
  sub:"The esports industry is far bigger than playing. These are real roles this course builds towards — and the skills transfer well beyond esports.",
  render(c){
    c.appendChild(el(`<div class="card" style="margin-bottom:16px"><h3>Two truths worth knowing</h3>
      <div class="prose"><p>First: <b>very few people earn a living as professional players</b> — but the industry employs thousands in production, media, business, events and coaching, and those jobs are stable careers. Second: <b>the skills you build are transferable</b>. A video editor, a social media manager or an event producer trained in esports can work in any sector.</p></div></div>`));
    const grid=el('<div class="grid cols-2"></div>');
    ROLES.forEach(r=>{
      const card=el(`<div class="role"><div class="rt">${esc(r.t)}</div><div class="rs">${esc(r.s)}</div><p>${esc(r.d)}</p><div style="margin-top:8px" data-units></div></div>`);
      const ud=card.querySelector('[data-units]');
      r.units.forEach(n=>{const b=el('<span class="pill" style="cursor:pointer">Unit '+n+'</span>');b.onclick=()=>route('unit:'+n,n);ud.appendChild(b);});
      grid.appendChild(card);
    });
    c.appendChild(grid);
    c.appendChild(el(`<div class="notice">Salary ranges are broad indicative UK figures to show scale, not guarantees — they vary widely by employer, location and experience. Always research current live vacancies for accurate pay.</div>`));
    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>Build evidence employers want — now</h3>
      <div class="prose"><ul>
        <li>Keep a <b>portfolio</b> of your best coursework: reels, broadcasts, brand work, event plans. This <i>is</i> your job application in creative roles.</li>
        <li>Volunteer at college and local events — real production credits beat any certificate.</li>
        <li>Enter competitions and grassroots tournaments through the <a href="https://britishesports.org" target="_blank" rel="noopener">British Esports Federation</a>.</li>
        <li>Set up your <a href="#" onclick="route('linkedin');return false">LinkedIn profile</a> now, not in your final term.</li>
      </ul></div></div>`));
  }
};

/* ---------- LINKEDIN & CV ---------- */
PAGES.linkedin = {
  title:"LinkedIn & CV",
  sub:"Your professional shop window. Set it up now — opportunities in this industry come through visibility and networks as much as applications.",
  render(c){
    c.appendChild(el(`<div class="grid cols-2">
      <div class="card"><h3>LinkedIn: the essentials</h3><div class="prose"><ul>
        <li><b>Headline</b> — not just "Student". Try "BTEC Esports student | Video production & broadcast | Exeter College".</li>
        <li><b>Photo</b> — a clear, friendly head-and-shoulders shot. No logos, no in-game avatars.</li>
        <li><b>About</b> — three short paragraphs: who you are, what you're building skills in, what you're looking for.</li>
        <li><b>Featured</b> — pin your best work: a reel, a broadcast clip, a brand project.</li>
        <li><b>Experience</b> — list event volunteering, projects and roles, even unpaid. Describe the <i>impact</i>, not just the task.</li>
        <li><b>Skills</b> — add OBS, Premiere/DaVinci, social analytics, event planning, whatever's real.</li>
      </ul></div></div>
      <div class="card"><h3>Networking without cringe</h3><div class="prose"><ul>
        <li>Follow esports orgs, production companies and people doing the job you want.</li>
        <li>Comment thoughtfully on posts — visibility compounds over time.</li>
        <li>When you connect, add a one-line note: who you are and why.</li>
        <li>Share your own work and what you learned. A monthly post is plenty.</li>
        <li>Be findable: a consistent name and handle across LinkedIn and your portfolio.</li>
      </ul></div></div>
    </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>A CV that gets read</h3>
      <div class="prose"><p>Keep it to <b>one page</b> at this stage. Order: contact details, a two-line personal statement, key skills, education (your BTEC and projected grade), experience and projects, then interests if space allows.</p>
      <ul>
        <li>Lead each bullet with a strong verb and a result: "Produced a 60-second highlight reel that…", "Ran the broadcast desk for a 100-person event".</li>
        <li>Match the language to the job advert — mirror the skills they ask for.</li>
        <li>Quantify wherever you can: viewers, engagement, attendees, turnaround time.</li>
        <li>Proofread twice, then ask someone else. Typos cost interviews.</li>
      </ul></div>
      <div class="notice" style="margin-top:6px">Exeter College's careers and tutorial teams can review your CV and LinkedIn — book a session. The skills in your <a href="#" onclick="route('careers');return false">target career</a> should shape what you emphasise.</div>
    </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>Profile checklist</h3><div id="liCheck"></div></div>`));
    const items=["Professional photo uploaded","Headline names my specialism","About section written (3 short paragraphs)","At least one piece of work in Featured","Experience lists impact, not just tasks","5+ real skills added","Following 10+ relevant people/orgs","One-page CV drafted","CV reviewed by careers/tutorial team"];
    const ch=$('liCheck');
    items.forEach((t,i)=>{
      ch.appendChild(el(`<div class="check"><input type="checkbox" id="li${i}"><label for="li${i}">${esc(t)}</label></div>`));
    });
  }
};

/* ---------- UNIVERSITY & UCAS ---------- */
PAGES.he = {
  title:"University & UCAS",
  sub:"Your BTEC is a recognised route into higher education. Here's how the pathway works and what to do when.",
  render(c){
    c.appendChild(el(`<div class="card"><h3>Your grade is worth real UCAS points</h3>
      <div class="prose"><p>The Extended Diploma is equivalent in size to three A Levels, and the grades convert directly to UCAS tariff points. <b>DDD carries the same 144 points as AAA at A Level.</b> Many universities make BTEC offers in grades (e.g. "DMM") rather than points — always check the specific course page.</p></div>
      <button class="btn btn-primary" id="he2u" style="margin-top:6px">Open the UCAS Calculator →</button>
    </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>The UCAS timeline</h3>
      <div class="timeline">
        <div class="tl"><h4>Year 1 — explore</h4><p>Research courses and universities. Attend open days. Your Year 1 grades are banked into your final result, so aim high now.</p></div>
        <div class="tl"><h4>Summer before Year 2</h4><p>Shortlist around five courses. Note their entry requirements and any specific grade or subject conditions.</p></div>
        <div class="tl"><h4>Autumn, Year 2</h4><p>Write your personal statement, secure a reference, and submit your UCAS application. Most courses have a mid-January equal-consideration deadline.</p></div>
        <div class="tl"><h4>Spring, Year 2</h4><p>Respond to offers — pick a firm and an insurance choice. Keep working: offers are conditional on your final grades.</p></div>
        <div class="tl"><h4>Results & Clearing</h4><p>If you meet your offer, you're in. If not, Clearing and Adjustment open up alternatives. Don't panic — options exist.</p></div>
      </div>
    </div>`));

    c.appendChild(el(`<div class="grid cols-2" style="margin-top:16px">
      <div class="card"><h3>Personal statement tips</h3><div class="prose"><ul>
        <li>Open with genuine motivation for the subject, not a quote.</li>
        <li>Evidence it: link your BTEC units and projects to the course.</li>
        <li>Show transferable skills — teamwork, deadlines, analysis.</li>
        <li>Mention relevant wider activity: events, portfolio, volunteering.</li>
        <li>End with where you want it to take you.</li>
      </ul></div></div>
      <div class="card"><h3>Courses to look at</h3><div class="prose"><p>BTEC Esports students commonly progress to degrees in:</p><ul>
        <li>Esports (production, business or coaching pathways)</li>
        <li>Media & video production, film, broadcast</li>
        <li>Marketing, business and event management</li>
        <li>Games design and computing</li>
        <li>Sport & exercise science, coaching</li>
      </ul><p style="font-size:.84rem;color:var(--muted)">Check each course accepts BTEC and confirm the exact grade requirement.</p></div></div>
    </div>`));
    $('he2u').onclick=()=>route('ucas');
  }
};

/* ---------- APPRENTICESHIPS & WORK ---------- */
PAGES.apprentice = {
  title:"Apprenticeships & Work",
  sub:"University isn't the only route. Apprenticeships let you earn while you learn, and direct routes into work suit portfolio-driven creative roles.",
  render(c){
    c.appendChild(el(`<div class="grid cols-2">
      <div class="card"><h3>Why consider an apprenticeship?</h3><div class="prose"><ul>
        <li><b>Earn while you learn</b> — a real wage and no tuition debt.</li>
        <li><b>Real experience</b> — employers value time on the job highly.</li>
        <li><b>Recognised qualifications</b> — up to degree level (Levels 4–6).</li>
        <li><b>A foot in the door</b> — many apprentices are kept on permanently.</li>
      </ul></div></div>
      <div class="card"><h3>Routes that fit this course</h3><div class="prose"><ul>
        <li>Digital marketing & content production</li>
        <li>Broadcast & media technical roles</li>
        <li>Business administration & events</li>
        <li>IT, networking and digital support</li>
        <li>Creative & design apprenticeships</li>
      </ul><p style="font-size:.84rem;color:var(--muted)">Search live vacancies on the government's <a href="https://www.gov.uk/apply-apprenticeship" target="_blank" rel="noopener">Find an apprenticeship</a> service.</p></div></div>
    </div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>Going straight into work</h3>
      <div class="prose"><p>In creative and production roles, a strong <b>portfolio</b> and real credits can matter more than a degree. If this is your route:</p>
      <ul>
        <li>Treat every assignment as a portfolio piece — quality over quantity.</li>
        <li>Build credits through college and local events; ask to be named in the production.</li>
        <li>Get your <a href="#" onclick="route('linkedin');return false">LinkedIn and CV</a> sharp and findable.</li>
        <li>Network actively — see the <a href="#" onclick="route('careers');return false">Careers Hub</a>.</li>
      </ul></div></div>`));

    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>Whatever the route — your grade still matters</h3>
      <div class="prose"><p>Apprenticeship providers and employers both look at your qualification grade as a signal of reliability and ability. The same effort that earns a Distinction makes every route easier. Check where you stand in the <a href="#" onclick="route('gradecalc');return false">Grade Calculator</a>.</p></div></div>`));
  }
};

/* ===================== SHARED GRADE STATE ===================== */
/* One store: Extended Diploma is graded across all units from both years */
const gcState = {mand:{}, opts:[]};
QUALS.y2.mandatory.forEach(u=>gcState.mand[u.n]='M');
gcState.opts=[8,11,10,6,7,12,1,1,1,1].map(n=>({unit:n,grade:'M'})); // first 3 = Y1 optionals; placeholders adjusted below
// sensible defaults: use the optionals we actually document
gcState.opts=[7,8,10,6,9,11,12,13,19,20].map(n=>({unit:n,grade:'M'}));

function computeQual(year){
  const Q=QUALS[year];
  const opts=gcState.opts.slice(0,Q.optCount);
  const all=[...Q.mandatory.map(u=>({glh:u.glh,grade:gcState.mand[u.n]})),...opts.map(o=>({glh:'60',grade:o.grade}))];
  const total=all.reduce((s,u)=>s+UNIT_PTS[u.glh][u.grade],0);
  const failedMand=Q.mandatory.filter(u=>gcState.mand[u.n]==='U');
  const glhAtPass=all.reduce((s,u)=>s+(u.grade!=='U'?Number(u.glh):0),0);
  const eligible = failedMand.length === 0;
  let grade='U';
  if(eligible){ for(const [g,thr] of Q.thresholds){ if(total>=thr) grade=g; } }
  return {Q,all,total,failedMand,glhAtPass,eligible,grade};
}
function gradeColour(g){return g==='U'?'var(--accent)':(g.includes('D')?'var(--dist)':(g.includes('M')?'var(--merit)':'var(--navy)'));}
function unitTitle(n){const u=UNITS.find(x=>x.n===n);return u?u.title:'Unit '+n;}
function gradeSelectEl(val,onchange){
  const s=el('<select style="max-width:150px"></select>');
  [['U','Unclassified'],['P','Pass'],['M','Merit'],['D','Distinction']].forEach(([v,l])=>{
    const o=el('<option value="'+v+'">'+l+'</option>');if(v===val)o.selected=true;s.appendChild(o);
  });
  s.onchange=()=>onchange(s.value);
  return s;
}

/* ---------- GRADE CALCULATOR ---------- */
let gcYear='y1';
PAGES.gradecalc = {
  title:"Grade Calculator",
  sub:"Enter the grade for each unit and see your overall qualification grade, exactly as Pearson calculates it — plus what stands between you and the next grade up.",
  render(c){
    c.appendChild(el(`<div class="mode-tabs">
      <button class="mode-tab ${gcYear==='y1'?'active':''}" data-year="y1">Year 1 — Foundation Diploma</button>
      <button class="mode-tab ${gcYear==='y2'?'active':''}" data-year="y2">Year 2 — Extended Diploma</button>
    </div>`));
    c.querySelectorAll('[data-year]').forEach(t=>t.onclick=()=>{gcYear=t.dataset.year;route('gradecalc');});

    c.appendChild(el(`<div class="grid cols-2" style="align-items:start">
      <div>
        <div class="card">
          <h4>Units</h4>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:10px">Set the grade for each unit — entries are remembered across both tabs. <span id="gcGlhLine"></span></p>
          <div id="gcMandatory"></div>
          <div id="gcOptional"></div>
        </div>
      </div>
      <div>
        <div class="card" aria-live="polite">
          <div id="gcQualName" style="font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)"></div>
          <div style="display:flex;align-items:baseline;gap:14px;margin-top:6px;flex-wrap:wrap">
            <div id="gcGrade" style="font-family:var(--font-display);font-weight:800;font-size:3.2rem;line-height:1">—</div>
            <div style="font-size:.95rem;color:var(--muted)"><b id="gcPoints" style="color:var(--ink)">0</b> points</div>
          </div>
          <div id="gcSplit" style="font-size:.85rem;color:var(--muted);margin-top:6px"></div>
          <div id="gcEligibility"></div>
          <div id="gcNext" style="margin-top:14px"></div>
          <div id="gcMeaning" style="margin-top:14px"></div>
        </div>
        <div class="card" style="margin-top:16px">
          <h4>The Distinction dividend</h4>
          <div class="totals"><div class="total-box"><div class="n" id="gcTotalNow">0</div><div class="l">Points now</div></div>
          <div class="total-box uplift"><div class="n" id="gcTotalIf">0</div><div class="l">If every Merit became a Distinction</div></div></div>
          <p id="gcUpliftGrade" style="font-size:.88rem;color:var(--muted);margin-top:12px"></p>
        </div>
      </div>
    </div>`));
    renderCalc();
  }
};

function renderCalc(){
  const Q=QUALS[gcYear], isY2=gcYear==='y2';
  const mandToShow=isY2?Q.mandatory.filter(u=>u.n>4):Q.mandatory;
  const optStart=isY2?3:0;
  const visibleOpts=gcState.opts.slice(optStart,Q.optCount);
  const mWrap=$('gcMandatory'); mWrap.innerHTML='';

  if(isY2){
    const y1=computeQual('y1');
    const y1U=y1.all.filter(u=>u.grade==='U').length;
    const chips=[...QUALS.y1.mandatory.map(u=>'<span class="pill">U'+u.n+': '+gcState.mand[u.n]+' · '+UNIT_PTS[u.glh][gcState.mand[u.n]]+'pts</span>'),
      ...gcState.opts.slice(0,3).map(o=>'<span class="pill">U'+o.unit+': '+o.grade+' · '+UNIT_PTS['60'][o.grade]+'pts</span>')].join('');
    const banked=el(`<div style="background:#F8FAFC;border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:14px">
      <div style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Carried forward from Year 1</div>
      <div style="margin-bottom:8px">${chips}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="font-size:.92rem"><b style="font-family:var(--font-display);font-size:1.2rem;color:var(--navy)">${y1.total} points</b> banked from 7 Year 1 units${y1U?' <span style="color:var(--accent);font-weight:600">('+y1U+' at U)</span>':''}</div>
        <button class="btn btn-ghost" id="gcEditY1" style="padding:6px 14px;font-size:.85rem">Edit Year 1</button></div></div>`);
    mWrap.appendChild(banked);
    banked.querySelector('#gcEditY1').onclick=()=>{gcYear='y1';route('gradecalc');};
  }

  mandToShow.forEach(u=>{
    const row=el('<div class="unit-row" style="grid-template-columns:1fr auto auto"></div>');
    row.appendChild(el(`<div style="font-size:.9rem"><b>Unit ${u.n}:</b> ${esc(unitTitle(u.n))} <span class="pill">${u.glh} GLH</span></div>`));
    row.appendChild(gradeSelectEl(gcState.mand[u.n],v=>{gcState.mand[u.n]=v;renderCalc();}));
    row.appendChild(el(`<div style="font-family:var(--font-display);font-weight:700;color:var(--navy);min-width:54px;text-align:right">${UNIT_PTS[u.glh][gcState.mand[u.n]]} pts</div>`));
    mWrap.appendChild(row);
  });

  const oWrap=$('gcOptional'); oWrap.innerHTML='';
  visibleOpts.forEach(o=>{
    const row=el('<div class="unit-row" style="grid-template-columns:1fr auto auto"></div>');
    const sel=el('<select></select>');
    OPTIONAL_UNITS.forEach(u=>{const op=el('<option value="'+u.n+'">Unit '+u.n+': '+esc(u.t)+'</option>');if(u.n===o.unit)op.selected=true;sel.appendChild(op);});
    sel.onchange=()=>{o.unit=Number(sel.value);renderCalc();};
    row.appendChild(sel);
    row.appendChild(gradeSelectEl(o.grade,v=>{o.grade=v;renderCalc();}));
    row.appendChild(el(`<div style="font-family:var(--font-display);font-weight:700;color:var(--navy);min-width:54px;text-align:right">${UNIT_PTS['60'][o.grade]} pts</div>`));
    oWrap.appendChild(row);
  });
  $('gcGlhLine').textContent=isY2
    ?'Year 2 adds Unit 5 plus seven more units. Your Extended Diploma grade is calculated across all 15 units from both years.'
    :'The Foundation Diploma totals 540 GLH across 7 units.';

  const res=computeQual(gcYear);
  const totalIfD=res.all.reduce((s,u)=>s+UNIT_PTS[u.glh][u.grade==='M'?'D':u.grade],0);
  $('gcQualName').textContent=Q.name+' · '+Q.glh+' GLH · size of '+(isY2?'three A Levels':'1.5 A Levels');
  const gEl=$('gcGrade'); gEl.textContent=res.grade; gEl.style.color=gradeColour(res.grade);
  $('gcPoints').textContent=res.total;
  $('gcSplit').textContent=isY2?(computeQual('y1').total+' points from Year 1 + '+(res.total-computeQual('y1').total)+' points from Year 2'):'';

  const elig=$('gcEligibility');
  if(res.failedMand.length){
    elig.innerHTML='<div class="feedback no"><b>Unclassified regardless of points:</b> Pearson requires at least a Pass in each of Units '+Q.mandatory[0].n+'–'+Q.mandatory[Q.mandatory.length-1].n+'. Currently at U: '+res.failedMand.map(u=>'Unit '+u.n).join(', ')+'.</div>';
  } else elig.innerHTML='';

  const nextEl=$('gcNext');
  if(!res.eligible){ nextEl.innerHTML='<div style="font-size:.9rem;color:var(--muted)">Fix the eligibility issue above — points only count once it is resolved.</div>'; }
  else {
    const idx=Q.thresholds.findIndex(([g])=>g===res.grade);
    if(idx<Q.thresholds.length-1){
      const [nextG,nextThr]=Q.thresholds[idx+1];
      const need=nextThr-res.total, curThr=Q.thresholds[idx][1];
      const pct=Math.min(100,Math.round((res.total-curThr)/(nextThr-curThr)*100));
      nextEl.innerHTML='<div style="font-size:.8rem;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Next grade up: <b style="color:var(--navy)">'+esc(nextG)+'</b> at '+nextThr+' points</div><div class="progressbar"><div style="width:'+pct+'%"></div></div><div style="font-size:.9rem">You need <b>'+need+' more point'+(need===1?'':'s')+'</b>. A 60 GLH unit Merit→Distinction is worth +6; a 120 GLH unit +12.</div>';
    } else nextEl.innerHTML='<div style="font-size:.9rem;color:var(--good);font-weight:600">You are at the top of the scale — the maximum possible result.</div>';
  }

  const meanEl=$('gcMeaning');
  let ucasLine='';
  if(res.eligible&&res.grade!=='U'&&Q.ucas[res.grade]!==undefined){
    ucasLine='<span class="pill gold">'+Q.ucas[res.grade]+' UCAS points</span>'+(Q.aLevel&&Q.aLevel[res.grade]?'<span class="pill">Same as '+Q.aLevel[res.grade]+' at A Level</span>':'');
  }
  meanEl.innerHTML='<div style="font-size:.8rem;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">What this grade means</div>'+(ucasLine?'<div style="margin-bottom:8px">'+ucasLine+'</div>':'')+'<div style="font-size:.92rem">'+esc(Q.meaning[res.grade]||'')+'</div>';

  $('gcTotalNow').textContent=res.total;
  $('gcTotalIf').textContent=totalIfD;
  let upG='U'; if(res.eligible){for(const[g,thr]of Q.thresholds){if(totalIfD>=thr)upG=g;}}
  const merits=res.all.filter(u=>u.grade==='M').length;
  $('gcUpliftGrade').textContent=merits===0?'No Merits to convert right now.':(res.eligible&&upG!==res.grade?'Converting your '+merits+' Merit'+(merits===1?'':'s')+' to Distinctions lifts you from '+res.grade+' to '+upG+'. Same units, better evidence.':'Converting your '+merits+' Merit'+(merits===1?'':'s')+' adds '+(totalIfD-res.total)+' points — banked insurance.');
}

/* ---------- UCAS CALCULATOR ---------- */
const OTHER_QUALS = {
  "A Level":{"A*":56,"A":48,"B":40,"C":32,"D":24,"E":16},
  "AS Level":{"A":20,"B":16,"C":12,"D":10,"E":6},
  "EPQ":{"A*":28,"A":24,"B":20,"C":16,"D":12,"E":8}
};
let ucasSrcYear='y2';
let ucasOthers=[];
PAGES.ucas = {
  title:"UCAS Calculator",
  sub:"Your Esports grades carry across from the Grade Calculator. Add any other qualifications to build your full UCAS tariff and measure it against typical offers.",
  render(c){
    c.appendChild(el(`<div class="grid cols-2" style="align-items:start">
      <div>
        <div class="card">
          <h4>Your Esports result</h4>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:10px">Carried live from the Grade Calculator.</p>
          <div class="mode-tabs">
            <button class="mode-tab ${ucasSrcYear==='y1'?'active':''}" data-usrc="y1">Year 1 — Foundation</button>
            <button class="mode-tab ${ucasSrcYear==='y2'?'active':''}" data-usrc="y2">Year 2 — Extended</button>
          </div>
          <div id="ucasSource"></div>
          <p style="font-size:.8rem;color:var(--muted);margin-top:12px">If you complete the Extended Diploma it replaces your Year 1 result for UCAS — universities count one, never both.</p>
        </div>
        <div class="card" style="margin-top:16px">
          <h4>Other qualifications</h4>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:10px">Taking anything alongside the course? Add it here.</p>
          <div id="ucasOthers"></div>
          <button class="btn btn-ghost" id="ucasAdd">+ Add a qualification</button>
        </div>
      </div>
      <div>
        <div class="card" aria-live="polite">
          <div style="font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">Total UCAS tariff</div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:3.2rem;line-height:1;color:var(--navy);margin-top:6px"><span id="ucasTotal">0</span> <span style="font-size:1.1rem;font-weight:700;color:var(--muted)">points</span></div>
          <div id="ucasBreakdown" style="margin-top:10px;font-size:.9rem;color:var(--muted)"></div>
          <label class="fld" for="ucasTarget">Compare against a typical offer</label>
          <select id="ucasTarget">
            <option value="64">64 — foundation years, HNC/HND routes</option>
            <option value="96">96 — common BSc offer (CCC)</option>
            <option value="112" selected>112 — competitive BSc (BBC)</option>
            <option value="128">128 — high offers (ABB)</option>
            <option value="144">144 — very high tariff (AAA)</option>
            <option value="168">168 — maximum three-qualification ask</option>
          </select>
          <div id="ucasGap" style="margin-top:14px"></div>
        </div>
        <div class="card" style="margin-top:16px">
          <h4>What offers look like</h4>
          <table class="pts-table">
            <tr><th>UCAS</th><th>Extended Diploma</th><th>A Level</th></tr>
            <tr><td>48</td><td>PPP</td><td>EEE</td></tr><tr><td>96</td><td>MMM</td><td>CCC</td></tr>
            <tr><td>112</td><td>DMM</td><td>BBC</td></tr><tr><td>128</td><td>DDM</td><td>ABB</td></tr>
            <tr><td>144</td><td>DDD</td><td>AAA</td></tr><tr><td>168</td><td>D*D*D*</td><td>A*A*A*</td></tr>
          </table>
          <p style="font-size:.8rem;color:var(--muted);margin-top:10px">Many courses ask for grades (e.g. DMM) not points, and some add subject conditions — always check the course page. Confirm tariff values at ucas.com.</p>
        </div>
      </div>
    </div>`));
    c.querySelectorAll('[data-usrc]').forEach(t=>t.onclick=()=>{ucasSrcYear=t.dataset.usrc;route('ucas');});
    $('ucasAdd').onclick=()=>{ucasOthers.push({type:'A Level',grade:'C'});renderUcas();};
    $('ucasTarget').onchange=renderUcas;
    renderUcas();
  }
};
function ucasQualPoints(q){return q.type==='Other (enter points)'?(q.custom||0):(OTHER_QUALS[q.type][q.grade]||0);}
function renderUcas(){
  const r=computeQual(ucasSrcYear), Q=QUALS[ucasSrcYear];
  const pts=(r.eligible&&r.grade!=='U'&&Q.ucas[r.grade]!==undefined)?Q.ucas[r.grade]:0;
  const srcEl=$('ucasSource');
  if(r.grade==='U') srcEl.innerHTML='<div class="feedback no">Your '+Q.name+' currently calculates as Unclassified (0 UCAS points). Open the Grade Calculator to fix it.</div>';
  else srcEl.innerHTML='<div style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap"><div style="font-family:var(--font-display);font-weight:800;font-size:2.4rem;line-height:1;color:var(--navy)">'+esc(r.grade)+'</div><span class="pill gold">'+pts+' UCAS points</span></div>';

  const oEl=$('ucasOthers'); oEl.innerHTML='';
  ucasOthers.forEach((q,idx)=>{
    const row=el('<div class="unit-row" style="grid-template-columns:1.2fr 1fr auto auto"></div>');
    const tSel=el('<select></select>');
    [...Object.keys(OTHER_QUALS),'Other (enter points)'].forEach(t=>{const o=el('<option value="'+esc(t)+'">'+esc(t)+'</option>');if(t===q.type)o.selected=true;tSel.appendChild(o);});
    tSel.onchange=()=>{q.type=tSel.value;q.grade=null;q.custom=0;renderUcas();};
    let second;
    if(q.type==='Other (enter points)'){
      second=el('<input type="number" min="0" max="200" value="'+(q.custom||0)+'">');
      second.onchange=()=>{q.custom=Math.max(0,Math.min(200,Number(second.value)||0));renderUcas();};
    } else {
      second=el('<select></select>');
      const grades=Object.keys(OTHER_QUALS[q.type]); if(!q.grade)q.grade=grades[grades.length-1];
      grades.forEach(g=>{const o=el('<option value="'+g+'">'+g+'</option>');if(g===q.grade)o.selected=true;second.appendChild(o);});
      second.onchange=()=>{q.grade=second.value;renderUcas();};
    }
    row.appendChild(tSel); row.appendChild(second);
    row.appendChild(el('<div style="font-family:var(--font-display);font-weight:700;color:var(--navy);min-width:54px;text-align:right">'+ucasQualPoints(q)+' pts</div>'));
    const del=el('<button class="del-btn" aria-label="Remove">✕</button>'); del.onclick=()=>{ucasOthers.splice(idx,1);renderUcas();};
    row.appendChild(del); oEl.appendChild(row);
  });

  const otherTotal=ucasOthers.reduce((s,q)=>s+ucasQualPoints(q),0);
  const total=pts+otherTotal;
  $('ucasTotal').textContent=total;
  $('ucasBreakdown').textContent=pts+' from your '+Q.name+(ucasOthers.length?(' + '+otherTotal+' from '+ucasOthers.length+' other qualification'+(ucasOthers.length===1?'':'s')):'')+'.';

  const target=Number($('ucasTarget').value), gapEl=$('ucasGap');
  if(total>=target) gapEl.innerHTML='<div class="feedback ok"><b>You clear this offer by '+(total-target)+' points.</b> Offers are conditional, so the grades still have to land.</div>';
  else {
    const gap=target-total; let route2='';
    if(ucasSrcYear==='y2'&&r.eligible){
      const idx=QUALS.y2.thresholds.findIndex(([g])=>g===r.grade);
      if(idx>-1&&idx<QUALS.y2.thresholds.length-1){for(let i=idx+1;i<QUALS.y2.thresholds.length;i++){const g=QUALS.y2.thresholds[i][0];if((QUALS.y2.ucas[g]||0)>=pts+gap){route2=' Climbing to '+g+' ('+QUALS.y2.ucas[g]+' UCAS points) would close it on its own.';break;}}}
    }
    gapEl.innerHTML='<div class="feedback no"><b>'+gap+' points short of this offer.</b>'+esc(route2)+'</div>';
  }
}

/* ---------- TARGET TRACKER ---------- */
/* Lets students set a target grade per unit and log actual grades, see on/above/below */
let trackState={}; // {unitN:{target,actual}}
UNITS.forEach(u=>trackState[u.n]={target:'M',actual:'—'});
const GRADE_ORDER={'—':-1,'U':0,'P':1,'M':2,'D':3};
PAGES.tracker = {
  title:"Target Tracker",
  sub:"Set a target grade for each unit at the start of the year, then log your actual grades as assignments come back. See at a glance whether you're on track.",
  render(c){
    c.appendChild(el(`<div class="save-callout">
      <strong>Save your work →</strong> Your tracker saves automatically on this computer as you go. But if you use a <strong>shared college PC</strong>, that save can be wiped when you log off — so before you leave, scroll to the bottom and create a <strong>save code</strong>. Keep that code and you can reload everything on any device, any time.
    </div>`));
    
    // Resume prompt if saved data exists
    const saved=loadTrackerLocal();
    if(saved&&saved.s){
      const when=saved.t?new Date(saved.t).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
      const resume=el(`<div class="card" style="max-width:680px;margin-bottom:16px;border-color:var(--navy)">
        <h3>Welcome back</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:14px">Your target tracker was saved on this device${when?(' ('+esc(when)+')'):''}. Load it again?</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" id="trResume">Resume my tracker</button>
          <button class="btn btn-ghost" id="trFresh">Start fresh</button>
        </div>
      </div>`);
      c.appendChild(resume);
      resume.querySelector('#trResume').onclick=()=>{try{deserializeTracker(saved.s);route('tracker');}catch(e){alert('Could not restore the saved tracker.');}};
      resume.querySelector('#trFresh').onclick=()=>{clearTrackerLocal();route('tracker');};
    }
    
    const card=el('<div class="card"><h3>My units</h3><div id="trRows"></div></div>');
    c.appendChild(card);
    c.appendChild(el(`<div class="card" style="margin-top:16px"><h3>How am I tracking?</h3><div id="trSummary"></div></div>`));
    
    // Save & resume card
    c.appendChild(el(`<div class="card save-card" style="margin-top:16px">
      <h3>Save your tracker</h3>
      <p style="font-size:.9rem;color:var(--ink);margin-bottom:10px">Your tracker saves automatically on this device. To move between devices or back up your targets, create a <strong>save code</strong> below.</p>
      <div class="grid cols-2" style="margin-top:8px">
        <div class="save-codebox">
          <h4 style="color:var(--gold)">★ Get my save code</h4>
          <p style="font-size:.84rem;color:#6B4E12;margin-bottom:8px">Copy this and keep it safe — paste into your notes or email it to yourself.</p>
          <textarea id="trCode" readonly placeholder="Press the button to create your code…" style="min-height:90px;width:100%;border:1.5px solid var(--gold);border-radius:8px;padding:10px;font-family:monospace;font-size:.8rem;resize:vertical;background:#fff"></textarea>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <button class="btn btn-merit" id="trMakeCode">Create save code</button>
            <button class="btn btn-ghost" id="trCopyCode">Copy</button>
          </div>
          <div id="trCopyMsg" style="font-size:.82rem;color:var(--good);font-weight:600;margin-top:6px"></div>
        </div>
        <div class="save-restorebox">
          <h4>Restore from a code</h4>
          <p style="font-size:.84rem;color:var(--muted);margin-bottom:8px">Paste a save code from another device to load that tracker. This replaces what's on screen.</p>
          <textarea id="trRestoreIn" placeholder="Paste your ESP1-… code here" style="min-height:90px;width:100%;border:1.5px solid var(--line);border-radius:8px;padding:10px;font-family:monospace;font-size:.8rem;resize:vertical"></textarea>
          <div style="margin-top:8px"><button class="btn btn-primary" id="trRestoreBtn">Restore this tracker</button></div>
          <div id="trRestoreMsg" style="font-size:.82rem;margin-top:6px"></div>
        </div>
      </div>
    </div>`));
    $('trMakeCode').onclick=()=>{ $('trCode').value=encodeState(serializeTracker()); $('trCopyMsg').textContent=''; };
    $('trCopyCode').onclick=()=>{
      const ta=$('trCode'); if(!ta.value){$('trCode').value=encodeState(serializeTracker());}
      ta.select();
      let ok=false; try{ok=document.execCommand('copy');}catch(e){}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(()=>{},()=>{});}
      $('trCopyMsg').textContent=ok?'Copied to clipboard.':'Selected — press Ctrl/Cmd+C to copy.';
    };
    $('trRestoreBtn').onclick=()=>{
      const msg=$('trRestoreMsg'); const raw=$('trRestoreIn').value;
      if(!raw.trim()){msg.style.color='var(--accent)';msg.textContent='Paste a code first.';return;}
      try{ deserializeTracker(decodeState(raw)); saveTrackerLocal(); route('tracker'); }
      catch(e){ msg.style.color='var(--accent)'; msg.textContent='That code could not be read. Check you copied all of it, including the ESP1- start.'; }
    };
    
    renderTracker();
  }
};
function gradeSel2(val,onchange,withDash){
  const s=el('<select style="max-width:140px"></select>');
  const opts=withDash?[['—','Not yet graded'],['U','U'],['P','Pass'],['M','Merit'],['D','Distinction']]:[['U','U'],['P','Pass'],['M','Merit'],['D','Distinction']];
  opts.forEach(([v,l])=>{const o=el('<option value="'+v+'">'+esc(l)+'</option>');if(v===val)o.selected=true;s.appendChild(o);});
  s.onchange=()=>onchange(s.value);return s;
}
function renderTracker(){
  const rows=$('trRows'); rows.innerHTML='';
  const head=el('<div class="unit-row" style="grid-template-columns:1.6fr 1fr 1fr 1fr;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600"></div>');
  ['Unit','Target','Actual','Status'].forEach(h=>head.appendChild(el('<div>'+h+'</div>')));
  rows.appendChild(head);
  UNITS.forEach(u=>{
    const t=trackState[u.n];
    const row=el('<div class="unit-row" style="grid-template-columns:1.6fr 1fr 1fr 1fr;align-items:center"></div>');
    row.appendChild(el('<div style="font-size:.88rem"><b>U'+u.n+':</b> '+esc(u.title)+'</div>'));
    row.appendChild(gradeSel2(t.target,v=>{t.target=v;markTrackerChanged();renderTracker();},false));
    row.appendChild(gradeSel2(t.actual,v=>{t.actual=v;markTrackerChanged();renderTracker();},true));
    let status='',col='var(--muted)';
    if(t.actual==='—'){status='—';}
    else{const d=GRADE_ORDER[t.actual]-GRADE_ORDER[t.target];
      if(d>0){status='Above target';col='var(--good)';}
      else if(d===0){status='On target';col='var(--pass)';}
      else{status='Below target';col='var(--accent)';}}
    row.appendChild(el('<div style="font-weight:700;font-size:.86rem;color:'+col+'">'+status+'</div>'));
    rows.appendChild(row);
  });
  // summary
  const graded=UNITS.filter(u=>trackState[u.n].actual!=='—');
  const above=graded.filter(u=>GRADE_ORDER[trackState[u.n].actual]>GRADE_ORDER[trackState[u.n].target]).length;
  const on=graded.filter(u=>GRADE_ORDER[trackState[u.n].actual]===GRADE_ORDER[trackState[u.n].target]).length;
  const below=graded.filter(u=>GRADE_ORDER[trackState[u.n].actual]<GRADE_ORDER[trackState[u.n].target]).length;
  const s=$('trSummary');
  if(!graded.length){ s.innerHTML='<p style="font-size:.9rem;color:var(--muted)">Log some actual grades above to see how you are tracking against your targets.</p>'; return; }
  s.innerHTML='<div class="totals"><div class="total-box"><div class="n" style="color:var(--good)">'+above+'</div><div class="l">Above target</div></div><div class="total-box"><div class="n" style="color:var(--pass)">'+on+'</div><div class="l">On target</div></div><div class="total-box"><div class="n" style="color:var(--accent)">'+below+'</div><div class="l">Below target</div></div></div>'+
    (below>0?'<div class="feedback no" style="margin-top:14px">'+below+' unit'+(below===1?'':'s')+' below target. Remember: while you met the deadline, a resubmission may be possible — speak to your lecturer early.</div>':'<div class="feedback ok" style="margin-top:14px">You are meeting or beating every target you have logged. Keep the evidence quality high.</div>');
}

/* ---------- STUDY PLANNER ---------- */
let plannerState = {
  name:"", group:"", year:null,
  rows:[]
};
function seedPlanner(){
  // Each year's planner shows only that year's units.
  let unitNums;
  if(plannerState.year==='y2'){
    const y1opts = gcState.opts.slice(0,3).map(o=>o.unit);
    const y2opts = OPTIONAL_UNITS.map(o=>o.n).filter(n=>!y1opts.includes(n));
    unitNums = [5, ...y2opts];
  } else {
    const y1opts = gcState.opts.slice(0,3).map(o=>o.unit);
    unitNums = [1,2,3,4,...y1opts];
  }
  plannerState.rows = unitNums.map(n=>({unit:n, task:"", deadline:"", draftby:"", target:"M", status:"Not started", notes:""}));
}
const STATUSES=["Not started","In progress","Draft done","Submitted","Graded"];
const STATUS_META={
  "Not started":{bg:"#EEF1F4",text:"#5A6B7C",xlsx:"FFEEF1F4",docx:"EEF1F4"},
  "In progress":{bg:"#FBF1E0",text:"#8A5A00",xlsx:"FFFBF1E0",docx:"FBF1E0"},
  "Draft done":{bg:"#E3EEF8",text:"#1B4D7A",xlsx:"FFE3EEF8",docx:"E3EEF8"},
  "Submitted":{bg:"#E3F1EA",text:"#1E6B45",xlsx:"FFE3F1EA",docx:"E3F1EA"},
  "Graded":{bg:"#D9EAD3",text:"#27632A",xlsx:"FFD9EAD3",docx:"D9EAD3"}
};
const STATUS_COL_INDEX=5; // Unit,Task,Deadline,Draft,Target,Status,Notes

/* ----- Save / restore (offline: device auto-save + portable code) ----- */
const LS_KEY='esports_planner_v1';
function serialisePlanner(){
  return {v:1, n:plannerState.name, g:plannerState.group, y:plannerState.year,
    r:plannerState.rows.map(r=>[r.unit, r.task, r.deadline, r.draftby, ['P','M','D'].indexOf(r.target), STATUSES.indexOf(r.status), r.notes])};
}
function deserialisePlanner(o){
  if(!o||o.v!==1||!Array.isArray(o.r)) throw new Error('Not a valid planner code');
  plannerState.name=o.n||''; plannerState.group=o.g||''; plannerState.year=(o.y==='y2')?'y2':'y1';
  plannerState.rows=o.r.map(a=>({unit:Number(a[0])||1, task:a[1]||'', deadline:a[2]||'', draftby:a[3]||'', target:(['P','M','D'][a[4]]||'M'), status:(STATUSES[a[5]]||'Not started'), notes:a[6]||''}));
}
function encodeState(obj){
  const bytes=new TextEncoder().encode(JSON.stringify(obj));
  let bin=''; for(let i=0;i<bytes.length;i++) bin+=String.fromCharCode(bytes[i]);
  return 'ESP1-'+btoa(bin);
}
function decodeState(code){
  const b64=String(code||'').trim().replace(/\s+/g,'').replace(/^ESP1-/,'');
  const bin=atob(b64);
  const bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}
function savePlannerLocal(){ try{ if(plannerState.year) localStorage.setItem(LS_KEY, JSON.stringify({s:serialisePlanner(),t:Date.now()})); }catch(e){} }
function loadPlannerLocal(){ try{ const raw=localStorage.getItem(LS_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
function clearPlannerLocal(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} }
function markChanged(){ savePlannerLocal(); }

// Tracker save/restore
const LS_TRACKER='esports_tracker_v1';
function serializeTracker(){
  return {v:1, t:Object.entries(trackState).map(([n,d])=>[Number(n), d.target, d.actual])};
}
function deserializeTracker(o){
  if(!o||o.v!==1||!Array.isArray(o.t)) throw new Error('Not a valid tracker code');
  trackState={};
  o.t.forEach(([n,tgt,act])=>{ trackState[n]={target:tgt||'M', actual:act||'—'}; });
}
function saveTrackerLocal(){ try{ localStorage.setItem(LS_TRACKER, JSON.stringify({s:serializeTracker(),t:Date.now()})); }catch(e){} }
function loadTrackerLocal(){ try{ const raw=localStorage.getItem(LS_TRACKER); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
function clearTrackerLocal(){ try{ localStorage.removeItem(LS_TRACKER); }catch(e){} }
function markTrackerChanged(){ saveTrackerLocal(); }
function daysUntil(dateStr){
  if(!dateStr) return null;
  const d=new Date(dateStr+"T00:00:00"); if(isNaN(d)) return null;
  const today=new Date(); today.setHours(0,0,0,0);
  return Math.round((d-today)/86400000);
}
function autoDraft(deadline){
  if(!deadline) return "";
  const d=new Date(deadline+"T00:00:00"); if(isNaN(d)) return "";
  d.setDate(d.getDate()-3);
  return d.toISOString().slice(0,10);
}
function fmtDate(s){ if(!s) return ""; const d=new Date(s+"T00:00:00"); if(isNaN(d)) return s; return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }

PAGES.planner = {
  title:"Study Planner",
  sub:"Build your personal assignment plan: add your deadlines from the course assessment plan, set draft dates and targets, then download it as Excel, Word or PDF to keep.",
  render(c){
    // Year-selection gate — choose Year 1 or Year 2 before the units load
    if(!plannerState.year){
      // Offer to resume a planner saved on this device
      const saved=loadPlannerLocal();
      if(saved&&saved.s){
        const when=saved.t?new Date(saved.t).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
        const resume=el(`<div class="card" style="max-width:680px;margin-bottom:16px;border-color:var(--navy)">
          <h3>Welcome back</h3>
          <p style="font-size:.92rem;color:var(--muted);margin-bottom:14px">A study planner was saved on this device${when?(' ('+esc(when)+')'):''}. Would you like to pick up where you left off?</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" id="plResume">Resume my planner</button>
            <button class="btn btn-ghost" id="plFresh">Start fresh</button>
          </div>
        </div>`);
        c.appendChild(resume);
        resume.querySelector('#plResume').onclick=()=>{try{deserialisePlanner(saved.s);route('planner');}catch(e){alert('Could not restore the saved planner.');}};
        resume.querySelector('#plFresh').onclick=()=>{clearPlannerLocal();route('planner');};
      }
      c.appendChild(el(`<div class="card" style="max-width:680px">
        <h3>First, which year are you in?</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:16px">Your planner will load the units you're studying this year. You can change this later, but it will reset the table.</p>
        <div class="grid cols-2">
          <button class="quick-year" data-y="y1" style="text-align:left;border:1.5px solid var(--line);border-radius:12px;padding:18px;background:#fff;cursor:pointer">
            <div style="font-family:var(--font-display);font-weight:800;font-size:1.3rem;color:var(--navy);text-transform:uppercase">Year 1</div>
            <div style="font-size:.9rem;color:var(--muted);margin-top:4px">Foundation Diploma — your 4 mandatory units plus your 3 optional units.</div>
          </button>
          <button class="quick-year" data-y="y2" style="text-align:left;border:1.5px solid var(--line);border-radius:12px;padding:18px;background:#fff;cursor:pointer">
            <div style="font-family:var(--font-display);font-weight:800;font-size:1.3rem;color:var(--navy);text-transform:uppercase">Year 2</div>
            <div style="font-size:.9rem;color:var(--muted);margin-top:4px">Extended Diploma — Unit 5 plus your Year 2 optional units.</div>
          </button>
        </div>
        <p style="font-size:.82rem;color:var(--muted);margin-top:14px">Already have a save code from another device? Choose a year, then use <b>Save &amp; resume</b> at the bottom to paste it in.</p>
      </div>`));
      c.querySelectorAll('.quick-year').forEach(b=>{
        b.onmouseenter=()=>b.style.borderColor='var(--navy)';
        b.onmouseleave=()=>b.style.borderColor='var(--line)';
        b.onclick=()=>{plannerState.name="";plannerState.group="";plannerState.year=b.dataset.y; seedPlanner(); savePlannerLocal(); route('planner');};
      });
      return;
    }

    const yearLabel=plannerState.year==='y1'?'Year 1 — Foundation Diploma':'Year 2 — Extended Diploma';
    c.appendChild(el(`<div class="save-callout">
      <strong>Save your work →</strong> Your planner saves automatically on this computer as you go. But if you use a <strong>shared college PC</strong>, that save can be wiped when you log off — so before you leave, scroll to <strong>step 4</strong> and create a <strong>save code</strong>. Keep that code and you can reload everything on any device, any time.
    </div>`));
    c.appendChild(el(`<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
        <h3 style="margin-bottom:0">1. Your details</h3>
        <div><span class="pill gold">${esc(yearLabel)}</span> <button class="btn btn-ghost" id="plChangeYear" style="padding:5px 12px;font-size:.82rem">Change year</button></div>
      </div>
      <div style="margin-top:12px;max-width:420px"><label class="fld" for="plName">Your name</label><input id="plName" type="text" value="${esc(plannerState.name)}" placeholder="First and last name"></div>
    </div>`));
    $('plName').oninput=e=>{plannerState.name=e.target.value;markChanged();};
    $('plChangeYear').onclick=()=>{
      if(confirm('Change year? This will reset your planner table.')){plannerState.year=null;plannerState.rows=[];route('planner');}
    };

    c.appendChild(el(`<div class="card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h3 style="margin-bottom:0">2. Your assignments &amp; deadlines</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost" id="plSort">Sort by deadline</button>
          <button class="btn btn-ghost" id="plAdd">+ Add a task</button>
        </div>
      </div>
      <p style="font-size:.84rem;color:var(--muted);margin:8px 0 4px">Enter the deadlines your lecturer gives you in the course assessment plan. When you set a deadline, a draft-by date 3 days earlier is suggested — change it to suit you.</p>
      <div id="plLegend" style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 10px"></div>
      <div style="overflow-x:auto"><div id="plRows" style="min-width:860px"></div></div>
    </div>`));
    $('plAdd').onclick=()=>{plannerState.rows.push({unit:UNITS[0].n,task:"",deadline:"",draftby:"",target:"M",status:"Not started",notes:""});markChanged();renderPlanRows();};
    $('plSort').onclick=()=>{plannerState.rows.sort((a,b)=>{if(!a.deadline)return 1;if(!b.deadline)return -1;return a.deadline.localeCompare(b.deadline);});markChanged();renderPlanRows();};
    // status legend
    const leg=$('plLegend');
    Object.entries(STATUS_META).forEach(([s,m])=>leg.appendChild(el('<span style="font-size:.74rem;font-weight:600;padding:2px 10px;border-radius:99px;background:'+m.bg+';color:'+m.text+'">'+esc(s)+'</span>')));

    c.appendChild(el(`<div class="card" style="margin-top:16px">
      <h3>3. Download your planner</h3>
      <p style="font-size:.88rem;color:var(--muted);margin-bottom:12px">Keep a copy, print it, or hand it to your tutor. The colour coding carries through to Excel, Word and PDF.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="dlXlsx">Download Excel (.xlsx)</button>
        <button class="btn btn-primary" id="dlDocx">Download Word (.docx)</button>
        <button class="btn btn-primary" id="dlPdf">Download PDF</button>
      </div>
      <div class="notice" style="margin-top:14px"><b>Tip:</b> work backwards from each deadline. Setting your own draft-complete date a few days early — and always meeting the first deadline — keeps a resubmission possible if you need it.</div>
    </div>`));
    $('dlXlsx').onclick=downloadPlannerXlsx;
    $('dlDocx').onclick=downloadPlannerDocx;
    $('dlPdf').onclick=downloadPlannerPdf;

    c.appendChild(el(`<div class="card save-card" style="margin-top:16px">
      <h3>4. Save &amp; resume — keep your work</h3>
      <p style="font-size:.9rem;color:var(--ink);margin-bottom:10px">Your planner saves automatically on this device. To move between home and college, or to back it up in case a shared computer is wiped, create a <strong>save code</strong> below.</p>
      <div class="grid cols-2" style="margin-top:8px">
        <div class="save-codebox">
          <h4 style="color:var(--gold)">★ Get my save code</h4>
          <p style="font-size:.84rem;color:#6B4E12;margin-bottom:8px">Copy this and keep it safe — paste it into your notes app, or email it to yourself.</p>
          <textarea id="plCode" readonly placeholder="Press the button to create your code…" style="min-height:90px;width:100%;border:1.5px solid var(--gold);border-radius:8px;padding:10px;font-family:monospace;font-size:.8rem;resize:vertical;background:#fff"></textarea>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <button class="btn btn-merit" id="plMakeCode">Create save code</button>
            <button class="btn btn-ghost" id="plCopyCode">Copy</button>
          </div>
          <div id="plCopyMsg" style="font-size:.82rem;color:var(--good);font-weight:600;margin-top:6px"></div>
        </div>
        <div class="save-restorebox">
          <h4>Restore from a code</h4>
          <p style="font-size:.84rem;color:var(--muted);margin-bottom:8px">Paste a save code from another device to load that planner. This replaces what's on screen.</p>
          <textarea id="plRestoreIn" placeholder="Paste your ESP1-… code here" style="min-height:90px;width:100%;border:1.5px solid var(--line);border-radius:8px;padding:10px;font-family:monospace;font-size:.8rem;resize:vertical"></textarea>
          <div style="margin-top:8px"><button class="btn btn-primary" id="plRestoreBtn">Restore this planner</button></div>
          <div id="plRestoreMsg" style="font-size:.82rem;margin-top:6px"></div>
        </div>
      </div>
    </div>`));
    $('plMakeCode').onclick=()=>{ $('plCode').value=encodeState(serialisePlanner()); $('plCopyMsg').textContent=''; };
    $('plCopyCode').onclick=()=>{
      const ta=$('plCode'); if(!ta.value){$('plCode').value=encodeState(serialisePlanner());}
      ta.select();
      let ok=false; try{ok=document.execCommand('copy');}catch(e){}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(()=>{},()=>{});}
      $('plCopyMsg').textContent=ok?'Copied to clipboard.':'Selected — press Ctrl/Cmd+C to copy.';
    };
    $('plRestoreBtn').onclick=()=>{
      const msg=$('plRestoreMsg'); const raw=$('plRestoreIn').value;
      if(!raw.trim()){msg.style.color='var(--accent)';msg.textContent='Paste a code first.';return;}
      try{ const obj=decodeState(raw); deserialisePlanner(obj); savePlannerLocal(); route('planner'); }
      catch(e){ msg.style.color='var(--accent)'; msg.textContent='That code could not be read. Check you copied all of it, including the ESP1- start.'; }
    };

    renderPlanRows();
  }
};

function renderPlanRows(){
  const wrap=$('plRows'); if(!wrap) return; wrap.innerHTML='';
  const cols='1.1fr 1.6fr 1fr 1fr .8fr 1.1fr 1.5fr auto';
  const head=el('<div class="unit-row" style="grid-template-columns:'+cols+';font-size:.7rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:6px"></div>');
  ['Unit','Assignment / task','Deadline','Draft by','Target','Status','Notes',''].forEach(h=>head.appendChild(el('<div>'+h+'</div>')));
  wrap.appendChild(head);

  plannerState.rows.forEach((r,idx)=>{
    const meta=STATUS_META[r.status]||STATUS_META["Not started"];
    const row=el('<div class="unit-row" style="grid-template-columns:'+cols+';align-items:center;gap:8px;background:'+meta.bg+';border-left:4px solid '+meta.text+';border-radius:8px;padding:8px 10px;margin-bottom:6px"></div>');
    // unit
    const uSel=el('<select></select>');
    UNITS.forEach(u=>{const o=el('<option value="'+u.n+'">U'+u.n+'</option>');if(u.n===r.unit)o.selected=true;uSel.appendChild(o);});
    uSel.title="Unit"; uSel.onchange=()=>{r.unit=Number(uSel.value);markChanged();};
    row.appendChild(uSel);
    // task
    const task=el('<input type="text" placeholder="Task name" value="'+esc(r.task)+'">');
    task.oninput=()=>{r.task=task.value;markChanged();};
    row.appendChild(task);
    // deadline
    const dl=el('<input type="date" value="'+esc(r.deadline)+'">');
    dl.onchange=()=>{r.deadline=dl.value; if(!r.draftby) r.draftby=autoDraft(dl.value); markChanged(); renderPlanRows();};
    row.appendChild(dl);
    // draft by
    const db=el('<input type="date" value="'+esc(r.draftby)+'">');
    db.onchange=()=>{r.draftby=db.value;markChanged();};
    row.appendChild(db);
    // target
    const tg=el('<select><option>P</option><option>M</option><option>D</option></select>');
    tg.value=r.target; tg.onchange=()=>{r.target=tg.value;markChanged();};
    row.appendChild(tg);
    // status
    const st=el('<select style="font-weight:600;color:'+meta.text+'"></select>');
    STATUSES.forEach(s=>{const o=el('<option>'+s+'</option>');if(s===r.status)o.selected=true;st.appendChild(o);});
    st.onchange=()=>{r.status=st.value;markChanged();renderPlanRows();};
    row.appendChild(st);
    // notes
    const nt=el('<input type="text" placeholder="Notes" value="'+esc(r.notes)+'">');
    nt.oninput=()=>{r.notes=nt.value;markChanged();};
    row.appendChild(nt);
    // delete + countdown
    const wrapDel=el('<div style="display:flex;flex-direction:column;align-items:flex-end"></div>');
    const du=daysUntil(r.deadline);
    if(du!==null){
      let col=du<0?'var(--accent)':(du<=7?'var(--merit)':'var(--muted)');
      let txt=du<0?Math.abs(du)+'d ago':(du===0?'today':du+'d');
      wrapDel.appendChild(el('<span style="font-size:.72rem;font-weight:700;color:'+col+'">'+txt+'</span>'));
    }
    const del=el('<button class="del-btn" aria-label="Remove task">✕</button>');
    del.onclick=()=>{plannerState.rows.splice(idx,1);markChanged();renderPlanRows();};
    wrapDel.appendChild(del);
    row.appendChild(wrapDel);
    wrap.appendChild(row);
  });
  if(!plannerState.rows.length) wrap.appendChild(el('<p style="font-size:.9rem;color:var(--muted)">No tasks yet — add one with the button above.</p>'));
}

function plannerExportData(){
  const headers=["Unit","Assignment / task","Deadline","Draft complete by","Target","Status","Notes"];
  const sorted=[...plannerState.rows];
  const rows=sorted.map(r=>["Unit "+r.unit+": "+unitTitle(r.unit), r.task||"", fmtDate(r.deadline), fmtDate(r.draftby), r.target, r.status, r.notes||""]);
  const meta=(plannerState.name||"Student")+" · "+(plannerState.year==='y1'?'Year 1 Foundation Diploma':'Year 2 Extended Diploma')+" · generated "+new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
  return {headers,rows,meta};
}
function plannerFilename(ext){
  const safe=(plannerState.name||"Study Planner").replace(/[^a-z0-9]+/gi,'_').replace(/^_|_$/g,'');
  return (safe||"Study_Planner")+"_Esports_Planner."+ext;
}
function downloadPlannerXlsx(){
  const {headers,rows}=plannerExportData();
  const statusColours={}; Object.entries(STATUS_META).forEach(([k,m])=>statusColours[k]=m.xlsx);
  const bytes=buildXlsx("Study Planner",headers,rows,{widths:[26,30,14,16,8,14,34],statusCol:STATUS_COL_INDEX,statusColours});
  downloadBytes(bytes, plannerFilename('xlsx'), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}
function downloadPlannerDocx(){
  const {headers,rows,meta}=plannerExportData();
  const statusColours={}; Object.entries(STATUS_META).forEach(([k,m])=>statusColours[k]=m.docx);
  const bytes=buildDocx("My Esports Study Planner", meta, headers, rows, {statusCol:STATUS_COL_INDEX,statusColours});
  downloadBytes(bytes, plannerFilename('docx'), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}
function downloadPlannerPdf(){
  const {headers,rows,meta}=plannerExportData();
  const pa=$('printArea');
  let html='<div class="print-doc"><h1>My Esports Study Planner</h1><div class="print-meta">'+esc(meta)+'</div>'+
    '<table class="print-table"><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr>'+r.map((cv,ci)=>{
      if(ci===STATUS_COL_INDEX){const m=STATUS_META[cv]; return '<td style="background:'+(m?m.bg:'#fff')+';color:'+(m?m.text:'#1B2733')+';font-weight:600">'+esc(cv)+'</td>';}
      return '<td>'+esc(cv)+'</td>';
    }).join('')+'</tr>').join('')+
    '</tbody></table><p class="print-tip">Tip: work backwards from each deadline — set your draft-complete date a few days earlier, and always meet the first deadline to keep a resubmission possible.</p></div>';
  pa.innerHTML=html;
  document.body.classList.add('printing');
  window.print();
  setTimeout(()=>{document.body.classList.remove('printing');pa.innerHTML='';},500);
}

/* ===================== INIT ===================== */
buildNav();
route('home');
