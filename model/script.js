// ===== OCEAN GUARDIAN — SHARED SCRIPT =====

// ----- PARTICLE SYSTEM -----
function initParticles(count = 30) {
  const container = document.querySelector('.particles');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

// ----- GEOLOCATION -----
function getLocation(callback) {
  if (!navigator.geolocation) {
    callback(null, 'Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    err => callback(null, err.message)
  );
}

// ----- LOCAL STORAGE -----
const STORAGE_KEY = 'og_reports';

function saveReport(report) {
  const reports = getReports();
  report.id = Date.now();
  report.timestamp = new Date().toISOString();
  reports.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 100)));
  return report;
}

function getReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

// ----- ALERT NOTIFICATION -----
function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  return Notification.requestPermission();
}

function sendNotification(title, body, icon = '🌊') {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>' + icon + '</text></svg>' });
  }
}

// ----- SIMULATED REAL-TIME DATA -----
const BEACH_DATA = {
  'Phuket - Patong': { safety: 'warning', wave: 1.8, wind: 18, uv: 9, rip: 'Moderate' },
  'Phuket - Kata': { safety: 'safe', wave: 0.8, wind: 10, uv: 8, rip: 'Low' },
  'Koh Samui - Chaweng': { safety: 'danger', wave: 2.5, wind: 28, uv: 7, rip: 'High' },
  'Koh Chang - White Sand': { safety: 'safe', wave: 0.6, wind: 8, uv: 6, rip: 'Low' },
  'Krabi - Ao Nang': { safety: 'warning', wave: 1.4, wind: 15, uv: 9, rip: 'Moderate' },
  'Hua Hin Beach': { safety: 'safe', wave: 0.5, wind: 12, uv: 8, rip: 'Low' },
};

const MARINE_SPECIES = [
  { id: 1, name: 'Portuguese Man o\' War', nameTh: 'แมงกะพรุนคนเดินเรือ', emoji: '🪼', danger: 'HIGH', color: '#ff6b6b',
    desc: 'มีเส้นพิษยาว ห้ามสัมผัส', firstAid: ['ล้างด้วยน้ำทะเล ห้ามใช้น้ำจืด', 'ใช้บัตรหรือวัตถุแข็งเขี่ยหนวดออก ห้ามใช้มือ', 'แช่ในน้ำร้อน 45°C นาน 20 นาที', 'ไปพบแพทย์ทันทีหากมีอาการรุนแรง'], habitat: 'น้ำเปิด' },
  { id: 2, name: 'Sea Urchin', nameTh: 'เม่นทะเล', emoji: '🦔', danger: 'MEDIUM', color: '#ffb703',
    desc: 'หนามแหลมคม ทิ่มผิวได้ง่าย', firstAid: ['แช่เท้า/มือในน้ำร้อน', 'ใช้แหนบดึงหนามออก', 'ทาน้ำมันมะกอกแล้วบีบออก', 'ล้างด้วยน้ำยาฆ่าเชื้อ'], habitat: 'แนวหิน ปะการัง' },
  { id: 3, name: 'Lionfish', nameTh: 'ปลาสิงโต', emoji: '🐟', danger: 'HIGH', color: '#ff6b6b',
    desc: 'ครีบมีพิษ สวยงามแต่อันตราย', firstAid: ['แช่ในน้ำร้อน 45°C ทันที 30-90 นาที', 'ห้ามบีบหรือดูดแผล', 'ไปพบแพทย์ทันที', 'ห้ามเอาเอทานอลทา'], habitat: 'แนวปะการัง' },
  { id: 4, name: 'Blue-ringed Octopus', nameTh: 'หมึกวงแหวนสีน้ำเงิน', emoji: '🐙', danger: 'CRITICAL', color: '#ef4444',
    desc: 'พิษร้ายแรงมาก เล็กแต่อันตราย', firstAid: ['โทร 1669 ทันที!', 'กด Pressure Immobilization', 'ห้ามมิให้ผู้ป่วยขยับ', 'เตรียมช่วย CPR หากหยุดหายใจ'], habitat: 'เขตน้ำตื้น หิน' },
  { id: 5, name: 'Stonefish', nameTh: 'ปลาหิน', emoji: '🪨', danger: 'CRITICAL', color: '#ef4444',
    desc: 'ปลาพิษที่อันตรายที่สุดในโลก', firstAid: ['แช่ในน้ำร้อน 45°C ทันที!', 'ไปพบแพทย์ฉุกเฉิน', 'มีแอนติเซรัมเฉพาะ', 'ห้ามเดิน'], habitat: 'พื้นทราย หิน' },
  { id: 6, name: 'Clownfish', nameTh: 'ปลาการ์ตูน', emoji: '🐠', danger: 'SAFE', color: '#00e676',
    desc: 'ปลาไม่มีพิษ ควรถ่ายภาพแทนจับ', firstAid: ['ไม่จำเป็น — ไม่เป็นอันตราย', 'หากถูกกัด: ล้างด้วยน้ำสะอาด', 'สัตว์ใกล้สูญพันธุ์ ห้ามจับ'], habitat: 'ดอกไม้ทะเล' },
  { id: 7, name: 'Crown-of-thorns', nameTh: 'ปลาดาวหนาม', emoji: '⭐', danger: 'MEDIUM', color: '#ffb703',
    desc: 'หนามพิษทำลายปะการัง', firstAid: ['แช่น้ำร้อน 45°C', 'ไปพบแพทย์หากหนามหักในเนื้อ', 'ล้างแผลสะอาด'], habitat: 'แนวปะการัง' },
  { id: 8, name: 'Hawksbill Turtle', nameTh: 'เต่ากระ', emoji: '🐢', danger: 'SAFE', color: '#00e676',
    desc: 'สัตว์คุ้มครองใกล้สูญพันธุ์!', firstAid: ['ไม่เป็นอันตราย', 'ห้ามสัมผัสหรือขี่', 'รายงานพิกัดพบเห็นในระบบ', 'ถ่ายภาพจากระยะปลอดภัย'], habitat: 'น้ำเปิด แนวปะการัง' },
];

const ALERTS_DATA = [
  { id: 1, type: 'danger', icon: '🌊', title: 'Rip Current Warning — Patong Beach', desc: 'ตรวจพบกระแสน้ำดูดรุนแรงบริเวณหาดป่าตอง ความเร็ว 2.8 m/s ห้ามลงน้ำในบริเวณดังกล่าว', time: '2 minutes ago', location: 'Patong Beach, Phuket' },
  { id: 2, type: 'warning', icon: '⚡', title: 'Storm Warning — Koh Samui', desc: 'พายุฝนฟ้าคะนองคาดเข้าถึงหาดเฉวงภายใน 45 นาที ควรออกจากชายหาดโดยด่วน', time: '8 minutes ago', location: 'Chaweng Beach, Koh Samui' },
  { id: 3, type: 'danger', icon: '🪼', title: 'Jellyfish Swarm Detected', desc: 'พบฝูงแมงกะพรุนจำนวนมากบริเวณอ่าวนาง ความหนาแน่นสูงผิดปกติ งดลงน้ำ', time: '15 minutes ago', location: 'Ao Nang, Krabi' },
  { id: 4, type: 'info', icon: '🐢', title: 'Rare Sea Turtle Sighting', desc: 'พบเต่ากระวางไข่บริเวณหาดไม้ขาว โปรดรักษาระยะห่างอย่างน้อย 10 เมตร', time: '32 minutes ago', location: 'Nai Yang Beach, Phuket' },
  { id: 5, type: 'warning', icon: '☀️', title: 'Extreme UV Index Alert', desc: 'ดัชนี UV วันนี้ระดับ 11+ (Extreme) ควรทาครีมกันแดด SPF 50+ และหลีกเลี่ยง 10:00-14:00', time: '1 hour ago', location: 'Nationwide - Thailand Coasts' },
  { id: 6, type: 'info', icon: '♻️', title: 'Community Clean-up Success', desc: 'อาสาสมัคร 124 คน ช่วยกันเก็บขยะจากหาดในหวาน 380 กิโลกรัมวันนี้ ขอบคุณทุกท่าน!', time: '2 hours ago', location: 'Nai Harn Beach, Phuket' },
];

// ----- UTILITY -----
function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getSafetyBadge(level) {
  const map = { safe: ['badge-safe', '✅ SAFE'], warning: ['badge-warning', '⚠️ CAUTION'], danger: ['badge-danger', '🚨 DANGER'] };
  const [cls, text] = map[level] || map.safe;
  return `<span class="badge ${cls}">${text}</span>`;
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = { info: '#00d4d4', success: '#00e676', warning: '#ffb703', error: '#ff6b6b' };
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background: rgba(6,40,64,0.95); border: 1px solid ${colors[type]};
    color: white; padding: 12px 24px; border-radius: 12px;
    font-family: Outfit, sans-serif; font-size: 0.9rem; font-weight: 500;
    z-index: 9999; backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    animation: toast-in 0.3s ease;
    white-space: nowrap;
  `;
  toast.textContent = message;
  const style = document.createElement('style');
  style.textContent = '@keyframes toast-in { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// Mark active nav
document.addEventListener('DOMContentLoaded', () => {
  initParticles(25);
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav-item, .nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
});
