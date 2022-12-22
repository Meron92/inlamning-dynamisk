import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ListContext } from "../Components/ListContext";

export default function CapturedImage() {
  const location = useLocation();
  const navigate = useNavigate();

  const oneImage = localStorage.getItem("url");
  let { setMyImages } = useContext(ListContext);

  //Logga ut funktion på gäst sidan
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
            className="gallery-icon capturedGalleryBtn"
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
        <img
          src={`data:image/png;base64, ${oneImage}`}
          className="media-container"
        ></img>
        <button onClick={() => navigate(-1)} className="media-button">
          FÅNGA ETT NYTT ÖGONBLICK
        </button>
      </section>
    </section>
  );
}
