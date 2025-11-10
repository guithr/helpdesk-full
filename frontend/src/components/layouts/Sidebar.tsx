import { Header } from "./Header";

import { useAuth } from "../../hooks/useAuth";

import UserMenu from "../../components/ui/UserMenu";
import Icon from "../icon/Icon";
import MenuLink from "../ui/MenuLink";

import IconMenu from "../../assets/icons/menu.svg?react";
import Clipboard from "../../assets/icons/clipboard-list.svg?react";
import Users from "../../assets/icons/users.svg?react";
import Briefcase from "../../assets/icons/briefcase-business.svg?react";
import Plus from "../../assets/icons/plus.svg?react";
import Wrench from "../../assets/icons/wrench.svg?react";

export function Sidebar() {
  const { user } = useAuth();
  const menu = [
    {
      to: "/tickets",
      label: "Chamados",
      icon: Clipboard,
      roles: ["ADMIN"],
    },
    {
      to: "/my-tickets",
      label: "Meus chamados",
      icon: Clipboard,
      roles: ["TECHNICIAN", "CUSTOMER"],
    },
    {
      to: "/new-tickets",
      label: "Criar chamado",
      icon: Plus,
      roles: ["CUSTOMER"],
    },
    { to: "/technicians", label: "Técnicos", icon: Users, roles: ["ADMIN"] },
    { to: "/clients", label: "Clientes", icon: Briefcase, roles: ["ADMIN"] },
    {
      to: "/services",
      label: "Serviços",
      icon: Wrench,
      roles: ["ADMIN"],
    },
  ];

  const filteredMenu = menu.filter((item) =>
    item.roles.includes(user?.role ?? "")
  );

  return (
    <aside className="w-full p-6 bg-gray-100 md:p-0 md:h-screen md:w-50">
      <div className="flex items-center justify-between md:flex-col md: h-full">
        <div className="p-[10px] bg-gray-200 rounded-[5px] mr-4 md:hidden">
          <Icon svg={IconMenu} size="lg" className="fill-gray-600" />
        </div>
        <div className="flex flex-1 md:flex-initial md:py-6 md:px-5 md:border-b-gray-200 md:border-b">
          <Header />
        </div>
        <div className="hidden flex-1 w-full md:block">
          <nav className="flex flex-col gap-1 px-4">
            {filteredMenu.map((item) => (
              <MenuLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>
        <UserMenu />
      </div>
    </aside>
  );
}
