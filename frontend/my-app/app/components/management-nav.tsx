import { NavLink } from "react-router";
import { useTheme } from "../themecontext";

const navItems = [
  { to: "/", label: "Students" },
  { to: "/teachers", label: "Teachers" },
  { to: "/subjects", label: "Subjects" },
];

export function ManagementNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sms-nav-row">
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

      <button
        type="button"
        className="sms-theme-toggle"
        aria-pressed={theme === "dark"}
        onClick={toggleTheme}
      >
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </button>
    </div>
  );
}
