export default function AccountSettings({ onDeleteReplies }) {
    return (
        <div>
            <h1>Account Settings</h1>

            <button className="bg-red-700" onClick={onDeleteReplies}>
                Delete Replies
            </button>
        </div>
    );
}
