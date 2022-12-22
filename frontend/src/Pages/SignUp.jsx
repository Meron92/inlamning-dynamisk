import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.js";

function SignUp() {
  const [signUsername, setSignUsername] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [logInUsername, setLogInUsername] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [createdAccount, setCreatedAccount] = useState(false);
  const [credentials, setCredentials] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState(false);

  const navigate = useNavigate();

  const loginAdmin = () => {
    setAdminLoginForm(true);
  };

  //Skickar användarnamn och lösenord från klient sidan till databasen
  async function logIn() {
    let account = {
      username: logInUsername,
      password: logInPassword,
    };

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    //Spara token i sessionStorage
    if (data.success) {
      sessionStorage.setItem("token", data.token);

      navigate("/loggedin", {
        state: { username: logInUsername },
      });
      localStorage.setItem("user", data.username);
      localStorage.setItem("images", data.photos);
    } else {
      setCredentials(!credentials);
    }
  }

  //Skickar inloggnings uppgifter från klient sidan till backend servern
  async function adminLogin() {
    let admin = {
      username: adminUsername,
      password: adminPassword,
    };

    const response = await fetch("http://localhost:5000/api/adminlogin", {
      method: "POST",
      body: JSON.stringify(admin),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem("token", data.token);
      navigate("/adminlogin", { state: { username: adminUsername } });
    } else {
      setAdminCredentials(!adminCredentials);
    }
  }

  //Skickar datan från klient sidan för skapandet av konto till backend servern
  async function createAccount() {
    let account = {
      username: signUsername,
      email: signEmail,
      password: signPassword,
    };

    const response = await fetch("http://localhost:5000/api/createaccount", {
      method: "POST",
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.success) {
      setCreatedAccount(!createdAccount);
    }
  }

  return (
    <section className="sign-up-forms">
      <section className="forms-wrapper">
        <h1>BRÖLLOPSFOTOGRAFEN 💍</h1>

        <h1>Skapa konto</h1>
        <section className="input-container">
          <input
            className="account-input"
            securetextentry="true"
            type="text"
            placeholder="Användarnamn"
            onChange={(e) => setSignUsername(e.target.value)}
          />

          <input
            className="account-input"
            securetextentry="true"
            type="text"
            placeholder="Email"
            onChange={(e) => setSignEmail(e.target.value)}
          />

          <input
            className="account-input"
            securetextentry="true"
            type="password"
            placeholder="Lösenord"
            onChange={(e) => setSignPassword(e.target.value)}
          />

          <button className="submit-button" onClick={() => createAccount()}>
            Skapa konto
          </button>
          {createdAccount ? (
            <p>{`Ditt konto har skapats, ${signUsername}! Nu kan du logga in.`}</p>
          ) : null}
        </section>

        <section className="input-container">
          <h1>Logga in</h1>
          <input
            className="account-input"
            securetextentry="true"
            type="text"
            placeholder="Användarnamn"
            onChange={(e) => setLogInUsername(e.target.value)}
          />

          <input
            className="account-input"
            securetextentry="true"
            type="password"
            placeholder="Lösenord"
            onChange={(e) => setLogInPassword(e.target.value)}
          />
          <button className="submit-button" onClick={() => logIn()}>
            Logga in
          </button>
          {credentials ? (
            <p>Felaktigt lösenord och/eller användarnamn</p>
          ) : null}
        </section>
        {adminLoginForm ? (
          <section className="input-container">
            <section>
              <h1>Admin login</h1>
            </section>
            <section className="input-container">
              <input
                className="account-input"
                type="text"
                placeholder="Username"
                onChange={(e) => setAdminUsername(e.target.value)}
              />

              <input
                className="account-input"
                type="password"
                placeholder="Lösenord"
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button className="submit-button" onClick={() => adminLogin()}>
                Logga in
              </button>
            </section>
          </section>
        ) : (
          <div className="admin-message" onClick={loginAdmin}>
            Admin? Tryck här för att logga in
          </div>
        )}
        {adminCredentials ? (
          <p>Felaktigt lösenord och/eller användarnamn</p>
        ) : null}
      </section>
    </section>
  );
}

export default SignUp;
