import React, { createContext, useEffect, useState } from "react";

export const ListContext = createContext();

export const ImagesProvider = (props) => {
  let [myImages, setMyImages] = useState([]);

  useEffect(() => {
    localStorage.setItem("newImages", myImages);
  }, [myImages]);

  return (
    <ListContext.Provider value={{ myImages, setMyImages }}>
      {props.children}
    </ListContext.Provider>
  );
};
