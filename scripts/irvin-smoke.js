(() => {
  const body = document.body;
  const canvas = document.getElementById('smoke-screen');
  const gate = document.getElementById('smoke-gate');
  const visitCount = document.getElementById('visitCount');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const COUNTER_API = 'https://site-counters.gzamlo98.workers.dev/api/counter?slug=irvin-garcia-bullied-me';

  body?.classList.add('is-gated');

  const enterPage = () => {
    body?.classList.remove('is-gated');
  };

  const handleGateKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      enterPage();
    }
  };

  gate?.addEventListener('click', enterPage);
  gate?.addEventListener('keydown', handleGateKeydown);

  async function loadVisitCount() {
    if (!visitCount) return;
    try {
      const res = await fetch(COUNTER_API, { method: 'GET' });
      if (!res.ok) throw new Error('failed to load counter');
      const data = await res.json();
      visitCount.textContent = Number(data.count) || 0;
    } catch (err) {
      console.error(err);
    }
  }

  async function incrementVisitCount() {
    if (!visitCount) return;
    try {
      const res = await fetch(COUNTER_API, { method: 'POST' });
      if (!res.ok) throw new Error('failed to increment counter');
      const data = await res.json();
      visitCount.textContent = Number(data.count) || 0;
    } catch (err) {
      console.error(err);
      loadVisitCount();
    }
  }

  incrementVisitCount();

  if (prefersReducedMotion.matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const smokePuffs = [];
  const smokeCount = 44;
  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let lastTime = 0;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resetPuff(puff, initial = false) {
    puff.x = random(-width * 0.1, width * 1.1);
    puff.y = initial ? random(0, height) : random(height * 0.72, height * 1.1);
    puff.radius = random(140, 300);
    puff.speedY = random(6, 20);
    puff.speedX = random(-12, 12);
    puff.alpha = random(0.12, 0.24);
    puff.blur = random(34, 72);
    puff.drift = random(0.3, 1.1);
    puff.offset = random(0, Math.PI * 2);
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function seedSmoke() {
    smokePuffs.length = 0;
    for (let index = 0; index < smokeCount; index += 1) {
      const puff = {};
      resetPuff(puff, true);
      smokePuffs.push(puff);
    }
  }

  function drawPuff(puff, nowSeconds) {
    const driftX = Math.sin(nowSeconds * puff.drift + puff.offset) * 18;
    const gradient = ctx.createRadialGradient(
      puff.x + driftX * 0.15,
      puff.y,
      puff.radius * 0.1,
      puff.x + driftX,
      puff.y,
      puff.radius
    );

    gradient.addColorStop(0, `rgba(62, 66, 64, ${puff.alpha})`);
    gradient.addColorStop(0.45, `rgba(98, 103, 100, ${puff.alpha * 0.88})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = `blur(${puff.blur}px)`;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(puff.x + driftX, puff.y, puff.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate(timestamp) {
    if (document.hidden) {
      animationFrame = window.requestAnimationFrame(animate);
      return;
    }

    if (!lastTime) lastTime = timestamp;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.033);
    lastTime = timestamp;
    const nowSeconds = timestamp / 1000;

    ctx.clearRect(0, 0, width, height);

    for (const puff of smokePuffs) {
      puff.y -= puff.speedY * delta;
      puff.x += puff.speedX * delta + Math.sin(nowSeconds * puff.drift + puff.offset) * 0.08;

      if (puff.y < -puff.radius * 1.4 || puff.x < -puff.radius * 1.4 || puff.x > width + puff.radius * 1.4) {
        resetPuff(puff);
      }

      drawPuff(puff, nowSeconds);
    }

    animationFrame = window.requestAnimationFrame(animate);
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      lastTime = 0;
    }
  }

  resizeCanvas();
  seedSmoke();

  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  animationFrame = window.requestAnimationFrame(animate);

  prefersReducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      window.cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, width, height);
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = '';
    resizeCanvas();
    seedSmoke();
    lastTime = 0;
    animationFrame = window.requestAnimationFrame(animate);
  });
})();
