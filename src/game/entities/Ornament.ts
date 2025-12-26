import * as THREE from 'three';
import { VISUAL_CONFIG } from '../utils/Constants';
import { randomChoice } from '../utils/Helpers';

/**
 * Colores disponibles para los globos navideños
 */
const ORNAMENT_COLORS = [
  VISUAL_CONFIG.COLORS.ORNAMENT_RED,
  VISUAL_CONFIG.COLORS.ORNAMENT_BLUE,
  VISUAL_CONFIG.COLORS.ORNAMENT_SILVER,
  VISUAL_CONFIG.COLORS.ORNAMENT_PURPLE,
  VISUAL_CONFIG.COLORS.CHRISTMAS_GOLD,
];

/**
 * Clase para crear globos/esferas navideñas
 * Estos son los obstáculos que el gatito debe esquivar
 */
export class Ornament {
  public mesh: THREE.Group;
  private sphereMesh: THREE.Mesh;
  private capMesh: THREE.Mesh;
  private color: number;

  // Estado del globo
  public isFalling: boolean = false;
  public fallSpeed: number = 0;
  private fallAcceleration: number = 9.8;

  constructor(color?: number) {
    this.color = color ?? randomChoice(ORNAMENT_COLORS);
    this.mesh = new THREE.Group();
    this.mesh.name = 'Ornament';

    // Crear la esfera principal
    this.sphereMesh = this.createSphereMesh();
    this.mesh.add(this.sphereMesh);

    // Crear la tapa metálica superior
    this.capMesh = this.createCapMesh();
    this.mesh.add(this.capMesh);
  }

  /**
   * Crear la esfera del globo
   */
  private createSphereMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.15, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      metalness: 0.3,
      roughness: 0.2,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  /**
   * Crear la tapa metálica dorada
   */
  private createCapMesh(): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(0.05, 0.08, 0.05, 16);
    const material = new THREE.MeshStandardMaterial({
      color: VISUAL_CONFIG.COLORS.CHRISTMAS_GOLD,
      metalness: 0.8,
      roughness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.15;
    mesh.castShadow = true;

    return mesh;
  }

  /**
   * Iniciar la caída del globo
   */
  startFalling(): void {
    this.isFalling = true;
    this.fallSpeed = 0;
  }

  /**
   * Actualizar física de caída
   */
  update(deltaTime: number): void {
    if (this.isFalling) {
      // Acelerar la caída
      this.fallSpeed += this.fallAcceleration * deltaTime;
      this.mesh.position.y -= this.fallSpeed * deltaTime;

      // Rotar mientras cae
      this.mesh.rotation.x += deltaTime * 2;
      this.mesh.rotation.z += deltaTime * 1.5;
    } else {
      // Balanceo suave cuando está colgando
      this.mesh.rotation.z = Math.sin(Date.now() * 0.002 + this.mesh.position.x) * 0.1;
    }
  }

  /**
   * Verificar si el globo ha caído fuera de la pantalla
   */
  isOutOfBounds(minY: number = -10): boolean {
    return this.mesh.position.y < minY;
  }

  /**
   * Establecer posición
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Obtener el lado del árbol donde está el globo
   */
  getSide(): 'left' | 'right' {
    return this.mesh.position.x < 0 ? 'left' : 'right';
  }

  /**
   * Limpiar recursos
   */
  dispose(): void {
    this.sphereMesh.geometry.dispose();
    (this.sphereMesh.material as THREE.Material).dispose();
    this.capMesh.geometry.dispose();
    (this.capMesh.material as THREE.Material).dispose();
  }
}

/**
 * Pool de globos para reutilización
 */
export class OrnamentPool {
  private pool: Ornament[] = [];
  private activeOrnaments: Set<Ornament> = new Set();

  /**
   * Obtener un globo del pool o crear uno nuevo
   */
  get(color?: number): Ornament {
    let ornament = this.pool.pop();
    
    if (!ornament) {
      ornament = new Ornament(color);
    }

    this.activeOrnaments.add(ornament);
    ornament.isFalling = false;
    ornament.fallSpeed = 0;
    ornament.mesh.rotation.set(0, 0, 0);

    return ornament;
  }

  /**
   * Devolver un globo al pool
   */
  release(ornament: Ornament): void {
    this.activeOrnaments.delete(ornament);
    this.pool.push(ornament);
  }

  /**
   * Obtener todos los globos activos
   */
  getActive(): Ornament[] {
    return Array.from(this.activeOrnaments);
  }

  /**
   * Limpiar todos los globos
   */
  dispose(): void {
    this.pool.forEach((o) => o.dispose());
    this.activeOrnaments.forEach((o) => o.dispose());
    this.pool = [];
    this.activeOrnaments.clear();
  }
}
