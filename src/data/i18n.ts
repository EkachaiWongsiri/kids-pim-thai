export type GuiLanguage = 'th' | 'en';

export const TRANSLATIONS = {
  th: {
    // Portal Navbar
    portalName: 'Mxia App Hub',
    appName: 'Kids Pim Thai',
    appSubtitle: 'เกมฝึกพิมพ์ดีดภาษาไทยและอังกฤษสำหรับเด็ก',
    backToMxia: 'กลับสู่ Mxia Portal',
    navAbout: 'เกี่ยวกับเรา',
    navContact: 'ติดต่อเรา',
    navPrivacy: 'นโยบายความเป็นส่วนตัว',
    navTerms: 'เงื่อนไขการใช้งาน',
    langSwitchLabel: 'English',

    // Start Overlay
    readyTitle: 'พร้อมลุยหรือยังคนเก่ง!',
    readySubtitle: 'วางนิ้วชี้ไว้ที่ปุ่ม ด และ า (แป้นเหย้า) แล้วกดปุ่มเพื่อเริ่มเล่น',
    btnStart: 'เริ่มเล่นเลย!',
    stageTargetPrefix: 'เป้าหมายด่านนี้:',
    stageWordsToClear: 'คำเพื่อผ่านด่าน',
    tipsTitle: '💡 เคล็ดลับการฝึกพิมพ์:',
    tipsText: 'มองจอภาพและสังเกตแสงสีทองบนแป้นพิมพ์ด้านล่าง ไม่ต้องก้มมองแป้นพิมพ์จริง!',

    // Game Header
    score: 'คะแนน',
    combo: 'คอมโบ',
    speed: 'ความเร็ว',
    changeStage: 'เปลี่ยนด่าน',
    customWords: 'คลังคำศัพท์',
    restartStage: 'เริ่มด่านใหม่',
    pause: 'พักเกม',
    resume: 'เล่นต่อ',
    speedSlowest: '🐢 ช้ามาก',
    speedSlow: '🚶 ช้า',
    speedNormal: '⚡ ปกติ',
    speedFast: '🚀 เร็ว',

    // Virtual Keyboard
    virtualKeyboardTitle: 'แป้นพิมพ์สัมผัส',
    nextKey: 'ปุ่มถัดไป:',
    pressShiftToo: 'กด Shift ด้วย!',
    useFinger: 'ใช้นิ้ว',
    fingerGuideToggle: 'บอกตำแหน่งนิ้ว',
    hideKeyboard: 'ซ่อน',
    showKeyboard: 'แสดงแป้นพิมพ์',

    // Modals - Contact
    contactTitle: 'ติดต่อเรา & ส่งข้อเสนอแนะ',
    contactSubtitle: 'เรารับฟังทุกความคิดเห็นเพื่อพัฒนาแอปพลิเคชันให้ดียิ่งขึ้น',
    contactEmailLabel: 'อีเมลติดต่อผู้พัฒนา:',
    contactEmailDesc: 'ผู้ปกครองและคุณครูสามารถส่งข้อเสนอแนะ ข้อสงสัย หรือแจ้งปัญหาได้ที่',
    btnSendEmail: 'ส่งอีเมลหาเรา (support@mxiaapp.com)',
    contactFormName: 'ชื่อของคุณ:',
    contactFormMsg: 'ข้อความ / คำติชม:',
    btnSendFeedback: 'เปิดโปรแกรมอีเมลเพื่อส่งข้อความ',

    // Modals - About
    aboutTitle: 'เกี่ยวกับ Kids Pim Thai & Mxia Hub',
    aboutP1: 'Kids Pim Thai เป็นส่วนหนึ่งของเครือข่ายเว็บแอปพลิเคชัน Mxia Hub (mxiaapp.com) ที่สร้างขึ้นด้วยความตั้งใจที่จะมอบเครื่องมือฝึกทักษะการพิมพ์สัมผัสภาษาไทยและภาษาอังกฤษให้กับเด็กและเยาวชนฟรี',
    aboutP2: 'เราออกแบบเกมให้มีสีสันสดใส กราฟิกสไตล์ยานอวกาศเลเซอร์ยิงลูกโป่งคำ พร้อมเสียงอ่านพยัญชนะ สระ และคำศัพท์ เพื่อให้การฝึกพิมพ์สนุก ไม่น่าเบื่อ และเสริมสร้างทักษะการสะกดคำควบคู่กันไป',

    // Modals - Privacy Policy
    privacyTitle: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
    privacyTag: 'ปลอดภัยสำหรับเด็ก 100% (Kid-Safe)',
    privacyP1: 'Kids Pim Thai และ Mxia ให้ความสำคัญสูงสุดกับความปลอดภัยและความเป็นส่วนตัวของเด็กๆ และผู้ใช้งานทุกท่าน:',
    privacyPoint1Title: '🚫 ไม่มีการเก็บข้อมูลส่วนบุคคลใดๆ (Zero Personal Data Collection):',
    privacyPoint1Desc: 'เราไม่มีการขอชื่อ ที่อยู่ เบอร์โทรศัพท์ บัญชีผู้ใช้ หรือข้อมูลระบุตัวตนใดๆ ทั้งสิ้น',
    privacyPoint2Title: '💾 ข้อมูลเกมบันทึกในเครื่องของคุณเท่านั้น (Local Storage):',
    privacyPoint2Desc: 'คะแนนสูงสุด (High Score) และการตั้งค่าเสียงจะถูกบันทึกลงใน Browser LocalStorage ของอุปกรณ์คุณเท่านั้น ไม่มีการส่งข้อมูลกลับมายัง Server',
    privacyPoint3Title: '🔒 ไม่มีการใช้ Tracking Cookies เพื่อการโฆษณาแอบแฝง:',
    privacyPoint3Desc: 'เว็บทำงานแบบ Client-side 100% ปลอดภัย ไร้กังวลสำหรับบุตรหลาน',

    // Modals - Terms
    termsTitle: 'เงื่อนไขการใช้บริการ (Terms of Service)',
    termsTag: 'ใช้งานได้ฟรี 100% ไม่มีข้อแม้',
    termsP1: 'Kids Pim Thai เปิดให้เด็กๆ ผู้ปกครอง ครู และสถานศึกษา ใช้งานได้ฟรี 100% โดยไม่มีค่าใช้จ่ายแอบแฝง ไม่มีการสมัครสมาชิก และไม่มีการล็อคฟีเจอร์ใดๆ',
    termsP2: 'คุณสามารถนำไปใช้ในการเรียนการสอนในห้องเรียนหรือฝึกฝนที่บ้านได้อย่างอิสระ',

    // Affiliate Sidebar
    sponsorTitle: 'พื้นที่สนับสนุน & สื่อการเรียนรู้',
    sponsorNotice: 'Affiliate & Sponsor Slot',
    sponsorSample1: '📚 แนะนำ: หนังสือนิทาน & แบบฝึกหัดภาษาไทยสำหรับเด็ก',
    sponsorSample2: '⌨️ แนะนำ: คีย์บอร์ดปุ่มนุ่มขนาดพอดีมือสำหรับเด็กวัยเรียน',
    sponsorContact: 'สนใจสนับสนุนพื้นที่ติดต่อ support@mxiaapp.com',

    // Dialogs
    gameOverTitle: 'พลังชีวิตหมดแล้ว!',
    gameOverEncourage: 'ไม่เป็นไรนะคนเก่ง! การฝึกพิมพ์ต้องใช้เวลา ลองใหม่อีกรอบกันเถอะ ✨',
    btnRetry: 'ลองใหม่อีกครั้ง',
    btnSlowDown: 'ปรับให้ช้าลงหน่อย แล้วลองใหม่',
    btnChooseStage: 'เลือกด่านอื่น',
    victoryTitle: 'สุดยอดมากเลย! 🎉',
    victoryDesc: 'คุณผ่านด่านสำเร็จแล้ว!',
    btnNextStage: 'ลุยต่อด่านถัดไป',
    btnReplay: 'เล่นซ้ำด่านนี้',
    totalScore: 'คะแนนรวม',
    wpm: 'ความเร็ว',
    accuracy: 'ความแม่นยำ',
    maxCombo: 'คอมโบสูงสุด',
    close: 'ปิด',
  },
  en: {
    // Portal Navbar
    portalName: 'Mxia App Hub',
    appName: 'Kids Pim Thai',
    appSubtitle: 'Thai & English Touch Typing Game for Kids',
    backToMxia: 'Back to Mxia Portal',
    navAbout: 'About Us',
    navContact: 'Contact Us',
    navPrivacy: 'Privacy Policy',
    navTerms: 'Terms of Service',
    langSwitchLabel: 'ภาษาไทย',

    // Start Overlay
    readyTitle: 'Ready to Type, Little Champ!',
    readySubtitle: 'Place index fingers on home keys (F & J / ด & า) and click to start!',
    btnStart: 'Play Now!',
    stageTargetPrefix: 'Stage Goal:',
    stageWordsToClear: 'words to clear',
    tipsTitle: '💡 Typing Tip:',
    tipsText: 'Keep your eyes on the screen and follow the glowing key guides below without looking down!',

    // Game Header
    score: 'Score',
    combo: 'Combo',
    speed: 'Speed',
    changeStage: 'Stages',
    customWords: 'Custom Words',
    restartStage: 'Restart',
    pause: 'Pause',
    resume: 'Resume',
    speedSlowest: '🐢 Very Slow',
    speedSlow: '🚶 Slow',
    speedNormal: '⚡ Normal',
    speedFast: '🚀 Fast',

    // Virtual Keyboard
    virtualKeyboardTitle: 'Touch Keyboard',
    nextKey: 'Next Key:',
    pressShiftToo: 'Press Shift too!',
    useFinger: 'Finger:',
    fingerGuideToggle: 'Finger Guide',
    hideKeyboard: 'Hide',
    showKeyboard: 'Show Keyboard',

    // Modals - Contact
    contactTitle: 'Contact Us & Feedback',
    contactSubtitle: 'We welcome all parent and teacher suggestions to improve our educational apps.',
    contactEmailLabel: 'Developer Support Email:',
    contactEmailDesc: 'Parents, educators, and schools can reach us anytime at',
    btnSendEmail: 'Send Email (support@mxiaapp.com)',
    contactFormName: 'Your Name:',
    contactFormMsg: 'Your Feedback / Message:',
    btnSendFeedback: 'Open Email Client to Send',

    // Modals - About
    aboutTitle: 'About Kids Pim Thai & Mxia Hub',
    aboutP1: 'Kids Pim Thai is part of the Mxia App Hub (mxiaapp.com) suite of web tools, created to provide a fun and free Thai & English touch-typing learning platform for children worldwide.',
    aboutP2: 'Featuring colorful cosmic laser blasting mechanics and native speech pronunciation, children learn finger muscle memory while reinforcing spelling in a vibrant, safe environment.',

    // Modals - Privacy Policy
    privacyTitle: 'Privacy Policy',
    privacyTag: '100% Kid-Safe & COPPA Compliant Spirit',
    privacyP1: 'Kids Pim Thai and Mxia prioritize the utmost safety and privacy for children and families:',
    privacyPoint1Title: '🚫 Zero Personal Data Collection:',
    privacyPoint1Desc: 'We do not collect names, addresses, emails, phone numbers, or any identifiable personal information.',
    privacyPoint2Title: '💾 Local Storage Only:',
    privacyPoint2Desc: 'High scores and sound preferences are stored solely inside your browser local storage. No data is transmitted to external servers.',
    privacyPoint3Title: '🔒 No Invasive Tracking Cookies:',
    privacyPoint3Desc: '100% client-side execution designed for maximum security and peace of mind.',

    // Modals - Terms
    termsTitle: 'Terms of Service',
    termsTag: '100% Free Forever with Zero Conditions',
    termsP1: 'Kids Pim Thai is completely free for all children, parents, teachers, and schools with zero hidden paywalls, subscriptions, or gated locks.',
    termsP2: 'You are welcome to use it in classrooms, computer labs, or homeschooling freely.',

    // Affiliate Sidebar
    sponsorTitle: 'Sponsored & Learning Resources',
    sponsorNotice: 'Affiliate & Sponsor Slot',
    sponsorSample1: '📚 Recommended: Kids Thai & English Storybooks & Activity Workbooks',
    sponsorSample2: '⌨️ Recommended: Ergonomic Kid-friendly Touch-Typing Keyboards',
    sponsorContact: 'For sponsorship inquiries, contact support@mxiaapp.com',

    // Dialogs
    gameOverTitle: 'Out of Hearts!',
    gameOverEncourage: 'Great effort! Touch typing takes practice. Let’s try again! ✨',
    btnRetry: 'Try Again',
    btnSlowDown: 'Slow Down & Try Again',
    btnChooseStage: 'Choose Another Stage',
    victoryTitle: 'Awesome Job! 🎉',
    victoryDesc: 'You cleared this stage successfully!',
    btnNextStage: 'Next Stage',
    btnReplay: 'Replay Stage',
    totalScore: 'Total Score',
    wpm: 'Speed',
    accuracy: 'Accuracy',
    maxCombo: 'Max Combo',
    close: 'Close',
  }
};
