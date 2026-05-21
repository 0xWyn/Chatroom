import { useUser } from "../context/UserProvider";

export default function AuthorComponent() {
    const { user } = useUser();
    const author = {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
    };
    return author;
}
