import { useState } from "react";
import { useUser } from "../context/UserProvider";
import Pencil from "../assets/pencil";
import AvatarCropper from "./AvatarCropper";
import { getCroppedImg } from "../utilities/getCroppedImg";

export default function ProfileSettings({ onEdit }) {
    const { user, setUser } = useUser();
    const [preview, setPreview] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);
    const [showCrop, setShowCrop] = useState(null);

    const [form, setForm] = useState({
        username: "",
        bio: "",
        avatar: null,
        cover: null,
    });

    const avatarUrl = user?.avatar
        ? `http://localhost:3001${user.avatar}`
        : null;
    const coverUrl = user?.cover ? `http://localhost:3001${user.cover}` : null;

    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const username = form.username.trim() ? form.username : user.username;
        const bio = form.bio.trim() ? form.bio : user.bio;

        const data = new FormData();

        data.append("username", username);
        data.append("bio", bio);

        if (form.avatar) {
            data.append("avatar", form.avatar);
        }

        if (form.cover) {
            data.append("cover", form.cover);
        }

        onEdit(data);
        setIsEditing(false);
        console.log("Submitted");
    };

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type !== "file") {
            setForm((form) => ({
                ...form,
                [name]: type === "file" ? files[0] : value,
            }));
        }

        if (type === "file") {
            const file = files[0];

            if (name === "avatar") {
                setPreview(URL.createObjectURL(file));
                setShowCrop(true);
            } else if (name === "cover") {
                setPreviewCover(URL.createObjectURL(file));
            }
        }
    };

    const handleCropDone = async (croppedAreaPixels) => {
        if (!croppedAreaPixels) {
            setShowCrop(false);
            return;
        }
        const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);

        const croppedFile = new File(
            [croppedBlob],
            "avatar.jpg", // 👈 IMPORTANT
            { type: "image/jpeg" }
        );
        setForm((f) => ({ ...f, avatar: croppedFile }));

        setPreview(URL.createObjectURL(croppedFile));
        setShowCrop(false);
    };

    return (
        <div className="h-full flex flex-col w-full px-2">
            <div className="flex justify-between items-center">
                <h1 className="!text-3xl mb-2">Profile Settings</h1>
                <button
                    className="!p-1 !aspect-square hover:outline-2 hover:outline-blue-600 hover:text-blue-600 active:bg-blue-300 transition-colors duration-300ms"
                    onClick={() => setIsEditing((isEditing) => !isEditing)}
                >
                    <Pencil />
                </button>
            </div>
            <div className="border border-gray-300 rounded-md h-full px-5">
                <form
                    onSubmit={handleSubmit}
                    className=" h-full flex flex-col gap-10 p-4"
                >
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <p className="font-bold">Username:</p>
                            {isEditing ? (
                                <label htmlFor="username" className="w-full">
                                    <input
                                        type="text"
                                        id="username"
                                        value={form.username}
                                        name="username"
                                        placeholder={`${user.username}`}
                                        onChange={handleChange}
                                        className="border border-gray-400 w-full p-2"
                                    />
                                </label>
                            ) : (
                                <div className="border border-gray-400 rounded-md w-full p-2 bg-gray-100">
                                    <p>{user.username}</p>
                                </div>
                            )}
                        </div>
                        <hr className="text-gray-400" />
                    </div>

                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <p className="font-bold">Bio:</p>
                            {isEditing ? (
                                <label htmlFor="bio" className="w-full">
                                    <input
                                        type="text"
                                        id="bio"
                                        name="bio"
                                        value={form.bio}
                                        placeholder={`${user.bio}`}
                                        onChange={handleChange}
                                        className="border border-gray-400 w-full p-2"
                                    />
                                </label>
                            ) : (
                                <div className="border border-gray-400 rounded-md w-full p-2 bg-gray-100">
                                    <p
                                        className={`${!user?.bio?.trim() ? "text-gray-400 text-sm text-center" : ""}`}
                                    >
                                        {user?.bio?.trim()
                                            ? user.bio
                                            : "You have not filled a bio yet"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <hr className="text-gray-400" />
                    </div>

                    {/* Avatar */}
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <p className="font-bold">Avatar: </p>
                            {isEditing ? (
                                <div>
                                    <label
                                        htmlFor="avatar"
                                        className="cursor-pointer"
                                    >
                                        Upload Avatar
                                        <input
                                            type="file"
                                            name="avatar"
                                            id="avatar"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {preview && (
                                        <div className="size-16 rounded-full overflow-hidden">
                                            <img
                                                src={preview}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : user?.avatar?.trim() ? (
                                <div className="size-20 overflow-hidden rounded-full">
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <p>You have not uploaded a picture</p>
                            )}
                        </div>
                        <hr className="text-gray-400" />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                            <p className="font-bold">Cover Image: </p>
                            {isEditing ? (
                                <div>
                                    <label
                                        htmlFor="cover"
                                        className="cursor-pointer"
                                    >
                                        Upload Cover Image
                                        <input
                                            type="file"
                                            name="cover"
                                            id="cover"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {previewCover && (
                                        <div className="size-16 rounded-full overflow-hidden">
                                            <img
                                                src={previewCover}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : user?.cover?.trim() ? (
                                <div className="size-20 overflow-hidden rounded-full">
                                    <img
                                        src={coverUrl}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <p>You have not uploaded a cover image</p>
                            )}
                        </div>
                        <hr className="text-gray-400" />
                    </div>
                    <div className="w-full">
                        {isEditing && (
                            <button className="bg-blue-400">Save</button>
                        )}
                    </div>
                </form>

                {showCrop && (
                    <AvatarCropper
                        image={preview}
                        onComplete={handleCropDone}
                    />
                )}
            </div>
        </div>
    );
}
