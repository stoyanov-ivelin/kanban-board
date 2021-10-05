import { Component } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { connect } from "react-redux";
import { RootState } from "store/store";
import { IStatus } from "common/models";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface SelectStatusFieldProps {
  transitions?: Array<string>;
  statuses: Array<IStatus>;
  status: IStatus;
  statusIndex: number;
  handleTransitionsChange: Function;
}

interface SelectStatusFieldState {
  selectedStatuses: Array<string>;
}

class SelectStatusField extends Component<
  SelectStatusFieldProps,
  SelectStatusFieldState
> {
  constructor(props: SelectStatusFieldProps) {
    super(props);
    const { transitions } = this.props;

    this.state = {
      selectedStatuses: transitions ? transitions : [],
    };
  }
  render() {
    const { statuses, status } = this.props;
    const { selectedStatuses } = this.state;

    return (
      <>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="select-status-label">{status.name}</InputLabel>
          <Select
            multiple
            labelId="select-status-label"
            value={selectedStatuses}
            onChange={this.handleSelectStatusChange}
            input={<OutlinedInput label={status.name} />}
            MenuProps={MenuProps}
          >
            {statuses.map((menuStatus) => {
              if (menuStatus.id !== status.id) {
                return (
                  <MenuItem key={menuStatus.id} value={menuStatus.name}>
                    {menuStatus.name}
                  </MenuItem>
                );
              }
              return null;
            })}
          </Select>
        </FormControl>
      </>
    );
  }

  handleSelectStatusChange = (event: SelectChangeEvent<Array<string>>) => {
    let { value } = event.target;
    if (typeof value === "string") {
      value = value.split(",");
    }

    const statuses = value.map((s) => {
      const status = this.props.statuses.find((st) => st.name === s);
      return status!;
    });

    this.props.handleTransitionsChange(statuses, this.props.statusIndex);
    this.setState({
      selectedStatuses: value,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  statuses: state.statuses,
});

export default connect(mapStateToProps)(SelectStatusField);
