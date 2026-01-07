import * as React from "react";
import { Link, useLocation } from "react-router";
import {
  BarChart3,
  Box,
  ChevronDown,
  Home,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

type Crumb = { label: string; to?: string };

function buildBreadcrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);

  // "/" => Home (Landing)
  if (parts.length === 0) return [{ label: "Home" }];

  // Top-level routes
  if (parts[0] === "customers")
    return [{ label: "Home", to: "/" }, { label: "Customers" }];

  if (parts[0] === "products")
    return [{ label: "Home", to: "/" }, { label: "Products" }];

  if (parts[0] === "settings")
    return [{ label: "Home", to: "/" }, { label: "Settings" }];

  // Overview flow
  if (parts[0] === "overview") {
    const crumbs: Crumb[] = [
      { label: "Home", to: "/" },
      { label: "Overview", to: "/overview" },
    ];

    // /overview/:productId
    if (parts[1]) {
      crumbs.push({ label: parts[1], to: `/overview/${parts[1]}` });
    }

    // /overview/:productId/:deviceId (último sin link)
    if (parts[2]) {
      crumbs.push({ label: parts[2] });
    }

    return crumbs;
  }

  // Fallback
  return [{ label: "Home", to: "/" }, { label: parts.join(" / ") }];
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = React.useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {crumbs.map((c, idx) => {
        const isLast = idx === crumbs.length - 1;

        return (
          <React.Fragment key={`${c.label}-${idx}`}>
            {idx > 0 && <span className="text-muted-foreground/60">/</span>}

            {c.to && !isLast ? (
              <Link to={c.to} className="hover:text-foreground transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground/90" : ""}>
                {c.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar collapsible="icon" className="border-r border-border/60">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="h-8 w-8 rounded-xl bg-foreground/10 border border-border/60" />
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Iris</div>
                  <div className="text-xs text-muted-foreground">Dashboard</div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* HOME (Landing) */}
                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild isActive={pathname === "/"}>
                            <Link to="/">
                              <Home className="h-4 w-4" />
                              <span>Home</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Home</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>

                    {/* OVERVIEW */}
                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith("/overview")}
                          >
                            <Link to="/overview">
                              <BarChart3 className="h-4 w-4" />
                              <span>Overview</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Overview</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith("/customers")}
                          >
                            <Link to="/customers">
                              <Users className="h-4 w-4" />
                              <span>Customers</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Customers</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith("/products")}
                          >
                            <Link to="/products">
                              <ShoppingBag className="h-4 w-4" />
                              <span>Products</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Products</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith("/settings")}
                          >
                            <Link to="/settings">
                              <Settings className="h-4 w-4" />
                              <span>Settings</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Box className="h-4 w-4" />
                        <span>Inventory</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <div className="p-2">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/30 px-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">S. Name</div>
                    <div className="truncate text-xs text-muted-foreground">
                      admin
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <header className="sticky top-0 z-10 border-b border-border/60 bg-background/40 backdrop-blur">
              <div className="mx-auto flex max-w-300 items-center gap-3 px-6 py-3">
                <Breadcrumbs />

                <div className="ml-auto flex items-center gap-3">
                  <div className="relative w-70 hidden md:block">
                    <Input
                      placeholder="Search"
                      className="h-9 bg-card/30 border-border/60"
                    />
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground border border-border/60 rounded-md px-1.5 py-0.5">
                      ⌘ K
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
