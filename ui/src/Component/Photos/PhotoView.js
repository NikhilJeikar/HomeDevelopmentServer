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
import { Logout } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice";
import { SetCookies } from "../../utils";
import { fetch_faces, fetch_image_details } from "./slice";
import { PhotoGrid } from "./Grid";
import { useEffect, useState } from "react";
import { FaceListItem } from "./FaceListItem";

const drawerWidth = 240;

export const PhotosView = () => {
  const dispatch = useDispatch();
  const [constructed, setConstructed] = useState(false);
  const navigate = useNavigate();

  const { face_list, refresh_photo_list } = useSelector((state) => state.photo);

  const LogoutUser = () => {
    dispatch(logout());
    SetCookies(null, null);

    navigate("/");
  };

  useEffect(() => {
    if (!constructed) {
      dispatch(fetch_image_details());
      dispatch(fetch_faces());
    }
    setConstructed(true);
  });
  useEffect(() => {
    if (refresh_photo_list) {
      console.log("Trigger")
      dispatch(fetch_faces());
    }
  },[refresh_photo_list]);

  return (
    <Box sx={{ display: "flex" }} id="content">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" noWrap component="div">
            Photos
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
            {face_list.map((value, index) => (
              <FaceListItem
                key={index}
                index={index}
                id={value.id}
                path={value.default_pic_path}
                name={value.name}
                x1={value.face_x1}
                x2={value.face_x2}
                y1={value.face_y1}
                y2={value.face_y2}
              />
            ))}
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
      <Box
        component="main"
        style={{ paddingLeft: 15, paddingTop: 0 }}
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Toolbar variant="dense" />
        <PhotoGrid />
      </Box>
    </Box>
  );
};
