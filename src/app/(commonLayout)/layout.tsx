
import Navbar from "@/components/features/navbar/Navbar";
import { IUserProfile } from "@/types/auth.types";
import { getUserInfo } from "@/services/auth.services";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo() as IUserProfile | null;

  return (
    <>
    <Navbar user={user} />
    {children}
    </>
  );
}
