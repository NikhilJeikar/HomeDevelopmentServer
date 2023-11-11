import { GridMenuView } from "./GridMenuView";

export const GridMenu = ({ anchorEl, open, handleClose,download }) => {
  return (
    <GridMenuView anchorEl={anchorEl} open={open} handleClose={handleClose} download={download}/>
  );
};
