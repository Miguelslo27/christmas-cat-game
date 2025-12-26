import * as THREE from 'three';
import { VISUAL_CONFIG, GAME_CONFIG } from '../utils/Constants';

/**
 * Representa una rama individual del árbol
 */
export interface Branch {
  mesh: THREE.Mesh;
  level: number; // Nivel de altura (0 = base, TOTAL_BRANCHES-1 = cima)
  side: 'left' | 'right';
  position: THREE.Vector3;
  hasOrnament: boolean;
}

/**
 * Clase para crear el árbol de navidad del gameplay
 * Este es el escenario interior donde el gatito sube
 */
export class ChristmasTree {
  public mesh: THREE.Group;
  public branches: Branch[] = [];
  
  private trunkMesh: THREE.Mesh;
  private foliageGroup: THREE.Group;
  private lightsGroup: THREE.Group;
  private lights: THREE.PointLight[] = [];
  private time: number = 0;

  // Configuración del árbol
  private readonly totalLevels: number = GAME_CONFIG.TOTAL_BRANCHES;
  private readonly treeHeight: number = 12;
  private readonly baseRadius: number = 3;
  private readonly topRadius: number = 0.5;
  private readonly branchSpacing: number;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'ChristmasTree';
    this.branchSpacing = this.treeHeight / this.totalLevels;

    // Crear componentes del árbol
    this.trunkMesh = this.createTrunk();
    this.mesh.add(this.trunkMesh);

    this.foliageGroup = new THREE.Group();
    this.mesh.add(this.foliageGroup);
    this.createFoliage();

    this.lightsGroup = new THREE.Group();
    this.mesh.add(this.lightsGroup);
    this.createLights();

    // Crear las ramas para gameplay
    this.createGameplayBranches();
  }

  /**
   * Crear el tronco del árbol
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
   * Crear el follaje (capas de hojas)
   */
  private createFoliage(): void {
    const layers = 6;
    const layerHeight = this.treeHeight / layers;

    for (let i = 0; i < layers; i++) {
      const progress = i / layers;
      const radius = THREE.MathUtils.lerp(this.baseRadius, this.topRadius, progress);
      const y = i * layerHeight + 1;

      // Cono de follaje
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
   * Crear luces navideñas decorativas
   */
  private createLights(): void {
    const lightColors = [0xff0000, 0x00ff00, 0x0066ff, 0xffff00, 0xff00ff];
    const lightsPerLevel = 4;
    const totalLights = this.totalLevels * lightsPerLevel;

    for (let i = 0; i < totalLights; i++) {
      const level = Math.floor(i / lightsPerLevel);
      const angleIndex = i % lightsPerLevel;
      const angle = (angleIndex / lightsPerLevel) * Math.PI * 2 + level * 0.5;

      const progress = level / this.totalLevels;
      const radius = THREE.MathUtils.lerp(this.baseRadius * 0.8, this.topRadius * 0.8, progress);
      const y = level * this.branchSpacing + 1;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Esfera de luz
      const sphereGeom = new THREE.SphereGeometry(0.05, 8, 8);
      const color = lightColors[i % lightColors.length];
      const sphereMat = new THREE.MeshBasicMaterial({
        color: color,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(x, y, z);
      this.lightsGroup.add(sphere);

      // Luz puntual (solo algunas para rendimiento)
      if (i % 3 === 0) {
        const light = new THREE.PointLight(color, 0.3, 2);
        light.position.set(x, y, z);
        this.lights.push(light);
        this.lightsGroup.add(light);
      }
    }
  }

  /**
   * Crear las ramas donde el gatito puede posicionarse
   */
  private createGameplayBranches(): void {
    for (let level = 0; level < this.totalLevels; level++) {
      const progress = level / this.totalLevels;
      const y = level * this.branchSpacing + 1.5;
      const radius = THREE.MathUtils.lerp(this.baseRadius * 0.7, this.topRadius * 1.5, progress);

      // Rama izquierda
      const leftBranch = this.createBranch(level, 'left', -radius, y);
      this.branches.push(leftBranch);

      // Rama derecha
      const rightBranch = this.createBranch(level, 'right', radius, y);
      this.branches.push(rightBranch);
    }
  }

  /**
   * Crear una rama individual
   */
  private createBranch(level: number, side: 'left' | 'right', x: number, y: number): Branch {
    // Geometría de la rama (invisible, solo para colisión/posicionamiento)
    const geometry = new THREE.BoxGeometry(0.8, 0.2, 0.4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.9,
      visible: false, // Invisible, las ramas visuales son parte del follaje
    });

    const mesh = new THREE.Mesh(geometry, material);
    const position = new THREE.Vector3(x, y, 0);
    mesh.position.copy(position);

    // Rotar ligeramente hacia afuera
    mesh.rotation.z = side === 'left' ? 0.2 : -0.2;

    this.mesh.add(mesh);

    return {
      mesh,
      level,
      side,
      position: position.clone(),
      hasOrnament: false,
    };
  }

  /**
   * Obtener rama por nivel y lado
   */
  getBranch(level: number, side: 'left' | 'right'): Branch | undefined {
    return this.branches.find((b) => b.level === level && b.side === side);
  }

  /**
   * Obtener posición para el gatito en un nivel y lado específico
   */
  getCatPosition(level: number, side: 'left' | 'right'): THREE.Vector3 | undefined {
    const branch = this.getBranch(level, side);
    if (branch) {
      // Posición ligeramente encima de la rama
      return new THREE.Vector3(
        branch.position.x * 0.8,
        branch.position.y + 0.3,
        branch.position.z + 0.5
      );
    }
    return undefined;
  }

  /**
   * Obtener posición de la cima (donde está la estrella)
   */
  getTopPosition(): THREE.Vector3 {
    return new THREE.Vector3(0, this.treeHeight + 1, 0);
  }

  /**
   * Actualizar animaciones
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Animar luces (parpadeo)
    this.lights.forEach((light, index) => {
      const phase = index * 0.5;
      const intensity = 0.3 + Math.sin(this.time * 3 + phase) * 0.2;
      light.intensity = Math.max(0, intensity);
    });
  }

  /**
   * Aplicar efecto de desequilibrio visual
   */
  applyBalanceEffect(balance: number): void {
    // balance va de -100 a 100
    const maxRotation = 0.15; // radianes
    const rotation = (balance / 100) * maxRotation;
    
    this.mesh.rotation.z = -rotation;
  }

  /**
   * Limpiar recursos
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

    this.branches.forEach((branch) => {
      branch.mesh.geometry.dispose();
      (branch.mesh.material as THREE.Material).dispose();
    });
  }
}
