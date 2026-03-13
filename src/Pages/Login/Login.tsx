import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { LoginApi } from "../../service/AuthService";
import { setLoginResponse } from "./Login.slice";
import { toast } from "react-toastify";

function Login() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const setDatas = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (e?: FormEvent) => {
        if (e) e.preventDefault();

        const { username, password } = user;

        if (!username || !password) {
             toast.warn("Please fill all fields", {
                    position: "top-center",
                    autoClose: 3000,
                });
            return;
        }
        try {
            const result = await LoginApi({ username, password });
            dispatch(setLoginResponse(result));
            
            // Store token in sessionStorage
            if (result.data?.token) {
                sessionStorage.setItem("token", result.data.token);
            }

            setUser({ username: "", password: "" });
            navigate("/");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-[#3A5795] mb-6">
                        Login
                    </h2>


                    <form onSubmit={(e) => { e.preventDefault(); void handleLogin(); }}>
                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            placeholder="Enter username"
                            onChange={(e) => setDatas(e)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A5795]"
                        />
                    </div>


                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                placeholder="Enter password"
                                onChange={(e) => setDatas(e)}
                                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A5795]"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>


                    {/* Login Button */}
                    <button type="submit" className="w-full bg-[#3A5795] text-white py-2 rounded-lg font-semibold hover:bg-[#2f467a] transition">
                        Login
                    </button>

                    </form>


                    {/* Change Password */}
                    <div className="text-center mt-4">
                        <Link to="/change-password" className="text-sm text-[#3A5795] hover:underline">
                            Change Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
