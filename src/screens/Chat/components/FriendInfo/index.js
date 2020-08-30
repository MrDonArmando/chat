import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import { useHistory } from "react-router";
import firebase from "../../../../global_components/firebase";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "../Modal";
import Spinner from "../Spinner";
import Settings from "../Settings";

const FriendInfo = ({ friendName }) => {
  const history = useHistory();
  const [crop, setCrop] = useState({
    minWidth: 80,
    //minHeight: 80,
    width: 80,
    //height: 100,
    maxWidth: 100,
    //maxHeight: 50,
    x: 10,
    y: 10,
    aspect: 1,
    unit: "%",
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState("");
  const imageRef = useRef();

  const logout = () => {
    firebase
      .logout()
      .then((res) => {
        history.replace("/login");
      })
      .catch((err) => console.log("ERROR IN SIGNOUT: ", err));
  };

  useEffect(() => {
    console.log("Avatar URL: ", avatarUrl);

    const fetchAvatarUrl = async () => {
      const downloadedAvatarUrl = await firebase.getMyAvatarURL();
      setAvatarUrl(downloadedAvatarUrl);
    };

    fetchAvatarUrl();
  }, []);

  const onImageLoaded = (image) => {
    console.log("onImageLoaded: ", image);
    imageRef.current = image;
  };

  const handleImageChange = (e) => {
    console.log("handleImageChange: ", e.target.value);

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageDataUrl(reader.result);
        console.log("reader result: ", reader.result);
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
          //reject(new Error('Canvas is empty'));
          return;
        }

        blob.name = fileName;
        if (avatarUrl) {
          console.log("BLOB: ", blob);
          window.URL.revokeObjectURL(avatarUrl);
        }
        const newAvatarUrl = window.URL.createObjectURL(blob);
        resolve({ newAvatarUrl, blob });
      }, "image/jpeg");
    });
  };

  const saveCroppedImage = async () => {
    if (imageRef.current && crop.width && crop.height) {
      try {
        setIsSavingAvatar(true);

        const { newAvatarUrl, blob } = await getCroppedImg(
          imageRef.current,
          crop,
          "avatar.jpeg"
        );

        setAvatarUrl(newAvatarUrl);
        const donwloadURL = await firebase.changeProfilePicture(blob);

        console.log("Success: ", donwloadURL);
      } catch (err) {
        console.log("Error: ", err.message);
      } finally {
        setIsSavingAvatar(false);
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    console.log("imageDataUrl; ", imageDataUrl);
  }, [imageDataUrl]);

  return (
    <div id="friend-info-container">
      <Settings />
      <div id="avatar-and-name-container">
        <img
          src={
            avatarUrl
              ? avatarUrl
              : require("../../../../images/default_profile_picture.jpg")
          }
          alt="Avatar"
          id="friend-avatar"
        />
        <span id="friend-name"> {friendName}</span>
        <br />
        <br />
        <label htmlFor="input-avatar">Choose file to upload</label>
        <input
          id="input-avatar"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />

        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

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
  );
};

export default FriendInfo;

const IMAGE_PREVIEW_STYLES = {
  width: "auto",
  maxHeight: "450px",
  objectFit: "contain",
};
