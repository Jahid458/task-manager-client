import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { authContext } from "../../Provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosPublic from './../../hooks/useAxiosPublic';

const Login = () => {
    const {setUser, googleSignIn} = useContext(authContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    // const location = useLocation();

    const LogGoogle = () => {
        googleSignIn()
        .then(result =>{
            console.log(result.user);
            const userInfo  = {
                email: result.user?.email,
                name: result.user?.displayName,
            }
            axiosPublic.post('/users',userInfo)
            .then(res =>{
                console.log(res.data);
                toast.success('login Successfully')
                navigate('/')
            })
        })
      };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign in with Google</h2>
        <button onClick={LogGoogle} className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
          <FcGoogle className="text-2xl mr-2" />
          <span className="text-lg">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
