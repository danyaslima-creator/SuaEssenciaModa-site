/* =====================================================================
   ROLETA DE DESCONTOS — Sua Essência Moda
   =====================================================================
   Configure só o bloco abaixo. O resto do arquivo não precisa ser tocado.
   ===================================================================== */

// Chances de cada desconto (são pesos relativos, não precisam somar 100).
// Ex.: com os valores abaixo, 5% sai 50% das vezes, 10% sai 35% das vezes
// e 15% sai só 15% das vezes — assim o desconto maior é mais raro.
var ROLETA_PREMIOS = [
  { percent: 5,  peso: 50 },
  { percent: 10, peso: 35 },
  { percent: 15, peso: 15 }
];

// Cole aqui a URL do seu Web App do Google Apps Script (veja LEIA-ME.md
// para o passo a passo). Enquanto estiver vazio, a roleta funciona
// normalmente, só não salva os cadastros em planilha nenhuma.
var ROLETA_PLANILHA_URL = "";

// Número de WhatsApp da loja (só dígitos: código do país + DDD + número).
var ROLETA_WHATSAPP_NUMBER = "5548998183017";

// Tempo (em milissegundos) até a roleta abrir sozinha na primeira visita.
var ROLETA_AUTO_OPEN_MS = 6000;

// Validade do cupom, em dias, a partir do momento em que foi ganho.
var ROLETA_VALIDADE_DIAS = 7;

/* ===================== fim da configuração ===================== */

(function () {
  "use strict";

  var STORAGE_KEY = "essenciaRoletaV1";
  var AUTO_SHOWN_KEY = "essenciaRoletaAutoShownV1";

  /* ---------- utilidades ---------- */
  function getSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch (e) { return null; }
  }
  function saveResult(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }
  function sortearPremio() {
    var total = ROLETA_PREMIOS.reduce(function (s, p) { return s + p.peso; }, 0);
    var r = Math.random() * total, acc = 0;
    for (var i = 0; i < ROLETA_PREMIOS.length; i++) {
      acc += ROLETA_PREMIOS[i].peso;
      if (r <= acc) return ROLETA_PREMIOS[i];
    }
    return ROLETA_PREMIOS[ROLETA_PREMIOS.length - 1];
  }
  function gerarCupom(percent) {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var code = "";
    for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return "ESSENCIA" + percent + "-" + code;
  }
  function validarNome(v) { return /\S+\s+\S+/.test((v || "").trim()); }
  function validarTelefone(v) { var d = (v || "").replace(/\D/g, ""); return d.length === 10 || d.length === 11; }
  function validarEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()); }
  function fmtDataBR(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-BR");
  }
  function waLink(message) {
    return "https://wa.me/" + ROLETA_WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }
  function enviarParaPlanilha(data) {
    if (!ROLETA_PLANILHA_URL) return;
    try {
      fetch(ROLETA_PLANILHA_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });
    } catch (e) {}
  }

  /* ---------- CSS ---------- */
  var css = "" +
    ".roleta-overlay{position:fixed;inset:0;background:rgba(59,42,46,.55);backdrop-filter:blur(2px);z-index:400;display:none;align-items:center;justify-content:center;padding:1.2rem;font-family:'Jost',system-ui,-apple-system,sans-serif;}" +
    ".roleta-overlay.aberta{display:flex;}" +
    ".roleta-card{background:#FBF6F5;border-radius:20px;padding:2rem 1.6rem 1.8rem;max-width:400px;width:100%;box-shadow:0 30px 70px rgba(30,10,16,.35);position:relative;text-align:center;max-height:92vh;overflow:auto;}" +
    ".roleta-fechar{position:absolute;top:.7rem;right:.7rem;width:32px;height:32px;border-radius:50%;background:#fff;border:0;color:#590C2A;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12);}" +
    ".roleta-titulo{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.9rem;color:#3B2A2E;margin:.2rem 0 .3rem;}" +
    ".roleta-titulo em{font-style:italic;font-weight:400;color:#590C2A;}" +
    ".roleta-sub{font-size:.85rem;color:#7D5260;margin:0 0 1.2rem;}" +
    ".roleta-wheel-wrap{position:relative;width:min(260px,70vw);margin:0 auto 1.4rem;}" +
    ".roleta-pointer{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:22px solid #5D251B;z-index:2;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25));}" +
    ".roleta-svg{width:100%;height:auto;display:block;transform-origin:50% 50%;transition:transform 3.6s cubic-bezier(.17,.86,.26,1);filter:drop-shadow(0 8px 18px rgba(89,12,42,.25));}" +
    ".roleta-svg text{font-family:'Jost',sans-serif;font-weight:500;}" +
    ".roleta-btn{background:#FBF6F5;color:#590C2A;border:1px solid #590C2A;border-radius:999px;padding:.78rem 1.8rem;font:500 .85rem 'Jost',sans-serif;letter-spacing:.03em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s;}" +
    ".roleta-btn:hover{background:#590C2A;color:#FBF6F5;}" +
    ".roleta-btn:disabled{opacity:.5;cursor:default;}" +
    ".roleta-btn-full{width:100%;}" +
    ".roleta-resultado{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:1.5rem;color:#590C2A;margin:.4rem 0 1rem;}" +
    ".roleta-form{display:none;text-align:left;}" +
    ".roleta-form.ativo{display:block;}" +
    ".roleta-wheel-step.escondido{display:none;}" +
    ".roleta-campo{margin-bottom:.7rem;}" +
    ".roleta-campo label{display:block;font-size:.68rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#7D5260;margin-bottom:.3rem;}" +
    ".roleta-campo input{width:100%;padding:.65rem .8rem;border:1px solid #A57F8A;border-radius:8px;font:400 .92rem 'Jost',sans-serif;color:#3B2A2E;background:#fff;box-sizing:border-box;}" +
    ".roleta-campo input:focus{outline:2px solid #590C2A;outline-offset:1px;}" +
    ".roleta-erro{font-size:.72rem;color:#9b2c2c;margin-top:.25rem;display:none;}" +
    ".roleta-erro.ativo{display:block;}" +
    ".roleta-lgpd{display:flex;gap:.5rem;align-items:flex-start;font-size:.72rem;color:#7D5260;margin:.9rem 0 1.1rem;line-height:1.35;}" +
    ".roleta-lgpd input{margin-top:.2rem;flex-shrink:0;}" +
    ".roleta-sucesso{display:none;}" +
    ".roleta-sucesso.ativo{display:block;}" +
    ".roleta-cupom-box{background:#590C2A;color:#FBF6F5;border-radius:12px;padding:1rem;margin:0 0 .5rem;}" +
    ".roleta-cupom-code{font-family:'Jost',sans-serif;font-weight:500;font-size:1.5rem;letter-spacing:.04em;}" +
    ".roleta-cupom-desc{font-size:.78rem;opacity:.9;margin-top:.3rem;}" +
    ".roleta-validade{font-size:.78rem;color:#7D5260;margin:.6rem 0 1.2rem;}" +
    ".roleta-wa-btn{display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;border-radius:999px;padding:.78rem 1.6rem;font:500 .85rem 'Jost',sans-serif;text-decoration:none;}" +
    ".roleta-flutuante{position:fixed;bottom:1.1rem;right:1.1rem;z-index:390;background:#590C2A;color:#FBF6F5;border:0;border-radius:999px;padding:.85rem 1.3rem;font:500 .78rem 'Jost',sans-serif;letter-spacing:.03em;text-transform:uppercase;cursor:pointer;box-shadow:0 10px 26px rgba(89,12,42,.4);display:flex;align-items:center;gap:.5rem;}" +
    ".roleta-flutuante.escondido{display:none;}" +
    "@media(max-width:480px){.roleta-card{padding:1.6rem 1.1rem 1.5rem;}.roleta-titulo{font-size:1.6rem;}}";
  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- roda da roleta (SVG com 6 gomos: 5/10/15 repetidos) ---------- */
  var WEDGES = [
    { d: "M150,150 L150,0 A150,150 0 0,1 279.9,75 Z", color: "#590C2A", percent: 5, lx: 197.5, ly: 67.7 },
    { d: "M150,150 L279.9,75 A150,150 0 0,1 279.9,225 Z", color: "#A57F8A", percent: 10, lx: 245, ly: 150 },
    { d: "M150,150 L279.9,225 A150,150 0 0,1 150,300 Z", color: "#61762E", percent: 15, lx: 197.5, ly: 232.3 },
    { d: "M150,150 L150,300 A150,150 0 0,1 20.1,225 Z", color: "#590C2A", percent: 5, lx: 102.5, ly: 232.3 },
    { d: "M150,150 L20.1,225 A150,150 0 0,1 20.1,75 Z", color: "#A57F8A", percent: 10, lx: 55, ly: 150 },
    { d: "M150,150 L20.1,75 A150,150 0 0,1 150,0 Z", color: "#61762E", percent: 15, lx: 102.5, ly: 67.7 }
  ];
  function wheelSVG() {
    var paths = WEDGES.map(function (w) {
      return '<path d="' + w.d + '" fill="' + w.color + '" stroke="#FBF6F5" stroke-width="3"></path>';
    }).join("");
    var labels = WEDGES.map(function (w) {
      return '<text x="' + w.lx + '" y="' + w.ly + '" fill="#FBF6F5" font-size="26" text-anchor="middle" dominant-baseline="middle">' + w.percent + '%</text>';
    }).join("");
    return '<svg class="roleta-svg" id="roleta-svg" viewBox="0 0 300 300"><circle cx="150" cy="150" r="148" fill="none" stroke="#FBF6F5" stroke-width="4"></circle>' + paths + labels + '<circle cx="150" cy="150" r="16" fill="#FBF6F5"></circle></svg>';
  }

  /* ---------- markup do modal ---------- */
  var html = '' +
    '<div class="roleta-overlay" id="roleta-overlay">' +
    '  <div class="roleta-card">' +
    '    <button class="roleta-fechar" id="roleta-fechar" aria-label="Fechar">×</button>' +
    '    <div id="roleta-wheel-step" class="roleta-wheel-step">' +
    '      <h3 class="roleta-titulo">Gire e <em>ganhe</em></h3>' +
    '      <p class="roleta-sub">Um desconto exclusivo pode ser seu agora mesmo.</p>' +
    '      <div class="roleta-wheel-wrap"><div class="roleta-pointer"></div>' + wheelSVG() + '</div>' +
    '      <button class="roleta-btn roleta-btn-full" id="roleta-girar">Girar</button>' +
    '    </div>' +
    '    <div id="roleta-result-step" style="display:none">' +
    '      <h3 class="roleta-titulo">Parabéns!</h3>' +
    '      <p class="roleta-resultado" id="roleta-resultado-texto"></p>' +
    '      <form id="roleta-form" class="roleta-form ativo">' +
    '        <div class="roleta-campo"><label>Nome completo</label><input type="text" id="roleta-nome" placeholder="Seu nome e sobrenome"><small class="roleta-erro" id="roleta-erro-nome">Informe nome e sobrenome.</small></div>' +
    '        <div class="roleta-campo"><label>Telefone (com DDD)</label><input type="tel" id="roleta-telefone" placeholder="(48) 99999-9999"><small class="roleta-erro" id="roleta-erro-telefone">Informe um telefone válido com DDD.</small></div>' +
    '        <div class="roleta-campo"><label>E-mail</label><input type="email" id="roleta-email" placeholder="seu@email.com"><small class="roleta-erro" id="roleta-erro-email">Informe um e-mail válido.</small></div>' +
    '        <label class="roleta-lgpd"><input type="checkbox" id="roleta-lgpd"><span>Autorizo o uso dos meus dados para receber este cupom e novidades da Sua Essência Moda, conforme a LGPD.</span></label>' +
    '        <small class="roleta-erro" id="roleta-erro-lgpd">É preciso marcar essa autorização para continuar.</small>' +
    '        <button type="submit" class="roleta-btn roleta-btn-full">Quero meu cupom</button>' +
    '      </form>' +
    '      <div id="roleta-sucesso" class="roleta-sucesso">' +
    '        <div class="roleta-cupom-box"><div class="roleta-cupom-code" id="roleta-cupom-code"></div><div class="roleta-cupom-desc" id="roleta-cupom-desc"></div></div>' +
    '        <p class="roleta-validade" id="roleta-validade-texto"></p>' +
    '        <a class="roleta-wa-btn" id="roleta-wa-btn" href="#" target="_blank" rel="noopener">Falar no WhatsApp e usar o cupom</a>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<button class="roleta-flutuante" id="roleta-flutuante">🎡 <span>Gire e ganhe</span></button>';

  var container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  /* ---------- referências ---------- */
  var overlay = document.getElementById("roleta-overlay");
  var flutuante = document.getElementById("roleta-flutuante");
  var wheelStep = document.getElementById("roleta-wheel-step");
  var resultStep = document.getElementById("roleta-result-step");
  var resultadoTexto = document.getElementById("roleta-resultado-texto");
  var form = document.getElementById("roleta-form");
  var sucesso = document.getElementById("roleta-sucesso");
  var svg = document.getElementById("roleta-svg");
  var btnGirar = document.getElementById("roleta-girar");
  var rotacaoAtual = 0;
  var premioAtual = null;

  function abrirModal() {
    overlay.classList.add("aberta");
    flutuante.classList.add("escondido");
  }
  function fecharModal() {
    overlay.classList.remove("aberta");
    flutuante.classList.remove("escondido");
  }
  function mostrarCupomSalvo(saved) {
    wheelStep.style.display = "none";
    resultStep.style.display = "block";
    resultadoTexto.textContent = "Você já ganhou " + saved.percent + "% de desconto!";
    form.classList.remove("ativo");
    sucesso.classList.add("ativo");
    preencherSucesso(saved);
    abrirModal();
  }
  function mostrarPendente(saved) {
    premioAtual = { percent: saved.percent };
    wheelStep.style.display = "none";
    resultStep.style.display = "block";
    resultadoTexto.textContent = "Você ganhou " + saved.percent + "% de desconto!";
    form.classList.add("ativo");
    sucesso.classList.remove("ativo");
    abrirModal();
  }
  function preencherSucesso(saved) {
    document.getElementById("roleta-cupom-code").textContent = saved.cupom;
    document.getElementById("roleta-cupom-desc").textContent = saved.percent + "% de desconto na sua compra";
    document.getElementById("roleta-validade-texto").textContent = "Válido até " + fmtDataBR(saved.validade) + ". Apresente este cupom no atendimento.";
    var msg = "Olá! Ganhei " + saved.percent + "% de desconto na roleta do site e quero usar o cupom " + saved.cupom + ".";
    document.getElementById("roleta-wa-btn").href = waLink(msg);
  }

  btnGirar.onclick = function () {
    btnGirar.disabled = true;
    premioAtual = sortearPremio();
    saveResult({ percent: premioAtual.percent });
    var candidatos = [];
    WEDGES.forEach(function (w, i) { if (w.percent === premioAtual.percent) candidatos.push(i); });
    var slice = candidatos[Math.floor(Math.random() * candidatos.length)];
    var centerAngle = slice * 60 + 30;
    var jitter = (Math.random() * 20) - 10;
    var voltas = 5 * 360;
    var destino = voltas + (360 - centerAngle) + jitter;
    rotacaoAtual += destino;
    svg.style.transform = "rotate(" + rotacaoAtual + "deg)";
    setTimeout(function () {
      resultadoTexto.textContent = "Você ganhou " + premioAtual.percent + "% de desconto!";
      wheelStep.style.display = "none";
      resultStep.style.display = "block";
      btnGirar.disabled = false;
    }, 3700);
  };

  form.onsubmit = function (e) {
    e.preventDefault();
    var nome = document.getElementById("roleta-nome").value;
    var telefone = document.getElementById("roleta-telefone").value;
    var email = document.getElementById("roleta-email").value;
    var lgpd = document.getElementById("roleta-lgpd").checked;
    document.getElementById("roleta-erro-nome").classList.toggle("ativo", !validarNome(nome));
    document.getElementById("roleta-erro-telefone").classList.toggle("ativo", !validarTelefone(telefone));
    document.getElementById("roleta-erro-email").classList.toggle("ativo", !validarEmail(email));
    document.getElementById("roleta-erro-lgpd").classList.toggle("ativo", !lgpd);
    if (!validarNome(nome) || !validarTelefone(telefone) || !validarEmail(email) || !lgpd) return;

    var cupom = gerarCupom(premioAtual.percent);
    var hoje = new Date();
    var validadeDate = new Date(hoje.getTime() + ROLETA_VALIDADE_DIAS * 24 * 60 * 60 * 1000);
    var validadeISO = validadeDate.toISOString().slice(0, 10);
    var resultado = { nome: nome.trim(), telefone: telefone.trim(), email: email.trim(), percent: premioAtual.percent, cupom: cupom, validade: validadeISO, criadoEm: hoje.toISOString() };
    saveResult(resultado);
    enviarParaPlanilha(resultado);

    form.classList.remove("ativo");
    sucesso.classList.add("ativo");
    preencherSucesso(resultado);
  };

  document.getElementById("roleta-fechar").onclick = fecharModal;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) fecharModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharModal(); });

  flutuante.onclick = function () {
    var saved = getSaved();
    if (saved && saved.cupom) { mostrarCupomSalvo(saved); return; }
    if (saved && saved.percent) { mostrarPendente(saved); return; }
    wheelStep.style.display = "block";
    resultStep.style.display = "none";
    form.classList.add("ativo");
    sucesso.classList.remove("ativo");
    abrirModal();
  };

  /* ---------- abertura automática na primeira visita ---------- */
  var saved = getSaved();
  var jaMostrouAuto = false;
  try { jaMostrouAuto = !!localStorage.getItem(AUTO_SHOWN_KEY); } catch (e) {}
  if (!saved && !jaMostrouAuto) {
    setTimeout(function () {
      try { localStorage.setItem(AUTO_SHOWN_KEY, "1"); } catch (e) {}
      wheelStep.style.display = "block";
      resultStep.style.display = "none";
      form.classList.add("ativo");
      sucesso.classList.remove("ativo");
      abrirModal();
    }, ROLETA_AUTO_OPEN_MS);
  }
})();
