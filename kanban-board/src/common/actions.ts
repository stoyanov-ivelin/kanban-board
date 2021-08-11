export const DRAG_BEGIN = "DRAG_BEGIN";
export const UPDATE_STATUS = "UPDATE_STATUS";

export const dragBegin = (index: number) => ({type: DRAG_BEGIN, payload: index});
export const updateStatus = (newStatus: string) => ({type: UPDATE_STATUS, payload: newStatus});