export default function ({ targetUser }) {
    return (
        <div className="bg-slate-100 border w-full rounded-lg flex flex-col gap-4 p-4">
            <div className="flex justify-center items-center font-bold text-white bg-blue-800 size-8 rounded-full">
                {targetUser.charAt(0)}
            </div>
            <p className="font-medium text-sm">{targetUser}</p>
        </div>
    );
}
