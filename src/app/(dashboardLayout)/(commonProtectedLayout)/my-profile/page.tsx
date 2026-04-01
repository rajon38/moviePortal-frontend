import MyProfileForm from "@/components/modules/Auth/MyProfileForm";
import { getMyProfileAction } from "./_action";

const MyProfilePage = async () => {
    const profile = await getMyProfileAction();

    if (!profile) {
        return (
            <div className="mx-auto w-full max-w-xl rounded-lg border p-6 text-center">
                <p className="text-destructive">Failed to load profile.</p>
            </div>
        );
    }

    return <MyProfileForm user={profile} />;
};

export default MyProfilePage;
