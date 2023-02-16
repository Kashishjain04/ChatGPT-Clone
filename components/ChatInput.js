"use client";

import { useState } from "react";
import PaperAirplaneIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";
import { useSession } from "next-auth/react";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import useSwr from "swr";
import ModelSelection from "./ModelSelection";

const ChatInput = ({ id }) => {
	const [prompt, setPrompt] = useState("");
	const { data: session } = useSession();
	const { data: model } = useSwr("model", {
		fallbackData: "text-davinci-003",
	});

	const sendMessage = async (e) => {
		e.preventDefault();
		if (!prompt) return;
		const input = prompt.trim();
		setPrompt("");
		const message = {
			text: input,
			createdAt: serverTimestamp(),
			user: {
				_id: session.user?.email,
				name: session.user?.name,
				avatar: session.user?.image || `https://ui-avatars.com/api/name=${session.user?.name}`,
			},
		};
		await addDoc(collection(db, "users", session.user?.email, "chats", id, "messages"), message);

		// toast loading
		const notification = toast.loading("ChatGPT is thinking...");

		await fetch("/api/askQuestion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt: input,
				chatId: id,
				model,
				session,
			}),
		})
			.then(() => {
				// toast successful
				toast.success("ChatGPT has responded", { id: notification });
			})
			.catch(() => {
				toast.error("Something went wrong!", { id: notification });
			});
	};

	return (
		<div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
			<form onSubmit={sendMessage} className="p-5 space-x-5 flex">
				<input
					className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
					disabled={!session}
					type="text"
					placeholder="Ask something..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<button
					className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
					type="submit"
					disabled={!prompt || !session}
				>
					<PaperAirplaneIcon className="h-4 w-5 -rotate-45" />
				</button>
			</form>
			<div className="md:hidden">
				<ModelSelection />
			</div>
		</div>
	);
};

export default ChatInput;
