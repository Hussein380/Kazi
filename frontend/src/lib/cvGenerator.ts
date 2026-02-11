import { Worker, Attestation, GeneratedCV } from '@/types';
import { WORK_TYPE_CONFIG } from '@/lib/constants';
import { format } from 'date-fns';

/**
 * Generate a professional CV from worker data
 * This is a template-based generator that simulates AI output
 * Can be replaced with actual AI backend later
 */
export function generateCV(
  worker: Worker,
  attestations: Attestation[],
  tailorFor?: string
): GeneratedCV {
  const completedAttestations = attestations.filter(a => a.status === 'completed');
  
  // Generate professional summary
  const primaryWorkTypes = worker.workTypes.slice(0, 2).map(wt => WORK_TYPE_CONFIG[wt].label.toLowerCase());
  const workTypeText = primaryWorkTypes.length > 1 
    ? `${primaryWorkTypes.slice(0, -1).join(', ')} and ${primaryWorkTypes[primaryWorkTypes.length - 1]}`
    : primaryWorkTypes[0];
  
  let summary = `Dedicated and reliable ${workTypeText} professional with ${worker.yearsExperience} years of experience. `;
  
  if (completedAttestations.length > 0) {
    summary += `Proven track record with ${completedAttestations.length} verified employment period${completedAttestations.length > 1 ? 's' : ''}. `;
  }
  
  if (worker.badges.length > 0) {
    summary += `Recognized for excellence with ${worker.badges.length} earned credential${worker.badges.length > 1 ? 's' : ''}. `;
  }
  
  summary += `Based in ${worker.location}, committed to providing exceptional care and service.`;
  
  if (tailorFor) {
    summary += ` Particularly experienced in ${tailorFor.toLowerCase()}-related duties.`;
  }

  // Generate experience entries from attestations
  const experience = completedAttestations.map(att => ({
    role: WORK_TYPE_CONFIG[att.workType].label,
    employer: att.employerName,
    period: `${format(att.startDate, 'MMMM yyyy')} - ${format(att.endDate, 'MMMM yyyy')}`,
    description: att.description || generateDefaultDescription(att.workType),
  }));

  // Generate skills list
  const skills = generateSkillsList(worker.workTypes, worker.yearsExperience);

  // Format badges
  const badges = worker.badges.map(badge => ({
    name: badge.name,
    description: badge.description,
  }));

  return {
    summary,
    experience,
    skills,
    badges,
    generatedAt: new Date(),
  };
}

function generateDefaultDescription(workType: string): string {
  const descriptions: Record<string, string> = {
    nanny: 'Provided attentive childcare, including meal preparation, educational activities, and maintaining safe environments.',
    cleaner: 'Maintained high standards of cleanliness and organization throughout the household.',
    caregiver: 'Delivered compassionate care with attention to daily needs, medication management, and emotional support.',
    cook: 'Prepared nutritious meals tailored to family preferences and dietary requirements.',
    gardener: 'Maintained outdoor spaces including lawn care, planting, and landscape management.',
    houseManager: 'Coordinated household operations, managed staff schedules, and ensured smooth daily routines.',
    driver: 'Provided safe and reliable transportation services with excellent time management.',
    security: 'Ensured property and personal security through vigilant monitoring and access control.',
  };
  return descriptions[workType] || 'Performed duties with professionalism and dedication.';
}

function generateSkillsList(workTypes: string[], yearsExperience: number): string[] {
  const baseSkills = ['Punctual and reliable', 'Strong communication', 'Trustworthy'];
  
  const workTypeSkills: Record<string, string[]> = {
    nanny: ['Child development knowledge', 'First aid trained', 'Educational activities', 'Patience and empathy'],
    cleaner: ['Deep cleaning expertise', 'Laundry and ironing', 'Organization skills', 'Eco-friendly products knowledge'],
    caregiver: ['Elderly care', 'Medical assistance', 'Mobility support', 'Emotional intelligence'],
    cook: ['Meal planning', 'Dietary accommodations', 'Kitchen management', 'Food safety'],
    gardener: ['Landscaping', 'Plant care', 'Tool maintenance', 'Seasonal planning'],
    houseManager: ['Staff coordination', 'Budget management', 'Event planning', 'Inventory control'],
    driver: ['Safe driving record', 'Route planning', 'Vehicle maintenance', 'Discretion'],
    security: ['Surveillance systems', 'Emergency response', 'Access control', 'Risk assessment'],
  };
  
  const skills = [...baseSkills];
  
  workTypes.forEach(wt => {
    const typeSkills = workTypeSkills[wt] || [];
    skills.push(...typeSkills.slice(0, 2));
  });
  
  if (yearsExperience >= 5) {
    skills.push('Experienced professional');
  }
  
  return [...new Set(skills)].slice(0, 8);
}
