import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { change_folder, file_list } from "../slice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Row } from "./Row";

export const ListView = ({ setPath }) => {
  const { current_path, list, need_update } = useSelector(
    (state) => state.drive
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (need_update) {
      dispatch(
        file_list({
          current_path: current_path,
        })
      );
    }
  }, [current_path, need_update, dispatch]);

  const directory_click = (name) => {
    dispatch(change_folder({ current_path, name }));
  };

  return (
    <TableContainer elevation={0} style={{ height: "85vh", overflow: "auto" }}>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: "#efefef" }}>
              <Typography>Name</Typography>
            </TableCell>
            <TableCell style={{ backgroundColor: "#efefef" }}>
              <Typography>Author</Typography>
            </TableCell>
            <TableCell style={{ backgroundColor: "#efefef" }}>
              <Typography>Modified at</Typography>
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "#efefef" }}>
              <Typography>Action</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((value, index) => {
            return (
              <Row
                key={index}
                details={value}
                handle={directory_click}
                setPath={setPath}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
