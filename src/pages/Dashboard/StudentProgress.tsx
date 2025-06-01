import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Star, Clock } from "lucide-react";

const StudentProgress = () => {
  const { profile } = useAuth();
  
  // Mock progress data
  const progressData = {
    overallProgress: 68,
    recentTopics: [
      { name: "Addition", progress: 95, status: "mastered" },
      { name: "Subtraction", progress: 85, status: "mastered" },
      { name: "Multiplication", progress: 72, status: "learning" },
      { name: "Division", progress: 45, status: "learning" },
      { name: "Fractions", progress: 30, status: "started" }
    ],
    achievements: [
      { name: "Addition Master", date: "May 15, 2025", icon: <Award className="h-5 w-5" /> },
      { name: "Quick Solver", date: "April 28, 2025", icon: <Clock className="h-5 w-5" /> }
    ],
    suggestedPractice: [
      "Multiplication Tables (1-12)",
      "Long Division Problems",
      "Fraction to Decimal Conversions"
    ]
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Progress</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress Card */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Mathematics Progress</CardTitle>
            <CardDescription>
              Your journey in learning mathematics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {progressData.overallProgress}%</span>
                <span className="text-muted-foreground">Primary {profile?.grade_level || "5"}</span>
              </div>
              <Progress value={progressData.overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Topics Progress */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Topics Progress</CardTitle>
            <CardDescription>
              Your progress in different mathematics topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.recentTopics.map((topic, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{topic.name}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{topic.progress}%</span>
                      <Badge variant={
                        topic.status === "mastered" ? "default" :
                        topic.status === "learning" ? "secondary" : "outline"
                      }>
                        {topic.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Suggested Practice */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>
              Your learning milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-md">
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardHeader className="pb-2 border-t pt-4">
            <CardTitle className="text-lg">Suggested Practice</CardTitle>
            <CardDescription>
              Topics to focus on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-sm">
              {progressData.suggestedPractice.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgress;
