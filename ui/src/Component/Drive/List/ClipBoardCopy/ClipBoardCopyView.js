import { Alert, Snackbar } from "@mui/material";

export const ClipBoardCopyView = ({ open, handleClose, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
