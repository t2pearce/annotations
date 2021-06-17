import React from "react";
import DrawerRight from "./DrawerRight";

class Vieewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer = open => () => {
    this.setState({
      right: open
    });
  };

  container = null;

  render() {
    return (
      <div>
        <div>
          Section that should be covered by drawer and backdrop.
          <button onClick={this.toggleDrawer(true)}>Open Drawer</button>
        </div>

        <DrawerRight
          anchor="left"
          variant="temporary"
          open={this.state.right}
          onClose={this.toggleDrawer(false)}
        >
          Test Drawer Content
        </DrawerRight>
      </div>
    );
  }
}

export default Viewer;
