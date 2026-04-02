const PaymentSuccessPage = () => {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
            <p className="text-lg text-gray-700">Thank you for your purchase. Your payment has been processed successfully.</p>
        </div>
    );
}

export default PaymentSuccessPage;