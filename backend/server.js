const express = require("express");
const app = express();
const nedb = require("nedb-promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcryptPasswords = require("./bcrypt");

app.use(cors({ origin: "*" }));
app.use(express.json());

//Skapa gäst databas
const guestAccount = new nedb({
  filename: "./databases/guestAccount.db",
  autoload: true,
});

//Skapa bild databas
const galleryAccount = new nedb({
  filename: "./databases/galleryAccount.db",
  autoload: true,
});

//Skapa konto
app.post("/api/createaccount", async (req, res) => {
  const credentials = req.body;

  const accountObj = {
    success: true,
    email: false,
    username: false,
  };

  const email = await guestAccount.find({
    email: credentials.email,
  });

  const username = await guestAccount.find({
    username: credentials.username,
  });

  if (email.length > 0) {
    accountObj.email = true;
  }

  if (username.length > 0) {
    accountObj.username = true;
  }

  if (accountObj.email || accountObj.username) {
    accountObj.success = false;
  } else {
    const hashedPassword = await bcryptPasswords.hashPassword(
      credentials.password
    );
    credentials.password = hashedPassword;
    guestAccount.insert(credentials);
  }
  res.json(accountObj);
});

//Gäst logga in post
app.post("/api/login", async (req, res) => {
  const credentials = req.body;

  let accountObj = {
    success: false,
    token: "",
    username: "",
    photos: [],
  };

  const createdAccount = await guestAccount.find({
    username: credentials.username,
  });

  if (createdAccount.length > 0) {
    const password = await bcryptPasswords.checkPassword(
      credentials.password,
      createdAccount[0].password
    );

    const username = credentials.username;

    if (password && username) {
      accountObj.success = true;
      accountObj.username = createdAccount[0].username;
    }
  }

  if (accountObj.success === true) {
    if (createdAccount.length > 0) {
      let photosRec = await galleryAccount.find({
        username: createdAccount[0].username,
      });
      if (photosRec.length > 0) {
        accountObj.photos = photosRec[0].photos;
      }
    }

    const token = jwt.sign(
      { username: createdAccount[0].username },
      "userToken",
      {
        expiresIn: 5000,
      }
    );
    accountObj.token = token;
  }
  res.json(accountObj);
});

// Admin logga in
app.post("/api/adminlogin", (request, response) => {
  const credentials = request.body;

  const adminLoginObj = {
    success: false,
    token: "",
    adminUsername: "admin",
    adminPassword: "admin",
  };

  if (
    credentials.username === adminLoginObj.adminUsername &&
    credentials.password === adminLoginObj.adminPassword
  ) {
    adminLoginObj.success = true;
  }

  if (adminLoginObj.success === true) {
    const admintoken = jwt.sign(
      { username: adminLoginObj.adminUsername },
      "adminToken",
      {
        expiresIn: 5000,
      }
    );
    adminLoginObj.token = admintoken;
  }
  response.json(adminLoginObj);
});

//Lägg till foton
app.post("/api/addphoto", async (request, response) => {
  const savePhoto = request.body;

  let photoAddedObj = {
    username: savePhoto.username,
    photos: [savePhoto.photos],
  };

  const hasPhoto = await galleryAccount.find({
    username: photoAddedObj.username,
  });

  if (hasPhoto.length > 0) {
    const id = hasPhoto[0]._id;
    galleryAccount.update({ _id: id }, { $push: { photos: savePhoto.photos } });
  } else {
    galleryAccount.insert(photoAddedObj);
  }
});

//Radera foton
app.delete("/api/deletephoto", async (request, response) => {
  const deletePhoto = request.body;

  let photoDeletedObj = {
    username: deletePhoto.username,
    photos: [deletePhoto.photos],
  };

  const hasPhoto = await galleryAccount.find({
    username: photoDeletedObj.username,
  });

  if (hasPhoto.length > 0) {
    const id = hasPhoto[0]._id;
    galleryAccount.update(
      { _id: id },
      { $pull: { photos: deletePhoto.photos } }
    );
  } else {
    return null;
  }
});

const verify = (request, response) => {
  let resObject = {
    logged: false,
  };
  const token = request.headers.authorization.replace("Holder ", "");
  try {
    const data = jwt.verify(token, "userToken");
    if (data) {
      resObject.logged = true;
    }
  } catch (error) {
    resObject.errormessage = "Token expired";
  }
  response.json(resObject);
};

const verifyAdmin = (request, response) => {
  let resAdminObject = {
    logged: false,
  };
  const admintoken = request.headers.authorization.replace("AdminHolder ", "");
  try {
    const data = jwt.verify(admintoken, "adminToken");
    if (data) {
      resAdminObject.logged = true;
    }
  } catch (error) {
    resAdminObject.errormessage = "Token expired";
  }
  response.json(resAdminObject);
};

//Gäst logga ut
app.post("/api/logout", verify, (req, res) => {
  res.status(200).json("Logout successful");
});

//Admin logga ut
app.post("/api/adminlogout", verifyAdmin, (req, res) => {
  res.status(200).json("Logout successful");
});

//Renderar ut hela galleryaccount databasen
app.get("/api/userinfo", async (req, res) => {
  let allInfo = await galleryAccount.find({});
  res.json(allInfo);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listen to port ${port}`);
});
