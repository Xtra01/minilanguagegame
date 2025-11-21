
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyItem } from "../types";

// Initialize Gemini
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Missing API Key: Online features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * MASSIVE OFFLINE DICTIONARY FOR AGES 4-5
 * Covers: Food, Animals, Body, Clothes, Home, School, Nature, Verbs, Colors, Numbers
 */
const OFFLINE_DICTIONARY: Record<string, Partial<VocabularyItem>> = {
  // --- FOOD & DRINKS ---
  "apple": { emoji: "🍎", definition: "A red crunchy fruit.", simpleSentence: "I eat a red apple.", isPlural: false },
  "banana": { emoji: "🍌", definition: "A long yellow fruit.", simpleSentence: "Monkeys love bananas.", isPlural: false },
  "bread": { emoji: "🍞", definition: "Soft food for sandwiches.", simpleSentence: "I eat bread and jam.", isPlural: false },
  "cheese": { emoji: "🧀", definition: "Yellow food from milk.", simpleSentence: "Mouse loves cheese.", isPlural: false },
  "egg": { emoji: "🥚", definition: "White oval food.", simpleSentence: "Chicken lays an egg.", isPlural: false },
  "milk": { emoji: "🥛", definition: "White drink from cows.", simpleSentence: "Drink your milk.", isPlural: false },
  "water": { emoji: "💧", definition: "Clear liquid we drink.", simpleSentence: "Drink water everyday.", isPlural: false },
  "cake": { emoji: "🍰", definition: "Sweet birthday food.", simpleSentence: "Happy birthday cake.", isPlural: false },
  "cookie": { emoji: "🍪", definition: "Sweet round treat.", simpleSentence: "Cookies are yummy.", isPlural: false },
  "ice cream": { emoji: "🍦", definition: "Cold sweet treat.", simpleSentence: "I like chocolate ice cream.", isPlural: false },
  "pizza": { emoji: "🍕", definition: "Round cheesy food.", simpleSentence: "Pizza is hot.", isPlural: false },
  "chocolate": { emoji: "🍫", definition: "Brown sweet candy.", simpleSentence: "Chocolate is sweet.", isPlural: false },
  "orange": { emoji: "🍊", definition: "Round orange fruit.", simpleSentence: "Oranges are juicy.", isPlural: false },
  "grape": { emoji: "🍇", definition: "Small purple fruit.", simpleSentence: "Grapes are sweet.", isPlural: false },
  "strawberry": { emoji: "🍓", definition: "Red berry with seeds.", simpleSentence: "I like strawberries.", isPlural: false },
  "watermelon": { emoji: "🍉", definition: "Big green fruit.", simpleSentence: "Watermelon is wet.", isPlural: false },
  "potato": { emoji: "🥔", definition: "Brown vegetable.", simpleSentence: "Potatoes make chips.", isPlural: false },
  "tomato": { emoji: "🍅", definition: "Red round vegetable.", simpleSentence: "Tomatoes are red.", isPlural: false },
  "carrot": { emoji: "🥕", definition: "Orange long vegetable.", simpleSentence: "Rabbits eat carrots.", isPlural: false },
  "sandwich": { emoji: "🥪", definition: "Bread with food inside.", simpleSentence: "Eat your sandwich.", isPlural: false },
  "burger": { emoji: "🍔", definition: "Meat in a bun.", simpleSentence: "Yummy burger.", isPlural: false },
  "juice": { emoji: "🧃", definition: "Fruit drink.", simpleSentence: "Apple juice is good.", isPlural: false },

  // --- BODY PARTS ---
  "head": { emoji: "🗣️", definition: "Top part of body.", simpleSentence: "Touch your head.", isPlural: false },
  "hair": { emoji: "💇", definition: "Grows on your head.", simpleSentence: "Comb your hair.", isPlural: false },
  "eye": { emoji: "👁️", definition: "We see with them.", simpleSentence: "Close your eye.", isPlural: false },
  "eyes": { emoji: "👀", definition: "Two eyes to see.", simpleSentence: "Open your eyes.", isPlural: true },
  "nose": { emoji: "👃", definition: "We smell with it.", simpleSentence: "Touch your nose.", isPlural: false },
  "mouth": { emoji: "👄", definition: "We eat with it.", simpleSentence: "Open your mouth.", isPlural: false },
  "ear": { emoji: "👂", definition: "We hear with it.", simpleSentence: "Touch your ear.", isPlural: false },
  "ears": { emoji: "👂", definition: "Two ears to hear.", simpleSentence: "Listen with ears.", isPlural: true },
  "hand": { emoji: "✋", definition: "Five fingers here.", simpleSentence: "Wave your hand.", isPlural: false },
  "hands": { emoji: "🙌", definition: "Two hands to clap.", simpleSentence: "Clap your hands.", isPlural: true },
  "foot": { emoji: "🦶", definition: "We walk on it.", simpleSentence: "Stomp your foot.", isPlural: false },
  "feet": { emoji: "👣", definition: "Two feet for walking.", simpleSentence: "Move your feet.", isPlural: true },
  "arm": { emoji: "💪", definition: "Long part of body.", simpleSentence: "Raise your arm.", isPlural: false },
  "leg": { emoji: "🦵", definition: "We run with legs.", simpleSentence: "Kick with your leg.", isPlural: false },
  "tooth": { emoji: "🦷", definition: "White thing in mouth.", simpleSentence: "Brush your tooth.", isPlural: false },
  "teeth": { emoji: "😬", definition: "Many white teeth.", simpleSentence: "Brush your teeth.", isPlural: true },

  // --- CLOTHES ---
  "shirt": { emoji: "👕", definition: "Clothes for top.", simpleSentence: "Put on your shirt.", isPlural: false },
  "t-shirt": { emoji: "👕", definition: "Short sleeve shirt.", simpleSentence: "Blue t-shirt.", isPlural: false },
  "pants": { emoji: "👖", definition: "Clothes for legs.", simpleSentence: "Blue pants.", isPlural: true },
  "jeans": { emoji: "👖", definition: "Blue denim pants.", simpleSentence: "I wear jeans.", isPlural: true },
  "dress": { emoji: "👗", definition: "Pretty long clothes.", simpleSentence: "A pink dress.", isPlural: false },
  "shoe": { emoji: "👟", definition: "Wear on foot.", simpleSentence: "Tie your shoe.", isPlural: false },
  "shoes": { emoji: "👟", definition: "Wear on feet.", simpleSentence: "Put on shoes.", isPlural: true },
  "sock": { emoji: "🧦", definition: "Soft on foot.", simpleSentence: "One red sock.", isPlural: false },
  "socks": { emoji: "🧦", definition: "Keep feet warm.", simpleSentence: "Two socks.", isPlural: true },
  "hat": { emoji: "🧢", definition: "Wear on head.", simpleSentence: "Put on your hat.", isPlural: false },
  "jacket": { emoji: "🧥", definition: "Warm coat.", simpleSentence: "Zip your jacket.", isPlural: false },
  "glasses": { emoji: "👓", definition: "Help eyes see.", simpleSentence: "Wear your glasses.", isPlural: true },

  // --- ANIMALS ---
  "cat": { emoji: "🐱", definition: "Small fluffy pet.", simpleSentence: "Cat says meow.", isPlural: false },
  "dog": { emoji: "🐶", definition: "Loyal friend.", simpleSentence: "Dog says woof.", isPlural: false },
  "fish": { emoji: "🐟", definition: "Swims in water.", simpleSentence: "Fish bubbles.", isPlural: false },
  "bird": { emoji: "🐦", definition: "Flies in sky.", simpleSentence: "Bird sings.", isPlural: false },
  "rabbit": { emoji: "🐰", definition: "Long ears hop.", simpleSentence: "Rabbit hops fast.", isPlural: false },
  "mouse": { emoji: "🐭", definition: "Small squeak animal.", simpleSentence: "Mouse eats cheese.", isPlural: false },
  "cow": { emoji: "🐮", definition: "Farm animal milk.", simpleSentence: "Cow says moo.", isPlural: false },
  "pig": { emoji: "🐷", definition: "Pink farm animal.", simpleSentence: "Pig says oink.", isPlural: false },
  "sheep": { emoji: "🐑", definition: "Fluffy wool animal.", simpleSentence: "Sheep says baa.", isPlural: false },
  "horse": { emoji: "🐴", definition: "Fast riding animal.", simpleSentence: "Ride the horse.", isPlural: false },
  "duck": { emoji: "🦆", definition: "Bird likes water.", simpleSentence: "Duck says quack.", isPlural: false },
  "chicken": { emoji: "🐔", definition: "Bird lays eggs.", simpleSentence: "Chicken clucks.", isPlural: false },
  "lion": { emoji: "🦁", definition: "King of jungle.", simpleSentence: "Lion roars.", isPlural: false },
  "tiger": { emoji: "🐯", definition: "Striped big cat.", simpleSentence: "Tiger runs fast.", isPlural: false },
  "bear": { emoji: "🐻", definition: "Big sleepy animal.", simpleSentence: "Bear is big.", isPlural: false },
  "monkey": { emoji: "🐵", definition: "Climbs trees.", simpleSentence: "Monkey is funny.", isPlural: false },
  "elephant": { emoji: "🐘", definition: "Big nose trunk.", simpleSentence: "Elephant is huge.", isPlural: false },
  "snake": { emoji: "🐍", definition: "Long no legs.", simpleSentence: "Snake hisses.", isPlural: false },
  "spider": { emoji: "🕷️", definition: "Eight legs bug.", simpleSentence: "Spider spins web.", isPlural: false },
  "bee": { emoji: "🐝", definition: "Yellow black fly.", simpleSentence: "Bee makes honey.", isPlural: false },
  "butterfly": { emoji: "🦋", definition: "Pretty wings fly.", simpleSentence: "Pretty butterfly.", isPlural: false },

  // --- HOME & SCHOOL ---
  "house": { emoji: "🏠", definition: "Where we live.", simpleSentence: "My house is nice.", isPlural: false },
  "school": { emoji: "🏫", definition: "Where we learn.", simpleSentence: "Go to school.", isPlural: false },
  "room": { emoji: "🚪", definition: "Part of a house.", simpleSentence: "Clean your room.", isPlural: false },
  "bed": { emoji: "🛏️", definition: "We sleep here.", simpleSentence: "Go to bed.", isPlural: false },
  "chair": { emoji: "🪑", definition: "We sit here.", simpleSentence: "Sit on the chair.", isPlural: false },
  "table": { emoji: "🍽️", definition: "We eat here.", simpleSentence: "Set the table.", isPlural: false },
  "door": { emoji: "🚪", definition: "Open and close.", simpleSentence: "Open the door.", isPlural: false },
  "window": { emoji: "🪟", definition: "Glass to look out.", simpleSentence: "Look out the window.", isPlural: false },
  "television": { emoji: "📺", definition: "Watch cartoons.", simpleSentence: "Watch TV.", isPlural: false },
  "tv": { emoji: "📺", definition: "Watch cartoons.", simpleSentence: "Turn on the TV.", isPlural: false },
  "phone": { emoji: "📱", definition: "Call people.", simpleSentence: "Hello on phone.", isPlural: false },
  "book": { emoji: "📖", definition: "Read stories.", simpleSentence: "Read a book.", isPlural: false },
  "pencil": { emoji: "✏️", definition: "Write with it.", simpleSentence: "Yellow pencil.", isPlural: false },
  "pen": { emoji: "🖊️", definition: "Ink to write.", simpleSentence: "Blue pen.", isPlural: false },
  "bag": { emoji: "🎒", definition: "Carry things.", simpleSentence: "School bag.", isPlural: false },
  "paper": { emoji: "📄", definition: "Write on it.", simpleSentence: "White paper.", isPlural: false },
  "scissors": { emoji: "✂️", definition: "Cut paper.", simpleSentence: "Cut with scissors.", isPlural: true },
  "ball": { emoji: "⚽", definition: "Round toy.", simpleSentence: "Kick the ball.", isPlural: false },
  "doll": { emoji: "🎎", definition: "Toy baby.", simpleSentence: "Play with doll.", isPlural: false },
  "car": { emoji: "🚗", definition: "Drives on road.", simpleSentence: "Red fast car.", isPlural: false },
  "bus": { emoji: "🚌", definition: "Big yellow car.", simpleSentence: "School bus.", isPlural: false },
  "bike": { emoji: "🚲", definition: "Two wheels ride.", simpleSentence: "Ride your bike.", isPlural: false },
  "train": { emoji: "🚂", definition: "Runs on tracks.", simpleSentence: "Choo choo train.", isPlural: false },
  "plane": { emoji: "✈️", definition: "Flies in sky.", simpleSentence: "Big airplane.", isPlural: false },
  "boat": { emoji: "⛵", definition: "Floats on water.", simpleSentence: "Sail the boat.", isPlural: false },

  // --- NATURE ---
  "sun": { emoji: "☀️", definition: "Hot star in sky.", simpleSentence: "Sun is hot.", isPlural: false },
  "moon": { emoji: "🌙", definition: "White night light.", simpleSentence: "Goodnight moon.", isPlural: false },
  "star": { emoji: "⭐", definition: "Twinkle at night.", simpleSentence: "Look at the star.", isPlural: false },
  "sky": { emoji: "☁️", definition: "Blue above us.", simpleSentence: "Sky is blue.", isPlural: false },
  "cloud": { emoji: "☁️", definition: "White fluff in sky.", simpleSentence: "Fluffy cloud.", isPlural: false },
  "rain": { emoji: "🌧️", definition: "Water from sky.", simpleSentence: "Rain falls down.", isPlural: false },
  "snow": { emoji: "❄️", definition: "Cold white ice.", simpleSentence: "Snow is cold.", isPlural: false },
  "tree": { emoji: "🌳", definition: "Tall plant.", simpleSentence: "Green tree.", isPlural: false },
  "flower": { emoji: "🌸", definition: "Pretty plant.", simpleSentence: "Smell the flower.", isPlural: false },

  // --- COLORS ---
  "red": { emoji: "🔴", definition: "Color of apple.", simpleSentence: "Red apple.", isPlural: false },
  "blue": { emoji: "🔵", definition: "Color of sky.", simpleSentence: "Blue sky.", isPlural: false },
  "green": { emoji: "🟢", definition: "Color of grass.", simpleSentence: "Green leaf.", isPlural: false },
  "yellow": { emoji: "🟡", definition: "Color of sun.", simpleSentence: "Yellow sun.", isPlural: false },
  "orange color": { emoji: "🟠", definition: "Color of orange.", simpleSentence: "Orange pumpkin.", isPlural: false },
  "purple": { emoji: "🟣", definition: "Color of grapes.", simpleSentence: "Purple flower.", isPlural: false },
  "pink": { emoji: "🩷", definition: "Color of pig.", simpleSentence: "Pink dress.", isPlural: false },
  "black": { emoji: "⚫", definition: "Color of night.", simpleSentence: "Black cat.", isPlural: false },
  "white": { emoji: "⚪", definition: "Color of snow.", simpleSentence: "White paper.", isPlural: false },
  "brown": { emoji: "🟤", definition: "Color of bear.", simpleSentence: "Brown bear.", isPlural: false },

  // --- NUMBERS ---
  "one": { emoji: "1️⃣", definition: "Number 1.", simpleSentence: "One finger.", isPlural: false },
  "two": { emoji: "2️⃣", definition: "Number 2.", simpleSentence: "Two eyes.", isPlural: true },
  "three": { emoji: "3️⃣", definition: "Number 3.", simpleSentence: "Three pigs.", isPlural: true },
  "four": { emoji: "4️⃣", definition: "Number 4.", simpleSentence: "Four legs.", isPlural: true },
  "five": { emoji: "5️⃣", definition: "Number 5.", simpleSentence: "Five fingers.", isPlural: true },
  "six": { emoji: "6️⃣", definition: "Number 6.", simpleSentence: "Six dots.", isPlural: true },
  "seven": { emoji: "7️⃣", definition: "Number 7.", simpleSentence: "Seven days.", isPlural: true },
  "eight": { emoji: "8️⃣", definition: "Number 8.", simpleSentence: "Eight legs.", isPlural: true },
  "nine": { emoji: "9️⃣", definition: "Number 9.", simpleSentence: "Nine cats.", isPlural: true },
  "ten": { emoji: "🔟", definition: "Number 10.", simpleSentence: "Ten toes.", isPlural: true },

  // --- VERBS (Action words) ---
  "run": { emoji: "🏃", definition: "Move fast.", simpleSentence: "Run fast.", isPlural: false },
  "jump": { emoji: "🦘", definition: "Go up and down.", simpleSentence: "Jump high.", isPlural: false },
  "sleep": { emoji: "😴", definition: "Rest eyes closed.", simpleSentence: "Sleep now.", isPlural: false },
  "eat": { emoji: "🍽️", definition: "Put food in mouth.", simpleSentence: "Eat food.", isPlural: false },
  "drink": { emoji: "🥤", definition: "Sip water.", simpleSentence: "Drink water.", isPlural: false },
  "swim": { emoji: "🏊", definition: "Move in water.", simpleSentence: "Swim in pool.", isPlural: false },
  "play": { emoji: "🤹", definition: "Have fun.", simpleSentence: "Play games.", isPlural: false },
  "sing": { emoji: "🎤", definition: "Make music voice.", simpleSentence: "Sing a song.", isPlural: false },
  "dance": { emoji: "💃", definition: "Move to music.", simpleSentence: "Dance around.", isPlural: false },
  "read": { emoji: "📖", definition: "Look at book.", simpleSentence: "Read book.", isPlural: false },
  "write": { emoji: "✍️", definition: "Use pencil.", simpleSentence: "Write name.", isPlural: false },
  "wash": { emoji: "🧼", definition: "Clean with water.", simpleSentence: "Wash hands.", isPlural: false },
  "happy": { emoji: "😊", definition: "Smile good feeling.", simpleSentence: "I am happy.", isPlural: false },
  "sad": { emoji: "😢", definition: "Cry bad feeling.", simpleSentence: "Do not be sad.", isPlural: false },
  "angry": { emoji: "😠", definition: "Mad feeling.", simpleSentence: "He is angry.", isPlural: false },
};

// --- AUDIO HANDLING ---
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass({ sampleRate: 24000 });
  }
  return audioContext;
};

const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const pcmToAudioBuffer = (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): AudioBuffer => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const isOnline = () => navigator.onLine;

/**
 * Generates a structured lesson plan.
 */
export const generateLessonContent = async (wordListInput: string): Promise<VocabularyItem[]> => {
  // Clean input
  const words = wordListInput.split(/[, \n]+/).map(w => w.trim()).filter(w => w.length > 0);

  // If offline or no API key, immediately fallback
  if (!isOnline() || !apiKey) {
    console.log("Offline/No-Key Mode Detected: Using Local Dictionary");
    return generateOfflineContent(words);
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert English teacher for 4-5 year old children (ESL). 
      I will give you a list of words. 
      Convert them into a structured JSON list for a learning app.
      
      CRITICAL RULE FOR PLURALS:
      If the word is plural (e.g., "Apples", "Cars"), set 'isPlural' to true.
      
      Rules:
      1. 'english': The word in English (Capitalized).
      2. 'definition': A very simple, short definition in English suitable for a 4-year-old.
      3. 'emoji': A single, clear emoji that best represents the object.
      4. 'simpleSentence': A very short, simple 3-4 word sentence.
      5. 'isPlural': Boolean. True if the word implies multiple items.
      
      Input Words: "${wordListInput}"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              definition: { type: Type.STRING },
              emoji: { type: Type.STRING },
              isPlural: { type: Type.BOOLEAN },
              simpleSentence: { type: Type.STRING },
            },
            required: ["english", "definition", "emoji", "isPlural", "simpleSentence"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((item: any, index: number) => ({
      id: `word-${index}-${Date.now()}`,
      ...item
    }));

  } catch (error) {
    console.error("Gemini API Error (Switching to Offline Mode):", error);
    return generateOfflineContent(words);
  }
};

/**
 * Fallback generator using local database
 */
const generateOfflineContent = (words: string[]): VocabularyItem[] => {
  return words.map((word, index) => {
    const lowerWord = word.toLowerCase().trim();
    
    // 1. Try exact match
    let dbEntry = OFFLINE_DICTIONARY[lowerWord];
    let foundIsPlural = false;
    
    // 2. Try singular match if plural not found (e.g., user types "dogs", we have "dog")
    if (!dbEntry && lowerWord.endsWith('s')) {
        const singular = lowerWord.slice(0, -1);
        if (OFFLINE_DICTIONARY[singular]) {
            dbEntry = OFFLINE_DICTIONARY[singular];
            foundIsPlural = true;
        }
    }

    // 3. Try without 'es' (e.g. potatoes -> potato)
    if (!dbEntry && lowerWord.endsWith('es')) {
        const singular = lowerWord.slice(0, -2);
        if (OFFLINE_DICTIONARY[singular]) {
            dbEntry = OFFLINE_DICTIONARY[singular];
            foundIsPlural = true;
        }
    }

    if (dbEntry) {
      return {
        id: `offline-${index}-${Date.now()}`,
        english: word.charAt(0).toUpperCase() + word.slice(1),
        definition: dbEntry.definition || "A word to learn.",
        emoji: dbEntry.emoji || "📝",
        simpleSentence: dbEntry.simpleSentence || `This is a ${word}.`,
        // Use database plural flag OR derived flag from input
        isPlural: dbEntry.isPlural || foundIsPlural,
      };
    } else {
      // Generic fallback for unknown offline words
      return {
        id: `unknown-${index}-${Date.now()}`,
        english: word,
        definition: "Let's learn this word.",
        emoji: "⭐", // Triggers First Letter fallback in WordVisual
        simpleSentence: `Can you say ${word}?`,
        isPlural: false,
      };
    }
  });
};

/**
 * Generates Audio.
 */
export const generateWordAudio = async (text: string): Promise<string> => {
  if (!isOnline() || !apiKey) {
    return ""; // Use Native TTS
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is female-sounding
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");
    
    return base64Audio;

  } catch (error) {
    console.warn("Audio Gen Error:", error);
    return ""; 
  }
};

/**
 * Plays Audio.
 * Prioritizes FEMALE voices for Native TTS.
 */
export const playAudio = async (base64String?: string, fallbackText?: string) => {
  // 1. Try Gemini Audio (Base64)
  if (base64String && base64String.length > 50) {
    try {
      const rawBase64 = base64String.replace(/^data:audio\/.*?;base64,/, '');
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      const bytes = decodeBase64(rawBase64);
      const buffer = pcmToAudioBuffer(bytes, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      return;
    } catch (e) {
      console.error("Playback failed, falling back to native", e);
    }
  }

  // 2. Fallback: Native Browser TTS (Strictly FEMALE preference)
  if (fallbackText) {
    window.speechSynthesis.cancel(); // Stop previous
    const utterance = new SpeechSynthesisUtterance(fallbackText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slower for kids
    utterance.pitch = 1.2; // Higher pitch (friendlier)
    
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritize Female Voices (iOS 'Samantha', Google 'Female', etc.)
    let selectedVoice = voices.find(v => 
        (v.name.includes('Samantha')) || 
        (v.name.includes('Female') && v.lang.includes('en-US')) ||
        (v.name.includes('Google US English')) // Often female
    );

    // Fallback to any English voice if no specific female voice found
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  }
};
