"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Star,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/students",
      label: "Alunos",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/students" || pathname.startsWith("/students/"),
    },
    {
      href: "/forum",
      label: "Fórum",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/forum" || pathname.startsWith("/forum/"),
    },
    {
      href: "/files",
      label: "Arquivos",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/files" || pathname.startsWith("/files/"),
    },
    {
      href: "/teachers",
      label: "Professores",
      icon: <Star className="mr-2 h-4 w-4" />,
      active: pathname === "/teachers" || pathname.startsWith("/teachers/"),
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      active: pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    },
    {
      href: "/profile",
      label: "Meu Perfil",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/profile",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center">
        <GraduationCap className="h-6 w-6 mr-2" />
        <span className="font-bold hidden md:inline-block">FATEC Portal</span>
      </Link>
      <div className="flex-1 flex justify-center space-x-1 md:space-x-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-black dark:text-white" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center">
              {route.icon}
              <span className="hidden md:inline-block">{route.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        <span className="hidden md:inline-block">Sair</span>
      </Button>
    </nav>
  )
}
