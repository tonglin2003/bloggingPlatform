import { Form, redirect } from "react-router-dom";

export async function action({ request }) {
    const formData = await request.formData();

    console.log(Object.fromEntries(formData));
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
        console.log("the response is not ok...");
        // invalid credentials, remain on login page
        return null;
    }

    console.log("the response is good!");
    return redirect("/");
}

function Login(){
    return(
        <Form method="POST" className="d-flex row justify-content-center w-50 mx-auto">

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
        <button type="submit" className="btn btn-primary w-50">Submit</button>

        </Form>
    )
}

export default Login;