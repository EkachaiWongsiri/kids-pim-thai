import { Stage } from '../types/game';

export const THAI_STAGES: Stage[] = [
  {
    id: 1,
    title: 'ด่านที่ 1: แป้นเหย้ามือใหม่ (Home Row)',
    subtitle: 'ฝึกสัมผัสนิ้วแถวกลาง',
    description: 'ฝึกพิมพ์ตัวอักษรบนแป้นเหย้า ฟ ห ก ด ่ า ส ว ง',
    language: 'th',
    category: 'letters',
    words: ['ก', 'ด', 'า', 'ส', 'ห', 'ฟ', 'ว', 'ง', '่', 'ก', 'ด', 'า', 'ส', 'ห', 'ว'],
    targetCount: 10,
    speedBase: 0.6,
    icon: '🏠'
  },
  {
    id: 2,
    title: 'ด่านที่ 2: ผสมคำแป้นเหย้า',
    subtitle: 'รวมร่างเป็นคำง่ายๆ',
    description: 'ฝึกพิมพ์คำสั้นที่เกิดจากแป้นเหย้า เช่น กา, ดา, สาว, หา, วา',
    language: 'th',
    category: 'words',
    words: ['กา', 'ดา', 'หา', 'สา', 'วา', 'งา', 'ว่า', 'ด่า', 'สาว', 'กาง', 'หาง', 'ดวง', 'ดาว'],
    targetCount: 10,
    speedBase: 0.7,
    icon: '🌱'
  },
  {
    id: 3,
    title: 'ด่านที่ 3: แถวบนสุดซ่า (Top Row)',
    subtitle: 'ก้าวสู่อักษรแถวด้านบน',
    description: 'ฝึกพิมพ์ พ ะ ั ี ร น ย บ ล ไ ำ',
    language: 'th',
    category: 'letters',
    words: ['พ', 'ะ', 'ร', 'น', 'ย', 'บ', 'ล', 'ไ', 'ำ', 'ี', 'ั', 'ๆ'],
    targetCount: 10,
    speedBase: 0.75,
    icon: '🚀'
  },
  {
    id: 4,
    title: 'ด่านที่ 4: แถวล่างทรงพลัง (Bottom Row)',
    subtitle: 'นิ้วเอื้อมลงแถวล่าง',
    description: 'ฝึกพิมพ์ ผ ป แ อ ิ ื ท ม ใ ฝ',
    language: 'th',
    category: 'letters',
    words: ['ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ', 'ม', 'ป', 'อ'],
    targetCount: 10,
    speedBase: 0.75,
    icon: '⚡'
  },
  {
    id: 5,
    title: 'ด่านที่ 5: สระและวรรณยุกต์พาเพลิน',
    subtitle: 'วรรณยุกต์ เอก โท ตรี จัตวา',
    description: 'ฝึกพิมพ์สระและวรรณยุกต์ เช่น ะ า ิ ี ุ ู ่ ้ ๊ ๋ ์',
    language: 'th',
    category: 'vowels',
    words: ['ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', '่', '้', '๊', '๋', '์', '็'],
    targetCount: 10,
    speedBase: 0.8,
    icon: '🎵'
  },
  {
    id: 6,
    title: 'ด่านที่ 6: ก๊วนสัตว์โลกน่ารัก',
    subtitle: 'คำศัพท์สัตว์แสนคุ้นเคย',
    description: 'ฝึกพิมพ์ชื่อสัตว์ แมว หมา ช้าง นก ปลา ม้า เป็ด ไก่',
    language: 'th',
    category: 'words',
    words: ['แมว', 'หมา', 'ช้าง', 'นก', 'ปลา', 'ม้า', 'เป็ด', 'ไก่', 'หมู', 'ลิง', 'กบ', 'เต่า', 'หมี', 'กุ้ง', 'สิงโต', 'กระต่าย'],
    targetCount: 12,
    speedBase: 0.85,
    icon: '🐱'
  },
  {
    id: 7,
    title: 'ด่านที่ 7: ผลไม้และของอร่อย',
    subtitle: 'คำศัพท์ผลไม้แสนอร่อย',
    description: 'ฝึกพิมพ์ กล้วย ส้ม แตงโม มะม่วง ขนมปัง เค้ก นม',
    language: 'th',
    category: 'words',
    words: ['กล้วย', 'ส้ม', 'แตงโม', 'มะม่วง', 'องุ่น', 'ชมพู่', 'แอปเปิ้ล', 'ขนมปัง', 'เค้ก', 'นมสด', 'ไอศกรีม', 'น้ำส้ม', 'แตงกวา'],
    targetCount: 12,
    speedBase: 0.9,
    icon: '🍉'
  },
  {
    id: 8,
    title: 'ด่านที่ 8: ครอบครัวและโรงเรียน',
    subtitle: 'คำศัพท์รอบตัวเด็กๆ',
    description: 'ฝึกพิมพ์ พ่อ แม่ พี่ น้อง คุณครู เพื่อน สมุด ดินสอ',
    language: 'th',
    category: 'words',
    words: ['พ่อ', 'แม่', 'พี่', 'น้อง', 'คุณครู', 'เพื่อน', 'สมุด', 'ดินสอ', 'โต๊ะ', 'เก้าอี้', 'บ้าน', 'รถยนต์', 'กระเป๋า'],
    targetCount: 12,
    speedBase: 0.95,
    icon: '🏫'
  },
  {
    id: 9,
    title: 'ด่านที่ 9: ผจญภัยปุ่มชิฟต์ (Shift Keys)',
    subtitle: 'ฝึกกดปุ่ม Shift ยกนิ้วซ้ายขวา',
    description: 'ฝึกพิมพ์ ษ ศ ฤ ฆ ญ ฎ ฏ ฐ ฑ ฒ ณ ฌ โ ?',
    language: 'th',
    category: 'letters',
    words: ['ษ', 'ศ', 'ฤ', 'ฆ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ', 'ฌ', 'โ', 'ธ'],
    targetCount: 10,
    speedBase: 0.8,
    icon: '👑'
  },
  {
    id: 10,
    title: 'ด่านที่ 10: ยอดนักพิมพ์ประโยคทอง',
    subtitle: 'พิมพ์ประโยคต่อเนื่องสร้างความมั่นใจ',
    description: 'ฝึกพิมพ์ประโยคภาษาไทยน่ารักๆ สั้นและกระชับ',
    language: 'th',
    category: 'sentences',
    words: [
      'เด็กดีตั้งใจเรียน',
      'หนูรักคุณพ่อคุณแม่',
      'ฉันชอบกินผลไม้',
      'ท้องฟ้าแจ่มใส',
      'เรามาร้องเพลงกัน',
      'น้องแมวน่ารักจัง',
      'สวัสดีตอนเช้า',
      'วันนี้สนุกมากเลย'
    ],
    targetCount: 8,
    speedBase: 0.85,
    icon: '🏆'
  }
];

export const ENGLISH_STAGES: Stage[] = [
  {
    id: 101,
    title: 'Stage 1: Home Row Starters',
    subtitle: 'Master the middle keys',
    description: 'Practice typing letters: A S D F J K L ;',
    language: 'en',
    category: 'letters',
    words: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
    targetCount: 10,
    speedBase: 0.6,
    icon: '⭐'
  },
  {
    id: 102,
    title: 'Stage 2: Top Row Explorers',
    subtitle: 'Reach high above',
    description: 'Practice typing letters: Q W E R T Y U I O P',
    language: 'en',
    category: 'letters',
    words: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 't', 'r', 'e'],
    targetCount: 10,
    speedBase: 0.75,
    icon: '🪐'
  },
  {
    id: 103,
    title: 'Stage 3: Bottom Row Masters',
    subtitle: 'Dive deep below',
    description: 'Practice typing letters: Z X C V B N M',
    language: 'en',
    category: 'letters',
    words: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'c', 'v', 'b', 'n', 'm'],
    targetCount: 10,
    speedBase: 0.75,
    icon: '🌊'
  },
  {
    id: 104,
    title: 'Stage 4: Cute Animals',
    subtitle: 'Spell animal friends',
    description: 'Type words like cat, dog, bird, lion, panda',
    language: 'en',
    category: 'words',
    words: ['cat', 'dog', 'bird', 'fish', 'duck', 'lion', 'bear', 'frog', 'pig', 'cow', 'panda', 'tiger', 'rabbit'],
    targetCount: 12,
    speedBase: 0.85,
    icon: '🐶'
  },
  {
    id: 105,
    title: 'Stage 5: Yummy Treats',
    subtitle: 'Delicious foods & fruits',
    description: 'Type words like apple, cake, milk, pizza, cookie',
    language: 'en',
    category: 'words',
    words: ['apple', 'banana', 'orange', 'milk', 'cake', 'bread', 'egg', 'rice', 'pizza', 'cookie', 'juice', 'candy'],
    targetCount: 12,
    speedBase: 0.9,
    icon: '🍕'
  },
  {
    id: 106,
    title: 'Stage 6: Rainbow Colors',
    subtitle: 'Vibrant colors everywhere',
    description: 'Type colors: red, blue, green, yellow, pink, purple',
    language: 'en',
    category: 'words',
    words: ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'black', 'white', 'brown', 'gold', 'silver'],
    targetCount: 12,
    speedBase: 0.95,
    icon: '🌈'
  },
  {
    id: 107,
    title: 'Stage 7: Cheer & Sentences',
    subtitle: 'Fun short positive phrases',
    description: 'Type encouraging English sentences',
    language: 'en',
    category: 'sentences',
    words: [
      'I love coding',
      'Good morning',
      'Have fun today',
      'You can do it',
      'Happy smile',
      'Super star',
      'Play together',
      'Sunny day'
    ],
    targetCount: 8,
    speedBase: 0.85,
    icon: '🌟'
  }
];

export const CUSTOM_PRESETS = [
  {
    name: 'หมวดสัตว์น่ารัก (Thai Animals)',
    lang: 'th' as const,
    words: ['แมว', 'หมา', 'กระต่าย', 'ช้าง', 'สิงโต', 'เสือ', 'หมี', 'แพนด้า', 'โลมา', 'นกฮูก', 'จิงโจ้', 'ยีราฟ']
  },
  {
    name: 'หมวดผักผลไม้ (Thai Fruits & Veggies)',
    lang: 'th' as const,
    words: ['มะม่วง', 'แตงโม', 'ทุเรียน', 'มังคุด', 'กล้วยหอม', 'สตรอว์เบอร์รี', 'แครอท', 'ผักกาด', 'มะเขือเทศ']
  },
  {
    name: 'หมวดสิ่งของรอบตัว (Daily Objects)',
    lang: 'th' as const,
    words: ['ดินสอ', 'ยางลบ', 'ไม้บรรทัด', 'กระเป๋า', 'รองเท้า', 'หมวก', 'แว่นตา', 'นาฬิกา', 'โทรศัพท์']
  },
  {
    name: 'Animals & Nature (English)',
    lang: 'en' as const,
    words: ['cat', 'puppy', 'dolphin', 'penguin', 'butterfly', 'sunflower', 'rainbow', 'ocean', 'forest']
  },
  {
    name: 'Space & Adventure (English)',
    lang: 'en' as const,
    words: ['rocket', 'planet', 'galaxy', 'astronaut', 'comet', 'meteor', 'spaceship', 'telescope']
  }
];
