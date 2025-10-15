const BACKEND = (typeof BACKEND_URL !== 'undefined') ? BACKEND_URL : '';

async function loadSubmissions() {
  try {
    const res = await fetch((BACKEND ? BACKEND : '') + '/api/submissions');
    const submissions = await res.json();
    const grid = document.getElementById('submissions-grid');
    grid.innerHTML = '';
    (submissions || []).forEach(sub => {
      const card = document.createElement('div');
      card.className = 'submission-card';
      const imgUrl = (BACKEND ? BACKEND : '') + sub.url;
      card.innerHTML = `
        <div class="image-container">
          <img src="${imgUrl}" alt="${sub.filename}">
        </div>
        <div class="submission-details">
          <div class="submitter-name">Submitter: ${sub.nickname}</div>
          <ul class="file-details-list">
            <li class="detail-item"><span class="detail-label">File:</span><span class="detail-value">${sub.filename}</span></li>
            <li class="detail-item"><span class="detail-label">Time:</span><span class="detail-value">${sub.time}</span></li>
          </ul>
          <button class="delete-btn" data-filename="${sub.filename}">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const filename = btn.getAttribute('data-filename');
        try {
          const res = await fetch((BACKEND ? BACKEND : '') + `/api/delete?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.status === 'success') loadSubmissions();
        } catch (err) { console.error(err); }
      });
    });
  } catch (err) { console.error(err); }
}
loadSubmissions();
setInterval(loadSubmissions, 5000);