// Canvas renderer for all 8 scenes — used for MP4 export
// Resolution: 1080x1920 (9:16 vertical video)

const W = 1080;
const H = 1920;

const TEAL = '#00FFD5';
const GOLD = '#FFD700';
const PURPLE = '#9D4EDD';
const DARK = '#0A0A0A';

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  // Subtle cosmic gradient
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W);
  grad.addColorStop(0, 'rgba(157,78,221,0.06)');
  grad.addColorStop(0.5, 'rgba(0,255,213,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawParticles(ctx: CanvasRenderingContext2D, time: number) {
  for (let i = 0; i < 40; i++) {
    const seed = i * 137.508;
    const x = ((seed * 7.3 + time * 20 * (i % 3 + 1)) % W);
    const y = ((seed * 13.7 + time * 15 * (i % 2 + 1)) % H);
    const size = 1 + (i % 3);
    const colors = [TEAL, GOLD, PURPLE];
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % 3];
    ctx.globalAlpha = 0.15 + Math.sin(time + i) * 0.1;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFlowerOfLife(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, alpha: number) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawAlchemist(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, eyeGlow: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  
  // Cloak
  ctx.beginPath();
  ctx.moveTo(0, -200);
  ctx.bezierCurveTo(-80, -200, -120, -140, -130, -60);
  ctx.lineTo(-150, 250);
  ctx.bezierCurveTo(-150, 270, -130, 280, -100, 280);
  ctx.lineTo(100, 280);
  ctx.bezierCurveTo(130, 280, 150, 270, 150, 250);
  ctx.lineTo(130, -60);
  ctx.bezierCurveTo(120, -140, 80, -200, 0, -200);
  ctx.closePath();
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Hood opening
  ctx.beginPath();
  ctx.ellipse(0, -130, 65, 75, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#050505';
  ctx.fill();
  
  // Eyes
  const eyeAlpha = Math.min(eyeGlow, 1);
  ctx.globalAlpha = eyeAlpha;
  ctx.shadowColor = TEAL;
  ctx.shadowBlur = 20;
  ctx.fillStyle = TEAL;
  ctx.beginPath();
  ctx.ellipse(-22, -140, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(22, -140, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  
  // Circuit lines on hoodie
  ctx.strokeStyle = TEAL;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-40, -20); ctx.lineTo(-40, 60); ctx.lineTo(-10, 60); ctx.lineTo(-10, 120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(40, -20); ctx.lineTo(40, 60); ctx.lineTo(10, 60); ctx.lineTo(10, 120);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.restore();
}

function drawZodiacRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number, color: string) {
  const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.font = '28px serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  signs.forEach((sign, i) => {
    const angle = ((i * 30 - 90) * Math.PI) / 180 + rotation;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    ctx.globalAlpha = 0.7;
    ctx.fillText(sign, x, y);
  });
  ctx.globalAlpha = 1;
}

function drawCandle(ctx: CanvasRenderingContext2D, x: number, open: number, close: number, high: number, low: number, bull: boolean) {
  const color = bull ? TEAL : '#FF4444';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, high);
  ctx.lineTo(x, low);
  ctx.stroke();
  
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  const top = Math.min(open, close);
  const height = Math.abs(close - open);
  ctx.fillRect(x - 10, top, 20, Math.max(height, 2));
  ctx.globalAlpha = 1;
}

// Polyfill roundRect for older browsers
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

function drawSubtitle(ctx: CanvasRenderingContext2D, text: string, progress: number) {
  const words = text.split(' ');
  ctx.font = 'bold 52px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Background
  const totalWidth = ctx.measureText(text).width + 80;
  ctx.fillStyle = 'rgba(10,10,10,0.7)';
  roundRect(ctx, W/2 - totalWidth/2, H - 400, totalWidth, 80, 16);
  ctx.fill();
  
  let xOffset = W/2 - totalWidth/2 + 40;
  words.forEach((word, i) => {
    const wordVisible = progress > i * 0.15;
    const isHighlighted = ['ДРЕВНЯЯ','МУДРОСТЬ','ФИНАНСОВЫЙ','КОД','ТРАНСФОРМАЦИЯ','АСТРАЛЬНО','СУДЬБЫ','ВСЕЛЕННУЮ'].includes(word);
    
    ctx.globalAlpha = wordVisible ? 1 : 0;
    ctx.fillStyle = isHighlighted ? GOLD : '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(word + ' ', xOffset, H - 360);
    xOffset += ctx.measureText(word + ' ').width;
  });
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
}

function drawInfinityLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, glow: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 20 + glow * 30;
  
  ctx.beginPath();
  ctx.moveTo(-60, 0);
  ctx.bezierCurveTo(-60, -40, -20, -50, 0, -20);
  ctx.bezierCurveTo(20, -50, 60, -40, 60, 0);
  ctx.bezierCurveTo(60, 40, 20, 50, 0, 20);
  ctx.bezierCurveTo(-20, 50, -60, 40, -60, 0);
  ctx.closePath();
  ctx.stroke();
  
  // Zodiac dots inside
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const x = 35 * Math.cos(angle);
    const y = 15 * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = TEAL;
    ctx.globalAlpha = 0.5 + Math.sin(i) * 0.3;
    ctx.fill();
  }
  
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawSceneIndicator(ctx: CanvasRenderingContext2D, sceneNum: number, sceneName: string) {
  ctx.font = '20px Orbitron, monospace';
  ctx.fillStyle = TEAL;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = 'left';
  ctx.fillText(`СЦЕНА ${sceneNum}/8 • ${sceneName}`, 40, 60);
  ctx.globalAlpha = 1;
}

function drawTimeCode(ctx: CanvasRenderingContext2D, time: number) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const ms = Math.floor((time % 1) * 100);
  ctx.font = '20px Orbitron, monospace';
  ctx.fillStyle = GOLD;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = 'right';
  ctx.fillText(`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}:${String(ms).padStart(2,'0')} / 01:00`, W - 40, 60);
  ctx.globalAlpha = 1;
}

// ============ SCENE RENDERERS ============

function renderScene1(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min(t / 5, 1);
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  // Dot of light expanding
  const dotSize = 10 + p * 500;
  const dotAlpha = p < 0.3 ? 1 : Math.max(0, 1 - (p - 0.3) * 2.5);
  ctx.beginPath();
  ctx.arc(W/2, H/2, dotSize, 0, Math.PI * 2);
  ctx.fillStyle = TEAL;
  ctx.globalAlpha = dotAlpha * 0.3;
  ctx.shadowColor = TEAL;
  ctx.shadowBlur = 50 + p * 100;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  
  // Sacred geometry
  if (p > 0.3) {
    const geoAlpha = Math.min((p - 0.3) * 2, 0.5);
    drawFlowerOfLife(ctx, W/2, H/2, 120, TEAL, geoAlpha);
    drawFlowerOfLife(ctx, W/2, H/2, 200, GOLD, geoAlpha * 0.5);
  }
  
  // Character appears
  if (p > 0.5) {
    const charAlpha = Math.min((p - 0.5) * 3, 1);
    ctx.globalAlpha = charAlpha;
    drawAlchemist(ctx, W/2, H/2 + 50, 1.2, p > 0.6 ? (p - 0.6) * 5 : 0);
    ctx.globalAlpha = 1;
  }
  
  // Zodiac ring
  if (p > 0.7) {
    ctx.globalAlpha = Math.min((p - 0.7) * 4, 0.5);
    drawZodiacRing(ctx, W/2, H/2, 400, t * 0.1, GOLD);
    ctx.globalAlpha = 1;
  }
}

function renderScene2(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 5) / 7, 1);
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  // Character in center
  if (p > 0.2) {
    ctx.globalAlpha = Math.min((p - 0.2) * 3, 1);
    drawAlchemist(ctx, W/2, H/2 + 100, 1.0, 1);
    ctx.globalAlpha = 1;
  }
  
  // Left: Natal chart
  if (p > 0.1) {
    ctx.globalAlpha = Math.min((p - 0.1) * 3, 1);
    const chartX = 200;
    const chartY = H/2 - 100;
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(chartX, chartY, 180, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(chartX, chartY, 140, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(chartX, chartY, 100, 0, Math.PI * 2); ctx.stroke();
    
    // Planets as assets
    const planets = [
      { angle: 0, label: '☉', name: 'BTC' },
      { angle: 60, label: '☽', name: 'GOLD' },
      { angle: 120, label: '☿', name: 'AAPL' },
      { angle: 180, label: '♀', name: 'LUX' },
      { angle: 240, label: '♂', name: 'OIL' },
      { angle: 300, label: '♃', name: 'ETH' },
    ];
    planets.forEach((planet, i) => {
      if (p > 0.3 + i * 0.1) {
        const a = (planet.angle * Math.PI) / 180;
        const px = chartX + 140 * Math.cos(a);
        const py = chartY + 140 * Math.sin(a);
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,213,0.1)';
        ctx.fill();
        ctx.strokeStyle = TEAL;
        ctx.stroke();
        ctx.font = '22px serif';
        ctx.fillStyle = GOLD;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(planet.label, px, py);
        ctx.font = '12px Orbitron, monospace';
        ctx.fillStyle = TEAL;
        ctx.fillText(planet.name, px, py + 28);
      }
    });
    ctx.globalAlpha = 1;
  }
  
  // Right: Trading chart
  if (p > 0.3) {
    ctx.globalAlpha = Math.min((p - 0.3) * 3, 1);
    const chartLeft = W - 450;
    const chartTop = H/2 - 300;
    
    // Fibonacci levels
    const fibs = [
      { y: chartTop + 80, label: '4.236' },
      { y: chartTop + 180, label: '2.618' },
      { y: chartTop + 280, label: '1.618' },
      { y: chartTop + 380, label: '1.000' },
      { y: chartTop + 460, label: '0.618' },
    ];
    fibs.forEach(fib => {
      ctx.strokeStyle = GOLD;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, fib.y);
      ctx.lineTo(chartLeft + 350, fib.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '14px Orbitron, monospace';
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = 0.6;
      ctx.textAlign = 'left';
      ctx.fillText(fib.label, chartLeft + 360, fib.y + 5);
    });
    ctx.globalAlpha = Math.min((p - 0.3) * 3, 1);
    
    // Candles
    const candles = [
      { x: chartLeft + 30, o: 350, c: 300, h: 280, l: 370, bull: false },
      { x: chartLeft + 70, o: 300, c: 320, h: 280, l: 340, bull: true },
      { x: chartLeft + 110, o: 320, c: 280, h: 260, l: 340, bull: false },
      { x: chartLeft + 150, o: 280, c: 250, h: 230, l: 300, bull: false },
      { x: chartLeft + 190, o: 250, c: 280, h: 230, l: 300, bull: true },
      { x: chartLeft + 230, o: 280, c: 240, h: 220, l: 300, bull: false },
      { x: chartLeft + 270, o: 240, c: 270, h: 220, l: 290, bull: true },
    ];
    candles.forEach((c, i) => {
      if (p > 0.4 + i * 0.07) {
        drawCandle(ctx, c.x, c.o, c.c, c.h, c.l, c.bull);
      }
    });
    ctx.globalAlpha = 1;
  }
}

function renderScene3(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 12) / 8, 1);
  const transformed = p > 0.5;
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  // Sacred geometry bg
  ctx.globalAlpha = 0.15;
  drawFlowerOfLife(ctx, W/2, H/2, 150, PURPLE, 0.15);
  ctx.globalAlpha = 1;
  
  // Fibonacci numbers around
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  ctx.font = '32px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fib.forEach((num, i) => {
    if (p > i * 0.08) {
      const angle = ((i * (360 / fib.length) - 90) * Math.PI) / 180 + t * 0.2;
      const x = W/2 + 350 * Math.cos(angle);
      const y = H/2 + 350 * Math.sin(angle);
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = 0.7;
      ctx.fillText(String(num), x, y);
    }
  });
  ctx.globalAlpha = 1;
  
  // Alchemical circle
  const circleRadius = 150;
  ctx.strokeStyle = transformed ? GOLD : '#666';
  ctx.lineWidth = 4;
  ctx.shadowColor = transformed ? GOLD : 'transparent';
  ctx.shadowBlur = transformed ? 40 : 0;
  ctx.beginPath();
  ctx.arc(W/2, H/2, circleRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Symbol
  ctx.font = `${transformed ? '120' : '100'}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = transformed ? GOLD : '#666';
  if (transformed) {
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 30;
  }
  ctx.fillText(transformed ? '☉' : '☿', W/2, H/2 - 20);
  ctx.shadowBlur = 0;
  
  ctx.font = '24px Orbitron, monospace';
  ctx.fillStyle = transformed ? GOLD : '#666';
  ctx.fillText(transformed ? 'Au — ЗОЛОТО' : 'Pb — СВИНЕЦ', W/2, H/2 + 80);
  
  // Transformation particles
  if (transformed) {
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180 + t * 2;
      const dist = 160 + Math.sin(t * 3 + i) * 30;
      const x = W/2 + dist * Math.cos(angle);
      const y = H/2 + dist * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function renderScene4(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 20) / 8, 1);
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  const signs = [
    { sign: '♈', asset: '₿' }, { sign: '♉', asset: '🥇' },
    { sign: '♊', asset: '💻' }, { sign: '♋', asset: '🏠' },
    { sign: '♌', asset: '💎' }, { sign: '♍', asset: '📊' },
    { sign: '♎', asset: '⚖️' }, { sign: '♏', asset: '🔮' },
    { sign: '♐', asset: '🌍' }, { sign: '♑', asset: '🏢' },
    { sign: '♒', asset: '🚀' }, { sign: '♓', asset: '🎨' },
  ];
  
  const activeIdx = Math.floor(p * 12) % 12;
  const cx = W/2, cy = H/2;
  const radius = 380;
  
  // Outer ring
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  signs.forEach((z, i) => {
    if (p > i * 0.07) {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const isActive = i === activeIdx && p > 0.1;
      
      ctx.beginPath();
      ctx.arc(x, y, isActive ? 50 : 40, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? 'rgba(255,215,0,0.15)' : 'rgba(10,10,10,0.8)';
      ctx.fill();
      ctx.strokeStyle = isActive ? GOLD : TEAL;
      ctx.lineWidth = isActive ? 3 : 1;
      ctx.globalAlpha = isActive ? 1 : 0.5;
      ctx.stroke();
      
      if (isActive) {
        ctx.shadowColor = GOLD;
        ctx.shadowBlur = 20;
      }
      
      ctx.font = '32px serif';
      ctx.fillStyle = isActive ? GOLD : '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.sign, x, y - 5);
      ctx.font = '18px serif';
      ctx.fillText(z.asset, x, y + 20);
      ctx.shadowBlur = 0;
    }
  });
  ctx.globalAlpha = 1;
  
  // Center
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.font = '20px Orbitron, monospace';
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.fillText('ТВОЙ', cx, cy - 12);
  ctx.fillText('ПОРТФЕЛЬ', cx, cy + 16);
}

function renderScene5(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 28) / 10, 1);
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  const dateStr = '15.04.1998';
  const steps = ['1+5+0+4+1+9+9+8', '= 37', '3+7 = 10', '1+0 = 1'];
  const currentStep = Math.floor(p * 5);
  
  // Date
  if (p > 0.1) {
    ctx.font = 'bold 80px Orbitron, monospace';
    ctx.fillStyle = TEAL;
    ctx.textAlign = 'center';
    ctx.shadowColor = TEAL;
    ctx.shadowBlur = 15;
    let displayDate = '';
    dateStr.split('').forEach((ch, i) => {
      if (p > 0.1 + i * 0.02) displayDate += ch;
    });
    ctx.fillText(displayDate, W/2, H/2 - 300);
    ctx.shadowBlur = 0;
  }
  
  // Steps
  ctx.font = '36px monospace';
  steps.forEach((step, i) => {
    if (currentStep > i) {
      ctx.fillStyle = '#ccc';
      ctx.textAlign = 'center';
      ctx.fillText(step, W/2, H/2 - 150 + i * 70);
    }
  });
  
  // Final number
  if (p > 0.7) {
    const numAlpha = Math.min((p - 0.7) * 4, 1);
    ctx.globalAlpha = numAlpha;
    
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(W/2, H/2 + 250, 80, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.font = 'bold 90px Orbitron, monospace';
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1', W/2, H/2 + 250);
    ctx.shadowBlur = 0;
    
    ctx.font = '24px Orbitron, monospace';
    ctx.fillText('ЛИДЕР • НОВЫЕ НАЧИНАНИЯ • РИСК', W/2, H/2 + 380);
    ctx.globalAlpha = 1;
    
    // Sacred geometry around
    drawFlowerOfLife(ctx, W/2, H/2 + 250, 120, GOLD, 0.2);
  }
}

function renderScene6(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 38) / 10, 1);
  const synced = p > 0.6;
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  const cx = W/2, cy = H/2;
  const speed = synced ? 0.1 : 1;
  
  // Outer ring - Zodiac
  drawZodiacRing(ctx, cx, cy, 420, t * 0.15 * speed, PURPLE);
  
  // Middle ring - Numbers
  const numbers = ['1','2','3','4','5','6','7','8','9'];
  ctx.font = '32px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, 280, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  numbers.forEach((n, i) => {
    const angle = ((i * 40 - 90) * Math.PI) / 180 + t * 0.25 * speed;
    const x = cx + 270 * Math.cos(angle);
    const y = cy + 270 * Math.sin(angle);
    ctx.fillStyle = TEAL;
    ctx.globalAlpha = 0.8;
    ctx.fillText(n, x, y);
  });
  ctx.globalAlpha = 1;
  
  // Inner ring - Finance
  const candles = ['▮','▯','▮','▯','▮','▮','▯','▮'];
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, 160, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.font = '28px serif';
  candles.forEach((c, i) => {
    const angle = ((i * 45 - 90) * Math.PI) / 180 + t * 0.4 * speed;
    const x = cx + 155 * Math.cos(angle);
    const y = cy + 155 * Math.sin(angle);
    ctx.fillStyle = GOLD;
    ctx.globalAlpha = 0.8;
    ctx.fillText(c, x, y);
  });
  ctx.globalAlpha = 1;
  
  // Center infinity
  drawInfinityLogo(ctx, cx, cy, synced ? 2.5 : 2, synced ? Math.sin(t * 3) * 0.5 + 0.5 : 0);
  
  if (synced) {
    ctx.globalAlpha = 0.05 + Math.sin(t * 4) * 0.03;
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(cx, cy, 450, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function renderScene7(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 48) / 7, 1);
  drawBackground(ctx);
  drawParticles(ctx, t);
  
  // Character
  if (p > 0.1) {
    ctx.globalAlpha = Math.min((p - 0.1) * 3, 1);
    drawAlchemist(ctx, W/2, H/2 - 200, 1.3, 1);
    ctx.globalAlpha = 1;
  }
  
  // Holographic messages
  if (p > 0.3) {
    ctx.globalAlpha = Math.min((p - 0.3) * 3, 1);
    // Message 1
    ctx.fillStyle = 'rgba(0,255,213,0.05)';
    ctx.strokeStyle = 'rgba(0,255,213,0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, W/2 - 300, H/2 + 200, 600, 100, 16);
    ctx.fill();
    ctx.stroke();
    ctx.font = '18px Orbitron, monospace';
    ctx.fillStyle = TEAL;
    ctx.textAlign = 'center';
    ctx.fillText('СЛЕДУЮЩЕЕ ВИДЕО:', W/2, H/2 + 240);
    ctx.font = '28px Montserrat, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('РАСЧЁТ ТВОЕГО ЧИСЛА СУДЬБЫ', W/2, H/2 + 275);
  }
  
  if (p > 0.5) {
    ctx.globalAlpha = Math.min((p - 0.5) * 3, 1);
    ctx.fillStyle = 'rgba(255,215,0,0.05)';
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, W/2 - 300, H/2 + 340, 600, 100, 16);
    ctx.fill();
    ctx.stroke();
    ctx.font = '18px Orbitron, monospace';
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center';
    ctx.fillText('ПОДПИШИСЬ:', W/2, H/2 + 380);
    ctx.font = '28px Montserrat, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('ЧТОБЫ УЗНАТЬ СВОЙ КОД', W/2, H/2 + 415);
  }
  ctx.globalAlpha = 1;
}

function renderScene8(ctx: CanvasRenderingContext2D, t: number) {
  const p = Math.min((t - 55) / 5, 1);
  drawBackground(ctx);
  
  // Glitch effect
  const glitching = p > 0.7 && p < 0.85;
  if (glitching) {
    ctx.save();
    ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
  }
  
  // Logo
  if (p > 0.1) {
    ctx.globalAlpha = Math.min((p - 0.1) * 3, 1);
    drawInfinityLogo(ctx, W/2, H/2 - 100, 3, Math.sin(t * 3) * 0.5 + 0.5);
  }
  
  // Channel name
  if (p > 0.2) {
    ctx.globalAlpha = Math.min((p - 0.2) * 3, 1);
    ctx.font = 'bold 72px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = TEAL;
    ctx.shadowBlur = 15;
    ctx.fillStyle = TEAL;
    ctx.fillText('CYBER', W/2 - 100, H/2 + 80);
    ctx.shadowColor = GOLD;
    ctx.fillStyle = GOLD;
    ctx.fillText('ALCHEMY', W/2 + 120, H/2 + 80);
    ctx.shadowBlur = 0;
    
    ctx.font = '24px Montserrat, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('ДРЕВНЯЯ МУДРОСТЬ • СОВРЕМЕННЫЕ ДЕНЬГИ', W/2, H/2 + 140);
  }
  ctx.globalAlpha = 1;
  
  if (glitching) ctx.restore();
  
  // Fade to black at end
  if (p > 0.85) {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = (p - 0.85) * 6.67;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

// ============ MAIN RENDER FUNCTION ============

const scenes = [
  { id: 1, name: 'ПРОБУЖДЕНИЕ', start: 0, end: 5, subtitle: 'ДРЕВНЯЯ МУДРОСТЬ ВСТРЕЧАЕТ СОВРЕМЕННЫЕ ДЕНЬГИ', render: renderScene1 },
  { id: 2, name: 'ИНТЕРФЕЙС', start: 5, end: 12, subtitle: 'ТВОЯ НАТАЛЬНАЯ КАРТА = ТВОЙ ФИНАНСОВЫЙ КОД', render: renderScene2 },
  { id: 3, name: 'ТРАНСФОРМАЦИЯ', start: 12, end: 20, subtitle: 'АЛХИМИЯ ДЕНЕГ: ТРАНСФОРМИРУЙ ПАССИВЫ В АКТИВЫ', render: renderScene3 },
  { id: 4, name: 'ЗОДИАК КАК ПОРТФЕЛЬ', start: 20, end: 28, subtitle: 'ТВОЙ ЗОДИАК ПОДСКАЖЕТ, КУДА ИНВЕСТИРОВАТЬ', render: renderScene4 },
  { id: 5, name: 'ЧИСЛО СУДЬБЫ', start: 28, end: 38, subtitle: 'ТВОЁ ЧИСЛО СУДЬБЫ = ТВОЯ ФИНАНСОВАЯ СТРАТЕГИЯ', render: renderScene5 },
  { id: 6, name: 'СИНХРОНИЗАЦИЯ', start: 38, end: 48, subtitle: 'СИНХРОНИЗИРУЙ ВСЕЛЕННУЮ, РЫНОК И СЕБЯ', render: renderScene6 },
  { id: 7, name: 'ПРИЗЫВ', start: 48, end: 55, subtitle: 'УЗНАЙ СВОЙ АСТРАЛЬНО-ФИНАНСОВЫЙ КОД', render: renderScene7 },
  { id: 8, name: 'ЛОГОТИП', start: 55, end: 60, subtitle: 'CYBER ALCHEMY', render: renderScene8 },
];

export function renderFrame(ctx: CanvasRenderingContext2D, time: number) {
  const scene = scenes.find(s => time >= s.start && time < s.end) || scenes[scenes.length - 1];
  scene.render(ctx, time);
  
  // HUD
  drawSceneIndicator(ctx, scene.id, scene.name);
  drawTimeCode(ctx, time);
  
  // Subtitle
  const sceneProgress = (time - scene.start) / (scene.end - scene.start);
  drawSubtitle(ctx, scene.subtitle, sceneProgress);
}

export { W, H };
