import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MessageSquare, Users, Shield, Globe, Bell } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Group Chats",
      description:
        "Create or join groups to chat with multiple people at once.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Global Chat",
      description: "Join the global conversation and meet new people.",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: "Private Groups",
      description:
        "Create private groups with controlled access for your conversations.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Real-time Notifications",
      description: "Get instant notifications for new messages and mentions.",
      icon: <Bell className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold">ChatApp</h1>
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="outline" asChild>
            <Link href="#features">Features</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Connect with people in real-time
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl">
          A modern chat application with group conversations, private messaging,
          and real-time notifications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/login">Get Started for Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
