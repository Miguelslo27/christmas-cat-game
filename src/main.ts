import './style.css';
import { Game } from './game/Game';

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  const uiContainer = document.getElementById('ui-container');

  if (!gameContainer || !uiContainer) {
    console.error('No se encontraron los contenedores del juego');
    return;
  }

  // Crear instancia del juego
  const game = new Game(gameContainer, uiContainer);

  // Iniciar el juego
  game.init();
});
