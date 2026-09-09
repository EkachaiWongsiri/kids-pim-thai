import React, { useRef, useEffect } from 'react';
import { FallingWord, Particle, LaserBeam, FloatingText } from '../types/game';

interface GameCanvasProps {
  wordsRef: React.MutableRefObject<FallingWord[]>;
  particlesRef: React.MutableRefObject<Particle[]>;
  lasersRef: React.MutableRefObject<LaserBeam[]>;
  floatingTextsRef: React.MutableRefObject<FloatingText[]>;
  cannonAngleRef: React.MutableRefObject<number>;
  lives: number;
  maxLives: number;
}

const BALLOON_COLORS = [
  { bg: 'rgba(239, 68, 68, 0.9)', border: '#f87171', glow: '#ef4444' }, // Red
  { bg: 'rgba(59, 130, 246, 0.9)', border: '#60a5fa', glow: '#3b82f6' }, // Blue
  { bg: 'rgba(16, 185, 129, 0.9)', border: '#34d399', glow: '#10b981' }, // Green
  { bg: 'rgba(245, 158, 11, 0.9)', border: '#fbbf24', glow: '#f59e0b' }, // Amber
  { bg: 'rgba(168, 85, 247, 0.9)', border: '#c084fc', glow: '#a855f7' }, // Purple
  { bg: 'rgba(236, 72, 153, 0.9)', border: '#f472b6', glow: '#ec4899' }, // Pink
];

export const GameCanvas: React.FC<GameCanvasProps> = ({
  wordsRef,
  particlesRef,
  lasersRef,
  floatingTextsRef,
  cannonAngleRef,
  lives,
  maxLives,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Starry Sky Background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#090d16');
      gradient.addColorStop(0.6, '#0f172a');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 241.7) % (height * 0.75));
        const radius = (i % 3 === 0) ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Danger Ground Line
      const groundY = height - 40;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ground Base Fill
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
      groundGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      groundGrad.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, width, height - groundY);

      // 3. Draw Laser Beams
      const lasers = lasersRef.current;
      lasers.forEach((laser) => {
        ctx.save();
        ctx.strokeStyle = laser.color || '#38bdf8';
        ctx.lineWidth = Math.max(1, 6 * laser.alpha);
        ctx.shadowColor = laser.color || '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.globalAlpha = laser.alpha;

        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.targetX, laser.targetY);
        ctx.stroke();

        // Inner bright white core of the laser
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 2.5 * laser.alpha);
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.targetX, laser.targetY);
        ctx.stroke();

        ctx.restore();
      });

      // 4. Draw Particles (Explosion & Sparks)
      const particles = particlesRef.current;
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw Falling Words (Balloons / Capsules)
      const words = wordsRef.current;
      words.forEach((w) => {
        ctx.save();
        const colorStyle = BALLOON_COLORS[w.balloonType % BALLOON_COLORS.length];

        // High legibility font for Thai stacked vowels and English letters
        ctx.font = '600 28px "Sarabun", "Prompt", "Kanit", sans-serif';
        const fullText = w.text;
        const textMetrics = ctx.measureText(fullText);
        const paddingX = 22;
        const boxWidth = Math.max(textMetrics.width + paddingX * 2, 85);
        const boxHeight = 58; // Increased height so upper tone marks (ไม้โท, ไม้เอก, ไม้หันอากาศ) never clip

        const boxX = w.x - boxWidth / 2;
        const boxY = w.y - boxHeight / 2;

        // Shadow & Glow
        if (w.isTarget) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 22;
        } else {
          ctx.shadowColor = colorStyle.glow;
          ctx.shadowBlur = 12;
        }

        // Draw Balloon / Pod Body (Rounded rectangle)
        ctx.beginPath();
        const radius = 20;
        ctx.moveTo(boxX + radius, boxY);
        ctx.lineTo(boxX + boxWidth - radius, boxY);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
        ctx.lineTo(boxX + radius, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
        ctx.lineTo(boxX, boxY + radius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
        ctx.closePath();

        // Fill
        ctx.fillStyle = w.isTarget ? 'rgba(30, 41, 59, 0.95)' : colorStyle.bg;
        ctx.fill();

        // Border
        ctx.lineWidth = w.isTarget ? 3.5 : 2;
        ctx.strokeStyle = w.isTarget ? '#fbbf24' : colorStyle.border;
        ctx.stroke();

        // Target crown indicator
        if (w.isTarget) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '16px sans-serif';
          ctx.fillText('▼', w.x - 6, boxY - 8);
        }

        // ================= Natural Thai Word Rendering =================
        // Render full word as a unified string to preserve OpenType tone mark stacking (ไม้โท, ไม้เอก, ไม้หันอากาศ)
        ctx.font = '600 28px "Sarabun", "Prompt", "Kanit", sans-serif';
        ctx.textBaseline = 'middle';
        const textStartX = boxX + paddingX;
        const textY = boxY + boxHeight / 2 + 2;

        // 1. Draw full word (Base layer - White)
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillText(fullText, textStartX, textY);

        // 2. Draw typed prefix (Overlay layer - Bright Neon Emerald Green)
        if (w.typedIndex > 0) {
          const typedPrefix = fullText.substring(0, w.typedIndex);
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.fillText(typedPrefix, textStartX, textY);
        }

        // 3. Highlight next character to type for active target
        if (w.isTarget && w.typedIndex < fullText.length) {
          const typedPrefix = fullText.substring(0, w.typedIndex);

          // Draw active next character in bright glowing amber/gold
          ctx.save();
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 14;
          // Render the active character slice
          ctx.fillText(fullText.substring(0, w.typedIndex + 1), textStartX, textY);
          
          // Re-draw typed prefix in green so only the new letter is amber
          if (typedPrefix.length > 0) {
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 8;
            ctx.fillText(typedPrefix, textStartX, textY);
          }
          ctx.restore();
        }

        ctx.restore();
      });

      // 6. Draw Floating Score/Combo Texts
      const floatingTexts = floatingTextsRef.current;
      floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 22px "Prompt", "Mali", sans-serif';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // 7. Draw Laser Cannon at Bottom Center
      const cannonX = width / 2;
      const cannonY = height - 20;
      const cannonAngle = cannonAngleRef.current;

      ctx.save();
      ctx.translate(cannonX, cannonY);
      ctx.rotate(cannonAngle);

      // Cannon Barrel
      const barrelGrad = ctx.createLinearGradient(-8, -45, 8, 0);
      barrelGrad.addColorStop(0, '#38bdf8');
      barrelGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = barrelGrad;
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.fillRect(-7, -42, 14, 34);
      ctx.strokeRect(-7, -42, 14, 34);

      // Cannon Energy Tip
      ctx.fillStyle = '#67e8f9';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -42, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Cannon Dome Base
      ctx.save();
      const baseGrad = ctx.createRadialGradient(cannonX, cannonY, 5, cannonX, cannonY, 28);
      baseGrad.addColorStop(0, '#38bdf8');
      baseGrad.addColorStop(0.7, '#1e293b');
      baseGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = baseGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(cannonX, cannonY, 24, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing power core
      ctx.fillStyle = '#a5f3fc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cannonX, cannonY - 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 8. Ground Health Shield Bar
      const healthRatio = Math.max(0, lives / maxLives);
      const shieldBarW = 220;
      const shieldBarH = 6;
      const shieldX = (width - shieldBarW) / 2;
      const shieldY = height - 8;

      ctx.fillStyle = 'rgba(51, 65, 85, 0.7)';
      ctx.fillRect(shieldX, shieldY, shieldBarW, shieldBarH);

      const healthColor = healthRatio > 0.5 ? '#10b981' : healthRatio > 0.25 ? '#f59e0b' : '#ef4444';
      ctx.fillStyle = healthColor;
      ctx.shadowColor = healthColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(shieldX, shieldY, shieldBarW * healthRatio, shieldBarH);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [lives, maxLives, wordsRef, particlesRef, lasersRef, floatingTextsRef, cannonAngleRef]);

  return (
    <div className="relative w-full flex-1 min-h-[300px] md:min-h-[420px] max-h-[560px] overflow-hidden rounded-2xl border-2 border-slate-700/80 shadow-2xl bg-slate-950">
      <canvas
        ref={canvasRef}
        width={960}
        height={480}
        className="w-full h-full object-contain block select-none"
      />
    </div>
  );
};
