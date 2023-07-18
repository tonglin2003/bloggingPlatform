import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Root from './routes/root';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login, {action, action as loginAction} from './routes/auth/Login';



const router = createBrowserRouter([
  {
    path:"/",
    element: <Root/>,
    errorElement: ( <h1>Oops error!</h1>),
    children: [
      {
        index:true,
        element:(
          <ProtectedRoute>
            <h1>im children element</h1>
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: <Login/>,
        action: loginAction,
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
