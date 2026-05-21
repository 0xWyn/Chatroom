Backend Architecture

Data is stored in backend/data/db.json
Data is categorized as users, chats, messages and posts for now
Users refers to revelevant user information such as id, password and created at;
Chats refers to conversations between users, containing the participants of said conversations as id strings;
Messages refers to individual messages send by users, linked to the users database by senderId, and to the chats database by chatsId.
Posts is under constructions.
