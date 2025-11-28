import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addToFavourite, removeFromFavourite } from "../store/favouritesSlice";
import { playTrack } from "../store/playerSlice";
import { Icon } from "../ui/Icon";
import { getAudioUrl } from "../utils/tracksMock";
import { useNavigate } from "react-router-dom";

interface AudioItem {
  id: number;
  title: string;
  duration: number;
  size_mb: number;
  encoded_audio: string;
  type: "track" | "podcast";
  artist?: string;
  host?: string;
  category?: string;
  description?: string;
}

interface TracksListProps {
  audios: AudioItem[];
}

export const TracksList = ({ audios }: TracksListProps) => {
  const dispatch = useAppDispatch();
  const { favourites } = useAppSelector((state) => state.favourites);
  const {token} = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  if (!audios || !Array.isArray(audios)) {
    console.error("TracksList: audios is not an array:", audios);
    return <div>Ошибка: данные не загружены</div>;
  }

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFavouriteClick = (audio: AudioItem, e: React.MouseEvent) => {

    if(!token) {
      navigate("/login")
    }
    e.stopPropagation()
    const isCurrentlyFavourite = favourites.some(
      (item) => item.id === audio.id
    );

    if (isCurrentlyFavourite) {
      dispatch(removeFromFavourite(audio.id));
    } else {
      dispatch(addToFavourite(audio.id));
    }
  };

  const isFavourite = (id: number) => {
    return favourites.some((item) => item.id === id);
  };

const handleTrackClick = (audio: AudioItem) => {
  const audioUrl = audio.encoded_audio || getAudioUrl(audio.id);
  
  dispatch(
    playTrack({
      track: {
        ...audio,
        encoded_audio: audioUrl // Обновляем поле
      },
      queue: audios.map(item => ({
        ...item,
        encoded_audio: item.encoded_audio || getAudioUrl(item.id)
      })),
    })
  );
};

  return (
    <>
      <div className="tracks-table">
        <div className="tracks-table__head">
          <div className="tracks-table__row">
            <div>&#8470;</div>
            <div>Название</div>
            <div>Альбом</div>
            <div>
              <Icon name="icon-calendar" width={16} height={16} />
            </div>
            <div>
              <Icon name="icon-clock" width={16} height={16} />
            </div>
          </div>
        </div>
        <div className="tracks-table__body">
          {audios.map((audio, index) => (
            <div
              key={audio.id}
              className="tracks-table__row"
              onClick={() => handleTrackClick(audio)}
            >
              <div className="tracks-table__number">{index + 1}</div>
              <div className="tracks-table__album">
                <img src="/img/track.jpg" alt="Фото албьома" />
                <div className="tracks-table__row-wrapper">
                  <span>{audio.title}</span>
                  <span>
                    {audio.type === "track" ? audio.artist : audio.host}
                  </span>
                </div>
              </div>
              <div className="tracks-table__album-name">
                <span>
                  {audio.type === "track" ? audio.artist : audio.category}
                </span>
              </div>
              <div className="tracks-table__date">
                <span>6 дней назад</span>
                <button
                  className={`tracks-table__favourite-btn ${
                    isFavourite(audio.id) ? "active" : ""
                  }`}
                  type="button"
                  onClick={(e) => {
                    handleFavouriteClick(audio, e);
                  }}
                >
                  <Icon name="icon-heart" width={24} height={24} />
                </button>
              </div>
              <div className="tracks-table__duration">
                <span>{formatDuration(audio.duration)}</span>
                <Icon name="icon-details" width={23} height={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ul className="tracks-table tracks-table--list">
        {audios.map((audio, index) => (
          <li
            key={audio.id}
            className="tracks-table__row"
            onClick={() => handleTrackClick(audio)}
          >
            <div className="tracks-table__album">
              <img
                src="/img/track.jpg"
                alt="Фото албьома"
                width={70}
                height={70}
              />
              <div className="tracks-table__row-wrapper">
                <span>{audio.title}</span>
                <span>
                  {audio.type === "track" ? audio.artist : audio.host}
                </span>
              </div>
            </div>
            <div className="tracks-table__duration">
              <button
                className={`tracks-table__favourite-btn ${
                  isFavourite(audio.id) ? "active" : ""
                }`}
                type="button"
                onClick={(e) => {
                  handleFavouriteClick(audio, e);
                }}
              >
                <Icon name="icon-heart" width={24} height={24} />
              </button>
              <Icon name="icon-details" width={23} height={4} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};