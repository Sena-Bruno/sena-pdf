exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: ''
    };
  }

  const p = event.queryStringParameters || {};
  const d = {
    nome_aluno:      decodeURIComponent(p.nome      || 'Aluno'),
    curso:           decodeURIComponent(p.curso     || ''),
    codigo:          decodeURIComponent(p.codigo    || ''),
    data:            decodeURIComponent(p.data      || ''),
    media:           decodeURIComponent(p.media     || ''),
    aulas_aprovadas: decodeURIComponent(p.aprovadas || ''),
    total_aulas:     decodeURIComponent(p.total     || '')
  };

  const html = gerarHTMLCertificado(d);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html
  };
};

function gerarHTMLCertificado(d) {
  const curso = (d.curso || '').toLowerCase();
  if (curso.includes('master'))       return htmlTemaMaster(d);
  if (curso.includes('practitioner')) return htmlTemaPractitioner(d);
  if (curso.includes('hipno'))        return htmlTemaHipno(d);
  if (curso.includes('coach'))        return htmlTemaCoach(d);
  return htmlTemaMaster(d);
}

const ASSINATURA_URL = 'https://sena-pdf.netlify.app/public/assinatura_brunosena.png';

function assinatura(cor) {
  return `
    <img src="${ASSINATURA_URL}" style="height:48px;display:block;margin-bottom:2px;opacity:0.85;" />
    <div style="width:60px;height:1px;background:${cor || '#ccc'};opacity:0.4;margin-bottom:4px;"></div>
    <p class="sig-name" style="color:${cor || '#222'};">Bruno Sena</p>
    <p class="sig-role">Diretor e Instrutor</p>
  `;
}

function btnImprimir() {
  return '<button class="print-btn" onclick="window.print()">⬇️ Salvar PDF</button>';
}

function cssBase() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { width: 100vw; height: 100vh; font-family: 'Montserrat', sans-serif; color: #333; overflow: hidden; }
    .print-btn { position: fixed; top: 16px; right: 16px; z-index: 9999; background: #1C2B3A; color: #fff; border: none; padding: 12px 24px; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    @media print { .print-btn { display: none !important; } @page { size: A4 landscape; margin: 0; } body { width: 297mm !important; height: 210mm !important; } }
    .c-side { display: flex; width: 100%; height: 100%; }
    .c-side .sidebar { width: 27%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 30px; box-sizing: border-box; flex-shrink: 0; }
    .c-side .sidebar-monogram { font-family: 'Playfair Display', serif; font-size: 36px; letter-spacing: 4px; line-height: 1.1; margin-bottom: 20px; }
    .c-side .sidebar-rule { width: 40%; height: 1px; margin: 0 auto 20px; opacity: .5; }
    .c-side .sidebar-text { font-size: 10px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; opacity: .65; line-height: 2; }
    .c-side .content { width: 73%; padding: 50px 55px 50px 50px; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; background: #fff; }
    .c-side .eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: #999; margin: 0 0 18px; }
    .c-side .title { font-family: 'Montserrat', sans-serif; font-weight: 200; font-size: 46px; color: #111; margin: 0 0 20px; letter-spacing: 3px; }
    .c-side .name { font-family: 'Playfair Display', serif; font-size: 42px; color: #111; margin: 8px 0; font-weight: 400; }
    .c-side .course { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 18px; }
    .c-side .desc { font-size: 13px; color: #666; font-weight: 300; line-height: 1.6; max-width: 88%; }
    .c-side .desc .bold { font-weight: 600; color: #444; }
    .c-side .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 90%; margin-top: 24px; }
    .c-side .sig-line { width: 35%; padding-top: 8px; }
    .c-side .sig-name { margin: 0; font-size: 13px; font-weight: 600; color: #222; }
    .c-side .sig-role { margin: 0; font-size: 11px; color: #999; }
    .c-side .meta { text-align: right; }
    .c-side .meta-date { margin: 0; font-size: 11px; color: #aaa; }
    .c-side .meta-cod { font-family: monospace; font-size: 10px; margin-top: 3px; }
    .c-topband { display: flex; flex-direction: column; width: 100%; height: 100%; }
    .c-topband .topbar { height: 18%; display: flex; align-items: center; justify-content: space-between; padding: 0 55px; box-sizing: border-box; flex-shrink: 0; }
    .c-topband .topbar-logo { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 22px; letter-spacing: 6px; }
    .c-topband .topbar-inst { font-size: 9px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; text-align: right; line-height: 1.8; opacity: .7; }
    .c-topband .body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 55px 30px; box-sizing: border-box; }
    .c-topband .eyebrow { font-size: 9px; font-weight: 500; letter-spacing: 5px; text-transform: uppercase; color: #aaa; margin: 0 0 12px; }
    .c-topband .title { font-family: 'Montserrat', sans-serif; font-weight: 200; font-size: 44px; color: #111; margin: 0 0 18px; letter-spacing: 4px; }
    .c-topband .name { font-family: 'Playfair Display', serif; font-size: 38px; color: #111; margin: 6px 0; font-weight: 400; }
    .c-topband .course { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 14px; }
    .c-topband .desc { font-size: 12px; color: #777; font-weight: 300; line-height: 1.6; max-width: 75%; }
    .c-topband .desc .bold { font-weight: 600; color: #555; }
    .c-topband .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 22px; width: 100%; }
    .c-topband .sig-line { padding-top: 6px; width: 32%; }
    .c-topband .sig-name { margin: 0; font-size: 12px; font-weight: 600; color: #222; }
    .c-topband .sig-role { margin: 0; font-size: 10px; color: #aaa; }
    .c-topband .meta { text-align: right; }
    .c-topband .meta-date { margin: 0; font-size: 10px; color: #bbb; }
    .c-topband .meta-cod { font-family: monospace; font-size: 9px; margin-top: 3px; }
  `;
}

function htmlTemaMaster(d) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Certificado IBSDH</title><style>${cssBase()}
    body { background: #fff; }
    .sidebar { background: #1C2B3A; color: #C9A96E; border-right: 3px solid #C9A96E; }
    .sidebar-monogram { color: #C9A96E; }
    .sidebar-rule { background: #C9A96E; }
    .course { color: #1C2B3A; }
    .meta-cod { color: #C9A96E; }
  </style></head><body>
  ${btnImprimir()}
  <div class="c-side">
    <div class="sidebar">
      <div class="sidebar-monogram">IBSDH</div>
      <div class="sidebar-rule"></div>
      <div class="sidebar-text">Instituto<br>Bruno Sena<br>de Desenvolvimento<br>Humano</div>
    </div>
    <div class="content">
      <p class="eyebrow">Atestado de Excelência</p>
      <h1 class="title">Certificado</h1>
      <div class="name">${d.nome_aluno}</div>
      <div class="course">Master em Programação Neurolinguística</div>
      <p class="desc">Este certificado celebra a trajetória de <span class="bold">${d.nome_aluno}</span> na formação de Master em PNL, concluída com domínio integral de <span class="bold">${d.aulas_aprovadas}/${d.total_aulas}</span> aulas no Simulador Clínico SENA — reconhecimento máximo de excelência técnica e maturidade profissional.</p>
      <div class="footer">
        <div class="sig-line">${assinatura('#1C2B3A')}</div>
        <div class="meta"><p class="meta-date">${d.data}</p><p class="meta-cod">Cod: ${d.codigo}</p></div>
      </div>
    </div>
  </div>
  </body></html>`;
}

function htmlTemaPractitioner(d) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Certificado IBSDH</title><style>${cssBase()}
    body { background: #fff; }
    .topbar { background: #1B1F3B; color: #fff; }
    .topbar-logo { color: #7EB8D4; }
    .course { color: #1B1F3B; }
    .meta-cod { color: #7EB8D4; }
  </style></head><body>
  ${btnImprimir()}
  <div class="c-topband">
    <div class="topbar">
      <div class="topbar-logo">IBSDH</div>
      <div class="topbar-inst">Instituto Bruno Sena<br>de Desenvolvimento Humano</div>
    </div>
    <div class="body">
      <p class="eyebrow">Atestado de Qualificação</p>
      <h1 class="title">Certificado</h1>
      <div class="name">${d.nome_aluno}</div>
      <div class="course">Practitioner em Programação Neurolinguística</div>
      <p class="desc">Este certificado reconhece o percurso de <span class="bold">${d.nome_aluno}</span> na formação de Practitioner em PNL, concluída com média <span class="bold">${d.media}</span> e conclusão integral de <span class="bold">${d.aulas_aprovadas}/${d.total_aulas}</span> aulas no Simulador Clínico SENA — marco inicial de uma nova forma de compreender e transformar comportamentos.</p>
      <div class="footer">
        <div class="sig-line">${assinatura('#1B1F3B')}</div>
        <div class="meta"><p class="meta-date">${d.data}</p><p class="meta-cod">Cod: ${d.codigo}</p></div>
      </div>
    </div>
  </div>
  </body></html>`;
}

function htmlTemaHipno(d) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Certificado IBSDH</title><style>${cssBase()}
    body { background: #FAFAF8; position: relative; }
    .diag-bg { position: absolute; top: 0; left: 0; width: 32%; height: 100%; background: #2D3B36; clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%); z-index: 0; }
    .diag-accent { position: absolute; top: 0; left: 0; width: 32%; height: 100%; clip-path: polygon(100% 0, calc(100% + 3px) 0, calc(80% + 3px) 100%, 80% 100%); background: #8BAF8A; z-index: 1; }
    .diag-left { position: absolute; top: 0; left: 0; width: 26%; height: 100%; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 20px 40px 30px; box-sizing: border-box; color: #fff; }
    .diag-monogram { font-family: 'Playfair Display', serif; font-size: 32px; letter-spacing: 4px; color: #8BAF8A; margin-bottom: 14px; }
    .diag-rule { width: 35%; height: 1px; background: #8BAF8A; margin: 0 auto 14px; opacity: .6; }
    .diag-inst { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; opacity: .5; line-height: 2; }
    .diag-right { position: absolute; top: 0; left: 29%; right: 0; height: 100%; z-index: 2; display: flex; flex-direction: column; justify-content: center; padding: 40px 50px 40px 40px; box-sizing: border-box; }
    .eyebrow { font-size: 9px; font-weight: 500; letter-spacing: 5px; text-transform: uppercase; color: #8BAF8A; margin: 0 0 14px; }
    .title { font-family: 'Playfair Display', serif; font-weight: 400; font-size: 44px; color: #2D3B36; margin: 0 0 20px; }
    .name { font-family: 'Playfair Display', serif; font-style: italic; font-size: 36px; color: #2D3B36; margin: 6px 0; }
    .course { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #2D3B36; margin: 0 0 16px; }
    .desc { font-size: 12px; color: #777; font-weight: 300; line-height: 1.7; }
    .desc .bold { font-weight: 600; color: #555; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 95%; margin-top: 22px; }
    .sig-line { padding-top: 6px; width: 38%; }
    .sig-name { margin: 0; font-size: 12px; font-weight: 600; color: #2D3B36; }
    .sig-role { margin: 0; font-size: 10px; color: #aaa; }
    .meta { text-align: right; }
    .meta-date { margin: 0; font-size: 10px; color: #bbb; }
    .meta-cod { font-family: monospace; font-size: 9px; color: #8BAF8A; margin-top: 3px; }
  </style></head><body>
  ${btnImprimir()}
  <div class="diag-bg"></div>
  <div class="diag-accent"></div>
  <div class="diag-left">
    <div class="diag-monogram">IBSDH</div>
    <div class="diag-rule"></div>
    <div class="diag-inst">Instituto<br>Bruno Sena<br>de Desenvolvimento<br>Humano</div>
  </div>
  <div class="diag-right">
    <p class="eyebrow">Atestado de Qualificação</p>
    <h1 class="title">Certificado</h1>
    <div class="name">${d.nome_aluno}</div>
    <div class="course">Hipnoterapeuta Clínico</div>
    <p class="desc">Este certificado reconhece o caminho de <span class="bold">${d.nome_aluno}</span> na formação de Hipnoterapeuta Clínico, concluída com domínio completo de <span class="bold">${d.aulas_aprovadas}/${d.total_aulas}</span> aulas no Simulador Clínico SENA — atestando sensibilidade técnica e segurança nas práticas de indução e intervenção terapêutica.</p>
    <div class="footer">
      <div class="sig-line">${assinatura('#2D3B36')}</div>
      <div class="meta"><p class="meta-date">${d.data}</p><p class="meta-cod">ID: ${d.codigo}</p></div>
    </div>
  </div>
  </body></html>`;
}

function htmlTemaCoach(d) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Certificado IBSDH</title><style>${cssBase()}
    body { background: #fff; }
    .sidebar { background: #1A1A1A; color: #D4AF37; border-right: 3px solid #D4AF37; }
    .sidebar-monogram { color: #D4AF37; }
    .sidebar-rule { background: #D4AF37; }
    .course { color: #1A1A1A; }
    .meta-cod { color: #D4AF37; }
  </style></head><body>
  ${btnImprimir()}
  <div class="c-side">
    <div class="sidebar">
      <div class="sidebar-monogram">IBSDH</div>
      <div class="sidebar-rule"></div>
      <div class="sidebar-text">Instituto<br>Bruno Sena<br>de Desenvolvimento<br>Humano</div>
    </div>
    <div class="content">
      <p class="eyebrow">Atestado de Qualificação</p>
      <h1 class="title">Certificado</h1>
      <div class="name">${d.nome_aluno}</div>
      <div class="course">Coach Profissional</div>
      <p class="desc">Este certificado reconhece a formação de <span class="bold">${d.nome_aluno}</span> como Coach Profissional, concluída com domínio completo de <span class="bold">${d.aulas_aprovadas}/${d.total_aulas}</span> aulas no Simulador Clínico SENA — evidenciando maestria prática das ferramentas que transformam potencial em resultado.</p>
      <div class="footer">
        <div class="sig-line">${assinatura('#1A1A1A')}</div>
        <div class="meta"><p class="meta-date">${d.data}</p><p class="meta-cod">ID: ${d.codigo}</p></div>
      </div>
    </div>
  </div>
  </body></html>`;
}
