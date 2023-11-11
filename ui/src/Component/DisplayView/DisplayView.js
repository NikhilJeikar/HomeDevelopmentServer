import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet } from "react-router-dom";
import {
  CreateNewFolder,
  DriveFolderUpload,
  Logout,
  NoteAdd,
  UploadFile,
} from "@mui/icons-material";
import { readCookies } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../slice";
import { Popup } from "../Home/CreatePopUp";
import { create_file, create_folder, upload_file } from "../Home/slice";
import { CollapsedBreadcrumbs } from "../Home/BreadCrumbs";
import { LinearProgress } from "@mui/material";

const drawerWidth = 240;

export const DisplayView = () => {
  const { username, session_id } = readCookies();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setToken({ username, session_id }));
  });

  const { current_path, path_list } = useSelector((state) => state.home);

  const [folderPopup, setFolderPopup] = React.useState(false);
  const [filePopup, setFilePopup] = React.useState(false);

  const CreateFile = (name) => {
    if (name !== "") {
      dispatch(
        create_file({
          username: username,
          session_id: session_id,
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
          username: username,
          session_id: session_id,
          current_path: current_path,
          name: name,
        })
      );
    }
    setFolderPopup(false);
  };

  const UploadFileFunction = (files) => {
    dispatch(
      upload_file({ file: files, path: current_path, username: username })
    );
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" noWrap component="div">
            Development Portal
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
            <ListItem>
              <Box sx={{ width: "100%" }}>
              <Typography>Storage Sense</Typography>
                <LinearProgress variant="determinate" value={10} />
              </Box>
            </ListItem>
            <ListItem key={"Logout"} disablePadding>
              <ListItemButton variant="contained" component="label">
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
        <Popup open={filePopup} title={"Filename"} handleClose={CreateFile} />
        <Popup
          open={folderPopup}
          title={"Foldername"}
          handleClose={CreateFolder}
        />
        <CollapsedBreadcrumbs Path={path_list} />
        <Outlet />
      </Box>
    </Box>
  );
};
