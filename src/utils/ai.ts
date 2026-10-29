/**
 * Azure OpenAI & Retro Web AI Service for NOVA 30 OS
 * Connects to Azure OpenAI (gpt-4.1-mini) to dynamically synthesize 1998-era web pages,
 * search queries, and AI responses, with offline procedural fallbacks.
 */

const AZURE_ENDPOINT = 
  import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || 
  '';

const AZURE_API_KEY = 
  import.meta.env.VITE_AZURE_OPENAI_API_KEY || 
  '';

const TEXT_MODEL = 
  import.meta.env.VITE_TEXT_MODEL_DEPLOYMENT || 
  'gpt-4.1-mini';

export interface RetroPageResult {
  title: string;
  author: string;
  visitorCount: number;
  bodyHtml: string;
  isAi: boolean;
  links: Array<{ title: string; url: string }>;
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Procedural fallback generator when offline or if API key is rate-limited.
 */
function generateFallbackPage(url: string, query?: string): RetroPageResult {
  const cleanTitle = (query || url.replace(/^https?:\/\//, '').replace(/^nova:\/\//, '')).toUpperCase();
  const visitorCount = Math.floor(Math.random() * 88888) + 1200;
  
  return {
    title: `${cleanTitle} ~ The Official Fan Ring & Cyber-Hub (1998)`,
    author: `Webmaster_${Math.floor(Math.random() * 900 + 100)}`,
    visitorCount,
    isAi: false,
    links: [
      { title: '« Back to NOVA Portal', url: 'nova://home' },
      { title: 'The Retro 90s Web Archive', url: 'nova://archive' },
      { title: 'Pixel Radio 24/7', url: 'nova://radio' },
      { title: 'Alien Sightings & Area 51', url: 'nova://alien-conspiracy' },
      { title: 'Sign our Guestbook', url: 'nova://guestbook' }
    ],
    bodyHtml: `
      <div style="background-color: #000033; color: #00ffcc; padding: 18px; border: 3px ridge #00ffcc; font-family: 'Times New Roman', serif;">
        <center>
          <marquee scrollamount="4" style="background:#000080; color:#ffff00; font-weight:bold; padding:4px;">
            ★★★ WELCOME TO ${cleanTitle} ★★★ BEST VIEWED IN NETSCAPE 4.0 OR NOVA EXPLORER ★★★
          </marquee>
          <h1 style="color: #ff00ff; text-shadow: 2px 2px #ffff00; margin: 15px 0 5px 0;">~*~ ${cleanTitle} ~*~</h1>
          <p style="color: #ffff00; font-style: italic;">"Browsing the Information Superhighway since November 1998"</p>
          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='31'><rect width='88' height='31' fill='%23000'/><text x='5' y='20' fill='%230f0' font-family='monospace' font-size='10'>MADE W/ NOTEPAD</text></svg>" alt="Made with Notepad" style="margin: 8px;" />
          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='31'><rect width='88' height='31' fill='%23000080'/><text x='10' y='20' fill='%23fff' font-family='monospace' font-size='10'>NETSCAPE NOW</text></svg>" alt="Netscape Now" style="margin: 8px;" />
        </center>

        <hr style="border: 1px dashed #ff00ff; margin: 16px 0;" />

        <table width="100%" border="1" cellpadding="8" style="border-collapse:collapse; border-color:#00ffcc; background:#000022;">
          <tr bgcolor="#000066">
            <th width="30%" style="color:#ffff00; text-align:left;">NAVIGATION</th>
            <th width="70%" style="color:#ffff00; text-align:left;">DISPATCH FROM THE CYBER-DESK</th>
          </tr>
          <tr valign="top">
            <td style="font-size: 13px; line-height: 1.6;">
              • <a href="nova://home" style="color:#00ffff;">NOVA Home</a><br/>
              • <a href="nova://search" style="color:#00ffff;">Search Cyberspace</a><br/>
              • <a href="nova://guestbook" style="color:#00ffff;">Sign Guestbook</a><br/>
              • <a href="nova://free-ram" style="color:#00ffff;">Free 64MB RAM</a><br/>
              • <a href="nova://hamster-dance" style="color:#00ffff;">Hampster Dance</a><br/>
              • <a href="mailto:webmaster@cyberspace98.net" style="color:#ff9999;">Email Webmaster</a>
            </td>
            <td style="font-size: 14px; line-height: 1.5; color: #ffffff;">
              <p>Greetings, fellow Cyber-Traveler!</p>
              <p>You have landed upon our sanctuary dedicated to <strong>${cleanTitle}</strong>. In these fast-moving digital times of 1998, few sites maintain genuine handcrafted HTML without bloated ActiveX controls.</p>
              <p style="background: #220022; padding: 8px; border-left: 4px solid #ff00ff;">
                <strong>NOTICE:</strong> This site is currently under continuous construction. Please do not steal our animated GIFs without leaving credit in the guestbook!
              </p>
              <p>TOP SECRET INTEL: Have you checked the C:\\ drive thoroughly? Some say that older terminals whisper secrets when invoked with <code>ghost</code> or <code>1998</code>.</p>
            </td>
          </tr>
        </table>

        <div style="margin-top: 20px; text-align: center; border-top: 1px dashed #00ffcc; padding-top: 12px;">
          <p style="margin:0; font-size:12px; color:#ffff00;">
            Visitor Counter: [ <span style="background:#000; color:#0f0; padding:2px 6px; font-family:monospace; border:1px solid #0f0;">00${visitorCount}</span> ]
          </p>
          <p style="margin:4px 0 0 0; font-size:10px; color:#888;">
            (c) 1998 ${cleanTitle} Consortium. All Rights Reserved. Dial-up speed: 56.6 kbps.
          </p>
        </div>
      </div>
    `
  };
}

/**
 * Calls Azure OpenAI to synthesize a 1998-styled retro webpage.
 */
export async function generateRetroWebPage(url: string, query?: string): Promise<RetroPageResult> {
  const target = query || url;
  
  try {
    const systemPrompt = `You are a 1998 web server emulator for a nostalgic retro browser (NOVA Explorer).
Generate a hilarious, highly authentic 1998-era personal homepage or topic portal about "${target}".
Requirements:
1. Return ONLY valid JSON with keys:
   - "title": (string) A retro 1998 title with ~ or * or CAPS
   - "author": (string) e.g. CyberDave_98, NeoSurfer
   - "visitorCount": (number) e.g. 43812
   - "bodyHtml": (string) 90s styled HTML containing table layouts, marquee, font tags, retro styling (neon colors on dark, or beige classic), humorous dial-up and 1998 pop-culture references, webrings, and under-construction warnings.
   - "links": array of { "title": string, "url": string } (3-5 retro links)
2. Do not include markdown code block formatting (or wrap inside clean JSON).
3. Keep the content safe, playful, nostalgic, and creative.`;

    const response = await fetch(`${AZURE_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
        'Authorization': `Bearer ${AZURE_API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the 1998 website for URL/Topic: ${target}` }
        ],
        temperature: 0.8,
        max_tokens: 1400
      })
    });

    if (!response.ok) {
      console.warn('Azure OpenAI error, using procedural fallback:', response.status);
      return generateFallbackPage(url, query);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return generateFallbackPage(url, query);

    // Strip markdown formatting if any
    const jsonStr = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title || `${target.toUpperCase()} (1998)`,
      author: parsed.author || 'CyberSurfer98',
      visitorCount: parsed.visitorCount || 19982,
      bodyHtml: parsed.bodyHtml || `<p>${target}</p>`,
      isAi: true,
      links: Array.isArray(parsed.links) ? parsed.links : []
    };
  } catch (err) {
    console.warn('Azure OpenAI fetch failed or network offline, using fallback:', err);
    return generateFallbackPage(url, query);
  }
}

export interface SearchKnowledgeCard {
  title: string;
  subtitle: string;
  description: string;
  facts: Record<string, string>;
  imageEmoji?: string;
}

export interface PeopleAlsoAskItem {
  question: string;
  answer: string;
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
  category?: string;
  detailedContent?: string;
}

export interface CompleteSearchResponse {
  query: string;
  totalResults: number;
  searchTimeSec: string;
  directAnswer?: string;
  knowledgeCard?: SearchKnowledgeCard;
  peopleAlsoAsk: PeopleAlsoAskItem[];
  results: SearchResultItem[];
  relatedSearches: string[];
}

/**
 * Built-in Encyclopedic Knowledge Base for instant, factual Google-style searches.
 */
const KNOWLEDGE_DICTIONARY: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  facts: Record<string, string>;
  directAnswer: string;
  emoji: string;
  sections: Array<{ heading: string; body: string }>;
  qa: Array<{ question: string; answer: string }>;
  related: string[];
}> = {
  'google': {
    title: 'Google',
    subtitle: 'Multinational Technology Company',
    description: 'Google is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, and artificial intelligence.',
    facts: { 'Founded': 'September 4, 1998 (Menlo Park, CA)', 'Founders': 'Larry Page, Sergey Brin', 'Headquarters': 'Mountain View, California, USA', 'Parent Organization': 'Alphabet Inc.', 'CEO': 'Sundar Pichai' },
    directAnswer: 'Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University.',
    emoji: '🔍',
    sections: [
      { heading: 'Origin and PageRank', body: 'Originally nicknamed "BackRub", Google developed the revolutionary PageRank algorithm that determined a website’s importance based on backlink counts and citation weight.' },
      { heading: 'Expansion and Ecosystem', body: 'Google grew from a pure search engine into Android, YouTube, Chrome, Google Cloud, Gmail, Google Maps, and groundbreaking AI research including Transformers.' }
    ],
    qa: [
      { question: 'Who founded Google?', answer: 'Google was founded by Larry Page and Sergey Brin in 1998 while studying at Stanford University.' },
      { question: 'What was Google originally named?', answer: 'Google was initially called BackRub because the system checked backlinks to estimate the importance of a site.' },
      { question: 'What does the name Google mean?', answer: 'The name originated from a misspelling of "googol", the number 1 followed by 100 zeros.' }
    ],
    related: ['Larry Page', 'Sergey Brin', 'Alphabet Inc', 'PageRank algorithm', 'Android OS']
  },
  'python': {
    title: 'Python (Programming Language)',
    subtitle: 'High-Level Interpreted Programming Language',
    description: 'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. It supports multiple programming paradigms, including structured, object-oriented and functional programming.',
    facts: { 'Designed by': 'Guido van Rossum', 'First Released': 'February 20, 1991', 'Typing Discipline': 'Duck, dynamic, strong', 'OS': 'Cross-platform', 'Filename Extensions': '.py, .pyc, .pyd' },
    directAnswer: 'Python is an interpreted, high-level, dynamically typed language created by Guido van Rossum and released in 1991. It is renowned for clean syntax and vast data science/AI libraries.',
    emoji: '🐍',
    sections: [
      { heading: 'Features & Philosophy', body: 'Core philosophies are summarized in "The Zen of Python" (PEP 20): "Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex."' },
      { heading: 'Applications', body: 'Widely used in Machine Learning (PyTorch, TensorFlow), Web Development (Django, FastAPI), Automation, Scientific Computing (NumPy, SciPy), and DevOps.' }
    ],
    qa: [
      { question: 'Is Python good for beginners?', answer: 'Yes, Python’s syntax is readable and closely mirrors plain English, making it one of the easiest languages to learn.' },
      { question: 'Why is it named Python?', answer: 'Guido van Rossum named it after the British comedy troupe Monty Python, of which he was a fan.' }
    ],
    related: ['Guido van Rossum', 'JavaScript', 'Django framework', 'NumPy', 'Machine Learning']
  },
  'quantum computing': {
    title: 'Quantum Computing',
    subtitle: 'Subfield of Computer Science and Quantum Physics',
    description: 'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. It utilizes qubits which can exist in superpositions of 0 and 1.',
    facts: { 'Fundamental Unit': 'Qubit (Quantum Bit)', 'Key Principles': 'Superposition, Entanglement, Interference', 'Leading Approaches': 'Superconducting circuits, Trapped ions, Photonic', 'Applications': 'Cryptography, Drug discovery, Materials science' },
    directAnswer: 'Quantum computing leverages quantum mechanical phenomena—specifically superposition and entanglement—to perform certain calculations exponentially faster than classical supercomputers.',
    emoji: '⚛️',
    sections: [
      { heading: 'Superposition & Entanglement', body: 'While classical bits are strictly 0 or 1, qubits represent complex superpositions. Entangled qubits share states instantaneously across distances.' },
      { heading: 'Quantum Supremacy & Challenges', body: 'Main challenges include quantum decoherence, error mitigation, and keeping superconducting processors near absolute zero (-273.15°C).' }
    ],
    qa: [
      { question: 'Can quantum computers replace normal PCs?', answer: 'No, quantum computers excel at specific mathematical problems (optimization, quantum simulation, factoring) rather than general everyday computing.' },
      { question: 'What is a qubit?', answer: 'A qubit is the basic unit of quantum information, analogous to the digital bit, but able to exist in continuous superposition.' }
    ],
    related: ['Qubit', 'Quantum Entanglement', 'Shor Algorithm', 'Superconductivity', 'Cryptography']
  },
  'albert einstein': {
    title: 'Albert Einstein',
    subtitle: 'Theoretical Physicist (1879–1955)',
    description: 'Albert Einstein was a German-born theoretical physicist widely acknowledged to be one of the greatest and most influential physicists of all time. Best known for developing the theory of relativity, he also made fundamental contributions to quantum mechanics.',
    facts: { 'Born': 'March 14, 1879 (Ulm, Germany)', 'Died': 'April 18, 1955 (Princeton, NJ)', 'Known for': 'General relativity, Special relativity, Photoelectric effect, E=mc²', 'Nobel Prize': 'Physics (1921)' },
    directAnswer: 'Albert Einstein (1879–1955) revolutionized modern physics with his theories of Special and General Relativity and his explanation of the photoelectric effect (E=mc²), which won him the 1921 Nobel Prize.',
    emoji: '🧠',
    sections: [
      { heading: 'Annus Mirabilis (1905)', body: 'In 1905, while working as a Swiss patent clerk, Einstein published four groundbreaking papers: on the photoelectric effect, Brownian motion, special relativity, and mass-energy equivalence (E=mc²).' },
      { heading: 'General Relativity', body: 'In 1915, he completed General Relativity, describing gravity not as an invisible pull, but as the geometric curvature of four-dimensional spacetime caused by mass and energy.' }
    ],
    qa: [
      { question: 'What is Einstein’s most famous equation?', answer: 'E=mc², which establishes that energy and mass are equivalent and transmutable.' },
      { question: 'Why did Einstein win the Nobel Prize?', answer: 'He was awarded the 1921 Nobel Prize in Physics for his explanation of the photoelectric effect, not for relativity.' }
    ],
    related: ['Theory of Relativity', 'Isaac Newton', 'Max Planck', 'Niels Bohr', 'Quantum Mechanics']
  },
  'internet': {
    title: 'Internet',
    subtitle: 'Global System of Interconnected Computer Networks',
    description: 'The Internet is the global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to communicate between networks and devices. It carries a vast range of information resources and services.',
    facts: { 'Predecessor': 'ARPANET (1969)', 'Inventors of TCP/IP': 'Vint Cerf, Bob Kahn', 'World Wide Web Inventor': 'Tim Berners-Lee (1989)', 'Standard Protocol': 'TCP/IP (IPv4 / IPv6)' },
    directAnswer: 'The Internet is a global network of computers connected via standard communication protocols (TCP/IP). The World Wide Web was introduced in 1989 by Tim Berners-Lee.',
    emoji: '🌐',
    sections: [
      { heading: 'From ARPANET to Modern Web', body: 'ARPANET sent its first message in 1969. In 1983, TCP/IP was adopted. Tim Berners-Lee at CERN created HTML, HTTP, and URLs, launching the World Wide Web in 1989–1991.' }
    ],
    qa: [
      { question: 'Who invented the Internet?', answer: 'Vint Cerf and Bob Kahn designed TCP/IP; Tim Berners-Lee invented the World Wide Web on top of it.' },
      { question: 'What is the difference between Internet and Web?', answer: 'The Internet is the underlying physical network infrastructure; the Web is an information-sharing service built on top using HTTP and HTML.' }
    ],
    related: ['ARPANET', 'World Wide Web', 'TCP/IP', 'Tim Berners-Lee', 'HTML']
  }
};

/**
 * Generate a comprehensive encyclopedic search package when AI is unavailable.
 */
function buildUniversalSearchEngineResponse(query: string): CompleteSearchResponse {
  const normalized = query.trim().toLowerCase();
  
  // Direct match in dictionary
  for (const [key, entry] of Object.entries(KNOWLEDGE_DICTIONARY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        query,
        totalResults: Math.floor(Math.random() * 500000) + 120000,
        searchTimeSec: '0.24',
        directAnswer: entry.directAnswer,
        knowledgeCard: {
          title: entry.title,
          subtitle: entry.subtitle,
          description: entry.description,
          facts: entry.facts,
          imageEmoji: entry.emoji
        },
        peopleAlsoAsk: entry.qa,
        results: [
          {
            title: `${entry.title} - Comprehensive Encyclopedia`,
            url: `nova://wiki/${encodeURIComponent(key)}`,
            displayUrl: `www.encyclopedia.org/wiki/${key.replace(/\s+/g, '_')}`,
            snippet: `${entry.description.slice(0, 160)}... Learn about history, core principles, applications, and verified facts.`,
            category: 'Reference'
          },
          {
            title: `Guide to ${entry.title}: Key Concepts & Overview`,
            url: `nova://guide/${encodeURIComponent(key)}`,
            displayUrl: `www.learntech.edu/guides/${key.replace(/\s+/g, '-')}`,
            snippet: `In-depth analysis of ${entry.title}. Explore ${Object.keys(entry.facts).join(', ')}.`,
            category: 'Education'
          },
          {
            title: `Recent Discoveries & News on ${entry.title}`,
            url: `nova://news/${encodeURIComponent(key)}`,
            displayUrl: `www.globalchronicle.com/news/${key.replace(/\s+/g, '-')}`,
            snippet: `Latest developments, international symposium reports, and breakthroughs concerning ${entry.title}.`,
            category: 'News'
          },
          {
            title: `Official Documentation & Archive: ${entry.title}`,
            url: `nova://archive/${encodeURIComponent(key)}`,
            displayUrl: `www.archive.org/specifications/${key.replace(/\s+/g, '-')}`,
            snippet: `Historical records, primary sources, transcripts, and specifications relating to ${entry.title}.`,
            category: 'Archive'
          }
        ],
        relatedSearches: entry.related
      };
    }
  }

  // Smart Algorithmic Knowledge Synthesis for ANY user query
  const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    query,
    totalResults: Math.floor(Math.random() * 890000) + 45000,
    searchTimeSec: '0.19',
    directAnswer: `Information and verified records regarding "${capitalizedQuery}". Cross-referenced across scientific indexes, historical archives, and digital encyclopedias.`,
    knowledgeCard: {
      title: capitalizedQuery,
      subtitle: `Knowledge Base Entry • ${capitalizedQuery}`,
      description: `Comprehensive reference record for "${capitalizedQuery}". Cataloged within global open data archives and verified computing indexes.`,
      facts: {
        'Subject': capitalizedQuery,
        'Classification': 'General Reference / Knowledge Graph',
        'Status': 'Verified Database Entry',
        'Indexed Under': 'World Wide Knowledge Registry'
      },
      imageEmoji: '📖'
    },
    peopleAlsoAsk: [
      {
        question: `What is the significance of ${capitalizedQuery}?`,
        answer: `${capitalizedQuery} is widely researched across modern literature, technical archives, and academic institutions worldwide.`
      },
      {
        question: `Where can I find more documentation about ${capitalizedQuery}?`,
        answer: `Detailed guides, peer-reviewed articles, and encyclopedic entries are available in the NOVA digital library.`
      },
      {
        question: `How does ${capitalizedQuery} connect to modern technology?`,
        answer: `It intersects with digital preservation, computing history, and accessible information retrieval systems.`
      }
    ],
    results: [
      {
        title: `${capitalizedQuery} - Free Online Encyclopedia`,
        url: `nova://wiki/${encodeURIComponent(query)}`,
        displayUrl: `www.encyclopedia.org/wiki/${encodeURIComponent(query)}`,
        snippet: `Complete encyclopedic overview of ${capitalizedQuery}. Definitions, background, etymology, historical context, and key developments.`,
        category: 'Encyclopedia'
      },
      {
        title: `Comprehensive Guide to ${capitalizedQuery} (Explained Simply)`,
        url: `nova://guide/${encodeURIComponent(query)}`,
        displayUrl: `www.knowledgehub.com/articles/${encodeURIComponent(query)}`,
        snippet: `Explore all aspects of ${capitalizedQuery}. Features tutorials, key takeaways, summary tables, and authoritative analysis.`,
        category: 'Tutorial'
      },
      {
        title: `Academic Research Papers on ${capitalizedQuery}`,
        url: `nova://scholar/${encodeURIComponent(query)}`,
        displayUrl: `www.scholar-archive.org/papers/${encodeURIComponent(query)}`,
        snippet: `Peer-reviewed studies, historical timelines, statistical datasets, and scientific bibliography regarding ${capitalizedQuery}.`,
        category: 'Academic'
      },
      {
        title: `Frequently Asked Questions: ${capitalizedQuery}`,
        url: `nova://faq/${encodeURIComponent(query)}`,
        displayUrl: `www.answers-directory.org/topics/${encodeURIComponent(query)}`,
        snippet: `Top community questions, expert answers, verified facts, and common misconceptions about ${capitalizedQuery}.`,
        category: 'Q&A'
      },
      {
        title: `Global News & Articles Mentioning ${capitalizedQuery}`,
        url: `nova://news/${encodeURIComponent(query)}`,
        displayUrl: `www.worldpress.org/search?q=${encodeURIComponent(query)}`,
        snippet: `Curated reports, historical retrospectives, and global media mentions relating to ${capitalizedQuery}.`,
        category: 'News'
      }
    ],
    relatedSearches: [
      `${capitalizedQuery} history`,
      `${capitalizedQuery} definition`,
      `How does ${capitalizedQuery} work`,
      `${capitalizedQuery} examples and guide`,
      `${capitalizedQuery} latest research`
    ]
  };
}

/**
 * Searches the web like Google with real factual knowledge, direct answers,
 * knowledge graph, "People also ask", and full encyclopedic depth.
 */
export async function searchGoogleWeb(query: string): Promise<CompleteSearchResponse> {
  const cleanQ = query.trim();
  if (!cleanQ) return buildUniversalSearchEngineResponse('Internet');

  try {
    const prompt = `You are a real, comprehensive search engine like Google. 
Provide accurate, factual, comprehensive information for the user query: "${cleanQ}".
Return ONLY a valid JSON object with the following schema:
{
  "directAnswer": "A clear, factual, direct answer to the query (2-4 sentences)",
  "knowledgeCard": {
    "title": "Main Entity Title",
    "subtitle": "Short Entity Subtitle/Category",
    "description": "Comprehensive 2-3 sentence overview",
    "facts": {
      "Key 1": "Value 1",
      "Key 2": "Value 2",
      "Key 3": "Value 3",
      "Key 4": "Value 4"
    },
    "imageEmoji": "emoji representing topic"
  },
  "peopleAlsoAsk": [
    { "question": "Relevant question 1", "answer": "Clear factual answer 1" },
    { "question": "Relevant question 2", "answer": "Clear factual answer 2" },
    { "question": "Relevant question 3", "answer": "Clear factual answer 3" }
  ],
  "results": [
    {
      "title": "Title of result 1",
      "url": "nova://wiki/topic-slug",
      "displayUrl": "www.wikipedia.org/wiki/topic",
      "snippet": "Informative search snippet with real facts (2-3 sentences)",
      "category": "Reference"
    },
    {
      "title": "Title of result 2",
      "url": "nova://guide/topic-slug",
      "displayUrl": "www.britannica.com/topic",
      "snippet": "Informative snippet",
      "category": "Education"
    },
    {
      "title": "Title of result 3",
      "url": "nova://tech/topic-slug",
      "displayUrl": "www.nature.com/articles/topic",
      "snippet": "Informative snippet",
      "category": "Science"
    },
    {
      "title": "Title of result 4",
      "url": "nova://news/topic-slug",
      "displayUrl": "www.bbc.com/news/topic",
      "snippet": "Informative snippet",
      "category": "News"
    },
    {
      "title": "Title of result 5",
      "url": "nova://archive/topic-slug",
      "displayUrl": "www.archive.org/details/topic",
      "snippet": "Informative snippet",
      "category": "Archive"
    }
  ],
  "relatedSearches": [
    "Related search 1",
    "Related search 2",
    "Related search 3",
    "Related search 4"
  ]
}
Be completely truthful, accurate, informative and comprehensive. Output strictly raw JSON without markdown formatting.`;

    const response = await fetch(`${AZURE_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
        'Authorization': `Bearer ${AZURE_API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      return buildUniversalSearchEngineResponse(cleanQ);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return buildUniversalSearchEngineResponse(cleanQ);

    const jsonStr = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      query: cleanQ,
      totalResults: Math.floor(Math.random() * 800000) + 150000,
      searchTimeSec: '0.28',
      directAnswer: parsed.directAnswer,
      knowledgeCard: parsed.knowledgeCard,
      peopleAlsoAsk: Array.isArray(parsed.peopleAlsoAsk) ? parsed.peopleAlsoAsk : [],
      results: Array.isArray(parsed.results) && parsed.results.length > 0 ? parsed.results : buildUniversalSearchEngineResponse(cleanQ).results,
      relatedSearches: Array.isArray(parsed.relatedSearches) ? parsed.relatedSearches : []
    };
  } catch {
    return buildUniversalSearchEngineResponse(cleanQ);
  }
}

/**
 * Backward compatibility search function
 */
export async function searchRetroWeb(query: string): Promise<SearchResultItem[]> {
  const full = await searchGoogleWeb(query);
  return full.results;
}

/**
 * Ask NOVA AI / System Assistant for assistance or terminal AI queries.
 */
export async function askNovaAi(prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch(`${AZURE_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
        'Authorization': `Bearer ${AZURE_API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { 
            role: 'system', 
            content: `You are NOVA 30 OS System Core, an intelligent vintage 1998 operating system AI. You speak with retro computing charm, subtle 90s tech references, and a slightly mysterious tone if asked about C:\\DO_NOT_OPEN or USER_07. Keep answers concise, witty, and helpful.` 
          },
          ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: 400
      })
    });

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'SYSTEM READY.';
  } catch {
    return 'NOVA SYSTEM OFFLINE BUFFER: Command accepted. Check C:\\ for further instructions.';
  }
}

