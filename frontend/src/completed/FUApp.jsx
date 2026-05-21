import { useEffect, useState } from "react";

function Form({ onSubmit }) {
    const [bullshit, setBullshit] = useState({
        username: "",
        password: "",
    });
    const fuckYou = (e) => {
        e.preventDefault();

        if (!bullshit.username.trim() || !bullshit.password.trim()) {
            return alert("Fuck off!");
        }

        const payload = bullshit;
        setBullshit({
            username: "",
            password: "",
        });

        onSubmit(payload);
    };

    const onInput = (e) => {
        const { name, value } = e.target;
        setBullshit((bullshit) => ({ ...bullshit, [name]: value }));
    };
    return (
        <>
            <form
                onSubmit={fuckYou}
                className="flex flex-col items-center bg-white w-md h-lg shadow-md p-8 rounded-xl gap-4 px-20"
            >
                <label htmlFor="username" className="flex flex-col w-full">
                    Username:
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={bullshit.username}
                        onChange={onInput}
                        // placeholder="Enter your fucking username asshole"
                        className="p-2 border rounded-lg"
                    />
                </label>
                <label htmlFor="password" className="flex flex-col w-full">
                    Password:
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={bullshit.password}
                        onChange={onInput}
                        // placeholder="Enter your fucking password too bitch"
                        className="p-2 border rounded-lg"
                    />
                </label>
                <button className="bg-slate-200 shadow-md active:bg-white active:shadow-none w-full">
                    Submit
                </button>
            </form>
        </>
    );
}

function Dashboard({ user }) {
    return (
        <>
            {!user ? (
                <p className="font-bold text-gray-400 text-3xl m-10">
                    Still waiting for you to sign up wanker
                </p>
            ) : (
                <p className="font-bold text-3xl m-10">
                    Fuck you {user.username} 😩
                </p>
            )}
        </>
    );
}

function PussyButton({ onPussyOut }) {
    return (
        <button className="bg-black text-white" onClick={onPussyOut}>
            Clear user
        </button>
    );
}
export default function FUApp() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentWanker = JSON.parse(localStorage.getItem("user") || null);
        if (!currentWanker) return;

        setUser(currentWanker);
    }, []);

    const handleSubmit = (payload) => {
        setUser(payload);
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    const handlePussyOut = () => {
        setUser(null);

        return localStorage.removeItem("user");
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="font-medium mt-5">Fuck You App😩</h1>;
            <Form onSubmit={handleSubmit} />
            <Dashboard user={user} />
            <PussyButton onPussyOut={handlePussyOut} />
        </div>
    );
}
