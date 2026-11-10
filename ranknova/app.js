(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const status = (root, message) => { const node = $('[data-status]', root); if (node) node.textContent = message; };
  const download = (filename, content, type = 'text/plain;charset=utf-8') => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], {type}));
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  const copy = async (content, root) => {
    if (!content.trim()) { status(root, 'Add some content first.'); return; }
    try {
      await navigator.clipboard.writeText(content);
      status(root, 'Copied to clipboard.');
    } catch {
      const field = document.createElement('textarea');
      field.value = content;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      status(root, copied ? 'Copied to clipboard.' : 'Copy unavailable; select the output to copy it.');
    }
  };

  const menu = $('.menu-toggle');
  const nav = $('#primary-nav');
  if (menu && nav) menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  const themeButton = $('.theme-toggle');
  const setTheme = theme => {
    document.body.dataset.theme = theme;
    if (!themeButton) return;
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    $('.theme-label', themeButton).textContent = dark ? 'Light mode' : 'Dark mode';
    $('span[aria-hidden="true"]', themeButton).textContent = dark ? '☀' : '☾';
  };
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('ranknova-theme') || 'light'; } catch {}
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  if (themeButton) themeButton.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('ranknova-theme', next); } catch {}
  });
  $$('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  const powerWords = new Set('amazing actionable essential easy effective expert proven powerful practical simple smart ultimate useful better best brilliant bold complete clever confidence discover effortless fast free fresh guide improve incredible instant key master perfect quick secret strong surprising tested transform'.split(' '));
  const commonWords = new Set('a an and are as at be by for from how i in into is it of on or the this to with your you what when why'.split(' '));
  function analyzeHeadline(raw) {
    const text = raw.trim();
    const tokens = text.match(/[\p{L}\p{N}’'-]+/gu) || [];
    const normalized = tokens.map(word => word.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));
    const count = tokens.length;
    const vivid = normalized.filter(word => powerWords.has(word)).length;
    const common = normalized.filter(word => commonWords.has(word)).length;
    const variety = count ? new Set(normalized.filter(Boolean)).size / count : 0;
    const chars = text.length;
    const lengthScore = !chars ? 0 : chars < 25 ? Math.max(35, Math.round(chars * 2.1)) : chars <= 70 ? 100 : Math.max(35, 100 - Math.round((chars - 70) * 1.35));
    const balanceScore = !count ? 0 : Math.min(100, Math.round(variety * 70 + Math.min(common / count, .35) * 55 + (count >= 4 && count <= 10 ? 12 : 0)));
    const vividScore = !count ? 0 : Math.min(100, 58 + vivid * 22);
    const score = count ? Math.round(lengthScore * .4 + balanceScore * .35 + vividScore * .25) : 0;
    const tips = [];
    if (!count) tips.push('Start with the subject your reader came for.');
    else {
      if (chars < 30) tips.push('Add a specific benefit or audience detail if it makes the promise clearer.');
      if (chars > 70) tips.push('Try trimming the headline so its main idea is easier to scan.');
      if (count < 4) tips.push('A little more context may help readers understand what the page covers.');
      if (count > 12) tips.push('Remove repeated or introductory words and lead with the central topic.');
      if (variety < .65 && count > 1) tips.push('Vary repeated words; concrete nouns can make the subject more distinct.');
      if (!vivid) tips.push('If it fits the facts, try one vivid, specific word—not hype for its own sake.');
      if (vivid > 2) tips.push('Several high-impact words compete for attention; keep only the ones the content earns.');
      if (!tips.length) tips.push('The draft looks balanced. Check that the page delivers the promise in the headline.');
    }
    return {score, lengthScore, balanceScore, vividScore, tips, count, vivid, chars};
  }

  const demo = $('[data-headline-demo]');
  if (demo) {
    const input = $('#demo-headline', demo);
    const update = () => {
      const result = analyzeHeadline(input.value);
      $('[data-demo-score]', demo).textContent = input.value.trim() ? result.score : '—';
      $('[data-demo-meter]', demo).style.width = `${result.score}%`;
      $('[data-demo-tip]', demo).textContent = input.value.trim() ? result.tips[0] : 'Type a headline to see a few writing cues.';
    };
    input.addEventListener('input', update);
    update();
  }

  const metaTool = $('[data-tool="meta"]');
  if (metaTool) {
    const title = $('#meta-title', metaTool), description = $('#meta-description', metaTool);
    const url = $('#meta-url', metaTool), site = $('#meta-site-name', metaTool);
    const image = $('#meta-image', metaTool), twitter = $('#meta-twitter', metaTool);
    const output = $('[data-output]', metaTool);
    const update = () => {
      const t = title.value.trim(), d = description.value.trim(), u = url.value.trim();
      const brand = site.value.trim(), img = image.value.trim();
      $('[data-title-count]', metaTool).textContent = `${t.length} / 60`;
      $('[data-desc-count]', metaTool).textContent = `${d.length} / 160`;
      let previewURL = 'example.com › your-page';
      try { if (u) { const parsed = new URL(u); previewURL = parsed.host + (parsed.pathname === '/' ? '' : ` › ${parsed.pathname.slice(1).replaceAll('/', ' › ')}`); } }
      catch { previewURL = 'Enter a valid page URL for the preview'; }
      $('[data-preview-url]', metaTool).textContent = previewURL;
      $('[data-preview-title]', metaTool).textContent = t || 'Your page title will appear here';
      $('[data-preview-desc]', metaTool).textContent = d || 'A useful description helps visitors understand what this page offers.';
      const tags = [];
      if (t) tags.push(`<title>${escapeHTML(t)}</title>`);
      if (d) tags.push(`<meta name="description" content="${escapeHTML(d)}">`);
      if (u) tags.push(`<link rel="canonical" href="${escapeHTML(u)}">`);
      if (t) tags.push(`<meta property="og:title" content="${escapeHTML(t)}">`);
      if (d) tags.push(`<meta property="og:description" content="${escapeHTML(d)}">`);
      if (u) tags.push(`<meta property="og:url" content="${escapeHTML(u)}">`);
      tags.push('<meta property="og:type" content="website">');
      if (brand) tags.push(`<meta property="og:site_name" content="${escapeHTML(brand)}">`);
      if (img) tags.push(`<meta property="og:image" content="${escapeHTML(img)}">`);
      tags.push(`<meta name="twitter:card" content="${twitter.value}">`);
      if (t) tags.push(`<meta name="twitter:title" content="${escapeHTML(t)}">`);
      if (d) tags.push(`<meta name="twitter:description" content="${escapeHTML(d)}">`);
      if (img) tags.push(`<meta name="twitter:image" content="${escapeHTML(img)}">`);
      output.textContent = tags.join('\n');
    };
    [title, description, url, site, image, twitter].forEach(input => input.addEventListener('input', update));
    update();
    $('[data-copy]', metaTool).addEventListener('click', () => copy(output.textContent, metaTool));
    $('[data-download]', metaTool).addEventListener('click', () => download('meta-tags.html', output.textContent, 'text/html;charset=utf-8'));
  }

  const schemaTool = $('[data-tool="schema"]');
  if (schemaTool) {
    const type = $('#schema-type', schemaTool), fields = $('[data-schema-fields]', schemaTool), output = $('[data-output]', schemaTool);
    const definitions = {
      Article: [['headline','Headline','text'],['description','Description','textarea'],['author','Author name','text'],['datePublished','Publication date','date'],['url','Page URL','url']],
      FAQPage: [['q1','Question 1','text'],['a1','Answer 1','textarea'],['q2','Question 2','text'],['a2','Answer 2','textarea'],['q3','Question 3','text'],['a3','Answer 3','textarea']],
      Product: [['name','Product name','text'],['description','Description','textarea'],['image','Image URL','url'],['price','Price','number'],['currency','Currency code','text'],['availability','Availability URL (optional)','url'],['url','Product page URL','url']],
      LocalBusiness: [['name','Business name','text'],['businessType','Business type','text'],['streetAddress','Street address','text'],['addressLocality','City or locality','text'],['addressRegion','Region or state','text'],['postalCode','Postal code','text'],['addressCountry','Country code','text'],['telephone','Telephone','tel'],['url','Website URL','url']]
    };
    const update = () => {
      const data = Object.fromEntries($$('[data-schema-field]', fields).map(input => [input.dataset.schemaField, input.value.trim()]));
      let result;
      if (type.value === 'Article') {
        result = {'@context':'https://schema.org','@type':'Article'};
        for (const key of ['headline','description','author','datePublished','url']) if (data[key]) result[key] = key === 'author' ? {'@type':'Person','name':data[key]} : data[key];
      }
      if (type.value === 'FAQPage') {
        const mainEntity = [];
        for (let n = 1; n <= 3; n++) if (data[`q${n}`] && data[`a${n}`]) mainEntity.push({'@type':'Question','name':data[`q${n}`],'acceptedAnswer':{'@type':'Answer','text':data[`a${n}`]}});
        result = {'@context':'https://schema.org','@type':'FAQPage',mainEntity};
      }
      if (type.value === 'Product') {
        result = {'@context':'https://schema.org','@type':'Product'};
        if (data.name) result.name = data.name;
        if (data.description) result.description = data.description;
        if (data.image) result.image = data.image;
        if (data.url) result.url = data.url;
        if (data.price) result.offers = {'@type':'Offer','price':data.price,'priceCurrency':data.currency || 'USD',...(data.availability ? {availability:data.availability} : {})};
      }
      if (type.value === 'LocalBusiness') {
        result = {'@context':'https://schema.org','@type':data.businessType || 'LocalBusiness'};
        if (data.name) result.name = data.name;
        if (data.url) result.url = data.url;
        if (data.telephone) result.telephone = data.telephone;
        const address = Object.fromEntries(['streetAddress','addressLocality','addressRegion','postalCode','addressCountry'].filter(key => data[key]).map(key => [key,data[key]]));
        if (Object.keys(address).length) result.address = {'@type':'PostalAddress',...address};
      }
      output.textContent = JSON.stringify(result, null, 2);
    };
    const render = () => {
      fields.innerHTML = definitions[type.value].map(([id,label,inputType]) => `<label for="schema-${id}">${label}</label>${inputType === 'textarea' ? `<textarea id="schema-${id}" data-schema-field="${id}" rows="2"></textarea>` : `<input id="schema-${id}" data-schema-field="${id}" type="${inputType}"${inputType === 'number' ? ' min="0" step="any"' : ''}>`}`).join('');
      $$('[data-schema-field]', fields).forEach(input => input.addEventListener('input', update));
      update();
    };
    type.addEventListener('change', render);
    render();
    $('[data-copy]', schemaTool).addEventListener('click', () => copy(output.textContent, schemaTool));
    $('[data-download]', schemaTool).addEventListener('click', () => download('schema-markup.jsonld', output.textContent, 'application/ld+json;charset=utf-8'));
  }

  const sitemapTool = $('[data-tool="sitemap"]');
  if (sitemapTool) {
    const input = $('#sitemap-urls', sitemapTool), lastmod = $('#include-lastmod', sitemapTool), output = $('[data-output]', sitemapTool);
    let invalid = [];
    const xmlEscape = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
    const update = () => {
      const lines = [...new Set(input.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean))];
      const valid = []; invalid = [];
      for (const line of lines) {
        try { const parsed = new URL(line); if (!['http:','https:'].includes(parsed.protocol)) throw new Error(); valid.push(parsed.href); }
        catch { invalid.push(line); }
      }
      $('[data-url-count]', sitemapTool).textContent = `${valid.length} valid URL${valid.length === 1 ? '' : 's'}`;
      const date = new Date().toISOString().slice(0,10);
      const entries = valid.map(url => `  <url>\n    <loc>${xmlEscape(url)}</loc>${lastmod.checked ? `\n    <lastmod>${date}</lastmod>` : ''}\n  </url>`).join('\n');
      output.textContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries ? `\n${entries}\n` : ''}</urlset>`;
      status(sitemapTool, invalid.length ? `${invalid.length} line${invalid.length === 1 ? '' : 's'} skipped: use absolute http:// or https:// URLs.` : '');
    };
    input.addEventListener('input', update); lastmod.addEventListener('change', update); update();
    $('[data-copy]', sitemapTool).addEventListener('click', () => copy(output.textContent, sitemapTool));
    $('[data-download]', sitemapTool).addEventListener('click', () => {
      if (!input.value.trim()) { status(sitemapTool, 'Add at least one URL first.'); return; }
      if (invalid.length) { status(sitemapTool, 'Fix or remove invalid URL lines before downloading.'); return; }
      download('sitemap.xml', output.textContent, 'application/xml;charset=utf-8');
      status(sitemapTool, 'Sitemap downloaded.');
    });
  }

  const headlineTool = $('[data-tool="headline"]');
  if (headlineTool) {
    const input = $('#headline-input', headlineTool); let report = '';
    const update = () => {
      const result = analyzeHeadline(input.value);
      $('[data-headline-count]', headlineTool).textContent = `${result.chars} / 180`;
      $('[data-score]', headlineTool).textContent = input.value.trim() ? result.score : '—';
      $('[data-score-disc]', headlineTool).style.borderColor = result.score >= 75 ? 'var(--teal)' : result.score >= 50 ? 'var(--primary)' : '#d6a24b';
      $('[data-score-title]', headlineTool).textContent = !input.value.trim() ? 'Add a headline to begin' : result.score >= 75 ? 'A promising draft' : result.score >= 50 ? 'A solid place to edit' : 'Room to sharpen the idea';
      $('[data-score-summary]', headlineTool).textContent = input.value.trim() ? `${result.count} words · ${result.chars} characters · ${result.vivid} vivid word${result.vivid === 1 ? '' : 's'} found.` : 'We’ll check length, word balance and vivid language.';
      $('[data-breakdown]', headlineTool).innerHTML = [['Length fit',result.lengthScore],['Word balance',result.balanceScore],['Vivid language',result.vividScore]].map(([name,score]) => `<div class="breakdown-row"><span>${name}</span><span>${input.value.trim() ? `${score} / 100` : '—'}</span></div>`).join('');
      $('[data-tips]', headlineTool).innerHTML = result.tips.map(tip => `<li>${escapeHTML(tip)}</li>`).join('');
      report = input.value.trim() ? `Headline analysis\n\nDraft: ${input.value.trim()}\nScore: ${result.score}/100\nLength fit: ${result.lengthScore}/100\nWord balance: ${result.balanceScore}/100\nVivid language: ${result.vividScore}/100\n\nIdeas to consider:\n- ${result.tips.join('\n- ')}\n\nRankNova score is an editorial cue, not a prediction of clicks.` : '';
    };
    input.addEventListener('input', update); update();
    $('[data-copy]', headlineTool).addEventListener('click', () => copy(report, headlineTool));
    $('[data-download]', headlineTool).addEventListener('click', () => {
      if (!report) { status(headlineTool, 'Add a headline first.'); return; }
      download('headline-analysis.txt', report);
      status(headlineTool, 'Analysis downloaded.');
    });
  }
})();
