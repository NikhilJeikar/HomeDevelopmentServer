import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: {},
  complete: true,
};

const is_complete = (files) => {
  var ret = false;
  Object.keys(files).map((key, index) => {
    if (files[key].progress === "queued" || files[key].progress === "started") {
      ret = true;
    }
    return null;
  });
  return ret;
};
export const add_file = createAsyncThunk(
  "upload_progress/add_files",
  async (params, thunkAPI) => {
    return { path: params.path, progress: "queued" };
  }
);

export const finish_download = createAsyncThunk(
  "upload_progress/finish_download",
  async (params, thunkAPI) => {
    return { path: params.path, progress: "stopped" };
  }
);

export const start_download = createAsyncThunk(
  "upload_progress/start_download",
  async (params, thunkAPI) => {
    return { path: params.path, close: params.close, progress: "started" };
  }
);

export const crash_download = createAsyncThunk(
  "upload_progress/crash_download",
  async (params, thunkAPI) => {
    return { path: params.path, progress: "failed" };
  }
);

export const upload_progress = createSlice({
  name: "upload_progress",
  initialState: initialState,
  reducers: {
    clear: (state, action) => {
      state.files = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_file.fulfilled, (state, action) => {
        state.complete = false;
        state.files[action.payload.path] = {
          progress: action.payload.progress,
        };
      })
      .addCase(add_file.pending, (state, action) => {})
      .addCase(add_file.rejected, (state, action) => {})
      .addCase(finish_download.fulfilled, (state, action) => {
        state.files[action.payload.path].progress = action.payload.progress;
        if (!is_complete(state.files)) {
          state.complete = true;
        }
      })
      .addCase(finish_download.pending, (state, action) => {})
      .addCase(finish_download.rejected, (state, action) => {
        if (!is_complete(state.files)) {
          state.complete = true;
        }
      })
      .addCase(start_download.fulfilled, (state, action) => {
        state.files[action.payload.path].progress = action.payload.progress;
      })
      .addCase(start_download.pending, (state, action) => {})
      .addCase(start_download.rejected, (state, action) => {})
      .addCase(crash_download.fulfilled, (state, action) => {
        state.files[action.payload.path].progress = action.payload.progress;
        state.files[action.payload.path].close = action.payload.close;
        if (!is_complete(state.files)) {
          state.complete = true;
        }
      })
      .addCase(crash_download.pending, (state, action) => {})
      .addCase(crash_download.rejected, (state, action) => {
        if (!is_complete(state.files)) {
          state.complete = true;
        }
      });
  },
});

export const { clear } = upload_progress.actions;