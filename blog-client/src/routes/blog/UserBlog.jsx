import { Form, redirect, Navigate, useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export async function loader({request}){
    const response = await fetch('/api/posts/user');

    if (response.ok){
        const posts = await response.json();
        return {posts}
    }
    else{
        return null;
    }
}

export default function UserBlog(){
    const blogs = useLoaderData().posts;

    return (
        <div className="container">
          <div className="row">
            {blogs.map((blog, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card">
                  <img src={blog.postImgUrl} className="card-img-top" alt="Blog" />
                  <div className="card-body">
                    <h5 className="card-title">{blog.postTitle}</h5>
                    <p className="card-text">{blog.postContent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    )
}