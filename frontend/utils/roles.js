import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Printer,
  ChefHat,
  UserPlus,
} from 'lucide-react';

export const ALL_NAV_ITEMS = [
  { name: 'Landing Page', href: '/user', icon: ChefHat, roles: ['MASTER_ADMIN', 'OWNER'] },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['MASTER_ADMIN', 'OWNER'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['MASTER_ADMIN', 'OWNER'] },
  { name: 'Billing', href: '/billing', icon: ReceiptText, roles: ['MASTER_ADMIN', 'CASHIER'] },
  { name: 'Receipts', href: '/receipts', icon: Printer, roles: ['MASTER_ADMIN', 'CASHIER'] },
  { name: 'Add Member', href: '/add-member', icon: UserPlus, roles: ['MASTER_ADMIN'] },
];

export function getNavItemsForUser(user) {
  if (!user?.company_id) {
    // No company yet — show links locked (landing stays available)
    return ALL_NAV_ITEMS.map((item) => ({
      ...item,
      locked: item.href !== '/user',
    }));
  }

  return ALL_NAV_ITEMS
    .filter((item) => item.roles.includes(user.company_role))
    .map((item) => ({ ...item, locked: false }));
}

export function getHomePathForUser(user) {
  if (!user) return '/login';
  if (!user.company_id) return '/user';
  if (user.company_role === 'CASHIER') return '/billing';
  return '/user';
}

export function canAccessPath(user, path) {
  if (!user?.company_id) return path === '/user';
  const item = ALL_NAV_ITEMS.find((nav) => nav.href === path);
  if (!item) return true;
  return item.roles.includes(user.company_role);
}
