import axios from "axios";
import React, { useState } from "react";
import logo from "../nota/assets/coffee-logo-png-7520.png";

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        let data = {
            username: user.username,
            password: user.password
        }

        await axios.post('http://localhost:8080/user/login', data)
            .then((result) => {
                console.log(result.data.data)
                sessionStorage.setItem('nama_user', result.data.data[0].nama_user)
                sessionStorage.setItem('token', result.data.token)
                sessionStorage.setItem('logged', result.data.logged)
                sessionStorage.setItem('role', result.data.data[0].role)
                sessionStorage.setItem('id_user', result.data.data[0].id)
                window.location.reload()
            })
    }

    return (
        <section className="bg-green-200 h-screen">
            <div className="flex flex-col items-center justify-center px-12 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-1/2 rounded-lg shadow-xl shadow-black border md:mt-0 sm:max-w-md xl:p-0 bg-green-500 border-green-300">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Username</label>
                                <input autoComplete="off" type="text" name="username" id="username" value={user.username} onChange={handleChange} className=" sm:text-sm text-black rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                <input type="password" name="password" id="password" value={user.password} onChange={handleChange} className=" sm:text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" required="" />
                            </div>

                            <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-700 hover:bg-green-800 focus:ring-green-600">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>

        </section>

    )
}