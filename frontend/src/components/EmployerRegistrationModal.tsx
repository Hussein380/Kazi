import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { registerUser } from '@/lib/api';
import { employerRegistrationSchema, type EmployerRegistrationData } from '@/lib/schemas';
import { KENYA_COUNTIES } from '@/lib/constants';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployerRegistrationModal({ open, onOpenChange }: Props) {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployerRegistrationData>({
    resolver: zodResolver(employerRegistrationSchema),
    defaultValues: { name: '', phone: '+254', county: '', pin: '' },
  });

  const onSubmit = async (data: EmployerRegistrationData) => {
    setLoading(true);
    setError('');
    try {
      const res = await registerUser({ ...data, role: 'employer' });
      login(res);
      onOpenChange(false);
      navigate('/workers');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Employer Account</DialogTitle>
          <DialogDescription>Find reliable help for your home through Trusty Work.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="e-name">Full Name</Label>
            <Input id="e-name" placeholder="e.g. John Kamau" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="e-phone">Phone Number</Label>
            <Input id="e-phone" placeholder="+254712345678" {...register('phone')} />
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
            {loading ? 'Creating wallet...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
