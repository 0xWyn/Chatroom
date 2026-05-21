import { useState, useEffect } from "react";

function CreateList({ onAdd }) {
    const [item, setItem] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!item.trim()) {
            return alert("Item must have a name");
        }

        const payload = { id: crypto.randomUUID(), name: item };

        onAdd(payload);
        setItem("");
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="flex gap-1 justify-between py-10"
            >
                <label htmlFor="input" className="flex flex-col">
                    <input
                        type="text"
                        id="input"
                        className="p-3 border w-xs rounded md focus:outline-lime-600"
                        placeholder="Enter Item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                    />
                </label>
                <button className="bg-lime-500 text-white">Add</button>
            </form>
        </div>
    );
}

function ItemCard({ item, onDelete }) {
    const handleDelete = () => {
        onDelete(item);
    };
    return (
        <div className="flex gap-1 items-center justify-center">
            <div className="p-4 shadow-sm rounded-md bg-white w-full m-1 font-medium">
                {item.name}
            </div>
            <button
                className="bg-violet-500 text-sm text-white active:bg-red-600 active:scale-100 hover:scale-105"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );
}

function DisplayList({ list, onDelete }) {
    return (
        <>
            <h2 className="font-medium text-3xl text-center">List</h2>

            <div className="flex flex-col w-full h-full rounded-md px-5 overflow-y-scroll">
                {!list.length && (
                    <p className="mt-10 text-gray-400 text-center">
                        No items in your list 🫗
                    </p>
                )}
                {list.map((item) => {
                    return (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onDelete={onDelete}
                        />
                    );
                })}
            </div>
        </>
    );
}

const ClearButton = ({ onClearList }) => {
    return (
        <button className="bg-black text-white m-4" onClick={onClearList}>
            Clear List
        </button>
    );
};
function AppContent() {
    const [list, setList] = useState([]);

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem("list")) || [];
        setList(savedList);
    }, []);

    const handleNewItem = (newItem) => {
        const newList = [...list, newItem];
        setList((prev) => [...prev, newItem]);
        return localStorage.setItem("list", JSON.stringify(newList));
    };

    const handleDeleteItem = (item) => {
        const newList = list.filter((i) => i.id !== item.id);

        setList(newList);
        console.log(newList);
    };

    const handleClearList = () => {
        setList([]);
        return localStorage.removeItem("list");
    };

    useEffect(() => {
        if (!list.length) {
            return localStorage.removeItem("list");
        }
    }, [list]);
    return (
        <div className="w-screen h-screen flex justify-center">
            <div className="flex flex-col w-lg h-full items-center mt-5 bg-white rounded-lg shadow-md p-10">
                <h1 className="font-medium mb-10">Shopping List App</h1>
                <CreateList onAdd={handleNewItem} />
                <DisplayList list={list} onDelete={handleDeleteItem} />
                <ClearButton onClearList={handleClearList} />
            </div>
        </div>
    );
}

export default function ListApp() {
    return (
        <>
            <AppContent />
        </>
    );
}
