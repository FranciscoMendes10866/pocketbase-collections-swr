import React from "react";

import { List } from "../components/List";
import { usePocket } from "../contexts/PocketContext";

export const Protected = () => {
  const { logout } = usePocket();

  return (
    <section>
      <button onClick={logout}>Logout</button>
      <br />
      <List />
    </section>
  );
};
