import { useState } from "react";
import PlusCircle from "../assets/pluscircle";
import CheckBadge from "../assets/checkbadge";

export default function FollowButton({ isFollowing, handleFriend }) {
    const handleClick = () => {
        handleFriend();
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="!text-xs !font-medium text-black !p-2"
            >
                {isFollowing ? (
                    <div className="flex gap-1 items-center">
                        <p>Following</p>
                        <CheckBadge />
                    </div>
                ) : (
                    <div className="flex gap-1 items-center">
                        <p>Follow</p>
                        <PlusCircle />
                    </div>
                )}
            </button>
        </div>
    );
}
