import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { LinkRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { create_share } from "../../slice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SharePopupView = ({ open, handleClose, fileName,popupStatus }) => {
  const [value, setValue] = React.useState("edit");
  const dispatch = useDispatch();
  const { path_list } = useSelector((state) => state.drive);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        margin="none"
      >
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker disablePast label="Close link at" />
          </LocalizationProvider>
          <FormControl style={{ paddingLeft: 10 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            >
              <MenuItem value="edit">Editor</MenuItem>
              <MenuItem value="view">Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(
                create_share({ read: value === "view", path: path_list + [fileName]})
              ).then((data) => {
                popupStatus("Copied to clipboard")
                navigator.clipboard.writeText(
                  `${window.location.origin}/drive?share=${data.payload.share_token}`
                );
                handleClose()
              });
            }}
            startIcon={<LinkRounded />}
          >
            Copy link
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
