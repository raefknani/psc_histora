const roomFolders = [
  { folder: "3ers-weriririri", title: "ليلة الحنّاء - العرس في وسطية الدار" },
  { folder: "9ahweji", title: "القهوة" },
  { folder: "henna-prep", title: "تحضيرات الحنّاء" },
  { folder: "kitchen", title: "المطبخ" },
  { folder: "nassej", title: "النسّاج" },
  { folder: "s9ifa", title: "بيت السقيفة" },
  { folder: "salon", title: "Salon" },
  { folder: "si-tayeb", title: "دكّان العطور" },
  { folder: "sou9", title: "السوق" },
  { folder: "zaytounaa", title: "المعصرة" },
  { folder: "zhez", title: "بيت الجهاز" },
];

// 🔥 IMAGES loader
function importImages(r) {
  return r.keys().map((key) => ({
    path: key,
    src: r(key),
  }));
}

// 📷 load jpg images
const allImages = importImages(require.context("./histora", true, /\.jpg$/));

// 📄 load txt files as STRING (IMPORTANT PART)
const textFiles = require.context("./histora", true, /\.txt$/);

// helper to get text by folder
const getText = (folder) => {
  const match = textFiles.keys().find((key) => key.includes(`/${folder}/`));

  if (!match) return "";

  return textFiles(match).default || textFiles(match);
};

const roomsData = roomFolders.map((room, index) => {
  const baseFolder = `/${room.folder}/`;

  const roomImages = allImages
    .filter((img) => img.path.includes(baseFolder))
    .map((img) => img.src)
    .sort();

  const text = getText(room.folder);

  return {
    id: index + 1,
    title: room.title,

    // ✅ extracted from txt file
    text,
    fullDescription: text,

    img: roomImages[0] || "",
    gallery: roomImages,
  };
});

export default roomsData;
