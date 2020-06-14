import React from "react";
import GoogleLogin, { GoogleResponse } from "./GoogleLogin";
import "./App.css";

function App() {
  const responseGoogle = (resp: GoogleResponse) => {
    console.log(resp);
  };
  return (
    <div className="App">
      <GoogleLogin
        socialId="1013950109638-vifmb8a487e1sav7vuh41p3vs5eec9od.apps.googleusercontent.com"
        className="google-login"
        scope="profile email https://www.googleapis.com/auth/admin.directory.user.readonly"
        prompt="select_account"
        fetchBasicProfile={true}
        responseHandler={responseGoogle}
        buttonText="Login With Google"
      />
    </div>
  );
}

export default App;
