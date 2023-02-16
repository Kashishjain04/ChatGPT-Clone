"use client";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import ArrowDownCircleIcon from "@heroicons/react/24/outline/ArrowDownCircleIcon"

const Chat = ({ id }) => {
	const { data: session } = useSession();

	const [messages, loading, error] = useCollection(
		session &&
			query(
				collection(db, "users", session.user?.email, "chats", id, "messages"),
				orderBy("createdAt", "asc")
			)
	);

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages?.empty && (
        <>
        <p className="mt-10 text-center text-white">Type a prompt below to get started!</p>
        <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-white animate-bounce" />
        </>
      )}
			{messages?.docs.map((message) => (
				<Message key={message.id} message={message.data()} />
			))}
		</div>
	);
};

export default Chat;
