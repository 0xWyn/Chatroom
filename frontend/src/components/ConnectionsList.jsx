import UserInfo from "./UserInfo";
export default function ConnectionsList({ list }) {
    const users = list.map((user) => <UserInfo user={user} />);
    return (
        <div className="h-full w-full flex flex-col gap-2 py-1">
            {users.length > 0 ? (
                users
            ) : (
                <div className="flex w-full h-full items-center justify-center text-gray-400 font-medium uppercase">
                    List empty
                </div>
            )}
        </div>
    );
}
