var Ps = Object.defineProperty;
var Fs = (e, t, n) => t in e ? Ps(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var wi = (e, t, n) => Fs(e, typeof t != "symbol" ? t + "" : t, n);
import { r as Ls, s as Ts, j as Ds, A as Ms } from "./lib-CSTnVa-i.js";
var zu = { exports: {} }, he = {}, _u = { exports: {} }, Nu = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
  function t(E, N) {
    var P = E.length;
    E.push(N);
    e: for (; 0 < P; ) {
      var H = P - 1 >>> 1, Y = E[H];
      if (0 < l(Y, N)) E[H] = N, E[P] = Y, P = H;
      else break e;
    }
  }
  function n(E) {
    return E.length === 0 ? null : E[0];
  }
  function r(E) {
    if (E.length === 0) return null;
    var N = E[0], P = E.pop();
    if (P !== N) {
      E[0] = P;
      e: for (var H = 0, Y = E.length, Yn = Y >>> 1; H < Yn; ) {
        var ft = 2 * (H + 1) - 1, al = E[ft], pt = ft + 1, Xn = E[pt];
        if (0 > l(al, P)) pt < Y && 0 > l(Xn, al) ? (E[H] = Xn, E[pt] = P, H = pt) : (E[H] = al, E[ft] = P, H = ft);
        else if (pt < Y && 0 > l(Xn, P)) E[H] = Xn, E[pt] = P, H = pt;
        else break e;
      }
    }
    return N;
  }
  function l(E, N) {
    var P = E.sortIndex - N.sortIndex;
    return P !== 0 ? P : E.id - N.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var o = performance;
    e.unstable_now = function() {
      return o.now();
    };
  } else {
    var i = Date, u = i.now();
    e.unstable_now = function() {
      return i.now() - u;
    };
  }
  var a = [], f = [], h = 1, m = null, p = 3, w = !1, y = !1, x = !1, O = typeof setTimeout == "function" ? setTimeout : null, c = typeof clearTimeout == "function" ? clearTimeout : null, s = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function d(E) {
    for (var N = n(f); N !== null; ) {
      if (N.callback === null) r(f);
      else if (N.startTime <= E) r(f), N.sortIndex = N.expirationTime, t(a, N);
      else break;
      N = n(f);
    }
  }
  function g(E) {
    if (x = !1, d(E), !y) if (n(a) !== null) y = !0, il(S);
    else {
      var N = n(f);
      N !== null && ul(g, N.startTime - E);
    }
  }
  function S(E, N) {
    y = !1, x && (x = !1, c(_), _ = -1), w = !0;
    var P = p;
    try {
      for (d(N), m = n(a); m !== null && (!(m.expirationTime > N) || E && !Ee()); ) {
        var H = m.callback;
        if (typeof H == "function") {
          m.callback = null, p = m.priorityLevel;
          var Y = H(m.expirationTime <= N);
          N = e.unstable_now(), typeof Y == "function" ? m.callback = Y : m === n(a) && r(a), d(N);
        } else r(a);
        m = n(a);
      }
      if (m !== null) var Yn = !0;
      else {
        var ft = n(f);
        ft !== null && ul(g, ft.startTime - N), Yn = !1;
      }
      return Yn;
    } finally {
      m = null, p = P, w = !1;
    }
  }
  var C = !1, z = null, _ = -1, V = 5, F = -1;
  function Ee() {
    return !(e.unstable_now() - F < V);
  }
  function nn() {
    if (z !== null) {
      var E = e.unstable_now();
      F = E;
      var N = !0;
      try {
        N = z(!0, E);
      } finally {
        N ? rn() : (C = !1, z = null);
      }
    } else C = !1;
  }
  var rn;
  if (typeof s == "function") rn = function() {
    s(nn);
  };
  else if (typeof MessageChannel < "u") {
    var vi = new MessageChannel(), Ns = vi.port2;
    vi.port1.onmessage = nn, rn = function() {
      Ns.postMessage(null);
    };
  } else rn = function() {
    O(nn, 0);
  };
  function il(E) {
    z = E, C || (C = !0, rn());
  }
  function ul(E, N) {
    _ = O(function() {
      E(e.unstable_now());
    }, N);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(E) {
    E.callback = null;
  }, e.unstable_continueExecution = function() {
    y || w || (y = !0, il(S));
  }, e.unstable_forceFrameRate = function(E) {
    0 > E || 125 < E ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : V = 0 < E ? Math.floor(1e3 / E) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return p;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, e.unstable_next = function(E) {
    switch (p) {
      case 1:
      case 2:
      case 3:
        var N = 3;
        break;
      default:
        N = p;
    }
    var P = p;
    p = N;
    try {
      return E();
    } finally {
      p = P;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(E, N) {
    switch (E) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        E = 3;
    }
    var P = p;
    p = E;
    try {
      return N();
    } finally {
      p = P;
    }
  }, e.unstable_scheduleCallback = function(E, N, P) {
    var H = e.unstable_now();
    switch (typeof P == "object" && P !== null ? (P = P.delay, P = typeof P == "number" && 0 < P ? H + P : H) : P = H, E) {
      case 1:
        var Y = -1;
        break;
      case 2:
        Y = 250;
        break;
      case 5:
        Y = 1073741823;
        break;
      case 4:
        Y = 1e4;
        break;
      default:
        Y = 5e3;
    }
    return Y = P + Y, E = { id: h++, callback: N, priorityLevel: E, startTime: P, expirationTime: Y, sortIndex: -1 }, P > H ? (E.sortIndex = P, t(f, E), n(a) === null && E === n(f) && (x ? (c(_), _ = -1) : x = !0, ul(g, P - H))) : (E.sortIndex = Y, t(a, E), y || w || (y = !0, il(S))), E;
  }, e.unstable_shouldYield = Ee, e.unstable_wrapCallback = function(E) {
    var N = p;
    return function() {
      var P = p;
      p = N;
      try {
        return E.apply(this, arguments);
      } finally {
        p = P;
      }
    };
  };
})(Nu);
_u.exports = Nu;
var Rs = _u.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Os = Ls, me = Rs;
function v(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var Pu = /* @__PURE__ */ new Set(), _n = {};
function _t(e, t) {
  Yt(e, t), Yt(e + "Capture", t);
}
function Yt(e, t) {
  for (_n[e] = t, e = 0; e < t.length; e++) Pu.add(t[e]);
}
var Ve = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Rl = Object.prototype.hasOwnProperty, Is = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, yi = {}, xi = {};
function js(e) {
  return Rl.call(xi, e) ? !0 : Rl.call(yi, e) ? !1 : Is.test(e) ? xi[e] = !0 : (yi[e] = !0, !1);
}
function As(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Us(e, t, n, r) {
  if (t === null || typeof t > "u" || As(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === !1;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return !1;
}
function oe(e, t, n, r, l, o, i) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
}
var q = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  q[e] = new oe(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  q[t] = new oe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  q[e] = new oe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  q[e] = new oe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  q[e] = new oe(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  q[e] = new oe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  q[e] = new oe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  q[e] = new oe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  q[e] = new oe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var No = /[\-:]([a-z])/g;
function Po(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    No,
    Po
  );
  q[t] = new oe(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(No, Po);
  q[t] = new oe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(No, Po);
  q[t] = new oe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  q[e] = new oe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
q.xlinkHref = new oe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  q[e] = new oe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Fo(e, t, n, r) {
  var l = q.hasOwnProperty(t) ? q[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Us(t, n, l, r) && (n = null), r || l === null ? js(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var $e = Os.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Gn = Symbol.for("react.element"), Ft = Symbol.for("react.portal"), Lt = Symbol.for("react.fragment"), Lo = Symbol.for("react.strict_mode"), Ol = Symbol.for("react.profiler"), Fu = Symbol.for("react.provider"), Lu = Symbol.for("react.context"), To = Symbol.for("react.forward_ref"), Il = Symbol.for("react.suspense"), jl = Symbol.for("react.suspense_list"), Do = Symbol.for("react.memo"), Ye = Symbol.for("react.lazy"), Tu = Symbol.for("react.offscreen"), ki = Symbol.iterator;
function ln(e) {
  return e === null || typeof e != "object" ? null : (e = ki && e[ki] || e["@@iterator"], typeof e == "function" ? e : null);
}
var U = Object.assign, sl;
function pn(e) {
  if (sl === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    sl = t && t[1] || "";
  }
  return `
` + sl + e;
}
var cl = !1;
function dl(e, t) {
  if (!e || cl) return "";
  cl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (f) {
        var r = f;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (f) {
        r = f;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (f) {
        r = f;
      }
      e();
    }
  } catch (f) {
    if (f && r && typeof f.stack == "string") {
      for (var l = f.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, u = o.length - 1; 1 <= i && 0 <= u && l[i] !== o[u]; ) u--;
      for (; 1 <= i && 0 <= u; i--, u--) if (l[i] !== o[u]) {
        if (i !== 1 || u !== 1)
          do
            if (i--, u--, 0 > u || l[i] !== o[u]) {
              var a = `
` + l[i].replace(" at new ", " at ");
              return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
            }
          while (1 <= i && 0 <= u);
        break;
      }
    }
  } finally {
    cl = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? pn(e) : "";
}
function Bs(e) {
  switch (e.tag) {
    case 5:
      return pn(e.type);
    case 16:
      return pn("Lazy");
    case 13:
      return pn("Suspense");
    case 19:
      return pn("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = dl(e.type, !1), e;
    case 11:
      return e = dl(e.type.render, !1), e;
    case 1:
      return e = dl(e.type, !0), e;
    default:
      return "";
  }
}
function Al(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Lt:
      return "Fragment";
    case Ft:
      return "Portal";
    case Ol:
      return "Profiler";
    case Lo:
      return "StrictMode";
    case Il:
      return "Suspense";
    case jl:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case Lu:
      return (e.displayName || "Context") + ".Consumer";
    case Fu:
      return (e._context.displayName || "Context") + ".Provider";
    case To:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case Do:
      return t = e.displayName || null, t !== null ? t : Al(e.type) || "Memo";
    case Ye:
      t = e._payload, e = e._init;
      try {
        return Al(e(t));
      } catch {
      }
  }
  return null;
}
function Vs(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Al(t);
    case 8:
      return t === Lo ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function ut(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Du(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Hs(e) {
  var t = Du(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var l = n.get, o = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return l.call(this);
    }, set: function(i) {
      r = "" + i, o.call(this, i);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(i) {
      r = "" + i;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function Zn(e) {
  e._valueTracker || (e._valueTracker = Hs(e));
}
function Mu(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = Du(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function kr(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Ul(e, t) {
  var n = t.checked;
  return U({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Si(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = ut(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function Ru(e, t) {
  t = t.checked, t != null && Fo(e, "checked", t, !1);
}
function Bl(e, t) {
  Ru(e, t);
  var n = ut(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? Vl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Vl(e, t.type, ut(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Ei(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function Vl(e, t, n) {
  (t !== "number" || kr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var mn = Array.isArray;
function Vt(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + ut(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        e[l].selected = !0, r && (e[l].defaultSelected = !0);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function Hl(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(v(91));
  return U({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Ci(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(v(92));
      if (mn(n)) {
        if (1 < n.length) throw Error(v(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: ut(n) };
}
function Ou(e, t) {
  var n = ut(t.value), r = ut(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function zi(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Iu(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Ql(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? Iu(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var Jn, ju = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, l);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (Jn = Jn || document.createElement("div"), Jn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Jn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function Nn(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var vn = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, Qs = ["Webkit", "ms", "Moz", "O"];
Object.keys(vn).forEach(function(e) {
  Qs.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), vn[t] = vn[e];
  });
});
function Au(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || vn.hasOwnProperty(e) && vn[e] ? ("" + t).trim() : t + "px";
}
function Uu(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = Au(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var Ws = U({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function Wl(e, t) {
  if (t) {
    if (Ws[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(v(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(v(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(v(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(v(62));
  }
}
function $l(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Kl = null;
function Mo(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var Yl = null, Ht = null, Qt = null;
function _i(e) {
  if (e = $n(e)) {
    if (typeof Yl != "function") throw Error(v(280));
    var t = e.stateNode;
    t && (t = Gr(t), Yl(e.stateNode, e.type, t));
  }
}
function Bu(e) {
  Ht ? Qt ? Qt.push(e) : Qt = [e] : Ht = e;
}
function Vu() {
  if (Ht) {
    var e = Ht, t = Qt;
    if (Qt = Ht = null, _i(e), t) for (e = 0; e < t.length; e++) _i(t[e]);
  }
}
function Hu(e, t) {
  return e(t);
}
function Qu() {
}
var fl = !1;
function Wu(e, t, n) {
  if (fl) return e(t, n);
  fl = !0;
  try {
    return Hu(e, t, n);
  } finally {
    fl = !1, (Ht !== null || Qt !== null) && (Qu(), Vu());
  }
}
function Pn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Gr(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(v(231, t, typeof n));
  return n;
}
var Xl = !1;
if (Ve) try {
  var on = {};
  Object.defineProperty(on, "passive", { get: function() {
    Xl = !0;
  } }), window.addEventListener("test", on, on), window.removeEventListener("test", on, on);
} catch {
  Xl = !1;
}
function $s(e, t, n, r, l, o, i, u, a) {
  var f = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, f);
  } catch (h) {
    this.onError(h);
  }
}
var wn = !1, Sr = null, Er = !1, Gl = null, Ks = { onError: function(e) {
  wn = !0, Sr = e;
} };
function Ys(e, t, n, r, l, o, i, u, a) {
  wn = !1, Sr = null, $s.apply(Ks, arguments);
}
function Xs(e, t, n, r, l, o, i, u, a) {
  if (Ys.apply(this, arguments), wn) {
    if (wn) {
      var f = Sr;
      wn = !1, Sr = null;
    } else throw Error(v(198));
    Er || (Er = !0, Gl = f);
  }
}
function Nt(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function $u(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Ni(e) {
  if (Nt(e) !== e) throw Error(v(188));
}
function Gs(e) {
  var t = e.alternate;
  if (!t) {
    if (t = Nt(e), t === null) throw Error(v(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var o = l.alternate;
    if (o === null) {
      if (r = l.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === o.child) {
      for (o = l.child; o; ) {
        if (o === n) return Ni(l), e;
        if (o === r) return Ni(l), t;
        o = o.sibling;
      }
      throw Error(v(188));
    }
    if (n.return !== r.return) n = l, r = o;
    else {
      for (var i = !1, u = l.child; u; ) {
        if (u === n) {
          i = !0, n = l, r = o;
          break;
        }
        if (u === r) {
          i = !0, r = l, n = o;
          break;
        }
        u = u.sibling;
      }
      if (!i) {
        for (u = o.child; u; ) {
          if (u === n) {
            i = !0, n = o, r = l;
            break;
          }
          if (u === r) {
            i = !0, r = o, n = l;
            break;
          }
          u = u.sibling;
        }
        if (!i) throw Error(v(189));
      }
    }
    if (n.alternate !== r) throw Error(v(190));
  }
  if (n.tag !== 3) throw Error(v(188));
  return n.stateNode.current === n ? e : t;
}
function Ku(e) {
  return e = Gs(e), e !== null ? Yu(e) : null;
}
function Yu(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Yu(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Xu = me.unstable_scheduleCallback, Pi = me.unstable_cancelCallback, Zs = me.unstable_shouldYield, Js = me.unstable_requestPaint, Q = me.unstable_now, qs = me.unstable_getCurrentPriorityLevel, Ro = me.unstable_ImmediatePriority, Gu = me.unstable_UserBlockingPriority, Cr = me.unstable_NormalPriority, bs = me.unstable_LowPriority, Zu = me.unstable_IdlePriority, $r = null, Re = null;
function ec(e) {
  if (Re && typeof Re.onCommitFiberRoot == "function") try {
    Re.onCommitFiberRoot($r, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Pe = Math.clz32 ? Math.clz32 : rc, tc = Math.log, nc = Math.LN2;
function rc(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (tc(e) / nc | 0) | 0;
}
var qn = 64, bn = 4194304;
function hn(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function zr(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
  if (i !== 0) {
    var u = i & ~l;
    u !== 0 ? r = hn(u) : (o &= i, o !== 0 && (r = hn(o)));
  } else i = n & ~l, i !== 0 ? r = hn(i) : o !== 0 && (r = hn(o));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & l) && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Pe(t), l = 1 << n, r |= e[n], t &= ~l;
  return r;
}
function lc(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function oc(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
    var i = 31 - Pe(o), u = 1 << i, a = l[i];
    a === -1 ? (!(u & n) || u & r) && (l[i] = lc(u, t)) : a <= t && (e.expiredLanes |= u), o &= ~u;
  }
}
function Zl(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Ju() {
  var e = qn;
  return qn <<= 1, !(qn & 4194240) && (qn = 64), e;
}
function pl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Qn(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Pe(t), e[t] = n;
}
function ic(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Pe(n), o = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
  }
}
function Oo(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Pe(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var T = 0;
function qu(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var bu, Io, ea, ta, na, Jl = !1, er = [], be = null, et = null, tt = null, Fn = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new Map(), Ge = [], uc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Fi(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      be = null;
      break;
    case "dragenter":
    case "dragleave":
      et = null;
      break;
    case "mouseover":
    case "mouseout":
      tt = null;
      break;
    case "pointerover":
    case "pointerout":
      Fn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Ln.delete(t.pointerId);
  }
}
function un(e, t, n, r, l, o) {
  return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = $n(t), t !== null && Io(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function ac(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return be = un(be, e, t, n, r, l), !0;
    case "dragenter":
      return et = un(et, e, t, n, r, l), !0;
    case "mouseover":
      return tt = un(tt, e, t, n, r, l), !0;
    case "pointerover":
      var o = l.pointerId;
      return Fn.set(o, un(Fn.get(o) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return o = l.pointerId, Ln.set(o, un(Ln.get(o) || null, e, t, n, r, l)), !0;
  }
  return !1;
}
function ra(e) {
  var t = gt(e.target);
  if (t !== null) {
    var n = Nt(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = $u(n), t !== null) {
          e.blockedOn = t, na(e.priority, function() {
            ea(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function dr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = ql(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      Kl = r, n.target.dispatchEvent(r), Kl = null;
    } else return t = $n(n), t !== null && Io(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function Li(e, t, n) {
  dr(e) && n.delete(t);
}
function sc() {
  Jl = !1, be !== null && dr(be) && (be = null), et !== null && dr(et) && (et = null), tt !== null && dr(tt) && (tt = null), Fn.forEach(Li), Ln.forEach(Li);
}
function an(e, t) {
  e.blockedOn === t && (e.blockedOn = null, Jl || (Jl = !0, me.unstable_scheduleCallback(me.unstable_NormalPriority, sc)));
}
function Tn(e) {
  function t(l) {
    return an(l, e);
  }
  if (0 < er.length) {
    an(er[0], e);
    for (var n = 1; n < er.length; n++) {
      var r = er[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (be !== null && an(be, e), et !== null && an(et, e), tt !== null && an(tt, e), Fn.forEach(t), Ln.forEach(t), n = 0; n < Ge.length; n++) r = Ge[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Ge.length && (n = Ge[0], n.blockedOn === null); ) ra(n), n.blockedOn === null && Ge.shift();
}
var Wt = $e.ReactCurrentBatchConfig, _r = !0;
function cc(e, t, n, r) {
  var l = T, o = Wt.transition;
  Wt.transition = null;
  try {
    T = 1, jo(e, t, n, r);
  } finally {
    T = l, Wt.transition = o;
  }
}
function dc(e, t, n, r) {
  var l = T, o = Wt.transition;
  Wt.transition = null;
  try {
    T = 4, jo(e, t, n, r);
  } finally {
    T = l, Wt.transition = o;
  }
}
function jo(e, t, n, r) {
  if (_r) {
    var l = ql(e, t, n, r);
    if (l === null) El(e, t, r, Nr, n), Fi(e, r);
    else if (ac(l, e, t, n, r)) r.stopPropagation();
    else if (Fi(e, r), t & 4 && -1 < uc.indexOf(e)) {
      for (; l !== null; ) {
        var o = $n(l);
        if (o !== null && bu(o), o = ql(e, t, n, r), o === null && El(e, t, r, Nr, n), o === l) break;
        l = o;
      }
      l !== null && r.stopPropagation();
    } else El(e, t, r, null, n);
  }
}
var Nr = null;
function ql(e, t, n, r) {
  if (Nr = null, e = Mo(r), e = gt(e), e !== null) if (t = Nt(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = $u(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Nr = e, null;
}
function la(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (qs()) {
        case Ro:
          return 1;
        case Gu:
          return 4;
        case Cr:
        case bs:
          return 16;
        case Zu:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Je = null, Ao = null, fr = null;
function oa() {
  if (fr) return fr;
  var e, t = Ao, n = t.length, r, l = "value" in Je ? Je.value : Je.textContent, o = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var i = n - e;
  for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
  return fr = l.slice(e, 1 < r ? 1 - r : void 0);
}
function pr(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function tr() {
  return !0;
}
function Ti() {
  return !1;
}
function ge(e) {
  function t(n, r, l, o, i) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
    return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? tr : Ti, this.isPropagationStopped = Ti, this;
  }
  return U(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = tr);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = tr);
  }, persist: function() {
  }, isPersistent: tr }), t;
}
var en = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, Uo = ge(en), Wn = U({}, en, { view: 0, detail: 0 }), fc = ge(Wn), ml, hl, sn, Kr = U({}, Wn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Bo, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== sn && (sn && e.type === "mousemove" ? (ml = e.screenX - sn.screenX, hl = e.screenY - sn.screenY) : hl = ml = 0, sn = e), ml);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : hl;
} }), Di = ge(Kr), pc = U({}, Kr, { dataTransfer: 0 }), mc = ge(pc), hc = U({}, Wn, { relatedTarget: 0 }), gl = ge(hc), gc = U({}, en, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), vc = ge(gc), wc = U({}, en, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), yc = ge(wc), xc = U({}, en, { data: 0 }), Mi = ge(xc), kc = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Sc = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Ec = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Cc(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Ec[e]) ? !!t[e] : !1;
}
function Bo() {
  return Cc;
}
var zc = U({}, Wn, { key: function(e) {
  if (e.key) {
    var t = kc[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = pr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Bo, charCode: function(e) {
  return e.type === "keypress" ? pr(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? pr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), _c = ge(zc), Nc = U({}, Kr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ri = ge(Nc), Pc = U({}, Wn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Bo }), Fc = ge(Pc), Lc = U({}, en, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Tc = ge(Lc), Dc = U({}, Kr, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Mc = ge(Dc), Rc = [9, 13, 27, 32], Vo = Ve && "CompositionEvent" in window, yn = null;
Ve && "documentMode" in document && (yn = document.documentMode);
var Oc = Ve && "TextEvent" in window && !yn, ia = Ve && (!Vo || yn && 8 < yn && 11 >= yn), Oi = " ", Ii = !1;
function ua(e, t) {
  switch (e) {
    case "keyup":
      return Rc.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function aa(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Tt = !1;
function Ic(e, t) {
  switch (e) {
    case "compositionend":
      return aa(t);
    case "keypress":
      return t.which !== 32 ? null : (Ii = !0, Oi);
    case "textInput":
      return e = t.data, e === Oi && Ii ? null : e;
    default:
      return null;
  }
}
function jc(e, t) {
  if (Tt) return e === "compositionend" || !Vo && ua(e, t) ? (e = oa(), fr = Ao = Je = null, Tt = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return ia && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Ac = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function ji(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Ac[e.type] : t === "textarea";
}
function sa(e, t, n, r) {
  Bu(r), t = Pr(t, "onChange"), 0 < t.length && (n = new Uo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var xn = null, Dn = null;
function Uc(e) {
  xa(e, 0);
}
function Yr(e) {
  var t = Rt(e);
  if (Mu(t)) return e;
}
function Bc(e, t) {
  if (e === "change") return t;
}
var ca = !1;
if (Ve) {
  var vl;
  if (Ve) {
    var wl = "oninput" in document;
    if (!wl) {
      var Ai = document.createElement("div");
      Ai.setAttribute("oninput", "return;"), wl = typeof Ai.oninput == "function";
    }
    vl = wl;
  } else vl = !1;
  ca = vl && (!document.documentMode || 9 < document.documentMode);
}
function Ui() {
  xn && (xn.detachEvent("onpropertychange", da), Dn = xn = null);
}
function da(e) {
  if (e.propertyName === "value" && Yr(Dn)) {
    var t = [];
    sa(t, Dn, e, Mo(e)), Wu(Uc, t);
  }
}
function Vc(e, t, n) {
  e === "focusin" ? (Ui(), xn = t, Dn = n, xn.attachEvent("onpropertychange", da)) : e === "focusout" && Ui();
}
function Hc(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Yr(Dn);
}
function Qc(e, t) {
  if (e === "click") return Yr(t);
}
function Wc(e, t) {
  if (e === "input" || e === "change") return Yr(t);
}
function $c(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Le = typeof Object.is == "function" ? Object.is : $c;
function Mn(e, t) {
  if (Le(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!Rl.call(t, l) || !Le(e[l], t[l])) return !1;
  }
  return !0;
}
function Bi(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Vi(e, t) {
  var n = Bi(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Bi(n);
  }
}
function fa(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? fa(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function pa() {
  for (var e = window, t = kr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = kr(e.document);
  }
  return t;
}
function Ho(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Kc(e) {
  var t = pa(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && fa(n.ownerDocument.documentElement, n)) {
    if (r !== null && Ho(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = n.textContent.length, o = Math.min(r.start, l);
        r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Vi(n, o);
        var i = Vi(
          n,
          r
        );
        l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Yc = Ve && "documentMode" in document && 11 >= document.documentMode, Dt = null, bl = null, kn = null, eo = !1;
function Hi(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  eo || Dt == null || Dt !== kr(r) || (r = Dt, "selectionStart" in r && Ho(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), kn && Mn(kn, r) || (kn = r, r = Pr(bl, "onSelect"), 0 < r.length && (t = new Uo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Dt)));
}
function nr(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Mt = { animationend: nr("Animation", "AnimationEnd"), animationiteration: nr("Animation", "AnimationIteration"), animationstart: nr("Animation", "AnimationStart"), transitionend: nr("Transition", "TransitionEnd") }, yl = {}, ma = {};
Ve && (ma = document.createElement("div").style, "AnimationEvent" in window || (delete Mt.animationend.animation, delete Mt.animationiteration.animation, delete Mt.animationstart.animation), "TransitionEvent" in window || delete Mt.transitionend.transition);
function Xr(e) {
  if (yl[e]) return yl[e];
  if (!Mt[e]) return e;
  var t = Mt[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in ma) return yl[e] = t[n];
  return e;
}
var ha = Xr("animationend"), ga = Xr("animationiteration"), va = Xr("animationstart"), wa = Xr("transitionend"), ya = /* @__PURE__ */ new Map(), Qi = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function st(e, t) {
  ya.set(e, t), _t(t, [e]);
}
for (var xl = 0; xl < Qi.length; xl++) {
  var kl = Qi[xl], Xc = kl.toLowerCase(), Gc = kl[0].toUpperCase() + kl.slice(1);
  st(Xc, "on" + Gc);
}
st(ha, "onAnimationEnd");
st(ga, "onAnimationIteration");
st(va, "onAnimationStart");
st("dblclick", "onDoubleClick");
st("focusin", "onFocus");
st("focusout", "onBlur");
st(wa, "onTransitionEnd");
Yt("onMouseEnter", ["mouseout", "mouseover"]);
Yt("onMouseLeave", ["mouseout", "mouseover"]);
Yt("onPointerEnter", ["pointerout", "pointerover"]);
Yt("onPointerLeave", ["pointerout", "pointerover"]);
_t("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
_t("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
_t("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
_t("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
_t("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
_t("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var gn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Zc = new Set("cancel close invalid load scroll toggle".split(" ").concat(gn));
function Wi(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, Xs(r, t, void 0, e), e.currentTarget = null;
}
function xa(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], l = r.event;
    r = r.listeners;
    e: {
      var o = void 0;
      if (t) for (var i = r.length - 1; 0 <= i; i--) {
        var u = r[i], a = u.instance, f = u.currentTarget;
        if (u = u.listener, a !== o && l.isPropagationStopped()) break e;
        Wi(l, u, f), o = a;
      }
      else for (i = 0; i < r.length; i++) {
        if (u = r[i], a = u.instance, f = u.currentTarget, u = u.listener, a !== o && l.isPropagationStopped()) break e;
        Wi(l, u, f), o = a;
      }
    }
  }
  if (Er) throw e = Gl, Er = !1, Gl = null, e;
}
function M(e, t) {
  var n = t[oo];
  n === void 0 && (n = t[oo] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (ka(t, e, 2, !1), n.add(r));
}
function Sl(e, t, n) {
  var r = 0;
  t && (r |= 4), ka(n, e, r, t);
}
var rr = "_reactListening" + Math.random().toString(36).slice(2);
function Rn(e) {
  if (!e[rr]) {
    e[rr] = !0, Pu.forEach(function(n) {
      n !== "selectionchange" && (Zc.has(n) || Sl(n, !1, e), Sl(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[rr] || (t[rr] = !0, Sl("selectionchange", !1, t));
  }
}
function ka(e, t, n, r) {
  switch (la(t)) {
    case 1:
      var l = cc;
      break;
    case 4:
      l = dc;
      break;
    default:
      l = jo;
  }
  n = l.bind(null, t, n, e), l = void 0, !Xl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
}
function El(e, t, n, r, l) {
  var o = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var i = r.tag;
    if (i === 3 || i === 4) {
      var u = r.stateNode.containerInfo;
      if (u === l || u.nodeType === 8 && u.parentNode === l) break;
      if (i === 4) for (i = r.return; i !== null; ) {
        var a = i.tag;
        if ((a === 3 || a === 4) && (a = i.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l)) return;
        i = i.return;
      }
      for (; u !== null; ) {
        if (i = gt(u), i === null) return;
        if (a = i.tag, a === 5 || a === 6) {
          r = o = i;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  Wu(function() {
    var f = o, h = Mo(n), m = [];
    e: {
      var p = ya.get(e);
      if (p !== void 0) {
        var w = Uo, y = e;
        switch (e) {
          case "keypress":
            if (pr(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = _c;
            break;
          case "focusin":
            y = "focus", w = gl;
            break;
          case "focusout":
            y = "blur", w = gl;
            break;
          case "beforeblur":
          case "afterblur":
            w = gl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = Di;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = mc;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = Fc;
            break;
          case ha:
          case ga:
          case va:
            w = vc;
            break;
          case wa:
            w = Tc;
            break;
          case "scroll":
            w = fc;
            break;
          case "wheel":
            w = Mc;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = yc;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = Ri;
        }
        var x = (t & 4) !== 0, O = !x && e === "scroll", c = x ? p !== null ? p + "Capture" : null : p;
        x = [];
        for (var s = f, d; s !== null; ) {
          d = s;
          var g = d.stateNode;
          if (d.tag === 5 && g !== null && (d = g, c !== null && (g = Pn(s, c), g != null && x.push(On(s, g, d)))), O) break;
          s = s.return;
        }
        0 < x.length && (p = new w(p, y, null, n, h), m.push({ event: p, listeners: x }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (p = e === "mouseover" || e === "pointerover", w = e === "mouseout" || e === "pointerout", p && n !== Kl && (y = n.relatedTarget || n.fromElement) && (gt(y) || y[He])) break e;
        if ((w || p) && (p = h.window === h ? h : (p = h.ownerDocument) ? p.defaultView || p.parentWindow : window, w ? (y = n.relatedTarget || n.toElement, w = f, y = y ? gt(y) : null, y !== null && (O = Nt(y), y !== O || y.tag !== 5 && y.tag !== 6) && (y = null)) : (w = null, y = f), w !== y)) {
          if (x = Di, g = "onMouseLeave", c = "onMouseEnter", s = "mouse", (e === "pointerout" || e === "pointerover") && (x = Ri, g = "onPointerLeave", c = "onPointerEnter", s = "pointer"), O = w == null ? p : Rt(w), d = y == null ? p : Rt(y), p = new x(g, s + "leave", w, n, h), p.target = O, p.relatedTarget = d, g = null, gt(h) === f && (x = new x(c, s + "enter", y, n, h), x.target = d, x.relatedTarget = O, g = x), O = g, w && y) t: {
            for (x = w, c = y, s = 0, d = x; d; d = Pt(d)) s++;
            for (d = 0, g = c; g; g = Pt(g)) d++;
            for (; 0 < s - d; ) x = Pt(x), s--;
            for (; 0 < d - s; ) c = Pt(c), d--;
            for (; s--; ) {
              if (x === c || c !== null && x === c.alternate) break t;
              x = Pt(x), c = Pt(c);
            }
            x = null;
          }
          else x = null;
          w !== null && $i(m, p, w, x, !1), y !== null && O !== null && $i(m, O, y, x, !0);
        }
      }
      e: {
        if (p = f ? Rt(f) : window, w = p.nodeName && p.nodeName.toLowerCase(), w === "select" || w === "input" && p.type === "file") var S = Bc;
        else if (ji(p)) if (ca) S = Wc;
        else {
          S = Hc;
          var C = Vc;
        }
        else (w = p.nodeName) && w.toLowerCase() === "input" && (p.type === "checkbox" || p.type === "radio") && (S = Qc);
        if (S && (S = S(e, f))) {
          sa(m, S, n, h);
          break e;
        }
        C && C(e, p, f), e === "focusout" && (C = p._wrapperState) && C.controlled && p.type === "number" && Vl(p, "number", p.value);
      }
      switch (C = f ? Rt(f) : window, e) {
        case "focusin":
          (ji(C) || C.contentEditable === "true") && (Dt = C, bl = f, kn = null);
          break;
        case "focusout":
          kn = bl = Dt = null;
          break;
        case "mousedown":
          eo = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          eo = !1, Hi(m, n, h);
          break;
        case "selectionchange":
          if (Yc) break;
        case "keydown":
        case "keyup":
          Hi(m, n, h);
      }
      var z;
      if (Vo) e: {
        switch (e) {
          case "compositionstart":
            var _ = "onCompositionStart";
            break e;
          case "compositionend":
            _ = "onCompositionEnd";
            break e;
          case "compositionupdate":
            _ = "onCompositionUpdate";
            break e;
        }
        _ = void 0;
      }
      else Tt ? ua(e, n) && (_ = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (_ = "onCompositionStart");
      _ && (ia && n.locale !== "ko" && (Tt || _ !== "onCompositionStart" ? _ === "onCompositionEnd" && Tt && (z = oa()) : (Je = h, Ao = "value" in Je ? Je.value : Je.textContent, Tt = !0)), C = Pr(f, _), 0 < C.length && (_ = new Mi(_, e, null, n, h), m.push({ event: _, listeners: C }), z ? _.data = z : (z = aa(n), z !== null && (_.data = z)))), (z = Oc ? Ic(e, n) : jc(e, n)) && (f = Pr(f, "onBeforeInput"), 0 < f.length && (h = new Mi("onBeforeInput", "beforeinput", null, n, h), m.push({ event: h, listeners: f }), h.data = z));
    }
    xa(m, t);
  });
}
function On(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Pr(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e, o = l.stateNode;
    l.tag === 5 && o !== null && (l = o, o = Pn(e, n), o != null && r.unshift(On(e, o, l)), o = Pn(e, t), o != null && r.push(On(e, o, l))), e = e.return;
  }
  return r;
}
function Pt(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function $i(e, t, n, r, l) {
  for (var o = t._reactName, i = []; n !== null && n !== r; ) {
    var u = n, a = u.alternate, f = u.stateNode;
    if (a !== null && a === r) break;
    u.tag === 5 && f !== null && (u = f, l ? (a = Pn(n, o), a != null && i.unshift(On(n, a, u))) : l || (a = Pn(n, o), a != null && i.push(On(n, a, u)))), n = n.return;
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
var Jc = /\r\n?/g, qc = /\u0000|\uFFFD/g;
function Ki(e) {
  return (typeof e == "string" ? e : "" + e).replace(Jc, `
`).replace(qc, "");
}
function lr(e, t, n) {
  if (t = Ki(t), Ki(e) !== t && n) throw Error(v(425));
}
function Fr() {
}
var to = null, no = null;
function ro(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var lo = typeof setTimeout == "function" ? setTimeout : void 0, bc = typeof clearTimeout == "function" ? clearTimeout : void 0, Yi = typeof Promise == "function" ? Promise : void 0, ed = typeof queueMicrotask == "function" ? queueMicrotask : typeof Yi < "u" ? function(e) {
  return Yi.resolve(null).then(e).catch(td);
} : lo;
function td(e) {
  setTimeout(function() {
    throw e;
  });
}
function Cl(e, t) {
  var n = t, r = 0;
  do {
    var l = n.nextSibling;
    if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
      if (r === 0) {
        e.removeChild(l), Tn(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = l;
  } while (n);
  Tn(t);
}
function nt(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Xi(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var tn = Math.random().toString(36).slice(2), Me = "__reactFiber$" + tn, In = "__reactProps$" + tn, He = "__reactContainer$" + tn, oo = "__reactEvents$" + tn, nd = "__reactListeners$" + tn, rd = "__reactHandles$" + tn;
function gt(e) {
  var t = e[Me];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[He] || n[Me]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Xi(e); e !== null; ) {
        if (n = e[Me]) return n;
        e = Xi(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function $n(e) {
  return e = e[Me] || e[He], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Rt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(v(33));
}
function Gr(e) {
  return e[In] || null;
}
var io = [], Ot = -1;
function ct(e) {
  return { current: e };
}
function R(e) {
  0 > Ot || (e.current = io[Ot], io[Ot] = null, Ot--);
}
function D(e, t) {
  Ot++, io[Ot] = e.current, e.current = t;
}
var at = {}, ne = ct(at), ae = ct(!1), kt = at;
function Xt(e, t) {
  var n = e.type.contextTypes;
  if (!n) return at;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, o;
  for (o in n) l[o] = t[o];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function se(e) {
  return e = e.childContextTypes, e != null;
}
function Lr() {
  R(ae), R(ne);
}
function Gi(e, t, n) {
  if (ne.current !== at) throw Error(v(168));
  D(ne, t), D(ae, n);
}
function Sa(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(v(108, Vs(e) || "Unknown", l));
  return U({}, n, r);
}
function Tr(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || at, kt = ne.current, D(ne, e), D(ae, ae.current), !0;
}
function Zi(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(v(169));
  n ? (e = Sa(e, t, kt), r.__reactInternalMemoizedMergedChildContext = e, R(ae), R(ne), D(ne, e)) : R(ae), D(ae, n);
}
var je = null, Zr = !1, zl = !1;
function Ea(e) {
  je === null ? je = [e] : je.push(e);
}
function ld(e) {
  Zr = !0, Ea(e);
}
function dt() {
  if (!zl && je !== null) {
    zl = !0;
    var e = 0, t = T;
    try {
      var n = je;
      for (T = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      je = null, Zr = !1;
    } catch (l) {
      throw je !== null && (je = je.slice(e + 1)), Xu(Ro, dt), l;
    } finally {
      T = t, zl = !1;
    }
  }
  return null;
}
var It = [], jt = 0, Dr = null, Mr = 0, ve = [], we = 0, St = null, Ae = 1, Ue = "";
function mt(e, t) {
  It[jt++] = Mr, It[jt++] = Dr, Dr = e, Mr = t;
}
function Ca(e, t, n) {
  ve[we++] = Ae, ve[we++] = Ue, ve[we++] = St, St = e;
  var r = Ae;
  e = Ue;
  var l = 32 - Pe(r) - 1;
  r &= ~(1 << l), n += 1;
  var o = 32 - Pe(t) + l;
  if (30 < o) {
    var i = l - l % 5;
    o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Ae = 1 << 32 - Pe(t) + l | n << l | r, Ue = o + e;
  } else Ae = 1 << o | n << l | r, Ue = e;
}
function Qo(e) {
  e.return !== null && (mt(e, 1), Ca(e, 1, 0));
}
function Wo(e) {
  for (; e === Dr; ) Dr = It[--jt], It[jt] = null, Mr = It[--jt], It[jt] = null;
  for (; e === St; ) St = ve[--we], ve[we] = null, Ue = ve[--we], ve[we] = null, Ae = ve[--we], ve[we] = null;
}
var pe = null, fe = null, I = !1, Ne = null;
function za(e, t) {
  var n = ye(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function Ji(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, pe = e, fe = nt(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, pe = e, fe = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = St !== null ? { id: Ae, overflow: Ue } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ye(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, pe = e, fe = null, !0) : !1;
    default:
      return !1;
  }
}
function uo(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function ao(e) {
  if (I) {
    var t = fe;
    if (t) {
      var n = t;
      if (!Ji(e, t)) {
        if (uo(e)) throw Error(v(418));
        t = nt(n.nextSibling);
        var r = pe;
        t && Ji(e, t) ? za(r, n) : (e.flags = e.flags & -4097 | 2, I = !1, pe = e);
      }
    } else {
      if (uo(e)) throw Error(v(418));
      e.flags = e.flags & -4097 | 2, I = !1, pe = e;
    }
  }
}
function qi(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  pe = e;
}
function or(e) {
  if (e !== pe) return !1;
  if (!I) return qi(e), I = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ro(e.type, e.memoizedProps)), t && (t = fe)) {
    if (uo(e)) throw _a(), Error(v(418));
    for (; t; ) za(e, t), t = nt(t.nextSibling);
  }
  if (qi(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(v(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              fe = nt(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      fe = null;
    }
  } else fe = pe ? nt(e.stateNode.nextSibling) : null;
  return !0;
}
function _a() {
  for (var e = fe; e; ) e = nt(e.nextSibling);
}
function Gt() {
  fe = pe = null, I = !1;
}
function $o(e) {
  Ne === null ? Ne = [e] : Ne.push(e);
}
var od = $e.ReactCurrentBatchConfig;
function cn(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(v(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(v(147, e));
      var l = r, o = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
        var u = l.refs;
        i === null ? delete u[o] : u[o] = i;
      }, t._stringRef = o, t);
    }
    if (typeof e != "string") throw Error(v(284));
    if (!n._owner) throw Error(v(290, e));
  }
  return e;
}
function ir(e, t) {
  throw e = Object.prototype.toString.call(t), Error(v(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function bi(e) {
  var t = e._init;
  return t(e._payload);
}
function Na(e) {
  function t(c, s) {
    if (e) {
      var d = c.deletions;
      d === null ? (c.deletions = [s], c.flags |= 16) : d.push(s);
    }
  }
  function n(c, s) {
    if (!e) return null;
    for (; s !== null; ) t(c, s), s = s.sibling;
    return null;
  }
  function r(c, s) {
    for (c = /* @__PURE__ */ new Map(); s !== null; ) s.key !== null ? c.set(s.key, s) : c.set(s.index, s), s = s.sibling;
    return c;
  }
  function l(c, s) {
    return c = it(c, s), c.index = 0, c.sibling = null, c;
  }
  function o(c, s, d) {
    return c.index = d, e ? (d = c.alternate, d !== null ? (d = d.index, d < s ? (c.flags |= 2, s) : d) : (c.flags |= 2, s)) : (c.flags |= 1048576, s);
  }
  function i(c) {
    return e && c.alternate === null && (c.flags |= 2), c;
  }
  function u(c, s, d, g) {
    return s === null || s.tag !== 6 ? (s = Dl(d, c.mode, g), s.return = c, s) : (s = l(s, d), s.return = c, s);
  }
  function a(c, s, d, g) {
    var S = d.type;
    return S === Lt ? h(c, s, d.props.children, g, d.key) : s !== null && (s.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Ye && bi(S) === s.type) ? (g = l(s, d.props), g.ref = cn(c, s, d), g.return = c, g) : (g = xr(d.type, d.key, d.props, null, c.mode, g), g.ref = cn(c, s, d), g.return = c, g);
  }
  function f(c, s, d, g) {
    return s === null || s.tag !== 4 || s.stateNode.containerInfo !== d.containerInfo || s.stateNode.implementation !== d.implementation ? (s = Ml(d, c.mode, g), s.return = c, s) : (s = l(s, d.children || []), s.return = c, s);
  }
  function h(c, s, d, g, S) {
    return s === null || s.tag !== 7 ? (s = xt(d, c.mode, g, S), s.return = c, s) : (s = l(s, d), s.return = c, s);
  }
  function m(c, s, d) {
    if (typeof s == "string" && s !== "" || typeof s == "number") return s = Dl("" + s, c.mode, d), s.return = c, s;
    if (typeof s == "object" && s !== null) {
      switch (s.$$typeof) {
        case Gn:
          return d = xr(s.type, s.key, s.props, null, c.mode, d), d.ref = cn(c, null, s), d.return = c, d;
        case Ft:
          return s = Ml(s, c.mode, d), s.return = c, s;
        case Ye:
          var g = s._init;
          return m(c, g(s._payload), d);
      }
      if (mn(s) || ln(s)) return s = xt(s, c.mode, d, null), s.return = c, s;
      ir(c, s);
    }
    return null;
  }
  function p(c, s, d, g) {
    var S = s !== null ? s.key : null;
    if (typeof d == "string" && d !== "" || typeof d == "number") return S !== null ? null : u(c, s, "" + d, g);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Gn:
          return d.key === S ? a(c, s, d, g) : null;
        case Ft:
          return d.key === S ? f(c, s, d, g) : null;
        case Ye:
          return S = d._init, p(
            c,
            s,
            S(d._payload),
            g
          );
      }
      if (mn(d) || ln(d)) return S !== null ? null : h(c, s, d, g, null);
      ir(c, d);
    }
    return null;
  }
  function w(c, s, d, g, S) {
    if (typeof g == "string" && g !== "" || typeof g == "number") return c = c.get(d) || null, u(s, c, "" + g, S);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case Gn:
          return c = c.get(g.key === null ? d : g.key) || null, a(s, c, g, S);
        case Ft:
          return c = c.get(g.key === null ? d : g.key) || null, f(s, c, g, S);
        case Ye:
          var C = g._init;
          return w(c, s, d, C(g._payload), S);
      }
      if (mn(g) || ln(g)) return c = c.get(d) || null, h(s, c, g, S, null);
      ir(s, g);
    }
    return null;
  }
  function y(c, s, d, g) {
    for (var S = null, C = null, z = s, _ = s = 0, V = null; z !== null && _ < d.length; _++) {
      z.index > _ ? (V = z, z = null) : V = z.sibling;
      var F = p(c, z, d[_], g);
      if (F === null) {
        z === null && (z = V);
        break;
      }
      e && z && F.alternate === null && t(c, z), s = o(F, s, _), C === null ? S = F : C.sibling = F, C = F, z = V;
    }
    if (_ === d.length) return n(c, z), I && mt(c, _), S;
    if (z === null) {
      for (; _ < d.length; _++) z = m(c, d[_], g), z !== null && (s = o(z, s, _), C === null ? S = z : C.sibling = z, C = z);
      return I && mt(c, _), S;
    }
    for (z = r(c, z); _ < d.length; _++) V = w(z, c, _, d[_], g), V !== null && (e && V.alternate !== null && z.delete(V.key === null ? _ : V.key), s = o(V, s, _), C === null ? S = V : C.sibling = V, C = V);
    return e && z.forEach(function(Ee) {
      return t(c, Ee);
    }), I && mt(c, _), S;
  }
  function x(c, s, d, g) {
    var S = ln(d);
    if (typeof S != "function") throw Error(v(150));
    if (d = S.call(d), d == null) throw Error(v(151));
    for (var C = S = null, z = s, _ = s = 0, V = null, F = d.next(); z !== null && !F.done; _++, F = d.next()) {
      z.index > _ ? (V = z, z = null) : V = z.sibling;
      var Ee = p(c, z, F.value, g);
      if (Ee === null) {
        z === null && (z = V);
        break;
      }
      e && z && Ee.alternate === null && t(c, z), s = o(Ee, s, _), C === null ? S = Ee : C.sibling = Ee, C = Ee, z = V;
    }
    if (F.done) return n(
      c,
      z
    ), I && mt(c, _), S;
    if (z === null) {
      for (; !F.done; _++, F = d.next()) F = m(c, F.value, g), F !== null && (s = o(F, s, _), C === null ? S = F : C.sibling = F, C = F);
      return I && mt(c, _), S;
    }
    for (z = r(c, z); !F.done; _++, F = d.next()) F = w(z, c, _, F.value, g), F !== null && (e && F.alternate !== null && z.delete(F.key === null ? _ : F.key), s = o(F, s, _), C === null ? S = F : C.sibling = F, C = F);
    return e && z.forEach(function(nn) {
      return t(c, nn);
    }), I && mt(c, _), S;
  }
  function O(c, s, d, g) {
    if (typeof d == "object" && d !== null && d.type === Lt && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Gn:
          e: {
            for (var S = d.key, C = s; C !== null; ) {
              if (C.key === S) {
                if (S = d.type, S === Lt) {
                  if (C.tag === 7) {
                    n(c, C.sibling), s = l(C, d.props.children), s.return = c, c = s;
                    break e;
                  }
                } else if (C.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Ye && bi(S) === C.type) {
                  n(c, C.sibling), s = l(C, d.props), s.ref = cn(c, C, d), s.return = c, c = s;
                  break e;
                }
                n(c, C);
                break;
              } else t(c, C);
              C = C.sibling;
            }
            d.type === Lt ? (s = xt(d.props.children, c.mode, g, d.key), s.return = c, c = s) : (g = xr(d.type, d.key, d.props, null, c.mode, g), g.ref = cn(c, s, d), g.return = c, c = g);
          }
          return i(c);
        case Ft:
          e: {
            for (C = d.key; s !== null; ) {
              if (s.key === C) if (s.tag === 4 && s.stateNode.containerInfo === d.containerInfo && s.stateNode.implementation === d.implementation) {
                n(c, s.sibling), s = l(s, d.children || []), s.return = c, c = s;
                break e;
              } else {
                n(c, s);
                break;
              }
              else t(c, s);
              s = s.sibling;
            }
            s = Ml(d, c.mode, g), s.return = c, c = s;
          }
          return i(c);
        case Ye:
          return C = d._init, O(c, s, C(d._payload), g);
      }
      if (mn(d)) return y(c, s, d, g);
      if (ln(d)) return x(c, s, d, g);
      ir(c, d);
    }
    return typeof d == "string" && d !== "" || typeof d == "number" ? (d = "" + d, s !== null && s.tag === 6 ? (n(c, s.sibling), s = l(s, d), s.return = c, c = s) : (n(c, s), s = Dl(d, c.mode, g), s.return = c, c = s), i(c)) : n(c, s);
  }
  return O;
}
var Zt = Na(!0), Pa = Na(!1), Rr = ct(null), Or = null, At = null, Ko = null;
function Yo() {
  Ko = At = Or = null;
}
function Xo(e) {
  var t = Rr.current;
  R(Rr), e._currentValue = t;
}
function so(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function $t(e, t) {
  Or = e, Ko = At = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (ue = !0), e.firstContext = null);
}
function ke(e) {
  var t = e._currentValue;
  if (Ko !== e) if (e = { context: e, memoizedValue: t, next: null }, At === null) {
    if (Or === null) throw Error(v(308));
    At = e, Or.dependencies = { lanes: 0, firstContext: e };
  } else At = At.next = e;
  return t;
}
var vt = null;
function Go(e) {
  vt === null ? vt = [e] : vt.push(e);
}
function Fa(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, Go(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Qe(e, r);
}
function Qe(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Xe = !1;
function Zo(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function La(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Be(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function rt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, L & 2) {
    var l = r.pending;
    return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Qe(e, n);
  }
  return l = r.interleaved, l === null ? (t.next = t, Go(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Qe(e, n);
}
function mr(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Oo(e, n);
  }
}
function eu(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var l = null, o = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var i = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        o === null ? l = o = i : o = o.next = i, n = n.next;
      } while (n !== null);
      o === null ? l = o = t : o = o.next = t;
    } else l = o = t;
    n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function Ir(e, t, n, r) {
  var l = e.updateQueue;
  Xe = !1;
  var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
  if (u !== null) {
    l.shared.pending = null;
    var a = u, f = a.next;
    a.next = null, i === null ? o = f : i.next = f, i = a;
    var h = e.alternate;
    h !== null && (h = h.updateQueue, u = h.lastBaseUpdate, u !== i && (u === null ? h.firstBaseUpdate = f : u.next = f, h.lastBaseUpdate = a));
  }
  if (o !== null) {
    var m = l.baseState;
    i = 0, h = f = a = null, u = o;
    do {
      var p = u.lane, w = u.eventTime;
      if ((r & p) === p) {
        h !== null && (h = h.next = {
          eventTime: w,
          lane: 0,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        });
        e: {
          var y = e, x = u;
          switch (p = t, w = n, x.tag) {
            case 1:
              if (y = x.payload, typeof y == "function") {
                m = y.call(w, m, p);
                break e;
              }
              m = y;
              break e;
            case 3:
              y.flags = y.flags & -65537 | 128;
            case 0:
              if (y = x.payload, p = typeof y == "function" ? y.call(w, m, p) : y, p == null) break e;
              m = U({}, m, p);
              break e;
            case 2:
              Xe = !0;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, p = l.effects, p === null ? l.effects = [u] : p.push(u));
      } else w = { eventTime: w, lane: p, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, h === null ? (f = h = w, a = m) : h = h.next = w, i |= p;
      if (u = u.next, u === null) {
        if (u = l.shared.pending, u === null) break;
        p = u, u = p.next, p.next = null, l.lastBaseUpdate = p, l.shared.pending = null;
      }
    } while (!0);
    if (h === null && (a = m), l.baseState = a, l.firstBaseUpdate = f, l.lastBaseUpdate = h, t = l.shared.interleaved, t !== null) {
      l = t;
      do
        i |= l.lane, l = l.next;
      while (l !== t);
    } else o === null && (l.shared.lanes = 0);
    Ct |= i, e.lanes = i, e.memoizedState = m;
  }
}
function tu(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = n, typeof l != "function") throw Error(v(191, l));
      l.call(r);
    }
  }
}
var Kn = {}, Oe = ct(Kn), jn = ct(Kn), An = ct(Kn);
function wt(e) {
  if (e === Kn) throw Error(v(174));
  return e;
}
function Jo(e, t) {
  switch (D(An, t), D(jn, e), D(Oe, Kn), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ql(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Ql(t, e);
  }
  R(Oe), D(Oe, t);
}
function Jt() {
  R(Oe), R(jn), R(An);
}
function Ta(e) {
  wt(An.current);
  var t = wt(Oe.current), n = Ql(t, e.type);
  t !== n && (D(jn, e), D(Oe, n));
}
function qo(e) {
  jn.current === e && (R(Oe), R(jn));
}
var j = ct(0);
function jr(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
var _l = [];
function bo() {
  for (var e = 0; e < _l.length; e++) _l[e]._workInProgressVersionPrimary = null;
  _l.length = 0;
}
var hr = $e.ReactCurrentDispatcher, Nl = $e.ReactCurrentBatchConfig, Et = 0, A = null, $ = null, X = null, Ar = !1, Sn = !1, Un = 0, id = 0;
function b() {
  throw Error(v(321));
}
function ei(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Le(e[n], t[n])) return !1;
  return !0;
}
function ti(e, t, n, r, l, o) {
  if (Et = o, A = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, hr.current = e === null || e.memoizedState === null ? cd : dd, e = n(r, l), Sn) {
    o = 0;
    do {
      if (Sn = !1, Un = 0, 25 <= o) throw Error(v(301));
      o += 1, X = $ = null, t.updateQueue = null, hr.current = fd, e = n(r, l);
    } while (Sn);
  }
  if (hr.current = Ur, t = $ !== null && $.next !== null, Et = 0, X = $ = A = null, Ar = !1, t) throw Error(v(300));
  return e;
}
function ni() {
  var e = Un !== 0;
  return Un = 0, e;
}
function De() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return X === null ? A.memoizedState = X = e : X = X.next = e, X;
}
function Se() {
  if ($ === null) {
    var e = A.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = $.next;
  var t = X === null ? A.memoizedState : X.next;
  if (t !== null) X = t, $ = e;
  else {
    if (e === null) throw Error(v(310));
    $ = e, e = { memoizedState: $.memoizedState, baseState: $.baseState, baseQueue: $.baseQueue, queue: $.queue, next: null }, X === null ? A.memoizedState = X = e : X = X.next = e;
  }
  return X;
}
function Bn(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Pl(e) {
  var t = Se(), n = t.queue;
  if (n === null) throw Error(v(311));
  n.lastRenderedReducer = e;
  var r = $, l = r.baseQueue, o = n.pending;
  if (o !== null) {
    if (l !== null) {
      var i = l.next;
      l.next = o.next, o.next = i;
    }
    r.baseQueue = l = o, n.pending = null;
  }
  if (l !== null) {
    o = l.next, r = r.baseState;
    var u = i = null, a = null, f = o;
    do {
      var h = f.lane;
      if ((Et & h) === h) a !== null && (a = a.next = { lane: 0, action: f.action, hasEagerState: f.hasEagerState, eagerState: f.eagerState, next: null }), r = f.hasEagerState ? f.eagerState : e(r, f.action);
      else {
        var m = {
          lane: h,
          action: f.action,
          hasEagerState: f.hasEagerState,
          eagerState: f.eagerState,
          next: null
        };
        a === null ? (u = a = m, i = r) : a = a.next = m, A.lanes |= h, Ct |= h;
      }
      f = f.next;
    } while (f !== null && f !== o);
    a === null ? i = r : a.next = u, Le(r, t.memoizedState) || (ue = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = a, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      o = l.lane, A.lanes |= o, Ct |= o, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Fl(e) {
  var t = Se(), n = t.queue;
  if (n === null) throw Error(v(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, l = n.pending, o = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var i = l = l.next;
    do
      o = e(o, i.action), i = i.next;
    while (i !== l);
    Le(o, t.memoizedState) || (ue = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
  }
  return [o, r];
}
function Da() {
}
function Ma(e, t) {
  var n = A, r = Se(), l = t(), o = !Le(r.memoizedState, l);
  if (o && (r.memoizedState = l, ue = !0), r = r.queue, ri(Ia.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || X !== null && X.memoizedState.tag & 1) {
    if (n.flags |= 2048, Vn(9, Oa.bind(null, n, r, l, t), void 0, null), G === null) throw Error(v(349));
    Et & 30 || Ra(n, t, l);
  }
  return l;
}
function Ra(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = A.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, A.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function Oa(e, t, n, r) {
  t.value = n, t.getSnapshot = r, ja(t) && Aa(e);
}
function Ia(e, t, n) {
  return n(function() {
    ja(t) && Aa(e);
  });
}
function ja(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Le(e, n);
  } catch {
    return !0;
  }
}
function Aa(e) {
  var t = Qe(e, 1);
  t !== null && Fe(t, e, 1, -1);
}
function nu(e) {
  var t = De();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Bn, lastRenderedState: e }, t.queue = e, e = e.dispatch = sd.bind(null, A, e), [t.memoizedState, e];
}
function Vn(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = A.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, A.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function Ua() {
  return Se().memoizedState;
}
function gr(e, t, n, r) {
  var l = De();
  A.flags |= e, l.memoizedState = Vn(1 | t, n, void 0, r === void 0 ? null : r);
}
function Jr(e, t, n, r) {
  var l = Se();
  r = r === void 0 ? null : r;
  var o = void 0;
  if ($ !== null) {
    var i = $.memoizedState;
    if (o = i.destroy, r !== null && ei(r, i.deps)) {
      l.memoizedState = Vn(t, n, o, r);
      return;
    }
  }
  A.flags |= e, l.memoizedState = Vn(1 | t, n, o, r);
}
function ru(e, t) {
  return gr(8390656, 8, e, t);
}
function ri(e, t) {
  return Jr(2048, 8, e, t);
}
function Ba(e, t) {
  return Jr(4, 2, e, t);
}
function Va(e, t) {
  return Jr(4, 4, e, t);
}
function Ha(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function Qa(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Jr(4, 4, Ha.bind(null, t, e), n);
}
function li() {
}
function Wa(e, t) {
  var n = Se();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ei(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function $a(e, t) {
  var n = Se();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ei(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Ka(e, t, n) {
  return Et & 21 ? (Le(n, t) || (n = Ju(), A.lanes |= n, Ct |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, ue = !0), e.memoizedState = n);
}
function ud(e, t) {
  var n = T;
  T = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = Nl.transition;
  Nl.transition = {};
  try {
    e(!1), t();
  } finally {
    T = n, Nl.transition = r;
  }
}
function Ya() {
  return Se().memoizedState;
}
function ad(e, t, n) {
  var r = ot(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Xa(e)) Ga(t, n);
  else if (n = Fa(e, t, n, r), n !== null) {
    var l = le();
    Fe(n, e, r, l), Za(n, t, r);
  }
}
function sd(e, t, n) {
  var r = ot(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Xa(e)) Ga(t, l);
  else {
    var o = e.alternate;
    if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
      var i = t.lastRenderedState, u = o(i, n);
      if (l.hasEagerState = !0, l.eagerState = u, Le(u, i)) {
        var a = t.interleaved;
        a === null ? (l.next = l, Go(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = Fa(e, t, l, r), n !== null && (l = le(), Fe(n, e, r, l), Za(n, t, r));
  }
}
function Xa(e) {
  var t = e.alternate;
  return e === A || t !== null && t === A;
}
function Ga(e, t) {
  Sn = Ar = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function Za(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Oo(e, n);
  }
}
var Ur = { readContext: ke, useCallback: b, useContext: b, useEffect: b, useImperativeHandle: b, useInsertionEffect: b, useLayoutEffect: b, useMemo: b, useReducer: b, useRef: b, useState: b, useDebugValue: b, useDeferredValue: b, useTransition: b, useMutableSource: b, useSyncExternalStore: b, useId: b, unstable_isNewReconciler: !1 }, cd = { readContext: ke, useCallback: function(e, t) {
  return De().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: ke, useEffect: ru, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, gr(
    4194308,
    4,
    Ha.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return gr(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return gr(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = De();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = De();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = ad.bind(null, A, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = De();
  return e = { current: e }, t.memoizedState = e;
}, useState: nu, useDebugValue: li, useDeferredValue: function(e) {
  return De().memoizedState = e;
}, useTransition: function() {
  var e = nu(!1), t = e[0];
  return e = ud.bind(null, e[1]), De().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = A, l = De();
  if (I) {
    if (n === void 0) throw Error(v(407));
    n = n();
  } else {
    if (n = t(), G === null) throw Error(v(349));
    Et & 30 || Ra(r, t, n);
  }
  l.memoizedState = n;
  var o = { value: n, getSnapshot: t };
  return l.queue = o, ru(Ia.bind(
    null,
    r,
    o,
    e
  ), [e]), r.flags |= 2048, Vn(9, Oa.bind(null, r, o, n, t), void 0, null), n;
}, useId: function() {
  var e = De(), t = G.identifierPrefix;
  if (I) {
    var n = Ue, r = Ae;
    n = (r & ~(1 << 32 - Pe(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Un++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = id++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, dd = {
  readContext: ke,
  useCallback: Wa,
  useContext: ke,
  useEffect: ri,
  useImperativeHandle: Qa,
  useInsertionEffect: Ba,
  useLayoutEffect: Va,
  useMemo: $a,
  useReducer: Pl,
  useRef: Ua,
  useState: function() {
    return Pl(Bn);
  },
  useDebugValue: li,
  useDeferredValue: function(e) {
    var t = Se();
    return Ka(t, $.memoizedState, e);
  },
  useTransition: function() {
    var e = Pl(Bn)[0], t = Se().memoizedState;
    return [e, t];
  },
  useMutableSource: Da,
  useSyncExternalStore: Ma,
  useId: Ya,
  unstable_isNewReconciler: !1
}, fd = { readContext: ke, useCallback: Wa, useContext: ke, useEffect: ri, useImperativeHandle: Qa, useInsertionEffect: Ba, useLayoutEffect: Va, useMemo: $a, useReducer: Fl, useRef: Ua, useState: function() {
  return Fl(Bn);
}, useDebugValue: li, useDeferredValue: function(e) {
  var t = Se();
  return $ === null ? t.memoizedState = e : Ka(t, $.memoizedState, e);
}, useTransition: function() {
  var e = Fl(Bn)[0], t = Se().memoizedState;
  return [e, t];
}, useMutableSource: Da, useSyncExternalStore: Ma, useId: Ya, unstable_isNewReconciler: !1 };
function ze(e, t) {
  if (e && e.defaultProps) {
    t = U({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function co(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : U({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var qr = { isMounted: function(e) {
  return (e = e._reactInternals) ? Nt(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = le(), l = ot(e), o = Be(r, l);
  o.payload = t, n != null && (o.callback = n), t = rt(e, o, l), t !== null && (Fe(t, e, l, r), mr(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = le(), l = ot(e), o = Be(r, l);
  o.tag = 1, o.payload = t, n != null && (o.callback = n), t = rt(e, o, l), t !== null && (Fe(t, e, l, r), mr(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = le(), r = ot(e), l = Be(n, r);
  l.tag = 2, t != null && (l.callback = t), t = rt(e, l, r), t !== null && (Fe(t, e, r, n), mr(t, e, r));
} };
function lu(e, t, n, r, l, o, i) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !Mn(n, r) || !Mn(l, o) : !0;
}
function Ja(e, t, n) {
  var r = !1, l = at, o = t.contextType;
  return typeof o == "object" && o !== null ? o = ke(o) : (l = se(t) ? kt : ne.current, r = t.contextTypes, o = (r = r != null) ? Xt(e, l) : at), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = qr, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
}
function ou(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && qr.enqueueReplaceState(t, t.state, null);
}
function fo(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, Zo(e);
  var o = t.contextType;
  typeof o == "object" && o !== null ? l.context = ke(o) : (o = se(t) ? kt : ne.current, l.context = Xt(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (co(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && qr.enqueueReplaceState(l, l.state, null), Ir(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function qt(e, t) {
  try {
    var n = "", r = t;
    do
      n += Bs(r), r = r.return;
    while (r);
    var l = n;
  } catch (o) {
    l = `
Error generating stack: ` + o.message + `
` + o.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function Ll(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function po(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var pd = typeof WeakMap == "function" ? WeakMap : Map;
function qa(e, t, n) {
  n = Be(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    Vr || (Vr = !0, Eo = r), po(e, t);
  }, n;
}
function ba(e, t, n) {
  n = Be(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    n.payload = function() {
      return r(l);
    }, n.callback = function() {
      po(e, t);
    };
  }
  var o = e.stateNode;
  return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
    po(e, t), typeof r != "function" && (lt === null ? lt = /* @__PURE__ */ new Set([this]) : lt.add(this));
    var i = t.stack;
    this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
  }), n;
}
function iu(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new pd();
    var l = /* @__PURE__ */ new Set();
    r.set(t, l);
  } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
  l.has(n) || (l.add(n), e = Nd.bind(null, e, t, n), t.then(e, e));
}
function uu(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function au(e, t, n, r, l) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Be(-1, 1), t.tag = 2, rt(n, t, 1))), n.lanes |= 1), e);
}
var md = $e.ReactCurrentOwner, ue = !1;
function re(e, t, n, r) {
  t.child = e === null ? Pa(t, null, n, r) : Zt(t, e.child, n, r);
}
function su(e, t, n, r, l) {
  n = n.render;
  var o = t.ref;
  return $t(t, l), r = ti(e, t, n, r, o, l), n = ni(), e !== null && !ue ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, We(e, t, l)) : (I && n && Qo(t), t.flags |= 1, re(e, t, r, l), t.child);
}
function cu(e, t, n, r, l) {
  if (e === null) {
    var o = n.type;
    return typeof o == "function" && !fi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, es(e, t, o, r, l)) : (e = xr(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (o = e.child, !(e.lanes & l)) {
    var i = o.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Mn, n(i, r) && e.ref === t.ref) return We(e, t, l);
  }
  return t.flags |= 1, e = it(o, r), e.ref = t.ref, e.return = t, t.child = e;
}
function es(e, t, n, r, l) {
  if (e !== null) {
    var o = e.memoizedProps;
    if (Mn(o, r) && e.ref === t.ref) if (ue = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) e.flags & 131072 && (ue = !0);
    else return t.lanes = e.lanes, We(e, t, l);
  }
  return mo(e, t, n, r, l);
}
function ts(e, t, n) {
  var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, D(Bt, de), de |= n;
  else {
    if (!(n & 1073741824)) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, D(Bt, de), de |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, D(Bt, de), de |= r;
  }
  else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, D(Bt, de), de |= r;
  return re(e, t, l, n), t.child;
}
function ns(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function mo(e, t, n, r, l) {
  var o = se(n) ? kt : ne.current;
  return o = Xt(t, o), $t(t, l), n = ti(e, t, n, r, o, l), r = ni(), e !== null && !ue ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, We(e, t, l)) : (I && r && Qo(t), t.flags |= 1, re(e, t, n, l), t.child);
}
function du(e, t, n, r, l) {
  if (se(n)) {
    var o = !0;
    Tr(t);
  } else o = !1;
  if ($t(t, l), t.stateNode === null) vr(e, t), Ja(t, n, r), fo(t, n, r, l), r = !0;
  else if (e === null) {
    var i = t.stateNode, u = t.memoizedProps;
    i.props = u;
    var a = i.context, f = n.contextType;
    typeof f == "object" && f !== null ? f = ke(f) : (f = se(n) ? kt : ne.current, f = Xt(t, f));
    var h = n.getDerivedStateFromProps, m = typeof h == "function" || typeof i.getSnapshotBeforeUpdate == "function";
    m || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || a !== f) && ou(t, i, r, f), Xe = !1;
    var p = t.memoizedState;
    i.state = p, Ir(t, r, i, l), a = t.memoizedState, u !== r || p !== a || ae.current || Xe ? (typeof h == "function" && (co(t, n, h, r), a = t.memoizedState), (u = Xe || lu(t, n, u, r, p, a, f)) ? (m || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), i.props = r, i.state = a, i.context = f, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    i = t.stateNode, La(e, t), u = t.memoizedProps, f = t.type === t.elementType ? u : ze(t.type, u), i.props = f, m = t.pendingProps, p = i.context, a = n.contextType, typeof a == "object" && a !== null ? a = ke(a) : (a = se(n) ? kt : ne.current, a = Xt(t, a));
    var w = n.getDerivedStateFromProps;
    (h = typeof w == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== m || p !== a) && ou(t, i, r, a), Xe = !1, p = t.memoizedState, i.state = p, Ir(t, r, i, l);
    var y = t.memoizedState;
    u !== m || p !== y || ae.current || Xe ? (typeof w == "function" && (co(t, n, w, r), y = t.memoizedState), (f = Xe || lu(t, n, f, r, p, y, a) || !1) ? (h || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, y, a), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, y, a)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = y), i.props = r, i.state = y, i.context = a, r = f) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return ho(e, t, n, r, o, l);
}
function ho(e, t, n, r, l, o) {
  ns(e, t);
  var i = (t.flags & 128) !== 0;
  if (!r && !i) return l && Zi(t, n, !1), We(e, t, o);
  r = t.stateNode, md.current = t;
  var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && i ? (t.child = Zt(t, e.child, null, o), t.child = Zt(t, null, u, o)) : re(e, t, u, o), t.memoizedState = r.state, l && Zi(t, n, !0), t.child;
}
function rs(e) {
  var t = e.stateNode;
  t.pendingContext ? Gi(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Gi(e, t.context, !1), Jo(e, t.containerInfo);
}
function fu(e, t, n, r, l) {
  return Gt(), $o(l), t.flags |= 256, re(e, t, n, r), t.child;
}
var go = { dehydrated: null, treeContext: null, retryLane: 0 };
function vo(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function ls(e, t, n) {
  var r = t.pendingProps, l = j.current, o = !1, i = (t.flags & 128) !== 0, u;
  if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), D(j, l & 1), e === null)
    return ao(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, !(r & 1) && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = tl(i, r, 0, null), e = xt(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = vo(n), t.memoizedState = go, e) : oi(t, i));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return hd(e, t, i, r, u, l, n);
  if (o) {
    o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(i & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = it(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = it(u, o) : (o = xt(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? vo(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = go, r;
  }
  return o = e.child, e = o.sibling, r = it(o, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function oi(e, t) {
  return t = tl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function ur(e, t, n, r) {
  return r !== null && $o(r), Zt(t, e.child, null, n), e = oi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function hd(e, t, n, r, l, o, i) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = Ll(Error(v(422))), ur(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = tl({ mode: "visible", children: r.children }, l, 0, null), o = xt(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, t.mode & 1 && Zt(t, e.child, null, i), t.child.memoizedState = vo(i), t.memoizedState = go, o);
  if (!(t.mode & 1)) return ur(e, t, i, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, o = Error(v(419)), r = Ll(o, r, void 0), ur(e, t, i, r);
  }
  if (u = (i & e.childLanes) !== 0, ue || u) {
    if (r = G, r !== null) {
      switch (i & -i) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      l = l & (r.suspendedLanes | i) ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Qe(e, l), Fe(r, e, l, -1));
    }
    return di(), r = Ll(Error(v(421))), ur(e, t, i, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Pd.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, fe = nt(l.nextSibling), pe = t, I = !0, Ne = null, e !== null && (ve[we++] = Ae, ve[we++] = Ue, ve[we++] = St, Ae = e.id, Ue = e.overflow, St = t), t = oi(t, r.children), t.flags |= 4096, t);
}
function pu(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), so(e.return, t, n);
}
function Tl(e, t, n, r, l) {
  var o = e.memoizedState;
  o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
}
function os(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, o = r.tail;
  if (re(e, t, r.children, n), r = j.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && pu(e, n, t);
      else if (e.tag === 19) pu(e, n, t);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (D(j, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && jr(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Tl(t, !1, l, n, o);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && jr(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Tl(t, !0, n, null, o);
      break;
    case "together":
      Tl(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function vr(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function We(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), Ct |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(v(153));
  if (t.child !== null) {
    for (e = t.child, n = it(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = it(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function gd(e, t, n) {
  switch (t.tag) {
    case 3:
      rs(t), Gt();
      break;
    case 5:
      Ta(t);
      break;
    case 1:
      se(t.type) && Tr(t);
      break;
    case 4:
      Jo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      D(Rr, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (D(j, j.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? ls(e, t, n) : (D(j, j.current & 1), e = We(e, t, n), e !== null ? e.sibling : null);
      D(j, j.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return os(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), D(j, j.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, ts(e, t, n);
  }
  return We(e, t, n);
}
var is, wo, us, as;
is = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
wo = function() {
};
us = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, wt(Oe.current);
    var o = null;
    switch (n) {
      case "input":
        l = Ul(e, l), r = Ul(e, r), o = [];
        break;
      case "select":
        l = U({}, l, { value: void 0 }), r = U({}, r, { value: void 0 }), o = [];
        break;
      case "textarea":
        l = Hl(e, l), r = Hl(e, r), o = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Fr);
    }
    Wl(n, r);
    var i;
    n = null;
    for (f in l) if (!r.hasOwnProperty(f) && l.hasOwnProperty(f) && l[f] != null) if (f === "style") {
      var u = l[f];
      for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
    } else f !== "dangerouslySetInnerHTML" && f !== "children" && f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning" && f !== "autoFocus" && (_n.hasOwnProperty(f) ? o || (o = []) : (o = o || []).push(f, null));
    for (f in r) {
      var a = r[f];
      if (u = l != null ? l[f] : void 0, r.hasOwnProperty(f) && a !== u && (a != null || u != null)) if (f === "style") if (u) {
        for (i in u) !u.hasOwnProperty(i) || a && a.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
        for (i in a) a.hasOwnProperty(i) && u[i] !== a[i] && (n || (n = {}), n[i] = a[i]);
      } else n || (o || (o = []), o.push(
        f,
        n
      )), n = a;
      else f === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (o = o || []).push(f, a)) : f === "children" ? typeof a != "string" && typeof a != "number" || (o = o || []).push(f, "" + a) : f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning" && (_n.hasOwnProperty(f) ? (a != null && f === "onScroll" && M("scroll", e), o || u === a || (o = [])) : (o = o || []).push(f, a));
    }
    n && (o = o || []).push("style", n);
    var f = o;
    (t.updateQueue = f) && (t.flags |= 4);
  }
};
as = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function dn(e, t) {
  if (!I) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function ee(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
  else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function vd(e, t, n) {
  var r = t.pendingProps;
  switch (Wo(t), t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return ee(t), null;
    case 1:
      return se(t.type) && Lr(), ee(t), null;
    case 3:
      return r = t.stateNode, Jt(), R(ae), R(ne), bo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (or(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ne !== null && (_o(Ne), Ne = null))), wo(e, t), ee(t), null;
    case 5:
      qo(t);
      var l = wt(An.current);
      if (n = t.type, e !== null && t.stateNode != null) us(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(v(166));
          return ee(t), null;
        }
        if (e = wt(Oe.current), or(t)) {
          r = t.stateNode, n = t.type;
          var o = t.memoizedProps;
          switch (r[Me] = t, r[In] = o, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              M("cancel", r), M("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              M("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < gn.length; l++) M(gn[l], r);
              break;
            case "source":
              M("error", r);
              break;
            case "img":
            case "image":
            case "link":
              M(
                "error",
                r
              ), M("load", r);
              break;
            case "details":
              M("toggle", r);
              break;
            case "input":
              Si(r, o), M("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!o.multiple }, M("invalid", r);
              break;
            case "textarea":
              Ci(r, o), M("invalid", r);
          }
          Wl(n, o), l = null;
          for (var i in o) if (o.hasOwnProperty(i)) {
            var u = o[i];
            i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && lr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && lr(
              r.textContent,
              u,
              e
            ), l = ["children", "" + u]) : _n.hasOwnProperty(i) && u != null && i === "onScroll" && M("scroll", r);
          }
          switch (n) {
            case "input":
              Zn(r), Ei(r, o, !0);
              break;
            case "textarea":
              Zn(r), zi(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof o.onClick == "function" && (r.onclick = Fr);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Iu(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[Me] = t, e[In] = r, is(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (i = $l(n, r), n) {
              case "dialog":
                M("cancel", e), M("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                M("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < gn.length; l++) M(gn[l], e);
                l = r;
                break;
              case "source":
                M("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                M(
                  "error",
                  e
                ), M("load", e), l = r;
                break;
              case "details":
                M("toggle", e), l = r;
                break;
              case "input":
                Si(e, r), l = Ul(e, r), M("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = U({}, r, { value: void 0 }), M("invalid", e);
                break;
              case "textarea":
                Ci(e, r), l = Hl(e, r), M("invalid", e);
                break;
              default:
                l = r;
            }
            Wl(n, l), u = l;
            for (o in u) if (u.hasOwnProperty(o)) {
              var a = u[o];
              o === "style" ? Uu(e, a) : o === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && ju(e, a)) : o === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && Nn(e, a) : typeof a == "number" && Nn(e, "" + a) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (_n.hasOwnProperty(o) ? a != null && o === "onScroll" && M("scroll", e) : a != null && Fo(e, o, a, i));
            }
            switch (n) {
              case "input":
                Zn(e), Ei(e, r, !1);
                break;
              case "textarea":
                Zn(e), zi(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + ut(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, o = r.value, o != null ? Vt(e, !!r.multiple, o, !1) : r.defaultValue != null && Vt(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = Fr);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return ee(t), null;
    case 6:
      if (e && t.stateNode != null) as(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(v(166));
        if (n = wt(An.current), wt(Oe.current), or(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Me] = t, (o = r.nodeValue !== n) && (e = pe, e !== null)) switch (e.tag) {
            case 3:
              lr(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && lr(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          o && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Me] = t, t.stateNode = r;
      }
      return ee(t), null;
    case 13:
      if (R(j), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (I && fe !== null && t.mode & 1 && !(t.flags & 128)) _a(), Gt(), t.flags |= 98560, o = !1;
        else if (o = or(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!o) throw Error(v(318));
            if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(v(317));
            o[Me] = t;
          } else Gt(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          ee(t), o = !1;
        } else Ne !== null && (_o(Ne), Ne = null), o = !0;
        if (!o) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || j.current & 1 ? K === 0 && (K = 3) : di())), t.updateQueue !== null && (t.flags |= 4), ee(t), null);
    case 4:
      return Jt(), wo(e, t), e === null && Rn(t.stateNode.containerInfo), ee(t), null;
    case 10:
      return Xo(t.type._context), ee(t), null;
    case 17:
      return se(t.type) && Lr(), ee(t), null;
    case 19:
      if (R(j), o = t.memoizedState, o === null) return ee(t), null;
      if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) dn(o, !1);
      else {
        if (K !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (i = jr(e), i !== null) {
            for (t.flags |= 128, dn(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return D(j, j.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        o.tail !== null && Q() > bt && (t.flags |= 128, r = !0, dn(o, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = jr(i), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), dn(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !I) return ee(t), null;
        } else 2 * Q() - o.renderingStartTime > bt && n !== 1073741824 && (t.flags |= 128, r = !0, dn(o, !1), t.lanes = 4194304);
        o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
      }
      return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Q(), t.sibling = null, n = j.current, D(j, r ? n & 1 | 2 : n & 1), t) : (ee(t), null);
    case 22:
    case 23:
      return ci(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? de & 1073741824 && (ee(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ee(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(v(156, t.tag));
}
function wd(e, t) {
  switch (Wo(t), t.tag) {
    case 1:
      return se(t.type) && Lr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return Jt(), R(ae), R(ne), bo(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return qo(t), null;
    case 13:
      if (R(j), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(v(340));
        Gt();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return R(j), null;
    case 4:
      return Jt(), null;
    case 10:
      return Xo(t.type._context), null;
    case 22:
    case 23:
      return ci(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var ar = !1, te = !1, yd = typeof WeakSet == "function" ? WeakSet : Set, k = null;
function Ut(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    B(e, t, r);
  }
  else n.current = null;
}
function yo(e, t, n) {
  try {
    n();
  } catch (r) {
    B(e, t, r);
  }
}
var mu = !1;
function xd(e, t) {
  if (to = _r, e = pa(), Ho(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var l = r.anchorOffset, o = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, o.nodeType;
        } catch {
          n = null;
          break e;
        }
        var i = 0, u = -1, a = -1, f = 0, h = 0, m = e, p = null;
        t: for (; ; ) {
          for (var w; m !== n || l !== 0 && m.nodeType !== 3 || (u = i + l), m !== o || r !== 0 && m.nodeType !== 3 || (a = i + r), m.nodeType === 3 && (i += m.nodeValue.length), (w = m.firstChild) !== null; )
            p = m, m = w;
          for (; ; ) {
            if (m === e) break t;
            if (p === n && ++f === l && (u = i), p === o && ++h === r && (a = i), (w = m.nextSibling) !== null) break;
            m = p, p = m.parentNode;
          }
          m = w;
        }
        n = u === -1 || a === -1 ? null : { start: u, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (no = { focusedElem: e, selectionRange: n }, _r = !1, k = t; k !== null; ) if (t = k, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, k = e;
  else for (; k !== null; ) {
    t = k;
    try {
      var y = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (y !== null) {
            var x = y.memoizedProps, O = y.memoizedState, c = t.stateNode, s = c.getSnapshotBeforeUpdate(t.elementType === t.type ? x : ze(t.type, x), O);
            c.__reactInternalSnapshotBeforeUpdate = s;
          }
          break;
        case 3:
          var d = t.stateNode.containerInfo;
          d.nodeType === 1 ? d.textContent = "" : d.nodeType === 9 && d.documentElement && d.removeChild(d.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(v(163));
      }
    } catch (g) {
      B(t, t.return, g);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, k = e;
      break;
    }
    k = t.return;
  }
  return y = mu, mu = !1, y;
}
function En(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var o = l.destroy;
        l.destroy = void 0, o !== void 0 && yo(t, n, o);
      }
      l = l.next;
    } while (l !== r);
  }
}
function br(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function xo(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function ss(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, ss(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Me], delete t[In], delete t[oo], delete t[nd], delete t[rd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function cs(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function hu(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || cs(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function ko(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Fr));
  else if (r !== 4 && (e = e.child, e !== null)) for (ko(e, t, n), e = e.sibling; e !== null; ) ko(e, t, n), e = e.sibling;
}
function So(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (So(e, t, n), e = e.sibling; e !== null; ) So(e, t, n), e = e.sibling;
}
var Z = null, _e = !1;
function Ke(e, t, n) {
  for (n = n.child; n !== null; ) ds(e, t, n), n = n.sibling;
}
function ds(e, t, n) {
  if (Re && typeof Re.onCommitFiberUnmount == "function") try {
    Re.onCommitFiberUnmount($r, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      te || Ut(n, t);
    case 6:
      var r = Z, l = _e;
      Z = null, Ke(e, t, n), Z = r, _e = l, Z !== null && (_e ? (e = Z, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Z.removeChild(n.stateNode));
      break;
    case 18:
      Z !== null && (_e ? (e = Z, n = n.stateNode, e.nodeType === 8 ? Cl(e.parentNode, n) : e.nodeType === 1 && Cl(e, n), Tn(e)) : Cl(Z, n.stateNode));
      break;
    case 4:
      r = Z, l = _e, Z = n.stateNode.containerInfo, _e = !0, Ke(e, t, n), Z = r, _e = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!te && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var o = l, i = o.destroy;
          o = o.tag, i !== void 0 && (o & 2 || o & 4) && yo(n, t, i), l = l.next;
        } while (l !== r);
      }
      Ke(e, t, n);
      break;
    case 1:
      if (!te && (Ut(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        B(n, t, u);
      }
      Ke(e, t, n);
      break;
    case 21:
      Ke(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (te = (r = te) || n.memoizedState !== null, Ke(e, t, n), te = r) : Ke(e, t, n);
      break;
    default:
      Ke(e, t, n);
  }
}
function gu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new yd()), t.forEach(function(r) {
      var l = Fd.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(l, l));
    });
  }
}
function Ce(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var l = n[r];
    try {
      var o = e, i = t, u = i;
      e: for (; u !== null; ) {
        switch (u.tag) {
          case 5:
            Z = u.stateNode, _e = !1;
            break e;
          case 3:
            Z = u.stateNode.containerInfo, _e = !0;
            break e;
          case 4:
            Z = u.stateNode.containerInfo, _e = !0;
            break e;
        }
        u = u.return;
      }
      if (Z === null) throw Error(v(160));
      ds(o, i, l), Z = null, _e = !1;
      var a = l.alternate;
      a !== null && (a.return = null), l.return = null;
    } catch (f) {
      B(l, t, f);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) fs(t, e), t = t.sibling;
}
function fs(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Ce(t, e), Te(e), r & 4) {
        try {
          En(3, e, e.return), br(3, e);
        } catch (x) {
          B(e, e.return, x);
        }
        try {
          En(5, e, e.return);
        } catch (x) {
          B(e, e.return, x);
        }
      }
      break;
    case 1:
      Ce(t, e), Te(e), r & 512 && n !== null && Ut(n, n.return);
      break;
    case 5:
      if (Ce(t, e), Te(e), r & 512 && n !== null && Ut(n, n.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          Nn(l, "");
        } catch (x) {
          B(e, e.return, x);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, a = e.updateQueue;
        if (e.updateQueue = null, a !== null) try {
          u === "input" && o.type === "radio" && o.name != null && Ru(l, o), $l(u, i);
          var f = $l(u, o);
          for (i = 0; i < a.length; i += 2) {
            var h = a[i], m = a[i + 1];
            h === "style" ? Uu(l, m) : h === "dangerouslySetInnerHTML" ? ju(l, m) : h === "children" ? Nn(l, m) : Fo(l, h, m, f);
          }
          switch (u) {
            case "input":
              Bl(l, o);
              break;
            case "textarea":
              Ou(l, o);
              break;
            case "select":
              var p = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!o.multiple;
              var w = o.value;
              w != null ? Vt(l, !!o.multiple, w, !1) : p !== !!o.multiple && (o.defaultValue != null ? Vt(
                l,
                !!o.multiple,
                o.defaultValue,
                !0
              ) : Vt(l, !!o.multiple, o.multiple ? [] : "", !1));
          }
          l[In] = o;
        } catch (x) {
          B(e, e.return, x);
        }
      }
      break;
    case 6:
      if (Ce(t, e), Te(e), r & 4) {
        if (e.stateNode === null) throw Error(v(162));
        l = e.stateNode, o = e.memoizedProps;
        try {
          l.nodeValue = o;
        } catch (x) {
          B(e, e.return, x);
        }
      }
      break;
    case 3:
      if (Ce(t, e), Te(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Tn(t.containerInfo);
      } catch (x) {
        B(e, e.return, x);
      }
      break;
    case 4:
      Ce(t, e), Te(e);
      break;
    case 13:
      Ce(t, e), Te(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (ai = Q())), r & 4 && gu(e);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (te = (f = te) || h, Ce(t, e), te = f) : Ce(t, e), Te(e), r & 8192) {
        if (f = e.memoizedState !== null, (e.stateNode.isHidden = f) && !h && e.mode & 1) for (k = e, h = e.child; h !== null; ) {
          for (m = k = h; k !== null; ) {
            switch (p = k, w = p.child, p.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                En(4, p, p.return);
                break;
              case 1:
                Ut(p, p.return);
                var y = p.stateNode;
                if (typeof y.componentWillUnmount == "function") {
                  r = p, n = p.return;
                  try {
                    t = r, y.props = t.memoizedProps, y.state = t.memoizedState, y.componentWillUnmount();
                  } catch (x) {
                    B(r, n, x);
                  }
                }
                break;
              case 5:
                Ut(p, p.return);
                break;
              case 22:
                if (p.memoizedState !== null) {
                  wu(m);
                  continue;
                }
            }
            w !== null ? (w.return = p, k = w) : wu(m);
          }
          h = h.sibling;
        }
        e: for (h = null, m = e; ; ) {
          if (m.tag === 5) {
            if (h === null) {
              h = m;
              try {
                l = m.stateNode, f ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = m.stateNode, a = m.memoizedProps.style, i = a != null && a.hasOwnProperty("display") ? a.display : null, u.style.display = Au("display", i));
              } catch (x) {
                B(e, e.return, x);
              }
            }
          } else if (m.tag === 6) {
            if (h === null) try {
              m.stateNode.nodeValue = f ? "" : m.memoizedProps;
            } catch (x) {
              B(e, e.return, x);
            }
          } else if ((m.tag !== 22 && m.tag !== 23 || m.memoizedState === null || m === e) && m.child !== null) {
            m.child.return = m, m = m.child;
            continue;
          }
          if (m === e) break e;
          for (; m.sibling === null; ) {
            if (m.return === null || m.return === e) break e;
            h === m && (h = null), m = m.return;
          }
          h === m && (h = null), m.sibling.return = m.return, m = m.sibling;
        }
      }
      break;
    case 19:
      Ce(t, e), Te(e), r & 4 && gu(e);
      break;
    case 21:
      break;
    default:
      Ce(
        t,
        e
      ), Te(e);
  }
}
function Te(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (cs(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(v(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Nn(l, ""), r.flags &= -33);
          var o = hu(e);
          So(e, o, l);
          break;
        case 3:
        case 4:
          var i = r.stateNode.containerInfo, u = hu(e);
          ko(e, u, i);
          break;
        default:
          throw Error(v(161));
      }
    } catch (a) {
      B(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function kd(e, t, n) {
  k = e, ps(e);
}
function ps(e, t, n) {
  for (var r = (e.mode & 1) !== 0; k !== null; ) {
    var l = k, o = l.child;
    if (l.tag === 22 && r) {
      var i = l.memoizedState !== null || ar;
      if (!i) {
        var u = l.alternate, a = u !== null && u.memoizedState !== null || te;
        u = ar;
        var f = te;
        if (ar = i, (te = a) && !f) for (k = l; k !== null; ) i = k, a = i.child, i.tag === 22 && i.memoizedState !== null ? yu(l) : a !== null ? (a.return = i, k = a) : yu(l);
        for (; o !== null; ) k = o, ps(o), o = o.sibling;
        k = l, ar = u, te = f;
      }
      vu(e);
    } else l.subtreeFlags & 8772 && o !== null ? (o.return = l, k = o) : vu(e);
  }
}
function vu(e) {
  for (; k !== null; ) {
    var t = k;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            te || br(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !te) if (n === null) r.componentDidMount();
            else {
              var l = t.elementType === t.type ? n.memoizedProps : ze(t.type, n.memoizedProps);
              r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var o = t.updateQueue;
            o !== null && tu(t, o, r);
            break;
          case 3:
            var i = t.updateQueue;
            if (i !== null) {
              if (n = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  n = t.child.stateNode;
                  break;
                case 1:
                  n = t.child.stateNode;
              }
              tu(t, i, n);
            }
            break;
          case 5:
            var u = t.stateNode;
            if (n === null && t.flags & 4) {
              n = u;
              var a = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && n.focus();
                  break;
                case "img":
                  a.src && (n.src = a.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (t.memoizedState === null) {
              var f = t.alternate;
              if (f !== null) {
                var h = f.memoizedState;
                if (h !== null) {
                  var m = h.dehydrated;
                  m !== null && Tn(m);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(v(163));
        }
        te || t.flags & 512 && xo(t);
      } catch (p) {
        B(t, t.return, p);
      }
    }
    if (t === e) {
      k = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, k = n;
      break;
    }
    k = t.return;
  }
}
function wu(e) {
  for (; k !== null; ) {
    var t = k;
    if (t === e) {
      k = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, k = n;
      break;
    }
    k = t.return;
  }
}
function yu(e) {
  for (; k !== null; ) {
    var t = k;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            br(4, t);
          } catch (a) {
            B(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              B(t, l, a);
            }
          }
          var o = t.return;
          try {
            xo(t);
          } catch (a) {
            B(t, o, a);
          }
          break;
        case 5:
          var i = t.return;
          try {
            xo(t);
          } catch (a) {
            B(t, i, a);
          }
      }
    } catch (a) {
      B(t, t.return, a);
    }
    if (t === e) {
      k = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, k = u;
      break;
    }
    k = t.return;
  }
}
var Sd = Math.ceil, Br = $e.ReactCurrentDispatcher, ii = $e.ReactCurrentOwner, xe = $e.ReactCurrentBatchConfig, L = 0, G = null, W = null, J = 0, de = 0, Bt = ct(0), K = 0, Hn = null, Ct = 0, el = 0, ui = 0, Cn = null, ie = null, ai = 0, bt = 1 / 0, Ie = null, Vr = !1, Eo = null, lt = null, sr = !1, qe = null, Hr = 0, zn = 0, Co = null, wr = -1, yr = 0;
function le() {
  return L & 6 ? Q() : wr !== -1 ? wr : wr = Q();
}
function ot(e) {
  return e.mode & 1 ? L & 2 && J !== 0 ? J & -J : od.transition !== null ? (yr === 0 && (yr = Ju()), yr) : (e = T, e !== 0 || (e = window.event, e = e === void 0 ? 16 : la(e.type)), e) : 1;
}
function Fe(e, t, n, r) {
  if (50 < zn) throw zn = 0, Co = null, Error(v(185));
  Qn(e, n, r), (!(L & 2) || e !== G) && (e === G && (!(L & 2) && (el |= n), K === 4 && Ze(e, J)), ce(e, r), n === 1 && L === 0 && !(t.mode & 1) && (bt = Q() + 500, Zr && dt()));
}
function ce(e, t) {
  var n = e.callbackNode;
  oc(e, t);
  var r = zr(e, e === G ? J : 0);
  if (r === 0) n !== null && Pi(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && Pi(n), t === 1) e.tag === 0 ? ld(xu.bind(null, e)) : Ea(xu.bind(null, e)), ed(function() {
      !(L & 6) && dt();
    }), n = null;
    else {
      switch (qu(r)) {
        case 1:
          n = Ro;
          break;
        case 4:
          n = Gu;
          break;
        case 16:
          n = Cr;
          break;
        case 536870912:
          n = Zu;
          break;
        default:
          n = Cr;
      }
      n = ks(n, ms.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function ms(e, t) {
  if (wr = -1, yr = 0, L & 6) throw Error(v(327));
  var n = e.callbackNode;
  if (Kt() && e.callbackNode !== n) return null;
  var r = zr(e, e === G ? J : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Qr(e, r);
  else {
    t = r;
    var l = L;
    L |= 2;
    var o = gs();
    (G !== e || J !== t) && (Ie = null, bt = Q() + 500, yt(e, t));
    do
      try {
        zd();
        break;
      } catch (u) {
        hs(e, u);
      }
    while (!0);
    Yo(), Br.current = o, L = l, W !== null ? t = 0 : (G = null, J = 0, t = K);
  }
  if (t !== 0) {
    if (t === 2 && (l = Zl(e), l !== 0 && (r = l, t = zo(e, l))), t === 1) throw n = Hn, yt(e, 0), Ze(e, r), ce(e, Q()), n;
    if (t === 6) Ze(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !Ed(l) && (t = Qr(e, r), t === 2 && (o = Zl(e), o !== 0 && (r = o, t = zo(e, o))), t === 1)) throw n = Hn, yt(e, 0), Ze(e, r), ce(e, Q()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(v(345));
        case 2:
          ht(e, ie, Ie);
          break;
        case 3:
          if (Ze(e, r), (r & 130023424) === r && (t = ai + 500 - Q(), 10 < t)) {
            if (zr(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              le(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = lo(ht.bind(null, e, ie, Ie), t);
            break;
          }
          ht(e, ie, Ie);
          break;
        case 4:
          if (Ze(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var i = 31 - Pe(r);
            o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
          }
          if (r = l, r = Q() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Sd(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = lo(ht.bind(null, e, ie, Ie), r);
            break;
          }
          ht(e, ie, Ie);
          break;
        case 5:
          ht(e, ie, Ie);
          break;
        default:
          throw Error(v(329));
      }
    }
  }
  return ce(e, Q()), e.callbackNode === n ? ms.bind(null, e) : null;
}
function zo(e, t) {
  var n = Cn;
  return e.current.memoizedState.isDehydrated && (yt(e, t).flags |= 256), e = Qr(e, t), e !== 2 && (t = ie, ie = n, t !== null && _o(t)), e;
}
function _o(e) {
  ie === null ? ie = e : ie.push.apply(ie, e);
}
function Ed(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var l = n[r], o = l.getSnapshot;
        l = l.value;
        try {
          if (!Le(o(), l)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return !0;
}
function Ze(e, t) {
  for (t &= ~ui, t &= ~el, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Pe(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function xu(e) {
  if (L & 6) throw Error(v(327));
  Kt();
  var t = zr(e, 0);
  if (!(t & 1)) return ce(e, Q()), null;
  var n = Qr(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Zl(e);
    r !== 0 && (t = r, n = zo(e, r));
  }
  if (n === 1) throw n = Hn, yt(e, 0), Ze(e, t), ce(e, Q()), n;
  if (n === 6) throw Error(v(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, ht(e, ie, Ie), ce(e, Q()), null;
}
function si(e, t) {
  var n = L;
  L |= 1;
  try {
    return e(t);
  } finally {
    L = n, L === 0 && (bt = Q() + 500, Zr && dt());
  }
}
function zt(e) {
  qe !== null && qe.tag === 0 && !(L & 6) && Kt();
  var t = L;
  L |= 1;
  var n = xe.transition, r = T;
  try {
    if (xe.transition = null, T = 1, e) return e();
  } finally {
    T = r, xe.transition = n, L = t, !(L & 6) && dt();
  }
}
function ci() {
  de = Bt.current, R(Bt);
}
function yt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, bc(n)), W !== null) for (n = W.return; n !== null; ) {
    var r = n;
    switch (Wo(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Lr();
        break;
      case 3:
        Jt(), R(ae), R(ne), bo();
        break;
      case 5:
        qo(r);
        break;
      case 4:
        Jt();
        break;
      case 13:
        R(j);
        break;
      case 19:
        R(j);
        break;
      case 10:
        Xo(r.type._context);
        break;
      case 22:
      case 23:
        ci();
    }
    n = n.return;
  }
  if (G = e, W = e = it(e.current, null), J = de = t, K = 0, Hn = null, ui = el = Ct = 0, ie = Cn = null, vt !== null) {
    for (t = 0; t < vt.length; t++) if (n = vt[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var l = r.next, o = n.pending;
      if (o !== null) {
        var i = o.next;
        o.next = l, r.next = i;
      }
      n.pending = r;
    }
    vt = null;
  }
  return e;
}
function hs(e, t) {
  do {
    var n = W;
    try {
      if (Yo(), hr.current = Ur, Ar) {
        for (var r = A.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        Ar = !1;
      }
      if (Et = 0, X = $ = A = null, Sn = !1, Un = 0, ii.current = null, n === null || n.return === null) {
        K = 1, Hn = t, W = null;
        break;
      }
      e: {
        var o = e, i = n.return, u = n, a = t;
        if (t = J, u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var f = a, h = u, m = h.tag;
          if (!(h.mode & 1) && (m === 0 || m === 11 || m === 15)) {
            var p = h.alternate;
            p ? (h.updateQueue = p.updateQueue, h.memoizedState = p.memoizedState, h.lanes = p.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var w = uu(i);
          if (w !== null) {
            w.flags &= -257, au(w, i, u, o, t), w.mode & 1 && iu(o, f, t), t = w, a = f;
            var y = t.updateQueue;
            if (y === null) {
              var x = /* @__PURE__ */ new Set();
              x.add(a), t.updateQueue = x;
            } else y.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              iu(o, f, t), di();
              break e;
            }
            a = Error(v(426));
          }
        } else if (I && u.mode & 1) {
          var O = uu(i);
          if (O !== null) {
            !(O.flags & 65536) && (O.flags |= 256), au(O, i, u, o, t), $o(qt(a, u));
            break e;
          }
        }
        o = a = qt(a, u), K !== 4 && (K = 2), Cn === null ? Cn = [o] : Cn.push(o), o = i;
        do {
          switch (o.tag) {
            case 3:
              o.flags |= 65536, t &= -t, o.lanes |= t;
              var c = qa(o, a, t);
              eu(o, c);
              break e;
            case 1:
              u = a;
              var s = o.type, d = o.stateNode;
              if (!(o.flags & 128) && (typeof s.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (lt === null || !lt.has(d)))) {
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var g = ba(o, u, t);
                eu(o, g);
                break e;
              }
          }
          o = o.return;
        } while (o !== null);
      }
      ws(n);
    } catch (S) {
      t = S, W === n && n !== null && (W = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function gs() {
  var e = Br.current;
  return Br.current = Ur, e === null ? Ur : e;
}
function di() {
  (K === 0 || K === 3 || K === 2) && (K = 4), G === null || !(Ct & 268435455) && !(el & 268435455) || Ze(G, J);
}
function Qr(e, t) {
  var n = L;
  L |= 2;
  var r = gs();
  (G !== e || J !== t) && (Ie = null, yt(e, t));
  do
    try {
      Cd();
      break;
    } catch (l) {
      hs(e, l);
    }
  while (!0);
  if (Yo(), L = n, Br.current = r, W !== null) throw Error(v(261));
  return G = null, J = 0, K;
}
function Cd() {
  for (; W !== null; ) vs(W);
}
function zd() {
  for (; W !== null && !Zs(); ) vs(W);
}
function vs(e) {
  var t = xs(e.alternate, e, de);
  e.memoizedProps = e.pendingProps, t === null ? ws(e) : W = t, ii.current = null;
}
function ws(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = wd(n, t), n !== null) {
        n.flags &= 32767, W = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        K = 6, W = null;
        return;
      }
    } else if (n = vd(n, t, de), n !== null) {
      W = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      W = t;
      return;
    }
    W = t = e;
  } while (t !== null);
  K === 0 && (K = 5);
}
function ht(e, t, n) {
  var r = T, l = xe.transition;
  try {
    xe.transition = null, T = 1, _d(e, t, n, r);
  } finally {
    xe.transition = l, T = r;
  }
  return null;
}
function _d(e, t, n, r) {
  do
    Kt();
  while (qe !== null);
  if (L & 6) throw Error(v(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(v(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var o = n.lanes | n.childLanes;
  if (ic(e, o), e === G && (W = G = null, J = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || sr || (sr = !0, ks(Cr, function() {
    return Kt(), null;
  })), o = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || o) {
    o = xe.transition, xe.transition = null;
    var i = T;
    T = 1;
    var u = L;
    L |= 4, ii.current = null, xd(e, n), fs(n, e), Kc(no), _r = !!to, no = to = null, e.current = n, kd(n), Js(), L = u, T = i, xe.transition = o;
  } else e.current = n;
  if (sr && (sr = !1, qe = e, Hr = l), o = e.pendingLanes, o === 0 && (lt = null), ec(n.stateNode), ce(e, Q()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if (Vr) throw Vr = !1, e = Eo, Eo = null, e;
  return Hr & 1 && e.tag !== 0 && Kt(), o = e.pendingLanes, o & 1 ? e === Co ? zn++ : (zn = 0, Co = e) : zn = 0, dt(), null;
}
function Kt() {
  if (qe !== null) {
    var e = qu(Hr), t = xe.transition, n = T;
    try {
      if (xe.transition = null, T = 16 > e ? 16 : e, qe === null) var r = !1;
      else {
        if (e = qe, qe = null, Hr = 0, L & 6) throw Error(v(331));
        var l = L;
        for (L |= 4, k = e.current; k !== null; ) {
          var o = k, i = o.child;
          if (k.flags & 16) {
            var u = o.deletions;
            if (u !== null) {
              for (var a = 0; a < u.length; a++) {
                var f = u[a];
                for (k = f; k !== null; ) {
                  var h = k;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      En(8, h, o);
                  }
                  var m = h.child;
                  if (m !== null) m.return = h, k = m;
                  else for (; k !== null; ) {
                    h = k;
                    var p = h.sibling, w = h.return;
                    if (ss(h), h === f) {
                      k = null;
                      break;
                    }
                    if (p !== null) {
                      p.return = w, k = p;
                      break;
                    }
                    k = w;
                  }
                }
              }
              var y = o.alternate;
              if (y !== null) {
                var x = y.child;
                if (x !== null) {
                  y.child = null;
                  do {
                    var O = x.sibling;
                    x.sibling = null, x = O;
                  } while (x !== null);
                }
              }
              k = o;
            }
          }
          if (o.subtreeFlags & 2064 && i !== null) i.return = o, k = i;
          else e: for (; k !== null; ) {
            if (o = k, o.flags & 2048) switch (o.tag) {
              case 0:
              case 11:
              case 15:
                En(9, o, o.return);
            }
            var c = o.sibling;
            if (c !== null) {
              c.return = o.return, k = c;
              break e;
            }
            k = o.return;
          }
        }
        var s = e.current;
        for (k = s; k !== null; ) {
          i = k;
          var d = i.child;
          if (i.subtreeFlags & 2064 && d !== null) d.return = i, k = d;
          else e: for (i = s; k !== null; ) {
            if (u = k, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  br(9, u);
              }
            } catch (S) {
              B(u, u.return, S);
            }
            if (u === i) {
              k = null;
              break e;
            }
            var g = u.sibling;
            if (g !== null) {
              g.return = u.return, k = g;
              break e;
            }
            k = u.return;
          }
        }
        if (L = l, dt(), Re && typeof Re.onPostCommitFiberRoot == "function") try {
          Re.onPostCommitFiberRoot($r, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      T = n, xe.transition = t;
    }
  }
  return !1;
}
function ku(e, t, n) {
  t = qt(n, t), t = qa(e, t, 1), e = rt(e, t, 1), t = le(), e !== null && (Qn(e, 1, t), ce(e, t));
}
function B(e, t, n) {
  if (e.tag === 3) ku(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      ku(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (lt === null || !lt.has(r))) {
        e = qt(n, e), e = ba(t, e, 1), t = rt(t, e, 1), e = le(), t !== null && (Qn(t, 1, e), ce(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Nd(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = le(), e.pingedLanes |= e.suspendedLanes & n, G === e && (J & n) === n && (K === 4 || K === 3 && (J & 130023424) === J && 500 > Q() - ai ? yt(e, 0) : ui |= n), ce(e, t);
}
function ys(e, t) {
  t === 0 && (e.mode & 1 ? (t = bn, bn <<= 1, !(bn & 130023424) && (bn = 4194304)) : t = 1);
  var n = le();
  e = Qe(e, t), e !== null && (Qn(e, t, n), ce(e, n));
}
function Pd(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), ys(e, n);
}
function Fd(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode, l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(v(314));
  }
  r !== null && r.delete(t), ys(e, n);
}
var xs;
xs = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || ae.current) ue = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return ue = !1, gd(e, t, n);
    ue = !!(e.flags & 131072);
  }
  else ue = !1, I && t.flags & 1048576 && Ca(t, Mr, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      vr(e, t), e = t.pendingProps;
      var l = Xt(t, ne.current);
      $t(t, n), l = ti(null, t, r, e, l, n);
      var o = ni();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, se(r) ? (o = !0, Tr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Zo(t), l.updater = qr, t.stateNode = l, l._reactInternals = t, fo(t, r, e, n), t = ho(null, t, r, !0, o, n)) : (t.tag = 0, I && o && Qo(t), re(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (vr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Td(r), e = ze(r, e), l) {
          case 0:
            t = mo(null, t, r, e, n);
            break e;
          case 1:
            t = du(null, t, r, e, n);
            break e;
          case 11:
            t = su(null, t, r, e, n);
            break e;
          case 14:
            t = cu(null, t, r, ze(r.type, e), n);
            break e;
        }
        throw Error(v(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ze(r, l), mo(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ze(r, l), du(e, t, r, l, n);
    case 3:
      e: {
        if (rs(t), e === null) throw Error(v(387));
        r = t.pendingProps, o = t.memoizedState, l = o.element, La(e, t), Ir(t, r, null, n);
        var i = t.memoizedState;
        if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
          l = qt(Error(v(423)), t), t = fu(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = qt(Error(v(424)), t), t = fu(e, t, r, n, l);
          break e;
        } else for (fe = nt(t.stateNode.containerInfo.firstChild), pe = t, I = !0, Ne = null, n = Pa(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Gt(), r === l) {
            t = We(e, t, n);
            break e;
          }
          re(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return Ta(t), e === null && ao(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, ro(r, l) ? i = null : o !== null && ro(r, o) && (t.flags |= 32), ns(e, t), re(e, t, i, n), t.child;
    case 6:
      return e === null && ao(t), null;
    case 13:
      return ls(e, t, n);
    case 4:
      return Jo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Zt(t, null, r, n) : re(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ze(r, l), su(e, t, r, l, n);
    case 7:
      return re(e, t, t.pendingProps, n), t.child;
    case 8:
      return re(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return re(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, D(Rr, r._currentValue), r._currentValue = i, o !== null) if (Le(o.value, i)) {
          if (o.children === l.children && !ae.current) {
            t = We(e, t, n);
            break e;
          }
        } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
          var u = o.dependencies;
          if (u !== null) {
            i = o.child;
            for (var a = u.firstContext; a !== null; ) {
              if (a.context === r) {
                if (o.tag === 1) {
                  a = Be(-1, n & -n), a.tag = 2;
                  var f = o.updateQueue;
                  if (f !== null) {
                    f = f.shared;
                    var h = f.pending;
                    h === null ? a.next = a : (a.next = h.next, h.next = a), f.pending = a;
                  }
                }
                o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), so(
                  o.return,
                  n,
                  t
                ), u.lanes |= n;
                break;
              }
              a = a.next;
            }
          } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
          else if (o.tag === 18) {
            if (i = o.return, i === null) throw Error(v(341));
            i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), so(i, n, t), i = o.sibling;
          } else i = o.child;
          if (i !== null) i.return = o;
          else for (i = o; i !== null; ) {
            if (i === t) {
              i = null;
              break;
            }
            if (o = i.sibling, o !== null) {
              o.return = i.return, i = o;
              break;
            }
            i = i.return;
          }
          o = i;
        }
        re(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, r = t.pendingProps.children, $t(t, n), l = ke(l), r = r(l), t.flags |= 1, re(e, t, r, n), t.child;
    case 14:
      return r = t.type, l = ze(r, t.pendingProps), l = ze(r.type, l), cu(e, t, r, l, n);
    case 15:
      return es(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ze(r, l), vr(e, t), t.tag = 1, se(r) ? (e = !0, Tr(t)) : e = !1, $t(t, n), Ja(t, r, l), fo(t, r, l, n), ho(null, t, r, !0, e, n);
    case 19:
      return os(e, t, n);
    case 22:
      return ts(e, t, n);
  }
  throw Error(v(156, t.tag));
};
function ks(e, t) {
  return Xu(e, t);
}
function Ld(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function ye(e, t, n, r) {
  return new Ld(e, t, n, r);
}
function fi(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Td(e) {
  if (typeof e == "function") return fi(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === To) return 11;
    if (e === Do) return 14;
  }
  return 2;
}
function it(e, t) {
  var n = e.alternate;
  return n === null ? (n = ye(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function xr(e, t, n, r, l, o) {
  var i = 2;
  if (r = e, typeof e == "function") fi(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else e: switch (e) {
    case Lt:
      return xt(n.children, l, o, t);
    case Lo:
      i = 8, l |= 8;
      break;
    case Ol:
      return e = ye(12, n, t, l | 2), e.elementType = Ol, e.lanes = o, e;
    case Il:
      return e = ye(13, n, t, l), e.elementType = Il, e.lanes = o, e;
    case jl:
      return e = ye(19, n, t, l), e.elementType = jl, e.lanes = o, e;
    case Tu:
      return tl(n, l, o, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case Fu:
          i = 10;
          break e;
        case Lu:
          i = 9;
          break e;
        case To:
          i = 11;
          break e;
        case Do:
          i = 14;
          break e;
        case Ye:
          i = 16, r = null;
          break e;
      }
      throw Error(v(130, e == null ? e : typeof e, ""));
  }
  return t = ye(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
}
function xt(e, t, n, r) {
  return e = ye(7, e, r, t), e.lanes = n, e;
}
function tl(e, t, n, r) {
  return e = ye(22, e, r, t), e.elementType = Tu, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function Dl(e, t, n) {
  return e = ye(6, e, null, t), e.lanes = n, e;
}
function Ml(e, t, n) {
  return t = ye(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Dd(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = pl(0), this.expirationTimes = pl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = pl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function pi(e, t, n, r, l, o, i, u, a) {
  return e = new Dd(e, t, n, u, a), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ye(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Zo(o), e;
}
function Md(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Ft, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function Ss(e) {
  if (!e) return at;
  e = e._reactInternals;
  e: {
    if (Nt(e) !== e || e.tag !== 1) throw Error(v(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (se(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(v(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (se(n)) return Sa(e, n, t);
  }
  return t;
}
function Es(e, t, n, r, l, o, i, u, a) {
  return e = pi(n, r, !0, e, l, o, i, u, a), e.context = Ss(null), n = e.current, r = le(), l = ot(n), o = Be(r, l), o.callback = t ?? null, rt(n, o, l), e.current.lanes = l, Qn(e, l, r), ce(e, r), e;
}
function nl(e, t, n, r) {
  var l = t.current, o = le(), i = ot(l);
  return n = Ss(n), t.context === null ? t.context = n : t.pendingContext = n, t = Be(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = rt(l, t, i), e !== null && (Fe(e, l, i, o), mr(e, l, i)), i;
}
function Wr(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Su(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function mi(e, t) {
  Su(e, t), (e = e.alternate) && Su(e, t);
}
function Rd() {
  return null;
}
var Cs = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function hi(e) {
  this._internalRoot = e;
}
rl.prototype.render = hi.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(v(409));
  nl(e, t, null, null);
};
rl.prototype.unmount = hi.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    zt(function() {
      nl(null, e, null, null);
    }), t[He] = null;
  }
};
function rl(e) {
  this._internalRoot = e;
}
rl.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = ta();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Ge.length && t !== 0 && t < Ge[n].priority; n++) ;
    Ge.splice(n, 0, e), n === 0 && ra(e);
  }
};
function gi(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function ll(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Eu() {
}
function Od(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var o = r;
      r = function() {
        var f = Wr(i);
        o.call(f);
      };
    }
    var i = Es(t, r, e, 0, null, !1, !1, "", Eu);
    return e._reactRootContainer = i, e[He] = i.current, Rn(e.nodeType === 8 ? e.parentNode : e), zt(), i;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var f = Wr(a);
      u.call(f);
    };
  }
  var a = pi(e, 0, !1, null, null, !1, !1, "", Eu);
  return e._reactRootContainer = a, e[He] = a.current, Rn(e.nodeType === 8 ? e.parentNode : e), zt(function() {
    nl(t, a, n, r);
  }), a;
}
function ol(e, t, n, r, l) {
  var o = n._reactRootContainer;
  if (o) {
    var i = o;
    if (typeof l == "function") {
      var u = l;
      l = function() {
        var a = Wr(i);
        u.call(a);
      };
    }
    nl(t, i, e, l);
  } else i = Od(n, t, e, l, r);
  return Wr(i);
}
bu = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = hn(t.pendingLanes);
        n !== 0 && (Oo(t, n | 1), ce(t, Q()), !(L & 6) && (bt = Q() + 500, dt()));
      }
      break;
    case 13:
      zt(function() {
        var r = Qe(e, 1);
        if (r !== null) {
          var l = le();
          Fe(r, e, 1, l);
        }
      }), mi(e, 1);
  }
};
Io = function(e) {
  if (e.tag === 13) {
    var t = Qe(e, 134217728);
    if (t !== null) {
      var n = le();
      Fe(t, e, 134217728, n);
    }
    mi(e, 134217728);
  }
};
ea = function(e) {
  if (e.tag === 13) {
    var t = ot(e), n = Qe(e, t);
    if (n !== null) {
      var r = le();
      Fe(n, e, t, r);
    }
    mi(e, t);
  }
};
ta = function() {
  return T;
};
na = function(e, t) {
  var n = T;
  try {
    return T = e, t();
  } finally {
    T = n;
  }
};
Yl = function(e, t, n) {
  switch (t) {
    case "input":
      if (Bl(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Gr(r);
            if (!l) throw Error(v(90));
            Mu(r), Bl(r, l);
          }
        }
      }
      break;
    case "textarea":
      Ou(e, n);
      break;
    case "select":
      t = n.value, t != null && Vt(e, !!n.multiple, t, !1);
  }
};
Hu = si;
Qu = zt;
var Id = { usingClientEntryPoint: !1, Events: [$n, Rt, Gr, Bu, Vu, si] }, fn = { findFiberByHostInstance: gt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, jd = { bundleType: fn.bundleType, version: fn.version, rendererPackageName: fn.rendererPackageName, rendererConfig: fn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: $e.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Ku(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: fn.findFiberByHostInstance || Rd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var cr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!cr.isDisabled && cr.supportsFiber) try {
    $r = cr.inject(jd), Re = cr;
  } catch {
  }
}
he.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Id;
he.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!gi(t)) throw Error(v(200));
  return Md(e, t, null, n);
};
he.createRoot = function(e, t) {
  if (!gi(e)) throw Error(v(299));
  var n = !1, r = "", l = Cs;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = pi(e, 1, !1, null, null, n, !1, r, l), e[He] = t.current, Rn(e.nodeType === 8 ? e.parentNode : e), new hi(t);
};
he.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(v(188)) : (e = Object.keys(e).join(","), Error(v(268, e)));
  return e = Ku(t), e = e === null ? null : e.stateNode, e;
};
he.flushSync = function(e) {
  return zt(e);
};
he.hydrate = function(e, t, n) {
  if (!ll(t)) throw Error(v(200));
  return ol(null, e, t, !0, n);
};
he.hydrateRoot = function(e, t, n) {
  if (!gi(e)) throw Error(v(405));
  var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Cs;
  if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Es(t, null, e, 1, n ?? null, l, !1, o, i), e[He] = t.current, Rn(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
    n,
    l
  );
  return new rl(t);
};
he.render = function(e, t, n) {
  if (!ll(t)) throw Error(v(200));
  return ol(null, e, t, !1, n);
};
he.unmountComponentAtNode = function(e) {
  if (!ll(e)) throw Error(v(40));
  return e._reactRootContainer ? (zt(function() {
    ol(null, null, e, !1, function() {
      e._reactRootContainer = null, e[He] = null;
    });
  }), !0) : !1;
};
he.unstable_batchedUpdates = si;
he.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!ll(n)) throw Error(v(200));
  if (e == null || e._reactInternals === void 0) throw Error(v(38));
  return ol(e, t, n, !1, r);
};
he.version = "18.3.1-next-f1338f8080-20240426";
function zs() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(zs);
    } catch (e) {
      console.error(e);
    }
}
zs(), zu.exports = he;
var Ad = zu.exports, _s, Cu = Ad;
_s = Cu.createRoot, Cu.hydrateRoot;
const Ud = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:Inter,-apple-system,system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:Fira Code,SF Mono,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{left:0;right:0}.bottom-0{bottom:0}.bottom-24{bottom:6rem}.left-0{left:0}.left-\\[19px\\]{left:19px}.right-8{right:2rem}.top-0{top:0}.top-\\[38px\\]{top:38px}.top-full{top:100%}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.-mx-10{margin-left:-2.5rem;margin-right:-2.5rem}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.-mb-px{margin-bottom:-1px}.mb-1{margin-bottom:.25rem}.mb-1\\.5{margin-bottom:.375rem}.mb-10{margin-bottom:2.5rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.ml-1{margin-left:.25rem}.ml-2{margin-left:.5rem}.ml-auto{margin-left:auto}.mr-1{margin-right:.25rem}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-10{margin-top:2.5rem}.mt-12{margin-top:3rem}.mt-2{margin-top:.5rem}.mt-2\\.5{margin-top:.625rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.mt-\\[7px\\]{margin-top:7px}.mt-auto{margin-top:auto}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-0\\.5{height:.125rem}.h-1{height:.25rem}.h-1\\.5{height:.375rem}.h-10{height:2.5rem}.h-2{height:.5rem}.h-2\\.5{height:.625rem}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-44{height:11rem}.h-6{height:1.5rem}.h-\\[17px\\]{height:17px}.h-\\[calc\\(100\\%-26px\\)\\]{height:calc(100% - 26px)}.h-auto{height:auto}.h-full{height:100%}.max-h-48{max-height:12rem}.max-h-72{max-height:18rem}.max-h-\\[480px\\]{max-height:480px}.max-h-\\[70vh\\]{max-height:70vh}.min-h-full{min-height:100%}.w-1{width:.25rem}.w-1\\.5{width:.375rem}.w-10{width:2.5rem}.w-2{width:.5rem}.w-2\\.5{width:.625rem}.w-24{width:6rem}.w-32{width:8rem}.w-4{width:1rem}.w-6{width:1.5rem}.w-64{width:16rem}.w-\\[17px\\]{width:17px}.w-full{width:100%}.w-px{width:1px}.min-w-0{min-width:0px}.min-w-\\[140px\\]{min-width:140px}.max-w-\\[1180px\\]{max-width:1180px}.max-w-\\[460px\\]{max-width:460px}.max-w-\\[560px\\]{max-width:560px}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[64ch\\]{max-width:64ch}.max-w-\\[68ch\\]{max-width:68ch}.max-w-\\[70ch\\]{max-width:70ch}.max-w-\\[720px\\]{max-width:720px}.max-w-\\[72ch\\]{max-width:72ch}.max-w-\\[80ch\\]{max-width:80ch}.max-w-\\[900px\\]{max-width:900px}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-default{cursor:default}.cursor-help{cursor:help}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.resize-y{resize:vertical}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-\\[minmax\\(120px\\,220px\\)_1fr_auto\\]{grid-template-columns:minmax(120px,220px) 1fr auto}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-px{gap:1px}.gap-x-3{-moz-column-gap:.75rem;column-gap:.75rem}.gap-x-8{-moz-column-gap:2rem;column-gap:2rem}.gap-y-1{row-gap:.25rem}.gap-y-3{row-gap:.75rem}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem * var(--tw-space-y-reverse))}.space-y-1\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.375rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.375rem * var(--tw-space-y-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-2\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.625rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.625rem * var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-y-5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.25rem * var(--tw-space-y-reverse))}.space-y-7>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.75rem * var(--tw-space-y-reverse))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-line>:not([hidden])~:not([hidden]){border-color:var(--line)}.self-start{align-self:flex-start}.self-stretch{align-self:stretch}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.whitespace-pre-wrap{white-space:pre-wrap}.break-words{overflow-wrap:break-word}.break-all{word-break:break-all}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-sm{border-radius:.125rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-l{border-left-width:1px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.\\!border-rail-line{border-color:var(--rail-line)!important}.border-\\[\\#A78BFA\\]{--tw-border-opacity: 1;border-color:rgb(167 139 250 / var(--tw-border-opacity))}.border-bad{border-color:var(--bad)}.border-ink{border-color:var(--ink)}.border-line{border-color:var(--line)}.border-logs{border-color:var(--logs)}.border-metrics{border-color:var(--metrics)}.border-ok{border-color:var(--ok)}.border-p2{border-color:var(--p2)}.border-prism{border-color:var(--prism)}.border-rail-line{border-color:var(--rail-line)}.border-refract{border-color:var(--refract)}.border-traces{border-color:var(--traces)}.border-transparent{border-color:transparent}.border-universal{border-color:var(--universal)}.\\!bg-transparent{background-color:transparent!important}.bg-\\[\\#38BDF8\\]{--tw-bg-opacity: 1;background-color:rgb(56 189 248 / var(--tw-bg-opacity))}.bg-\\[\\#A78BFA\\]\\/25{background-color:#a78bfa40}.bg-bad{background-color:var(--bad)}.bg-black\\/40{background-color:#0006}.bg-ink{background-color:var(--ink)}.bg-line{background-color:var(--line)}.bg-logs{background-color:var(--logs)}.bg-metrics{background-color:var(--metrics)}.bg-ok{background-color:var(--ok)}.bg-p1{background-color:var(--p1)}.bg-p2{background-color:var(--p2)}.bg-p3{background-color:var(--p3)}.bg-paper{background-color:var(--paper)}.bg-prism{background-color:var(--prism)}.bg-rail{background-color:var(--rail)}.bg-rail-line{background-color:var(--rail-line)}.bg-refract{background-color:var(--refract)}.bg-refract-soft{background-color:var(--refract-soft)}.bg-sunk{background-color:var(--sunk)}.bg-surface{background-color:var(--surface)}.bg-traces{background-color:var(--traces)}.bg-transparent{background-color:transparent}.bg-universal{background-color:var(--universal)}.bg-warnbg{background-color:var(--warnbg)}.bg-white\\/10{background-color:#ffffff1a}.bg-white\\/\\[\\.06\\]{background-color:#ffffff0f}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-1\\.5{padding-left:.375rem;padding-right:.375rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-3\\.5{padding-left:.875rem;padding-right:.875rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-5{padding-top:1.25rem;padding-bottom:1.25rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-7{padding-top:1.75rem;padding-bottom:1.75rem}.pb-1{padding-bottom:.25rem}.pb-4{padding-bottom:1rem}.pb-6{padding-bottom:1.5rem}.pl-5{padding-left:1.25rem}.pl-6{padding-left:1.5rem}.pt-10{padding-top:2.5rem}.pt-3{padding-top:.75rem}.pt-5{padding-top:1.25rem}.pt-6{padding-top:1.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.align-top{vertical-align:top}.font-display{font-family:Inter,-apple-system,system-ui,sans-serif}.font-mono{font-family:Fira Code,SF Mono,monospace}.font-sans{font-family:Inter,-apple-system,system-ui,sans-serif}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[11px\\]{font-size:11px}.text-\\[12\\.5px\\]{font-size:12.5px}.text-\\[12px\\]{font-size:12px}.text-\\[13\\.5px\\]{font-size:13.5px}.text-\\[13px\\]{font-size:13px}.text-\\[14\\.5px\\]{font-size:14.5px}.text-\\[14px\\]{font-size:14px}.text-\\[15px\\]{font-size:15px}.text-\\[16px\\]{font-size:16px}.text-\\[17px\\]{font-size:17px}.text-\\[18px\\]{font-size:18px}.text-\\[20px\\]{font-size:20px}.text-\\[22px\\]{font-size:22px}.text-\\[26px\\]{font-size:26px}.text-\\[28px\\]{font-size:28px}.text-\\[30px\\]{font-size:30px}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.capitalize{text-transform:capitalize}.leading-none{line-height:1}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}.leading-tight{line-height:1.25}.tracking-\\[-0\\.01em\\]{letter-spacing:-.01em}.tracking-tight{letter-spacing:-.025em}.tracking-wider{letter-spacing:.05em}.\\!text-rail-mute{color:var(--rail-mute)!important}.text-\\[\\#A78BFA\\]{--tw-text-opacity: 1;color:rgb(167 139 250 / var(--tw-text-opacity))}.text-\\[color\\:var\\(--on-refract\\)\\]{color:var(--on-refract)}.text-bad{color:var(--bad)}.text-ink{color:var(--ink)}.text-line{color:var(--line)}.text-logs{color:var(--logs)}.text-metrics{color:var(--metrics)}.text-mute{color:var(--mute)}.text-ok{color:var(--ok)}.text-on-color{color:var(--on-color)}.text-p1{color:var(--p1)}.text-p2{color:var(--p2)}.text-p3{color:var(--p3)}.text-paper{color:var(--paper)}.text-prism{color:var(--prism)}.text-rail-ink{color:var(--rail-ink)}.text-rail-mute{color:var(--rail-mute)}.text-refract{color:var(--refract)}.text-traces{color:var(--traces)}.text-universal{color:var(--universal)}.text-warn{color:var(--warn)}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.underline{text-decoration-line:underline}.decoration-dotted{text-decoration-style:dotted}.underline-offset-\\[3px\\]{text-underline-offset:3px}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-70{opacity:.7}.\\!shadow-none{--tw-shadow: 0 0 #0000 !important;--tw-shadow-colored: 0 0 #0000 !important;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)!important}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.02\\)\\]{--tw-shadow: 0 -4px 20px rgba(0,0,0,.02);--tw-shadow-colored: 0 -4px 20px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-float{--tw-shadow: 0 10px 30px -5px rgba(0, 0, 0, .08);--tw-shadow-colored: 0 10px 30px -5px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-soft{--tw-shadow: 0 4px 20px -2px rgba(0, 0, 0, .05);--tw-shadow-colored: 0 4px 20px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.ring{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-refract{--tw-ring-color: var(--refract)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur-md{--tw-backdrop-blur: blur(12px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200{transition-duration:.2s}:root{--paper: #F8FAFC;--surface: #FFFFFF;--sunk: #F1F5F9;--ink: #0F172A;--mute: #596A80;--line: #E2E8F0;--rail: #0B1120;--rail-ink: #F8FAFC;--rail-mute: #94A3B8;--rail-line: #1E293B;--refract: #0369A1;--refract-soft: #E0F2FE;--on-refract: #FFFFFF;--prism: #8B5CF6;--universal: #2563EB;--logs: #047857;--traces: #7C3AED;--metrics: #B45309;--p1: #047857;--p2: #B45309;--p3: #C2410C;--warn: #9A3412;--warnbg: #FFEDD5;--bad: #DC2626;--ok: #047857;--on-color: #FFFFFF;color-scheme:light dark}@media (prefers-color-scheme: dark){:root{--paper: #0F172A;--surface: #1E293B;--sunk: #0B1120;--ink: #F8FAFC;--mute: #94A3B8;--line: #334155;--rail: #020617;--rail-ink: #F8FAFC;--rail-mute: #94A3B8;--rail-line: #1E293B;--refract: #38BDF8;--refract-soft: #082F49;--on-refract: #020617;--prism: #A78BFA;--universal: #60A5FA;--logs: #34D399;--traces: #A78BFA;--metrics: #FBBF24;--p1: #34D399;--p2: #FBBF24;--p3: #FB923C;--warn: #FDBA74;--warnbg: #431407;--bad: #F87171;--ok: #34D399;--on-color: #0F172A}}html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth}html,body,#root{height:100%}body{background:var(--paper);color:var(--ink)}.tabnum{font-variant-numeric:tabular-nums}:focus-visible{outline:2px solid var(--prism);outline-offset:2px;border-radius:6px}.hatch{background-image:repeating-linear-gradient(135deg,currentColor 0 2px,transparent 2px 7px)}.lens-grow{transition:width .6s cubic-bezier(.2,.7,.2,1)}@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}kbd{font:600 11px/1 Inter,-apple-system,system-ui,sans-serif;border:1px solid var(--line);border-bottom-width:2px;border-radius:6px;padding:3px 6px;background:var(--surface);color:var(--ink);box-shadow:0 1px 2px #0000000d}.last\\:border-0:last-child{border-width:0px}.hover\\:border-mute:hover{border-color:var(--mute)}.hover\\:border-prism:hover{border-color:var(--prism)}.hover\\:border-refract:hover{border-color:var(--refract)}.hover\\:bg-bad:hover{background-color:var(--bad)}.hover\\:bg-sunk:hover{background-color:var(--sunk)}.hover\\:bg-white\\/\\[\\.04\\]:hover{background-color:#ffffff0a}.hover\\:bg-white\\/\\[\\.06\\]:hover{background-color:#ffffff0f}.hover\\:text-bad:hover{color:var(--bad)}.hover\\:text-ink:hover{color:var(--ink)}.hover\\:text-on-color:hover{color:var(--on-color)}.hover\\:text-rail-ink:hover{color:var(--rail-ink)}.hover\\:text-refract:hover{color:var(--refract)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-100:hover{opacity:1}.hover\\:shadow-float:hover{--tw-shadow: 0 10px 30px -5px rgba(0, 0, 0, .08);--tw-shadow-colored: 0 10px 30px -5px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.hover\\:brightness-110:hover{--tw-brightness: brightness(1.1);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.focus\\:border-refract:focus{border-color:var(--refract)}.active\\:scale-\\[0\\.98\\]:active{--tw-scale-x: .98;--tw-scale-y: .98;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-40:disabled{opacity:.4}.group[open] .group-open\\:rotate-90{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group\\/term:focus-within .group-focus-within\\/term\\:opacity-100{opacity:1}.group\\/term:hover .group-hover\\/term\\:opacity-100{opacity:1}@media (min-width: 640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\\:grid-cols-\\[1fr_140px\\]{grid-template-columns:1fr 140px}}@media (min-width: 768px){.md\\:sticky{position:sticky}.md\\:top-0{top:0}.md\\:grid{display:grid}.md\\:h-screen{height:100vh}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-\\[220px_1fr\\]{grid-template-columns:220px 1fr}.md\\:grid-cols-\\[272px_1fr\\]{grid-template-columns:272px 1fr}.md\\:overflow-y-auto{overflow-y:auto}}@media (min-width: 1024px){.lg\\:sticky{position:sticky}.lg\\:top-4{top:1rem}.lg\\:grid-cols-\\[1fr_340px\\]{grid-template-columns:1fr 340px}.lg\\:grid-cols-\\[380px_1fr\\]{grid-template-columns:380px 1fr}}';
class Bd extends HTMLElement {
  constructor() {
    super(...arguments);
    wi(this, "root");
  }
  connectedCallback() {
    const n = this.attachShadow({ mode: "open" }), r = document.createElement("style");
    r.textContent = Ud.replace(/:root/g, ":host"), n.appendChild(r);
    const l = document.createElement("div");
    n.appendChild(l), this.getAttribute("api") && Ts(this.getAttribute("api")), this.getAttribute("token") && (window.__CXLENS_TOKEN__ = this.getAttribute("token")), this.root = _s(l), this.root.render(/* @__PURE__ */ Ds.jsx(Ms, {}));
  }
  disconnectedCallback() {
    var n;
    (n = this.root) == null || n.unmount();
  }
}
customElements.get("coralogix-lens") || customElements.define("coralogix-lens", Bd);
export {
  Bd as CoralogixLensElement
};
