import { UpdateStatusPayload, CreateIssuePayload, EditIssuePayload, CreateUserPayload, EditUserPayload, CreateStatusPayload, DeleteStatusPayload, RenameColumnPayload, MoveColumnPayload, DeleteColumnPayload, AddColumnPayload, AddBoardPayload, AddStatusToColumnPayload, AddStatusToUnusedStatusesPayload, CreateWorkflowPayload, EditWorkflowPayload, DeleteWorkflowPayload } from "common/models";

export const UPDATE_STATUS = "UPDATE_STATUS";
export const CREATE_ISSUE = "CREATE_ISSUE";
export const EDIT_ISSUE = "EDIT_ISSUE";
export const CREATE_USER = "CREATE_USER";
export const EDIT_USER = "EDIT_USER";
export const CREATE_STATUS = "CREATE_STATUS";
export const DELETE_STATUS = "DELETE_STATUS";
export const RENAME_COLUMN = "RENAME_COLUMN";
export const MOVE_COLUMN = "MOVE_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_BOARD = "ADD_BOARD";
export const ADD_STATUS_TO_COLUMN = "ADD_STATUS_TO_COLUMN";
export const ADD_STATUS_TO_UNUSED_STATUSES = "ADD_STATUS_TO_UNUSED_STATUSES";
export const CREATE_WORKFLOW = "CREATE_WORKFLOW";
export const EDIT_WORKFLOW = "EDIT_WORKFLOW";
export const DELETE_WORKFLOW = "DELETE_WORKFLOW";



export const updateStatus = (payload: UpdateStatusPayload) => ({type: UPDATE_STATUS, payload});
export const createIssue = (payload: CreateIssuePayload) => ({type: CREATE_ISSUE, payload});
export const editIssue = (payload: EditIssuePayload) => ({type: EDIT_ISSUE, payload});
export const createUser = (payload: CreateUserPayload) => ({type: CREATE_USER, payload});
export const editUser = (payload: EditUserPayload) => ({type: EDIT_USER, payload});
export const createStatus = (payload: CreateStatusPayload) => ({type: CREATE_STATUS, payload});
export const deleteStatus = (payload: DeleteStatusPayload) => ({type: DELETE_STATUS, payload});
export const renameColumn = (payload: RenameColumnPayload) => ({type: RENAME_COLUMN, payload});
export const moveColumn = (payload: MoveColumnPayload) => ({type: MOVE_COLUMN, payload});
export const deleteColumn = (payload: DeleteColumnPayload) => ({type: DELETE_COLUMN, payload});
export const addColumn = (payload: AddColumnPayload) => ({type: ADD_COLUMN, payload});
export const addBoard = (payload: AddBoardPayload) => ({type: ADD_BOARD, payload});
export const addStatusToColumn = (payload: AddStatusToColumnPayload) => ({type: ADD_STATUS_TO_COLUMN, payload});
export const addStatusToUnusedStatuses = (payload: AddStatusToUnusedStatusesPayload) => ({type: ADD_STATUS_TO_UNUSED_STATUSES, payload});
export const createWorkflow = (payload: CreateWorkflowPayload) => ({type: CREATE_WORKFLOW, payload});
export const editWorkflow = (payload: EditWorkflowPayload) => ({type: EDIT_WORKFLOW, payload});
export const deleteWorkflow = (payload: DeleteWorkflowPayload) => ({type: DELETE_WORKFLOW, payload});