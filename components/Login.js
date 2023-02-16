"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => {
	return (
		<div className="bg-[#11A37F] h-screen flex flex-col items-center justify-center text-center">
			<Image width={300} height={300} alt="logo" src="https://links.kjdev.tech/w4qbe4ws-" />
			<button onClick={() => signIn("google")} className="text-white text-3xl font-bold animate-pulse">
				Sig In to use ChatGPT
			</button>
		</div>
	);
};

export default Login;
