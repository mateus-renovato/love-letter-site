document.addEventListener("DOMContentLoaded", () => {

// ===================================================
// Canvas / Animação do Coração
// ===================================================
const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const stars = [];

const isMobile = window.innerWidth < 768;

// Mouse / Toque
const mouse = {
  x: null,
  y: null,
  radius: 120
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("touchmove", (event) => {
  if (event.touches[0]) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
  }
});

// Fórmula do coração
function heartFunction(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

// Estrelas de fundo
class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.opacity = Math.random();
    this.speed = Math.random() * 0.02;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.opacity += this.speed;

    if (this.opacity >= 1 || this.opacity <= 0.2) {
      this.speed *= -1;
    }

    this.draw();
  }
}

// Partículas do coração (texto "LOVE")
class Particle {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? "#ff4f81" : "#ff1744";
    this.density = Math.random() * 15;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size * 8}px Arial`;

    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    ctx.fillText("LOVE", this.x, this.y);
  }

  update() {
    // Movimento suave de flutuação
    this.x += Math.sin(Date.now() * 0.001 + this.baseX) * 0.05;
    this.y += Math.cos(Date.now() * 0.001 + this.baseY) * 0.05;

    // Interação com mouse/toque
    if (mouse.x !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;

        this.x -= forceDirectionX * force * this.density;
        this.y -= forceDirectionY * force * this.density;
      } else {
        this.x += (this.baseX - this.x) * 0.03;
        this.y += (this.baseY - this.y) * 0.03;
      }
    }

    this.draw();
  }
}

// Cria estrelas
function createStars() {
  stars.length = 0;

  const total = isMobile ? 100 : 200;

  for (let i = 0; i < total; i++) {
    stars.push(new Star());
  }
}

// Cria o coração de partículas
function createHeart() {
  particles.length = 0;

  // No celular o passo é maior -> menos partículas -> melhor performance
  const step = isMobile ? 0.09 : 0.05;
  const scale = isMobile ? 12 : 22;

  for (let t = 0; t < Math.PI * 2; t += step) {
    const pos = heartFunction(t);

    const x = canvas.width / 2 + pos.x * scale;
    const y = canvas.height / 2 - pos.y * scale;

    particles.push(new Particle(x, y));
  }
}

createStars();
createHeart();

// Loop de animação
let pulse = 0;

function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => star.update());

  pulse += 0.02;
  const scale = 1 + Math.sin(pulse) * 0.02;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  particles.forEach((particle) => particle.update());

  ctx.restore();
}

animate();

// Redimensionamento da tela
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  createStars();
  createHeart();
});

// ===================================================
// Player de Música
// ===================================================
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");

function updateBtn() {
  playBtn.innerHTML = audio.paused ? "▶" : "❚❚";
}

// Tenta tocar automaticamente ao carregar
audio.play()
  .then(updateBtn)
  .catch(() => {
    // Navegador bloqueou autoplay -> toca no primeiro toque/clique
    updateBtn();

    const startOnInteraction = () => {
      audio.play().then(updateBtn);
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("touchstart", startOnInteraction);
    };

    document.addEventListener("click", startOnInteraction);
    document.addEventListener("touchstart", startOnInteraction);
  });

playBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }

  updateBtn();
});

// ===================================================
// Carta (Modal)
// ===================================================
const openLetter = document.getElementById("openLetter");
const closeLetter = document.getElementById("closeLetter");
const letterModal = document.getElementById("letterModal");

openLetter.addEventListener("click", () => {
  letterModal.classList.add("active");
});

closeLetter.addEventListener("click", () => {
  letterModal.classList.remove("active");
});

// Fecha clicando fora da caixa da carta
letterModal.addEventListener("click", (event) => {
  if (event.target === letterModal) {
    letterModal.classList.remove("active");
  }
});

}); // fim DOMContentLoaded