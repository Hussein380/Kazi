import { WorkType, BadgeType } from '@/types';
import { 
  Baby, 
  Sparkles, 
  Heart, 
  ChefHat, 
  Flower2, 
  Home, 
  Car, 
  Shield,
  Award,
  Star,
  Clock,
  Trophy,
  Verified
} from 'lucide-react';

export const WORK_TYPE_CONFIG: Record<WorkType, { 
  label: string; 
  icon: typeof Baby;
  description: string;
}> = {
  nanny: {
    label: 'Nanny',
    icon: Baby,
    description: 'Childcare and nurturing',
  },
  cleaner: {
    label: 'House Cleaner',
    icon: Sparkles,
    description: 'Cleaning and tidying',
  },
  caregiver: {
    label: 'Caregiver',
    icon: Heart,
    description: 'Elderly or special needs care',
  },
  cook: {
    label: 'Cook',
    icon: ChefHat,
    description: 'Meal preparation',
  },
  gardener: {
    label: 'Gardener',
    icon: Flower2,
    description: 'Garden and outdoor care',
  },
  houseManager: {
    label: 'House Manager',
    icon: Home,
    description: 'Household management',
  },
  driver: {
    label: 'Driver',
    icon: Car,
    description: 'Transportation services',
  },
  security: {
    label: 'Security',
    icon: Shield,
    description: 'Home security',
  },
};

export const BADGE_CONFIG: Record<BadgeType, {
  label: string;
  icon: typeof Award;
  description: string;
  color: 'bronze' | 'silver' | 'gold';
}> = {
  firstJob: {
    label: 'First Step',
    icon: Star,
    description: 'Completed first verified work period',
    color: 'bronze',
  },
  reliable: {
    label: 'Reliable',
    icon: Clock,
    description: '3+ confirmed work attestations',
    color: 'silver',
  },
  experienced: {
    label: 'Experienced',
    icon: Award,
    description: '2+ years of verified experience',
    color: 'silver',
  },
  superstar: {
    label: 'Superstar',
    icon: Trophy,
    description: '5+ verified work periods with excellent feedback',
    color: 'gold',
  },
  trusted: {
    label: 'Trusted',
    icon: Verified,
    description: 'Long-term employment with same household',
    color: 'gold',
  },
};

export const LOCATIONS = [
  'Nairobi - Westlands',
  'Nairobi - Karen',
  'Nairobi - Kilimani',
  'Nairobi - Lavington',
  'Nairobi - Kileleshwa',
  'Nairobi - Runda',
  'Nairobi - Muthaiga',
  'Nairobi - South B/C',
  'Nairobi - Eastlands',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Other',
];

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana', 'Uasin Gishu',
  'Vihiga', 'Wajir', 'West Pokot',
] as const;
