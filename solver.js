


let currentLaw      = 'KCL';
let currentMethod   = 'standard';
let currentInputTab = 'text';
let uploadedFile     = null;
let uploadedFileData = null;


const EXAMPLES = {
  KCL: [
    'Node A: I1=3A in, I2=5A in, find I3',
    'R1=10Ω, R2=20Ω, Vs=12V — find node voltages',
    '3-node circuit, R1=5Ω R2=10Ω R3=15Ω Is=2A'
  ],
  KVL: [
    'Series loop: 12V, R1=4Ω, R2=8Ω — find I',
    '2-mesh: V1=10V V2=5V R1=2Ω R2=3Ω R3=4Ω',
    'Find voltage drop across R3=6Ω in 24V loop'
  ]
};


function setLaw(law) {
  currentLaw = law;

  
  document.getElementById('kcl-card').classList.toggle('active', law === 'KCL');
  document.getElementById('kvl-card').classList.toggle('active', law === 'KVL');

  
  document.getElementById('nav-kcl').classList.toggle('active', law === 'KCL');
  document.getElementById('nav-kvl').classList.toggle('active', law === 'KVL');

  
  document.getElementById('panel-title').textContent = law + ' Problem Input';

  
  const rb = document.getElementById('result-badge');
  rb.textContent = law;
  rb.className = 'result-badge' + (law === 'KVL' ? ' kvl' : '');

  updateExamples();
  updatePlaceholder();
}


function setMethod(method) {
  currentMethod = method;

  document.getElementById('m-standard').classList.toggle('active', method === 'standard');
  document.getElementById('m-matrix').classList.toggle('active', method === 'matrix');
  document.getElementById('result-method-tag').textContent =
    method === 'matrix' ? 'MATRIX METHOD' : 'STANDARD METHOD';
}


function setInputTab(tab) {
  currentInputTab = tab;

  document.getElementById('tab-text-btn').classList.toggle('active', tab === 'text');
  document.getElementById('tab-file-btn').classList.toggle('active', tab === 'file');

  document.getElementById('problem-input').style.display  = tab === 'text' ? 'block' : 'none';
  document.getElementById('examples-row').style.display   = tab === 'text' ? 'flex'  : 'none';
  document.getElementById('upload-zone').classList.toggle('visible', tab === 'file');
}


function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFile = file;
  document.getElementById('file-name').textContent = '✓ ' + file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    
    uploadedFileData = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
}


function updateExamples() {
  const row = document.getElementById('examples-row');

  
  row.querySelectorAll('.example-chip').forEach(c => c.remove());

  
  EXAMPLES[currentLaw].forEach(example => {
    const chip = document.createElement('span');
    chip.className   = 'example-chip';
    chip.textContent = example;
    chip.onclick     = () => {
      document.getElementById('problem-input').value = example;
    };
    row.appendChild(chip);
  });
}


function updatePlaceholder() {
  const textarea = document.getElementById('problem-input');
  if (currentLaw === 'KCL') {
    textarea.placeholder =
      'Describe your KCL circuit problem...\n\n' +
      'Example: Node A has 3 branches. I1 = 4A entering, I2 = 7A entering. Find I3 leaving the node.\n\n' +
      'Or paste a full multi-node circuit with resistor values and source currents.';
  } else {
    textarea.placeholder =
      'Describe your KVL circuit problem...\n\n' +
      'Example: A series circuit with 12V source, R1=4Ω, R2=8Ω. Find the current and voltage drops.\n\n' +
      'Or describe a two-mesh circuit with voltage sources and resistors.';
  }
}


async function solve() {
  const btn         = document.getElementById('solve-btn');
  const resultPanel = document.getElementById('result-panel');
  const resultText  = document.getElementById('result-text');

  
  let problemText = '';

  if (currentInputTab === 'text') {
    problemText = document.getElementById('problem-input').value.trim();
    if (!problemText) {
      resultText.textContent = 'ERROR: Please enter a circuit problem before solving.';
      resultPanel.classList.add('show');
      return;
    }
  } else {
    if (!uploadedFile) {
      resultText.textContent = 'ERROR: Please upload a circuit image or PDF file.';
      resultPanel.classList.add('show');
      return;
    }
  }

  
  btn.disabled    = true;
  btn.textContent = '⚡ ANALYZING...';
  resultPanel.classList.remove('show');

  try {
    
    const answer = await callSolvingEngine(
      currentLaw,
      currentMethod,
      currentInputTab,
      problemText,
      uploadedFile,
      uploadedFileData
    );

    
    resultText.textContent = answer;
    resultPanel.classList.add('show');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    resultText.textContent = 'SYSTEM ERROR: ' + err.message;
    resultPanel.classList.add('show');
  }

  
  btn.disabled    = false;
  btn.textContent = '⚡ SOLVE';
}


(function init() {
  updateExamples();
  updatePlaceholder();
  document.getElementById('problem-input').style.display = 'block';
})();
