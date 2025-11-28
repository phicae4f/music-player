import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { logout } from "../store/authSlice";

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdown__button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="dropdown__user-info">
          <img
            className="dropdown__user-img"
            src="/img/avatar.png"
            alt="Фото пользователя"
            width={48}
            height={48}
          />
          <span className="dropdown__user-name">
            {user ? user.username : "New User"}
          </span>
        </div>
        <Icon
          className={`dropdown__icon ${isOpen ? "open" : ""}`}
          name="icon-dropdown"
          width={16}
          height={16}
        />
      </button>
      <ul className={`dropdown__list ${isOpen ? "open" : ""}`}>
        {token ? (
          <>
            <li className="dropdown__item" onClick={handleItemClick}>
              <Link to="/tracks">Все треки</Link>
            </li>
            <li className="dropdown__item" onClick={handleItemClick}>
              <Link to="/my-tracks">Избранные треки</Link>
            </li>
            <li className="dropdown__item">
              <button
                className="dropdown__logout"
                type="button"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </li>
          </>
        ) : (
          <>
          <li className="dropdown__item" onClick={handleItemClick}>
              <Link to="/tracks">Все треки</Link>
            </li>
          <li className="dropdown__item" onClick={handleItemClick}>
            <Link to="/login">Войти</Link>
          </li>
          </>
        )}
      </ul>
    </div>
  );
};
