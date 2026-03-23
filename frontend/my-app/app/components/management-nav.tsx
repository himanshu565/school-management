import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Students" },
  { to: "/teachers", label: "Teachers" },
  { to: "/subjects", label: "Subjects" },
];

export function ManagementNav() {
  return (
    <nav className="sms-nav" aria-label="Management pages">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            isActive ? "sms-nav-link is-active" : "sms-nav-link"
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
