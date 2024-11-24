"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Rocket,
  MessageSquare,
  Target,
  Check,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { UserButton } from '@clerk/clerk-react';
export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Header */}
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm z-50">
        <div className="flex h-16 items-center justify-between w-full px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Rocket className="h-6 w-6" />
            <h1 className="text-xl font-bold">Revelve</h1>
          </div>
          <div className="flex items-start gap-4 justify-end">
            <ModeToggle />
            {!isSignedIn ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/sign-in')}>Sign In</Button>
                <Button onClick={() => navigate('/sign-up')}>Get Started</Button>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[55vh] pt-16 pb-10 px-4 flex items-center">
        <div className="container mx-auto text-center">
          <div className="h-[15rem] flex items-center justify-center">
            <TextHoverEffect text="Revelve" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Automate Your Reddit Marketing
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate authentic, human-like responses for your product across relevant Reddit threads
          </p>
          <div className="flex gap-4 justify-center">
            {isSignedIn ? (
              <Button size="lg" className="group" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <>
                <Button size="lg" className="group" onClick={() => navigate('/sign-up')}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/sign-in')}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border bg-card">
                <feature.icon className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {!isSignedIn && (
        <section className="py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Choose the perfect plan for your marketing needs. All plans include our core features.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div key={index} className="p-6 rounded-lg border bg-card">
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className={!feature.included ? "text-muted-foreground" : ""}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.name === "Pro" ? "default" : "outline"}
                    onClick={() => navigate('/sign-up')}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to know about our Reddit marketing platform
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto p-8 rounded-lg border bg-card">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of marketers who are already using our platform to grow their Reddit presence.
              </p>
              <Button size="lg" className="group" onClick={() => navigate('/sign-up')}>
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Responses",
    description: "Generate contextually relevant, human-like responses that naturally promote your product.",
    icon: Bot,
  },
  {
    title: "Smart Thread Detection",
    description: "Automatically identify and target the most relevant Reddit threads for your product.",
    icon: Target,
  },
  {
    title: "Engagement Analytics",
    description: "Track your campaign performance with detailed analytics and engagement metrics.",
    icon: MessageSquare,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses just getting started with Reddit marketing.",
    features: [
      { text: "5 Active Campaigns", included: true },
      { text: "100 AI-Generated Comments/mo", included: true },
      { text: "Basic Analytics", included: true },
      { text: "Email Support", included: true },
      { text: "Custom Response Templates", included: false },
      { text: "Advanced Analytics", included: false },
    ],
  },
  {
    name: "Pro",
    price: 79,
    description: "Ideal for growing businesses seeking more engagement.",
    features: [
      { text: "15 Active Campaigns", included: true },
      { text: "500 AI-Generated Comments/mo", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom Response Templates", included: true },
      { text: "API Access", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large organizations requiring maximum reach.",
    features: [
      { text: "Unlimited Campaigns", included: true },
      { text: "Unlimited Comments", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "24/7 Priority Support", included: true },
      { text: "Custom Response Templates", included: true },
      { text: "API Access", included: true },
    ],
  },
];

const faqs = [
  {
    question: "How does the AI ensure human-like responses?",
    answer: "Our AI is trained on millions of authentic Reddit conversations to understand context, tone, and natural language patterns. It generates unique responses while maintaining authenticity and following Reddit's guidelines.",
  },
  {
    question: "Is this compliant with Reddit's terms of service?",
    answer: "Yes, our platform operates within Reddit's TOS. We ensure transparency and avoid spam-like behavior. Our AI generates genuine, valuable contributions to discussions while disclosing promotional content appropriately.",
  },
  {
    question: "How do you target relevant threads?",
    answer: "We use advanced algorithms to analyze subreddit content, user engagement patterns, and keyword relevance. This ensures your product is promoted in discussions where it adds genuine value to the conversation.",
  },
  {
    question: "Can I customize the AI's response tone?",
    answer: "Absolutely! You can adjust the tone from professional to casual, and set specific keywords, phrases, or topics to include or avoid in responses. This ensures alignment with your brand voice.",
  },
  {
    question: "What analytics do you provide?",
    answer: "Our analytics dashboard shows engagement rates, comment performance, user reactions, click-through rates, and sentiment analysis. Pro and Enterprise plans include advanced metrics and custom reporting.",
  },
];