import "dotenv/config";
import { db } from "../db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Expanded vocabulary seeding script
 * Adds Prepositions, Common Phrases, Pronouns, Conjunctions, Jobs,
 * Weather, Animals, Body Parts, Clothes, and Countries & Travel
 *
 * Run with: tsx scripts/seed-expanded-vocab.ts
 */

// ─── Level 1: Prepositions ───────────────────────────────────────────

const prepositions = [
  { farsiWord: "در", phonetic: "dar", englishTranslation: "In / At", exampleFarsi: "من در خانه هستم", examplePhonetic: "man dar khaneh hastam", exampleEnglish: "I am at home", difficultyLevel: 1 },
  { farsiWord: "به", phonetic: "be", englishTranslation: "To", exampleFarsi: "من به مدرسه می‌روم", examplePhonetic: "man be madrese miravam", exampleEnglish: "I go to school", difficultyLevel: 1 },
  { farsiWord: "از", phonetic: "az", englishTranslation: "From / Of", exampleFarsi: "من از ایران هستم", examplePhonetic: "man az iran hastam", exampleEnglish: "I am from Iran", difficultyLevel: 1 },
  { farsiWord: "با", phonetic: "ba", englishTranslation: "With", exampleFarsi: "من با دوستم رفتم", examplePhonetic: "man ba doostam raftam", exampleEnglish: "I went with my friend", difficultyLevel: 1 },
  { farsiWord: "برای", phonetic: "baraye", englishTranslation: "For", exampleFarsi: "این برای تو است", examplePhonetic: "in baraye to ast", exampleEnglish: "This is for you", difficultyLevel: 1 },
  { farsiWord: "بدون", phonetic: "bedoone", englishTranslation: "Without", exampleFarsi: "بدون تو نمی‌روم", examplePhonetic: "bedoone to nemiravam", exampleEnglish: "I won't go without you", difficultyLevel: 1 },
  { farsiWord: "روی", phonetic: "rooye", englishTranslation: "On / On top of", exampleFarsi: "کتاب روی میز است", examplePhonetic: "ketab rooye miz ast", exampleEnglish: "The book is on the table", difficultyLevel: 1 },
  { farsiWord: "زیر", phonetic: "zire", englishTranslation: "Under / Below", exampleFarsi: "گربه زیر میز است", examplePhonetic: "gorbe zire miz ast", exampleEnglish: "The cat is under the table", difficultyLevel: 1 },
  { farsiWord: "کنار", phonetic: "kenare", englishTranslation: "Next to / Beside", exampleFarsi: "من کنار پنجره نشستم", examplePhonetic: "man kenare panjereh neshastam", exampleEnglish: "I sat next to the window", difficultyLevel: 1 },
  { farsiWord: "بین", phonetic: "beyne", englishTranslation: "Between", exampleFarsi: "مدرسه بین خانه و پارک است", examplePhonetic: "madrese beyne khaneh va park ast", exampleEnglish: "The school is between the house and the park", difficultyLevel: 1 },
];

// ─── Level 1: Common Phrases ────────────────────────────────────────

const commonPhrases = [
  { farsiWord: "خوش آمدید", phonetic: "khosh amadid", englishTranslation: "Welcome", exampleFarsi: "به ایران خوش آمدید", examplePhonetic: "be iran khosh amadid", exampleEnglish: "Welcome to Iran", difficultyLevel: 1 },
  { farsiWord: "ببخشید", phonetic: "bebakhshid", englishTranslation: "Excuse me / Sorry", exampleFarsi: "ببخشید، ساعت چند است؟", examplePhonetic: "bebakhshid, saat chand ast?", exampleEnglish: "Excuse me, what time is it?", difficultyLevel: 1 },
  { farsiWord: "لطفاً", phonetic: "lotfan", englishTranslation: "Please", exampleFarsi: "لطفاً بنشینید", examplePhonetic: "lotfan beneshinid", exampleEnglish: "Please sit down", difficultyLevel: 1 },
  { farsiWord: "خداحافظ", phonetic: "khodahafez", englishTranslation: "Goodbye / Bye", exampleFarsi: "خداحافظ، به امید دیدار", examplePhonetic: "khodahafez, be omide didar", exampleEnglish: "Goodbye, hope to see you again", difficultyLevel: 1 },
  { farsiWord: "صبح بخیر", phonetic: "sobh bekheyr", englishTranslation: "Good morning", exampleFarsi: "صبح بخیر، چطوری؟", examplePhonetic: "sobh bekheyr, chetori?", exampleEnglish: "Good morning, how are you?", difficultyLevel: 1 },
  { farsiWord: "شب بخیر", phonetic: "shab bekheyr", englishTranslation: "Good night", exampleFarsi: "شب بخیر، خواب خوب", examplePhonetic: "shab bekheyr, khab khoob", exampleEnglish: "Good night, sleep well", difficultyLevel: 1 },
  { farsiWord: "چطوری", phonetic: "chetori", englishTranslation: "How are you (informal)", exampleFarsi: "سلام، چطوری؟", examplePhonetic: "salaam, chetori?", exampleEnglish: "Hi, how are you?", difficultyLevel: 1 },
  { farsiWord: "خوبم", phonetic: "khoobam", englishTranslation: "I'm fine / I'm good", exampleFarsi: "ممنون، خوبم", examplePhonetic: "mamnoon, khoobam", exampleEnglish: "Thanks, I'm fine", difficultyLevel: 1 },
  { farsiWord: "متشکرم", phonetic: "moteshakeram", englishTranslation: "Thank you (formal) / Thanks", exampleFarsi: "خیلی متشکرم", examplePhonetic: "kheyli moteshakeram", exampleEnglish: "Thank you very much", difficultyLevel: 1 },
  { farsiWord: "خواهش می‌کنم", phonetic: "khahesh mikonam", englishTranslation: "You're welcome", exampleFarsi: "خواهش می‌کنم، کاری نکردم", examplePhonetic: "khahesh mikonam, kari nakardam", exampleEnglish: "You're welcome, it was nothing", difficultyLevel: 1 },
];

// ─── Level 1: Demonstratives & Pronouns ─────────────────────────────

const pronouns = [
  { farsiWord: "این", phonetic: "in", englishTranslation: "This", exampleFarsi: "این کتاب من است", examplePhonetic: "in ketab mane ast", exampleEnglish: "This is my book", difficultyLevel: 1 },
  { farsiWord: "آن", phonetic: "aan", englishTranslation: "That", exampleFarsi: "آن خانه بزرگ است", examplePhonetic: "aan khaneh bozorg ast", exampleEnglish: "That house is big", difficultyLevel: 1 },
  { farsiWord: "اینجا", phonetic: "inja", englishTranslation: "Here", exampleFarsi: "بیا اینجا", examplePhonetic: "biya inja", exampleEnglish: "Come here", difficultyLevel: 1 },
  { farsiWord: "آنجا", phonetic: "oonja", englishTranslation: "There", exampleFarsi: "او آنجا ایستاده", examplePhonetic: "oo oonja istade", exampleEnglish: "He/She is standing there", difficultyLevel: 1 },
  { farsiWord: "من", phonetic: "man", englishTranslation: "I / Me", exampleFarsi: "من دانشجو هستم", examplePhonetic: "man daneshjoo hastam", exampleEnglish: "I am a student", difficultyLevel: 1 },
  { farsiWord: "تو", phonetic: "to", englishTranslation: "You (informal)", exampleFarsi: "تو خوبی؟", examplePhonetic: "to khoobi?", exampleEnglish: "Are you okay?", difficultyLevel: 1 },
  { farsiWord: "او", phonetic: "oo", englishTranslation: "He / She", exampleFarsi: "او معلم است", examplePhonetic: "oo moalem ast", exampleEnglish: "He/She is a teacher", difficultyLevel: 1 },
  { farsiWord: "ما", phonetic: "ma", englishTranslation: "We / Us", exampleFarsi: "ما ایرانی هستیم", examplePhonetic: "ma irani hastim", exampleEnglish: "We are Iranian", difficultyLevel: 1 },
  { farsiWord: "شما", phonetic: "shoma", englishTranslation: "You (formal) / You (plural)", exampleFarsi: "شما از کجا هستید؟", examplePhonetic: "shoma az koja hastid?", exampleEnglish: "Where are you from?", difficultyLevel: 1 },
  { farsiWord: "آنها", phonetic: "aanha", englishTranslation: "They / Them", exampleFarsi: "آنها دوست من هستند", examplePhonetic: "aanha dooste man hastand", exampleEnglish: "They are my friends", difficultyLevel: 1 },
];

// ─── Level 2: Conjunctions & Adverbs ────────────────────────────────

const conjunctions = [
  { farsiWord: "و", phonetic: "va", englishTranslation: "And", exampleFarsi: "من و تو", examplePhonetic: "man va to", exampleEnglish: "Me and you", difficultyLevel: 2 },
  { farsiWord: "اما", phonetic: "amma", englishTranslation: "But / However", exampleFarsi: "خوب است اما گران است", examplePhonetic: "khoob ast amma geraan ast", exampleEnglish: "It's good but expensive", difficultyLevel: 2 },
  { farsiWord: "یا", phonetic: "ya", englishTranslation: "Or", exampleFarsi: "چای یا قهوه؟", examplePhonetic: "chay ya ghahve?", exampleEnglish: "Tea or coffee?", difficultyLevel: 2 },
  { farsiWord: "چون", phonetic: "chon", englishTranslation: "Because", exampleFarsi: "نیامدم چون مریض بودم", examplePhonetic: "nayamadam chon mariz boodam", exampleEnglish: "I didn't come because I was sick", difficultyLevel: 2 },
  { farsiWord: "هم", phonetic: "ham", englishTranslation: "Also / Too", exampleFarsi: "من هم می‌آیم", examplePhonetic: "man ham miyam", exampleEnglish: "I'm coming too", difficultyLevel: 2 },
  { farsiWord: "خیلی", phonetic: "kheyli", englishTranslation: "Very / A lot", exampleFarsi: "خیلی ممنون", examplePhonetic: "kheyli mamnoon", exampleEnglish: "Thank you very much", difficultyLevel: 2 },
  { farsiWord: "کمی", phonetic: "kami", englishTranslation: "A little / A bit", exampleFarsi: "کمی صبر کن", examplePhonetic: "kami sabr kon", exampleEnglish: "Wait a little", difficultyLevel: 2 },
  { farsiWord: "هنوز", phonetic: "hanooz", englishTranslation: "Still / Yet", exampleFarsi: "هنوز نیامده", examplePhonetic: "hanooz nayamade", exampleEnglish: "He/She hasn't come yet", difficultyLevel: 2 },
  { farsiWord: "همیشه", phonetic: "hamishe", englishTranslation: "Always", exampleFarsi: "همیشه خوشحالم", examplePhonetic: "hamishe khoshhalam", exampleEnglish: "I'm always happy", difficultyLevel: 2 },
  { farsiWord: "هرگز", phonetic: "hargez", englishTranslation: "Never", exampleFarsi: "هرگز فراموش نمی‌کنم", examplePhonetic: "hargez faramoosh nemikonam", exampleEnglish: "I will never forget", difficultyLevel: 2 },
  { farsiWord: "الان", phonetic: "alan", englishTranslation: "Now / Right now", exampleFarsi: "الان می‌آیم", examplePhonetic: "alan miyam", exampleEnglish: "I'm coming now", difficultyLevel: 2 },
  { farsiWord: "بعد", phonetic: "ba'd", englishTranslation: "After / Later", exampleFarsi: "بعد می‌بینمت", examplePhonetic: "ba'd mibinamet", exampleEnglish: "See you later", difficultyLevel: 2 },
];

// ─── Level 2: Jobs & Work ───────────────────────────────────────────

const jobs = [
  { farsiWord: "دکتر", phonetic: "doktor", englishTranslation: "Doctor", exampleFarsi: "دکتر مریض را معاینه کرد", examplePhonetic: "doktor mariz ra moayene kard", exampleEnglish: "The doctor examined the patient", difficultyLevel: 2 },
  { farsiWord: "معلم", phonetic: "moalem", englishTranslation: "Teacher", exampleFarsi: "معلم ما خیلی خوب است", examplePhonetic: "moalem ma kheyli khoob ast", exampleEnglish: "Our teacher is very good", difficultyLevel: 2 },
  { farsiWord: "مهندس", phonetic: "mohandes", englishTranslation: "Engineer", exampleFarsi: "برادرم مهندس است", examplePhonetic: "baradaram mohandes ast", exampleEnglish: "My brother is an engineer", difficultyLevel: 2 },
  { farsiWord: "پلیس", phonetic: "polis", englishTranslation: "Police / Police officer", exampleFarsi: "پلیس آمد", examplePhonetic: "polis amad", exampleEnglish: "The police came", difficultyLevel: 2 },
  { farsiWord: "آشپز", phonetic: "ashpaz", englishTranslation: "Chef / Cook", exampleFarsi: "آشپز غذای خوبی پخت", examplePhonetic: "ashpaz ghazaye khoobi pokht", exampleEnglish: "The chef cooked good food", difficultyLevel: 2 },
  { farsiWord: "راننده", phonetic: "ranande", englishTranslation: "Driver", exampleFarsi: "راننده تاکسی بود", examplePhonetic: "ranande taksi bood", exampleEnglish: "He was a taxi driver", difficultyLevel: 2 },
  { farsiWord: "خلبان", phonetic: "khalaban", englishTranslation: "Pilot", exampleFarsi: "خلبان هواپیما را فرود آورد", examplePhonetic: "khalaban havapeyma ra forood avord", exampleEnglish: "The pilot landed the plane", difficultyLevel: 2 },
  { farsiWord: "پرستار", phonetic: "parastar", englishTranslation: "Nurse", exampleFarsi: "پرستار به مریض کمک کرد", examplePhonetic: "parastar be mariz komak kard", exampleEnglish: "The nurse helped the patient", difficultyLevel: 2 },
  { farsiWord: "وکیل", phonetic: "vakil", englishTranslation: "Lawyer", exampleFarsi: "وکیل در دادگاه بود", examplePhonetic: "vakil dar dadgah bood", exampleEnglish: "The lawyer was in court", difficultyLevel: 2 },
  { farsiWord: "دانشجو", phonetic: "daneshjoo", englishTranslation: "Student (university)", exampleFarsi: "من دانشجو هستم", examplePhonetic: "man daneshjoo hastam", exampleEnglish: "I am a student", difficultyLevel: 2 },
  { farsiWord: "هنرمند", phonetic: "honarmand", englishTranslation: "Artist", exampleFarsi: "او یک هنرمند معروف است", examplePhonetic: "oo yek honarmand marouf ast", exampleEnglish: "He/She is a famous artist", difficultyLevel: 2 },
  { farsiWord: "نویسنده", phonetic: "nevisande", englishTranslation: "Writer / Author", exampleFarsi: "نویسنده کتاب جدید نوشت", examplePhonetic: "nevisande ketab jadid nevesht", exampleEnglish: "The writer wrote a new book", difficultyLevel: 2 },
];

// ─── Level 2: Weather ───────────────────────────────────────────────

const weather = [
  { farsiWord: "آفتابی", phonetic: "aftabi", englishTranslation: "Sunny", exampleFarsi: "امروز هوا آفتابی است", examplePhonetic: "emrooz hava aftabi ast", exampleEnglish: "Today is sunny", difficultyLevel: 2 },
  { farsiWord: "بارانی", phonetic: "barani", englishTranslation: "Rainy", exampleFarsi: "فردا بارانی است", examplePhonetic: "farda barani ast", exampleEnglish: "Tomorrow is rainy", difficultyLevel: 2 },
  { farsiWord: "ابری", phonetic: "abri", englishTranslation: "Cloudy", exampleFarsi: "آسمان ابری است", examplePhonetic: "aseman abri ast", exampleEnglish: "The sky is cloudy", difficultyLevel: 2 },
  { farsiWord: "برفی", phonetic: "barfi", englishTranslation: "Snowy", exampleFarsi: "زمستان برفی است", examplePhonetic: "zemestan barfi ast", exampleEnglish: "Winter is snowy", difficultyLevel: 2 },
  { farsiWord: "باد", phonetic: "baad", englishTranslation: "Wind", exampleFarsi: "باد شدید می‌وزد", examplePhonetic: "baad shadid mivazad", exampleEnglish: "A strong wind is blowing", difficultyLevel: 2 },
  { farsiWord: "گرما", phonetic: "garma", englishTranslation: "Heat / Warmth", exampleFarsi: "گرمای تابستان", examplePhonetic: "garmaye tabestaan", exampleEnglish: "The summer heat", difficultyLevel: 2 },
  { farsiWord: "سرما", phonetic: "sarma", englishTranslation: "Cold (noun)", exampleFarsi: "سرمای زمستان", examplePhonetic: "sarmaye zemestaan", exampleEnglish: "The winter cold", difficultyLevel: 2 },
  { farsiWord: "مه", phonetic: "meh", englishTranslation: "Fog", exampleFarsi: "مه شدید است", examplePhonetic: "meh shadid ast", exampleEnglish: "The fog is heavy", difficultyLevel: 2 },
  { farsiWord: "طوفان", phonetic: "toofan", englishTranslation: "Storm", exampleFarsi: "طوفان شدیدی آمد", examplePhonetic: "toofane shadidi amad", exampleEnglish: "A severe storm came", difficultyLevel: 2 },
  { farsiWord: "هوا", phonetic: "hava", englishTranslation: "Weather / Air", exampleFarsi: "هوا خوب است", examplePhonetic: "hava khoob ast", exampleEnglish: "The weather is nice", difficultyLevel: 2 },
];

// ─── Level 2: Animals ───────────────────────────────────────────────

const animals = [
  { farsiWord: "گربه", phonetic: "gorbe", englishTranslation: "Cat", exampleFarsi: "گربه روی مبل خوابیده", examplePhonetic: "gorbe rooye mobl khabide", exampleEnglish: "The cat is sleeping on the couch", difficultyLevel: 2 },
  { farsiWord: "سگ", phonetic: "sag", englishTranslation: "Dog", exampleFarsi: "سگ در حیاط است", examplePhonetic: "sag dar hayat ast", exampleEnglish: "The dog is in the yard", difficultyLevel: 2 },
  { farsiWord: "پرنده", phonetic: "parande", englishTranslation: "Bird", exampleFarsi: "پرنده آواز می‌خواند", examplePhonetic: "parande avaz mikhanad", exampleEnglish: "The bird is singing", difficultyLevel: 2 },
  { farsiWord: "ماهی", phonetic: "mahi", englishTranslation: "Fish", exampleFarsi: "ماهی در آب شنا می‌کند", examplePhonetic: "mahi dar ab shena mikonad", exampleEnglish: "The fish swims in the water", difficultyLevel: 2 },
  { farsiWord: "اسب", phonetic: "asb", englishTranslation: "Horse", exampleFarsi: "اسب سریع می‌دود", examplePhonetic: "asb saree midavad", exampleEnglish: "The horse runs fast", difficultyLevel: 2 },
  { farsiWord: "گاو", phonetic: "gav", englishTranslation: "Cow", exampleFarsi: "گاو شیر می‌دهد", examplePhonetic: "gav shir midahad", exampleEnglish: "The cow gives milk", difficultyLevel: 2 },
  { farsiWord: "گوسفند", phonetic: "gosfand", englishTranslation: "Sheep", exampleFarsi: "گوسفند در مزرعه است", examplePhonetic: "gosfand dar mazraeh ast", exampleEnglish: "The sheep is on the farm", difficultyLevel: 2 },
  { farsiWord: "مرغ", phonetic: "morgh", englishTranslation: "Chicken", exampleFarsi: "مرغ تخم‌مرغ می‌گذارد", examplePhonetic: "morgh tokhmemorgh migozarad", exampleEnglish: "The chicken lays eggs", difficultyLevel: 2 },
  { farsiWord: "شیر", phonetic: "shir", englishTranslation: "Lion / Milk", exampleFarsi: "شیر سلطان جنگل است", examplePhonetic: "shir soltane jangal ast", exampleEnglish: "The lion is the king of the jungle", difficultyLevel: 2 },
  { farsiWord: "فیل", phonetic: "fil", englishTranslation: "Elephant", exampleFarsi: "فیل حیوان بزرگی است", examplePhonetic: "fil heyvane bozorgi ast", exampleEnglish: "The elephant is a big animal", difficultyLevel: 2 },
  { farsiWord: "خرس", phonetic: "khers", englishTranslation: "Bear", exampleFarsi: "خرس در جنگل زندگی می‌کند", examplePhonetic: "khers dar jangal zendegi mikonad", exampleEnglish: "The bear lives in the forest", difficultyLevel: 2 },
  { farsiWord: "خرگوش", phonetic: "khargoosh", englishTranslation: "Rabbit / Bunny", exampleFarsi: "خرگوش هویج دوست دارد", examplePhonetic: "khargoosh havij doost darad", exampleEnglish: "The rabbit likes carrots", difficultyLevel: 2 },
];

// ─── Level 2: Body Parts ────────────────────────────────────────────

const bodyParts = [
  { farsiWord: "سر", phonetic: "sar", englishTranslation: "Head", exampleFarsi: "سرم درد می‌کند", examplePhonetic: "saram dard mikonad", exampleEnglish: "My head hurts", difficultyLevel: 2 },
  { farsiWord: "چشم", phonetic: "cheshm", englishTranslation: "Eye", exampleFarsi: "چشمهای او آبی است", examplePhonetic: "cheshmhaye oo abi ast", exampleEnglish: "His/Her eyes are blue", difficultyLevel: 2 },
  { farsiWord: "گوش", phonetic: "goosh", englishTranslation: "Ear", exampleFarsi: "گوشم درد می‌کند", examplePhonetic: "goosham dard mikonad", exampleEnglish: "My ear hurts", difficultyLevel: 2 },
  { farsiWord: "دهان", phonetic: "dahan", englishTranslation: "Mouth", exampleFarsi: "دهانت را باز کن", examplePhonetic: "dahanet ra baz kon", exampleEnglish: "Open your mouth", difficultyLevel: 2 },
  { farsiWord: "دست", phonetic: "dast", englishTranslation: "Hand / Arm", exampleFarsi: "دستت را بشور", examplePhonetic: "dastet ra beshoor", exampleEnglish: "Wash your hands", difficultyLevel: 2 },
  { farsiWord: "پا", phonetic: "pa", englishTranslation: "Foot / Leg", exampleFarsi: "پایم درد می‌کند", examplePhonetic: "payam dard mikonad", exampleEnglish: "My foot hurts", difficultyLevel: 2 },
  { farsiWord: "بینی", phonetic: "bini", englishTranslation: "Nose", exampleFarsi: "بینی من بزرگ است", examplePhonetic: "binie man bozorg ast", exampleEnglish: "My nose is big", difficultyLevel: 2 },
  { farsiWord: "مو", phonetic: "moo", englishTranslation: "Hair", exampleFarsi: "موهایش سیاه است", examplePhonetic: "moohayash siyah ast", exampleEnglish: "His/Her hair is black", difficultyLevel: 2 },
  { farsiWord: "قلب", phonetic: "ghalb", englishTranslation: "Heart", exampleFarsi: "قلب من تند می‌زند", examplePhonetic: "ghalbe man tond mizanad", exampleEnglish: "My heart beats fast", difficultyLevel: 2 },
  { farsiWord: "انگشت", phonetic: "angosht", englishTranslation: "Finger / Toe", exampleFarsi: "انگشتم را بریدم", examplePhonetic: "angosht-am ra boridam", exampleEnglish: "I cut my finger", difficultyLevel: 2 },
];

// ─── Level 2: Clothes ───────────────────────────────────────────────

const clothes = [
  { farsiWord: "لباس", phonetic: "lebas", englishTranslation: "Clothes / Clothing", exampleFarsi: "لباسم را عوض کردم", examplePhonetic: "lebasam ra avaz kardam", exampleEnglish: "I changed my clothes", difficultyLevel: 2 },
  { farsiWord: "کفش", phonetic: "kafsh", englishTranslation: "Shoes", exampleFarsi: "کفش جدید خریدم", examplePhonetic: "kafsh jadid kharidam", exampleEnglish: "I bought new shoes", difficultyLevel: 2 },
  { farsiWord: "کلاه", phonetic: "kolah", englishTranslation: "Hat / Cap", exampleFarsi: "کلاه سرت بذار", examplePhonetic: "kolah saret bezar", exampleEnglish: "Put on your hat", difficultyLevel: 2 },
  { farsiWord: "شلوار", phonetic: "shalvar", englishTranslation: "Pants / Trousers", exampleFarsi: "شلوار آبی پوشیدم", examplePhonetic: "shalvar abi pooshidam", exampleEnglish: "I wore blue pants", difficultyLevel: 2 },
  { farsiWord: "پیراهن", phonetic: "pirahan", englishTranslation: "Shirt", exampleFarsi: "پیراهن سفید دارم", examplePhonetic: "pirahan sefid daram", exampleEnglish: "I have a white shirt", difficultyLevel: 2 },
  { farsiWord: "کت", phonetic: "kot", englishTranslation: "Coat / Jacket", exampleFarsi: "کتت را بپوش", examplePhonetic: "kotet ra bepoosh", exampleEnglish: "Put on your coat", difficultyLevel: 2 },
  { farsiWord: "جوراب", phonetic: "joorab", englishTranslation: "Socks", exampleFarsi: "جوراب گرم بپوش", examplePhonetic: "joorab garm bepoosh", exampleEnglish: "Wear warm socks", difficultyLevel: 2 },
  { farsiWord: "عینک", phonetic: "eynak", englishTranslation: "Glasses / Eyeglasses", exampleFarsi: "عینک من کجاست؟", examplePhonetic: "eynake man kojast?", exampleEnglish: "Where are my glasses?", difficultyLevel: 2 },
];

// ─── Level 3: Countries & Travel ────────────────────────────────────

const countriesTravel = [
  { farsiWord: "ایران", phonetic: "iran", englishTranslation: "Iran", exampleFarsi: "ایران کشور زیبایی است", examplePhonetic: "iran keshvare zibai ast", exampleEnglish: "Iran is a beautiful country", difficultyLevel: 3 },
  { farsiWord: "ایرانی", phonetic: "irani", englishTranslation: "Iranian", exampleFarsi: "من ایرانی هستم", examplePhonetic: "man irani hastam", exampleEnglish: "I am Iranian", difficultyLevel: 3 },
  { farsiWord: "فرودگاه", phonetic: "foroodgah", englishTranslation: "Airport", exampleFarsi: "ما به فرودگاه رفتیم", examplePhonetic: "ma be foroodgah raftim", exampleEnglish: "We went to the airport", difficultyLevel: 3 },
  { farsiWord: "هتل", phonetic: "hotel", englishTranslation: "Hotel", exampleFarsi: "هتل خوبی رزرو کردم", examplePhonetic: "hotel khoobi rezerv kardam", exampleEnglish: "I booked a good hotel", difficultyLevel: 3 },
  { farsiWord: "پاسپورت", phonetic: "pasport", englishTranslation: "Passport", exampleFarsi: "پاسپورتت را فراموش نکن", examplePhonetic: "pasportet ra faramoosh nakon", exampleEnglish: "Don't forget your passport", difficultyLevel: 3 },
  { farsiWord: "بلیت", phonetic: "belit", englishTranslation: "Ticket", exampleFarsi: "بلیت هواپیما خریدم", examplePhonetic: "belite havapeyma kharidam", exampleEnglish: "I bought a plane ticket", difficultyLevel: 3 },
  { farsiWord: "سفر", phonetic: "safar", englishTranslation: "Travel / Trip / Journey", exampleFarsi: "سفر خوبی داشتیم", examplePhonetic: "safar khoobi dashtim", exampleEnglish: "We had a good trip", difficultyLevel: 3 },
  { farsiWord: "چمدان", phonetic: "chamedan", englishTranslation: "Suitcase / Luggage", exampleFarsi: "چمدانم سنگین است", examplePhonetic: "chamedanam sangin ast", exampleEnglish: "My suitcase is heavy", difficultyLevel: 3 },
  { farsiWord: "نقشه", phonetic: "naghshe", englishTranslation: "Map", exampleFarsi: "نقشه شهر را ببین", examplePhonetic: "naghshe shahr ra bebin", exampleEnglish: "Look at the city map", difficultyLevel: 3 },
  { farsiWord: "ویزا", phonetic: "viza", englishTranslation: "Visa", exampleFarsi: "ویزا گرفتم", examplePhonetic: "viza gereftam", exampleEnglish: "I got a visa", difficultyLevel: 3 },
  { farsiWord: "تاکسی", phonetic: "taksi", englishTranslation: "Taxi / Cab", exampleFarsi: "تاکسی گرفتیم", examplePhonetic: "taksi gereftim", exampleEnglish: "We took a taxi", difficultyLevel: 3 },
  { farsiWord: "قطار", phonetic: "ghetar", englishTranslation: "Train", exampleFarsi: "با قطار سفر کردیم", examplePhonetic: "ba ghetar safar kardim", exampleEnglish: "We traveled by train", difficultyLevel: 3 },
];

// ─── Seed Category Helper ───────────────────────────────────────────

async function seedCategory(
  name: string,
  slug: string,
  description: string,
  icon: string,
  level: number,
  sortOrder: number,
  words: any[]
) {
  // Check if category exists
  const existing = await db
    .select()
    .from(wordCategories)
    .where(eq(wordCategories.slug, slug));

  let category;
  if (existing.length === 0) {
    const result = await db
      .insert(wordCategories)
      .values({
        name,
        slug,
        description,
        icon,
        difficultyLevel: level,
        sortOrder,
      })
      .returning();
    category = result[0];
    console.log(`  Created category: ${name}`);
  } else {
    category = existing[0];
    console.log(`  Category exists: ${name}`);
  }

  // Add words
  let addedCount = 0;
  for (const word of words) {
    const existingWord = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.phonetic, word.phonetic));

    if (existingWord.length === 0) {
      const inserted = await db
        .insert(vocabulary)
        .values({
          ...word,
          isActive: true,
        })
        .returning();

      await db.insert(vocabularyCategories).values({
        vocabularyId: inserted[0].id,
        categoryId: category.id,
      });

      addedCount++;
    }
  }
  console.log(`  Added ${addedCount} new words to ${name}`);

  // Check if lesson exists
  const existingLesson = await db
    .select()
    .from(lessons)
    .where(eq(lessons.categoryId, category.id));

  if (existingLesson.length === 0) {
    await db.insert(lessons).values({
      categoryId: category.id,
      title: name,
      description,
      difficultyLevel: level,
      sortOrder: sortOrder + 100,
      isActive: true,
    });
    console.log(`  Created lesson: ${name}`);
  }

  return addedCount;
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding expanded vocabulary...\n");

  try {
    let totalAdded = 0;

    // Level 1
    console.log("\n--- Level 1 (Beginner) ---\n");

    totalAdded += await seedCategory(
      "Prepositions",
      "prepositions",
      "Common prepositions for describing locations and relationships",
      "📍",
      1,
      7,
      prepositions
    );

    totalAdded += await seedCategory(
      "Common Phrases",
      "common-phrases",
      "Essential everyday phrases and expressions",
      "💬",
      1,
      8,
      commonPhrases
    );

    totalAdded += await seedCategory(
      "Pronouns & Demonstratives",
      "pronouns",
      "Personal pronouns and demonstrative words",
      "👆",
      1,
      9,
      pronouns
    );

    // Level 2
    console.log("\n--- Level 2 (Intermediate) ---\n");

    totalAdded += await seedCategory(
      "Conjunctions & Adverbs",
      "conjunctions",
      "Connecting words and descriptive adverbs",
      "🔗",
      2,
      19,
      conjunctions
    );

    totalAdded += await seedCategory(
      "Jobs & Work",
      "jobs",
      "Common professions and work-related vocabulary",
      "💼",
      2,
      20,
      jobs
    );

    totalAdded += await seedCategory(
      "Weather",
      "weather",
      "Weather conditions and climate vocabulary",
      "🌤️",
      2,
      21,
      weather
    );

    totalAdded += await seedCategory(
      "Animals",
      "animals",
      "Common animals and pets",
      "🐱",
      2,
      22,
      animals
    );

    totalAdded += await seedCategory(
      "Body Parts",
      "body-parts",
      "Parts of the human body",
      "🫀",
      2,
      23,
      bodyParts
    );

    totalAdded += await seedCategory(
      "Clothes",
      "clothes",
      "Clothing and accessories vocabulary",
      "👕",
      2,
      24,
      clothes
    );

    // Level 3
    console.log("\n--- Level 3 (Advanced) ---\n");

    totalAdded += await seedCategory(
      "Countries & Travel",
      "countries-travel",
      "Countries, nationalities, and travel vocabulary",
      "✈️",
      3,
      30,
      countriesTravel
    );

    console.log("\n" + "=".repeat(50));
    console.log("EXPANDED VOCABULARY SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\nTotal new words added: ${totalAdded}`);
    console.log("10 new categories with lessons created\n");

    process.exit(0);
  } catch (error) {
    console.error("\nError:", error);
    process.exit(1);
  }
}

main();
