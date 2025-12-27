import * as THREE from 'three';
import { VISUAL_CONFIG } from '../utils/Constants';
import { randomChoice } from '../utils/Helpers';

/**
 * Available colors for Christmas ornaments
 */
const ORNAMENT_COLORS = [
  VISUAL_CONFIG.COLORS.ORNAMENT_RED,
  VISUAL_CONFIG.COLORS.ORNAMENT_BLUE,
  VISUAL_CONFIG.COLORS.ORNAMENT_SILVER,
  VISUAL_CONFIG.COLORS.ORNAMENT_PURPLE,
  VISUAL_CONFIG.COLORS.CHRISTMAS_GOLD,
];

/**
 * Animation configuration constants
 */
const ORNAMENT_ANIMATION = {
  /** Sway speed when hanging */
  SWAY_SPEED: 2,
  /** Maximum sway angle */
  SWAY_AMPLITUDE: 0.1,
  /** Rotation speed on X-axis while falling */
  FALL_ROTATION_X: 2,
  /** Rotation speed on Z-axis while falling */
  FALL_ROTATION_Z: 1.5,
};

/**
 * Class for creating Christmas ornaments/baubles
 * These are the obstacles the cat must avoid
 */
export class Ornament {
  public mesh: THREE.Group;
  private sphereMesh: THREE.Mesh;
  private capMesh: THREE.Mesh;
  private color: number;
  private accumulatedTime: number = 0;

  // Ornament state
  public isFalling: boolean = false;
  public fallSpeed: number = 0;
  private fallAcceleration: number = 9.8;

  constructor(color?: number) {
    this.color = color ?? randomChoice(ORNAMENT_COLORS);
    this.mesh = new THREE.Group();
    this.mesh.name = 'Ornament';

    // Create main sphere
    this.sphereMesh = this.createSphereMesh();
    this.mesh.add(this.sphereMesh);

    // Create metallic top cap
    this.capMesh = this.createCapMesh();
    this.mesh.add(this.capMesh);
  }

  /**
   * Create the ornament sphere
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
   * Create the golden metallic cap
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
   * Start the ornament falling
   */
  startFalling(): void {
    this.isFalling = true;
    this.fallSpeed = 0;
  }

  /**
   * Update falling physics
   */
  update(deltaTime: number): void {
    this.accumulatedTime += deltaTime;

    if (this.isFalling) {
      // Accelerate the fall
      this.fallSpeed += this.fallAcceleration * deltaTime;
      this.mesh.position.y -= this.fallSpeed * deltaTime;

      // Rotate while falling
      this.mesh.rotation.x += deltaTime * ORNAMENT_ANIMATION.FALL_ROTATION_X;
      this.mesh.rotation.z += deltaTime * ORNAMENT_ANIMATION.FALL_ROTATION_Z;
    } else {
      // Gentle sway when hanging (use accumulated time instead of Date.now())
      this.mesh.rotation.z = Math.sin(
        this.accumulatedTime * ORNAMENT_ANIMATION.SWAY_SPEED + this.mesh.position.x
      ) * ORNAMENT_ANIMATION.SWAY_AMPLITUDE;
    }
  }

  /**
   * Check if ornament has fallen out of bounds
   */
  isOutOfBounds(minY: number = -10): boolean {
    return this.mesh.position.y < minY;
  }

  /**
   * Set position
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Get which side of the tree the ornament is on
   */
  getSide(): 'left' | 'right' {
    return this.mesh.position.x < 0 ? 'left' : 'right';
  }

  /**
   * Set the ornament color
   */
  setColor(color: number): void {
    this.color = color;
    (this.sphereMesh.material as THREE.MeshStandardMaterial).color.setHex(color);
  }

  /**
   * Reset ornament state for reuse
   */
  reset(): void {
    this.accumulatedTime = 0;
    this.isFalling = false;
    this.fallSpeed = 0;
    this.mesh.rotation.set(0, 0, 0);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.sphereMesh.geometry.dispose();
    (this.sphereMesh.material as THREE.Material).dispose();
    this.capMesh.geometry.dispose();
    (this.capMesh.material as THREE.Material).dispose();
  }
}

/**
 * Pool of ornaments for reuse
 */
export class OrnamentPool {
  private pool: Ornament[] = [];
  private activeOrnaments: Set<Ornament> = new Set();

  /**
   * Get an ornament from pool or create a new one
   */
  get(color?: number): Ornament {
    let ornament = this.pool.pop();
    
    if (!ornament) {
      ornament = new Ornament(color);
    } else if (color !== undefined) {
      // Reset color if specified when reusing
      ornament.setColor(color);
    } else {
      // Assign random color when reusing without specified color
      ornament.setColor(randomChoice(ORNAMENT_COLORS));
    }

    this.activeOrnaments.add(ornament);
    ornament.reset();

    return ornament;
  }

  /**
   * Return an ornament to the pool
   */
  release(ornament: Ornament): void {
    this.activeOrnaments.delete(ornament);
    this.pool.push(ornament);
  }

  /**
   * Get all active ornaments
   */
  getActive(): Ornament[] {
    return Array.from(this.activeOrnaments);
  }

  /**
   * Cleanup all ornaments
   */
  dispose(): void {
    this.pool.forEach((o) => o.dispose());
    this.activeOrnaments.forEach((o) => o.dispose());
    this.pool = [];
    this.activeOrnaments.clear();
  }
}
