import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigation, redirect, Form, useLoaderData } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


export async function loader({ request }) {
    const response = await fetch("/api/auth/current_user");
    if (response.ok) {
      const { user } = await response.json();
      return { currentUser: user };
    }
    return { currentUser: null };
  }

  export async function action({request}){
    const response = await fetch('/api/auth/logout',{
        method: "DELETE",
    });
    return redirect("/login");
  }

  export default function Root() {
    const { currentUser } = useLoaderData();
    const { setCurrentUser } = useContext(AuthContext);
  
    useEffect(() => {
      const updateCurrentUser = async () => {
         setCurrentUser(currentUser);
      };
      updateCurrentUser();
    }, [currentUser, setCurrentUser]);
  
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Blogging</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                
                {currentUser? (
                    <>
                    <li className="nav-item">
                        <Link className="nav-link" to="blog/post">Post Blog</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/user/blog">My Blog</Link>
                    </li>
                    <Form method="POST">
                        <li className="nav-item">
                            <button className="nav-link" type="submit">Log out</button>
                        </li>
                    </Form>
                    </>
                ): (
                     <span></span>
                )}
                
                </ul>
                
            </div>
            </nav>
            
        <div className="">
          <Outlet />
        </div>
      </>
    );
  }
  