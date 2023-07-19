import { Form, redirect, Navigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export async function action({ request }) {
    const formData = await request.formData();

    console.log(Object.fromEntries(formData));
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
        // invalid credentials, remain on login page
        return null;
    }

    return redirect("/");
}

function Signup(){
    const { currentUser } = useContext(AuthContext);
    if(currentUser) { return <Navigate to="/" /> }
    return(
        <Form method="POST" className="d-flex row justify-content-center w-50 mx-auto">
            <h1>Sign Up</h1>
        <div className="form-group mb-3">
            <label>Username</label>
            <input 
            name="username" 
            type="text" 
            id="username"
            className="form-control" 
            aria-describedby="emailHelp" 
            placeholder="Enter email"/>
        </div>
        <div className="form-group mb-3">
            <label>Password</label>
            <input 
            type="password" 
            name="password" 
            id="password"
            className="form-control"  
            placeholder="Password"/>
        </div>
        <span>Have an account already? Login <Link to="/login">here</Link> </span>
        <button type="submit" className="btn btn-primary w-50">Sign up</button>

        </Form>
    )
}

export default Signup;