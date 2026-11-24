/*!
 * BLACK FRIDAY — Sua Essência Moda Plus
 * Pop-up "raspadinha" com cupom de 20% + tema escuro temporário.
 * Liga sozinho e desliga sozinho nas datas abaixo. Depois do fim, o site volta ao normal
 * (pode apagar a linha <script> com calma em dezembro).
 *
 * COMO INSTALAR: copie este arquivo para a pasta do site e, no index.html, logo antes de </body>, cole:
 *   <script src="black-friday.js" defer></script>
 */
(function () {
  "use strict";

  /* ================== CONFIGURAÇÃO (edite aqui) ================== */
  var CONFIG = {
    inicio: "2026-11-24T00:00:00-03:00",   // começa hoje
    fim:    "2026-12-01T00:00:00-03:00",   // termina à meia-noite do dia 30/11 para 01/12 (horário de Brasília)
    tema: "vinho",                         // "noir" | "neon" | "vinho" | "nenhum" (só o pop-up, sem escurecer)
    logo: "logo-white.png",                // caminho da logo no seu site
    whatsapp: "5548998183017",
    cupom: "BLACKESSENCIA20",
    desconto: 20,
    atrasoPopup: 2500,                     // ms até o pop-up aparecer
    validadeTexto: "Válido até 30/11/2026"
  };
  if (window.BF_CONFIG) for (var k in window.BF_CONFIG) CONFIG[k] = window.BF_CONFIG[k];

  var INICIO = Date.parse(CONFIG.inicio), FIM = Date.parse(CONFIG.fim);
  var forcar = CONFIG.forcar || /[?&]bf=on\b/.test(location.search);
  function ativo() { var t = Date.now(); return forcar || (t >= INICIO && t < FIM); }
  if (!ativo()) return; // fora do período: não faz absolutamente nada

  /* Paleta "vinho" alinhada à marca (--wine:#590C2A / --rose:#A57F8A do site real);
     noir e neon seguem genéricos como alternativas mais "Black Friday clássica" / jovem. */
  var TEMAS = {
    noir:  { bg: "#0b0b0c", surface: "#17161a", text: "#f3eee6", muted: "#b8b0a3", head: "#fbf6ec", accent: "#d4af37", accent2: "#f6dd8a", line: "rgba(212,175,55,.22)", glow: "rgba(212,175,55,.45)", ink: "#141109" },
    neon:  { bg: "#09070d", surface: "#16111d", text: "#f6f1fb", muted: "#b9aec6", head: "#ffffff", accent: "#ff2d95", accent2: "#c76bff", line: "rgba(255,45,149,.25)", glow: "rgba(255,45,149,.55)", ink: "#ffffff" },
    vinho: { bg: "#1b0a12", surface: "#2c121d", text: "#f6ece9", muted: "#c9aab2", head: "#fdf1ee", accent: "#A57F8A", accent2: "#E6C9D1", line: "rgba(165,127,138,.28)", glow: "rgba(165,127,138,.5)", ink: "#2c0d19" }
  };

  var html = document.documentElement;
  var waMsg = "Olá! Vim pelo site e quero usar meu cupom " + CONFIG.cupom + " de " + CONFIG.desconto + "% OFF da Black Friday 🖤";
  var waLink = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(waMsg);

  function aplicarTema(nome) {
    var t = TEMAS[nome] || TEMAS.vinho;
    for (var key in t) html.style.setProperty("--bf-" + key, t[key]);
    html.classList.toggle("bf-dark", nome !== "nenhum");
    CONFIG.tema = nome;
  }

  /* ---------- fontes ---------- */
  var f = document.createElement("link");
  f.rel = "stylesheet";
  f.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Montserrat:wght@400;600;800&display=swap";
  document.head.appendChild(f);

  /* ---------- estilos ---------- */
  var N = ":not(.bf-ui):not(.bf-ui *)";
  var NOTWA = ":not([href*='wa.me']):not([href*='whatsapp']):not([class*='whats'])";
  var css = [
    /* ===== TEMA ESCURO (genérico, aplica sobre o seu site) ===== */
    "html.bf-dark{color-scheme:dark}",
    "html.bf-dark,html.bf-dark body{background-color:var(--bf-bg)!important;color:var(--bf-text)!important}",
    "html.bf-dark div" + N + "{background-color:transparent!important;border-color:var(--bf-line)!important}",
    "html.bf-dark :is(main,section,article,aside,footer,.footer,form)" + N + "{background-color:var(--bf-bg)!important;color:var(--bf-text)!important;border-color:var(--bf-line)!important}",
    "html.bf-dark :is(header,nav,.header,.navbar,.topo,.menu)" + N + "{background-color:var(--bf-surface)!important;color:var(--bf-text)!important;border-color:var(--bf-line)!important;box-shadow:0 1px 0 var(--bf-line)!important}",
    "html.bf-dark :is([class*='card'],[class*='produto'],[class*='product'],[class*='item'],[class*='box'],[class*='modal'])" + N + "{background-color:var(--bf-surface)!important;color:var(--bf-text)!important;border-color:var(--bf-line)!important}",
    "html.bf-dark :is([class*='card'],[class*='produto'],[class*='product'])" + N + "{transition:box-shadow .3s,transform .3s}",
    "html.bf-dark :is([class*='card'],[class*='produto'],[class*='product'])" + N + ":hover{box-shadow:0 0 0 1px var(--bf-line),0 10px 40px -10px var(--bf-glow)!important}",
    "html.bf-dark :is(h1,h2,h3,h4,h5,h6)" + N + "{color:var(--bf-head)!important}",
    "html.bf-dark :is(p,li,label,small,td,th,figcaption,blockquote)" + N + "{color:inherit!important}",
    "html.bf-dark :is([class*='preco'],[class*='price'],[class*='valor'])" + N + "{color:var(--bf-accent2)!important}",
    "html.bf-dark a" + N + ":not([class*='btn']):not([class*='botao'])" + NOTWA + "{color:var(--bf-text)!important}",
    "html.bf-dark a" + N + ":not([class*='btn']):not([class*='botao'])" + NOTWA + ":hover{color:var(--bf-accent)!important}",
    "html.bf-dark :is(button,.btn,[class*='btn'],[class*='botao'],input[type=submit])" + N + NOTWA + "{background:linear-gradient(135deg,var(--bf-accent),var(--bf-accent2))!important;color:var(--bf-ink)!important;border-color:transparent!important}",
    "html.bf-dark :is(input:not([type=submit]),select,textarea)" + N + "{background-color:var(--bf-surface)!important;color:var(--bf-text)!important;border-color:var(--bf-line)!important}",
    "html.bf-dark hr" + N + "{border-color:var(--bf-line)!important}",
    "html.bf-dark ::selection{background:var(--bf-accent);color:var(--bf-ink)}",

    /* ===== FAIXA NO TOPO ===== */
    ".bf-bar{all:initial;display:block;box-sizing:border-box;width:100%;padding:10px 44px;background:#000;border-bottom:1px solid var(--bf-line);cursor:pointer;text-align:center;font:600 12px/1.4 Montserrat,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;position:relative;z-index:2147482000}",
    ".bf-bar b{background:linear-gradient(90deg,var(--bf-accent),var(--bf-accent2),var(--bf-accent));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:bfShine 3s linear infinite}",
    ".bf-bar .bf-t{font-variant-numeric:tabular-nums;color:var(--bf-accent2)}",

    /* ===== BOTÃO FLUTUANTE ===== */
    ".bf-fab{all:initial;position:fixed;left:16px;bottom:18px;z-index:2147482500;cursor:pointer;display:flex;align-items:center;gap:8px;padding:11px 18px 11px 14px;border-radius:999px;background:#0b0b0c;border:1px solid var(--bf-accent);color:#fff;font:800 13px Montserrat,system-ui,sans-serif;letter-spacing:.06em;box-shadow:0 0 0 0 var(--bf-glow);animation:bfPulse 2.4s infinite;transform:translateY(120px);transition:transform .5s cubic-bezier(.2,1.4,.4,1)}",
    ".bf-fab.bf-in{transform:none}",
    ".bf-fab i{font-style:normal;color:var(--bf-accent2)}",

    /* ===== POP-UP ===== */
    ".bf-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.74);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .35s;font-family:Montserrat,system-ui,sans-serif}",
    ".bf-overlay.bf-open{opacity:1;pointer-events:auto}",
    ".bf-wrap{position:relative;width:min(94vw,390px);max-height:96vh;overflow:auto;filter:drop-shadow(0 0 28px var(--bf-glow));transform:translateY(30px) scale(.94) rotate(-2deg);transition:transform .6s cubic-bezier(.2,1.3,.4,1);scrollbar-width:none}",
    ".bf-open .bf-wrap{transform:none}",
    ".bf-top,.bf-bot{position:relative;background:radial-gradient(120% 90% at 50% 0%,#211d15 0%,#0c0b0d 60%,#060607 100%);color:#f3eee6;text-align:center}",
    ".bf-top{border-radius:22px 22px 0 0;padding:26px 24px 22px;-webkit-mask:radial-gradient(circle 14px at 0 100%,#0000 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 100%,#0000 97%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 14px at 0 100%,#0000 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 100%,#0000 97%,#000) right/51% 100% no-repeat}",
    ".bf-bot{border-radius:0 0 22px 22px;padding:20px 22px 22px;background:#0c0b0d;-webkit-mask:radial-gradient(circle 14px at 0 0,#0000 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 0,#0000 97%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 14px at 0 0,#0000 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 0,#0000 97%,#000) right/51% 100% no-repeat}",
    ".bf-bot:before{content:'';position:absolute;left:22px;right:22px;top:0;border-top:2px dashed var(--bf-line)}",
    ".bf-x{position:absolute;top:12px;right:12px;z-index:3;width:34px;height:34px;border-radius:50%;border:1px solid var(--bf-line);background:rgba(255,255,255,.04);color:#fff;font-size:18px;line-height:1;cursor:pointer}",
    ".bf-x:hover{background:var(--bf-accent);color:#000}",
    ".bf-seal{position:relative;width:132px;height:132px;margin:0 auto 12px}",
    ".bf-seal svg.bf-ring{position:absolute;inset:0;width:100%;height:100%;animation:bfSpin 22s linear infinite}",
    ".bf-seal svg.bf-ring text{font:700 9.6px Montserrat,sans-serif;letter-spacing:2.2px;fill:var(--bf-accent2)}",
    ".bf-logo{position:absolute;inset:24px;border-radius:50%;overflow:hidden;background:radial-gradient(circle,var(--bf-surface),var(--bf-ink));box-shadow:0 0 0 2px var(--bf-accent),0 0 22px var(--bf-glow);display:flex;align-items:center;justify-content:center}",
    ".bf-logo img{width:78%;height:78%;object-fit:contain;filter:drop-shadow(0 1px 3px rgba(0,0,0,.4))}",
    ".bf-logo svg{width:100%;height:100%}",
    ".bf-kick{font:800 11px Montserrat,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:var(--bf-accent2);margin:0 0 6px}",
    ".bf-h{font:800 34px/1.05 'Playfair Display',Georgia,serif;margin:0 0 10px;color:#fff}",
    ".bf-h em{font-style:italic;font-weight:600;background:linear-gradient(90deg,var(--bf-accent),var(--bf-accent2),var(--bf-accent));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:bfShine 4s linear infinite}",
    ".bf-sub{font:400 14px/1.55 Montserrat,sans-serif;color:#cfc7ba;margin:0}",
    ".bf-spark{position:absolute;color:var(--bf-accent2);font-size:12px;animation:bfTw 2.6s ease-in-out infinite;pointer-events:none}",
    ".bf-lbl{font:600 12px Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--bf-muted,#b8b0a3);margin:4px 0 10px}",
    ".bf-scratch{position:relative;height:118px;border-radius:14px;overflow:hidden;border:1px solid var(--bf-line);background:repeating-linear-gradient(45deg,#111 0 10px,#151417 10px 20px);user-select:none;-webkit-user-select:none;touch-action:none}",
    ".bf-prize{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}",
    ".bf-big{font:800 44px/1 'Playfair Display',Georgia,serif;color:#fff;text-shadow:0 0 18px var(--bf-glow)}",
    ".bf-big small{font:800 16px Montserrat,sans-serif;letter-spacing:.1em;color:var(--bf-accent2);margin-left:4px}",
    ".bf-code{all:unset;cursor:pointer;font:800 14px/1 Montserrat,monospace;letter-spacing:.18em;padding:8px 14px;border:1.5px dashed var(--bf-accent);border-radius:8px;color:var(--bf-accent2)}",
    ".bf-scratch canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab;transition:opacity .6s}",
    ".bf-scratch.bf-done canvas{opacity:0;pointer-events:none}",
    ".bf-reveal{all:unset;cursor:pointer;display:inline-block;margin-top:8px;font:600 11px Montserrat,sans-serif;color:#8f887d;text-decoration:underline}",
    ".bf-cta{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:16px;padding:16px;border-radius:14px;background:linear-gradient(135deg,var(--bf-accent),var(--bf-accent2));color:var(--bf-ink);font:800 15px Montserrat,sans-serif;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 10px 30px -8px var(--bf-glow);transition:transform .2s}",
    ".bf-cta:hover{transform:translateY(-2px)}",
    ".bf-cta svg{width:22px;height:22px}",
    ".bf-scratch:not(.bf-done)~.bf-cta{filter:saturate(.75)}",
    ".bf-cd{display:flex;justify-content:center;gap:8px;margin-top:16px}",
    ".bf-cd div{min-width:52px;padding:8px 4px;border-radius:10px;background:#151417;border:1px solid var(--bf-line)}",
    ".bf-cd b{display:block;font:800 20px Montserrat,sans-serif;color:#fff;font-variant-numeric:tabular-nums}",
    ".bf-cd span{font:600 9px Montserrat,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8f887d}",
    ".bf-fine{font:400 11px/1.5 Montserrat,sans-serif;color:#8f887d;margin:12px 0 0}",
    ".bf-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2147483600;background:#000;color:#fff;border:1px solid var(--bf-accent);padding:10px 16px;border-radius:999px;font:600 13px Montserrat,sans-serif;opacity:0;transition:opacity .3s;pointer-events:none}",
    ".bf-toast.bf-in{opacity:1}",
    "@keyframes bfSpin{to{transform:rotate(360deg)}}",
    "@keyframes bfShine{to{background-position:-200% 0}}",
    "@keyframes bfTw{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.15)}}",
    "@keyframes bfPulse{0%{box-shadow:0 0 0 0 var(--bf-glow)}70%{box-shadow:0 0 0 14px rgba(0,0,0,0)}100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}}",
    "@media (prefers-reduced-motion:reduce){.bf-ui *,.bf-ui{animation:none!important;transition:none!important}}",
    "@media (max-width:640px){.bf-bar{padding:9px 10px;font-size:10.5px;letter-spacing:.08em}.bf-bar .bf-hm{display:none}}",
    "@media (max-width:380px){.bf-h{font-size:28px}.bf-seal{width:112px;height:112px}.bf-logo{inset:20px}}"
  ].join("\n");

  var st = document.createElement("style");
  st.id = "bf-style";
  st.textContent = css;
  document.head.appendChild(st);
  aplicarTema(CONFIG.tema);

  /* ---------- quando a página estiver pronta ---------- */
  function pronto(fn) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn(); }

  var els = {};
  pronto(function () {
    if (!ativo()) return encerrar();

    /* faixa */
    var bar = document.createElement("div");
    bar.className = "bf-bar bf-ui";
    bar.setAttribute("role", "button");
    bar.innerHTML = "✦ <b>Black Friday<span class='bf-hm'> Sua Essência</span></b> · " + CONFIG.desconto + "% OFF<span class='bf-hm'> com o cupom <b>" + CONFIG.cupom + "</b></span> · <span class='bf-hm'>termina em </span><span class='bf-t'></span> ✦";
    bar.onclick = abrir;
    document.body.insertBefore(bar, document.body.firstChild);

    /* botão flutuante */
    var fab = document.createElement("button");
    fab.className = "bf-fab bf-ui";
    fab.type = "button";
    fab.setAttribute("aria-label", "Abrir cupom de " + CONFIG.desconto + "% da Black Friday");
    fab.innerHTML = "<i>✦</i> " + CONFIG.desconto + "% OFF";
    fab.onclick = abrir;
    document.body.appendChild(fab);

    /* pop-up */
    var ov = document.createElement("div");
    ov.className = "bf-overlay bf-ui";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Cupom Black Friday");
    var ring = "BLACK FRIDAY ✦ SUA ESSÊNCIA MODA PLUS ✦ VISTA QUEM VOCÊ É ✦ ";
    ov.innerHTML =
      "<div class='bf-wrap'>" +
        "<div class='bf-top'>" +
          "<button class='bf-x' type='button' aria-label='Fechar'>×</button>" +
          "<span class='bf-spark' style='top:22px;left:28px'>✦</span>" +
          "<span class='bf-spark' style='top:70px;right:40px;animation-delay:.8s'>✦</span>" +
          "<span class='bf-spark' style='top:150px;left:44px;animation-delay:1.6s;font-size:9px'>✦</span>" +
          "<span class='bf-spark' style='bottom:30px;right:26px;animation-delay:1.1s;font-size:9px'>✦</span>" +
          "<div class='bf-seal'>" +
            "<svg class='bf-ring' viewBox='0 0 132 132' aria-hidden='true'><defs><path id='bfc' d='M66,66 m-57,0 a57,57 0 1,1 114,0 a57,57 0 1,1 -114,0'/></defs><text><textPath href='#bfc' textLength='356'>" + ring + "</textPath></text></svg>" +
            "<div class='bf-logo'><img alt='Sua Essência Moda Plus' src='" + CONFIG.logo + "'></div>" +
          "</div>" +
          "<p class='bf-kick'>Black Friday Essência</p>" +
          "<h2 class='bf-h'>Feita pra <em>brilhar</em><br>no escuro.</h2>" +
          "<p class='bf-sub'>Estilo não tem tamanho. Nesta Black Friday, a sua essência ganha um presente.</p>" +
        "</div>" +
        "<div class='bf-bot'>" +
          "<p class='bf-lbl'>✦ Raspe e revele o seu presente ✦</p>" +
          "<div class='bf-scratch'>" +
            "<div class='bf-prize'><div class='bf-big'>" + CONFIG.desconto + "%<small>OFF</small></div><button class='bf-code' type='button' title='Copiar cupom'>" + CONFIG.cupom + "</button></div>" +
            "<canvas aria-hidden='true'></canvas>" +
          "</div>" +
          "<button class='bf-reveal' type='button'>Prefere não raspar? Toque aqui para revelar</button>" +
          "<a class='bf-cta' target='_blank' rel='noopener' href='" + waLink + "'>" + iconeWhats() + "<span>Resgatar no WhatsApp</span></a>" +
          "<div class='bf-cd' aria-label='Tempo restante'><div><b data-u='d'>0</b><span>dias</span></div><div><b data-u='h'>00</b><span>horas</span></div><div><b data-u='m'>00</b><span>min</span></div><div><b data-u='s'>00</b><span>seg</span></div></div>" +
          "<p class='bf-fine'>" + CONFIG.validadeTexto + " · Tamanhos do 42 ao 52 · Envie o código no WhatsApp</p>" +
        "</div>" +
      "</div>";
    document.body.appendChild(ov);

    var img = ov.querySelector(".bf-logo img");
    img.onerror = function () { img.parentNode.innerHTML = monograma(); };

    ov.querySelector(".bf-x").onclick = fechar;
    ov.addEventListener("click", function (e) { if (e.target === ov) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.classList.contains("bf-open")) fechar(); });
    ov.querySelector(".bf-reveal").onclick = function () { revelar(); };
    ov.querySelector(".bf-code").onclick = copiar;
    ov.querySelector(".bf-cta").addEventListener("click", function () { revelar(); });

    els = { bar: bar, fab: fab, ov: ov, scratch: ov.querySelector(".bf-scratch"), canvas: ov.querySelector("canvas"), barT: bar.querySelector(".bf-t") };

    tick();
    els.timer = setInterval(tick, 1000);

    var visto = false;
    try { visto = sessionStorage.getItem("bf2026_visto") === "1"; } catch (e) {}
    if (!visto || forcar) setTimeout(abrir, CONFIG.atrasoPopup);
    else els.fab.classList.add("bf-in");
  });

  /* ---------- raspadinha ---------- */
  var raspado = false, pintado = false;
  function prepararRaspadinha() {
    if (pintado) return;
    var cv = els.canvas, box = els.scratch.getBoundingClientRect();
    if (!box.width) return;
    pintado = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = box.width * dpr; cv.height = box.height * dpr;
    var ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    var cs = getComputedStyle(html);
    var a1 = cs.getPropertyValue("--bf-accent").trim() || "#A57F8A", a2 = cs.getPropertyValue("--bf-accent2").trim() || "#E6C9D1";
    var g = ctx.createLinearGradient(0, 0, box.width, box.height);
    g.addColorStop(0, a1); g.addColorStop(.45, a2); g.addColorStop(.55, "#fff8e1"); g.addColorStop(1, a1);
    ctx.fillStyle = g; ctx.fillRect(0, 0, box.width, box.height);
    /* textura de brilho */
    for (var i = 0; i < 260; i++) {
      ctx.fillStyle = "rgba(255,255,255," + (Math.random() * .35) + ")";
      ctx.fillRect(Math.random() * box.width, Math.random() * box.height, 1.5, 1.5);
    }
    ctx.fillStyle = "rgba(20,17,9,.82)";
    ctx.font = "800 15px Montserrat, system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✦  RASPE AQUI  ✦", box.width / 2, box.height / 2 - 8);
    ctx.font = "600 11px Montserrat, system-ui, sans-serif";
    ctx.fillText("com o dedo ou o mouse", box.width / 2, box.height / 2 + 14);
    ctx.globalCompositeOperation = "destination-out";

    var down = false, last = null, n = 0;
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function risco(p) {
      ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo((last || p).x, (last || p).y); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
      last = p;
      if (++n % 8 === 0 && porcentagem() > .5) revelar();
    }
    cv.addEventListener("pointerdown", function (e) { down = true; last = null; try { cv.setPointerCapture(e.pointerId); } catch (x) {} risco(pos(e)); });
    cv.addEventListener("pointermove", function (e) { if (down) risco(pos(e)); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { cv.addEventListener(ev, function () { down = false; last = null; }); });
    function porcentagem() {
      var d = ctx.getImageData(0, 0, cv.width, cv.height).data, vazio = 0, total = 0;
      for (var j = 3; j < d.length; j += 4 * 24) { total++; if (d[j] === 0) vazio++; }
      return vazio / total;
    }
  }
  function revelar() {
    if (raspado) return;
    raspado = true;
    els.scratch.classList.add("bf-done");
    var r = els.ov.querySelector(".bf-reveal"); if (r) r.style.visibility = "hidden";
    confete();
  }
  function confete() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = els.scratch;
    for (var i = 0; i < 26; i++) {
      var s = document.createElement("span");
      s.textContent = i % 3 ? "✦" : "•";
      s.style.cssText = "position:absolute;left:50%;top:50%;pointer-events:none;color:" + (i % 2 ? "var(--bf-accent)" : "var(--bf-accent2)") + ";font-size:" + (8 + Math.random() * 10) + "px;transition:transform 1s cubic-bezier(.1,.8,.3,1),opacity 1s;z-index:2";
      box.appendChild(s);
      (function (el) {
        requestAnimationFrame(function () {
          var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
          el.style.transform = "translate(" + Math.cos(a) * d + "px," + Math.sin(a) * d + "px) rotate(" + (Math.random() * 360) + "deg)";
          el.style.opacity = "0";
        });
        setTimeout(function () { el.remove(); }, 1100);
      })(s);
    }
  }

  /* ---------- ações ---------- */
  function abrir() {
    if (!els.ov) return;
    els.ov.classList.add("bf-open");
    els.fab.classList.remove("bf-in");
    try { sessionStorage.setItem("bf2026_visto", "1"); } catch (e) {}
    setTimeout(prepararRaspadinha, 60);
  }
  function fechar() {
    els.ov.classList.remove("bf-open");
    setTimeout(function () { els.fab.classList.add("bf-in"); }, 350);
  }
  function copiar() {
    var ok = function () { toast("Cupom " + CONFIG.cupom + " copiado ✦"); };
    try { navigator.clipboard.writeText(CONFIG.cupom).then(ok, ok); } catch (e) { ok(); }
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "bf-toast bf-ui"; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("bf-in"); });
    setTimeout(function () { t.classList.remove("bf-in"); setTimeout(function () { t.remove(); }, 300); }, 1800);
  }

  /* ---------- contagem regressiva + desligamento automático ---------- */
  function tick() {
    var r = FIM - Date.now();
    if (r <= 0 && !forcar) return encerrar();
    r = Math.max(r, 0);
    var d = Math.floor(r / 864e5), h = Math.floor(r / 36e5) % 24, m = Math.floor(r / 6e4) % 60, s = Math.floor(r / 1e3) % 60;
    var p = function (x) { return (x < 10 ? "0" : "") + x; };
    if (els.barT) els.barT.textContent = d + "d " + p(h) + "h " + p(m) + "m " + p(s) + "s";
    if (els.ov) {
      var u = { d: d, h: p(h), m: p(m), s: p(s) };
      els.ov.querySelectorAll(".bf-cd b").forEach(function (b) { b.textContent = u[b.getAttribute("data-u")]; });
    }
  }
  function encerrar() {
    if (els.timer) clearInterval(els.timer);
    html.classList.remove("bf-dark");
    ["bar", "fab", "ov"].forEach(function (k) { if (els[k]) els[k].remove(); });
    var s = document.getElementById("bf-style"); if (s) s.remove();
    els = {};
  }

  /* ---------- ícones ---------- */
  function iconeWhats() {
    return "<svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z'/></svg>";
  }
  function monograma() {
    return "<svg viewBox='0 0 100 100' aria-label='Sua Essência'><rect width='100' height='100' fill='#0b0b0c'/><text x='50' y='58' text-anchor='middle' font-family='Playfair Display,Georgia,serif' font-size='40' font-style='italic' font-weight='600' style='fill:var(--bf-accent2)'>SE</text><text x='50' y='76' text-anchor='middle' font-family='Montserrat,sans-serif' font-size='7' letter-spacing='2' style='fill:var(--bf-accent)'>MODA PLUS</text></svg>";
  }

  /* API para testes: BlackFriday.tema('neon'), BlackFriday.abrir(), BlackFriday.encerrar() */
  window.BlackFriday = {
    tema: function (n) { aplicarTema(n); pintado = false; raspado = false; if (els.scratch) { els.scratch.classList.remove("bf-done"); var r = els.ov.querySelector(".bf-reveal"); if (r) r.style.visibility = ""; if (els.ov.classList.contains("bf-open")) prepararRaspadinha(); } },
    abrir: function () { abrir(); },
    encerrar: encerrar
  };
})();
