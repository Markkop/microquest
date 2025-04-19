import { CooldownOption, StatType } from '../../db/database';
import { TaskSuggestion } from '../../services/aiService';

export interface TaskWithCooldowns extends TaskSuggestion {
  cooldownOptions?: CooldownOption[];
  selectedCooldown?: number;
}

export type Step = 'input' | 'suggestions' | 'apiKey';

export interface SuggestedGoal {
  title: string;
  icon: React.ReactNode;
}