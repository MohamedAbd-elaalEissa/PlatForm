// physics-background.component.ts
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-physics-background',
  imports: [],
  templateUrl: './physics-background.component.html',
  styleUrl: './physics-background.component.scss'
})
export class PhysicsBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('physicsCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId?: number;
  private ctx!: CanvasRenderingContext2D;
  private isDarkMode = true;
  private mouseX = 0;
  private mouseY = 0;
  private time = 0;

  // Physics elements
  private quantumFields: QuantumField[] = [];
  private energyWaves: EnergyWave[] = [];
  private particleBeams: ParticleBeam[] = [];
  private dimensionalRifts: DimensionalRift[] = [];
  private cosmicStrings: CosmicString[] = [];

  ngOnInit() {
    this.detectTheme();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.createPhysicsElements();
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

  private createPhysicsElements() {
    const canvas = this.canvasRef.nativeElement;
    
    // Create quantum fields
    for (let i = 0; i < 3; i++) {
      this.quantumFields.push(new QuantumField(canvas, this.isDarkMode));
    }
    
    // Create energy waves
    for (let i = 0; i < 5; i++) {
      this.energyWaves.push(new EnergyWave(canvas, this.isDarkMode));
    }
    
    // Create particle beams
    for (let i = 0; i < 4; i++) {
      this.particleBeams.push(new ParticleBeam(canvas, this.isDarkMode));
    }
    
    // Create dimensional rifts
    for (let i = 0; i < 2; i++) {
      this.dimensionalRifts.push(new DimensionalRift(canvas, this.isDarkMode));
    }
    
    // Create cosmic strings
    for (let i = 0; i < 6; i++) {
      this.cosmicStrings.push(new CosmicString(canvas, this.isDarkMode));
    }
  }

  private startAnimation() {
    const animate = () => {
      // Faster time increment for light mode
      this.time += this.isDarkMode ? 0.016 : 0.024; // ~60fps for dark, ~90fps equivalent for light
      
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
    [...this.quantumFields, ...this.energyWaves, ...this.particleBeams, 
     ...this.dimensionalRifts, ...this.cosmicStrings].forEach(element => {
      element.updateTheme(this.isDarkMode);
    });
  }

  private render() {
    const canvas = this.canvasRef.nativeElement;
    
    // Create dynamic background
    this.createDynamicBackground();
    
    // Update and render all elements
    this.quantumFields.forEach(field => {
      field.update(this.time, this.mouseX, this.mouseY);
      field.draw(this.ctx);
    });
    
    this.energyWaves.forEach(wave => {
      wave.update(this.time);
      wave.draw(this.ctx);
    });
    
    this.particleBeams.forEach(beam => {
      beam.update(this.time, this.mouseX, this.mouseY);
      beam.draw(this.ctx);
    });
    
    this.dimensionalRifts.forEach(rift => {
      rift.update(this.time);
      rift.draw(this.ctx);
    });
    
    this.cosmicStrings.forEach(string => {
      string.update(this.time);
      string.draw(this.ctx);
    });
    
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
      gradient.addColorStop(0, `rgba(5, 10, 30, ${0.95 + Math.sin(this.time * 0.5) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(15, 5, 25, ${0.9 + Math.sin(this.time * 0.3) * 0.1})`);
      gradient.addColorStop(1, `rgba(5, 5, 15, ${0.98})`);
    } else {
      gradient.addColorStop(0, `rgba(245, 250, 255, ${0.9 + Math.sin(this.time * 0.5) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(235, 240, 250, ${0.85 + Math.sin(this.time * 0.3) * 0.05})`);
      gradient.addColorStop(1, `rgba(225, 230, 245, ${0.95})`);
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private drawMouseEffects() {
    if (this.mouseX === 0 && this.mouseY === 0) return;
    
    // Create ripple effect around mouse
    const rippleGradient = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, 100
    );
    
    const rippleColor = this.isDarkMode ? '100, 200, 255' : '50, 150, 255';
    rippleGradient.addColorStop(0, `rgba(${rippleColor}, 0.3)`);
    rippleGradient.addColorStop(0.5, `rgba(${rippleColor}, 0.1)`);
    rippleGradient.addColorStop(1, `rgba(${rippleColor}, 0)`);
    
    this.ctx.fillStyle = rippleGradient;
    this.ctx.fillRect(this.mouseX - 100, this.mouseY - 100, 200, 200);
  }
}

// Quantum Field - Creates flowing energy patterns
class QuantumField {
  private nodes: Array<{x: number, y: number, phase: number}> = [];
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#00ff88' : '#008844';
    
    // Create grid of nodes
    const spacing = 80;
    for (let x = 0; x <= canvas.width; x += spacing) {
      for (let y = 0; y <= canvas.height; y += spacing) {
        this.nodes.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#00ff88' : '#008844';
  }

  update(time: number, mouseX: number, mouseY: number) {
    this.nodes.forEach(node => {
      // Faster phase increment for light mode
      node.phase += this.isDarkMode ? 0.02 : 0.03;
      
      // Mouse influence
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        const influence = (150 - distance) / 150;
        node.x += dx * influence * 0.01;
        node.y += dy * influence * 0.01;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen'; // Use screen mode for both dark and light
    
    // Draw connections between nearby nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const node1 = this.nodes[i];
        const node2 = this.nodes[j];
        const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
        
        if (distance < 120) {
          const alpha = (120 - distance) / 120 * 0.5;
          const phase = (node1.phase + node2.phase) / 2;
          const brightness = Math.sin(phase) * 0.5 + 0.5;
          
          ctx.strokeStyle = this.color + Math.floor(alpha * brightness * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1 + brightness;
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw nodes
    this.nodes.forEach(node => {
      const size = 2 + Math.sin(node.phase) * 1.5;
      const alpha = Math.sin(node.phase * 0.7) * 0.3 + 0.7;
      
      ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
}

// Energy Wave - Creates expanding wave patterns
class EnergyWave {
  private x: number;
  private y: number;
  private radius: number = 0;
  private maxRadius: number;
  private speed: number;
  private frequency: number;
  private color: string;
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private baseSpeed: number;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.maxRadius = Math.random() * 200 + 150;
    this.baseSpeed = Math.random() * 1.5 + 0.5;
    this.speed = this.baseSpeed * (isDarkMode ? 1 : 1.5); // 1.5x speed for light mode
    this.frequency = Math.random() * 0.05 + 0.02;
    this.color = isDarkMode ? '#ff6600' : '#cc3300';
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#ff6600' : '#cc3300';
    this.speed = this.baseSpeed * (isDarkMode ? 1 : 1.5); // Adjust speed based on theme
  }

  update(time: number) {
    this.radius += this.speed;
    if (this.radius > this.maxRadius) {
      this.radius = 0;
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.radius === 0) return;
    
    ctx.save();
    const alpha = (this.maxRadius - this.radius) / this.maxRadius;
    
    // Draw multiple wave rings
    for (let i = 0; i < 3; i++) {
      const waveRadius = this.radius - i * 15;
      if (waveRadius > 0) {
        ctx.strokeStyle = this.color + Math.floor(alpha * (0.6 - i * 0.15) * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 3 - i;
        ctx.beginPath();
        ctx.arc(this.x, this.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
}

// Particle Beam - Creates flowing particle streams
class ParticleBeam {
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = [];
  private startX: number;
  private startY: number;
  private angle: number;
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.startX = Math.random() * canvas.width;
    this.startY = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.color = isDarkMode ? '#00ccff' : '#0088cc';
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#00ccff' : '#0088cc';
  }

  update(time: number, mouseX: number, mouseY: number) {
    // Create new particles - higher probability for light mode
    const particleCreationRate = this.isDarkMode ? 0.3 : 0.45;
    if (Math.random() < particleCreationRate) {
      const speed = Math.random() * 3 + 2;
      const speedMultiplier = this.isDarkMode ? 1 : 1.4; // Faster particles in light mode
      this.particles.push({
        x: this.startX,
        y: this.startY,
        vx: Math.cos(this.angle) * speed * speedMultiplier,
        vy: Math.sin(this.angle) * speed * speedMultiplier,
        life: 1
      });
    }

    // Update particles
    const lifeDecay = this.isDarkMode ? 0.01 : 0.012; // Faster decay in light mode for more dynamic effect
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= lifeDecay;
      
      // Mouse attraction
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const force = (100 - distance) / 100 * 0.1;
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
      }
      
      return particle.life > 0 && 
             particle.x > -50 && particle.x < this.canvas.width + 50 &&
             particle.y > -50 && particle.y < this.canvas.height + 50;
    });

    // Faster rotation for light mode
    this.angle += this.isDarkMode ? 0.005 : 0.008;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    this.particles.forEach(particle => {
      const size = particle.life * 3;
      const alpha = particle.life * 0.8;
      
      // Particle glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, size * 2
      );
      gradient.addColorStop(0, this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, this.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Particle core
      ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
}

// Dimensional Rift - Creates portal-like effects
class DimensionalRift {
  private x: number;
  private y: number;
  private rotation: number = 0;
  private pulsePhase: number = 0;
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
  }

  update(time: number) {
    // Faster rotation and pulsing for light mode
    this.rotation += this.isDarkMode ? 0.01 : 0.015;
    this.pulsePhase += this.isDarkMode ? 0.05 : 0.075;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    const size = 30 * pulse;
    
    // Create spiral effect
    const spiralColor = this.isDarkMode ? '#ff00ff' : '#cc00cc';
    ctx.strokeStyle = spiralColor + Math.floor(pulse * 128).toString(16).padStart(2, '0');
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const radius = size * (i + 1) / 5;
      const startAngle = i * Math.PI / 5;
      ctx.arc(0, 0, radius, startAngle, startAngle + Math.PI);
      ctx.stroke();
    }
    
    // Center glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, spiralColor + Math.floor(pulse * 100).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, spiralColor + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// Cosmic String - Creates flowing energy lines
class CosmicString {
  private points: Array<{x: number, y: number, phase: number}> = [];
  private canvas: HTMLCanvasElement;
  private isDarkMode: boolean;
  private color: string;
  private baseY: number;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#ffff00' : '#cccc00';
    this.baseY = Math.random() * canvas.height;
    
    // Create string points
    for (let x = -50; x <= canvas.width + 50; x += 20) {
      this.points.push({
        x: x,
        y: this.baseY + (Math.random() - 0.5) * 100,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = isDarkMode ? '#ffff00' : '#cccc00';
  }

  update(time: number) {
    this.points.forEach(point => {
      // Faster phase increment for light mode
      point.phase += this.isDarkMode ? 0.03 : 0.045;
      point.y = this.baseY + Math.sin(point.phase) * 50 + Math.sin(point.x * 0.01 + time) * 20;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;
    
    ctx.save();
    ctx.strokeStyle = this.color + '80';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Draw smooth curve through points
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 1; i < this.points.length - 1; i++) {
      const cp1x = (this.points[i].x + this.points[i - 1].x) / 2;
      const cp1y = (this.points[i].y + this.points[i - 1].y) / 2;
      const cp2x = (this.points[i].x + this.points[i + 1].x) / 2;
      const cp2y = (this.points[i].y + this.points[i + 1].y) / 2;
      
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, cp2x, cp2y);
    }
    
    ctx.stroke();
    
    // Draw energy particles along the string
    this.points.forEach((point, i) => {
      if (i % 3 === 0) {
        const size = Math.sin(point.phase) * 2 + 3;
        const alpha = Math.sin(point.phase * 0.7) * 0.5 + 0.5;
        
        ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.restore();
  }
}