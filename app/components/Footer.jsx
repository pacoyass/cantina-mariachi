import { NavLink } from "react-router"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Github, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <div className="text-lg font-semibold">Cantina</div>
          <p className="text-sm text-muted-foreground">Authentic Mexican flavors, modern experience.</p>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Quick Links</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/menu">Menu</NavLink></li>
            <li><NavLink to="/orders">Orders</NavLink></li>
            <li><NavLink to="/reservations">Reservations</NavLink></li>
            <li><NavLink to="/account">Account</NavLink></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Contact</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>123 Avenida de la Cocina</li>
            <li>+1 (555) 123-4567</li>
            <li>support@cantina.example</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Newsletter</div>
          <div className="flex gap-2 max-w-xs">
            <Input placeholder="Email address" type="email" />
            <Button>Join</Button>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground pt-2">
            <a href="#" aria-label="GitHub"><Github className="size-4" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="size-4" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="size-4" /></a>
          </div>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto px-6 py-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>© {year} Cantina. All rights reserved.</span>
        <div className="flex gap-3">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}