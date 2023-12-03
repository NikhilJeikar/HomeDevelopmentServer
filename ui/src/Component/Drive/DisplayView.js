import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import {
  CreateNewFolder,
  DriveFolderUpload,
  Logout,
  NoteAdd,
  UploadFile,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice";
import { Popup } from "./CreatePopUp";
import { create_file, create_folder, upload_file,clearState } from "./slice";
import { SetCookies } from "../../utils";
import { CollapsedBreadcrumbs } from "./BreadCrumbs";
import { ListWindow } from "./List";

const drawerWidth = 240;

export const DisplayView = () => {
  const dispatch = useDispatch();

  const { current_path, path_list } = useSelector((state) => state.drive);

  const [folderPopup, setFolderPopup] = React.useState(false);
  const [filePopup, setFilePopup] = React.useState(false);

  const { authorized } = useSelector((state) => state.drive);
  React.useEffect(() => {
    if (!authorized) {
        navigate("/");
    }
  });
  const navigate = useNavigate();

  const CreateFile = (name) => {
    if (name !== "") {
      dispatch(
        create_file({
          name: name,
          current_path: current_path,
        })
      );
    }
    setFilePopup(false);
  };

  const CreateFolder = (name) => {
    if (name !== "") {
      dispatch(
        create_folder({
          current_path: current_path,
          name: name,
        })
      );
    }
  };

  const CloseFolder = () => {
    setFolderPopup(false);
  };

  const CloseFile = () => {
    setFilePopup(false);
  };

  const UploadFileFunction = (files) => {
    dispatch(upload_file({ file: files, path: current_path }));
  };
  
  const LogoutUser = () => {
    dispatch(logout());
    SetCookies(null,null)
    dispatch(clearState());
    navigate("/");
  };
  return (
    <Box sx={{ display: "flex" }} id="content">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" noWrap component="div">
            Drive
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar variant="dense" />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem key={"upload file"} disablePadding>
              <ListItemButton variant="contained" component="label">
                <ListItemIcon>
                  <UploadFile />
                </ListItemIcon>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  hidden
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) => {
                    UploadFileFunction(e.target.files);
                  }}
                />
                <ListItemText primary="Upload File" />
              </ListItemButton>
            </ListItem>
            <ListItem key={"upload folder"} disablePadding>
              <ListItemButton variant="contained" component="label">
                <ListItemIcon>
                  <DriveFolderUpload />
                </ListItemIcon>
                <input
                  type="file"
                  directory=""
                  webkitdirectory=""
                  hidden
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) => {
                    UploadFileFunction(e.target.files);
                  }}
                />
                <ListItemText primary="Upload Folder" />
              </ListItemButton>
            </ListItem>
            <ListItem key={"create file"} disablePadding>
              <ListItemButton
                onClick={() => {
                  setFilePopup(true);
                }}
              >
                <ListItemIcon>
                  <NoteAdd />
                </ListItemIcon>
                <ListItemText primary="Create File" />
              </ListItemButton>
            </ListItem>
            <ListItem key={"create folder"} disablePadding>
              <ListItemButton
                onClick={() => {
                  setFolderPopup(true);
                }}
              >
                <ListItemIcon>
                  <CreateNewFolder />
                </ListItemIcon>
                <ListItemText primary="Create Folder" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            position: "absolute",
            bottom: 0,
          }}
        >
          <List>
            <ListItem key={"Logout"} disablePadding>
              <ListItemButton
                variant="contained"
                component="label"
                onClick={LogoutUser}
              >
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" style={{ padding: 12 }} sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar variant="dense" />
        <Popup
          open={filePopup}
          title={"Filename"}
          handleClose={CloseFile}
          onSubmit={CreateFile}
          buttonText="Create"
        />
        <Popup
          open={folderPopup}
          title={"Foldername"}
          handleClose={CloseFolder}
          onSubmit={CreateFolder}
          buttonText="Create"
        />
        <CollapsedBreadcrumbs Path={path_list} />
        <ListWindow/>
      </Box>
    </Box>
  );
};
