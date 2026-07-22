// ============================================================
// MACRO GAME — Config (Self-Contained)
// Brand, sosial, data produk & hero
// ============================================================

window.BAM_CONFIG = {
  brand: {
    name: "BAM PROJECT",
    logo: "/assets/Logo_BAM_Transparant.png"
  },
  social: {
    whatsapp: "https://api.whatsapp.com/send/?phone=6289697523717",
    tiktok:   "https://www.tiktok.com/@project_bam",
    youtube:  "https://www.youtube.com/@project_bam_yt",
    discord:  "https://discord.com/invite/zpuM9PRSdQ"
  },
  socialLinks: [
    { id: "whatsapp", icon: "fa-whatsapp", label: "WhatsApp", color: "#25d366" },
    { id: "discord",  icon: "fa-discord",  label: "Discord",  color: "#5865f2" },
    { id: "tiktok",   icon: "fa-tiktok",   label: "TikTok",   color: "#111827" },
    { id: "youtube",  icon: "fa-youtube",  label: "YouTube",  color: "#ff0000" }
  ]
};

window.BAM_CATEGORIES = window.BAM_CATEGORIES || {};

window.BAM_CATEGORIES["macro-recoil"] = {
  id: "macro-recoil",
  name: "Project Macro Game",
  label: "MACRO GAME",
  href: "/projects/macro-game/index.html",
  icon: "fa-crosshairs",
  productThumbnail: "image",
  hero: {
    eyebrow: "Kategori",
    title: ["Project", "Macro", "Game"],
    description: "",
    stats: [
      { value: "500+", label: "Total Pembeli" },
      { value: "4.9★", label: "Rating" },
      { value: "100%", label: "Lifetime Access" }
    ]
  },
  infoUpdate: {
    badge: "MACRO GAME",
    news: [
      { title: "Request Game Ready !!!", date: " ", tag: " ", description: "silahkan hubungi admin jika request macro game", pinned: false },
      { title: "Info Update !!!", date: " ", tag: " ", description: "join discord untuk info update!", pinned: false },
      { title: "Info Macro !!!", date: " ", tag: " ", description: "ini hanya macro mouse bukan cheat game!", pinned: false }
    ]
  },
  cta: {
    title: "Siap pilih Project Macro Game terbaik?",
    description: "Hubungi admin untuk konsultasi, order, dan instalasi langsung"
  },
  products: [
    {
      id: "pubg-sw-lite", name: "PUBG - Lite", subtitle: "MODE HOLD / TOGGLE",
      price: "Rp 100.000 (Lifetime)", tag: "PUBG (Software)", status: "active",
      image: "https://4kwallpapers.com/images/wallpapers/playerunknowns-2732x2732-20844.jpg",
      videoUrl: "", videoId: "YoyGEKerbjc", video1Label: "Demo [Lite] Mode Hold",
      videoUrl2: "", videoId2: "n7DOgW1gn5w", video2Label: "Demo [Lite] Mode Toggle",
      description: " ",
      details: ["hanya aktive ketika ads / scope", "fitur terbatas, semi-manual, tapi tetap aman dan powerfull", "support semua jenis mouse", "tanpa injeksi kode"],
      specs: ["STEAM VERSION"]
    },
    {
      id: "pubg-sw-pro", name: "PUBG - Pro", subtitle: "MODE HOLD / TOGGLE",
      price: "Rp 150.000 (Lifetime)", tag: "PUBG (Software)", status: "active",
      image: "https://4kwallpapers.com/images/wallpapers/playerunknowns-2732x2732-20844.jpg",
      videoUrl: "", videoId: "yCeOoyfk2Rk", video1Label: "Demo [Pro] Mode Hold",
      videoUrl2: "", videoId2: "KuPa3mpymDo", video2Label: "Demo [Pro] Mode Toggle",
      description: " ",
      details: ["fitur recoil untuk mode ads dan hipfire", "fitur otomatis, scan senjata preset, powerfull dan yg pasti aman", "support semua jenis mouse", "tanpa injeksi kode"],
      specs: ["STEAM VERSION"]
    },
    {
      id: "coming-soon-hw", name: "COMING SOON!!", subtitle: "-",
      price: "-", tag: "(UNIT-X)", status: "soon",
      image: "https://media.indiedb.com/images/games/1/43/42826/COMING_SOON.jpg",
      videoUrl: "", videoId: "-", video1Label: "-",
      videoUrl2: "", videoId2: "-", video2Label: "-",
      description: "Produk hardware Unit-X sedang dalam pengembangan.",
      details: ["Produk hardware Unit-X sedang dalam pengembangan."],
      specs: ["Info segera hadir", "Follow sosial media kami"]
    }
  ]
};
