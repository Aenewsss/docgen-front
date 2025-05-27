export async function callCheckoutCreditsPage(email: string, userId: string, creditAmount: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-credits-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            user_id: userId,
            credits: creditAmount
        })
    })
    const data = await res.json()
    if (data.checkout_url) {
        window.location.href = data.checkout_url
    } else {
        alert("Erro ao redirecionar para o pagamento de créditos")
    }
}