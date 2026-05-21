export default function UserCard({ user, onClick }) {
    console.log(user);
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-gray-200"
        >
            {" "}
        </div>
    );
}
