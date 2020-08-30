import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import firebase from "../../../../global_components/firebase";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "../Modal";
import Spinner from "../Spinner";
import { TiArrowSortedDown } from "react-icons/ti";

const Settings = () => {
  const [isSettingsContainerOpened, setIsSettingsContainerOpened] = useState(
    false
  );
  const [crop, setCrop] = useState({
    minWidth: 80,
    width: 80,
    maxWidth: 100,
    x: 10,
    y: 10,
    aspect: 1,
    unit: "%",
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const imageRef = useRef();

  const changeVisibilityOfSettingsContainer = () => {
    setIsSettingsContainerOpened((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      console.log("fetchAvatarUrl");
      const downloadedAvatarUrl = await firebase.getMyAvatarURL();
      setAvatarUrl(downloadedAvatarUrl);
    };

    fetchAvatarUrl();
  }, []);

  const onImageLoaded = (image) => {
    imageRef.current = image;
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageDataUrl(reader.result);

        setIsModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = "";
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx === null) return;
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }

        blob.name = fileName;
        if (avatarUrl) {
          window.URL.revokeObjectURL(avatarUrl);
        }
        const newAvatarUrl = window.URL.createObjectURL(blob);
        const response = { newAvatarUrl, blob };
        resolve(response);
      }, "image/jpeg");
    });
  };

  const saveCroppedImage = async () => {
    if (imageRef.current && crop.width) {
      try {
        setIsSavingAvatar(true);

        const { newAvatarUrl, blob } = await getCroppedImg(
          imageRef.current,
          crop,
          "avatar.jpeg"
        );

        setAvatarUrl(newAvatarUrl);
        const donwloadURL = await firebase.changeProfilePicture(blob);
      } catch (err) {
        console.log("Error: ", err.message);
      } finally {
        setIsSavingAvatar(false);
        setIsModalOpen(false);
      }
    }
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
      >
        <div id="avatar-container">
          <img
            src={
              avatarUrl
                ? avatarUrl
                : require("../../../../images/default_profile_picture.jpg")
            }
            alt="Avatar"
            id="avatar-image"
          />

          <label htmlFor="input-avatar" id="input-avatar__label">
            Change avatar
          </label>
          <input
            id="input-avatar"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            getCroppedImg={getCroppedImg}
          >
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div id="modal-image-container">
                <ReactCrop
                  src={imageDataUrl}
                  crop={crop}
                  onChange={(crop, percentCrop) => {
                    setCrop(crop);
                  }}
                  onComplete={(crop) => {
                    setCompletedCrop(crop);
                  }}
                  onImageLoaded={onImageLoaded}
                  imageStyle={IMAGE_PREVIEW_STYLES}
                  circularCrop
                  ruleOfThirds
                />
              </div>

              <div id="modal-buttons-container">
                <button
                  className="modal-button modal-button--cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="modal-button modal-button--save"
                  onClick={saveCroppedImage}
                >
                  {isSavingAvatar && (
                    <Spinner styles={{ borderColor: "white", margin: "0px" }} />
                  )}
                  Save
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Settings;

const IMAGE_PREVIEW_STYLES = {
  width: "auto",
  maxHeight: "450px",
  objectFit: "contain",
};
