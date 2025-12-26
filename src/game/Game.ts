import * as THREE from 'three';

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

  // Cubo de prueba (temporal)
  private testCube: THREE.Mesh | null = null;

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
    this.camera.position.z = 5;

    // Manejar resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  /**
   * Inicializar el juego
   */
  async init(): Promise<void> {
    console.log('🎄 Iniciando Christmas Cat Game...');

    // Crear escena de prueba
    this.createTestScene();

    // Iniciar loop de renderizado
    this.isRunning = true;
    this.animate();

    console.log('✅ Juego inicializado correctamente');
  }

  /**
   * Crear escena de prueba con un cubo rotando
   * (Se reemplazará con las escenas reales)
   */
  private createTestScene(): void {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Luz direccional (simula luz navideña cálida)
    const directionalLight = new THREE.DirectionalLight(0xffd700, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Cubo de prueba (representa futuro árbol/gatito)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcc0000, // Rojo navideño
      metalness: 0.3,
      roughness: 0.7,
    });
    this.testCube = new THREE.Mesh(geometry, material);
    this.testCube.castShadow = true;
    this.scene.add(this.testCube);

    // Esfera decorativa (globo navideño)
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // Dorado
      metalness: 0.8,
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(1.5, 0, 0);
    this.scene.add(sphere);

    // Texto de estado en UI
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
    `;
    statusDiv.innerHTML = `
      <h2>🎄 Christmas Cat Game</h2>
      <p>Setup completado - Three.js funcionando</p>
      <p style="font-size: 0.9rem; opacity: 0.7;">Fase 1 ✓</p>
    `;
    this.uiContainer.appendChild(statusDiv);
  }

  /**
   * Loop principal de animación
   */
  private animate(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Rotar cubo de prueba
    if (this.testCube) {
      this.testCube.rotation.x += 0.5 * delta;
      this.testCube.rotation.y += 0.8 * delta;
    }

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
    this.renderer.dispose();
  }
}
