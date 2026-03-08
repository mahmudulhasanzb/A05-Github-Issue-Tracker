const issueCardContainer = document.getElementById('issues-grid');
const loadingSpinner = document.getElementById('loadingSpinner');
const allButtons = document.querySelectorAll('#filterBtnContainer button');
const issueCountEl = document.getElementById('issue-count');
const searchInput = document.getElementById('search-input');
const logoutBtn = document.getElementById('logout-btn');

// show loading function
function showLoading() {
  loadingSpinner.classList.remove('hidden')
  issueCardContainer.innerHTML = "";
}

// hide loading function
function hideLoading() {
  loadingSpinner.classList.add('hidden')
}

// togglestyle fucntion
function selectedBtn(clickedBtn) {
  allButtons.forEach(btn => {
    btn.classList.remove('bg-[#4f2ee8]', 'text-white', 'hover:bg-[#3a1eb8]');
    btn.classList.add('bg-white', 'text-slate-500');
  });

  clickedBtn.classList.add('bg-[#4f2ee8]', 'text-white', 'hover:bg-[#3a1eb8]');
  clickedBtn.classList.remove('bg-white', 'text-slate-500');
}

// create card function
function createCard(issue) {
  const borderColor = issue.status === 'open' ? 'border-green-500' : 'border-purple-500';
  const statusImg = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

  // priority badge color
  let priorityBg = 'bg-red-200';
  let priorityText = 'text-red-500';
  if (issue.priority === 'medium') {
    priorityBg = 'bg-yellow-200';
    priorityText = 'text-yellow-600';
  } else if (issue.priority === 'low') {
    priorityBg = 'bg-gray-200';
    priorityText = 'text-gray-600';
  }

  // labels html
  let labelsHtml = '';
  if (issue.labels && issue.labels.length > 0) {
    if (issue.labels[0]) {
      labelsHtml += `<p class="p-1 px-4 rounded-xl bg-red-200 text-red-500 text-center font-semibold"><i class="fa-solid fa-bug"></i> ${issue.labels[0]}</p>`;
    }
    if (issue.labels[1]) {
      labelsHtml += `<p class="p-1 px-4 rounded-xl bg-yellow-200 text-yellow-600 text-center font-semibold"><i class="fa-regular fa-life-ring"></i> ${issue.labels[1]}</p>`;
    }
  }

  const cardDiv = document.createElement('div');
  cardDiv.innerHTML = `
                    <div
                    class="card bg-base-100 shadow-sm rounded-lg border-t-4 ${borderColor} flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md issue-card">
                    <div class="card-body">
                        <div class="flex justify-between">
                            <div>
                                <img src="${statusImg}" alt="">
                            </div>
                            <div>
                                <p class="p-1 px-5 rounded-xl ${priorityBg} ${priorityText} font-semibold">${issue.priority}</p>
                            </div>
                        </div>

                        <h2 onclick="loadSingleIssue(${issue.id})"
                            class="text-base font-semibold mb-2 cursor-pointer text-slate-900 transition-colors hover:text-[#4f2ee8] hover:underline card-title">${issue.title}</h2>
                        <p class="text-[13px] text-slate-500">${issue.description}</p>

                        <div class="flex justify-between gap-2">
                            ${labelsHtml}
                        </div>

                    </div>

                    <div class="divider mt-0 mb-0"></div>

                    <div class="card-body py-2">
                        <p class="text-[12px] text-slate-400">#${issue.author}</p>
                        <p class="text-[12px] text-slate-400">${issue.createdAt}
                        <p>
                    </div>

                </div>
    `;
  issueCardContainer.appendChild(cardDiv);
}

// display issues function
function displayIssues(issues) {
  issueCardContainer.innerHTML = '';
  issueCountEl.innerText = issues.length;

  issues.forEach(issue => {
    createCard(issue);
  });
}

// load all issues function
async function loadAllIssues() {
  showLoading();

  const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues'
  );
  const dataVar = await res.json();
  hideLoading();

  displayIssues(dataVar.data);
}

// load issues by status (open / closed)
async function loadIssuesByStatus(status) {
  showLoading();

  const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
  const dataVar = await res.json();
  hideLoading();

  const filtered = dataVar.data.filter(issue => issue.status === status);
  displayIssues(filtered);
}

// load single issue and show modal
async function loadSingleIssue(id) {
  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const dataVar = await res.json();
    const issue = dataVar.data;

    // set modal content
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-author').innerText = issue.author;
    document.getElementById('modal-date').innerText = issue.createdAt;
    document.getElementById('modal-description').innerText = issue.description;
    document.getElementById('modal-assignee').innerText = issue.assignee || 'Unassigned';

    // status badge
    const modalStatus = document.getElementById('modal-status');
    modalStatus.innerText = issue.status;
    if (issue.status === 'open') {
      modalStatus.className = 'px-3 py-1 rounded-full text-xs font-semibold capitalize bg-green-600 text-white';
    } else {
      modalStatus.className = 'px-3 py-1 rounded-full text-xs font-semibold capitalize bg-purple-100 text-purple-700';
    }

    // priority badge
    const modalPriority = document.getElementById('modal-priority');
    modalPriority.innerText = issue.priority;
    if (issue.priority === 'high') {
      modalPriority.className = 'inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-600 text-white';
    } else if (issue.priority === 'medium') {
      modalPriority.className = 'inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-yellow-200 text-yellow-600';
    } else {
      modalPriority.className = 'inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-green-200 text-green-600';
    }

    // labels - same style as cards
    const modalLabels = document.getElementById('modal-labels');
    modalLabels.innerHTML = '';
    if (issue.labels && issue.labels.length > 0) {
      if (issue.labels[0]) {
        modalLabels.innerHTML += `<p class="p-1 px-4 rounded-xl bg-red-200 text-red-500 text-center font-semibold"><i class="fa-solid fa-bug"></i> ${issue.labels[0]}</p>`;
      }
      if (issue.labels[1]) {
        modalLabels.innerHTML += `<p class="p-1 px-4 rounded-xl bg-yellow-200 text-yellow-600 text-center font-semibold"><i class="fa-regular fa-life-ring"></i> ${issue.labels[1]}</p>`;
      }
    }

    // show modal
    document.getElementById('my_modal_1').showModal();
  } catch (error) {
    console.log('Error loading issue:', error);
  }
}

// search issues function
async function searchIssues(searchText) {
  if (searchText === '') {
    loadAllIssues();
    return;
  }

  showLoading();

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
  const dataVar = await res.json();
  hideLoading();

  displayIssues(dataVar.data);
}

// tab button click events
allButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedBtn(btn);

    const filter = btn.dataset.filter || btn.innerText.toLowerCase();

    if (filter === 'all') {
      loadAllIssues();
    } else if (filter === 'open') {
      loadIssuesByStatus('open');
    } else {
      loadIssuesByStatus('closed');
    }
  });
});

// search input event - 1
// searchInput.addEventListener('keyup', (e) => {
//   // if (e.key === 'Enter') {
//     searchIssues(searchInput.value.trim());
//   // }
// });

// search input event - 2
document.getElementById('search-btn').addEventListener('click', function () {
  searchIssues(searchInput.value.trim())
})

// logout button event
logoutBtn.addEventListener('click', () => {
  window.location.replace('login.html');
});

// load all issues on page load
loadAllIssues();
