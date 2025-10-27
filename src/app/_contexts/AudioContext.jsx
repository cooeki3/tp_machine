"use client";

// à déposer dans app/_contexts

import React, { useContext, useEffect, useRef, useState } from "react";

const audioContext = React.createContext({
  _v: 0,
  audio: null,
  setSrc: (src, autoplay = true) => {},
  ready: false,
  autoplay: false,
  stopCount: 0,
  setStopCount: (val) => {},
});

const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [autoplayRequested, setAutoplayRequested] = useState(false);
  const [stopCount, setStopCount] = useState(0);

  // Crée l'objet Audio uniquement côté client
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  const audio = audioRef.current;

  useEffect(() => {
    if (!audioRef.current) return;

    const handleCanPlay = () => {
      console.log("canplay");
      setReady(true);
    };
    audioRef.current.addEventListener("canplaythrough", handleCanPlay);
    return () => {
      audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [audioRef?.current]);

  const setSrc = (src, autoplay = true) => {
    if (!src.trim()) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    setAutoplayRequested(autoplay);
    setReady(false);

    audio.src = src;
    audio.load();
  };

  return (
    <audioContext.Provider
      value={{
        _v: 1,
        audio: audioRef.current,
        setSrc,
        ready,
        autoplay: autoplayRequested,
        stopCount,
        setStopCount,
      }}
    >
      {children}
    </audioContext.Provider>
  );
};

// --- Hooks personnalisés --- //

const useAudio = (stopOnUnmount = false) => {
  const { _v, audio, setSrc, ready, autoplay, setStopCount } =
    useContext(audioContext);
  const [volume, setVolume] = useState(1);

  if (_v === 0) {
    console.error("Vous devez utiliser le AudioProvider dans l'app.");
  }

  useEffect(() => {
    if (ready && audio.paused && autoplay) {
      playHandler();
    }

    return () => {
      if (stopOnUnmount && audio) {
        stopHandler();
      }
    };
  }, [ready, autoplay, audio]);

  const pauseHandler = () => {
    if (!audio) return;
    if (!audio.paused) audio.pause();
  };

  const togglePauseHandler = () => {
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const playHandler = () => {
    if (!audio) return;
    if (audio.paused) audio.play();
  };

  const stopHandler = () => {
    if (!audio) return;
    pauseHandler();
    setStopCount((current) => current + 1);
    audio.currentTime = 0;
  };

  const changeVolumeHandler = (val) => {
    if (val > 1 || val < 0)
      throw "Valeur non acceptée. Veuillez fournir une valeur décimale entre 0 et 1.";
    if (!ready || !audio) {
      console.warn("Aucune source de chargée pour le moment.");
      return;
    }
    audio.volume = val;
    setVolume(val);
  };

  return {
    changeSource: setSrc,
    pause: pauseHandler,
    play: playHandler,
    togglePause: togglePauseHandler,
    stop: stopHandler,
    isReady: ready,
    isPaused: audio?.paused ?? true,
    duration: audio?.duration ?? -1,
    volume,
    changeVolume: changeVolumeHandler,
    raw: {
      getAudio: () => {
        console.warn(
          `La manipulation de la balise audio risque d'en désynchroniser les states. À utiliser à vos risques.`
        );
        return audio;
      },
    },
  };
};

const useAudioEnded = (endedCallback) => {
  const { audio } = useContext(audioContext);
  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", endedCallback);
    return () => {
      audio.removeEventListener("ended", endedCallback);
    };
  }, [audio, endedCallback]);
};

const useAudioProgress = () => {
  const { audio, ready, stopCount } = useContext(audioContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stopCount > 0) setProgress(0);
  }, [stopCount]);

  useEffect(() => {
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audio]);

  const changeProgressHandler = (val) => {
    if (val < 0 || val > 1)
      throw "Valeur non acceptée. Veuillez fournir une valeur décimale entre 0 et 1.";
    if (!ready || !audio) {
      console.warn("Aucune source n'est chargée pour le moment.");
      return;
    }
    audio.currentTime = val * audio.duration;
    setProgress(val);
  };

  return { progress, changeProgress: changeProgressHandler };
};

export { AudioProvider, useAudio, useAudioProgress, useAudioEnded };
