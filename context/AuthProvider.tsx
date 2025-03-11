import { Credencial } from "@/model/types";
import { Usuario } from "@/model/Usuario";
import * as SecureStore from "expo-secure-store";
import { initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { createContext } from "react";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	const auth = getAuth(app);
	const firestore = getFirestore(app);

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

	/*
    Funções do processo de Autenticação
  */
	async function signUp(usuario: Usuario): Promise<string> {
		try {
			if (usuario.email && usuario.senha) {
				await createUserWithEmailAndPassword(
					auth,
					usuario.email,
					usuario.senha
				);
				if (auth.currentUser) {
					await sendEmailVerification(auth.currentUser);
				}
				//A senha não deve ser persistida no serviço Firetore, ela é gerida pelo serviço Authentication
				const usuarioFirestore = {
					email: usuario.email,
					nome: usuario.nome,
					urlFoto: usuario.urlFoto,
					curso: usuario.curso,
					perfil: usuario.perfil,
				};
				await addDoc(collection(firestore, "users"), {
					usuarioFirestore,
				});
			} else {
				return "Confira se você digitou o email e a senha.";
			}
			return "ok";
		} catch (e: any) {
			console.error(e.code, e.message);
			return launchServerMessageErro(e);
		}
	}

	async function signIn(credencial: Credencial): Promise<string> {
		try {
			const userCredencial = await signInWithEmailAndPassword(
				auth,
				credencial.email,
				credencial.senha
			);
			if (!userCredencial.user.emailVerified) {
				return "Você precisa verificar seu email para continuar.";
			}
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
		<AuthContext.Provider
			value={{ signIn, sair, recuperaCredencialdaCache, signUp }}
		>
			{children}
		</AuthContext.Provider>
	);
};
