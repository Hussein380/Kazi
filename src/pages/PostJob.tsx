import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WORK_TYPE_CONFIG, LOCATIONS } from '@/lib/constants';
import { WorkType } from '@/types';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Home,
  CheckCircle
} from 'lucide-react';

export default function PostJob() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    workType: '' as WorkType | '',
    description: '',
    location: '',
    salary: '',
    isLiveIn: false,
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <PageLayout title="Job Posted">
        <div className="px-4 py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Job Posted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Workers can now see and apply to your job posting.
          </p>
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                title: '',
                workType: '',
                description: '',
                location: '',
                salary: '',
                isLiveIn: false,
              });
            }}
          >
            Post Another Job
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Post a Job">
      <div className="px-4 py-6 space-y-6">
        {/* Job Title */}
        <div className="animate-fade-up">
          <label className="block text-sm font-medium text-foreground mb-2">
            Job Title
          </label>
          <Input
            placeholder="e.g. Live-in Nanny for 2 Children"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Work Type */}
        <div className="animate-fade-up animation-delay-100">
          <label className="block text-sm font-medium text-foreground mb-2">
            Type of Work Needed
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(WORK_TYPE_CONFIG).slice(0, 6).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = formData.workType === key;
              return (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, workType: key as WorkType })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="animate-fade-up animation-delay-200">
          <label className="block text-sm font-medium text-foreground mb-2">
            Job Description
          </label>
          <Textarea
            placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="animate-fade-up animation-delay-300">
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full h-11 px-3 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="">Select location...</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div className="animate-fade-up">
          <label className="block text-sm font-medium text-foreground mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Salary (optional)
          </label>
          <Input
            placeholder="e.g. KES 25,000 - 35,000/month"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
        </div>

        {/* Live-in Toggle */}
        <div className="animate-fade-up">
          <button
            onClick={() => setFormData({ ...formData, isLiveIn: !formData.isLiveIn })}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              formData.isLiveIn 
                ? 'border-accent bg-accent/5' 
                : 'border-border hover:border-accent/50'
            }`}
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              formData.isLiveIn ? 'bg-accent/15' : 'bg-muted'
            }`}>
              <Home className={`h-5 w-5 ${formData.isLiveIn ? 'text-accent' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className={`font-medium ${formData.isLiveIn ? 'text-accent' : 'text-foreground'}`}>
                Live-in Position
              </p>
              <p className="text-sm text-muted-foreground">
                Worker will stay at your home
              </p>
            </div>
            <div className={`ml-auto h-6 w-6 rounded-full border-2 flex items-center justify-center ${
              formData.isLiveIn ? 'border-accent bg-accent' : 'border-muted-foreground'
            }`}>
              {formData.isLiveIn && <CheckCircle className="h-4 w-4 text-accent-foreground" />}
            </div>
          </button>
        </div>

        {/* Submit */}
        <Button 
          variant="warm" 
          size="xl" 
          className="w-full"
          disabled={!formData.title || !formData.workType || !formData.description || !formData.location}
          onClick={handleSubmit}
        >
          Post Job
        </Button>
      </div>
    </PageLayout>
  );
}
