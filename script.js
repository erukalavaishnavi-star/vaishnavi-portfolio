// ==========================================
// 1. CUSTOM CURSOR
// ==========================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// Add hover effects for interactive elements
function setupCursorHovers() {
  document.querySelectorAll('a, button, .project-card, .stat-card, .chat-q-btn, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '55px';
      cursorRing.style.height = '55px';
      cursorRing.style.borderColor = 'rgba(0, 229, 200, 0.8)';
      cursorRing.style.background = 'rgba(0, 229, 200, 0.03)';
      cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '40px';
      cursorRing.style.height = '40px';
      cursorRing.style.borderColor = 'rgba(0, 229, 200, 0.4)';
      cursorRing.style.background = 'transparent';
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}
setupCursorHovers();


// ==========================================
// 2. OCEAN BACKGROUND CANVAS
// ==========================================
const oc = document.getElementById('ocean-canvas');
const octx = oc.getContext('2d');

function resizeOcean() {
  oc.width = window.innerWidth;
  oc.height = window.innerHeight;
}
resizeOcean();
window.addEventListener('resize', resizeOcean);

const particles = [];
const particleCount = Math.min(80, Math.floor(window.innerWidth / 15)); // Scale particles based on screen width
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    opacity: Math.random() * 0.5 + 0.1
  });
}

function drawOcean() {
  octx.clearRect(0, 0, oc.width, oc.height);
  
  // Radial ambient deep glow
  const g = octx.createRadialGradient(oc.width / 2, oc.height / 2, 0, oc.width / 2, oc.height / 2, Math.max(oc.width, oc.height) / 1.5);
  g.addColorStop(0, 'rgba(0, 40, 80, 0.12)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  octx.fillStyle = g;
  octx.fillRect(0, 0, oc.width, oc.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // Boundary wrapping
    if (p.x < 0) p.x = oc.width;
    if (p.x > oc.width) p.x = 0;
    if (p.y < 0) p.y = oc.height;
    if (p.y > oc.height) p.y = 0;

    octx.beginPath();
    octx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    octx.fillStyle = `rgba(0, 229, 200, ${p.opacity})`;
    octx.fill();
  });

  // Draw delicate constellation connections
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 110) {
        octx.beginPath();
        octx.moveTo(a.x, a.y);
        octx.lineTo(b.x, b.y);
        octx.strokeStyle = `rgba(0, 229, 200, ${0.08 * (1 - d / 110)})`;
        octx.lineWidth = 0.5;
        octx.stroke();
      }
    });
  });

  requestAnimationFrame(drawOcean);
}
drawOcean();


// ==========================================
// 3. DNA CANVAS
// ==========================================
const dc = document.getElementById('dna-canvas');
const dctx = dc.getContext('2d');

function resizeDna() {
  const container = dc.parentElement;
  dc.width = container.clientWidth;
  dc.height = 420;
}
resizeDna();
window.addEventListener('resize', resizeDna);

const dnaNodes = [
  { label: 'Student', x: 0.5, y: 0.15, color: '#00e5c8' },
  { label: 'Builder', x: 0.15, y: 0.5, color: '#0099ff' },
  { label: 'Problem Solver', x: 0.85, y: 0.45, color: '#7b4fff' },
  { label: 'Tech Explorer', x: 0.25, y: 0.8, color: '#00e5c8' },
  { label: 'Lifelong Learner', x: 0.75, y: 0.82, color: '#0099ff' },
];
const dnaConnections = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [0, 3], [0, 4]];
let dnaT = 0;

function drawDna() {
  dctx.clearRect(0, 0, dc.width, dc.height);
  const w = dc.width;
  const h = dc.height;

  // Draw links
  dnaConnections.forEach(([a, b]) => {
    const na = dnaNodes[a];
    const nb = dnaNodes[b];
    
    // Wave calculations for connecting strands
    const ax = na.x * w;
    const ay = na.y * h + (Math.sin(dnaT * 0.015 + a * 0.8) * 8);
    const bx = nb.x * w;
    const by = nb.y * h + (Math.sin(dnaT * 0.015 + b * 0.8) * 8);

    dctx.beginPath();
    dctx.moveTo(ax, ay);
    dctx.lineTo(bx, by);
    dctx.strokeStyle = 'rgba(0, 229, 200, 0.12)';
    dctx.lineWidth = 1;
    dctx.stroke();
  });

  // Draw nodes
  dnaNodes.forEach((n, i) => {
    const pulse = Math.sin(dnaT * 0.02 + i * 1.2) * 4;
    const x = n.x * w;
    const y = n.y * h + (Math.sin(dnaT * 0.015 + i * 0.8) * 8);

    // Glow boundary rings
    dctx.beginPath();
    dctx.arc(x, y, 28 + pulse, 0, Math.PI * 2);
    dctx.strokeStyle = n.color + '22';
    dctx.lineWidth = 1;
    dctx.stroke();

    // Node body
    dctx.beginPath();
    dctx.arc(x, y, 18 + pulse * 0.5, 0, Math.PI * 2);
    dctx.fillStyle = n.color + '18';
    dctx.fill();
    dctx.strokeStyle = n.color + '88';
    dctx.lineWidth = 1.5;
    dctx.stroke();

    // Core nucleus
    dctx.beginPath();
    dctx.arc(x, y, 4, 0, Math.PI * 2);
    dctx.fillStyle = n.color;
    dctx.fill();

    // Core label
    dctx.font = '500 12px Syne, sans-serif';
    dctx.fillStyle = '#c8e0f0';
    dctx.textAlign = 'center';
    dctx.fillText(n.label, x, y + 38 + pulse * 0.3);
  });

  dnaT++;
  requestAnimationFrame(drawDna);
}
drawDna();


// ==========================================
// 4. SKILLS GALAXY (FIXED COLLISION & OVERLAPS)
// ==========================================
const gc = document.getElementById('galaxy-canvas');
const gctx = gc.getContext('2d');

function resizeGalaxy() {
  const container = gc.parentElement;
  gc.width = container.clientWidth;
  gc.height = 520;
}
resizeGalaxy();
window.addEventListener('resize', resizeGalaxy);

// Space out initial angles perfectly within each orbit to avoid collisions and clumping
const skillData = [
  // Orbit 1 (Inner) - Spaced by 120 deg (2*PI/3)
  { name: 'Python', desc: 'My go-to for automation, AI prototyping, and algorithmic challenges.', how: 'Built Agent Guess Master, Pyone DSL interpreter, and data automation scripts.', prof: 75, color: '#00e5c8', orbit: 1, angle: 0, speed: 0.002 },
  { name: 'HTML/CSS', desc: 'The layout canvas. Clean, responsive layouts with Bootstrap or custom styles.', how: 'Built Agro AI assistant site and multiple static applications.', prof: 88, color: '#0099ff', orbit: 1, angle: (2 * Math.PI) / 3, speed: 0.002 },
  { name: 'JavaScript', desc: 'Interactive styling and frontend workflows. Core asynchronous scripting.', how: 'Integrated DOM APIs, Canvas simulations, and interactive interfaces.', prof: 70, color: '#7b4fff', orbit: 1, angle: (4 * Math.PI) / 3, speed: 0.002 },
  
  // Orbit 2 (Middle) - Spaced by 120 deg + rotation offset (PI / 6)
  { name: 'SQL', desc: 'Relational data structures. Writing structured, high-performance queries.', how: 'Designed Mini Mart SQLite DBMS, normalization structures, and window queries.', prof: 72, color: '#00e5c8', orbit: 2, angle: Math.PI / 6, speed: 0.0015 },
  { name: 'React', desc: 'Building reusable, reactive component trees with modern state APIs.', how: 'Shipped full-stack Career Intelligence Agent (CIA) with clean routes.', prof: 65, color: '#0099ff', orbit: 2, angle: Math.PI / 6 + (2 * Math.PI) / 3, speed: 0.0015 },
  { name: 'Gen AI', desc: 'Embedding language models, prompt pipelines, and intelligent reasoning layers.', how: 'Crafted agricultural advisors and AI-powered strategy builders.', prof: 68, color: '#7b4fff', orbit: 2, angle: Math.PI / 6 + (4 * Math.PI) / 3, speed: 0.0015 },
  
  // Orbit 3 (Outer) - Spaced by 120 deg + rotation offset (PI / 3)
  { name: 'GitHub', desc: 'Collaborative development workflows, version branches, and issue tracking.', how: 'Maintain all source branches, release repositories, and code hubs.', prof: 78, color: '#00e5c8', orbit: 3, angle: Math.PI / 3, speed: 0.001 },
  { name: 'n8n', desc: 'Designing powerful automated pipelines and RSS event-driven nodes.', how: 'Built Sociality News engine automated workflows linking JSON formats.', prof: 70, color: '#0099ff', orbit: 3, angle: Math.PI / 3 + (2 * Math.PI) / 3, speed: 0.001 },
  { name: 'REST APIs', desc: 'Integrating third-party platforms, token management, and JSON models.', how: 'Connected Groq AI systems, job discovery aggregations, and Google endpoints.', prof: 74, color: '#7b4fff', orbit: 3, angle: Math.PI / 3 + (4 * Math.PI) / 3, speed: 0.001 }
];

const orbitR = [0, 95, 160, 220]; // Refined orbit radii
let hoveredSkill = null;
const tt = document.getElementById('skill-tooltip');

function drawGalaxy() {
  gctx.clearRect(0, 0, gc.width, gc.height);
  const cx = gc.width / 2;
  const cy = gc.height / 2;

  // Draw orbit circles
  [1, 2, 3].forEach(o => {
    gctx.beginPath();
    gctx.arc(cx, cy, orbitR[o], 0, Math.PI * 2);
    gctx.strokeStyle = 'rgba(0, 229, 200, 0.06)';
    gctx.lineWidth = 1;
    gctx.setLineDash([3, 10]);
    gctx.stroke();
    gctx.setLineDash([]);
  });

  // Center star / gravity core
  gctx.beginPath();
  gctx.arc(cx, cy, 22, 0, Math.PI * 2);
  const sg = gctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
  sg.addColorStop(0, 'rgba(0, 229, 200, 0.5)');
  sg.addColorStop(1, 'rgba(0, 229, 200, 0)');
  gctx.fillStyle = sg;
  gctx.fill();

  gctx.beginPath();
  gctx.arc(cx, cy, 6, 0, Math.PI * 2);
  gctx.fillStyle = '#00e5c8';
  gctx.fill();
  
  gctx.font = '700 9px JetBrains Mono, monospace';
  gctx.fillStyle = '#030a12';
  gctx.textAlign = 'center';
  gctx.fillText('VE', cx, cy + 3);

  // Draw orbiting planets
  skillData.forEach(s => {
    s.angle += s.speed;
    const r = orbitR[s.orbit];
    const x = cx + r * Math.cos(s.angle);
    const y = cy + r * Math.sin(s.angle);
    
    // Store coordinates for mouse interactions
    s._x = x;
    s._y = y;

    const isHov = (hoveredSkill === s);
    const pr = isHov ? 18 : 12;

    // Glowing halo
    const pg = gctx.createRadialGradient(x, y, 0, x, y, pr * 2.2);
    pg.addColorStop(0, s.color + (isHov ? '44' : '15'));
    pg.addColorStop(1, s.color + '00');
    gctx.beginPath();
    gctx.arc(x, y, pr * 2.2, 0, Math.PI * 2);
    gctx.fillStyle = pg;
    gctx.fill();

    // Planet body
    gctx.beginPath();
    gctx.arc(x, y, pr, 0, Math.PI * 2);
    gctx.fillStyle = s.color + (isHov ? '28' : '12');
    gctx.fill();
    gctx.strokeStyle = s.color + (isHov ? 'cc' : '55');
    gctx.lineWidth = 1;
    gctx.stroke();

    // Planet core nucleus
    gctx.beginPath();
    gctx.arc(x, y, pr * 0.25, 0, Math.PI * 2);
    gctx.fillStyle = s.color;
    gctx.fill();

    // Labels with styling overrides on hover
    if (isHov) {
      gctx.font = '600 12px Syne, sans-serif';
      gctx.fillStyle = '#fff';
      gctx.shadowColor = s.color;
      gctx.shadowBlur = 8;
    } else {
      gctx.font = '500 11px Syne, sans-serif';
      gctx.fillStyle = 'rgba(200, 224, 240, 0.7)';
      gctx.shadowBlur = 0;
    }
    
    gctx.textAlign = 'center';
    gctx.fillText(s.name, x, y + pr + 14);
    gctx.shadowBlur = 0; // reset
  });

  requestAnimationFrame(drawGalaxy);
}
drawGalaxy();

// Interactive tooltip binding
gc.addEventListener('mousemove', e => {
  const rect = gc.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  let found = null;

  skillData.forEach(s => {
    if (s._x && Math.hypot(mx - s._x, my - s._y) < 22) {
      found = s;
    }
  });

  hoveredSkill = found;
  if (found) {
    document.getElementById('tt-title').textContent = found.name;
    document.getElementById('tt-desc').textContent = found.desc + ' ' + found.how;
    document.getElementById('tt-bar').style.width = found.prof + '%';
    document.getElementById('tt-level').textContent = 'Proficiency: ' + found.prof + '%';
    tt.style.display = 'block';
    
    // Positioning tooltip near mouse
    tt.style.left = (e.clientX + 16) + 'px';
    tt.style.top = (e.clientY - 20) + 'px';
  } else {
    tt.style.display = 'none';
  }
});

gc.addEventListener('mouseleave', () => {
  hoveredSkill = null;
  tt.style.display = 'none';
});


// ==========================================
// 5. REVEAL ON SCROLL & STATS COUNT ANIMATION
// ==========================================
const reveals = document.querySelectorAll('.reveal, .timeline-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.classList.contains('stat-card')) {
        animateCounter(e.target);
      }
      // If we observe parent containers of stat-cards, check their children
      const cards = e.target.querySelectorAll('.stat-card');
      cards.forEach(card => animateCounter(card));
    }
  });
}, { threshold: 0.1 });

reveals.forEach(r => observer.observe(r));

function animateCounter(card) {
  const el = card.querySelector("[data-target]");
  if (!el || el._animated) return;
  el._animated = true;

  if (el.getAttribute("data-custom")) {
    el.textContent = el.getAttribute("data-custom");
    return;
  }

  const target = +el.getAttribute("data-target");
  if (target === 0) {
    el.textContent = "∞";
    return;
  }

  let current = 0;
  const steps = 50;
  const interval = 20;
  const increment = target / steps;

  const t = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.round(current);
    if (Math.round(current) >= target) {
      el.textContent = target;
      clearInterval(t);
    }
  }, interval);
}


// ==========================================
// 6. CHAT ASSISTANT KNOWLEDGE BASE
// ==========================================
const chatKB = {
  'technologies': `Vaishnavi works with Python, JavaScript, React, HTML/CSS, SQL, and REST APIs for development — plus n8n for automation, Generative AI for intelligent apps, and GitHub for version control. She is currently expanding her expertise in React and AI-driven workflows.`,
  'projects': `She has built 7 projects: 
1. Career Intelligence Agent (React + Groq AI strategy, live job discover API)
2. Sociality News Engine (n8n automated workflow engine and RSS curator)
3. KrishnaKrushik (state-level buildathon selection, Generative AI farming model)
4. Agro AI (Multilingual responsive static crop advice hub)
5. Agent Guess Master (Python adaptive feedback heuristic engine)
6. Mini Mart DBMS (Normalized SQLite schema structure and conditional billing joins)
7. Pyone (Python English-based DSL compiler interpreter & runtime engine)`,
  'learning': `Vaishnavi is currently focused on advanced React patterns, system design, AI integration at the application layer, and deepening her understanding of automation workflows with n8n and API-first architectures.`,
  'achievements': `Selected for a state-level Buildathon. Scored 908/1000 in Intermediate (near-perfect). Attended Gen AI, robotics, and gesture-tech workshops. Completed OpenAI Academy × NxtWave Generative AI Mastery program.`
};

function askQuestion(q) {
  const input = document.getElementById('chat-input-field');
  if (input) {
    input.value = q;
    sendChat();
  }
}

function sendChat() {
  const inp = document.getElementById('chat-input-field');
  const q = inp.value.trim();
  if (!q) return;

  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML += `<div class="msg user"><div class="msg-avatar">You</div><div class="msg-bubble">${q}</div></div>`;
  inp.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  const lq = q.toLowerCase();
  let ans = `I can tell you about her technologies, projects, achievements, or what she's currently learning. Try asking one of those topics!`;

  if (lq.includes('tech') || lq.includes('skill') || lq.includes('know')) {
    ans = chatKB.technologies;
  } else if (lq.includes('project') || lq.includes('built') || lq.includes('work') || lq.includes('make')) {
    ans = chatKB.projects;
  } else if (lq.includes('learn') || lq.includes('study') || lq.includes('current')) {
    ans = chatKB.learning;
  } else if (lq.includes('achiev') || lq.includes('award') || lq.includes('hackathon') || lq.includes('buildathon')) {
    ans = chatKB.achievements;
  } else if (lq.includes('contact') || lq.includes('email') || lq.includes('reach') || lq.includes('phone') || lq.includes('call')) {
    ans = `You can reach Vaishnavi at erukalavaishnavi@gmail.com or call +91 83284 48653. She is always happy to connect about technology, engineering and project collaboration!`;
  }

  setTimeout(() => {
    msgs.innerHTML += `<div class="msg ai"><div class="msg-avatar">AI</div><div class="msg-bubble">${ans}</div></div>`;
    msgs.scrollTop = msgs.scrollHeight;
    setupCursorHovers(); // Rebind hovers to new elements if needed
  }, 600);
}

// Bind globally for inline onclick attributes
window.askQuestion = askQuestion;
window.sendChat = sendChat;
