import * as THREE from 'three';
import { VISUAL_CONFIG } from '../utils/Constants';

/**
 * Star shape configuration constants
 */
const STAR_CONFIG = {
  /** Outer radius of star points */
  OUTER_RADIUS: 0.5,
  /** Inner radius between star points */
  INNER_RADIUS: 0.25,
  /** Number of points on the star */
  POINTS: 5,
  /** Star extrusion depth */
  DEPTH: 0.1,
  /** Bevel thickness */
  BEVEL_THICKNESS: 0.02,
  /** Bevel size */
  BEVEL_SIZE: 0.02,
  /** Bevel segments */
  BEVEL_SEGMENTS: 2,
  /** Glow sphere radius */
  GLOW_RADIUS: 0.6,
  /** Glow sphere segments */
  GLOW_SEGMENTS: 16,
};

/**
 * Animation configuration constants
 */
const STAR_ANIMATION = {
  /** Rotation oscillation speed */
  ROTATION_SPEED: 0.5,
  /** Maximum rotation angle */
  MAX_ROTATION: 0.1,
  /** Y-axis spin speed */
  SPIN_SPEED: 0.3,
  /** Pulse animation speed */
  PULSE_SPEED: 2,
  /** Pulse scale amplitude */
  PULSE_AMPLITUDE: 0.1,
  /** Light pulse speed */
  LIGHT_PULSE_SPEED: 3,
  /** Light intensity amplitude */
  LIGHT_AMPLITUDE: 0.5,
  /** Base light intensity */
  BASE_LIGHT_INTENSITY: 2,
  /** Base emissive intensity */
  BASE_EMISSIVE: 0.5,
  /** Emissive variation amplitude */
  EMISSIVE_AMPLITUDE: 0.2,
};

/**
 * Star entity for the top of the Christmas tree
 * The star is the cat's final objective
 */
export class Star {
  public mesh: THREE.Group;
  private starMesh: THREE.Mesh;
  private glowMesh: THREE.Mesh;
  private pointLight: THREE.PointLight;
  private time: number = 0;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'Star';

    // Create star geometry
    this.starMesh = this.createStarMesh();
    this.mesh.add(this.starMesh);

    // Create outer glow effect
    this.glowMesh = this.createGlowMesh();
    this.mesh.add(this.glowMesh);

    // Add point light to illuminate surroundings
    this.pointLight = new THREE.PointLight(
      VISUAL_CONFIG.COLORS.STAR_GOLD,
      STAR_ANIMATION.BASE_LIGHT_INTENSITY,
      5
    );
    this.pointLight.castShadow = false;
    this.mesh.add(this.pointLight);
  }

  /**
   * Create the 5-pointed star mesh
   */
  private createStarMesh(): THREE.Mesh {
    const shape = this.createStarShape(
      STAR_CONFIG.OUTER_RADIUS,
      STAR_CONFIG.INNER_RADIUS,
      STAR_CONFIG.POINTS
    );
    const extrudeSettings = {
      depth: STAR_CONFIG.DEPTH,
      bevelEnabled: true,
      bevelThickness: STAR_CONFIG.BEVEL_THICKNESS,
      bevelSize: STAR_CONFIG.BEVEL_SIZE,
      bevelSegments: STAR_CONFIG.BEVEL_SEGMENTS,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: VISUAL_CONFIG.COLORS.STAR_GOLD,
      metalness: 0.8,
      roughness: 0.2,
      emissive: VISUAL_CONFIG.COLORS.STAR_GOLD,
      emissiveIntensity: STAR_ANIMATION.BASE_EMISSIVE,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    return mesh;
  }

  /**
   * Create 2D star shape
   */
  private createStarShape(
    outerRadius: number,
    innerRadius: number,
    points: number
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
   * Create glow effect around the star
   */
  private createGlowMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(
      STAR_CONFIG.GLOW_RADIUS,
      STAR_CONFIG.GLOW_SEGMENTS,
      STAR_CONFIG.GLOW_SEGMENTS
    );
    const material = new THREE.MeshBasicMaterial({
      color: VISUAL_CONFIG.COLORS.STAR_GOLD,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  /**
   * Update star animations
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Slow rotation
    this.starMesh.rotation.z = Math.sin(this.time * STAR_ANIMATION.ROTATION_SPEED) * STAR_ANIMATION.MAX_ROTATION;
    this.starMesh.rotation.y += deltaTime * STAR_ANIMATION.SPIN_SPEED;

    // Glow pulse
    const pulseScale = 1 + Math.sin(this.time * STAR_ANIMATION.PULSE_SPEED) * STAR_ANIMATION.PULSE_AMPLITUDE;
    this.glowMesh.scale.setScalar(pulseScale);

    // Light intensity variation
    this.pointLight.intensity = STAR_ANIMATION.BASE_LIGHT_INTENSITY + 
      Math.sin(this.time * STAR_ANIMATION.LIGHT_PULSE_SPEED) * STAR_ANIMATION.LIGHT_AMPLITUDE;

    // Emissive intensity variation
    const emissiveIntensity = STAR_ANIMATION.BASE_EMISSIVE + 
      Math.sin(this.time * STAR_ANIMATION.PULSE_SPEED) * STAR_ANIMATION.EMISSIVE_AMPLITUDE;
    (this.starMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
      emissiveIntensity;
  }

  /**
   * Position the star
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.starMesh.geometry.dispose();
    (this.starMesh.material as THREE.Material).dispose();
    this.glowMesh.geometry.dispose();
    (this.glowMesh.material as THREE.Material).dispose();
  }
}
