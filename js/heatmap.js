const mq = window.matchMedia('(max-width: 600px)');
let data = [];

function render() {
  const grid = document.getElementById('heatmap-grid');
  const shown = mq.matches ? data.slice(-26 * 7) : data;
  grid.replaceChildren();

  const first = new Date(shown[0].date + 'T00:00').getDay();
  grid.append(...Array.from({ length: first }, () => document.createElement('div')));

  for (const { date, count, level } of shown) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.dataset.level = level;
    cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${date}`;
    grid.append(cell);
  }

  const total = shown.reduce((s, c) => s + c.count, 0);
  document.getElementById('heatmap-total').textContent =
    `${total.toLocaleString()} contributions in the last ${mq.matches ? '6 months' : 'year'}`;
}

fetch('https://github-contributions-api.jogruber.de/v4/devmatei?y=last')
  .then(r => r.json())
  .then(({ contributions }) => {
    data = contributions;
    render();
    mq.addEventListener('change', render);
  })
  .catch(() => document.getElementById('heatmap').remove());