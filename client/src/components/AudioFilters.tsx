import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setFilter } from "../store/tracksSlice";

export const AudioFilters = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.tracks);
  return (
    <div className="filters">
      <button
        className={`filters__btn ${filter === "all" ? "active" : ""}`}
        onClick={() => dispatch(setFilter("all"))}
        type="button"
      >Все</button>
      <button
        className={`filters__btn ${filter === "tracks" ? "active" : ""}`}
        onClick={() => dispatch(setFilter("tracks"))}
        type="button"
      >Треки</button>
      <button
        className={`filters__btn ${filter === "podcasts" ? "active" : ""}`}
        onClick={() => dispatch(setFilter("podcasts"))}
        type="button"
      >Подкасты</button>
    </div>
  );
};
