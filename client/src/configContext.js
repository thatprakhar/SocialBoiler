import React, { Component, createContext } from "react";

// Provider and Consumer are connected through their "parent" context
const { Provider, Consumer } = createContext();

// Provider will be exported wrapped in ConfigProvider component.
class ConfigProvider extends Component {
  state = {
    userLoggedIn: false, // Mock login
    profile: {
      // Mock user data
      username: "",
      image: "",
      bio: "I'm Mogran—so... yeah.",
      authKey: ""
    },
    toggleLogin: () => {
      const setTo = !this.state.userLoggedIn;
      this.setState({ userLoggedIn: setTo });
    }
  };

  render() {
    return (
      <Provider
        value={{
          userLoggedIn: this.state.userLoggedIn,
          profile: this.state.profile,
          toggleLogin: this.state.toggleLogin
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { ConfigProvider };

// I make this default since it will probably be exported most often.
export default Consumer;
