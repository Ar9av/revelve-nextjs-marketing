"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getUserCredits, claimCode } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface CustomCredit {
  type: string;
  id: string;
  description: string | null;
  campaignId: string | null;
  createdAt: Date;
  userId: string;
  expenseType: string;
  creditsValue: number;
}

export function CreditsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<CustomCredit[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [claimCodeInput, setClaimCodeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCredits();
  }, [user]);

  async function loadCredits() {
    if (!user) return;

    try {
      const data = await getUserCredits(user.id);
      const transformedCredits = data.credits.map((credit: any): CustomCredit => ({
        ...credit,
        description: credit.description ?? null,
      }));
      setCredits(transformedCredits);
      setTotalCredits(data.totalCredits);
    } catch (error) {
      console.error('Failed to load credits:', error);
      toast({
        title: "Error",
        description: "Failed to load credits data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleClaimCode = async () => {
    if (!user || !claimCodeInput.trim()) return;

    try {
      setSubmitting(true);
      const result = await claimCode(user.id, claimCodeInput.trim());

      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully claimed ${result.credits} credits!`
        });
        loadCredits();
        setClaimCodeInput('');
      }
    } catch (error) {
      console.error('Failed to claim code:', error);
      setErrorMessage("Invalid code or already claimed.");
      toast({
        title: "Error",
        description: "Invalid code or already claimed.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Credits Management</h2>

      {/* Credits Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Coins className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">{totalCredits}</p>
                <p className="text-sm text-muted-foreground">credits remaining</p>
              </div>
            </div>
            {totalCredits < 0 && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">
                  Your account has insufficient credits. All campaigns have been paused.
                  Please top up your credits to resume your campaigns.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter claim code"
                value={claimCodeInput}
                onChange={(e) => {
                  setClaimCodeInput(e.target.value);
                  setErrorMessage(null);
                }}
              />
              <Button onClick={handleClaimCode} disabled={submitting}>
                {submitting ? "Claiming..." : "Claim"}
              </Button>
            </div>
            {errorMessage && (
              <p className="text-sm text-destructive mt-2">{errorMessage}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Use code "REVELVEDUP" for 500 bonus credits!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Packages */}
      <h3 className="text-2xl font-semibold mt-8 mb-4">Top Up Credits</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {creditPackages.map((pkg) => (
          <Card key={pkg.name}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">{pkg.credits}</p>
                <p className="text-sm text-muted-foreground">credits</p>
              </div>
              <div>
                <p className="text-2xl font-bold">${pkg.price}</p>
                <p className="text-sm text-muted-foreground">one-time payment</p>
              </div>
              <ul className="space-y-2">
                {pkg.features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">Purchase</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {credits.map((credit) => (
              <div key={credit.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">
                    {credit.description || getTransactionDescription(credit.type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(credit.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <p className={cn(
                  "text-lg font-semibold",
                  credit.expenseType === 'credit' ? 'text-green-500' : 'text-red-500'
                )}>
                  {credit.expenseType === 'credit' ? '+' : '-'}{credit.creditsValue}
                </p>
              </div>
            ))}

            {credits.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No transactions yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getTransactionDescription(type: string): string {
  switch (type) {
    case 'new-login':
      return 'Welcome bonus';
    case 'new-campaign':
      return 'New campaign created';
    case 'superboost':
      return 'Campaign super boost';
    case 'topup':
      return 'Credits top up';
    case 'claim-code':
      return 'Promo code redemption';
    default:
      return 'Transaction';
  }
}

const creditPackages = [
  {
    name: 'Starter',
    credits: 1000,
    price: 9.99,
    features: ['Basic campaign boost', 'Standard targeting']
  },
  {
    name: 'Pro',
    credits: 5000,
    price: 39.99,
    features: ['Advanced campaign boost', 'Geographic targeting', 'DM campaigns']
  },
  {
    name: 'Enterprise',
    credits: 20000,
    price: 149.99,
    features: ['Maximum campaign boost', 'Global targeting', 'Priority DM campaigns', 'Custom targeting']
  }
];