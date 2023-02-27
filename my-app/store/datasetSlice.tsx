import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store/store";
import { HYDRATE } from "next-redux-wrapper";

// Update dataset stuff for dataset array, bool check if data exists, 
// Type for our state
export interface DatasetState {
  data: number[],
  datasetLoaded: boolean,
  datasetProcessed: boolean,
  procResult: null | number,
}

// Initial state
const initialState: DatasetState = {
  data: [],
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

export const { setDatasetLoad, setProcResult } = datasetSlice.actions;

export const selectDataset = (state: AppState) => state.dataset.data;
export const selectProc = (state: AppState) => state.dataset.procResult;
export const hasData = (state: AppState) => state.dataset.datasetLoaded;
export const hasResult = (state: AppState) => state.dataset.datasetProcessed;

export default datasetSlice.reducer;