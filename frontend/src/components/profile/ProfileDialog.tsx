import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../layouts/Dialog";
import { Card } from "../ui/Card";
import ProfileView from "./ProfileView";
import ChangePasswordView from "./ChangePasswordView";

type DialogView = "profile" | "changePassword" | "availability";

interface ProfileDialogProps {
  children: React.ReactNode;
}

export default function ProfileDialog({ children }: ProfileDialogProps) {
  const [dialogView, setDialogView] = useState<DialogView>("profile");

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setDialogView("profile");
    }
  };

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <Card>
          {dialogView === "profile" && (
            <ProfileView
              onChangePassword={() => setDialogView("changePassword")}
            />
          )}

          {dialogView === "changePassword" && (
            <ChangePasswordView onBack={() => setDialogView("profile")} />
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
