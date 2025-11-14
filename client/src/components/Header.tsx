import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../ui/Icon";

export const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__logo">
            <Icon
              className="header__logo-icon"
              width={184}
              height={30}
              name="icon-logo"
            />
          </div>
          <div className="header__right">
            <input
              className="header__search-bar"
              name="search-bar"
              id="search-bar"
              type="text"
              placeholder="Что будем искать?"
            />
            <Icon
              className="header__search-bar-icon"
              name="icon-search"
              width={24}
              height={24}
            />
            <div className="header__dropdown">
              <Dropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
