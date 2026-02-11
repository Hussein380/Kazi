import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { sampleWorkers, sampleEmployer } from '@/lib/sampleData';
import heroImage from '@/assets/hero-workers.jpg';
import { CheckCircle2, Shield, ArrowRight, UserSquare2, Briefcase } from 'lucide-react';

export default function Landing() {
  const { setUserRole, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'worker') {
      setCurrentUser(sampleWorkers[0]);
      navigate('/profile');
    } else {
      setCurrentUser(sampleEmployer);
      navigate('/workers');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="container relative z-10 mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live on Stellar Blockchain
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto animate-fade-up animation-delay-100">
            Reliable help for your <span className="text-primary">home & family</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Connect with verified nannies, cleaners, and caregivers. Secure, transparent, and built on trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all" onClick={() => handleRoleSelect('employer')}>
              Find a Worker
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => handleRoleSelect('worker')}>
              Looking for Job?
            </Button>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[100px]" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted/50 py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Identity</h3>
              <p className="text-muted-foreground">Every worker is background checked and verified.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proven Track Record</h3>
              <p className="text-muted-foreground">Work history immutably recorded on blockchain.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <UserSquare2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Profiles</h3>
              <p className="text-muted-foreground">Detailed CVs with skills, badges, and references.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Detailed */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose your path</h2>
            <p className="text-muted-foreground text-lg">Join our community as an employer or a professional.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Employer Card */}
            <div
              className="group relative cursor-pointer overflow-hidden rounded-3xl border bg-background p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
              onClick={() => handleRoleSelect('employer')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <UserSquare2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">I want to Hire</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Find reliable help for your home. Browse verified profiles, view work history, and hire with confidence.
                </p>
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Worker Card */}
            <div
              className="group relative cursor-pointer overflow-hidden rounded-3xl border bg-background p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
              onClick={() => handleRoleSelect('worker')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent-foreground flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">I want to Work</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Build your professional verified CV. Earn badges, collect references, and find better opportunities.
                </p>
                <div className="flex items-center text-accent-foreground font-semibold group-hover:gap-2 transition-all">
                  Create Profile <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
