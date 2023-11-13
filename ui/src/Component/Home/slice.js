import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readCookies } from "../../utils";

const initialState = {
  current_path: "",
  list: [],
  need_update: true,
  path_list: [],
  send_list: [],
  authorized: true,
};

export const file_list = createAsyncThunk(
  "home/file-list",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/home/file-list", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        user: username,
        session: session_id,
      },
      body: JSON.stringify({
        current_path: params.current_path,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return {
      failed: false,
      list: json.list,
      path: json.dir,
      dir_list: json.dir_list,
    };
  }
);

export const create_file = createAsyncThunk(
  "home/create-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/home/create-file", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        user: username,
        session: session_id,
      },
      body: JSON.stringify({
        current_path: params.current_path,
        name: params.name,
        dir: false,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const create_folder = createAsyncThunk(
  "home/create-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/home/create-folder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        user: username,
        session: session_id,
      },
      body: JSON.stringify({
        name: params.name,
        current_path: params.current_path,
        dir: true,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const change_folder = createAsyncThunk(
  "home/change-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/home/change-folder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        user: username,
        session: session_id,
      },
      body: JSON.stringify({
        name: params.name,
        current_path: params.current_path,
        dir: false,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
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
    var { username, session_id } = readCookies();
    const func = async (file, path) => {
      let data = new FormData();
      data.append("files", file, file.name);
      var response = await fetch(`/home/upload-file?path=${path.toString()}`, {
        method: "POST",
        headers: {
          user: username,
          session: session_id,
        },
        body: data,
      });
      var json = await response.json();
      var status = await response.status;
      if (status !== 200) {
        return thunkAPI.rejectWithValue(status);
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
      await func(params.file[i], params.path);
    }
  }
);

export const download_file = createAsyncThunk(
  "/home/download-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    fetch(
      `/home/download-file?current_path=${params.current_path}&name=${params.name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    )
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      })
      .catch((error) => console.error("Error during fetch operation:", error));
  }
);

export const download_folder = createAsyncThunk(
  "/home/download-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    fetch(
      `/home/download-folder?current_path=${params.current_path}&name=${params.name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    )
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name + ".zip");
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      })
      .catch((error) => console.error("Error during fetch operation:", error));
  }
);

export const delete_file = createAsyncThunk(
  "/home/delete-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(
      `/home/delete-file?current_path=${params.current_path}&name=${params.name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const delete_folder = createAsyncThunk(
  "/home/delete-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(
      `/home/delete-folder?current_path=${params.current_path}&name=${params.name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const rename_file = createAsyncThunk(
  "/home/rename-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(
      `/home/rename-file?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const rename_folder = createAsyncThunk(
  "/home/rename-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(
      `/home/rename-folder?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`,
      {
        headers: {
          user: username,
          session: session_id,
        },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
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
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(create_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_file.pending, (state, action) => {})
      .addCase(create_file.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(create_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_folder.pending, (state, action) => {})
      .addCase(create_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(change_folder.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.current_path = action.payload.path;
        state.need_update = false;
        state.path_list = action.payload.dir_list;
      })
      .addCase(change_folder.pending, (state, action) => {})
      .addCase(change_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(upload_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(upload_file.pending, (state, action) => {})
      .addCase(upload_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(download_file.fulfilled, (state, action) => {
      })
      .addCase(download_file.pending, (state, action) => {})
      .addCase(download_file.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(download_folder.fulfilled, (state, action) => {
      })
      .addCase(download_folder.pending, (state, action) => {})
      .addCase(download_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(delete_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(delete_file.pending, (state, action) => {})
      .addCase(delete_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(delete_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(delete_folder.pending, (state, action) => {})
      .addCase(delete_folder.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(rename_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(rename_file.pending, (state, action) => {})
      .addCase(rename_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        } 
      })
      .addCase(rename_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(rename_folder.pending, (state, action) => {})
      .addCase(rename_folder.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        } 
      });
  },
});

export default home.reducer;