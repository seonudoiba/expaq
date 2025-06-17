"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/admin/SidebarContext";
import { adminNavItems } from "@/components/admin/AdminSidebarData";
import { ChevronDownIcon, HorizontaLDots } from "@/icons/index";
import SidebarWidget from "@/layout/SidebarWidget";

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // Function to check if a path is active
  const isActive = useCallback(
    (path: string) => {
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname]
  );

  // Render menu items with their submenus
  const renderMenuItems = (menuType: "main") => {
    return (
      <ul className="flex flex-col gap-1">
        {adminNavItems.map((item, index) => (
          <li key={index} className="group relative">
            {item.path ? (
              // Single menu item with direct link
              <Link
                href={item.path}
                className={`menu-item group ${
                  isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "justify-center px-4"
                    : "justify-between px-4"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive(item.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    } menu-item-icon`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`duration-300 ease-linear ${
                      !isExpanded && !isHovered ? "lg:hidden" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </span>
              </Link>
            ) : (
              // Menu item with submenu
              <>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group w-full ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-active"
                      : item.subItems?.some((subItem) => isActive(subItem.path))
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } ${
                    !isExpanded && !isHovered
                      ? "justify-center px-4"
                      : "justify-between px-4"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "menu-item-icon-active"
                          : item.subItems?.some((subItem) =>
                              isActive(subItem.path)
                            )
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      } menu-item-icon`}
                    >
                      {item.icon}
                    </span>

                    <span
                      className={`duration-300 ease-linear ${
                        !isExpanded && !isHovered ? "lg:hidden" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>

                  <span
                    className={`duration-300 ease-linear ${
                      !isExpanded && !isHovered ? "lg:hidden" : ""
                    }`}
                  >
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </span>
                </button>

                {/* Submenu */}
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className={`overflow-hidden transition-all duration-300 ${
                    !isExpanded && !isHovered
                      ? "absolute left-full ml-1 top-0 w-[230px] rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:invisible lg:group-hover:visible"
                      : ""
                  }`}
                  style={{
                    maxHeight:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? subMenuHeight[`${menuType}-${index}`] + "px"
                        : ((!isExpanded && !isHovered) ||
                            !item.subItems?.some((subItem) =>
                              isActive(subItem.path)
                            )) &&
                          !(
                            openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                          )
                        ? "0px"
                        : "0px",
                  }}
                >
                  <ul className="sub-menu flex list-none flex-col gap-2.5 border-l border-gray-200 pl-4 pr-2.5 pt-2.5 pb-2.5 dark:border-gray-800">
                    {item.subItems?.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    adminNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/admin">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center">
              <Image
                src="/expaqlogo.png"
                alt="ExpAq Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                ExpAq Admin
              </span>
            </div>
          ) : (
            <Image
              src="/expaqlogo.png"
              alt="ExpAq Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Admin Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems("main")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AdminSidebar;
