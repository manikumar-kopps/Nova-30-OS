# 🌟 NOVA 30 OS

An authentic, playful, and accessible retro operating system, running inside your modern web browser.

Inspired by the golden age of 90s computing (Windows 95/98, classic Mac OS, and retro web culture), **NOVA 30 OS** brings you a fictional digital workstation loaded with interactive apps, playable retro games, authentic Web Audio chiptunes, customizable CRT monitor aesthetics, and a deep connected mystery system.

---

## 🚀 Getting Started

To launch the project locally:

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables (optional, for Azure AI features)
cp .env.example .env

# 3. Start development server
npm run dev
```

Open your browser to the local URL (typically `http://localhost:5173`).

---

## 🖥️ Operating System Architecture

### 1. Boot Sequence (NOVA BIOS v2.1)
- Vintage monochrome BIOS boot screen with memory, device, and IDE hard drive checks.
- Authentic typewriter progression, filling progress bar, and startup chime.
- Keyboard accessible **"Skip Boot"** button for quick desktop access.

### 2. Desktop Environment
- **Draggable Desktop Icons**:
  - 💻 **My Computer**
  - 🌐 **Internet** (NOVA Explorer)
  - 🎮 **Games** (Retro Arcade Collection)
  - 🎵 **Music** (NOVA Player Synthesizer)
  - 📟 **Terminal** (MS-DOS Command Line)
  - 📝 **Notepad** (Text Editor)
  - 🎨 **Paint** (Pixel Art Drawing Engine)
  - 📁 **Files** (C:\ Drive File Explorer)
  - 🗑️ **Trash** (Recycle Bin)
  - ℹ️ **About NOVA** (System Specs)
  - 🔮 **DO_NOT_OPEN** (Classified Easter Egg File)
- **Desktop Context Menu**: Right-click on the desktop to arrange icons, refresh, create new documents, or open display properties.

### 3. Window Manager
- **Multi-Window Chrome**: Classic 3D beveled titlebars, active/inactive gradient states (`#000080` to `#1084d0`).
- **Full Window Controls**: Minimize, Maximize/Restore, Close buttons (`_`, `□`, `✕`).
- **Interactive Resizing**: 8-direction edge and corner resizing with classic Windows 95 diagonal grip handle.
- **Cascading Windows**: New windows cascade down for clean multitasking.
- **Z-Index Layering**: Click any window to bring it to the foreground.

### 4. Taskbar & Start Menu
- **Start Button**: Opens classic Start Menu with blue vertical ribbon.
- **Hierarchical Flyout Menus**: Programs (Games, Internet, Music, Accessories, Terminal), Recent files, System settings, and Shut Down dialog.
- **Window Tab Bar**: Shows active running applications; clicking minimizes or restores windows.
- **System Tray**:
  - 📶 Dial-Up Network status (56.6k v.90 connection info).
  - 🔊 Audio toggle (Quick mute/unmute).
  - 🔋 Battery & AC power monitor.
  - 🕒 Live Digital Clock (supports 12h/24h formats; click 5 times for a secret anomaly!).

---

## 🕹️ Built-In Applications

| Application | Description & Features |
|---|---|
| 📟 **Terminal** | Authentic command shell supporting `help`, `about`, `date`, `time`, `matrix` (interactive falling rain), `games`, `clear`, `echo`, `whoami`, `dir`, `tree`, `ping`, `ipconfig`, `color`, and secret commands (`sudo`, `hack`, `doom`, `nova`, `devroom`, etc.). Includes command history (`↑`/`↓`). |
| 📝 **Notepad** | Classic Windows text editor with File, Edit, Format, and Help menus. Save and Open dialogs, `Ctrl+S` quick save, word wrap toggle, line/column tracking, and preloaded documents (`README.TXT`, `TODO.TXT`, `SECRET.TXT`). |
| 🎨 **Paint** | Pixel art canvas with Pencil, Eraser, Line, Rectangle, Circle, and Flood Fill tools. 16-color retro palette, 20-step undo/redo stack, brush size control, zoom, and image save. |
| 🌐 **NOVA Explorer** | 90s Web Browser with navigation history, address bar, bookmarks, and fictional websites: NOVA Home, NOVA Search, Retro Guestbook (interactive with localStorage), Pixel Radio, Internet Archive, and classic "Under Construction" page. |
| 📁 **File Explorer** | C:\ drive navigation tree (`Documents`, `Downloads`, `Games`, `Music`, `Pictures`, `System`, `Users`). Double-click `.exe` files to launch games, `.txt` to open in Notepad, `.midi` in Music Player, and `.bmp` in Paint. |
| 🎵 **NOVA Player** | Chiptune music player with Web Audio synthesizer, custom equalizer animation, track playlist (`Digital Dreams`, `Pixel Paradise`, `Retro Wave`, `8-Bit Sunset`, `Memory Lane`), repeat, shuffle, and volume slider. |
| 🎮 **Games Collection** | 6 complete playable retro games: <br>• **Snake**: Canvas-based arcade classic with score tracking <br>• **Minesweeper**: Multi-difficulty (Beginner, Intermediate, Expert) with recursive flood fill and smiley face <br>• **Pong**: Player vs AI table tennis with ball physics <br>• **Space Invaders**: Alien defense shooter with destructible shields <br>• **Tic-Tac-Toe**: AI opponent with Minimax algorithm (Easy, Medium, Hard) <br>• **Solitaire**: Klondike card game with drag & drop and foundation piles |
| ⚙️ **Control Panel** | Customizable OS preferences: Wallpapers (Teal, Blue, Green, Purple, Sunset Gradient, Matrix, Stars), Themes (Classic, Dark, High Contrast), CRT effects toggle, cursor styles, sound levels, and Accessibility Center. |

---

## ♿ Accessibility & Keyboard Support (WCAG 2.2 AA)

NOVA 30 OS is engineered to be fully operable without requiring a mouse:

- **Keyboard Shortcuts**:
  - `Tab` / `Shift + Tab`: Move between all interactive controls, buttons, and desktop icons.
  - `Enter` / `Space`: Open selected icons, activate buttons, reveal cells in games.
  - `Alt + Tab`: Cycle through open application windows.
  - `Alt + F4`: Close active application window.
  - `Meta / Windows Key`: Open or close the Start Menu.
  - `Ctrl + Alt + A`: Direct shortcut to open the **Accessibility Center**.
  - `Ctrl + S`: Quick-save document in Notepad.
  - `F11`: Toggle browser fullscreen.
  - `Escape`: Close start menus, dialogs, and popups.
- **Visible Focus Indicator**: Retro pixelated dotted outline on all focused elements.
- **Accessibility Center (in Control Panel)**:
  - 🏃 **Reduce Motion**: Disables CRT scanline animation, window scale transitions, and blinking.
  - 👁️ **High Contrast Mode**: Switches OS colors to high-contrast black/yellow/white.
  - 🔍 **Larger Text**: Scales UI font sizing across all windows and controls.
  - 📺 **CRT Effects Toggle**: Completely disables scanlines, vignette, and chromatic aberration.
  - 🔇 **Sound ON/OFF**: Allows muting all Web Audio sound effects.
  - 👁️‍🗨️ **Disable Blinking**: Freezes animated cursors for photosensitive users.
- **Screen Reader Support**: Semantic dialog roles (`role="dialog"`, `role="toolbar"`, `role="menu"`), descriptive ARIA labels, and live regions.

---

## 🥚 Easter Eggs & Secrets

1. **Konami Code**: Press `↑ ↑ ↓ ↓ ← → ← → B A` on your keyboard to unlock the Developer Room message.
2. **Terminal Matrix Rain**: Type `matrix` in the Terminal to trigger full-screen falling digital rain.
3. **Clock Anomaly**: Click the taskbar clock 5 times in succession.
4. **Desktop Mystery**: Find and open the `DO_NOT_OPEN` crystal ball icon on the desktop.
5. **Secret Terminal Commands**: Try typing `devroom`, `sudo`, `hack`, `nova`, `secret`, `doom`, `42`, or `love` in the Terminal.
6. **Blue Screen of Death**: Simulated BSOD event with safe return.
