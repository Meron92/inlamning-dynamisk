import { useNavigate, useLocation } from "react-router-dom";
import { ListContext } from "../Components/ListContext";
import { useContext, useState } from "react";
import "../App.css";

export default function ImagesGallery() {
  const navigate = useNavigate();
  const location = useLocation();

  let { myImages, setMyImages } = useContext(ListContext);

  let gallery = localStorage.getItem("images");
  let newGallery = gallery.split(",");
  let [oldImages, setOldImages] = useState(newGallery);

  //Skickar datan om det raderade fotot
  async function removePhoto(image) {
    let photo = {
      username: location.state.username,
      photos: image,
    };

    const response = await fetch("http://localhost:5000/api/deletephoto", {
      method: "DELETE",
      body: JSON.stringify(photo),
      headers: { "Content-type": "application/json" },
    });

    const data = await response.json();
  }

  //Raderar den nyligen tagna bilden
  const removeNewImages = (image) => {
    setMyImages(myImages.filter((someImage) => someImage !== image));
  };

  //Raderar dem gamla bilderna
  const removeOldImages = (image) => {
    setOldImages(oldImages.filter((someOldImage) => someOldImage !== image));
  };

  //Logga ut funktion från gäst galleriet
  async function logout() {
    sessionStorage.removeItem("token");
    setMyImages([]);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <section className="stream-container">
      <section className="main-container">
        <article className="header">
          <button className="logoutBtn" onClick={() => logout()}>
            Logga Ut
          </button>
          <h2>
            <img src="./images/camera.png" />
          </h2>
        </article>
        <article className="images-container">
          {myImages !== 0
            ? myImages.map((image, index) => {
                return (
                  <div key={index}>
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        removePhoto(image);
                        removeNewImages(image);
                      }}
                    >
                      X
                    </button>
                    <img
                      alt="wedding"
                      src={`data:image/png;base64, ${image}`}
                      className="gallery-container"
                    ></img>
                  </div>
                );
              })
            : null}
          {oldImages.length !== 0 && gallery.length !== 0
            ? oldImages.map((image, index) => {
                return (
                  <div key={index}>
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        removePhoto(image);
                        removeOldImages(image);
                      }}
                    >
                      X
                    </button>
                    <img
                      alt="wedding"
                      src={`data:image/png;base64, ${image}`}
                      className="gallery-container"
                    ></img>
                  </div>
                );
              })
            : null}
        </article>
      </section>
    </section>
  );
}
