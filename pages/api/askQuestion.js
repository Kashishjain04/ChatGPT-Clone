// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import query from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

export default async function handler(req, res) {
	const { prompt, chatId, model, session } = req.body;
	if (!prompt) {
		return res.status(400).json({ answer: "Please provide a prompt!" });
	}
	if (!chatId) {
		return res.status(400).json({ answer: "Please provide a valid chat Id!" });
	}
	const response = await query(prompt, chatId, model);
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
