import { UpdateStatusPayload, CreateIssuePayload } from "common/models";

export const UPDATE_STATUS = "UPDATE_STATUS";
export const CREATE_ISSUE = "CREATE_ISSUE";


export const updateStatus = (payload: UpdateStatusPayload) => ({type: UPDATE_STATUS, payload});
export const createIssue = (payload: CreateIssuePayload) => ({type: CREATE_ISSUE, payload});
