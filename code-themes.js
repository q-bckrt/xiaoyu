/**
 * 啸宇 · XIAOYU DESIGN SYSTEM (TAO)
 * Code Themes Laboratory Engine
 */

(function () {
  'use strict';

  // --- 1. Code Specimens Database ---
  const CODE_SPECIMENS = {
    typescript: {
      filename: 'horology-telemetry.ts',
      badge: 'TS / STRICT',
      code: `/**
 * XiaoYu TAO · Chrono-Kinetic Telemetry Dispatcher
 * Calibrated for deterministic sub-millisecond escapement.
 */
interface CadenceMetrics {
  readonly cycleId: string;
  readonly targetFps: number;
  readonly bufferToleranceMm: number;
  isCalibrated: boolean;
}

export class HorologicalCore<T extends CadenceMetrics> {
  private static readonly EPSILON: number = 0.0015;
  private bufferStream: Float64Array;
  private isEscapementActive: boolean = false;

  constructor(
    private readonly frequencyHz: number = 60,
    public readonly identifier: string = "XIAOYU_CHRONO_01"
  ) {
    this.bufferStream = new Float64Array(1024);
  }

  /**
   * Synchronizes the balance wheel escapement with dual-stream telemetry.
   */
  public synchronizeCadence(pulseMs: number): Promise<T> {
    const delta = Math.abs(pulseMs - (1000 / this.frequencyHz));
    
    if (delta > HorologicalCore.EPSILON) {
      console.warn(\`[TAO] Cadence variance detected: \${delta.toFixed(3)}ms\`);
      this.isEscapementActive = true;
    }

    return new Promise((resolve) => {
      const metric: T = {
        cycleId: \`CYCLE_\${Date.now()}\`,
        targetFps: this.frequencyHz,
        bufferToleranceMm: 0.025,
        isCalibrated: !this.isEscapementActive
      } as T;

      resolve(metric);
    });
  }
}`
    },

    python: {
      filename: 'harmonic_dsp.py',
      badge: 'PYTHON 3.12',
      code: `"""
XiaoYu TAO · Synthesized Escapement Audio DSP Engine
Calculates golden-ratio harmonic harmonics and acoustic resonance.
"""
from typing import Final, List, Tuple
from dataclasses import dataclass
import math

PHI: Final[float] = 1.61803398875
SAMPLE_RATE: Final[int] = 48000

@dataclass(frozen=True, slots=True)
class ResonatorHarmonic:
    fundamental_hz: float
    damping_ratio: float = 0.042
    decay_curve: str = "exponential"

    def compute_frequencies(self, octaves: int = 4) -> List[Tuple[int, float]]:
        """Generates horological overtones aligned to Taoist acoustics."""
        overtones = []
        for n in range(1, octaves + 1):
            cadence = round(self.fundamental_hz * (n ** 0.85) * PHI, 3)
            overtones.append((n, cadence))
        return overtones

def dispatch_escapement_pulse(base_pitch: float = 432.0) -> bool:
    engine = ResonatorHarmonic(fundamental_hz=base_pitch)
    harmonics = engine.compute_frequencies(octaves=5)
    print(f"[TAO DSP] Generated {len(harmonics)} resonant escapement nodes.")
    return True
`
    },

    rust: {
      filename: 'cadence_pipeline.rs',
      badge: 'RUST 2024',
      code: `//! XiaoYu TAO · Deterministic Cadence Telemetry Pipeline
//! Zero-allocation microsecond ring buffer with atomic state.

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::{Duration, Instant};

pub const CADENCE_RATE_HZ: u32 = 144;
pub const VIBRATION_THRESHOLD: f64 = 0.005;

#[derive(Debug, Clone, Copy)]
pub struct BalanceSpring {
    pub tension_coeff: f64,
    pub cycle_count: u64,
    pub is_locked: bool,
}

impl BalanceSpring {
    pub const fn new(coeff: f64) -> Self {
        Self {
            tension_coeff: coeff,
            cycle_count: 0,
            is_locked: false,
        }
    }

    pub fn tick(&mut self, elapsed: Duration) -> Result<f64, &'static str> {
        if self.is_locked {
            return Err("Escapement balance is locked");
        }
        self.cycle_count += 1;
        let delta = elapsed.as_secs_f64() * self.tension_coeff;
        Ok(delta)
    }
}
`
    },

    html_css: {
      filename: 'horology-card.html',
      badge: 'HTML5 / CSS3',
      code: `<!-- 05 · Architectural Dial & Telemetry Card Component -->
<article class="horo-dial-card" data-state="calibrated">
  <header class="dial-header">
    <span class="dial-status-dot" aria-hidden="true"></span>
    <h3 class="dial-title">CHRONO_ESCAPEMENT_v2</h3>
    <time datetime="2026-09-11" class="dial-timestamp">13:34:16 UTC</time>
  </header>

  <div class="dial-telemetry-metrics">
    <div class="metric-node">
      <span class="metric-label">CADENCE_HERTZ</span>
      <span class="metric-val">144 FPS</span>
    </div>
    <div class="metric-node">
      <span class="metric-label">TOLERANCE_TICK</span>
      <span class="metric-val">&plusmn; 0.025 mm</span>
    </div>
  </div>

  <footer class="dial-controls">
    <button type="button" class="btn-dial-reset">RE-CALIBRATE</button>
  </footer>
</article>`
    }
  };

  // --- 2. Theme Token Metadata (Hex Colors & Descriptions) ---
  const THEME_TOKENS = {
    canonical: {
      name: '01 · Canonical Drafting',
      ethos: 'Architectural paper, warm alabaster ground, vintage cognac keywords, and matcha sage functions.',
      light: {
        bg: '#F4F1EA', border: '#E2DFD6', text: '#1C1E21',
        keyword: '#9A6735', function: '#5A754B', type: '#3B647A',
        string: '#A36B28', number: '#B25832', comment: '#8D99AE'
      },
      dark: {
        bg: '#0E1116', border: '#242933', text: '#E6EDF3',
        keyword: '#C68E56', function: '#8DB477', type: '#88C0D0',
        string: '#E0BA76', number: '#E09F67', comment: '#7E8696'
      }
    },
    bamboo: {
      name: '02 · Bamboo & Sunlit Amber',
      ethos: 'Organic botanical vitality: deep bamboo greens, sunlit warm amber, and calm celadon porcelain.',
      light: {
        bg: '#FAF8F5', border: '#E2DDD5', text: '#1C201D',
        keyword: '#2D5A3A', function: '#9E6E2E', type: '#286B66',
        string: '#8A6B32', number: '#A85834', comment: '#7A847B'
      },
      dark: {
        bg: '#0A0C0B', border: '#1B1E1C', text: '#E4E8E5',
        keyword: '#78C288', function: '#E2B462', type: '#56B6C2',
        string: '#D4A76A', number: '#E57C58', comment: '#68766C'
      }
    },
    escapement: {
      name: '03 · Horological Escapement',
      ethos: 'Haute horlogerie: thermally blued steel hands, brushed brass gear trains, and synthetic ruby jewels.',
      light: {
        bg: '#F5F4F0', border: '#E0DDD5', text: '#1E2229',
        keyword: '#23527C', function: '#A67C2E', type: '#9E3248',
        string: '#8C6F4B', number: '#B35836', comment: '#7B8594'
      },
      dark: {
        bg: '#101216', border: '#262B35', text: '#E5E9F0',
        keyword: '#5D9CEC', function: '#E5C07B', type: '#E06C75',
        string: '#D19A66', number: '#F08D49', comment: '#6E7681'
      }
    },
    xuan: {
      name: '04 · Xuan & Cinnabar Seal',
      ethos: 'Classical calligraphy: deep pine soot ink, vermilion cinnabar stamps, and antique tea parchment.',
      light: {
        bg: '#F7F4EC', border: '#E5DFC8', text: '#191B1F',
        keyword: '#A83226', function: '#2B3835', type: '#5E503F',
        string: '#7A5E38', number: '#9C442A', comment: '#8A8E95'
      },
      dark: {
        bg: '#111215', border: '#2A2A30', text: '#E8E6E3',
        keyword: '#E85B4D', function: '#98C379', type: '#C8AE7D',
        string: '#D99B61', number: '#F27A59', comment: '#6E7179'
      }
    },
    monolith: {
      name: '05 · Titanium Monolith',
      ethos: 'Minimalist Braun/Rams restraint: high-contrast titanium scales with a single focal cognac accent.',
      light: {
        bg: '#FAFAFA', border: '#E5E5E5', text: '#161616',
        keyword: '#111111', function: '#9A6735', type: '#3B3B3B',
        string: '#636363', number: '#757575', comment: '#949494'
      },
      dark: {
        bg: '#0D0E10', border: '#222428', text: '#EAEAEA',
        keyword: '#FFFFFF', function: '#8DB477', type: '#C7CBD2',
        string: '#A0A4AC', number: '#8E939D', comment: '#63666E'
      }
    }
  };

  // --- 3. Pure Regex Syntax Tokenizer ---
  function tokenizeCode(code, lang) {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      let html = '';

      // Check for full-line comment first
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--') || trimmed.startsWith('"""') || trimmed.startsWith('//!')) {
        html = `<span class="tok-c tok-interactive" data-token="comment">${escapeHtml(line)}</span>`;
      } else {
        html = highlightTokens(line, lang);
      }

      return `<div class="code-line"><span class="code-gutter-num">${lineNum}</span><span class="code-line-content">${html}</span></div>`;
    }).join('');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightTokens(line, lang) {
    // Strings
    const stringRegex = /(".*?"|'.*?'|`.*?`)/g;
    // Comments at end of line
    const inlineCommentRegex = /(\/\/.*$|#.*$)/;

    let commentPart = '';
    const cMatch = line.match(inlineCommentRegex);
    if (cMatch) {
      const cIdx = cMatch.index;
      commentPart = `<span class="tok-c tok-interactive" data-token="comment">${escapeHtml(line.slice(cIdx))}</span>`;
      line = line.slice(0, cIdx);
    }

    let escaped = escapeHtml(line);

    // Replace strings with placeholders
    const strings = [];
    escaped = escaped.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`)/g, (match) => {
      strings.push(match);
      return `___STR_${strings.length - 1}___`;
    });

    // Keywords
    const keywords = [
      'export', 'class', 'interface', 'readonly', 'static', 'public', 'private',
      'constructor', 'return', 'new', 'const', 'let', 'var', 'if', 'else', 'import',
      'from', 'def', 'def ', 'class ', 'from ', 'import ', 'as', 'pub', 'fn', 'struct',
      'impl', 'match', 'use', 'Self', 'self', 'true', 'false', 'boolean', 'Promise', 'async', 'await'
    ];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(kwRegex, '<span class="tok-k tok-interactive" data-token="keyword">$1</span>');

    // Types / Classes
    const types = [
      'CadenceMetrics', 'HorologicalCore', 'Float64Array', 'number', 'string', 'boolean',
      'ResonatorHarmonic', 'Final', 'List', 'Tuple', 'int', 'float', 'str', 'BalanceSpring',
      'Duration', 'Instant', 'Result', 'AtomicBool', 'AtomicU64', 'u32', 'u64', 'f64'
    ];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="tok-t tok-interactive" data-token="type">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-n tok-interactive" data-token="number">$1</span>');

    // Function calls
    escaped = escaped.replace(/\b([a-zA-Z0-9_$]+)(?=\()/g, '<span class="tok-f tok-interactive" data-token="function">$1</span>');

    // Restore strings
    escaped = escaped.replace(/___STR_(\d+)___/g, (_, idx) => {
      return `<span class="tok-s tok-interactive" data-token="string">${strings[idx]}</span>`;
    });

    return escaped + commentPart;
  }

  // --- 4. State Management ---
  let activeTheme = 'canonical';
  let compareTheme = 'bamboo';
  let activeLang = 'typescript';
  let isSplitView = false;
  let codeFontSize = 13.5;
  let codeLineHeight = 1.65;

  // --- 5. DOM References & Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initThemeButtons();
    initLanguageTabs();
    initControls();
    initTokenInspector();
    renderPlayground();
    updateTokenMatrix();
  });

  function initThemeButtons() {
    const buttons = document.querySelectorAll('.theme-card-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme-id');
        if (theme) {
          activeTheme = theme;
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderPlayground();
          updateTokenMatrix();
        }
      });
    });
  }

  function initLanguageTabs() {
    const tabs = document.querySelectorAll('.lang-tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const lang = tab.getAttribute('data-lang');
        if (lang && CODE_SPECIMENS[lang]) {
          activeLang = lang;
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          renderPlayground();
        }
      });
    });
  }

  function initControls() {
    // Split View Toggle
    const splitBtn = document.getElementById('btn-toggle-split');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        isSplitView = !isSplitView;
        splitBtn.classList.toggle('primary', isSplitView);
        splitBtn.textContent = isSplitView ? 'SINGLE VIEW' : 'SIDE-BY-SIDE SPLIT';
        renderPlayground();
      });
    }

    // Compare Theme Selector
    const compareSelect = document.getElementById('compare-theme-select');
    if (compareSelect) {
      compareSelect.addEventListener('change', (e) => {
        compareTheme = e.target.value;
        if (isSplitView) renderPlayground();
      });
    }

    // Font Sizing
    const fontSelect = document.getElementById('code-size-select');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        codeFontSize = parseFloat(e.target.value);
        document.documentElement.style.setProperty('--code-font-size', `${codeFontSize}px`);
      });
    }

    // Line Height
    const lineSelect = document.getElementById('code-lh-select');
    if (lineSelect) {
      lineSelect.addEventListener('change', (e) => {
        codeLineHeight = parseFloat(e.target.value);
        document.documentElement.style.setProperty('--code-line-height', codeLineHeight);
      });
    }

    // Export Modal Triggers
    const exportBtn = document.getElementById('btn-export-tokens');
    const modalBackdrop = document.getElementById('export-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const copyModalBtn = document.getElementById('btn-modal-copy');

    if (exportBtn && modalBackdrop) {
      exportBtn.addEventListener('click', () => {
        generateExportSnippet();
        modalBackdrop.classList.add('open');
      });
    }

    if (closeBtn && modalBackdrop) {
      closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
      });
    }

    if (copyModalBtn) {
      copyModalBtn.addEventListener('click', () => {
        const snippet = document.getElementById('export-code-snippet')?.textContent || '';
        navigator.clipboard.writeText(snippet).then(() => {
          copyModalBtn.textContent = 'COPIED TO CLIPBOARD!';
          setTimeout(() => (copyModalBtn.textContent = 'COPY TO CLIPBOARD'), 2000);
        });
      });
    }
  }

  function renderPlayground() {
    const container = document.getElementById('playground-mount');
    if (!container) return;

    const spec = CODE_SPECIMENS[activeLang];
    if (!spec) return;

    const tokenizedHtml = tokenizeCode(spec.code, activeLang);

    if (!isSplitView) {
      container.className = 'single-view-wrap';
      container.innerHTML = `
        <div class="code-playground-window" data-code-theme="${activeTheme}">
          <div class="terminal-titlebar">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <div class="terminal-file-title">
              <span>${spec.filename}</span>
              <span class="terminal-pill">${spec.badge}</span>
            </div>
            <div class="terminal-meta-pills">
              <span class="terminal-pill">${THEME_TOKENS[activeTheme].name.toUpperCase()}</span>
            </div>
          </div>
          <pre class="code-editor-body"><code>${tokenizedHtml}</code></pre>
        </div>
      `;
    } else {
      container.className = 'split-view-container';
      container.innerHTML = `
        <!-- Left Pane: Active Theme -->
        <div class="code-playground-window" data-code-theme="${activeTheme}">
          <div class="terminal-titlebar">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <div class="terminal-file-title">
              <span>${spec.filename} (A)</span>
            </div>
            <div class="terminal-meta-pills">
              <span class="terminal-pill">${THEME_TOKENS[activeTheme].name.toUpperCase()}</span>
            </div>
          </div>
          <pre class="code-editor-body"><code>${tokenizedHtml}</code></pre>
        </div>

        <!-- Right Pane: Compare Theme -->
        <div class="code-playground-window" data-code-theme="${compareTheme}">
          <div class="terminal-titlebar">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <div class="terminal-file-title">
              <span>${spec.filename} (B)</span>
            </div>
            <div class="terminal-meta-pills">
              <span class="terminal-pill">${THEME_TOKENS[compareTheme].name.toUpperCase()}</span>
            </div>
          </div>
          <pre class="code-editor-body"><code>${tokenizedHtml}</code></pre>
        </div>
      `;
    }

    rebindTokenTooltips();
  }

  function updateTokenMatrix() {
    const matrixGrid = document.getElementById('token-matrix-grid');
    if (!matrixGrid) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeData = THEME_TOKENS[activeTheme];
    const palette = isDark ? themeData.dark : themeData.light;

    const tokensToDisplay = [
      { key: 'keyword', label: '--syn-keyword', role: 'Keywords & Control Flow' },
      { key: 'function', label: '--syn-function', role: 'Functions & Methods' },
      { key: 'type', label: '--syn-type', role: 'Types, Structs & Classes' },
      { key: 'string', label: '--syn-string', role: 'String Literals' },
      { key: 'number', label: '--syn-number', role: 'Numerics & Booleans' },
      { key: 'comment', label: '--syn-comment', role: 'Documentation & Notes' },
      { key: 'bg', label: '--syn-bg', role: 'Canvas Surface Background' },
      { key: 'text', label: '--syn-text', role: 'Identifiers & Punctuation' }
    ];

    matrixGrid.innerHTML = tokensToDisplay.map((item) => {
      const hex = palette[item.key] || '#888888';
      return `
        <div class="matrix-item" onclick="navigator.clipboard.writeText('${hex}')" title="Click to copy ${hex}">
          <div class="matrix-swatch" style="background-color: ${hex};"></div>
          <div class="matrix-item-info">
            <span class="matrix-item-name">${item.label}</span>
            <span class="matrix-item-hex">${hex.toUpperCase()} · ${item.role}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function initTokenInspector() {
    const pill = document.createElement('div');
    pill.id = 'token-info-pill';
    document.body.appendChild(pill);
  }

  function rebindTokenTooltips() {
    const pill = document.getElementById('token-info-pill');
    if (!pill) return;

    const tokens = document.querySelectorAll('.tok-interactive');
    tokens.forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        const type = el.getAttribute('data-token') || 'token';
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const palette = isDark ? THEME_TOKENS[activeTheme].dark : THEME_TOKENS[activeTheme].light;
        const hex = palette[type] || 'N/A';

        pill.innerHTML = `<strong>${type.toUpperCase()}</strong> · <span style="color: ${hex};">${hex}</span><br><span style="opacity: 0.75; font-size: 9.5px;">Theme: ${THEME_TOKENS[activeTheme].name}</span>`;
        pill.style.display = 'block';
      });

      el.addEventListener('mousemove', (e) => {
        pill.style.left = `${e.clientX + 14}px`;
        pill.style.top = `${e.clientY + 14}px`;
      });

      el.addEventListener('mouseleave', () => {
        pill.style.display = 'none';
      });
    });
  }

  function generateExportSnippet() {
    const theme = THEME_TOKENS[activeTheme];
    const light = theme.light;
    const dark = theme.dark;

    const cssSnippet = `/* ==========================================================================
   XIAOYU TAO · CODE THEME EXPORT: ${theme.name.toUpperCase()}
   Ethos: ${theme.ethos}
   ========================================================================== */

:root {
  --syn-bg: ${light.bg};
  --syn-border: ${light.border};
  --syn-text: ${light.text};
  --syn-keyword: ${light.keyword};
  --syn-function: ${light.function};
  --syn-string: ${light.string};
  --syn-type: ${light.type};
  --syn-number: ${light.number};
  --syn-comment: ${light.comment};
}

[data-theme="dark"] {
  --syn-bg: ${dark.bg};
  --syn-border: ${dark.border};
  --syn-text: ${dark.text};
  --syn-keyword: ${dark.keyword};
  --syn-function: ${dark.function};
  --syn-string: ${dark.string};
  --syn-type: ${dark.type};
  --syn-number: ${dark.number};
  --syn-comment: ${dark.comment};
}`;

    const mount = document.getElementById('export-code-snippet');
    if (mount) mount.textContent = cssSnippet;
  }

  // Theme observer to update swatches on global dark/light change
  const observer = new MutationObserver(() => {
    updateTokenMatrix();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

})();
