// Starfield Setup
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  stars.forEach(star => {
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;

    const k = 128.0 / star.z;
    const px = (star.x - canvas.width / 2) * k + canvas.width / 2;
    const py = (star.y - canvas.height / 2) * k + canvas.height / 2;

    if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  requestAnimationFrame(animateStars);
}

// Global state
let typed = '';
let activated = false;

const ring = document.getElementById('glyph-ring');
const starfield = document.getElementById('starfield');
const phrase = document.getElementById('phrase');
const symbols = document.querySelectorAll('.symbol');
const symbolsContainer = document.getElementById('symbols');
const whisper = document.getElementById('symbol-whisper');

const warpCanvas = document.getElementById('warp-lines');
const warpCtx = warpCanvas.getContext('2d');
warpCanvas.width = window.innerWidth;
warpCanvas.height = window.innerHeight;
let warpActive = false;

// Trigger from keyboard
document.addEventListener('keydown', (e) => {
  if (activated) return;
  typed += e.key.toLowerCase();
  if (typed.includes('source')) {
    activatePortal();
    activated = true;
  }
});

function activatePortal() {
  ring.style.transform = 'scale(25)';
  ring.style.opacity = '0';

  starfield.style.display = 'block';
  starfield.style.opacity = '0';
  starfield.style.transition = 'opacity 2s ease';
  requestAnimationFrame(() => {
    starfield.style.opacity = '1';
  });

  animateStars();

  setTimeout(() => {
    phrase.style.opacity = '1';
  }, 2000);

  setTimeout(() => {
    symbolsContainer.style.opacity = '1';
    symbolsContainer.style.pointerEvents = 'auto';
  }, 3000);
}

// Hover whisper effect
symbols.forEach(symbol => {
  symbol.addEventListener('mouseenter', () => {
    whisper.textContent = symbol.dataset.message;
    whisper.style.opacity = '1';
  });
  symbol.addEventListener('mouseleave', () => {
    whisper.style.opacity = '0';
  });
});

// Symbol click → realm warp
symbols.forEach(symbol => {
  symbol.addEventListener('click', () => {
    const realmID = symbol.dataset.realm;

    // Warp zoom effect
    symbol.style.transition = 'transform 2s ease, opacity 1.5s ease';
    symbol.style.transform = 'scale(60)';
    symbol.style.opacity = '0';

    symbols.forEach(s => {
      if (s !== symbol) s.style.opacity = '0';
    });

    setTimeout(() => {
      if (realmID === "3") enterRealmOne();
    }, 2000);
  });
});

function enterRealmOne() {
  warpCanvas.style.display = 'block';
  warpActive = true;

  document.getElementById('portal').style.opacity = '0';
  document.getElementById('symbols').style.opacity = '0';
  document.getElementById('symbol-whisper').style.opacity = '0';
  document.getElementById('phrase').style.opacity = '0';

  let lines = [];
  for (let i = 0; i < 100; i++) {
    lines.push({
      x: Math.random() * warpCanvas.width,
      y: Math.random() * warpCanvas.height,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 10 + 10
    });
  }

  function animateWarp() {
    if (!warpActive) return;
    warpCtx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
    warpCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    warpCtx.lineWidth = 1;

    lines.forEach(line => {
      warpCtx.beginPath();
      warpCtx.moveTo(line.x, line.y);
      warpCtx.lineTo(line.x, line.y - line.length);
      warpCtx.stroke();

      line.y -= line.speed;
      if (line.y < -line.length) {
        line.x = Math.random() * warpCanvas.width;
        line.y = warpCanvas.height + line.length;
      }
    });

    requestAnimationFrame(animateWarp);
  }

  animateWarp();

  setTimeout(() => {
    warpActive = false;
    warpCanvas.style.display = 'none';
    const realm = document.getElementById('realm-one');
    realm.classList.remove('hidden');
    realm.classList.add('active');
    const canvas = document.getElementById('memory-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMemoryFragments(canvas, ctx);
  }, 3000);
}

function initMemoryFragments(canvas, ctx) {
  let fragments = [];
  for (let i = 0; i < 100; i++) {
    fragments.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.3 + 0.2,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fragments.forEach(f => {
      f.x += f.dx;
      f.y += f.dy;

      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 200, 255, ${f.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}