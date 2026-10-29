import React, { useState, useEffect } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { mysteryEngine } from '../../mystery/mysteryEngine';

type FileItem = {
  name: string;
  type: 'folder' | 'file';
  ext?: string;
  size?: string;
  modified: string;
  children?: FileItem[];
};

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string[]>(['C:\\']);
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('icons');
  const [mysteryState, setMysteryState] = useState(mysteryEngine.getState());

  useEffect(() => {
    return mysteryEngine.subscribe(setMysteryState);
  }, []);
  
  let openWindow: any = null;
  try {
    const windowContext = useWindows();
    openWindow = windowContext.openWindow;
  } catch (e) {
    // context fallback
  }

  // Build dynamic file system based on mystery state
  const buildFileSystem = (): FileItem => {
    const rootChildren: FileItem[] = [
      {
        name: 'Documents', type: 'folder', modified: '1998-05-12 14:30', children: [
          { name: 'readme.txt', type: 'file', ext: 'txt', size: '2 KB', modified: '1998-06-01 10:15' },
          { name: 'notes.txt', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-06-01 11:20' },
          { name: 'todo.txt', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-06-02 09:00' },
          { name: 'secret.txt', type: 'file', ext: 'txt', size: '5 KB', modified: '1998-06-05 16:45' }
        ]
      },
      {
        name: 'Downloads', type: 'folder', modified: '1998-06-10 11:20', children: [
          { name: 'setup.exe', type: 'file', ext: 'exe', size: '1420 KB', modified: '1998-06-11 08:30' },
          { name: 'wallpaper.bmp', type: 'file', ext: 'bmp', size: '300 KB', modified: '1998-06-12 18:00' }
        ]
      },
      {
        name: 'Games', type: 'folder', modified: '1998-05-20 20:00', children: [
          { name: 'Snake.exe', type: 'file', ext: 'exe', size: '45 KB', modified: '1998-05-21 21:00' },
          { name: 'Minesweeper.exe', type: 'file', ext: 'exe', size: '120 KB', modified: '1998-05-22 19:30' },
          { name: 'Breakout.exe', type: 'file', ext: 'exe', size: '64 KB', modified: '1998-05-23 10:15' },
          { name: 'Asteroids.exe', type: 'file', ext: 'exe', size: '72 KB', modified: '1998-05-23 14:20' },
          { name: 'Pong.exe', type: 'file', ext: 'exe', size: '30 KB', modified: '1998-05-23 18:45' },
          { name: 'SpaceInvaders.exe', type: 'file', ext: 'exe', size: '200 KB', modified: '1998-05-24 22:10' },
          { name: 'TicTacToe.exe', type: 'file', ext: 'exe', size: '20 KB', modified: '1998-05-25 15:20' },
          { name: 'Solitaire.exe', type: 'file', ext: 'exe', size: '150 KB', modified: '1998-05-26 14:00' }
        ]
      },
      {
        name: 'Music', type: 'folder', modified: '1998-07-01 10:00', children: [
          { name: 'track01.midi', type: 'file', ext: 'midi', size: '12 KB', modified: '1998-07-02 11:15' },
          { name: 'track02.midi', type: 'file', ext: 'midi', size: '15 KB', modified: '1998-07-03 12:30' }
        ]
      },
      {
        name: 'Pictures', type: 'folder', modified: '1998-08-15 09:00', children: [
          { name: 'desktop.bmp', type: 'file', ext: 'bmp', size: '800 KB', modified: '1998-08-16 10:00' }
        ]
      },
      {
        name: 'System', type: 'folder', modified: '1998-01-01 00:00', children: [
          { name: 'nova.sys', type: 'file', ext: 'sys', size: '1024 KB', modified: '1998-01-01 00:01' },
          { name: 'config.sys', type: 'file', ext: 'sys', size: '1 KB', modified: '1998-01-01 00:02' },
          { name: 'autoexec.bat', type: 'file', ext: 'bat', size: '1 KB', modified: '1998-01-01 00:03' },
          {
            name: 'Nothing', type: 'folder', modified: '1998-11-04 23:59', children: [
              { name: 'README.TXT', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-11-04 23:59' },
              { name: 'INCIDENT.LOG', type: 'file', ext: 'txt', size: '3 KB', modified: '1998-11-04 23:59' }
            ]
          }
        ]
      },
      {
        name: 'Users', type: 'folder', modified: '1998-09-01 08:00', children: [
          {
            name: 'Explorer', type: 'folder', modified: '1998-09-01 08:05', children: [
              { name: 'profile.txt', type: 'file', ext: 'txt', size: '3 KB', modified: '1998-09-02 09:10' }
            ]
          },
          ...(mysteryState.mysteryLevel >= 5 || mysteryState.trueEndingUnlocked ? [
            { name: 'YOU.TXT', type: 'file' as const, ext: 'txt', size: '1 KB', modified: 'Today' }
          ] : [])
        ]
      }
    ];

    // Conditionally include DO_NOT_OPEN
    if (mysteryState.forbiddenFolderUnlocked || mysteryState.mysteryLevel >= 2) {
      rootChildren.push({
        name: 'DO_NOT_OPEN', type: 'folder', modified: '1998-11-04 23:59', children: [
          { name: 'README.TXT', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-11-04 23:59' },
          { name: 'INCIDENT.LOG', type: 'file', ext: 'txt', size: '2 KB', modified: '1998-11-04 23:59' },
          { name: 'USER_07.DAT', type: 'file', ext: 'txt', size: '4 KB', modified: '1998-11-04 23:59' },
          { name: 'AUDIO.LOG', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-11-04 23:59' },
          { name: 'FINAL_MESSAGE.TXT', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-11-04 23:59' }
        ]
      });
    }

    // Conditionally include DEVELOPER
    if (mysteryState.adminUnlocked || mysteryState.mysteryLevel >= 4) {
      rootChildren.push({
        name: 'Developer', type: 'folder', modified: '1998-11-05 02:00', children: [
          { name: 'BUGS.TXT', type: 'file', ext: 'txt', size: '2 KB', modified: '1998-11-05 02:05' },
          { name: 'TODO.TXT', type: 'file', ext: 'txt', size: '1 KB', modified: '1998-11-05 02:10' },
          { name: 'USER07_MEMO.TXT', type: 'file', ext: 'txt', size: '3 KB', modified: '1998-11-05 02:15' }
        ]
      });
    }

    return {
      name: 'C:\\',
      type: 'folder',
      modified: '1998-05-11 12:00',
      children: rootChildren
    };
  };

  const fileSystem = buildFileSystem();

  const getCurrentFolder = (path: string[]): FileItem => {
    let current = fileSystem;
    for (let i = 1; i < path.length; i++) {
      const next = current.children?.find(c => c.name.toLowerCase() === path[i].toLowerCase());
      if (next && next.type === 'folder') current = next;
      else break;
    }
    return current;
  };

  const currentFolder = getCurrentFolder(currentPath);

  const navigateTo = (name: string) => {
    setCurrentPath([...currentPath, name]);
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateHome = () => {
    setCurrentPath(['C:\\']);
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else {
      mysteryEngine.recordFileOpen(`${currentPath.join('\\')}\\${item.name}`);
      if (openWindow) {
        if (item.ext === 'exe') {
          const gameMap: Record<string, string> = {
            'snake.exe': 'snake',
            'minesweeper.exe': 'minesweeper',
            'breakout.exe': 'breakout',
            'asteroids.exe': 'asteroids',
            'pong.exe': 'pong',
            'spaceinvaders.exe': 'space-invaders',
            'tictactoe.exe': 'tic-tac-toe',
            'solitaire.exe': 'solitaire',
            'setup.exe': 'about'
          };
          const key = gameMap[item.name.toLowerCase()] || 'games';
          openWindow(key);
        } else if (item.ext === 'txt') {
          openWindow({
            component: 'notepad',
            title: `${item.name} - Notepad`,
            props: { initialFileName: item.name }
          });
        } else if (item.ext === 'midi') {
          openWindow('music');
        } else if (item.ext === 'bmp') {
          openWindow('paint');
        } else if (item.ext === 'sys' || item.ext === 'bat') {
          openWindow({
            component: 'notepad',
            title: `${item.name} - Notepad`,
            props: { initialFileName: item.name, initialContent: `; ${item.name} System Configuration\nFILES=40\nBUFFERS=30\nDEVICE=C:\\NOVA\\NOVA.SYS /VERBOSE` }
          });
        } else {
          alert(`Cannot open ${item.name}`);
        }
      }
    }
  };

  const getIcon = (item: FileItem) => {
    if (item.type === 'folder') return item.name === 'DO_NOT_OPEN' ? '⚠️' : '📁';
    switch (item.ext) {
      case 'txt': return '📄';
      case 'midi': return '🎵';
      case 'exe': return '💾';
      case 'sys': case 'bat': return '⚙️';
      case 'bmp': return '🖼️';
      default: return '📄';
    }
  };

  const btnStyle = {
    padding: '2px 8px', margin: '0 2px', border: '2px outset #dfdfdf', backgroundColor: '#c0c0c0', cursor: 'pointer', fontFamily: '"MS Sans Serif", sans-serif', fontSize: '12px'
  };

  const renderTree = (node: FileItem, path: string[], depth = 0) => {
    const isCurrent = path.join('\\').toLowerCase() === currentPath.join('\\').toLowerCase();
    
    return (
      <div key={path.join('\\')} style={{ marginLeft: `${depth * 10}px` }}>
        <div 
          onClick={() => setCurrentPath(path)}
          style={{ 
            cursor: 'pointer', 
            padding: '2px', 
            backgroundColor: isCurrent ? '#000080' : 'transparent',
            color: isCurrent ? '#ffffff' : node.name === 'DO_NOT_OPEN' ? '#cc0000' : '#000000',
            fontWeight: node.name === 'DO_NOT_OPEN' ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontFamily: '"MS Sans Serif", sans-serif'
          }}
        >
          <span>{node.name === 'DO_NOT_OPEN' ? '⚠️' : '📁'}</span>
          <span>{node.name}</span>
        </div>
        {node.children && node.children.filter(c => c.type === 'folder').map(child => 
          renderTree(child, [...path, child.name], depth + 1)
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontFamily: '"MS Sans Serif", sans-serif', fontSize: '11px', userSelect: 'none' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px', borderBottom: '1px solid #808080', gap: '4px' }}>
        <button style={btnStyle} onClick={navigateUp} disabled={currentPath.length <= 1} title="Up">⬆️ Up</button>
        <button style={btnStyle} onClick={navigateHome} title="Home">🏠 Root</button>
        <div style={{ width: '1px', height: '16px', backgroundColor: '#808080', margin: '0 2px' }} />
        <button style={{ ...btnStyle, backgroundColor: viewMode === 'icons' ? '#dfdfdf' : '#c0c0c0' }} onClick={() => setViewMode('icons')} title="Large Icons">🔲 Icons</button>
        <button style={{ ...btnStyle, backgroundColor: viewMode === 'list' ? '#dfdfdf' : '#c0c0c0' }} onClick={() => setViewMode('list')} title="List">📋 List</button>
        <button style={{ ...btnStyle, backgroundColor: viewMode === 'details' ? '#dfdfdf' : '#c0c0c0' }} onClick={() => setViewMode('details')} title="Details">📊 Details</button>
      </div>

      {/* Address Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '2px 4px', borderBottom: '2px groove #ffffff', gap: '4px' }}>
        <span style={{ fontSize: '11px' }}>Address:</span>
        <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #808080', padding: '2px 4px', fontSize: '11px' }}>
          {currentPath.join('\\')}
        </div>
      </div>

      {/* Main split view */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left pane: Tree view */}
        <div style={{ width: '160px', backgroundColor: '#ffffff', border: '2px inset #dfdfdf', margin: '2px', padding: '4px', overflowY: 'auto' }}>
          {renderTree(fileSystem, ['C:\\'])}
        </div>

        {/* Right pane: Folder contents */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', margin: '2px 2px 2px 0', padding: '4px', overflowY: 'auto' }}>
          {viewMode === 'icons' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {currentFolder.children?.map(item => (
                <div
                  key={item.name}
                  onDoubleClick={() => handleDoubleClick(item)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '64px', cursor: 'pointer', padding: '4px' }}
                >
                  <div style={{ fontSize: '24px' }}>{getIcon(item)}</div>
                  <span style={{ textAlign: 'center', fontSize: '10px', wordBreak: 'break-word', color: item.name === 'DO_NOT_OPEN' ? '#cc0000' : '#000000', fontWeight: item.name === 'DO_NOT_OPEN' ? 'bold' : 'normal' }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentFolder.children?.map(item => (
                <div
                  key={item.name}
                  onDoubleClick={() => handleDoubleClick(item)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px' }}
                >
                  <span>{getIcon(item)}</span>
                  <span style={{ color: item.name === 'DO_NOT_OPEN' ? '#cc0000' : '#000000', fontWeight: item.name === 'DO_NOT_OPEN' ? 'bold' : 'normal' }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'details' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #c0c0c0' }}>
                  <th style={{ padding: '2px' }}>Name</th>
                  <th style={{ padding: '2px' }}>Size</th>
                  <th style={{ padding: '2px' }}>Type</th>
                  <th style={{ padding: '2px' }}>Modified</th>
                </tr>
              </thead>
              <tbody>
                {currentFolder.children?.map(item => (
                  <tr
                    key={item.name}
                    onDoubleClick={() => handleDoubleClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', color: item.name === 'DO_NOT_OPEN' ? '#cc0000' : '#000000', fontWeight: item.name === 'DO_NOT_OPEN' ? 'bold' : 'normal' }}>
                      <span>{getIcon(item)}</span>
                      <span>{item.name}</span>
                    </td>
                    <td style={{ padding: '2px' }}>{item.size || ''}</td>
                    <td style={{ padding: '2px' }}>{item.type === 'folder' ? 'File Folder' : `${item.ext?.toUpperCase()} File`}</td>
                    <td style={{ padding: '2px' }}>{item.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ borderTop: '2px inset #dfdfdf', padding: '2px 6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
        <span>{currentFolder.children?.length || 0} object(s)</span>
        <span>Disk Free: 1.42 GB</span>
      </div>
    </div>
  );
}
