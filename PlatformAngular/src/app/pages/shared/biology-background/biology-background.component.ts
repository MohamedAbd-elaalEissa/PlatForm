// biology-background.component.ts
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-biology-background',
  imports: [],
  templateUrl: './biology-background.component.html',
  styleUrl: './biology-background.component.scss'
})
export class BiologyBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('biologyCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId?: number;
  private cells: Cell[] = [];
  private dnaHelixes: DNAHelix[] = [];
  private organelles: Organelle[] = [];
  private pulseWaves: PulseWave[] = [];
  private lastWaveTime = 0;
  private ctx!: CanvasRenderingContext2D;
  private isDarkMode = true;

  ngOnInit() {
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
    // Create cells
    for (let i = 0; i < 12; i++) {
      this.cells.push(new Cell(this.canvasRef.nativeElement, this.isDarkMode));
    }
    
    // Create DNA helixes
    for (let i = 0; i < 6; i++) {
      this.dnaHelixes.push(new DNAHelix(this.canvasRef.nativeElement, this.isDarkMode));
    }

    // Create organelles
    for (let i = 0; i < 25; i++) {
      this.organelles.push(new Organelle(this.canvasRef.nativeElement, this.isDarkMode));
    }
  }

  private startAnimation() {
    const animate = (currentTime: number) => {
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
    this.cells.forEach(cell => cell.updateTheme(this.isDarkMode));
    this.dnaHelixes.forEach(dna => dna.updateTheme(this.isDarkMode));
    this.organelles.forEach(organelle => organelle.updateTheme(this.isDarkMode));
  }

  private clearCanvas() {
    if (this.isDarkMode) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    } else {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    }
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  private updateAndDrawElements(currentTime: number) {
    // Create pulse waves periodically
    if (currentTime - this.lastWaveTime > 3000) {
      this.pulseWaves.push(new PulseWave(this.canvasRef.nativeElement, this.isDarkMode));
      this.lastWaveTime = currentTime;
    }

    // Update and draw pulse waves
    this.pulseWaves = this.pulseWaves.filter(wave => {
      wave.draw(this.ctx);
      return wave.update();
    });

    // Update and draw organelles first (background layer)
    this.organelles.forEach(organelle => {
      organelle.update();
      organelle.draw(this.ctx);
    });

    // Update and draw cells
    this.cells.forEach(cell => {
      cell.update();
      cell.draw(this.ctx);
    });

    // Update and draw DNA helixes
    this.dnaHelixes.forEach(dna => {
      dna.update();
      dna.draw(this.ctx);
    });

    // Draw connections between organelles
    this.drawConnections();
  }

  private drawConnections() {
    if (this.isDarkMode) {
      this.ctx.strokeStyle = 'rgba(34, 139, 34, 0.15)';
    } else {
      this.ctx.strokeStyle = 'rgba(34, 139, 34, 0.25)';
    }
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.organelles.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, this.organelles.length); j++) {
        const o1 = this.organelles[i];
        const o2 = this.organelles[j];
        const distance = Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2);
        
        if (distance < 80) {
          this.ctx.globalAlpha = (80 - distance) / 80 * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(o1.x, o1.y);
          this.ctx.lineTo(o2.x, o2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }
}

// Cell class representing biological cells
class Cell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  nucleusColor: string;
  pulse: number;
  angle: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;
  organelles: Array<{x: number, y: number, size: number, color: string}>;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 25 + 20;
    this.color = this.getCellColor();
    this.nucleusColor = this.getNucleusColor();
    this.pulse = Math.random() * 0.01 + 0.005;
    this.angle = Math.random() * Math.PI * 2;
    this.organelles = this.generateOrganelles();
  }

  private getCellColor(): string {
    if (this.isDarkMode) {
      const colors = ['#32CD32', '#228B22', '#00FF7F', '#90EE90', '#00FA9A'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#228B22', '#006400', '#32CD32', '#90EE90', '#98FB98'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  private getNucleusColor(): string {
    if (this.isDarkMode) {
      return '#FF6B6B';
    } else {
      return '#DC143C';
    }
  }

  private generateOrganelles() {
    const count = Math.floor(Math.random() * 4) + 2;
    const organelles = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = Math.random() * (this.radius - 8) + 5;
      
      organelles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 3 + 2,
        color: this.isDarkMode ? '#FFD700' : '#FFA500'
      });
    }
    
    return organelles;
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getCellColor();
    this.nucleusColor = this.getNucleusColor();
    this.organelles = this.generateOrganelles();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.pulse;

    // Bounce off edges
    if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) this.vx *= -1;
    if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Cell membrane with glow
    const cellGradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 1.5
    );
    cellGradient.addColorStop(0, this.color + (this.isDarkMode ? '40' : '30'));
    cellGradient.addColorStop(0.7, this.color + (this.isDarkMode ? '20' : '15'));
    cellGradient.addColorStop(1, this.color + '00');
    
    ctx.fillStyle = cellGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Cell body
    ctx.fillStyle = this.color + (this.isDarkMode ? '30' : '25');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Cell membrane outline
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw organelles
    this.organelles.forEach(organelle => {
      ctx.fillStyle = organelle.color;
      ctx.beginPath();
      ctx.arc(
        this.x + organelle.x, 
        this.y + organelle.y, 
        organelle.size, 
        0, Math.PI * 2
      );
      ctx.fill();
    });

    // Nucleus
    const nucleusRadius = this.radius * 0.3;
    const nucleusGradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, nucleusRadius
    );
    nucleusGradient.addColorStop(0, this.nucleusColor);
    nucleusGradient.addColorStop(1, this.nucleusColor + '80');
    
    ctx.fillStyle = nucleusGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, nucleusRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// DNA Helix class
class DNAHelix {
  x: number;
  y: number;
  vx: number;
  vy: number;
  height: number;
  width: number;
  rotation: number;
  rotationSpeed: number;
  color1: string;
  color2: string;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.height = Math.random() * 60 + 40;
    this.width = 15;
    this.rotation = 0;
    this.rotationSpeed = 0.02;
    this.color1 = this.isDarkMode ? '#FF69B4' : '#FF1493';
    this.color2 = this.isDarkMode ? '#87CEEB' : '#4169E1';
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color1 = this.isDarkMode ? '#FF69B4' : '#FF1493';
    this.color2 = this.isDarkMode ? '#87CEEB' : '#4169E1';
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

    const segments = 20;
    
    for (let i = 0; i < segments; i++) {
      const progress = i / segments;
      const y = (progress - 0.5) * this.height;
      const angle1 = progress * Math.PI * 4;
      const angle2 = angle1 + Math.PI;
      
      const x1 = Math.cos(angle1) * this.width;
      const x2 = Math.cos(angle2) * this.width;
      
      // Draw backbone strands
      ctx.strokeStyle = this.color1;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      
      if (i > 0) {
        const prevY = ((i-1) / segments - 0.5) * this.height;
        const prevAngle1 = (i-1) / segments * Math.PI * 4;
        const prevX1 = Math.cos(prevAngle1) * this.width;
        
        ctx.beginPath();
        ctx.moveTo(prevX1, prevY);
        ctx.lineTo(x1, y);
        ctx.stroke();
      }
      
      ctx.strokeStyle = this.color2;
      if (i > 0) {
        const prevY = ((i-1) / segments - 0.5) * this.height;
        const prevAngle2 = ((i-1) / segments * Math.PI * 4) + Math.PI;
        const prevX2 = Math.cos(prevAngle2) * this.width;
        
        ctx.beginPath();
        ctx.moveTo(prevX2, prevY);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
      
      // Draw base pairs
      if (i % 3 === 0) {
        ctx.strokeStyle = this.isDarkMode ? '#FFFFFF80' : '#00000060';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

// Organelle class (mitochondria, chloroplasts, etc.)
class Organelle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: string;
  pulse: number;
  angle: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 4 + 2;
    this.type = this.getRandomType();
    this.color = this.getColorForType();
    this.pulse = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
  }

  private getRandomType(): string {
    const types = ['mitochondria', 'ribosome', 'vesicle', 'protein', 'enzyme'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getColorForType(): string {
    const colorMap = {
      mitochondria: this.isDarkMode ? '#FF4500' : '#FF6347',
      ribosome: this.isDarkMode ? '#9370DB' : '#8A2BE2',
      vesicle: this.isDarkMode ? '#00CED1' : '#20B2AA',
      protein: this.isDarkMode ? '#FFD700' : '#FFA500',
      enzyme: this.isDarkMode ? '#FF69B4' : '#FF1493'
    };
    return colorMap[this.type as keyof typeof colorMap];
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColorForType();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.pulse;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    const pulseFactor = Math.sin(this.angle) * 0.3 + 1;
    const currentRadius = this.radius * pulseFactor;
    
    // Glow effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, currentRadius * 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + (this.isDarkMode ? '60' : '40'));
    gradient.addColorStop(1, this.color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Core organelle
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.isDarkMode ? 0.9 : 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Special shapes for different organelles
    if (this.type === 'mitochondria') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, currentRadius * 1.2, currentRadius * 0.8, this.angle, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

// Pulse Wave class representing biological signals
class PulseWave {
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
    this.maxRadius = Math.random() * 120 + 80;
    this.speed = Math.random() * 1.5 + 0.5;
    this.color = this.isDarkMode ? '#32CD32' : '#228B22';
    this.opacity = 1;
  }

  update(): boolean {
    this.radius += this.speed;
    this.opacity = 1 - (this.radius / this.maxRadius);
    return this.radius < this.maxRadius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity * 0.4;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}