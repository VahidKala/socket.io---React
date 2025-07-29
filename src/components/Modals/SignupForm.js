import { useContext, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./SignupForm.module.css";
import infoCtx from "../../context/use-contect";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const name = useRef();
    const email = useRef();
    const password = useRef();

    const navigate = useNavigate();

    const [signup, setSignup] = useState(false);

    const ctx = useContext(infoCtx);

    const onSignupHandler = () => {
        setSignup((prev) => !prev);
    };

    const loginFormHandler = (event) => {
        event.preventDefault();
        ctx.fetchDataSpinner(true);
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: email.current.value,
                password: password.current.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then(async (response) => {
                if (!response.ok) {
                    return response.json().then((errData) => {
                        return Promise.reject(errData);
                    });
                }
                return response.json();
            })
            .then((result) => {
                navigate("/");
                ctx.fetchDataSpinner(false);
                ctx.getItemsFromServer();
                if (result.token) {
                    ctx.onLoginFormHandler(true);
                }
            })
            .catch((err) => {
                ctx.fetchDataSpinner(false);
                navigate("/");
                ctx.errorHandeling({
                    status: true,
                    errorMessage: err.message,
                });
            });
    };

    const signupFormHandler = (event) => {
        event.preventDefault();

        fetch("http://localhost:8080/auth/signup", {
            method: "PUT",
            body: JSON.stringify({
                name: name.current.value,
                email: email.current.value,
                password: password.current.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then(async (result) => {
                if (!result.ok) {
                    return result.json().then((data) => {
                        return Promise.reject(data);
                    });
                }
                return result.json();
            })
            .then((response) => {
                ctx.removeBlurHandlerFroLiginForm();
                navigate({ pathname: "/", search: `?page=${ctx.page}` });
            })
            .catch((err) => {
                navigate("/");
                ctx.errorHandeling({
                    status: true,
                    errorMessage: err.errorData[0].msg,
                });
                console.log(err.errorData[0].msg);
            });
    };

    return (
        <form
            className={classes.form}
            onSubmit={signup ? signupFormHandler : loginFormHandler}
        >
            {signup && <label>Name</label>}
            {signup && <input type="text" name="name" ref={name} />}
            {signup && <br />}
            <label>Email</label>
            <input type="email" name="email" ref={email} />
            <br />
            <label>Password</label>
            <input type="password" name="password" ref={password} />
            <br />
            <div>
                <Button onClick={ctx.removeBlurHandlerFroLiginForm}>
                    Cancel
                </Button>
                <Button type="submit">{signup ? "Signup" : "Login"}</Button>
            </div>
            <div>
                <Button className={classes.signup} onClick={onSignupHandler}>
                    {signup
                        ? "Login"
                        : "Create an account? Click here to signup."}
                </Button>
            </div>
        </form>
    );
};

export default SignupForm;
