import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";

interface ResetPasswordPageProps {
    searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
    const params = await searchParams;
    return <ResetPasswordForm email={params.email} />;
}

export default ResetPasswordPage;