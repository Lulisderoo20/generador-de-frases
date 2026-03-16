const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const DEFAULT_PHRASE = "Lo que vibra con vos siempre encuentra una forma de volver.";
const DEFAULT_SIGNATURE = "@luchilisdero";

const palettes = [
  {
    name: "Cafe solar",
    background: ["#110d10", "#1a1316", "#09070a"],
    glowA: "#5c3224",
    glowB: "#3f2534",
    accent: "#f4d0a2",
    frame: "#a36b4d",
  },
  {
    name: "Oliva editorial",
    background: ["#0b100d", "#121912", "#060907"],
    glowA: "#314734",
    glowB: "#253126",
    accent: "#c6e2ae",
    frame: "#647e59",
  },
  {
    name: "Mar profundo",
    background: ["#091018", "#101827", "#060a11"],
    glowA: "#243f61",
    glowB: "#1f2d48",
    accent: "#b8def9",
    frame: "#58728e",
  },
  {
    name: "Vino y durazno",
    background: ["#140b10", "#211018", "#0a0508"],
    glowA: "#592434",
    glowB: "#462134",
    accent: "#ffc9ab",
    frame: "#9d5b67",
  },
  {
    name: "Carbon coral",
    background: ["#0c0d11", "#15171c", "#060709"],
    glowA: "#57332c",
    glowB: "#2c3340",
    accent: "#ffb59b",
    frame: "#8c5d55",
  },
  {
    name: "Ciruela de noche",
    background: ["#0e0911", "#17101d", "#070509"],
    glowA: "#4e315d",
    glowB: "#2a2b46",
    accent: "#d9c0ff",
    frame: "#775b95",
  },
  {
    name: "Naranja y rosa",
    background: ["#120b0f", "#1a1016", "#09060a"],
    glowA: "#8b3f28",
    glowB: "#7a2f58",
    accent: "#ffb089",
    frame: "#a15a63",
  },
  {
    name: "Rosa sunset",
    background: ["#100a11", "#1b1018", "#07050a"],
    glowA: "#6b2f48",
    glowB: "#93492c",
    accent: "#ff9dc6",
    frame: "#9a6177",
  },
  {
    name: "Verde y rosa",
    background: ["#09110d", "#101710", "#060907"],
    glowA: "#2f5a3e",
    glowB: "#73375f",
    accent: "#f3a6cf",
    frame: "#69806a",
  },
  {
    name: "Lima fosforescente",
    background: ["#0d1008", "#161b0d", "#070904"],
    glowA: "#566b1b",
    glowB: "#243414",
    accent: "#d9ff5f",
    frame: "#7c8e3f",
  },
  {
    name: "Melon pop",
    background: ["#120b0d", "#1a1012", "#090608"],
    glowA: "#984932",
    glowB: "#77304f",
    accent: "#ff9f87",
    frame: "#9d625d",
  },
  {
    name: "Citrico editorial",
    background: ["#101009", "#17160d", "#080804"],
    glowA: "#6c651d",
    glowB: "#38401e",
    accent: "#f1ef95",
    frame: "#8c8650",
  },
  {
    name: "Matcha bubblegum",
    background: ["#0a100d", "#101813", "#050806"],
    glowA: "#365340",
    glowB: "#7f3558",
    accent: "#ff9fca",
    frame: "#66806a",
  },
  {
    name: "Mandarina digital",
    background: ["#130b08", "#1c100e", "#080504"],
    glowA: "#93432a",
    glowB: "#8c3551",
    accent: "#ffb45f",
    frame: "#a16858",
  },
  {
    name: "Azul y lima",
    background: ["#091018", "#101723", "#060910"],
    glowA: "#1c4f6a",
    glowB: "#465f19",
    accent: "#d7ff7a",
    frame: "#688260",
  },
  {
    name: "Coral de club",
    background: ["#110a0d", "#1a1013", "#070508"],
    glowA: "#893b33",
    glowB: "#693768",
    accent: "#ff968d",
    frame: "#9a6263",
  },
  {
    name: "Cherry chrome",
    background: ["#10090c", "#181015", "#060508"],
    glowA: "#77293a",
    glowB: "#36406e",
    accent: "#ff9ab1",
    frame: "#8c5e77",
  },
  {
    name: "Arena acida",
    background: ["#111009", "#17150d", "#080703"],
    glowA: "#6b5a1d",
    glowB: "#414325",
    accent: "#f6df72",
    frame: "#9a8656",
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
let grainPattern = null;

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

function createGrainPattern() {
  const noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = 180;
  noiseCanvas.height = 180;
  const noiseContext = noiseCanvas.getContext("2d");

  noiseContext.fillStyle = "rgba(255, 255, 255, 0.035)";

  for (let index = 0; index < 1400; index += 1) {
    const x = Math.random() * noiseCanvas.width;
    const y = Math.random() * noiseCanvas.height;
    const size = Math.random() > 0.85 ? 2 : 1;
    noiseContext.fillRect(x, y, size, size);
  }

  noiseContext.fillStyle = "rgba(0, 0, 0, 0.028)";

  for (let index = 0; index < 900; index += 1) {
    const x = Math.random() * noiseCanvas.width;
    const y = Math.random() * noiseCanvas.height;
    noiseContext.fillRect(x, y, 1, 1);
  }

  return context.createPattern(noiseCanvas, "repeat");
}

function makeStyle() {
  return {
    palette: pickRandom(palettes),
    font: pickRandom(fontChoices),
    noiseOpacity: 0.18 + Math.random() * 0.05,
    blobShiftX: 180 + Math.random() * 120,
    blobShiftY: 180 + Math.random() * 120,
    quoteScale: 0.92 + Math.random() * 0.16,
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
  const baseGradient = context.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
  baseGradient.addColorStop(0, palette.background[0]);
  baseGradient.addColorStop(0.52, palette.background[1]);
  baseGradient.addColorStop(1, palette.background[2]);
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const glowOne = context.createRadialGradient(
    style.blobShiftX,
    style.blobShiftY,
    10,
    style.blobShiftX,
    style.blobShiftY,
    440,
  );
  glowOne.addColorStop(0, hexToRgba(palette.glowA, 0.34));
  glowOne.addColorStop(1, hexToRgba(palette.glowA, 0));
  context.fillStyle = glowOne;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const glowTwoX = STORY_WIDTH - style.blobShiftX + 80;
  const glowTwoY = STORY_HEIGHT - style.blobShiftY + 80;
  const glowTwo = context.createRadialGradient(glowTwoX, glowTwoY, 20, glowTwoX, glowTwoY, 520);
  glowTwo.addColorStop(0, hexToRgba(palette.glowB, 0.25));
  glowTwo.addColorStop(1, hexToRgba(palette.glowB, 0));
  context.fillStyle = glowTwo;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const veil = context.createLinearGradient(0, 0, 0, STORY_HEIGHT);
  veil.addColorStop(0, "rgba(255, 255, 255, 0.04)");
  veil.addColorStop(0.3, "rgba(255, 255, 255, 0.01)");
  veil.addColorStop(1, "rgba(0, 0, 0, 0.16)");
  context.fillStyle = veil;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const inset = style.frameInset;
  roundedRectPath(context, inset, inset, STORY_WIDTH - inset * 2, STORY_HEIGHT - inset * 2, 58);
  context.strokeStyle = hexToRgba(palette.frame, 0.34);
  context.lineWidth = 2;
  context.stroke();

  context.strokeStyle = hexToRgba(palette.accent, 0.18);
  context.lineWidth = 4;
  context.lineCap = "round";

  context.beginPath();
  context.moveTo(148, 178);
  context.lineTo(STORY_WIDTH - 148, 178);
  context.stroke();

  context.beginPath();
  context.moveTo(STORY_WIDTH / 2 - 160, STORY_HEIGHT - 256);
  context.lineTo(STORY_WIDTH / 2 + 160, STORY_HEIGHT - 256);
  context.stroke();

  context.save();
  context.translate(210, 360);
  context.rotate(-0.12);
  context.scale(style.quoteScale, style.quoteScale);
  context.font = `italic 700 820px ${style.font.family}`;
  context.fillStyle = hexToRgba(palette.accent, 0.05);
  context.fillText('"', 0, 0);
  context.restore();

  if (grainPattern) {
    context.save();
    context.globalAlpha = style.noiseOpacity;
    context.fillStyle = grainPattern;
    context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
    context.restore();
  }
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
  grainPattern = createGrainPattern();
  registerInstallPrompt();
  registerServiceWorker();
  attachEvents();
  await preloadFonts();
  signatureInput.value = DEFAULT_SIGNATURE;
  refreshStory(true);
  setStatus("Tu historia ya esta lista. Toca Nueva combinacion si queres otra mezcla.");
}

boot();
