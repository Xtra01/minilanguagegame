import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyItem } from "../types";

// Initialize Gemini
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Missing API Key: Online features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// --- OFFLINE DATABASE (Expanded for better fallback) ---
const OFFLINE_DICTIONARY: Record<string, Partial<VocabularyItem>> = {
  // Fruits & Food
  "apple": { emoji: "🍎", definition: "A red, crunchy fruit.", simpleSentence: "I like to eat apples.", isPlural: false },
  "banana": { emoji: "🍌", definition: "A long yellow fruit.", simpleSentence: "Monkeys love bananas.", isPlural: false },
  "orange": { emoji: "🍊", definition: "A round orange fruit.", simpleSentence: "Oranges are juicy.", isPlural: false },
  "grape": { emoji: "🍇", definition: "Small purple or green fruit.", simpleSentence: "Grapes grow in bunches.", isPlural: false },
  "strawberry": { emoji: "🍓", definition: "A sweet red berry.", simpleSentence: "Strawberries have seeds.", isPlural: false },
  "watermelon": { emoji: "🍉", definition: "A big green fruit with red inside.", simpleSentence: "Watermelon is sweet.", isPlural: false },
  "pizza": { emoji: "🍕", definition: "Cheesy food triangle.", simpleSentence: "I love pizza.", isPlural: false },
  "ice cream": { emoji: "🍦", definition: "A cold, sweet treat.", simpleSentence: "I love chocolate ice cream.", isPlural: false },
  "cake": { emoji: "🍰", definition: "Sweet food for birthdays.", simpleSentence: "Blow out the candles.", isPlural: false },
  "milk": { emoji: "🥛", definition: "White drink from cows.", simpleSentence: "Drink your milk.", isPlural: false },
  "water": { emoji: "💧", definition: "Clear liquid we drink.", simpleSentence: "Drink water everyday.", isPlural: false },
  "cookie": { emoji: "🍪", definition: "A sweet baked treat.", simpleSentence: "Cookies are yummy.", isPlural: false },
  
  // Animals
  "cat": { emoji: "🐱", definition: "A small fluffy pet.", simpleSentence: "The cat says meow.", isPlural: false },
  "dog": { emoji: "🐶", definition: "A loyal pet friend.", simpleSentence: "The dog runs fast.", isPlural: false },
  "elephant": { emoji: "🐘", definition: "A very big animal with a trunk.", simpleSentence: "The elephant is big.", isPlural: false },
  "fish": { emoji: "🐟", definition: "An animal that swims in water.", simpleSentence: "Fish live in the sea.", isPlural: false },
  "lion": { emoji: "🦁", definition: "The king of the jungle.", simpleSentence: "The lion roars loud.", isPlural: false },
  "monkey": { emoji: "🐵", definition: "A funny animal that climbs trees.", simpleSentence: "The monkey eats a banana.", isPlural: false },
  "bird": { emoji: "🐦", definition: "An animal that flies.", simpleSentence: "The bird sings.", isPlural: false },
  "rabbit": { emoji: "🐰", definition: "A hopper with long ears.", simpleSentence: "Rabbits jump high.", isPlural: false },
  "tiger": { emoji: "🐯", definition: "A big orange cat with stripes.", simpleSentence: "Tigers are strong.", isPlural: false },
  "bear": { emoji: "🐻", definition: "A big fuzzy animal.", simpleSentence: "Bears sleep in winter.", isPlural: false },
  "zebra": { emoji: "🦓", definition: "A striped horse-like animal.", simpleSentence: "Zebras are black and white.", isPlural: false },
  "giraffe": { emoji: "🦒", definition: "Animal with a long neck.", simpleSentence: "Giraffes eat tall leaves.", isPlural: false },
  
  // Nature & Objects
  "sun": { emoji: "☀️", definition: "The hot star in the sky.", simpleSentence: "The sun is hot.", isPlural: false },
  "moon": { emoji: "🌙", definition: "We see it at night.", simpleSentence: "The moon is white.", isPlural: false },
  "star": { emoji: "⭐", definition: "Twinkle in the night sky.", simpleSentence: "Look at the stars.", isPlural: false },
  "tree": { emoji: "🌳", definition: "A tall plant with leaves.", simpleSentence: "Birds sit in the tree.", isPlural: false },
  "flower": { emoji: "🌸", definition: "A pretty plant.", simpleSentence: "Flowers smell good.", isPlural: false },
  "house": { emoji: "🏠", definition: "A place where people live.", simpleSentence: "My house is warm.", isPlural: false },
  "car": { emoji: "🚗", definition: "A machine for driving.", simpleSentence: "The car goes beep.", isPlural: false },
  "ball": { emoji: "⚽", definition: "Round toy for kicking.", simpleSentence: "Kick the ball.", isPlural: false },
  "book": { emoji: "📖", definition: "Pages with stories.", simpleSentence: "Read the book.", isPlural: false },
  "pencil": { emoji: "✏️", definition: "A tool for writing.", simpleSentence: "Write with your pencil.", isPlural: false },
  
  // Colors
  "red": { emoji: "🔴", definition: "The color of strawberries.", simpleSentence: "The car is red.", isPlural: false },
  "blue": { emoji: "🔵", definition: "The color of the sky.", simpleSentence: "The water is blue.", isPlural: false },
  "green": { emoji: "🟢", definition: "The color of grass.", simpleSentence: "The leaf is green.", isPlural: false },
  "yellow": { emoji: "🟡", definition: "The color of lemons.", simpleSentence: "The sun is yellow.", isPlural: false },
  "orange color": { emoji: "🟠", definition: "The color of an orange.", simpleSentence: "Pumpkins are orange.", isPlural: false },
  "purple": { emoji: "🟣", definition: "The color of grapes.", simpleSentence: "I like purple.", isPlural: false },
  "black": { emoji: "⚫", definition: "The color of night.", simpleSentence: "The cat is black.", isPlural: false },
  "white": { emoji: "⚪", definition: "The color of snow.", simpleSentence: "Snow is white.", isPlural: false },

  // Numbers
  "one": { emoji: "1️⃣", definition: "The number 1.", simpleSentence: "One finger.", isPlural: false },
  "two": { emoji: "2️⃣", definition: "The number 2.", simpleSentence: "Two eyes.", isPlural: true },
  "three": { emoji: "3️⃣", definition: "The number 3.", simpleSentence: "Three wishes.", isPlural: true },
  
  // Plurals
  "apples": { emoji: "🍎", definition: "More than one apple.", simpleSentence: "I have three apples.", isPlural: true },
  "cats": { emoji: "🐱", definition: "More than one cat.", simpleSentence: "The cats are playing.", isPlural: true },
  "dogs": { emoji: "🐶", definition: "More than one dog.", simpleSentence: "The dogs are barking.", isPlural: true },
  "cars": { emoji: "🚗", definition: "More than one car.", simpleSentence: "The cars are fast.", isPlural: true },
  "bananas": { emoji: "🍌", definition: "Many yellow fruits.", simpleSentence: "Bananas are good.", isPlural: true },
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
    const lowerWord = word.toLowerCase();
    // Try exact match
    let dbEntry = OFFLINE_DICTIONARY[lowerWord];
    
    // Try singular match if plural not found (e.g., user types "dogs", we have "dog")
    if (!dbEntry && lowerWord.endsWith('s')) {
        const singular = lowerWord.slice(0, -1);
        if (OFFLINE_DICTIONARY[singular]) {
            dbEntry = { ...OFFLINE_DICTIONARY[singular], isPlural: true };
        }
    }

    if (dbEntry) {
      return {
        id: `offline-${index}-${Date.now()}`,
        english: word.charAt(0).toUpperCase() + word.slice(1),
        definition: dbEntry.definition || "A word to learn.",
        emoji: dbEntry.emoji || "📝",
        simpleSentence: dbEntry.simpleSentence || `This is a ${word}.`,
        isPlural: !!dbEntry.isPlural,
      };
    } else {
      // Generic fallback for unknown offline words
      // IMPORTANT: Emoji "⭐" triggers the 'First Letter' fallback in WordVisual
      return {
        id: `unknown-${index}-${Date.now()}`,
        english: word,
        definition: "Let's learn this word.",
        emoji: "⭐",
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