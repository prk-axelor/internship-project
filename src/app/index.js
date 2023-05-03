import React from "react";
import { RouterProvider } from "react-router-dom";

import router from "app/router";
import Translate from "app/services/translate";
import Theme from "app/services/theme";

function Root() {
  return (
    <Theme>
      <Translate>
        <RouterProvider router={router} />
      </Translate>
    </Theme>
  );
}

export default Root;
