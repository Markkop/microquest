import OpenAI from 'openai';
import { StatType } from '../db/database';
import i18n from '../i18n';

export interface TaskSuggestion {
  title: string;
  stat: StatType;
  reason: string;
}

export interface BreakdownResponse {
  tasks: TaskSuggestion[];
  usage_tokens: number;
}

// Cache for responses
const responseCache = new Map<string, BreakdownResponse>();

export const breakdownGoal = async (
  goal: string,
  depth: number,
  apiKey: string,
  rejectedIds: string[] = [],
  seed?: number
): Promise<BreakdownResponse> => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Check cache first for this exact goal + depth + seed
  const cacheKey = `${goal}-${depth}-${rejectedIds.join(',')}-${seed}`;
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `
      Given the user goal '${goal}', suggest exactly three sub-tasks that can be done within one day, each max 12 words.
      
      For each task, assign one primary stat that it would improve:
      - strength (physical health, fitness, energy)
      - vitality (mental health, resilience, emotional balance)
      - focus (concentration, productivity, learning)
      
      Return your response as a JSON object with this exact structure:
      {
        "tasks": [
          {
            "title": "Task title here, max 12 words",
            "stat": "strength|vitality|focus",
            "reason": "Brief explanation of why this helps the goal"
          }
        ]
      }
      
      Current depth: ${depth} (0 = highest level, 3 = lowest level)
      ${rejectedIds.length > 0 ? `Previously rejected suggestions: ${rejectedIds.join(', ')}` : ''}
      ${seed !== undefined ? `Use this seed for randomization: ${seed}` : ''}
      
      Please provide the response in ${i18n.language === 'pt-BR' ? 'Portuguese (Brazil)' : 'English'}.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a goal-oriented AI assistant that helps break down goals into manageable tasks. Respond in ${i18n.language === 'pt-BR' ? 'Portuguese (Brazil)' : 'English'}.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      seed,
    });

    // Extract the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(content) as BreakdownResponse;
    
    // Add usage tokens
    parsedResponse.usage_tokens = response.usage?.total_tokens || 0;
    
    // Cache the response (max 10 items)
    if (responseCache.size >= 10) {
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    responseCache.set(cacheKey, parsedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Return a fallback response if API call fails
    return getFallbackResponse(goal, depth);
  }
};

// Fallback responses when AI is unavailable
const getFallbackResponse = (goal: string, depth: number): BreakdownResponse => {
  // General templates based on depth and language
  const templates: Record<string, Record<number, TaskSuggestion[]>> = {
    en: {
      0: [
        { title: 'Research options and requirements', stat: 'focus', reason: 'Understanding the landscape helps plan effectively' },
        { title: 'Create a schedule or routine', stat: 'vitality', reason: 'Structure supports consistent progress' },
        { title: 'Find an accountability partner', stat: 'strength', reason: 'Social support increases follow-through' },
      ],
      1: [
        { title: 'Break down into smaller weekly goals', stat: 'focus', reason: 'Smaller chunks are more manageable' },
        { title: 'Remove one obstacle to progress', stat: 'strength', reason: 'Reducing friction makes action easier' },
        { title: 'Track progress daily in journal', stat: 'vitality', reason: 'Awareness increases motivation' },
      ],
      2: [
        { title: 'Spend 10 minutes on this today', stat: 'focus', reason: 'Small time blocks build momentum' },
        { title: 'Prepare environment for success', stat: 'vitality', reason: 'Setting up makes follow-through easier' },
        { title: 'Celebrate small wins visibly', stat: 'strength', reason: 'Positive reinforcement increases motivation' },
      ],
      3: [
        { title: 'Do one tiny step right now', stat: 'strength', reason: 'Immediate action breaks procrastination' },
        { title: 'Set a 5-minute timer and focus', stat: 'focus', reason: 'Time-boxing makes tasks less overwhelming' },
        { title: 'Tell someone about your progress', stat: 'vitality', reason: 'Sharing creates commitment' },
      ],
    },
    'pt-BR': {
      0: [
        { title: 'Pesquisar opções e requisitos', stat: 'focus', reason: 'Entender o cenário ajuda a planejar efetivamente' },
        { title: 'Criar um cronograma ou rotina', stat: 'vitality', reason: 'Estrutura apoia o progresso consistente' },
        { title: 'Encontrar um parceiro de responsabilidade', stat: 'strength', reason: 'Suporte social aumenta o comprometimento' },
      ],
      1: [
        { title: 'Dividir em metas semanais menores', stat: 'focus', reason: 'Partes menores são mais gerenciáveis' },
        { title: 'Remover um obstáculo ao progresso', stat: 'strength', reason: 'Reduzir a fricção facilita a ação' },
        { title: 'Acompanhar progresso diário no diário', stat: 'vitality', reason: 'Consciência aumenta a motivação' },
      ],
      2: [
        { title: 'Dedicar 10 minutos hoje', stat: 'focus', reason: 'Pequenos blocos de tempo criam momentum' },
        { title: 'Preparar ambiente para o sucesso', stat: 'vitality', reason: 'Organização facilita a execução' },
        { title: 'Celebrar pequenas vitórias visivelmente', stat: 'strength', reason: 'Reforço positivo aumenta a motivação' },
      ],
      3: [
        { title: 'Fazer um pequeno passo agora', stat: 'strength', reason: 'Ação imediata quebra a procrastinação' },
        { title: 'Definir um timer de 5 minutos e focar', stat: 'focus', reason: 'Limitar tempo torna tarefas menos intimidantes' },
        { title: 'Contar a alguém sobre seu progresso', stat: 'vitality', reason: 'Compartilhar cria comprometimento' },
      ],
    },
  };
  
  return {
    tasks: templates[i18n.language]?.[depth] || templates.en[0],
    usage_tokens: 0,
  };
};