import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  current_path: "",
  list: [],
  need_update: true,
  path_list: [],
  send_list: [],
};

export const file_list = createAsyncThunk(
  "home/file-list",
  async (params, thunkAPI) => {
    var response = await fetch("/home/file-list", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        session_id: params.session_id,
        current_path: params.current_path,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return {
      failed: false,
      list: json.list,
      path: json.dir,
      username: params.username,
      dir_list: json.dir_list,
    };
  }
);

export const create_file = createAsyncThunk(
  "home/create-file",
  async (params, thunkAPI) => {
    var response = await fetch("/home/create-file", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        session_id: params.session_id,
        current_path: params.current_path,
        name: params.name,
        dir: false,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return { failed: false, response: json };
  }
);

export const create_folder = createAsyncThunk(
  "home/create-folder",
  async (params, thunkAPI) => {
    var response = await fetch("/home/create-folder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        session_id: params.session_id,
        name: params.name,
        current_path: params.current_path,
        dir: true,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return { failed: false, response: json };
  }
);

export const change_folder = createAsyncThunk(
  "home/change-folder",
  async (params, thunkAPI) => {
    var response = await fetch("/home/change-folder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        session_id: params.session_id,
        name: params.name,
        current_path: params.current_path,
        dir: false,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return {
      failed: false,
      list: json.list,
      path: json.dir,
      dir_list: json.dir_list,
    };
  }
);

export const upload_file = createAsyncThunk(
  "home/upload-file",
  async (params, thunkAPI) => {
    console.log(params);
    const func = async (file, path, username) => {
      let data = new FormData();
      data.append("files", file, file.name);
      var response = await fetch(
        `/home/upload-file?path=${path.toString()}&username=${username}`,
        {
          method: "POST",
          body: data,
        }
      );
      var json = await response.json();
      var status = await response.status;
      if (status !== 200) {
        return { failed: true };
      }
      return {
        failed: false,
        list: json.list,
        path: json.dir,
        dir_list: json.dir_list,
      };
    };
    for (var i = 0; i < params.file.length; i++) {
      console.log(params.file);
      await func(params.file[i], params.path, params.username);
    }
  }
);

export const download_file = createAsyncThunk(
  "/home/download-file",
  async (params, thunkAPI) => {
    fetch(`/home/download-file?current_path=${params.current_path}&username=${params.username}&name=${params.name}`)
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      }).catch(error => console.error('Error during fetch operation:', error));
  }
);

export const download_folder = createAsyncThunk(
  "/home/download-folder",
  async (params, thunkAPI) => {
    fetch(`/home/download-folder?current_path=${params.current_path}&username=${params.username}&name=${params.name}`)
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name+".zip");
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      }).catch(error => console.error('Error during fetch operation:', error));
  }
);

export const home = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      const { path } = action.payload;
      state.current_path = path;
    },
    StopUpdate: (state, action) => {
      state.need_update = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(file_list.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.current_path = action.payload.path;
        state.path_list = action.payload.dir_list;
        state.need_update = false;
      })
      .addCase(file_list.pending, (state, action) => {
        state.need_update = false;
      })
      .addCase(file_list.rejected, (state, action) => {
        state.need_update = false;
      })
      .addCase(create_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_file.pending, (state, action) => {})
      .addCase(create_file.rejected, (state, action) => {})
      .addCase(create_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_folder.pending, (state, action) => {})
      .addCase(create_folder.rejected, (state, action) => {})
      .addCase(change_folder.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.current_path = action.payload.path;
        state.need_update = false;
        state.path_list = action.payload.dir_list;
      })
      .addCase(change_folder.pending, (state, action) => {})
      .addCase(change_folder.rejected, (state, action) => {})
      .addCase(upload_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(upload_file.pending, (state, action) => {})
      .addCase(upload_file.rejected, (state, action) => {
        state.need_update = true;
      });
  },
});

export default home.reducer;
