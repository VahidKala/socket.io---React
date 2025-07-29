import { useContext, useState } from "react";
import classes from "./SinglePost.module.css";
import infoCtx from "../../../context/use-contect";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import View from "../../Modals/View";
import { createPortal } from "react-dom";
import BlurScreen from "../../Modals/BlurScreen";

const SinglePost = () => {
    const ctx = useContext(infoCtx);
    const [showView, setShowView] = useState(false);

    const navigate = useNavigate();

    const viewHandler = (event) => {
        const itemId = event.target.id;

        ctx.fetchDataSpinner(true);

        fetch(`http://localhost:8080/feed/post/${itemId}`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                ctx.fetchDataSpinner(false);
                ctx.itemDetails(res);
                return;
            });
        setShowView((prev) => !prev);
    };

    const hideViewHandlerFromUi = (entry) => {
        ctx.itemDetails({});
        setShowView((prev) => !prev);
        ctx.fetchDataSpinner(false);
        navigate("/");
    };

    const editHandler = (item) => {
        ctx.triggerForm(item);
    };

    const deleteHandler = (item) => {
        ctx.deleteSpinnerHandler({ spin: true });

        fetch(`http://localhost:8080/feed/deleteItem/${item._id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                ctx.getItemsFromServer();
                ctx.deleteSpinnerHandler({ spin: false, data: item });
                return;
            });
    };

    return ctx.allItems.map((item) => {
        return (
            <li className={classes.singlePost} key={item._id}>
                <h4>Created by: {item.creator}</h4>
                <h1>{item.title}</h1>
                <h3>
                    Created by {item.creator} on {item.createdAt.year}-
                    {item.createdAt.month}-{item.createdAt.day}
                </h3>
                <p>{item.content}</p>
                <div>
                    <Link
                        to="/view"
                        id={item._id}
                        onClick={viewHandler}
                        className={classes.link}
                        image={item.imageUrl}
                    >
                        View
                    </Link>
                    <Link
                        to="/form"
                        className={classes.link}
                        onClick={() => {
                            editHandler(item);
                        }}
                    >
                        Edit
                    </Link>
                    <Link
                        className={classes.link}
                        onClick={() => {
                            deleteHandler(item);
                        }}
                    >
                        Delete
                    </Link>
                </div>

                {showView &&
                    createPortal(
                        <BlurScreen onClick={hideViewHandlerFromUi} />,
                        document.getElementById("blur-modal")
                    )}
                <Routes>
                    {showView && (
                        <Route
                            path="/view"
                            element={<View hideView={hideViewHandlerFromUi} />}
                        />
                    )}
                </Routes>
            </li>
        );
    });
};

export default SinglePost;
