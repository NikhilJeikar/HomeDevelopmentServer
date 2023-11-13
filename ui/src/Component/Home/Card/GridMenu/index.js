import { GridMenuView } from "./GridMenuView";

export const GridMenu = ({
  anchorEl,
  open,
  handleClose,
  download,
  delete_request,
  rename,
}) => {
  return (
    <GridMenuView
      anchorEl={anchorEl}
      open={open}
      handleClose={handleClose}
      download={download}
      delete_request={delete_request}
      rename={rename}
    />
  );
};
