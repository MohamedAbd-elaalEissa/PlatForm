// math-background.component.ts
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-math-background',
  imports: [],
  templateUrl: './math-background.component.html',
  styleUrl: './math-background.component.scss'
})
export class MathBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mathCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private animationId?: number;
  private equations: Equation[] = [];
  private geometricShapes: GeometricShape[] = [];
  private mathSymbols: MathSymbol[] = [];
  private graphs: Graph[] = [];
  private numberParticles: NumberParticle[] = [];
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
    // Create floating equations
    for (let i = 0; i < 8; i++) {
      this.equations.push(new Equation(this.canvasRef.nativeElement, this.isDarkMode));
    }
    
    // Create geometric shapes
    for (let i = 0; i < 12; i++) {
      this.geometricShapes.push(new GeometricShape(this.canvasRef.nativeElement, this.isDarkMode));
    }

    // Create math symbols
    for (let i = 0; i < 20; i++) {
      this.mathSymbols.push(new MathSymbol(this.canvasRef.nativeElement, this.isDarkMode));
    }

    // Create graphs
    for (let i = 0; i < 4; i++) {
      this.graphs.push(new Graph(this.canvasRef.nativeElement, this.isDarkMode));
    }

    // Create number particles
    for (let i = 0; i < 15; i++) {
      this.numberParticles.push(new NumberParticle(this.canvasRef.nativeElement, this.isDarkMode));
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
    this.equations.forEach(eq => eq.updateTheme(this.isDarkMode));
    this.geometricShapes.forEach(shape => shape.updateTheme(this.isDarkMode));
    this.mathSymbols.forEach(symbol => symbol.updateTheme(this.isDarkMode));
    this.graphs.forEach(graph => graph.updateTheme(this.isDarkMode));
    this.numberParticles.forEach(particle => particle.updateTheme(this.isDarkMode));
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
    // Update and draw graphs (background layer)
    this.graphs.forEach(graph => {
      graph.update();
      graph.draw(this.ctx);
    });

    // Update and draw geometric shapes
    this.geometricShapes.forEach(shape => {
      shape.update();
      shape.draw(this.ctx);
    });

    // Update and draw math symbols
    this.mathSymbols.forEach(symbol => {
      symbol.update();
      symbol.draw(this.ctx);
    });

    // Update and draw number particles
    this.numberParticles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });

    // Update and draw equations (foreground layer)
    this.equations.forEach(equation => {
      equation.update();
      equation.draw(this.ctx);
    });

    // Draw connections between math symbols
    this.drawConnections();
  }

  private drawConnections() {
    if (this.isDarkMode) {
      this.ctx.strokeStyle = 'rgba(100, 149, 237, 0.2)';
    } else {
      this.ctx.strokeStyle = 'rgba(70, 130, 180, 0.3)';
    }
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.mathSymbols.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, this.mathSymbols.length); j++) {
        const s1 = this.mathSymbols[i];
        const s2 = this.mathSymbols[j];
        const distance = Math.sqrt((s1.x - s2.x) ** 2 + (s1.y - s2.y) ** 2);
        
        if (distance < 120) {
          this.ctx.globalAlpha = (120 - distance) / 120 * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(s1.x, s1.y);
          this.ctx.lineTo(s2.x, s2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }
}

// Equation class for floating mathematical equations
class Equation {
  x: number;
  y: number;
  vx: number;
  vy: number;
  equation: string;
  color: string;
  fontSize: number;
  alpha: number;
  fadeDirection: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.equation = this.getRandomEquation();
    this.color = this.getColor();
    this.fontSize = Math.random() * 8 + 12;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
  }

  private getRandomEquations(): string[] {
    return [
      'x² + y² = r²',
      'E = mc²',
      'a² + b² = c²',
      'f(x) = ax + b',
      'sin²x + cos²x = 1',
      'e^(iπ) + 1 = 0',
      'y = mx + c',
      '∫f(x)dx',
      'lim x→∞',
      'Σ(n=1 to ∞)',
      'dy/dx = f\'(x)',
      'log₂(8) = 3',
      'π ≈ 3.14159',
      '√(a² + b²)',
      'n! = n×(n-1)!',
      'P(A∩B) = P(A)×P(B)',
      'ax² + bx + c = 0',
      'tan(x) = sin(x)/cos(x)'
    ];
  }

  private getRandomEquation(): string {
    const equations = this.getRandomEquations();
    return equations[Math.floor(Math.random() * equations.length)];
  }

  private getColor(): string {
    if (this.isDarkMode) {
      const colors = ['#4169E1', '#FF6347', '#32CD32', '#FFD700', '#9370DB', '#00CED1'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#1E90FF', '#DC143C', '#228B22', '#FF8C00', '#8A2BE2', '#20B2AA'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha += this.fadeDirection * 0.005;
    
    if (this.alpha > 0.8) this.fadeDirection = -1;
    if (this.alpha < 0.3) this.fadeDirection = 1;

    // Wrap around screen
    if (this.x < -100) this.x = this.canvas.width + 100;
    if (this.x > this.canvas.width + 100) this.x = -100;
    if (this.y < -50) this.y = this.canvas.height + 50;
    if (this.y > this.canvas.height + 50) this.y = -50;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px 'Times New Roman', serif`;
    ctx.textAlign = 'center';
    
    // Add subtle glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isDarkMode ? 8 : 4;
    
    ctx.fillText(this.equation, this.x, this.y);
    ctx.restore();
  }
}

// Geometric Shape class
class GeometricShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shapeType: string;
  color: string;
  strokeWidth: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 30 + 15;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.shapeType = this.getRandomShape();
    this.color = this.getColor();
    this.strokeWidth = Math.random() * 2 + 1;
  }

  private getRandomShape(): string {
    const shapes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'star'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  private getColor(): string {
    if (this.isDarkMode) {
      const colors = ['#FF69B4', '#87CEEB', '#DDA0DD', '#98FB98', '#F0E68C', '#FFA07A'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#FF1493', '#4169E1', '#9370DB', '#32CD32', '#DAA520', '#FF6347'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Bounce off edges
    if (this.x - this.size < 0 || this.x + this.size > this.canvas.width) this.vx *= -1;
    if (this.y - this.size < 0 || this.y + this.size > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.strokeWidth;
    ctx.globalAlpha = 0.6;

    switch (this.shapeType) {
      case 'triangle':
        this.drawTriangle(ctx);
        break;
      case 'square':
        this.drawSquare(ctx);
        break;
      case 'pentagon':
        this.drawPolygon(ctx, 5);
        break;
      case 'hexagon':
        this.drawPolygon(ctx, 6);
        break;
      case 'circle':
        this.drawCircle(ctx);
        break;
      case 'star':
        this.drawStar(ctx);
        break;
    }

    ctx.restore();
  }

  private drawTriangle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(-this.size * 0.866, this.size * 0.5);
    ctx.lineTo(this.size * 0.866, this.size * 0.5);
    ctx.closePath();
    ctx.stroke();
  }

  private drawSquare(ctx: CanvasRenderingContext2D) {
    ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
  }

  private drawPolygon(ctx: CanvasRenderingContext2D, sides: number) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = Math.cos(angle) * this.size;
      const y = Math.sin(angle) * this.size;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  private drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.stroke();
  }

  private drawStar(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? this.size : this.size / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
}

// Math Symbol class
class MathSymbol {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  color: string;
  fontSize: number;
  rotation: number;
  rotationSpeed: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.symbol = this.getRandomSymbol();
    this.color = this.getColor();
    this.fontSize = Math.random() * 12 + 16;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
  }

  private getRandomSymbol(): string {
    const symbols = ['∑', '∫', '∞', 'π', 'φ', 'θ', 'α', 'β', 'γ', 'δ', 'λ', 'μ', '∂', '∇', '±', '≈', '≠', '≥', '≤', '√', '∛', '∆', 'Ω'];
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  private getColor(): string {
    if (this.isDarkMode) {
      const colors = ['#FFD700', '#FF69B4', '#00CED1', '#9370DB', '#32CD32', '#FF6347'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#FF8C00', '#DC143C', '#20B2AA', '#8A2BE2', '#228B22', '#B22222'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px 'Times New Roman', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.7;
    
    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isDarkMode ? 6 : 3;
    
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

// Graph class for mathematical function graphs
class Graph {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  functionType: string;
  color: string;
  phase: number;
  phaseSpeed: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.width = Math.random() * 100 + 80;
    this.height = Math.random() * 60 + 40;
    this.functionType = this.getRandomFunction();
    this.color = this.getColor();
    this.phase = 0;
    this.phaseSpeed = Math.random() * 0.02 + 0.01;
  }

  private getRandomFunction(): string {
    const functions = ['sine', 'cosine', 'parabola', 'exponential', 'logarithmic'];
    return functions[Math.floor(Math.random() * functions.length)];
  }

  private getColor(): string {
    if (this.isDarkMode) {
      const colors = ['#4169E1', '#FF6347', '#32CD32', '#FFD700', '#9370DB'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#1E90FF', '#DC143C', '#228B22', '#FF8C00', '#8A2BE2'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += this.phaseSpeed;

    // Wrap around screen
    if (this.x < -this.width) this.x = this.canvas.width + this.width;
    if (this.x > this.canvas.width + this.width) this.x = -this.width;
    if (this.y < -this.height) this.y = this.canvas.height + this.height;
    if (this.y > this.canvas.height + this.height) this.y = -this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;

    ctx.beginPath();
    const points = 50;
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * 2 * Math.PI;
      const x = (i / points - 0.5) * this.width;
      let y = 0;

      switch (this.functionType) {
        case 'sine':
          y = Math.sin(t + this.phase) * this.height / 4;
          break;
        case 'cosine':
          y = Math.cos(t + this.phase) * this.height / 4;
          break;
        case 'parabola':
          y = Math.pow((i / points - 0.5) * 2, 2) * this.height / 4;
          break;
        case 'exponential':
          y = Math.exp((i / points - 1) * 2) * this.height / 8;
          break;
        case 'logarithmic':
          y = Math.log(i / points + 0.1) * this.height / 8;
          break;
      }

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    ctx.restore();
  }
}

// Number Particle class
class NumberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  number: string;
  color: string;
  fontSize: number;
  life: number;
  maxLife: number;
  canvas: HTMLCanvasElement;
  isDarkMode: boolean;

  constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.number = this.getRandomNumber();
    this.color = this.getColor();
    this.fontSize = Math.random() * 8 + 14;
    this.maxLife = Math.random() * 300 + 200;
    this.life = this.maxLife;
  }

  private getRandomNumber(): string {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', 'e', '∞', '½', '¼', '¾', '⅓', '⅔'];
    return numbers[Math.floor(Math.random() * numbers.length)];
  }

  private getColor(): string {
    if (this.isDarkMode) {
      const colors = ['#00CED1', '#FFD700', '#FF69B4', '#98FB98', '#DDA0DD'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const colors = ['#20B2AA', '#DAA520', '#FF1493', '#32CD32', '#9370DB'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  updateTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.color = this.getColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Reset when life expires
    if (this.life <= 0) {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.life = this.maxLife;
      this.number = this.getRandomNumber();
    }

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px 'Times New Roman', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(this.number, this.x, this.y);
    ctx.restore();
  }
}