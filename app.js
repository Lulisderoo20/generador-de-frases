const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const DEFAULT_PHRASE = "Lo que vibra con vos siempre encuentra una forma de volver.";
const DEFAULT_SIGNATURE = "@luchilisdero";

const palettes = [
  {
    name: "Durazno pop",
    background: "#ffb38a",
    accent: "#4d261f",
    frame: "#7a4137",
  },
  {
    name: "Limon fresco",
    background: "#d8f05e",
    accent: "#243115",
    frame: "#536928",
  },
  {
    name: "Menta punch",
    background: "#8de6ca",
    accent: "#173930",
    frame: "#3b6d60",
  },
  {
    name: "Aqua piscina",
    background: "#7adaf6",
    accent: "#15374f",
    frame: "#41708b",
  },
  {
    name: "Rosa chicle",
    background: "#ff97c7",
    accent: "#4f2139",
    frame: "#8a516d",
  },
  {
    name: "Lavanda happy",
    background: "#c8a8ff",
    accent: "#35224d",
    frame: "#705595",
  },
  {
    name: "Coral juicy",
    background: "#ff917c",
    accent: "#4c241d",
    frame: "#8b4a3f",
  },
  {
    name: "Amarillo manteca",
    background: "#ffd65b",
    accent: "#4a380f",
    frame: "#8a6d26",
  },
  {
    name: "Pistacho cool",
    background: "#a9df6b",
    accent: "#233b16",
    frame: "#5c7a34",
  },
  {
    name: "Cielo candy",
    background: "#8ec8ff",
    accent: "#1e3958",
    frame: "#4d7299",
  },
  {
    name: "Sandia alegre",
    background: "#ff728f",
    accent: "#4b1628",
    frame: "#8f4056",
  },
  {
    name: "Mandarina feliz",
    background: "#ff9c4c",
    accent: "#50280f",
    frame: "#8e5631",
  },
  {
    name: "Lila bubble",
    background: "#d8b6ff",
    accent: "#39254c",
    frame: "#765596",
  },
  {
    name: "Verde apple",
    background: "#8fe56b",
    accent: "#1f3814",
    frame: "#56853c",
  },
  {
    name: "Turquesa gelato",
    background: "#5fe3d4",
    accent: "#133c37",
    frame: "#44857c",
  },
  {
    name: "Guava pop",
    background: "#ff9aa2",
    accent: "#4b2328",
    frame: "#8f5961",
  },
  {
    name: "Sunshine",
    background: "#f8ea63",
    accent: "#4a4110",
    frame: "#8c7f2d",
  },
  {
    name: "Blue lagoon",
    background: "#66c6ff",
    accent: "#163a54",
    frame: "#4a7697",
  },
  {
    name: "Naranja y verde",
    background: "#ff9f2f",
    accent: "#1f5a22",
    frame: "#6e7b2f",
  },
  {
    name: "Verde y naranja",
    background: "#92df48",
    accent: "#8a3309",
    frame: "#7d6a2e",
  },
  {
    name: "Azul y rojo",
    background: "#7eb9ff",
    accent: "#7a1830",
    frame: "#7d5a73",
  },
  {
    name: "Rosa y rojo",
    background: "#ff98c9",
    accent: "#8b102f",
    frame: "#9a5669",
  },
  {
    name: "Rojo con rosa",
    background: "#ffb0d2",
    accent: "#a1112f",
    frame: "#9d5b6d",
  },
  {
    name: "Pomelo pop",
    background: "#ffb27f",
    accent: "#4c2813",
    frame: "#8b5938",
  },
  {
    name: "Mint candy",
    background: "#aaf0d1",
    accent: "#18392c",
    frame: "#4c7e69",
  },
  {
    name: "Helado de uva",
    background: "#caa8ff",
    accent: "#33214a",
    frame: "#6c5192",
  },
  {
    name: "Lima soda",
    background: "#c5ef62",
    accent: "#283515",
    frame: "#61762f",
  },
  {
    name: "Caramelo coral",
    background: "#ff8f86",
    accent: "#4a201c",
    frame: "#8a4f48",
  },
  {
    name: "Aqua pop",
    background: "#7fe7f2",
    accent: "#153944",
    frame: "#4d7f87",
  },
  {
    name: "Fresa pastel",
    background: "#ffacc8",
    accent: "#4a2237",
    frame: "#87566a",
  },
  {
    name: "Pera divertida",
    background: "#b7ea7a",
    accent: "#263815",
    frame: "#607d36",
  },
  {
    name: "Arandano soft",
    background: "#92b9ff",
    accent: "#203655",
    frame: "#56769a",
  },
];

const fontChoices = [
  {
    name: "Fraunces Bold Italic",
    family: '"Fraunces", serif',
  },
  {
    name: "Playfair Display Bold Italic",
    family: '"Playfair Display", serif',
  },
];

const phraseInput = document.querySelector("#phraseInput");
const signatureInput = document.querySelector("#signatureInput");
const generateButton = document.querySelector("#generateBtn");
const downloadButton = document.querySelector("#downloadBtn");
const shareButton = document.querySelector("#shareBtn");
const installButton = document.querySelector("#installBtn");
const fontValue = document.querySelector("#fontValue");
const toneValue = document.querySelector("#toneValue");
const signatureValue = document.querySelector("#signatureValue");
const statusMessage = document.querySelector("#statusMessage");
const storyStage = document.querySelector("#storyStage");
const canvas = document.querySelector("#storyCanvas");
const context = canvas.getContext("2d", { alpha: false });

let currentStyle = null;
let deferredInstallPrompt = null;

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const short = value.length === 3;
  const r = parseInt(short ? value[0] + value[0] : value.slice(0, 2), 16);
  const g = parseInt(short ? value[1] + value[1] : value.slice(2, 4), 16);
  const b = parseInt(short ? value[2] + value[2] : value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function makeStyle() {
  return {
    palette: pickRandom(palettes),
    font: pickRandom(fontChoices),
    frameInset: 76 + Math.random() * 24,
  };
}

function normalizePhrase(value) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
}

function normalizeInlineText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getCurrentPhrase() {
  return normalizePhrase(phraseInput.value) || DEFAULT_PHRASE;
}

function getCurrentSignature() {
  return normalizeInlineText(signatureInput.value) || DEFAULT_SIGNATURE;
}

function splitLongWord(word, fontSize, fontFamily, maxWidth) {
  context.font = `italic 700 ${fontSize}px ${fontFamily}`;
  const parts = [];
  let current = "";

  for (const character of word) {
    const next = `${current}${character}`;

    if (!current || context.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      parts.push(current);
      current = character;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function wrapText(text, fontSize, fontFamily, maxWidth) {
  context.font = `italic 700 ${fontSize}px ${fontFamily}`;
  const lines = [];

  for (const rawLine of text.split("\n")) {
    if (!rawLine) {
      lines.push("");
      continue;
    }

    const words = rawLine.split(" ");
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (context.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      if (context.measureText(word).width <= maxWidth) {
        currentLine = word;
      } else {
        const pieces = splitLongWord(word, fontSize, fontFamily, maxWidth);
        lines.push(...pieces.slice(0, -1));
        currentLine = pieces[pieces.length - 1] || "";
      }
    }

    if (currentLine || rawLine === "") {
      lines.push(currentLine);
    }
  }

  return lines;
}

function fitPhraseBlock(text, style) {
  const maxWidth = STORY_WIDTH * 0.74;
  const maxHeight = STORY_HEIGHT * 0.72;
  let fontSize = 248;
  let lines = [];
  let lineHeight = 0;

  while (fontSize >= 84) {
    lines = wrapText(text, fontSize, style.font.family, maxWidth);
    lineHeight = fontSize * (lines.length > 3 ? 1.02 : 0.98);
    const totalHeight = lines.length * lineHeight;

    if (totalHeight <= maxHeight && lines.length <= 7) {
      return { fontSize, lineHeight, lines, maxWidth };
    }

    fontSize -= 6;
  }

  return { fontSize, lineHeight, lines, maxWidth };
}

function drawBackdrop(style) {
  const { palette } = style;
  context.fillStyle = palette.background;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const inset = style.frameInset;
  roundedRectPath(context, inset, inset, STORY_WIDTH - inset * 2, STORY_HEIGHT - inset * 2, 58);
  context.strokeStyle = hexToRgba(palette.frame, 0.42);
  context.lineWidth = 2;
  context.stroke();

  context.strokeStyle = hexToRgba(palette.frame, 0.3);
  context.lineWidth = 3;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(176, 176);
  context.lineTo(STORY_WIDTH - 176, 176);
  context.stroke();
}

function drawPhraseBlock(phrase, style) {
  const fitted = fitPhraseBlock(phrase, style);
  const centerX = STORY_WIDTH / 2;
  const centerY = STORY_HEIGHT * 0.45;
  const blockHeight = fitted.lines.length * fitted.lineHeight;
  let y = centerY - blockHeight / 2 + fitted.fontSize * 0.82;

  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillStyle = style.palette.accent;
  context.shadowColor = "rgba(0, 0, 0, 0.28)";
  context.shadowBlur = 24;

  for (const line of fitted.lines) {
    context.font = `italic 700 ${fitted.fontSize}px ${style.font.family}`;
    context.fillText(line, centerX, y, fitted.maxWidth + 40);
    y += fitted.lineHeight;
  }

  context.shadowBlur = 0;
}

function drawSignature(style, signature) {
  context.textAlign = "center";
  context.fillStyle = style.palette.accent;
  context.font = `italic 700 62px ${style.font.family}`;
  context.fillText(signature, STORY_WIDTH / 2, STORY_HEIGHT - 168);
}

function applyPreviewStyle(style) {
  storyStage.style.setProperty("--story-accent", style.palette.accent);
  storyStage.style.setProperty("--story-font-family", style.font.family);
  fontValue.textContent = style.font.name;
  toneValue.textContent = style.palette.name;
  signatureValue.textContent = getCurrentSignature();
}

function renderCurrentStory(phrase, options = {}) {
  const { includeSignature = false } = options;

  if (!currentStyle) {
    currentStyle = makeStyle();
  }

  const safePhrase = normalizePhrase(phrase) || DEFAULT_PHRASE;
  const safeSignature = getCurrentSignature();
  context.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  drawBackdrop(currentStyle);
  drawPhraseBlock(safePhrase, currentStyle);

  if (includeSignature) {
    drawSignature(currentStyle, safeSignature);
  }

  applyPreviewStyle(currentStyle);
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createFileName() {
  const phrase = getCurrentPhrase().replace(/\s+/g, " ");
  const slug = slugify(phrase) || "historia";
  return `luchi-story-${slug}.png`;
}

function getCanvasBlob() {
  return new Promise((resolve, reject) => {
    signatureInput.classList.add("signature-input--hidden");
    renderCurrentStory(phraseInput.value, { includeSignature: true });

    canvas.toBlob((blob) => {
      signatureInput.classList.remove("signature-input--hidden");
      renderCurrentStory(phraseInput.value);

      if (!blob) {
        reject(new Error("No se pudo crear la imagen."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

async function downloadStory() {
  const blob = await getCanvasBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createFileName();
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 250);
}

async function shareStory() {
  const blob = await getCanvasBlob();
  const file = new File([blob], createFileName(), { type: "image/png" });

  if (!navigator.share) {
    return false;
  }

  try {
    if (!navigator.canShare || navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Historia de frase",
        text: "Lista para publicar.",
        files: [file],
      });
      return true;
    }
  } catch (error) {
    if (error && error.name === "TypeError") {
      return false;
    }

    throw error;
  }

  return false;
}

function refreshStory(withNewStyle = false) {
  if (withNewStyle || !currentStyle) {
    currentStyle = makeStyle();
  }

  renderCurrentStory(phraseInput.value);
}

async function handleDownload() {
  downloadButton.disabled = true;
  setStatus("Preparando tu PNG...");

  try {
    await downloadStory();
    setStatus("Historia descargada. Ya la podes subir donde quieras.");
  } catch (error) {
    console.error(error);
    setStatus("No pude descargar la imagen en este intento.");
  } finally {
    downloadButton.disabled = false;
  }
}

async function handleShare() {
  shareButton.disabled = true;
  setStatus("Preparando la imagen para compartir...");

  try {
    const shared = await shareStory();

    if (shared) {
      setStatus("Lista para compartir.");
    } else {
      await downloadStory();
      setStatus("Tu navegador no comparte archivos aqui, asi que la descargue por vos.");
    }
  } catch (error) {
    if (error && error.name === "AbortError") {
      setStatus("Se cancelo el compartir. La historia sigue lista.");
    } else {
      console.error(error);
      setStatus("No pude compartir ahora mismo.");
    }
  } finally {
    shareButton.disabled = false;
  }
}

async function handleInstall() {
  if (!deferredInstallPrompt) {
    setStatus("Si no aparece el prompt, usa el menu del navegador para instalar o crear el acceso directo.");
    return;
  }

  deferredInstallPrompt.prompt();
  const result = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;

  if (result.outcome === "accepted") {
    setStatus("La app ya quedo instalada en tu equipo.");
  } else {
    setStatus("La instalacion quedo cancelada, pero podes volver a intentarlo.");
  }
}

async function preloadFonts() {
  if (!("fonts" in document)) {
    return;
  }

  await Promise.allSettled([
    document.fonts.load('italic 700 120px "Fraunces"'),
    document.fonts.load('italic 700 120px "Playfair Display"'),
    document.fonts.load('500 16px "Space Grotesk"'),
  ]);
}

function registerInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
    setStatus("La app se puede instalar como acceso directo.");
  });

  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
    deferredInstallPrompt = null;
    setStatus("Instalada. Ya la tenes como app en tu escritorio.");
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        registration.update().catch(() => {});
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function attachEvents() {
  generateButton.addEventListener("click", () => {
    refreshStory(true);
    setStatus("Nueva combinacion lista para descargar o compartir.");
  });

  downloadButton.addEventListener("click", handleDownload);
  shareButton.addEventListener("click", handleShare);
  installButton.addEventListener("click", handleInstall);

  phraseInput.addEventListener("input", () => {
    renderCurrentStory(phraseInput.value);
  });

  phraseInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      refreshStory(true);
      setStatus("Nueva combinacion lista para descargar o compartir.");
    }
  });

  signatureInput.addEventListener("input", () => {
    signatureValue.textContent = getCurrentSignature();
  });

  signatureInput.addEventListener("blur", () => {
    signatureInput.value = getCurrentSignature();
    signatureValue.textContent = signatureInput.value;
  });
}

async function boot() {
  registerInstallPrompt();
  registerServiceWorker();
  attachEvents();
  await preloadFonts();
  signatureInput.value = DEFAULT_SIGNATURE;
  refreshStory(true);
  setStatus("Tu historia ya esta lista. Toca Nueva combinacion si queres otra mezcla.");
}

boot();
