import { useEffect, useState } from "react";
import Link from "next/link";
import ChatBubbleLeftIcon from "@heroicons/react/24/outline/ChatBubbleLeftIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { query, collection, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ChatRow = ({ id }) => {
	const pathname = usePathname();
	const router = useRouter();
	const {data: session} = useSession();
	const [active, setActive] = useState(false);

	const [messages] = useCollection(
		query(
			collection(db, "users", session?.user?.email, "chats", id, "messages"),
			orderBy("createdAt", "asc")
		)
	);

  const deleteChat = async () => {
    await deleteDoc(doc(db, "users", session.user?.email, 'chats', id))
    // if(pathname.includes(id))
    router.replace("/")
  }

	useEffect(() => {
		if (!pathname) return;
		setActive(pathname.includes(id));
	}, [pathname, id]);

	return (
		<Link className={`chatRow justify-center ${active && "bg-gray-700/50"}`} href={`/chat/${id}`}>
			<ChatBubbleLeftIcon className="h-5 w-5" />
			<p className="flex-1 hidden md:inline-flex truncate">
				{messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
			</p>
			<TrashIcon onClick={deleteChat} className="h-5 w-5 text-gray-700 hover:text-red-700 z-20" />
		</Link>
	);
};

export default ChatRow;
