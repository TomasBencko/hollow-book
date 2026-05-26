import { useCallback, useState } from 'react';

import GameOverScreen from './modules/endings/game-over-screen.jsx';
import WinScreen from './modules/endings/win-screen.jsx';
import Game from './modules/game/game.jsx';
import Menu from './modules/menu/menu.jsx';
import { SCREENS } from './modules/game/game.types.js';

export default function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [gameSettings, setGameSettings] = useState(null);
  const [ending, setEnding] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback((settings) => {
    setGameSettings(settings);
    setEnding(null);
    setGameKey((key) => key + 1);
    setScreen(SCREENS.GAME);
  }, []);

  const handleEnd = useCallback((nextScreen, scene, imageUrl) => {
    setEnding({ scene, imageUrl });
    setScreen(nextScreen);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setEnding(null);
    setScreen(SCREENS.MENU);
  }, []);

  return (
    <div className="app">
      {screen === SCREENS.MENU && <Menu onStart={handleStart} />}

      {screen === SCREENS.GAME && gameSettings && (
        <Game
          key={gameKey}
          gameSettings={gameSettings}
          onEnd={handleEnd}
        />
      )}

      {screen === SCREENS.WIN && (
        <WinScreen scene={ending?.scene} imageUrl={ending?.imageUrl} onPlayAgain={handlePlayAgain} />
      )}

      {screen === SCREENS.GAMEOVER && (
        <GameOverScreen scene={ending?.scene} imageUrl={ending?.imageUrl} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
