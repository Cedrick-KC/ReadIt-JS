import "./app/globals.css";

import { RouterProvider } from "./app/router";
import { SessionProvider } from "./providers/session";

function Root() {
  return (
    <SessionProvider>
      <RouterProvider>
        <div />
      </RouterProvider>
    </SessionProvider>
  );
}

export default Root;