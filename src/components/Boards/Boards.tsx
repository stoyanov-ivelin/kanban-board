import {
  ClickAwayListener,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  NativeSelect,
  Paper,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { Component } from "react";
import "components/Boards/Boards.css";
import Board from "components/Boards/Board/Board";
import { IBoard } from "common/models";
import CreateIssue from "components/Issue/CreateEditIssue/CreateIssue/CreateIssue";
import { GroupBy } from "common/constants";
import { connect } from "react-redux";
import { RootState } from "store/store";

interface BoardsProps {
  boards: Array<IBoard>;
}

interface BoardsState {
  groupBy: GroupBy;
  selectedBoardName: string;
  showDropdownMenu: boolean;
}

class Boards extends Component<BoardsProps, BoardsState> {
  constructor(props: BoardsProps) {
    super(props);

    this.state = {
      groupBy: GroupBy.NO_GROUPING,
      selectedBoardName: "Default",
      showDropdownMenu: false,
    };
  }
  render() {
    const { groupBy, selectedBoardName, showDropdownMenu } = this.state;

    return (
      <div>
        <Grid
          container
          className="heading"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Grid className="heading" item container xs={3}>
            <Typography variant="h3">Kanban Board</Typography>
            <IconButton onClick={this.handleToggleDropdown}>
              <ArrowDropDownIcon />
            </IconButton>
            {showDropdownMenu && (
              <ClickAwayListener onClickAway={this.handleCloseDropdown}>
                <MenuList className="dropdown-menu">
                <Paper variant="elevation" elevation={10}>
                  {this.props.boards.map((board, index) => (
                    <MenuItem
                      key={index}
                      selected={board.name === selectedBoardName}
                      onClick={() => this.handleSelectedBoardChange(board.name)}
                    >
                      {board.name}
                    </MenuItem>
                  ))}
                </Paper>
                </MenuList>
              </ClickAwayListener>
            )}
            <Grid item xs={6}>
              <FormControl className="select-group-by">
                <NativeSelect onChange={this.handleGroupBy}>
                  <option value="">No grouping</option>
                  <option value="assignee">Group by assignee</option>
                </NativeSelect>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <CreateIssue />
          </Grid>
          <Grid container spacing={4} className="board-grid-container">
            <Board
              groupBy={groupBy}
              selectedBoardName={selectedBoardName}
            ></Board>
          </Grid>
        </Grid>
      </div>
    );
  }

  handleCloseDropdown = () => {
    this.setState({
      showDropdownMenu: false,
    });
  };

  handleToggleDropdown = () => {
    this.setState({
      showDropdownMenu: true,
    });
  };

  handleSelectedBoardChange = (name: string) => {
    this.setState({
      selectedBoardName: name,
    });
  };

  handleGroupBy = (e: React.ChangeEvent<{ value: string }>) => {
    const selectedGroupBy = e.target.value;

    this.setState({
      groupBy: selectedGroupBy as GroupBy,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  boards: state.boards,
});

export default connect(mapStateToProps)(Boards);
