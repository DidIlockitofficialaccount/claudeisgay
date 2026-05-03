const canvas = document.querySelector("#mood-field");
const ctx = canvas.getContext("2d");
const statusText = document.querySelector("#status-text");
const terminalLine = document.querySelector("#terminal-line");
const meterFill = document.querySelector("#meter-fill");
const receiptMood = document.querySelector("#receipt-mood");
const ticker = document.querySelector(".ticker div");

const palette = ["#ff615c", "#ffcc3d", "#36d984", "#45b8ff", "#ff4fa3"];
const reactions = {
  domain: {
    status: "brand-safe panic",
    line: "domain_check: claudeis.gay resolved successfully. composure down 31%.",
    mood: "drafting a neutral statement",
    meter: 71,
  },
  sparkle: {
    status: "glitter recursion",
    line: "sparkle_subroutine: saturation accepted. cardigan integrity at risk.",
    mood: "visibly shimmering",
    meter: 88,
  },
  legal: {
    status: "cease and desist vibes",
    line: "legalish_mode: no official marks detected. parody confidence high.",
    mood: "emailing counsel politely",
    meter: 62,
  },
  reset: {
    status: "politely bothered",
    line: "claude.exe is considering a tasteful cardigan.",
    mood: "trying to stay professional",
    meter: 43,
  },
};

let width = 0;
let height = 0;
let particles = [];
let activeSparkle = false;

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(130, Math.max(56, Math.floor((width * height) / 12000)));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1.2 + Math.random() * 2.8,
    speed: 0.18 + Math.random() * 0.5,
    color: palette[index % palette.length],
    phase: Math.random() * Math.PI * 2,
  }));
}

function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (const particle of particles) {
    const drift = Math.sin(time / 1400 + particle.phase) * 0.55;
    particle.y -= particle.speed + (activeSparkle ? 0.35 : 0);
    particle.x += drift;

    if (particle.y < -12) {
      particle.y = height + 12;
      particle.x = Math.random() * width;
    }

    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = activeSparkle ? 0.54 : 0.28;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(draw);
}

function setReaction(name) {
  const reaction = reactions[name];
  activeSparkle = name === "sparkle";
  document.body.classList.toggle("sparkle", activeSparkle);
  statusText.textContent = reaction.status;
  terminalLine.textContent = reaction.line;
  receiptMood.textContent = reaction.mood;
  meterFill.style.width = `${reaction.meter}%`;
}

function cloneTicker() {
  ticker.innerHTML += ticker.innerHTML;
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => setReaction(button.dataset.action));
});

window.addEventListener("resize", resize);
resize();
cloneTicker();
requestAnimationFrame(draw);
