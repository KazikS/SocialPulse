import { Link, useLocation } from "react-router-dom";
import { navItems } from "./config";
import styles from "./LayoutNavBar.module.scss";
import clsx from "clsx";

export const LayoutNavBar = () => {
  const currentLocation = useLocation();
  return (
    <aside className={styles.wrapper}>
      <div className={styles.logo}>
        <img src="/icon.svg" alt="logo" className={styles.logoIcon} />
        <span>
          Social<span className={styles.secondPartLogoText}>Pulse</span>
        </span>
      </div>
      <nav className={styles.navList}>
        <article>
          {navItems.map((section) => (
            <div key={section.sectionTitle}>
              <div className={styles.sectionTitle}>
                <h3>{section.sectionTitle}</h3>
                <div className={styles.navLinks}>
                  {section.items.map((item) => (
                    <Link
                      to={item.path}
                      className={clsx(
                        styles.navItem,
                        currentLocation.pathname === item.path &&
                          styles.selectedNavItem,
                      )}
                      key={item.path}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </article>
      </nav>
    </aside>
  );
};
