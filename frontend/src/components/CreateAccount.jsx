import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateAccount({ onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.password.trim() ||
            !form.username.trim() ||
            !form.email.trim()
        ) {
            return alert("All fields must be filled");
        }

        const status = await onSubmit(form);

        if (status === 200) {
            setForm({
                name: "",
                username: "",
                email: "",
                password: "",
            });
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center p-2">
            <h1 className="m-5 font-medium">Create Account</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 shadow-md p-10 rounded-md"
            >
                <label htmlFor="name" className="flex flex-col">
                    Name:
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                name: e.target.value,
                            }))
                        }
                        className="rounded-md w-full p-2 border border-blue-600 placeholder:text-blue-300 focus:outline-blue-600"
                        placeholder="John Doe"
                    />
                </label>
                <label htmlFor="username" className="flex flex-col">
                    Username:
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                username: e.target.value,
                            }))
                        }
                        className="rounded-md w-full p-2 border border-blue-600 placeholder:text-blue-300 focus:outline-blue-600"
                        placeholder="john_doe11"
                    />
                </label>
                <label htmlFor="email" className="flex flex-col">
                    Email:
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                email: e.target.value,
                            }))
                        }
                        className="rounded-md w-full p-2 border border-blue-600 placeholder:text-blue-300 focus:outline-blue-600"
                        placeholder="johndoe@example.com"
                    />
                </label>
                <label htmlFor="passowrd" className="flex flex-col">
                    Password:
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                password: e.target.value,
                            }))
                        }
                        className="rounded-md w-full p-2 border border-blue-600 placeholder:text-blue-300 focus:outline-blue-600"
                        placeholder="••••"
                    />
                </label>
                <button className="text-white bg-black">Submit</button>
            </form>

            <p className="m-2 ">
                Already a user?{" "}
                <Link to="/login">
                    <span className=" font-medium hover:text-blue-400 active:text-blue-800 ">
                        Login
                    </span>
                </Link>
            </p>
        </div>
    );
}
