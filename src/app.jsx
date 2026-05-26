import { useCallback, useState } from 'react';

import GameOverScreen from './modules/endings/game-over-screen.jsx';
import WinScreen from './modules/endings/win-screen.jsx';
import Game from './modules/game/game.jsx';
import Menu from './modules/menu/menu.jsx';
import { SCREENS } from './modules/game/game.types.js';

export default function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [stepsPlanned, setStepsPlanned] = useState(10);
  const [endingScene, setEndingScene] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback((steps) => {
    setStepsPlanned(steps);
    setEndingScene(null);
    setGameKey((key) => key + 1);
    setScreen(SCREENS.GAME);
  }, []);

  const handleEnd = useCallback((nextScreen, scene) => {
    setEndingScene(scene);
    setScreen(nextScreen);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setEndingScene(null);
    setScreen(SCREENS.MENU);
  }, []);

  return (
    <div className="app">
      {screen === SCREENS.MENU && <Menu onStart={handleStart} />}

      {screen === SCREENS.GAME && (
        <Game
          key={gameKey}
          stepsPlanned={stepsPlanned}
          onEnd={handleEnd}
        />
      )}

      {screen === SCREENS.WIN && (
        <WinScreen scene={endingScene} onPlayAgain={handlePlayAgain} />
      )}

      {screen === SCREENS.GAMEOVER && (
        <GameOverScreen scene={endingScene} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
