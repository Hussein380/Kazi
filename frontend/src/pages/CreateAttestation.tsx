import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { WORK_TYPE_CONFIG, LOCATIONS } from '@/lib/constants';
import { WorkType } from '@/types';
import { 
  Calendar, 
  User, 
  Briefcase, 
  FileText,
  CheckCircle,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

export default function CreateAttestation() {
  const { currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    workerName: '',
    workerPhone: '',
    workType: '' as WorkType | '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <PageLayout title="Attestation Created">
        <div className="px-4 py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Attestation Sent!
          </h2>
          <p className="text-muted-foreground mb-6">
            {formData.workerName} will receive a notification to confirm this work period.
          </p>

          <div className="bg-card rounded-xl p-4 shadow-soft border border-border text-left mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-medium text-foreground">What happens next?</span>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground ml-8">
              <li>1. Worker confirms the details</li>
              <li>2. Record is stored on Stellar blockchain</li>
              <li>3. Both parties receive verification link</li>
            </ol>
          </div>

          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setFormData({
                workerName: '',
                workerPhone: '',
                workType: '',
                startDate: '',
                endDate: '',
                description: '',
              });
            }}
          >
            Create Another Attestation
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Verify Work">
      <div className="px-4 py-6">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Worker Info */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Who did the work?</h2>
                <p className="text-sm text-muted-foreground">Enter worker details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Worker's Name
                </label>
                <Input
                  placeholder="e.g. Mary Wanjiku"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Worker's Phone Number
                </label>
                <Input
                  placeholder="+254..."
                  value={formData.workerPhone}
                  onChange={(e) => setFormData({ ...formData, workerPhone: e.target.value })}
                />
              </div>
            </div>

            <Button 
              variant="default" 
              size="lg" 
              className="w-full mt-6"
              disabled={!formData.workerName || !formData.workerPhone}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Work Details */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Work details</h2>
                <p className="text-sm text-muted-foreground">What type of work and when?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type of Work
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(WORK_TYPE_CONFIG).map(([key, config]) => {
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="flex-1"
                disabled={!formData.workType || !formData.startDate || !formData.endDate}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Description & Review */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add a note (optional)</h2>
                <p className="text-sm text-muted-foreground">Share your experience</p>
              </div>
            </div>

            <Textarea
              placeholder="e.g. Excellent care for our children. Very reliable and professional."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mb-4"
            />

            {/* Review Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-foreground mb-3">Review</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Worker</span>
                  <span className="text-foreground font-medium">{formData.workerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work Type</span>
                  <span className="text-foreground font-medium">
                    {formData.workType && WORK_TYPE_CONFIG[formData.workType].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period</span>
                  <span className="text-foreground font-medium">
                    {formData.startDate && format(new Date(formData.startDate), 'MMM yyyy')} — {formData.endDate && format(new Date(formData.endDate), 'MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Blockchain notice */}
            <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20 mb-6">
              <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                This record will be permanently stored on the Stellar blockchain once confirmed by the worker.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                variant="trust" 
                size="lg" 
                className="flex-1"
                onClick={handleSubmit}
              >
                Send Attestation
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
