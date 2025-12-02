import { Header } from "./Header";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import UserMenu from "../ui/UserMenu";
import MenuLink from "../ui/MenuLink";

import IconMenu from "../../assets/icons/menu.svg?react";
import Clipboard from "../../assets/icons/clipboard-list.svg?react";
import Users from "../../assets/icons/users.svg?react";
import Briefcase from "../../assets/icons/briefcase-business.svg?react";
import Plus from "../../assets/icons/plus.svg?react";
import Wrench from "../../assets/icons/wrench.svg?react";
import X from "../../assets/icons/x.svg?react";
import ButtonIcon from "../ui/ButtonIcon";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
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
      to: "/new-ticket",
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

  const renderNav = () => (
    <nav className="flex flex-col gap-1 px-4 py-5">
      {filteredMenu.map((item) => (
        <MenuLink
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          onClick={() => setIsOpen(false)}
        />
      ))}
    </nav>
  );

  return (
    <div className="relative w-full bg-gray-100 md:h-screen md:w-50">
      <div className="p-6 gap-4 flex items-center justify-between md:p-0 md:flex-col md:h-full">
        {/* Button Menu Hamburger */}
        <ButtonIcon
          size="md"
          icon={isOpen ? X : IconMenu}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden transition-transform duration-300"
        />

        {/* Logo */}
        <div className="w-full md:border-b md:border-b-gray-200">
          <Header className="md:py-6 md:px-5" />
        </div>

        {/* Menu mobile dropdown */}
        <div
          className={`absolute top-full left-0 right-0 bg-gray-100 shadow-lg z-50 md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {renderNav()}
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex-1 md:w-full md:block md:overflow-y-auto">
          {renderNav()}
        </div>

        {/* Perfil User */}
        <div onClick={() => setIsOpen(false)}>
          <UserMenu className="md:w-full" />
        </div>
      </div>
    </div>
  );
}
