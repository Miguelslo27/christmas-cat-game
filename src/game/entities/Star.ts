import * as THREE from 'three';
import { VISUAL_CONFIG } from '../utils/Constants';

/**
 * Clase para crear la estrella de la cima del árbol
 * La estrella es el objetivo final del gatito
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

    // Crear la geometría de la estrella
    this.starMesh = this.createStarMesh();
    this.mesh.add(this.starMesh);

    // Crear el brillo exterior (glow)
    this.glowMesh = this.createGlowMesh();
    this.mesh.add(this.glowMesh);

    // Añadir luz puntual para iluminar alrededores
    this.pointLight = new THREE.PointLight(
      VISUAL_CONFIG.COLORS.STAR_GOLD,
      2,
      5
    );
    this.pointLight.castShadow = false;
    this.mesh.add(this.pointLight);
  }

  /**
   * Crear la malla de la estrella de 5 puntas
   */
  private createStarMesh(): THREE.Mesh {
    const shape = this.createStarShape(0.5, 0.25, 5);
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: VISUAL_CONFIG.COLORS.STAR_GOLD,
      metalness: 0.8,
      roughness: 0.2,
      emissive: VISUAL_CONFIG.COLORS.STAR_GOLD,
      emissiveIntensity: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    return mesh;
  }

  /**
   * Crear forma de estrella 2D
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
   * Crear efecto de brillo (glow) alrededor de la estrella
   */
  private createGlowMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.6, 16, 16);
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
   * Actualizar animaciones de la estrella
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Rotación lenta
    this.starMesh.rotation.z = Math.sin(this.time * 0.5) * 0.1;
    this.starMesh.rotation.y += deltaTime * 0.3;

    // Pulso del brillo
    const pulseScale = 1 + Math.sin(this.time * 2) * 0.1;
    this.glowMesh.scale.setScalar(pulseScale);

    // Variación de intensidad de luz
    this.pointLight.intensity = 2 + Math.sin(this.time * 3) * 0.5;

    // Variación de intensidad emisiva
    const emissiveIntensity = 0.5 + Math.sin(this.time * 2) * 0.2;
    (this.starMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
      emissiveIntensity;
  }

  /**
   * Posicionar la estrella
   */
  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Limpiar recursos
   */
  dispose(): void {
    this.starMesh.geometry.dispose();
    (this.starMesh.material as THREE.Material).dispose();
    this.glowMesh.geometry.dispose();
    (this.glowMesh.material as THREE.Material).dispose();
  }
}
