"use client";

import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Coins,
  Menu,
  Rocket,
  ListFilter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserCredits } from '@/lib/api';
import { useUser } from '@clerk/clerk-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'New Campaign',
    icon: PlusCircle,
    href: '/campaigns/new',
  },
  {
    title: 'View Campaigns',
    icon: ListFilter,
    href: '/campaigns',
  },
  {
    title: 'Credits',
    icon: Coins,
    href: '/credits',
  },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCredits = async () => {
    try {
      const userCredits = await getUserCredits(user?.id || '');
      setCredits(userCredits.totalCredits);
    } catch (error) {
      console.error('Failed to fetch user credits', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCredits();
    }
  }, [user]);

  // Set up an interval to refresh credits every minute
  useEffect(() => {
    if (user) {
      const interval = setInterval(loadCredits, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <Rocket className="h-6 w-6" />
              <h1 className="text-xl font-bold">Revelve</h1>
            </Link>
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Credits Meter */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {loading ? "Loading..." : `${credits} credits`}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => navigate('/credits')}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={Math.max(0, Math.min(100, (credits / 1000) * 100))} className="h-1" />
        <p className="text-xs text-muted-foreground mt-1">
          {credits < 5 ? "Insufficient credits" : `${Math.round((credits / 1000) * 100)}% of 1000 credits`}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed inset-y-0 left-0 w-[240px] border-r bg-background">
        <NavContent />
      </nav>
    </>
  );
}