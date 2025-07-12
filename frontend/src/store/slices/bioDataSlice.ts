import biodata from "../../assets/initialData/biodata.json";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Biodata } from "../../assets/types";

const biodataSlice = createSlice({
  name: "biodata",
  initialState: biodata as Biodata,
  reducers: {
    updateBiodata: (state, action: PayloadAction<Partial<Biodata>>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { updateBiodata } = biodataSlice.actions;
export default biodataSlice.reducer;