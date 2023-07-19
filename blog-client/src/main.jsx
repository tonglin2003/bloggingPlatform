import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Root, {loader as rootLoader, action as rootAction} from './routes/root';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login, {action as loginAction} from './routes/auth/Login';
import Signup, {action as signupAction} from './routes/auth/Signup';
import Blog, {loader as blogLoader} from './routes/blog/blog';
import PostBlog, {action as postBlogAction} from './routes/blog/PostBlog';
import UserBlog, {loader as UserBlogLoader} from './routes/blog/UserBlog';
import ErrorPage from './ErrorPage';



const router = createBrowserRouter([
  {
    path:"/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        index:true,
        element:(
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        ),
        loader: blogLoader
      },
      {
        path: "/login",
        element: <Login/>,
        action: loginAction,
      },
      {
        path: "/blog/post",
        element:(
          <ProtectedRoute>
            <PostBlog/>
          </ProtectedRoute>),
        action: postBlogAction
      },
      {
        path: "/signup",
        element: <Signup/>,
        action: signupAction
      },
      {
        path:"/user/blog",
        element: (
          <ProtectedRoute>
            <UserBlog/>
          </ProtectedRoute>
        ),
        loader: UserBlogLoader
      }

    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
