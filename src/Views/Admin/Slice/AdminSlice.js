import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
    name: "Admin_slice",
    initialState: {
        placeholderGlow: false
    },
    reducers: {
        getCampaignRequest(state, action) {
            return {
                ...state,
                placeholderGlow: true
            }
        },
        getCampaignResponse(state, action) {
            return {
                ...state,
                placeholderGlow: false
            }
        },
        getCampaignFailure(state, action) {
            return {
                ...state,
                placeholderGlow: false
            }
        }
    }
})

const { actions, reducer } = AdminSlice;

export const {
    getCampaignRequest,
    getCampaignResponse,
    getCampaignFailure
} = actions;

export default reducer;