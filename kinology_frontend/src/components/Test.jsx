/* eslint-disable */
import { useState } from "react";
import ScrollTop from "./ReusableComponents/ScrollTop";

const Test = () => {
  const [open, setOpen] = useState(false);

  return <ScrollTop goToSearch={() => console.log("scrolling top")} />;
};

export default Test;
