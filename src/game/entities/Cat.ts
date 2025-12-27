import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TreeSide } from '../utils/Constants';

/**
 * Cat animation states
 */
export const CatAnimation = {
  IDLE: 'idle',
  CLIMB_LEFT: 'climb_left',
  CLIMB_RIGHT: 'climb_right',
  CLIMB_UP: 'climb_up',
  SNIFF: 'sniff',
  PREPARE_JUMP: 'prepare_jump',
  FALL: 'fall',
  VICTORY: 'victory',
  RUN_AWAY: 'run_away',
} as const;
export type CatAnimation = (typeof CatAnimation)[keyof typeof CatAnimation];

/**
 * Cat animation configuration constants
 */
const CAT_ANIMATION_CONFIG = {
  /** Probability of blinking per frame (at 60fps ~7% chance per second) */
  BLINK_PROBABILITY: 0.002,
  /** Duration of blink animation in seconds */
  BLINK_DURATION: 0.1,
  /** Tail wag speed */
  TAIL_WAG_SPEED: 5,
  /** Tail wag amplitude */
  TAIL_WAG_AMPLITUDE: 0.3,
  /** Breathing animation speed */
  BREATHE_SPEED: 2,
  /** Breathing scale amplitude */
  BREATHE_AMPLITUDE: 0.02,
};

/**
 * Main cat protagonist class
 * Placeholder with primitives, can be replaced with GLTF model
 */
export class Cat {
  public mesh: THREE.Group;
  
  // Current state
  public currentLevel: number = 0;
  public currentSide: TreeSide = TreeSide.CENTER;
  public currentAnimation: CatAnimation = CatAnimation.IDLE;
  
  // Placeholder components
  private body: THREE.Mesh;
  private head: THREE.Mesh;
  private ears: THREE.Group;
  private tail: THREE.Mesh;
  private eyes: THREE.Group;
  
  // Animation
  private mixer: THREE.AnimationMixer | null = null;
  private time: number = 0;
  private blinkTimer: number = 0;
  private isBlinking: boolean = false;
  private eyeOriginalScales: Map<THREE.Object3D, number> = new Map();

  // GLTF model reference for proper disposal
  private gltfModel: THREE.Object3D | null = null;

  // Flag to know if using real model or placeholder
  private isPlaceholder: boolean = true;

  // Store original positions for animation reset
  private originalHeadX: number = 0.6;
  private originalMeshY: number = 0;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'Cat';
    this.mesh.scale.setScalar(0.5);

    // Create placeholder
    this.body = this.createBody();
    this.head = this.createHead();
    this.ears = this.createEars();
    this.tail = this.createTail();
    this.eyes = this.createEyes();

    this.mesh.add(this.body);
    this.mesh.add(this.head);
    this.mesh.add(this.ears);
    this.mesh.add(this.tail);
    this.mesh.add(this.eyes);

    // Store original positions
    this.originalHeadX = this.head.position.x;
    this.originalMeshY = this.mesh.position.y;

    // Cache eye scales for blink animation
    this.cacheEyeScales();
  }

  /**
   * Cache eye original scales for blink animation
   */
  private cacheEyeScales(): void {
    this.eyes.children.forEach((child) => {
      if ((child as THREE.Mesh).geometry instanceof THREE.SphereGeometry) {
        this.eyeOriginalScales.set(child, child.scale.y);
      }
    });
  }

  /**
   * Load real GLTF model
   */
  loadFromGLTF(gltf: GLTF): void {
    // Dispose placeholder geometries and materials
    this.disposePlaceholder();
    
    // Remove placeholder meshes from group
    this.mesh.remove(this.body, this.head, this.ears, this.tail, this.eyes);
    
    // Add real model
    const model = gltf.scene.clone();
    model.scale.setScalar(0.5);
    this.mesh.add(model);
    this.gltfModel = model;

    // Configure animations if they exist
    if (gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(model);
      // Play idle animation by default
      const idleClip = gltf.animations.find(
        (clip) => clip.name.toLowerCase().includes('idle')
      );
      if (idleClip) {
        this.mixer.clipAction(idleClip).play();
      }
    }

    this.isPlaceholder = false;
  }

  // === PLACEHOLDER CREATION ===

  private createBody(): THREE.Mesh {
    const geometry = new THREE.CapsuleGeometry(0.4, 0.8, 8, 16);
    geometry.rotateZ(Math.PI / 2);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8c00, // Orange
      roughness: 0.8,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0.5, 0);
    mesh.castShadow = true;

    return mesh;
  }

  private createHead(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.35, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      roughness: 0.8,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.6, 0.7, 0);
    mesh.castShadow = true;

    return mesh;
  }

  private createEars(): THREE.Group {
    const group = new THREE.Group();
    
    const earGeometry = new THREE.ConeGeometry(0.12, 0.25, 4);
    const earMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      roughness: 0.8,
    });

    // Left ear
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.65, 1.05, -0.15);
    leftEar.rotation.z = -0.2;
    group.add(leftEar);

    // Right ear
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.65, 1.05, 0.15);
    rightEar.rotation.z = -0.2;
    group.add(rightEar);

    // Pink interior
    const innerEarGeometry = new THREE.ConeGeometry(0.06, 0.15, 4);
    const innerEarMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb6c1,
      roughness: 0.8,
    });

    const leftInner = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
    leftInner.position.set(0.67, 1.0, -0.15);
    leftInner.rotation.z = -0.2;
    group.add(leftInner);

    const rightInner = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
    rightInner.position.set(0.67, 1.0, 0.15);
    rightInner.rotation.z = -0.2;
    group.add(rightInner);

    return group;
  }

  private createTail(): THREE.Mesh {
    // Tail using a curved tube
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 0.5, 0),
      new THREE.Vector3(-0.9, 0.7, 0),
      new THREE.Vector3(-1.0, 1.0, 0.1),
      new THREE.Vector3(-0.9, 1.3, 0),
    ]);

    const geometry = new THREE.TubeGeometry(curve, 20, 0.08, 8, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      roughness: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    return mesh;
  }

  private createEyes(): THREE.Group {
    const group = new THREE.Group();

    // Ojos blancos
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.9, 0.75, -0.12);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.9, 0.75, 0.12);
    group.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.3,
    });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0.96, 0.75, -0.12);
    group.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.96, 0.75, 0.12);
    group.add(rightPupil);

    // Nose
    const noseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      roughness: 0.5,
    });

    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0.95, 0.6, 0);
    group.add(nose);

    return group;
  }

  // === ANIMATIONS ===

  /**
   * Play animation
   */
  playAnimation(animation: CatAnimation): void {
    // Reset positions when changing animation
    this.resetAnimationState();
    
    this.currentAnimation = animation;

    if (!this.isPlaceholder && this.mixer) {
      // TODO: Map animation to real clip when we have a model
    }
  }

  /**
   * Reset animation state to default positions
   */
  private resetAnimationState(): void {
    // Reset head position
    this.head.position.x = this.originalHeadX;
    this.head.rotation.y = 0;
    
    // Reset mesh position
    this.mesh.position.y = this.originalMeshY;
    
    // Reset tail
    this.tail.rotation.x = 0;
  }

  /**
   * Update animations
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    if (this.isPlaceholder) {
      this.updatePlaceholderAnimation(deltaTime);
    } else if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }

  /**
   * Placeholder animations
   */
  private updatePlaceholderAnimation(deltaTime: number): void {
    // Tail animation
    const tailWag = Math.sin(this.time * CAT_ANIMATION_CONFIG.TAIL_WAG_SPEED) * CAT_ANIMATION_CONFIG.TAIL_WAG_AMPLITUDE;
    this.tail.rotation.z = tailWag;
    this.tail.rotation.y = Math.sin(this.time * 3) * 0.2;

    // Breathing (body rises and falls)
    const breathe = Math.sin(this.time * CAT_ANIMATION_CONFIG.BREATHE_SPEED) * CAT_ANIMATION_CONFIG.BREATHE_AMPLITUDE;
    this.body.scale.y = 1 + breathe;

    // Time-based blinking (replaces Math.random() with timer)
    this.updateBlink(deltaTime);

    // Specific animations
    switch (this.currentAnimation) {
      case CatAnimation.IDLE:
        // Subtle head movement
        this.head.rotation.y = Math.sin(this.time * 0.5) * 0.1;
        break;

      case CatAnimation.SNIFF:
        // Head moving as if sniffing
        this.head.rotation.y = Math.sin(this.time * 4) * 0.2;
        this.head.position.x = this.originalHeadX + Math.sin(this.time * 3) * 0.05;
        break;

      case CatAnimation.PREPARE_JUMP:
        // Crouch down
        this.mesh.position.y = this.originalMeshY - 0.1;
        this.tail.rotation.x = 0.3;
        break;
    }
  }

  /**
   * Update blink animation using time-based approach
   */
  private updateBlink(deltaTime: number): void {
    if (this.isBlinking) {
      this.blinkTimer += deltaTime;
      
      if (this.blinkTimer >= CAT_ANIMATION_CONFIG.BLINK_DURATION) {
        // End blink - restore eye scales
        this.eyeOriginalScales.forEach((originalScale, eye) => {
          eye.scale.y = originalScale;
        });
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    } else {
      // Check if we should blink (using probability per frame)
      if (Math.random() < CAT_ANIMATION_CONFIG.BLINK_PROBABILITY) {
        this.startBlink();
      }
    }
  }

  /**
   * Start blink animation
   */
  private startBlink(): void {
    this.isBlinking = true;
    this.blinkTimer = 0;
    
    // Squash eyes
    this.eyeOriginalScales.forEach((_, eye) => {
      eye.scale.y = 0.1;
    });
  }

  /**
   * Set cat position
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
    this.originalMeshY = y;
  }

  /**
   * Look towards a side
   */
  lookAt(side: 'left' | 'right' | 'forward'): void {
    switch (side) {
      case 'left':
        this.mesh.rotation.y = Math.PI / 2;
        break;
      case 'right':
        this.mesh.rotation.y = -Math.PI / 2;
        break;
      case 'forward':
        this.mesh.rotation.y = 0;
        break;
    }
  }

  /**
   * Dispose placeholder resources
   */
  private disposePlaceholder(): void {
    [this.body, this.head, this.tail].forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    this.ears.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });

    this.eyes.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });
  }

  /**
   * Dispose GLTF model resources
   */
  private disposeGLTFModel(): void {
    if (!this.gltfModel) return;

    this.gltfModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.isPlaceholder) {
      this.disposePlaceholder();
    } else {
      this.disposeGLTFModel();
    }

    // Stop animation mixer
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = null;
    }
  }
}
