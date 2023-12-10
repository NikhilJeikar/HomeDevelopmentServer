import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { DialogTitle, TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PopupView = ({
  title,
  open,
  handleClose,
  buttonText,
  onSubmit,
}) => {
  const [name, setName] = React.useState("");
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        margin="none"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            margin="none"
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} margin="none">
            Close
          </Button>
          <Button
            onClick={() => {
              handleClose();
              onSubmit(name);
            }}
            margin="none"
          >
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
