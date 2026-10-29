var Fs = Object.defineProperty;
var Ns = (e, t, r) => t in e ? Fs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var wi = (e, t, r) => Ns(e, typeof t != "symbol" ? t + "" : t, r);
import { r as Ps, s as Ls, j as Ts, A as Ds } from "./lib-DHkINWO1.js";
var Ca = { exports: {} }, me = {}, za = { exports: {} }, _a = {};
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
  function t(E, _) {
    var F = E.length;
    E.push(_);
    e: for (; 0 < F; ) {
      var V = F - 1 >>> 1, K = E[V];
      if (0 < o(K, _)) E[V] = _, E[F] = K, F = V;
      else break e;
    }
  }
  function r(E) {
    return E.length === 0 ? null : E[0];
  }
  function n(E) {
    if (E.length === 0) return null;
    var _ = E[0], F = E.pop();
    if (F !== _) {
      E[0] = F;
      e: for (var V = 0, K = E.length, $r = K >>> 1; V < $r; ) {
        var pt = 2 * (V + 1) - 1, uo = E[pt], ft = pt + 1, Kr = E[ft];
        if (0 > o(uo, F)) ft < K && 0 > o(Kr, uo) ? (E[V] = Kr, E[ft] = F, V = ft) : (E[V] = uo, E[pt] = F, V = pt);
        else if (ft < K && 0 > o(Kr, F)) E[V] = Kr, E[ft] = F, V = ft;
        else break e;
      }
    }
    return _;
  }
  function o(E, _) {
    var F = E.sortIndex - _.sortIndex;
    return F !== 0 ? F : E.id - _.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var l = performance;
    e.unstable_now = function() {
      return l.now();
    };
  } else {
    var i = Date, a = i.now();
    e.unstable_now = function() {
      return i.now() - a;
    };
  }
  var u = [], p = [], m = 1, g = null, f = 3, w = !1, y = !1, x = !1, R = typeof setTimeout == "function" ? setTimeout : null, c = typeof clearTimeout == "function" ? clearTimeout : null, s = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function d(E) {
    for (var _ = r(p); _ !== null; ) {
      if (_.callback === null) n(p);
      else if (_.startTime <= E) n(p), _.sortIndex = _.expirationTime, t(u, _);
      else break;
      _ = r(p);
    }
  }
  function h(E) {
    if (x = !1, d(E), !y) if (r(u) !== null) y = !0, io(S);
    else {
      var _ = r(p);
      _ !== null && ao(h, _.startTime - E);
    }
  }
  function S(E, _) {
    y = !1, x && (x = !1, c(z), z = -1), w = !0;
    var F = f;
    try {
      for (d(_), g = r(u); g !== null && (!(g.expirationTime > _) || E && !Ee()); ) {
        var V = g.callback;
        if (typeof V == "function") {
          g.callback = null, f = g.priorityLevel;
          var K = V(g.expirationTime <= _);
          _ = e.unstable_now(), typeof K == "function" ? g.callback = K : g === r(u) && n(u), d(_);
        } else n(u);
        g = r(u);
      }
      if (g !== null) var $r = !0;
      else {
        var pt = r(p);
        pt !== null && ao(h, pt.startTime - _), $r = !1;
      }
      return $r;
    } finally {
      g = null, f = F, w = !1;
    }
  }
  var b = !1, C = null, z = -1, U = 5, N = -1;
  function Ee() {
    return !(e.unstable_now() - N < U);
  }
  function rr() {
    if (C !== null) {
      var E = e.unstable_now();
      N = E;
      var _ = !0;
      try {
        _ = C(!0, E);
      } finally {
        _ ? nr() : (b = !1, C = null);
      }
    } else b = !1;
  }
  var nr;
  if (typeof s == "function") nr = function() {
    s(rr);
  };
  else if (typeof MessageChannel < "u") {
    var vi = new MessageChannel(), _s = vi.port2;
    vi.port1.onmessage = rr, nr = function() {
      _s.postMessage(null);
    };
  } else nr = function() {
    R(rr, 0);
  };
  function io(E) {
    C = E, b || (b = !0, nr());
  }
  function ao(E, _) {
    z = R(function() {
      E(e.unstable_now());
    }, _);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(E) {
    E.callback = null;
  }, e.unstable_continueExecution = function() {
    y || w || (y = !0, io(S));
  }, e.unstable_forceFrameRate = function(E) {
    0 > E || 125 < E ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : U = 0 < E ? Math.floor(1e3 / E) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return f;
  }, e.unstable_getFirstCallbackNode = function() {
    return r(u);
  }, e.unstable_next = function(E) {
    switch (f) {
      case 1:
      case 2:
      case 3:
        var _ = 3;
        break;
      default:
        _ = f;
    }
    var F = f;
    f = _;
    try {
      return E();
    } finally {
      f = F;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(E, _) {
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
    var F = f;
    f = E;
    try {
      return _();
    } finally {
      f = F;
    }
  }, e.unstable_scheduleCallback = function(E, _, F) {
    var V = e.unstable_now();
    switch (typeof F == "object" && F !== null ? (F = F.delay, F = typeof F == "number" && 0 < F ? V + F : V) : F = V, E) {
      case 1:
        var K = -1;
        break;
      case 2:
        K = 250;
        break;
      case 5:
        K = 1073741823;
        break;
      case 4:
        K = 1e4;
        break;
      default:
        K = 5e3;
    }
    return K = F + K, E = { id: m++, callback: _, priorityLevel: E, startTime: F, expirationTime: K, sortIndex: -1 }, F > V ? (E.sortIndex = F, t(p, E), r(u) === null && E === r(p) && (x ? (c(z), z = -1) : x = !0, ao(h, F - V))) : (E.sortIndex = K, t(u, E), y || w || (y = !0, io(S))), E;
  }, e.unstable_shouldYield = Ee, e.unstable_wrapCallback = function(E) {
    var _ = f;
    return function() {
      var F = f;
      f = _;
      try {
        return E.apply(this, arguments);
      } finally {
        f = F;
      }
    };
  };
})(_a);
za.exports = _a;
var Ms = za.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rs = Ps, ge = Ms;
function v(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var Fa = /* @__PURE__ */ new Set(), Cr = {};
function zt(e, t) {
  Kt(e, t), Kt(e + "Capture", t);
}
function Kt(e, t) {
  for (Cr[e] = t, e = 0; e < t.length; e++) Fa.add(t[e]);
}
var Ue = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ro = Object.prototype.hasOwnProperty, Os = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, yi = {}, xi = {};
function Is(e) {
  return Ro.call(xi, e) ? !0 : Ro.call(yi, e) ? !1 : Os.test(e) ? xi[e] = !0 : (yi[e] = !0, !1);
}
function Bs(e, t, r, n) {
  if (r !== null && r.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return n ? !1 : r !== null ? !r.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function js(e, t, r, n) {
  if (t === null || typeof t > "u" || Bs(e, t, r, n)) return !0;
  if (n) return !1;
  if (r !== null) switch (r.type) {
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
function le(e, t, r, n, o, l, i) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = n, this.attributeNamespace = o, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = l, this.removeEmptyString = i;
}
var J = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  J[e] = new le(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  J[t] = new le(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  J[e] = new le(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  J[e] = new le(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  J[e] = new le(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  J[e] = new le(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  J[e] = new le(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  J[e] = new le(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  J[e] = new le(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var _l = /[\-:]([a-z])/g;
function Fl(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    _l,
    Fl
  );
  J[t] = new le(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(_l, Fl);
  J[t] = new le(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(_l, Fl);
  J[t] = new le(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  J[e] = new le(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
J.xlinkHref = new le("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  J[e] = new le(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Nl(e, t, r, n) {
  var o = J.hasOwnProperty(t) ? J[t] : null;
  (o !== null ? o.type !== 0 : n || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (js(t, r, o, n) && (r = null), n || o === null ? Is(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : o.mustUseProperty ? e[o.propertyName] = r === null ? o.type === 3 ? !1 : "" : r : (t = o.attributeName, n = o.attributeNamespace, r === null ? e.removeAttribute(t) : (o = o.type, r = o === 3 || o === 4 && r === !0 ? "" : "" + r, n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
}
var We = Rs.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Yr = Symbol.for("react.element"), Nt = Symbol.for("react.portal"), Pt = Symbol.for("react.fragment"), Pl = Symbol.for("react.strict_mode"), Oo = Symbol.for("react.profiler"), Na = Symbol.for("react.provider"), Pa = Symbol.for("react.context"), Ll = Symbol.for("react.forward_ref"), Io = Symbol.for("react.suspense"), Bo = Symbol.for("react.suspense_list"), Tl = Symbol.for("react.memo"), Ke = Symbol.for("react.lazy"), La = Symbol.for("react.offscreen"), ki = Symbol.iterator;
function or(e) {
  return e === null || typeof e != "object" ? null : (e = ki && e[ki] || e["@@iterator"], typeof e == "function" ? e : null);
}
var j = Object.assign, so;
function pr(e) {
  if (so === void 0) try {
    throw Error();
  } catch (r) {
    var t = r.stack.trim().match(/\n( *(at )?)/);
    so = t && t[1] || "";
  }
  return `
` + so + e;
}
var co = !1;
function po(e, t) {
  if (!e || co) return "";
  co = !0;
  var r = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (p) {
        var n = p;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (p) {
        n = p;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (p) {
        n = p;
      }
      e();
    }
  } catch (p) {
    if (p && n && typeof p.stack == "string") {
      for (var o = p.stack.split(`
`), l = n.stack.split(`
`), i = o.length - 1, a = l.length - 1; 1 <= i && 0 <= a && o[i] !== l[a]; ) a--;
      for (; 1 <= i && 0 <= a; i--, a--) if (o[i] !== l[a]) {
        if (i !== 1 || a !== 1)
          do
            if (i--, a--, 0 > a || o[i] !== l[a]) {
              var u = `
` + o[i].replace(" at new ", " at ");
              return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
            }
          while (1 <= i && 0 <= a);
        break;
      }
    }
  } finally {
    co = !1, Error.prepareStackTrace = r;
  }
  return (e = e ? e.displayName || e.name : "") ? pr(e) : "";
}
function As(e) {
  switch (e.tag) {
    case 5:
      return pr(e.type);
    case 16:
      return pr("Lazy");
    case 13:
      return pr("Suspense");
    case 19:
      return pr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = po(e.type, !1), e;
    case 11:
      return e = po(e.type.render, !1), e;
    case 1:
      return e = po(e.type, !0), e;
    default:
      return "";
  }
}
function jo(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Pt:
      return "Fragment";
    case Nt:
      return "Portal";
    case Oo:
      return "Profiler";
    case Pl:
      return "StrictMode";
    case Io:
      return "Suspense";
    case Bo:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case Pa:
      return (e.displayName || "Context") + ".Consumer";
    case Na:
      return (e._context.displayName || "Context") + ".Provider";
    case Ll:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case Tl:
      return t = e.displayName || null, t !== null ? t : jo(e.type) || "Memo";
    case Ke:
      t = e._payload, e = e._init;
      try {
        return jo(e(t));
      } catch {
      }
  }
  return null;
}
function Us(e) {
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
      return jo(t);
    case 8:
      return t === Pl ? "StrictMode" : "Mode";
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
function at(e) {
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
function Ta(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Vs(e) {
  var t = Ta(e) ? "checked" : "value", r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), n = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
    var o = r.get, l = r.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return o.call(this);
    }, set: function(i) {
      n = "" + i, l.call(this, i);
    } }), Object.defineProperty(e, t, { enumerable: r.enumerable }), { getValue: function() {
      return n;
    }, setValue: function(i) {
      n = "" + i;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function Xr(e) {
  e._valueTracker || (e._valueTracker = Vs(e));
}
function Da(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var r = t.getValue(), n = "";
  return e && (n = Ta(e) ? e.checked ? "true" : "false" : e.value), e = n, e !== r ? (t.setValue(e), !0) : !1;
}
function kn(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Ao(e, t) {
  var r = t.checked;
  return j({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
}
function Si(e, t) {
  var r = t.defaultValue == null ? "" : t.defaultValue, n = t.checked != null ? t.checked : t.defaultChecked;
  r = at(t.value != null ? t.value : r), e._wrapperState = { initialChecked: n, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function Ma(e, t) {
  t = t.checked, t != null && Nl(e, "checked", t, !1);
}
function Uo(e, t) {
  Ma(e, t);
  var r = at(t.value), n = t.type;
  if (r != null) n === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
  else if (n === "submit" || n === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? Vo(e, t.type, r) : t.hasOwnProperty("defaultValue") && Vo(e, t.type, at(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Ei(e, t, r) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var n = t.type;
    if (!(n !== "submit" && n !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
  }
  r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
}
function Vo(e, t, r) {
  (t !== "number" || kn(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
}
var fr = Array.isArray;
function Ut(e, t, r, n) {
  if (e = e.options, t) {
    t = {};
    for (var o = 0; o < r.length; o++) t["$" + r[o]] = !0;
    for (r = 0; r < e.length; r++) o = t.hasOwnProperty("$" + e[r].value), e[r].selected !== o && (e[r].selected = o), o && n && (e[r].defaultSelected = !0);
  } else {
    for (r = "" + at(r), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === r) {
        e[o].selected = !0, n && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function Ho(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(v(91));
  return j({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function bi(e, t) {
  var r = t.value;
  if (r == null) {
    if (r = t.children, t = t.defaultValue, r != null) {
      if (t != null) throw Error(v(92));
      if (fr(r)) {
        if (1 < r.length) throw Error(v(93));
        r = r[0];
      }
      t = r;
    }
    t == null && (t = ""), r = t;
  }
  e._wrapperState = { initialValue: at(r) };
}
function Ra(e, t) {
  var r = at(t.value), n = at(t.defaultValue);
  r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), n != null && (e.defaultValue = "" + n);
}
function Ci(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Oa(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Qo(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? Oa(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var Gr, Ia = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, n, o) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, r, n, o);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (Gr = Gr || document.createElement("div"), Gr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Gr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function zr(e, t) {
  if (t) {
    var r = e.firstChild;
    if (r && r === e.lastChild && r.nodeType === 3) {
      r.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var hr = {
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
}, Hs = ["Webkit", "ms", "Moz", "O"];
Object.keys(hr).forEach(function(e) {
  Hs.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), hr[t] = hr[e];
  });
});
function Ba(e, t, r) {
  return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || hr.hasOwnProperty(e) && hr[e] ? ("" + t).trim() : t + "px";
}
function ja(e, t) {
  e = e.style;
  for (var r in t) if (t.hasOwnProperty(r)) {
    var n = r.indexOf("--") === 0, o = Ba(r, t[r], n);
    r === "float" && (r = "cssFloat"), n ? e.setProperty(r, o) : e[r] = o;
  }
}
var Qs = j({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function Wo(e, t) {
  if (t) {
    if (Qs[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(v(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(v(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(v(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(v(62));
  }
}
function $o(e, t) {
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
var Ko = null;
function Dl(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var Yo = null, Vt = null, Ht = null;
function zi(e) {
  if (e = Qr(e)) {
    if (typeof Yo != "function") throw Error(v(280));
    var t = e.stateNode;
    t && (t = Xn(t), Yo(e.stateNode, e.type, t));
  }
}
function Aa(e) {
  Vt ? Ht ? Ht.push(e) : Ht = [e] : Vt = e;
}
function Ua() {
  if (Vt) {
    var e = Vt, t = Ht;
    if (Ht = Vt = null, zi(e), t) for (e = 0; e < t.length; e++) zi(t[e]);
  }
}
function Va(e, t) {
  return e(t);
}
function Ha() {
}
var fo = !1;
function Qa(e, t, r) {
  if (fo) return e(t, r);
  fo = !0;
  try {
    return Va(e, t, r);
  } finally {
    fo = !1, (Vt !== null || Ht !== null) && (Ha(), Ua());
  }
}
function _r(e, t) {
  var r = e.stateNode;
  if (r === null) return null;
  var n = Xn(r);
  if (n === null) return null;
  r = n[t];
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
      (n = !n.disabled) || (e = e.type, n = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !n;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (r && typeof r != "function") throw Error(v(231, t, typeof r));
  return r;
}
var Xo = !1;
if (Ue) try {
  var lr = {};
  Object.defineProperty(lr, "passive", { get: function() {
    Xo = !0;
  } }), window.addEventListener("test", lr, lr), window.removeEventListener("test", lr, lr);
} catch {
  Xo = !1;
}
function Ws(e, t, r, n, o, l, i, a, u) {
  var p = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(r, p);
  } catch (m) {
    this.onError(m);
  }
}
var vr = !1, Sn = null, En = !1, Go = null, $s = { onError: function(e) {
  vr = !0, Sn = e;
} };
function Ks(e, t, r, n, o, l, i, a, u) {
  vr = !1, Sn = null, Ws.apply($s, arguments);
}
function Ys(e, t, r, n, o, l, i, a, u) {
  if (Ks.apply(this, arguments), vr) {
    if (vr) {
      var p = Sn;
      vr = !1, Sn = null;
    } else throw Error(v(198));
    En || (En = !0, Go = p);
  }
}
function _t(e) {
  var t = e, r = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (r = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? r : null;
}
function Wa(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function _i(e) {
  if (_t(e) !== e) throw Error(v(188));
}
function Xs(e) {
  var t = e.alternate;
  if (!t) {
    if (t = _t(e), t === null) throw Error(v(188));
    return t !== e ? null : e;
  }
  for (var r = e, n = t; ; ) {
    var o = r.return;
    if (o === null) break;
    var l = o.alternate;
    if (l === null) {
      if (n = o.return, n !== null) {
        r = n;
        continue;
      }
      break;
    }
    if (o.child === l.child) {
      for (l = o.child; l; ) {
        if (l === r) return _i(o), e;
        if (l === n) return _i(o), t;
        l = l.sibling;
      }
      throw Error(v(188));
    }
    if (r.return !== n.return) r = o, n = l;
    else {
      for (var i = !1, a = o.child; a; ) {
        if (a === r) {
          i = !0, r = o, n = l;
          break;
        }
        if (a === n) {
          i = !0, n = o, r = l;
          break;
        }
        a = a.sibling;
      }
      if (!i) {
        for (a = l.child; a; ) {
          if (a === r) {
            i = !0, r = l, n = o;
            break;
          }
          if (a === n) {
            i = !0, n = l, r = o;
            break;
          }
          a = a.sibling;
        }
        if (!i) throw Error(v(189));
      }
    }
    if (r.alternate !== n) throw Error(v(190));
  }
  if (r.tag !== 3) throw Error(v(188));
  return r.stateNode.current === r ? e : t;
}
function $a(e) {
  return e = Xs(e), e !== null ? Ka(e) : null;
}
function Ka(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Ka(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Ya = ge.unstable_scheduleCallback, Fi = ge.unstable_cancelCallback, Gs = ge.unstable_shouldYield, Zs = ge.unstable_requestPaint, H = ge.unstable_now, Js = ge.unstable_getCurrentPriorityLevel, Ml = ge.unstable_ImmediatePriority, Xa = ge.unstable_UserBlockingPriority, bn = ge.unstable_NormalPriority, qs = ge.unstable_LowPriority, Ga = ge.unstable_IdlePriority, Wn = null, Me = null;
function ec(e) {
  if (Me && typeof Me.onCommitFiberRoot == "function") try {
    Me.onCommitFiberRoot(Wn, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Fe = Math.clz32 ? Math.clz32 : nc, tc = Math.log, rc = Math.LN2;
function nc(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (tc(e) / rc | 0) | 0;
}
var Zr = 64, Jr = 4194304;
function gr(e) {
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
function Cn(e, t) {
  var r = e.pendingLanes;
  if (r === 0) return 0;
  var n = 0, o = e.suspendedLanes, l = e.pingedLanes, i = r & 268435455;
  if (i !== 0) {
    var a = i & ~o;
    a !== 0 ? n = gr(a) : (l &= i, l !== 0 && (n = gr(l)));
  } else i = r & ~o, i !== 0 ? n = gr(i) : l !== 0 && (n = gr(l));
  if (n === 0) return 0;
  if (t !== 0 && t !== n && !(t & o) && (o = n & -n, l = t & -t, o >= l || o === 16 && (l & 4194240) !== 0)) return t;
  if (n & 4 && (n |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= n; 0 < t; ) r = 31 - Fe(t), o = 1 << r, n |= e[r], t &= ~o;
  return n;
}
function oc(e, t) {
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
function lc(e, t) {
  for (var r = e.suspendedLanes, n = e.pingedLanes, o = e.expirationTimes, l = e.pendingLanes; 0 < l; ) {
    var i = 31 - Fe(l), a = 1 << i, u = o[i];
    u === -1 ? (!(a & r) || a & n) && (o[i] = oc(a, t)) : u <= t && (e.expiredLanes |= a), l &= ~a;
  }
}
function Zo(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Za() {
  var e = Zr;
  return Zr <<= 1, !(Zr & 4194240) && (Zr = 64), e;
}
function go(e) {
  for (var t = [], r = 0; 31 > r; r++) t.push(e);
  return t;
}
function Vr(e, t, r) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Fe(t), e[t] = r;
}
function ic(e, t) {
  var r = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var n = e.eventTimes;
  for (e = e.expirationTimes; 0 < r; ) {
    var o = 31 - Fe(r), l = 1 << o;
    t[o] = 0, n[o] = -1, e[o] = -1, r &= ~l;
  }
}
function Rl(e, t) {
  var r = e.entangledLanes |= t;
  for (e = e.entanglements; r; ) {
    var n = 31 - Fe(r), o = 1 << n;
    o & t | e[n] & t && (e[n] |= t), r &= ~o;
  }
}
var L = 0;
function Ja(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var qa, Ol, eu, tu, ru, Jo = !1, qr = [], qe = null, et = null, tt = null, Fr = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), Xe = [], ac = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Ni(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      qe = null;
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
      Fr.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Nr.delete(t.pointerId);
  }
}
function ir(e, t, r, n, o, l) {
  return e === null || e.nativeEvent !== l ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: n, nativeEvent: l, targetContainers: [o] }, t !== null && (t = Qr(t), t !== null && Ol(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
}
function uc(e, t, r, n, o) {
  switch (t) {
    case "focusin":
      return qe = ir(qe, e, t, r, n, o), !0;
    case "dragenter":
      return et = ir(et, e, t, r, n, o), !0;
    case "mouseover":
      return tt = ir(tt, e, t, r, n, o), !0;
    case "pointerover":
      var l = o.pointerId;
      return Fr.set(l, ir(Fr.get(l) || null, e, t, r, n, o)), !0;
    case "gotpointercapture":
      return l = o.pointerId, Nr.set(l, ir(Nr.get(l) || null, e, t, r, n, o)), !0;
  }
  return !1;
}
function nu(e) {
  var t = ht(e.target);
  if (t !== null) {
    var r = _t(t);
    if (r !== null) {
      if (t = r.tag, t === 13) {
        if (t = Wa(r), t !== null) {
          e.blockedOn = t, ru(e.priority, function() {
            eu(r);
          });
          return;
        }
      } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function dn(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var r = qo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (r === null) {
      r = e.nativeEvent;
      var n = new r.constructor(r.type, r);
      Ko = n, r.target.dispatchEvent(n), Ko = null;
    } else return t = Qr(r), t !== null && Ol(t), e.blockedOn = r, !1;
    t.shift();
  }
  return !0;
}
function Pi(e, t, r) {
  dn(e) && r.delete(t);
}
function sc() {
  Jo = !1, qe !== null && dn(qe) && (qe = null), et !== null && dn(et) && (et = null), tt !== null && dn(tt) && (tt = null), Fr.forEach(Pi), Nr.forEach(Pi);
}
function ar(e, t) {
  e.blockedOn === t && (e.blockedOn = null, Jo || (Jo = !0, ge.unstable_scheduleCallback(ge.unstable_NormalPriority, sc)));
}
function Pr(e) {
  function t(o) {
    return ar(o, e);
  }
  if (0 < qr.length) {
    ar(qr[0], e);
    for (var r = 1; r < qr.length; r++) {
      var n = qr[r];
      n.blockedOn === e && (n.blockedOn = null);
    }
  }
  for (qe !== null && ar(qe, e), et !== null && ar(et, e), tt !== null && ar(tt, e), Fr.forEach(t), Nr.forEach(t), r = 0; r < Xe.length; r++) n = Xe[r], n.blockedOn === e && (n.blockedOn = null);
  for (; 0 < Xe.length && (r = Xe[0], r.blockedOn === null); ) nu(r), r.blockedOn === null && Xe.shift();
}
var Qt = We.ReactCurrentBatchConfig, zn = !0;
function cc(e, t, r, n) {
  var o = L, l = Qt.transition;
  Qt.transition = null;
  try {
    L = 1, Il(e, t, r, n);
  } finally {
    L = o, Qt.transition = l;
  }
}
function dc(e, t, r, n) {
  var o = L, l = Qt.transition;
  Qt.transition = null;
  try {
    L = 4, Il(e, t, r, n);
  } finally {
    L = o, Qt.transition = l;
  }
}
function Il(e, t, r, n) {
  if (zn) {
    var o = qo(e, t, r, n);
    if (o === null) bo(e, t, n, _n, r), Ni(e, n);
    else if (uc(o, e, t, r, n)) n.stopPropagation();
    else if (Ni(e, n), t & 4 && -1 < ac.indexOf(e)) {
      for (; o !== null; ) {
        var l = Qr(o);
        if (l !== null && qa(l), l = qo(e, t, r, n), l === null && bo(e, t, n, _n, r), l === o) break;
        o = l;
      }
      o !== null && n.stopPropagation();
    } else bo(e, t, n, null, r);
  }
}
var _n = null;
function qo(e, t, r, n) {
  if (_n = null, e = Dl(n), e = ht(e), e !== null) if (t = _t(e), t === null) e = null;
  else if (r = t.tag, r === 13) {
    if (e = Wa(t), e !== null) return e;
    e = null;
  } else if (r === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return _n = e, null;
}
function ou(e) {
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
      switch (Js()) {
        case Ml:
          return 1;
        case Xa:
          return 4;
        case bn:
        case qs:
          return 16;
        case Ga:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Ze = null, Bl = null, pn = null;
function lu() {
  if (pn) return pn;
  var e, t = Bl, r = t.length, n, o = "value" in Ze ? Ze.value : Ze.textContent, l = o.length;
  for (e = 0; e < r && t[e] === o[e]; e++) ;
  var i = r - e;
  for (n = 1; n <= i && t[r - n] === o[l - n]; n++) ;
  return pn = o.slice(e, 1 < n ? 1 - n : void 0);
}
function fn(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function en() {
  return !0;
}
function Li() {
  return !1;
}
function he(e) {
  function t(r, n, o, l, i) {
    this._reactName = r, this._targetInst = o, this.type = n, this.nativeEvent = l, this.target = i, this.currentTarget = null;
    for (var a in e) e.hasOwnProperty(a) && (r = e[a], this[a] = r ? r(l) : l[a]);
    return this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? en : Li, this.isPropagationStopped = Li, this;
  }
  return j(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var r = this.nativeEvent;
    r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = en);
  }, stopPropagation: function() {
    var r = this.nativeEvent;
    r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = en);
  }, persist: function() {
  }, isPersistent: en }), t;
}
var er = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, jl = he(er), Hr = j({}, er, { view: 0, detail: 0 }), pc = he(Hr), mo, ho, ur, $n = j({}, Hr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Al, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== ur && (ur && e.type === "mousemove" ? (mo = e.screenX - ur.screenX, ho = e.screenY - ur.screenY) : ho = mo = 0, ur = e), mo);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : ho;
} }), Ti = he($n), fc = j({}, $n, { dataTransfer: 0 }), gc = he(fc), mc = j({}, Hr, { relatedTarget: 0 }), vo = he(mc), hc = j({}, er, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), vc = he(hc), wc = j({}, er, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), yc = he(wc), xc = j({}, er, { data: 0 }), Di = he(xc), kc = {
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
function bc(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Ec[e]) ? !!t[e] : !1;
}
function Al() {
  return bc;
}
var Cc = j({}, Hr, { key: function(e) {
  if (e.key) {
    var t = kc[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = fn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Al, charCode: function(e) {
  return e.type === "keypress" ? fn(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? fn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), zc = he(Cc), _c = j({}, $n, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Mi = he(_c), Fc = j({}, Hr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Al }), Nc = he(Fc), Pc = j({}, er, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Lc = he(Pc), Tc = j({}, $n, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Dc = he(Tc), Mc = [9, 13, 27, 32], Ul = Ue && "CompositionEvent" in window, wr = null;
Ue && "documentMode" in document && (wr = document.documentMode);
var Rc = Ue && "TextEvent" in window && !wr, iu = Ue && (!Ul || wr && 8 < wr && 11 >= wr), Ri = " ", Oi = !1;
function au(e, t) {
  switch (e) {
    case "keyup":
      return Mc.indexOf(t.keyCode) !== -1;
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
function uu(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Lt = !1;
function Oc(e, t) {
  switch (e) {
    case "compositionend":
      return uu(t);
    case "keypress":
      return t.which !== 32 ? null : (Oi = !0, Ri);
    case "textInput":
      return e = t.data, e === Ri && Oi ? null : e;
    default:
      return null;
  }
}
function Ic(e, t) {
  if (Lt) return e === "compositionend" || !Ul && au(e, t) ? (e = lu(), pn = Bl = Ze = null, Lt = !1, e) : null;
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
      return iu && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Bc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Ii(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Bc[e.type] : t === "textarea";
}
function su(e, t, r, n) {
  Aa(n), t = Fn(t, "onChange"), 0 < t.length && (r = new jl("onChange", "change", null, r, n), e.push({ event: r, listeners: t }));
}
var yr = null, Lr = null;
function jc(e) {
  xu(e, 0);
}
function Kn(e) {
  var t = Mt(e);
  if (Da(t)) return e;
}
function Ac(e, t) {
  if (e === "change") return t;
}
var cu = !1;
if (Ue) {
  var wo;
  if (Ue) {
    var yo = "oninput" in document;
    if (!yo) {
      var Bi = document.createElement("div");
      Bi.setAttribute("oninput", "return;"), yo = typeof Bi.oninput == "function";
    }
    wo = yo;
  } else wo = !1;
  cu = wo && (!document.documentMode || 9 < document.documentMode);
}
function ji() {
  yr && (yr.detachEvent("onpropertychange", du), Lr = yr = null);
}
function du(e) {
  if (e.propertyName === "value" && Kn(Lr)) {
    var t = [];
    su(t, Lr, e, Dl(e)), Qa(jc, t);
  }
}
function Uc(e, t, r) {
  e === "focusin" ? (ji(), yr = t, Lr = r, yr.attachEvent("onpropertychange", du)) : e === "focusout" && ji();
}
function Vc(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Kn(Lr);
}
function Hc(e, t) {
  if (e === "click") return Kn(t);
}
function Qc(e, t) {
  if (e === "input" || e === "change") return Kn(t);
}
function Wc(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Pe = typeof Object.is == "function" ? Object.is : Wc;
function Tr(e, t) {
  if (Pe(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var r = Object.keys(e), n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (n = 0; n < r.length; n++) {
    var o = r[n];
    if (!Ro.call(t, o) || !Pe(e[o], t[o])) return !1;
  }
  return !0;
}
function Ai(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Ui(e, t) {
  var r = Ai(e);
  e = 0;
  for (var n; r; ) {
    if (r.nodeType === 3) {
      if (n = e + r.textContent.length, e <= t && n >= t) return { node: r, offset: t - e };
      e = n;
    }
    e: {
      for (; r; ) {
        if (r.nextSibling) {
          r = r.nextSibling;
          break e;
        }
        r = r.parentNode;
      }
      r = void 0;
    }
    r = Ai(r);
  }
}
function pu(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? pu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function fu() {
  for (var e = window, t = kn(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var r = typeof t.contentWindow.location.href == "string";
    } catch {
      r = !1;
    }
    if (r) e = t.contentWindow;
    else break;
    t = kn(e.document);
  }
  return t;
}
function Vl(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function $c(e) {
  var t = fu(), r = e.focusedElem, n = e.selectionRange;
  if (t !== r && r && r.ownerDocument && pu(r.ownerDocument.documentElement, r)) {
    if (n !== null && Vl(r)) {
      if (t = n.start, e = n.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
      else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var o = r.textContent.length, l = Math.min(n.start, o);
        n = n.end === void 0 ? l : Math.min(n.end, o), !e.extend && l > n && (o = n, n = l, l = o), o = Ui(r, l);
        var i = Ui(
          r,
          n
        );
        o && i && (e.rangeCount !== 1 || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), e.removeAllRanges(), l > n ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)));
      }
    }
    for (t = [], e = r; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Kc = Ue && "documentMode" in document && 11 >= document.documentMode, Tt = null, el = null, xr = null, tl = !1;
function Vi(e, t, r) {
  var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
  tl || Tt == null || Tt !== kn(n) || (n = Tt, "selectionStart" in n && Vl(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), xr && Tr(xr, n) || (xr = n, n = Fn(el, "onSelect"), 0 < n.length && (t = new jl("onSelect", "select", null, t, r), e.push({ event: t, listeners: n }), t.target = Tt)));
}
function tn(e, t) {
  var r = {};
  return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
}
var Dt = { animationend: tn("Animation", "AnimationEnd"), animationiteration: tn("Animation", "AnimationIteration"), animationstart: tn("Animation", "AnimationStart"), transitionend: tn("Transition", "TransitionEnd") }, xo = {}, gu = {};
Ue && (gu = document.createElement("div").style, "AnimationEvent" in window || (delete Dt.animationend.animation, delete Dt.animationiteration.animation, delete Dt.animationstart.animation), "TransitionEvent" in window || delete Dt.transitionend.transition);
function Yn(e) {
  if (xo[e]) return xo[e];
  if (!Dt[e]) return e;
  var t = Dt[e], r;
  for (r in t) if (t.hasOwnProperty(r) && r in gu) return xo[e] = t[r];
  return e;
}
var mu = Yn("animationend"), hu = Yn("animationiteration"), vu = Yn("animationstart"), wu = Yn("transitionend"), yu = /* @__PURE__ */ new Map(), Hi = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function st(e, t) {
  yu.set(e, t), zt(t, [e]);
}
for (var ko = 0; ko < Hi.length; ko++) {
  var So = Hi[ko], Yc = So.toLowerCase(), Xc = So[0].toUpperCase() + So.slice(1);
  st(Yc, "on" + Xc);
}
st(mu, "onAnimationEnd");
st(hu, "onAnimationIteration");
st(vu, "onAnimationStart");
st("dblclick", "onDoubleClick");
st("focusin", "onFocus");
st("focusout", "onBlur");
st(wu, "onTransitionEnd");
Kt("onMouseEnter", ["mouseout", "mouseover"]);
Kt("onMouseLeave", ["mouseout", "mouseover"]);
Kt("onPointerEnter", ["pointerout", "pointerover"]);
Kt("onPointerLeave", ["pointerout", "pointerover"]);
zt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
zt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
zt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
zt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
zt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
zt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var mr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Gc = new Set("cancel close invalid load scroll toggle".split(" ").concat(mr));
function Qi(e, t, r) {
  var n = e.type || "unknown-event";
  e.currentTarget = r, Ys(n, t, void 0, e), e.currentTarget = null;
}
function xu(e, t) {
  t = (t & 4) !== 0;
  for (var r = 0; r < e.length; r++) {
    var n = e[r], o = n.event;
    n = n.listeners;
    e: {
      var l = void 0;
      if (t) for (var i = n.length - 1; 0 <= i; i--) {
        var a = n[i], u = a.instance, p = a.currentTarget;
        if (a = a.listener, u !== l && o.isPropagationStopped()) break e;
        Qi(o, a, p), l = u;
      }
      else for (i = 0; i < n.length; i++) {
        if (a = n[i], u = a.instance, p = a.currentTarget, a = a.listener, u !== l && o.isPropagationStopped()) break e;
        Qi(o, a, p), l = u;
      }
    }
  }
  if (En) throw e = Go, En = !1, Go = null, e;
}
function D(e, t) {
  var r = t[il];
  r === void 0 && (r = t[il] = /* @__PURE__ */ new Set());
  var n = e + "__bubble";
  r.has(n) || (ku(t, e, 2, !1), r.add(n));
}
function Eo(e, t, r) {
  var n = 0;
  t && (n |= 4), ku(r, e, n, t);
}
var rn = "_reactListening" + Math.random().toString(36).slice(2);
function Dr(e) {
  if (!e[rn]) {
    e[rn] = !0, Fa.forEach(function(r) {
      r !== "selectionchange" && (Gc.has(r) || Eo(r, !1, e), Eo(r, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[rn] || (t[rn] = !0, Eo("selectionchange", !1, t));
  }
}
function ku(e, t, r, n) {
  switch (ou(t)) {
    case 1:
      var o = cc;
      break;
    case 4:
      o = dc;
      break;
    default:
      o = Il;
  }
  r = o.bind(null, t, r, e), o = void 0, !Xo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), n ? o !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: o }) : e.addEventListener(t, r, !0) : o !== void 0 ? e.addEventListener(t, r, { passive: o }) : e.addEventListener(t, r, !1);
}
function bo(e, t, r, n, o) {
  var l = n;
  if (!(t & 1) && !(t & 2) && n !== null) e: for (; ; ) {
    if (n === null) return;
    var i = n.tag;
    if (i === 3 || i === 4) {
      var a = n.stateNode.containerInfo;
      if (a === o || a.nodeType === 8 && a.parentNode === o) break;
      if (i === 4) for (i = n.return; i !== null; ) {
        var u = i.tag;
        if ((u === 3 || u === 4) && (u = i.stateNode.containerInfo, u === o || u.nodeType === 8 && u.parentNode === o)) return;
        i = i.return;
      }
      for (; a !== null; ) {
        if (i = ht(a), i === null) return;
        if (u = i.tag, u === 5 || u === 6) {
          n = l = i;
          continue e;
        }
        a = a.parentNode;
      }
    }
    n = n.return;
  }
  Qa(function() {
    var p = l, m = Dl(r), g = [];
    e: {
      var f = yu.get(e);
      if (f !== void 0) {
        var w = jl, y = e;
        switch (e) {
          case "keypress":
            if (fn(r) === 0) break e;
          case "keydown":
          case "keyup":
            w = zc;
            break;
          case "focusin":
            y = "focus", w = vo;
            break;
          case "focusout":
            y = "blur", w = vo;
            break;
          case "beforeblur":
          case "afterblur":
            w = vo;
            break;
          case "click":
            if (r.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = Ti;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = gc;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = Nc;
            break;
          case mu:
          case hu:
          case vu:
            w = vc;
            break;
          case wu:
            w = Lc;
            break;
          case "scroll":
            w = pc;
            break;
          case "wheel":
            w = Dc;
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
            w = Mi;
        }
        var x = (t & 4) !== 0, R = !x && e === "scroll", c = x ? f !== null ? f + "Capture" : null : f;
        x = [];
        for (var s = p, d; s !== null; ) {
          d = s;
          var h = d.stateNode;
          if (d.tag === 5 && h !== null && (d = h, c !== null && (h = _r(s, c), h != null && x.push(Mr(s, h, d)))), R) break;
          s = s.return;
        }
        0 < x.length && (f = new w(f, y, null, r, m), g.push({ event: f, listeners: x }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (f = e === "mouseover" || e === "pointerover", w = e === "mouseout" || e === "pointerout", f && r !== Ko && (y = r.relatedTarget || r.fromElement) && (ht(y) || y[Ve])) break e;
        if ((w || f) && (f = m.window === m ? m : (f = m.ownerDocument) ? f.defaultView || f.parentWindow : window, w ? (y = r.relatedTarget || r.toElement, w = p, y = y ? ht(y) : null, y !== null && (R = _t(y), y !== R || y.tag !== 5 && y.tag !== 6) && (y = null)) : (w = null, y = p), w !== y)) {
          if (x = Ti, h = "onMouseLeave", c = "onMouseEnter", s = "mouse", (e === "pointerout" || e === "pointerover") && (x = Mi, h = "onPointerLeave", c = "onPointerEnter", s = "pointer"), R = w == null ? f : Mt(w), d = y == null ? f : Mt(y), f = new x(h, s + "leave", w, r, m), f.target = R, f.relatedTarget = d, h = null, ht(m) === p && (x = new x(c, s + "enter", y, r, m), x.target = d, x.relatedTarget = R, h = x), R = h, w && y) t: {
            for (x = w, c = y, s = 0, d = x; d; d = Ft(d)) s++;
            for (d = 0, h = c; h; h = Ft(h)) d++;
            for (; 0 < s - d; ) x = Ft(x), s--;
            for (; 0 < d - s; ) c = Ft(c), d--;
            for (; s--; ) {
              if (x === c || c !== null && x === c.alternate) break t;
              x = Ft(x), c = Ft(c);
            }
            x = null;
          }
          else x = null;
          w !== null && Wi(g, f, w, x, !1), y !== null && R !== null && Wi(g, R, y, x, !0);
        }
      }
      e: {
        if (f = p ? Mt(p) : window, w = f.nodeName && f.nodeName.toLowerCase(), w === "select" || w === "input" && f.type === "file") var S = Ac;
        else if (Ii(f)) if (cu) S = Qc;
        else {
          S = Vc;
          var b = Uc;
        }
        else (w = f.nodeName) && w.toLowerCase() === "input" && (f.type === "checkbox" || f.type === "radio") && (S = Hc);
        if (S && (S = S(e, p))) {
          su(g, S, r, m);
          break e;
        }
        b && b(e, f, p), e === "focusout" && (b = f._wrapperState) && b.controlled && f.type === "number" && Vo(f, "number", f.value);
      }
      switch (b = p ? Mt(p) : window, e) {
        case "focusin":
          (Ii(b) || b.contentEditable === "true") && (Tt = b, el = p, xr = null);
          break;
        case "focusout":
          xr = el = Tt = null;
          break;
        case "mousedown":
          tl = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          tl = !1, Vi(g, r, m);
          break;
        case "selectionchange":
          if (Kc) break;
        case "keydown":
        case "keyup":
          Vi(g, r, m);
      }
      var C;
      if (Ul) e: {
        switch (e) {
          case "compositionstart":
            var z = "onCompositionStart";
            break e;
          case "compositionend":
            z = "onCompositionEnd";
            break e;
          case "compositionupdate":
            z = "onCompositionUpdate";
            break e;
        }
        z = void 0;
      }
      else Lt ? au(e, r) && (z = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (z = "onCompositionStart");
      z && (iu && r.locale !== "ko" && (Lt || z !== "onCompositionStart" ? z === "onCompositionEnd" && Lt && (C = lu()) : (Ze = m, Bl = "value" in Ze ? Ze.value : Ze.textContent, Lt = !0)), b = Fn(p, z), 0 < b.length && (z = new Di(z, e, null, r, m), g.push({ event: z, listeners: b }), C ? z.data = C : (C = uu(r), C !== null && (z.data = C)))), (C = Rc ? Oc(e, r) : Ic(e, r)) && (p = Fn(p, "onBeforeInput"), 0 < p.length && (m = new Di("onBeforeInput", "beforeinput", null, r, m), g.push({ event: m, listeners: p }), m.data = C));
    }
    xu(g, t);
  });
}
function Mr(e, t, r) {
  return { instance: e, listener: t, currentTarget: r };
}
function Fn(e, t) {
  for (var r = t + "Capture", n = []; e !== null; ) {
    var o = e, l = o.stateNode;
    o.tag === 5 && l !== null && (o = l, l = _r(e, r), l != null && n.unshift(Mr(e, l, o)), l = _r(e, t), l != null && n.push(Mr(e, l, o))), e = e.return;
  }
  return n;
}
function Ft(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Wi(e, t, r, n, o) {
  for (var l = t._reactName, i = []; r !== null && r !== n; ) {
    var a = r, u = a.alternate, p = a.stateNode;
    if (u !== null && u === n) break;
    a.tag === 5 && p !== null && (a = p, o ? (u = _r(r, l), u != null && i.unshift(Mr(r, u, a))) : o || (u = _r(r, l), u != null && i.push(Mr(r, u, a)))), r = r.return;
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
var Zc = /\r\n?/g, Jc = /\u0000|\uFFFD/g;
function $i(e) {
  return (typeof e == "string" ? e : "" + e).replace(Zc, `
`).replace(Jc, "");
}
function nn(e, t, r) {
  if (t = $i(t), $i(e) !== t && r) throw Error(v(425));
}
function Nn() {
}
var rl = null, nl = null;
function ol(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var ll = typeof setTimeout == "function" ? setTimeout : void 0, qc = typeof clearTimeout == "function" ? clearTimeout : void 0, Ki = typeof Promise == "function" ? Promise : void 0, ed = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ki < "u" ? function(e) {
  return Ki.resolve(null).then(e).catch(td);
} : ll;
function td(e) {
  setTimeout(function() {
    throw e;
  });
}
function Co(e, t) {
  var r = t, n = 0;
  do {
    var o = r.nextSibling;
    if (e.removeChild(r), o && o.nodeType === 8) if (r = o.data, r === "/$") {
      if (n === 0) {
        e.removeChild(o), Pr(t);
        return;
      }
      n--;
    } else r !== "$" && r !== "$?" && r !== "$!" || n++;
    r = o;
  } while (r);
  Pr(t);
}
function rt(e) {
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
function Yi(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var r = e.data;
      if (r === "$" || r === "$!" || r === "$?") {
        if (t === 0) return e;
        t--;
      } else r === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var tr = Math.random().toString(36).slice(2), De = "__reactFiber$" + tr, Rr = "__reactProps$" + tr, Ve = "__reactContainer$" + tr, il = "__reactEvents$" + tr, rd = "__reactListeners$" + tr, nd = "__reactHandles$" + tr;
function ht(e) {
  var t = e[De];
  if (t) return t;
  for (var r = e.parentNode; r; ) {
    if (t = r[Ve] || r[De]) {
      if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Yi(e); e !== null; ) {
        if (r = e[De]) return r;
        e = Yi(e);
      }
      return t;
    }
    e = r, r = e.parentNode;
  }
  return null;
}
function Qr(e) {
  return e = e[De] || e[Ve], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Mt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(v(33));
}
function Xn(e) {
  return e[Rr] || null;
}
var al = [], Rt = -1;
function ct(e) {
  return { current: e };
}
function M(e) {
  0 > Rt || (e.current = al[Rt], al[Rt] = null, Rt--);
}
function T(e, t) {
  Rt++, al[Rt] = e.current, e.current = t;
}
var ut = {}, re = ct(ut), ue = ct(!1), kt = ut;
function Yt(e, t) {
  var r = e.type.contextTypes;
  if (!r) return ut;
  var n = e.stateNode;
  if (n && n.__reactInternalMemoizedUnmaskedChildContext === t) return n.__reactInternalMemoizedMaskedChildContext;
  var o = {}, l;
  for (l in r) o[l] = t[l];
  return n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o;
}
function se(e) {
  return e = e.childContextTypes, e != null;
}
function Pn() {
  M(ue), M(re);
}
function Xi(e, t, r) {
  if (re.current !== ut) throw Error(v(168));
  T(re, t), T(ue, r);
}
function Su(e, t, r) {
  var n = e.stateNode;
  if (t = t.childContextTypes, typeof n.getChildContext != "function") return r;
  n = n.getChildContext();
  for (var o in n) if (!(o in t)) throw Error(v(108, Us(e) || "Unknown", o));
  return j({}, r, n);
}
function Ln(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || ut, kt = re.current, T(re, e), T(ue, ue.current), !0;
}
function Gi(e, t, r) {
  var n = e.stateNode;
  if (!n) throw Error(v(169));
  r ? (e = Su(e, t, kt), n.__reactInternalMemoizedMergedChildContext = e, M(ue), M(re), T(re, e)) : M(ue), T(ue, r);
}
var Ie = null, Gn = !1, zo = !1;
function Eu(e) {
  Ie === null ? Ie = [e] : Ie.push(e);
}
function od(e) {
  Gn = !0, Eu(e);
}
function dt() {
  if (!zo && Ie !== null) {
    zo = !0;
    var e = 0, t = L;
    try {
      var r = Ie;
      for (L = 1; e < r.length; e++) {
        var n = r[e];
        do
          n = n(!0);
        while (n !== null);
      }
      Ie = null, Gn = !1;
    } catch (o) {
      throw Ie !== null && (Ie = Ie.slice(e + 1)), Ya(Ml, dt), o;
    } finally {
      L = t, zo = !1;
    }
  }
  return null;
}
var Ot = [], It = 0, Tn = null, Dn = 0, ve = [], we = 0, St = null, Be = 1, je = "";
function gt(e, t) {
  Ot[It++] = Dn, Ot[It++] = Tn, Tn = e, Dn = t;
}
function bu(e, t, r) {
  ve[we++] = Be, ve[we++] = je, ve[we++] = St, St = e;
  var n = Be;
  e = je;
  var o = 32 - Fe(n) - 1;
  n &= ~(1 << o), r += 1;
  var l = 32 - Fe(t) + o;
  if (30 < l) {
    var i = o - o % 5;
    l = (n & (1 << i) - 1).toString(32), n >>= i, o -= i, Be = 1 << 32 - Fe(t) + o | r << o | n, je = l + e;
  } else Be = 1 << l | r << o | n, je = e;
}
function Hl(e) {
  e.return !== null && (gt(e, 1), bu(e, 1, 0));
}
function Ql(e) {
  for (; e === Tn; ) Tn = Ot[--It], Ot[It] = null, Dn = Ot[--It], Ot[It] = null;
  for (; e === St; ) St = ve[--we], ve[we] = null, je = ve[--we], ve[we] = null, Be = ve[--we], ve[we] = null;
}
var fe = null, pe = null, O = !1, _e = null;
function Cu(e, t) {
  var r = ye(5, null, null, 0);
  r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
}
function Zi(e, t) {
  switch (e.tag) {
    case 5:
      var r = e.type;
      return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, fe = e, pe = rt(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, fe = e, pe = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (r = St !== null ? { id: Be, overflow: je } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = ye(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, fe = e, pe = null, !0) : !1;
    default:
      return !1;
  }
}
function ul(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function sl(e) {
  if (O) {
    var t = pe;
    if (t) {
      var r = t;
      if (!Zi(e, t)) {
        if (ul(e)) throw Error(v(418));
        t = rt(r.nextSibling);
        var n = fe;
        t && Zi(e, t) ? Cu(n, r) : (e.flags = e.flags & -4097 | 2, O = !1, fe = e);
      }
    } else {
      if (ul(e)) throw Error(v(418));
      e.flags = e.flags & -4097 | 2, O = !1, fe = e;
    }
  }
}
function Ji(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  fe = e;
}
function on(e) {
  if (e !== fe) return !1;
  if (!O) return Ji(e), O = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ol(e.type, e.memoizedProps)), t && (t = pe)) {
    if (ul(e)) throw zu(), Error(v(418));
    for (; t; ) Cu(e, t), t = rt(t.nextSibling);
  }
  if (Ji(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(v(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "/$") {
            if (t === 0) {
              pe = rt(e.nextSibling);
              break e;
            }
            t--;
          } else r !== "$" && r !== "$!" && r !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      pe = null;
    }
  } else pe = fe ? rt(e.stateNode.nextSibling) : null;
  return !0;
}
function zu() {
  for (var e = pe; e; ) e = rt(e.nextSibling);
}
function Xt() {
  pe = fe = null, O = !1;
}
function Wl(e) {
  _e === null ? _e = [e] : _e.push(e);
}
var ld = We.ReactCurrentBatchConfig;
function sr(e, t, r) {
  if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (r._owner) {
      if (r = r._owner, r) {
        if (r.tag !== 1) throw Error(v(309));
        var n = r.stateNode;
      }
      if (!n) throw Error(v(147, e));
      var o = n, l = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === l ? t.ref : (t = function(i) {
        var a = o.refs;
        i === null ? delete a[l] : a[l] = i;
      }, t._stringRef = l, t);
    }
    if (typeof e != "string") throw Error(v(284));
    if (!r._owner) throw Error(v(290, e));
  }
  return e;
}
function ln(e, t) {
  throw e = Object.prototype.toString.call(t), Error(v(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function qi(e) {
  var t = e._init;
  return t(e._payload);
}
function _u(e) {
  function t(c, s) {
    if (e) {
      var d = c.deletions;
      d === null ? (c.deletions = [s], c.flags |= 16) : d.push(s);
    }
  }
  function r(c, s) {
    if (!e) return null;
    for (; s !== null; ) t(c, s), s = s.sibling;
    return null;
  }
  function n(c, s) {
    for (c = /* @__PURE__ */ new Map(); s !== null; ) s.key !== null ? c.set(s.key, s) : c.set(s.index, s), s = s.sibling;
    return c;
  }
  function o(c, s) {
    return c = it(c, s), c.index = 0, c.sibling = null, c;
  }
  function l(c, s, d) {
    return c.index = d, e ? (d = c.alternate, d !== null ? (d = d.index, d < s ? (c.flags |= 2, s) : d) : (c.flags |= 2, s)) : (c.flags |= 1048576, s);
  }
  function i(c) {
    return e && c.alternate === null && (c.flags |= 2), c;
  }
  function a(c, s, d, h) {
    return s === null || s.tag !== 6 ? (s = Do(d, c.mode, h), s.return = c, s) : (s = o(s, d), s.return = c, s);
  }
  function u(c, s, d, h) {
    var S = d.type;
    return S === Pt ? m(c, s, d.props.children, h, d.key) : s !== null && (s.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Ke && qi(S) === s.type) ? (h = o(s, d.props), h.ref = sr(c, s, d), h.return = c, h) : (h = xn(d.type, d.key, d.props, null, c.mode, h), h.ref = sr(c, s, d), h.return = c, h);
  }
  function p(c, s, d, h) {
    return s === null || s.tag !== 4 || s.stateNode.containerInfo !== d.containerInfo || s.stateNode.implementation !== d.implementation ? (s = Mo(d, c.mode, h), s.return = c, s) : (s = o(s, d.children || []), s.return = c, s);
  }
  function m(c, s, d, h, S) {
    return s === null || s.tag !== 7 ? (s = xt(d, c.mode, h, S), s.return = c, s) : (s = o(s, d), s.return = c, s);
  }
  function g(c, s, d) {
    if (typeof s == "string" && s !== "" || typeof s == "number") return s = Do("" + s, c.mode, d), s.return = c, s;
    if (typeof s == "object" && s !== null) {
      switch (s.$$typeof) {
        case Yr:
          return d = xn(s.type, s.key, s.props, null, c.mode, d), d.ref = sr(c, null, s), d.return = c, d;
        case Nt:
          return s = Mo(s, c.mode, d), s.return = c, s;
        case Ke:
          var h = s._init;
          return g(c, h(s._payload), d);
      }
      if (fr(s) || or(s)) return s = xt(s, c.mode, d, null), s.return = c, s;
      ln(c, s);
    }
    return null;
  }
  function f(c, s, d, h) {
    var S = s !== null ? s.key : null;
    if (typeof d == "string" && d !== "" || typeof d == "number") return S !== null ? null : a(c, s, "" + d, h);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Yr:
          return d.key === S ? u(c, s, d, h) : null;
        case Nt:
          return d.key === S ? p(c, s, d, h) : null;
        case Ke:
          return S = d._init, f(
            c,
            s,
            S(d._payload),
            h
          );
      }
      if (fr(d) || or(d)) return S !== null ? null : m(c, s, d, h, null);
      ln(c, d);
    }
    return null;
  }
  function w(c, s, d, h, S) {
    if (typeof h == "string" && h !== "" || typeof h == "number") return c = c.get(d) || null, a(s, c, "" + h, S);
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Yr:
          return c = c.get(h.key === null ? d : h.key) || null, u(s, c, h, S);
        case Nt:
          return c = c.get(h.key === null ? d : h.key) || null, p(s, c, h, S);
        case Ke:
          var b = h._init;
          return w(c, s, d, b(h._payload), S);
      }
      if (fr(h) || or(h)) return c = c.get(d) || null, m(s, c, h, S, null);
      ln(s, h);
    }
    return null;
  }
  function y(c, s, d, h) {
    for (var S = null, b = null, C = s, z = s = 0, U = null; C !== null && z < d.length; z++) {
      C.index > z ? (U = C, C = null) : U = C.sibling;
      var N = f(c, C, d[z], h);
      if (N === null) {
        C === null && (C = U);
        break;
      }
      e && C && N.alternate === null && t(c, C), s = l(N, s, z), b === null ? S = N : b.sibling = N, b = N, C = U;
    }
    if (z === d.length) return r(c, C), O && gt(c, z), S;
    if (C === null) {
      for (; z < d.length; z++) C = g(c, d[z], h), C !== null && (s = l(C, s, z), b === null ? S = C : b.sibling = C, b = C);
      return O && gt(c, z), S;
    }
    for (C = n(c, C); z < d.length; z++) U = w(C, c, z, d[z], h), U !== null && (e && U.alternate !== null && C.delete(U.key === null ? z : U.key), s = l(U, s, z), b === null ? S = U : b.sibling = U, b = U);
    return e && C.forEach(function(Ee) {
      return t(c, Ee);
    }), O && gt(c, z), S;
  }
  function x(c, s, d, h) {
    var S = or(d);
    if (typeof S != "function") throw Error(v(150));
    if (d = S.call(d), d == null) throw Error(v(151));
    for (var b = S = null, C = s, z = s = 0, U = null, N = d.next(); C !== null && !N.done; z++, N = d.next()) {
      C.index > z ? (U = C, C = null) : U = C.sibling;
      var Ee = f(c, C, N.value, h);
      if (Ee === null) {
        C === null && (C = U);
        break;
      }
      e && C && Ee.alternate === null && t(c, C), s = l(Ee, s, z), b === null ? S = Ee : b.sibling = Ee, b = Ee, C = U;
    }
    if (N.done) return r(
      c,
      C
    ), O && gt(c, z), S;
    if (C === null) {
      for (; !N.done; z++, N = d.next()) N = g(c, N.value, h), N !== null && (s = l(N, s, z), b === null ? S = N : b.sibling = N, b = N);
      return O && gt(c, z), S;
    }
    for (C = n(c, C); !N.done; z++, N = d.next()) N = w(C, c, z, N.value, h), N !== null && (e && N.alternate !== null && C.delete(N.key === null ? z : N.key), s = l(N, s, z), b === null ? S = N : b.sibling = N, b = N);
    return e && C.forEach(function(rr) {
      return t(c, rr);
    }), O && gt(c, z), S;
  }
  function R(c, s, d, h) {
    if (typeof d == "object" && d !== null && d.type === Pt && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Yr:
          e: {
            for (var S = d.key, b = s; b !== null; ) {
              if (b.key === S) {
                if (S = d.type, S === Pt) {
                  if (b.tag === 7) {
                    r(c, b.sibling), s = o(b, d.props.children), s.return = c, c = s;
                    break e;
                  }
                } else if (b.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Ke && qi(S) === b.type) {
                  r(c, b.sibling), s = o(b, d.props), s.ref = sr(c, b, d), s.return = c, c = s;
                  break e;
                }
                r(c, b);
                break;
              } else t(c, b);
              b = b.sibling;
            }
            d.type === Pt ? (s = xt(d.props.children, c.mode, h, d.key), s.return = c, c = s) : (h = xn(d.type, d.key, d.props, null, c.mode, h), h.ref = sr(c, s, d), h.return = c, c = h);
          }
          return i(c);
        case Nt:
          e: {
            for (b = d.key; s !== null; ) {
              if (s.key === b) if (s.tag === 4 && s.stateNode.containerInfo === d.containerInfo && s.stateNode.implementation === d.implementation) {
                r(c, s.sibling), s = o(s, d.children || []), s.return = c, c = s;
                break e;
              } else {
                r(c, s);
                break;
              }
              else t(c, s);
              s = s.sibling;
            }
            s = Mo(d, c.mode, h), s.return = c, c = s;
          }
          return i(c);
        case Ke:
          return b = d._init, R(c, s, b(d._payload), h);
      }
      if (fr(d)) return y(c, s, d, h);
      if (or(d)) return x(c, s, d, h);
      ln(c, d);
    }
    return typeof d == "string" && d !== "" || typeof d == "number" ? (d = "" + d, s !== null && s.tag === 6 ? (r(c, s.sibling), s = o(s, d), s.return = c, c = s) : (r(c, s), s = Do(d, c.mode, h), s.return = c, c = s), i(c)) : r(c, s);
  }
  return R;
}
var Gt = _u(!0), Fu = _u(!1), Mn = ct(null), Rn = null, Bt = null, $l = null;
function Kl() {
  $l = Bt = Rn = null;
}
function Yl(e) {
  var t = Mn.current;
  M(Mn), e._currentValue = t;
}
function cl(e, t, r) {
  for (; e !== null; ) {
    var n = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === r) break;
    e = e.return;
  }
}
function Wt(e, t) {
  Rn = e, $l = Bt = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (ae = !0), e.firstContext = null);
}
function ke(e) {
  var t = e._currentValue;
  if ($l !== e) if (e = { context: e, memoizedValue: t, next: null }, Bt === null) {
    if (Rn === null) throw Error(v(308));
    Bt = e, Rn.dependencies = { lanes: 0, firstContext: e };
  } else Bt = Bt.next = e;
  return t;
}
var vt = null;
function Xl(e) {
  vt === null ? vt = [e] : vt.push(e);
}
function Nu(e, t, r, n) {
  var o = t.interleaved;
  return o === null ? (r.next = r, Xl(t)) : (r.next = o.next, o.next = r), t.interleaved = r, He(e, n);
}
function He(e, t) {
  e.lanes |= t;
  var r = e.alternate;
  for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
  return r.tag === 3 ? r.stateNode : null;
}
var Ye = !1;
function Gl(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function Pu(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Ae(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function nt(e, t, r) {
  var n = e.updateQueue;
  if (n === null) return null;
  if (n = n.shared, P & 2) {
    var o = n.pending;
    return o === null ? t.next = t : (t.next = o.next, o.next = t), n.pending = t, He(e, r);
  }
  return o = n.interleaved, o === null ? (t.next = t, Xl(n)) : (t.next = o.next, o.next = t), n.interleaved = t, He(e, r);
}
function gn(e, t, r) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
    var n = t.lanes;
    n &= e.pendingLanes, r |= n, t.lanes = r, Rl(e, r);
  }
}
function ea(e, t) {
  var r = e.updateQueue, n = e.alternate;
  if (n !== null && (n = n.updateQueue, r === n)) {
    var o = null, l = null;
    if (r = r.firstBaseUpdate, r !== null) {
      do {
        var i = { eventTime: r.eventTime, lane: r.lane, tag: r.tag, payload: r.payload, callback: r.callback, next: null };
        l === null ? o = l = i : l = l.next = i, r = r.next;
      } while (r !== null);
      l === null ? o = l = t : l = l.next = t;
    } else o = l = t;
    r = { baseState: n.baseState, firstBaseUpdate: o, lastBaseUpdate: l, shared: n.shared, effects: n.effects }, e.updateQueue = r;
    return;
  }
  e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
}
function On(e, t, r, n) {
  var o = e.updateQueue;
  Ye = !1;
  var l = o.firstBaseUpdate, i = o.lastBaseUpdate, a = o.shared.pending;
  if (a !== null) {
    o.shared.pending = null;
    var u = a, p = u.next;
    u.next = null, i === null ? l = p : i.next = p, i = u;
    var m = e.alternate;
    m !== null && (m = m.updateQueue, a = m.lastBaseUpdate, a !== i && (a === null ? m.firstBaseUpdate = p : a.next = p, m.lastBaseUpdate = u));
  }
  if (l !== null) {
    var g = o.baseState;
    i = 0, m = p = u = null, a = l;
    do {
      var f = a.lane, w = a.eventTime;
      if ((n & f) === f) {
        m !== null && (m = m.next = {
          eventTime: w,
          lane: 0,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null
        });
        e: {
          var y = e, x = a;
          switch (f = t, w = r, x.tag) {
            case 1:
              if (y = x.payload, typeof y == "function") {
                g = y.call(w, g, f);
                break e;
              }
              g = y;
              break e;
            case 3:
              y.flags = y.flags & -65537 | 128;
            case 0:
              if (y = x.payload, f = typeof y == "function" ? y.call(w, g, f) : y, f == null) break e;
              g = j({}, g, f);
              break e;
            case 2:
              Ye = !0;
          }
        }
        a.callback !== null && a.lane !== 0 && (e.flags |= 64, f = o.effects, f === null ? o.effects = [a] : f.push(a));
      } else w = { eventTime: w, lane: f, tag: a.tag, payload: a.payload, callback: a.callback, next: null }, m === null ? (p = m = w, u = g) : m = m.next = w, i |= f;
      if (a = a.next, a === null) {
        if (a = o.shared.pending, a === null) break;
        f = a, a = f.next, f.next = null, o.lastBaseUpdate = f, o.shared.pending = null;
      }
    } while (!0);
    if (m === null && (u = g), o.baseState = u, o.firstBaseUpdate = p, o.lastBaseUpdate = m, t = o.shared.interleaved, t !== null) {
      o = t;
      do
        i |= o.lane, o = o.next;
      while (o !== t);
    } else l === null && (o.shared.lanes = 0);
    bt |= i, e.lanes = i, e.memoizedState = g;
  }
}
function ta(e, t, r) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var n = e[t], o = n.callback;
    if (o !== null) {
      if (n.callback = null, n = r, typeof o != "function") throw Error(v(191, o));
      o.call(n);
    }
  }
}
var Wr = {}, Re = ct(Wr), Or = ct(Wr), Ir = ct(Wr);
function wt(e) {
  if (e === Wr) throw Error(v(174));
  return e;
}
function Zl(e, t) {
  switch (T(Ir, t), T(Or, e), T(Re, Wr), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Qo(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Qo(t, e);
  }
  M(Re), T(Re, t);
}
function Zt() {
  M(Re), M(Or), M(Ir);
}
function Lu(e) {
  wt(Ir.current);
  var t = wt(Re.current), r = Qo(t, e.type);
  t !== r && (T(Or, e), T(Re, r));
}
function Jl(e) {
  Or.current === e && (M(Re), M(Or));
}
var I = ct(0);
function In(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var r = t.memoizedState;
      if (r !== null && (r = r.dehydrated, r === null || r.data === "$?" || r.data === "$!")) return t;
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
var _o = [];
function ql() {
  for (var e = 0; e < _o.length; e++) _o[e]._workInProgressVersionPrimary = null;
  _o.length = 0;
}
var mn = We.ReactCurrentDispatcher, Fo = We.ReactCurrentBatchConfig, Et = 0, B = null, W = null, Y = null, Bn = !1, kr = !1, Br = 0, id = 0;
function q() {
  throw Error(v(321));
}
function ei(e, t) {
  if (t === null) return !1;
  for (var r = 0; r < t.length && r < e.length; r++) if (!Pe(e[r], t[r])) return !1;
  return !0;
}
function ti(e, t, r, n, o, l) {
  if (Et = l, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, mn.current = e === null || e.memoizedState === null ? cd : dd, e = r(n, o), kr) {
    l = 0;
    do {
      if (kr = !1, Br = 0, 25 <= l) throw Error(v(301));
      l += 1, Y = W = null, t.updateQueue = null, mn.current = pd, e = r(n, o);
    } while (kr);
  }
  if (mn.current = jn, t = W !== null && W.next !== null, Et = 0, Y = W = B = null, Bn = !1, t) throw Error(v(300));
  return e;
}
function ri() {
  var e = Br !== 0;
  return Br = 0, e;
}
function Te() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return Y === null ? B.memoizedState = Y = e : Y = Y.next = e, Y;
}
function Se() {
  if (W === null) {
    var e = B.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = W.next;
  var t = Y === null ? B.memoizedState : Y.next;
  if (t !== null) Y = t, W = e;
  else {
    if (e === null) throw Error(v(310));
    W = e, e = { memoizedState: W.memoizedState, baseState: W.baseState, baseQueue: W.baseQueue, queue: W.queue, next: null }, Y === null ? B.memoizedState = Y = e : Y = Y.next = e;
  }
  return Y;
}
function jr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function No(e) {
  var t = Se(), r = t.queue;
  if (r === null) throw Error(v(311));
  r.lastRenderedReducer = e;
  var n = W, o = n.baseQueue, l = r.pending;
  if (l !== null) {
    if (o !== null) {
      var i = o.next;
      o.next = l.next, l.next = i;
    }
    n.baseQueue = o = l, r.pending = null;
  }
  if (o !== null) {
    l = o.next, n = n.baseState;
    var a = i = null, u = null, p = l;
    do {
      var m = p.lane;
      if ((Et & m) === m) u !== null && (u = u.next = { lane: 0, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null }), n = p.hasEagerState ? p.eagerState : e(n, p.action);
      else {
        var g = {
          lane: m,
          action: p.action,
          hasEagerState: p.hasEagerState,
          eagerState: p.eagerState,
          next: null
        };
        u === null ? (a = u = g, i = n) : u = u.next = g, B.lanes |= m, bt |= m;
      }
      p = p.next;
    } while (p !== null && p !== l);
    u === null ? i = n : u.next = a, Pe(n, t.memoizedState) || (ae = !0), t.memoizedState = n, t.baseState = i, t.baseQueue = u, r.lastRenderedState = n;
  }
  if (e = r.interleaved, e !== null) {
    o = e;
    do
      l = o.lane, B.lanes |= l, bt |= l, o = o.next;
    while (o !== e);
  } else o === null && (r.lanes = 0);
  return [t.memoizedState, r.dispatch];
}
function Po(e) {
  var t = Se(), r = t.queue;
  if (r === null) throw Error(v(311));
  r.lastRenderedReducer = e;
  var n = r.dispatch, o = r.pending, l = t.memoizedState;
  if (o !== null) {
    r.pending = null;
    var i = o = o.next;
    do
      l = e(l, i.action), i = i.next;
    while (i !== o);
    Pe(l, t.memoizedState) || (ae = !0), t.memoizedState = l, t.baseQueue === null && (t.baseState = l), r.lastRenderedState = l;
  }
  return [l, n];
}
function Tu() {
}
function Du(e, t) {
  var r = B, n = Se(), o = t(), l = !Pe(n.memoizedState, o);
  if (l && (n.memoizedState = o, ae = !0), n = n.queue, ni(Ou.bind(null, r, n, e), [e]), n.getSnapshot !== t || l || Y !== null && Y.memoizedState.tag & 1) {
    if (r.flags |= 2048, Ar(9, Ru.bind(null, r, n, o, t), void 0, null), X === null) throw Error(v(349));
    Et & 30 || Mu(r, t, o);
  }
  return o;
}
function Mu(e, t, r) {
  e.flags |= 16384, e = { getSnapshot: t, value: r }, t = B.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, B.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
}
function Ru(e, t, r, n) {
  t.value = r, t.getSnapshot = n, Iu(t) && Bu(e);
}
function Ou(e, t, r) {
  return r(function() {
    Iu(t) && Bu(e);
  });
}
function Iu(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var r = t();
    return !Pe(e, r);
  } catch {
    return !0;
  }
}
function Bu(e) {
  var t = He(e, 1);
  t !== null && Ne(t, e, 1, -1);
}
function ra(e) {
  var t = Te();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: jr, lastRenderedState: e }, t.queue = e, e = e.dispatch = sd.bind(null, B, e), [t.memoizedState, e];
}
function Ar(e, t, r, n) {
  return e = { tag: e, create: t, destroy: r, deps: n, next: null }, t = B.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, B.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (n = r.next, r.next = e, e.next = n, t.lastEffect = e)), e;
}
function ju() {
  return Se().memoizedState;
}
function hn(e, t, r, n) {
  var o = Te();
  B.flags |= e, o.memoizedState = Ar(1 | t, r, void 0, n === void 0 ? null : n);
}
function Zn(e, t, r, n) {
  var o = Se();
  n = n === void 0 ? null : n;
  var l = void 0;
  if (W !== null) {
    var i = W.memoizedState;
    if (l = i.destroy, n !== null && ei(n, i.deps)) {
      o.memoizedState = Ar(t, r, l, n);
      return;
    }
  }
  B.flags |= e, o.memoizedState = Ar(1 | t, r, l, n);
}
function na(e, t) {
  return hn(8390656, 8, e, t);
}
function ni(e, t) {
  return Zn(2048, 8, e, t);
}
function Au(e, t) {
  return Zn(4, 2, e, t);
}
function Uu(e, t) {
  return Zn(4, 4, e, t);
}
function Vu(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function Hu(e, t, r) {
  return r = r != null ? r.concat([e]) : null, Zn(4, 4, Vu.bind(null, t, e), r);
}
function oi() {
}
function Qu(e, t) {
  var r = Se();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && ei(t, n[1]) ? n[0] : (r.memoizedState = [e, t], e);
}
function Wu(e, t) {
  var r = Se();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && ei(t, n[1]) ? n[0] : (e = e(), r.memoizedState = [e, t], e);
}
function $u(e, t, r) {
  return Et & 21 ? (Pe(r, t) || (r = Za(), B.lanes |= r, bt |= r, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, ae = !0), e.memoizedState = r);
}
function ad(e, t) {
  var r = L;
  L = r !== 0 && 4 > r ? r : 4, e(!0);
  var n = Fo.transition;
  Fo.transition = {};
  try {
    e(!1), t();
  } finally {
    L = r, Fo.transition = n;
  }
}
function Ku() {
  return Se().memoizedState;
}
function ud(e, t, r) {
  var n = lt(e);
  if (r = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null }, Yu(e)) Xu(t, r);
  else if (r = Nu(e, t, r, n), r !== null) {
    var o = oe();
    Ne(r, e, n, o), Gu(r, t, n);
  }
}
function sd(e, t, r) {
  var n = lt(e), o = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
  if (Yu(e)) Xu(t, o);
  else {
    var l = e.alternate;
    if (e.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer, l !== null)) try {
      var i = t.lastRenderedState, a = l(i, r);
      if (o.hasEagerState = !0, o.eagerState = a, Pe(a, i)) {
        var u = t.interleaved;
        u === null ? (o.next = o, Xl(t)) : (o.next = u.next, u.next = o), t.interleaved = o;
        return;
      }
    } catch {
    } finally {
    }
    r = Nu(e, t, o, n), r !== null && (o = oe(), Ne(r, e, n, o), Gu(r, t, n));
  }
}
function Yu(e) {
  var t = e.alternate;
  return e === B || t !== null && t === B;
}
function Xu(e, t) {
  kr = Bn = !0;
  var r = e.pending;
  r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
}
function Gu(e, t, r) {
  if (r & 4194240) {
    var n = t.lanes;
    n &= e.pendingLanes, r |= n, t.lanes = r, Rl(e, r);
  }
}
var jn = { readContext: ke, useCallback: q, useContext: q, useEffect: q, useImperativeHandle: q, useInsertionEffect: q, useLayoutEffect: q, useMemo: q, useReducer: q, useRef: q, useState: q, useDebugValue: q, useDeferredValue: q, useTransition: q, useMutableSource: q, useSyncExternalStore: q, useId: q, unstable_isNewReconciler: !1 }, cd = { readContext: ke, useCallback: function(e, t) {
  return Te().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: ke, useEffect: na, useImperativeHandle: function(e, t, r) {
  return r = r != null ? r.concat([e]) : null, hn(
    4194308,
    4,
    Vu.bind(null, t, e),
    r
  );
}, useLayoutEffect: function(e, t) {
  return hn(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return hn(4, 2, e, t);
}, useMemo: function(e, t) {
  var r = Te();
  return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
}, useReducer: function(e, t, r) {
  var n = Te();
  return t = r !== void 0 ? r(t) : t, n.memoizedState = n.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, n.queue = e, e = e.dispatch = ud.bind(null, B, e), [n.memoizedState, e];
}, useRef: function(e) {
  var t = Te();
  return e = { current: e }, t.memoizedState = e;
}, useState: ra, useDebugValue: oi, useDeferredValue: function(e) {
  return Te().memoizedState = e;
}, useTransition: function() {
  var e = ra(!1), t = e[0];
  return e = ad.bind(null, e[1]), Te().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, r) {
  var n = B, o = Te();
  if (O) {
    if (r === void 0) throw Error(v(407));
    r = r();
  } else {
    if (r = t(), X === null) throw Error(v(349));
    Et & 30 || Mu(n, t, r);
  }
  o.memoizedState = r;
  var l = { value: r, getSnapshot: t };
  return o.queue = l, na(Ou.bind(
    null,
    n,
    l,
    e
  ), [e]), n.flags |= 2048, Ar(9, Ru.bind(null, n, l, r, t), void 0, null), r;
}, useId: function() {
  var e = Te(), t = X.identifierPrefix;
  if (O) {
    var r = je, n = Be;
    r = (n & ~(1 << 32 - Fe(n) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Br++, 0 < r && (t += "H" + r.toString(32)), t += ":";
  } else r = id++, t = ":" + t + "r" + r.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, dd = {
  readContext: ke,
  useCallback: Qu,
  useContext: ke,
  useEffect: ni,
  useImperativeHandle: Hu,
  useInsertionEffect: Au,
  useLayoutEffect: Uu,
  useMemo: Wu,
  useReducer: No,
  useRef: ju,
  useState: function() {
    return No(jr);
  },
  useDebugValue: oi,
  useDeferredValue: function(e) {
    var t = Se();
    return $u(t, W.memoizedState, e);
  },
  useTransition: function() {
    var e = No(jr)[0], t = Se().memoizedState;
    return [e, t];
  },
  useMutableSource: Tu,
  useSyncExternalStore: Du,
  useId: Ku,
  unstable_isNewReconciler: !1
}, pd = { readContext: ke, useCallback: Qu, useContext: ke, useEffect: ni, useImperativeHandle: Hu, useInsertionEffect: Au, useLayoutEffect: Uu, useMemo: Wu, useReducer: Po, useRef: ju, useState: function() {
  return Po(jr);
}, useDebugValue: oi, useDeferredValue: function(e) {
  var t = Se();
  return W === null ? t.memoizedState = e : $u(t, W.memoizedState, e);
}, useTransition: function() {
  var e = Po(jr)[0], t = Se().memoizedState;
  return [e, t];
}, useMutableSource: Tu, useSyncExternalStore: Du, useId: Ku, unstable_isNewReconciler: !1 };
function Ce(e, t) {
  if (e && e.defaultProps) {
    t = j({}, t), e = e.defaultProps;
    for (var r in e) t[r] === void 0 && (t[r] = e[r]);
    return t;
  }
  return t;
}
function dl(e, t, r, n) {
  t = e.memoizedState, r = r(n, t), r = r == null ? t : j({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
}
var Jn = { isMounted: function(e) {
  return (e = e._reactInternals) ? _t(e) === e : !1;
}, enqueueSetState: function(e, t, r) {
  e = e._reactInternals;
  var n = oe(), o = lt(e), l = Ae(n, o);
  l.payload = t, r != null && (l.callback = r), t = nt(e, l, o), t !== null && (Ne(t, e, o, n), gn(t, e, o));
}, enqueueReplaceState: function(e, t, r) {
  e = e._reactInternals;
  var n = oe(), o = lt(e), l = Ae(n, o);
  l.tag = 1, l.payload = t, r != null && (l.callback = r), t = nt(e, l, o), t !== null && (Ne(t, e, o, n), gn(t, e, o));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var r = oe(), n = lt(e), o = Ae(r, n);
  o.tag = 2, t != null && (o.callback = t), t = nt(e, o, n), t !== null && (Ne(t, e, n, r), gn(t, e, n));
} };
function oa(e, t, r, n, o, l, i) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, l, i) : t.prototype && t.prototype.isPureReactComponent ? !Tr(r, n) || !Tr(o, l) : !0;
}
function Zu(e, t, r) {
  var n = !1, o = ut, l = t.contextType;
  return typeof l == "object" && l !== null ? l = ke(l) : (o = se(t) ? kt : re.current, n = t.contextTypes, l = (n = n != null) ? Yt(e, o) : ut), t = new t(r, l), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Jn, e.stateNode = t, t._reactInternals = e, n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = l), t;
}
function la(e, t, r, n) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, n), t.state !== e && Jn.enqueueReplaceState(t, t.state, null);
}
function pl(e, t, r, n) {
  var o = e.stateNode;
  o.props = r, o.state = e.memoizedState, o.refs = {}, Gl(e);
  var l = t.contextType;
  typeof l == "object" && l !== null ? o.context = ke(l) : (l = se(t) ? kt : re.current, o.context = Yt(e, l)), o.state = e.memoizedState, l = t.getDerivedStateFromProps, typeof l == "function" && (dl(e, t, l, r), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && Jn.enqueueReplaceState(o, o.state, null), On(e, r, o, n), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308);
}
function Jt(e, t) {
  try {
    var r = "", n = t;
    do
      r += As(n), n = n.return;
    while (n);
    var o = r;
  } catch (l) {
    o = `
Error generating stack: ` + l.message + `
` + l.stack;
  }
  return { value: e, source: t, stack: o, digest: null };
}
function Lo(e, t, r) {
  return { value: e, source: null, stack: r ?? null, digest: t ?? null };
}
function fl(e, t) {
  try {
    console.error(t.value);
  } catch (r) {
    setTimeout(function() {
      throw r;
    });
  }
}
var fd = typeof WeakMap == "function" ? WeakMap : Map;
function Ju(e, t, r) {
  r = Ae(-1, r), r.tag = 3, r.payload = { element: null };
  var n = t.value;
  return r.callback = function() {
    Un || (Un = !0, El = n), fl(e, t);
  }, r;
}
function qu(e, t, r) {
  r = Ae(-1, r), r.tag = 3;
  var n = e.type.getDerivedStateFromError;
  if (typeof n == "function") {
    var o = t.value;
    r.payload = function() {
      return n(o);
    }, r.callback = function() {
      fl(e, t);
    };
  }
  var l = e.stateNode;
  return l !== null && typeof l.componentDidCatch == "function" && (r.callback = function() {
    fl(e, t), typeof n != "function" && (ot === null ? ot = /* @__PURE__ */ new Set([this]) : ot.add(this));
    var i = t.stack;
    this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
  }), r;
}
function ia(e, t, r) {
  var n = e.pingCache;
  if (n === null) {
    n = e.pingCache = new fd();
    var o = /* @__PURE__ */ new Set();
    n.set(t, o);
  } else o = n.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), n.set(t, o));
  o.has(r) || (o.add(r), e = _d.bind(null, e, t, r), t.then(e, e));
}
function aa(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function ua(e, t, r, n, o) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = o, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = Ae(-1, 1), t.tag = 2, nt(r, t, 1))), r.lanes |= 1), e);
}
var gd = We.ReactCurrentOwner, ae = !1;
function ne(e, t, r, n) {
  t.child = e === null ? Fu(t, null, r, n) : Gt(t, e.child, r, n);
}
function sa(e, t, r, n, o) {
  r = r.render;
  var l = t.ref;
  return Wt(t, o), n = ti(e, t, r, n, l, o), r = ri(), e !== null && !ae ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, Qe(e, t, o)) : (O && r && Hl(t), t.flags |= 1, ne(e, t, n, o), t.child);
}
function ca(e, t, r, n, o) {
  if (e === null) {
    var l = r.type;
    return typeof l == "function" && !pi(l) && l.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = l, es(e, t, l, n, o)) : (e = xn(r.type, null, n, t, t.mode, o), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (l = e.child, !(e.lanes & o)) {
    var i = l.memoizedProps;
    if (r = r.compare, r = r !== null ? r : Tr, r(i, n) && e.ref === t.ref) return Qe(e, t, o);
  }
  return t.flags |= 1, e = it(l, n), e.ref = t.ref, e.return = t, t.child = e;
}
function es(e, t, r, n, o) {
  if (e !== null) {
    var l = e.memoizedProps;
    if (Tr(l, n) && e.ref === t.ref) if (ae = !1, t.pendingProps = n = l, (e.lanes & o) !== 0) e.flags & 131072 && (ae = !0);
    else return t.lanes = e.lanes, Qe(e, t, o);
  }
  return gl(e, t, r, n, o);
}
function ts(e, t, r) {
  var n = t.pendingProps, o = n.children, l = e !== null ? e.memoizedState : null;
  if (n.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, T(At, de), de |= r;
  else {
    if (!(r & 1073741824)) return e = l !== null ? l.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, T(At, de), de |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, n = l !== null ? l.baseLanes : r, T(At, de), de |= n;
  }
  else l !== null ? (n = l.baseLanes | r, t.memoizedState = null) : n = r, T(At, de), de |= n;
  return ne(e, t, o, r), t.child;
}
function rs(e, t) {
  var r = t.ref;
  (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
}
function gl(e, t, r, n, o) {
  var l = se(r) ? kt : re.current;
  return l = Yt(t, l), Wt(t, o), r = ti(e, t, r, n, l, o), n = ri(), e !== null && !ae ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, Qe(e, t, o)) : (O && n && Hl(t), t.flags |= 1, ne(e, t, r, o), t.child);
}
function da(e, t, r, n, o) {
  if (se(r)) {
    var l = !0;
    Ln(t);
  } else l = !1;
  if (Wt(t, o), t.stateNode === null) vn(e, t), Zu(t, r, n), pl(t, r, n, o), n = !0;
  else if (e === null) {
    var i = t.stateNode, a = t.memoizedProps;
    i.props = a;
    var u = i.context, p = r.contextType;
    typeof p == "object" && p !== null ? p = ke(p) : (p = se(r) ? kt : re.current, p = Yt(t, p));
    var m = r.getDerivedStateFromProps, g = typeof m == "function" || typeof i.getSnapshotBeforeUpdate == "function";
    g || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== n || u !== p) && la(t, i, n, p), Ye = !1;
    var f = t.memoizedState;
    i.state = f, On(t, n, i, o), u = t.memoizedState, a !== n || f !== u || ue.current || Ye ? (typeof m == "function" && (dl(t, r, m, n), u = t.memoizedState), (a = Ye || oa(t, r, a, n, f, u, p)) ? (g || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = u), i.props = n, i.state = u, i.context = p, n = a) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
  } else {
    i = t.stateNode, Pu(e, t), a = t.memoizedProps, p = t.type === t.elementType ? a : Ce(t.type, a), i.props = p, g = t.pendingProps, f = i.context, u = r.contextType, typeof u == "object" && u !== null ? u = ke(u) : (u = se(r) ? kt : re.current, u = Yt(t, u));
    var w = r.getDerivedStateFromProps;
    (m = typeof w == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== g || f !== u) && la(t, i, n, u), Ye = !1, f = t.memoizedState, i.state = f, On(t, n, i, o);
    var y = t.memoizedState;
    a !== g || f !== y || ue.current || Ye ? (typeof w == "function" && (dl(t, r, w, n), y = t.memoizedState), (p = Ye || oa(t, r, p, n, f, y, u) || !1) ? (m || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(n, y, u), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(n, y, u)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = y), i.props = n, i.state = y, i.context = u, n = p) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), n = !1);
  }
  return ml(e, t, r, n, l, o);
}
function ml(e, t, r, n, o, l) {
  rs(e, t);
  var i = (t.flags & 128) !== 0;
  if (!n && !i) return o && Gi(t, r, !1), Qe(e, t, l);
  n = t.stateNode, gd.current = t;
  var a = i && typeof r.getDerivedStateFromError != "function" ? null : n.render();
  return t.flags |= 1, e !== null && i ? (t.child = Gt(t, e.child, null, l), t.child = Gt(t, null, a, l)) : ne(e, t, a, l), t.memoizedState = n.state, o && Gi(t, r, !0), t.child;
}
function ns(e) {
  var t = e.stateNode;
  t.pendingContext ? Xi(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Xi(e, t.context, !1), Zl(e, t.containerInfo);
}
function pa(e, t, r, n, o) {
  return Xt(), Wl(o), t.flags |= 256, ne(e, t, r, n), t.child;
}
var hl = { dehydrated: null, treeContext: null, retryLane: 0 };
function vl(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function os(e, t, r) {
  var n = t.pendingProps, o = I.current, l = !1, i = (t.flags & 128) !== 0, a;
  if ((a = i) || (a = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), a ? (l = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (o |= 1), T(I, o & 1), e === null)
    return sl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (i = n.children, e = n.fallback, l ? (n = t.mode, l = t.child, i = { mode: "hidden", children: i }, !(n & 1) && l !== null ? (l.childLanes = 0, l.pendingProps = i) : l = to(i, n, 0, null), e = xt(e, n, r, null), l.return = t, e.return = t, l.sibling = e, t.child = l, t.child.memoizedState = vl(r), t.memoizedState = hl, e) : li(t, i));
  if (o = e.memoizedState, o !== null && (a = o.dehydrated, a !== null)) return md(e, t, i, n, a, o, r);
  if (l) {
    l = n.fallback, i = t.mode, o = e.child, a = o.sibling;
    var u = { mode: "hidden", children: n.children };
    return !(i & 1) && t.child !== o ? (n = t.child, n.childLanes = 0, n.pendingProps = u, t.deletions = null) : (n = it(o, u), n.subtreeFlags = o.subtreeFlags & 14680064), a !== null ? l = it(a, l) : (l = xt(l, i, r, null), l.flags |= 2), l.return = t, n.return = t, n.sibling = l, t.child = n, n = l, l = t.child, i = e.child.memoizedState, i = i === null ? vl(r) : { baseLanes: i.baseLanes | r, cachePool: null, transitions: i.transitions }, l.memoizedState = i, l.childLanes = e.childLanes & ~r, t.memoizedState = hl, n;
  }
  return l = e.child, e = l.sibling, n = it(l, { mode: "visible", children: n.children }), !(t.mode & 1) && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n;
}
function li(e, t) {
  return t = to({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function an(e, t, r, n) {
  return n !== null && Wl(n), Gt(t, e.child, null, r), e = li(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function md(e, t, r, n, o, l, i) {
  if (r)
    return t.flags & 256 ? (t.flags &= -257, n = Lo(Error(v(422))), an(e, t, i, n)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (l = n.fallback, o = t.mode, n = to({ mode: "visible", children: n.children }, o, 0, null), l = xt(l, o, i, null), l.flags |= 2, n.return = t, l.return = t, n.sibling = l, t.child = n, t.mode & 1 && Gt(t, e.child, null, i), t.child.memoizedState = vl(i), t.memoizedState = hl, l);
  if (!(t.mode & 1)) return an(e, t, i, null);
  if (o.data === "$!") {
    if (n = o.nextSibling && o.nextSibling.dataset, n) var a = n.dgst;
    return n = a, l = Error(v(419)), n = Lo(l, n, void 0), an(e, t, i, n);
  }
  if (a = (i & e.childLanes) !== 0, ae || a) {
    if (n = X, n !== null) {
      switch (i & -i) {
        case 4:
          o = 2;
          break;
        case 16:
          o = 8;
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
          o = 32;
          break;
        case 536870912:
          o = 268435456;
          break;
        default:
          o = 0;
      }
      o = o & (n.suspendedLanes | i) ? 0 : o, o !== 0 && o !== l.retryLane && (l.retryLane = o, He(e, o), Ne(n, e, o, -1));
    }
    return di(), n = Lo(Error(v(421))), an(e, t, i, n);
  }
  return o.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Fd.bind(null, e), o._reactRetry = t, null) : (e = l.treeContext, pe = rt(o.nextSibling), fe = t, O = !0, _e = null, e !== null && (ve[we++] = Be, ve[we++] = je, ve[we++] = St, Be = e.id, je = e.overflow, St = t), t = li(t, n.children), t.flags |= 4096, t);
}
function fa(e, t, r) {
  e.lanes |= t;
  var n = e.alternate;
  n !== null && (n.lanes |= t), cl(e.return, t, r);
}
function To(e, t, r, n, o) {
  var l = e.memoizedState;
  l === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: n, tail: r, tailMode: o } : (l.isBackwards = t, l.rendering = null, l.renderingStartTime = 0, l.last = n, l.tail = r, l.tailMode = o);
}
function ls(e, t, r) {
  var n = t.pendingProps, o = n.revealOrder, l = n.tail;
  if (ne(e, t, n.children, r), n = I.current, n & 2) n = n & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && fa(e, r, t);
      else if (e.tag === 19) fa(e, r, t);
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
    n &= 1;
  }
  if (T(I, n), !(t.mode & 1)) t.memoizedState = null;
  else switch (o) {
    case "forwards":
      for (r = t.child, o = null; r !== null; ) e = r.alternate, e !== null && In(e) === null && (o = r), r = r.sibling;
      r = o, r === null ? (o = t.child, t.child = null) : (o = r.sibling, r.sibling = null), To(t, !1, o, r, l);
      break;
    case "backwards":
      for (r = null, o = t.child, t.child = null; o !== null; ) {
        if (e = o.alternate, e !== null && In(e) === null) {
          t.child = o;
          break;
        }
        e = o.sibling, o.sibling = r, r = o, o = e;
      }
      To(t, !0, r, null, l);
      break;
    case "together":
      To(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function vn(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function Qe(e, t, r) {
  if (e !== null && (t.dependencies = e.dependencies), bt |= t.lanes, !(r & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(v(153));
  if (t.child !== null) {
    for (e = t.child, r = it(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = it(e, e.pendingProps), r.return = t;
    r.sibling = null;
  }
  return t.child;
}
function hd(e, t, r) {
  switch (t.tag) {
    case 3:
      ns(t), Xt();
      break;
    case 5:
      Lu(t);
      break;
    case 1:
      se(t.type) && Ln(t);
      break;
    case 4:
      Zl(t, t.stateNode.containerInfo);
      break;
    case 10:
      var n = t.type._context, o = t.memoizedProps.value;
      T(Mn, n._currentValue), n._currentValue = o;
      break;
    case 13:
      if (n = t.memoizedState, n !== null)
        return n.dehydrated !== null ? (T(I, I.current & 1), t.flags |= 128, null) : r & t.child.childLanes ? os(e, t, r) : (T(I, I.current & 1), e = Qe(e, t, r), e !== null ? e.sibling : null);
      T(I, I.current & 1);
      break;
    case 19:
      if (n = (r & t.childLanes) !== 0, e.flags & 128) {
        if (n) return ls(e, t, r);
        t.flags |= 128;
      }
      if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), T(I, I.current), n) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, ts(e, t, r);
  }
  return Qe(e, t, r);
}
var is, wl, as, us;
is = function(e, t) {
  for (var r = t.child; r !== null; ) {
    if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode);
    else if (r.tag !== 4 && r.child !== null) {
      r.child.return = r, r = r.child;
      continue;
    }
    if (r === t) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === t) return;
      r = r.return;
    }
    r.sibling.return = r.return, r = r.sibling;
  }
};
wl = function() {
};
as = function(e, t, r, n) {
  var o = e.memoizedProps;
  if (o !== n) {
    e = t.stateNode, wt(Re.current);
    var l = null;
    switch (r) {
      case "input":
        o = Ao(e, o), n = Ao(e, n), l = [];
        break;
      case "select":
        o = j({}, o, { value: void 0 }), n = j({}, n, { value: void 0 }), l = [];
        break;
      case "textarea":
        o = Ho(e, o), n = Ho(e, n), l = [];
        break;
      default:
        typeof o.onClick != "function" && typeof n.onClick == "function" && (e.onclick = Nn);
    }
    Wo(r, n);
    var i;
    r = null;
    for (p in o) if (!n.hasOwnProperty(p) && o.hasOwnProperty(p) && o[p] != null) if (p === "style") {
      var a = o[p];
      for (i in a) a.hasOwnProperty(i) && (r || (r = {}), r[i] = "");
    } else p !== "dangerouslySetInnerHTML" && p !== "children" && p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (Cr.hasOwnProperty(p) ? l || (l = []) : (l = l || []).push(p, null));
    for (p in n) {
      var u = n[p];
      if (a = o != null ? o[p] : void 0, n.hasOwnProperty(p) && u !== a && (u != null || a != null)) if (p === "style") if (a) {
        for (i in a) !a.hasOwnProperty(i) || u && u.hasOwnProperty(i) || (r || (r = {}), r[i] = "");
        for (i in u) u.hasOwnProperty(i) && a[i] !== u[i] && (r || (r = {}), r[i] = u[i]);
      } else r || (l || (l = []), l.push(
        p,
        r
      )), r = u;
      else p === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, a = a ? a.__html : void 0, u != null && a !== u && (l = l || []).push(p, u)) : p === "children" ? typeof u != "string" && typeof u != "number" || (l = l || []).push(p, "" + u) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && (Cr.hasOwnProperty(p) ? (u != null && p === "onScroll" && D("scroll", e), l || a === u || (l = [])) : (l = l || []).push(p, u));
    }
    r && (l = l || []).push("style", r);
    var p = l;
    (t.updateQueue = p) && (t.flags |= 4);
  }
};
us = function(e, t, r, n) {
  r !== n && (t.flags |= 4);
};
function cr(e, t) {
  if (!O) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var r = null; t !== null; ) t.alternate !== null && (r = t), t = t.sibling;
      r === null ? e.tail = null : r.sibling = null;
      break;
    case "collapsed":
      r = e.tail;
      for (var n = null; r !== null; ) r.alternate !== null && (n = r), r = r.sibling;
      n === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : n.sibling = null;
  }
}
function ee(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, r = 0, n = 0;
  if (t) for (var o = e.child; o !== null; ) r |= o.lanes | o.childLanes, n |= o.subtreeFlags & 14680064, n |= o.flags & 14680064, o.return = e, o = o.sibling;
  else for (o = e.child; o !== null; ) r |= o.lanes | o.childLanes, n |= o.subtreeFlags, n |= o.flags, o.return = e, o = o.sibling;
  return e.subtreeFlags |= n, e.childLanes = r, t;
}
function vd(e, t, r) {
  var n = t.pendingProps;
  switch (Ql(t), t.tag) {
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
      return se(t.type) && Pn(), ee(t), null;
    case 3:
      return n = t.stateNode, Zt(), M(ue), M(re), ql(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (on(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, _e !== null && (zl(_e), _e = null))), wl(e, t), ee(t), null;
    case 5:
      Jl(t);
      var o = wt(Ir.current);
      if (r = t.type, e !== null && t.stateNode != null) as(e, t, r, n, o), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!n) {
          if (t.stateNode === null) throw Error(v(166));
          return ee(t), null;
        }
        if (e = wt(Re.current), on(t)) {
          n = t.stateNode, r = t.type;
          var l = t.memoizedProps;
          switch (n[De] = t, n[Rr] = l, e = (t.mode & 1) !== 0, r) {
            case "dialog":
              D("cancel", n), D("close", n);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", n);
              break;
            case "video":
            case "audio":
              for (o = 0; o < mr.length; o++) D(mr[o], n);
              break;
            case "source":
              D("error", n);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                n
              ), D("load", n);
              break;
            case "details":
              D("toggle", n);
              break;
            case "input":
              Si(n, l), D("invalid", n);
              break;
            case "select":
              n._wrapperState = { wasMultiple: !!l.multiple }, D("invalid", n);
              break;
            case "textarea":
              bi(n, l), D("invalid", n);
          }
          Wo(r, l), o = null;
          for (var i in l) if (l.hasOwnProperty(i)) {
            var a = l[i];
            i === "children" ? typeof a == "string" ? n.textContent !== a && (l.suppressHydrationWarning !== !0 && nn(n.textContent, a, e), o = ["children", a]) : typeof a == "number" && n.textContent !== "" + a && (l.suppressHydrationWarning !== !0 && nn(
              n.textContent,
              a,
              e
            ), o = ["children", "" + a]) : Cr.hasOwnProperty(i) && a != null && i === "onScroll" && D("scroll", n);
          }
          switch (r) {
            case "input":
              Xr(n), Ei(n, l, !0);
              break;
            case "textarea":
              Xr(n), Ci(n);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof l.onClick == "function" && (n.onclick = Nn);
          }
          n = o, t.updateQueue = n, n !== null && (t.flags |= 4);
        } else {
          i = o.nodeType === 9 ? o : o.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Oa(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof n.is == "string" ? e = i.createElement(r, { is: n.is }) : (e = i.createElement(r), r === "select" && (i = e, n.multiple ? i.multiple = !0 : n.size && (i.size = n.size))) : e = i.createElementNS(e, r), e[De] = t, e[Rr] = n, is(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (i = $o(r, n), r) {
              case "dialog":
                D("cancel", e), D("close", e), o = n;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", e), o = n;
                break;
              case "video":
              case "audio":
                for (o = 0; o < mr.length; o++) D(mr[o], e);
                o = n;
                break;
              case "source":
                D("error", e), o = n;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  e
                ), D("load", e), o = n;
                break;
              case "details":
                D("toggle", e), o = n;
                break;
              case "input":
                Si(e, n), o = Ao(e, n), D("invalid", e);
                break;
              case "option":
                o = n;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!n.multiple }, o = j({}, n, { value: void 0 }), D("invalid", e);
                break;
              case "textarea":
                bi(e, n), o = Ho(e, n), D("invalid", e);
                break;
              default:
                o = n;
            }
            Wo(r, o), a = o;
            for (l in a) if (a.hasOwnProperty(l)) {
              var u = a[l];
              l === "style" ? ja(e, u) : l === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, u != null && Ia(e, u)) : l === "children" ? typeof u == "string" ? (r !== "textarea" || u !== "") && zr(e, u) : typeof u == "number" && zr(e, "" + u) : l !== "suppressContentEditableWarning" && l !== "suppressHydrationWarning" && l !== "autoFocus" && (Cr.hasOwnProperty(l) ? u != null && l === "onScroll" && D("scroll", e) : u != null && Nl(e, l, u, i));
            }
            switch (r) {
              case "input":
                Xr(e), Ei(e, n, !1);
                break;
              case "textarea":
                Xr(e), Ci(e);
                break;
              case "option":
                n.value != null && e.setAttribute("value", "" + at(n.value));
                break;
              case "select":
                e.multiple = !!n.multiple, l = n.value, l != null ? Ut(e, !!n.multiple, l, !1) : n.defaultValue != null && Ut(
                  e,
                  !!n.multiple,
                  n.defaultValue,
                  !0
                );
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = Nn);
            }
            switch (r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                n = !!n.autoFocus;
                break e;
              case "img":
                n = !0;
                break e;
              default:
                n = !1;
            }
          }
          n && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return ee(t), null;
    case 6:
      if (e && t.stateNode != null) us(e, t, e.memoizedProps, n);
      else {
        if (typeof n != "string" && t.stateNode === null) throw Error(v(166));
        if (r = wt(Ir.current), wt(Re.current), on(t)) {
          if (n = t.stateNode, r = t.memoizedProps, n[De] = t, (l = n.nodeValue !== r) && (e = fe, e !== null)) switch (e.tag) {
            case 3:
              nn(n.nodeValue, r, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && nn(n.nodeValue, r, (e.mode & 1) !== 0);
          }
          l && (t.flags |= 4);
        } else n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n), n[De] = t, t.stateNode = n;
      }
      return ee(t), null;
    case 13:
      if (M(I), n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (O && pe !== null && t.mode & 1 && !(t.flags & 128)) zu(), Xt(), t.flags |= 98560, l = !1;
        else if (l = on(t), n !== null && n.dehydrated !== null) {
          if (e === null) {
            if (!l) throw Error(v(318));
            if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(v(317));
            l[De] = t;
          } else Xt(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          ee(t), l = !1;
        } else _e !== null && (zl(_e), _e = null), l = !0;
        if (!l) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = r, t) : (n = n !== null, n !== (e !== null && e.memoizedState !== null) && n && (t.child.flags |= 8192, t.mode & 1 && (e === null || I.current & 1 ? $ === 0 && ($ = 3) : di())), t.updateQueue !== null && (t.flags |= 4), ee(t), null);
    case 4:
      return Zt(), wl(e, t), e === null && Dr(t.stateNode.containerInfo), ee(t), null;
    case 10:
      return Yl(t.type._context), ee(t), null;
    case 17:
      return se(t.type) && Pn(), ee(t), null;
    case 19:
      if (M(I), l = t.memoizedState, l === null) return ee(t), null;
      if (n = (t.flags & 128) !== 0, i = l.rendering, i === null) if (n) cr(l, !1);
      else {
        if ($ !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (i = In(e), i !== null) {
            for (t.flags |= 128, cr(l, !1), n = i.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), t.subtreeFlags = 0, n = r, r = t.child; r !== null; ) l = r, e = n, l.flags &= 14680066, i = l.alternate, i === null ? (l.childLanes = 0, l.lanes = e, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = i.childLanes, l.lanes = i.lanes, l.child = i.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = i.memoizedProps, l.memoizedState = i.memoizedState, l.updateQueue = i.updateQueue, l.type = i.type, e = i.dependencies, l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
            return T(I, I.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        l.tail !== null && H() > qt && (t.flags |= 128, n = !0, cr(l, !1), t.lanes = 4194304);
      }
      else {
        if (!n) if (e = In(i), e !== null) {
          if (t.flags |= 128, n = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), cr(l, !0), l.tail === null && l.tailMode === "hidden" && !i.alternate && !O) return ee(t), null;
        } else 2 * H() - l.renderingStartTime > qt && r !== 1073741824 && (t.flags |= 128, n = !0, cr(l, !1), t.lanes = 4194304);
        l.isBackwards ? (i.sibling = t.child, t.child = i) : (r = l.last, r !== null ? r.sibling = i : t.child = i, l.last = i);
      }
      return l.tail !== null ? (t = l.tail, l.rendering = t, l.tail = t.sibling, l.renderingStartTime = H(), t.sibling = null, r = I.current, T(I, n ? r & 1 | 2 : r & 1), t) : (ee(t), null);
    case 22:
    case 23:
      return ci(), n = t.memoizedState !== null, e !== null && e.memoizedState !== null !== n && (t.flags |= 8192), n && t.mode & 1 ? de & 1073741824 && (ee(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ee(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(v(156, t.tag));
}
function wd(e, t) {
  switch (Ql(t), t.tag) {
    case 1:
      return se(t.type) && Pn(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return Zt(), M(ue), M(re), ql(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return Jl(t), null;
    case 13:
      if (M(I), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(v(340));
        Xt();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return M(I), null;
    case 4:
      return Zt(), null;
    case 10:
      return Yl(t.type._context), null;
    case 22:
    case 23:
      return ci(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var un = !1, te = !1, yd = typeof WeakSet == "function" ? WeakSet : Set, k = null;
function jt(e, t) {
  var r = e.ref;
  if (r !== null) if (typeof r == "function") try {
    r(null);
  } catch (n) {
    A(e, t, n);
  }
  else r.current = null;
}
function yl(e, t, r) {
  try {
    r();
  } catch (n) {
    A(e, t, n);
  }
}
var ga = !1;
function xd(e, t) {
  if (rl = zn, e = fu(), Vl(e)) {
    if ("selectionStart" in e) var r = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      r = (r = e.ownerDocument) && r.defaultView || window;
      var n = r.getSelection && r.getSelection();
      if (n && n.rangeCount !== 0) {
        r = n.anchorNode;
        var o = n.anchorOffset, l = n.focusNode;
        n = n.focusOffset;
        try {
          r.nodeType, l.nodeType;
        } catch {
          r = null;
          break e;
        }
        var i = 0, a = -1, u = -1, p = 0, m = 0, g = e, f = null;
        t: for (; ; ) {
          for (var w; g !== r || o !== 0 && g.nodeType !== 3 || (a = i + o), g !== l || n !== 0 && g.nodeType !== 3 || (u = i + n), g.nodeType === 3 && (i += g.nodeValue.length), (w = g.firstChild) !== null; )
            f = g, g = w;
          for (; ; ) {
            if (g === e) break t;
            if (f === r && ++p === o && (a = i), f === l && ++m === n && (u = i), (w = g.nextSibling) !== null) break;
            g = f, f = g.parentNode;
          }
          g = w;
        }
        r = a === -1 || u === -1 ? null : { start: a, end: u };
      } else r = null;
    }
    r = r || { start: 0, end: 0 };
  } else r = null;
  for (nl = { focusedElem: e, selectionRange: r }, zn = !1, k = t; k !== null; ) if (t = k, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, k = e;
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
            var x = y.memoizedProps, R = y.memoizedState, c = t.stateNode, s = c.getSnapshotBeforeUpdate(t.elementType === t.type ? x : Ce(t.type, x), R);
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
    } catch (h) {
      A(t, t.return, h);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, k = e;
      break;
    }
    k = t.return;
  }
  return y = ga, ga = !1, y;
}
function Sr(e, t, r) {
  var n = t.updateQueue;
  if (n = n !== null ? n.lastEffect : null, n !== null) {
    var o = n = n.next;
    do {
      if ((o.tag & e) === e) {
        var l = o.destroy;
        o.destroy = void 0, l !== void 0 && yl(t, r, l);
      }
      o = o.next;
    } while (o !== n);
  }
}
function qn(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var r = t = t.next;
    do {
      if ((r.tag & e) === e) {
        var n = r.create;
        r.destroy = n();
      }
      r = r.next;
    } while (r !== t);
  }
}
function xl(e) {
  var t = e.ref;
  if (t !== null) {
    var r = e.stateNode;
    switch (e.tag) {
      case 5:
        e = r;
        break;
      default:
        e = r;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function ss(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, ss(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[De], delete t[Rr], delete t[il], delete t[rd], delete t[nd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function cs(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function ma(e) {
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
function kl(e, t, r) {
  var n = e.tag;
  if (n === 5 || n === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = Nn));
  else if (n !== 4 && (e = e.child, e !== null)) for (kl(e, t, r), e = e.sibling; e !== null; ) kl(e, t, r), e = e.sibling;
}
function Sl(e, t, r) {
  var n = e.tag;
  if (n === 5 || n === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
  else if (n !== 4 && (e = e.child, e !== null)) for (Sl(e, t, r), e = e.sibling; e !== null; ) Sl(e, t, r), e = e.sibling;
}
var G = null, ze = !1;
function $e(e, t, r) {
  for (r = r.child; r !== null; ) ds(e, t, r), r = r.sibling;
}
function ds(e, t, r) {
  if (Me && typeof Me.onCommitFiberUnmount == "function") try {
    Me.onCommitFiberUnmount(Wn, r);
  } catch {
  }
  switch (r.tag) {
    case 5:
      te || jt(r, t);
    case 6:
      var n = G, o = ze;
      G = null, $e(e, t, r), G = n, ze = o, G !== null && (ze ? (e = G, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : G.removeChild(r.stateNode));
      break;
    case 18:
      G !== null && (ze ? (e = G, r = r.stateNode, e.nodeType === 8 ? Co(e.parentNode, r) : e.nodeType === 1 && Co(e, r), Pr(e)) : Co(G, r.stateNode));
      break;
    case 4:
      n = G, o = ze, G = r.stateNode.containerInfo, ze = !0, $e(e, t, r), G = n, ze = o;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!te && (n = r.updateQueue, n !== null && (n = n.lastEffect, n !== null))) {
        o = n = n.next;
        do {
          var l = o, i = l.destroy;
          l = l.tag, i !== void 0 && (l & 2 || l & 4) && yl(r, t, i), o = o.next;
        } while (o !== n);
      }
      $e(e, t, r);
      break;
    case 1:
      if (!te && (jt(r, t), n = r.stateNode, typeof n.componentWillUnmount == "function")) try {
        n.props = r.memoizedProps, n.state = r.memoizedState, n.componentWillUnmount();
      } catch (a) {
        A(r, t, a);
      }
      $e(e, t, r);
      break;
    case 21:
      $e(e, t, r);
      break;
    case 22:
      r.mode & 1 ? (te = (n = te) || r.memoizedState !== null, $e(e, t, r), te = n) : $e(e, t, r);
      break;
    default:
      $e(e, t, r);
  }
}
function ha(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var r = e.stateNode;
    r === null && (r = e.stateNode = new yd()), t.forEach(function(n) {
      var o = Nd.bind(null, e, n);
      r.has(n) || (r.add(n), n.then(o, o));
    });
  }
}
function be(e, t) {
  var r = t.deletions;
  if (r !== null) for (var n = 0; n < r.length; n++) {
    var o = r[n];
    try {
      var l = e, i = t, a = i;
      e: for (; a !== null; ) {
        switch (a.tag) {
          case 5:
            G = a.stateNode, ze = !1;
            break e;
          case 3:
            G = a.stateNode.containerInfo, ze = !0;
            break e;
          case 4:
            G = a.stateNode.containerInfo, ze = !0;
            break e;
        }
        a = a.return;
      }
      if (G === null) throw Error(v(160));
      ds(l, i, o), G = null, ze = !1;
      var u = o.alternate;
      u !== null && (u.return = null), o.return = null;
    } catch (p) {
      A(o, t, p);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) ps(t, e), t = t.sibling;
}
function ps(e, t) {
  var r = e.alternate, n = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (be(t, e), Le(e), n & 4) {
        try {
          Sr(3, e, e.return), qn(3, e);
        } catch (x) {
          A(e, e.return, x);
        }
        try {
          Sr(5, e, e.return);
        } catch (x) {
          A(e, e.return, x);
        }
      }
      break;
    case 1:
      be(t, e), Le(e), n & 512 && r !== null && jt(r, r.return);
      break;
    case 5:
      if (be(t, e), Le(e), n & 512 && r !== null && jt(r, r.return), e.flags & 32) {
        var o = e.stateNode;
        try {
          zr(o, "");
        } catch (x) {
          A(e, e.return, x);
        }
      }
      if (n & 4 && (o = e.stateNode, o != null)) {
        var l = e.memoizedProps, i = r !== null ? r.memoizedProps : l, a = e.type, u = e.updateQueue;
        if (e.updateQueue = null, u !== null) try {
          a === "input" && l.type === "radio" && l.name != null && Ma(o, l), $o(a, i);
          var p = $o(a, l);
          for (i = 0; i < u.length; i += 2) {
            var m = u[i], g = u[i + 1];
            m === "style" ? ja(o, g) : m === "dangerouslySetInnerHTML" ? Ia(o, g) : m === "children" ? zr(o, g) : Nl(o, m, g, p);
          }
          switch (a) {
            case "input":
              Uo(o, l);
              break;
            case "textarea":
              Ra(o, l);
              break;
            case "select":
              var f = o._wrapperState.wasMultiple;
              o._wrapperState.wasMultiple = !!l.multiple;
              var w = l.value;
              w != null ? Ut(o, !!l.multiple, w, !1) : f !== !!l.multiple && (l.defaultValue != null ? Ut(
                o,
                !!l.multiple,
                l.defaultValue,
                !0
              ) : Ut(o, !!l.multiple, l.multiple ? [] : "", !1));
          }
          o[Rr] = l;
        } catch (x) {
          A(e, e.return, x);
        }
      }
      break;
    case 6:
      if (be(t, e), Le(e), n & 4) {
        if (e.stateNode === null) throw Error(v(162));
        o = e.stateNode, l = e.memoizedProps;
        try {
          o.nodeValue = l;
        } catch (x) {
          A(e, e.return, x);
        }
      }
      break;
    case 3:
      if (be(t, e), Le(e), n & 4 && r !== null && r.memoizedState.isDehydrated) try {
        Pr(t.containerInfo);
      } catch (x) {
        A(e, e.return, x);
      }
      break;
    case 4:
      be(t, e), Le(e);
      break;
    case 13:
      be(t, e), Le(e), o = e.child, o.flags & 8192 && (l = o.memoizedState !== null, o.stateNode.isHidden = l, !l || o.alternate !== null && o.alternate.memoizedState !== null || (ui = H())), n & 4 && ha(e);
      break;
    case 22:
      if (m = r !== null && r.memoizedState !== null, e.mode & 1 ? (te = (p = te) || m, be(t, e), te = p) : be(t, e), Le(e), n & 8192) {
        if (p = e.memoizedState !== null, (e.stateNode.isHidden = p) && !m && e.mode & 1) for (k = e, m = e.child; m !== null; ) {
          for (g = k = m; k !== null; ) {
            switch (f = k, w = f.child, f.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Sr(4, f, f.return);
                break;
              case 1:
                jt(f, f.return);
                var y = f.stateNode;
                if (typeof y.componentWillUnmount == "function") {
                  n = f, r = f.return;
                  try {
                    t = n, y.props = t.memoizedProps, y.state = t.memoizedState, y.componentWillUnmount();
                  } catch (x) {
                    A(n, r, x);
                  }
                }
                break;
              case 5:
                jt(f, f.return);
                break;
              case 22:
                if (f.memoizedState !== null) {
                  wa(g);
                  continue;
                }
            }
            w !== null ? (w.return = f, k = w) : wa(g);
          }
          m = m.sibling;
        }
        e: for (m = null, g = e; ; ) {
          if (g.tag === 5) {
            if (m === null) {
              m = g;
              try {
                o = g.stateNode, p ? (l = o.style, typeof l.setProperty == "function" ? l.setProperty("display", "none", "important") : l.display = "none") : (a = g.stateNode, u = g.memoizedProps.style, i = u != null && u.hasOwnProperty("display") ? u.display : null, a.style.display = Ba("display", i));
              } catch (x) {
                A(e, e.return, x);
              }
            }
          } else if (g.tag === 6) {
            if (m === null) try {
              g.stateNode.nodeValue = p ? "" : g.memoizedProps;
            } catch (x) {
              A(e, e.return, x);
            }
          } else if ((g.tag !== 22 && g.tag !== 23 || g.memoizedState === null || g === e) && g.child !== null) {
            g.child.return = g, g = g.child;
            continue;
          }
          if (g === e) break e;
          for (; g.sibling === null; ) {
            if (g.return === null || g.return === e) break e;
            m === g && (m = null), g = g.return;
          }
          m === g && (m = null), g.sibling.return = g.return, g = g.sibling;
        }
      }
      break;
    case 19:
      be(t, e), Le(e), n & 4 && ha(e);
      break;
    case 21:
      break;
    default:
      be(
        t,
        e
      ), Le(e);
  }
}
function Le(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var r = e.return; r !== null; ) {
          if (cs(r)) {
            var n = r;
            break e;
          }
          r = r.return;
        }
        throw Error(v(160));
      }
      switch (n.tag) {
        case 5:
          var o = n.stateNode;
          n.flags & 32 && (zr(o, ""), n.flags &= -33);
          var l = ma(e);
          Sl(e, l, o);
          break;
        case 3:
        case 4:
          var i = n.stateNode.containerInfo, a = ma(e);
          kl(e, a, i);
          break;
        default:
          throw Error(v(161));
      }
    } catch (u) {
      A(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function kd(e, t, r) {
  k = e, fs(e);
}
function fs(e, t, r) {
  for (var n = (e.mode & 1) !== 0; k !== null; ) {
    var o = k, l = o.child;
    if (o.tag === 22 && n) {
      var i = o.memoizedState !== null || un;
      if (!i) {
        var a = o.alternate, u = a !== null && a.memoizedState !== null || te;
        a = un;
        var p = te;
        if (un = i, (te = u) && !p) for (k = o; k !== null; ) i = k, u = i.child, i.tag === 22 && i.memoizedState !== null ? ya(o) : u !== null ? (u.return = i, k = u) : ya(o);
        for (; l !== null; ) k = l, fs(l), l = l.sibling;
        k = o, un = a, te = p;
      }
      va(e);
    } else o.subtreeFlags & 8772 && l !== null ? (l.return = o, k = l) : va(e);
  }
}
function va(e) {
  for (; k !== null; ) {
    var t = k;
    if (t.flags & 8772) {
      var r = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            te || qn(5, t);
            break;
          case 1:
            var n = t.stateNode;
            if (t.flags & 4 && !te) if (r === null) n.componentDidMount();
            else {
              var o = t.elementType === t.type ? r.memoizedProps : Ce(t.type, r.memoizedProps);
              n.componentDidUpdate(o, r.memoizedState, n.__reactInternalSnapshotBeforeUpdate);
            }
            var l = t.updateQueue;
            l !== null && ta(t, l, n);
            break;
          case 3:
            var i = t.updateQueue;
            if (i !== null) {
              if (r = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  r = t.child.stateNode;
                  break;
                case 1:
                  r = t.child.stateNode;
              }
              ta(t, i, r);
            }
            break;
          case 5:
            var a = t.stateNode;
            if (r === null && t.flags & 4) {
              r = a;
              var u = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u.autoFocus && r.focus();
                  break;
                case "img":
                  u.src && (r.src = u.src);
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
              var p = t.alternate;
              if (p !== null) {
                var m = p.memoizedState;
                if (m !== null) {
                  var g = m.dehydrated;
                  g !== null && Pr(g);
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
        te || t.flags & 512 && xl(t);
      } catch (f) {
        A(t, t.return, f);
      }
    }
    if (t === e) {
      k = null;
      break;
    }
    if (r = t.sibling, r !== null) {
      r.return = t.return, k = r;
      break;
    }
    k = t.return;
  }
}
function wa(e) {
  for (; k !== null; ) {
    var t = k;
    if (t === e) {
      k = null;
      break;
    }
    var r = t.sibling;
    if (r !== null) {
      r.return = t.return, k = r;
      break;
    }
    k = t.return;
  }
}
function ya(e) {
  for (; k !== null; ) {
    var t = k;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var r = t.return;
          try {
            qn(4, t);
          } catch (u) {
            A(t, r, u);
          }
          break;
        case 1:
          var n = t.stateNode;
          if (typeof n.componentDidMount == "function") {
            var o = t.return;
            try {
              n.componentDidMount();
            } catch (u) {
              A(t, o, u);
            }
          }
          var l = t.return;
          try {
            xl(t);
          } catch (u) {
            A(t, l, u);
          }
          break;
        case 5:
          var i = t.return;
          try {
            xl(t);
          } catch (u) {
            A(t, i, u);
          }
      }
    } catch (u) {
      A(t, t.return, u);
    }
    if (t === e) {
      k = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      a.return = t.return, k = a;
      break;
    }
    k = t.return;
  }
}
var Sd = Math.ceil, An = We.ReactCurrentDispatcher, ii = We.ReactCurrentOwner, xe = We.ReactCurrentBatchConfig, P = 0, X = null, Q = null, Z = 0, de = 0, At = ct(0), $ = 0, Ur = null, bt = 0, eo = 0, ai = 0, Er = null, ie = null, ui = 0, qt = 1 / 0, Oe = null, Un = !1, El = null, ot = null, sn = !1, Je = null, Vn = 0, br = 0, bl = null, wn = -1, yn = 0;
function oe() {
  return P & 6 ? H() : wn !== -1 ? wn : wn = H();
}
function lt(e) {
  return e.mode & 1 ? P & 2 && Z !== 0 ? Z & -Z : ld.transition !== null ? (yn === 0 && (yn = Za()), yn) : (e = L, e !== 0 || (e = window.event, e = e === void 0 ? 16 : ou(e.type)), e) : 1;
}
function Ne(e, t, r, n) {
  if (50 < br) throw br = 0, bl = null, Error(v(185));
  Vr(e, r, n), (!(P & 2) || e !== X) && (e === X && (!(P & 2) && (eo |= r), $ === 4 && Ge(e, Z)), ce(e, n), r === 1 && P === 0 && !(t.mode & 1) && (qt = H() + 500, Gn && dt()));
}
function ce(e, t) {
  var r = e.callbackNode;
  lc(e, t);
  var n = Cn(e, e === X ? Z : 0);
  if (n === 0) r !== null && Fi(r), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = n & -n, e.callbackPriority !== t) {
    if (r != null && Fi(r), t === 1) e.tag === 0 ? od(xa.bind(null, e)) : Eu(xa.bind(null, e)), ed(function() {
      !(P & 6) && dt();
    }), r = null;
    else {
      switch (Ja(n)) {
        case 1:
          r = Ml;
          break;
        case 4:
          r = Xa;
          break;
        case 16:
          r = bn;
          break;
        case 536870912:
          r = Ga;
          break;
        default:
          r = bn;
      }
      r = ks(r, gs.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = r;
  }
}
function gs(e, t) {
  if (wn = -1, yn = 0, P & 6) throw Error(v(327));
  var r = e.callbackNode;
  if ($t() && e.callbackNode !== r) return null;
  var n = Cn(e, e === X ? Z : 0);
  if (n === 0) return null;
  if (n & 30 || n & e.expiredLanes || t) t = Hn(e, n);
  else {
    t = n;
    var o = P;
    P |= 2;
    var l = hs();
    (X !== e || Z !== t) && (Oe = null, qt = H() + 500, yt(e, t));
    do
      try {
        Cd();
        break;
      } catch (a) {
        ms(e, a);
      }
    while (!0);
    Kl(), An.current = l, P = o, Q !== null ? t = 0 : (X = null, Z = 0, t = $);
  }
  if (t !== 0) {
    if (t === 2 && (o = Zo(e), o !== 0 && (n = o, t = Cl(e, o))), t === 1) throw r = Ur, yt(e, 0), Ge(e, n), ce(e, H()), r;
    if (t === 6) Ge(e, n);
    else {
      if (o = e.current.alternate, !(n & 30) && !Ed(o) && (t = Hn(e, n), t === 2 && (l = Zo(e), l !== 0 && (n = l, t = Cl(e, l))), t === 1)) throw r = Ur, yt(e, 0), Ge(e, n), ce(e, H()), r;
      switch (e.finishedWork = o, e.finishedLanes = n, t) {
        case 0:
        case 1:
          throw Error(v(345));
        case 2:
          mt(e, ie, Oe);
          break;
        case 3:
          if (Ge(e, n), (n & 130023424) === n && (t = ui + 500 - H(), 10 < t)) {
            if (Cn(e, 0) !== 0) break;
            if (o = e.suspendedLanes, (o & n) !== n) {
              oe(), e.pingedLanes |= e.suspendedLanes & o;
              break;
            }
            e.timeoutHandle = ll(mt.bind(null, e, ie, Oe), t);
            break;
          }
          mt(e, ie, Oe);
          break;
        case 4:
          if (Ge(e, n), (n & 4194240) === n) break;
          for (t = e.eventTimes, o = -1; 0 < n; ) {
            var i = 31 - Fe(n);
            l = 1 << i, i = t[i], i > o && (o = i), n &= ~l;
          }
          if (n = o, n = H() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * Sd(n / 1960)) - n, 10 < n) {
            e.timeoutHandle = ll(mt.bind(null, e, ie, Oe), n);
            break;
          }
          mt(e, ie, Oe);
          break;
        case 5:
          mt(e, ie, Oe);
          break;
        default:
          throw Error(v(329));
      }
    }
  }
  return ce(e, H()), e.callbackNode === r ? gs.bind(null, e) : null;
}
function Cl(e, t) {
  var r = Er;
  return e.current.memoizedState.isDehydrated && (yt(e, t).flags |= 256), e = Hn(e, t), e !== 2 && (t = ie, ie = r, t !== null && zl(t)), e;
}
function zl(e) {
  ie === null ? ie = e : ie.push.apply(ie, e);
}
function Ed(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var r = t.updateQueue;
      if (r !== null && (r = r.stores, r !== null)) for (var n = 0; n < r.length; n++) {
        var o = r[n], l = o.getSnapshot;
        o = o.value;
        try {
          if (!Pe(l(), o)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (r = t.child, t.subtreeFlags & 16384 && r !== null) r.return = t, t = r;
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
function Ge(e, t) {
  for (t &= ~ai, t &= ~eo, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var r = 31 - Fe(t), n = 1 << r;
    e[r] = -1, t &= ~n;
  }
}
function xa(e) {
  if (P & 6) throw Error(v(327));
  $t();
  var t = Cn(e, 0);
  if (!(t & 1)) return ce(e, H()), null;
  var r = Hn(e, t);
  if (e.tag !== 0 && r === 2) {
    var n = Zo(e);
    n !== 0 && (t = n, r = Cl(e, n));
  }
  if (r === 1) throw r = Ur, yt(e, 0), Ge(e, t), ce(e, H()), r;
  if (r === 6) throw Error(v(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, mt(e, ie, Oe), ce(e, H()), null;
}
function si(e, t) {
  var r = P;
  P |= 1;
  try {
    return e(t);
  } finally {
    P = r, P === 0 && (qt = H() + 500, Gn && dt());
  }
}
function Ct(e) {
  Je !== null && Je.tag === 0 && !(P & 6) && $t();
  var t = P;
  P |= 1;
  var r = xe.transition, n = L;
  try {
    if (xe.transition = null, L = 1, e) return e();
  } finally {
    L = n, xe.transition = r, P = t, !(P & 6) && dt();
  }
}
function ci() {
  de = At.current, M(At);
}
function yt(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var r = e.timeoutHandle;
  if (r !== -1 && (e.timeoutHandle = -1, qc(r)), Q !== null) for (r = Q.return; r !== null; ) {
    var n = r;
    switch (Ql(n), n.tag) {
      case 1:
        n = n.type.childContextTypes, n != null && Pn();
        break;
      case 3:
        Zt(), M(ue), M(re), ql();
        break;
      case 5:
        Jl(n);
        break;
      case 4:
        Zt();
        break;
      case 13:
        M(I);
        break;
      case 19:
        M(I);
        break;
      case 10:
        Yl(n.type._context);
        break;
      case 22:
      case 23:
        ci();
    }
    r = r.return;
  }
  if (X = e, Q = e = it(e.current, null), Z = de = t, $ = 0, Ur = null, ai = eo = bt = 0, ie = Er = null, vt !== null) {
    for (t = 0; t < vt.length; t++) if (r = vt[t], n = r.interleaved, n !== null) {
      r.interleaved = null;
      var o = n.next, l = r.pending;
      if (l !== null) {
        var i = l.next;
        l.next = o, n.next = i;
      }
      r.pending = n;
    }
    vt = null;
  }
  return e;
}
function ms(e, t) {
  do {
    var r = Q;
    try {
      if (Kl(), mn.current = jn, Bn) {
        for (var n = B.memoizedState; n !== null; ) {
          var o = n.queue;
          o !== null && (o.pending = null), n = n.next;
        }
        Bn = !1;
      }
      if (Et = 0, Y = W = B = null, kr = !1, Br = 0, ii.current = null, r === null || r.return === null) {
        $ = 1, Ur = t, Q = null;
        break;
      }
      e: {
        var l = e, i = r.return, a = r, u = t;
        if (t = Z, a.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
          var p = u, m = a, g = m.tag;
          if (!(m.mode & 1) && (g === 0 || g === 11 || g === 15)) {
            var f = m.alternate;
            f ? (m.updateQueue = f.updateQueue, m.memoizedState = f.memoizedState, m.lanes = f.lanes) : (m.updateQueue = null, m.memoizedState = null);
          }
          var w = aa(i);
          if (w !== null) {
            w.flags &= -257, ua(w, i, a, l, t), w.mode & 1 && ia(l, p, t), t = w, u = p;
            var y = t.updateQueue;
            if (y === null) {
              var x = /* @__PURE__ */ new Set();
              x.add(u), t.updateQueue = x;
            } else y.add(u);
            break e;
          } else {
            if (!(t & 1)) {
              ia(l, p, t), di();
              break e;
            }
            u = Error(v(426));
          }
        } else if (O && a.mode & 1) {
          var R = aa(i);
          if (R !== null) {
            !(R.flags & 65536) && (R.flags |= 256), ua(R, i, a, l, t), Wl(Jt(u, a));
            break e;
          }
        }
        l = u = Jt(u, a), $ !== 4 && ($ = 2), Er === null ? Er = [l] : Er.push(l), l = i;
        do {
          switch (l.tag) {
            case 3:
              l.flags |= 65536, t &= -t, l.lanes |= t;
              var c = Ju(l, u, t);
              ea(l, c);
              break e;
            case 1:
              a = u;
              var s = l.type, d = l.stateNode;
              if (!(l.flags & 128) && (typeof s.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (ot === null || !ot.has(d)))) {
                l.flags |= 65536, t &= -t, l.lanes |= t;
                var h = qu(l, a, t);
                ea(l, h);
                break e;
              }
          }
          l = l.return;
        } while (l !== null);
      }
      ws(r);
    } catch (S) {
      t = S, Q === r && r !== null && (Q = r = r.return);
      continue;
    }
    break;
  } while (!0);
}
function hs() {
  var e = An.current;
  return An.current = jn, e === null ? jn : e;
}
function di() {
  ($ === 0 || $ === 3 || $ === 2) && ($ = 4), X === null || !(bt & 268435455) && !(eo & 268435455) || Ge(X, Z);
}
function Hn(e, t) {
  var r = P;
  P |= 2;
  var n = hs();
  (X !== e || Z !== t) && (Oe = null, yt(e, t));
  do
    try {
      bd();
      break;
    } catch (o) {
      ms(e, o);
    }
  while (!0);
  if (Kl(), P = r, An.current = n, Q !== null) throw Error(v(261));
  return X = null, Z = 0, $;
}
function bd() {
  for (; Q !== null; ) vs(Q);
}
function Cd() {
  for (; Q !== null && !Gs(); ) vs(Q);
}
function vs(e) {
  var t = xs(e.alternate, e, de);
  e.memoizedProps = e.pendingProps, t === null ? ws(e) : Q = t, ii.current = null;
}
function ws(e) {
  var t = e;
  do {
    var r = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (r = wd(r, t), r !== null) {
        r.flags &= 32767, Q = r;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        $ = 6, Q = null;
        return;
      }
    } else if (r = vd(r, t, de), r !== null) {
      Q = r;
      return;
    }
    if (t = t.sibling, t !== null) {
      Q = t;
      return;
    }
    Q = t = e;
  } while (t !== null);
  $ === 0 && ($ = 5);
}
function mt(e, t, r) {
  var n = L, o = xe.transition;
  try {
    xe.transition = null, L = 1, zd(e, t, r, n);
  } finally {
    xe.transition = o, L = n;
  }
  return null;
}
function zd(e, t, r, n) {
  do
    $t();
  while (Je !== null);
  if (P & 6) throw Error(v(327));
  r = e.finishedWork;
  var o = e.finishedLanes;
  if (r === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(v(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var l = r.lanes | r.childLanes;
  if (ic(e, l), e === X && (Q = X = null, Z = 0), !(r.subtreeFlags & 2064) && !(r.flags & 2064) || sn || (sn = !0, ks(bn, function() {
    return $t(), null;
  })), l = (r.flags & 15990) !== 0, r.subtreeFlags & 15990 || l) {
    l = xe.transition, xe.transition = null;
    var i = L;
    L = 1;
    var a = P;
    P |= 4, ii.current = null, xd(e, r), ps(r, e), $c(nl), zn = !!rl, nl = rl = null, e.current = r, kd(r), Zs(), P = a, L = i, xe.transition = l;
  } else e.current = r;
  if (sn && (sn = !1, Je = e, Vn = o), l = e.pendingLanes, l === 0 && (ot = null), ec(r.stateNode), ce(e, H()), t !== null) for (n = e.onRecoverableError, r = 0; r < t.length; r++) o = t[r], n(o.value, { componentStack: o.stack, digest: o.digest });
  if (Un) throw Un = !1, e = El, El = null, e;
  return Vn & 1 && e.tag !== 0 && $t(), l = e.pendingLanes, l & 1 ? e === bl ? br++ : (br = 0, bl = e) : br = 0, dt(), null;
}
function $t() {
  if (Je !== null) {
    var e = Ja(Vn), t = xe.transition, r = L;
    try {
      if (xe.transition = null, L = 16 > e ? 16 : e, Je === null) var n = !1;
      else {
        if (e = Je, Je = null, Vn = 0, P & 6) throw Error(v(331));
        var o = P;
        for (P |= 4, k = e.current; k !== null; ) {
          var l = k, i = l.child;
          if (k.flags & 16) {
            var a = l.deletions;
            if (a !== null) {
              for (var u = 0; u < a.length; u++) {
                var p = a[u];
                for (k = p; k !== null; ) {
                  var m = k;
                  switch (m.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Sr(8, m, l);
                  }
                  var g = m.child;
                  if (g !== null) g.return = m, k = g;
                  else for (; k !== null; ) {
                    m = k;
                    var f = m.sibling, w = m.return;
                    if (ss(m), m === p) {
                      k = null;
                      break;
                    }
                    if (f !== null) {
                      f.return = w, k = f;
                      break;
                    }
                    k = w;
                  }
                }
              }
              var y = l.alternate;
              if (y !== null) {
                var x = y.child;
                if (x !== null) {
                  y.child = null;
                  do {
                    var R = x.sibling;
                    x.sibling = null, x = R;
                  } while (x !== null);
                }
              }
              k = l;
            }
          }
          if (l.subtreeFlags & 2064 && i !== null) i.return = l, k = i;
          else e: for (; k !== null; ) {
            if (l = k, l.flags & 2048) switch (l.tag) {
              case 0:
              case 11:
              case 15:
                Sr(9, l, l.return);
            }
            var c = l.sibling;
            if (c !== null) {
              c.return = l.return, k = c;
              break e;
            }
            k = l.return;
          }
        }
        var s = e.current;
        for (k = s; k !== null; ) {
          i = k;
          var d = i.child;
          if (i.subtreeFlags & 2064 && d !== null) d.return = i, k = d;
          else e: for (i = s; k !== null; ) {
            if (a = k, a.flags & 2048) try {
              switch (a.tag) {
                case 0:
                case 11:
                case 15:
                  qn(9, a);
              }
            } catch (S) {
              A(a, a.return, S);
            }
            if (a === i) {
              k = null;
              break e;
            }
            var h = a.sibling;
            if (h !== null) {
              h.return = a.return, k = h;
              break e;
            }
            k = a.return;
          }
        }
        if (P = o, dt(), Me && typeof Me.onPostCommitFiberRoot == "function") try {
          Me.onPostCommitFiberRoot(Wn, e);
        } catch {
        }
        n = !0;
      }
      return n;
    } finally {
      L = r, xe.transition = t;
    }
  }
  return !1;
}
function ka(e, t, r) {
  t = Jt(r, t), t = Ju(e, t, 1), e = nt(e, t, 1), t = oe(), e !== null && (Vr(e, 1, t), ce(e, t));
}
function A(e, t, r) {
  if (e.tag === 3) ka(e, e, r);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      ka(t, e, r);
      break;
    } else if (t.tag === 1) {
      var n = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (ot === null || !ot.has(n))) {
        e = Jt(r, e), e = qu(t, e, 1), t = nt(t, e, 1), e = oe(), t !== null && (Vr(t, 1, e), ce(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function _d(e, t, r) {
  var n = e.pingCache;
  n !== null && n.delete(t), t = oe(), e.pingedLanes |= e.suspendedLanes & r, X === e && (Z & r) === r && ($ === 4 || $ === 3 && (Z & 130023424) === Z && 500 > H() - ui ? yt(e, 0) : ai |= r), ce(e, t);
}
function ys(e, t) {
  t === 0 && (e.mode & 1 ? (t = Jr, Jr <<= 1, !(Jr & 130023424) && (Jr = 4194304)) : t = 1);
  var r = oe();
  e = He(e, t), e !== null && (Vr(e, t, r), ce(e, r));
}
function Fd(e) {
  var t = e.memoizedState, r = 0;
  t !== null && (r = t.retryLane), ys(e, r);
}
function Nd(e, t) {
  var r = 0;
  switch (e.tag) {
    case 13:
      var n = e.stateNode, o = e.memoizedState;
      o !== null && (r = o.retryLane);
      break;
    case 19:
      n = e.stateNode;
      break;
    default:
      throw Error(v(314));
  }
  n !== null && n.delete(t), ys(e, r);
}
var xs;
xs = function(e, t, r) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || ue.current) ae = !0;
  else {
    if (!(e.lanes & r) && !(t.flags & 128)) return ae = !1, hd(e, t, r);
    ae = !!(e.flags & 131072);
  }
  else ae = !1, O && t.flags & 1048576 && bu(t, Dn, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var n = t.type;
      vn(e, t), e = t.pendingProps;
      var o = Yt(t, re.current);
      Wt(t, r), o = ti(null, t, n, e, o, r);
      var l = ri();
      return t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, se(n) ? (l = !0, Ln(t)) : l = !1, t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, Gl(t), o.updater = Jn, t.stateNode = o, o._reactInternals = t, pl(t, n, e, r), t = ml(null, t, n, !0, l, r)) : (t.tag = 0, O && l && Hl(t), ne(null, t, o, r), t = t.child), t;
    case 16:
      n = t.elementType;
      e: {
        switch (vn(e, t), e = t.pendingProps, o = n._init, n = o(n._payload), t.type = n, o = t.tag = Ld(n), e = Ce(n, e), o) {
          case 0:
            t = gl(null, t, n, e, r);
            break e;
          case 1:
            t = da(null, t, n, e, r);
            break e;
          case 11:
            t = sa(null, t, n, e, r);
            break e;
          case 14:
            t = ca(null, t, n, Ce(n.type, e), r);
            break e;
        }
        throw Error(v(
          306,
          n,
          ""
        ));
      }
      return t;
    case 0:
      return n = t.type, o = t.pendingProps, o = t.elementType === n ? o : Ce(n, o), gl(e, t, n, o, r);
    case 1:
      return n = t.type, o = t.pendingProps, o = t.elementType === n ? o : Ce(n, o), da(e, t, n, o, r);
    case 3:
      e: {
        if (ns(t), e === null) throw Error(v(387));
        n = t.pendingProps, l = t.memoizedState, o = l.element, Pu(e, t), On(t, n, null, r);
        var i = t.memoizedState;
        if (n = i.element, l.isDehydrated) if (l = { element: n, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = l, t.memoizedState = l, t.flags & 256) {
          o = Jt(Error(v(423)), t), t = pa(e, t, n, r, o);
          break e;
        } else if (n !== o) {
          o = Jt(Error(v(424)), t), t = pa(e, t, n, r, o);
          break e;
        } else for (pe = rt(t.stateNode.containerInfo.firstChild), fe = t, O = !0, _e = null, r = Fu(t, null, n, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
        else {
          if (Xt(), n === o) {
            t = Qe(e, t, r);
            break e;
          }
          ne(e, t, n, r);
        }
        t = t.child;
      }
      return t;
    case 5:
      return Lu(t), e === null && sl(t), n = t.type, o = t.pendingProps, l = e !== null ? e.memoizedProps : null, i = o.children, ol(n, o) ? i = null : l !== null && ol(n, l) && (t.flags |= 32), rs(e, t), ne(e, t, i, r), t.child;
    case 6:
      return e === null && sl(t), null;
    case 13:
      return os(e, t, r);
    case 4:
      return Zl(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = Gt(t, null, n, r) : ne(e, t, n, r), t.child;
    case 11:
      return n = t.type, o = t.pendingProps, o = t.elementType === n ? o : Ce(n, o), sa(e, t, n, o, r);
    case 7:
      return ne(e, t, t.pendingProps, r), t.child;
    case 8:
      return ne(e, t, t.pendingProps.children, r), t.child;
    case 12:
      return ne(e, t, t.pendingProps.children, r), t.child;
    case 10:
      e: {
        if (n = t.type._context, o = t.pendingProps, l = t.memoizedProps, i = o.value, T(Mn, n._currentValue), n._currentValue = i, l !== null) if (Pe(l.value, i)) {
          if (l.children === o.children && !ue.current) {
            t = Qe(e, t, r);
            break e;
          }
        } else for (l = t.child, l !== null && (l.return = t); l !== null; ) {
          var a = l.dependencies;
          if (a !== null) {
            i = l.child;
            for (var u = a.firstContext; u !== null; ) {
              if (u.context === n) {
                if (l.tag === 1) {
                  u = Ae(-1, r & -r), u.tag = 2;
                  var p = l.updateQueue;
                  if (p !== null) {
                    p = p.shared;
                    var m = p.pending;
                    m === null ? u.next = u : (u.next = m.next, m.next = u), p.pending = u;
                  }
                }
                l.lanes |= r, u = l.alternate, u !== null && (u.lanes |= r), cl(
                  l.return,
                  r,
                  t
                ), a.lanes |= r;
                break;
              }
              u = u.next;
            }
          } else if (l.tag === 10) i = l.type === t.type ? null : l.child;
          else if (l.tag === 18) {
            if (i = l.return, i === null) throw Error(v(341));
            i.lanes |= r, a = i.alternate, a !== null && (a.lanes |= r), cl(i, r, t), i = l.sibling;
          } else i = l.child;
          if (i !== null) i.return = l;
          else for (i = l; i !== null; ) {
            if (i === t) {
              i = null;
              break;
            }
            if (l = i.sibling, l !== null) {
              l.return = i.return, i = l;
              break;
            }
            i = i.return;
          }
          l = i;
        }
        ne(e, t, o.children, r), t = t.child;
      }
      return t;
    case 9:
      return o = t.type, n = t.pendingProps.children, Wt(t, r), o = ke(o), n = n(o), t.flags |= 1, ne(e, t, n, r), t.child;
    case 14:
      return n = t.type, o = Ce(n, t.pendingProps), o = Ce(n.type, o), ca(e, t, n, o, r);
    case 15:
      return es(e, t, t.type, t.pendingProps, r);
    case 17:
      return n = t.type, o = t.pendingProps, o = t.elementType === n ? o : Ce(n, o), vn(e, t), t.tag = 1, se(n) ? (e = !0, Ln(t)) : e = !1, Wt(t, r), Zu(t, n, o), pl(t, n, o, r), ml(null, t, n, !0, e, r);
    case 19:
      return ls(e, t, r);
    case 22:
      return ts(e, t, r);
  }
  throw Error(v(156, t.tag));
};
function ks(e, t) {
  return Ya(e, t);
}
function Pd(e, t, r, n) {
  this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function ye(e, t, r, n) {
  return new Pd(e, t, r, n);
}
function pi(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Ld(e) {
  if (typeof e == "function") return pi(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === Ll) return 11;
    if (e === Tl) return 14;
  }
  return 2;
}
function it(e, t) {
  var r = e.alternate;
  return r === null ? (r = ye(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
}
function xn(e, t, r, n, o, l) {
  var i = 2;
  if (n = e, typeof e == "function") pi(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else e: switch (e) {
    case Pt:
      return xt(r.children, o, l, t);
    case Pl:
      i = 8, o |= 8;
      break;
    case Oo:
      return e = ye(12, r, t, o | 2), e.elementType = Oo, e.lanes = l, e;
    case Io:
      return e = ye(13, r, t, o), e.elementType = Io, e.lanes = l, e;
    case Bo:
      return e = ye(19, r, t, o), e.elementType = Bo, e.lanes = l, e;
    case La:
      return to(r, o, l, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case Na:
          i = 10;
          break e;
        case Pa:
          i = 9;
          break e;
        case Ll:
          i = 11;
          break e;
        case Tl:
          i = 14;
          break e;
        case Ke:
          i = 16, n = null;
          break e;
      }
      throw Error(v(130, e == null ? e : typeof e, ""));
  }
  return t = ye(i, r, t, o), t.elementType = e, t.type = n, t.lanes = l, t;
}
function xt(e, t, r, n) {
  return e = ye(7, e, n, t), e.lanes = r, e;
}
function to(e, t, r, n) {
  return e = ye(22, e, n, t), e.elementType = La, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
}
function Do(e, t, r) {
  return e = ye(6, e, null, t), e.lanes = r, e;
}
function Mo(e, t, r) {
  return t = ye(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Td(e, t, r, n, o) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = go(0), this.expirationTimes = go(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = go(0), this.identifierPrefix = n, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
}
function fi(e, t, r, n, o, l, i, a, u) {
  return e = new Td(e, t, r, a, u), t === 1 ? (t = 1, l === !0 && (t |= 8)) : t = 0, l = ye(3, null, null, t), e.current = l, l.stateNode = e, l.memoizedState = { element: n, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Gl(l), e;
}
function Dd(e, t, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Nt, key: n == null ? null : "" + n, children: e, containerInfo: t, implementation: r };
}
function Ss(e) {
  if (!e) return ut;
  e = e._reactInternals;
  e: {
    if (_t(e) !== e || e.tag !== 1) throw Error(v(170));
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
    var r = e.type;
    if (se(r)) return Su(e, r, t);
  }
  return t;
}
function Es(e, t, r, n, o, l, i, a, u) {
  return e = fi(r, n, !0, e, o, l, i, a, u), e.context = Ss(null), r = e.current, n = oe(), o = lt(r), l = Ae(n, o), l.callback = t ?? null, nt(r, l, o), e.current.lanes = o, Vr(e, o, n), ce(e, n), e;
}
function ro(e, t, r, n) {
  var o = t.current, l = oe(), i = lt(o);
  return r = Ss(r), t.context === null ? t.context = r : t.pendingContext = r, t = Ae(l, i), t.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (t.callback = n), e = nt(o, t, i), e !== null && (Ne(e, o, i, l), gn(e, o, i)), i;
}
function Qn(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Sa(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var r = e.retryLane;
    e.retryLane = r !== 0 && r < t ? r : t;
  }
}
function gi(e, t) {
  Sa(e, t), (e = e.alternate) && Sa(e, t);
}
function Md() {
  return null;
}
var bs = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function mi(e) {
  this._internalRoot = e;
}
no.prototype.render = mi.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(v(409));
  ro(e, t, null, null);
};
no.prototype.unmount = mi.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Ct(function() {
      ro(null, e, null, null);
    }), t[Ve] = null;
  }
};
function no(e) {
  this._internalRoot = e;
}
no.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = tu();
    e = { blockedOn: null, target: e, priority: t };
    for (var r = 0; r < Xe.length && t !== 0 && t < Xe[r].priority; r++) ;
    Xe.splice(r, 0, e), r === 0 && nu(e);
  }
};
function hi(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function oo(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Ea() {
}
function Rd(e, t, r, n, o) {
  if (o) {
    if (typeof n == "function") {
      var l = n;
      n = function() {
        var p = Qn(i);
        l.call(p);
      };
    }
    var i = Es(t, n, e, 0, null, !1, !1, "", Ea);
    return e._reactRootContainer = i, e[Ve] = i.current, Dr(e.nodeType === 8 ? e.parentNode : e), Ct(), i;
  }
  for (; o = e.lastChild; ) e.removeChild(o);
  if (typeof n == "function") {
    var a = n;
    n = function() {
      var p = Qn(u);
      a.call(p);
    };
  }
  var u = fi(e, 0, !1, null, null, !1, !1, "", Ea);
  return e._reactRootContainer = u, e[Ve] = u.current, Dr(e.nodeType === 8 ? e.parentNode : e), Ct(function() {
    ro(t, u, r, n);
  }), u;
}
function lo(e, t, r, n, o) {
  var l = r._reactRootContainer;
  if (l) {
    var i = l;
    if (typeof o == "function") {
      var a = o;
      o = function() {
        var u = Qn(i);
        a.call(u);
      };
    }
    ro(t, i, e, o);
  } else i = Rd(r, t, e, o, n);
  return Qn(i);
}
qa = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var r = gr(t.pendingLanes);
        r !== 0 && (Rl(t, r | 1), ce(t, H()), !(P & 6) && (qt = H() + 500, dt()));
      }
      break;
    case 13:
      Ct(function() {
        var n = He(e, 1);
        if (n !== null) {
          var o = oe();
          Ne(n, e, 1, o);
        }
      }), gi(e, 1);
  }
};
Ol = function(e) {
  if (e.tag === 13) {
    var t = He(e, 134217728);
    if (t !== null) {
      var r = oe();
      Ne(t, e, 134217728, r);
    }
    gi(e, 134217728);
  }
};
eu = function(e) {
  if (e.tag === 13) {
    var t = lt(e), r = He(e, t);
    if (r !== null) {
      var n = oe();
      Ne(r, e, t, n);
    }
    gi(e, t);
  }
};
tu = function() {
  return L;
};
ru = function(e, t) {
  var r = L;
  try {
    return L = e, t();
  } finally {
    L = r;
  }
};
Yo = function(e, t, r) {
  switch (t) {
    case "input":
      if (Uo(e, r), t = r.name, r.type === "radio" && t != null) {
        for (r = e; r.parentNode; ) r = r.parentNode;
        for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== e && n.form === e.form) {
            var o = Xn(n);
            if (!o) throw Error(v(90));
            Da(n), Uo(n, o);
          }
        }
      }
      break;
    case "textarea":
      Ra(e, r);
      break;
    case "select":
      t = r.value, t != null && Ut(e, !!r.multiple, t, !1);
  }
};
Va = si;
Ha = Ct;
var Od = { usingClientEntryPoint: !1, Events: [Qr, Mt, Xn, Aa, Ua, si] }, dr = { findFiberByHostInstance: ht, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Id = { bundleType: dr.bundleType, version: dr.version, rendererPackageName: dr.rendererPackageName, rendererConfig: dr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: We.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = $a(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: dr.findFiberByHostInstance || Md, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var cn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!cn.isDisabled && cn.supportsFiber) try {
    Wn = cn.inject(Id), Me = cn;
  } catch {
  }
}
me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Od;
me.createPortal = function(e, t) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!hi(t)) throw Error(v(200));
  return Dd(e, t, null, r);
};
me.createRoot = function(e, t) {
  if (!hi(e)) throw Error(v(299));
  var r = !1, n = "", o = bs;
  return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = fi(e, 1, !1, null, null, r, !1, n, o), e[Ve] = t.current, Dr(e.nodeType === 8 ? e.parentNode : e), new mi(t);
};
me.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(v(188)) : (e = Object.keys(e).join(","), Error(v(268, e)));
  return e = $a(t), e = e === null ? null : e.stateNode, e;
};
me.flushSync = function(e) {
  return Ct(e);
};
me.hydrate = function(e, t, r) {
  if (!oo(t)) throw Error(v(200));
  return lo(null, e, t, !0, r);
};
me.hydrateRoot = function(e, t, r) {
  if (!hi(e)) throw Error(v(405));
  var n = r != null && r.hydratedSources || null, o = !1, l = "", i = bs;
  if (r != null && (r.unstable_strictMode === !0 && (o = !0), r.identifierPrefix !== void 0 && (l = r.identifierPrefix), r.onRecoverableError !== void 0 && (i = r.onRecoverableError)), t = Es(t, null, e, 1, r ?? null, o, !1, l, i), e[Ve] = t.current, Dr(e), n) for (e = 0; e < n.length; e++) r = n[e], o = r._getVersion, o = o(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, o] : t.mutableSourceEagerHydrationData.push(
    r,
    o
  );
  return new no(t);
};
me.render = function(e, t, r) {
  if (!oo(t)) throw Error(v(200));
  return lo(null, e, t, !1, r);
};
me.unmountComponentAtNode = function(e) {
  if (!oo(e)) throw Error(v(40));
  return e._reactRootContainer ? (Ct(function() {
    lo(null, null, e, !1, function() {
      e._reactRootContainer = null, e[Ve] = null;
    });
  }), !0) : !1;
};
me.unstable_batchedUpdates = si;
me.unstable_renderSubtreeIntoContainer = function(e, t, r, n) {
  if (!oo(r)) throw Error(v(200));
  if (e == null || e._reactInternals === void 0) throw Error(v(38));
  return lo(e, t, r, !1, n);
};
me.version = "18.3.1-next-f1338f8080-20240426";
function Cs() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Cs);
    } catch (e) {
      console.error(e);
    }
}
Cs(), Ca.exports = me;
var Bd = Ca.exports, zs, ba = Bd;
zs = ba.createRoot, ba.hydrateRoot;
const jd = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:Inter,Geist,-apple-system,system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:JetBrains Mono,Fira Code,SF Mono,ui-monospace,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.card{position:relative;overflow:hidden;border-radius:1rem;border:1px solid var(--line);background:var(--card-bg);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 1px #ffffff05 inset,0 8px 24px -12px #00000059}.card:before{content:"";position:absolute;inset:0 0 auto 0;height:1px;pointer-events:none;background:linear-gradient(90deg,transparent,var(--card-accent),transparent)}.hero{position:relative;overflow:hidden;border-radius:1rem;background:radial-gradient(600px 200px at 0% 0%,rgba(0,223,186,.1),transparent 70%),radial-gradient(500px 220px at 100% 100%,rgba(168,85,247,.12),transparent 70%),var(--rail);color:var(--rail-ink);border:1px solid var(--rail-line)}.hero:before{content:"";position:absolute;inset:0 0 auto 0;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,.55),rgba(168,85,247,.45),transparent)}.cta{background:var(--cta-bg);color:var(--on-refract);box-shadow:var(--glow-cyan)}.cta:hover:not(:disabled){filter:brightness(1.08)}.syn-key{color:var(--syn-key)}.syn-val{color:var(--syn-val)}.syn-unit{color:var(--syn-unit)}.diff-del{background:var(--diff-del)}.diff-add{background:var(--diff-add)}.skeleton{border-radius:6px;background:var(--skeleton);animation:lens-pulse 1.6s ease-in-out infinite}.pulse-dot{position:relative;display:inline-block;width:8px;height:8px;border-radius:9999px;background:currentColor;flex:none}.pulse-dot:after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:inherit;background:currentColor;animation:lens-ping 1.8s cubic-bezier(0,0,.2,1) infinite}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{left:0;right:0}.inset-y-0{top:0;bottom:0}.bottom-0{bottom:0}.bottom-28{bottom:7rem}.left-0{left:0}.right-2{right:.5rem}.right-8{right:2rem}.top-0{top:0}.top-2{top:.5rem}.top-full{top:100%}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-\\[1\\]{z-index:1}.-mx-10{margin-left:-2.5rem;margin-right:-2.5rem}.mx-0\\.5{margin-left:.125rem;margin-right:.125rem}.mx-1{margin-left:.25rem;margin-right:.25rem}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.mb-1{margin-bottom:.25rem}.mb-1\\.5{margin-bottom:.375rem}.mb-10{margin-bottom:2.5rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.ml-1{margin-left:.25rem}.ml-2{margin-left:.5rem}.ml-auto{margin-left:auto}.mr-1{margin-right:.25rem}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-10{margin-top:2.5rem}.mt-12{margin-top:3rem}.mt-2{margin-top:.5rem}.mt-2\\.5{margin-top:.625rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.mt-\\[7px\\]{margin-top:7px}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.hidden{display:none}.\\!h-1\\.5{height:.375rem!important}.h-0\\.5{height:.125rem}.h-1{height:.25rem}.h-1\\.5{height:.375rem}.h-10{height:2.5rem}.h-2{height:.5rem}.h-2\\.5{height:.625rem}.h-3{height:.75rem}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-44{height:11rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-\\[17px\\]{height:17px}.h-\\[38px\\]{height:38px}.h-auto{height:auto}.h-full{height:100%}.h-px{height:1px}.max-h-48{max-height:12rem}.max-h-56{max-height:14rem}.max-h-72{max-height:18rem}.max-h-\\[520px\\]{max-height:520px}.max-h-\\[70vh\\]{max-height:70vh}.min-h-0{min-height:0px}.\\!w-1\\.5{width:.375rem!important}.w-1{width:.25rem}.w-1\\.5{width:.375rem}.w-1\\/2{width:50%}.w-10{width:2.5rem}.w-12{width:3rem}.w-14{width:3.5rem}.w-16{width:4rem}.w-2{width:.5rem}.w-2\\.5{width:.625rem}.w-2\\/3{width:66.666667%}.w-2\\/5{width:40%}.w-20{width:5rem}.w-24{width:6rem}.w-28{width:7rem}.w-3{width:.75rem}.w-3\\/5{width:60%}.w-32{width:8rem}.w-36{width:9rem}.w-4{width:1rem}.w-40{width:10rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-64{width:16rem}.w-7{width:1.75rem}.w-\\[17px\\]{width:17px}.w-full{width:100%}.w-px{width:1px}.min-w-0{min-width:0px}.min-w-\\[140px\\]{min-width:140px}.min-w-\\[280px\\]{min-width:280px}.min-w-\\[96px\\]{min-width:96px}.min-w-max{min-width:-moz-max-content;min-width:max-content}.max-w-\\[1180px\\]{max-width:1180px}.max-w-\\[460px\\]{max-width:460px}.max-w-\\[560px\\]{max-width:560px}.max-w-\\[600px\\]{max-width:600px}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[64ch\\]{max-width:64ch}.max-w-\\[68ch\\]{max-width:68ch}.max-w-\\[70ch\\]{max-width:70ch}.max-w-\\[720px\\]{max-width:720px}.max-w-\\[72ch\\]{max-width:72ch}.max-w-\\[80ch\\]{max-width:80ch}.max-w-\\[920px\\]{max-width:920px}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-default{cursor:default}.cursor-help{cursor:help}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.resize-y{resize:vertical}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-\\[92px_1fr_auto\\]{grid-template-columns:92px 1fr auto}.grid-cols-\\[minmax\\(120px\\,220px\\)_1fr_auto\\]{grid-template-columns:minmax(120px,220px) 1fr auto}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-0\\.5{gap:.125rem}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-px{gap:1px}.gap-x-3{-moz-column-gap:.75rem;column-gap:.75rem}.gap-x-8{-moz-column-gap:2rem;column-gap:2rem}.gap-y-1{row-gap:.25rem}.gap-y-3{row-gap:.75rem}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem * var(--tw-space-y-reverse))}.space-y-1\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.375rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.375rem * var(--tw-space-y-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-2\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.625rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.625rem * var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-y-5>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.25rem * var(--tw-space-y-reverse))}.space-y-7>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.75rem * var(--tw-space-y-reverse))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-line>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:color-mix(in srgb,var(--line) calc(var(--tw-divide-opacity) * 100%),transparent)}.self-start{align-self:flex-start}.self-stretch{align-self:stretch}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.\\!overflow-visible{overflow:visible!important}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.whitespace-pre{white-space:pre}.whitespace-pre-wrap{white-space:pre-wrap}.break-words{overflow-wrap:break-word}.break-all{word-break:break-all}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-sm{border-radius:.125rem}.rounded-xl{border-radius:.75rem}.rounded-b-2xl{border-bottom-right-radius:1rem;border-bottom-left-radius:1rem}.border{border-width:1px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-t{border-top-width:1px}.border-dashed{border-style:dashed}.\\!border-prism\\/60{border-color:color-mix(in srgb,var(--prism) 60%,transparent)!important}.\\!border-rail-line{--tw-border-opacity: 1 !important;border-color:color-mix(in srgb,var(--rail-line) calc(var(--tw-border-opacity) * 100%),transparent)!important}.\\!border-refract\\/60{border-color:color-mix(in srgb,var(--refract) 60%,transparent)!important}.\\!border-refract\\/70{border-color:color-mix(in srgb,var(--refract) 70%,transparent)!important}.border-\\[\\#10B981\\]\\/40{border-color:#10b98166}.border-\\[\\#C084FC\\]{--tw-border-opacity: 1;border-color:rgb(192 132 252 / var(--tw-border-opacity))}.border-bad{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--bad) calc(var(--tw-border-opacity) * 100%),transparent)}.border-bad\\/30{border-color:color-mix(in srgb,var(--bad) 30%,transparent)}.border-bad\\/40{border-color:color-mix(in srgb,var(--bad) 40%,transparent)}.border-bad\\/50{border-color:color-mix(in srgb,var(--bad) 50%,transparent)}.border-line{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--line) calc(var(--tw-border-opacity) * 100%),transparent)}.border-line-strong{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--line-strong) calc(var(--tw-border-opacity) * 100%),transparent)}.border-line-strong\\/70{border-color:color-mix(in srgb,var(--line-strong) 70%,transparent)}.border-logs{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--logs) calc(var(--tw-border-opacity) * 100%),transparent)}.border-metrics{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--metrics) calc(var(--tw-border-opacity) * 100%),transparent)}.border-ok{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--ok) calc(var(--tw-border-opacity) * 100%),transparent)}.border-ok\\/30{border-color:color-mix(in srgb,var(--ok) 30%,transparent)}.border-ok\\/40{border-color:color-mix(in srgb,var(--ok) 40%,transparent)}.border-p2{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--p2) calc(var(--tw-border-opacity) * 100%),transparent)}.border-prism\\/30{border-color:color-mix(in srgb,var(--prism) 30%,transparent)}.border-rail-line{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--rail-line) calc(var(--tw-border-opacity) * 100%),transparent)}.border-refract{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--refract) calc(var(--tw-border-opacity) * 100%),transparent)}.border-refract\\/30{border-color:color-mix(in srgb,var(--refract) 30%,transparent)}.border-refract\\/70{border-color:color-mix(in srgb,var(--refract) 70%,transparent)}.border-step-done\\/60{border-color:color-mix(in srgb,var(--step-done) 60%,transparent)}.border-traces{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--traces) calc(var(--tw-border-opacity) * 100%),transparent)}.border-universal{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--universal) calc(var(--tw-border-opacity) * 100%),transparent)}.border-warn\\/30{border-color:color-mix(in srgb,var(--warn) 30%,transparent)}.border-warn\\/40{border-color:color-mix(in srgb,var(--warn) 40%,transparent)}.\\!bg-raised{--tw-bg-opacity: 1 !important;background-color:color-mix(in srgb,var(--raised) calc(var(--tw-bg-opacity) * 100%),transparent)!important}.\\!bg-transparent{background-color:transparent!important}.bg-\\[\\#06B6D4\\]{--tw-bg-opacity: 1;background-color:rgb(6 182 212 / var(--tw-bg-opacity))}.bg-\\[\\#10B981\\]{--tw-bg-opacity: 1;background-color:rgb(16 185 129 / var(--tw-bg-opacity))}.bg-\\[\\#10B981\\]\\/10{background-color:#10b9811a}.bg-\\[\\#64748B\\]{--tw-bg-opacity: 1;background-color:rgb(100 116 139 / var(--tw-bg-opacity))}.bg-\\[\\#A855F7\\]{--tw-bg-opacity: 1;background-color:rgb(168 85 247 / var(--tw-bg-opacity))}.bg-\\[\\#A855F7\\]\\/25{background-color:#a855f740}.bg-bad{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--bad) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-bad\\/10{background-color:color-mix(in srgb,var(--bad) 10%,transparent)}.bg-black\\/60{background-color:#0009}.bg-line{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--line) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-line-strong{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--line-strong) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-logs{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--logs) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-metrics{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--metrics) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-ok{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--ok) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-ok\\/10{background-color:color-mix(in srgb,var(--ok) 10%,transparent)}.bg-p1{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--p1) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-p1\\/10{background-color:color-mix(in srgb,var(--p1) 10%,transparent)}.bg-p2{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--p2) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-p2\\/10{background-color:color-mix(in srgb,var(--p2) 10%,transparent)}.bg-p3{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--p3) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-p3\\/10{background-color:color-mix(in srgb,var(--p3) 10%,transparent)}.bg-paper{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--paper) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-paper\\/85{background-color:color-mix(in srgb,var(--paper) 85%,transparent)}.bg-paper\\/90{background-color:color-mix(in srgb,var(--paper) 90%,transparent)}.bg-prism{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--prism) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-prism\\/10{background-color:color-mix(in srgb,var(--prism) 10%,transparent)}.bg-rail{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--rail) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-rail-line{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--rail-line) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-raised{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--raised) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-raised\\/60{background-color:color-mix(in srgb,var(--raised) 60%,transparent)}.bg-raised\\/90{background-color:color-mix(in srgb,var(--raised) 90%,transparent)}.bg-refract{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--refract) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-refract-soft{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--refract-soft) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-refract-soft\\/80{background-color:color-mix(in srgb,var(--refract-soft) 80%,transparent)}.bg-refract\\/70{background-color:color-mix(in srgb,var(--refract) 70%,transparent)}.bg-step-done\\/15{background-color:color-mix(in srgb,var(--step-done) 15%,transparent)}.bg-step-done\\/50{background-color:color-mix(in srgb,var(--step-done) 50%,transparent)}.bg-sunk{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--sunk) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-sunk\\/70{background-color:color-mix(in srgb,var(--sunk) 70%,transparent)}.bg-surface{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--surface) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-surface\\/60{background-color:color-mix(in srgb,var(--surface) 60%,transparent)}.bg-surface\\/70{background-color:color-mix(in srgb,var(--surface) 70%,transparent)}.bg-traces{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--traces) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-transparent{background-color:transparent}.bg-universal{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--universal) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-warn{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--warn) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-warn\\/10{background-color:color-mix(in srgb,var(--warn) 10%,transparent)}.bg-warnbg{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--warnbg) calc(var(--tw-bg-opacity) * 100%),transparent)}.bg-white\\/10{background-color:#ffffff1a}.bg-white\\/\\[\\.025\\]{background-color:#ffffff06}.bg-white\\/\\[\\.03\\]{background-color:#ffffff08}.bg-white\\/\\[\\.07\\]{background-color:#ffffff12}.bg-\\[linear-gradient\\(135deg\\,\\#00DFBA\\,\\#06B6D4\\)\\]{background-image:linear-gradient(135deg,#00dfba,#06b6d4)}.bg-\\[linear-gradient\\(135deg\\,rgba\\(0\\,223\\,186\\,\\.9\\)\\,rgba\\(168\\,85\\,247\\,\\.85\\)\\)\\]{background-image:linear-gradient(135deg,#00dfbae6,#a855f7d9)}.bg-\\[linear-gradient\\(90deg\\,\\#06B6D4\\,\\#00DFBA\\)\\]{background-image:linear-gradient(90deg,#06b6d4,#00dfba)}.bg-\\[linear-gradient\\(90deg\\,\\#06B6D4\\,\\#A855F7\\)\\]{background-image:linear-gradient(90deg,#06b6d4,#a855f7)}.bg-\\[linear-gradient\\(90deg\\,\\#10B981\\,\\#34D399\\)\\]{background-image:linear-gradient(90deg,#10b981,#34d399)}.bg-\\[linear-gradient\\(90deg\\,\\#8B5CF6\\,\\#A855F7\\)\\]{background-image:linear-gradient(90deg,#8b5cf6,#a855f7)}.bg-\\[linear-gradient\\(90deg\\,rgba\\(6\\,182\\,212\\,\\.18\\)\\,rgba\\(6\\,182\\,212\\,\\.08\\)\\)\\]{background-image:linear-gradient(90deg,#06b6d42e,#06b6d414)}.bg-\\[linear-gradient\\(90deg\\,transparent\\,rgba\\(0\\,223\\,186\\,\\.45\\)\\,rgba\\(168\\,85\\,247\\,\\.4\\)\\,transparent\\)\\]{background-image:linear-gradient(90deg,transparent,rgba(0,223,186,.45),rgba(168,85,247,.4),transparent)}.p-0\\.5{padding:.125rem}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-px{padding:1px}.px-1\\.5{padding-left:.375rem;padding-right:.375rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-3\\.5{padding-left:.875rem;padding-right:.875rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-5{padding-top:1.25rem;padding-bottom:1.25rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-7{padding-top:1.75rem;padding-bottom:1.75rem}.py-px{padding-top:1px;padding-bottom:1px}.pb-3{padding-bottom:.75rem}.pb-4{padding-bottom:1rem}.pb-6{padding-bottom:1.5rem}.pl-3{padding-left:.75rem}.pl-5{padding-left:1.25rem}.pl-6{padding-left:1.5rem}.pr-2{padding-right:.5rem}.pr-3{padding-right:.75rem}.pt-10{padding-top:2.5rem}.pt-3{padding-top:.75rem}.pt-5{padding-top:1.25rem}.pt-9{padding-top:2.25rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.align-top{vertical-align:top}.font-display{font-family:Inter,Geist,-apple-system,system-ui,sans-serif}.font-mono{font-family:JetBrains Mono,Fira Code,SF Mono,ui-monospace,monospace}.font-sans{font-family:Inter,Geist,-apple-system,system-ui,sans-serif}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[11px\\]{font-size:11px}.text-\\[12\\.5px\\]{font-size:12.5px}.text-\\[12px\\]{font-size:12px}.text-\\[13\\.5px\\]{font-size:13.5px}.text-\\[13px\\]{font-size:13px}.text-\\[14\\.5px\\]{font-size:14.5px}.text-\\[14px\\]{font-size:14px}.text-\\[15px\\]{font-size:15px}.text-\\[16px\\]{font-size:16px}.text-\\[17px\\]{font-size:17px}.text-\\[18px\\]{font-size:18px}.text-\\[20px\\]{font-size:20px}.text-\\[21px\\]{font-size:21px}.text-\\[22px\\]{font-size:22px}.text-\\[24px\\]{font-size:24px}.text-\\[26px\\]{font-size:26px}.text-\\[28px\\]{font-size:28px}.text-\\[32px\\]{font-size:32px}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.capitalize{text-transform:capitalize}.leading-\\[1\\.6\\]{line-height:1.6}.leading-none{line-height:1}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}.leading-tight{line-height:1.25}.tracking-\\[-0\\.01em\\]{letter-spacing:-.01em}.tracking-\\[-0\\.025em\\]{letter-spacing:-.025em}.tracking-\\[-0\\.02em\\]{letter-spacing:-.02em}.tracking-\\[0\\.06em\\]{letter-spacing:.06em}.tracking-\\[0\\.08em\\]{letter-spacing:.08em}.tracking-\\[0\\.12em\\]{letter-spacing:.12em}.tracking-tight{letter-spacing:-.025em}.\\!text-rail-mute{--tw-text-opacity: 1 !important;color:color-mix(in srgb,var(--rail-mute) calc(var(--tw-text-opacity) * 100%),transparent)!important}.text-\\[\\#04121A\\]{--tw-text-opacity: 1;color:rgb(4 18 26 / var(--tw-text-opacity))}.text-\\[\\#34D399\\]{--tw-text-opacity: 1;color:rgb(52 211 153 / var(--tw-text-opacity))}.text-\\[\\#6EE7B7\\]{--tw-text-opacity: 1;color:rgb(110 231 183 / var(--tw-text-opacity))}.text-\\[\\#A78BFA\\]{--tw-text-opacity: 1;color:rgb(167 139 250 / var(--tw-text-opacity))}.text-\\[\\#C084FC\\]{--tw-text-opacity: 1;color:rgb(192 132 252 / var(--tw-text-opacity))}.text-\\[\\#D8B4FE\\]{--tw-text-opacity: 1;color:rgb(216 180 254 / var(--tw-text-opacity))}.text-bad{--tw-text-opacity: 1;color:color-mix(in srgb,var(--bad) calc(var(--tw-text-opacity) * 100%),transparent)}.text-ink{--tw-text-opacity: 1;color:color-mix(in srgb,var(--ink) calc(var(--tw-text-opacity) * 100%),transparent)}.text-line{--tw-text-opacity: 1;color:color-mix(in srgb,var(--line) calc(var(--tw-text-opacity) * 100%),transparent)}.text-line-strong{--tw-text-opacity: 1;color:color-mix(in srgb,var(--line-strong) calc(var(--tw-text-opacity) * 100%),transparent)}.text-logs{--tw-text-opacity: 1;color:color-mix(in srgb,var(--logs) calc(var(--tw-text-opacity) * 100%),transparent)}.text-metrics{--tw-text-opacity: 1;color:color-mix(in srgb,var(--metrics) calc(var(--tw-text-opacity) * 100%),transparent)}.text-mute{--tw-text-opacity: 1;color:color-mix(in srgb,var(--mute) calc(var(--tw-text-opacity) * 100%),transparent)}.text-mute\\/60{color:color-mix(in srgb,var(--mute) 60%,transparent)}.text-ok{--tw-text-opacity: 1;color:color-mix(in srgb,var(--ok) calc(var(--tw-text-opacity) * 100%),transparent)}.text-on-color{--tw-text-opacity: 1;color:color-mix(in srgb,var(--on-color) calc(var(--tw-text-opacity) * 100%),transparent)}.text-on-refract{--tw-text-opacity: 1;color:color-mix(in srgb,var(--on-refract) calc(var(--tw-text-opacity) * 100%),transparent)}.text-p1{--tw-text-opacity: 1;color:color-mix(in srgb,var(--p1) calc(var(--tw-text-opacity) * 100%),transparent)}.text-p2{--tw-text-opacity: 1;color:color-mix(in srgb,var(--p2) calc(var(--tw-text-opacity) * 100%),transparent)}.text-p3{--tw-text-opacity: 1;color:color-mix(in srgb,var(--p3) calc(var(--tw-text-opacity) * 100%),transparent)}.text-prism{--tw-text-opacity: 1;color:color-mix(in srgb,var(--prism) calc(var(--tw-text-opacity) * 100%),transparent)}.text-rail-ink{--tw-text-opacity: 1;color:color-mix(in srgb,var(--rail-ink) calc(var(--tw-text-opacity) * 100%),transparent)}.text-rail-mute{--tw-text-opacity: 1;color:color-mix(in srgb,var(--rail-mute) calc(var(--tw-text-opacity) * 100%),transparent)}.text-refract{--tw-text-opacity: 1;color:color-mix(in srgb,var(--refract) calc(var(--tw-text-opacity) * 100%),transparent)}.text-step-done{--tw-text-opacity: 1;color:color-mix(in srgb,var(--step-done) calc(var(--tw-text-opacity) * 100%),transparent)}.text-step-done\\/90{color:color-mix(in srgb,var(--step-done) 90%,transparent)}.text-step-future{--tw-text-opacity: 1;color:color-mix(in srgb,var(--step-future) calc(var(--tw-text-opacity) * 100%),transparent)}.text-syn-unit{--tw-text-opacity: 1;color:color-mix(in srgb,var(--syn-unit) calc(var(--tw-text-opacity) * 100%),transparent)}.text-syn-val{--tw-text-opacity: 1;color:color-mix(in srgb,var(--syn-val) calc(var(--tw-text-opacity) * 100%),transparent)}.text-traces{--tw-text-opacity: 1;color:color-mix(in srgb,var(--traces) calc(var(--tw-text-opacity) * 100%),transparent)}.text-transparent{color:transparent}.text-universal{--tw-text-opacity: 1;color:color-mix(in srgb,var(--universal) calc(var(--tw-text-opacity) * 100%),transparent)}.text-warn{--tw-text-opacity: 1;color:color-mix(in srgb,var(--warn) calc(var(--tw-text-opacity) * 100%),transparent)}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.underline{text-decoration-line:underline}.decoration-mute\\/60{text-decoration-color:color-mix(in srgb,var(--mute) 60%,transparent)}.decoration-dotted{text-decoration-style:dotted}.underline-offset-\\[3px\\]{text-underline-offset:3px}.opacity-0{opacity:0}.opacity-70{opacity:.7}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_-12px_30px_-18px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\]{--tw-shadow: 0 -12px 30px -18px rgba(0,0,0,.6);--tw-shadow-colored: 0 -12px 30px -18px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_10px_rgba\\(16\\,185\\,129\\,\\.7\\)\\]{--tw-shadow: 0 0 10px rgba(16,185,129,.7);--tw-shadow-colored: 0 0 10px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_14px_rgba\\(0\\,223\\,186\\,\\.7\\)\\]{--tw-shadow: 0 0 14px rgba(0,223,186,.7);--tw-shadow-colored: 0 0 14px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_14px_rgba\\(16\\,185\\,129\\,\\.6\\)\\]{--tw-shadow: 0 0 14px rgba(16,185,129,.6);--tw-shadow-colored: 0 0 14px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_16px_-4px_rgba\\(16\\,185\\,129\\,\\.55\\)\\]{--tw-shadow: 0 0 16px -4px rgba(16,185,129,.55);--tw-shadow-colored: 0 0 16px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_18px_-4px_rgba\\(0\\,223\\,186\\,\\.55\\)\\]{--tw-shadow: 0 0 18px -4px rgba(0,223,186,.55);--tw-shadow-colored: 0 0 18px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_18px_-4px_rgba\\(0\\,223\\,186\\,\\.6\\)\\]{--tw-shadow: 0 0 18px -4px rgba(0,223,186,.6);--tw-shadow-colored: 0 0 18px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_24px_-6px_rgba\\(0\\,223\\,186\\,\\.5\\)\\]{--tw-shadow: 0 0 24px -6px rgba(0,223,186,.5);--tw-shadow-colored: 0 0 24px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[inset_2px_0_0_var\\(--refract\\)\\]{--tw-shadow: inset 2px 0 0 var(--refract);--tw-shadow-colored: inset 2px 0 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-float{--tw-shadow: 0 18px 40px -12px rgba(0, 0, 0, .45);--tw-shadow-colored: 0 18px 40px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-glow-cyan{--tw-shadow: var(--glow-cyan);--tw-shadow-colored: var(--glow-cyan);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-glow-emerald{--tw-shadow: var(--glow-emerald);--tw-shadow-colored: var(--glow-emerald);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-glow-purple{--tw-shadow: var(--glow-purple);--tw-shadow-colored: var(--glow-purple);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-soft{--tw-shadow: 0 4px 20px -2px rgba(0, 0, 0, .12);--tw-shadow-colored: 0 4px 20px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-inset{--tw-ring-inset: inset}.ring-line{--tw-ring-opacity: 1;--tw-ring-color: color-mix(in srgb, var(--line) calc(var(--tw-ring-opacity) * 100%), transparent)}.ring-prism\\/40{--tw-ring-color: color-mix(in srgb, var(--prism) 40% , transparent)}.ring-refract\\/40{--tw-ring-color: color-mix(in srgb, var(--refract) 40% , transparent)}.ring-white\\/5{--tw-ring-color: rgb(255 255 255 / .05)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur{--tw-backdrop-blur: blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-sm{--tw-backdrop-blur: blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-xl{--tw-backdrop-blur: blur(24px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-shadow{transition-property:box-shadow;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200{transition-duration:.2s}:root,:root[data-theme=dark]{--paper: #0B0F19;--surface: #111827;--sunk: #161F30;--raised: #1E293B;--ink: #F1F5F9;--mute: #94A3B8;--line: #1E293B;--line-strong: #334155;--rail: #070A13;--rail-ink: #F1F5F9;--rail-mute: #94A3B8;--rail-line: #1A2234;--step-done: #5EEAD4;--step-future: #8391A7;--refract: #00DFBA;--refract-soft: #062A27;--on-refract: #04121A;--cyan: #06B6D4;--prism: #C084FC;--universal: #818CF8;--logs: #38BDF8;--traces: #C084FC;--metrics: #FBBF24;--p1: #10B981;--p2: #FBBF24;--p3: #FB923C;--warn: #FBBF24;--warnbg: #2A1D05;--bad: #FB7185;--ok: #10B981;--on-color: #0B0F19;--diff-del: #2A1119;--diff-add: #08261F;--syn-key: #22D3EE;--syn-val: #CBD5E1;--syn-unit: #A78BFA;--glow-cyan: 0 0 0 1px rgba(0, 223, 186, .35), 0 0 22px -4px rgba(0, 223, 186, .55);--glow-purple: 0 0 0 1px rgba(168, 85, 247, .35), 0 0 22px -4px rgba(168, 85, 247, .5);--glow-emerald: 0 0 0 1px rgba(16, 185, 129, .35), 0 0 18px -4px rgba(16, 185, 129, .5);--card-bg: rgba(17, 24, 39, .72);--card-accent: rgba(6, 182, 212, .45);--cta-bg: linear-gradient(135deg, #00DFBA 0%, #06B6D4 100%);--page-glow: radial-gradient(900px 500px at 8% -8%, rgba(0, 223, 186, .07), transparent 60%), radial-gradient(800px 480px at 100% 0%, rgba(168, 85, 247, .07), transparent 60%);--skeleton: rgba(30, 41, 59, .6);color-scheme:dark}:root[data-theme=light]{--paper: #F5F7FB;--surface: #FFFFFF;--sunk: #EEF2F7;--raised: #FFFFFF;--ink: #0B1220;--mute: #526175;--line: #E2E8F0;--line-strong: #CBD5E1;--rail: #0B0F19;--rail-ink: #F1F5F9;--rail-mute: #94A3B8;--rail-line: #1A2234;--step-done: #5EEAD4;--step-future: #8391A7;--refract: #0F766E;--refract-soft: #CCFBF1;--on-refract: #FFFFFF;--cyan: #0E7490;--prism: #7E22CE;--universal: #4F46E5;--logs: #0369A1;--traces: #7E22CE;--metrics: #92400E;--p1: #047857;--p2: #92400E;--p3: #C2410C;--warn: #9A3412;--warnbg: #FFEDD5;--bad: #BE123C;--ok: #047857;--on-color: #FFFFFF;--diff-del: #FFE4E6;--diff-add: #D1FAE5;--syn-key: #0E7490;--syn-val: #334155;--syn-unit: #6D28D9;--glow-cyan: 0 0 0 1px rgba(15, 118, 110, .25), 0 6px 18px -6px rgba(15, 118, 110, .45);--glow-purple: 0 0 0 1px rgba(126, 34, 206, .22), 0 6px 18px -6px rgba(126, 34, 206, .4);--glow-emerald: 0 0 0 1px rgba(4, 120, 87, .22), 0 6px 16px -6px rgba(4, 120, 87, .4);--card-bg: rgba(255, 255, 255, .86);--card-accent: rgba(14, 116, 144, .35);--cta-bg: linear-gradient(135deg, #0F766E 0%, #0E7490 100%);--page-glow: radial-gradient(900px 500px at 8% -8%, rgba(15, 118, 110, .06), transparent 60%), radial-gradient(800px 480px at 100% 0%, rgba(126, 34, 206, .05), transparent 60%);--skeleton: rgba(203, 213, 225, .6);color-scheme:light}@media (prefers-color-scheme: light){:root[data-theme=system]{--paper: #F5F7FB;--surface: #FFFFFF;--sunk: #EEF2F7;--raised: #FFFFFF;--ink: #0B1220;--mute: #526175;--line: #E2E8F0;--line-strong: #CBD5E1;--refract: #0F766E;--refract-soft: #CCFBF1;--on-refract: #FFFFFF;--cyan: #0E7490;--prism: #7E22CE;--universal: #4F46E5;--logs: #0369A1;--traces: #7E22CE;--metrics: #92400E;--p1: #047857;--p2: #92400E;--p3: #C2410C;--warn: #9A3412;--warnbg: #FFEDD5;--bad: #BE123C;--ok: #047857;--on-color: #FFFFFF;--diff-del: #FFE4E6;--diff-add: #D1FAE5;--syn-key: #0E7490;--syn-val: #334155;--syn-unit: #6D28D9;--glow-cyan: 0 0 0 1px rgba(15, 118, 110, .25), 0 6px 18px -6px rgba(15, 118, 110, .45);--glow-purple: 0 0 0 1px rgba(126, 34, 206, .22), 0 6px 18px -6px rgba(126, 34, 206, .4);--glow-emerald: 0 0 0 1px rgba(4, 120, 87, .22), 0 6px 16px -6px rgba(4, 120, 87, .4);--card-bg: rgba(255, 255, 255, .86);--card-accent: rgba(14, 116, 144, .35);--cta-bg: linear-gradient(135deg, #0F766E 0%, #0E7490 100%);--page-glow: radial-gradient(900px 500px at 8% -8%, rgba(15, 118, 110, .06), transparent 60%), radial-gradient(800px 480px at 100% 0%, rgba(126, 34, 206, .05), transparent 60%);--skeleton: rgba(203, 213, 225, .6);color-scheme:light}}html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth}html,body,#root{height:100%}body{background:var(--page-glow),var(--paper);background-attachment:fixed;color:var(--ink);letter-spacing:-.006em}@keyframes lens-pulse{50%{opacity:.45}}@keyframes lens-ping{75%,to{transform:scale(2.4);opacity:0}}.tabnum{font-variant-numeric:tabular-nums}:focus-visible{outline:2px solid var(--refract);outline-offset:2px;border-radius:6px}.hatch{background-image:repeating-linear-gradient(135deg,currentColor 0 2px,transparent 2px 7px)}.lens-grow{transition:width .6s cubic-bezier(.2,.7,.2,1)}.no-scrollbar{scrollbar-width:none}.no-scrollbar::-webkit-scrollbar{display:none}@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}kbd{font:600 11px/1 JetBrains Mono,SF Mono,ui-monospace,monospace;border:1px solid var(--line-strong);border-bottom-width:2px;border-radius:6px;padding:3px 6px;background:var(--sunk);color:var(--ink)}select,input,textarea{color-scheme:inherit}.placeholder\\:text-mute\\/70::-moz-placeholder{color:color-mix(in srgb,var(--mute) 70%,transparent)}.placeholder\\:text-mute\\/70::placeholder{color:color-mix(in srgb,var(--mute) 70%,transparent)}.first\\:rounded-l-full:first-child{border-top-left-radius:9999px;border-bottom-left-radius:9999px}.last\\:rounded-r-full:last-child{border-top-right-radius:9999px;border-bottom-right-radius:9999px}.last\\:border-0:last-child{border-width:0px}.hover\\:-translate-y-px:hover{--tw-translate-y: -1px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:\\!border-line-strong:hover{--tw-border-opacity: 1 !important;border-color:color-mix(in srgb,var(--line-strong) calc(var(--tw-border-opacity) * 100%),transparent)!important}.hover\\:\\!border-prism\\/60:hover{border-color:color-mix(in srgb,var(--prism) 60%,transparent)!important}.hover\\:\\!border-refract\\/60:hover{border-color:color-mix(in srgb,var(--refract) 60%,transparent)!important}.hover\\:border-line-strong:hover{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--line-strong) calc(var(--tw-border-opacity) * 100%),transparent)}.hover\\:border-mute:hover{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--mute) calc(var(--tw-border-opacity) * 100%),transparent)}.hover\\:border-refract:hover{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--refract) calc(var(--tw-border-opacity) * 100%),transparent)}.hover\\:border-refract\\/60:hover{border-color:color-mix(in srgb,var(--refract) 60%,transparent)}.hover\\:border-step-done\\/60:hover{border-color:color-mix(in srgb,var(--step-done) 60%,transparent)}.hover\\:bg-bad:hover{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--bad) calc(var(--tw-bg-opacity) * 100%),transparent)}.hover\\:bg-raised:hover{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--raised) calc(var(--tw-bg-opacity) * 100%),transparent)}.hover\\:bg-sunk:hover{--tw-bg-opacity: 1;background-color:color-mix(in srgb,var(--sunk) calc(var(--tw-bg-opacity) * 100%),transparent)}.hover\\:bg-white\\/\\[\\.05\\]:hover{background-color:#ffffff0d}.hover\\:bg-white\\/\\[\\.06\\]:hover{background-color:#ffffff0f}.hover\\:text-bad:hover{--tw-text-opacity: 1;color:color-mix(in srgb,var(--bad) calc(var(--tw-text-opacity) * 100%),transparent)}.hover\\:text-ink:hover{--tw-text-opacity: 1;color:color-mix(in srgb,var(--ink) calc(var(--tw-text-opacity) * 100%),transparent)}.hover\\:text-on-color:hover{--tw-text-opacity: 1;color:color-mix(in srgb,var(--on-color) calc(var(--tw-text-opacity) * 100%),transparent)}.hover\\:text-rail-ink:hover{--tw-text-opacity: 1;color:color-mix(in srgb,var(--rail-ink) calc(var(--tw-text-opacity) * 100%),transparent)}.hover\\:text-refract:hover{--tw-text-opacity: 1;color:color-mix(in srgb,var(--refract) calc(var(--tw-text-opacity) * 100%),transparent)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-100:hover{opacity:1}.hover\\:shadow-glow-purple:hover{--tw-shadow: var(--glow-purple);--tw-shadow-colored: var(--glow-purple);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.focus\\:border-refract:focus{--tw-border-opacity: 1;border-color:color-mix(in srgb,var(--refract) calc(var(--tw-border-opacity) * 100%),transparent)}.focus\\:shadow-glow-cyan:focus{--tw-shadow: var(--glow-cyan);--tw-shadow-colored: var(--glow-cyan);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.active\\:scale-\\[0\\.98\\]:active{--tw-scale-x: .98;--tw-scale-y: .98;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:shadow-none:disabled{--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.group[open] .group-open\\:rotate-90{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.group\\/term:focus-within .group-focus-within\\/term\\:opacity-100{opacity:1}.group\\/term:hover .group-hover\\/term\\:opacity-100{opacity:1}@media (min-width: 640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\\:grid-cols-\\[1fr_140px\\]{grid-template-columns:1fr 140px}}@media (min-width: 768px){.md\\:flex{display:flex}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-\\[220px_1fr\\]{grid-template-columns:220px 1fr}}@media (min-width: 1024px){.lg\\:sticky{position:sticky}.lg\\:top-4{top:1rem}.lg\\:inline{display:inline}.lg\\:grid-cols-\\[1fr_340px\\]{grid-template-columns:1fr 340px}.lg\\:grid-cols-\\[380px_1fr\\]{grid-template-columns:380px 1fr}}@media (min-width: 1280px){.xl\\:not-sr-only{position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal}.xl\\:inline{display:inline}.xl\\:w-4{width:1rem}}@media (min-width: 1536px){.\\32xl\\:grid-cols-\\[minmax\\(0\\,5fr\\)_minmax\\(0\\,7fr\\)\\]{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}}';
class Ad extends HTMLElement {
  constructor() {
    super(...arguments);
    wi(this, "root");
  }
  connectedCallback() {
    const r = this.attachShadow({ mode: "open" }), n = document.createElement("style");
    n.textContent = jd.replace(/:root\[([^\]]+)\]/g, ":host([$1])").replace(/:root/g, ":host"), r.appendChild(n);
    const o = document.createElement("div");
    r.appendChild(o), this.getAttribute("api") && Ls(this.getAttribute("api")), this.getAttribute("token") && (window.__CXLENS_TOKEN__ = this.getAttribute("token")), this.root = zs(o), this.root.render(/* @__PURE__ */ Ts.jsx(Ds, {}));
  }
  disconnectedCallback() {
    var r;
    (r = this.root) == null || r.unmount();
  }
}
customElements.get("coralogix-lens") || customElements.define("coralogix-lens", Ad);
export {
  Ad as CoralogixLensElement
};
