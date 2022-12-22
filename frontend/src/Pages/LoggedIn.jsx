import React, { useRef, useContext, useEffect } from "react";
import { ListContext } from "../Components/ListContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function LoggedIn() {
  let { myImages, setMyImages } = useContext(ListContext);

  const location = useLocation();
  const navigate = useNavigate();

  const videoStream = useRef(null);
  const photoCapture = useRef(null);
  const imageCapture = useRef(null);

  let savedUrl;
  let newUrl;

  //Skickar sparade fotona och användarnamnet från klient sidan till foto databasen
  async function savePhoto() {
    savedUrl = localStorage.getItem("url");
    newUrl = savedUrl.replace("data:image/png;base64,", "");

    let photo = {
      username: location.state.username,
      photos: newUrl,
    };

    const response = await fetch("http://localhost:5000/api/addphoto", {
      method: "POST",
      body: JSON.stringify(photo),
      headers: { "Content-type": "application/json" },
    });

    const data = await response.json();
  }

  //Skapar kameran på klient sidan
  const getVideo = async () => {
    let video = videoStream.current;
    const playPromise = video.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        video.play();
      });
    }
    await navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 100,
          height: 100,
        },
      })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getVideo();
  }, [videoStream]);

  //Tar fotot på klient sidan
  const takePhoto = () => {
    let video = videoStream.current;
    let photo = photoCapture.current;
    let result = imageCapture.current;

    photo.width = 100;
    photo.height = 100;

    const context = photo.getContext("2d");
    context.drawImage(video, 0, 0, photo.width, photo.height);

    result.src = photo.toDataURL();
    let photoUrl = result.src;

    let updatedUrl = photoUrl.replace("data:image/png;base64,", "");
    window.localStorage.setItem("url", updatedUrl);
  };

  //Uppdaterar fotona
  const changePhoto = () => {
    let addToState = window.localStorage.getItem("url");
    setMyImages([...myImages, addToState]);
  };

  //Skapar logga ut functionen från gäst sidan
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
          <h3>Välkommen {location.state.username}</h3>
          <img
            className="gallery-icon"
            src="./images/gallery.png"
            onClick={() =>
              navigate("/imagesgallery", {
                state: { username: location.state.username },
              })
            }
          />
        </article>
        <button className="logoutBtn" onClick={() => logout()}>
          Logga Ut
        </button>

        <article className="media-container">
          <video ref={videoStream} autoPlay muted="muted"></video>
          <Link
            to="/capturedimage"
            state={{ username: location.state.username, photos: newUrl }}
          >
            <button
              className="media-button"
              onClick={() => {
                takePhoto();
                savePhoto();
                changePhoto();
              }}
            >
              FÖREVIGA ETT ÖGONBLICK
            </button>
          </Link>
        </article>
        <article>
          <canvas ref={photoCapture} style={{ display: "none" }}></canvas>
          <img ref={imageCapture} />
        </article>
      </section>
    </section>
  );
}
