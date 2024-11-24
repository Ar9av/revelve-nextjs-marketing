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
  import { Badge } from '@/components/ui/badge';
  import { Slider } from '@/components/ui/slider';
  import { Settings } from 'lucide-react';
  import { useState } from 'react';
  import { Campaign, updateCampaignDetails } from '@/lib/api';
  import { useToast } from '@/hooks/use-toast';
  
  interface CampaignEditDialogProps {
    campaign: Campaign;
    onUpdate: () => void;
  }
  
  export function CampaignEditDialog({ campaign, onUpdate }: CampaignEditDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(campaign.title);
    const [description, setDescription] = useState(campaign.description);
    const [keywords, setKeywords] = useState<string[]>(campaign.keywords);
    const [keyword, setKeyword] = useState('');
    const [tone, setTone] = useState(campaign.tone);
    const [links, setLinks] = useState(campaign.links.join('\n'));
  
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
  
    const handleSubmit = async () => {
      try {
        setIsSubmitting(true);
        await updateCampaignDetails(campaign.id, {
          title,
          description,
          keywords,
          tone,
          links: links.split('\n').filter(s => s.trim()),
        });
  
        toast({
          title: "Campaign updated",
          description: "Your campaign settings have been updated successfully"
        });
  
        onUpdate();
        setOpen(false);
      } catch (error) {
        console.error('Failed to update campaign:', error);
        toast({
          title: "Error",
          description: "Failed to update campaign settings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign Settings</DialogTitle>
            <DialogDescription>
              Update your campaign's configuration and targeting options.
            </DialogDescription>
          </DialogHeader>
  
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter campaign title"
              />
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign"
                className="min-h-[100px]"
              />
            </div>
  
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
  
            <div className="space-y-2">
              <Label htmlFor="links">Links for context</Label>
              <Textarea
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="Enter target links (one per line)"
                className="min-h-[100px]"
              />
            </div>
          </div>
  
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }