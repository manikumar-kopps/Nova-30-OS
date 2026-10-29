import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../hooks/useSound';
import { generateRetroWebPage, searchGoogleWeb, CompleteSearchResponse, SearchResultItem, RetroPageResult } from '../../utils/ai';

interface GuestPost {
  id: string;
  name: string;
  location: string;
  date: string;
  comment: string;
}

const DEFAULT_GUESTBOOK: GuestPost[] = [
  { id: '1', name: 'CyberSurfer98', location: 'Seattle, WA', date: '11/12/1998', comment: 'Awesome website!! Dial-up loaded this in only 40 seconds! Bookmarked in Netscape!' },
  { id: '2', name: 'MidiMaster', location: 'Tokyo, Japan', date: '11/10/1998', comment: 'Please add more synthesized SoundBlaster tracks to Pixel Radio. Greetings from Tokyo!' },
  { id: '3', name: 'WebWizard_42', location: 'London, UK', date: '11/08/1998', comment: 'Signed! Check out my Geocities homepage under the SiliconValley neighborhood!' },
  { id: '4', name: 'Neo', location: 'Unknown', date: '11/01/1998', comment: 'Follow the white rabbit into the terminal. Type "matrix".' }
];

export default function Browser() {
  const { playClick, playNotification, playError } = useSound();
  const [url, setUrl] = useState('nova://home');
  const [addressInput, setAddressInput] = useState('nova://home');
  const [history, setHistory] = useState<string[]>(['nova://home']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusText, setStatusText] = useState('Done');

  // AI Retro Web Page State
  const [customPage, setCustomPage] = useState<RetroPageResult | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState<CompleteSearchResponse | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);
  const [searchTab, setSearchTab] = useState<'all' | 'news' | 'wiki' | 'images'>('all');

  // Guestbook state
  const [guestPosts, setGuestPosts] = useState<GuestPost[]>(() => {
    try {
      const saved = localStorage.getItem('nova-guestbook');
      return saved ? JSON.parse(saved) : DEFAULT_GUESTBOOK;
    } catch {
      return DEFAULT_GUESTBOOK;
    }
  });
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [guestComment, setGuestComment] = useState('');

  // Pixel Radio Station in browser
  const [radioStation, setRadioStation] = useState<'chiptune' | 'synthwave' | 'ambient'>('chiptune');
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const radioOscRef = useRef<any>(null);
  const radioTimerRef = useRef<any>(null);

  // Free RAM joke state
  const [ramProgress, setRamProgress] = useState(0);
  const [ramDownloading, setRamDownloading] = useState(false);

  const BUILTIN_PAGES = [
    'nova://home', 'nova://guestbook', 'nova://radio', 'nova://archive',
    'nova://free-ram', 'nova://hamster-dance', 'nova://space-jam-fan', 'nova://alien-conspiracy'
  ];

  const navigateTo = async (newUrl: string) => {
    playClick();
    setAddressInput(newUrl);
    setIsLoading(true);
    setLoadingProgress(10);
    setStatusText(`Connecting to ${newUrl}...`);

    // If it's a search URL
    if (newUrl.startsWith('nova://search')) {
      const match = newUrl.match(/q=([^&]+)/);
      const queryParam = match ? decodeURIComponent(match[1]) : '';
      if (queryParam) {
        executeSearch(queryParam);
      }
    } else if (!BUILTIN_PAGES.includes(newUrl)) {
      // Custom internet URL requested -> fetch with Azure OpenAI or procedural fallback!
      generateRetroWebPage(newUrl).then(page => {
        setCustomPage(page);
      }).catch(() => {
        setCustomPage(null);
      });
    } else {
      setCustomPage(null);
    }

    let p = 10;
    const interval = setInterval(() => {
      p += 30;
      setLoadingProgress(Math.min(100, p));
      if (p >= 40) setStatusText('Transferring data from host via Azure Gateway...');
      if (p >= 100) {
        clearInterval(interval);
        setUrl(newUrl);
        setIsLoading(false);
        setStatusText('Done');

        // Update history
        const updated = history.slice(0, historyIdx + 1);
        updated.push(newUrl);
        setHistory(updated);
        setHistoryIdx(updated.length - 1);
      }
    }, 70);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      playClick();
      const prev = historyIdx - 1;
      setHistoryIdx(prev);
      setUrl(history[prev]);
      setAddressInput(history[prev]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      playClick();
      const next = historyIdx + 1;
      setHistoryIdx(next);
      setUrl(history[next]);
      setAddressInput(history[next]);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = addressInput.trim();
    if (!target) return;
    if (!target.includes('://')) {
      if (target.startsWith('www.') || target.endsWith('.com') || target.endsWith('.org')) {
        target = `nova://${target}`;
      } else {
        // search query
        setSearchQuery(target);
        navigateTo(`nova://search?q=${encodeURIComponent(target)}`);
        return;
      }
    }
    navigateTo(target);
  };

  const executeSearch = async (q: string) => {
    setSearchQuery(q);
    setStatusText(`Searching web index for "${q}" via Google Search & Azure AI...`);
    const resp = await searchGoogleWeb(q);
    setSearchData(resp);
    setSearchResults(resp.results);
    setStatusText(`Done (${resp.totalResults.toLocaleString()} results found)`);
  };

  // Radio sound generator
  const toggleRadio = () => {
    playClick();
    if (isRadioPlaying) {
      if (radioTimerRef.current) clearInterval(radioTimerRef.current);
      setIsRadioPlaying(false);
    } else {
      setIsRadioPlaying(true);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const freqs = radioStation === 'chiptune' ? [523.25, 659.25, 783.99, 1046.5] :
                      radioStation === 'synthwave' ? [220, 261.63, 329.63, 440] : [130.81, 164.81, 196, 261.63];
        let step = 0;
        radioTimerRef.current = setInterval(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = radioStation === 'chiptune' ? 'square' : 'triangle';
          osc.frequency.value = freqs[step % freqs.length];
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.18);
          step++;
        }, 220);
      } catch {
        // audio fallback
      }
    }
  };

  useEffect(() => {
    return () => {
      if (radioTimerRef.current) clearInterval(radioTimerRef.current);
    };
  }, []);

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestComment.trim()) {
      playError();
      return;
    }

    playNotification();
    const newPost: GuestPost = {
      id: String(Date.now()),
      name: guestName.trim(),
      location: guestLocation.trim() || 'Cyberspace',
      date: new Date().toLocaleDateString(),
      comment: guestComment.trim()
    };

    const updated = [newPost, ...guestPosts];
    setGuestPosts(updated);
    try {
      localStorage.setItem('nova-guestbook', JSON.stringify(updated));
    } catch {}

    setGuestName('');
    setGuestLocation('');
    setGuestComment('');
  };

  const startRamDownload = () => {
    playNotification();
    setRamDownloading(true);
    setRamProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setRamProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setRamDownloading(false);
        alert("SUCCESS! 64MB of Virtual RAM has been successfully downloaded into your imagination!");
      }
    }, 300);
  };

  const renderPage = () => {
    if (url === 'nova://home') {
      return (
        <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100%', fontFamily: '"Times New Roman", Times, serif' }}>
          {/* 90s Banner Header */}
          <div style={{ borderBottom: '3px double #000080', paddingBottom: '16px', marginBottom: '20px' }}>
            <h1 style={{ color: '#000080', fontSize: '36px', margin: '0 0 6px 0', letterSpacing: '1px' }}>
              🌐 NOVA Explorer Web Portal
            </h1>
            <p style={{ margin: 0, fontSize: '16px', color: '#800000', fontStyle: 'italic', fontWeight: 'bold' }}>
              Welcome to the World Wide Web of 1998!
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#666666' }}>
              Best viewed with 256 colors at 800x600 resolution • Netscape / IE Compatible
            </p>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            <div style={cardStyle} onClick={() => navigateTo('nova://search')}>
              <span style={{ fontSize: '24px' }}>🔍</span>
              <div>
                <strong>NOVA Search</strong>
                <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>Search the World Wide Web</p>
              </div>
            </div>

            <div style={cardStyle} onClick={() => navigateTo('nova://guestbook')}>
              <span style={{ fontSize: '24px' }}>📖</span>
              <div>
                <strong>Community Guestbook</strong>
                <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>Sign our interactive guestbook</p>
              </div>
            </div>

            <div style={cardStyle} onClick={() => navigateTo('nova://radio')}>
              <span style={{ fontSize: '24px' }}>📻</span>
              <div>
                <strong>Pixel Radio</strong>
                <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>Stream 8-bit chiptune audio</p>
              </div>
            </div>

            <div style={cardStyle} onClick={() => navigateTo('nova://archive')}>
              <span style={{ fontSize: '24px' }}>🏛️</span>
              <div>
                <strong>90s Web Archive</strong>
                <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>Explore archived personal pages</p>
              </div>
            </div>
          </div>

          {/* Featured Site of the Day Banner */}
          <div style={{ border: '2px dashed #008080', padding: '12px', maxWidth: '520px', margin: '0 auto 20px auto', backgroundColor: '#f0fcfc' }}>
            <strong style={{ color: '#008080' }}>🌟 FEATURED RETRO DESTINATIONS:</strong>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
              <a href="#alien" onClick={(e) => { e.preventDefault(); navigateTo('nova://alien-conspiracy'); }} style={linkStyle}>🛸 Area 51 Files</a>
              <a href="#hamster" onClick={(e) => { e.preventDefault(); navigateTo('nova://hamster-dance'); }} style={linkStyle}>🐹 Hamster Dance</a>
              <a href="#free-ram" onClick={(e) => { e.preventDefault(); navigateTo('nova://free-ram'); }} style={linkStyle}>💾 Download Free RAM</a>
            </div>
          </div>

          {/* Visitor Counter */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#000000', color: '#00ff00', padding: '4px 12px', border: '2px inset #ffffff', fontFamily: 'monospace', fontWeight: 'bold' }}>
            <span>VISITOR COUNTER:</span>
            <span style={{ color: '#ff3333' }}>[ 0 0 4 8 2 9 1 ]</span>
          </div>
        </div>
      );
    }

    if (url.startsWith('nova://search')) {
      const isInitial = !searchQuery && !searchData;

      return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100%', fontFamily: 'Arial, Helvetica, sans-serif', color: '#222222' }}>
          {isInitial ? (
            /* Classic 1998 Google Homepage */
            <div style={{ maxWidth: '640px', margin: '40px auto 20px auto', textAlign: 'center', padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '56px', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', letterSpacing: '-2px' }}>
                  <span style={{ color: '#4285F4' }}>G</span>
                  <span style={{ color: '#EA4335' }}>o</span>
                  <span style={{ color: '#FBBC05' }}>o</span>
                  <span style={{ color: '#4285F4' }}>g</span>
                  <span style={{ color: '#34A853' }}>l</span>
                  <span style={{ color: '#EA4335' }}>e</span>
                  <span style={{ color: '#4285F4' }}>!</span>
                </span>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                  Stanford University Beta Search Index (1998) • Powered by PageRank & NOVA Engine
                </div>
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) executeSearch(searchQuery); }} 
                style={{ margin: '24px auto', maxWidth: '480px' }}
              >
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search the World Wide Web or type any topic..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '2px solid #7ba7e1',
                      borderRadius: '2px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button type="submit" style={{ ...retroBtnStyle, padding: '6px 14px', fontSize: '13px', fontWeight: 'bold' }}>
                    Google Search
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const lucky = ['Quantum Computing', 'Python', 'Albert Einstein', 'Internet', 'Google'][Math.floor(Math.random() * 5)];
                      setSearchQuery(lucky);
                      executeSearch(lucky);
                    }}
                    style={{ ...retroBtnStyle, padding: '6px 14px', fontSize: '13px' }}
                  >
                    I'm Feeling Lucky
                  </button>
                </div>
              </form>

              <div style={{ marginTop: '28px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>
                  🌟 Explore popular topics across all categories:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', fontSize: '12px' }}>
                  {['Quantum Computing', 'Python', 'Albert Einstein', 'Internet', 'Google', 'Space Exploration', 'Artificial Intelligence', 'World History'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setSearchQuery(tag); executeSearch(tag); }}
                      style={{
                        background: '#f1f3f4',
                        border: '1px solid #dadce0',
                        borderRadius: '12px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: '#1a0dab'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '40px', fontSize: '11px', color: '#888' }}>
                <p>Search over 25,000,000 indexed documents • Universal Fact & Knowledge Architecture</p>
                <p>© 1998 Google Inc. / NOVA Information Systems</p>
              </div>
            </div>
          ) : (
            /* Google Search Results Page */
            <div style={{ padding: '16px 20px', minHeight: '100%' }}>
              {/* Header Bar with Logo and Search Form */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #ebebeb', paddingBottom: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div 
                  onClick={() => { setSearchQuery(''); setSearchData(null); }}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', userSelect: 'none' }}
                >
                  <span style={{ fontSize: '26px', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', letterSpacing: '-1px' }}>
                    <span style={{ color: '#4285F4' }}>G</span>
                    <span style={{ color: '#EA4335' }}>o</span>
                    <span style={{ color: '#FBBC05' }}>o</span>
                    <span style={{ color: '#4285F4' }}>g</span>
                    <span style={{ color: '#34A853' }}>l</span>
                    <span style={{ color: '#EA4335' }}>e</span>
                    <span style={{ color: '#4285F4' }}>!</span>
                  </span>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) executeSearch(searchQuery); }} 
                  style={{ display: 'flex', gap: '6px', flex: 1, maxWidth: '560px' }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '13px', border: '1px solid #b2b2b2', borderRadius: '2px' }}
                  />
                  <button type="submit" style={{ ...retroBtnStyle, padding: '4px 12px' }}>Search</button>
                </form>

                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#1a0dab' }}>
                  <span 
                    onClick={() => setSearchTab('all')} 
                    style={{ cursor: 'pointer', fontWeight: searchTab === 'all' ? 'bold' : 'normal', borderBottom: searchTab === 'all' ? '2px solid #1a0dab' : 'none' }}
                  >
                    All
                  </span>
                  <span 
                    onClick={() => setSearchTab('wiki')} 
                    style={{ cursor: 'pointer', fontWeight: searchTab === 'wiki' ? 'bold' : 'normal', borderBottom: searchTab === 'wiki' ? '2px solid #1a0dab' : 'none' }}
                  >
                    Encyclopedia
                  </span>
                  <span 
                    onClick={() => setSearchTab('news')} 
                    style={{ cursor: 'pointer', fontWeight: searchTab === 'news' ? 'bold' : 'normal', borderBottom: searchTab === 'news' ? '2px solid #1a0dab' : 'none' }}
                  >
                    News
                  </span>
                </div>
              </div>

              {/* Stats Line */}
              <div style={{ fontSize: '12px', color: '#70757a', marginBottom: '16px' }}>
                About {searchData?.totalResults.toLocaleString() || '148,000'} results ({searchData?.searchTimeSec || '0.24'} seconds)
              </div>

              {/* Content Grid: Main Results (Left) + Knowledge Graph (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: searchData?.knowledgeCard ? 'minmax(0, 1fr) 280px' : '1fr', gap: '24px' }}>
                {/* Left Column: Direct Answer, People Also Ask, Search Results */}
                <div>
                  {/* Direct Answer Box / Featured Snippet */}
                  {searchData?.directAnswer && (
                    <div style={{ border: '1px solid #dfe1e5', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        💡 Direct Overview & Answer
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.55', color: '#202124' }}>
                        {searchData.directAnswer}
                      </p>
                    </div>
                  )}

                  {/* People Also Ask Accordion */}
                  {searchData?.peopleAlsoAsk && searchData.peopleAlsoAsk.length > 0 && (
                    <div style={{ border: '1px solid #dfe1e5', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#f1f3f4', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#202124' }}>
                        ❓ People Also Ask
                      </div>
                      {searchData.peopleAlsoAsk.map((item, idx) => (
                        <div key={idx} style={{ borderTop: idx > 0 ? '1px solid #ebebeb' : 'none' }}>
                          <button
                            type="button"
                            onClick={() => setExpandedFaqIdx(expandedFaqIdx === idx ? null : idx)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '10px 12px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: '#1a0dab',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span>{item.question}</span>
                            <span style={{ fontSize: '11px', color: '#70757a' }}>{expandedFaqIdx === idx ? '▲' : '▼'}</span>
                          </button>
                          {expandedFaqIdx === idx && (
                            <div style={{ padding: '0 12px 10px 12px', fontSize: '13px', color: '#3c4043', lineHeight: '1.5' }}>
                              {item.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Organic Search Results */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {searchResults.map((res, i) => (
                      <div key={i} style={{ maxWidth: '600px' }}>
                        <div style={{ fontSize: '11px', color: '#202124', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#006621' }}>{res.displayUrl || res.url}</span>
                          {res.category && (
                            <span style={{ background: '#e8f0fe', color: '#1a73e8', padding: '1px 5px', borderRadius: '3px', fontSize: '10px' }}>
                              {res.category}
                            </span>
                          )}
                        </div>
                        <a 
                          href={res.url} 
                          onClick={(e) => { e.preventDefault(); navigateTo(res.url); }}
                          style={{ fontSize: '16px', color: '#1a0dab', fontWeight: '500', textDecoration: 'none', lineHeight: '1.3', display: 'inline-block' }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {res.title}
                        </a>
                        <div style={{ fontSize: '13px', color: '#4d5156', marginTop: '3px', lineHeight: '1.5' }}>
                          {res.snippet}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Related Searches */}
                  {searchData?.relatedSearches && searchData.relatedSearches.length > 0 && (
                    <div style={{ marginTop: '28px', borderTop: '1px solid #ebebeb', paddingTop: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#202124', marginBottom: '10px' }}>
                        Searches related to {searchQuery}:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {searchData.relatedSearches.map((rel, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSearchQuery(rel); executeSearch(rel); }}
                            style={{
                              background: '#f1f3f4',
                              border: '1px solid #dadce0',
                              borderRadius: '16px',
                              padding: '5px 12px',
                              fontSize: '12px',
                              color: '#1a0dab',
                              cursor: 'pointer'
                            }}
                          >
                            🔎 {rel}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Knowledge Graph Card */}
                {searchData?.knowledgeCard && (
                  <div style={{ border: '1px solid #dfe1e5', borderRadius: '8px', padding: '16px', height: 'fit-content', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '32px' }}>{searchData.knowledgeCard.imageEmoji || '📖'}</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#202124' }}>{searchData.knowledgeCard.title}</h3>
                        <div style={{ fontSize: '12px', color: '#70757a' }}>{searchData.knowledgeCard.subtitle}</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#3c4043', lineHeight: '1.5', margin: '0 0 14px 0', borderBottom: '1px solid #ebebeb', paddingBottom: '12px' }}>
                      {searchData.knowledgeCard.description}
                    </p>

                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ display: 'block', marginBottom: '6px', color: '#202124' }}>Quick Facts:</strong>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                          {Object.entries(searchData.knowledgeCard.facts).map(([k, v], idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f3f4' }}>
                              <td style={{ padding: '4px 0', color: '#70757a', width: '40%', verticalAlign: 'top' }}>{k}</td>
                              <td style={{ padding: '4px 0', color: '#202124', fontWeight: '500' }}>{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    /* Dedicated Encyclopedic Article Reader for any wiki/guide/scholar/topic link */
    if (url.startsWith('nova://wiki/') || url.startsWith('nova://guide/') || url.startsWith('nova://scholar/') || url.startsWith('nova://faq/')) {
      const topic = decodeURIComponent(url.replace(/^nova:\/\/[^/]+\//, '')).replace(/[-_]/g, ' ');
      const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      return (
        <div style={{ padding: '24px 32px', backgroundColor: '#ffffff', minHeight: '100%', color: '#222222', fontFamily: '"Georgia", serif', maxWidth: '840px', margin: '0 auto', lineHeight: '1.6' }}>
          <div style={{ borderBottom: '2px solid #a2a9b1', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: '#000000', fontFamily: '"Linux Libertine", Georgia, serif' }}>
                {capitalizedTopic}
              </h1>
              <div style={{ fontSize: '12px', color: '#54595d', fontStyle: 'italic', marginTop: '2px' }}>
                From NOVA Universal Encyclopedia, the free collaborative knowledge archive
              </div>
            </div>
            <button 
              onClick={() => { setSearchQuery(topic); navigateTo(`nova://search?q=${encodeURIComponent(topic)}`); }} 
              style={{ ...retroBtnStyle, fontSize: '11px' }}
            >
              🔍 Google Search
            </button>
          </div>

          <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #a2a9b1', padding: '12px 16px', borderRadius: '2px', marginBottom: '20px', fontSize: '13px' }}>
            <strong>Article Summary:</strong> <em>{capitalizedTopic}</em> represents an essential domain of modern knowledge, documentation, and research within global archives.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #eaecf0', paddingBottom: '4px', color: '#000000', margin: '16px 0 8px 0' }}>
                1. Overview & Origins
              </h2>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0' }}>
                The study and documentation of <strong>{capitalizedTopic}</strong> traces through centuries of theoretical foundations and technological expansion. Scholars, researchers, and engineers have contributed to structured frameworks establishing its primary significance today.
              </p>

              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #eaecf0', paddingBottom: '4px', color: '#000000', margin: '20px 0 8px 0' }}>
                2. Key Concepts & Architecture
              </h2>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0' }}>
                Fundamental principles underlying {capitalizedTopic} involve systematic models, empirical observations, and standardized operational methodologies. Modern implementations rely on robust analytical workflows.
              </p>

              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #eaecf0', paddingBottom: '4px', color: '#000000', margin: '20px 0 8px 0' }}>
                3. Global Impact & Future Outlook
              </h2>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0' }}>
                Ongoing discoveries continually reshape public and scientific understanding of {capitalizedTopic}. Cross-disciplinary collaborations across computing, physical sciences, and digital networks remain active frontiers.
              </p>
            </div>

            {/* Encyclopedia Infobox */}
            <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #a2a9b1', padding: '12px', fontSize: '12px', borderRadius: '2px' }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #a2a9b1', paddingBottom: '6px', marginBottom: '8px' }}>
                {capitalizedTopic}
              </div>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eaecf0' }}>
                    <td style={{ padding: '4px 0', color: '#54595d', fontWeight: 'bold' }}>Type</td>
                    <td style={{ padding: '4px 0' }}>Verified Subject</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eaecf0' }}>
                    <td style={{ padding: '4px 0', color: '#54595d', fontWeight: 'bold' }}>Indexing</td>
                    <td style={{ padding: '4px 0' }}>NOVA Knowledge 98</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eaecf0' }}>
                    <td style={{ padding: '4px 0', color: '#54595d', fontWeight: 'bold' }}>Status</td>
                    <td style={{ padding: '4px 0' }}>Peer Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '30px', borderTop: '1px solid #a2a9b1', paddingTop: '12px', fontSize: '12px', color: '#54595d' }}>
            <a href="nova://home" onClick={(e) => { e.preventDefault(); navigateTo('nova://home'); }} style={linkStyle}>« Return to NOVA Portal</a>
            {' • '}
            <a href="nova://search" onClick={(e) => { e.preventDefault(); navigateTo('nova://search'); }} style={linkStyle}>Search with Google 98</a>
          </div>
        </div>
      );
    }


    if (url === 'nova://guestbook') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fcfcfc', minHeight: '100%', fontFamily: '"MS Sans Serif", Tahoma, sans-serif' }}>
          <h2 style={{ textAlign: 'center', color: '#800080', margin: '0 0 6px 0' }}>📖 The Official NOVA Guestbook</h2>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#555', margin: '0 0 16px 0' }}>
            Leave your mark on the 1998 World Wide Web! All messages are stored permanently.
          </p>

          {/* Guestbook Submission Form */}
          <form 
            onSubmit={handleGuestbookSubmit}
            style={{ 
              backgroundColor: '#e8e8e8', 
              border: '2px outset #ffffff', 
              padding: '14px', 
              maxWidth: '480px', 
              margin: '0 auto 20px auto' 
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Name / Handle:</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Neo_98"
                  style={{ width: '100%', padding: '3px', border: '2px inset #dfdfdf', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Location:</label>
                <input
                  type="text"
                  value={guestLocation}
                  onChange={(e) => setGuestLocation(e.target.value)}
                  placeholder="e.g. Austin, Texas"
                  style={{ width: '100%', padding: '3px', border: '2px inset #dfdfdf', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Your Message:</label>
              <textarea
                value={guestComment}
                onChange={(e) => setGuestComment(e.target.value)}
                placeholder="Write your note here..."
                rows={3}
                style={{ width: '100%', padding: '3px', border: '2px inset #dfdfdf', boxSizing: 'border-box', resize: 'vertical' }}
                required
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <button type="submit" style={retroBtnStyle}>✍️ Sign Guestbook</button>
            </div>
          </form>

          {/* Guestbook Posts Stream */}
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {guestPosts.map((post) => (
              <div 
                key={post.id}
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px inset #dfdfdf', 
                  padding: '10px',
                  borderRadius: '2px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', paddingBottom: '4px', marginBottom: '6px' }}>
                  <strong style={{ color: '#000080' }}>👤 {post.name} ({post.location})</strong>
                  <span style={{ fontSize: '10px', color: '#888' }}>{post.date}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#222' }}>{post.comment}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (url === 'nova://radio') {
      return (
        <div style={{ padding: '24px', backgroundColor: '#0a0a0a', color: '#00ff41', minHeight: '100%', fontFamily: '"Courier New", Courier, monospace', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 6px 0', color: '#00ff41' }}>📻 Pixel Radio 98</h1>
          <p style={{ color: '#88ff88', fontSize: '13px', margin: '0 0 16px 0' }}>Real-Time 8-Bit Web Radio Transmitter</p>

          <div style={{ border: '2px inset #333', padding: '16px', maxWidth: '400px', margin: '0 auto 20px auto', backgroundColor: '#111' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: isRadioPlaying ? '#00ff41' : '#ff4444', marginBottom: '8px' }}>
              STATUS: {isRadioPlaying ? `● BROADCASTING (${radioStation.toUpperCase()})` : '○ STATION OFFLINE'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
              <button 
                onClick={() => setRadioStation('chiptune')}
                style={{ ...retroBtnStyle, backgroundColor: radioStation === 'chiptune' ? '#000080' : '#c0c0c0', color: radioStation === 'chiptune' ? '#fff' : '#000' }}
              >
                Chiptune FM
              </button>
              <button 
                onClick={() => setRadioStation('synthwave')}
                style={{ ...retroBtnStyle, backgroundColor: radioStation === 'synthwave' ? '#000080' : '#c0c0c0', color: radioStation === 'synthwave' ? '#fff' : '#000' }}
              >
                SynthWave 98
              </button>
              <button 
                onClick={() => setRadioStation('ambient')}
                style={{ ...retroBtnStyle, backgroundColor: radioStation === 'ambient' ? '#000080' : '#c0c0c0', color: radioStation === 'ambient' ? '#fff' : '#000' }}
              >
                Ambient 1998
              </button>
            </div>

            <button 
              onClick={toggleRadio}
              style={{ ...retroBtnStyle, padding: '6px 20px', fontWeight: 'bold', fontSize: '13px' }}
            >
              {isRadioPlaying ? '⏹ STOP AUDIO STREAM' : '▶ TUNE IN & LISTEN'}
            </button>
          </div>

          {/* Equalizer animation */}
          {isRadioPlaying && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '40px', alignItems: 'flex-end', marginTop: '10px' }}>
              {[25, 40, 15, 35, 20, 45, 30, 22, 38, 18].map((h, i) => (
                <div key={i} style={{ width: '12px', height: `${h}px`, backgroundColor: '#00ff41' }} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (url === 'nova://alien-conspiracy') {
      return (
        <div style={{ padding: '24px', backgroundColor: '#000022', color: '#33ff33', minHeight: '100%', fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
          <h1 style={{ textAlign: 'center', color: '#ff00ff', textShadow: '2px 2px #00ffff' }}>🛸 AREA 51 & ALIEN CONSPIRACY BBS 🛸</h1>
          <p style={{ textAlign: 'center', color: '#ffff00', fontStyle: 'italic' }}>
            WARNING: You are accessing confidential unclassified intelligence documents!
          </p>
          <div style={{ border: '3px ridge #ff00ff', padding: '16px', maxWidth: '520px', margin: '20px auto', backgroundColor: '#000' }}>
            <h3 style={{ color: '#00ffff' }}>RECORD #98-X:</h3>
            <p>On November 12, 1998, strange electromagnetic signals were received in Sector 4.</p>
            <p>The terminal showed a browser operating from the future year 2026.</p>
            <p style={{ color: '#ff3333' }}>THE TRUTH IS IN THE NOVA TERMINAL. TYPE "matrix" OR "devroom" TO VERIFY.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => navigateTo('nova://home')} style={retroBtnStyle}>◀ Return to Portal</button>
          </div>
        </div>
      );
    }

    if (url === 'nova://hamster-dance') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffff99', textAlign: 'center', minHeight: '100%' }}>
          <h1 style={{ color: '#ff0066', fontSize: '32px' }}>🐹 THE HAMSTER DANCE 1998 🐹</h1>
          <p style={{ color: '#000080', fontWeight: 'bold' }}>Di-da-di-da-di-di-do-do! Welcome to the happiest page on the internet!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '400px', margin: '24px auto', fontSize: '36px' }}>
            {['🐹', '🐭', '🐹', '🐭', '🐹', '🐭', '🐹', '🐭'].map((emoji, i) => (
              <div 
                key={i} 
                style={{ 
                  animation: `bounceHamster 0.4s infinite alternate ${i * 0.1}s`,
                  display: 'inline-block'
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <style>{`@keyframes bounceHamster { from { transform: translateY(0); } to { transform: translateY(-16px); } }`}</style>
          <button onClick={() => navigateTo('nova://home')} style={retroBtnStyle}>◀ Back to Portal</button>
        </div>
      );
    }

    if (url === 'nova://free-ram') {
      return (
        <div style={{ padding: '24px', backgroundColor: '#ffffff', minHeight: '100%', fontFamily: '"MS Sans Serif", sans-serif', textAlign: 'center' }}>
          <h1 style={{ color: '#000080' }}>💾 FreeRAM 98 Downloader</h1>
          <p>Instantly expand your PC's memory without opening your computer case!</p>

          <div style={{ border: '2px outset #ffffff', backgroundColor: '#c0c0c0', padding: '16px', maxWidth: '380px', margin: '20px auto' }}>
            <h3>Selected Package: 64 MB EDO RAM</h3>
            <p style={{ fontSize: '11px', color: '#444' }}>Compatible with Intel 486, Pentium, and NOVA 30 OS.</p>

            {ramDownloading ? (
              <div style={{ margin: '16px 0' }}>
                <p style={{ fontSize: '11px' }}>Downloading Virtual RAM: {ramProgress}%</p>
                <div style={{ height: '16px', backgroundColor: '#fff', border: '2px inset #dfdfdf', padding: '1px' }}>
                  <div style={{ height: '100%', width: `${ramProgress}%`, backgroundColor: '#000080' }} />
                </div>
              </div>
            ) : (
              <button onClick={startRamDownload} style={{ ...retroBtnStyle, padding: '6px 16px', fontWeight: 'bold' }}>
                ⬇️ Download 64MB RAM Now!
              </button>
            )}
          </div>
        </div>
      );
    }

    if (url === 'nova://archive') {
      return (
        <div style={{ padding: '24px', backgroundColor: '#fcfcfc', minHeight: '100%', fontFamily: '"Times New Roman", Times, serif' }}>
          <h1 style={{ color: '#000080', borderBottom: '2px solid #808080', paddingBottom: '8px' }}>🏛️ 1990s Web Archive</h1>
          <p>Preserving the earliest frontiers of cyberspace:</p>
          <ul style={{ lineHeight: '1.8' }}>
            <li><a href="#alien" onClick={(e) => { e.preventDefault(); navigateTo('nova://alien-conspiracy'); }} style={linkStyle}>Area 51 & Alien Telemetry Files (1997)</a></li>
            <li><a href="#hamster" onClick={(e) => { e.preventDefault(); navigateTo('nova://hamster-dance'); }} style={linkStyle}>The Official Hamster Dance (1998)</a></li>
            <li><a href="#freeram" onClick={(e) => { e.preventDefault(); navigateTo('nova://free-ram'); }} style={linkStyle}>FreeRAM Software Distribution Portal</a></li>
            <li><a href="#guest" onClick={(e) => { e.preventDefault(); navigateTo('nova://guestbook'); }} style={linkStyle}>NOVA Community Guestbook</a></li>
            <li><a href="#radio" onClick={(e) => { e.preventDefault(); navigateTo('nova://radio'); }} style={linkStyle}>Pixel Radio Webcast</a></li>
          </ul>
        </div>
      );
    }

    // Render Custom / AI-synthesized 1998 page
    if (customPage) {
      return (
        <div style={{ padding: '16px', backgroundColor: '#000033', minHeight: '100%', color: '#ffffff' }}>
          <div style={{ borderBottom: '2px dashed #00ffff', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#00ffcc' }}>
              🌐 {customPage.isAi ? '⚡ AZURE OPENAI GPT-4.1-MINI EMULATED 1998 WEB' : '💾 PROCEDURAL RETRO ARCHIVE'}
            </span>
            <span style={{ fontSize: '10px', color: '#ffcc00' }}>
              HOST: {url} • 56.6K DIALUP
            </span>
          </div>

          <div dangerouslySetInnerHTML={{ __html: customPage.bodyHtml }} />

          {customPage.links && customPage.links.length > 0 && (
            <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#000022', border: '1px solid #00ffff' }}>
              <strong style={{ color: '#ffff00' }}>CYBER-LINKS & WEBRINGS:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                {customPage.links.map((lnk, i) => (
                  <button
                    key={i}
                    onClick={() => navigateTo(lnk.url)}
                    style={{ background: '#000066', color: '#00ffff', border: '1px outset #00ffff', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    🔗 {lnk.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default 404
    return (
      <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100%', fontFamily: '"MS Sans Serif", sans-serif' }}>
        <h2 style={{ color: '#cc0000' }}>⚠️ 404 Web Address Not Found</h2>
        <p>The server at <strong>{url}</strong> could not be located on the NOVA network.</p>
        <button onClick={() => navigateTo('nova://home')} style={retroBtnStyle}>🏠 Return Home</button>
      </div>
    );
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: '#c0c0c0', 
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif', 
        fontSize: '11px',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
      role="region"
      aria-label="NOVA Explorer Web Browser"
    >
      {/* Menu Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080', padding: '1px 4px', gap: '8px' }}>
        <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
        <span style={{ cursor: 'pointer' }}><u>E</u>dit</span>
        <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
        <span style={{ cursor: 'pointer' }}><u>G</u>o</span>
        <span style={{ cursor: 'pointer' }}><u>F</u>avorites</span>
        <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
      </div>

      {/* Main Toolbar with Classic IE Icon Buttons */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2px', 
          padding: '3px 4px', 
          borderBottom: '1px solid #808080',
          backgroundColor: '#c0c0c0'
        }}
      >
        <button style={toolbarBtnStyle} onClick={goBack} disabled={historyIdx === 0} title="Back">
          <span>◀</span> Back
        </button>
        <button style={toolbarBtnStyle} onClick={goForward} disabled={historyIdx >= history.length - 1} title="Forward">
          <span>▶</span> Forward
        </button>
        <button style={toolbarBtnStyle} onClick={() => setIsLoading(false)} title="Stop">
          <span>✕</span> Stop
        </button>
        <button style={toolbarBtnStyle} onClick={() => navigateTo(url)} title="Refresh">
          <span>↻</span> Refresh
        </button>
        <button style={toolbarBtnStyle} onClick={() => navigateTo('nova://home')} title="Home">
          <span>🏠</span> Home
        </button>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', margin: '0 4px' }} />
        <button style={toolbarBtnStyle} onClick={() => navigateTo('nova://search')} title="Search">
          <span>🔍</span> Search
        </button>
        <button style={toolbarBtnStyle} onClick={() => navigateTo('nova://archive')} title="Favorites">
          <span>⭐</span> Favorites
        </button>
      </div>

      {/* Address Bar Row */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '3px 6px', 
          borderBottom: '1px solid #808080', 
          backgroundColor: '#c0c0c0',
          gap: '6px'
        }}
      >
        <span style={{ color: '#444444', fontWeight: 'bold' }}>Address</span>
        <form onSubmit={handleAddressSubmit} style={{ flex: 1, display: 'flex', margin: 0, padding: 0 }}>
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '2px 6px', 
              border: '2px inset #dfdfdf', 
              backgroundColor: '#ffffff',
              outline: 'none',
              fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
              fontSize: '11px',
              height: '22px',
              boxSizing: 'border-box'
            }}
            aria-label="Browser address URL input"
          />
        </form>
        <button onClick={handleAddressSubmit} style={goBtnStyle}>Go</button>
        <div 
          style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px inset #dfdfdf', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#000080', 
            color: '#ffffff',
            fontSize: '11px',
            animation: isLoading ? 'spinGlobe 0.8s linear infinite' : 'none'
          }}
          title={isLoading ? "Loading..." : "Idle"}
        >
          🌐
        </div>
      </div>

      {/* Bookmarks Quick Bar */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '2px 8px', 
          borderBottom: '2px ridge #dfdfdf', 
          backgroundColor: '#c0c0c0',
          fontSize: '11px' 
        }}
      >
        <span style={bookmarkLinkStyle} onClick={() => navigateTo('nova://home')}>🏠 Portal</span>
        <span style={bookmarkLinkStyle} onClick={() => navigateTo('nova://search')}>🔍 Search</span>
        <span style={bookmarkLinkStyle} onClick={() => navigateTo('nova://guestbook')}>📖 Guestbook</span>
        <span style={bookmarkLinkStyle} onClick={() => navigateTo('nova://radio')}>📻 Pixel Radio</span>
        <span style={bookmarkLinkStyle} onClick={() => navigateTo('nova://archive')}>🏛️ Web Archive</span>
      </div>

      {/* Rendered Web Content */}
      <div 
        style={{ 
          flex: 1, 
          overflow: 'auto', 
          backgroundColor: '#ffffff', 
          border: '2px inset #dfdfdf', 
          margin: '2px',
          boxSizing: 'border-box'
        }}
      >
        {renderPage()}
      </div>

      {/* Status Bar */}
      <div 
        style={{ 
          borderTop: '2px inset #dfdfdf', 
          padding: '2px 6px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#c0c0c0',
          fontSize: '11px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{statusText}</span>
          {isLoading && (
            <div style={{ width: '80px', height: '10px', border: '1px solid #808080', backgroundColor: '#fff', padding: '1px' }}>
              <div style={{ width: `${loadingProgress}%`, height: '100%', backgroundColor: '#000080' }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🔒 Internet Zone</span>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: '2px outset #ffffff',
  backgroundColor: '#c0c0c0',
  padding: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'left'
};

const linkStyle: React.CSSProperties = {
  color: '#0000cc',
  textDecoration: 'underline',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const bookmarkLinkStyle: React.CSSProperties = {
  cursor: 'pointer',
  color: '#000080',
  textDecoration: 'underline'
};

const retroBtnStyle: React.CSSProperties = {
  backgroundColor: '#c0c0c0',
  border: '2px outset #ffffff',
  padding: '3px 10px',
  cursor: 'pointer',
  fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
  fontSize: '11px',
  outline: 'none'
};

const toolbarBtnStyle: React.CSSProperties = {
  backgroundColor: '#c0c0c0',
  border: '1px outset #ffffff',
  padding: '2px 6px',
  cursor: 'pointer',
  fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  height: '24px',
  outline: 'none',
  boxSizing: 'border-box'
};

const goBtnStyle: React.CSSProperties = {
  backgroundColor: '#c0c0c0',
  border: '2px outset #ffffff',
  padding: '2px 8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '11px',
  height: '22px',
  boxSizing: 'border-box'
};
