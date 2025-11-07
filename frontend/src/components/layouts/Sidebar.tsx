import { Header } from "./Header";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import Icon from "../icon/Icon";
import Text from "../ui/Text";

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
      to: "/ticket",
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
    <aside className="w-full p-6 bg-gray-100 md:p-4 md:h-screen md:w-50">
      <div className="flex items-center justify-between md:flex-col md: h-full">
        <div className="p-[10px] bg-gray-200 rounded-[5px] mr-4 md:hidden">
          <Icon svg={IconMenu} size="lg" className="fill-gray-600" />
        </div>
        <div className="flex flex-1 md:flex-initial md:py-6 md:px-5 md:border-b-gray-200 md:border-b">
          <Header />
        </div>
        <div className="hidden flex-1 w-full md:block">
          <nav className="flex flex-col gap-1">
            {filteredMenu.map(({ to, label, icon: IconComponent }) => (
              <NavLink
                key={to}
                to={to}
                className="group flex items-center gap-3 p-3 rounded-[5px] transition hover:bg-gray-200"
              >
                <Icon
                  svg={IconComponent}
                  className="fill-gray-400 group-hover:fill-gray-500"
                  size="lg"
                />
                <Text
                  variant="text-sm-regular"
                  className="text-gray-400 group-hover:text-gray-500"
                >
                  {label}
                </Text>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className=" w-full flex justify-center items-center gap-3 md:p-4 md:border-t-gray-200 md:border-t">
          <div className="flex items-center justify-center p-[10px] max-w-8  max-h-8 rounded-full bg-blue-dark">
            <Text variant="text-sm-regular" className="text-gray-600">
              GM
            </Text>
          </div>
          <div className="hidden md:flex md:flex-col overflow-hidden">
            <Text
              variant="text-sm-regular"
              className=" text-gray-600 truncate whitespace-nowrap max-w-[140px]"
            >
              {user?.name}
            </Text>
            <Text
              variant="text-xs-regular"
              className="text-gray-400 truncate whitespace-nowrap max-w-[140px]"
            >
              {user?.email}
            </Text>
          </div>
        </div>
      </div>
    </aside>
  );
}
