"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, MessageSquare, ThumbsUp, ArrowRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Campaign, getCampaigns } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
// import { MovingBorder } from '@/components/ui/moving-border';
import { cn } from '@/lib/utils';
import ShineBorder from "@/components/ui/shine-border";

export function CampaignsList() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      if (!user) return;
      
      try {
        const data = await getCampaigns(user.id);
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        toast({
          title: "Error",
          description: "Failed to load campaigns. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [user, toast]);

  if (loading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const content = (
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{campaign.title}</h3>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status}
            </Badge>
            {campaign.superboost && (
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                Boosted
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {campaign.links.join(', ')}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaign.stats?.totalUpvotes || 0} upvotes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaign.stats?.totalReplies || 0} comments</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaign.postCount || 0} posts</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate(`/campaigns/${campaign.id}`)}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    );

    if (campaign.superboost) {
      return (
        <ShineBorder
            className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
          <Card className={cn(
            "w-full",
            "hover:bg-muted/50 transition-colors",
            "border-none bg-background shadow-xl"
          )}>
            {content}
          </Card>
          </ShineBorder>
      );
    }

    return (
      <Card className="hover:bg-muted/50 transition-colors">
        {content}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
        <Button onClick={() => navigate('/campaigns/new')}>Create Campaign</Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        {campaigns.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No campaigns found. Create your first campaign to get started!</p>
              <Button onClick={() => navigate('/campaigns/new')} className="mt-4">
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}