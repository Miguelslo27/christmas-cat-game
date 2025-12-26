import * as THREE from 'three';

/**
 * Funciones de utilidad
 */

/**
 * Genera un número aleatorio entre min y max (inclusive)
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Genera un entero aleatorio entre min y max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Selecciona un elemento aleatorio de un array
 */
export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Clamp un valor entre min y max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Lerp (interpolación lineal)
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Convierte grados a radianes
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convierte radianes a grados
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Formatea segundos a mm:ss
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formatea puntuación con separadores de miles
 */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/**
 * Crea un color aleatorio de la paleta navideña
 */
export function randomChristmasColor(): number {
  const colors = [0xff0000, 0x00ff00, 0xffd700, 0x0066cc, 0xc0c0c0, 0x9932cc];
  return randomChoice(colors);
}

/**
 * Detecta si es un dispositivo táctil
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Detecta si es un dispositivo móvil
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Crea una geometría de estrella
 */
export function createStarGeometry(
  outerRadius: number = 1,
  innerRadius: number = 0.5,
  points: number = 5
): THREE.Shape {
  const shape = new THREE.Shape();
  const angle = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.sin(i * angle) * radius;
    const y = Math.cos(i * angle) * radius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return shape;
}

/**
 * Espera un tiempo determinado
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
