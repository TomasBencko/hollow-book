import { useCallback, useState } from 'react';



import GameOverScreen from './modules/endings/game-over-screen.jsx';

import WinScreen from './modules/endings/win-screen.jsx';

import LoadingIndicator from './modules/game/components/loading-indicator.jsx';

import Game from './modules/game/game.jsx';

import { appendToHistory, loadSceneImage, startGame } from './modules/game/game.service.js';

import { getScreenFromScene } from './modules/game/game.state.js';

import { SCREENS } from './modules/game/game.types.js';

import Menu from './modules/menu/menu.jsx';



export default function App() {

  const [screen, setScreen] = useState(SCREENS.MENU);

  const [ending, setEnding] = useState(null);

  const [gameBoot, setGameBoot] = useState(null);

  const [gameKey, setGameKey] = useState(0);



  const handleStart = useCallback(async (settings) => {

    setEnding(null);

    setGameKey((key) => key + 1);

    setGameBoot({ status: 'loading', settings });

    setScreen(SCREENS.GAME);



    try {

      const { scene } = await startGame(settings);

      const history = appendToHistory([], 'Začni novú hru.', scene);

      const nextScreen = getScreenFromScene(scene);



      if (nextScreen !== SCREENS.GAME) {

        const imageUrl = await loadSceneImage(scene);

        setEnding({ scene, imageUrl });

        setGameBoot(null);

        setScreen(nextScreen);

        return;

      }



      setGameBoot({ status: 'ready', settings, scene, imageUrl: null, history });

    } catch (error) {

      setGameBoot({ status: 'error', settings, error: error.message });

    }

  }, []);



  const handleEnd = useCallback((nextScreen, scene, imageUrl) => {

    setEnding({ scene, imageUrl });

    setGameBoot(null);

    setScreen(nextScreen);

  }, []);



  const handlePlayAgain = useCallback(() => {

    setEnding(null);

    setGameBoot(null);

    setScreen(SCREENS.MENU);

  }, []);



  return (

    <div className="app">

      {screen === SCREENS.MENU && <Menu onStart={handleStart} />}



      {screen === SCREENS.GAME && gameBoot?.status === 'loading' && (

        <div className="screen screen--game">

          <div className="game-loading-screen">

            <LoadingIndicator message="Otváram príbeh..." />

          </div>

        </div>

      )}



      {screen === SCREENS.GAME && gameBoot?.status === 'error' && (

        <div className="screen screen--game">

          <div className="game-loading-screen">

            <div className="error-banner" role="alert">{gameBoot.error}</div>

            <button type="button" className="btn btn-primary" onClick={handlePlayAgain}>

              Späť do menu

            </button>

          </div>

        </div>

      )}



      {screen === SCREENS.GAME && gameBoot?.status === 'ready' && (

        <Game

          key={gameKey}

          gameSettings={gameBoot.settings}

          initialState={{

            scene: gameBoot.scene,

            imageUrl: gameBoot.imageUrl,

            history: gameBoot.history,

          }}

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


