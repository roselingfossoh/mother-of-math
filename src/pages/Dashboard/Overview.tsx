import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInput from "@/components/ChatInput";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Overview = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const isTeacher = profile?.role === "teacher";
  const lessonPlanRef = useRef<HTMLDivElement>(null);
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await sendMessage(message);
      setRecentActivity([message, ...recentActivity.slice(0, 4)]);
      setLessonPlan(response); // Always set lessonPlan to the response
      toast.success("Response generated successfully");
    } catch (error) {
      toast.error("Failed to generate response");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    setIsLoading(true);
    try {
      setRecentActivity([`Uploaded student work: ${file.name}`, ...recentActivity.slice(0, 4)]);
      toast.success("Image uploaded for analysis");
      // The actual upload is handled by the ChatInput component
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // PDF download handler (dynamic import)
  const handleDownloadPDF = async () => {
    if (!lessonPlanRef.current) return;
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    doc.html(lessonPlanRef.current, {
      callback: function (doc) {
        doc.save("lesson-plan.pdf");
      },
      x: 10,
      y: 10,
      width: 180
    });
  };

  // PowerPoint download handler (dynamic import)
  const handleDownloadPPTX = async () => {
    if (!lessonPlanRef.current) return;
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText("Mothers Of Mathematics", { x: 0.5, y: 0.2, fontSize: 24, bold: true, color: "663399" });
    // Extract text content from lessonPlanRef
    const html = lessonPlanRef.current.innerHTML;
    const text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
    const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
    let y = 1;
    lines.forEach(line => {
      slide.addText(line, { x: 0.5, y, fontSize: 16, color: "222222", breakLine: true });
      y += 0.4;
      if (y > 6.5) {
        y = 1;
        pptx.addSlide();
      }
    });
    pptx.writeFile({ fileName: "lesson-plan-mothers-of-mathematics.pptx" });
  };

  // Stats for teachers vs parents
  const stats = isTeacher ? [
    { name: "Lesson Plans", value: "12" },
    { name: "Students", value: "34" },
    { name: "Analyses", value: "28" },
    { name: "This Week", value: "+8" }
  ] : [
    { name: "Uploads", value: "5" },
    { name: "Analyses", value: "5" },
    { name: "Feedback", value: "3" },
    { name: "This Week", value: "+1" }
  ];

  return (
    <div className="space-y-8 md:space-y-12 px-2 md:px-8 py-8 md:py-12 bg-gradient-to-br from-mama-light via-white to-[#e0218a]/10 min-h-screen relative overflow-x-hidden">
      {/* Animated background blobs for vibrance */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-mama-purple/10 rounded-full blur-3xl animate-float-slow z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[#e0218a]/10 rounded-full blur-3xl animate-float-slow2 z-0"></div>
      <motion.div
        initial="hidden"
        animate="visible" 
        variants={fadeIn}
        custom={0}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-mama-purple via-pink-500 to-[#e0218a] bg-clip-text text-transparent drop-shadow-lg">
          Welcome back, Wobyeb!
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {isTeacher 
            ? "Here's what's happening with your students and lesson plans." 
            : "Here's what's happening with your student's progress."
          }
        </p>
      </motion.div>
      <motion.div
        className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
      >
        {stats.map((stat, i) => (
          <Card key={stat.name} className="rounded-2xl shadow-lg border-0 bg-white/90 hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-mama-purple">
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-mama-purple mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isTeacher
                  ? i === 0 ? "Total lesson plans created"
                  : i === 1 ? "Students in your classes"
                  : i === 2 ? "Total student analyses"
                  : "New analyses this week"
                  : i === 0 ? "Total work uploads"
                  : i === 1 ? "Completed analyses"
                  : i === 2 ? "Feedback received"
                  : "New uploads this week"
                }
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      <motion.div
        className="grid gap-8 md:grid-cols-2 relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
      >
        <Card className="col-span-2 md:col-span-1 rounded-2xl shadow-xl border-0 bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-mama-purple">AI Assistant</CardTitle>
            <CardDescription className="text-base text-mama-purple/80">
              {isTeacher
                ? "Generate lesson plans or analyze student work"
                : "Upload student work for analysis"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lessonPlan && (
              <div className="mb-4">
                <div ref={lessonPlanRef} className="p-4 border rounded-xl bg-mama-light/60 mb-2 shadow-inner" dangerouslySetInnerHTML={{ __html: lessonPlan }} />
                <div className="flex flex-col gap-2">
                  <button onClick={handleDownloadPDF} className="bg-mama-purple text-white px-4 py-2 rounded-lg hover:bg-mama-purple/80 transition-colors w-full font-semibold shadow">
                    Download this lesson as PDF
                  </button>
                  <button onClick={handleDownloadPPTX} className="bg-[#e0218a] text-white px-4 py-2 rounded-lg hover:bg-[#c81e6a]/90 transition-colors w-full font-semibold shadow">
                    Download as PowerPoint
                  </button>
                </div>
              </div>
            )}
            <div className="h-[200px] rounded-xl border border-dashed border-mama-purple/30 bg-mama-light/60 flex items-center justify-center p-6 shadow-inner">
              <div className="text-center">
                <p className="mb-2 font-semibold text-mama-purple">Start a conversation with Math Mama</p>
                <p className="text-sm text-muted-foreground">
                  {isTeacher
                    ? "Ask for a lesson plan, student activities, or upload work for analysis"
                    : "Upload your child's work for analysis and feedback"
                  }
                </p>
              </div>
            </div>
            <ChatInput 
              onSendMessage={handleSendMessage} 
              onUploadImage={handleUploadImage} 
              isLoading={isLoading}
            />
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-pulse-gentle flex items-center">
                  <div className="h-2 w-2 bg-mama-purple rounded-full mr-1"></div>
                  <div className="h-2 w-2 bg-mama-purple rounded-full mr-1 animation-delay-200"></div>
                  <div className="h-2 w-2 bg-mama-purple rounded-full animation-delay-500"></div>
                  <span className="ml-2 text-sm text-mama-purple font-semibold">Mothers for Mathematics is thinking...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1 rounded-2xl shadow-xl border-0 bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-mama-purple">Recent Activity</CardTitle>
            <CardDescription className="text-base text-mama-purple/80">Your latest interactions with Math Mama</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-mama-purple/20 p-2 h-8 w-8 flex items-center justify-center shadow">
                      <span className="text-xs font-bold text-mama-purple">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-mama-purple/90">{activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                No recent activity to display
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Overview;
