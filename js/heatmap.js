fetch('https://github-contributions-api.jogruber.de/v4/devmatei?y=last')
  .then(r => r.json())
  .then(({ contributions }) => {
    const grid = document.getElementById('heatmap-grid');
    const first = new Date(contributions[0].date + 'T00:00').getDay();
    grid.append(...Array.from({ length: first }, () => document.createElement('div')));
    for (const { date, count, level } of contributions) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.dataset.level = level;
      cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${date}`;
      grid.append(cell);
    }
    const total = contributions.reduce((s, c) => s + c.count, 0);
    document.getElementById('heatmap-total').textContent = `${total.toLocaleString()} contributions in the last year`;
  })
  .catch(() => document.getElementById('heatmap').remove());