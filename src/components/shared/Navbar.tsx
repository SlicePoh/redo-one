// components/Navbar.tsx
import { useRef, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { FiHome, FiClipboard, FiUser, FiBarChart2, FiSettings, 
  FiZap, FiAlertTriangle, FiGift, FiSmile, FiLogIn } from "react-icons/fi";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
type NavItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/", icon: <FiHome className="text-md" /> },
  { name: "Quest Log", path: "/quests", icon: <FiClipboard className="text-md" />, },
  { name: "Combos", path: "/combos", icon: <FiZap className="text-md" />, },
  { name: "Penalties", path: "/penalties", icon: <FiAlertTriangle className="text-md" />, },
  { name: "Level Up", path: "/level-up", icon: <FiGift className="text-md" />, },
  { name: "Character", path: "/character", icon: <FiUser className="text-md" />, },
  { name: "History", path: "/history", icon: <FiBarChart2 className="text-md" />, },
  { name: "Settings", path: "/settings", icon: <FiSettings className="text-md" />, },
  { name: "Auth", path: "/auth", icon: <FiLogIn className="text-md" />, },
];

export const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  useGSAP(() => { 
    gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "back.out",
      });
    }, { scope: navRef });

  return (
    <div ref={navRef} className="w-full bg-gray-800 text-white flex items-center justify-start gap-4 px-6 pt-2 shadow-md" >
      {navItems.map(({ name, path, icon }) => (
        <NavLink key={name} to={path} className={({ isActive }) =>
            `flex items-center gap-2 p-3 transition-all duration-200 ${isActive ? 
            " border-b-4 border-gray-900" : "border-b-0 "
      }`}>
          {icon}
          <span className="hidden sm:inline text-md">{name}</span>
        </NavLink>
      ))}
    </div>
  );
};
