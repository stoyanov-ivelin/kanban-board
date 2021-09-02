import { UpdateStatusPayload, CreateIssuePayload, EditIssuePayload, CreateUserPayload, EditUserPayload, CreateStatusPayload, DeleteStatusPayload } from "common/models";

export const UPDATE_STATUS = "UPDATE_STATUS";
export const CREATE_ISSUE = "CREATE_ISSUE";
export const EDIT_ISSUE = "EDIT_ISSUE";
export const CREATE_USER = "CREATE_USER";
export const EDIT_USER = "EDIT_USER";
export const CREATE_STATUS = "CREATE_STATUS";
export const DELETE_STATUS = "DELETE_STATUS";


export const updateStatus = (payload: UpdateStatusPayload) => ({type: UPDATE_STATUS, payload});
export const createIssue = (payload: CreateIssuePayload) => ({type: CREATE_ISSUE, payload});
export const editIssue = (payload: EditIssuePayload) => ({type: EDIT_ISSUE, payload});
export const createUser = (payload: CreateUserPayload) => ({type: CREATE_USER, payload});
export const editUser = (payload: EditUserPayload) => ({type: EDIT_USER, payload});
export const createStatus = (payload: CreateStatusPayload) => ({type: CREATE_STATUS, payload});
export const deleteStatus = (payload: DeleteStatusPayload) => ({type: DELETE_STATUS, payload});
