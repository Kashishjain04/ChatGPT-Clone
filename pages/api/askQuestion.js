// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import query from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

const getHistory = async (email, chatId) => {
	const messages = await adminDb
		.collection("users")
		.doc(email)
		.collection("chats")
		.doc(chatId)
		.collection("messages")
		.orderBy("createdAt", "asc")
		.limitToLast(6)
		.get()
		.then((res) => res.docs);
	let history = "";
	messages.forEach((message) => {
		history += `${message.data().user.name}: ${message.data().text}\n`;
	});
	return history;
};

export default async function handler(req, res) {
	const { prompt, chatId, model, session } = req.body;
	if (!prompt) {
		return res.status(400).json({ answer: "Please provide a prompt!" });
	}
	if (!chatId) {
		return res.status(400).json({ answer: "Please provide a valid chat Id!" });
	}
	const newPrompt = await getHistory(session.user?.email, chatId) + "ChatGPT: ";
	console.log(newPrompt);
	const response = await query(newPrompt, model);
	const message = {
		text: response || "ChatGPT was unable to find an answer for that!",
		createdAt: admin.firestore.Timestamp.now(),
		user: {
			_id: "chat_gpt",
			name: "ChatGPT",
			avatar: "https://links.kjdev.tech/ynk89efso",
		},
	};
	await adminDb
		.collection("users")
		.doc(session.user?.email)
		.collection("chats")
		.doc(chatId)
		.collection("messages")
		.add(message);

	res.status(200).json({ answer: message.text });
}
