import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import "./App.css";
const NUMB_OF_WORDS = 350;
const SECONDS = 300;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "has-background-success";
      } else {
        return "has-background-failure";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
  }

  return (
    <div className="container">
      <h1 className="heading">Typing Test</h1>
      <div className="timer-section">
        <h2>Timer :</h2>
        <h2 className="timer">
          {countDown}
          <span className="seconds">sec</span>
        </h2>
      </div>
      <div className="input-section">
        <input
          ref={textInput}
          disabled={status !== "started"}
          type="text"
          className="input-box"
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>
      <div className="button-section">
        <button className="button" onClick={start}>
          Start
        </button>
      </div>
      {status === "started" && (
        <div className="para-section">
          {words.map((word, i) => (
            <span key={i}>
              <span>
                {word.split("").map((char, idx) => (
                  <span className={getCharClass(i, idx, char)} key={idx}>
                    {char}
                  </span>
                ))}
              </span>
              <span> </span>
            </span>
          ))}
        </div>
      )}
      {status === "finished" ? (
        <div className="word-count-section">
          <div>
            <p>Words per minute:</p>
            <h3>{correct}</h3>
          </div>
          <div>
            <p>Accuracy:</p>
            {correct !== 0 ? (
              <h3>{Math.round((correct / (correct + incorrect)) * 100)}%</h3>
            ) : (
              <h3>0%</h3>
            )}
          </div>
        </div>
      ) : (
        <div className="word-count-section">
          <div>
            <p>Words per minute:</p>
            <h3>{correct}</h3>
          </div>
          <div>
            <p>Accuracy:</p>
            {correct !== 0 ? (
              <h3>{Math.round((correct / (correct + incorrect)) * 100)}%</h3>
            ) : (
              <h3>0%</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
