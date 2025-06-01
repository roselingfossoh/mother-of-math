import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Download, FileText, FileType, Send, Edit, Save, Plus, X, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendMessage } from '@/services/api'; // Import sendMessage
import { exportToPDF, exportToPowerPoint } from '@/services/lessonPlan'; // Import export functions

// Type definitions
interface LessonSection {
  id: string;
  heading: string;
  keyPoints: string;
  isEditing: boolean;
  time: string; // New field for time allocation
  teacherActivities: string; // New field for teacher actions
  learnerActivities: string; // New field for learner actions
}

interface LessonPlan {
  id?: string; // Add optional ID for saved plans
  topic: string;
  sections: LessonSection[];
  generatedContent?: string; // Add generated content to the saved plan structure
}

const defaultSections: LessonSection[] = [
  { 
    id: '1', 
    heading: 'INTRODUCTION', 
    keyPoints: 'Lesson objectives, brief hook to engage students, link to prior knowledge.',
    isEditing: false,
    time: '', // Initialize new fields
    teacherActivities: '',
    learnerActivities: '',
  },
  { 
    id: '2', 
    heading: 'PRESENTATION', 
    keyPoints: 'Step-by-step explanation of the new concept, examples to use, materials needed.',
    isEditing: false,
    time: '',
    teacherActivities: '',
    learnerActivities: '',
  },
  { 
    id: '3', 
    heading: 'EVALUATION', 
    keyPoints: 'Classroom exercises, questions to ask, worksheet activities.',
    isEditing: false,
    time: '',
    teacherActivities: '',
    learnerActivities: '',
  },
  { 
    id: '4', 
    heading: 'STUDENT EXERCISES', 
    keyPoints: 'Practice problems, application exercises, differentiated tasks for various skill levels.',
    isEditing: false,
    time: '',
    teacherActivities: '',
    learnerActivities: '',
  },
  { 
    id: '5', 
    heading: 'CONCLUSION', 
    keyPoints: 'Summary of key takeaways, assignment for homework.',
    isEditing: false,
    time: '',
    teacherActivities: '',
    learnerActivities: '',
  }
];

// Remove or adapt the mock getAIGeneratedContent function as we'll use sendMessage directly
// const getAIGeneratedContent = async (lessonPlan: LessonPlan): Promise<string> => { ... };

const LessonPlanGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Use the toast from the hook
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [topic, setTopic] = useState<string>('');
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    topic: '',
    sections: [...defaultSections],
    generatedContent: ''
  });
  const [sections, setSections] = useState<LessonSection[]>([...defaultSections]);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'generating_part1' | 'waiting_to_continue' | 'generating_part2' | 'ready_to_merge' | 'complete'>('idle');
  const [generatedContentPart1, setGeneratedContentPart1] = useState<string>('');
  const [generatedContentPart2, setGeneratedContentPart2] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [savedLessonPlans, setSavedLessonPlans] = useState<LessonPlan[]>([]);

  // Load saved lesson plans from localStorage on mount
  useEffect(() => {
    const storedPlans = localStorage.getItem('lessonPlans');
    if (storedPlans) {
      setSavedLessonPlans(JSON.parse(storedPlans));
    }
  }, []);

  // Update lessonPlan state (used for saving)
  useEffect(() => {
    setLessonPlan({
      topic,
      sections,
      generatedContent: generatedContent // Use generatedContent for the final save
    });
  }, [topic, sections, generatedContent]); // Depend on generatedContent

  // Generate initial lesson structure using AI based on topic
  const handleTopicSubmit = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for your lesson plan.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast({
        title: 'Generating Lesson Structure',
        description: 'AI is creating a suggested structure based on your topic...',
      });
      
      const structurePrompt = `Create a structured outline for a math lesson on "${topic}" for primary school students in Cameroon. 
      
Provide 5-6 sections with headings and brief key points for each section. 
      
Return ONLY the JSON structure, with absolutely no other text, explanation, or markdown formatting before or after. 
      
Format your response in this exact JSON structure:
      {"sections": [
        {"heading": "INTRODUCTION", "keyPoints": "key points for introduction..."},
        {"heading": "SECOND SECTION TITLE", "keyPoints": "key points for second section..."},
        ... and so on
      ]}
      `;
      
      const response = await sendMessage(structurePrompt);
      
      try {
        const jsonMatch = response.text.match(/\{\s*"sections"\s*:\s*\[.*?\]\s*\}/s);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          
          const aiSections: LessonSection[] = jsonData.sections.map((section: any, index: number) => ({
            id: `ai-${Date.now()}-${index}`,
            heading: section.heading,
            keyPoints: section.keyPoints,
            isEditing: false,
            time: '',
            teacherActivities: '',
            learnerActivities: '',
          }));
          
          setSections(aiSections);
          
          toast({
            title: 'AI Structure Generated',
            description: 'Review and customize the AI-suggested lesson structure below.',
          });
        } else {
          // If JSON structure wasn't found, create default sections with topic-relevant headings
          const defaultSectionsWithTopic: LessonSection[] = [
            { id: `default-${Date.now()}-1`, heading: `Introduction to ${topic}`, keyPoints: `Lesson objectives and engagement for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
            { id: `default-${Date.now()}-2`, heading: `Core Concepts of ${topic}`, keyPoints: `Main principles and definitions for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
            { id: `default-${Date.now()}-3`, heading: `Guided Practice for ${topic}`, keyPoints: `Examples and interactive demonstrations for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
            { id: `default-${Date.now()}-4`, heading: `Independent Practice with ${topic}`, keyPoints: `Student exercises and applications for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
            { id: `default-${Date.now()}-5`, heading: `Assessment and Conclusion for ${topic}`, keyPoints: `Checking understanding and summarizing ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
          ];
          
          setSections(defaultSectionsWithTopic);
          
          toast({
            title: 'Default Structure Created',
            description: 'AI response format was unexpected. Default structure created based on your topic.',
            variant: 'default'
          });
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to default sections with topic
        const defaultSectionsWithTopic: LessonSection[] = [
          { id: `default-${Date.now()}-1`, heading: `Introduction to ${topic}`, keyPoints: `Lesson objectives and engagement for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
          { id: `default-${Date.now()}-2`, heading: `Core Concepts of ${topic}`, keyPoints: `Main principles and definitions for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
          { id: `default-${Date.now()}-3`, heading: `Guided Practice for ${topic}`, keyPoints: `Examples and interactive demonstrations for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
          { id: `default-${Date.now()}-4`, heading: `Independent Practice with ${topic}`, keyPoints: `Student exercises and applications for ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
          { id: `default-${Date.now()}-5`, heading: `Assessment and Conclusion for ${topic}`, keyPoints: `Checking understanding and summarizing ${topic}`, isEditing: false, time: '', teacherActivities: '', learnerActivities: '' },
        ];
        
        setSections(defaultSectionsWithTopic);
        
        toast({
          title: 'Default Structure Created',
          description: 'Could not parse AI response. Default structure created based on your topic.',
          variant: 'default'
        });
      }
    
    setPhase(2);
      
    } catch (error) {
      console.error('Error generating lesson structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate lesson structure. Please try again or check your API key.',
        variant: 'destructive',
      });
      
      setSections(defaultSections);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add a new section
  const addSection = () => {
    const newSection: LessonSection = {
      id: Date.now().toString(),
      heading: 'NEW SECTION',
      keyPoints: 'Add key points here...',
      isEditing: false,
      time: '',
      teacherActivities: '',
      learnerActivities: '',
    };
    
    setSections([...sections, newSection]);
  };

  // Delete a section
  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  // Toggle edit mode for a section
  const toggleEditSection = (id: string) => {
    setSections(sections.map(section => 
        section.id === id 
          ? { ...section, isEditing: !section.isEditing } 
          : section
    ));
  };

  // Update section heading
  const updateSectionHeading = (id: string, heading: string) => {
    setSections(sections.map(section => 
        section.id === id 
          ? { ...section, heading } 
          : section
    ));
  };

  // Update section key points
  const updateSectionKeyPoints = (id: string, keyPoints: string) => {
    setSections(sections.map(section => 
        section.id === id 
          ? { ...section, keyPoints } 
          : section
    ));
  };

  // Update section detail
  const updateSectionDetail = (id: string, field: string, value: string) => {
    setSections(sections.map(section => 
        section.id === id 
          ? { ...section, [field]: value } 
          : section
    ));
  };

  // --- Primary function to generate the *final* detailed lesson plan (Now triggered in Phase 3 -> 4) ---
  const generateLessonPlan = async (step: 'part1' | 'part2') => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic before generating the lesson plan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true); 
    setGenerationStep(step === 'part1' ? 'generating_part1' : 'generating_part2');
    
    let prompt = `Create a comprehensive and highly detailed mathematics lesson plan for the topic: "${topic}" for primary school students in Cameroon.\n\n`;
    prompt += `Use the following information from the teacher's structured outline to generate the detailed plan:\n\n`;
    
    // Include each section with its heading and key points from Phase 2 as context
    sections.forEach(section => {
      prompt += `Section: ${section.heading}\n`; 
      prompt += `Key Points: ${section.keyPoints}\n\n`;
    });

    // Define the fixed headings
    const fixedHeadings = [
      "INTRODUCTION",
      "CONTENT",
      "TEACHER'S ACTIVITIES",
      "PUPIL'S ACTIVITIES",
      "PRESENTATION",
      "EXAMPLES",
      "EVALUATION OR CONCLUSION",
      "Exercise",
      "Assignment"
    ];

    // Adjust prompt based on the generation step
    if (step === 'part1') {
        prompt += `\n\nBased on the topic and the sections provided above, generate the FIRST PART of a complete and highly detailed lesson plan. Structure the content using only the following fixed headings for this part, providing extensive and practical content suitable for direct classroom use, synthesizing information from the provided sections and elaborating significantly:\n\n`;
        
        // Include only the first half of the headings for part 1 (adjust split point as needed)
        const part1Headings = fixedHeadings.slice(0, Math.ceil(fixedHeadings.length / 2));

        part1Headings.forEach(heading => {
            prompt += `${heading}:\n\n`; // Use plain text heading with colon
            prompt += `[Generate highly detailed and practical content for the ${heading} section, incorporating information from the Phase 2 outline sections and elaborating significantly. Ensure the content is suitable for primary school students in Cameroon.]\n\n`;
        });

        prompt += `\n\nAfter completing the content for these sections, end your response. Do NOT include any other sections or concluding remarks.`;

    } else if (step === 'part2') {
        // Provide previously generated content as context for continuation
        prompt += `\n\nHere is the first part of the lesson plan that was previously generated:\n\n---\n${generatedContentPart1}\n---\n\n`;
        prompt += `Based on the original topic, the provided outline sections, and the first part above, generate the SECOND PART of the lesson plan. Continue the lesson plan from where the first part ended and structure the content using only the following remaining fixed headings, providing extensive and practical content suitable for direct classroom use, synthesizing information from the provided sections and elaborating significantly:\n\n`;
        
        // Include the second half of the headings for part 2
        const part2Headings = fixedHeadings.slice(Math.ceil(fixedHeadings.length / 2));

        part2Headings.forEach(heading => {
            prompt += `${heading}:\n\n`; // Use plain text heading with colon
            prompt += `[Generate highly detailed and practical content for the ${heading} section, incorporating information from the Phase 2 outline sections and elaborating significantly. Ensure the content is suitable for primary school students in Cameroon.]\n\n`;
        });

        prompt += `\n\nAfter completing the content for these remaining sections, provide a brief concluding sentence for the overall lesson plan if appropriate, and then end your response.`;
    }

    prompt += `Ensure the overall content is highly relevant for primary school students in Cameroon, incorporating local examples and cultural context wherever possible. Make the language exceptionally clear, practical, and immediately usable by a teacher in a classroom setting. Aim for a level of detail that provides a complete script or guide for teaching each section.\n\n`;
    prompt += `Start the overall lesson plan with 3-5 specific Learning Objectives (include these before the first fixed heading).\n\n`;
    prompt += `Format the entire response using plain text only. Use line breaks and capitalization for structure, and the specified fixed headings followed by a colon. Do NOT use markdown syntax like #, ##, *, -, or ** anywhere in the generated lesson plan content.`;

    try {
      toast({
        title: step === 'part1' ? "Generating Part 1..." : "Generating Part 2...",
        description: `AI is crafting ${step === 'part1' ? 'the first part' : 'the second part'} of your detailed lesson for "${topic}". This may take a moment.`,
      });

      const response = await sendMessage(prompt);

      // Update states with the generated content based on the step
      if (step === 'part1') {
        setGeneratedContentPart1(response.text);
        setGenerationStep('waiting_to_continue');
      } else if (step === 'part2') {
        setGeneratedContentPart2(response.text);
        // Move to ready to merge state instead of combining automatically
        setGenerationStep('ready_to_merge');
      }
      
      toast({
        title: step === 'part1' ? "Part 1 Generated!" : "Part 2 Generated!",
        description: step === 'part1' ? "Review the first part and continue generation." : "Part 2 of the lesson plan is ready. Click 'Merge' to combine.",
        variant: "default", 
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the lesson plan. Please check your API key or try again later.",
        variant: "destructive",
      });
      setGenerationStep('idle'); // Reset on error
    } finally {
      setIsGenerating(false); 
    }
  };

  // Function to save the current lesson plan
  const saveLessonPlan = () => {
    if (!editedContent.trim()) {
      toast({
        title: "Cannot Save",
        description: "The lesson plan content is empty.",
        variant: "destructive"
      });
      return;
    }

    const newLessonPlan: LessonPlan = {
      id: Date.now().toString(),
      topic,
      sections,
      generatedContent: editedContent,
    };

    // Add the new plan to the array and save to localStorage
    const updatedPlans = [...savedLessonPlans, newLessonPlan];
    setSavedLessonPlans(updatedPlans);
    localStorage.setItem('lessonPlans', JSON.stringify(updatedPlans));

    toast({
      title: "Lesson Plan Saved",
      description: `'${topic}' has been saved.`,
    });

    // Optionally navigate to the lessons page
    navigate('/lessons');
  };

  // Handle exporting as PDF
  const handleExportPDF = async () => {
    try {
      // Show loading toast
    toast({
      title: "Exporting as PDF",
        description: "Your lesson plan is being prepared for download...",
      });
      
      // Use the actual export function
      await exportToPDF(editedContent, topic);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Your lesson plan has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your lesson plan to PDF.",
        variant: "destructive",
      });
    }
  };

  // Handle exporting as PowerPoint
  const handleExportPowerPoint = async () => {
    try {
      // Show loading toast
    toast({
      title: "Exporting as PowerPoint",
        description: "Your lesson plan is being prepared for download...",
      });
      
      // Use the actual export function
      await exportToPowerPoint(editedContent, topic);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Your lesson plan has been downloaded as PowerPoint.",
      });
    } catch (error) {
      console.error('Error exporting to PowerPoint:', error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your lesson plan to PowerPoint.",
        variant: "destructive",
      });
    }
  };

  // Function to move to the next phase
  const moveToNextPhase = () => {
    setPhase(prevPhase => {
      if (prevPhase === 2) {
        return 3; // Move from Structure (Phase 2) to Review (Phase 3)
      } else if (prevPhase === 3) {
        // When moving from Review (Phase 3) to Generation (Phase 4)
        // We now start the first part of generation here
        generateLessonPlan('part1'); 
        return 4; // Move to Generation/Display (Phase 4)
      }
       else if (prevPhase === 4) {
         // Currently no further phase after 4, could loop back to 1 or reset
         return 1; // Example: loop back to start
       }
      return prevPhase; // Stay on current phase if no transition defined
    });
  };

  // Function to go back to the previous phase
  const goBack = () => {
    setPhase(prevPhase => {
      // If going back from Phase 4, clear generated content parts and reset step
      if (prevPhase === 4) {
        setGeneratedContent('');
        setEditedContent('');
        setGeneratedContentPart1('');
        setGeneratedContentPart2('');
        setGenerationStep('idle');
      }
      return Math.max(1, prevPhase - 1) as 1 | 2 | 3 | 4;
    });
  };

  // Handler for the "Continue Generation" button
  const handleContinueGeneration = () => {
     generateLessonPlan('part2');
  };

  // Handler for the "Merge Generations" button
  const handleMergeGenerations = () => {
     const combinedContent = generatedContentPart1 + '\n\n' + generatedContentPart2;
     setGeneratedContent(combinedContent); // Set final generated content state
     setEditedContent(combinedContent); // Set initial editable content
     setGenerationStep('complete');
      toast({
        title: "Lesson Plan Merged!",
        description: "The two parts have been combined. Review and edit below.",
        variant: "default", 
      });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Phase 1: Welcome Screen */}
      {phase === 1 && (
        <Card className="w-full max-w-3xl mx-auto mt-10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Mama Math Lesson Plan Generator</CardTitle>
            <CardDescription className="text-xl mt-2">
              I'm Mama Math, your lesson plan generator assistant. Tell me what you want to teach and I'll help you create your lesson.
            </CardDescription>
          </CardHeader>

          {/* Suggested Questions Section (Card UI) */}
          <Card className="mt-4 mx-6 bg-primary/5 border border-border shadow-sm mb-6">
            <CardHeader className="pb-2 flex items-center">
               <Lightbulb className="h-5 w-5 text-primary mr-2" />
               <CardTitle className="text-lg font-semibold text-foreground m-0">Examples:</CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                <li>"Introduction to adding and subtracting fractions for Primary 4"</li>
                <li>"Teaching multiplication tables for Primary 2 using games"</li>
                <li>"Exploring geometric shapes and their properties for Primary 5"</li>
                <li>"Solving word problems involving percentages for Primary 6"</li>
                <li>"Understanding place value up to thousands for Primary 3"</li>
              </ul>
            </CardContent>
          </Card>

          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-xl">
                <Input
                  placeholder="What do you want to teach today? (e.g., 'Introduction to fractions for Primary 3')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-lg p-6"
                  onKeyDown={(e) => e.key === 'Enter' && handleTopicSubmit()}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleTopicSubmit}
                className="mt-4 px-8"
              >
                Start <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>

          </CardContent>
        </Card>
      )}

      {/* Phase 2: Lesson Scaffolding Screen (Structure Definition) */}
      {phase === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Canvas) - Takes 2/3 of the space */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Lesson Plan Structure</h2>
            <p className="text-muted-foreground mb-4">
              Customize the sections below to structure your lesson plan. Edit headings and key points, add or remove sections as needed.
            </p>

            <div className="space-y-4">
              {sections.map((section) => (
                <Card key={section.id} className="relative">
                  <CardContent className="pt-6">
                    {section.isEditing ? (
                      <div className="space-y-4">
                        <Input
                          value={section.heading}
                          onChange={(e) => updateSectionHeading(section.id, e.target.value)}
                          className="font-bold"
                        />
                        <Textarea
                          value={section.keyPoints}
                          onChange={(e) => updateSectionKeyPoints(section.id, e.target.value)}
                          rows={3}
                        />

                        <Button onClick={() => toggleEditSection(section.id)}>
                          <Save className="h-4 w-4 mr-2" /> Save
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">{section.heading}</h3>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => toggleEditSection(section.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{section.keyPoints}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex space-x-4 mt-6">
              <Button variant="outline" onClick={addSection}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Section
              </Button>
              {/* Button to move to the next phase (Review Structure) */}
              <Button onClick={moveToNextPhase} disabled={sections.length === 0}>
                Review Structure <Send className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
            </div>
          </div>

          {/* Right Column - Takes 1/3 of the space */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Your Topic</h2>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <p className="text-xl">{topic}</p>
              </CardContent>
            </Card>
            
            <h3 className="text-xl font-semibold mt-8">Tips:</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Be specific in your key points to get better AI-generated content</li>
              <li>Add custom sections for specialized lesson components</li>
              <li>Consider your audience's age and knowledge level</li>
              <li>Include hands-on activities for better engagement</li>
            </ul>
          </div>
        </div>
      )}

      {/* Phase 3: Structure Review and Finalize (New Phase) */}
      {phase === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Review Lesson Plan Structure</h2>
          <p className="text-muted-foreground">Review the structure you've defined before generating the detailed lesson plan. Go back to make changes if needed.</p>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Lesson Plan Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-xl font-semibold">{section.heading}</h3>
                    <p className="text-muted-foreground">{section.keyPoints}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
            {/* Button to trigger final generation and move to Phase 4 */}
            <Button onClick={moveToNextPhase} disabled={isGenerating}>
               {isGenerating ? (
                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
               ) : (
                 <Send className="h-4 w-4 mr-2" />
               )}
              {isGenerating ? "Generating..." : "Generate Detailed Lesson Plan"}
            </Button>
          </div>
        </div>
      )}

      {/* Phase 4: Final AI Generation, Display, and Editing */}
      {phase === 4 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Detailed Lesson Plan</h2>
            <div className="flex space-x-2">
              {/* Save Button - only enabled when generation is complete */}
              <Button onClick={saveLessonPlan} variant="outline" disabled={generationStep !== 'complete'}>
                <Save className="h-4 w-4 mr-2" /> Save Lesson Plan
              </Button>
              {/* Export Buttons - only enabled when generation is complete */}
              <Button onClick={handleExportPDF} variant="outline" disabled={generationStep !== 'complete'}>
                <FileText className="h-4 w-4 mr-2" /> Download as PDF
              </Button>
              <Button onClick={handleExportPowerPoint} disabled={generationStep !== 'complete'}>
                <FileType className="h-4 w-4 mr-2" /> Download as PowerPoint
              </Button>
            </div>
          </div>
          
          {/* Display content or loading based on generation step */}
          {generationStep === 'generating_part1' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-xl">Generating the first part of your detailed lesson plan...</p>
            </div>
          )}

          {generationStep === 'waiting_to_continue' && (
            <div className="space-y-6">
          <Card className="mb-6">
                 <CardHeader>
                   <CardTitle>First Part Generated</CardTitle>
                 </CardHeader>
            <CardContent className="pt-6">
                   {/* Display the first generated part */} 
                   <div style={{ whiteSpace: 'pre-wrap', minHeight: '30vh' }}>
                     {generatedContentPart1}
              </div>
            </CardContent>
          </Card>
               <div className="flex justify-center">
                 <Button onClick={handleContinueGeneration} disabled={isGenerating}>
                   {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   ) : (
                      <Send className="h-4 w-4 mr-2" />
                   )}
                   Continue Generation
                 </Button>
               </div>
            </div>
          )}

          {generationStep === 'generating_part2' && (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary">
               <Loader2 className="h-12 w-12 animate-spin mb-4" />
               <p className="text-xl">Generating the second part of your detailed lesson plan...</p>
             </div>
          )}

          {/* New state to prompt user to merge */}
          {generationStep === 'ready_to_merge' && (
             <div className="space-y-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Generation Complete</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-xl mb-4">Both parts of the lesson plan have been generated.</p>
                    <p className="text-muted-foreground">Click the button below to merge them into a single document for review and editing.</p>
                  </CardContent>
                </Card>
               <div className="flex justify-center">
                 <Button onClick={handleMergeGenerations}>
                   Merge Lesson Plan
                 </Button>
               </div>
            </div>
          )}

          {generationStep === 'complete' && (
             <Card className="mb-6">
               <CardHeader>
                 <CardTitle>Complete Lesson Plan</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                 {/* Display and allow editing of the combined final content */} 
                 <Textarea
                   ref={textareaRef}
                   value={editedContent} // Use editedContent for display/editing
                   onChange={(e) => setEditedContent(e.target.value)}
                   className="min-h-[60vh] font-mono"
                   rows={20}
                 />
               </CardContent>
             </Card>
          )}
          
          {/* Back button in Phase 4 - visible unless generating */}
           {!isGenerating && (
             <div className="flex justify-start mt-6">
               <Button variant="outline" onClick={goBack}>
                 Back
               </Button>
             </div>
           )}

          {/* Next Steps section - visible only when complete */}
          {generationStep === 'complete' && (
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
            <p className="mb-4">Your lesson plan is ready to use! You can:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Download as PDF to print or share with colleagues</li>
              <li>Export as PowerPoint for classroom presentation</li>
              <li>Create another lesson plan for a different topic</li>
            </ul>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonPlanGenerator;