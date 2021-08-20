export enum Status {
  New = "New",
  InProgress = "In Progress",
  Done = "Done",
}

export const issueConstants = {
  descriptionMaxChars: 255,
  descriptionErrorMsg: "Please enter a description between 3 and 255 characters!",
  titleErrorMsg: "Please enter a title between 3 and 50 characters!",
  assigneeErrorMsg: "Please select an assignee",
}