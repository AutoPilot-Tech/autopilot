import React, {useState, useEffect} from "react";
import {auth, signInWithGoogle, firebase} from "../firebase";
import {GoogleLogin} from "react-google-login";
import {gapi} from "gapi-script";

export const clientId =
  "39033041323-td4qpdmn6t5765rvdev51v68f7qof0pv.apps.googleusercontent.com";

export function LoginNew() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // use context for authResponse ???

  const onSuccess = (res) => {
    console.log("success");

    const auth2 = gapi.auth2.getAuthInstance();
    const currentUser = auth2.currentUser.get();

    const authResponse = currentUser.getAuthResponse(true);
    const id_token = authResponse.id_token;
    const access_token = authResponse.access_token;
    // create credential
    const credential = firebase.auth.GoogleAuthProvider.credential(
      id_token,
      access_token
    );
    auth.signInWithCredential(credential);
  };
  // window.location.href = "/app/calendar/home";

  const onFailure = (err) => {
    console.log("failed");
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        // scope for google calendar
        scope: "https://www.googleapis.com/auth/calendar",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = "/app/calendar/home";
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("success");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-12 w-auto"
                alt="Autopilot"
                src="../../images/autopilot_black.png"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              {/* <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <a
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  sign up
                </a>
              </p> */}
            </div>

            <div className="mt-8">
              <div>
                <div>
                  <div className="mt-1 justify-center ">
                    <div className="justify-center grid">
                      {/* <button
                        className="w-full justify-center h-full"
                        onClick={signInWithGoogle}
                        type="button"
                      >
                        <span className="sr-only">Sign in with Google</span>

                        <img
                          src="../../google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png"
                          alt="google signin"
                        />
                      </button> */}
                      <GoogleLogin
                        clientId={clientId}
                        buttonText="Sign in with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_origin"}
                        isSignedIn={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    {/* <div className="w-full border-t border-gray-300" /> */}
                  </div>
                  {/* <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div> */}
                </div>
              </div>

              {/* <div className="mt-6">
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        disabled={true}
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        disabled={true}
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleLogin}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div> */}
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80"
            alt="hhh"
          />
        </div>
      </div>
    </>
  );
}
