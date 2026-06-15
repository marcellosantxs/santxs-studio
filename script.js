const fraseElemento = document.getElementById("frase");
const categoriaSelect = document.getElementById("categoria");
const listaHistorico = document.getElementById("listaHistorico");

let fraseAtual = "";

function gerarFrase() {

    let categoria = categoriaSelect.value;

    let frasesFiltradas = frases;

    if (categoria !== "todas") {
        frasesFiltradas = frases.filter(
            frase => frase.categoria === categoria
        );
    }

    const indice = Math.floor(
        Math.random() * frasesFiltradas.length
    );

    fraseAtual = frasesFiltradas[indice].texto;

    fraseElemento.textContent = fraseAtual;

    adicionarHistorico(fraseAtual);
}

function adicionarHistorico(frase) {

    const item = document.createElement("li");

    item.textContent = frase;

    listaHistorico.prepend(item);

    if (listaHistorico.children.length > 10) {
        listaHistorico.removeChild(
            listaHistorico.lastChild
        );
    }
}

document
.getElementById("novaFrase")
.addEventListener("click", gerarFrase);

categoriaSelect.addEventListener(
    "change",
    gerarFrase
);

document
.getElementById("copiar")
.addEventListener("click", () => {

    if (!fraseAtual) return;

    navigator.clipboard.writeText(fraseAtual);

    alert("Frase copiada!");
});

document
.getElementById("favoritar")
.addEventListener("click", () => {

    if (!fraseAtual) return;

    let favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    favoritos.push(fraseAtual);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    alert("Frase favoritada!");
});

document
.getElementById("gerarImagem")
.addEventListener("click", () => {

    if (!fraseAtual) {
        alert("Gere uma frase primeiro.");
        return;
    }

    const canvas =
        document.getElementById("canvasImagem");

    const ctx =
        canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 1920;

    const gradiente =
        ctx.createLinearGradient(
            0,
            0,
            1080,
            1920
        );

    gradiente.addColorStop(0, "#000000");
    gradiente.addColorStop(1, "#222222");

    ctx.fillStyle = gradiente;
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Arial";

    quebrarTexto(
        ctx,
        fraseAtual,
        canvas.width / 2,
        canvas.height / 2,
        800,
        80
    );

    ctx.font = "40px Arial";

    ctx.fillText(
        "© Santxs",
        canvas.width / 2,
        1800
    );

    const link =
        document.createElement("a");

    link.download = "santxs-frase.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
});

function quebrarTexto(
    ctx,
    texto,
    x,
    y,
    larguraMax,
    alturaLinha
) {

    const palavras = texto.split(" ");

    let linha = "";

    let linhas = [];

    for (let i = 0; i < palavras.length; i++) {

        const testeLinha =
            linha + palavras[i] + " ";

        const largura =
            ctx.measureText(
                testeLinha
            ).width;

        if (
            largura > larguraMax &&
            i > 0
        ) {

            linhas.push(linha);

            linha =
                palavras[i] + " ";

        } else {

            linha = testeLinha;
        }
    }

    linhas.push(linha);

    let inicioY =
        y -
        (linhas.length * alturaLinha) / 2;

    linhas.forEach((linha, index) => {

        ctx.fillText(
            linha,
            x,
            inicioY +
            index * alturaLinha
        );
    });
}