export const prompts: string[] = [
  'What made you feel most alive this week?',
  'What is one small moment from today worth remembering?',
  'What are you carrying that you could gently put down?',
  'Who or what gave you energy today?',
  'What would you tell your morning self tonight?',
  'Where did you feel most like yourself today?',
  'What surprised you today — big or small?',
  'What does your body need right now?',
  'What are you grateful for that you rarely mention?',
  'What unfinished thought keeps coming back to you?',
  'What boundary did you hold — or wish you had?',
  'What did you learn about yourself today?',
  'Where did you feel tension, and what was underneath it?',
  'What would "enough" look like for you right now?',
  'What is something you want to do more of?',
  'When did you last feel truly rested? What was different?',
  'What conversation do you need to have with yourself?',
  'What are you tolerating that you don\'t have to?',
  'What did you do today just for you?',
  'If today had a colour, what would it be and why?',
  'What does your inner critic say most often? Is it true?',
  'What would courage look like for you tomorrow?',
  'What are you proud of, even quietly?',
  'What have you been avoiding — and what would help?',
  'What would you do if you weren\'t afraid?',
  'What did connection feel like today?',
  'What part of you needs the most care right now?',
  'What story are you telling yourself that may not be true?',
  'What would you create if you had no judgment?',
  'What is the kindest thing you did today — for anyone?',
  'What does peace feel like for you, in your body?',
];

export function getDailyPrompt(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return prompts[dayOfYear % prompts.length];
}
