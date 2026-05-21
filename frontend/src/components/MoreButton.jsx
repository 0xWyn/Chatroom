export default function MoreButton({ size = 10, onClick, color = "black" }) {
    const sizes = {
        5: "size-5",
        6: "size-6",
        8: "size-8",
        10: "size-10",
        12: "size-12",
        14: "size-14",
    };

    const colors = {
        black: "text-black",
        white: "text-white",
        red: "text-red-600",
        blue: "text-blue-900",
    };
    const handleClick = () => {
        onClick();
    };

    return (
        <button
            className={`!p-0 !m-0 flex justify-center items-center shrink-none pointer-events-auto ${colors[color]} hover:text-gray-400 transition-colors duration-500`}
            onClick={handleClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${sizes[size]} `}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
            </svg>
        </button>
    );
}
