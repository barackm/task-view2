import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Smart Task Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Intelligently assign and manage tasks with AI-powered team matching
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tasks"
              className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "AI-Powered Matching",
              description:
                "Automatically match tasks with the most qualified team members",
              icon: "🤖",
            },
            {
              title: "Smart Prioritization",
              description:
                "Organize tasks based on priority and team&apos;s capacity",
              icon: "📊",
            },
            {
              title: "Team Management",
              description: "Efficiently manage your team's workload and skills",
              icon: "👥",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-indigo-50 dark:bg-gray-700/50 rounded-3xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to transform your task management?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start organizing your team&apos;s work more efficiently today.
          </p>
          <Link
            href="/tasks"
            className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
          >
            View Tasks Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
