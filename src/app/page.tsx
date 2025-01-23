import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32'>
        {/* Hero Section */}
        <div className='text-center space-y-8 mb-24'>
          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <span className='px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 mb-4'>
                Intelligent Task Management Platform
              </span>
            </div>
            <h1 className='text-5xl sm:text-7xl font-bold tracking-tight text-primary'>
              Smart Task <span className='text-foreground'>Management</span>
            </h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
              Intelligently assign and manage tasks with AI-powered team matching, designed for modern teams
            </p>
          </div>
          <div className='flex justify-center gap-4 pt-4'>
            <Link
              href='/tasks'
              className='inline-flex items-center px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
            >
              Get Started <span className='ml-2'>→</span>
            </Link>
            <Link
              href='/demo'
              className='inline-flex items-center px-8 py-4 rounded-lg bg-secondary/10 text-foreground hover:bg-secondary/20 font-medium transition-all border border-border'
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-24'>
          {[
            {
              title: "AI-Powered Matching",
              description:
                "Automatically match tasks with the most qualified team members based on skills and availability",
              icon: "🤖",
            },
            {
              title: "Smart Prioritization",
              description: "Organize tasks based on priority and team's capacity with intelligent workload balancing",
              icon: "📊",
            },
            {
              title: "Team Management",
              description: "Efficiently manage your team's workload and skills with real-time performance insights",
              icon: "👥",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className='group p-8 rounded-xl bg-card text-card-foreground hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20 hover:bg-card/50'
            >
              <div className='text-4xl mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors'>
                {feature.icon}
              </div>
              <h3 className='text-xl font-semibold mb-3 text-foreground'>{feature.title}</h3>
              <p className='text-muted-foreground leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className='relative overflow-hidden'>
          <div className='text-center bg-gradient-to-b from-secondary/10 to-background rounded-2xl p-12 sm:p-16 border border-border shadow-2xl'>
            <div className='relative z-10 space-y-4'>
              <h2 className='text-3xl sm:text-4xl font-bold mb-4 text-foreground'>
                Ready to transform your task management?
              </h2>
              <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
                Start organizing your team&apos;s work more efficiently today with our AI-powered platform.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <Link
                  href='/tasks'
                  className='inline-flex items-center px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                >
                  View Tasks Dashboard
                </Link>
                <Link
                  href='/contact'
                  className='inline-flex items-center px-8 py-4 rounded-lg bg-card hover:bg-card/80 text-foreground font-medium transition-all border border-border'
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
