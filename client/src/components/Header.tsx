import React, { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../ui/Icon";
import { Navigation } from "./Navigation";
import { setSearchQuery } from "../store/tracksSlice";

export const Header = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    dispatch(setSearchQuery(value));
  };

  const handleSearchClear = () => {
    setSearchValue("");
    dispatch(setSearchQuery(""));
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__logo">
            <Navigation />
          </div>
          <div className="header__right">
            <input
              className="header__search-bar"
              name="search-bar"
              id="search-bar"
              type="text"
              placeholder="Что будем искать?"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <Icon
              className="header__search-bar-icon"
              name="icon-search"
              width={24}
              height={24}
            />
            {searchValue && (
              <button
                className="header__clear-btn"
                type="button"
                onClick={handleSearchClear}
              >
                X
              </button>
            )}
            <div className="header__dropdown">
              <Dropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
