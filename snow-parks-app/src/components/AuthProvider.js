import React, { useState } from 'react';
import {
	loginUser,
	logoutUser,
	isUserLoggedIn,
	isAnonymousUser,
	setAnonymousUser,
} from 'snow-parks-logic';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
	const [isUser, setIsUser] = useState();
	const [isAnonymous, setIsAnonymous] = useState();

	return (
		<AuthContext.Provider
			value={{
				isUser,
				isAnonymous,
				login: async (email, password) => {
					await loginUser(email, password);
					setIsAnonymous(false);
					setIsUser(true);
				},
				isUserLogged: async () => {
					if (await isUserLoggedIn()) {
						setIsAnonymous(false);
						setIsUser(true);
					}
				},
				isUserAnonymous: async () => {
					if (await isAnonymousUser()) {
						setIsUser(false);
						setIsAnonymous(true);
					}
				},
				setAnonymous: async condition => {
					await setAnonymousUser(condition);
					setIsAnonymous(condition);
				},
				logout: async () => {
					await logoutUser();
					setIsUser(false);
					setIsAnonymous(false);
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
