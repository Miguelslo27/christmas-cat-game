import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TreeSide } from '../utils/Constants';

/**
 * Estados de animación del gatito
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
 * Clase del gatito protagonista
 * Placeholder con primitivas, se puede reemplazar con modelo GLTF
 */
export class Cat {
  public mesh: THREE.Group;
  
  // Estado actual
  public currentLevel: number = 0;
  public currentSide: TreeSide = TreeSide.CENTER;
  public currentAnimation: CatAnimation = CatAnimation.IDLE;
  
  // Componentes del placeholder
  private body: THREE.Mesh;
  private head: THREE.Mesh;
  private ears: THREE.Group;
  private tail: THREE.Mesh;
  private eyes: THREE.Group;
  
  // Animación
  private mixer: THREE.AnimationMixer | null = null;
  private time: number = 0;

  // Flag para saber si usamos modelo real o placeholder
  private isPlaceholder: boolean = true;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'Cat';
    this.mesh.scale.setScalar(0.5);

    // Crear placeholder
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
  }

  /**
   * Cargar modelo GLTF real
   */
  loadFromGLTF(gltf: GLTF): void {
    // Limpiar placeholder
    this.mesh.remove(this.body, this.head, this.ears, this.tail, this.eyes);
    
    // Agregar modelo real
    const model = gltf.scene.clone();
    model.scale.setScalar(0.5);
    this.mesh.add(model);

    // Configurar animaciones si existen
    if (gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(model);
      // Reproducir animación idle por defecto
      const idleClip = gltf.animations.find(
        (clip) => clip.name.toLowerCase().includes('idle')
      );
      if (idleClip) {
        this.mixer.clipAction(idleClip).play();
      }
    }

    this.isPlaceholder = false;
  }

  // === CREACIÓN DEL PLACEHOLDER ===

  private createBody(): THREE.Mesh {
    const geometry = new THREE.CapsuleGeometry(0.4, 0.8, 8, 16);
    geometry.rotateZ(Math.PI / 2);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8c00, // Naranja
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

    // Oreja izquierda
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.65, 1.05, -0.15);
    leftEar.rotation.z = -0.2;
    group.add(leftEar);

    // Oreja derecha
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.65, 1.05, 0.15);
    rightEar.rotation.z = -0.2;
    group.add(rightEar);

    // Interior rosa
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
    // Cola usando un tubo curvo
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

    // Pupilas
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

    // Nariz
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

  // === ANIMACIONES ===

  /**
   * Reproducir animación
   */
  playAnimation(animation: CatAnimation): void {
    this.currentAnimation = animation;

    if (!this.isPlaceholder && this.mixer) {
      // TODO: Mapear animación a clip real cuando tengamos modelo
    }
  }

  /**
   * Actualizar animaciones
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
   * Animaciones del placeholder
   */
  private updatePlaceholderAnimation(_deltaTime: number): void {
    // Animación de cola
    const tailWag = Math.sin(this.time * 5) * 0.3;
    this.tail.rotation.z = tailWag;
    this.tail.rotation.y = Math.sin(this.time * 3) * 0.2;

    // Respiración (cuerpo sube y baja)
    const breathe = Math.sin(this.time * 2) * 0.02;
    this.body.scale.y = 1 + breathe;

    // Parpadeo ocasional
    if (Math.random() < 0.002) {
      this.blink();
    }

    // Animaciones específicas
    switch (this.currentAnimation) {
      case CatAnimation.IDLE:
        // Movimiento sutil de la cabeza
        this.head.rotation.y = Math.sin(this.time * 0.5) * 0.1;
        break;

      case CatAnimation.SNIFF:
        // Cabeza moviéndose como olfateando
        this.head.rotation.y = Math.sin(this.time * 4) * 0.2;
        this.head.position.x = 0.6 + Math.sin(this.time * 3) * 0.05;
        break;

      case CatAnimation.PREPARE_JUMP:
        // Agacharse
        this.mesh.position.y = -0.1;
        this.tail.rotation.x = 0.3;
        break;
    }
  }

  /**
   * Efecto de parpadeo
   */
  private blink(): void {
    const eyes = this.eyes.children.filter((c) => 
      (c as THREE.Mesh).geometry instanceof THREE.SphereGeometry
    );
    
    eyes.forEach((eye) => {
      const originalScale = eye.scale.y;
      eye.scale.y = 0.1;
      setTimeout(() => {
        eye.scale.y = originalScale;
      }, 100);
    });
  }

  /**
   * Establecer posición del gato
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Mirar hacia un lado
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
   * Limpiar recursos
   */
  dispose(): void {
    if (this.isPlaceholder) {
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
  }
}
