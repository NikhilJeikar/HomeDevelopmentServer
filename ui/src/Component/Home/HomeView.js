import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { change_folder, file_list } from "./slice";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { GridCard } from "./Card";

export const HomeView = () => {
  const { username, session_id } = useSelector((state) => state.user);
  const { current_path, list, need_update } = useSelector(
    (state) => state.home
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (username != null && session_id != null && need_update) {
      dispatch(
        file_list({
          username: username,
          session_id: session_id,
          current_path: current_path,
        })
      );
    }
  }, [username, session_id, current_path, need_update, dispatch]);

  const directory_click = (name)=>{
    dispatch(change_folder({username, session_id,current_path,name}))
  }
  if (list.length === 0) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid xs="auto">
          <Typography>No files to show</Typography>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={1} columns={{ xs: 6, sm: 12, md: 18 }}>
        {list.map((value, index) => {
          return (
            <Grid key={value.name} xs={6} sm={6} md={6}>
              <GridCard details={value} handle={directory_click} />
            </Grid>
          );
        })}
      </Grid>
    );
  }
};
