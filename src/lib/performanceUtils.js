/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HISTORA Performance & Utilities Library
 * Performance monitoring, analytics, and common utilities
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE MONITOR - Real-time FPS tracking
// ─────────────────────────────────────────────────────────────────────────────

export class PerformanceMonitor {
  constructor(onUpdate = null, historySize = 60) {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.onUpdate = onUpdate;
    this.history = [];
    this.historySize = historySize;
    this.isRunning = false;
  }

  update() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
      this.history.push(this.fps);
      if (this.history.length > this.historySize) {
        this.history.shift();
      }
      this.onUpdate?.(this.fps);
    }
  }

  getAverageFPS() {
    if (this.history.length === 0) return 0;
    return Math.round(
      this.history.reduce((a, b) => a + b, 0) / this.history.length,
    );
  }

  getMinFPS() {
    return this.history.length > 0 ? Math.min(...this.history) : 0;
  }

  getMaxFPS() {
    return this.history.length > 0 ? Math.max(...this.history) : 0;
  }

  getStability() {
    // 0 = unstable, 100 = stable
    if (this.history.length < 10) return 0;
    const avg = this.getAverageFPS();
    const variance =
      this.history.reduce((sum, fps) => {
        return sum + Math.pow(fps - avg, 2);
      }, 0) / this.history.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev * 2);
  }

  reset() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.history = [];
  }

  getStats() {
    return {
      current: this.fps,
      average: this.getAverageFPS(),
      min: this.getMinFPS(),
      max: this.getMaxFPS(),
      stability: this.getStability(),
      history: [...this.history],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB VITALS - Core Web Vitals measurement
// ─────────────────────────────────────────────────────────────────────────────

export async function measureWebVitals() {
  return new Promise((resolve) => {
    let metrics = {
      fcp: null, // First Contentful Paint
      lcp: null, // Largest Contentful Paint
      cls: null, // Cumulative Layout Shift
      fid: null, // First Input Delay
      ttfb: null, // Time to First Byte
      tti: null, // Time to Interactive
    };

    // First Contentful Paint
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((p) => p.name === "first-contentful-paint");
    if (fcp) metrics.fcp = fcp.startTime;

    // Time to First Byte
    const navTiming = performance.getEntriesByType("navigation")[0];
    if (navTiming) {
      metrics.ttfb = navTiming.responseStart - navTiming.fetchStart;
      metrics.tti = navTiming.loadEventEnd - navTiming.fetchStart;
    }

    // Largest Contentful Paint (via PerformanceObserver)
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });

        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 5000);
      } catch (e) {
        resolve(metrics);
      }
    } else {
      resolve(metrics);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE ANALYZER - Analyze page resources
// ─────────────────────────────────────────────────────────────────────────────

export function analyzeResources() {
  const resources = performance.getEntriesByType("resource");

  const byType = {};
  let totalSize = 0;

  resources.forEach((res) => {
    const type = res.initiatorType || "other";
    const size = res.transferSize || 0;

    if (!byType[type]) {
      byType[type] = { count: 0, size: 0, items: [] };
    }

    byType[type].count++;
    byType[type].size += size;
    totalSize += size;

    byType[type].items.push({
      name: res.name.split("/").pop(),
      duration: res.duration,
      size: size,
    });
  });

  // Sort by size and get top 10
  const topBySize = resources
    .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
    .slice(0, 10)
    .map((r) => ({
      name: r.name.split("/").pop(),
      size: (r.transferSize / 1024 / 1024).toFixed(2) + " MB",
      duration: r.duration.toFixed(0) + " ms",
    }));

  return {
    totalResources: resources.length,
    totalSize: (totalSize / 1024 / 1024).toFixed(2) + " MB",
    byType,
    largestAssets: topBySize,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NETWORK QUALITY - Estimate network quality
// ─────────────────────────────────────────────────────────────────────────────

export function estimateNetworkQuality() {
  // Check Connection API if available
  if ("connection" in navigator) {
    const conn = navigator.connection || navigator.mozConnection;
    if (conn) {
      return {
        effectiveType: conn.effectiveType, // slow-2g | 2g | 3g | 4g
        downlink: conn.downlink, // Mbps
        rtt: conn.rtt, // ms
        saveData: conn.saveData,
      };
    }
  }

  // Fallback based on resource timings
  const resources = performance.getEntriesByType("resource");
  if (resources.length === 0) return null;

  const avgDuration =
    resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;

  if (avgDuration > 3000) return "slow";
  if (avgDuration > 1000) return "2g";
  if (avgDuration > 500) return "3g";
  return "4g";
}

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE INFO - Get device & browser information
// ─────────────────────────────────────────────────────────────────────────────

export function getDeviceInfo() {
  const ua = navigator.userAgent;

  let device = "desktop";
  let os = "unknown";
  let browser = "unknown";

  // Device type
  if (/mobile|android|iphone|ipad|windows phone/i.test(ua)) {
    device = /ipad/i.test(ua) ? "tablet" : "mobile";
  } else if (/tablet|ipad/i.test(ua)) {
    device = "tablet";
  }

  // OS detection
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/iphone|ios/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";

  // Browser detection
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";

  return {
    device, // mobile | tablet | desktop
    os,
    browser,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    memory: navigator.deviceMemory, // GB (if available)
    cores: navigator.hardwareConcurrency, // CPU cores (if available)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY TRACKING - Monitor memory usage
// ─────────────────────────────────────────────────────────────────────────────

export function getMemoryInfo() {
  if (!performance.memory) {
    return null;
  }

  const heap = performance.memory;

  return {
    usedJSHeapSize: (heap.usedJSHeapSize / 1048576).toFixed(2) + " MB",
    totalJSHeapSize: (heap.totalJSHeapSize / 1048576).toFixed(2) + " MB",
    jsHeapSizeLimit: (heap.jsHeapSizeLimit / 1048576).toFixed(2) + " MB",
    usagePercentage: Math.round(
      (heap.usedJSHeapSize / heap.jsHeapSizeLimit) * 100,
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS FORMATTER - Format performance data for reporting
// ─────────────────────────────────────────────────────────────────────────────

export function formatPerformanceReport() {
  const vitals = performance.getEntriesByType("navigation")[0];
  const paint = performance.getEntriesByType("paint");
  const resources = performance.getEntriesByType("resource");

  if (!vitals) return null;

  return {
    pageLoadTime: vitals.loadEventEnd - vitals.fetchStart,
    domInteractive: vitals.domInteractive - vitals.fetchStart,
    domComplete: vitals.domComplete - vitals.fetchStart,
    firstPaint: paint.find((p) => p.name === "first-paint")?.startTime,
    firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")
      ?.startTime,
    resourceCount: resources.length,
    totalResourceSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
    device: getDeviceInfo(),
    network: estimateNetworkQuality(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE UTILITIES - localStorage with expiration
// ─────────────────────────────────────────────────────────────────────────────

export const StorageUtils = {
  set(key, value, expirationMinutes = null) {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMinutes
        ? Date.now() + expirationMinutes * 60 * 1000
        : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      if (parsed.expiration && Date.now() > parsed.expiration) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC FEEDBACK - Provide haptic feedback on supported devices
// ─────────────────────────────────────────────────────────────────────────────

export const HapticFeedback = {
  light() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  medium() {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  },

  heavy() {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  },

  pulse(count = 2) {
    const pattern = Array(count * 2 - 1)
      .fill(0)
      .map((_, i) => (i % 2 === 0 ? 20 : 30));
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  success() {
    if (navigator.vibrate) {
      navigator.vibrate([20, 30, 20]);
    }
  },

  error() {
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 30]);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE & THROTTLE - Performance optimization utilities
// ─────────────────────────────────────────────────────────────────────────────

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST PERFORMANCE METRICS - Measure async operations
// ─────────────────────────────────────────────────────────────────────────────

export async function measureAsync(name, asyncFn) {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const duration = performance.now() - start;
    console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(
      `[PERF] ${name}: FAILED after ${duration.toFixed(2)}ms`,
      error,
    );
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default {
  PerformanceMonitor,
  measureWebVitals,
  analyzeResources,
  estimateNetworkQuality,
  getDeviceInfo,
  getMemoryInfo,
  formatPerformanceReport,
  StorageUtils,
  HapticFeedback,
  debounce,
  throttle,
  measureAsync,
};
