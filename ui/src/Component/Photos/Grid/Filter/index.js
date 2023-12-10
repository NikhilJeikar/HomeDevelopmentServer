import { useDispatch, useSelector } from "react-redux";
import { FilterView } from "./FilterView";
import { clear_filter, remove_filter } from "../../slice";

export const Filter = () => {
  const dispatch = useDispatch();
  const { selected_list } = useSelector((state) => state.photo);
  const clear_filter_params = () => {
    dispatch(clear_filter());
  };
  const remove_filter_param = (id) => {
    dispatch(remove_filter({id:id}));
  };
  return (
    <FilterView
      selection={selected_list}
      clear={clear_filter_params}
      remove={remove_filter_param}
    />
  );
};
