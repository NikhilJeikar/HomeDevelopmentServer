import { Delete } from "@mui/icons-material";
import { Avatar, Chip, Stack } from "@mui/material";

export const FilterView = ({ selection, clear, remove }) => {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip
        icon={<Delete />}
        sx={{ display: "flex", alignItems: "center" }}
        label="clear"
        onClick={() => {
          clear();
        }}
      ></Chip>
      {selection.map((value, index) => {
        return (
          <Chip
            key={index}
            variant="outlined"
            sx={{ display: "flex", alignItems: "center" }}
            avatar={<Avatar src={value.path} sizes="small" />}
            label={value.name}
            onDelete={() => {
              remove(value.id);
            }}
          />
        );
      })}
    </Stack>
  );
};
