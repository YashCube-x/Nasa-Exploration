import { useEffect, useRef } from 'react';

export default function ConfettiRocket() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#7b61ff', '#00e6ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ee82ee', '#fff'];

    // Create particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        gravity: 0.12,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    // Rocket trail particles
    let rocketY = canvas.height;
    const rocketX = canvas.width / 2;
    let rocketPhase = true;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rocket phase (rising)
      if (rocketPhase) {
        rocketY -= 8;

        // Rocket body
        ctx.font = '36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚀', rocketX, rocketY);

        // Rocket trail
        for (let t = 0; t < 3; t++) {
          ctx.beginPath();
          ctx.arc(
            rocketX + (Math.random() - 0.5) * 15,
            rocketY + 30 + Math.random() * 20,
            Math.random() * 4 + 1,
            0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 180 + 60)}, 0, ${Math.random() * 0.8 + 0.2})`;
          ctx.fill();
        }

        if (rocketY < canvas.height * 0.35) {
          rocketPhase = false;
        }
      }

      // Confetti particles
      if (!rocketPhase) {
        let alive = false;
        for (const p of particles) {
          if (p.alpha <= 0) continue;
          alive = true;

          p.x += p.vx;
          p.vy += p.gravity;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.rotation += p.rotSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          }

          ctx.restore();
        }

        if (!alive) {
          cancelAnimationFrame(animationId);
          return;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
