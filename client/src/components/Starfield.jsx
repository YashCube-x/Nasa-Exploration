import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let shootingStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 3000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: (Math.random() - 0.5) * 0.008,
        drift: (Math.random() - 0.5) * 0.05,
      }));
    };

    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.003) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 6 + 4,
          angle: (Math.PI / 4) + (Math.random() * 0.3),
          alpha: 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      for (const star of stars) {
        star.alpha += star.alphaSpeed;
        if (star.alpha > 1 || star.alpha < 0.15) star.alphaSpeed *= -1;
        star.x += star.drift;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${star.alpha})`;
        ctx.fill();
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const endX = s.x + Math.cos(s.angle) * s.len;
        const endY = s.y + Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.012;

        if (s.alpha <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }

      spawnShootingStar();
      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    draw();
    window.addEventListener('resize', () => { resize(); createStars(); });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
