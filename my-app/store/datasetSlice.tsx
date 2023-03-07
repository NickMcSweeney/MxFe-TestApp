import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store/store";

// Update dataset stuff for dataset array, bool check if data exists, 
// Type for our state
export interface DatasetState {
  data: number[],
  dataServerState: boolean,
  datasetLoaded: boolean,
  datasetProcessed: boolean,
  procResult: null | number,
}

// Initial state
const initialState: DatasetState = {
  data: [],
  dataServerState: false,
  datasetLoaded: false,
  datasetProcessed: false,
  procResult: null,
};

// Actual Slice
export const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setDatasetLoad(state, action) {
      state.data = action.payload;
      state.datasetLoaded = true;
    },
    setServerState(state, action) {
      state.dataServerState = action.payload;
    },
    setProcResult(state, action) {
      state.procResult = action.payload;
      state.datasetProcessed = true;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.dataset,
      };
    },
  },
});

export const { setDatasetLoad, setProcResult, setServerState } = datasetSlice.actions;

export const selectDataset = (state: AppState) => state.dataset.data;
export const selectProc = (state: AppState) => state.dataset.procResult;
export const hasData = (state: AppState) => state.dataset.datasetLoaded;
export const hasResult = (state: AppState) => state.dataset.datasetProcessed;
export const hasServer = (state: AppState) => state.dataset.dataServerState;

export default datasetSlice.reducer;