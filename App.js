import React from "react";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import Campobase from "./componentes/base_Draw_Nav";

const store = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Campobase />
    </Provider>
  );
}
