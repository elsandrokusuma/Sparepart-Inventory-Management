"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Boxes,
  PackagePlus,
  PackageMinus,
  History,
  ShoppingCart,
  ShieldCheck,
  ChevronRight,
  Settings,
  LogOut,
  Package,
} from 'lucide-react';
import { Separator } from './ui/separator';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/stock-in', label: 'Stock In', icon: PackagePlus },
  { href: '/stock-out', label: 'Stock Out', icon: PackageMinus },
  { href: '/pre-orders', label: 'Pre-Orders', icon: ShoppingCart },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/history', label: 'Record History', icon: History },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">StockPilot</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  asChild
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton href="#">
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-card mt-2">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40" alt="Admin" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-muted-foreground">admin@stockpilot.com</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                {/* Header content can go here */}
            </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
