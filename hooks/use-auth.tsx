import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref, onValue, off } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
    const router = useRouter()

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userRef: ReturnType<typeof ref> | null = null;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                userRef = ref(db, `/users/${currentUser.uid}`);

                // Escuta atualizações em tempo real no Firebase
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (userData) {
                        setUser({ ...currentUser, ...userData });
                        setLoading(false);
                    }
                });
            } else {
                setUser(null);
                setLoading(false);
            }

        });

        // Limpa a escuta quando o componente for desmontado ou o usuário mudar
        return () => {
            if (userRef) off(userRef);
            unsubscribe();
        };
    }, []);

    function logout() {
        localStorage.removeItem('jwt-docgen')
        localStorage.removeItem('github_token')
        setUser(null)
        signOut(auth)
        router.push("/")
        window.location.reload()
    }

    return { user, loading, logout };
}