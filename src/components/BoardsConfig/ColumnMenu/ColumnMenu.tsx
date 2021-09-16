import {
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from '@material-ui/icons/Menu';
import { deleteColumn, moveColumn } from "common/actions";
import { IBoard } from "common/models";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import "./ColumnMenu.css";

interface ColumnMenuProps {
  columnIndex: number;
  handleOpenRenameField: (index: number) => void;
  handleCloseRenameField: () => void;
  tabSelected: number;
  boards: Array<IBoard>;
  dispatch: AppDispatch;
}

interface ColumnMenuState {
  anchorEl: null | HTMLElement;
  name: string;
}

class ColumnMenu extends Component<ColumnMenuProps, ColumnMenuState> {
  constructor(props: ColumnMenuProps) {
    super(props);

    this.state = {
      anchorEl: null,
      name: "",
    };
  }

  render() {
    const { anchorEl } = this.state;
    const { columnIndex, tabSelected, handleOpenRenameField } = this.props;
    const totalColumns = this.props.boards[tabSelected].columns.length;

    return (
      <Grid item>
        <IconButton
          onClick={this.handleAnchorElChange}
          color="primary"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          classes={{ paper: "column-menu" }}
          open={Boolean(anchorEl)}
          keepMounted
          anchorEl={anchorEl}
          onClose={this.handleClose}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={() => handleOpenRenameField(columnIndex)}>
            <ListItemText primary="Rename" />
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
          </MenuItem>
          {columnIndex !== 0 && (
            <MenuItem onClick={this.handleMoveLeft}>
              <ListItemText primary="Move left" />
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
            </MenuItem>
          )}
          {columnIndex !== totalColumns - 1 && (
            <MenuItem onClick={this.handleMoveRight}>
              <ListItemText primary="Move right" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </MenuItem>
          )}
          <MenuItem onClick={this.handleDelete}>
            <ListItemText primary="Delete" />
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </Grid>
    );
  }

  handleDelete = () => {
    const { columnIndex, tabSelected, dispatch } = this.props;

    dispatch(deleteColumn({ boardIndex: tabSelected, columnIndex }));
    this.handleClose();
  };

  handleMoveLeft = () => {
    const { columnIndex, tabSelected, dispatch } = this.props;

    dispatch(moveColumn({ boardIndex: tabSelected, columnIndex, to: "left" }));
    this.handleClose();
  };

  handleMoveRight = () => {
    const { columnIndex, tabSelected, dispatch } = this.props;

    dispatch(moveColumn({ boardIndex: tabSelected, columnIndex, to: "right" }));
    this.handleClose();
  };

  handleAnchorElChange = (event: React.MouseEvent<HTMLElement>) => {
    this.props.handleCloseRenameField();
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  boards: state.boards,
});

export default connect(mapStateToProps)(ColumnMenu);
