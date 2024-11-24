const API_URL = '/api';

export interface Post {
  id: string;
  postUrl: string;
  totalLikes: number;
  totalReplies: number;
  upvotes: number;
  positive: number;
  negative: number;
  neutral: number;
  subreddit: string;
  timePosted: string;
  data?: any;
  campaignId: string;
}

export interface CampaignStats {
  totalLikes: number;
  totalReplies: number;
  totalUpvotes: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  tone: number;
  links: string[];
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  superboost: boolean;
  superboostParams?: any;
  stats?: CampaignStats;
  postCount?: number;
  posts?: Post[];
  dailyStats?: Array<{
    date: string;
    engagements: number;
    parentEngagements: number;
    newPosts: number;
  }>;
}

export interface SuperboostParams {
  type: string;
  regions: string[];
  messageTemplate?: string;
  dailyLimit?: number;
}

export interface DashboardData {
  stats: CampaignStats;
  engagementData: Array<{ date: string; value: number }>;
  recentPosts: Array<{
    id: string;
    subreddit: string;
    upvotes: number;
    timePosted: string;
    postUrl: string;
  }>;
  activeCampaigns: number;
  totalCampaigns: number;
  totalPosts: number;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  keywords: string[];
  tone: number;
  links: string[];
  userId: string;
}

export interface UpdateCampaignInput {
  title: string;
  description: string;
  keywords: string[];
  tone: number;
  links: string[];
}

export interface Credit {
  id: string;
  createdAt: string;
  userId: string;
  campaignId?: string;
  expenseType: string;
  creditsValue: number;
  type: string;
  description?: string;
}

export interface CreditsResponse {
  credits: Credit[];
  totalCredits: number;
}

export async function createCampaign(data: CreateCampaignInput): Promise<Campaign> {
  const response = await fetch(`${API_URL}/campaigns/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }

  return response.json();
}

export async function getUserCredits(userId: string): Promise<CreditsResponse> {
  console.log("userId", userId)
  const response = await fetch(`${API_URL}/credits/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch credits');
  }

  return response.json();
}

export async function deductCampaignCredits(userId: string, campaignId: string, amount: number, type: string): Promise<void> {
  const response = await fetch(`${API_URL}/credits/deduct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, campaignId, amount, type }),
  });

  if (!response.ok) {
    throw new Error('Failed to deduct credits');
  }
}

export async function activateSuperboost(campaignId: string, params: SuperboostParams): Promise<Campaign> {
  const response = await fetch(`${API_URL}/campaigns/${campaignId}/superboost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ superboostParams: params }),
  });

  if (!response.ok) {
    throw new Error('Failed to activate superboost');
  }

  return response.json();
}

export async function claimCode(userId: string, code: string): Promise<{ success: boolean; credits?: number }> {
  const response = await fetch(`${API_URL}/credits/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, code }),
  });

  if (!response.ok) {
    throw new Error('Failed to claim code');
  }

  return response.json();
}

export async function checkNewUser(userId: string): Promise<{ isNewUser: boolean; credits?: number }> {
  const response = await fetch(`${API_URL}/credits/check-new-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check new user');
  }

  return response.json();
}

export async function updateCampaignStatus(id: string, status: string): Promise<Campaign> {
  const response = await fetch(`${API_URL}/campaigns/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update campaign status');
  }

  return response.json();
}

export async function updateCampaignDetails(id: string, data: UpdateCampaignInput): Promise<Campaign> {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update campaign details');
    }
  
    return response.json();
  }

export async function getCampaigns(userId: string): Promise<Campaign[]> {
    const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  }

export async function getCampaignDetails(id: string): Promise<Campaign> {
const response = await fetch(`${API_URL}/campaigns/details?id=${id}`);

if (!response.ok) {
    throw new Error('Failed to fetch campaign details');
}

return response.json();
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}