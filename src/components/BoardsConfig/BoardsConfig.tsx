import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { IBoard, IStatus } from "common/models";
import ColumnMenu from "components/BoardsConfig/ColumnMenu/ColumnMenu";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  addBoard,
  addColumn,
  addStatusToColumn,
  addStatusToUnusedStatuses,
  renameColumn,
} from "common/actions";
import "./BoardsConfig.css";

interface BoardsConfigProps {
  boards: Array<IBoard>;
  statuses: Array<IStatus>;
  dispatch: AppDispatch;
}

interface BoardsConfigState {
  anchorEl: null | HTMLElement;
  columnToRename: null | number;
  columnToRenameError: string;
  newColumnName: string;
  newBoardName: string;
  boardError: string;
  showAddBoardField: boolean;
  tabSelected: number;
}

class BoardsConfig extends Component<BoardsConfigProps, BoardsConfigState> {
  constructor(props: BoardsConfigProps) {
    super(props);

    this.state = {
      anchorEl: null,
      columnToRename: null,
      columnToRenameError: "",
      newColumnName: "",
      newBoardName: "",
      boardError: "",
      showAddBoardField: false,
      tabSelected: 0,
    };
  }

  render() {
    return (
      <Grid container>
        <Grid container className="boards-config-heading">
          <Typography variant="h3">Boards configuration </Typography>
        </Grid>
        <Grid container>
          <Grid container direction="column" xs={2} className="boards-tabs">
            {this.renderTabs()}
            {this.renderAddBoard()}
          </Grid>
          <Grid container xs={9}>
            {this.renderUnusedStatuses()}
            {this.renderColumns()}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderTabs(): JSX.Element {
    const { boards } = this.props;
    const { tabSelected } = this.state;

    return (
      <Grid item>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabSelected}
          onChange={this.handleTabChange}
        >
          {boards.map((board) => (
            <Tab label={board.name}></Tab>
          ))}
        </Tabs>
      </Grid>
    );
  }

  renderAddBoard(): JSX.Element {
    const { boardError, showAddBoardField } = this.state;

    return (
      <Grid item>
        {showAddBoardField ? (
          <>
            <TextField
              onChange={this.handleAddBoardChange}
              defaultValue={""}
              variant="outlined"
              margin="normal"
              placeholder="Enter a board name..."
              helperText={boardError}
              error={boardError !== ""}
            />
            <IconButton color="secondary" onClick={this.handleAddBoardSubmit}>
              <CheckIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={this.handleCloseAddBoardField}
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <Button
            className="add-board-button"
            variant="outlined"
            color="primary"
            onClick={this.handleOpenAddBoardField}
          >
            Add new board
          </Button>
        )}
      </Grid>
    );
  }

  renderUnusedStatuses(): JSX.Element {
    const { statuses, boards } = this.props;
    const { tabSelected } = this.state;

    const usedStatuses = boards[tabSelected].columns.flatMap(
      (column) => column.statuses
    );
    const unusedStatuses = statuses.filter(
      (status) => !usedStatuses.includes(status)
    );

    return (
      <>
        <Typography variant="h3">Unused Statuses</Typography>
        <Paper
          variant="outlined"
          className="unused-statuses-container"
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDrop={(e) => this.handleDropInStatuses(e, tabSelected)}
        >
          <Grid container spacing={2}>
            {unusedStatuses.map((status) => (
              <Grid item>
                <Paper
                  draggable
                  variant="outlined"
                  className="unused-status"
                  onDragStart={(e) =>
                    this.handleDragStartInStatuses(e, status.id)
                  }
                >
                  {status.name}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </>
    );
  }

  renderColumns(): JSX.Element {
    const { tabSelected, columnToRename } = this.state;
    const { columns } = this.props.boards[tabSelected];

    return (
      <>
        <Typography variant="h3">Columns</Typography>
        <Grid container spacing={4} className="board-config-column-container">
          {columns.map((column, index) => {
            return (
              <Grid item className="board-config-column-item">
                <Paper
                  onDragEnter={this.handleDragEnter}
                  onDragOver={this.handleDragOver}
                  onDrop={(e) => this.handleDropInColumn(e, tabSelected, index)}
                  variant="outlined"
                  className="board-config-column"
                >
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {columnToRename === index ? (
                      this.renderRenameColumnField(column.name, index)
                    ) : (
                      <>
                        <Grid item>{column.name}</Grid>
                        <ColumnMenu
                          handleOpenRenameField={this.handleOpenRenameField}
                          handleCloseRenameField={this.handleCloseRenameField}
                          columnIndex={index}
                          tabSelected={tabSelected}
                        ></ColumnMenu>
                      </>
                    )}
                  </Grid>
                  <Divider className="divider" />
                  <Grid container justifyContent="center" spacing={2}>
                    {column.statuses.map((status) => (
                      <Grid item>
                        <Paper
                          className="column-status"
                          draggable
                          onDragStart={(e) =>
                            this.handleDragStartInColumn(e, status.id, index)
                          }
                          variant="outlined"
                        >
                          {status.name}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
          <Grid item>
            <Paper variant="outlined" className="board-config-column">
              <Button
                size="large"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={this.handleAddColumn}
              >
                Add Column
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }

  renderRenameColumnField(defaultName: string, columnIndex: number) {
    const { columnToRenameError } = this.state;

    return (
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <TextField
            onChange={this.handleRenameColumnChange}
            defaultValue={defaultName}
            variant="standard"
            placeholder="Enter a title..."
            helperText={columnToRenameError}
            error={columnToRenameError !== ""}
          />
        </Grid>
        <Grid container xs={6}>
          <Grid item xs={6}>
            <IconButton
              color="secondary"
              onClick={() => this.handleRenameColumnSubmit(columnIndex)}
            >
              <CheckIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <IconButton color="secondary" onClick={this.handleCloseRenameField}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  handleDragStartInStatuses = (e: React.DragEvent, statusId: number) => {
    e.dataTransfer.setData("text/plain", `${statusId}`);
  };

  handleDragStartInColumn = (
    e: React.DragEvent,
    statusId: number,
    columnIndex: number
  ) => {
    e.dataTransfer.setData("text/plain", `${statusId},${columnIndex}`);
  };

  handleDropInColumn = (
    e: React.DragEvent,
    boardIndex: number,
    columnIndex: number
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain").split(",");
    const statusId = +data[0];
    const prevColumnIndex = +data[1];

    if (isNaN(statusId)) {
      return;
    }

    this.props.dispatch(
      addStatusToColumn({ prevColumnIndex, boardIndex, columnIndex, statusId })
    );
  };

  handleDropInStatuses = (e: React.DragEvent, boardIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain").split(",");
    const statusId = +data[0];
    const columnIndex = +data[1];

    if (isNaN(statusId) || isNaN(columnIndex)) {
      return;
    }

    this.props.dispatch(
      addStatusToUnusedStatuses({ boardIndex, columnIndex, statusId })
    );
  };

  handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      tabSelected: newValue,
    });
  };

  handleCloseAddBoardField = () => {
    this.setState({
      showAddBoardField: false,
      boardError: "",
    });
  };

  handleOpenAddBoardField = () => {
    this.setState({
      showAddBoardField: true,
    });
  };

  handleAddBoardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    this.setState({
      newBoardName: value,
    });
  };

  handleAddBoardSubmit = () => {
    const hasErrors = this.handleBoardValidation();

    if (hasErrors) {
      return;
    }

    this.props.dispatch(addBoard({ name: this.state.newBoardName }));

    this.handleCloseAddBoardField();
  };

  handleBoardValidation = () => {
    const { newBoardName } = this.state;
    const nameAlreadyExists = this.props.boards.some(
      (board) =>
        board.name.toLowerCase().trim() === newBoardName.toLowerCase().trim()
    );

    if (newBoardName.length < 3 || newBoardName.length > 50) {
      this.setState({
        boardError: "Please enter a board name between 3 and 50 characters",
      });

      return true;
    }

    if (nameAlreadyExists) {
      this.setState({
        boardError: "This board name already exists",
      });

      return true;
    }
  };

  handleAddColumn = () => {
    this.props.dispatch(addColumn({ boardIndex: this.state.tabSelected }));
  };

  handleColumnValidation = () => {
    const { newColumnName } = this.state;

    if (newColumnName.length < 3 || newColumnName.length > 50) {
      this.setState({
        columnToRenameError: "Please enter a name between 3 and 50 characters",
      });

      return true;
    }
  };

  handleRenameColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;

    this.setState({
      newColumnName: name,
    });
  };

  handleRenameColumnSubmit = (columnIndex: number) => {
    const hasError = this.handleColumnValidation();

    if (hasError) {
      return;
    }

    const { dispatch } = this.props;
    const { newColumnName, tabSelected } = this.state;

    dispatch(
      renameColumn({
        boardIndex: tabSelected,
        columnIndex,
        name: newColumnName,
      })
    );
    this.handleCloseRenameField();
  };

  handleOpenRenameField = (index: number) => {
    this.setState({
      columnToRename: index,
    });
  };

  handleCloseRenameField = () => {
    this.setState({
      columnToRename: null,
      columnToRenameError: "",
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  boards: state.boards,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(BoardsConfig);
