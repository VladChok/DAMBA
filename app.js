import { calculateBudget, readState } from './model.js';

const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const money = value => `$${number.format(value)} млрд`;
let state = readState(location.search);
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = motionPreference.matches;
let flowVisible = false;

const timeline = {
  1957: ['1957', 'Идея, а не стройка.', 'Борисов предлагает климатическую дамбу с насосами. Датировка приведена по исторической подборке InterBering; первичная регистрационная запись не проверена.', '#source-borisov', 'История замысла [1] ↗'],
  1972: ['1972', 'Опыт договариваться.', 'ОСВ: соперничество совместимо с переговорами.', '#source-detente', 'Office of the Historian [2] ↗'],
  1989: ['ДЕКАБРЬ 1989', 'Встреча на Мальте.', 'Буш и Горбачёв: диалог об изменениях в Европе.', '#source-collapse', 'Исторический контекст [5] ↗'],
  1990: ['01.06.1990', 'Договориться стало возможно.', 'Морская граница. Международный парк. Решения о переходе нет.', '#source-1990', 'Документы саммита [3, 4] ↗'],
  1991: ['1991', 'Меняется само государство.', 'Распад СССР. Согласованной стройки не было.', '#source-collapse', 'История распада СССР [5] ↗']
};
const reality = {
  title: 'Сотрудничество без перехода.',
  copy: 'Диалог продолжился. Переход остался предложением.',
  events: [
    ['1990', 'Начало диалога', 'Морская граница и инициатива международного парка.', '#source-1990', '[3, 4]'],
    ['1991', 'Распад СССР', 'Государство прекратило существование.', '#source-collapse', '[5]'],
    ['2012', 'Россия вступает в ВТО', 'Интеграция без перехода.', '#source-wto', '[6]'],
    ['2026 · ТОЧКА СРАВНЕНИЯ', 'Связь остаётся идеей', 'Предложение, не действующий коридор.', '#source-crossing', '[7]']
  ]
};
const alternative = {
  title: 'Сначала — договориться об исследовании.',
  copy: 'Вымышленное соглашение 1990 года. Дальнейшие этапы — только при выполнении условий.',
  events: [
    ['1990 · РАЗВИЛКА', 'Совместные изыскания', 'Спрос. Геология. Экологическая оценка.'],
    ['УСЛОВИЕ 01', 'Капитал и институты', 'Консорциум — при гарантиях и защите контрактов.'],
    ['УСЛОВИЕ 02', 'Связанный Дальний Восток', 'Подходы + энергия + участие жителей.'],
    ['2026 · ГОРИЗОНТ ГИПОТЕЗЫ', 'Другая интеграция?', 'Общий коридор — если риски преодолены.']
  ]
};

function saveState() {
  // A standalone export works from disk; URL sharing is meaningful on HTTP(S).
  if (!['http:', 'https:'].includes(location.protocol)) return;
  const url = new URL(location.href);
  for (const [key, fallback] of [['cost', 120], ['share', 60], ['years', 15]]) {
    if (state[key] === fallback) url.searchParams.delete(key);
    else url.searchParams.set(key, state[key]);
  }
  if (state.alternative) url.searchParams.set('future', 'alternative');
  else url.searchParams.delete('future');
  history.replaceState(null, '', url);
}

function renderBudget() {
  const result = calculateBudget(state.cost, state.share, state.years);
  for (const id of ['cost', 'share', 'years']) $(id).value = state[id];
  $('cost-text').textContent = money(state.cost);
  $('share-text').textContent = `${state.share}%`;
  $('years-text').textContent = `${state.years} ${state.years === 21 ? 'год' : state.years >= 22 && state.years <= 24 ? 'года' : 'лет'}`;
  $('total-number').textContent = state.cost;
  for (const id of ['foreign', 'domestic', 'annual']) $(id).textContent = money(result[id]);
  const names = ['СССР', 'США', 'Япония', 'Европа'];
  result.partners.forEach((value, index) => {
    const percentage = value / state.cost * 100;
    $(`partner-svg-${index}`).textContent = `${money(value)} · ${number.format(percentage)}%`;
    $(`partner-amount-${index}`).textContent = `${money(value)} · ${number.format(percentage)}%`;
    $(`flow-${index}`).setAttribute('stroke-width', percentage);
    document.querySelector(`[data-flow-pulse="${index}"]`).style.visibility = value === 0 ? 'hidden' : 'visible';
  });
  $('capital-desc').textContent = names.map((name, index) => `${name}: ${money(result.partners[index])}`).join('; ') + '. Ширина потока соответствует доле; движение обозначает направление финансирования.';
  const x = 40 + 325 * state.years / 30;
  const totalY = 230 - 200 * state.cost / 300;
  const foreignY = 230 - 200 * result.foreign / 300;
  $('funding-total-line').setAttribute('d', `M40 230L${x} ${totalY}`);
  $('funding-foreign-line').setAttribute('d', `M40 230L${x} ${foreignY}`);
  $('funding-area').setAttribute('d', `M40 230L${x} ${foreignY}L${x} 230Z`);
  $('funding-end').setAttribute('cx', x);
  $('funding-end').setAttribute('cy', totalY);
  $('funding-total').textContent = money(state.cost);
  $('funding-foreign').textContent = money(result.foreign);
  $('funding-desc').textContent = `Равномерные взносы за ${state.years} лет: всего ${money(state.cost)}, из них иностранных ${money(result.foreign)}. Оси фиксированы: 0–30 лет и 0–300 миллиардов долларов. Это модель, не прогноз стройки.`;
  document.querySelectorAll('.budget-row strong').forEach((el, index) => { el.textContent = money(result.categories[index]); });
}

function renderScenario() {
  const content = state.alternative ? alternative : reality;
  $('futures').dataset.scenario = state.alternative ? 'alternative' : 'reality';
  $('real').setAttribute('aria-pressed', String(!state.alternative));
  $('alt').setAttribute('aria-pressed', String(state.alternative));
  $('scenario-label').textContent = state.alternative ? 'HYPOTHESIS / АЛЬТЕРНАТИВНАЯ ИСТОРИЯ' : 'FACT / РЕАЛЬНАЯ ИСТОРИЯ';
  $('scenario-label').className = `evidence ${state.alternative ? 'hypothesis' : 'fact'}`;
  $('scenario-title').textContent = content.title;
  $('scenario-copy').textContent = content.copy;
  $('future-events').replaceChildren(...content.events.map(([date, title, copy, source, reference]) => {
    const article = document.createElement('article');
    const year = document.createElement('span'); year.className = 'event-year mono'; year.textContent = date;
    const heading = document.createElement('h4'); heading.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = copy;
    if (source) { const link = document.createElement('a'); link.href = source; link.textContent = reference; paragraph.append(' ', link); }
    article.append(year, heading, paragraph);
    return article;
  }));
}

function renderTimeline(year) {
  const [date, title, copy, href, reference] = timeline[year];
  document.querySelectorAll('[data-year]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.year === year)));
  $('timeline-date').textContent = date;
  $('timeline-title').textContent = title;
  $('timeline-copy').textContent = copy;
  $('timeline-source').href = href;
  $('timeline-source').textContent = reference;
}

function updateMotion() {
  $('money').classList.toggle('flow-paused', motionPaused || !flowVisible);
  const paused = motionPaused || motionPreference.matches;
  $('motion-toggle').setAttribute('aria-pressed', String(!paused));
  $('motion-toggle').textContent = motionPreference.matches ? 'Движение отключено системой' : paused ? 'Включить потоки →' : 'Приостановить потоки Ⅱ';
  $('motion-toggle').disabled = motionPreference.matches;
}

for (const id of ['cost', 'share', 'years']) $(id).addEventListener('input', event => {
  state[id] = Number(event.currentTarget.value);
  renderBudget();
  saveState();
});
$('reset-model').addEventListener('click', () => {
  state = { ...state, cost: 120, share: 60, years: 15 };
  renderBudget(); saveState();
});
for (const [id, value] of [['real', false], ['alt', true]]) $(id).addEventListener('click', () => {
  state.alternative = value; renderScenario(); saveState();
});
document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => renderTimeline(button.dataset.year)));

// Native buttons retain ordinary Tab/Enter/Space behavior. Arrow keys are an extra convenience.
for (const group of document.querySelectorAll('.timeline-control, .scenario-switch')) {
  group.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...group.querySelectorAll('button')];
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[index].focus(); buttons[index].click();
  });
}
$('motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
motionPreference.addEventListener('change', () => { motionPaused = motionPreference.matches; updateMotion(); });

const chapterLinks = [...document.querySelectorAll('.chapter-links a')];
const chapters = [...document.querySelectorAll('main > section')];
let framePending = false;
function updateReading() {
  const available = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.transform = `scaleX(${available > 0 ? Math.max(0, Math.min(1, scrollY / available)) : 0})`;
  let active = null;
  for (const chapter of chapters) { if (chapter.getBoundingClientRect().top < innerHeight * .45) active = chapter.id; }
  chapterLinks.forEach(link => {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(updateReading); }
}, { passive: true });
window.addEventListener('resize', updateReading);

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); }
  }), { threshold: .05 });
  document.querySelectorAll('.chapter').forEach(chapter => reveal.observe(chapter));
  new IntersectionObserver(entries => { flowVisible = entries[0].isIntersecting; updateMotion(); }).observe(document.querySelector('.capital-flow'));
} else { flowVisible = true; }

// Citation targets inside a collapsed source disclosure must still be reachable.
function openCitation() {
  if (location.hash === '#model-method') $('model-method').open = true;
  if (location.hash.startsWith('#source')) document.querySelector('.sources').open = true;
}
document.addEventListener('click', event => {
  if (event.target.closest('a[href="#model-method"]')) $('model-method').open = true;
  const link = event.target.closest('a[href^="#source"]');
  if (link) document.querySelector('.sources').open = true;
});
window.addEventListener('hashchange', openCitation);
window.addEventListener('popstate', () => { state = readState(location.search); renderBudget(); renderScenario(); openCitation(); });
renderBudget(); renderScenario(); updateMotion(); openCitation(); updateReading();
document.documentElement.classList.add('js');
