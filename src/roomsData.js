const roomFolders = [
  { folder: "3ers weriririri", title: "ليلة الحنّاء - العرس في وسطية الدار" },
  { folder: "9ahweji", title: "القهوة" },
  { folder: "henna prep", title: "تحضيرات الحنّاء" },
  { folder: "kitchen", title: "المطبخ" },
  { folder: "nassej", title: "النسّاج" },
  { folder: "s9ifa", title: "بيت السقيفة" },
  { folder: "salon", title: "Salon" },
  { folder: "si tayeb", title: "دكّان العطور" },
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

// 📷 load jpg images from histora_imgs
const allImages = importImages(
  require.context("./histora_imgs", true, /\.jpg$/),
);

// 📄 load txt files as URL references
const textFiles = require.context("./histora_imgs", true, /\.txt$/);

const getTextUrlsByFolder = (folder) => {
  const folderKeys = textFiles
    .keys()
    .filter((key) => key.startsWith(`./${folder}/`));

  return folderKeys.map((key) => {
    const fileResource = textFiles(key);
    return fileResource?.default || fileResource;
  });
};

const roomsData = roomFolders.map((room, index) => {
  const baseFolder = `/${room.folder}/`;

  const roomImages = allImages
    .filter((img) => img.path.includes(baseFolder))
    .map((img) => img.src)
    .sort();

  const textUrls = getTextUrlsByFolder(room.folder);

  return {
    id: index + 1,
    title: room.title,
    textUrls,
    texts: textUrls,
    languageTexts: { AR: "", FR: "", ENG: "" },
    text: "",
    fullDescription: "",
    img: roomImages[0] || "",
    gallery: roomImages,
  };
});

export default roomsData;
