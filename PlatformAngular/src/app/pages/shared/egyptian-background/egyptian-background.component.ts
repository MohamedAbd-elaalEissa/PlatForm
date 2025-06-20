// egyptian-background.component.ts
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-egyptian-background',
  imports: [],
  templateUrl: './egyptian-background.component.html',
  styleUrl: './egyptian-background.component.scss'
})
export class EgyptianBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('egyptianCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId?: number;
  private ctx!: CanvasRenderingContext2D;
  private isDarkMode = true;
  private mouseX = 0;
  private mouseY = 0;
  private time = 0;

  // Egyptian elements
  private hieroglyphFields: HieroglyphField[] = [];
  private sandstorms: Sandstorm[] = [];
  private pyramidEnergy: PyramidEnergy[] = [];
  private scarabSwarms: ScarabSwarm[] = [];
  private nileFflows: NileFlow[] = [];

  ngOnInit() {
    this.detectTheme();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.createEgyptianElements();
    this.setupEventListeners();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  private detectTheme() {
    this.isDarkMode = document.body.classList.contains('app-dark') || 
                     document.documentElement.classList.contains('app-dark');
  }

  private initializeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Enable better rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    this.handleResize();
  }

  private handleResize = () => {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    this.ctx.scale(dpr, dpr);
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private createEgyptianElements() {
    const canvas = this.canvasRef.nativeElement;
    
    // Create hieroglyph fields
    for (let i = 0; i < 3; i++) {
      this.hieroglyphFields.push(new HieroglyphField(canvas, this.isDarkMode));
    }
    
    // Create sandstorms
    for (let i = 0; i < 5; i++) {
      this.sandstorms.push(new Sandstorm(canvas, this.isDarkMode));
    }
    
    // Create pyramid energy
    for (let i = 0; i < 4; i++) {
      this.pyramidEnergy.push(new PyramidEnergy(canvas, this.isDarkMode));
    }
    
    // Create scarab swarms
    for (let i = 0; i < 2; i++) {
      this.scarabSwarms.push(new ScarabSwarm(canvas, this.isDarkMode));
    }
    
    // Create Nile flows
    for (let i = 0; i < 6; i++) {
      this.nileFflows.push(new NileFlow(canvas, this.isDarkMode));
    }
  }

  private startAnimation() {
    const animate = () => {
      // Faster time increment for light mode
      this.time += this.isDarkMode ? 0.016 : 0.024;
      
      // Check for theme changes
      const newDarkMode = document.body.classList.contains('app-dark') || 
                         document.documentElement.classList.contains('app-dark');
      if (newDarkMode !== this.isDarkMode) {
        this.isDarkMode = newDarkMode;
        this.updateElementsTheme();
      }

      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private updateElementsTheme() {
    [...this.hieroglyphFields, ...this.sandstorms, 
     ...this.scarabSwarms, ...this.nileFflows].forEach(element => {
      element.updateTheme(this.isDarkMode);
    });
  }

  private render() {
    const canvas = this.canvasRef.nativeElement;
    
    // Create dynamic background
    this.createDynamicBackground();
    
    // Update and render all elements
    this.hieroglyphFields.forEach(field => {
      field.update(this.time, this.mouseX, this.mouseY);
      field.draw(this.ctx);
    });
    
    this.sandstorms.forEach(storm => {
      storm.update(this.time);
      storm.draw(this.ctx);
    });
    
   
    
    this.scarabSwarms.forEach(swarm => {
      swarm.update(this.time);
      swarm.draw(this.ctx);
    });
    
    // this.nileFflows.forEach(flow => {
    //   flow.update(this.time);
    //   flow.draw(this.ctx);
    // });
    
    // Add mouse interaction effects
    this.drawMouseEffects();
  }

  private createDynamicBackground() {
    const canvas = this.canvasRef.nativeElement;
    const gradient = this.ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    
    if (this.isDarkMode) {
      // Night desert colors
      gradient.addColorStop(0, `rgba(25, 15, 5, ${0.95 + Math.sin(this.time * 0.5) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(40, 25, 10, ${0.9 + Math.sin(this.time * 0.3) * 0.1})`);
      gradient.addColorStop(1, `rgba(15, 10, 5, ${0.98})`);
    } else {
      // Day desert colors
      gradient.addColorStop(0, `rgba(255, 245, 220, ${0.9 + Math.sin(this.time * 0.5) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(245, 225, 180, ${0.85 + Math.sin(this.time * 0.3) * 0.05})`);
      gradient.addColorStop(1, `rgba(235, 210, 160, ${0.95})`);
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private drawMouseEffects() {
    if (this.mouseX === 0 && this.mouseY === 0) return;
    
    // Create golden ripple effect around mouse
    const rippleGradient = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, 100
    );
    
    const rippleColor = this.isDarkMode ? '255, 215, 0' : '218, 165, 32';
    rippleGradient.addColorStop(0, `rgba(${rippleColor}, 0.4)`);
    rippleGradient.addColorStop(0.5, `rgba(${rippleColor}, 0.2)`);
    rippleGradient.addColorStop(1, `rgba(${rippleColor}, 0)`);
    
    this.ctx.fillStyle = rippleGradient;
    this.ctx.fillRect(this.mouseX - 100, this.mouseY - 100, 200, 200);
  }
}

// Hieroglyph Field - Creates floating ancient symbols
class HieroglyphField {
  private symbols: Array<{x: number, y: number, phase: number, symbol: string, size: number}> = [];
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;
  private hieroglyphs = ['𓂀', '𓆣', '𓇯', '𓈖', '𓊃', '𓊪', '𓋹', '𓌻', '𓍢', '𓎡'];

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#FFD700' : '#B8860B';
    
    // Create grid of floating hieroglyphs
    const spacing = 120;
    for (let x = 0; x <= canvas.width; x += spacing) {
      for (let y = 0; y <= canvas.height; y += spacing) {
        this.symbols.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          phase: Math.random() * Math.PI * 2,
          symbol: this.hieroglyphs[Math.floor(Math.random() * this.hieroglyphs.length)],
          size: Math.random() * 20 + 15
        });
      }
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#FFD700' : '#B8860B';
  }

  update(time: number, mouseX: number, mouseY: number) {
    this.symbols.forEach(symbol => {
      symbol.phase += this.isDarkMode ? 0.015 : 0.025;
      
      // Mouse influence - hieroglyphs glow and move toward cursor
      const dx = mouseX - symbol.x;
      const dy = mouseY - symbol.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 200) {
        const influence = (200 - distance) / 200;
        symbol.x += dx * influence * 0.005;
        symbol.y += dy * influence * 0.005;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw connections between nearby symbols
    for (let i = 0; i < this.symbols.length; i++) {
      for (let j = i + 1; j < this.symbols.length; j++) {
        const symbol1 = this.symbols[i];
        const symbol2 = this.symbols[j];
        const distance = Math.sqrt((symbol1.x - symbol2.x) ** 2 + (symbol1.y - symbol2.y) ** 2);
        
        if (distance < 150) {
          const alpha = (150 - distance) / 150 * 0.3;
          const phase = (symbol1.phase + symbol2.phase) / 2;
          const brightness = Math.sin(phase) * 0.3 + 0.7;
          
          ctx.strokeStyle = this.color + Math.floor(alpha * brightness * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(symbol1.x, symbol1.y);
          ctx.lineTo(symbol2.x, symbol2.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw hieroglyphs
    this.symbols.forEach(symbol => {
      const alpha = Math.sin(symbol.phase) * 0.3 + 0.7;
      const scale = Math.sin(symbol.phase * 0.5) * 0.2 + 1;
      
      ctx.save();
      ctx.translate(symbol.x, symbol.y);
      ctx.scale(scale, scale);
      ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillText(symbol.symbol, 0, 0);
      ctx.restore();
    });
    
    ctx.restore();
  }
}

// Sandstorm - Creates swirling sand particle effects
class Sandstorm {
  private x: number;
  private y: number;
  private radius: number = 0;
  private maxRadius: number;
  private speed: number;
  private particles: Array<{angle: number, distance: number, opacity: number}> = [];
  private color: string;
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private baseSpeed: number;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.maxRadius = Math.random() * 180 + 120;
    this.baseSpeed = Math.random() * 1 + 0.3;
    this.speed = this.baseSpeed * (isDarkMode ? 1 : 1.3);
    this.color = isDarkMode ? '#DEB887' : '#CD853F';
    
    // Create sand particles
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * this.maxRadius,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#DEB887' : '#CD853F';
    this.speed = this.baseSpeed * (isDarkMode ? 1 : 1.3);
  }

  update(time: number) {
    this.radius += this.speed;
    if (this.radius > this.maxRadius) {
      this.radius = 0;
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
    }
    
    // Update particle positions
    this.particles.forEach(particle => {
      particle.angle += 0.02;
      particle.distance = Math.min(particle.distance + 0.5, this.maxRadius);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.radius === 0) return;
    
    ctx.save();
    
    // Draw swirling sand particles
    this.particles.forEach(particle => {
      if (particle.distance <= this.radius) {
        const x = this.x + Math.cos(particle.angle) * particle.distance;
        const y = this.y + Math.sin(particle.angle) * particle.distance;
        const alpha = particle.opacity * (1 - particle.distance / this.maxRadius);
        
        ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.restore();
  }
}

// Pyramid Energy - Creates energy beams from pyramid points
class PyramidEnergy {
  private beams: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];
  private pyramidX: number;
  private pyramidY: number;
  private angle: number;
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.pyramidX = Math.random() * canvas.width;
    this.pyramidY = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.color = isDarkMode ? '#00CED1' : '#008B8B';
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#00CED1' : '#008B8B';
  }

  update(time: number, mouseX: number, mouseY: number) {
    // Create new energy beams
    const beamCreationRate = this.isDarkMode ? 0.25 : 0.35;
    if (Math.random() < beamCreationRate) {
      const speed = Math.random() * 2 + 1.5;
      const speedMultiplier = this.isDarkMode ? 1 : 1.3;
      this.beams.push({
        x: this.pyramidX,
        y: this.pyramidY,
        vx: Math.cos(this.angle) * speed * speedMultiplier,
        vy: Math.sin(this.angle) * speed * speedMultiplier,
        life: 1,
        size: Math.random() * 3 + 2
      });
    }

    // Update energy beams
    const lifeDecay = this.isDarkMode ? 0.008 : 0.012;
    this.beams = this.beams.filter(beam => {
      beam.x += beam.vx;
      beam.y += beam.vy;
      beam.life -= lifeDecay;
      
      // Mouse attraction
      const dx = mouseX - beam.x;
      const dy = mouseY - beam.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        const force = (120 - distance) / 120 * 0.08;
        beam.vx += (dx / distance) * force;
        beam.vy += (dy / distance) * force;
      }
      
      return beam.life > 0 && 
             beam.x > -50 && beam.x < this.canvas.width + 50 &&
             beam.y > -50 && beam.y < this.canvas.height + 50;
    });

    this.angle += this.isDarkMode ? 0.003 : 0.005;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Draw pyramid base
    const pyramidSize = 15;
    ctx.fillStyle = this.color + '60';
    ctx.beginPath();
    ctx.moveTo(this.pyramidX, this.pyramidY - pyramidSize);
    ctx.lineTo(this.pyramidX - pyramidSize, this.pyramidY + pyramidSize);
    ctx.lineTo(this.pyramidX + pyramidSize, this.pyramidY + pyramidSize);
    ctx.closePath();
    ctx.fill();
    
    // Draw energy beams
    this.beams.forEach(beam => {
      const alpha = beam.life * 0.8;
      
      // Beam glow
      const gradient = ctx.createRadialGradient(
        beam.x, beam.y, 0,
        beam.x, beam.y, beam.size * 3
      );
      gradient.addColorStop(0, this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, this.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(beam.x, beam.y, beam.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Beam core
      ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(beam.x, beam.y, beam.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
}

// Scarab Swarm - Creates mystical scarab portal effects
class ScarabSwarm {
  private x: number;
  private y: number;
  private rotation: number = 0;
  private pulsePhase: number = 0;
  private scarabs: Array<{angle: number, distance: number, speed: number}> = [];
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    
    // Create scarab formation
    for (let i = 0; i < 8; i++) {
      this.scarabs.push({
        angle: (i / 8) * Math.PI * 2,
        distance: Math.random() * 30 + 20,
        speed: Math.random() * 0.02 + 0.01
      });
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
  }

  update(time: number) {
    this.rotation += this.isDarkMode ? 0.008 : 0.012;
    this.pulsePhase += this.isDarkMode ? 0.04 : 0.06;
    
    // Update scarab positions
    this.scarabs.forEach(scarab => {
      scarab.angle += scarab.speed * (this.isDarkMode ? 1 : 1.5);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.6;
    const scarabColor = this.isDarkMode ? '#32CD32' : '#228B22';
    
    // Draw scarab swarm
    this.scarabs.forEach(scarab => {
      const x = Math.cos(scarab.angle) * scarab.distance * pulse;
      const y = Math.sin(scarab.angle) * scarab.distance * pulse;
      
      ctx.fillStyle = scarabColor + Math.floor(pulse * 200).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.ellipse(x, y, 4, 2, scarab.angle, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Center mystical glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40 * pulse);
    gradient.addColorStop(0, scarabColor + Math.floor(pulse * 80).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, scarabColor + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 40 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// Nile Flow - Creates flowing water-like energy lines
class NileFlow {
  private points: Array<{x: number, y: number, phase: number, width: number}> = [];
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;
  private baseY: number;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#4169E1' : '#1E90FF';
    this.baseY = Math.random() * canvas.height;
    
    // Create flowing river points
    for (let x = -50; x <= canvas.width + 50; x += 25) {
      this.points.push({
        x: x,
        y: this.baseY + (Math.random() - 0.5) * 80,
        phase: Math.random() * Math.PI * 2,
        width: Math.random() * 3 + 2
      });
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#4169E1' : '#1E90FF';
  }

  update(time: number) {
    this.points.forEach(point => {
      point.phase += this.isDarkMode ? 0.025 : 0.035;
      point.y = this.baseY + Math.sin(point.phase) * 40 + Math.sin(point.x * 0.008 + time * 0.5) * 25;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // if (this.points.length < 2) return;
    
    // ctx.save();
    // ctx.strokeStyle = this.color + 'AA';
    // ctx.lineWidth = 3;
    // ctx.lineCap = 'round';
    
    // // Draw flowing Nile
    // ctx.beginPath();
    // ctx.moveTo(this.points[0].x, this.points[0].y);
    
    // for (let i = 1; i < this.points.length - 1; i++) {
    //   const cp1x = (this.points[i].x + this.points[i - 1].x) / 2;
    //   const cp1y = (this.points[i].y + this.points[i - 1].y) / 2;
    //   const cp2x = (this.points[i].x + this.points[i + 1].x) / 2;
    //   const cp2y = (this.points[i].y + this.points[i + 1].y) / 2;
      
    //   ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, cp2x, cp2y);
    // }
    
    // ctx.stroke();
    
    // // Draw water sparkles
    // this.points.forEach((point, i) => {
    //   if (i % 4 === 0) {
    //     const sparkleSize = Math.sin(point.phase) * 1.5 + 2.5;
    //     const alpha = Math.sin(point.phase * 0.8) * 0.4 + 0.6;
        
    //     ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    //     ctx.beginPath();
    //     ctx.arc(point.x, point.y, sparkleSize, 0, Math.PI * 2);
    //     ctx.fill();
    //   }
    // });
    
    // ctx.restore();
  }
}