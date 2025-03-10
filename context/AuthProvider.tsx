import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext } from "react";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	async function signIn() {
		const auth = getAuth();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				"teste@email.com",
				"Teste123"
			);
			console.log(userCredential.user);
			console.log(userCredential.user.email);
			return "ok";
		} catch (error: any) {
			console.error(error.code, error.message);
			return "error";
		}
	}
	return (
		<AuthContext.Provider value={{ signIn }}>{children}</AuthContext.Provider>
	);
};
