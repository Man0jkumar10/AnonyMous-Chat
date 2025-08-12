import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Code, Mountain, Linkedin, Github, Mail } from "lucide-react";
import profilepic from "./Images/pic.jpeg";

export default function Chat() {
  const funFacts = [
    { text: "☕ Addicted to coffee and dark mode" },
    { text: "📂 Love Coding and build New Projects " },
    { text: "🌱 Learning something new every week " },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/manojkumarx127/",
      color: "hover:text-blue-600",
    },
    {
      icon: Github,
      href: "https://github.com/Man0jkumar10/",
      color: "hover:text-gray-800 dark:hover:text-gray-300",
    },
    {
      icon: Mail,
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=manojkumarx127@gmail.com",
      color: "hover:text-red-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-secondary">AnonyMous Chat</h1>
              <p className="text-sm text-gray-500">Connect with random strangers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-success/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success">Online</span>
          </div>
          <div>
            <a href="/" className="hover:text-secondary">Home</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-5">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-violet-600 mx-auto" />

        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a dedicated full-stack developer with a strong foundation in Java, JavaScript, SQL, and modern web technologies.
              My journey began with simple curiosity a desire to understand how websites worked and has grown into a deep passion
              for building efficient, user-focused digital solutions.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I believe in vibe coding a focused, efficient way of working where I create in flow, write cleaner code, and
              reduce unnecessary effort. It's not about rushing; it's about being intentional, minimizing clutter, and maximizing output.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I also actively leverage AI tools to boost my productivity whether it’s automating repetitive tasks, debugging faster,
              or generating design ideas. Using AI in my workflow helps me deliver high-quality results quicker without compromising
              creativity or precision.
            </p>

            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Fun Facts</h3>
                <ul className="space-y-2">
                  {funFacts.map((fact, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-muted-foreground"
                    >
                      {fact.text}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative inline-block">
              <img
                src={profilepic}
                alt="Manojkumar - Profile"
                className="w-80 h-80 rounded-full shadow-2xl mx-auto object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-6 space-y-2"
            >
              <p className="text-muted-foreground">Full-stack dev from Namma Bengaluru</p>
              <div className="flex justify-center space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    asChild
                    className={`transition-colors duration-300 ${social.color}`}
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-2">📞 +91 7975810267</p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2025 Manojkumar B G</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-success"></i>
              <span>Messages are not stored</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-primary"></i>
              <span>Real-time communication</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
