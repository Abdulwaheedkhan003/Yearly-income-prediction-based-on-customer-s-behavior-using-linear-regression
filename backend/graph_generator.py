"""
SpendSense AI — Premium Graph Generator
Generates high-quality, dark-themed analytical plots from the Ecommerce dataset.
All graphs use opaque backgrounds matching the dashboard's slate-900 palette.
"""

import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error

# ─── Color Palette (matches frontend glassmorphism dark theme) ───────────────
BG_DARK      = "#0b1120"   # deep navy, matches slate-950
CARD_BG      = "#0f172a"   # slate-900 card background
GRID_COLOR   = "#1e293b"   # subtle grid
BORDER_COLOR = "#334155"   # axes border
TEXT_LIGHT   = "#e2e8f0"   # slate-200 for titles
TEXT_MUTED   = "#94a3b8"   # slate-400 for labels
BLUE         = "#3b82f6"   # primary blue
PURPLE       = "#8b5cf6"   # accent purple
CYAN         = "#06b6d4"   # cyan accent
EMERALD      = "#10b981"   # green accent
PINK         = "#ec4899"   # pink accent
AMBER        = "#f59e0b"   # amber accent

GRADIENT_BLUES   = ["#1e3a5f", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]
GRADIENT_PURPLES = ["#3b0764", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd"]


def _apply_premium_style(ax, fig):
    """Apply consistent premium styling to any axes."""
    fig.patch.set_facecolor(BG_DARK)
    ax.set_facecolor(CARD_BG)
    ax.tick_params(colors=TEXT_MUTED, labelsize=9)
    ax.xaxis.label.set_color(TEXT_MUTED)
    ax.yaxis.label.set_color(TEXT_MUTED)
    ax.title.set_color(TEXT_LIGHT)
    for spine in ax.spines.values():
        spine.set_color(BORDER_COLOR)
        spine.set_linewidth(0.7)
    ax.grid(True, color=GRID_COLOR, linewidth=0.5, alpha=0.6)


def generate_graphs(active_inputs=None, active_prediction=None):
    # Load data
    csv_path = r"C:\Users\U.SIDDIQ ALIKHAN\Desktop\Linear regression\Ecommerce Customers.csv"
    df = pd.read_csv(csv_path)

    X = df[['Avg. Session Length', 'Time on App', 'Time on Website', 'Length of Membership']]
    y = df['Yearly Amount Spent']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    lm = LinearRegression()
    lm.fit(X_train, y_train)
    predictions = lm.predict(X_test)

    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    residuals = y_test - predictions

    # Output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, 'static', 'graphs')
    os.makedirs(output_dir, exist_ok=True)

    DPI = 200

    # ── 1. Actual vs Predicted ────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(7, 5))
    _apply_premium_style(ax, fig)

    # Perfect prediction line first (behind points)
    line_min, line_max = min(y_test.min(), predictions.min()), max(y_test.max(), predictions.max())
    ax.plot([line_min, line_max], [line_min, line_max],
            '--', color=PURPLE, lw=2, alpha=0.7, label='Perfect Prediction', zorder=1)

    # Scatter with glow
    ax.scatter(y_test, predictions, c=BLUE, s=40, alpha=0.15, edgecolors='none', zorder=2)  # glow
    ax.scatter(y_test, predictions, c=BLUE, s=18, alpha=0.85, edgecolors='none', zorder=3)  # core

    # Overlay active prediction horizontal line and glow point
    if active_prediction is not None:
        ax.axhline(y=active_prediction, color=AMBER, linestyle=':', lw=1.5, alpha=0.9,
                   label=f'Current Prediction: ${active_prediction:.2f}', zorder=4)
        # Highlight on the perfect prediction diagonal
        ax.scatter(active_prediction, active_prediction, color=AMBER, marker='*', s=220, 
                   edgecolor='white', lw=1.5, label='Your Active Prediction', zorder=5)

    ax.set_title('Actual vs Predicted Spend', fontsize=14, fontweight='bold', pad=18)
    ax.set_xlabel('Actual Yearly Spend ($)', fontsize=11)
    ax.set_ylabel('Predicted Yearly Spend ($)', fontsize=11)

    # R² annotation box
    ax.text(0.05, 0.92, f'R² = {r2:.4f}', transform=ax.transAxes,
            fontsize=11, fontweight='bold', color=EMERALD,
            bbox=dict(boxstyle='round,pad=0.4', facecolor=CARD_BG, edgecolor=EMERALD, alpha=0.9))

    ax.legend(loc='lower right', fontsize=9, facecolor=CARD_BG, edgecolor=BORDER_COLOR,
              labelcolor=TEXT_MUTED, framealpha=0.9)
    fig.tight_layout(pad=1.5)
    fig.savefig(os.path.join(output_dir, 'actual_vs_pred.png'), dpi=DPI, facecolor=BG_DARK)
    plt.close(fig)

    # ── 2. Residual Distribution ──────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(7, 5))
    _apply_premium_style(ax, fig)

    n, bins, patches = ax.hist(residuals, bins=25, edgecolor=CARD_BG, linewidth=0.8, zorder=2)

    # Gradient coloring: bins near center → purple, edges → blue
    bin_centers = 0.5 * (bins[:-1] + bins[1:])
    max_abs = max(abs(bin_centers.min()), abs(bin_centers.max()))
    for c, p in zip(bin_centers, patches):
        t = abs(c) / max_abs if max_abs > 0 else 0
        r1, g1, b1 = int(PURPLE[1:3], 16), int(PURPLE[3:5], 16), int(PURPLE[5:7], 16)
        r2c, g2, b2 = int(BLUE[1:3], 16), int(BLUE[3:5], 16), int(BLUE[5:7], 16)
        r = int(r1 + (r2c - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        p.set_facecolor(f'#{r:02x}{g:02x}{b:02x}')
        p.set_alpha(0.85)

    # KDE overlay
    from scipy.stats import gaussian_kde
    kde_x = np.linspace(residuals.min() - 5, residuals.max() + 5, 200)
    kde = gaussian_kde(residuals)
    kde_y = kde(kde_x) * len(residuals) * (bins[1] - bins[0])
    ax.plot(kde_x, kde_y, color=CYAN, lw=2.5, alpha=0.9, zorder=3)

    # Mean line
    ax.axvline(x=0, color=EMERALD, linestyle='--', lw=1.5, alpha=0.7, label='Zero Error')
    ax.axvline(x=residuals.mean(), color=AMBER, linestyle=':', lw=1.5, alpha=0.7, label=f'Mean = {residuals.mean():.1f}')

    ax.set_title('Residuals Distribution', fontsize=14, fontweight='bold', pad=18)
    ax.set_xlabel('Prediction Error ($)', fontsize=11)
    ax.set_ylabel('Frequency', fontsize=11)

    ax.text(0.05, 0.92, f'MAE = ${mae:.2f}', transform=ax.transAxes,
            fontsize=10, fontweight='bold', color=AMBER,
            bbox=dict(boxstyle='round,pad=0.4', facecolor=CARD_BG, edgecolor=AMBER, alpha=0.9))

    ax.legend(loc='upper right', fontsize=8, facecolor=CARD_BG, edgecolor=BORDER_COLOR,
              labelcolor=TEXT_MUTED, framealpha=0.9)
    fig.tight_layout(pad=1.5)
    fig.savefig(os.path.join(output_dir, 'residuals.png'), dpi=DPI, facecolor=BG_DARK)
    plt.close(fig)

    # ── 3. Feature Importance (Dynamic Spend Contributions if Active) ─────────
    fig, ax = plt.subplots(figsize=(7, 5))
    _apply_premium_style(ax, fig)

    if active_inputs is not None:
        # Compute exact dollar contribution of each feature for this active user
        contribs = {
            'Avg. Session Length': active_inputs['avg_session_length'] * 25.724256,
            'Time on App': active_inputs['time_on_app'] * 38.597135,
            'Time on Website': active_inputs['time_on_website'] * 0.459148,
            'Length of Membership': active_inputs['length_of_membership'] * 61.674732
        }
        feature_imp = pd.DataFrame({'Feature': list(contribs.keys()), 'Coefficient': list(contribs.values())})
        feature_imp = feature_imp.sort_values(by='Coefficient', ascending=True)
        title = 'Active Spend Contributions ($)'
        subtitle = f"Total predicted spend from features: ${sum(contribs.values()):.2f} (excluding model bias)"
        colors_bar = [BLUE, CYAN, PURPLE, EMERALD]
    else:
        feature_imp = pd.DataFrame({'Feature': X.columns, 'Coefficient': lm.coef_})
        feature_imp = feature_imp.sort_values(by='Coefficient', ascending=True)
        title = 'Feature Importance'
        subtitle = 'How much each feature changes yearly spend per 1-unit increase'
        colors_bar = [BLUE, CYAN, PURPLE, EMERALD]

    bars = ax.barh(feature_imp['Feature'], feature_imp['Coefficient'],
                   color=colors_bar, edgecolor=CARD_BG, linewidth=0.5, height=0.55, zorder=2)

    # Value labels on bars
    for bar, val in zip(bars, feature_imp['Coefficient']):
        ax.text(bar.get_width() + 0.8, bar.get_y() + bar.get_height() / 2,
                f'${val:.1f}', va='center', ha='left', fontsize=10, fontweight='bold', color=TEXT_LIGHT)

    ax.set_title(title, fontsize=14, fontweight='bold', pad=18)
    ax.set_xlabel('Dollar Amount ($)', fontsize=11)
    ax.set_ylabel('')
    ax.tick_params(axis='y', labelsize=10)

    # Subtle subtitle
    ax.text(0.5, -0.12, subtitle,
            transform=ax.transAxes, fontsize=8, color=TEXT_MUTED, ha='center', style='italic')

    fig.tight_layout(pad=1.5)
    fig.savefig(os.path.join(output_dir, 'feature_importance.png'), dpi=DPI, facecolor=BG_DARK)
    plt.close(fig)

    # ── 4. Target Distribution ────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(7, 5))
    _apply_premium_style(ax, fig)

    n, bins_t, patches_t = ax.hist(y, bins=35, edgecolor=CARD_BG, linewidth=0.5, zorder=2)

    # Gradient coloring by height
    max_n = n.max()
    for ni, p in zip(n, patches_t):
        t = ni / max_n if max_n > 0 else 0
        r1, g1, b1 = 0x1e, 0x3a, 0x5f
        r2c, g2, b2 = 0x06, 0xb6, 0xd4
        r = int(r1 + (r2c - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        p.set_facecolor(f'#{r:02x}{g:02x}{b:02x}')
        p.set_alpha(0.85)

    # KDE overlay
    kde2 = gaussian_kde(y)
    kde_x2 = np.linspace(y.min() - 20, y.max() + 20, 200)
    kde_y2 = kde2(kde_x2) * len(y) * (bins_t[1] - bins_t[0])
    ax.plot(kde_x2, kde_y2, color=PINK, lw=2.5, alpha=0.9, zorder=3)

    # Mean & median lines
    ax.axvline(x=y.mean(), color=EMERALD, linestyle='--', lw=1.5, alpha=0.8, label=f'Mean = ${y.mean():.0f}')
    ax.axvline(x=y.median(), color=AMBER, linestyle=':', lw=1.5, alpha=0.8, label=f'Median = ${y.median():.0f}')

    # Overlay active prediction vertical line
    if active_prediction is not None:
        ax.axvline(x=active_prediction, color=AMBER, linestyle='-', lw=2, alpha=0.9,
                   label=f'Active Customer: ${active_prediction:.2f}')

    ax.set_title('Distribution of Yearly Customer Spend', fontsize=14, fontweight='bold', pad=18)
    ax.set_xlabel('Yearly Amount Spent ($)', fontsize=11)
    ax.set_ylabel('Number of Customers', fontsize=11)

    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))

    ax.legend(loc='upper right', fontsize=9, facecolor=CARD_BG, edgecolor=BORDER_COLOR,
              labelcolor=TEXT_MUTED, framealpha=0.9)

    ax.text(0.05, 0.92, f'N = {len(y)} customers', transform=ax.transAxes,
            fontsize=10, fontweight='bold', color=CYAN,
            bbox=dict(boxstyle='round,pad=0.4', facecolor=CARD_BG, edgecolor=CYAN, alpha=0.9))

    fig.tight_layout(pad=1.5)
    fig.savefig(os.path.join(output_dir, 'target_distribution.png'), dpi=DPI, facecolor=BG_DARK)
    plt.close(fig)

    print(f"✅ Dynamic personalized graphs generated at {DPI} DPI in {output_dir}")
    if active_prediction is not None:
        print(f"   Active prediction: ${active_prediction:.2f}")


if __name__ == '__main__':
    generate_graphs()
