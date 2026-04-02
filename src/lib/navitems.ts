import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const publicNavItems = [
  {
    title: "Home",
    href: "/",
    icon: "Home",
  },
  {
    title: "Media",
    href: "/media",
    icon: "Film",
  },
];

export const getCommonNavItems = (role: UserRole): NavSection[] => {
const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: "/user/profile",
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "Media Management",
    items: [
      {
        title: "All Media",
        href: "/admin/media",
        icon: "Film",
      },
      {
        title: "Add Media",
        href: "/admin/media/create",
        icon: "PlusCircle",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: "Users",
      },
    ],
  },
  {
    title: "Transactions",
    items: [
      {
        title: "Purchases",
        href: "/admin/purchases",
        icon: "ShoppingCart",
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: "CreditCard",
      },
    ],
  },
  {
    title: "Engagement",
    items: [
      {
        title: "Reviews",
        href: "/admin/reviews",
        icon: "Star",
      },
      {
        title: "Comments",
        href: "/admin/comments",
        icon: "MessageCircle",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "My Content",
    items: [
      {
        title: "My Library",
        href: "/user/library",
        icon: "Film",
      },
      {
        title: "Watch History",
        href: "/user/history",
        icon: "Clock",
      },
      {
        title: "Watchlist",
        href: "/user/watchlist",
        icon: "Bookmark",
      },
    ],
  },
  {
    title: "Activity",
    items: [
      {
        title: "My Reviews",
        href: "/user/reviews",
        icon: "Star",
      },
      {
        title: "My Comments",
        href: "/user/comments",
        icon: "MessageCircle",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "My Purchases",
        href: "/user/purchases",
        icon: "ShoppingCart",
      },
    ],
  },
];
export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "USER":
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};