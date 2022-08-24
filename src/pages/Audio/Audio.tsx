import styles from './Audio.module.css'
import AudioImg from './assets/audio.png'
import { ERoutes } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const baseLink = 'http://localhost:1488/';

type wordObj = {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}

interface IState {
  isLoaded: boolean,
  words: wordObj[];
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateWords = (words: wordObj[]) => {
  for (let i = 0 ; (i < 5) && (i < words.length) ; i++) {
    const r = getRandomIntInclusive(0, 19);
    const word = words[r];
    words[r] = words[i];
    words[i] = word;
  }

  return words.slice(0, 5);
}



export const AudioComp = () => {
  const [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState({});
  const [audio, setAudio] = useState(new Audio);
  const [newWords, setnewWords] = useState<wordObj[]>([]);
  const [appState, setAppState] = useState<IState>({
    isLoaded: false,
    words: [],
  });

  const startAgain = () => {
    setnewWords([]);
  }

  useEffect(() => {
    fetch(`${baseLink}words?page=${getRandomIntInclusive(0, 29)}&group=${getRandomIntInclusive(0, 5)}`)
      .then((res) => res.json())
      .then(
        (words) => {
          setAppState({ isLoaded: true, words });
          const newArr = generateWords(words);
          setnewWords(newArr)
          
          const myAnswer = newArr[getRandomIntInclusive(0, 4)];
          console.log(myAnswer)
          setAnswer(myAnswer);
          setAudio(new Audio(`${baseLink}${myAnswer.audio}`))
        },
        (error) => {
          setAppState({ isLoaded: false, words: [] });
        }
      )
  }, []);

  const checkForAnswer = ({target}) => {
    if (target.innerText.split(' ')[1] === answer.wordTranslate) {
      console.log('correct')
    } else {
      console.log('incorrect')
    }
  }

  const togglePlay = () => setPlaying(!playing);
  // const changeAudio = () => setAudio(createNewAudio(audioLink))

  useEffect(() => {
    if (playing) {
      audio.play();
    }
    // playing ? audio.play() : audio.pause();
  }, [playing] );
    
  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  if (!appState.isLoaded) {
    return <div>Загрузка...</div>;
  } else {
    return (
      <div className={styles.audio}>
        <div className={styles.wrapper}>
          <div className={styles.controls}>
            <span>Mute</span>
            <span onClick={() => openFullscreen(document.documentElement)}>Fullscreen</span>
            
            <Link to={`${ERoutes.games}`}>
              <span>Exit</span>
            </Link>
          </div>

          <div className={styles.main}>
            <div className='audio-img' onClick={togglePlay}>
              <img src={AudioImg} alt="" />
            </div>
            
            <div className={styles.words}>
              {newWords && newWords.map(({wordTranslate, id}, index) => {
                return <button onClick={(e) => checkForAnswer(e)} key={id}>{index + 1}. {wordTranslate}</button>
              })}
            </div>
            
            <button id={styles.result}>Не знаю</button>
            <button>Change Audio</button>
          </div>

        </div>
      </div>
    ) 
  }
};
