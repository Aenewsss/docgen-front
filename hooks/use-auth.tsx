import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
    const router = useRouter()

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            const userRef = ref(db, `/users/${currentUser?.uid}`)

            get(userRef)
                .then(result => {
                    if (result.val()) setUser({ ...currentUser, ...result.val() });
                })
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    function logout() {
        localStorage.removeItem('jwt-docgen')
        localStorage.removeItem('github_token')
        setUser(null)
        signOut(auth)
        router.push("/")
    }

    return { user, loading, logout };
}