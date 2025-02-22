const canvas = document.getElementById("canvas");
const canvasTelao = document.getElementById("telao");
const canvasStory = document.getElementById("story");
const img = document.getElementById("img");
const generateButton = document.getElementById("generate");
const form = document.querySelector("form");

async function getImageBlob(image) {
  const data = await fetch(`./images/${image}`, {
    method: "GET",
  });

  return await data.blob();
}

async function loadFonts() {
  const font = new FontFace(
    "MonumentRegular",
    "url(./fonts/MonumentExtended-Regular.otf)"
  );
  await font.load();
  document.fonts.add(font);
}

const coords = {
  telao: {
    rua: {
      x: 161.1,
      y: 965,
    },
    bairro: {
      x: 161.1,
      y: 1007,
    },
  },
  story: {
    rua: {
      x: 161.1,
      y: 965,
    },
    bairro: {
      x: 161.1,
      y: 1007,
    },
  },
};

async function loadImages() {
  await loadFonts();
  const telao = getImageBlob("telao.png");
  const story = getImageBlob("story.png");

  generateButton.textContent = "Gerando artes...";
  generateButton.disabled = true;
  const promises = Promise.all([telao, story]);
  const [telaoBlob, storyBlob] = await promises;

  const zip = zipData();

  // Telão
  const baseTelaoImage = new Image();
  baseTelaoImage.src = URL.createObjectURL(telaoBlob);
  baseTelaoImage.onload = function () {
    canvasTelao.width = baseTelaoImage.width;
    canvasTelao.height = baseTelaoImage.height;
    drawData.call(this, { type: "telao", img: baseTelaoImage });

    //   // zip.addFileToZip("telao.png", canvas.toDataURL());
    //   // createDownloadButton(canvas, "telao");
  };

  const baseStoryImage = new Image();
  baseStoryImage.src = URL.createObjectURL(storyBlob);
  baseStoryImage.onload = function () {
    canvasStory.width = baseStoryImage.width;
    canvasStory.height = baseStoryImage.height;
    drawData.call(this, { type: "story", img: baseStoryImage });
    // zip.addFileToZip("story.png", canvas.toDataURL());
    // createDownloadButton(canvas, "story");
  };

  generateButton.textContent = "Gerar artes";
  generateButton.disabled = false;
  // await zip.generateZip();
}

function createDownloadButton(canvas, name) {
  const downloadButton = document.createElement("a");
  downloadButton.innerText = `Baixar arte ${name}`;
  downloadButton.href = canvas.toDataURL();
  downloadButton.download = `${name}-${new Date().getTime()}.png`;
  form.appendChild(downloadButton);
}

function drawData({ type = "telao", img }) {
  const { rua: ruaCoords } = coords[type];
  const canvas = type === "telao" ? canvasTelao : canvasStory;

  const fontSize = 41.66;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);
  ctx.font = `${fontSize}px MonumentRegular`;
  ctx.fillStyle = "white";

  const enderecoInput = document.querySelector("[name=address]");
  const bairroInput = document.querySelector("[name=neighborhood]");
  const numeroInput = document.querySelector("[name=addressNumber]");
  const endereco = enderecoInput.value.replace(/rua/gi, "").trim();
  const bairro = bairroInput.value;

  const enderecoFormatado = `R. ${endereco}, ${numeroInput.value}, ${bairro}`;
  let posX = ruaCoords.x;
  let posY = ruaCoords.y;

  if (type === "story") {
    function measureTextSize(txt) {
      const textWidth = ctx.measureText(txt).width;
      return textWidth / 2;
    }
    const x = this.width / 2;
    posX = x - measureTextSize(enderecoFormatado);
    posY = this.height - 293;
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const medidas = ctx.measureText(enderecoFormatado);
  function isMouseSobreTexto(mouseX, mouseY) {
    return (
      mouseX >= posX &&
      mouseX <= posX + medidas.width &&
      mouseY >= posY - fontSize && // aproximação da altura da fonte
      mouseY <= posY
    );
  }

  function reset() {
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const padding = 5; // Espaço entre o texto e a borda

    if (isDragging) {
      ctx.beginPath();
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.rect(
        posX - padding,
        posY - fontSize + padding,
        medidas.width + padding * 2,
        fontSize + padding
      );
      ctx.stroke();
    }

    ctx.fillText(enderecoFormatado, posX, posY);
  }

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (isMouseSobreTexto(mouseX, mouseY)) {
      isDragging = true;
      offsetX = mouseX - posX;
      offsetY = mouseY - posY;
      reset();
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      posX = mouseX - offsetX;
      posY = mouseY - offsetY;
      reset();
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    reset();
  });

  ctx.fillText(enderecoFormatado, posX, posY);
  // ctx.fillText(bairro, bairroCoords.x, bairroCoords.y);
}

function zipData() {
  const zip = new JSZip();

  function addFileToZip(name, data) {
    zip.file(name, data, { base64: true });
  }

  async function generateZip() {
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Imersão.zip");
  }

  return { addFileToZip, generateZip };
}
