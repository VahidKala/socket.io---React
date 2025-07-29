import classes from "./Form.module.css";
import Button from "../UI/Button";
import { useContext, useEffect, useRef, useState } from "react";
import infoCtx from "../../context/use-contect";

const Form = (props) => {
    const title = useRef();
    const img = useRef();
    const content = useRef();
    const ctx = useContext(infoCtx);
    const [titleValue, setTitleValue] = useState(
        (ctx.details && ctx.details.title) || ""
    );
    const [contentValue, setContentValue] = useState(
        (ctx.details && ctx.details.content) || ""
    );
    const [showLengthError, setShowLengthError] = useState(false);

    const postDataToServerHandler = (event) => {
        event.preventDefault();

        if (
            title.current.value.trim().length <= 4 ||
            content.current.value.trim().length <= 4
        ) {
            setShowLengthError(true);
        }
        if (
            title.current.value.trim().length > 4 ||
            content.current.value.trim().length > 4
        ) {
            setShowLengthError(false);
        }

        ctx.spinnerHandler(true);

        const formData = new FormData();
        formData.append("title", title.current.value);
        formData.append("content", content.current.value);
        formData.append("imageUrl", img.current.files[0]);

        fetch(`http://localhost:8080/feed/post-items?page=${ctx.page}`, {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Posting data faild.");
                }
                return res.json();
            })
            .then((data) => {
                ctx.spinnerHandler(false);
                ctx.getItemsFromServer();
                props.onClickCancel();
            })
            .catch((err) => {
                ctx.spinnerHandler(false);
                ctx.triggerForm();

                console.log(err.message);
            });
    };

    useEffect(() => {
        ctx.lengthHandler();
    }, [showLengthError]);

    const editDataHandler = (event) => {
        event.preventDefault();

        ctx.spinnerHandler(true);

        const formData = new FormData();
        formData.append("title", title.current.value);
        formData.append("content", content.current.value);

        if (img.current && img.current.files[0]) {
            formData.append("imageUrl", img.current.files[0]);
        }

        fetch(`http://localhost:8080/feed/edit-item/${ctx.details._id}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Editing data faild.");
                }
                return res.json();
            })
            .then((response) => {
                ctx.getItemsFromServer();
                ctx.spinnerHandler(false);
                props.onClickCancel();
                ctx.editedItemHandler(response.editedItem);
                return;
            })
            .catch((err) => {
                ctx.spinnerHandler(false);
                console.log(err.message);
            });
    };

    return (
        <form
            className={classes.form}
            onSubmit={
                ctx.details && ctx.details.title
                    ? editDataHandler
                    : postDataToServerHandler
            }
        >
            <label>Title</label>
            <input
                type="text"
                ref={title}
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
            />
            <br />
            <label>Image</label>
            <input type="file" ref={img} name="img" />
            <label>Please choose an image</label>
            <br />
            <label>Content</label>
            <textarea
                rows={8}
                ref={content}
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
            />
            <br />
            <div>
                <Button onClick={props.onClickCancel} disabled={ctx.spinner}>
                    Cancel
                </Button>
                <Button type="submit" disabled={ctx.spinner}>
                    {ctx.details && ctx.details.title ? "Edit" : "Accept"}
                </Button>
            </div>
        </form>
    );
};

export default Form;
