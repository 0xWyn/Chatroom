import UserCard from "./UserCard.jsx";
import Postcard from "./Postcard.jsx";

export default function ResultsContainer({ results }) {
    const { people, posts } = results;
    if (!results) {
        return;
    }
    return (
        <div className="h-full bg-white rounded-md w-full p-2 flex flex-col gap-2">
            {/* People */}
            <div className="border bg-white rounded-md w-full p-2">
                <h2 className="text-lg font-medium text-black">People</h2>

                {people?.length > 0 ? (
                    <div className="flex gap-2 flex-wrap overflow-x-auto py-1">
                        {people.map((person) => (
                            <UserCard key={person.id} user={person} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400">
                        No users found
                    </p>
                )}
            </div>

            {/* Posts */}
            <div className="border bg-white rounded-md w-full p-2">
                <h2 className="text-lg font-medium text-black">Posts</h2>

                {posts?.length > 0 ? (
                    <div className="flex gap-2 flex-wrap overflow-x-auto py-1">
                        {posts.map((post) => (
                            <Postcard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400">
                        No posts found
                    </p>
                )}
            </div>
        </div>
    );
}
