"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Globe, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navigationMenuItems = [
  { title: "Home", href: "/chat", icon: Home },
  { title: "Global Chat", href: "/chat/global/", icon: Globe },
  { title: "Settings", href: "/user", icon: User },
];

export default function NavigationMenuWithIcon() {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/signup";

  if (hideHeader) return null;
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex justify-center space-x-3">
        {navigationMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: isActive ? "secondary" : "ghost",
                  }),
                  "h-11 w-11"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-6 w-6" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
