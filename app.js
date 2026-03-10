const HISTORY_KEY = "recruiter-workbench-history-v1";
const JOBS_KEY = "recruiter-workbench-jobs-v1";

const fields = {
  notes: document.getElementById("candidateNotes"),
  resume: document.getElementById("resume"),
  company: document.getElementById("company"),
  role: document.getElementById("role"),
  comp: document.getElementById("comp"),
  workModel: document.getElementById("workModel"),
};

const jobsEls = {
  jobCompanyInput: document.getElementById("jobCompanyInput"),
  jobTitleInput: document.getElementById("jobTitleInput"),
  addJobBtn: document.getElementById("addJobBtn"),
  jobsList: document.getElementById("jobsList"),
  jobEditorTitle: document.getElementById("jobEditorTitle"),
  jobDescription: document.getElementById("jobDescription"),
  jobNotes: document.getElementById("jobNotes"),
  saveJobDetailsBtn: document.getElementById("saveJobDetailsBtn"),
  deleteJobBtn: document.getElementById("deleteJobBtn"),
  jobStatus: document.getElementById("jobStatus"),
};

let selectedJobId = null;

const statusEl = document.getElementById("status");
const sellList = document.getElementById("sellList");
const clientEmail = document.getElementById("clientEmail");
const candidateFollowup = document.getElementById("candidateFollowup");
const prepList = document.getElementById("prepList");
const historyList = document.getElementById("historyList");

const SAMPLE_INPUT = {
  notes: `First engineer at Akkio
Rebuilt most backend
Meetings 80-90% now
Wants to build again
Prefers early stage
Golang 15 years
Comp 240k`,
  resume: "Led API platform migration and improved reliability.",
  company: "Amperos",
  role: "Senior Backend Engineer",
  comp: "$240K base",
  workModel: "Remote or Hybrid NYC",
};

function noteLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function toBullets(lines, max = 5) {
  return lines.slice(0, max).map((line) => line.charAt(0).toUpperCase() + line.slice(1));
}

function generateOutput(input) {
  const lines = noteLines(input.notes);
  const resumeLines = noteLines(input.resume);
  const mainBullets = toBullets([...lines, ...resumeLines], 5);

  if (input.comp) mainBullets.push(`Current/target compensation around ${input.comp}.`);
  if (input.workModel) mainBullets.push(`Open to ${input.workModel} work model.`);

  const trimmedBullets = mainBullets.slice(0, 6);

  const subject = `Strong ${input.role || "technical"} candidate${input.company ? ` for ${input.company}` : ""}`;
  const body = [
    "Hey [Name],",
    "",
    `Just spoke with a strong ${input.role || "engineering"} candidate I think could be interesting${input.company ? ` for ${input.company}` : ""}.`,
    "",
    ...trimmedBullets.map((bullet) => `• ${bullet}`),
    "",
    "They are just starting their search, so timing is good if you'd like to meet early.",
    "",
    "Happy to intro if helpful.",
  ].join("\n");

  const followup = [
    "Hey [Candidate Name],",
    "",
    "Quick update — I shared your profile with a couple of teams today and should have feedback soon.",
    input.company ? `One of those teams is ${input.company}.` : "",
    "",
    "Separately, wanted to check if you had availability this week for a quick intro with one of the founders.",
    "",
    "Let me know what your schedule looks like.",
  ]
    .filter(Boolean)
    .join("\n");

  const prep = [
    input.company ? `Review ${input.company}'s product and latest funding/news.` : "Review company product and latest funding/news.",
    input.role ? `Prepare 2 stories showing impact relevant to ${input.role}.` : "Prepare 2 impact stories tied to the role.",
    "Be ready to explain recent architecture decisions and tradeoffs.",
    "Prepare compensation and start-date expectations.",
  ];

  return {
    sell_bullets: trimmedBullets,
    client_email_subjects: [subject],
    client_email_body: body,
    candidate_followup: followup,
    prep_notes: prep,
  };
}

function renderBullets(el, bullets) {
  el.innerHTML = "";
  if (!bullets.length) {
    el.innerHTML = '<li class="placeholder">No output generated.</li>';
    return;
  }
  bullets.forEach((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    el.appendChild(li);
  });
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

function applyEntry(entry) {
  fields.notes.value = entry.input.notes;
  fields.resume.value = entry.input.resume;
  fields.company.value = entry.input.company;
  fields.role.value = entry.input.role;
  fields.comp.value = entry.input.comp;
  fields.workModel.value = entry.input.workModel;
  renderOutput(entry.output);
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";
  if (!history.length) {
    historyList.innerHTML = "<li>No history yet.</li>";
    return;
  }

  history.forEach((entry) => {
    const li = document.createElement("li");
    const ts = new Date(entry.createdAt).toLocaleString();
    li.textContent = `${entry.input.role || "Role not set"} at ${entry.input.company || "Company not set"} (${ts})`;

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => applyEntry(entry));
    li.appendChild(loadBtn);

    historyList.appendChild(li);
  });
}

function renderOutput(output) {
  renderBullets(sellList, output.sell_bullets);
  renderBullets(prepList, output.prep_notes || []);

  const firstSubject = output.client_email_subjects?.[0] || "Client candidate intro";
  clientEmail.textContent = `Subject: ${firstSubject}\n\n${output.client_email_body}`;
  candidateFollowup.textContent = output.candidate_followup;
}

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(JOBS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function clearJobEditor() {
  jobsEls.jobEditorTitle.textContent = "Select a job";
  jobsEls.jobDescription.value = "";
  jobsEls.jobNotes.value = "";
  selectedJobId = null;
}

function selectJob(jobId) {
  const jobs = loadJobs();
  const job = jobs.find((item) => item.id === jobId);
  if (!job) {
    clearJobEditor();
    return;
  }

  selectedJobId = job.id;
  jobsEls.jobEditorTitle.textContent = `${job.title} @ ${job.company}`;
  jobsEls.jobDescription.value = job.description || "";
  jobsEls.jobNotes.value = job.notes || "";
  fields.company.value = job.company;
  fields.role.value = job.title;
  renderJobs();
}

function renderJobs() {
  const jobs = loadJobs();
  jobsEls.jobsList.innerHTML = "";

  if (!jobs.length) {
    jobsEls.jobsList.innerHTML = '<li class="placeholder">No jobs added yet.</li>';
    return;
  }

  jobs.forEach((job) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = `job-item ${job.id === selectedJobId ? "active" : ""}`;
    button.textContent = `${job.title} @ ${job.company}`;
    button.addEventListener("click", () => selectJob(job.id));
    li.appendChild(button);
    jobsEls.jobsList.appendChild(li);
  });
}

jobsEls.addJobBtn.addEventListener("click", () => {
  const company = jobsEls.jobCompanyInput.value.trim();
  const title = jobsEls.jobTitleInput.value.trim();

  if (!company || !title) {
    jobsEls.jobStatus.textContent = "Enter both company and job title.";
    return;
  }

  const jobs = loadJobs();
  const newJob = {
    id: crypto.randomUUID(),
    company,
    title,
    description: "",
    notes: "",
    createdAt: new Date().toISOString(),
  };

  jobs.unshift(newJob);
  saveJobs(jobs);
  jobsEls.jobCompanyInput.value = "";
  jobsEls.jobTitleInput.value = "";
  jobsEls.jobStatus.textContent = "Job added. Click it to add details.";
  selectJob(newJob.id);
});

jobsEls.saveJobDetailsBtn.addEventListener("click", () => {
  if (!selectedJobId) {
    jobsEls.jobStatus.textContent = "Select a job first.";
    return;
  }

  const jobs = loadJobs();
  const idx = jobs.findIndex((item) => item.id === selectedJobId);
  if (idx === -1) {
    jobsEls.jobStatus.textContent = "Job not found.";
    return;
  }

  jobs[idx].description = jobsEls.jobDescription.value.trim();
  jobs[idx].notes = jobsEls.jobNotes.value.trim();
  saveJobs(jobs);
  jobsEls.jobStatus.textContent = "Job description and notes saved.";
});

jobsEls.deleteJobBtn.addEventListener("click", () => {
  if (!selectedJobId) {
    jobsEls.jobStatus.textContent = "Select a job first.";
    return;
  }

  const jobs = loadJobs().filter((item) => item.id !== selectedJobId);
  saveJobs(jobs);
  clearJobEditor();
  renderJobs();
  jobsEls.jobStatus.textContent = "Job deleted.";
});

document.getElementById("generateBtn").addEventListener("click", () => {
  const input = {
    notes: fields.notes.value.trim(),
    resume: fields.resume.value.trim(),
    company: fields.company.value.trim(),
    role: fields.role.value.trim(),
    comp: fields.comp.value.trim(),
    workModel: fields.workModel.value.trim(),
  };

  if (!input.notes) {
    statusEl.textContent = "Candidate notes are required.";
    return;
  }

  const output = generateOutput(input);
  renderOutput(output);
  saveHistory({ input, output, createdAt: new Date().toISOString() });
  statusEl.textContent = "Generated and saved to local history.";
});

document.getElementById("sampleBtn").addEventListener("click", () => {
  fields.notes.value = SAMPLE_INPUT.notes;
  fields.resume.value = SAMPLE_INPUT.resume;
  fields.company.value = SAMPLE_INPUT.company;
  fields.role.value = SAMPLE_INPUT.role;
  fields.comp.value = SAMPLE_INPUT.comp;
  fields.workModel.value = SAMPLE_INPUT.workModel;
  statusEl.textContent = "Sample data loaded. Click Generate.";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  fields.notes.value = "";
  fields.resume.value = "";
  fields.company.value = "";
  fields.role.value = "";
  fields.comp.value = "";
  fields.workModel.value = "";
  statusEl.textContent = "Form reset.";
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.getAttribute("data-target");
    const target = document.getElementById(targetId);
    const text = targetId.includes("List")
      ? Array.from(target.querySelectorAll("li"))
          .map((li) => `• ${li.textContent}`)
          .join("\n")
      : target.textContent;

    await navigator.clipboard.writeText(text);
    const previous = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = previous;
    }, 1200);
  });
});

document.getElementById("clearHistory").addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

renderJobs();
renderHistory();
