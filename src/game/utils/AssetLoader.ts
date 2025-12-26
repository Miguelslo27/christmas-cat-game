import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Asset types supported by the loader
 */
export type AssetType = 'texture' | 'model' | 'audio' | 'cubeTexture';

/**
 * Asset definition for loading
 */
export interface AssetDefinition {
  name: string;
  type: AssetType;
  path: string;
  options?: {
    colorSpace?: THREE.ColorSpace;
    flipY?: boolean;
  };
}

/**
 * Loaded assets storage
 */
export interface LoadedAssets {
  textures: Map<string, THREE.Texture>;
  models: Map<string, GLTF>;
  audio: Map<string, AudioBuffer>;
  cubeTextures: Map<string, THREE.CubeTexture>;
}

/**
 * Loading progress callback
 */
export type ProgressCallback = (loaded: number, total: number, assetName: string) => void;

/**
 * AssetLoader - Sistema centralizado de carga de assets
 * Soporta modelos GLTF/GLB, texturas, audio y más
 */
export class AssetLoader {
  private textureLoader: THREE.TextureLoader;
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private cubeTextureLoader: THREE.CubeTextureLoader;
  private audioContext: AudioContext | null = null;

  private loadedAssets: LoadedAssets = {
    textures: new Map(),
    models: new Map(),
    audio: new Map(),
    cubeTextures: new Map(),
  };

  private loadingManager: THREE.LoadingManager;
  private onProgressCallback: ProgressCallback | null = null;

  constructor() {
    // Loading manager para trackear progreso
    this.loadingManager = new THREE.LoadingManager();

    // Texture loader
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    // GLTF loader con Draco compression
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // Cube texture loader (para environment maps)
    this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
  }

  /**
   * Cargar una lista de assets
   */
  async loadAssets(
    assets: AssetDefinition[],
    onProgress?: ProgressCallback
  ): Promise<LoadedAssets> {
    this.onProgressCallback = onProgress || null;

    const total = assets.length;
    let loaded = 0;

    const promises = assets.map(async (asset) => {
      try {
        await this.loadAsset(asset);
        loaded++;
        if (this.onProgressCallback) {
          this.onProgressCallback(loaded, total, asset.name);
        }
      } catch (error) {
        console.error(`Error loading asset: ${asset.name}`, error);
        throw error;
      }
    });

    await Promise.all(promises);

    return this.loadedAssets;
  }

  /**
   * Cargar un asset individual
   */
  private async loadAsset(asset: AssetDefinition): Promise<void> {
    switch (asset.type) {
      case 'texture':
        await this.loadTexture(asset);
        break;
      case 'model':
        await this.loadModel(asset);
        break;
      case 'audio':
        await this.loadAudio(asset);
        break;
      case 'cubeTexture':
        await this.loadCubeTexture(asset);
        break;
    }
  }

  /**
   * Cargar una textura
   */
  private loadTexture(asset: AssetDefinition): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        asset.path,
        (texture) => {
          // Aplicar opciones
          if (asset.options?.flipY !== undefined) {
            texture.flipY = asset.options.flipY;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          
          this.loadedAssets.textures.set(asset.name, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * Cargar un modelo GLTF/GLB
   */
  private loadModel(asset: AssetDefinition): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        asset.path,
        (gltf) => {
          // Configurar sombras en todos los meshes
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          this.loadedAssets.models.set(asset.name, gltf);
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * Cargar audio
   */
  private async loadAudio(asset: AssetDefinition): Promise<AudioBuffer> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const response = await fetch(asset.path);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    this.loadedAssets.audio.set(asset.name, audioBuffer);
    return audioBuffer;
  }

  /**
   * Cargar cube texture (environment map)
   */
  private loadCubeTexture(asset: AssetDefinition): Promise<THREE.CubeTexture> {
    return new Promise((resolve, reject) => {
      // Asume que el path es un array de 6 imágenes [px, nx, py, ny, pz, nz]
      const paths = [
        `${asset.path}/px.jpg`,
        `${asset.path}/nx.jpg`,
        `${asset.path}/py.jpg`,
        `${asset.path}/ny.jpg`,
        `${asset.path}/pz.jpg`,
        `${asset.path}/nz.jpg`,
      ];

      this.cubeTextureLoader.load(
        paths,
        (cubeTexture) => {
          this.loadedAssets.cubeTextures.set(asset.name, cubeTexture);
          resolve(cubeTexture);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * Obtener una textura cargada
   */
  getTexture(name: string): THREE.Texture | undefined {
    return this.loadedAssets.textures.get(name);
  }

  /**
   * Obtener un modelo cargado
   */
  getModel(name: string): GLTF | undefined {
    return this.loadedAssets.models.get(name);
  }

  /**
   * Obtener audio cargado
   */
  getAudio(name: string): AudioBuffer | undefined {
    return this.loadedAssets.audio.get(name);
  }

  /**
   * Obtener cube texture cargada
   */
  getCubeTexture(name: string): THREE.CubeTexture | undefined {
    return this.loadedAssets.cubeTextures.get(name);
  }

  /**
   * Clonar un modelo (útil para instanciar múltiples copias)
   */
  cloneModel(name: string): THREE.Group | undefined {
    const gltf = this.loadedAssets.models.get(name);
    if (gltf) {
      return gltf.scene.clone();
    }
    return undefined;
  }

  /**
   * Limpiar todos los assets cargados
   */
  dispose(): void {
    // Dispose textures
    this.loadedAssets.textures.forEach((texture) => texture.dispose());
    this.loadedAssets.textures.clear();

    // Dispose models
    this.loadedAssets.models.forEach((gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    this.loadedAssets.models.clear();

    // Dispose cube textures
    this.loadedAssets.cubeTextures.forEach((texture) => texture.dispose());
    this.loadedAssets.cubeTextures.clear();

    // Clear audio
    this.loadedAssets.audio.clear();

    // Dispose Draco loader
    this.dracoLoader.dispose();
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();
