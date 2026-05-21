import SearchBar from "./SearchBar";
import API from "../services/axiosInterceptor.js";
import ResultsContainer from "./ResultsContainer.jsx";
import { useState } from "react";

export default function SearchContainer() {
    const [results, setResults] = useState(null);

    const handleSearch = async (term) => {
        try {
            const response = await API.post("search", { term });
            setResults(response.data);
        } catch (error) {
            console.error("Error occurred while searching:", error);
        }
    };
    return (
        <div className="h-full bg-white rounded-md w-full p-2 flex flex-col gap-4">
            <SearchBar onSearch={handleSearch} />
            {results && <ResultsContainer results={results} />}
        </div>
    );
}
