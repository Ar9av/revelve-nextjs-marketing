"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Coins, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createCampaign, getUserCredits, deductCampaignCredits } from '@/lib/api';

const CAMPAIGN_CREATION_COST = 100;
const DAILY_COST = 5;

interface FormData {
  title: string;
  description: string;
  links: string;
}

export function CampaignForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [tone, setTone] = useState(50);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      setKeywords([...keywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const hasEnoughCredits = credits >= CAMPAIGN_CREATION_COST;

  const onSubmit = async (formData: FormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a campaign",
        variant: "destructive"
      });
      return;
    }

    if (!hasEnoughCredits) {
      toast({
        title: "Insufficient credits",
        description: `You need ${CAMPAIGN_CREATION_COST} credits to create a campaign. Please top up your credits.`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const links = formData.links ? formData.links.split('\n').filter(s => s.trim()) : [];
      const campaign = await createCampaign({
        title: formData.title,
        description: formData.description,
        keywords: keywords,
        tone: tone,
        links: links,
        userId: user.id
      });

      // Deduct credits through API
      await deductCampaignCredits(user.id, campaign.id, CAMPAIGN_CREATION_COST, 'new-campaign');

      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
          <CardDescription>
            Set up your Reddit marketing campaign with natural, human-like responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter your campaign title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Describe your campaign's key features and benefits"
              className="min-h-[200px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
              <Label>Advanced Options</Label>
              {showAdvancedOptions ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showAdvancedOptions && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Target Keywords</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {keywords.map((kw, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeKeyword(i)}
                      >
                        {kw} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add keywords (press Enter)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={addKeyword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="links">Related Links</Label>
                  <Textarea
                    id="links"
                    {...register("links")}
                    placeholder="Enter target links (one per line)"
                    className="min-h-[100px]"
                  />
                  {errors.links && (
                    <p className="text-sm text-destructive">{errors.links.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Response Tone</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[tone]}
                      onValueChange={(value) => setTone(value[0])}
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Professional</span>
                      <span>Casual</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="w-full p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-medium">Credit Requirements</span>
              </div>
              <span className="font-medium">{credits} credits available</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Campaign creation cost</span>
                <span>{CAMPAIGN_CREATION_COST} credits</span>
              </li>
              <li className="flex justify-between">
                <span>Daily maintenance cost</span>
                <span>{DAILY_COST} credits</span>
              </li>
            </ul>
          </div>

          {!hasEnoughCredits ? (
            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={() => navigate('/credits')}
            >
              <Lock className="mr-2 h-4 w-4" />
              Get More Credits to Start Campaign
            </Button>
          ) : (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}