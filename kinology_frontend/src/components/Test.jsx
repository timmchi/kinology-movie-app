import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Button from "@mui/material/Button";
import Stack from "@mui/joy/Stack";
import { TextFieldElement, SliderElement } from "react-hook-form-mui";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import genreOptions from "../data/genres";
import ContactForm from "./ContactForm";

import {
  object,
  string,
  minLength,
  array,
  literal,
  union,
  minValue,
  maxValue,
  number,
  maxLength,
  optional,
} from "valibot";

const Test = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#609b76",
          "&:hover": { backgroundColor: "#00532f" },
          marginBottom: 1,
        }}
      >
        Contact Me
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: 650,
            borderRadius: "md",
            p: 5,
            boxShadow: "lg",
            bgcolor: "#F6E9B2",
          }}
        >
          <ContactForm />
          <ModalClose variant="plain" />
        </Sheet>
      </Modal>
    </>
  );
};

export default Test;
