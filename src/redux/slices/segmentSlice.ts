import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ISegmentType {
  segmentData: null | [];
  count: number;
  activeSegment: number | null;
}

const initialState = {
  segmentData: [],
  count: 0,
  activeSegment: 0,
};

export const SegmentSlice = createSlice({
  name: "segment",
  initialState,
  reducers: {
    setSegmentData: (state, action: PayloadAction<[]>) => {
      state.segmentData = action.payload;
    },
    setSegmentCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setActiveSegment: (state, action: PayloadAction<number | string>) => {
      state.activeSegment = Number(action.payload);
    },
  },
});

export const segmentDataSelector = (state: { segment: ISegmentType }) =>
  state.segment.segmentData;

export const segmentCountSelector = (state: { segment: ISegmentType }) =>
  state.segment.count;

export const activeSegmentSelector = (state: { segment: ISegmentType }) =>
  state.segment.activeSegment;

const { actions, reducer } = SegmentSlice;

export const { setSegmentData, setSegmentCount, setActiveSegment } = actions;
export const setsegmentData = (data: []) => {
  setSegmentData(data);
};
export const setsegmentCount = (count: number) => {
  setSegmentCount(count);
};
export const setactiveSegment = (activeSegment: number) => {
  setActiveSegment(activeSegment);
};

export default reducer;
