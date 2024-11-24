"use client";

import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Dashboard } from '@/components/dashboard';
import { CampaignForm } from '@/components/campaign-form';
import { LandingPage } from '@/components/landing-page';
import { CampaignsList } from '@/components/campaigns/campaign-list';
import { CampaignDetails } from '@/components/campaigns/campaign-details';
import { CreditsPage } from '@/components/credits/credits-page';
import { Sidebar } from '@/components/layout/sidebar';
import { Rocket } from 'lucide-react';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ProtectedApp() {
  return (
    <SignedIn>
      <Routes>
        <Route path="/" element={<LandingPage isSignedIn />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns/new" element={<CampaignForm />} />
        <Route path="/campaigns" element={<CampaignsList />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/credits" element={<CreditsPage />} />
      </Routes>
    </SignedIn>
  );
}

function HeaderAndSidebar() {
  return (
    <header className="border-b fixed top-0 right-0 left-0 z-50 bg-background">
      <div className="flex h-20 items-center justify-between w-full px-4 lg:px-8">
      <Sidebar />
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <Rocket className="h-6 w-6" />
          <h1 className="text-xl font-bold">Revelve</h1>
        </Link>
        <div className="flex items-center gap-4 ml-auto pr-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderAndSidebar />
      <main className="pt-16 lg:pl-[240px]">
        <div className="container px-4 py-6 lg:px-8">
          <ProtectedApp />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="system" storageKey="reddit-marketing-theme">
        <Router>
          <SignedOut>
            <Routes>
              <Route path="/" element={<LandingPage isSignedIn={false} />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </SignedOut>
          <SignedIn>
            <Routes>
              <Route path="/" element={<LandingPage isSignedIn={true} />} />
              <Route path="/*" element={<MainLayout />} />
            </Routes>
          </SignedIn>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}