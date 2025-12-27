import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChristmasTree } from './entities/ChristmasTree';
import { Cat } from './entities/Cat';
import { Star } from './entities/Star';
import { Ornament, OrnamentPool } from './entities/Ornament';

/**
 * Main game class
 * Handles lifecycle, renderer and scenes
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
  private boundOnResize: () => void;

  // Game entities
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

    // Store bound resize handler to properly remove later
    this.boundOnResize = this.onResize.bind(this);
    window.addEventListener('resize', this.boundOnResize);
  }

  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    console.log('🎄 Starting Christmas Cat Game...');

    // Create scene with entities
    this.createGameScene();

    // Add orbit controls for development
    this.setupDevControls();

    // Start render loop
    this.isRunning = true;
    this.animate();

    console.log('✅ Game initialized successfully');
  }

  /**
   * Setup development controls (OrbitControls)
   */
  private setupDevControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 5, 0);
    this.controls.update();
  }

  /**
   * Create main game scene with all entities
   */
  private createGameScene(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    // Configure shadow camera bounds to cover floor and tree area
    const shadowCam = directionalLight.shadow.camera as THREE.OrthographicCamera;
    const shadowExtent = 12;
    shadowCam.left = -shadowExtent;
    shadowCam.right = shadowExtent;
    shadowCam.top = shadowExtent;
    shadowCam.bottom = -shadowExtent;
    shadowCam.updateProjectionMatrix();
    this.scene.add(directionalLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d1810,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Create Christmas tree
    this.tree = new ChristmasTree();
    this.scene.add(this.tree.mesh);

    // Create star at the top
    this.star = new Star();
    const topPos = this.tree.getTopPosition();
    this.star.setPosition(topPos.x, topPos.y + 0.5, topPos.z);
    this.scene.add(this.star.mesh);

    // Create cat
    this.cat = new Cat();
    const startPos = this.tree.getCatPosition(0, 'left');
    if (startPos) {
      this.cat.setPosition(startPos.x, startPos.y, startPos.z);
    }
    this.cat.lookAt('right');
    this.scene.add(this.cat.mesh);

    // Create ornament pool and add some ornaments
    this.ornamentPool = new OrnamentPool();
    this.addOrnaments();

    // Development UI
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
      <p>Phase 2: Assets and Entities</p>
      <p style="font-size: 0.9rem; opacity: 0.7;">Use mouse to orbit camera</p>
    `;
    this.uiContainer.appendChild(statusDiv);
  }

  /**
   * Add decorative ornaments to tree
   */
  private addOrnaments(): void {
    if (!this.tree || !this.ornamentPool) return;

    // Add ornaments on some branches
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
   * Main animation loop
   */
  private animate(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update dev controls
    if (this.controls) {
      this.controls.update();
    }

    // Update entities
    if (this.tree) {
      this.tree.update(delta);
    }

    if (this.star) {
      this.star.update(delta);
    }

    if (this.cat) {
      this.cat.update(delta);
    }

    // Update ornaments and remove those out of bounds
    this.ornaments = this.ornaments.filter((ornament) => {
      ornament.update(delta);
      
      // Remove and recycle ornaments that fall below floor
      if (ornament.mesh.position.y < -5) {
        this.scene.remove(ornament.mesh);
        this.ornamentPool?.release(ornament);
        return false;
      }
      return true;
    });

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Destroy game and cleanup resources
   */
  destroy(): void {
    this.isRunning = false;
    window.removeEventListener('resize', this.boundOnResize);
    
    // Cleanup entities
    this.tree?.dispose();
    this.cat?.dispose();
    this.star?.dispose();
    this.ornamentPool?.dispose();
    
    // Cleanup controls
    this.controls?.dispose();
    
    this.renderer.dispose();
  }
}
