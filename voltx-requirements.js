/**
 * ============================================================
 *  VOLTX — Circuit Equation Solver
 *  Project Requirements & Configuration File
 *  Version: 1.0.0
 * ============================================================
 *
 *  VOLTX is an AI-powered web application for solving electrical
 *  circuit problems using Kirchhoff's Current Law (KCL) and
 *  Kirchhoff's Voltage Law (KVL), with both Standard algebraic
 *  and Matrix-based (Nodal/Mesh Analysis) solving methods.
 *
 * ============================================================
 */





const VOLTX_META = {
  name: "VOLTX",
  version: "1.0.0",
  description:
    "AI-powered Kirchhoff's Law (KCL & KVL) circuit equation solver " +
    "with Standard and Matrix solving methods.",
  author: "VOLTX Team",
  license: "MIT",
  type: "Single-page Web Application (HTML/CSS/JS)",
  entryPoint: "voltx.html",
};






const VOLTX_FEATURES = {

  /**
   * LAW SELECTOR
   * User must be able to toggle between two electrical laws.
   * Each law has its own formula, description, and solving logic.
   */
  lawSelector: {
    required: true,
    options: ["KCL", "KVL"],
    defaultLaw: "KCL",
    KCL: {
      fullName: "Kirchhoff's Current Law",
      principle: "The algebraic sum of all currents entering and leaving a node equals zero.",
      formula: "ΣI_in = ΣI_out   →   ΣI = 0",
      usedFor: "Finding unknown branch currents at circuit nodes",
    },
    KVL: {
      fullName: "Kirchhoff's Voltage Law",
      principle: "The algebraic sum of all voltages around any closed loop equals zero.",
      formula: "ΣV = 0",
      usedFor: "Finding unknown voltages and currents in mesh/loop circuits",
    },
  },

  /**
   * SOLVING METHOD SELECTOR
   * User must be able to choose between Standard algebraic
   * solving and Matrix-based solving.
   */
  methodSelector: {
    required: true,
    options: ["standard", "matrix"],
    defaultMethod: "standard",

    standard: {
      label: "Standard Method",
      description: "Algebraic equation-based solving. " +
        "For KCL: write ΣI=0 at each node and solve the system. " +
        "For KVL: write ΣV=0 around each mesh/loop and solve.",
      outputExpectation: [
        "Clearly identified nodes or loops",
        "One equation per node/loop",
        "Step-by-step algebraic solution",
        "Final current/voltage values with units",
        "Verification using original law",
      ],
    },

    matrix: {
      label: "Matrix / Nodal-Mesh Method",
      description: "Matrix-based linear algebra solving. " +
        "For KCL: Nodal Analysis — builds conductance matrix [G][V]=[I]. " +
        "For KVL: Mesh Analysis — builds impedance matrix [Z][I]=[V]. " +
        "Solved by Gaussian elimination, Cramer's Rule, or matrix inversion.",

      KCL_matrix: {
        method: "Nodal Analysis",
        matrixEquation: "[G][V] = [I]",
        steps: [
          "Identify all nodes; select reference (ground) node",
          "Write KCL at each non-reference node",
          "Express currents in terms of node voltages using Ohm's Law",
          "Assemble conductance matrix [G] (n-1 × n-1)",
          "Assemble current source vector [I]",
          "Solve [V] = [G]^(-1) × [I] via matrix inversion or Gaussian elimination",
          "Calculate branch currents from node voltages",
        ],
        conductanceMatrix: {
          diagonal: "Sum of all conductances connected to node i",
          offDiagonal: "Negative conductance between node i and node j",
        },
      },

      KVL_matrix: {
        method: "Mesh Analysis",
        matrixEquation: "[Z][I] = [V]",
        steps: [
          "Identify all independent meshes",
          "Assign mesh current variables (I1, I2, ... In)",
          "Write KVL for each mesh",
          "Express voltages using Ohm's Law and mesh currents",
          "Assemble impedance/resistance matrix [Z] (n × n)",
          "Assemble voltage source vector [V]",
          "Solve [I] = [Z]^(-1) × [V] via Cramer's Rule or matrix inversion",
          "Calculate element voltages from mesh currents",
        ],
        impedanceMatrix: {
          diagonal: "Sum of all impedances in mesh i",
          offDiagonal: "Negative of shared impedance between mesh i and mesh j",
        },
      },
    },
  },

  /**
   * INPUT MODES
   * User can submit circuit problems in multiple formats.
   */
  inputModes: {
    required: true,
    modes: ["text", "file"],
    defaultMode: "text",

    text: {
      label: "Text Input",
      description: "User types or pastes circuit problem as plain text.",
      maxLength: 5000,
      placeholder: {
        KCL: "Describe your KCL problem. E.g: Node A has 3 branches. I1=4A entering, I2=7A entering. Find I3.",
        KVL: "Describe your KVL problem. E.g: Series circuit with 12V source, R1=4Ω, R2=8Ω. Find current and voltage drops.",
      },
      quickExamples: {
        KCL: [
          "Node A: I1=3A in, I2=5A in, find I3",
          "R1=10Ω, R2=20Ω, Vs=12V — find node voltages",
          "3-node circuit, R1=5Ω R2=10Ω R3=15Ω Is=2A",
        ],
        KVL: [
          "Series loop: 12V, R1=4Ω, R2=8Ω — find I",
          "2-mesh: V1=10V V2=5V R1=2Ω R2=3Ω R3=4Ω",
          "Find voltage drop across R3=6Ω in 24V loop",
        ],
      },
    },

    file: {
      label: "File Upload",
      description: "User uploads a circuit diagram or problem sheet.",
      acceptedFormats: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
      acceptedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
      maxFileSizeMB: 10,
      processingNote: "File contents are read, extracted, and passed to the solving engine.",
    },
  },

  /**
   * SOLUTION OUTPUT
   * Requirements for how solutions must be displayed.
   */
  solutionOutput: {
    required: true,
    format: "plain text (monospace font, no markdown symbols)",
    mustInclude: [
      "Clear step-by-step breakdown",
      "All intermediate calculations shown",
      "Matrix setup and solution (if Matrix method)",
      "Final answer clearly separated and labeled",
      "Units on all values (Ω, V, A, mA, kΩ)",
      "Verification pass using the original law",
    ],
    sectionHeaders: [
      "GIVEN:", "IDENTIFY NODES/LOOPS:", "STEP 1:", "STEP 2:",
      "MATRIX SETUP:", "GAUSSIAN ELIMINATION:", "SOLUTION:",
      "VERIFICATION:", "FINAL ANSWER:",
    ],
  },
};






const VOLTX_AI_ENGINE = {
  /**
   * NOTE: The AI engine is internal and transparent to the user.
   * Users interact with VOLTX as a circuit solver — the AI
   * layer is an implementation detail, not a user-visible feature.
   */

  provider: "Anthropic",
  apiEndpoint: "https:
  model: "claude-sonnet-4-20250514",
  maxTokens: 2000,

  systemPrompt: `You are VOLTX, a precision electrical engineering circuit solver. 
Format responses as clean plain text — no markdown symbols (* # _). 
Use section headers like STEP 1:, MATRIX SETUP:, NODE EQUATIONS:, FINAL ANSWER: on their own lines. 
Show every calculation step clearly. 
Use proper units (Ω V A mA kΩ). 
Verify answers. 
End every solution with a clearly separated FINAL ANSWER section using a line of equals signs.`,

  promptTemplates: {
    KCL_standard:
      "Solve this KCL problem using the Standard method. " +
      "Identify all nodes, apply ΣI=0 at each node. " +
      "Write one equation per node. Solve the resulting system step by step. " +
      "State final currents with direction and units.\n\nProblem:\n{PROBLEM}",

    KVL_standard:
      "Solve this KVL problem using the Standard method. " +
      "Identify all loops, assign current directions, apply ΣV=0 around each loop. " +
      "Write one equation per loop. Solve the system algebraically. " +
      "State all mesh currents and element voltages.\n\nProblem:\n{PROBLEM}",

    KCL_matrix:
      "Solve this KCL problem using Nodal Analysis matrix method. " +
      "Build the conductance matrix [G] and current vector [I]. Write [G][V]=[I]. " +
      "Show the complete matrix, perform Gaussian elimination or find [G]^-1. " +
      "Compute node voltages, then derive all branch currents.\n\nProblem:\n{PROBLEM}",

    KVL_matrix:
      "Solve this KVL problem using Mesh Analysis matrix method. " +
      "Build the impedance matrix [Z] and voltage vector [V]. Write [Z][I]=[V]. " +
      "Show the complete matrix setup, find the determinant, apply Cramer's rule or matrix inversion. " +
      "Compute all mesh currents, then find element voltages.\n\nProblem:\n{PROBLEM}",
  },

  filePromptSuffix:
    "Extract all circuit values from the image/document and provide a complete step-by-step solution.",

  errorMessages: {
    noInput: "ERROR: Please enter a circuit problem before solving.",
    noFile: "ERROR: Please upload a circuit image or PDF file.",
    apiError: "SYSTEM ERROR: Unable to process request — ",
    parseError: "SYSTEM ERROR: Response could not be parsed.",
  },
};






const VOLTX_UI = {
  theme: {
    style: "Dark industrial / retro-futuristic",
    primaryBg: "#09090f",
    secondaryBg: "#0f0f1a",
    accentCyan: "#00e5ff",
    accentPurple: "#7b61ff",
    accentOrange: "#ff6b35",
    textPrimary: "#e8e8f0",
    textSecondary: "#8888aa",
    borderColor: "rgba(0,229,255,0.15)",
  },

  typography: {
    displayFont: "Bebas Neue (Google Fonts)",
    monoFont: "IBM Plex Mono (Google Fonts)",
    bodyFont: "IBM Plex Sans (Google Fonts)",
  },

  layout: {
    type: "Two-column grid (sidebar + main panel)",
    header: "Sticky top bar with VOLTX logo and KCL/KVL nav pills",
    hero: "Large typographic hero with law formulas",
    sidebar: "Law cards + method selector, sticky on scroll",
    mainPanel: "Input card → Solve button → Result card",
    footer: "Minimal branding footer",
    responsive: "Single column on mobile (≤768px)",
  },

  visualEffects: {
    gridBackground: "40px CSS grid lines (cyan, 3% opacity)",
    scanlineOverlay: "Repeating horizontal scanlines (subtle CRT effect)",
    glowEffects: "Text-shadow and box-shadow on accent elements",
    pulseAnimation: "Status dot pulse on panel header and result topbar",
    sweepAnimation: "Button shine sweep on hover",
    fadeUpAnimation: "Result card fade-up on solution display",
  },

  components: {
    lawCards: "Clickable cards with left border accent and glow on active",
    methodOptions: "Radio-style option rows with accent-colored radio dots",
    inputTabs: "TEXT INPUT / FILE UPLOAD tab switcher",
    exampleChips: "Clickable quick-fill example chips below textarea",
    solveButton: "Full-width display font button with hover sweep effect",
    resultCard: "Monospace solution output with badge, method tag, and status dot",
    uploadZone: "Dashed bordered drag-and-drop zone with file name confirmation",
  },
};






const VOLTX_TECH_STACK = {
  type: "Vanilla HTML / CSS / JavaScript",
  framework: "None — zero dependencies, zero build step",
  bundler: "None",
  cssStrategy: "Inline <style> with CSS custom properties (variables)",
  jsStrategy: "Inline <script>, ES6+, async/await",
  fontSource: "Google Fonts CDN",
  apiCalls: "Native fetch() to Anthropic API",
  fileReading: "FileReader Web API (base64 encoding for images and PDFs)",
  persistence: "None (stateless, no localStorage or cookies required)",
  deployment: "Any static host or open directly as local .html file",
  browserSupport: ["Chrome 90+", "Edge 90+", "Firefox 88+", "Safari 14+"],
};






const VOLTX_FILE_STRUCTURE = {
  "voltx.html": "Main application — HTML, CSS, and JS all in one file",
  "voltx-requirements.js": "This file — full project requirements and configuration reference",
  "README.md": "(Optional) Setup and usage documentation",
};






const VOLTX_FUNCTIONAL_REQUIREMENTS = [
  {
    id: "FR-01",
    title: "Law Selection",
    description: "User can switch between KCL and KVL at any time without losing input.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-02",
    title: "Method Selection",
    description: "User can choose Standard or Matrix solving method independently of law choice.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-03",
    title: "Text Input",
    description: "User can type or paste a circuit problem as plain text.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-04",
    title: "File Upload — JPEG/PNG",
    description: "User can upload a circuit diagram image (.jpg, .jpeg, .png). " +
      "Image is base64-encoded and passed to the solving engine for visual extraction.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-05",
    title: "File Upload — PDF",
    description: "User can upload a PDF problem sheet (.pdf). " +
      "PDF is base64-encoded and passed to the solving engine.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-06",
    title: "Step-by-Step Solution",
    description: "Every solution must show all intermediate steps, not just the final answer.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-07",
    title: "Matrix Solution Display",
    description: "Matrix method must show the constructed matrix, row operations, and inversion steps.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-08",
    title: "Answer Verification",
    description: "Solution must include a verification step confirming the answer satisfies the original law.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-09",
    title: "Quick Examples",
    description: "Pre-filled example chips for each law allow users to test the solver instantly.",
    priority: "SHOULD HAVE",
  },
  {
    id: "FR-10",
    title: "Responsive Layout",
    description: "Application must be fully usable on mobile screens (≤768px).",
    priority: "SHOULD HAVE",
  },
  {
    id: "FR-11",
    title: "Error Handling",
    description: "Missing input, missing file, and API errors must surface as readable error messages " +
      "in the result panel — never a blank screen or console-only error.",
    priority: "MUST HAVE",
  },
  {
    id: "FR-12",
    title: "No-Dependency Deployment",
    description: "The application must run by opening a single .html file in a browser — " +
      "no Node.js, no npm, no build process required.",
    priority: "MUST HAVE",
  },
];






const VOLTX_NON_FUNCTIONAL_REQUIREMENTS = [
  {
    id: "NFR-01",
    category: "Performance",
    description: "UI interactions (law/method switching, tab switching) must be instantaneous (<16ms). " +
      "API solve time is network-dependent and is indicated with a loading state.",
  },
  {
    id: "NFR-02",
    category: "Security",
    description: "No API key is embedded in the client code. " +
      "Authentication is handled by the server-side proxy. " +
      "No user data is persisted or transmitted beyond the solve request.",
  },
  {
    id: "NFR-03",
    category: "Usability",
    description: "The AI solving engine must be completely transparent to the user. " +
      "VOLTX presents itself as a circuit solver — the underlying model is an implementation detail.",
  },
  {
    id: "NFR-04",
    category: "Accuracy",
    description: "Numerical answers must be computed to at least 3 significant figures. " +
      "Matrix solutions must show exact fractions or rounded decimals consistently.",
  },
  {
    id: "NFR-05",
    category: "Accessibility",
    description: "All interactive elements must be keyboard-accessible. " +
      "Color contrast must meet WCAG AA on the chosen dark theme.",
  },
  {
    id: "NFR-06",
    category: "Maintainability",
    description: "CSS custom properties (variables) must be used for all colors and fonts. " +
      "All configuration values must be editable in one place (this file).",
  },
];






const VOLTX_MATRIX_REFERENCE = {

  /**
   * NODAL ANALYSIS (for KCL)
   *
   * Given a circuit with n nodes (including ground/reference):
   *
   *   Step 1: Label nodes V1, V2, ... V(n-1). Ground = 0V.
   *   Step 2: For each non-reference node, apply KCL:
   *           Sum of currents leaving node = Sum of source currents entering node
   *   Step 3: Express each branch current as (Vi - Vj) / Rij
   *   Step 4: Rearrange into matrix form [G][V] = [I]
   *
   *   Conductance matrix G:
   *     G[i][i] = sum of all conductances connected to node i
   *     G[i][j] = -conductance between node i and node j  (i ≠ j)
   *
   *   Example (2-node circuit):
   *   | G11  G12 | | V1 |   | I1 |
   *   | G21  G22 | | V2 | = | I2 |
   *
   *   Solve: [V] = [G]^(-1) × [I]
   */
  nodalAnalysis: {
    law: "KCL",
    matrixForm: "[G][V] = [I]",
    unknowns: "Node voltages V1, V2, ... V(n-1)",
    solve: "Gaussian elimination or [G]^(-1) multiplication",
  },

  /**
   * MESH ANALYSIS (for KVL)
   *
   * Given a circuit with m independent meshes:
   *
   *   Step 1: Assign mesh currents I1, I2, ... Im (clockwise convention).
   *   Step 2: For each mesh, apply KVL:
   *           Sum of voltage rises = Sum of voltage drops
   *   Step 3: Express each voltage drop as R × (mesh current terms)
   *   Step 4: Rearrange into matrix form [Z][I] = [V]
   *
   *   Impedance matrix Z:
   *     Z[i][i] = sum of all resistances in mesh i
   *     Z[i][j] = -resistance shared between mesh i and mesh j  (i ≠ j)
   *
   *   Example (2-mesh circuit):
   *   | Z11  Z12 | | I1 |   | V1 |
   *   | Z21  Z22 | | I2 | = | V2 |
   *
   *   Solve: [I] = [Z]^(-1) × [V]   or Cramer's Rule:
   *     I1 = det([V|Z_col2]) / det(Z)
   *     I2 = det([Z_col1|V]) / det(Z)
   */
  meshAnalysis: {
    law: "KVL",
    matrixForm: "[Z][I] = [V]",
    unknowns: "Mesh currents I1, I2, ... Im",
    solve: "Cramer's Rule or [Z]^(-1) multiplication",
  },

  /**
   * 2×2 Matrix Inversion Formula (reference)
   *   | a  b |^(-1)     1     |  d  -b |
   *   | c  d |      = ───── × | -c   a |
   *                   ad-bc
   *
   * Determinant: det = ad - bc
   * If det = 0, the system has no unique solution (dependent equations).
   */
  matrixInversion2x2: {
    formula: "A^(-1) = (1/det(A)) × adj(A)",
    determinant: "det = a*d - b*c",
    adjugate: "[[d, -b], [-c, a]]",
  },
};






if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VOLTX_META,
    VOLTX_FEATURES,
    VOLTX_AI_ENGINE,
    VOLTX_UI,
    VOLTX_TECH_STACK,
    VOLTX_FILE_STRUCTURE,
    VOLTX_FUNCTIONAL_REQUIREMENTS,
    VOLTX_NON_FUNCTIONAL_REQUIREMENTS,
    VOLTX_MATRIX_REFERENCE,
  };
}




