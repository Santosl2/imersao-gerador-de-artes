const canvas = document.getElementById("canvas");
const generateButton = document.getElementById("generate");
const form = document.querySelector("form");

async function getImageBlob(image) {
  const data = await fetch(`./images/${image}`, {
    method: "GET",
  });

  return await data.blob();
}

async function getDepartmentConfig(department) {
  const data = await fetch(`./images/${department}/config.json`, {
    method: "GET",
  });

  return await data.json();
}

async function loadFonts() {
  const fonts = [
    {
      name: "MonumentRegular",
      url: "./fonts/MonumentExtended-Regular.otf",
    },
    { name: "MontserratRegular", url: "./fonts/Montserrat-Regular.otf" },
    { name: "MontserratSemiBold", url: "./fonts/Montserrat-SemiBold.otf" },
  ];

  fonts.forEach(async ({ name, url }) => {
    console.log("Carregando fonte: ", name);
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
  });
}

// Fallback
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

  const department = document.querySelector("[name=department]").value;
  const type = document.querySelector("[name=style]").value;
  const config = await getDepartmentConfig(department);

  generateButton.textContent = "Gerando artes...";
  generateButton.disabled = true;

  const imageBlob = await getImageBlob(`${department}/${type}.png`);

  const zip = zipData();

  const img = new Image();
  img.src = URL.createObjectURL(imageBlob);
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    drawData.call(this, { type, img, config });

    //   // zip.addFileToZip("telao.png", canvas.toDataURL());
    setupCanvasDownload(canvas, type);
  };

  generateButton.textContent = "Gerar artes";
  generateButton.disabled = false;
  // await zip.generateZip();
}

function setupCanvasDownload(canvas, name) {
  const downloadButtonArea = document.getElementById("button-area");
  downloadButtonArea.removeAttribute("class");
  const downloadButton = document.getElementById("download");
  downloadButton.addEventListener("click", function (e) {
    downloadButton.href = canvas.toDataURL();
    downloadButton.download = `${name}-${new Date().getTime()}.png`;
  });
}

function drawData({ type = "telao", img, config }) {
  const { rua: ruaCoords } = config[type] || coords[type];
  const {
    fontSize = 41.66,
    fontFamily = "MonumentRegular",
    fontColor = "#fff",
  } = config;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;

  const addressInput = document.querySelector("[name=address]");
  const neighborhoodInput = document.querySelector("[name=neighborhood]");
  const numberInput = document.querySelector("[name=addressNumber]");
  const address = addressInput.value.replace(/rua/gi, "").trim();
  const neighborhood = neighborhoodInput.value;

  const formattedAddress = `R. ${address}, ${numberInput.value}, ${neighborhood}`;

  let posX = ruaCoords.x;
  let posY = ruaCoords.y;

  if (type === "story") {
    function measureTextSize(txt) {
      const textWidth = ctx.measureText(txt).width;
      return textWidth / 2;
    }

    const x = this.width / 2;
    posX = x - measureTextSize(formattedAddress);
    posY = ruaCoords.y || this.height - 293;
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const medidas = ctx.measureText(formattedAddress);
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

    console.log(posX, posY);
    ctx.fillText(formattedAddress, posX, posY);
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

  ctx.fillText(formattedAddress, posX, posY);
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
