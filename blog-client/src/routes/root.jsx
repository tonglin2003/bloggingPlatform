import { useContext } from "react";
import { Link, Outlet, useNavigation, redirect, Form } from "react-router-dom";

export default function Root(){
    return(
        <>
        <h1>Roots!!!</h1>
        <div className="">
            <Outlet />
        </div>
        </>
    )
}