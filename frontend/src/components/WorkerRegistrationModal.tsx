import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { registerUser } from '@/lib/api';
import { workerRegistrationSchema, type WorkerRegistrationData } from '@/lib/schemas';
import { KENYA_COUNTIES } from '@/lib/constants';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { WorkType } from '@/types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkerRegistrationModal({ open, onOpenChange }: Props) {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkerRegistrationData>({
    resolver: zodResolver(workerRegistrationSchema),
    defaultValues: { name: '', phone: '+254', county: '', workTypes: [], pin: '' },
  });

  const selectedWorkTypes = watch('workTypes');

  const toggleWorkType = (wt: string) => {
    const current = selectedWorkTypes || [];
    const next = current.includes(wt)
      ? current.filter((t) => t !== wt)
      : [...current, wt];
    setValue('workTypes', next, { shouldValidate: true });
  };

  const onSubmit = async (data: WorkerRegistrationData) => {
    setLoading(true);
    setError('');
    try {
      const res = await registerUser({ ...data, role: 'worker' });
      login(res);
      onOpenChange(false);
      navigate('/profile');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Worker Profile</DialogTitle>
          <DialogDescription>Join Trusty Work and start building your verified career.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="w-name">Full Name</Label>
            <Input id="w-name" placeholder="e.g. Mary Wanjiku" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="w-phone">Phone Number</Label>
            <Input id="w-phone" placeholder="+254712345678" {...register('phone')} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          {/* County */}
          <div className="space-y-2">
            <Label>County</Label>
            <Select onValueChange={(v) => setValue('county', v, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {KENYA_COUNTIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.county && <p className="text-sm text-destructive">{errors.county.message}</p>}
          </div>

          {/* Work Types */}
          <div className="space-y-2">
            <Label>Preferred Roles</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(WORK_TYPE_CONFIG) as WorkType[]).map((wt) => {
                const config = WORK_TYPE_CONFIG[wt];
                return (
                  <label
                    key={wt}
                    className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedWorkTypes?.includes(wt)}
                      onCheckedChange={() => toggleWorkType(wt)}
                    />
                    <span className="text-sm">{config.label}</span>
                  </label>
                );
              })}
            </div>
            {errors.workTypes && <p className="text-sm text-destructive">{errors.workTypes.message}</p>}
          </div>

          {/* PIN */}
          <div className="space-y-2">
            <Label>Create 4-digit PIN</Label>
            <InputOTP maxLength={4} onChange={(v) => setValue('pin', v, { shouldValidate: true })}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            {errors.pin && <p className="text-sm text-destructive">{errors.pin.message}</p>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Creating wallet...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
