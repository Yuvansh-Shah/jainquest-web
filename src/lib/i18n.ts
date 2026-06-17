// App UI internationalization (English / Hindi / Gujarati), mirroring the
// trilingual support of the mobile app. Lesson/book *content* stays in its
// source language; this covers the app chrome and screens.

export type Lang = 'en' | 'hi' | 'gu';

export const LANGS: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

type Entry = { en: string; hi: string; gu: string };

const S: Record<string, Entry> = {
  // Common / chrome
  'common.loading': { en: 'Loading JainQuest…', hi: 'JainQuest लोड हो रहा है…', gu: 'JainQuest લોડ થઈ રહ્યું છે…' },
  'common.explorer': { en: 'Explorer', hi: 'अन्वेषक', gu: 'સંશોધક' },
  'common.open': { en: 'Open', hi: 'खोलें', gu: 'ખોલો' },
  'common.level': { en: 'Level {n}', hi: 'स्तर {n}', gu: 'સ્તર {n}' },
  'nav.home': { en: 'Home', hi: 'होम', gu: 'હોમ' },
  'nav.resources': { en: 'Resources', hi: 'संसाधन', gu: 'સંસાધનો' },
  'nav.practice': { en: 'Practice', hi: 'अभ्यास', gu: 'અભ્યાસ' },
  'nav.guru': { en: 'Ask Guru', hi: 'गुरु से पूछें', gu: 'ગુરુને પૂછો' },
  'nav.community': { en: 'Community', hi: 'समुदाय', gu: 'સમુદાય' },
  'nav.leaderboard': { en: 'Leaderboard', hi: 'लीडरबोर्ड', gu: 'લીડરબોર્ડ' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल', gu: 'પ્રોફાઇલ' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स', gu: 'સેટિંગ્સ' },
  'nav.signOut': { en: 'Sign out', hi: 'साइन आउट', gu: 'સાઇન આઉટ' },
  'topbar.streak': { en: 'Streak', hi: 'स्ट्रीक', gu: 'સ્ટ્રીક' },
  'topbar.hearts': { en: 'Hearts', hi: 'हृदय', gu: 'હૃદય' },
  'topbar.xp': { en: 'XP', hi: 'XP', gu: 'XP' },
  'topbar.streakAria': { en: '{n}-day streak', hi: '{n}-दिन की स्ट्रीक', gu: '{n}-દિવસની સ્ટ્રીક' },
  'topbar.heartFull': { en: 'Hearts full', hi: 'हृदय पूर्ण', gu: 'હૃદય પૂર્ણ' },
  'topbar.nextHeart': { en: '+1 heart in {t}', hi: '{t} में +1 हृदय', gu: '{t} માં +1 હૃદય' },
  'topbar.toNext': { en: '{n} XP to Level {l}', hi: 'स्तर {l} तक {n} XP', gu: 'સ્તર {l} સુધી {n} XP' },
  'topbar.maxLevel': { en: 'Max level', hi: 'अधिकतम स्तर', gu: 'મહત્તમ સ્તર' },

  // Landing
  'landing.eyebrow': { en: 'Calm, modern, non-preachy', hi: 'शांत, आधुनिक, बिना उपदेश', gu: 'શાંત, આધુનિક, ઉપદેશ વિના' },
  'landing.title': { en: 'A calm, modern way to learn Jain wisdom.', hi: 'जैन ज्ञान सीखने का एक शांत, आधुनिक तरीका।', gu: 'જૈન જ્ઞાન શીખવાની એક શાંત, આધુનિક રીત.' },
  'landing.subtitle': { en: 'Bite-sized lessons, guided reflection, and thoughtful practice — designed for teens, free of guilt or pressure.', hi: 'छोटे-छोटे पाठ, निर्देशित चिंतन और सोच-समझकर अभ्यास — किशोरों के लिए, बिना अपराधबोध या दबाव के।', gu: 'નાના પાઠ, માર્ગદર્શિત ચિંતન અને વિચારશીલ અભ્યાસ — કિશોરો માટે, અપરાધભાવ કે દબાણ વિના.' },
  'landing.cta': { en: 'Get started', hi: 'शुरू करें', gu: 'શરૂ કરો' },
  'landing.login': { en: 'I already have an account', hi: 'मेरा पहले से खाता है', gu: 'મારી પાસે પહેલેથી ખાતું છે' },
  'landing.continue': { en: 'Continue to app', hi: 'ऐप में जारी रखें', gu: 'એપમાં ચાલુ રાખો' },
  'landing.timelineTitle': { en: 'A short history of Jainism', hi: 'जैन धर्म का संक्षिप्त इतिहास', gu: 'જૈન ધર્મનો ટૂંકો ઇતિહાસ' },
  'landing.timelineNote': { en: 'Jain tradition teaches 24 Tirthankaras across this time cycle. Only the last two are historically datable; earlier dates are traditional.', hi: 'जैन परंपरा इस काल-चक्र में 24 तीर्थंकर मानती है। केवल अंतिम दो ऐतिहासिक रूप से तिथि-निर्धारित हैं; पूर्व की तिथियाँ पारंपरिक हैं।', gu: 'જૈન પરંપરા આ કાળચક્રમાં 24 તીર્થંકરો માને છે. માત્ર છેલ્લા બે ઐતિહાસિક રીતે તારીખ-નિર્ધારિત છે; અગાઉની તારીખો પરંપરાગત છે.' },
  'hero.word': { en: 'Ahimsa', hi: 'अहिंसा', gu: 'અહિંસા' },
  'hero.phrase': { en: 'the belief in non-violence', hi: 'अहिंसा में विश्वास', gu: 'અહિંસામાં વિશ્વાસ' },
  'landing.welcomeBack': { en: 'Welcome back{name}.', hi: 'वापसी पर स्वागत है{name}।', gu: 'પાછા આવવા બદલ સ્વાગત છે{name}.' },
  'landing.f1t': { en: 'Focused lessons', hi: 'केंद्रित पाठ', gu: 'કેન્દ્રિત પાઠ' },
  'landing.f1d': { en: 'Short loops on Ahimsa, Anekantavada and Aparigraha — learn, reflect, check understanding.', hi: 'अहिंसा, अनेकांतवाद और अपरिग्रह पर छोटे चक्र — सीखें, चिंतन करें, समझ जाँचें।', gu: 'અહિંસા, અનેકાંતવાદ અને અપરિગ્રહ પર ટૂંકા ચક્ર — શીખો, ચિંતન કરો, સમજ ચકાસો.' },
  'landing.f2t': { en: 'A guide when you need it', hi: 'जरूरत पड़ने पर मार्गदर्शक', gu: 'જરૂર પડ્યે માર્ગદર્શક' },
  'landing.f2d': { en: 'Ask the built-in Guru whenever a concept needs more context.', hi: 'जब भी किसी विषय को और समझना हो, अंतर्निहित गुरु से पूछें।', gu: 'જ્યારે પણ કોઈ વિષય વધુ સમજવો હોય, ત્યારે અંતર્ગત ગુરુને પૂછો.' },
  'landing.f3t': { en: 'Progress you can feel', hi: 'महसूस होने वाली प्रगति', gu: 'અનુભવાય તેવી પ્રગતિ' },
  'landing.f3d': { en: 'XP, streaks and gentle practice keep the learning going.', hi: 'XP, स्ट्रीक और सहज अभ्यास सीखने को जारी रखते हैं।', gu: 'XP, સ્ટ્રીક અને હળવો અભ્યાસ શીખવાનું ચાલુ રાખે છે.' },

  // Auth
  'auth.subtitle': { en: 'Calm, modern Jain learning — on the web.', hi: 'शांत, आधुनिक जैन शिक्षा — वेब पर।', gu: 'શાંત, આધુનિક જૈન શિક્ષણ — વેબ પર.' },
  'auth.login': { en: 'Log in', hi: 'लॉग इन', gu: 'લૉગ ઇન' },
  'auth.signup': { en: 'Sign up', hi: 'साइन अप', gu: 'સાઇન અપ' },
  'auth.email': { en: 'Email address', hi: 'ईमेल पता', gu: 'ઈમેલ સરનામું' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', gu: 'પાસવર્ડ' },
  'auth.create': { en: 'Create account', hi: 'खाता बनाएँ', gu: 'ખાતું બનાવો' },
  'auth.pleaseWait': { en: 'Please wait…', hi: 'कृपया प्रतीक्षा करें…', gu: 'કૃપા કરીને રાહ જુઓ…' },
  'auth.or': { en: 'OR', hi: 'या', gu: 'અથવા' },
  'auth.google': { en: 'Continue with Google', hi: 'Google से जारी रखें', gu: 'Google સાથે ચાલુ રાખો' },
  'auth.syncNote': { en: 'Your progress syncs with the JainQuest mobile app.', hi: 'आपकी प्रगति JainQuest मोबाइल ऐप के साथ सिंक होती है।', gu: 'તમારી પ્રગતિ JainQuest મોબાઇલ એપ સાથે સિંક થાય છે.' },
  'auth.errCreds': { en: 'Incorrect email or password.', hi: 'गलत ईमेल या पासवर्ड।', gu: 'ખોટું ઈમેલ અથવા પાસવર્ડ.' },
  'auth.errInUse': { en: 'That email is already registered. Try logging in.', hi: 'यह ईमेल पहले से पंजीकृत है। लॉग इन करें।', gu: 'આ ઈમેલ પહેલેથી નોંધાયેલ છે. લૉગ ઇન કરો.' },
  'auth.errWeak': { en: 'Password must be at least 6 characters.', hi: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।', gu: 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.' },
  'auth.errEmail': { en: 'Please enter a valid email address.', hi: 'कृपया वैध ईमेल पता दर्ज करें।', gu: 'કૃપા કરીને માન્ય ઈમેલ સરનામું દાખલ કરો.' },
  'auth.errPopup': { en: 'Google sign-in was cancelled.', hi: 'Google साइन-इन रद्द कर दिया गया।', gu: 'Google સાઇન-ઇન રદ કરાયું.' },
  'auth.errGeneric': { en: 'Something went wrong. Please try again.', hi: 'कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।', gu: 'કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.' },

  // Profile setup
  'setup.title': { en: 'Set up your profile', hi: 'अपनी प्रोफ़ाइल सेट करें', gu: 'તમારી પ્રોફાઇલ સેટ કરો' },
  'setup.personalize': { en: "Let's personalize your learning journey.", hi: 'आइए आपकी सीखने की यात्रा को व्यक्तिगत बनाएँ।', gu: 'ચાલો તમારી શીખવાની યાત્રાને વ્યક્તિગત બનાવીએ.' },
  'setup.nameQ': { en: 'What should we call you?', hi: 'हम आपको क्या कहकर बुलाएँ?', gu: 'અમે તમને શું કહીને બોલાવીએ?' },
  'setup.namePh': { en: 'Enter your name', hi: 'अपना नाम दर्ज करें', gu: 'તમારું નામ દાખલ કરો' },
  'setup.ageQ': { en: 'How old are you?', hi: 'आपकी उम्र क्या है?', gu: 'તમારી ઉંમર કેટલી છે?' },
  'setup.agePh': { en: 'Enter your age', hi: 'अपनी उम्र दर्ज करें', gu: 'તમારી ઉંમર દાખલ કરો' },
  'setup.lang': { en: 'Preferred language', hi: 'पसंदीदा भाषा', gu: 'પસંદગીની ભાષા' },
  'setup.avatarQ': { en: 'Pick an avatar', hi: 'अवतार चुनें', gu: 'અવતાર પસંદ કરો' },
  'setup.getStarted': { en: 'Get started', hi: 'शुरू करें', gu: 'શરૂ કરો' },
  'setup.saving': { en: 'Saving…', hi: 'सहेजा जा रहा है…', gu: 'સાચવી રહ્યું છે…' },
  'setup.errName': { en: 'Please enter your name.', hi: 'कृपया अपना नाम दर्ज करें।', gu: 'કૃપા કરીને તમારું નામ દાખલ કરો.' },
  'setup.errAge': { en: 'Please enter a valid age.', hi: 'कृपया वैध उम्र दर्ज करें।', gu: 'કૃપા કરીને માન્ય ઉંમર દાખલ કરો.' },
  'setup.errSave': { en: 'Could not save your profile. Please try again.', hi: 'प्रोफ़ाइल सहेजी नहीं जा सकी। पुनः प्रयास करें।', gu: 'પ્રોફાઇલ સાચવી શકાઈ નહીં. ફરી પ્રયાસ કરો.' },

  // Home
  'home.welcome': { en: 'Welcome back, {name}', hi: 'वापसी पर स्वागत है, {name}', gu: 'પાછા આવવા બદલ સ્વાગત છે, {name}' },
  'home.dailyGoal': { en: 'Daily goal', hi: 'दैनिक लक्ष्य', gu: 'દૈનિક લક્ષ્ય' },
  'home.lessonsToday': { en: 'lessons today', hi: 'आज के पाठ', gu: 'આજના પાઠ' },
  'home.completed': { en: 'Completed', hi: 'पूर्ण', gu: 'પૂર્ણ' },
  'home.ofLessons': { en: 'of {n} lessons', hi: '{n} पाठों में से', gu: '{n} પાઠમાંથી' },
  'home.hearts': { en: 'Hearts', hi: 'हृदय', gu: 'હૃદય' },
  'home.energy': { en: 'energy to learn', hi: 'सीखने की ऊर्जा', gu: 'શીખવાની ઊર્જા' },
  'home.outOfHearts': { en: "You're out of hearts. They refill over time, or earn them back in Practice.", hi: 'आपके हृदय समाप्त हो गए हैं। वे समय के साथ भर जाते हैं, या अभ्यास में वापस कमाएँ।', gu: 'તમારા હૃદય સમાપ્ત થઈ ગયા છે. તે સમય સાથે ભરાય છે, અથવા અભ્યાસમાં પાછા મેળવો.' },
  'home.lessonPath': { en: 'Lesson path', hi: 'पाठ-पथ', gu: 'પાઠ-માર્ગ' },
  'home.start': { en: 'Start', hi: 'शुरू करें', gu: 'શરૂ કરો' },
  'home.openLesson': { en: 'Open', hi: 'खोलें', gu: 'ખોલો' },
  'home.locked': { en: 'Locked', hi: 'बंद', gu: 'બંધ' },
  'home.review': { en: 'Review', hi: 'समीक्षा', gu: 'સમીક્ષા' },

  // Lesson runner
  'lesson.warmup': { en: 'Warm-up', hi: 'वार्म-अप', gu: 'વોર્મ-અપ' },
  'lesson.read': { en: 'Read', hi: 'पढ़ें', gu: 'વાંચો' },
  'lesson.understand': { en: 'Understand', hi: 'समझें', gu: 'સમજો' },
  'lesson.qOf': { en: 'Question {c} of {t}', hi: 'प्रश्न {c} / {t}', gu: 'પ્રશ્ન {c} / {t}' },
  'lesson.check': { en: 'Check answer', hi: 'उत्तर जाँचें', gu: 'જવાબ ચકાસો' },
  'lesson.continue': { en: 'Continue', hi: 'जारी रखें', gu: 'ચાલુ રાખો' },
  'lesson.nextQ': { en: 'Next question', hi: 'अगला प्रश्न', gu: 'આગળનો પ્રશ્ન' },
  'lesson.complete': { en: 'Complete lesson', hi: 'पाठ पूरा करें', gu: 'પાઠ પૂર્ણ કરો' },
  'lesson.notFound': { en: 'Lesson not found.', hi: 'पाठ नहीं मिला।', gu: 'પાઠ મળ્યો નથી.' },
  'lesson.backToLessons': { en: 'Back to lessons', hi: 'पाठों पर वापस', gu: 'પાઠ પર પાછા' },
  'lesson.score': { en: 'Score: {p}%', hi: 'स्कोर: {p}%', gu: 'સ્કોર: {p}%' },
  'lesson.answerXp': { en: 'Answer XP', hi: 'उत्तर XP', gu: 'જવાબ XP' },
  'lesson.perfectBonus': { en: 'Perfect quiz bonus', hi: 'परफेक्ट क्विज़ बोनस', gu: 'પરફેક્ટ ક્વિઝ બોનસ' },
  'lesson.firstBonus': { en: 'First completion bonus', hi: 'पहली बार पूरा करने का बोनस', gu: 'પ્રથમ વખત પૂર્ણ બોનસ' },
  'lesson.totalXp': { en: 'Total XP', hi: 'कुल XP', gu: 'કુલ XP' },
  'lesson.correct': { en: 'Correct!', hi: 'सही!', gu: 'સાચું!' },
  'lesson.notQuite': { en: 'Not quite.', hi: 'पूरी तरह सही नहीं।', gu: 'બરાબર નથી.' },

  // Practice
  'practice.title': { en: 'Practice', hi: 'अभ्यास', gu: 'અભ્યાસ' },
  'practice.intro': { en: "Reinforce what you've learned and earn a heart back.", hi: 'जो सीखा है उसे मजबूत करें और एक हृदय वापस कमाएँ।', gu: 'જે શીખ્યા તે મજબૂત કરો અને એક હૃદય પાછું મેળવો.' },
  'practice.review': { en: 'Review', hi: 'समीक्षा', gu: 'સમીક્ષા' },
  'practice.reviewDesc': { en: '8 mixed questions from completed lessons.', hi: 'पूर्ण पाठों से 8 मिश्रित प्रश्न।', gu: 'પૂર્ણ પાઠમાંથી 8 મિશ્ર પ્રશ્નો.' },
  'practice.weak': { en: 'Target weak spots', hi: 'कमज़ोर बिंदुओं पर ध्यान', gu: 'નબળા મુદ્દાઓ પર ધ્યાન' },
  'practice.weakDesc': { en: "Focus on questions you've missed or are due to review.", hi: 'उन प्रश्नों पर ध्यान दें जो छूट गए या समीक्षा के लिए हैं।', gu: 'જે પ્રશ્નો ચૂક્યા કે સમીક્ષા માટે છે તેના પર ધ્યાન આપો.' },
  'practice.empty': { en: "Complete a lesson first — practice reviews questions from lessons you've finished.", hi: 'पहले एक पाठ पूरा करें — अभ्यास पूर्ण पाठों के प्रश्नों की समीक्षा करता है।', gu: 'પહેલા એક પાઠ પૂર્ણ કરો — અભ્યાસ પૂર્ણ પાઠના પ્રશ્નોની સમીક્ષા કરે છે.' },
  'practice.complete': { en: 'Practice complete', hi: 'अभ्यास पूर्ण', gu: 'અભ્યાસ પૂર્ણ' },
  'practice.result': { en: '{c} correct · +{x} XP', hi: '{c} सही · +{x} XP', gu: '{c} સાચા · +{x} XP' },
  'practice.heart': { en: '+1 heart earned', hi: '+1 हृदय अर्जित', gu: '+1 હૃદય મેળવ્યું' },
  'practice.back': { en: 'Back to practice', hi: 'अभ्यास पर वापस', gu: 'અભ્યાસ પર પાછા' },
  'practice.next': { en: 'Next', hi: 'अगला', gu: 'આગળ' },
  'practice.finish': { en: 'Finish', hi: 'समाप्त', gu: 'સમાપ્ત' },

  // Profile
  'profile.totalXp': { en: 'Total XP', hi: 'कुल XP', gu: 'કુલ XP' },
  'profile.currentStreak': { en: 'Current streak', hi: 'वर्तमान स्ट्रीक', gu: 'વર્તમાન સ્ટ્રીક' },
  'profile.longestStreak': { en: 'Longest streak', hi: 'सबसे लंबी स्ट्रीक', gu: 'સૌથી લાંબી સ્ટ્રીક' },
  'profile.lessonsDone': { en: 'Lessons done', hi: 'पूर्ण पाठ', gu: 'પૂર્ણ પાઠ' },
  'profile.badges': { en: 'Badges', hi: 'बैज', gu: 'બેજ' },
  'profile.earnedOf': { en: '{e} of {t} earned', hi: '{t} में से {e} अर्जित', gu: '{t} માંથી {e} મેળવ્યા' },
  'profile.earned': { en: 'Earned', hi: 'अर्जित', gu: 'મેળવ્યું' },
  'profile.lockedBadge': { en: 'Locked', hi: 'बंद', gu: 'બંધ' },
  'profile.changeAvatar': { en: 'Change avatar', hi: 'अवतार बदलें', gu: 'અવતાર બદલો' },

  // Leaderboard
  'lb.title': { en: 'Leaderboard', hi: 'लीडरबोर्ड', gu: 'લીડરબોર્ડ' },
  'lb.yourRank': { en: 'Your rank', hi: 'आपकी रैंक', gu: 'તમારો ક્રમ' },
  'lb.you': { en: '(you)', hi: '(आप)', gu: '(તમે)' },
  'lb.loading': { en: 'Loading leaderboard…', hi: 'लीडरबोर्ड लोड हो रहा है…', gu: 'લીડરબોર્ડ લોડ થઈ રહ્યું છે…' },

  // Guru
  'guru.title': { en: 'Ask Guru', hi: 'गुरु से पूछें', gu: 'ગુરુને પૂછો' },
  'guru.greeting': { en: 'Namaste! Ask me anything about Jainism, practice, or values.', hi: 'नमस्ते! जैन धर्म, अभ्यास या मूल्यों के बारे में कुछ भी पूछें।', gu: 'નમસ્તે! જૈન ધર્મ, અભ્યાસ કે મૂલ્યો વિશે કંઈ પણ પૂછો.' },
  'guru.placeholder': { en: 'Type your question…', hi: 'अपना प्रश्न लिखें…', gu: 'તમારો પ્રશ્ન લખો…' },
  'guru.send': { en: 'Send', hi: 'भेजें', gu: 'મોકલો' },
  'guru.thinking': { en: 'Thinking…', hi: 'सोच रहा हूँ…', gu: 'વિચારી રહ્યો છું…' },

  // Forum
  'forum.title': { en: 'Community', hi: 'समुदाय', gu: 'સમુદાય' },
  'forum.placeholder': { en: 'Share a reflection or ask the community…', hi: 'एक विचार साझा करें या समुदाय से पूछें…', gu: 'એક વિચાર શેર કરો અથવા સમુદાયને પૂછો…' },
  'forum.post': { en: 'Post', hi: 'पोस्ट', gu: 'પોસ્ટ' },
  'forum.empty': { en: 'No posts yet. Be the first to share.', hi: 'अभी कोई पोस्ट नहीं। साझा करने वाले पहले बनें।', gu: 'હજી કોઈ પોસ્ટ નથી. શેર કરનાર પ્રથમ બનો.' },
  'forum.like': { en: 'Like', hi: 'पसंद', gu: 'ગમ્યું' },
  'forum.liked': { en: 'Liked', hi: 'पसंद किया', gu: 'ગમ્યું' },
  'forum.replies': { en: 'Replies', hi: 'उत्तर', gu: 'જવાબો' },
  'forum.replyPh': { en: 'Reply…', hi: 'उत्तर दें…', gu: 'જવાબ આપો…' },
  'forum.sendReply': { en: 'Send', hi: 'भेजें', gu: 'મોકલો' },
  'forum.delete': { en: 'Delete', hi: 'हटाएँ', gu: 'કાઢી નાખો' },
  'forum.deleteConfirm': { en: 'Delete this post?', hi: 'यह पोस्ट हटाएँ?', gu: 'આ પોસ્ટ કાઢી નાખવી?' },

  // Resources
  'res.title': { en: 'Resources', hi: 'संसाधन', gu: 'સંસાધનો' },
  'res.subtitle': { en: 'Read a foundational text, then go deeper with hand-picked videos and references — every link checked to actually work.', hi: 'एक मूल ग्रंथ पढ़ें, फिर चुने हुए वीडियो और संदर्भों से गहराई में जाएँ — हर लिंक काम करने के लिए जाँचा गया।', gu: 'એક મૂળભૂત ગ્રંથ વાંચો, પછી પસંદ કરેલા વિડિયો અને સંદર્ભો સાથે ઊંડાણમાં જાઓ — દરેક લિંક કામ કરે તે ચકાસેલ.' },
  'res.readerDesc': { en: 'Champat Rai Jain · read chapter by chapter, with quizzes and heart rewards for reading.', hi: 'चंपत राय जैन · अध्याय-दर-अध्याय पढ़ें, क्विज़ और पढ़ने पर हृदय पुरस्कार के साथ।', gu: 'ચંપત રાય જૈન · પ્રકરણ-દર-પ્રકરણ વાંચો, ક્વિઝ અને વાંચન પર હૃદય પુરસ્કાર સાથે.' },
  'res.read': { en: 'Read', hi: 'पढ़ें', gu: 'વાંચો' },
  'res.video': { en: 'Video', hi: 'वीडियो', gu: 'વિડિયો' },
  'res.website': { en: 'Website', hi: 'वेबसाइट', gu: 'વેબસાઇટ' },

  // Reader
  'reader.back': { en: 'Resources', hi: 'संसाधन', gu: 'સંસાધનો' },
  'reader.loading': { en: 'Loading the book…', hi: 'पुस्तक लोड हो रही है…', gu: 'પુસ્તક લોડ થઈ રહ્યું છે…' },
  'reader.bookmark': { en: 'Bookmark', hi: 'बुकमार्क', gu: 'બુકમાર્ક' },
  'reader.bookmarked': { en: 'Bookmarked', hi: 'बुकमार्क किया', gu: 'બુકમાર્ક કર્યું' },
  'reader.previous': { en: 'Previous', hi: 'पिछला', gu: 'પાછલું' },
  'reader.next': { en: 'Next', hi: 'अगला', gu: 'આગળ' },
  'reader.heart': { en: '+{n} heart from reading. Keep going!', hi: 'पढ़ने से +{n} हृदय। जारी रखें!', gu: 'વાંચનથી +{n} હૃદય. ચાલુ રાખો!' },
  'reader.frontMatter': { en: 'Front matter', hi: 'प्रारंभिक', gu: 'પ્રારંભિક' },
  'reader.chapter': { en: 'Chapter', hi: 'अध्याय', gu: 'પ્રકરણ' },
  'reader.pageOf': { en: 'page {p} of {t}', hi: 'पृष्ठ {p} / {t}', gu: 'પૃષ્ઠ {p} / {t}' },

  // Settings
  'set.title': { en: 'Settings', hi: 'सेटिंग्स', gu: 'સેટિંગ્સ' },
  'set.dark': { en: 'Dark mode', hi: 'डार्क मोड', gu: 'ડાર્ક મોડ' },
  'set.darkDesc': { en: 'Theme syncs with the mobile app.', hi: 'थीम मोबाइल ऐप के साथ सिंक होती है।', gu: 'થીમ મોબાઇલ એપ સાથે સિંક થાય છે.' },
  'set.lang': { en: 'Language', hi: 'भाषा', gu: 'ભાષા' },
  'set.langDesc': { en: 'Changes the app language instantly.', hi: 'ऐप की भाषा तुरंत बदलती है।', gu: 'એપની ભાષા તરત બદલે છે.' },
  'set.account': { en: 'Account', hi: 'खाता', gu: 'ખાતું' },
  'set.signedIn': { en: 'Signed in', hi: 'साइन इन है', gu: 'સાઇન ઇન છે' },
  'set.signOut': { en: 'Sign out', hi: 'साइन आउट', gu: 'સાઇન આઉટ' },
  'set.footer': { en: 'JainQuest Web · progress shared with the mobile app', hi: 'JainQuest वेब · प्रगति मोबाइल ऐप के साथ साझा', gu: 'JainQuest વેબ · પ્રગતિ મોબાઇલ એપ સાથે શેર' },
};

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const entry = S[key];
  let text = entry ? (entry[lang] ?? entry.en) : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}
