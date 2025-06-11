import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotherSolvingMath3D from "@/components/MotherSolvingMath3D";

const exampleUser = {
  full_name: "Wobyeb Graphlain",
  email: "wobyeb@ebsaeafrica.org",
  role: "teacher"
};

const Home = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5 }
    })
  };

  const features = [
    {
      title: "AI-Generated Lesson Plans",
      description: "Create structured lesson plans aligned with the Cameroon primary math curriculum",
      icon: "✏️"
    },
    {
      title: "Student Work Analysis",
      description: "Upload photos of student work for AI analysis and feedback",
      icon: "📝"
    },
    {
      title: "Math Error Analysis",
      description: "Identify specific errors and get practical remediation strategies",
      icon: "🔍"
    },
    {
      title: "Performance Tracking",
      description: "Weekly summaries to track student progress and identify trends",
      icon: "📊"
    }
  ];

  const testimonials = [
    {
      quote: "Math Mama Mentor has transformed how I teach mathematics - the AI-generated lesson plans save me hours of preparation time.",
      author: "Mrs. Nkeng, Primary School Teacher"
    },
    {
      quote: "As a parent, I can now understand my child's math difficulties and help them improve with the suggested remediation activities.",
      author: "Mama Josephine, Parent"
    }
  ];

  const handleGetStarted = () => {
    navigate("/sign-up"); // Redirect to signup page
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#DFF4FF]">
      <Header />
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col md:flex-row items-center justify-between p-4 md:p-12 overflow-hidden bg-[#DFF4FF] py-16 px-6 animate-fade-in">


                                                                                                                             
        {/*  SVG images */}  

        {/* <img
  src="/clouds.svg"
  alt=""
  aria-hidden="true"
  className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-auto opacity-80"
/> */}

        <img
  src="/numbers.svg"
  alt=""
  aria-hidden="true"
  className="absolute -top-4 -left 2 w-[160px] h-auto z-0 opacity-100 animate-float-slow"
/>

<img
  src="/apple.svg"
  alt=""
  aria-hidden="true"
  className="absolute -bottom-0  -right-12 w-[200px] h-auto z-0 opacity-100 animate-float-slow2"
/>

        <motion.div 
          className="md:w-1/2 z-10 mb-8 md:mb-0"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
        >
<h1 className="text-4xl md:text-6xl font-extrabold mb-4  text-mama-fern drop-shadow-lg">
  <span className="font-extrabold">Mothers for Mathematics</span>
</h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-xl animate-fade-in-up">
            Empowering teachers and parents in Cameroon with AI-assisted mathematics education.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-mama-mustard text-black hover:bg-mama-mustard/90 shadow-lg transition-transform duration-200 hover:scale-105 animate-bounce-in" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </motion.div>
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
        >
          <div className="relative w-full max-w-md animate-fade-in">
            <div className="absolute -inset-0.5 rounded-lg "></div>
            <div className="relative bg-white p-6 rounded-lg shadow-2xl border-2 border-primary/10">
              <div className="w-full h-56 flex items-center justify-center mb-4">
                <MotherSolvingMath3D />
              </div>
              <div className="bg-background p-4 rounded border border-primary/20 animate-fade-in-up">
                <h3 className="font-semibold mb-2 text-primary">Try asking:</h3>
                <ul className="text-sm space-y-2">
                  <li className="italic cursor-pointer hover:text-primary transition-colors" onClick={() => handleGetStarted()}>"Give me a lesson on Sets and Logic for Class 1"</li>
                  <li className="italic cursor-pointer hover:text-primary transition-colors" onClick={() => handleGetStarted()}>"Create a math exercise about counting to 20"</li>
                  <li className="italic cursor-pointer hover:text-primary transition-colors" onClick={() => handleGetStarted()}>"Upload a photo of student work for analysis"</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-mama-mustard/10 rounded-full blur-3xl animate-fade-in"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FFD95D]/10 rounded-full blur-3xl animate-fade-in"></div>
      </section>
      
      {/* Features Section */}
      <section className="w-full pb-0 py-10 px-4 bg-gradient-to-r from-mama-mustard/5 via-white to-[#FFD95D]/5 relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-mama-fern drop-shadow-lg"

            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
          >
            How Math Mama Mentor Works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7, type: 'spring' }}
              >
                <div className="flex items-center justify-center mb-6">
                  <span className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-125">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-[#FFD95D] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {feature.description}
                </p>
                {/* Animated gradient border effect */}
                <span className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-primary/40 group-hover:animate-pulse-gradient"></span>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Animated background blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-mama-mustard/10 rounded-full blur-3xl animate-float-slow z-0"></div>
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[#FFD95D]/10 rounded-full blur-3xl animate-float-slow2 z-0"></div>
      
            {/* Centered Child SVG */}
<div className="w-full flex justify-center mt-12 mb-0">
  <img
    src="/child.svg"
    alt="Child illustration"
    className="w-48 h-auto opacity-100"
  />
</div>

      </section>


      
      {/* Testimonials */}
      <section className="py-16 px-4 bg-[#AEDFF7]">
        <div className="max-w-6xl mx-auto bg-[#F8F8F8FF] rounded-3xl p-6 md:p-12 shadow-lg">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-mama-fern"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
          >
            What Our Users Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={index * 0.2 + 0.5}
              >
                <p className="text-lg italic mb-6">{testimonial.quote}</p>
                <p className="font-semibold text-primary">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="pt-4 pb-16 px-4 bg-gradient-to-b from-[#AEDFF7] via-[#DFF4FF] to-[#FFFBEA] text-dark">
  <div className="w-full flex justify-center mt-0 mb-6">
    <img
    src="/bee.svg"
    alt="bee illustration"
    className="w-48 h-auto opacity-100"
  />
  </div>
        <div className="max-w-4xl mx-auto text-mama-fern text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
          >
            Ready to Transform Mathematics Education?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 text-mama-dark opacity-90"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.2}
          >
            Join teachers and parents across Cameroon in using AI to enhance mathematics learning
          </motion.p>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.4}
          >
            <Button size="lg" className="bg-mama-mustard text-black hover:bg-mama-mustard/90" onClick={handleGetStarted}>
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
