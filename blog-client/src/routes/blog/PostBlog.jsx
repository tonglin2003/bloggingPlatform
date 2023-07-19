import React from "react";
import { redirect, Form } from "react-router-dom";

export async function action({request}) {
    const formData = await request.formData();

    console.log(Object.fromEntries(formData));
    const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
        return null;
    }
    return redirect("/");
}   

export default function PostBlog(){
    return(
        <>

        <Form method="POST" className="w-75 mx-auto">
            <h1>Post Blog</h1>
            <div className="mb-3">
                <label htmlFor="postTitle" className="form-label">
                Post Title
                </label>
                <input
                type="text"
                className="form-control"
                id="postTitle"
                name="postTitle"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="postContent" className="form-label">
                Post Content
                </label>
                <textarea
                className="form-control"
                id="postContent"
                name="postContent"
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="postImgUrl" className="form-label">
                Post Image URL
                </label>
                <input
                type="text"
                className="form-control"
                id="postImgUrl"
                name="postImgUrl"
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </Form>
        </>
    )
}