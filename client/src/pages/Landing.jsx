import { Link } from "react-router";
import { useContext } from "react";
import {
  Users,
  Heart,
  Search,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Star,
  BookUser,
  BookOpen,
  Network,
  Moon,
  Sun,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useTheme } from "../context/ThemeContext";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <BookUser className="text-blue-500" size={32} />,
      title: "Smart Contact Management",
      description:
        "Organize all your professional and personal contacts in one powerful, searchable space.",
    },
    {
      icon: <Network className="text-blue-500" size={32} />,
      title: "Network Insights",
      description:
        "Track your connections, see recent activity, and understand your growing network at a glance.",
    },
    {
      icon: <Search className="text-blue-500" size={32} />,
      title: "Instant Search",
      description:
        "Find any contact instantly with powerful search across names, phone numbers, and beyond.",
    },
    {
      icon: <Heart className="text-blue-500" size={32} />,
      title: "Favorites & Priority",
      description:
        "Mark important contacts as favorites and keep your most valuable relationships front and center.",
    },
    {
      icon: <ShieldCheck className="text-blue-500" size={32} />,
      title: "Secure & Private",
      description:
        "Your data is protected with JWT authentication and never shared with third parties.",
    },
    {
      icon: <Zap className="text-blue-500" size={32} />,
      title: "Lightning Fast",
      description:
        "Modern React and Node.js architecture ensures a snappy, responsive experience every time.",
    },
  ];

  const stats = [
    { icon: <Users className="text-blue-500" size={24} />, value: "1.2K+", label: "Contacts Synced" },
    { icon: <Network className="text-blue-500" size={24} />, value: "500+", label: "Active Users" },
    { icon: <ShieldCheck className="text-blue-500" size={24} />, value: "100%", label: "Data Protected" },
    { icon: <Globe className="text-blue-500" size={24} />, value: "24/7", label: "Smart Access" },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-blue-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 opacity-10 dark:opacity-5" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star size={16} /> The #1 Contact Management Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
              Organize your world with{" "}
              <span className="text-blue-500 dark:text-blue-400">precision.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The high-performance contact management system for modern
              professionals. Stay connected, stay organized, stay ahead with
              Buddy Book.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 z-1 text-white text-lg font-semibold bg-blue-500 rounded-xl hover:bg-blue-400 hover:scale-[1.02] transition duration-200 shadow-lg shadow-blue-200"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 z-1 text-blue-600 dark:text-blue-300 text-lg font-semibold bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:scale-[1.02] transition duration-200"
              >
                <BookOpen size={20} /> View Demo
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} /> Completely free to use
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500" size={18} /> Paid for customized usage development
              </div>
            </div>
          </div>
          {/* 3D Style Hero Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-30 rounded-full" />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500 dark:shadow-blue-900">
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-1">Welcome back, Alex!</h3>
                  <p className="text-blue-100 text-sm">Your network is growing</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: "Alexander Grahambell", role: "Senior Developer", color: "bg-purple-200 dark:bg-purple-900" },
                  { name: "Marie Curios", role: "Research Lead", color: "bg-pink-200 dark:bg-pink-900" },
                  { name: "Alan Turing", role: "AI Engineer", color: "bg-green-200 dark:bg-green-900" },
                ].map((contact) => (
                  <div key={contact.name} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <div className={`size-11 rounded-full ${contact.color} flex items-center justify-center font-bold text-gray-700 dark:text-gray-200`}>
                      {contact.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{contact.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <h5 className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Contacts</p>
                  </div>
                  <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <h5 className="text-2xl font-bold text-green-600 dark:text-green-400">18</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active This Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="py-10 dark:bg-gray-900 dark:text-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-center gap-4">
              <div className="bg-blue-100 rounded-xl p-3 dark:bg-gray-800 dark:text-blue-300">{stat.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay connected
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed for professionals who value their network and their time.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="bg-blue-50 w-fit rounded-xl p-3 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How Buddy Book Works
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Create your account", desc: "Sign up in seconds, add your profile, and start building your network." },
                  { step: "02", title: "Add your contacts", desc: "Import your contacts with photos, roles, relationships, and all the details that matter." },
                  { step: "03", title: "Stay organized", desc: "Search, filter, and manage your network beautifully with real-time updates." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="text-blue-500 font-bold text-2xl w-14">{item.step}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="bg-blue-50 rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Why choose Buddy Book?</h3>
                <div className="space-y-3">
                  {[
                    "Modern, clean interface",
                    "Powerful instant search",
                    "JWT-secured authentication",
                    "Responsive on every device",
                    "Completely free to use",
                    "Paid for customized usage development",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-gray-700">
                      <ShieldCheck className="text-green-500 shrink-0" size={18} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/login"
                className="flex justify-center items-center gap-2 w-full px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 transition duration-200"
              >
                Start Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Ready to organize your world?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Buddy Book today and take control of your contacts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:scale-[1.02] transition duration-200"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-blue-500/30 text-white border border-white/40 rounded-xl hover:bg-blue-500/50 transition duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
