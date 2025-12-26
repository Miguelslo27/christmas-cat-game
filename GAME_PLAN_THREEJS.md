# 🎄 Plan de Desarrollo: Juego del Gatito Navideño
## Versión Three.js + Capacitor

> **Stack**: Three.js + TypeScript + Vite + Capacitor  
> **Target**: Web + PWA + Android + iOS

---

## 📋 Resumen del Concepto

Un juego móvil 3D donde un adorable gatito debe escalar un árbol de navidad desde adentro, esquivando obstáculos y manteniendo el equilibrio, para robar la estrella de la cima.

---

## 🛠️ Stack Tecnológico

| Aspecto         | Tecnología                     | Justificación                       |
| --------------- | ------------------------------ | ----------------------------------- |
| **Motor 3D**    | Three.js                       | Potente, web-native, gran comunidad |
| **Lenguaje**    | TypeScript                     | Type-safety, mejor DX               |
| **Bundler**     | Vite                           | Rápido, HMR instantáneo             |
| **Animaciones** | Three.js AnimationMixer + GSAP | Fluidas y controlables              |
| **Físicas**     | Cannon-es (si necesario)       | Ligero, compatible                  |
| **UI**          | HTML/CSS + Tailwind            | Rápido, responsive                  |
| **Audio**       | Howler.js                      | Cross-browser, móvil friendly       |
| **Mobile**      | Capacitor                      | Empaqueta como app nativa           |
| **PWA**         | Vite PWA Plugin                | Service workers automáticos         |
| **Modelos 3D**  | GLTF/GLB                       | Estándar web, comprimidos           |

---

## 📁 Estructura del Proyecto

```
christmas-cat-game/
├── src/
│   ├── main.ts                 # Entry point
│   ├── game/
│   │   ├── Game.ts             # Clase principal del juego
│   │   ├── scenes/
│   │   │   ├── IntroScene.ts   # Living room + árbol
│   │   │   ├── GameScene.ts    # Interior del árbol (gameplay)
│   │   │   └── SceneManager.ts # Transiciones entre escenas
│   │   ├── entities/
│   │   │   ├── Cat.ts          # Gatito + animaciones
│   │   │   ├── Tree.ts         # Árbol de navidad
│   │   │   ├── Ornament.ts     # Globos/esferas
│   │   │   ├── Star.ts         # Estrella objetivo
│   │   │   └── Branch.ts       # Ramas del árbol
│   │   ├── systems/
│   │   │   ├── InputManager.ts # Touch + Keyboard
│   │   │   ├── BalanceSystem.ts# Lógica de equilibrio
│   │   │   ├── ScoreSystem.ts  # Puntuación
│   │   │   ├── TimeSystem.ts   # Temporizador
│   │   │   └── AudioManager.ts # Música + SFX
│   │   ├── ui/
│   │   │   ├── HUD.ts          # Barra equilibrio, timer, score
│   │   │   ├── MainMenu.ts     # Pantalla inicio
│   │   │   ├── GameOver.ts     # Pantalla derrota
│   │   │   └── Victory.ts      # Pantalla victoria
│   │   └── utils/
│   │       ├── AssetLoader.ts  # Carga de modelos/texturas
│   │       ├── Constants.ts    # Configuración del juego
│   │       └── Helpers.ts      # Funciones útiles
│   ├── assets/
│   │   ├── models/             # .glb/.gltf
│   │   ├── textures/           # .jpg/.png/.webp
│   │   ├── audio/              # .mp3/.ogg
│   │   └── fonts/              # Tipografías
│   └── styles/
│       └── main.css            # Estilos UI
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # App icons
├── android/                    # Generado por Capacitor
├── ios/                        # Generado por Capacitor
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── capacitor.config.ts
└── README.md
```

---

## 📅 Fases de Desarrollo

### **FASE 1: Setup del Proyecto (1 día)** ✅ COMPLETADA
> Semana 1

- [x] Inicializar proyecto Vite + TypeScript
- [x] Configurar Three.js
- [ ] Configurar ESLint + Prettier (omitido por ahora)
- [x] Estructura de carpetas
- [x] Setup básico de escena 3D (cubo de prueba)
- [x] Verificar que funciona en móvil (navegador)
- [x] First commit + Push a GitHub

**Entregable**: ✅ Proyecto corriendo con cubo 3D rotando

---

### **FASE 2: Assets y Modelos 3D (3-4 días)**
> Semana 1

#### 2.1 Búsqueda/Creación de Assets
| Asset          | Fuente                         | Estado |
| -------------- | ------------------------------ | ------ |
| Gatito 3D      | Sketchfab/Poly.pizza (free)    | [ ]    |
| Árbol Navidad  | Sketchfab/Crear con primitivas | [ ]    |
| Globos/Esferas | Crear con Three.js (esferas)   | [ ]    |
| Estrella       | Crear con Three.js (geometría) | [ ]    |
| Living Room    | Sketchfab o HDRI backdrop      | [ ]    |
| Regalos        | Cubos con texturas             | [ ]    |

#### 2.2 Sistema de Carga
- [ ] AssetLoader con loading screen
- [ ] Compresión de texturas (WebP)
- [ ] Optimización de modelos (Draco compression)

**Entregable**: Todos los assets cargando en escena

---

### **FASE 3: Escena Intro - Living Room (3-4 días)**
> Semana 2

- [ ] Montar escena del living
- [ ] Iluminación navideña (point lights cálidos)
- [ ] Árbol con luces animadas (emisivas parpadeando)
- [ ] Animación de cámara (approach al árbol)
- [ ] Gatito aparece y olfatea
- [ ] Animación de preparación para salto
- [ ] UI: Título del juego + Reglas + Botón comenzar
- [ ] Transición al gameplay (zoom + fade)

**Entregable**: Intro completa y jugable

---

### **FASE 4: Escena Gameplay - Interior del Árbol (5-6 días)**
> Semana 2-3

#### 4.1 Escenario
- [ ] Sistema de ramas (12-15 niveles)
- [ ] Ramas izquierda/derecha alternadas
- [ ] Decoración interior (luces, globos)
- [ ] Parallax background
- [ ] Cámara que sigue al gato

#### 4.2 Gatito en Gameplay
- [ ] Posicionamiento en ramas
- [ ] Animación subir izquierda
- [ ] Animación subir derecha
- [ ] Animación subir vertical
- [ ] Animación caer
- [ ] Animación victoria

#### 4.3 Globos/Obstáculos
- [ ] Spawn en ramas aleatorias
- [ ] Física de caída cuando gato pisa
- [ ] Variedad de colores

**Entregable**: Escenario navegable con gatito

---

### **FASE 5: Mecánicas Core (4-5 días)**
> Semana 3

#### 5.1 Sistema de Controles
```typescript
// InputManager
- Flechas teclado (desktop)
- Swipe gestures (móvil)  
- Botones táctiles opcionales
- Validación de movimientos
```

#### 5.2 Sistema de Movimiento
```typescript
// Reglas de movimiento
- Si está en izquierda y va arriba → sube por izquierda
- Si está en izquierda y va derecha → cambia a derecha
- Si está en izquierda y va izquierda → PIERDE (cae)
- Primer movimiento arriba → lado aleatorio
- Nunca puede subir por el centro
```

#### 5.3 Sistema de Equilibrio
```typescript
// BalanceSystem
equilibrio: number = 0  // -100 a +100

- Globo cae izquierda: +15
- Globo cae derecha: -15  
- 3 subidas verticales seguidas: ±20
- Recuperación: ±2/segundo hacia 0
- |equilibrio| >= 100 → PIERDE
```

#### 5.4 Sistema de Puntuación
```typescript
// ScoreSystem
- +100 pts por rama
- Bonus velocidad al final
- Multiplicador por equilibrio perfecto
- Combo por movimientos sin error
```

#### 5.5 Sistema de Tiempo
```typescript
// TimeSystem
- 60 segundos base
- Countdown visible
- Tiempo agotado → PIERDE
- Tiempo restante → bonus puntos
```

**Entregable**: Juego completamente jugable

---

### **FASE 6: UI/HUD (2-3 días)**
> Semana 4

#### 6.1 HUD In-Game
- [ ] Barra de equilibrio (gradiente verde→rojo)
- [ ] Indicador central en barra
- [ ] Timer countdown
- [ ] Score actual
- [ ] Botón pausa

#### 6.2 Pantallas
- [ ] Menú principal (después de intro)
- [ ] Pantalla de pausa
- [ ] Pantalla victoria (score + estrellas)
- [ ] Pantalla game over (razón + reintentar)

#### 6.3 Responsive Design
- [ ] Adaptar a diferentes aspect ratios
- [ ] Controles táctiles bien posicionados
- [ ] Textos legibles en móvil

**Entregable**: UI completa y funcional

---

### **FASE 7: Audio (2 días)**
> Semana 4

- [ ] Integrar Howler.js
- [ ] Música intro (loop suave)
- [ ] Música gameplay (más intensa)
- [ ] SFX: maullidos gatito
- [ ] SFX: globos cayendo
- [ ] SFX: pasos en ramas
- [ ] SFX: victoria (fanfarria)
- [ ] SFX: derrota (crash)
- [ ] Controles de volumen
- [ ] Mute toggle

**Entregable**: Audio completo implementado

---

### **FASE 8: Animaciones Cinemáticas (3 días)**
> Semana 5

#### 8.1 Intro (usando GSAP Timeline)
```javascript
timeline:
  0.0s - Fade in living
  3.0s - Cámara avanza
  8.0s - Luces parpadean
  12s  - Cámara baja a base
  15s  - Gatito aparece
  18s  - Olfatea pesebre
  22s  - Olfatea regalos
  26s  - Se prepara para saltar
  28s  - UI aparece
```

#### 8.2 Victoria
- [ ] Gatito toma estrella
- [ ] Salta hacia cámara
- [ ] Partículas de celebración
- [ ] Fade a pantalla victoria

#### 8.3 Derrota - Caída
- [ ] Árbol tiembla
- [ ] Gatito cae
- [ ] Salta asustado fuera de pantalla
- [ ] Fade a game over

#### 8.4 Derrota - Tiempo
- [ ] Alarma visual
- [ ] Gatito mira nervioso
- [ ] Salta del árbol
- [ ] Fade a game over

**Entregable**: Todas las cinemáticas funcionando

---

### **FASE 9: PWA + Optimización (2 días)**
> Semana 5

#### 9.1 PWA
- [ ] manifest.json completo
- [ ] Iconos en todos los tamaños
- [ ] Service Worker (cache assets)
- [ ] Splash screens
- [ ] Modo offline (al menos menú)

#### 9.2 Optimización
- [ ] Lazy loading de assets
- [ ] Texture compression
- [ ] Model optimization (Draco)
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Target: 60 FPS móvil gama media
- [ ] Target: < 20MB total assets

**Entregable**: PWA instalable y optimizada

---

### **FASE 10: Capacitor - Apps Nativas (2 días)**
> Semana 6

#### 10.1 Setup
- [ ] Instalar Capacitor
- [ ] Configurar capacitor.config.ts
- [ ] Generar proyecto Android
- [ ] Generar proyecto iOS

#### 10.2 Android
- [ ] Build APK de prueba
- [ ] Probar en emulador
- [ ] Probar en dispositivo real
- [ ] Ajustes de rendimiento

#### 10.3 iOS (si tienes Mac)
- [ ] Build en Xcode
- [ ] Probar en simulador
- [ ] Probar en dispositivo

#### 10.4 Plugins Nativos (opcionales)
- [ ] AdMob (publicidad)
- [ ] In-App Purchases
- [ ] Share (compartir score)

**Entregable**: APK/IPA funcionando

---

### **FASE 11: Testing y Polish (3-4 días)**
> Semana 6

- [ ] Testing en múltiples dispositivos
- [ ] Testing en múltiples navegadores
- [ ] Ajuste de dificultad
- [ ] Balanceo de puntuación
- [ ] Bug fixing
- [ ] Pulido visual
- [ ] Feedback de beta testers

**Entregable**: Juego pulido listo para launch

---

### **FASE 12: Publicación (2-3 días)**
> Semana 7

#### 12.1 Web
- [ ] Deploy en Vercel/Netlify
- [ ] Dominio personalizado (opcional)
- [ ] Analytics (opcional)

#### 12.2 Play Store
- [ ] Cuenta de desarrollador ($25)
- [ ] Screenshots y assets para store
- [ ] Descripción y metadata
- [ ] Subir AAB
- [ ] Publicar

#### 12.3 App Store (opcional)
- [ ] Cuenta de desarrollador ($99/año)
- [ ] Assets para store
- [ ] Subir a App Store Connect
- [ ] Review de Apple

**Entregable**: 🚀 JUEGO PUBLICADO

---

## 📆 Timeline Resumido

```
SEMANA 1:  Setup + Assets + Inicio Intro
SEMANA 2:  Intro completa + Inicio Gameplay
SEMANA 3:  Gameplay + Mecánicas Core
SEMANA 4:  UI/HUD + Audio
SEMANA 5:  Cinemáticas + PWA + Optimización  
SEMANA 6:  Capacitor + Testing + Polish
SEMANA 7:  Publicación
─────────────────────────────────────────
TOTAL: ~7 semanas para release
```

---

## 🎮 Recursos de Assets Gratuitos

### Modelos 3D
| Sitio               | URL                              | Licencia |
| ------------------- | -------------------------------- | -------- |
| Poly Pizza          | poly.pizza                       | CC0      |
| Sketchfab           | sketchfab.com (filtrar por free) | Varies   |
| Quaternius          | quaternius.com                   | CC0      |
| Kenney              | kenney.nl/assets                 | CC0      |
| Google Poly Archive | poly.pizza/google                | CC-BY    |

### Audio
| Sitio       | URL             | Licencia         |
| ----------- | --------------- | ---------------- |
| Freesound   | freesound.org   | CC/CC0           |
| Mixkit      | mixkit.co       | Free             |
| OpenGameArt | opengameart.org | Varies           |
| Zapsplat    | zapsplat.com    | Free with credit |

### Texturas
| Sitio        | URL                      |
| ------------ | ------------------------ |
| Polyhaven    | polyhaven.com            |
| ambientCG    | ambientcg.com            |
| Textures.com | textures.com (free tier) |

---

## 💰 Estrategia de Monetización

*(Misma que el plan original, compatible con web + apps)*

### 1. Compras In-App
- Skins de gatitos
- Skins de árboles
- Power-ups
- Moneda virtual

### 2. Publicidad
- Rewarded videos (vida extra)
- Interstitials (entre partidas)
- Banner en menús

### 3. Premium
- Remover anuncios: $3.99
- Bundle inicial: $4.99

### Implementación Técnica
```typescript
// Web: Integrar con servicios como
- Google AdSense (banners web)
- Stripe/Paddle (pagos web)

// Capacitor: Plugins nativos
- @capacitor-community/admob
- @capacitor-community/in-app-purchases
```

---

## ✅ Progreso del Proyecto

### Estado Actual: 🟡 Planificación

- [x] Plan original Unity (referencia)
- [x] Plan Three.js + Capacitor
- [x] **FASE 1**: Setup del Proyecto ✅
- [ ] **FASE 2**: Assets y Modelos 3D ← SIGUIENTE
- [ ] **FASE 3**: Escena Intro
- [ ] **FASE 4**: Escena Gameplay
- [ ] **FASE 5**: Mecánicas Core
- [ ] **FASE 6**: UI/HUD
- [ ] **FASE 7**: Audio
- [ ] **FASE 8**: Animaciones Cinemáticas
- [ ] **FASE 9**: PWA + Optimización
- [ ] **FASE 10**: Capacitor
- [ ] **FASE 11**: Testing y Polish
- [ ] **FASE 12**: Publicación

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev             # Servidor desarrollo
pnpm build           # Build producción
pnpm preview         # Preview build

# Capacitor
pnpm cap add android # Agregar Android
pnpm cap add ios     # Agregar iOS
pnpm cap sync        # Sincronizar código
pnpm cap open android# Abrir Android Studio
pnpm cap open ios    # Abrir Xcode
```

---

> **Última actualización:** 26 de Diciembre, 2025  
> **Stack**: Three.js + TypeScript + Vite + Capacitor  
> **Repo**: https://github.com/Miguelslo27/christmas-cat-game
