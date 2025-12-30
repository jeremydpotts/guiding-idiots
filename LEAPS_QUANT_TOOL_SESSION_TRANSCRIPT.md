# LEAPS Quant Tool — Session Export (Markdown)

> **Purpose:** This file captures the full working output of this ChatGPT session for building a **Quant-level, LEAPS-only (calls/puts)** options strategy monitoring tool with a Streamlit UI, backtesting (incl. walk-forward/out-of-sample), ML validation, risk/position sizing, execution interfaces (paper + broker stub), and monitoring/reporting.

---

## 1) What you asked for (requirements)

### Core product requirements
- Build a **LEAPS-only** options strategy tool (calls and puts).
- Must be **quant-level**: systematic, data-driven, modular, with research-proven indicators and robust validation.
- Must provide **daily monitoring** after entering a LEAPS position and output a clear:
  - **HOLD / REDUCE / EXIT** recommendation
  - Human-readable reasons + thresholds to watch next
- Must be **intuitive** (easy UI) but allow complex inputs when needed.

### Quant framework requirements (explicit)
A quant algo framework is a systematic architecture including:
1) **Data layer**: ingestion, cleaning, storage of market data.
2) **Strategy/model layer**: signals from stats/ML.
3) **Backtesting**: realistic simulation, out-of-sample, walk-forward optimization (WFO).
4) **Risk mgmt & position sizing**: exposure controls.
5) **Execution module**: broker connectors / paper trading.
6) **Monitoring & reporting**: performance, alerts, compliance-minded logs.

### Broker constraint
- All assets possible on Fidelity & E*Trade
- Use free/low-cost real-time monitoring where possible
- **E*TRADE**: API support available (connector included as a stub)
- **Fidelity**: treat as monitoring + manual execution (unless you have institutional access)

---

## 2) Final architecture

Repository structure:

```text
leaps-quant-tool/
  app.py
  requirements.txt
  README.md
  config.example.yaml
  config.yaml (optional local override)
  leaps_quant/
    __init__.py
    data/
      __init__.py
      providers.py
      yfinance_provider.py
      etrade_provider_stub.py
      cache.py
      store.py
    features/
      __init__.py
      indicators.py
      regime.py
      option_features.py
    engine/
      __init__.py
      decision.py
      scoring.py
      risk.py
      explain.py
      position_sizing.py
    backtest/
      __init__.py
      backtester.py
      walkforward.py
      metrics.py (optional)
    ml/
      __init__.py
      dataset.py
      model.py
      validate.py
    execution/
      __init__.py
      broker.py
      paper.py
    monitor/
      __init__.py
      health.py
    reporting/
      __init__.py
      report.py
    util/
      __init__.py
      types.py
  outputs/
    .gitkeep
  data/
    .gitkeep
    bars/ (created at runtime)
    cache/ (created at runtime)
    models/ (created at runtime)
```

---

## 3) Quant decision engine (daily HOLD/REDUCE/EXIT)

### Core state variables
- **TrendScore** (-1..+1): multi-horizon momentum (21/63/126/252d) + MA distance (50 vs 200)
- **RegimeState**: TREND_FRIENDLY / CHOP / RISK_OFF (realized vol + MA context)
- **OptionQuality**: liquidity score from spread%, open interest, volume
- **PositionHealth**: ROI, drawdown-from-peak, DTE time-risk buckets

### Decision rules (high level)
- **EXIT** if:
  - max loss hit (e.g., -35% ROI)
  - trend misalignment under CHOP/RISK_OFF
  - DTE hard threshold (<=60) + trade not strongly working → exit/roll suggestion
- **REDUCE** if:
  - ROI exceeds scale-out threshold(s)
  - drawdown from peak grows while thesis weakens
- **HOLD** if:
  - trend aligns + regime supportive + no risk triggers

---

## 4) Codebase (as provided in the session)

### requirements.txt
```txt
streamlit==1.37.1
pandas==2.2.2
numpy==1.26.4
yfinance==0.2.43
scikit-learn==1.5.1
joblib==1.4.2
pydantic==2.8.2
pyyaml==6.0.2
diskcache==5.6.3
matplotlib==3.9.2
```

### config.example.yaml
```yaml
app:
  base_currency: USD
  timezone: America/New_York
  cache_dir: "./data/cache"
  outputs_dir: "./outputs"

risk_defaults:
  max_loss_pct: 0.35
  scale_out_roi_1: 0.50
  scale_out_roi_2: 1.00
  dte_soft_warning: 90
  dte_hard_exit: 60

engine:
  trend:
    horizons_days: [21, 63, 126, 252]
    weights:       [0.20, 0.25, 0.25, 0.30]
    ma_fast: 50
    ma_slow: 200
    flip_confirm_days: 3
  regime:
    vol_lookback: 20
    vol_slow: 60
    riskoff_vol_z: 1.25
    chop_band: 0.15
  option:
    max_spread_pct: 0.10
    min_open_interest: 50
    min_volume: 10

data:
  bars_dir: "./data/bars"
  models_dir: "./data/models"

backtest:
  hold_days: 63
  stop_pct: 0.10
  take_pct: 0.20

walk_forward:
  enabled: true
  train_years: 2.0
  test_months: 3
  param_grid:
    - {pullback_band: 0.02, rsi_low: 40, rsi_high: 70}
    - {pullback_band: 0.03, rsi_low: 35, rsi_high: 70}
    - {pullback_band: 0.02, rsi_low: 45, rsi_high: 75}

ml:
  enabled: true
  horizon_days: 21
  min_rows: 400
  model_path: "./data/models/leaps_entry_model.joblib"
```

---

## 5) Key modules (code)

> NOTE: These snippets were pasted in the chat; in your repo, create files exactly as shown.

### `leaps_quant/util/types.py`
```python
from __future__ import annotations
from dataclasses import dataclass
from typing import Literal, Optional, Dict, Any

Direction = Literal["call", "put"]
Action = Literal["HOLD", "REDUCE", "EXIT"]

@dataclass(frozen=True)
class Position:
    symbol: str
    direction: Direction
    expiry: str            # YYYY-MM-DD
    strike: float
    contracts: int
    entry_price: Optional[float] = None  # per contract price
    max_loss_pct: float = 0.35
    scale_out_roi_1: float = 0.50
    scale_out_roi_2: float = 1.00

@dataclass(frozen=True)
class Decision:
    action: Action
    score: float
    reasons: list[str]
    watch: Dict[str, Any]
```

### `leaps_quant/data/providers.py`
```python
from __future__ import annotations
from abc import ABC, abstractmethod
import pandas as pd
from typing import Optional, Dict, Any

class MarketDataProvider(ABC):
    @abstractmethod
    def history(self, symbol: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
        ...

    @abstractmethod
    def spot(self, symbol: str) -> float:
        ...

    @abstractmethod
    def option_chain(self, symbol: str, expiry: str) -> Dict[str, pd.DataFrame]:
        \"\"\"Return dict with keys 'calls', 'puts' dataframes.\"\"\"
        ...

    @abstractmethod
    def fundamentals(self, symbol: str) -> Dict[str, Any]:
        \"\"\"Optional; return empty dict if unavailable.\"\"\"
        ...
```

### `leaps_quant/data/yfinance_provider.py`
```python
from __future__ import annotations
import yfinance as yf
import pandas as pd
from typing import Dict, Any
from .providers import MarketDataProvider

class YFinanceProvider(MarketDataProvider):
    def history(self, symbol: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
        t = yf.Ticker(symbol)
        df = t.history(period=period, interval=interval, auto_adjust=False)
        df = df.rename(columns=str.title)
        df = df.reset_index()
        return df

    def spot(self, symbol: str) -> float:
        t = yf.Ticker(symbol)
        df = t.history(period="5d", interval="1d", auto_adjust=False)
        return float(df["Close"].iloc[-1])

    def option_chain(self, symbol: str, expiry: str) -> Dict[str, pd.DataFrame]:
        t = yf.Ticker(symbol)
        oc = t.option_chain(expiry)
        calls = oc.calls.copy()
        puts = oc.puts.copy()
        return {"calls": calls, "puts": puts}

    def fundamentals(self, symbol: str) -> Dict[str, Any]:
        t = yf.Ticker(symbol)
        info = {}
        try:
            info = dict(t.info or {})
        except Exception:
            info = {}
        return info
```

### `leaps_quant/data/etrade_provider_stub.py`
```python
from __future__ import annotations
\"\"\"E*TRADE provider stub.\"\"\"
import pandas as pd
from typing import Dict, Any
from .providers import MarketDataProvider

class ETradeProvider(MarketDataProvider):
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("Wire OAuth + endpoints, then remove this raise.")

    def history(self, symbol: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
        raise NotImplementedError

    def spot(self, symbol: str) -> float:
        raise NotImplementedError

    def option_chain(self, symbol: str, expiry: str) -> Dict[str, pd.DataFrame]:
        raise NotImplementedError

    def fundamentals(self, symbol: str) -> Dict[str, Any]:
        return {}
```

### `leaps_quant/features/indicators.py`
```python
from __future__ import annotations
import numpy as np
import pandas as pd

def ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()

def sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window).mean()

def rsi(close: pd.Series, window: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(window).mean()
    loss = (-delta.clip(upper=0)).rolling(window).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))

def macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    macd_line = ema(close, fast) - ema(close, slow)
    signal_line = ema(macd_line, signal)
    hist = macd_line - signal_line
    return macd_line, signal_line, hist

def bollinger(close: pd.Series, window: int = 20, n_std: float = 2.0):
    mid = sma(close, window)
    std = close.rolling(window).std()
    upper = mid + n_std * std
    lower = mid - n_std * std
    return mid, upper, lower

def realized_vol(close: pd.Series, window: int = 20) -> pd.Series:
    rets = close.pct_change()
    return rets.rolling(window).std() * np.sqrt(252)

def zscore(series: pd.Series, window: int = 60) -> pd.Series:
    mu = series.rolling(window).mean()
    sd = series.rolling(window).std()
    return (series - mu) / sd.replace(0, np.nan)
```

### `leaps_quant/features/regime.py`
```python
from __future__ import annotations
import numpy as np
import pandas as pd
from .indicators import realized_vol, zscore, sma

def detect_regime(df: pd.DataFrame, vol_lb: int = 20, vol_slow: int = 60,
                  riskoff_vol_z: float = 1.25, chop_band: float = 0.15) -> str:
    close = df["Close"]
    rv_fast = realized_vol(close, vol_lb)
    vol_z = zscore(rv_fast, 60)

    ma_slow = sma(close, 200)
    ma_fast = sma(close, 50)

    ma_dist = (ma_fast - ma_slow) / ma_slow.replace(0, np.nan)
    ma_dist_abs = ma_dist.abs()

    v = float(vol_z.iloc[-1]) if len(vol_z) else 0.0
    c = float(close.iloc[-1])
    slow = float(ma_slow.iloc[-1]) if not np.isnan(ma_slow.iloc[-1]) else c

    if (not np.isnan(v)) and (v >= riskoff_vol_z) and (c < slow):
        return "RISK_OFF"

    if (not np.isnan(ma_dist_abs.iloc[-1])) and (ma_dist_abs.iloc[-1] < chop_band):
        return "CHOP"

    return "TREND_FRIENDLY"
```

### `leaps_quant/features/option_features.py`
```python
from __future__ import annotations
import numpy as np
import pandas as pd
from typing import Dict, Any

def pick_contract(chain: Dict[str, pd.DataFrame], direction: str, strike: float) -> pd.Series | None:
    df = chain["calls"] if direction == "call" else chain["puts"]
    if df.empty:
        return None
    idx = (df["strike"] - strike).abs().idxmin()
    return df.loc[idx]

def liquidity_score(row: pd.Series, max_spread_pct: float = 0.10,
                    min_oi: int = 50, min_vol: int = 10) -> Dict[str, Any]:
    bid = float(row.get("bid", np.nan))
    ask = float(row.get("ask", np.nan))
    mid = np.nan
    if np.isfinite(bid) and np.isfinite(ask) and ask > 0:
        mid = (bid + ask) / 2.0
    spread_pct = np.nan
    if np.isfinite(mid) and mid > 0 and np.isfinite(ask) and np.isfinite(bid):
        spread_pct = (ask - bid) / mid

    oi = int(row.get("openInterest", 0) or 0)
    vol = int(row.get("volume", 0) or 0)

    ok = True
    reasons = []
    if np.isfinite(spread_pct) and spread_pct > max_spread_pct:
        ok = False
        reasons.append(f"Wide spread ({spread_pct:.1%} > {max_spread_pct:.0%})")
    if oi < min_oi:
        ok = False
        reasons.append(f"Low open interest ({oi} < {min_oi})")
    if vol < min_vol:
        reasons.append(f"Low volume ({vol} < {min_vol})")

    score = 1.0
    if np.isfinite(spread_pct):
        score *= max(0.0, 1.0 - (spread_pct / max_spread_pct))
    score *= min(1.0, oi / max(min_oi, 1))
    score *= min(1.0, (vol + 1) / (min_vol + 1))

    return {
        "ok": ok,
        "score": float(np.clip(score, 0.0, 1.0)),
        "spread_pct": float(spread_pct) if np.isfinite(spread_pct) else None,
        "open_interest": oi,
        "volume": vol,
        "reasons": reasons
    }
```

### `leaps_quant/engine/scoring.py`
```python
from __future__ import annotations
import numpy as np

def clamp(x: float, lo: float, hi: float) -> float:
    return float(max(lo, min(hi, x)))

def weighted_sum(values: list[float], weights: list[float]) -> float:
    s = 0.0
    w = 0.0
    for v, wt in zip(values, weights):
        if v is None or (isinstance(v, float) and np.isnan(v)):
            continue
        s += v * wt
        w += wt
    return s / w if w > 0 else 0.0

def trend_score(momentum_components: list[float], weights: list[float], ma_distance: float) -> float:
    base = weighted_sum(momentum_components, weights)
    base_scaled = clamp(base / 0.25, -1.0, 1.0)
    ma_scaled = clamp(ma_distance / 0.10, -1.0, 1.0)
    return clamp(0.65 * base_scaled + 0.35 * ma_scaled, -1.0, 1.0)

def regime_modifier(regime: str) -> float:
    if regime == "TREND_FRIENDLY":
        return 1.0
    if regime == "CHOP":
        return 0.7
    if regime == "RISK_OFF":
        return 0.5
    return 0.8
```

### `leaps_quant/engine/decision.py`
*(Full file was provided in chat; keep as-is when pasting.)*

### `leaps_quant/backtest/backtester.py`
*(Updated to accept params for WFO; see session notes.)*

### `leaps_quant/backtest/walkforward.py`
*(Added for quant out-of-sample WFO.)*

### ML modules
- `leaps_quant/ml/dataset.py`
- `leaps_quant/ml/model.py`
- `leaps_quant/ml/validate.py`

### Execution + paper trading
- `leaps_quant/execution/broker.py`
- `leaps_quant/execution/paper.py`

### Monitoring health / edge decay
- `leaps_quant/monitor/health.py`

### Data store + cleaning
- `leaps_quant/data/store.py`

---

## 6) Streamlit UI (`app.py`)

The session delivered a working Streamlit app with:
- Sidebar: add/track LEAPS position
- Run button: fetch data, compute state, pull option chain, score liquidity, track peak mid, decide HOLD/REDUCE/EXIT
- Save daily JSON report under `./outputs`

**Recommended immediate follow-up inside Cursor:**
- Add tabs: Dashboard / Backtest / Walk-Forward / ML / Health
- Add plots (matplotlib) for price + MA, trend score over time, backtest stats, WFO fold table
- Add account-value input + sizing suggestion using `engine/position_sizing.py`

---

## 7) Updated README.md (quant workflow compliant)

```md
# LEAPS Quant Tool (Quant Algo Framework)

This is a quantitative algorithmic trading framework specialized for **LEAPS calls/puts**.
It supports: data ingestion, feature generation, strategy logic, backtesting with walk-forward/out-of-sample evaluation, risk management, paper/live execution interfaces, and monitoring/reporting.

## Quant Workflow Mapping

1) Hypothesis & Research  
- Strategy rules: trend + pullback + regime filter + LEAPS risk/time controls.

2) Data Acquisition & Preparation  
- Provider interface (`MarketDataProvider`) + `YFinanceProvider`.
- Optional E*TRADE execution provider stub.
- Cleaning + persistent storage in `./data/bars`.

3) Factor Generation  
- Features: MA(50/200), multi-horizon momentum, RSI, MACD histogram, Bollinger position, realized vol.

4) Backtesting & Validation  
- Underlying proxy backtest validates signal quality.
- Walk-forward optimization (`backtest/walkforward.py`) produces true out-of-sample results.

5) Out-of-Sample Testing  
- WFO folds with train/test windows and expectancy tracking.

6) Live Testing / Paper Trading  
- `execution/PaperBroker` supports simulated fills.

7) Deployment  
- Streamlit UI + daily JSON report snapshots.
- Optional scheduling (cron/Task Scheduler) to generate daily reports.

## Run
pip install -r requirements.txt  
streamlit run app.py

## Outputs
- ./outputs/daily_report_*.json
```

---

## 8) Cursor prompt (final, for Cursor/Claude IDE)

```text
You are a principal quant engineer. Upgrade/complete the `leaps-quant-tool` repo into a fully runnable quant algo framework specializing in LEAPS calls/puts.

Ensure the architecture matches a quant framework:
- Data layer: ingestion, cleaning, persistent storage (CSV under ./data/bars), caching under ./data/cache
- Strategy/model layer: features + decision engine + explainability
- Backtesting: underlying proxy backtest + walk-forward optimization with train/test folds, out-of-sample reporting, slippage proxy
- Risk management: risk-based position sizing (contracts recommendation), max loss exit, time-risk rules (DTE 90 warn, 60 hard rule)
- Execution module: broker interface + paper trading broker; keep E*TRADE provider as stub; do not add secrets
- Monitoring/reporting: strategy health metrics (win rate, expectancy, drawdown, edge decay flag) + daily JSON reports

Tasks:
1) Implement modules: data/store.py, backtest/walkforward.py, execution/broker.py, execution/paper.py, engine/position_sizing.py, monitor/health.py
2) Update app.py to: clean & persist bars; show sizing suggestion; add tabs for Dashboard/Backtest/WFO/ML/Health; visualize key metrics and results; keep daily decision HOLD/REDUCE/EXIT
3) Update README.md and config.example.yaml to document the quant workflow and components
4) Ensure imports work, safe handling of missing option fields, and `streamlit run app.py` works on a fresh machine

Keep UX intuitive: sidebar inputs; main dashboard with clear reasons and what-to-watch thresholds.
```

---

## 9) Notes / Next improvements (optional)

- Replace yfinance option greeks (often missing) with:
  - broker API greeks (E*TRADE) or paid feed
  - or compute approximate greeks with Black-Scholes using IV proxy
- Add portfolio-level exposure controls (delta budget, vega budget)
- Add scheduled daily run + email/Slack notifications
- Add SQLite journaling for trade lifecycle and equity curve

---

**End of session export.**
