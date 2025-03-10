import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext } from "react";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	async function signIn(email: string, senha: string) {
		const auth = getAuth();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				senha
			);
			console.log(userCredential.user);
			console.log(userCredential.user.email);
			return "ok";
		} catch (error: any) {
			console.error(error.code, error.message);
			return launchServerMessageErro(error);
		}
	}

	//função utilitária
	function launchServerMessageErro(e: any): string {
		switch (e.code) {
			case "auth/invalid-credential":
				return "Email inexistente ou senha errada.";
			case "auth/user-not-found":
				return "Usuário não cadastrado.";
			case "auth/wrong-password":
				return "Erro na senha.";
			case "auth/invalid-email":
				return "Email inexistente.";
			case "auth/user-disabled":
				return "Usuário desabilitado.";
			case "auth/email-already-in-use":
				return "Email em uso. Tente outro email.";
			default:
				return "Erro desconhecido. Contate o administrador";
		}
	}

	return (
		<AuthContext.Provider value={{ signIn }}>{children}</AuthContext.Provider>
	);
};
