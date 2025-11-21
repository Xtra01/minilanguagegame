
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyItem } from "../types";

// Initialize Gemini
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Missing API Key: Online features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * 🚀 ULTRA-COMPREHENSIVE EMOJI DICTIONARY (Ages 4-6)
 * Covers: Food, Animals, Nature, Home, School, Clothes, Body, Vehicles, Verbs, Adjectives
 */
const OFFLINE_DICTIONARY: Record<string, Partial<VocabularyItem>> = {
  // --- FRUITS & VEGETABLES ---
  "apple": { emoji: "🍎", definition: "A red crunchy fruit.", simpleSentence: "I eat a red apple.", isPlural: false },
  "green apple": { emoji: "🍏", definition: "A sour green fruit.", simpleSentence: "Green apples are sour.", isPlural: false },
  "banana": { emoji: "🍌", definition: "A long yellow fruit.", simpleSentence: "Monkeys love bananas.", isPlural: false },
  "orange": { emoji: "🍊", definition: "A round orange fruit.", simpleSentence: "Oranges have juice.", isPlural: false },
  "grape": { emoji: "🍇", definition: "Small purple balls.", simpleSentence: "Grapes are sweet.", isPlural: false },
  "melon": { emoji: "🍈", definition: "A sweet green fruit.", simpleSentence: "Melon is yummy.", isPlural: false },
  "watermelon": { emoji: "🍉", definition: "Big green fruit with red inside.", simpleSentence: "Watermelon is wet.", isPlural: false },
  "lemon": { emoji: "🍋", definition: "Sour yellow fruit.", simpleSentence: "Lemons make lemonade.", isPlural: false },
  "cherry": { emoji: "🍒", definition: "Small red fruit.", simpleSentence: "Cherry on top.", isPlural: false },
  "strawberry": { emoji: "🍓", definition: "Red berry with seeds.", simpleSentence: "I love strawberries.", isPlural: false },
  "pear": { emoji: "🍐", definition: "Green sweet fruit.", simpleSentence: "Eat a pear.", isPlural: false },
  "peach": { emoji: "🍑", definition: "Pink soft fruit.", simpleSentence: "Peaches are fuzzy.", isPlural: false },
  "coconut": { emoji: "🥥", definition: "Hard brown nut.", simpleSentence: "Coconut milk.", isPlural: false },
  "mango": { emoji: "🥭", definition: "Sweet yellow fruit.", simpleSentence: "Mango is tropical.", isPlural: false },
  "pineapple": { emoji: "🍍", definition: "Spiky yellow fruit.", simpleSentence: "Pineapple is sweet.", isPlural: false },
  "kiwi": { emoji: "🥝", definition: "Brown fuzzy fruit.", simpleSentence: "Kiwi is green inside.", isPlural: false },
  "tomato": { emoji: "🍅", definition: "Red round vegetable.", simpleSentence: "Tomatoes are red.", isPlural: false },
  "avocado": { emoji: "🥑", definition: "Green healthy food.", simpleSentence: "Green avocado.", isPlural: false },
  "eggplant": { emoji: "🍆", definition: "Purple vegetable.", simpleSentence: "Purple eggplant.", isPlural: false },
  "potato": { emoji: "🥔", definition: "Brown vegetable.", simpleSentence: "Potatoes make fries.", isPlural: false },
  "carrot": { emoji: "🥕", definition: "Orange crunchy vegetable.", simpleSentence: "Rabbits eat carrots.", isPlural: false },
  "corn": { emoji: "🌽", definition: "Yellow sweet kernels.", simpleSentence: "I like corn.", isPlural: false },
  "pepper": { emoji: "🌶️", definition: "Hot red vegetable.", simpleSentence: "Peppers are spicy.", isPlural: false },
  "cucumber": { emoji: "🥒", definition: "Long green vegetable.", simpleSentence: "Crunchy cucumber.", isPlural: false },
  "broccoli": { emoji: "🥦", definition: "Little green trees.", simpleSentence: "Eat your broccoli.", isPlural: false },
  "garlic": { emoji: "🧄", definition: "Smelly white bulb.", simpleSentence: "Garlic smells strong.", isPlural: false },
  "onion": { emoji: "🧅", definition: "Makes you cry.", simpleSentence: "Chop the onion.", isPlural: false },
  "mushroom": { emoji: "🍄", definition: "Soft fungi.", simpleSentence: "Mushrooms on pizza.", isPlural: false },

  // --- FOOD & DRINKS ---
  "bread": { emoji: "🍞", definition: "Soft baked food.", simpleSentence: "I eat bread.", isPlural: false },
  "croissant": { emoji: "🥐", definition: "Moon shaped bread.", simpleSentence: "Yummy croissant.", isPlural: false },
  "baguette": { emoji: "🥖", definition: "Long french bread.", simpleSentence: "Long baguette.", isPlural: false },
  "pretzel": { emoji: "🥨", definition: "Salty twist.", simpleSentence: "Salty pretzel.", isPlural: false },
  "cheese": { emoji: "🧀", definition: "Yellow milk food.", simpleSentence: "Mouse likes cheese.", isPlural: false },
  "egg": { emoji: "🥚", definition: "White oval food.", simpleSentence: "Crack the egg.", isPlural: false },
  "pancake": { emoji: "🥞", definition: "Round breakfast cake.", simpleSentence: "Pancakes with syrup.", isPlural: false },
  "bacon": { emoji: "🥓", definition: "Crispy meat.", simpleSentence: "Bacon and eggs.", isPlural: false },
  "burger": { emoji: "🍔", definition: "Meat in a bun.", simpleSentence: "Big burger.", isPlural: false },
  "fries": { emoji: "🍟", definition: "Fried potatoes.", simpleSentence: "I love french fries.", isPlural: false },
  "pizza": { emoji: "🍕", definition: "Round cheesy pie.", simpleSentence: "Slice of pizza.", isPlural: false },
  "hotdog": { emoji: "🌭", definition: "Sausage in bun.", simpleSentence: "Hot dog with mustard.", isPlural: false },
  "sandwich": { emoji: "🥪", definition: "Food between bread.", simpleSentence: "Ham sandwich.", isPlural: false },
  "taco": { emoji: "🌮", definition: "Crunchy shell food.", simpleSentence: "Taco tuesday.", isPlural: false },
  "soup": { emoji: "🥣", definition: "Hot liquid food.", simpleSentence: "Eat your soup.", isPlural: false },
  "salad": { emoji: "🥗", definition: "Bowl of leaves.", simpleSentence: "Healthy salad.", isPlural: false },
  "popcorn": { emoji: "🍿", definition: "Popped corn snack.", simpleSentence: "Movie popcorn.", isPlural: false },
  "rice": { emoji: "🍚", definition: "White grains.", simpleSentence: "Bowl of rice.", isPlural: false },
  "spaghetti": { emoji: "🍝", definition: "Long noodles.", simpleSentence: "Pasta and sauce.", isPlural: false },
  "noodle": { emoji: "🍜", definition: "Soup with strings.", simpleSentence: "Hot noodles.", isPlural: false },
  "sushi": { emoji: "🍣", definition: "Fish and rice.", simpleSentence: "I like sushi.", isPlural: false },
  "ice cream": { emoji: "🍦", definition: "Cold sweet cone.", simpleSentence: "Lick the ice cream.", isPlural: false },
  "donut": { emoji: "🍩", definition: "Round cake with hole.", simpleSentence: "Sweet donut.", isPlural: false },
  "cookie": { emoji: "🍪", definition: "Sweet round treat.", simpleSentence: "Chocolate chip cookie.", isPlural: false },
  "cake": { emoji: "🍰", definition: "Birthday sweet.", simpleSentence: "Happy birthday cake.", isPlural: false },
  "chocolate": { emoji: "🍫", definition: "Brown candy.", simpleSentence: "Yummy chocolate.", isPlural: false },
  "candy": { emoji: "🍬", definition: "Sweet treat.", simpleSentence: "Sweet candy.", isPlural: false },
  "lollipop": { emoji: "🍭", definition: "Candy on a stick.", simpleSentence: "Lick the lollipop.", isPlural: false },
  "milk": { emoji: "🥛", definition: "White drink from cows.", simpleSentence: "Drink your milk.", isPlural: false },
  "coffee": { emoji: "☕", definition: "Hot dark drink.", simpleSentence: "Mom drinks coffee.", isPlural: false },
  "tea": { emoji: "🍵", definition: "Hot leaf drink.", simpleSentence: "Cup of tea.", isPlural: false },
  "juice": { emoji: "🧃", definition: "Fruit drink.", simpleSentence: "Apple juice box.", isPlural: false },
  "water": { emoji: "💧", definition: "Clear drink.", simpleSentence: "Drink water.", isPlural: false },
  
  // --- ANIMALS ---
  "monkey": { emoji: "🐵", definition: "Funny climber.", simpleSentence: "Monkey eats banana.", isPlural: false },
  "dog": { emoji: "🐶", definition: "Loyal pet.", simpleSentence: "Dog says woof.", isPlural: false },
  "wolf": { emoji: "🐺", definition: "Wild dog.", simpleSentence: "Wolf howls.", isPlural: false },
  "fox": { emoji: "🦊", definition: "Orange wild animal.", simpleSentence: "Fox is sneaky.", isPlural: false },
  "cat": { emoji: "🐱", definition: "Small pet.", simpleSentence: "Cat says meow.", isPlural: false },
  "lion": { emoji: "🦁", definition: "King of jungle.", simpleSentence: "Lion roars.", isPlural: false },
  "tiger": { emoji: "🐯", definition: "Striped cat.", simpleSentence: "Tiger runs fast.", isPlural: false },
  "horse": { emoji: "🐴", definition: "Fast riding animal.", simpleSentence: "Ride a horse.", isPlural: false },
  "unicorn": { emoji: "🦄", definition: "Magical horse.", simpleSentence: "Unicorn has a horn.", isPlural: false },
  "zebra": { emoji: "🦓", definition: "Striped horse.", simpleSentence: "Black and white zebra.", isPlural: false },
  "cow": { emoji: "🐮", definition: "Farm animal.", simpleSentence: "Cow gives milk.", isPlural: false },
  "pig": { emoji: "🐷", definition: "Pink animal.", simpleSentence: "Pig says oink.", isPlural: false },
  "sheep": { emoji: "🐑", definition: "Wooly animal.", simpleSentence: "Sheep says baa.", isPlural: false },
  "goat": { emoji: "🐐", definition: "Animal with horns.", simpleSentence: "Goat climbs.", isPlural: false },
  "camel": { emoji: "🐫", definition: "Desert animal.", simpleSentence: "Camel has a hump.", isPlural: false },
  "giraffe": { emoji: "🦒", definition: "Long neck animal.", simpleSentence: "Giraffe is tall.", isPlural: false },
  "elephant": { emoji: "🐘", definition: "Big gray animal.", simpleSentence: "Elephant has a trunk.", isPlural: false },
  "mouse": { emoji: "🐭", definition: "Small rodent.", simpleSentence: "Mouse squeaks.", isPlural: false },
  "rat": { emoji: "🐀", definition: "Big mouse.", simpleSentence: "Rat runs fast.", isPlural: false },
  "rabbit": { emoji: "🐰", definition: "Long ears.", simpleSentence: "Rabbit hops.", isPlural: false },
  "squirrel": { emoji: "🐿️", definition: "Nut eater.", simpleSentence: "Squirrel climbs trees.", isPlural: false },
  "bear": { emoji: "🐻", definition: "Big sleepy animal.", simpleSentence: "Bear sleeps in cave.", isPlural: false },
  "panda": { emoji: "🐼", definition: "Black and white bear.", simpleSentence: "Panda eats bamboo.", isPlural: false },
  "kangaroo": { emoji: "🦘", definition: "Jumping animal.", simpleSentence: "Kangaroo jumps high.", isPlural: false },
  "chicken": { emoji: "🐔", definition: "Farm bird.", simpleSentence: "Chicken lays eggs.", isPlural: false },
  "rooster": { emoji: "🐓", definition: "Boy chicken.", simpleSentence: "Rooster wakes us up.", isPlural: false },
  "chick": { emoji: "🐥", definition: "Baby chicken.", simpleSentence: "Little yellow chick.", isPlural: false },
  "bird": { emoji: "🐦", definition: "Flying animal.", simpleSentence: "Bird sings.", isPlural: false },
  "penguin": { emoji: "🐧", definition: "Cold bird.", simpleSentence: "Penguin waddles.", isPlural: false },
  "eagle": { emoji: "🦅", definition: "Big bird.", simpleSentence: "Eagle flies high.", isPlural: false },
  "duck": { emoji: "🦆", definition: "Water bird.", simpleSentence: "Duck quacks.", isPlural: false },
  "owl": { emoji: "🦉", definition: "Night bird.", simpleSentence: "Owl says hoot.", isPlural: false },
  "frog": { emoji: "🐸", definition: "Green jumper.", simpleSentence: "Frog says ribbit.", isPlural: false },
  "crocodile": { emoji: "🐊", definition: "Big teeth reptile.", simpleSentence: "Snap snap crocodile.", isPlural: false },
  "turtle": { emoji: "🐢", definition: "Slow shell animal.", simpleSentence: "Turtle is slow.", isPlural: false },
  "snake": { emoji: "🐍", definition: "Long reptile.", simpleSentence: "Snake hisses.", isPlural: false },
  "dragon": { emoji: "🐉", definition: "Fire breather.", simpleSentence: "Dragon flies.", isPlural: false },
  "whale": { emoji: "🐳", definition: "Big sea animal.", simpleSentence: "Whale swims.", isPlural: false },
  "dolphin": { emoji: "🐬", definition: "Smart sea animal.", simpleSentence: "Dolphin jumps.", isPlural: false },
  "fish": { emoji: "🐟", definition: "Swims in water.", simpleSentence: "Fish bubbles.", isPlural: false },
  "shark": { emoji: "🦈", definition: "Big teeth fish.", simpleSentence: "Shark swims fast.", isPlural: false },
  "octopus": { emoji: "🐙", definition: "Eight legs.", simpleSentence: "Octopus in the sea.", isPlural: false },
  "crab": { emoji: "🦀", definition: "Pinchy shell.", simpleSentence: "Crab walks sideways.", isPlural: false },
  "shrimp": { emoji: "🦐", definition: "Small sea food.", simpleSentence: "Little pink shrimp.", isPlural: false },
  "snail": { emoji: "🐌", definition: "Shell bug.", simpleSentence: "Snail is slow.", isPlural: false },
  "butterfly": { emoji: "🦋", definition: "Pretty wings.", simpleSentence: "Butterfly flies.", isPlural: false },
  "bug": { emoji: "🐛", definition: "Small crawler.", simpleSentence: "Green bug.", isPlural: false },
  "ant": { emoji: "🐜", definition: "Tiny worker.", simpleSentence: "Ants march.", isPlural: false },
  "bee": { emoji: "🐝", definition: "Honey maker.", simpleSentence: "Bee buzzes.", isPlural: false },
  "spider": { emoji: "🕷️", definition: "Eight legs.", simpleSentence: "Spider spins web.", isPlural: false },
  "dinosaur": { emoji: "🦖", definition: "Old big lizard.", simpleSentence: "T-Rex roars.", isPlural: false },

  // --- NATURE ---
  "flower": { emoji: "🌸", definition: "Pretty plant.", simpleSentence: "Smell the flower.", isPlural: false },
  "rose": { emoji: "🌹", definition: "Red flower.", simpleSentence: "Red rose.", isPlural: false },
  "sunflower": { emoji: "🌻", definition: "Yellow tall flower.", simpleSentence: "Big sunflower.", isPlural: false },
  "tree": { emoji: "🌳", definition: "Tall plant.", simpleSentence: "Climb the tree.", isPlural: false },
  "palm tree": { emoji: "🌴", definition: "Beach tree.", simpleSentence: "Coconuts grow here.", isPlural: false },
  "cactus": { emoji: "🌵", definition: "Spiky plant.", simpleSentence: "Don't touch cactus.", isPlural: false },
  "grass": { emoji: "🌿", definition: "Green ground.", simpleSentence: "Green grass.", isPlural: false },
  "leaf": { emoji: "🍁", definition: "Part of tree.", simpleSentence: "Fall leaf.", isPlural: false },
  "earth": { emoji: "🌍", definition: "Our planet.", simpleSentence: "We live on Earth.", isPlural: false },
  "moon": { emoji: "🌙", definition: "Night light.", simpleSentence: "Goodnight moon.", isPlural: false },
  "sun": { emoji: "☀️", definition: "Day light.", simpleSentence: "Sun is hot.", isPlural: false },
  "star": { emoji: "⭐", definition: "Twinkle light.", simpleSentence: "Star in the sky.", isPlural: false },
  "cloud": { emoji: "☁️", definition: "White fluff.", simpleSentence: "Cloud in sky.", isPlural: false },
  "rain": { emoji: "🌧️", definition: "Water from sky.", simpleSentence: "Rain falls down.", isPlural: false },
  "snow": { emoji: "❄️", definition: "Cold ice.", simpleSentence: "Snow is cold.", isPlural: false },
  "fire": { emoji: "🔥", definition: "Hot burn.", simpleSentence: "Fire is hot.", isPlural: false },
  "water": { emoji: "💧", definition: "Wet liquid.", simpleSentence: "Water is wet.", isPlural: false },
  "rainbow": { emoji: "🌈", definition: "Colors in sky.", simpleSentence: "Pretty rainbow.", isPlural: false },
  "ocean": { emoji: "🌊", definition: "Big water.", simpleSentence: "Blue ocean.", isPlural: false },

  // --- BODY PARTS ---
  "eye": { emoji: "👁️", definition: "To see.", simpleSentence: "Open your eye.", isPlural: false },
  "eyes": { emoji: "👀", definition: "Two to see.", simpleSentence: "Look with eyes.", isPlural: true },
  "nose": { emoji: "👃", definition: "To smell.", simpleSentence: "Touch your nose.", isPlural: false },
  "mouth": { emoji: "👄", definition: "To eat.", simpleSentence: "Open your mouth.", isPlural: false },
  "ear": { emoji: "👂", definition: "To hear.", simpleSentence: "Listen with ear.", isPlural: false },
  "foot": { emoji: "🦶", definition: "To walk.", simpleSentence: "Stomp your foot.", isPlural: false },
  "leg": { emoji: "🦵", definition: "To run.", simpleSentence: "Kick with leg.", isPlural: false },
  "arm": { emoji: "💪", definition: "To lift.", simpleSentence: "Strong arm.", isPlural: false },
  "hand": { emoji: "✋", definition: "To hold.", simpleSentence: "Wave your hand.", isPlural: false },
  "finger": { emoji: "👆", definition: "To point.", simpleSentence: "Point your finger.", isPlural: false },
  "tooth": { emoji: "🦷", definition: "To chew.", simpleSentence: "Brush your tooth.", isPlural: false },
  "tongue": { emoji: "👅", definition: "To taste.", simpleSentence: "Stick out tongue.", isPlural: false },
  "brain": { emoji: "🧠", definition: "To think.", simpleSentence: "Use your brain.", isPlural: false },
  "heart": { emoji: "❤️", definition: "Love shape.", simpleSentence: "Heart beats.", isPlural: false },

  // --- CLOTHES ---
  "glasses": { emoji: "👓", definition: "For eyes.", simpleSentence: "Wear glasses.", isPlural: true },
  "sunglasses": { emoji: "🕶️", definition: "For sun.", simpleSentence: "Cool sunglasses.", isPlural: true },
  "tie": { emoji: "👔", definition: "Neck cloth.", simpleSentence: "Dad wears a tie.", isPlural: false },
  "shirt": { emoji: "👕", definition: "Top clothes.", simpleSentence: "Blue shirt.", isPlural: false },
  "jeans": { emoji: "👖", definition: "Blue pants.", simpleSentence: "Wear your jeans.", isPlural: true },
  "scarf": { emoji: "🧣", definition: "Neck warmer.", simpleSentence: "Warm scarf.", isPlural: false },
  "gloves": { emoji: "🧤", definition: "Hand warmer.", simpleSentence: "Wear gloves.", isPlural: true },
  "coat": { emoji: "🧥", definition: "Winter jacket.", simpleSentence: "Put on coat.", isPlural: false },
  "socks": { emoji: "🧦", definition: "Foot warmer.", simpleSentence: "Put on socks.", isPlural: true },
  "dress": { emoji: "👗", definition: "Girl clothes.", simpleSentence: "Pretty dress.", isPlural: false },
  "bikini": { emoji: "👙", definition: "Swim suit.", simpleSentence: "Swim in bikini.", isPlural: false },
  "bag": { emoji: "👜", definition: "Carry things.", simpleSentence: "Mom's bag.", isPlural: false },
  "backpack": { emoji: "🎒", definition: "School bag.", simpleSentence: "School backpack.", isPlural: false },
  "shoe": { emoji: "👟", definition: "Foot wear.", simpleSentence: "Tie your shoe.", isPlural: false },
  "shoes": { emoji: "👟", definition: "Feet wear.", simpleSentence: "Running shoes.", isPlural: true },
  "boot": { emoji: "👢", definition: "Tall shoe.", simpleSentence: "Rain boot.", isPlural: false },
  "crown": { emoji: "👑", definition: "King hat.", simpleSentence: "Gold crown.", isPlural: false },
  "hat": { emoji: "🧢", definition: "Head wear.", simpleSentence: "Blue hat.", isPlural: false },
  "ring": { emoji: "💍", definition: "Finger jewelry.", simpleSentence: "Shiny ring.", isPlural: false },
  "lipstick": { emoji: "💄", definition: "Lip color.", simpleSentence: "Red lipstick.", isPlural: false },

  // --- HOUSE & OBJECTS ---
  "door": { emoji: "🚪", definition: "Entry way.", simpleSentence: "Open the door.", isPlural: false },
  "chair": { emoji: "🪑", definition: "Sit here.", simpleSentence: "Sit on chair.", isPlural: false },
  "toilet": { emoji: "🚽", definition: "Bathroom seat.", simpleSentence: "Go to toilet.", isPlural: false },
  "shower": { emoji: "🚿", definition: "Wash body.", simpleSentence: "Take a shower.", isPlural: false },
  "bath": { emoji: "🛁", definition: "Soak body.", simpleSentence: "Bubble bath.", isPlural: false },
  "soap": { emoji: "🧼", definition: "Clean bubbles.", simpleSentence: "Wash with soap.", isPlural: false },
  "bed": { emoji: "🛏️", definition: "Sleep here.", simpleSentence: "Go to bed.", isPlural: false },
  "couch": { emoji: "🛋️", definition: "Soft seat.", simpleSentence: "Sit on couch.", isPlural: false },
  "key": { emoji: "🔑", definition: "Unlocks door.", simpleSentence: "Car key.", isPlural: false },
  "hammer": { emoji: "🔨", definition: "HITS nails.", simpleSentence: "Bang with hammer.", isPlural: false },
  "gun": { emoji: "🔫", definition: "Water toy.", simpleSentence: "Water gun.", isPlural: false },
  "bomb": { emoji: "💣", definition: "Boom ball.", simpleSentence: "Boom!", isPlural: false },
  "shield": { emoji: "🛡️", definition: "Protection.", simpleSentence: "Knight shield.", isPlural: false },
  "magnet": { emoji: "🧲", definition: "Sticky metal.", simpleSentence: "Magnet sticks.", isPlural: false },
  "test tube": { emoji: "🧪", definition: "Science glass.", simpleSentence: "Science test.", isPlural: false },
  "box": { emoji: "📦", definition: "Container.", simpleSentence: "Open the box.", isPlural: false },
  "broom": { emoji: "🧹", definition: "Sweeps floor.", simpleSentence: "Sweep with broom.", isPlural: false },
  "basket": { emoji: "🧺", definition: "Carry clothes.", simpleSentence: "Picnic basket.", isPlural: false },
  "balloon": { emoji: "🎈", definition: "Air ball.", simpleSentence: "Red balloon.", isPlural: false },
  "gift": { emoji: "🎁", definition: "Present.", simpleSentence: "Open the gift.", isPlural: false },
  "envelope": { emoji: "✉️", definition: "Mail holder.", simpleSentence: "Read the letter.", isPlural: false },
  "pencil": { emoji: "✏️", definition: "Write tool.", simpleSentence: "Yellow pencil.", isPlural: false },
  "pen": { emoji: "🖊️", definition: "Ink tool.", simpleSentence: "Blue pen.", isPlural: false },
  "book": { emoji: "📖", definition: "Read story.", simpleSentence: "Read a book.", isPlural: false },
  "computer": { emoji: "💻", definition: "Work machine.", simpleSentence: "Laptop computer.", isPlural: false },
  "phone": { emoji: "📱", definition: "Call tool.", simpleSentence: "Mom's phone.", isPlural: false },
  "camera": { emoji: "📷", definition: "Photo tool.", simpleSentence: "Take a picture.", isPlural: false },
  "tv": { emoji: "📺", definition: "Watch cartoons.", simpleSentence: "Turn on TV.", isPlural: false },
  "battery": { emoji: "🔋", definition: "Power pack.", simpleSentence: "Green battery.", isPlural: false },
  "money": { emoji: "💵", definition: "Buy things.", simpleSentence: "Save money.", isPlural: false },
  "clock": { emoji: "⏰", definition: "Tells time.", simpleSentence: "Alarm clock.", isPlural: false },
  "candle": { emoji: "🕯️", definition: "Wax light.", simpleSentence: "Blow the candle.", isPlural: false },
  "bulb": { emoji: "💡", definition: "Electric light.", simpleSentence: "Light bulb.", isPlural: false },
  "trash": { emoji: "🗑️", definition: "Garbage can.", simpleSentence: "Throw in trash.", isPlural: false },

  // --- TRANSPORT ---
  "car": { emoji: "🚗", definition: "Drive on road.", simpleSentence: "Red car.", isPlural: false },
  "taxi": { emoji: "🚕", definition: "Yellow car.", simpleSentence: "Yellow taxi.", isPlural: false },
  "bus": { emoji: "🚌", definition: "Big car.", simpleSentence: "School bus.", isPlural: false },
  "ambulance": { emoji: "🚑", definition: "Hospital car.", simpleSentence: "Ambulance siren.", isPlural: false },
  "police": { emoji: "🚓", definition: "Cop car.", simpleSentence: "Police car.", isPlural: false },
  "firetruck": { emoji: "🚒", definition: "Fire car.", simpleSentence: "Red firetruck.", isPlural: false },
  "scooter": { emoji: "🛴", definition: "Push ride.", simpleSentence: "Ride scooter.", isPlural: false },
  "bike": { emoji: "🚲", definition: "Two wheels.", simpleSentence: "Ride your bike.", isPlural: false },
  "motorcycle": { emoji: "🏍️", definition: "Fast bike.", simpleSentence: "Vroom vroom.", isPlural: false },
  "train": { emoji: "🚂", definition: "Track ride.", simpleSentence: "Choo choo train.", isPlural: false },
  "plane": { emoji: "✈️", definition: "Sky ride.", simpleSentence: "Airplane flies.", isPlural: false },
  "helicopter": { emoji: "🚁", definition: "Spinning fly.", simpleSentence: "Helicopter spins.", isPlural: false },
  "rocket": { emoji: "🚀", definition: "Space ride.", simpleSentence: "Rocket to moon.", isPlural: false },
  "boat": { emoji: "⛵", definition: "Water ride.", simpleSentence: "Sail the boat.", isPlural: false },
  "ship": { emoji: "🚢", definition: "Big boat.", simpleSentence: "Big ship.", isPlural: false },
  "tractor": { emoji: "🚜", definition: "Farm truck.", simpleSentence: "Green tractor.", isPlural: false },

  // --- SPORTS & TOYS ---
  "ball": { emoji: "⚽", definition: "Round toy.", simpleSentence: "Kick the ball.", isPlural: false },
  "basketball": { emoji: "🏀", definition: "Orange ball.", simpleSentence: "Bounce ball.", isPlural: false },
  "football": { emoji: "🏈", definition: "Oval ball.", simpleSentence: "Throw football.", isPlural: false },
  "tennis": { emoji: "🎾", definition: "Green ball.", simpleSentence: "Tennis ball.", isPlural: false },
  "volleyball": { emoji: "🏐", definition: "White ball.", simpleSentence: "Hit the ball.", isPlural: false },
  "trophy": { emoji: "🏆", definition: "Win cup.", simpleSentence: "Winner trophy.", isPlural: false },
  "medal": { emoji: "🥇", definition: "Gold coin.", simpleSentence: "Number one.", isPlural: false },
  "kite": { emoji: "🪁", definition: "Wind toy.", simpleSentence: "Fly a kite.", isPlural: false },
  "teddy": { emoji: "🧸", definition: "Soft bear.", simpleSentence: "Hug teddy.", isPlural: false },
  "robot": { emoji: "🤖", definition: "Metal man.", simpleSentence: "Beep boop robot.", isPlural: false },
  "doll": { emoji: "🎎", definition: "Toy person.", simpleSentence: "Play with doll.", isPlural: false },

  // --- COLORS & SHAPES ---
  "red": { emoji: "🔴", definition: "Apple color.", simpleSentence: "Red circle.", isPlural: false },
  "orange color": { emoji: "🟠", definition: "Orange color.", simpleSentence: "Orange circle.", isPlural: false },
  "yellow": { emoji: "🟡", definition: "Sun color.", simpleSentence: "Yellow circle.", isPlural: false },
  "green": { emoji: "🟢", definition: "Grass color.", simpleSentence: "Green circle.", isPlural: false },
  "blue": { emoji: "🔵", definition: "Sky color.", simpleSentence: "Blue circle.", isPlural: false },
  "purple": { emoji: "🟣", definition: "Grape color.", simpleSentence: "Purple circle.", isPlural: false },
  "brown": { emoji: "🟤", definition: "Bear color.", simpleSentence: "Brown circle.", isPlural: false },
  "black": { emoji: "⚫", definition: "Night color.", simpleSentence: "Black circle.", isPlural: false },
  "white": { emoji: "⚪", definition: "Snow color.", simpleSentence: "White circle.", isPlural: false },
  
  // --- PEOPLE ---
  "baby": { emoji: "👶", definition: "Little human.", simpleSentence: "Cute baby.", isPlural: false },
  "boy": { emoji: "👦", definition: "Young man.", simpleSentence: "He is a boy.", isPlural: false },
  "girl": { emoji: "👧", definition: "Young woman.", simpleSentence: "She is a girl.", isPlural: false },
  "man": { emoji: "👨", definition: "Adult male.", simpleSentence: "Tall man.", isPlural: false },
  "woman": { emoji: "👩", definition: "Adult female.", simpleSentence: "Nice woman.", isPlural: false },
  "grandma": { emoji: "👵", definition: "Old mom.", simpleSentence: "Love grandma.", isPlural: false },
  "grandpa": { emoji: "👴", definition: "Old dad.", simpleSentence: "Love grandpa.", isPlural: false },
  "police officer": { emoji: "👮", definition: "Helps us.", simpleSentence: "Police officer.", isPlural: false },
  "doctor": { emoji: "👨‍⚕️", definition: "Helps sick.", simpleSentence: "Doctor helps.", isPlural: false },
  "cook": { emoji: "👨‍🍳", definition: "Makes food.", simpleSentence: "Cook dinner.", isPlural: false },
  "king": { emoji: "🤴", definition: "Ruler man.", simpleSentence: "The King.", isPlural: false },
  "queen": { emoji: "👸", definition: "Ruler woman.", simpleSentence: "The Queen.", isPlural: false },
  "santa": { emoji: "🎅", definition: "Christmas man.", simpleSentence: "Santa Claus.", isPlural: false },
  "ghost": { emoji: "👻", definition: "Boo spirit.", simpleSentence: "Scary ghost.", isPlural: false },
  "alien": { emoji: "👽", definition: "Space man.", simpleSentence: "Green alien.", isPlural: false },

  // --- VERBS & FEELINGS ---
  "smile": { emoji: "😄", definition: "Happy face.", simpleSentence: "Big smile.", isPlural: false },
  "laugh": { emoji: "😆", definition: "Funny haha.", simpleSentence: "Laugh loud.", isPlural: false },
  "cry": { emoji: "😢", definition: "Sad water.", simpleSentence: "Don't cry.", isPlural: false },
  "angry": { emoji: "😠", definition: "Mad face.", simpleSentence: "He is angry.", isPlural: false },
  "sleep": { emoji: "😴", definition: "Rest eyes.", simpleSentence: "Go to sleep.", isPlural: false },
  "love": { emoji: "😍", definition: "Heart feeling.", simpleSentence: "I love you.", isPlural: false },
  "sick": { emoji: "🤒", definition: "Not good.", simpleSentence: "I feel sick.", isPlural: false },
  "think": { emoji: "🤔", definition: "Use brain.", simpleSentence: "Let me think.", isPlural: false },
  "run": { emoji: "🏃", definition: "Move fast.", simpleSentence: "Run fast.", isPlural: false },
  "walk": { emoji: "🚶", definition: "Move slow.", simpleSentence: "Walk slow.", isPlural: false },
  "dance": { emoji: "💃", definition: "Move to music.", simpleSentence: "Dance now.", isPlural: false },
  "swim": { emoji: "🏊", definition: "Water move.", simpleSentence: "Swim pool.", isPlural: false },
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
 * ENHANCED: Now handles fuzzy matching and plurals smartly
 */
const generateOfflineContent = (words: string[]): VocabularyItem[] => {
  return words.map((word, index) => {
    const lowerWord = word.toLowerCase().trim();
    
    // 1. Try exact match
    let dbEntry = OFFLINE_DICTIONARY[lowerWord];
    let foundIsPlural = false;
    let displayWord = word;
    
    // 2. Try singular match if plural not found (e.g., user types "dogs", we have "dog")
    if (!dbEntry && lowerWord.endsWith('s')) {
        const singular = lowerWord.slice(0, -1);
        if (OFFLINE_DICTIONARY[singular]) {
            dbEntry = OFFLINE_DICTIONARY[singular];
            foundIsPlural = true;
            // Improve: If user typed "Dogs", keep English as "Dogs" but use "Dog" data
            displayWord = word.charAt(0).toUpperCase() + word.slice(1);
        }
    }

    // 3. Try without 'es' (e.g. potatoes -> potato)
    if (!dbEntry && lowerWord.endsWith('es')) {
        const singular = lowerWord.slice(0, -2);
        if (OFFLINE_DICTIONARY[singular]) {
            dbEntry = OFFLINE_DICTIONARY[singular];
            foundIsPlural = true;
             displayWord = word.charAt(0).toUpperCase() + word.slice(1);
        }
    }

    if (dbEntry) {
      return {
        id: `offline-${index}-${Date.now()}`,
        english: displayWord, // Use the capitalization from logic or input
        definition: dbEntry.definition || "A word to learn.",
        emoji: dbEntry.emoji || "📝",
        simpleSentence: dbEntry.simpleSentence || `This is a ${word}.`,
        // Use database plural flag OR derived flag from input
        isPlural: dbEntry.isPlural || foundIsPlural,
      };
    } else {
      // Generic fallback for unknown offline words
      // IMPROVEMENT: Do not return star emoji if we can avoid it. 
      // We return a specific visual placeholder logic in WordVisual.tsx
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
