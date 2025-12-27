import * as THREE from 'three';
import { VISUAL_CONFIG, GAME_CONFIG } from '../utils/Constants';

/**
 * Represents an individual tree branch
 */
export interface Branch {
  level: number; // Height level (0 = base, TOTAL_BRANCHES-1 = top)
  side: 'left' | 'right';
  position: THREE.Vector3;
  hasOrnament: boolean;
}

/**
 * Light configuration for performance
 */
const LIGHT_CONFIG = {
  /** Maximum number of point lights for performance */
  MAX_POINT_LIGHTS: 8,
  /** Lights per level for visual spheres */
  SPHERES_PER_LEVEL: 4,
};

/**
 * Class for creating the gameplay Christmas tree
 * This is the interior scene where the cat climbs
 */
export class ChristmasTree {
  public mesh: THREE.Group;
  public branches: Branch[] = [];
  
  private trunkMesh: THREE.Mesh;
  private foliageGroup: THREE.Group;
  private lightsGroup: THREE.Group;
  private lights: THREE.PointLight[] = [];
  private time: number = 0;

  // Tree configuration
  private readonly totalLevels: number = GAME_CONFIG.TOTAL_BRANCHES;
  private readonly treeHeight: number = 12;
  private readonly baseRadius: number = 3;
  private readonly topRadius: number = 0.5;
  private readonly branchSpacing: number;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'ChristmasTree';
    this.branchSpacing = this.treeHeight / this.totalLevels;

    // Create tree components
    this.trunkMesh = this.createTrunk();
    this.mesh.add(this.trunkMesh);

    this.foliageGroup = new THREE.Group();
    this.mesh.add(this.foliageGroup);
    this.createFoliage();

    this.lightsGroup = new THREE.Group();
    this.mesh.add(this.lightsGroup);
    this.createLights();

    // Create gameplay branches (data only, no meshes)
    this.createGameplayBranches();
  }

  /**
   * Create tree trunk
   */
  private createTrunk(): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(0.3, 0.4, this.treeHeight + 1, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.9,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = (this.treeHeight + 1) / 2 - 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  /**
   * Create foliage (leaf layers)
   */
  private createFoliage(): void {
    const layers = 6;
    const layerHeight = this.treeHeight / layers;

    for (let i = 0; i < layers; i++) {
      const progress = i / layers;
      const radius = THREE.MathUtils.lerp(this.baseRadius, this.topRadius, progress);
      const y = i * layerHeight + 1;

      // Foliage cone
      const geometry = new THREE.ConeGeometry(radius, layerHeight * 1.5, 32);
      const material = new THREE.MeshStandardMaterial({
        color: VISUAL_CONFIG.COLORS.TREE_GREEN,
        roughness: 0.8,
        metalness: 0.1,
        flatShading: false,
      });

      const cone = new THREE.Mesh(geometry, material);
      cone.position.y = y;
      cone.castShadow = true;
      cone.receiveShadow = true;

      this.foliageGroup.add(cone);
    }
  }

  /**
   * Create decorative Christmas lights
   * Uses limited point lights for performance
   */
  private createLights(): void {
    const lightColors = [0xff0000, 0x00ff00, 0x0066ff, 0xffff00, 0xff00ff];
    const totalSpheres = this.totalLevels * LIGHT_CONFIG.SPHERES_PER_LEVEL;
    let pointLightCount = 0;

    for (let i = 0; i < totalSpheres; i++) {
      const level = Math.floor(i / LIGHT_CONFIG.SPHERES_PER_LEVEL);
      const angleIndex = i % LIGHT_CONFIG.SPHERES_PER_LEVEL;
      const angle = (angleIndex / LIGHT_CONFIG.SPHERES_PER_LEVEL) * Math.PI * 2 + level * 0.5;

      const progress = level / this.totalLevels;
      const radius = THREE.MathUtils.lerp(this.baseRadius * 0.8, this.topRadius * 0.8, progress);
      const y = level * this.branchSpacing + 1;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Light sphere (visual only)
      const sphereGeom = new THREE.SphereGeometry(0.05, 8, 8);
      const color = lightColors[i % lightColors.length];
      const sphereMat = new THREE.MeshBasicMaterial({
        color: color,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, y, z);
      this.lightsGroup.add(sphere);

      // Point light (limited for performance)
      if (pointLightCount < LIGHT_CONFIG.MAX_POINT_LIGHTS) {
        // Distribute point lights evenly across the tree
        const shouldAddLight = i % Math.ceil(totalSpheres / LIGHT_CONFIG.MAX_POINT_LIGHTS) === 0;
        if (shouldAddLight) {
          const light = new THREE.PointLight(color, 0.3, 2);
          light.position.set(x, y, z);
          this.lights.push(light);
          this.lightsGroup.add(light);
          pointLightCount++;
        }
      }
    }
  }

  /**
   * Create branches where the cat can position itself
   * These are data-only (no meshes added to scene)
   */
  private createGameplayBranches(): void {
    for (let level = 0; level < this.totalLevels; level++) {
      const progress = level / this.totalLevels;
      const y = level * this.branchSpacing + 1.5;
      const radius = THREE.MathUtils.lerp(this.baseRadius * 0.7, this.topRadius * 1.5, progress);

      // Left branch
      const leftBranch = this.createBranch(level, 'left', -radius, y);
      this.branches.push(leftBranch);

      // Right branch
      const rightBranch = this.createBranch(level, 'right', radius, y);
      this.branches.push(rightBranch);
    }
  }

  /**
   * Create a branch data object (no mesh added to scene)
   */
  private createBranch(level: number, side: 'left' | 'right', x: number, y: number): Branch {
    const position = new THREE.Vector3(x, y, 0);

    return {
      level,
      side,
      position: position.clone(),
      hasOrnament: false,
    };
  }

  /**
   * Get branch by level and side
   */
  getBranch(level: number, side: 'left' | 'right'): Branch | undefined {
    return this.branches.find((b) => b.level === level && b.side === side);
  }

  /**
   * Get position for cat at a specific level and side
   */
  getCatPosition(level: number, side: 'left' | 'right'): THREE.Vector3 | undefined {
    const branch = this.getBranch(level, side);
    if (branch) {
      // Position slightly above the branch
      return new THREE.Vector3(
        branch.position.x * 0.8,
        branch.position.y + 0.3,
        branch.position.z + 0.5
      );
    }
    return undefined;
  }

  /**
   * Get top position (where the star is)
   */
  getTopPosition(): THREE.Vector3 {
    return new THREE.Vector3(0, this.treeHeight + 1, 0);
  }

  /**
   * Update animations
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Animate lights (twinkling)
    this.lights.forEach((light, index) => {
      const phase = index * 0.5;
      const intensity = 0.3 + Math.sin(this.time * 3 + phase) * 0.2;
      light.intensity = Math.max(0, intensity);
    });
  }

  /**
   * Apply balance visual effect
   */
  applyBalanceEffect(balance: number): void {
    // balance goes from -100 to 100
    const maxRotation = 0.15; // radians
    const rotation = (balance / 100) * maxRotation;
    
    this.mesh.rotation.z = -rotation;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.trunkMesh.geometry.dispose();
    (this.trunkMesh.material as THREE.Material).dispose();

    this.foliageGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });

    this.lightsGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });

    // Branches are data-only, no meshes to dispose
    this.branches = [];
  }
}
