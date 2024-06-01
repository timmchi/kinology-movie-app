import { useState } from "react";

import Button from "@mui/material/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";

import ContactForm from "./ContactForm";

const ContactModal = () => {
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
          <ContactForm setOpen={setOpen} />
          <ModalClose variant="plain" />
        </Sheet>
      </Modal>
    </>
  );
};

export default ContactModal;
