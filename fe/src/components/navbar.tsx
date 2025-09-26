import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { LogOut } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router";

export default function DashboardNavbar() {
  const { logout } = useUserStore();

  const navigate = useNavigate();

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-3xl">Cloud Canvas</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem></NavbarItem>
        <NavbarItem isActive></NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center gap-2">
          {/* <Button size="sm" color="primary" variant="flat" className="font-semibold">New <Plus /></Button> */}
          <ThemeSwitcher />
          <Button
            size="sm"
            color="danger"
            className="font-semibold"
            variant="flat"
            onPress={async () => {
              await logout({ navigate });
            }}
          >
            Logout
            <LogOut size={16} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
