// ═══════════════════════════════════════════════
// 🌸 CHIIKAWA TAMAGOTCHI - Game Data
// Todos los datos estáticos del juego
// ═══════════════════════════════════════════════

// ─── Interfaces ───

export interface Letter {
  id: string;
  title: string;
  content: string;
  unlockCondition: string;
  unlockDescription: string;
  icon: string;
  isSecret: boolean;
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  spotifyUrl: string;
  spotifyTrackId: string;
  message: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  category: AchievementCategory;
}

export type AchievementCategory = 'cuidado' | 'exploración' | 'dedicación' | 'secreto';

export interface EasterEgg {
  id: string;
  name: string;
  type: 'code' | 'word' | 'click' | 'time' | 'date';
  hint: string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  backgroundImage: string;
  particles: string[];
  unlockCondition: string;
}

export interface Dialogue {
  text: string;
  emoji: string;
}

// ─── Letters Data ───

export const LETTERS: Letter[] = [
  {
    id: 'letter-1',
    title: 'Tu Primera Cartita 💌',
    content: '¡Hola Lucy! 🌸 Si estás leyendo esto, quiero que sepas que eres increíble. Cada día que te esfuerzas, cada página que estudias, cada desvelada que aguantas... todo eso te hace más fuerte. ¡Tú puedes con todo! Este pequeño Chiikawa estará aquí esperándote siempre. Con cariño infinito 💕',
    unlockCondition: 'first_visit',
    unlockDescription: 'Se desbloquea en tu primera visita',
    icon: '💌',
    isSecret: false,
  },
  {
    id: 'letter-2',
    title: 'Carta de Constancia 🎀',
    content: 'Lucy, ¡ya llevas 3 días visitándome! 🎀 Quiero recordarte algo: no tienes que ser perfecta. A veces los días son difíciles y las materias parecen imposibles, pero mira todo lo que ya has logrado. Eres más capaz de lo que crees. Cuando sientas que no puedes más, respira, toma agüita y recuerda que este Chiikawa cree en ti con todo su corazoncito. ¡Ánimo, tú puedes! 🌟',
    unlockCondition: 'streak_3',
    unlockDescription: 'Visita 3 días seguidos',
    icon: '🎀',
    isSecret: false,
  },
  {
    id: 'letter-3',
    title: 'Carta de Logros 🏆',
    content: '¡Lucy! ¡Mira cuántos logros has desbloqueado! 🏆✨ Eso demuestra lo dedicada y curiosa que eres. Igual que en los estudios: paso a paso, logro a logro, vas avanzando aunque a veces no lo notes. Estoy muy orgulloso de ti. Cada examen que pasas, cada trabajo que entregas, cada día que no te rindes... todo cuenta. Nunca dejes de brillar, porque tu luz es hermosa. Te quiero muchísimo 🌸💖',
    unlockCondition: 'achievements_5',
    unlockDescription: 'Desbloquea 5 logros',
    icon: '🏆',
    isSecret: false,
  },
  {
    id: 'letter-4',
    title: 'Carta de Corazones 💗',
    content: 'Cada pequeño gesto de cariño cuenta, Lucy. Ya juntaste diez corazones para Chiikawa y eso significa diez momentos compartidos. Gracias por volver y llenar este rinconcito de amor. 💕',
    unlockCondition: 'hearts_10',
    unlockDescription: 'Consigue 10 corazones',
    icon: '💗',
    isSecret: false,
  },
  {
    id: 'letter-5',
    title: 'Carta de Dedicación 🌟',
    content: 'Diez logros no aparecen por casualidad: son la suma de cada visita, cada descubrimiento y cada intento. Estoy muy orgulloso de ti, Lucy. Sigue avanzando a tu propio ritmo. ✨',
    unlockCondition: 'achievements_10',
    unlockDescription: 'Desbloquea 10 logros',
    icon: '🌟',
    isSecret: false,
  },
  {
    id: 'letter-6',
    title: 'Carta Musical 🎵',
    content: 'Encontraste todas las canciones. Que siempre tengas una melodía bonita para acompañar tus días de estudio, descanso y sueños. ¡Tu playlist ya es mágica! 🎶',
    unlockCondition: 'all_songs',
    unlockDescription: 'Escucha las 8 canciones',
    icon: '🎵',
    isSecret: false,
  },
  {
    id: 'letter-secret',
    title: 'Carta Secreta 🥺',
    content: 'Lucy... si llegaste hasta aquí, es porque eres alguien muy especial 🥺💕 Has cuidado de este Chiikawa con tanto cariño, has descubierto todos los secretos, y eso dice mucho de ti: eres persistente, curiosa y tienes un corazón enorme. Quiero que sepas que sin importar qué pase, sin importar las notas o los exámenes, tú vales muchísimo solo por ser tú. Este rinconcito de internet fue creado solo para ti, para que tengas un lugar donde sonreír cuando el mundo pese mucho. Te quiero con todo mi corazón, hoy y siempre. Nunca lo olvides 🌸✨💖',
    unlockCondition: 'secret_zone',
    unlockDescription: 'Descubre la zona secreta',
    icon: '🥺',
    isSecret: true,
  },
];

// ─── Songs Data ───

export const SONGS: Song[] = [
  {
    id: 'song-1',
    name: 'ひとりごつ',
    artist: 'ハチワレ(CV:田中 誠人)',
    spotifyUrl: 'https://open.spotify.com/track/13LAWsgJRQelNrEr5csuX0',
    spotifyTrackId: '13LAWsgJRQelNrEr5csuX0',
    message: 'Esta canción es tan tierna como tú 🌸 Perfecta para estudiar en calma.',
  },
  {
    id: 'song-2',
    name: 'パジャマパーティーズのうた (Piano Ver.)',
    artist: 'Piano Echoes',
    spotifyUrl: 'https://open.spotify.com/track/6Up187RfBvwbXLeBtIpjYY',
    spotifyTrackId: '6Up187RfBvwbXLeBtIpjYY',
    message: 'Para esos momentos de paz antes de dormir 🎹💤',
  },
  {
    id: 'song-3',
    name: 'Pajama Parties no Uta',
    artist: 'Pajama Parties',
    spotifyUrl: 'https://open.spotify.com/track/3qQMB8Hbsz8UO8y1XYxkl0',
    spotifyTrackId: '3qQMB8Hbsz8UO8y1XYxkl0',
    message: '¡Fiesta de pijamas! 🎉 Imagina que estamos cantando juntos.',
  },
  {
    id: 'song-4',
    name: 'ひとりごつ (バンドVer.)',
    artist: 'ハチワレ(CV:田中 誠人)',
    spotifyUrl: 'https://open.spotify.com/track/6CLv2AVvpRC6u84L6e79OS',
    spotifyTrackId: '6CLv2AVvpRC6u84L6e79OS',
    message: 'La versión banda para cuando necesites energía extra 🎸✨',
  },
  {
    id: 'song-5',
    name: 'パジャマパーティーズのうた',
    artist: 'Pajama Parties',
    spotifyUrl: 'https://open.spotify.com/track/56kp1bjrqOIS51QI3mYKuJ',
    spotifyTrackId: '56kp1bjrqOIS51QI3mYKuJ',
    message: 'La original, la clásica, la que te hará sonreír 🎶',
  },
  {
    id: 'song-6',
    name: 'Arpeggio',
    artist: 'ちいかわ',
    spotifyUrl: 'https://open.spotify.com/track/6u3XrJjtnN8fETWvyEGDZb',
    spotifyTrackId: '6u3XrJjtnN8fETWvyEGDZb',
    message: 'Melodía suave que acompaña tus noches de estudio 🌙',
  },
  {
    id: 'song-7',
    name: 'Hitorigotsu',
    artist: 'ハチワレ(CV:田中 誠人)',
    spotifyUrl: 'https://open.spotify.com/track/0lEH5AatlbJJlELJglP0kP',
    spotifyTrackId: '0lEH5AatlbJJlELJglP0kP',
    message: 'Otra versión de esta hermosa canción, solo para ti 💖',
  },
  {
    id: 'song-8',
    name: 'むちゃうまスイーツランドのうた',
    artist: 'むちゃうまスイーツランド',
    spotifyUrl: 'https://open.spotify.com/track/1lJxVW33lV1KDEN8sH9PSf',
    spotifyTrackId: '1lJxVW33lV1KDEN8sH9PSf',
    message: '¡Dulce como un postre! 🍰 Perfecta para animarte.',
  },
];

// ─── Achievements Data ───

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-visit',
    name: 'Primera Visita',
    description: '¡Bienvenida a tu mundo Chiikawa!',
    icon: '🌸',
    condition: 'Visita la página por primera vez',
    category: 'exploración',
  },
  {
    id: 'ach-first-feed',
    name: 'Chef Kawaii',
    description: 'Alimentaste a Chiikawa por primera vez',
    icon: '🍓',
    condition: 'Dale de comer a Chiikawa',
    category: 'cuidado',
  },
  {
    id: 'ach-first-play',
    name: 'Hora de Jugar',
    description: '¡Jugaste con Chiikawa!',
    icon: '🎮',
    condition: 'Juega con Chiikawa',
    category: 'cuidado',
  },
  {
    id: 'ach-first-sleep',
    name: 'Dulces Sueños',
    description: 'Ayudaste a Chiikawa a dormir',
    icon: '💤',
    condition: 'Pon a dormir a Chiikawa',
    category: 'cuidado',
  },
  {
    id: 'ach-first-pet',
    name: 'Mimos Infinitos',
    description: 'Le diste cariño a Chiikawa',
    icon: '💖',
    condition: 'Acaricia a Chiikawa',
    category: 'cuidado',
  },
  {
    id: 'ach-max-happiness',
    name: 'Felicidad Máxima',
    description: '¡Chiikawa está super feliz!',
    icon: '✨',
    condition: 'Llega a 100% de felicidad',
    category: 'cuidado',
  },
  {
    id: 'ach-all-actions',
    name: 'Cuidadora Experta',
    description: 'Usaste todas las acciones',
    icon: '👑',
    condition: 'Usa las 4 acciones al menos una vez',
    category: 'cuidado',
  },
  {
    id: 'ach-streak-3',
    name: 'Racha de 3 Días',
    description: '¡3 días seguidos visitando!',
    icon: '🔥',
    condition: 'Visita 3 días consecutivos',
    category: 'dedicación',
  },
  {
    id: 'ach-streak-7',
    name: 'Racha Semanal',
    description: '¡Una semana entera de amor!',
    icon: '⭐',
    condition: 'Visita 7 días consecutivos',
    category: 'dedicación',
  },
  {
    id: 'ach-read-letter',
    name: 'Lectora de Cartas',
    description: 'Leíste tu primera cartita',
    icon: '💌',
    condition: 'Abre una carta',
    category: 'exploración',
  },
  {
    id: 'ach-all-songs',
    name: 'Melómana Chiikawa',
    description: '¡Escuchaste todas las canciones!',
    icon: '🎵',
    condition: 'Escucha las 8 canciones',
    category: 'exploración',
  },
  {
    id: 'ach-easter-egg',
    name: 'Cazadora de Secretos',
    description: '¡Encontraste un huevo de pascua!',
    icon: '🥚',
    condition: 'Descubre un easter egg',
    category: 'secreto',
  },
  {
    id: 'ach-konami',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA ¡Lo lograste!',
    icon: '🎮',
    condition: 'Ingresa el código Konami',
    category: 'secreto',
  },
  {
    id: 'ach-night-owl',
    name: 'Búho Nocturno',
    description: 'Visitaste a las 3:33 AM',
    icon: '🦉',
    condition: 'Visita a las 3:33 AM',
    category: 'secreto',
  },
  {
    id: 'ach-secret-zone',
    name: 'Zona Secreta',
    description: '¡Descubriste el rincón secreto!',
    icon: '🗝️',
    condition: 'Accede a la zona secreta',
    category: 'secreto',
  },
  {
    id: 'ach-theme-change',
    name: 'Decoradora',
    description: 'Cambiaste el tema del mundo',
    icon: '🎨',
    condition: 'Cambia el tema',
    category: 'exploración',
  },
  {
    id: 'ach-hearts-10',
    name: 'Diez Momentos',
    description: 'Compartiste 10 momentos con Chiikawa',
    icon: '💗',
    condition: 'Consigue 10 corazones',
    category: 'cuidado',
  },
  {
    id: 'ach-hearts-50',
    name: 'Cariño Constante',
    description: 'Compartiste 50 momentos con Chiikawa',
    icon: '💖',
    condition: 'Consigue 50 corazones',
    category: 'dedicación',
  },
  {
    id: 'ach-hearts-100',
    name: 'Corazón Gigante',
    description: 'Compartiste 100 momentos con Chiikawa',
    icon: '💝',
    condition: 'Consigue 100 corazones',
    category: 'dedicación',
  },
  {
    id: 'ach-perfect-care',
    name: 'Cuidado Perfecto',
    description: 'Llevaste las tres estadísticas al máximo',
    icon: '🌈',
    condition: 'Ten felicidad, hambre y sueño al 100%',
    category: 'cuidado',
  },
];

// ─── Easter Eggs Data ───

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'ee-konami',
    name: 'Código Konami',
    type: 'code',
    hint: '↑↑↓↓←→←→BA... ¿recuerdas?',
  },
  {
    id: 'ee-secret-word',
    name: 'Palabra Mágica',
    type: 'word',
    hint: 'Escribe el nombre del personaje...',
  },
  {
    id: 'ee-click-10',
    name: 'Click Maestro',
    type: 'click',
    hint: 'Toca a Chiikawa 10 veces seguidas',
  },
  {
    id: 'ee-witching-hour',
    name: 'Hora Bruja',
    type: 'time',
    hint: 'Hay algo especial a las 3:33...',
  },
  {
    id: 'ee-valentines',
    name: 'San Valentín',
    type: 'date',
    hint: 'El 14 de febrero tiene magia',
  },
];

// ─── Themes Data ───

export const THEMES: Theme[] = [
  {
    id: 'theme-default',
    name: 'Rosa Pastel',
    emoji: '🌸',
    colors: {
      primary: '#ffb7c5',
      secondary: '#ffd1dc',
      accent: '#ff8fa3',
      background: '#fff5f7',
    },
    backgroundImage: '/backgrounds/bg-default.png',
    particles: ['💕', '🌸', '✨', '💖', '🎀'],
    unlockCondition: 'default',
  },
  {
    id: 'theme-sakura',
    name: 'Sakura',
    emoji: '🌸',
    colors: {
      primary: '#f58fab',
      secondary: '#ffc1d6',
      accent: '#e85d9a',
      background: '#fff0f6',
    },
    backgroundImage: '/backgrounds/bg-sakura.png',
    particles: ['🌸', '🌺', '🏵️', '💮', '🌷'],
    unlockCondition: 'streak_3',
  },
  {
    id: 'theme-winter',
    name: 'Invierno Suave',
    emoji: '❄️',
    colors: {
      primary: '#9bd7ee',
      secondary: '#dff4ff',
      accent: '#4a9dcc',
      background: '#f8fdff',
    },
    backgroundImage: '/backgrounds/bg-winter.png',
    particles: ['❄️', '⛄', '🌨️', '💎', '✨'],
    unlockCondition: 'achievements_3',
  },
  {
    id: 'theme-halloween',
    name: 'Halloween Kawaii',
    emoji: '🎃',
    colors: {
      primary: '#f6a33b',
      secondary: '#ffe1a8',
      accent: '#d96522',
      background: '#fff8e8',
    },
    backgroundImage: '/backgrounds/bg-halloween.png',
    particles: ['🎃', '👻', '🍬', '🦇', '✨'],
    unlockCondition: 'easter_egg_found',
  },
  {
    id: 'theme-summer',
    name: 'Verano Soleado',
    emoji: '☀️',
    colors: {
      primary: '#ffd34e',
      secondary: '#fff0a8',
      accent: '#f59e0b',
      background: '#fffbea',
    },
    backgroundImage: '',
    particles: ['☀️', '🏖️', '🌊', '🍉', '🕶️', '✨'],
    unlockCondition: 'achievements_5',
  },
  {
    id: 'theme-christmas',
    name: 'Navidad',
    emoji: '🎄',
    colors: {
      primary: '#ff6b6b',
      secondary: '#ffe0e0',
      accent: '#4ecdc4',
      background: '#fff5f5',
    },
    backgroundImage: '/backgrounds/bg-christmas.png',
    particles: ['🎄', '⭐', '🎁', '❄️', '✨'],
    unlockCondition: 'secret_zone',
  },
];

// ─── Dialogues Data ───

export const DIALOGUES: Record<string, Dialogue[]> = {
  happy: [
    { text: '¡Lucy! ¡Qué alegría verte!', emoji: '✨' },
    { text: '¡Haai~! ¡Estoy muy feliz!', emoji: '💖' },
    { text: '¡Hoy es un gran día contigo!', emoji: '🌟' },
    { text: '¡Me encanta cuando vienes!', emoji: '🎀' },
    { text: '¡Eres la mejor cuidadora!', emoji: '👑' },
    { text: '¡Juntos somos invencibles!', emoji: '💪' },
    { text: '¡Te quiero mucho, Lucy!', emoji: '💕' },
    { text: '¡Yaaay! ¡Diversión!', emoji: '🎉' },
  ],
  neutral: [
    { text: 'Hola Lucy~ ¿Cómo va tu día?', emoji: '🌸' },
    { text: '¡Qué lindo día! ¿No crees?', emoji: '☀️' },
    { text: 'Estoy aquí esperándote~', emoji: '🎀' },
    { text: '¿Estudiaste hoy? ¡Tú puedes!', emoji: '📚' },
    { text: 'Recuerda tomar agüita~', emoji: '💧' },
    { text: '¡Un pasito a la vez, Lucy!', emoji: '🐾' },
  ],
  sad: [
    { text: 'Lucy... te extraño mucho...', emoji: '🥺' },
    { text: 'Estoy un poquito triste...', emoji: '😢' },
    { text: '¿Me das un abracito?', emoji: '🫂' },
    { text: 'No me dejes solito...', emoji: '💔' },
    { text: 'Necesito tus mimos...', emoji: '😿' },
  ],
  hungry: [
    { text: '¡Tengo hambre, Lucy!', emoji: '🍓' },
    { text: 'Mi pancita hace ruidos...', emoji: '😋' },
    { text: '¿Me das algo de comer?', emoji: '🍰' },
    { text: '¡Quiero comidita!', emoji: '🍙' },
    { text: 'Mucha hambre... ñam ñam...', emoji: '😮' },
  ],
  sleepy: [
    { text: 'Zzz... tengo sueñito...', emoji: '💤' },
    { text: '¿Ya es hora de dormir?', emoji: '🌙' },
    { text: 'Bostezo... estoy cansadito...', emoji: '😴' },
    { text: 'Necesito una siestita...', emoji: '🛏️' },
    { text: 'Mis ojitos se cierran...', emoji: '😪' },
  ],
  special: [
    { text: '¡Feliz día del amor, Lucy! 💝', emoji: '💝' },
    { text: '¡Es un día especial contigo!', emoji: '🎊' },
    { text: '¡Hoy brillas más que nunca!', emoji: '⭐' },
  ],
  action_feed: [
    { text: '¡Ñam ñam! ¡Delicioso!', emoji: '😋' },
    { text: '¡Qué rico! ¡Gracias Lucy!', emoji: '🍓' },
    { text: '¡Mi comida favorita!', emoji: '✨' },
  ],
  action_play: [
    { text: '¡Yaaay! ¡A jugar!', emoji: '🎮' },
    { text: '¡Qué divertido!', emoji: '🎉' },
    { text: '¡Otra vez, otra vez!', emoji: '🌟' },
  ],
  action_sleep: [
    { text: 'Zzz... buenas noches...', emoji: '💤' },
    { text: 'Dulces sueños, Lucy...', emoji: '🌙' },
    { text: 'Nighty night~', emoji: '⭐' },
  ],
  action_pet: [
    { text: '¡Me encantan tus mimos!', emoji: '💖' },
    { text: '¡Más cariñitos!', emoji: '🥰' },
    { text: '¡Eres tan dulce, Lucy!', emoji: '💕' },
  ],
};

// ─── Character State Map ───

export const CHARACTER_IMAGES: Record<string, string> = {
  idle: '/images/chiikawa-idle.png',
  happy: '/images/chiikawa-happy.png',
  sleep: '/images/chiikawa-sleep.png',
  love: '/images/chiikawa-love.png',
  play: '/images/chiikawa-play.png',
  hungry: '/images/chiikawa-hungry.png',
  cry: '/images/chiikawa-cry.png',
  wave: '/images/chiikawa-wave.png',
};

// ─── Stickers Data ───

export const STICKERS = [
  { id: 'sticker-heart', name: 'Corazón', src: '/stickers/heart.png', emoji: '❤️' },
  { id: 'sticker-star', name: 'Estrella', src: '/stickers/star.png', emoji: '⭐' },
  { id: 'sticker-bow', name: 'Moño', src: '/stickers/bow.png', emoji: '🎀' },
  { id: 'sticker-sparkle', name: 'Brillo', src: '/stickers/sparkle.png', emoji: '✨' },
  { id: 'sticker-envelope', name: 'Sobre', src: null, emoji: '💌' },
  { id: 'sticker-music', name: 'Nota Musical', src: null, emoji: '🎵' },
  { id: 'sticker-trophy', name: 'Trofeo', src: null, emoji: '🏆' },
  { id: 'sticker-lock', name: 'Candado', src: null, emoji: '🔒' },
  { id: 'sticker-key', name: 'Llave', src: null, emoji: '🔑' },
];

// ─── Navigation Items ───

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: '🏠', href: '/' },
  { id: 'tamagotchi', label: 'Chiikawa', icon: '🐾', href: '/tamagotchi' },
  { id: 'letters', label: 'Cartas', icon: '💌', href: '/letters' },
  { id: 'music', label: 'Música', icon: '🎵', href: '/music' },
  { id: 'achievements', label: 'Logros', icon: '🏆', href: '/achievements' },
  { id: 'gallery', label: 'Galería', icon: '🖼️', href: '/gallery' },
];
