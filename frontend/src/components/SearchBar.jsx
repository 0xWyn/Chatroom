import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            return alert("Search field must not be empty");
        }
        onSearch(searchTerm);
        return;
    };
    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex w-full justify-center gap-2"
            >
                <label htmlFor="searchInput">
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search"
                        className="border p-2 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>

                <button className="bg-slate-900 text-white">Search</button>
            </form>
        </div>
    );
}
