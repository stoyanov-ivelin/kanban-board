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

export const AdminPanelLinks = ["Users", "Boards", "Issue config", "Workflows"];

export const SkillsImages = {
  Java: "https://www.meme-arsenal.com/memes/aedccb7b888468d35e9855e503b8e706.jpg",
  "C#": "https://e7.pngegg.com/pngimages/340/226/png-clipart-purple-and-white-logo-c-computer-programming-software-development-programmer-marklogic-coder-miscellaneous-purple.png",
  Scala: "https://cdn.iconscout.com/icon/free/png-256/scala-226059.png",
  GoLang: "https://img.icons8.com/color/452/golang.png",
  JavaScript:
    "https://cdn.iconscout.com/icon/free/png-512/javascript-2752148-2284965.png",
};
