import classes from "./View.module.css";
import Button from "../UI/Button";
import { useContext } from "react";
import infoCtx from "../../context/use-contect";
import { useNavigate } from "react-router-dom";

const View = (props) => {
    const ctx = useContext(infoCtx);
    const navigate = useNavigate();

    if (!ctx.isLoggedIn) {
        return;
    }

    const hideViewHandler = () => {
        props.hideView(false);
        ctx.itemDetails({});

        navigate("/");
    };

    return (
        <section className={classes.view}>
            <div className={classes.outerDiv}>
                <div className={classes.innerDiv}>{ctx.details.title}</div>
                <div className={classes.innerDiv}>{ctx.details.content}</div>
                <img
                    src={`http://localhost:8080/${ctx.details.imageUrl}`}
                    alt="viewImage"
                />
                <Button onClick={hideViewHandler}>Ok</Button>
            </div>
        </section>
    );
};

export default View;
