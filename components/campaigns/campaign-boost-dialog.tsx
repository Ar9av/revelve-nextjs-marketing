"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coins, Lock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { getUserCredits, activateSuperboost, deductCampaignCredits } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const BOOST_COST = 50;

interface CampaignBoostDialogProps {
  campaignId: string;
  onBoostComplete?: () => void;
}

export function CampaignBoostDialog({ campaignId, onBoostComplete }: CampaignBoostDialogProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [boostType, setBoostType] = useState('');
  const [regions, setRegions] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [dailyLimit, setDailyLimit] = useState('50');

  useEffect(() => {
    async function loadCredits() {
      if (!user) return;
      try {
        const response = await getUserCredits(user.id);
        setCredits(response.totalCredits);
      } catch (error) {
        console.error('Failed to load credits:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCredits();
  }, [user]);

  const hasEnoughCredits = credits >= BOOST_COST;

  const handleBoost = async () => {
    if (!user || !hasEnoughCredits) {
      toast({
        title: "Insufficient credits",
        description: `You need ${BOOST_COST} credits to boost this campaign. Please top up your credits.`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare superboost parameters
      const superboostParams = {
        type: boostType,
        regions: [regions],
        messageTemplate: messageTemplate || undefined,
        dailyLimit: parseInt(dailyLimit) || undefined
      };

      // Update campaign with superboost status
      await activateSuperboost(campaignId, superboostParams);
      
      // Deduct credits
      await deductCampaignCredits(user.id, campaignId, BOOST_COST, 'superboost');
      
      toast({
        title: "Boost activated",
        description: "Your campaign boost has been activated successfully"
      });
      
      // Notify parent component
      if (onBoostComplete) {
        onBoostComplete();
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to boost campaign:', error);
      toast({
        title: "Error",
        description: "Failed to boost campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Zap className="h-4 w-4" />
          Super Boost
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Super Boost Campaign</DialogTitle>
          <DialogDescription>
            Enhance your campaign's reach with additional targeting options.
            This will consume {BOOST_COST} credits from your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Boost Type</Label>
            <Select value={boostType} onValueChange={setBoostType}>
              <SelectTrigger>
                <SelectValue placeholder="Select boost type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geographic">Geographic Expansion (50 credits)</SelectItem>
                <SelectItem value="dm">DM Campaign (100 credits)</SelectItem>
                <SelectItem value="both">Combined Boost (140 credits)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Target Regions</Label>
            <Select value={regions} onValueChange={setRegions}>
              <SelectTrigger>
                <SelectValue placeholder="Select regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="na">North America</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>DM Message Template</Label>
            <Textarea 
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder="Hi! Saw that you might be interested in our product..."
              className="h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Daily Message Limit</Label>
            <Input 
              type="number" 
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              placeholder="50" 
            />
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-medium">Available Credits</span>
              </div>
              <span className="font-medium">{credits}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Boost cost: {BOOST_COST} credits
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {!hasEnoughCredits ? (
            <Button
              variant="outline"
              onClick={() => navigate('/credits')}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              Get More Credits
            </Button>
          ) : (
            <Button onClick={handleBoost} disabled={isSubmitting || !boostType || !regions}>
              {isSubmitting ? "Activating..." : "Activate Boost"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}