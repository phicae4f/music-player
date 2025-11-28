import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Icon } from "../ui/Icon";
import {
  nextTrack,
  prevTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  togglePlay,
} from "../store/playerSlice";
import { getAudioUrl } from "../utils/tracksMock";

export const AudioPlayer = () => {
  const dispatch = useAppDispatch();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    currentIndex,
  } = useAppSelector((state) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Получаем URL для аудио
  const audioUrl = currentTrack ? getAudioUrl(currentTrack.id) : "";

  // Управление воспроизведением
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Сброс времени при смене трека
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.currentTime = 0;
      dispatch(setCurrentTime(0));
    }
  }, [currentTrack, dispatch]);

  // Обновление времени
  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    dispatch(nextTrack());
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Перемотка по клику на прогресс-бар
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  // Drag для прогресс-бара
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && audioRef.current && duration > 0) {
        const progressBar = document.querySelector(
          ".player__time-bar"
        ) as HTMLDivElement;
        if (progressBar) {
          const rect = progressBar.getBoundingClientRect();
          const percent = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left) / rect.width)
          );
          const newTime = percent * duration;
          audioRef.current.currentTime = newTime;
          dispatch(setCurrentTime(newTime));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration, dispatch]);

  // Управление громкостью
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newVolume = percent;
    dispatch(setVolume(newVolume));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Если нет текущего трека - не рендерим плеер
  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <>
      <section className="player">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
        <div className="container">
          <div className="player__wrapper">
            <div className="player__left">
              <img
                src="/img/track.jpg"
                alt="Фото албома"
                width={60}
                height={60}
              />
              <div className="player__left-info">
                <span className="player__track-name">{currentTrack.title}</span>
                <span className="player__album-name">
                  {currentTrack.type === "track"
                    ? currentTrack.artist
                    : currentTrack.host}
                </span>
              </div>
            </div>

            <div className="player__middle">
              <div className="player__middle-top">
                <button
                  className="player__middle-btn"
                  type="button"
                  onClick={() => dispatch(prevTrack())}
                  disabled={currentIndex <= 0}
                >
                  <Icon name="icon-player-left" width={16} height={16} />
                </button>

                <button
                  className={`player__middle-btn ${
                    isPlaying ? "pause" : "play"
                  }`}
                  type="button"
                  onClick={() => dispatch(togglePlay())}
                >
                  <Icon name="icon-player-middle" width={40} height={40} />
                </button>

                <button
                  className="player__middle-btn"
                  type="button"
                  onClick={() => dispatch(nextTrack())}
                  disabled={currentIndex >= queue.length - 1}
                >
                  <Icon name="icon-player-right" width={16} height={16} />
                </button>
              </div>

              <div className="player__middle-bottom">
                <span className="player__time-passed">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="player__time-bar"
                  onClick={handleProgressClick}
                  onMouseDown={handleProgressMouseDown}
                >
                  <div
                    className="player__time-bar-filled"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="player__time-bar-handle"></div>
                  </div>
                </div>
                <span className="player__time-left">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="player__right">
              <Icon name="icon-volume" width={16} height={16} />
              <div className="player__volume-bar" onClick={handleVolumeClick}>
                <div
                  className="player__volume-bar-filled"
                  style={{ width: `${volumePercent}%` }}
                >
                  <div className="player__volume-bar-handle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="player player--mobile">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
        <div className="container">
          <div className="player__wrapper">
            <div className="player__top">
              <div className="player__left">
                <img
                  src="/img/track.jpg"
                  alt="Фото албома"
                  width={70}
                  height={70}
                />
                <div className="player__left-info">
                  <span className="player__track-name">
                    {currentTrack.title}
                  </span>
                  <span className="player__album-name">
                    {currentTrack.type === "track"
                      ? currentTrack.artist
                      : currentTrack.host}
                  </span>
                </div>
              </div>
              <div className="player__middle-top">
                <button
                  className="player__middle-btn"
                  type="button"
                  onClick={() => dispatch(prevTrack())}
                  disabled={currentIndex <= 0}
                >
                  <Icon name="icon-player-left" width={12} height={12} />
                </button>

                <button
                  className={`player__middle-btn ${
                    isPlaying ? "pause" : "play"
                  }`}
                  type="button"
                  onClick={() => dispatch(togglePlay())}
                >
                  <Icon name="icon-player-middle" width={30} height={30} />
                </button>

                <button
                  className="player__middle-btn"
                  type="button"
                  onClick={() => dispatch(nextTrack())}
                  disabled={currentIndex >= queue.length - 1}
                >
                  <Icon name="icon-player-right" width={12} height={12} />
                </button>
              </div>
            </div>
            <div className="player__middle-bottom">
              <span className="player__time-passed">
                {formatTime(currentTime)}
              </span>
              <div
                className="player__time-bar"
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
              >
                <div
                  className="player__time-bar-filled"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="player__time-bar-handle"></div>
                </div>
              </div>
              <span className="player__time-left">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
