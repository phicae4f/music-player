import { useEffect } from "react";
import { TracksList } from "../components/TracksList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchAllAudio } from "../store/tracksSlice";
import { AudioFilters } from "../components/AudioFilters";

export const TracksPage = () => {
  const dispatch = useAppDispatch();
  const { filteredAudios, isLoading, error } =
    useAppSelector((state) => state.tracks);

  useEffect(() => {
    dispatch(fetchAllAudio());
  }, [dispatch]);

  if (isLoading) {
    return <span>Загрузка треков...</span>;
  }

  if (error) {
    return (
      <button
        className="btn"
        type="button"
        onClick={() => dispatch(fetchAllAudio())}
      >
        Попробовать снова
      </button>
    );
  }
  return (
    <section className="audio">
      <div className="container">
        <div className="audio__wrapper">
          <h2 className="audio__title">Аудиофайлы и треки</h2>
          <div className="audio__table">
            <AudioFilters />

            <div className="audio__info">
              <span className="audio__count">
                Найдено: {filteredAudios.length}{" "}
                {getItemText(filteredAudios.length)}
              </span>
            </div>
            <TracksList audios={filteredAudios} />
          </div>
        </div>
      </div>
    </section>
  );
};

const getItemText = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) return "элемент";
  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  )
    return "элемента";
  return "элементов";
};
