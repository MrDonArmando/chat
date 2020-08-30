import React, { useState, useEffect } from "react";
import "./index.scss";
import { TiArrowSortedDown } from "react-icons/ti";

const Settings = () => {
  const [isSettingsContainerOpened, setIsSettingsContainerOpened] = useState(
    false
  );

  const changeVisibilityOfSettingsContainer = () => {
    setIsSettingsContainerOpened((prevState) => !prevState);
  };

  return (
    <div id="container-settings">
      <button
        id="container-settings__title"
        onClick={changeVisibilityOfSettingsContainer}
      >
        <span id="settings-title">Settings</span>
        <TiArrowSortedDown
          className={`settings-icon ${
            isSettingsContainerOpened ? "settings-icon--rotated" : ""
          }`}
        />
      </button>
      <div
        className={`container-settings__collapsible ${
          isSettingsContainerOpened
            ? "container-settings__collapsible--opened"
            : "container-settings__collapsible--closed"
        }`}
      ></div>
    </div>
  );
};

export default Settings;
