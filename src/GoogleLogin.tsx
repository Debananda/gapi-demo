import React from "react";

interface GoogleLoginProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  socialId: string;
  scope?: string;
  fetchBasicProfile?: boolean;
  buttonText?: string;
  prompt?: string;
  responseHandler: (response: GoogleResponse) => void;
}

interface GoogleLoginState {
  disabled: boolean;
}

export interface GoogleResponse {
  googleId: string;
  tokenId: string;
  accessToken: string;
  profileObj: {
    googleId: string;
    imageUrl: string;
    email: string;
    name: string;
    givenName: string;
    familyName: string;
  };
}

class GoogleLogin extends React.Component<GoogleLoginProps, GoogleLoginState> {
  state = {
    disabled: true,
  };

  componentDidMount() {
    const { socialId, scope, fetchBasicProfile } = this.props;
    ((d, s, id, callback) => {
      let gs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        this.setState({
          disabled: false,
        });
      } else {
        const js = d.createElement(s) as HTMLImageElement;
        js.id = id;
        js.src = "https://apis.google.com/js/platform.js";
        gs.parentNode?.insertBefore(js, gs);
        js.onload = callback;
      }
    })(document, "script", "google-platform", () => {
      window.gapi.load("auth2", () => {
        this.setState({
          disabled: false,
        });
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init({
            client_id: socialId,
            fetch_basic_profile: fetchBasicProfile,
            scope: scope,
          });
        }
      });
    });
  }

  // checkLoginState(response) {
  //   const authInstance  = window.gapi.auth2.getAuthInstance()
  //   if (authInstance) {
  //     const profile = authInstance.currentUser.get().getBasicProfile();
  //   } else {
  //     if (this.props.responseHandler) {
  //       this.props.responseHandler({ status: response.status });
  //     }
  //   }
  // }

  clickHandler() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const options = {
      prompt: this.props.prompt,
    };
    auth2.signIn(options).then((res) => {
      const basicProfile = res.getBasicProfile();
      const authResponse = res.getAuthResponse();
      const gResponse: GoogleResponse = {
        googleId: basicProfile.getId(),
        tokenId: authResponse.id_token,
        accessToken: authResponse.access_token,
        profileObj: {
          googleId: basicProfile.getId(),
          imageUrl: basicProfile.getImageUrl(),
          email: basicProfile.getEmail(),
          name: basicProfile.getName(),
          givenName: basicProfile.getGivenName(),
          familyName: basicProfile.getFamilyName(),
        },
      };
      console.log(authResponse);
      return this.props.responseHandler(gResponse);
    });
  }

  render() {
    const { socialId, scope, fetchBasicProfile, responseHandler, children, buttonText, ...props } = this.props;

    props.disabled = this.state.disabled || props.disabled;

    return (
      <button {...props} onClick={this.clickHandler.bind(this)}>
        {children}
        {buttonText}
      </button>
    );
  }
}

// GoogleLogin.defaultProps = {
//   fetchBasicProfile: false,
//   scope: "profile",
//   prompt: "",
// };

export default GoogleLogin;
