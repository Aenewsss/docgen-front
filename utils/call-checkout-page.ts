export async function callCheckoutPage(email: string, userId: string, plan: string, billingCycle: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            user_id: userId,
            plan,
            billing_cycle: billingCycle
        })
    })
    const data = await res.json()
    if (data.checkout_url) {
        window.location.href = data.checkout_url
    } else {
        alert("Erro ao redirecionar para o pagamento")
    }
}