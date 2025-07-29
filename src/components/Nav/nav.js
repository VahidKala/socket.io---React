import { useContext } from "react";
import Button from "../UI/Button";
import infoCtx from "../../context/use-contect";
import classes from "./nav.module.css";
import { Link } from "react-router-dom";

const Nav = () => {
    const ctx = useContext(infoCtx);

    const logOutHandler = () => {
        fetch("http://localhost:8080/feed/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                ctx.emptyWhenLogoutPress()
                console.log(response);
            })
            .catch((err) => {
                console.log(err.message)
            });
        ctx.onLoginFormHandler(false);
    };

    return (
        <div className={classes.nav}>
            <Button>ManageNode</Button>
            <div>
                <Button>Feed</Button>
                {ctx.isLoggedIn ? (
                    <Link
                        className={classes.buttLogout}
                        onClick={logOutHandler}
                    >
                        Log Out
                    </Link>
                ) : (
                    <Link to="/login-form" >Login</Link>
                )}
            </div>
        </div>
    );
};

export default Nav;
