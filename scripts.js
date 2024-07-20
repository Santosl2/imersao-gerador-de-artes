const canvas = document.getElementById("canvas");
const img = document.getElementById("img");

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

  const promises = Promise.all([telao, story]);
  const [telaoBlob, storyBlob] = await promises;

  const zip = zipData();
  const baseTelaoImage = new Image();
  baseTelaoImage.src = URL.createObjectURL(telaoBlob);
  baseTelaoImage.onload = function () {
    canvas.width = baseTelaoImage.width;
    canvas.height = baseTelaoImage.height;
    drawData.call(this, { type: "telao", img: baseTelaoImage });

    zip.addFileToZip("telao.png", canvas.toDataURL());
    createDownloadButton(canvas, "telao");
  };

  const baseStoryImage = new Image();
  baseStoryImage.src = URL.createObjectURL(storyBlob);
  baseStoryImage.onload = function () {
    canvas.width = baseStoryImage.width;
    canvas.height = baseStoryImage.height;
    drawData.call(this, { type: "story", img: baseStoryImage });
    zip.addFileToZip("story.png", canvas.toDataURL());
    createDownloadButton(canvas, "story");
  };

  // await zip.generateZip();
}

function createDownloadButton(canvas, name) {
  const downloadButton = document.createElement("a");
  downloadButton.href = canvas.toDataURL();
  downloadButton.download = `${name}-${new Date().getTime()}.png`;
  document.body.appendChild(downloadButton);
  downloadButton.click();
}

function drawData({ type = "telao", img }) {
  const { rua: ruaCoords, bairro: bairroCoords } = coords[type];

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ctx.font = "41.66px MonumentRegular";
  ctx.fillStyle = "white";

  const enderecoInput = document.querySelector("[name=endereco]");
  const bairroInput = document.querySelector("[name=bairro]");
  const numeroInput = document.querySelector("[name=numero]");
  const endereco = enderecoInput.value;
  const bairro = bairroInput.value;

  const enderecoFormatado = `${endereco}, ${numeroInput.value}`;

  if (type === "story") {
    function measureTextSize(txt) {
      const textWidth = ctx.measureText(txt).width;
      return textWidth / 2;
    }

    const textWidth = measureTextSize(enderecoFormatado);
    const textWidth2 = measureTextSize(bairro);

    const x = this.width / 2;
    ctx.fillText(enderecoFormatado, x - textWidth, this.height - 293);
    ctx.fillText(bairro, x - textWidth2, this.height - 253);
  } else {
    ctx.fillText(enderecoFormatado, ruaCoords.x, ruaCoords.y);
    ctx.fillText(bairro, bairroCoords.x, bairroCoords.y);
  }
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
