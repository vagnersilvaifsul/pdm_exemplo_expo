import { auth, firestore, storage } from "@/firebase/firebaseInit";
import { Credencial } from "@/model/types";
import { Usuario } from "@/model/Usuario";
import * as ImageManipulator from "expo-image-manipulator";
import * as SecureStore from "expo-secure-store";
import {
	createUserWithEmailAndPassword,
	deleteUser,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	const [userAuth, setUserAuth] = useState<UserCredential | null>(null);
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
	async function signUp(usuario: Usuario, urlDevice: string): Promise<string> {
		try {
			if (usuario.email && usuario.senha) {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					usuario.email,
					usuario.senha
				);
				if (userCredential) {
					await sendEmailVerification(userCredential.user);
					if (urlDevice !== "") {
						const urlStorage = await sendImageToStorage(
							urlDevice,
							userCredential.user.uid
						);
						if (!urlStorage) {
							return "Erro ao cadastrar o usuário. Contate o suporte."; //não deixa salvar ou atualizar se não realizar todos os passos para enviar a imagem para o storage
						}
						usuario.urlFoto = urlStorage;
					}
				}
				//A senha não deve ser persistida no serviço Firetore, ela é gerida pelo serviço Authentication
				const usuarioFirestore = {
					email: usuario.email,
					nome: usuario.nome,
					urlFoto: usuario.urlFoto,
					curso: usuario.curso,
					perfil: usuario.perfil,
				};
				await setDoc(
					doc(firestore, "usuarios", userCredential.user.uid),
					usuarioFirestore
				);
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
			setUserAuth(userCredencial);
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

	async function delAccount(): Promise<void> {
		if (userAuth?.user) {
			await deleteUser(userAuth.user);
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

	//Função utilitário para envio de imagens para o serviço de Storage
	//urlDevice: qual imagem que está no device que deve ser enviada via upload
	async function sendImageToStorage(
		urlDevice: string,
		uid: string
	): Promise<string | null> {
		try {
			//1. Redimensiona, compacta a imagem, e a transforma em blob
			//ImageManipulator.ImageManipulator.manipulate será o substituto de ImageManipulator.manipulateAsync
			const imageRedimencionada = await ImageManipulator.manipulateAsync(
				urlDevice,
				[{ resize: { width: 150, height: 150 } }],
				{ compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
			);
			const data = await fetch(imageRedimencionada?.uri);
			const blob = await data.blob();

			//2. e prepara o path onde ela deve ser salva no storage
			const storageReference = ref(storage, `imagens/usuarios/${uid}/foto.png`);

			//3. Envia para o storage
			await uploadBytes(storageReference, blob);

			//4. Retorna a URL da imagem
			const url = await getDownloadURL(
				ref(storage, `imagens/usuarios/${uid}/foto.png`)
			);
			return url;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	return (
		<AuthContext.Provider
			value={{
				signIn,
				sair,
				recuperaCredencialdaCache,
				signUp,
				userAuth,
				delAccount,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
