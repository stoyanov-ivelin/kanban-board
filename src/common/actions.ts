import { UpdateStatusPaylod } from "./models";

export const UPDATE_STATUS = "UPDATE_STATUS";

export const updateStatus = (payload: UpdateStatusPaylod) => ({type: UPDATE_STATUS, payload});