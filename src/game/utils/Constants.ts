/**
 * Game configuration constants
 */

// Game configuration
export const GAME_CONFIG = {
  // Mechanics
  TOTAL_BRANCHES: 12,
  TIME_LIMIT: 60, // seconds
  ORNAMENTS_PER_LEVEL: 1, // increases with height

  // Balance
  BALANCE_MAX: 100,
  BALANCE_ORNAMENT_FALL: 15,
  BALANCE_VERTICAL_PENALTY: 20,
  BALANCE_RECOVERY_RATE: 2, // per second
  BALANCE_SAFE_ZONE: 30,
  CONSECUTIVE_VERTICAL_LIMIT: 3,

  // Scoring
  POINTS_PER_BRANCH: 100,
  POINTS_SPEED_BONUS_MAX: 500,
  POINTS_PERFECT_BALANCE_BONUS: 50,
  POINTS_NEAR_FALL_PENALTY: 25,
  COMBO_MULTIPLIER: 1.5,
  COMBO_THRESHOLD: 5, // branches without error
} as const;

// Visual configuration
export const VISUAL_CONFIG = {
  // Christmas colors
  COLORS: {
    TREE_GREEN: 0x1a472a,
    TREE_GREEN_LIGHT: 0x2d5a3d,
    CHRISTMAS_RED: 0xcc0000,
    CHRISTMAS_GOLD: 0xffd700,
    STAR_GOLD: 0xffed4a,
    ORNAMENT_RED: 0xff0000,
    ORNAMENT_BLUE: 0x0066cc,
    ORNAMENT_SILVER: 0xc0c0c0,
    ORNAMENT_PURPLE: 0x9932cc,
    LIGHT_WARM: 0xffaa55,
    LIGHT_COOL: 0x55aaff,
  },

  // Camera
  CAMERA: {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    INTRO_POSITION: { x: 0, y: 2, z: 10 },
    GAMEPLAY_POSITION: { x: 0, y: 0, z: 8 },
  },
} as const;

// Controls configuration
export const CONTROLS_CONFIG = {
  // Touch
  SWIPE_THRESHOLD: 50, // minimum pixels to detect swipe
  SWIPE_TIMEOUT: 300, // max ms for a swipe

  // Keyboard
  KEYS: {
    UP: ['ArrowUp', 'KeyW'],
    DOWN: ['ArrowDown', 'KeyS'],
    LEFT: ['ArrowLeft', 'KeyA'],
    RIGHT: ['ArrowRight', 'KeyD'],
    PAUSE: ['Escape', 'KeyP'],
  },
} as const;

// Game states
export const GameState = {
  LOADING: 'loading',
  INTRO: 'intro',
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  VICTORY: 'victory',
  GAME_OVER: 'game_over',
} as const;
export type GameState = (typeof GameState)[keyof typeof GameState];

// Tree sides
export const TreeSide = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;
export type TreeSide = (typeof TreeSide)[keyof typeof TreeSide];

// Game over reasons
export const GameOverReason = {
  FELL_OFF: 'fell_off', // Fell off the tree
  TIME_UP: 'time_up', // Time ran out
  LOST_BALANCE: 'lost_balance', // Lost balance
  WRONG_MOVE: 'wrong_move', // Invalid move
} as const;
export type GameOverReason = (typeof GameOverReason)[keyof typeof GameOverReason];
