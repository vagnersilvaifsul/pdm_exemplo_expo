import { firestore } from "@/firebase/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
	const { userAuth } = useContext(AuthContext);

	//busca os detalhes do usuário
	async function getUser(): Promise<any> {
		try {
			if (!userAuth.user) {
				return null;
			}
			const docSnap = await getDoc(
				doc(firestore, "usuarios", userAuth.user.uid)
			);
			if (docSnap.exists()) {
				let userData = docSnap.data();
				userData.uid = docSnap.id;
				return userData;
			}
			return null;
		} catch (e) {
			console.error("UserProvider, getUser: " + e);
			return null;
		}
	}

	return (
		<UserContext.Provider value={{ getUser }}>{children}</UserContext.Provider>
	);
};
