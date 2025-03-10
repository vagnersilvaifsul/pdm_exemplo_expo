import { Credencial } from "@/model/types";
import * as SecureStore from "expo-secure-store";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { createContext } from "react";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
initializeApp(firebaseConfig);

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	const auth = getAuth();

	/*
    Cache criptografado do usuário
  */
	async function armazenaCredencialnaCache(
		credencial: Credencial
	): Promise<void> {
		try {
			await SecureStore.setItemAsync(
				"credencial",
				JSON.stringify({
					email: credencial.email,
					senha: credencial.senha,
				})
			);
		} catch (e) {
			console.error("AuthProvider, armazenaCredencialnaCache: " + e);
		}
	}

	async function recuperaCredencialdaCache(): Promise<null | string> {
		try {
			const credencial = await SecureStore.getItemAsync("credencial");
			return credencial ? JSON.parse(credencial) : null;
		} catch (e) {
			console.error("AuthProvider, recuperaCredencialdaCache: " + e);
			return null;
		}
	}

	async function signIn(credencial: Credencial): Promise<string> {
		try {
			await signInWithEmailAndPassword(
				auth,
				credencial.email,
				credencial.senha
			);
			armazenaCredencialnaCache(credencial);
			return "ok";
		} catch (error: any) {
			console.error(error.code, error.message);
			return launchServerMessageErro(error);
		}
	}

	async function sair(): Promise<string> {
		try {
			await SecureStore.deleteItemAsync("credencial");
			await signOut(auth);
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
		<AuthContext.Provider value={{ signIn, sair, recuperaCredencialdaCache }}>
			{children}
		</AuthContext.Provider>
	);
};
