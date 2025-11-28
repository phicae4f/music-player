import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useAppSelector } from "../hooks/redux";

export const Navigation = () => {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleFavItem = (e: React.MouseEvent) => {
    if (!token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className="navigation">
      <div className="navigation__logo">
        <Icon
          className="navigation__logo-icon"
          width={184}
          height={30}
          name="icon-logo"
        />
      </div>
      <ul className="navigation__list">
        <li
          className={`navigation__item ${
            location.pathname === "/my-tracks" ? "active" : ""
          }`}
        >
          <Link
            className="navigation__link"
            to="/my-tracks"
            onClick={handleFavItem}
          >
            <Icon name="icon-music" width={32} height={32} />
            <span>Избранное</span>
          </Link>
        </li>
        <li
          className={`navigation__item ${
            location.pathname === "/tracks" ? "active" : ""
          }`}
        >
          <Link className="navigation__link" to="/tracks">
            <Icon name="icon-music" width={32} height={32} />
            <Icon name="icon-play" width={24} height={24} />
            <span>Аудиокомпозиции</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
