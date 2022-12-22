import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  let [newGalleryInfo, setNewGalleryInfo] = useState([]);

  //Tar emot all data från bild databasen
  async function userInfos() {
    const response = await fetch("http://localhost:5000/api/userinfo", {
      method: "GET",
      body: JSON.stringify(),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    setNewGalleryInfo(data);
  }

  useEffect(() => {
    userInfos();
  }, []);

  //Loggar ut admin från admin sidan
  async function logoutAdmin() {
    sessionStorage.removeItem("token");
    setNewGalleryInfo([]);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <section className="admin-page">
      <section className="admin-page-header">
        <h1>Admin page</h1>
        <h1>Gästernas bilder</h1>
        <button
          className="logoutBtnAdmin logoutBtn"
          onClick={() => logoutAdmin()}
        >
          Logga ut
        </button>
      </section>
      {newGalleryInfo.map((user, i) => {
        return (
          <section className="guest-images" key={i}>
            <div>Gäst</div>
            <div key={i}> {user.username}</div>
            {user.photos.length === 1 ? (
              <img
                alt="wedding"
                src={`data:image/png;base64, ${user.photos}`}
                className="gallery-container"
              ></img>
            ) : (
              user.photos.map((photo, i) => (
                <img
                  key={i}
                  alt="wedding"
                  src={`data:image/png;base64, ${photo}`}
                  className="gallery-container"
                ></img>
              ))
            )}
          </section>
        );
      })}
    </section>
  );
}
