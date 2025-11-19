import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyItem } from "../types";

// Initialize Gemini
// We check for the key to support local development and build environments
// The API key is obtained exclusively from process.env.API_KEY as per guidelines.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Missing API Key: Online features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// --- OFFLINE DATABASE (Fallback when no internet) ---
const OFFLINE_DICTIONARY: Record<string, Partial<VocabularyItem>> = {
  "apple": { emoji: "🍎", definition: "A red, crunchy fruit.", simpleSentence: "I like to eat apples.", isPlural: false },
  "banana": { emoji: "🍌", definition: "A long yellow fruit.", simpleSentence: "Monkeys love bananas.", isPlural: false },
  "cat": { emoji: "🐱", definition: "A small fluffy pet.", simpleSentence: "The cat says meow.", isPlural: false },
  "dog": { emoji: "🐶", definition: "A loyal pet friend.", simpleSentence: "The dog runs fast.", isPlural: false },
  "elephant": { emoji: "🐘", definition: "A very big animal with a trunk.", simpleSentence: "The elephant is big.", isPlural: false },
  "fish": { emoji: "🐟", definition: "An animal that swims in water.", simpleSentence: "Fish live in the sea.", isPlural: false },
  "girl": { emoji: "👧", definition: "A female child.", simpleSentence: "The girl is happy.", isPlural: false },
  "boy": { emoji: "👦", definition: "A male child.", simpleSentence: "The boy plays ball.", isPlural: false },
  "house": { emoji: "🏠", definition: "A place where people live.", simpleSentence: "My house is warm.", isPlural: false },
  "ice cream": { emoji: "🍦", definition: "A cold, sweet treat.", simpleSentence: "I love chocolate ice cream.", isPlural: false },
  "jump": { emoji: "🦘", definition: "To push yourself into the air.", simpleSentence: "Rabbits jump high.", isPlural: false },
  "kite": { emoji: "🪁", definition: "A toy that flies in the wind.", simpleSentence: "Fly the kite in the sky.", isPlural: false },
  "lion": { emoji: "🦁", definition: "The king of the jungle.", simpleSentence: "The lion roars loud.", isPlural: false },
  "monkey": { emoji: "🐵", definition: "A funny animal that climbs trees.", simpleSentence: "The monkey eats a banana.", isPlural: false },
  "nest": { emoji: "🪹", definition: "A home for birds.", simpleSentence: "Eggs are in the nest.", isPlural: false },
  "orange": { emoji: "🍊", definition: "A round orange fruit.", simpleSentence: "Oranges are juicy.", isPlural: false },
  "pencil": { emoji: "✏️", definition: "A tool for writing.", simpleSentence: "Write with your pencil.", isPlural: false },
  "queen": { emoji: "👑", definition: "A woman who rules a kingdom.", simpleSentence: "The queen wears a crown.", isPlural: false },
  "red": { emoji: "🔴", definition: "The color of strawberries.", simpleSentence: "The car is red.", isPlural: false },
  "sun": { emoji: "☀️", definition: "The hot star in the sky.", simpleSentence: "The sun is hot.", isPlural: false },
  "tree": { emoji: "🌳", definition: "A tall plant with leaves.", simpleSentence: "Birds sit in the tree.", isPlural: false },
  "umbrella": { emoji: "☔", definition: "Keeps you dry in rain.", simpleSentence: "Open the umbrella.", isPlural: false },
  "van": { emoji: "🚐", definition: "A big car for many people.", simpleSentence: "We go in the van.", isPlural: false },
  "water": { emoji: "💧", definition: "Clear liquid we drink.", simpleSentence: "Drink water everyday.", isPlural: false },
  "xylophone": { emoji: "🎹", definition: "A musical instrument.", simpleSentence: "Play the xylophone.", isPlural: false },
  "yellow": { emoji: "🟡", definition: "The color of lemons.", simpleSentence: "The sun is yellow.", isPlural: false },
  "zebra": { emoji: "🦓", definition: "A striped horse-like animal.", simpleSentence: "Zebras are black and white.", isPlural: false },
  // Plurals
  "apples": { emoji: "🍎", definition: "More than one apple.", simpleSentence: "I have three apples.", isPlural: true },
  "cats": { emoji: "🐱", definition: "More than one cat.", simpleSentence: "The cats are playing.", isPlural: true },
  "dogs": { emoji: "🐶", definition: "More than one dog.", simpleSentence: "The dogs are barking.", isPlural: true },
  "cars": { emoji: "🚗", definition: "More than one car.", simpleSentence: "The cars are fast.", isPlural: true },
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

/**
 * Checks if internet is available
 */
const isOnline = () => navigator.onLine;

/**
 * Generates a structured lesson plan.
 * Strategies:
 * 1. Try Gemini AI (Best Quality)
 * 2. If Offline/Error, use Local Dictionary (Instant, robust)
 * 3. If Unknown Word Offline, use Generic Fallback
 */
export const generateLessonContent = async (wordListInput: string): Promise<VocabularyItem[]> => {
  // Clean input
  const words = wordListInput.split(/[, \n]+/).map(w => w.trim()).filter(w => w.length > 0);

  // Strategy: Check connectivity
  if (!isOnline()) {
    console.log("Offline Mode Detected: Using Local Dictionary");
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
      If it is plural, the definition MUST say "More than one..." or "Many...".
      
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
    const dbEntry = OFFLINE_DICTIONARY[lowerWord];

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
 * Online: High quality Gemini Neural Audio.
 * Offline: Browser Native Speech Synthesis (Robotic but works without internet).
 */
export const generateWordAudio = async (text: string): Promise<string> => {
  if (!isOnline()) {
    // Return empty string to signal "Use Native TTS"
    return ""; 
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");
    
    return base64Audio;

  } catch (error) {
    console.warn("Audio Gen Error (Using Native fallback):", error);
    return ""; // Fail gracefully to native
  }
};

/**
 * Plays Audio.
 * If base64 provided -> Plays Gemini Audio.
 * If empty string -> Uses Window.SpeechSynthesis (Native Offline).
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

  // 2. Fallback: Native Browser TTS (Works Offline)
  if (fallbackText) {
    const utterance = new SpeechSynthesisUtterance(fallbackText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for kids
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.cancel(); // Stop previous
    window.speechSynthesis.speak(utterance);
  }
};