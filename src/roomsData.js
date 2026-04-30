// roomsData.js

const roomFolders = [
  {
    folder: "3ers weriririri",
    title: "ليلة الحنّاء - العرس في وسطية الدار",
    text: "في وسطية الدار، كانت الاستعدادات قائمة لحنّاء خديجة...",
  },
  {
    folder: "9ahweji",
    title: "القهوة",
    text: "كانت القهوة العربية مكانًا يجمع مختلف الأجناس...",
  },
  { folder: "henna prep", title: "تحضيرات الحنّاء", text: "..." },
  { folder: "kitchen", title: "المطبخ", text: "..." },
  { folder: "nassej", title: "النسّاج", text: "..." },
  { folder: "s9ifa", title: "بيت السقيفة", text: "..." },
  { folder: "salon", title: "Salon", text: "..." },
  { folder: "si tayeb", title: "دكّان العطور", text: "..." },
  { folder: "sou9", title: "السوق", text: "..." },
  { folder: "zaytounaa", title: "المعصرة", text: "..." },
  { folder: "zhez", title: "بيت الجهاز", text: "..." },
];

// 🔥 load all images automatically (CRA / Webpack)
function importAll(r) {
  return r.keys().map((key) => ({
    path: key,
    src: r(key),
  }));
}

// ⚠️ images must be inside: src/histora/...
const allImages = importAll(require.context("./histora", true, /\.jpg$/));

const roomsData = roomFolders.map((room, index) => {
  const roomImages = allImages
    .filter((img) => img.path.includes(`/${room.folder}/`))
    .map((img) => img.src)
    .sort();

  return {
    id: index + 1,
    title: room.title,

    text: room.text, // 🔑 required
    fullDescription: room.text, // 🔑 optional but safer

    img: roomImages[0] || "",
    gallery: roomImages,
  };
});
export default roomsData;
