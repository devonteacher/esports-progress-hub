/* Esports Progress Hub — course & qualification data.
   Sourced from the Pearson BTEC Level 3 Nationals in Esports specification (Issue 3, May 2021). */

// Spec-sourced unit data — Pearson BTEC L3 Nationals in Esports (Issue 3, May 2021)
const UNITS = [
  {n:1,glh:60,year:1,title:"Introduction to Esports",
   brief:"Develop an understanding of the esports and traditional sports industries and the careers you could pursue.",
   aims:[["A","Understand the organisation of esports and traditional sports industries in the UK and globally"],["B","Examine genres of esports games titles played by professional and grassroots teams and tournaments"],["C","Explore career pathways and associated routes in esports"]],
   assessment:"Internally assessed assignments.",
   guidance:"This is your foundation unit. Assessors want breadth and accuracy: name real organisations, real tournaments and real career routes rather than talking in general terms. For the higher bands, connect the structure of the industry to the opportunities it creates, and judge which pathways realistically fit different skills and ambitions.",
   resources:[["British Esports Federation","https://britishesports.org","The UK's national body — structure, education and grassroots routes."],["Esports Insider","https://esportsinsider.com","Industry news and organisation profiles for real-world examples."],["Pearson unit spec","https://qualifications.pearson.com","The official learning aims and assessment criteria."]],
   careers:["Esports industry analyst","Event coordinator","Community manager","Pathways into business, media and tech roles"]},

  {n:2,glh:120,year:1,title:"Esports Skills, Strategies and Analysis",
   brief:"Develop the understanding and skills to analyse esports performances and recommend improvements.",
   aims:[["A","Understand strategies and training requirements associated with in-game skills"],["B","Explore best practices, skills, techniques and tactics of high-performing teams"],["C","Explore different methods of analysis for selected genres of games"],["D","Carry out performance analysis in a game to recommend improvements for an individual or team"]],
   assessment:"Internally assessed — the largest unit at 120 GLH, drawing on learning from across the programme.",
   guidance:"This is the heaviest unit and carries the most points, so it rewards sustained effort. The top bands hinge on aim D: your analysis must be evidence-led (data, VOD timestamps, measurable observations) and your recommendations must follow logically from what you found. Avoid opinion dressed up as analysis.",
   resources:[["Mobalytics / op.gg style trackers","https://mobalytics.gg","Performance data examples for analysis methods."],["Pearson unit spec","https://qualifications.pearson.com","Assessment criteria for each learning aim."]],
   careers:["Performance analyst","Coach","Professional player","Strategy / data analyst (transferable)"]},

  {n:3,glh:90,year:1,title:"Enterprise and Entrepreneurship in the Esports Industry",
   brief:"Study successful esports enterprises and entrepreneurs; research, plan and pitch your own start-up.",
   aims:[["A","Explore enterprise and entrepreneurship in the esports industry"],["B","Conduct market research for a start-up enterprise idea"],["C","Create a business plan for a start-up enterprise idea"],["D","Pitch and review a start-up enterprise idea"]],
   assessment:"Internally assessed assignments culminating in a planned and pitched enterprise idea.",
   guidance:"Distinction work here is realistic, not fantastical. Ground your plan in genuine market research (aim B), make the financials add up, and in your review (aim D) appraise the plan honestly — where it's weak, what you'd change, and whether it would actually survive a second year.",
   resources:[["Prince's Trust enterprise resources","https://www.princes-trust.org.uk","Business planning templates and start-up guidance."],["Pearson unit spec","https://qualifications.pearson.com","Learning aims and criteria."]],
   careers:["Founder / entrepreneur","Esports business development","Sponsorship & partnerships","Self-employment routes"]},

  {n:4,glh:90,year:1,title:"Health, Wellbeing and Fitness for Esports Players",
   brief:"Explore the importance of health, wellbeing and fitness; assess and suggest ways to improve.",
   aims:[["A","Examine the importance of physical, social and psychological wellbeing for esports players"],["B","Explore how physical, social and psychological wellbeing affect performance"],["C","Investigate methods of health and wellbeing assessment"],["D","Undertake health and wellbeing screening and provide feedback to improve health status"]],
   assessment:"Internally assessed — includes applying assessment methods to a real performer and yourself.",
   guidance:"Use recognised benchmarks and national guidance as your evidence base rather than assumptions. The higher bands need you to connect specific wellbeing factors to specific performance effects (aim B) and to justify the improvement strategies you recommend against that evidence.",
   resources:[["NHS Live Well","https://www.nhs.uk/live-well","Recognised UK guidance on sleep, activity and wellbeing."],["Pearson unit spec","https://qualifications.pearson.com","Assessment criteria."]],
   careers:["Performance / wellbeing coach","Sport & exercise pathways","Player welfare roles","Health-sector progression"]},

  {n:5,glh:120,year:2,title:"Esports Events",
   brief:"Work as part of a small group to plan, coordinate and manage an esports event and evaluate the skills gained.",
   aims:[["A","Explore the role of an esports event organiser"],["B","Investigate the feasibility of a proposed esports event"],["C","Develop a detailed plan for an esports event to meet set objectives"],["D","Stage, manage and review an esports event to meet set objectives"]],
   assessment:"Internally assessed group unit — 120 GLH, with real delivery and review of an event.",
   guidance:"This unit is assessed on planning rigour and honest review as much as the event itself. Use real planning tools (Gantt charts, risk registers, run orders). For the top bands, your post-event evaluation (aim D) must compare plan against reality and draw conclusions a professional event producer would recognise.",
   resources:[["British Esports — events","https://britishesports.org","Examples of grassroots and student events."],["Pearson unit spec","https://qualifications.pearson.com","Learning aims and criteria."]],
   careers:["Event manager / producer","Operations coordinator","Tournament organiser","Project management (transferable)"]},

  {n:6,glh:60,year:2,title:"Live-streamed Broadcasting",
   brief:"Explore and develop skills for the production, content development and broadcast of live-streamed esports.",
   aims:[["A","Explore live-streamed esports/games characteristics and technologies"],["B","Prepare for a live-streamed esports/games broadcast"],["C","Broadcast live-streaming esports/games using industry standards"]],
   assessment:"Internally assessed — culminates in producing a live-streamed broadcast to industry standards.",
   guidance:"Aim C is practical: your broadcast must meet industry standards, so know your OBS scene structure, bitrate and overlay readability cold. For higher bands, analyse the form, codes and conventions of professional streams (aim A) and apply those deliberately to your own — don't just stream, justify your production choices.",
   resources:[["OBS Studio","https://obsproject.com","The industry-standard free broadcasting software."],["Twitch Creator Camp","https://www.twitch.tv/creatorcamp","Official guidance on stream production and standards."],["Pearson unit spec","https://qualifications.pearson.com","Assessment criteria."]],
   careers:["Stream producer","Broadcast technician","Online content manager","Visual / media engineering"]},

  {n:7,glh:60,year:2,title:"Producing an Esports Brand",
   brief:"Investigate branding in esports; plan and create branding and promotional content for a team.",
   aims:[["A","Investigate the role of branding in esports teams"],["B","Plan brand activation content for a specific esports team"],["C","Create brand activation content for a specific esports team"]],
   assessment:"Internally assessed — produce real branding and promotional content for a chosen or created team.",
   guidance:"Branding is judged on coherence and rationale. The higher bands want you to plan activation content against genuine market needs (aim B) and justify why your visual identity, tone and channels suit that audience — not simply that it 'looks good'.",
   resources:[["Behance — branding","https://www.behance.net","Real brand identity work for inspiration and conventions."],["Canva / Adobe Express","https://www.canva.com","Tools for producing brand assets."],["Pearson unit spec","https://qualifications.pearson.com","Learning aims and criteria."]],
   careers:["Brand / marketing designer","Social media manager","Merchandise & partnerships","Graphic design progression"]},

  {n:8,glh:60,year:2,title:"Video Production",
   brief:"Develop knowledge, understanding and practical skills in video production for esports.",
   aims:[["A","Explore video products in esports/games"],["B","Undertake video pre-production for an esports/game brief"],["C","Produce an esports/game video for a brief"]],
   assessment:"Internally assessed — full pre-production, production and post-production for a brief.",
   guidance:"Pre-production evidence (aim B) is where students lose marks: assessors want shot lists, storyboards, schedules and sourced assets, not just the finished video. For the top bands, analyse codes and conventions of professional esports video (aim A) and show them reflected in deliberate choices in your edit.",
   resources:[["DaVinci Resolve","https://www.blackmagicdesign.com/products/davinciresolve","Free professional-grade editing software."],["No Film School","https://nofilmschool.com","Production technique and pre-production planning."],["Pearson unit spec","https://qualifications.pearson.com","Assessment criteria."]],
   careers:["Video editor / producer","Content creator","Motion graphics","Journalism & media progression"]},

  {n:10,glh:60,year:2,title:"Business Applications of Esports in Social Media",
   brief:"Explore how esports organisations use social media commercially, then plan and implement activity.",
   aims:[["A","Explore the impact of social media on how esports organisations promote products and services"],["B","Develop a plan to use social media to meet business requirements"],["C","Implement the use of social media in an esports organisation"]],
   assessment:"Internally assessed — develop, implement and review a real social media plan with data.",
   guidance:"The difference between bands is data. Set measurable objectives in your plan (aim B), then in implementation and review (aim C) use real engagement metrics to evaluate what worked. 'I posted regularly' is a Pass; 'engagement rose 40% after I shifted posting to peak hours, so I…' is Distinction territory.",
   resources:[["Meta Business / Creator resources","https://www.facebook.com/business","Platform analytics and best-practice guidance."],["Hootsuite blog","https://blog.hootsuite.com","Social strategy, scheduling and metrics."],["Pearson unit spec","https://qualifications.pearson.com","Learning aims and criteria."]],
   careers:["Social media manager","Digital marketer","Community manager","Marketing analytics"]},

  {n:11,glh:60,year:2,title:"Shoutcasting",
   brief:"Investigate shoutcasting and develop knowledge, understanding and practical skills for it.",
   aims:[["A","Explore how shoutcasting contributes to the experience of esports"],["B","Prepare for esports shoutcasting performance and communication"],["C","Demonstrate esports shoutcasting skills to an audience"]],
   assessment:"Internally assessed — culminates in a demonstrated shoutcasting performance.",
   guidance:"Preparation evidence (aim B) underpins the performance: research, scripts, role planning between play-by-play and colour. For the higher bands, your performance must be analysed against professional casting — energy curves, storytelling, handling dead air — not just delivered.",
   resources:[["Twitch Creator Camp","https://www.twitch.tv/creatorcamp","Commentary and presenting guidance."],["Pearson unit spec","https://qualifications.pearson.com","Assessment criteria."]],
   careers:["Shoutcaster / commentator","Presenter / host","Broadcast journalist","Public speaking (transferable)"]},

  {n:12,glh:60,year:2,title:"Esports Coaching",
   brief:"Develop the techniques, personal knowledge and ability to deliver coaching sessions.",
   aims:[["A","Investigate skills, knowledge, qualities and best practice of esports coaching"],["B","Explore practices used to develop skills, techniques and tactics for performance"],["C","Demonstrate effective planning of esports coaching for performance"],["D","Explore the impact of esports coaching for performance"]],
   assessment:"Internally assessed — plan, deliver and reflect on coaching for real players.",
   guidance:"Coaching is assessed on planning and reflection, not charisma. Use recognised coaching theory (feedback models, questioning techniques) to plan sessions (aim C), then evaluate your own impact honestly (aim D): what landed, what didn't, and what theory explains the difference.",
   resources:[["UK Coaching","https://www.ukcoaching.org","Recognised coaching principles and session planning."],["Pearson unit spec","https://qualifications.pearson.com","Learning aims and criteria."]],
   careers:["Esports coach","Performance analyst","Teaching / training pathways","Mentoring roles"]},

  {n:9,glh:60,year:2,title:"Games Design",
   brief:"Investigate game design principles and mechanics.",
   aims:[],
   assessment:"Internally assessed.",
   guidance:"",
   resources:[],
   careers:[]},

  {n:13,glh:60,year:2,title:"Psychology for Esports",
   brief:"Explore psychological principles applied to esports performance.",
   aims:[],
   assessment:"Internally assessed.",
   guidance:"",
   resources:[],
   careers:[]},

  {n:19,glh:60,year:2,title:"Customer Immersion Experiences",
   brief:"Create immersive customer experiences in esports.",
   aims:[],
   assessment:"Internally assessed.",
   guidance:"",
   resources:[],
   careers:[]},

  {n:20,glh:60,year:2,title:"Computer Networks",
   brief:"Understand network infrastructure supporting esports.",
   aims:[],
   assessment:"Internally assessed.",
   guidance:"",
   resources:[],
   careers:[]}
];

// Command verbs by band — from the BTEC command verb glossary
const VERB_BANDS = {
  pass:{label:"Pass — Show it",desc:"Demonstrate accurate, complete knowledge.",verbs:["Describe","Define","Explain","Identify","Illustrate","Outline","Plan","State","Summarise","Produce"]},
  merit:{label:"Merit — Connect it",desc:"Link factors, weigh options, support every claim with evidence.",verbs:["Analyse","Compare","Contrast","Demonstrate","Justify","Assess (weigh up)","Explain in detail"]},
  dist:{label:"Distinction — Judge it",desc:"Make reasoned judgements, consider alternatives and trade-offs, draw conclusions.",verbs:["Evaluate","Evaluate critically","Appraise","Comment critically","Draw conclusions","Assess (judge)","Criticise"]}
};

/* ===================== QUALIFICATION DATA (carried from calculator) ===================== */
const UNIT_PTS = {"60":{U:0,P:6,M:10,D:16},"90":{U:0,P:9,M:15,D:24},"120":{U:0,P:12,M:20,D:32}};
const OPTIONAL_UNITS = UNITS.filter(u=>u.year===2 && u.n>=6).map(u=>({n:u.n,t:u.title}));
const QUALS = {
  y1:{ name:"Foundation Diploma", glh:540, optCount:3,
    mandatory:[{n:1,glh:"60"},{n:2,glh:"120"},{n:3,glh:"90"},{n:4,glh:"90"}],
    thresholds:[["U",0],["P",54],["M",78],["D",108],["D*",138]],
    ucas:{"P":24,"M":48,"D":72,"D*":84},
    meaning:{
      "U":"Unclassified — the qualification is not awarded. This is almost always a single unit at U, not a shortage of points.",
      "P":"You're on the board — 24 UCAS points from a qualification the size of 1.5 A Levels.",
      "M":"A solid result worth 48 UCAS points. A Distinction is worth 24 more — one strong year of redrafting.",
      "D":"A strong result — 72 UCAS points and real currency with universities and employers.",
      "D*":"The top of the range — 84 UCAS points. This sets up a triple-Distinction Extended Diploma."}
  },
  y2:{ name:"Extended Diploma", glh:1080, optCount:7,
    mandatory:[{n:1,glh:"60"},{n:2,glh:"120"},{n:3,glh:"90"},{n:4,glh:"90"},{n:5,glh:"120"}],
    thresholds:[["U",0],["PPP",108],["MPP",124],["MMP",140],["MMM",156],["DMM",176],["DDM",196],["DDD",216],["D*DD",234],["D*D*D",252],["D*D*D*",270]],
    ucas:{"PPP":48,"MPP":64,"MMP":80,"MMM":96,"DMM":112,"DDM":128,"DDD":144,"D*DD":152,"D*D*D":160,"D*D*D*":168},
    aLevel:{"PPP":"EEE","MPP":"DDE","MMP":"CDD","MMM":"CCC","DMM":"BBC","DDM":"ABB","DDD":"AAA","D*DD":"A*AA","D*D*D":"A*A*A","D*D*D*":"A*A*A*"},
    meaning:{
      "U":"Unclassified — the qualification is not awarded. Units 1–5 each need at least a Pass, and at least 900 GLH must be at Pass or above.",
      "PPP":"The full qualification — equivalent in size to three A Levels, worth 48 UCAS points (the same tariff as EEE).",
      "MPP":"64 UCAS points — the same tariff as DDE at A Level.",
      "MMP":"80 UCAS points — the same tariff as CDD at A Level.",
      "MMM":"96 UCAS points — the same tariff as CCC at A Level. Opens plenty of HE doors.",
      "DMM":"112 UCAS points — the same tariff as BBC at A Level. Competitive university offers start here.",
      "DDM":"128 UCAS points — the same tariff as ABB at A Level. A genuinely strong application grade.",
      "DDD":"144 UCAS points — the same tariff as AAA at A Level. Triple Distinction equals triple A.",
      "D*DD":"152 UCAS points — the same tariff as A*AA at A Level.",
      "D*D*D":"160 UCAS points — the same tariff as A*A*A at A Level.",
      "D*D*D*":"168 UCAS points — the maximum possible result, the same tariff as A*A*A*."}
  }
};
