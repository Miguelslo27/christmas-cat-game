# 🎄 Plan de Desarrollo: Juego del Gatito Navideño

## 📋 Resumen del Concepto

Un juego móvil 3D donde un adorable gatito debe escalar un árbol de navidad desde adentro, esquivando obstáculos y manteniendo el equilibrio, para robar la estrella de la cima.

---

## 🛠️ Tecnología Recomendada

| Aspecto          | Recomendación                   | Justificación                                          |
| ---------------- | ------------------------------- | ------------------------------------------------------ |
| **Motor**        | Unity 3D (2022 LTS)             | Excelente para móvil, gran comunidad, Asset Store rica |
| **Renderizado**  | Universal Render Pipeline (URP) | Optimizado para móvil, efectos visuales atractivos     |
| **Modelado 3D**  | Blender                         | Gratuito, potente, exporta directo a Unity             |
| **Animación**    | Unity Animator + DOTween        | Animaciones fluidas y tweening eficiente               |
| **Lenguaje**     | C#                              | Nativo de Unity, robusto                               |
| **UI Framework** | Unity UI Toolkit                | Moderno, responsive para diferentes pantallas          |

---

## 📅 Fases de Desarrollo

### **FASE 1: Pre-producción (2-3 semanas)**

#### 1.1 Diseño de Documento (GDD)
- [ ] Documento de diseño completo
- [ ] Wireframes de UI/UX
- [ ] Storyboard de animaciones
- [ ] Definición de métricas (ramas, tiempo, puntuación)

#### 1.2 Análisis de Mecánicas
```
CONFIGURACIÓN SUGERIDA:
├── Ramas totales: 12-15 niveles
├── Tiempo base: 60 segundos
├── Globos por nivel: 1-2 (aumentan con altura)
├── Velocidad base del gatito: adaptable a dificultad
├── Umbral de desequilibrio: 5 unidades por lado
└── Penalización por movimiento vertical: +1 unidad desequilibrio
```

#### 1.3 Prototipo de Controles
- **Móvil**: Swipe izquierda/derecha/arriba o botones táctiles
- **Desktop**: Flechas del teclado
- Sugerencia: Añadir **controles por inclinación (giroscopio)** como opción

---

### **FASE 2: Arte y Assets 3D (4-5 semanas)**

#### 2.1 Escena del Living (Intro)
| Asset            | Estilo                        | Prioridad |
| ---------------- | ----------------------------- | --------- |
| Árbol de Navidad | Realista con toque cartoon    | ⭐⭐⭐       |
| Globos/Esferas   | Brillantes, reflejos          | ⭐⭐⭐       |
| Luces navideñas  | Emisivas, animadas            | ⭐⭐⭐       |
| Estrella (copa)  | Dorada, partículas brillantes | ⭐⭐⭐       |
| Pesebre          | Detallado pero estilizado     | ⭐⭐        |
| Regalos          | Coloridos, variados           | ⭐⭐        |
| Living (fondo)   | Acogedor, chimenea            | ⭐         |

#### 2.2 Personaje: Gatito
```
ESPECIFICACIONES DEL GATITO:
├── Estilo: Realista-Cartoon (estilo Pixar/Dreamworks)
├── Poligonaje: ~5,000-8,000 tris (optimizado móvil)
├── Rig: Esqueleto completo con cola expresiva
├── Texturas: PBR simplificado (Albedo, Normal, Emission ojos)
└── Expresiones: Ojos grandes, animables
```

**Animaciones del Gatito:**
1. `Idle` - respirando, cola moviéndose
2. `Sniff` - olfateando (pesebre/regalos)
3. `PrepareJump` - agachándose para saltar
4. `ClimbLeft` / `ClimbRight` - escalando
5. `ClimbUp` - subiendo
6. `Balance` - recuperando equilibrio
7. `Fall` - cayendo asustado
8. `Victory` - con estrella en boca
9. `RunAway` - huyendo despavorido

#### 2.3 Escenario Interior del Árbol
- Ramas estilizadas en capas
- Iluminación cálida (luces navideñas interiores)
- Fondo con efecto de profundidad (parallax)
- Globos con física simple

---

### **FASE 3: Programación Core (4-5 semanas)**

#### 3.1 Sistema de Control del Gatito
```csharp
// Estructura conceptual
public class CatController
{
    - CurrentBranch (int)
    - CurrentSide (Left/Right)
    - HandleInput()
    - MoveUp()
    - MoveSide()
    - ValidateMove() // Evitar movimiento inválido
}
```

#### 3.2 Sistema de Equilibrio
```
LÓGICA DE EQUILIBRIO:
├── Barra: -100 (izq) ← 0 (centro) → +100 (der)
├── Globo cae lado izq: +15 al equilibrio
├── Globo cae lado der: -15 al equilibrio
├── 3 subidas verticales consecutivas: ±20 (lado actual)
├── Recuperación pasiva: ±2/segundo hacia centro
├── Límite de pérdida: |equilibrio| >= 100
└── Zona segura (verde): |equilibrio| <= 30
```

#### 3.3 Sistema de Obstáculos
- Spawn aleatorio de globos en ramas
- Física de caída de globos
- Detección de colisión gatito-globo

#### 3.4 Sistema de Puntuación
```
FÓRMULA DE PUNTOS:
├── Base por rama subida: 100 pts
├── Bonus velocidad: (tiempo_restante / tiempo_total) * 500
├── Bonus equilibrio perfecto: +50 pts/rama si |eq| < 20
├── Penalización: -25 pts por casi caer
└── Multiplicador racha: x1.5 cada 5 ramas sin error
```

---

### **FASE 4: UI/UX (2 semanas)**

#### 4.1 Pantallas
1. **Intro Animada** → Living con árbol
2. **Menú Pre-juego** → Nombre + Reglas + Botón Comenzar
3. **HUD In-Game**:
   - Barra de equilibrio (arriba)
   - Timer (esquina superior)
   - Puntuación (esquina superior opuesta)
   - Controles táctiles (parte inferior)
4. **Pantalla Victoria** → Puntuación + Estrellas + Compartir
5. **Pantalla Derrota** → Animación caos + Reintentar

#### 4.2 Diseño Visual UI
- Estilo: Tarjetas navideñas vintage
- Colores: Rojo, verde, dorado, blanco
- Tipografía: Festiva pero legible
- Botones: Con animación de "nieve" o brillo

---

### **FASE 5: Audio (1-2 semanas)**

| Tipo                | Descripción                       |
| ------------------- | --------------------------------- |
| **Música Intro**    | Villancico orquestal suave        |
| **Música Gameplay** | Ritmo creciente, tensión navideña |
| **SFX Gatito**      | Maullidos, ronroneos, bufidos     |
| **SFX Globos**      | Pop suave, tintineo               |
| **SFX Victoria**    | Fanfarria alegre + cascabeles     |
| **SFX Derrota**     | Crash cómico + maullido triste    |

---

### **FASE 6: Animación Cinemática (2 semanas)**

#### 6.1 Secuencia de Intro
```
TIMELINE INTRO (30-40 seg):
0s   → Fade in: Living en penumbra navideña
3s   → Cámara avanza lentamente hacia árbol
8s   → Luces del árbol parpadean
12s  → Cámara baja hacia la base
15s  → Gatito aparece (lado aleatorio)
18s  → Olfatea pesebre (2 seg)
20s  → Olfatea regalos (2 seg)
24s  → Se agacha preparando salto
26s  → FREEZE → Aparece título del juego
28s  → Aparecen reglas + botón comenzar
```

#### 6.2 Transición al Gameplay
```
Al presionar COMENZAR:
0s   → Gatito salta hacia el árbol
0.5s → Cámara hace zoom rápido hacia las ramas
1s   → Flash blanco/verde
1.2s → Nueva escena: Interior del árbol
1.5s → UI aparece + Countdown "3, 2, 1, ¡SUBE!"
```

#### 6.3 Animación de Derrota
```
SECUENCIA CAOS:
0s   → Árbol tiembla violentamente
0.3s → Gatito pierde agarre
0.5s → Globos explotan en cadena
0.8s → Luces parpadean locamente
1s   → Árbol cae (cámara lenta)
1.5s → Estrella vuela por los aires
2s   → Gatito sale corriendo (expresión terror cómico)
2.5s → Pantalla de Game Over
```

---

### **FASE 7: Optimización Móvil (1-2 semanas)**

- [ ] LOD (Level of Detail) para modelos 3D
- [ ] Texture atlasing
- [ ] Object pooling para globos
- [ ] Occlusion culling
- [ ] Target: 60 FPS en dispositivos gama media
- [ ] Tamaño APK/IPA < 150MB

---

### **FASE 8: Testing y Polish (2-3 semanas)**

- [ ] Beta testing cerrado
- [ ] Ajuste de dificultad
- [ ] Pulido de animaciones
- [ ] Bug fixing
- [ ] Localización (ES, EN, PT mínimo)

---

## 💡 Sugerencias para Hacerlo Más Atractivo

### 🎮 Gameplay
1. **Modo Nocturno**: El árbol solo iluminado por luces, más difícil ver globos
2. **Power-ups**:
   - 🧲 Imán: Atrae puntos extra
   - ⏱️ Reloj: +10 segundos
   - 🛡️ Escudo: Ignora 1 desequilibrio
   - 🌟 Estrella fugaz: Sube 2 ramas instantáneo
3. **Combo System**: Movimientos perfectos encadenados = multiplicador
4. **Daily Challenges**: "Sube sin tocar globos rojos"

### 🎨 Visual
5. **Clima dinámico**: Nieve cayendo, ventisca ocasional
6. **Reacciones del gatito**: Expresiones faciales según equilibrio
7. **Partículas festivas**: Brillos, copos de nieve, destellos
8. **Celebración épica**: Al ganar, fuegos artificiales dentro del árbol

### 📱 Social
9. **Leaderboard semanal**: Rankings globales
10. **Compartir en redes**: GIF automático de la jugada final
11. **Logros**: "Acróbata" (ganar sin desequilibrarse), etc.

### 🔄 Rejugabilidad
12. **Sistema de niveles**: Árboles cada vez más altos
13. **Modo infinito**: ¿Qué tan alto puedes llegar?
14. **Eventos estacionales**: Halloween (árbol embrujado), etc.

---

## 💰 Estrategia de Monetización

### 1. 🛒 Compras In-App (IAP)

#### Skins de Gatitos
| Skin                  | Precio | Descripción                      |
| --------------------- | ------ | -------------------------------- |
| Gatito Naranja (base) | Gratis | Default                          |
| Gatito Blanco Persa   | $0.99  | Elegante, peludo                 |
| Gatito Negro Lucky    | $0.99  | Con collar dorado                |
| Gatito Siamés         | $1.99  | Ojos azules brillantes           |
| Gatito Santa 🎅        | $2.99  | Con gorrito navideño             |
| Gatito Reno 🦌         | $2.99  | Con cuernos y nariz roja         |
| Gatito Ángel 😇        | $4.99  | Con alas y aureola               |
| Gatito Legendario ✨   | $9.99  | Efectos de partículas especiales |

#### Skins de Árboles
| Skin             | Precio | Descripción             |
| ---------------- | ------ | ----------------------- |
| Clásico Verde    | Gratis | Default                 |
| Árbol Nevado     | $1.99  | Cubierto de nieve       |
| Árbol Dorado     | $2.99  | Luces y globos dorados  |
| Árbol Arcoíris   | $2.99  | Multicolor vibrante     |
| Árbol Cyberpunk  | $4.99  | Neón futurista          |
| Árbol de Cristal | $4.99  | Transparente, brillante |

#### Packs y Bundles
- **Starter Pack**: 1 skin gatito + 1 skin árbol + 500 monedas → $4.99
- **Holiday Bundle**: 3 skins gatito navideños → $6.99
- **Premium Pass**: Acceso a skins exclusivas mensuales → $2.99/mes

### 2. 📺 Publicidad

| Tipo               | Implementación                     | Recompensa Usuario |
| ------------------ | ---------------------------------- | ------------------ |
| **Rewarded Video** | Ver anuncio = vida extra / +15 seg | Voluntario         |
| **Interstitial**   | Entre partidas (cada 3-4 juegos)   | -                  |
| **Banner**         | Solo en menús, NUNCA en gameplay   | -                  |

**Opción Premium**: Remover anuncios → $3.99 (compra única)

### 3. 🎰 Economía Virtual

```
MONEDAS (Coins):
├── Ganar: 10-50 por partida según puntuación
├── Ganar: 100 por ver rewarded video
├── Ganar: 200 diarios por login
├── Comprar: $0.99 = 500 | $4.99 = 3000 | $9.99 = 7500
└── Usar: Comprar skins, power-ups, continues
```

### 4. 🏆 Battle Pass Estacional

**"Pase Navideño"** - $4.99 por temporada (1 mes)
- Nivel gratis: Recompensas básicas cada 10 niveles
- Nivel premium: Skin exclusiva + monedas + power-ups

### 5. 📊 Proyección de Ingresos

| Fuente            | % Estimado de Ingresos |
| ----------------- | ---------------------- |
| IAP Skins         | 35%                    |
| Publicidad        | 30%                    |
| Remover Anuncios  | 15%                    |
| Battle Pass       | 15%                    |
| Monedas virtuales | 5%                     |

---

## 📆 Timeline Completo

```
SEMANA 1-3:   Pre-producción + GDD
SEMANA 4-8:   Arte 3D + Animaciones
SEMANA 9-13:  Programación Core
SEMANA 14-15: UI/UX
SEMANA 16-17: Audio + Cinemáticas
SEMANA 18-19: Optimización
SEMANA 20-22: Testing + Polish
SEMANA 23:    Lanzamiento Soft (beta)
SEMANA 24:    Lanzamiento Global
─────────────────────────────────
TOTAL: ~6 meses para MVP
```

---

## 🎯 Nombre Sugerido para el Juego

| Opción                        | Idioma | Feeling                    |
| ----------------------------- | ------ | -------------------------- |
| **Paws & Climb**              | EN     | Moderno, juego de palabras |
| **Gatito de Navidad**         | ES     | Directo, tierno            |
| **Meow-ry Christmas**         | EN     | Gracioso, memorable        |
| **Tree Climber Cat**          | EN     | Descriptivo                |
| **La Estrella del Gato**      | ES     | Poético                    |
| **Whiskers' Christmas Heist** | EN     | Aventurero                 |

---

## ✅ Progreso del Proyecto

### Estado Actual
- [x] Plan de desarrollo creado
- [ ] Fase 1: Pre-producción
- [ ] Fase 2: Arte y Assets 3D
- [ ] Fase 3: Programación Core
- [ ] Fase 4: UI/UX
- [ ] Fase 5: Audio
- [ ] Fase 6: Animación Cinemática
- [ ] Fase 7: Optimización Móvil
- [ ] Fase 8: Testing y Polish
- [ ] Lanzamiento

---

> **Última actualización:** 26 de Diciembre, 2025
