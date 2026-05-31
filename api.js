


const API_MODEL = 'gemini-2.5-flash';
const API_ENDPOINT = `https:
const API_TOKENS = 4096;




let _apiKey = '';

function getApiKey() {
  if (!_apiKey || _apiKey.trim() === '') {
    _apiKey = prompt(
      'VOLTX needs your Gemini API key to solve problems.\n\n' +
      'Get a free key at: https:
      'Paste your key below:'
    );
    if (!_apiKey || _apiKey.trim() === '') {
      throw new Error('API key is required. Get a free key at https:
    }
    _apiKey = _apiKey.trim();
  }
  return _apiKey;
}


function parseGeminiError(data, httpStatus) {
  const code = data?.error?.code || httpStatus;
  const message = data?.error?.message || 'Unknown error';
  const status = data?.error?.status || '';

  
  if (code === 429 || status === 'RESOURCE_EXHAUSTED') {
    _apiKey = '';
    return (
      'QUOTA EXCEEDED — Your Gemini API free tier limit has been reached.\n\n' +
      'How to fix:\n' +
      '  1. Wait 1 minute and try again (per-minute rate limit resets)\n' +
      '  2. Get a fresh API key at https:
      '  3. Upgrade to Gemini paid tier for higher limits\n\n' +
      'Technical detail: ' + message
    );
  }

  
  if ((code === 400 && message.toLowerCase().includes('api key')) ||
    code === 401 || code === 403) {
    _apiKey = '';
    return (
      'INVALID API KEY — The Gemini API key was rejected.\n\n' +
      'How to fix:\n' +
      '  1. Get a valid key at https:
      '  2. Paste it into api.js on the _apiKey line\n' +
      '  3. Make sure there are no extra spaces in the key\n\n' +
      'Technical detail: ' + message
    );
  }

  
  if (code === 503 || code === 500) {
    return (
      'SERVICE UNAVAILABLE — Gemini API is temporarily down.\n\n' +
      'How to fix:\n' +
      '  1. Wait 30 seconds and try again\n' +
      '  2. Check https:
      'Technical detail: ' + message
    );
  }

  return 'API ERROR [' + code + ']: ' + message;
}


const SYSTEM_PROMPT =
  'You are VOLTX, a precision electrical engineering circuit solver. ' +
  'STRICT FORMATTING RULES:\n' +
  '1. PLAIN TEXT ONLY. No asterisks (*), no hash (#), no underscores (_), no bold, no italic, no markdown.\n' +
  '2. Use these exact section headers on their own lines:\n' +
  '   GIVEN:  |  IDENTIFY NODES:  |  STEP 1:  |  STEP 2:  |  STEP 3:  |  MATRIX SETUP:\n' +
  '   NODE EQUATIONS:  |  SOLUTION:  |  VERIFICATION:  |  FINAL ANSWER:\n' +
  '3. Show every single calculation. Never skip steps.\n' +
  '4. Use proper units: Ω V A mA kΩ\n' +
  '5. Always end with FINAL ANSWER: section separated by a line of equals signs (=====).\n' +
  '6. Verify the answer satisfies the original law before writing FINAL ANSWER.\n' +
  '7. Numbers must be rounded to at least 3 significant figures.';


function getMethodDescription(law, method) {
  if (method === 'matrix') {
    if (law === 'KCL') {
      return (
        'Use Nodal Analysis matrix method.\n' +
        'STEP 1: Identify all nodes and select reference (ground) node.\n' +
        'STEP 2: Write KCL at each non-reference node.\n' +
        'STEP 3: Build conductance matrix [G]: G[i][i] = sum of conductances at node i; G[i][j] = -conductance between i and j.\n' +
        'STEP 4: Write [G][V] = [I] in full matrix form.\n' +
        'STEP 5: Solve by Gaussian elimination or matrix inversion — show all row operations.\n' +
        'STEP 6: State all node voltages.\n' +
        'STEP 7: Derive all branch currents using Ohm\'s Law.'
      );
    } else {
      return (
        'Use Mesh Analysis matrix method.\n' +
        'STEP 1: Identify all independent meshes, assign clockwise mesh currents.\n' +
        'STEP 2: Write KVL around each mesh.\n' +
        'STEP 3: Build impedance matrix [Z]: Z[i][i] = sum of resistances in mesh i; Z[i][j] = -shared resistance between i and j.\n' +
        'STEP 4: Write [Z][I] = [V] in full matrix form.\n' +
        'STEP 5: Find the determinant, solve by Cramer\'s Rule or matrix inversion — show all steps.\n' +
        'STEP 6: State all mesh currents.\n' +
        'STEP 7: Calculate all element voltages.'
      );
    }
  } else {
    if (law === 'KCL') {
      return (
        'Use Standard KCL method.\n' +
        'STEP 1: Label all nodes and identify known/unknown currents.\n' +
        'STEP 2: Apply ΣI = 0 at each node.\n' +
        'STEP 3: Write one equation per node with unknowns on the left.\n' +
        'STEP 4: Solve the system algebraically — show every substitution.\n' +
        'STEP 5: State each unknown current with magnitude, unit, and direction.'
      );
    } else {
      return (
        'Use Standard KVL method.\n' +
        'STEP 1: Identify all loops, assign clockwise current direction.\n' +
        'STEP 2: Apply ΣV = 0 around each loop — voltage rises positive, drops negative.\n' +
        'STEP 3: Write one KVL equation per loop.\n' +
        'STEP 4: Solve algebraically — show every substitution.\n' +
        'STEP 5: State each mesh current and all element voltage drops with units.'
      );
    }
  }
}


function buildContents(law, method, inputTab, problemText, uploadedFile, uploadedFileData) {
  const methodDesc = getMethodDescription(law, method);
  const methodLabel = method === 'matrix' ? 'Matrix' : 'Standard';

  const textPrompt =
    'Solve this ' + law + ' circuit problem using the ' + methodLabel + ' method.\n\n' +
    methodDesc + '\n\n' +
    (inputTab === 'text'
      ? 'Problem:\n' + problemText
      : 'Extract all circuit values from the uploaded image or document, then solve step by step.'
    );

  if (inputTab === 'text') {
    return [{ role: 'user', parts: [{ text: textPrompt }] }];
  } else {
    return [{
      role: 'user',
      parts: [
        { inline_data: { mime_type: uploadedFile.type, data: uploadedFileData } },
        { text: textPrompt }
      ]
    }];
  }
}


async function callSolvingEngine(law, method, inputTab, problemText, uploadedFile, uploadedFileData) {

  
  let apiKey;
  try {
    apiKey = getApiKey();
  } catch (keyErr) {
    throw new Error(keyErr.message);
  }

  const contents = buildContents(law, method, inputTab, problemText, uploadedFile, uploadedFileData);
  const url = API_ENDPOINT;
  const requestBody = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: API_TOKENS,
      temperature: 0.1,
      topP: 0.8,
      topK: 40
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });
  } catch (networkErr) {
    throw new Error(
      'NETWORK ERROR — Cannot reach the solving engine.\n\n' +
      'How to fix:\n' +
      '  1. Check your internet connection\n' +
      '  2. Open index.html directly in a browser (file:
      'Detail: ' + networkErr.message
    );
  }

  
  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    throw new Error(
      'PARSE ERROR — Unreadable response (HTTP ' + response.status + ').\n' +
      'Please try again in a few seconds.'
    );
  }

  
  if (!response.ok || data.error) {
    throw new Error(parseGeminiError(data, response.status));
  }

  
  if (data.candidates?.[0]?.finishReason === 'SAFETY') {
    throw new Error(
      'SAFETY BLOCK — The response was filtered.\n' +
      'Try rephrasing using standard electrical engineering terminology.'
    );
  }

  
  const answer = data.candidates
    ?.[0]?.content?.parts
    ?.map(p => p.text || '')
    .join('\n')
    .trim();

  if (!answer || answer.length < 10) {
    throw new Error(
      'EMPTY RESPONSE — No solution was returned.\n\n' +
      'How to fix:\n' +
      '  1. Add more detail (resistor values, source voltages, node names)\n' +
      '  2. Try the other solving method (Standard ↔ Matrix)\n' +
      '  3. Try again — sometimes a temporary API hiccup'
    );
  }

  return answer;
}
