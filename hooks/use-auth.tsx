import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
    const router = useRouter()

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // @ts-ignore
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    function logout() {
        signOut(auth)
        router.push("/")
    }

    return { user, loading, logout };
}