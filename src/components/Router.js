import { HashRouter, Routes, Route, } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import "../components/Router.css";

const Router = ({isLoggedIn, userObj}) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route exact={true} path={"/"} element={<Home userObj={userObj} />}>
            </Route>
            <Route path={"/profile"} element={<Profile userObj={userObj} />}>
            </Route>
          </>
        ) : (
          <Route exact={true} path={"/"} element={<Auth />}>
          </Route>
        )}
      </Routes>
    </HashRouter>
  );
};

export default Router;
