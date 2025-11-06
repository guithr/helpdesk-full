import { Outlet } from "react-router";
import bgLogin from "../../assets/images/bg-login.png";
import logoDark from "../../assets/logos/Logo_IconDark.svg";
import Text from "../ui/Text";

export function AuthLayout() {
  return (
    <div
      className="min-h-screen flex bg-cover bg-center md:justify-end"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div
        className={`
          min-h-screen
         bg-white
          w-full md:max-w-[686px]
          rounded-t-[20px] md:rounded-tl-[20px]
          mt-8 md:mt-3
          px-6 py-8 md:px-[140px] md:py-12
        `}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logoDark} alt="Logotipo HelpDesk" className="w-10 h-10" />
          <Text variant="text-xl" className="text-blue-dark">
            HelpDesk
          </Text>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
