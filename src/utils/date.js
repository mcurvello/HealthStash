function formatarDataParaBR(data) {
  const dataFormatada = new Date(data);
  const opcoes = { year: "numeric", month: "2-digit", day: "2-digit" };
  return dataFormatada.toLocaleDateString("pt-BR", opcoes);
}

function converterDataParaFormatoISO(data) {
  const partes = data.split("/");
  if (partes.length === 3) {
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    const dataFormatada = `${ano}-${mes}-${dia}`;

    return dataFormatada;
  } else {
    return "Data inválida";
  }
}

export { formatarDataParaBR, converterDataParaFormatoISO };
