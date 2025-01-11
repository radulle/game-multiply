import { useEffect, useState } from 'react';
import './App.css';

type Highscore = { player: string; score: number };
type Status = 'idle' | 'running' | 'finished';

const INIT_COUNTER = 60;
const rndInt = () => Math.floor(Math.random() * 10) + 1;

function App() {
  const [highscores, setHighscores] = useState<Highscore[]>(() =>
    JSON.parse(localStorage.getItem('highscores') || '[]')
  );
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [counter, setCounter] = useState(INIT_COUNTER);
  const [a, setA] = useState(rndInt);
  const [b, setB] = useState(rndInt);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      setCounter((c) => {
        if (c <= 0) {
          // Game finished
          clearInterval(interval);
          setStatus('idle');
          const nHightscores = structuredClone(highscores);
          const currScore = nHightscores.find((e) => e.player === player);
          if (currScore) {
            if (currScore.score < score) {
              currScore.score = score;
              nHightscores.sort((a, b) => (b.score - a.score ? 1 : -1));
              setHighscores(nHightscores);
              localStorage.setItem('highscores', JSON.stringify(nHightscores));
            }
          } else {
            nHightscores.push({ player, score });
            nHightscores.sort((a, b) => (b.score - a.score ? 1 : -1));
            setHighscores(nHightscores);
            localStorage.setItem('highscores', JSON.stringify(nHightscores));
          }
          return INIT_COUNTER;
        }
        return c - 1;
      });
    }, 1_000);

    return () => void (interval && clearInterval(interval));
  }, [status, score]);

  const handleAnswer = () => {
    if (parseInt(answer) === a * b) setScore((s) => s + 1);
    setAnswer('');
    setA(rndInt);
    setB(rndInt);
  };

  return (
    <>
      <img src="./multiply.svg" height="96" width="96" />
      <p>
        <label htmlFor="player">Player name</label>
        <br />
        {status !== 'running' ? (
          <input
            id="player"
            name="player"
            autoFocus
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            onKeyUp={e => {
              if (e.code !== 'Enter') return;
              setStatus('running');
            }}
          />
        ) : (
          <div>{player}</div>
        )}
      </p>
      {status === 'running' && (
        <p>
          <p>
            {a} x {b}
          </p>

          <input
            id="answer"
            name="answer"
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={status !== 'running'}
            onKeyUp={(e) => {
              if (e.code !== 'Enter') return;
              handleAnswer();
            }}
          />
          <br />
          <button
            onClick={handleAnswer}
            disabled={status !== 'running'}
            style={{ marginTop: 16 }}
          >
            Answer
          </button>
        </p>
      )}

      {status === 'idle' && !!player.length && (
        <button
          onClick={() => {
            setStatus('running');
            setScore(0);
          }}
          disabled={!player.length}
        >
          Start
        </button>
      )}
      {status !== 'idle' && (
        <button
          onClick={() => {
            setStatus('idle');
            setCounter(INIT_COUNTER);
          }}
        >
          Reset
        </button>
      )}
      <hr />
      <h3>
        <div style={{ fontSize: 12 }}>Timer</div>
        {counter}
      </h3>
      <h3>
        <div style={{ fontSize: 12 }}>Score</div>
        {score}
      </h3>

      <hr />
      <table
        style={{ border: '1px solid gray', borderRadius: 8, marginTop: 32 }}
      >
        <tr>
          <th style={{ minWidth: 200 }}>name</th>
          <th style={{ minWidth: 100 }}>score</th>
        </tr>
        {highscores.map(({ player, score }) => (
          <tr>
            <td>{player}</td>
            <td>{score}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default App;
