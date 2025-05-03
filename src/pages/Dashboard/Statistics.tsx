import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Statistics = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === "teacher";
  const [selectedDateRange, setSelectedDateRange] = useState("week");

  // Sample data - this would be replaced with real data from backend
  const errorTypeData = [
    { name: "Counting Errors", value: 12 },
    { name: "Place Value", value: 8 },
    { name: "Addition", value: 15 },
    { name: "Subtraction", value: 10 },
    { name: "Mixed Grouping", value: 6 },
  ];

  const progressData = [
    { date: "Week 1", errors: 20, corrections: 5 },
    { date: "Week 2", errors: 18, corrections: 8 },
    { date: "Week 3", errors: 15, corrections: 10 },
    { date: "Week 4", errors: 12, corrections: 14 },
    { date: "Week 5", errors: 8, corrections: 15 },
    { date: "Week 6", errors: 5, corrections: 18 },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="space-y-10 px-2 md:px-8 py-8 md:py-12 bg-gradient-to-br from-mama-light via-white to-[#e0218a]/10 min-h-screen relative overflow-x-hidden">
      {/* Animated background blobs for vibrance */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-mama-purple/10 rounded-full blur-3xl animate-float-slow z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[#e0218a]/10 rounded-full blur-3xl animate-float-slow2 z-0"></div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-mama-purple via-pink-500 to-[#e0218a] bg-clip-text text-transparent drop-shadow-lg">
          Statistics
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {isTeacher 
            ? "Track your students' progress and identify common error patterns." 
            : "Track your child's progress and understanding over time."
          }
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={1}
        className="relative z-10"
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex w-full md:w-auto justify-center gap-2 rounded-xl bg-mama-light/60 p-2 shadow">
            <TabsTrigger value="overview" className="rounded-lg px-4 py-2 font-semibold text-mama-purple data-[state=active]:bg-mama-purple data-[state=active]:text-white transition-colors">Overview</TabsTrigger>
            <TabsTrigger value="errors" className="rounded-lg px-4 py-2 font-semibold text-mama-purple data-[state=active]:bg-mama-purple data-[state=active]:text-white transition-colors">Error Analysis</TabsTrigger>
            <TabsTrigger value="progress" className="rounded-lg px-4 py-2 font-semibold text-mama-purple data-[state=active]:bg-mama-purple data-[state=active]:text-white transition-colors">Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-2xl shadow-lg border-0 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-mama-purple">Student Performance Summary</CardTitle>
                  <CardDescription className="text-base text-mama-purple/80">
                    Overall progress in the last {selectedDateRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{
                    errors: { color: "#f43f5e" },
                    corrections: { color: "#8b5cf6" }
                  }}>
                    <LineChart data={progressData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="errors" stroke="#f43f5e" activeDot={{ r: 8 }} strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="corrections" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg border-0 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-mama-purple">Common Error Types</CardTitle>
                  <CardDescription className="text-base text-mama-purple/80">
                    Distribution of mathematical errors
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ value: { color: "#8b5cf6" } }}>
                    <BarChart data={errorTypeData} margin={{ top: 20, right: 10, left: 10, bottom: 30 }}>
                      <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="rounded-2xl shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-mama-purple">Recent Analysis Summary</CardTitle>
                <CardDescription className="text-base text-mama-purple/80">
                  Latest insights from student work analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-xl p-4 bg-mama-light/40">
                    <h3 className="font-semibold mb-2 text-mama-purple">Key Observations:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-mama-dark/90">
                      <li>Most common error: Counting problems (42% of cases)</li>
                      <li>Significant improvement in addition/subtraction since last month</li>
                      <li>Place value understanding needs additional focus</li>
                      <li>Group activities show better engagement than individual work</li>
                    </ul>
                  </div>
                  <div className="border rounded-xl p-4 bg-mama-light/40">
                    <h3 className="font-semibold mb-2 text-mama-purple">Suggested Actions:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-mama-dark/90">
                      <li>Focus on place value activities using local materials</li>
                      <li>Continue group-based remediation for counting exercises</li>
                      <li>Introduce more visual aids for number recognition</li>
                      <li>Follow up with parents on home practice routines</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="errors" className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-mama-purple">Error Type Analysis</CardTitle>
                <CardDescription className="text-base text-mama-purple/80">
                  Detailed breakdown of mathematical error patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {errorTypeData.map((type, index) => (
                      <div key={index} className="border rounded-xl p-4 bg-mama-light/40 shadow-inner">
                        <div className="font-semibold text-mama-purple mb-1">{type.name}</div>
                        <div className="text-2xl font-bold text-mama-purple">{type.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {type.value > 10 ? "Needs attention" : "On track"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4 text-mama-purple">Error Samples:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border rounded-xl overflow-hidden bg-white/90 shadow">
                        <div className="bg-mama-purple/10 p-3 border-b">
                          <h4 className="font-semibold text-mama-purple">Counting Error Example</h4>
                        </div>
                        <div className="p-4">
                          <p className="text-sm mb-3">Student skipped numbers when counting objects:</p>
                          <div className="bg-mama-light/50 p-3 rounded text-sm">
                            <p>Original: 1, 2, 3, 5, 6, 8, 9</p>
                            <p>Expected: 1, 2, 3, 4, 5, 6, 7, 8, 9</p>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-mama-purple">Remediation:</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Practice one-to-one correspondence using physical objects from the local environment like stones or bottle caps.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded-xl overflow-hidden bg-white/90 shadow">
                        <div className="bg-mama-purple/10 p-3 border-b">
                          <h4 className="font-semibold text-mama-purple">Place Value Error Example</h4>
                        </div>
                        <div className="p-4">
                          <p className="text-sm mb-3">Student confused tens and ones places:</p>
                          <div className="bg-mama-light/50 p-3 rounded text-sm">
                            <p>Problem: 45 + 32</p>
                            <p>Student answer: 716</p>
                            <p>Expected: 77</p>
                          </div>
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-mama-purple">Remediation:</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Use place value charts and bundling sticks to visually represent tens and ones during addition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="progress" className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-mama-purple">Learning Progress</CardTitle>
                <CardDescription className="text-base text-mama-purple/80">
                  Track improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pb-12">
                <ChartContainer config={{
                  errors: { color: "#f43f5e" },
                  corrections: { color: "#8b5cf6" }
                }}>
                  <LineChart data={progressData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#f43f5e" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="corrections" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-mama-purple">Progress Highlights</CardTitle>
                <CardDescription className="text-base text-mama-purple/80">
                  Key improvements and areas to focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-xl bg-green-50 border-green-200">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Most Improved Area</h3>
                      <p className="text-green-700 text-sm">Addition skills improved by 45% over 6 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded-xl bg-amber-50 border-amber-200">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800">Focus Area Needed</h3>
                      <p className="text-amber-700 text-sm">Place value understanding still showing challenges</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-xl p-4 bg-mama-light/40">
                      <h3 className="font-semibold mb-2 text-mama-purple">Teacher Recommendations</h3>
                      <ul className="text-sm space-y-2 text-mama-dark/90">
                        <li>• Continue with daily counting practice</li>
                        <li>• Use manipulatives for place value concepts</li>
                        <li>• Introduce problem-solving with real-life scenarios</li>
                        <li>• Practice number bonds to strengthen addition</li>
                      </ul>
                    </div>
                    <div className="border rounded-xl p-4 bg-mama-light/40">
                      <h3 className="font-semibold mb-2 text-mama-purple">Parent Support Activities</h3>
                      <ul className="text-sm space-y-2 text-mama-dark/90">
                        <li>• Count objects during daily activities</li>
                        <li>• Practice grouping household items by tens</li>
                        <li>• Play market games with addition/subtraction</li>
                        <li>• Review homework daily for 15 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Statistics;
