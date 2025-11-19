
export interface Level {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  words: string; // Comma separated string to feed into the input
}

export const PRESET_CURRICULUM: Level[] = [
  {
    id: 'level-1',
    title: 'Level 1: My World',
    description: 'Basics: Colors, Numbers & Family.',
    icon: '🏠',
    color: 'bg-green-100 border-green-300 text-green-700',
    words: 'Red, Blue, Yellow, Green, One, Two, Three, Mom, Dad, Baby, Me'
  },
  {
    id: 'level-2',
    title: 'Level 2: Yummy Time',
    description: 'Fruits & Foods (Singular vs Plural).',
    icon: '🍎',
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    words: 'Apple, Apples, Banana, Bananas, Milk, Water, Cake, Ice Cream, Cookie, Cookies'
  },
  {
    id: 'level-3',
    title: 'Level 3: Animal Kingdom',
    description: 'Pets & Wild Animals.',
    icon: '🦁',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    words: 'Cat, Cats, Dog, Dogs, Bird, Birds, Lion, Elephant, Monkey, Fish'
  },
  {
    id: 'level-4',
    title: 'Level 4: Action & Nature',
    description: 'Verbs, Nature & Opposites.',
    icon: '🏃',
    color: 'bg-sky-100 border-sky-300 text-sky-700',
    words: 'Run, Jump, Sleep, Sun, Moon, Star, Tree, Flower, Big, Small'
  }
];
