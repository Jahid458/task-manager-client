import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Home/Home";
import Login from './../Pages/Login/Login';
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children:[
      
        {
            path:'/',
            element: <PrivateRoute><Home></Home></PrivateRoute> 
        }
      ]
    },
    {
      path:'/login',
      element:<Login></Login>
    },
  ]);
