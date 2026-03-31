/* ==============================================
    RAX EXCHANGE ─ chart.js
    Candlestick chart renderer (Canvas 2D)
    Depends on: engine.js (state)
===============================================
*/

const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// ── Canvas resize ────────────────────────────────────────────────────────

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    drawChart();
});

resizeCanvas();

// ── Main draw function ──────────────────────────────────────────────

/** 
 * Renders the full candlestick chart for the currently selected item.
 * Includes: background, grid, area fill, candles, current-price line,
 * price tag, X-axis labels, and volume bars.
 */
function drawChart() {
    const item = state.selectedItem[state.selectedIdx];
    if (!item || !item.candles.length) return;

    const W = canvas.width;
    const H = canvas.height;
    const candles = item.candles.slice(-80);
    const PAD = { top: 20, right: 60, bottom: 40, left: 10 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    // ── Background ──
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#080c10');
    bgGrad.addColorStop(1, '#0a0f15');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Price range with padding ──
    const prices = candles.flatMap(c => [c.h, c.l]);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP -minP || 1;
    const padded = range * 0.08;
    const lo = minP - padded;
    const hi = maxP + padded;

    // Cordinate helpers
    const px = p => PAD.top + plotH * (1 - (p - lo) / (hi - lo));
    const cx = i => PAD.left + (i + 0.5) * (plotW / candles.length);
    const cw = Math.max(1, plotW / candles.length * 0.65);

    // ── Horizontal grid lines ──
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const price = lo + (hi - lo) * (i / 5);
        const y = px(price)

        ctx.beginPath();
        ctx.moveTo(PAD.left, y);
        ctx.lineTo(W - PAD.right, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba (74,85,104,0.8';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.fillText(formatPrice(price), W - PAD.right + 4, y + 3)
    }
}