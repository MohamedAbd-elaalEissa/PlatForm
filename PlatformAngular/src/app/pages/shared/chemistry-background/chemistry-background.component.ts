// chemistry-background.component.ts
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chemistry-background',
  imports: [],
  templateUrl: './chemistry-background.component.html',
  styleUrl: './chemistry-background.component.scss'
})
export class ChemistryBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chemistryCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId?: number;
  private particles: Particle[] = [];
  private molecules: Molecule[] = [];
  private energyWaves: EnergyWave[] = [];
  private lastWaveTime = 0;
  private ctx!: CanvasRenderingContext2D;
  private isDarkMode = true; // Track current theme

  ngOnInit() {
    // Component initialization
    this.detectTheme();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.createElements();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }

  private detectTheme() {
    // Check if parent has dark mode class
    this.isDarkMode = document.body.classList.contains('app-dark') || 
                     document.documentElement.classList.contains('app-dark');
  }

  private initializeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  private resizeCanvas = () => {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createElements() {
    // Create floating particles
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.canvasRef.nativeElement, this.isDarkMode));
    }
    
    // Create molecules
    for (let i = 0; i < 8; i++) {
      this.molecules.push(new Molecule(this.canvasRef.nativeElement, this.isDarkMode));
    }
  }

  private startAnimation() {
    const animate = (currentTime: number) => {
      // Check for theme changes
      const newDarkMode = document.body.classList.contains('app-dark') || 
                         document.documentElement.classList.contains('app-dark');
      if (newDarkMode !== this.isDarkMode) {
        this.isDarkMode = newDarkMode;
        this.updateElementsTheme();
      }

      this.clearCanvas();
      this.updateAndDrawElements(currentTime);
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
  }

  private updateElementsTheme() {
    // Update existing particles and molecules for new theme
    this.particles.forEach(particle => particle.updateTheme(this.isDarkMode));
    this.molecules.forEach(molecule => molecule.updateTheme(this.isDarkMode));
  }

  private clearCanvas() {
    // Different background overlay for light/dark mode
    if (this.isDarkMode) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    } else {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    }
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  private updateAndDrawElements(currentTime: number) {
    // Create energy waves periodically
    if (currentTime - this.lastWaveTime > 2000) {
      this.energyWaves.push(new EnergyWave(this.canvasRef.nativeElement, this.isDarkMode));
      this.lastWaveTime = currentTime;
    }

    // Update and draw energy waves
    this.energyWaves = this.energyWaves.filter(wave => {
      wave.draw(this.ctx);
      return wave.update();
    });

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });

    // Update and draw molecules
    this.molecules.forEach(molecule => {
      molecule.update();
      molecule.draw(this.ctx);
    });

    // Draw particle connections
    this.drawConnections();
  }

  private drawConnections() {
    // Different connection colors for light/dark mode
    if (this.isDarkMode) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    } else {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    }
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        
        if (distance < 100) {
          this.ctx.globalAlpha = (100 - distance) / 100 * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }
}

// Particle class with theme support
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: number;
  pulse: number;
  angle: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 3 + 2;
    this.color = this.getRandomColor();
    this.glow = Math.random() * 0.5 + 0.5;
    this.pulse = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
  }

  private getRandomColor(): string {
    if (this.isDarkMode) {
      // Bright colors for dark mode
      const colors = [
        '#00ff88', '#ff0066', '#0088ff', '#ffaa00', 
        '#aa00ff', '#00ffff', '#ff6600', '#66ff00'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // More muted, saturated colors for light mode
      const colors = [
        '#00cc66', '#cc0044', '#0066cc', '#cc8800', 
        '#8800cc', '#00cccc', '#cc4400', '#44cc00'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getRandomColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.pulse;
    this.glow = Math.sin(this.angle) * 0.3 + 0.7;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Create glowing effect with different intensity for light/dark mode
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 3
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.4, this.color + (this.isDarkMode ? '80' : '60'));
    gradient.addColorStop(1, this.color + '00');
    
    ctx.globalCompositeOperation = this.isDarkMode ? 'screen' : 'multiply';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Core atom
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.glow * (this.isDarkMode ? 1 : 0.8);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// Molecule class with theme support
class Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  atoms: Array<{x: number, y: number, color: string, size: number}>;
  scale: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.atoms = this.generateAtoms();
    this.scale = Math.random() * 0.5 + 0.5;
  }

  private generateAtoms() {
    const darkModeColors = {
      primary: '#00ff88',
      secondary: '#ff0066',
      tertiary: '#0088ff',
      quaternary: '#ffaa00',
      quinary: '#00ffff'
    };

    const lightModeColors = {
      primary: '#00cc66',
      secondary: '#cc0044',
      tertiary: '#0066cc',
      quaternary: '#cc8800',
      quinary: '#00cccc'
    };

    const colors = this.isDarkMode ? darkModeColors : lightModeColors;

    const structures = [
      // Benzene ring
      [
        {x: 0, y: -30, color: colors.primary, size: 4},
        {x: 26, y: -15, color: colors.primary, size: 4},
        {x: 26, y: 15, color: colors.primary, size: 4},
        {x: 0, y: 30, color: colors.primary, size: 4},
        {x: -26, y: 15, color: colors.primary, size: 4},
        {x: -26, y: -15, color: colors.primary, size: 4}
      ],
      // Water molecule
      [
        {x: 0, y: 0, color: colors.secondary, size: 6},
        {x: -15, y: 15, color: colors.tertiary, size: 3},
        {x: 15, y: 15, color: colors.tertiary, size: 3}
      ],
      // Linear molecule
      [
        {x: -20, y: 0, color: colors.quaternary, size: 4},
        {x: 0, y: 0, color: colors.quinary, size: 5},
        {x: 20, y: 0, color: colors.quaternary, size: 4}
      ]
    ];
    return structures[Math.floor(Math.random() * structures.length)];
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.atoms = this.generateAtoms();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Wrap around screen
    if (this.x < -50) this.x = this.canvas.width + 50;
    if (this.x > this.canvas.width + 50) this.x = -50;
    if (this.y < -50) this.y = this.canvas.height + 50;
    if (this.y > this.canvas.height + 50) this.y = -50;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Draw bonds with theme-appropriate colors
    if (this.isDarkMode) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < this.atoms.length; i++) {
      const atom = this.atoms[i];
      const nextAtom = this.atoms[(i + 1) % this.atoms.length];
      ctx.moveTo(atom.x, atom.y);
      ctx.lineTo(nextAtom.x, nextAtom.y);
    }
    ctx.stroke();

    // Draw atoms
    this.atoms.forEach(atom => {
      // Glow effect
      const gradient = ctx.createRadialGradient(
        atom.x, atom.y, 0,
        atom.x, atom.y, atom.size * 2
      );
      gradient.addColorStop(0, atom.color);
      gradient.addColorStop(0.5, atom.color + (this.isDarkMode ? '80' : '60'));
      gradient.addColorStop(1, atom.color + '00');
      
      ctx.globalCompositeOperation = this.isDarkMode ? 'screen' : 'multiply';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, atom.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core atom
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = atom.color;
      ctx.globalAlpha = this.isDarkMode ? 1 : 0.8;
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, atom.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}

// Energy Wave class with theme support
class EnergyWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  opacity: number;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 0;
    this.maxRadius = Math.random() * 100 + 50;
    this.speed = Math.random() * 2 + 1;
    this.color = this.getRandomColor();
    this.opacity = 1;
  }

  private getRandomColor(): string {
    if (this.isDarkMode) {
      const colors = ['#00ff88', '#ff0066', '#0088ff', '#ffaa00', '#aa00ff'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#00cc66', '#cc0044', '#0066cc', '#cc8800', '#8800cc'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  update(): boolean {
    this.radius += this.speed;
    this.opacity = 1 - (this.radius / this.maxRadius);
    return this.radius < this.maxRadius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity * (this.isDarkMode ? 0.3 : 0.4);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}