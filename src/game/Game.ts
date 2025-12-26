import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChristmasTree } from './entities/ChristmasTree';
import { Cat } from './entities/Cat';
import { Star } from './entities/Star';
import { Ornament, OrnamentPool } from './entities/Ornament';

/**
 * Clase principal del juego
 * Maneja el ciclo de vida, renderer y escenas
 */
export class Game {
  private container: HTMLElement;
  private uiContainer: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private isRunning: boolean = false;
  private controls: OrbitControls | null = null;

  // Entidades del juego
  private tree: ChristmasTree | null = null;
  private cat: Cat | null = null;
  private star: Star | null = null;
  private ornamentPool: OrnamentPool | null = null;
  private ornaments: Ornament[] = [];

  constructor(container: HTMLElement, uiContainer: HTMLElement) {
    this.container = container;
    this.uiContainer = uiContainer;
    this.clock = new THREE.Clock();

    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x1a472a); // Verde navideño oscuro
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Agregar canvas al DOM
    this.container.appendChild(this.renderer.domElement);

    // Crear escena
    this.scene = new THREE.Scene();

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 6, 12);
    this.camera.lookAt(0, 5, 0);

    // Manejar resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  /**
   * Inicializar el juego
   */
  async init(): Promise<void> {
    console.log('🎄 Iniciando Christmas Cat Game...');

    // Crear escena con entidades
    this.createGameScene();

    // Agregar controles de órbita para desarrollo
    this.setupDevControls();

    // Iniciar loop de renderizado
    this.isRunning = true;
    this.animate();

    console.log('✅ Juego inicializado correctamente');
  }

  /**
   * Configurar controles de desarrollo (OrbitControls)
   */
  private setupDevControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 5, 0);
    this.controls.update();
  }

  /**
   * Crear escena principal del juego con todas las entidades
   */
  private createGameScene(): void {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // Luz de relleno
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Suelo
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d1810,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Crear árbol de navidad
    this.tree = new ChristmasTree();
    this.scene.add(this.tree.mesh);

    // Crear estrella en la cima
    this.star = new Star();
    const topPos = this.tree.getTopPosition();
    this.star.setPosition(topPos.x, topPos.y + 0.5, topPos.z);
    this.scene.add(this.star.mesh);

    // Crear gatito
    this.cat = new Cat();
    const startPos = this.tree.getCatPosition(0, 'left');
    if (startPos) {
      this.cat.setPosition(startPos.x, startPos.y, startPos.z);
    }
    this.cat.lookAt('right');
    this.scene.add(this.cat.mesh);

    // Crear pool de globos y añadir algunos
    this.ornamentPool = new OrnamentPool();
    this.addOrnaments();

    // UI de desarrollo
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 1.2rem;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      background: rgba(0,0,0,0.5);
      padding: 15px 25px;
      border-radius: 10px;
    `;
    statusDiv.innerHTML = `
      <h2>🎄 Christmas Cat Game</h2>
      <p>Fase 2: Assets y Entidades</p>
      <p style="font-size: 0.9rem; opacity: 0.7;">Usa el mouse para orbitar la cámara</p>
    `;
    this.uiContainer.appendChild(statusDiv);
  }

  /**
   * Añadir globos decorativos al árbol
   */
  private addOrnaments(): void {
    if (!this.tree || !this.ornamentPool) return;

    // Añadir globos en algunas ramas
    for (let level = 1; level < 10; level += 2) {
      const side = level % 4 < 2 ? 'left' : 'right';
      const branch = this.tree.getBranch(level, side);
      
      if (branch) {
        const ornament = this.ornamentPool.get();
        ornament.setPosition(
          branch.position.x * 0.9,
          branch.position.y + 0.2,
          branch.position.z
        );
        this.scene.add(ornament.mesh);
        this.ornaments.push(ornament);
        branch.hasOrnament = true;
      }
    }
  }

  /**
   * Loop principal de animación
   */
  private animate(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Actualizar controles de desarrollo
    if (this.controls) {
      this.controls.update();
    }

    // Actualizar entidades
    if (this.tree) {
      this.tree.update(delta);
    }

    if (this.star) {
      this.star.update(delta);
    }

    if (this.cat) {
      this.cat.update(delta);
    }

    // Actualizar globos
    this.ornaments.forEach((ornament) => {
      ornament.update(delta);
    });

    // Renderizar
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Manejar cambio de tamaño de ventana
   */
  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Destruir el juego y limpiar recursos
   */
  destroy(): void {
    this.isRunning = false;
    window.removeEventListener('resize', this.onResize.bind(this));
    
    // Limpiar entidades
    this.tree?.dispose();
    this.cat?.dispose();
    this.star?.dispose();
    this.ornamentPool?.dispose();
    
    // Limpiar controles
    this.controls?.dispose();
    
    this.renderer.dispose();
  }
}
