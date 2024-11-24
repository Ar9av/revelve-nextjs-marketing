"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from '@/components/ui/button';
  import { PlayCircle } from 'lucide-react';
  import { useState } from 'react';
  import { updateCampaignStatus } from '@/lib/api';
  import { useToast } from '@/hooks/use-toast';
  
  interface CampaignReactivateDialogProps {
    campaignId: string;
    onReactivate: () => void;
  }
  
  export function CampaignReactivateDialog({ campaignId, onReactivate }: CampaignReactivateDialogProps) {
    const { toast } = useToast();
    const [isReactivating, setIsReactivating] = useState(false);
  
    const handleReactivate = async () => {
      try {
        setIsReactivating(true);
        await updateCampaignStatus(campaignId, 'active');
        toast({
          title: "Campaign reactivated",
          description: "The campaign has been reactivated successfully. You will be charged 10 credits per day."
        });
        onReactivate();
      } catch (error) {
        console.error('Failed to reactivate campaign:', error);
        toast({
          title: "Error",
          description: "Failed to reactivate campaign. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsReactivating(false);
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="gap-2" disabled={isReactivating}>
            <PlayCircle className="h-4 w-4" />
            {isReactivating ? "Reactivating..." : "Reactivate Campaign"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reactivate your campaign and resume all campaignal activities.
              You will be charged 10 credits per day for running this campaign.
              Make sure you have sufficient credits in your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReactivate}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }