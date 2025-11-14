import { Icon } from "./Icon";

export const Dropdown = () => {
  return (
    <div className="dropdown">
        <button className="dropdown__button" type="button">
            <div className="dropdown__user-info">
            <img
                className="dropdown__user-img"
                src="/img/avatar.png"
                alt="Фото пользователя"
                width={48}
                height={48}
            />
            <span className="dropdown__user-name">username</span>
            </div>
            <Icon className="dropdown__icon" name="icon-dropdown" width={16} height={16}/>      
        </button>
        <ul className="dropdown__list">
            <li className="dropdown__item">Выйти</li>
        </ul>
    </div>
  );
};
