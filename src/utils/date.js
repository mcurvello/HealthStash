function formatarDataParaBR(data) {
  const dataFormatada = new Date(data);
  const opcoes = { year: "numeric", month: "2-digit", day: "2-digit" };
  return dataFormatada.toLocaleDateString("pt-BR", opcoes);
}

function formatarDataHoraParaBR(data) {
  const dataFormatada = new Date(data);
  const dia = String(dataFormatada.getDate()).padStart(2, "0");
  const mes = String(dataFormatada.getMonth() + 1).padStart(2, "0");
  const ano = dataFormatada.getFullYear();
  const hora = String(dataFormatada.getHours()).padStart(2, "0");
  const minutos = String(dataFormatada.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
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

function converterDataHoraParaISO(date, time) {
  const [dia, mes, ano] = date.split("/");
  const [hora, minutos] = time.split(":");

  const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minutos}:00.000-03:00`;

  return dataFormatada;
}

export {
  formatarDataParaBR,
  formatarDataHoraParaBR,
  converterDataParaFormatoISO,
  converterDataHoraParaISO,
};
