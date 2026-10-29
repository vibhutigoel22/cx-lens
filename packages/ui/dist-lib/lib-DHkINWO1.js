function Ai(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var vn = { exports: {} }, qt = {}, Sn = { exports: {} }, D = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gt = Symbol.for("react.element"), Ei = Symbol.for("react.portal"), Ii = Symbol.for("react.fragment"), Li = Symbol.for("react.strict_mode"), Mi = Symbol.for("react.profiler"), Ti = Symbol.for("react.provider"), Oi = Symbol.for("react.context"), Pi = Symbol.for("react.forward_ref"), Bi = Symbol.for("react.suspense"), Di = Symbol.for("react.memo"), Ri = Symbol.for("react.lazy"), _s = Symbol.iterator;
function Ki(t) {
  return t === null || typeof t != "object" ? null : (t = _s && t[_s] || t["@@iterator"], typeof t == "function" ? t : null);
}
var Cn = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, An = Object.assign, En = {};
function _e(t, e, s) {
  this.props = t, this.context = e, this.refs = En, this.updater = s || Cn;
}
_e.prototype.isReactComponent = {};
_e.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
_e.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function In() {
}
In.prototype = _e.prototype;
function Es(t, e, s) {
  this.props = t, this.context = e, this.refs = En, this.updater = s || Cn;
}
var Is = Es.prototype = new In();
Is.constructor = Es;
An(Is, _e.prototype);
Is.isPureReactComponent = !0;
var en = Array.isArray, Ln = Object.prototype.hasOwnProperty, Ls = { current: null }, Mn = { key: !0, ref: !0, __self: !0, __source: !0 };
function Tn(t, e, s) {
  var n, a = {}, r = null, l = null;
  if (e != null) for (n in e.ref !== void 0 && (l = e.ref), e.key !== void 0 && (r = "" + e.key), e) Ln.call(e, n) && !Mn.hasOwnProperty(n) && (a[n] = e[n]);
  var o = arguments.length - 2;
  if (o === 1) a.children = s;
  else if (1 < o) {
    for (var d = Array(o), c = 0; c < o; c++) d[c] = arguments[c + 2];
    a.children = d;
  }
  if (t && t.defaultProps) for (n in o = t.defaultProps, o) a[n] === void 0 && (a[n] = o[n]);
  return { $$typeof: gt, type: t, key: r, ref: l, props: a, _owner: Ls.current };
}
function Fi(t, e) {
  return { $$typeof: gt, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function Ms(t) {
  return typeof t == "object" && t !== null && t.$$typeof === gt;
}
function Qi(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(s) {
    return e[s];
  });
}
var tn = /\/+/g;
function ls(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? Qi("" + t.key) : e.toString(36);
}
function Mt(t, e, s, n, a) {
  var r = typeof t;
  (r === "undefined" || r === "boolean") && (t = null);
  var l = !1;
  if (t === null) l = !0;
  else switch (r) {
    case "string":
    case "number":
      l = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case gt:
        case Ei:
          l = !0;
      }
  }
  if (l) return l = t, a = a(l), t = n === "" ? "." + ls(l, 0) : n, en(a) ? (s = "", t != null && (s = t.replace(tn, "$&/") + "/"), Mt(a, e, s, "", function(c) {
    return c;
  })) : a != null && (Ms(a) && (a = Fi(a, s + (!a.key || l && l.key === a.key ? "" : ("" + a.key).replace(tn, "$&/") + "/") + t)), e.push(a)), 1;
  if (l = 0, n = n === "" ? "." : n + ":", en(t)) for (var o = 0; o < t.length; o++) {
    r = t[o];
    var d = n + ls(r, o);
    l += Mt(r, e, s, d, a);
  }
  else if (d = Ki(t), typeof d == "function") for (t = d.call(t), o = 0; !(r = t.next()).done; ) r = r.value, d = n + ls(r, o++), l += Mt(r, e, s, d, a);
  else if (r === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return l;
}
function vt(t, e, s) {
  if (t == null) return t;
  var n = [], a = 0;
  return Mt(t, n, "", "", function(r) {
    return e.call(s, r, a++);
  }), n;
}
function zi(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(s) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = s);
    }, function(s) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = s);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var ae = { current: null }, Tt = { transition: null }, Ui = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: Tt, ReactCurrentOwner: Ls };
function On() {
  throw Error("act(...) is not supported in production builds of React.");
}
D.Children = { map: vt, forEach: function(t, e, s) {
  vt(t, function() {
    e.apply(this, arguments);
  }, s);
}, count: function(t) {
  var e = 0;
  return vt(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return vt(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!Ms(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
D.Component = _e;
D.Fragment = Ii;
D.Profiler = Mi;
D.PureComponent = Es;
D.StrictMode = Li;
D.Suspense = Bi;
D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ui;
D.act = On;
D.cloneElement = function(t, e, s) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var n = An({}, t.props), a = t.key, r = t.ref, l = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (r = e.ref, l = Ls.current), e.key !== void 0 && (a = "" + e.key), t.type && t.type.defaultProps) var o = t.type.defaultProps;
    for (d in e) Ln.call(e, d) && !Mn.hasOwnProperty(d) && (n[d] = e[d] === void 0 && o !== void 0 ? o[d] : e[d]);
  }
  var d = arguments.length - 2;
  if (d === 1) n.children = s;
  else if (1 < d) {
    o = Array(d);
    for (var c = 0; c < d; c++) o[c] = arguments[c + 2];
    n.children = o;
  }
  return { $$typeof: gt, type: t.type, key: a, ref: r, props: n, _owner: l };
};
D.createContext = function(t) {
  return t = { $$typeof: Oi, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: Ti, _context: t }, t.Consumer = t;
};
D.createElement = Tn;
D.createFactory = function(t) {
  var e = Tn.bind(null, t);
  return e.type = t, e;
};
D.createRef = function() {
  return { current: null };
};
D.forwardRef = function(t) {
  return { $$typeof: Pi, render: t };
};
D.isValidElement = Ms;
D.lazy = function(t) {
  return { $$typeof: Ri, _payload: { _status: -1, _result: t }, _init: zi };
};
D.memo = function(t, e) {
  return { $$typeof: Di, type: t, compare: e === void 0 ? null : e };
};
D.startTransition = function(t) {
  var e = Tt.transition;
  Tt.transition = {};
  try {
    t();
  } finally {
    Tt.transition = e;
  }
};
D.unstable_act = On;
D.useCallback = function(t, e) {
  return ae.current.useCallback(t, e);
};
D.useContext = function(t) {
  return ae.current.useContext(t);
};
D.useDebugValue = function() {
};
D.useDeferredValue = function(t) {
  return ae.current.useDeferredValue(t);
};
D.useEffect = function(t, e) {
  return ae.current.useEffect(t, e);
};
D.useId = function() {
  return ae.current.useId();
};
D.useImperativeHandle = function(t, e, s) {
  return ae.current.useImperativeHandle(t, e, s);
};
D.useInsertionEffect = function(t, e) {
  return ae.current.useInsertionEffect(t, e);
};
D.useLayoutEffect = function(t, e) {
  return ae.current.useLayoutEffect(t, e);
};
D.useMemo = function(t, e) {
  return ae.current.useMemo(t, e);
};
D.useReducer = function(t, e, s) {
  return ae.current.useReducer(t, e, s);
};
D.useRef = function(t) {
  return ae.current.useRef(t);
};
D.useState = function(t) {
  return ae.current.useState(t);
};
D.useSyncExternalStore = function(t, e, s) {
  return ae.current.useSyncExternalStore(t, e, s);
};
D.useTransition = function() {
  return ae.current.useTransition();
};
D.version = "18.3.1";
Sn.exports = D;
var N = Sn.exports;
const Ji = /* @__PURE__ */ Ai(N);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hi = N, Yi = Symbol.for("react.element"), Gi = Symbol.for("react.fragment"), qi = Object.prototype.hasOwnProperty, Vi = Hi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Xi = { key: !0, ref: !0, __self: !0, __source: !0 };
function Pn(t, e, s) {
  var n, a = {}, r = null, l = null;
  s !== void 0 && (r = "" + s), e.key !== void 0 && (r = "" + e.key), e.ref !== void 0 && (l = e.ref);
  for (n in e) qi.call(e, n) && !Xi.hasOwnProperty(n) && (a[n] = e[n]);
  if (t && t.defaultProps) for (n in e = t.defaultProps, e) a[n] === void 0 && (a[n] = e[n]);
  return { $$typeof: Yi, type: t, key: r, ref: l, props: a, _owner: Vi.current };
}
qt.Fragment = Gi;
qt.jsx = Pn;
qt.jsxs = Pn;
vn.exports = qt;
var i = vn.exports;
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wi = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Bn = (...t) => t.filter((e, s, n) => !!e && n.indexOf(e) === s).join(" ");
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Zi = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $i = N.forwardRef(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: n,
    className: a = "",
    children: r,
    iconNode: l,
    ...o
  }, d) => N.createElement(
    "svg",
    {
      ref: d,
      ...Zi,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: n ? Number(s) * 24 / Number(e) : s,
      className: Bn("lucide", a),
      ...o
    },
    [
      ...l.map(([c, m]) => N.createElement(c, m)),
      ...Array.isArray(r) ? r : [r]
    ]
  )
);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O = (t, e) => {
  const s = N.forwardRef(
    ({ className: n, ...a }, r) => N.createElement($i, {
      ref: r,
      iconNode: e,
      className: Bn(`lucide-${Wi(t)}`, n),
      ...a
    })
  );
  return s.displayName = `${t}`, s;
};
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _i = O("Activity", [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sn = O("Archive", [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ea = O("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ta = O("BarChart3", [
  ["path", { d: "M3 3v18h18", key: "1s2lah" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xt = O("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const le = O("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Se = O("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dt = O("CircleDashed", [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0", key: "5ilxe3" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0", key: "11zvb9" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7", key: "1iw5b2" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8", key: "c0bmvh" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69", key: "1ruxm7" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8", key: "qkgqxc" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69", key: "1mcia2" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7", key: "1fvljs" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vt = O("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sa = O("ClipboardCheck", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const na = O("Cloud", [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dn = O("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nn = O("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rn = O("FileDown", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }],
  ["path", { d: "m9 15 3 3 3-3", key: "1npd3o" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ia = O("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aa = O("FlaskConical", [
  [
    "path",
    {
      d: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",
      key: "pzvekw"
    }
  ],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }],
  ["path", { d: "M7 16h10", key: "wp8him" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ra = O("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const la = O("GitPullRequestArrow", [
  ["circle", { cx: "5", cy: "6", r: "3", key: "1qnov2" }],
  ["path", { d: "M5 9v12", key: "ih889a" }],
  ["circle", { cx: "19", cy: "18", r: "3", key: "1qljk2" }],
  ["path", { d: "m15 9-3-3 3-3", key: "1lwv8l" }],
  ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7", key: "1yj91y" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ts = O("KeyRound", [
  ["path", { d: "M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z", key: "167ctg" }],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oa = O("Layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "8b97xw"
    }
  ],
  ["path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "dd6zsq" }],
  ["path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "ep9fru" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ke = O("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rt = O("Microscope", [
  ["path", { d: "M6 18h8", key: "1borvv" }],
  ["path", { d: "M3 22h18", key: "8prr45" }],
  ["path", { d: "M14 22a7 7 0 1 0 0-14h-1", key: "1jwaiy" }],
  ["path", { d: "M9 14h2", key: "197e7h" }],
  ["path", { d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z", key: "1bmzmy" }],
  ["path", { d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3", key: "1drr47" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ca = O("Monitor", [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const da = O("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ua = O("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kn = O("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ha = O("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fa = O("ScrollText", [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const an = O("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fn = O("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ma = O("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pa = O("Tags", [
  ["path", { d: "m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19", key: "1cbfv1" }],
  [
    "path",
    {
      d: "M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z",
      key: "135mg7"
    }
  ],
  ["circle", { cx: "6.5", cy: "9.5", r: ".5", fill: "currentColor", key: "5pm5xn" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ga = O("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xa = O("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ya = O("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ba = O("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wa = O("Waypoints", [
  ["circle", { cx: "12", cy: "4.5", r: "2.5", key: "r5ysbb" }],
  ["path", { d: "m10.2 6.3-3.9 3.9", key: "1nzqf6" }],
  ["circle", { cx: "4.5", cy: "12", r: "2.5", key: "jydg6v" }],
  ["path", { d: "M7 12h10", key: "b7w52i" }],
  ["circle", { cx: "19.5", cy: "12", r: "2.5", key: "1piiel" }],
  ["path", { d: "m13.8 17.7 3.9-3.9", key: "1wyg1y" }],
  ["circle", { cx: "12", cy: "19.5", r: "2.5", key: "13o1pw" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ka = O("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Os = () => {
  var t;
  return ((t = document.querySelector('meta[name="cxlens-token"]')) == null ? void 0 : t.content) ?? window.__CXLENS_TOKEN__ ?? "";
};
let Xt = window.__CXLENS_API__ ?? "";
const xl = (t) => {
  Xt = t;
};
async function G(t, e = {}) {
  const s = await fetch(Xt + t, { ...e, headers: { "content-type": "application/json", "X-CxLens-Token": Os(), ...e.headers ?? {} } }), n = await s.json().catch(() => ({}));
  if (!s.ok) throw new Error(n.error ?? `Request failed (${s.status})`);
  return n;
}
function ja(t, e) {
  const s = new URL(Xt || location.href);
  s.protocol = s.protocol === "https:" ? "wss:" : "ws:", s.pathname = "/ws", s.search = `?run=${t}&token=${Os()}`;
  const n = new WebSocket(s);
  return n.onmessage = (a) => e(JSON.parse(a.data)), () => n.close();
}
function Kt(t, e) {
  const s = document.createElement("a");
  s.href = URL.createObjectURL(new Blob([e], { type: t.endsWith(".html") ? "text/html" : t.endsWith(".json") ? "application/json" : "text/plain" })), s.download = t, s.click(), setTimeout(() => URL.revokeObjectURL(s.href), 1e3);
}
async function Na(t, e, s) {
  const n = await fetch(Xt + t, { method: "POST", headers: { "content-type": "application/json", "X-CxLens-Token": Os() }, body: JSON.stringify(e) });
  if (!n.ok) {
    const d = await n.json().catch(() => ({}));
    throw new Error(d.error ?? `Download failed (${n.status})`);
  }
  const a = n.headers.get("content-disposition") ?? "", r = a.match(/filename\*=UTF-8''([^;]+)/) ?? a.match(/filename="([^"]+)"/), l = r ? decodeURIComponent(r[1]) : s, o = document.createElement("a");
  return o.href = URL.createObjectURL(await n.blob()), o.download = l, o.click(), setTimeout(() => URL.revokeObjectURL(o.href), 2e3), l;
}
const Ps = Symbol.for("yaml.alias"), ks = Symbol.for("yaml.document"), Ie = Symbol.for("yaml.map"), Qn = Symbol.for("yaml.pair"), be = Symbol.for("yaml.scalar"), et = Symbol.for("yaml.seq"), fe = Symbol.for("yaml.node.type"), tt = (t) => !!t && typeof t == "object" && t[fe] === Ps, Wt = (t) => !!t && typeof t == "object" && t[fe] === ks, yt = (t) => !!t && typeof t == "object" && t[fe] === Ie, X = (t) => !!t && typeof t == "object" && t[fe] === Qn, U = (t) => !!t && typeof t == "object" && t[fe] === be, bt = (t) => !!t && typeof t == "object" && t[fe] === et;
function q(t) {
  if (t && typeof t == "object")
    switch (t[fe]) {
      case Ie:
      case et:
        return !0;
    }
  return !1;
}
function V(t) {
  if (t && typeof t == "object")
    switch (t[fe]) {
      case Ps:
      case Ie:
      case be:
      case et:
        return !0;
    }
  return !1;
}
const zn = (t) => (U(t) || q(t)) && !!t.anchor, Pe = Symbol("break visit"), va = Symbol("skip children"), ut = Symbol("remove node");
function st(t, e) {
  const s = Sa(e);
  Wt(t) ? Ye(null, t.contents, s, Object.freeze([t])) === ut && (t.contents = null) : Ye(null, t, s, Object.freeze([]));
}
st.BREAK = Pe;
st.SKIP = va;
st.REMOVE = ut;
function Ye(t, e, s, n) {
  const a = Ca(t, e, s, n);
  if (V(a) || X(a))
    return Aa(t, n, a), Ye(t, a, s, n);
  if (typeof a != "symbol") {
    if (q(e)) {
      n = Object.freeze(n.concat(e));
      for (let r = 0; r < e.items.length; ++r) {
        const l = Ye(r, e.items[r], s, n);
        if (typeof l == "number")
          r = l - 1;
        else {
          if (l === Pe)
            return Pe;
          l === ut && (e.items.splice(r, 1), r -= 1);
        }
      }
    } else if (X(e)) {
      n = Object.freeze(n.concat(e));
      const r = Ye("key", e.key, s, n);
      if (r === Pe)
        return Pe;
      r === ut && (e.key = null);
      const l = Ye("value", e.value, s, n);
      if (l === Pe)
        return Pe;
      l === ut && (e.value = null);
    }
  }
  return a;
}
function Sa(t) {
  return typeof t == "object" && (t.Collection || t.Node || t.Value) ? Object.assign({
    Alias: t.Node,
    Map: t.Node,
    Scalar: t.Node,
    Seq: t.Node
  }, t.Value && {
    Map: t.Value,
    Scalar: t.Value,
    Seq: t.Value
  }, t.Collection && {
    Map: t.Collection,
    Seq: t.Collection
  }, t) : t;
}
function Ca(t, e, s, n) {
  var a, r, l, o, d;
  if (typeof s == "function")
    return s(t, e, n);
  if (yt(e))
    return (a = s.Map) == null ? void 0 : a.call(s, t, e, n);
  if (bt(e))
    return (r = s.Seq) == null ? void 0 : r.call(s, t, e, n);
  if (X(e))
    return (l = s.Pair) == null ? void 0 : l.call(s, t, e, n);
  if (U(e))
    return (o = s.Scalar) == null ? void 0 : o.call(s, t, e, n);
  if (tt(e))
    return (d = s.Alias) == null ? void 0 : d.call(s, t, e, n);
}
function Aa(t, e, s) {
  const n = e[e.length - 1];
  if (q(n))
    n.items[t] = s;
  else if (X(n))
    t === "key" ? n.key = s : n.value = s;
  else if (Wt(n))
    n.contents = s;
  else {
    const a = tt(n) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${a} parent`);
  }
}
const Ea = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, Ia = (t) => t.replace(/[!,[\]{}]/g, (e) => Ea[e]);
class ne {
  constructor(e, s) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, ne.defaultYaml, e), this.tags = Object.assign({}, ne.defaultTags, s);
  }
  clone() {
    const e = new ne(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const e = new ne(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: ne.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, ne.defaultTags);
        break;
    }
    return e;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(e, s) {
    this.atNextDocument && (this.yaml = { explicit: ne.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, ne.defaultTags), this.atNextDocument = !1);
    const n = e.trim().split(/[ \t]+/), a = n.shift();
    switch (a) {
      case "%TAG": {
        if (n.length !== 2 && (s(0, "%TAG directive should contain exactly two parts"), n.length < 2))
          return !1;
        const [r, l] = n;
        return this.tags[r] = l, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, n.length !== 1)
          return s(0, "%YAML directive should contain exactly one part"), !1;
        const [r] = n;
        if (r === "1.1" || r === "1.2")
          return this.yaml.version = r, !0;
        {
          const l = /^\d+\.\d+$/.test(r);
          return s(6, `Unsupported YAML version ${r}`, l), !1;
        }
      }
      default:
        return s(0, `Unknown directive ${a}`, !0), !1;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(e, s) {
    if (e === "!")
      return "!";
    if (e[0] !== "!")
      return s(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const l = e.slice(2, -1);
      return l === "!" || l === "!!" ? (s(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && s("Verbatim tags must end with a >"), l);
    }
    const [, n, a] = e.match(/^(.*!)([^!]*)$/s);
    a || s(`The ${e} tag has no suffix`);
    const r = this.tags[n];
    if (r)
      try {
        return r + decodeURIComponent(a);
      } catch (l) {
        return s(String(l)), null;
      }
    return n === "!" ? e : (s(`Could not resolve tag: ${e}`), null);
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(e) {
    for (const [s, n] of Object.entries(this.tags))
      if (e.startsWith(n))
        return s + Ia(e.substring(n.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const s = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags);
    let a;
    if (e && n.length > 0 && V(e.contents)) {
      const r = {};
      st(e.contents, (l, o) => {
        V(o) && o.tag && (r[o.tag] = !0);
      }), a = Object.keys(r);
    } else
      a = [];
    for (const [r, l] of n)
      r === "!!" && l === "tag:yaml.org,2002:" || (!e || a.some((o) => o.startsWith(l))) && s.push(`%TAG ${r} ${l}`);
    return s.join(`
`);
  }
}
ne.defaultYaml = { explicit: !1, version: "1.2" };
ne.defaultTags = { "!!": "tag:yaml.org,2002:" };
function Un(t) {
  if (/[\x00-\x19\s,[\]{}]/.test(t)) {
    const s = `Anchor must not contain whitespace or control characters: ${JSON.stringify(t)}`;
    throw new Error(s);
  }
  return !0;
}
function Jn(t) {
  const e = /* @__PURE__ */ new Set();
  return st(t, {
    Value(s, n) {
      n.anchor && e.add(n.anchor);
    }
  }), e;
}
function Hn(t, e) {
  for (let s = 1; ; ++s) {
    const n = `${t}${s}`;
    if (!e.has(n))
      return n;
  }
}
function La(t, e) {
  const s = [], n = /* @__PURE__ */ new Map();
  let a = null;
  return {
    onAnchor: (r) => {
      s.push(r), a ?? (a = Jn(t));
      const l = Hn(e, a);
      return a.add(l), l;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const r of s) {
        const l = n.get(r);
        if (typeof l == "object" && l.anchor && (U(l.node) || q(l.node)))
          l.node.anchor = l.anchor;
        else {
          const o = new Error("Failed to resolve repeated object (this should not happen)");
          throw o.source = r, o;
        }
      }
    },
    sourceObjects: n
  };
}
function Ge(t, e, s, n) {
  if (n && typeof n == "object")
    if (Array.isArray(n))
      for (let a = 0, r = n.length; a < r; ++a) {
        const l = n[a], o = Ge(t, n, String(a), l);
        o === void 0 ? delete n[a] : o !== l && (n[a] = o);
      }
    else if (n instanceof Map)
      for (const a of Array.from(n.keys())) {
        const r = n.get(a), l = Ge(t, n, a, r);
        l === void 0 ? n.delete(a) : l !== r && n.set(a, l);
      }
    else if (n instanceof Set)
      for (const a of Array.from(n)) {
        const r = Ge(t, n, a, a);
        r === void 0 ? n.delete(a) : r !== a && (n.delete(a), n.add(r));
      }
    else
      for (const [a, r] of Object.entries(n)) {
        const l = Ge(t, n, a, r);
        l === void 0 ? delete n[a] : l !== r && (n[a] = l);
      }
  return t.call(e, s, n);
}
function he(t, e, s) {
  if (Array.isArray(t))
    return t.map((n, a) => he(n, String(a), s));
  if (t && typeof t.toJSON == "function") {
    if (!s || !zn(t))
      return t.toJSON(e, s);
    const n = { aliasCount: 0, count: 1, res: void 0 };
    s.anchors.set(t, n), s.onCreate = (r) => {
      n.res = r, delete s.onCreate;
    };
    const a = t.toJSON(e, s);
    return s.onCreate && s.onCreate(a), a;
  }
  return typeof t == "bigint" && !(s != null && s.keep) ? Number(t) : t;
}
class Bs {
  constructor(e) {
    Object.defineProperty(this, fe, { value: e });
  }
  /** Create a copy of this node.  */
  clone() {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (e.range = this.range.slice()), e;
  }
  /** A plain JavaScript representation of this node. */
  toJS(e, { mapAsMap: s, maxAliasCount: n, onAnchor: a, reviver: r } = {}) {
    if (!Wt(e))
      throw new TypeError("A document argument is required");
    const l = {
      anchors: /* @__PURE__ */ new Map(),
      doc: e,
      keep: !0,
      mapAsMap: s === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof n == "number" ? n : 100
    }, o = he(this, "", l);
    if (typeof a == "function")
      for (const { count: d, res: c } of l.anchors.values())
        a(c, d);
    return typeof r == "function" ? Ge(r, { "": o }, "", o) : o;
  }
}
class Ds extends Bs {
  constructor(e) {
    super(Ps), this.source = e, Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(e, s) {
    if ((s == null ? void 0 : s.maxAliasCount) === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let n;
    s != null && s.aliasResolveCache ? n = s.aliasResolveCache : (n = [], st(e, {
      Node: (r, l) => {
        (tt(l) || zn(l)) && n.push(l);
      }
    }), s && (s.aliasResolveCache = n));
    let a;
    for (const r of n) {
      if (r === this)
        break;
      r.anchor === this.source && (a = r);
    }
    if (a && s) {
      const { anchors: r, doc: l, maxAliasCount: o } = s;
      let d = r.get(a);
      if (d || (he(a, null, s), d = r.get(a)), (d == null ? void 0 : d.res) === void 0) {
        const c = "This should not happen: Alias anchor was not resolved?";
        throw new ReferenceError(c);
      }
      if (o >= 0 && (d.count += 1, d.aliasCount === 0 && (d.aliasCount = Ot(l, a, r)), d.count * d.aliasCount > o)) {
        const c = "Excessive alias count indicates a resource exhaustion attack";
        throw new ReferenceError(c);
      }
    }
    return a;
  }
  toJSON(e, s) {
    if (!s)
      return { source: this.source };
    const n = this.resolve(s.doc, s);
    if (!n) {
      const a = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(a);
    }
    return s.anchors.get(n).res;
  }
  toString(e, s, n) {
    const a = `*${this.source}`;
    if (e) {
      if (Un(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
        const r = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(r);
      }
      if (e.implicitKey)
        return `${a} `;
    }
    return a;
  }
}
function Ot(t, e, s) {
  if (tt(e)) {
    const n = e.resolve(t), a = s && n && s.get(n);
    return a ? a.count * a.aliasCount : 0;
  } else if (q(e)) {
    let n = 0;
    for (const a of e.items) {
      const r = Ot(t, a, s);
      r > n && (n = r);
    }
    return n;
  } else if (X(e)) {
    const n = Ot(t, e.key, s), a = Ot(t, e.value, s);
    return Math.max(n, a);
  }
  return 1;
}
const Yn = (t) => !t || typeof t != "function" && typeof t != "object";
class T extends Bs {
  constructor(e) {
    super(be), this.value = e;
  }
  toJSON(e, s) {
    return s != null && s.keep ? this.value : he(this.value, e, s);
  }
  toString() {
    return String(this.value);
  }
}
T.BLOCK_FOLDED = "BLOCK_FOLDED";
T.BLOCK_LITERAL = "BLOCK_LITERAL";
T.PLAIN = "PLAIN";
T.QUOTE_DOUBLE = "QUOTE_DOUBLE";
T.QUOTE_SINGLE = "QUOTE_SINGLE";
const Ma = "tag:yaml.org,2002:";
function Ta(t, e, s) {
  if (e) {
    const n = s.filter((r) => r.tag === e), a = n.find((r) => !r.format) ?? n[0];
    if (!a)
      throw new Error(`Tag ${e} not found`);
    return a;
  }
  return s.find((n) => {
    var a;
    return ((a = n.identify) == null ? void 0 : a.call(n, t)) && !n.format;
  });
}
function mt(t, e, s) {
  var f, p, h;
  if (Wt(t) && (t = t.contents), V(t))
    return t;
  if (X(t)) {
    const x = (p = (f = s.schema[Ie]).createNode) == null ? void 0 : p.call(f, s.schema, null, s);
    return x.items.push(t), x;
  }
  (t instanceof String || t instanceof Number || t instanceof Boolean || typeof BigInt < "u" && t instanceof BigInt) && (t = t.valueOf());
  const { aliasDuplicateObjects: n, onAnchor: a, onTagObj: r, schema: l, sourceObjects: o } = s;
  let d;
  if (n && t && typeof t == "object") {
    if (d = o.get(t), d)
      return d.anchor ?? (d.anchor = a(t)), new Ds(d.anchor);
    d = { anchor: null, node: null }, o.set(t, d);
  }
  e != null && e.startsWith("!!") && (e = Ma + e.slice(2));
  let c = Ta(t, e, l.tags);
  if (!c) {
    if (t && typeof t.toJSON == "function" && (t = t.toJSON()), !t || typeof t != "object") {
      const x = new T(t);
      return d && (d.node = x), x;
    }
    c = t instanceof Map ? l[Ie] : Symbol.iterator in Object(t) ? l[et] : l[Ie];
  }
  r && (r(c), delete s.onTagObj);
  const m = c != null && c.createNode ? c.createNode(s.schema, t, s) : typeof ((h = c == null ? void 0 : c.nodeClass) == null ? void 0 : h.from) == "function" ? c.nodeClass.from(s.schema, t, s) : new T(t);
  return e ? m.tag = e : c.default || (m.tag = c.tag), d && (d.node = m), m;
}
function Ft(t, e, s) {
  let n = s;
  for (let a = e.length - 1; a >= 0; --a) {
    const r = e[a];
    if (typeof r == "number" && Number.isInteger(r) && r >= 0) {
      const l = [];
      l[r] = n, n = l;
    } else
      n = /* @__PURE__ */ new Map([[r, n]]);
  }
  return mt(n, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: t,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
const ct = (t) => t == null || typeof t == "object" && !!t[Symbol.iterator]().next().done;
class Gn extends Bs {
  constructor(e, s) {
    super(e), Object.defineProperty(this, "schema", {
      value: s,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(e) {
    const s = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return e && (s.schema = e), s.items = s.items.map((n) => V(n) || X(n) ? n.clone(e) : n), this.range && (s.range = this.range.slice()), s;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(e, s) {
    if (ct(e))
      this.add(s);
    else {
      const [n, ...a] = e, r = this.get(n, !0);
      if (q(r))
        r.addIn(a, s);
      else if (r === void 0 && this.schema)
        this.set(n, Ft(this.schema, a, s));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${a}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    const [s, ...n] = e;
    if (n.length === 0)
      return this.delete(s);
    const a = this.get(s, !0);
    if (q(a))
      return a.deleteIn(n);
    throw new Error(`Expected YAML collection at ${s}. Remaining path: ${n}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, s) {
    const [n, ...a] = e, r = this.get(n, !0);
    return a.length === 0 ? !s && U(r) ? r.value : r : q(r) ? r.getIn(a, s) : void 0;
  }
  hasAllNullValues(e) {
    return this.items.every((s) => {
      if (!X(s))
        return !1;
      const n = s.value;
      return n == null || e && U(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(e) {
    const [s, ...n] = e;
    if (n.length === 0)
      return this.has(s);
    const a = this.get(s, !0);
    return q(a) ? a.hasIn(n) : !1;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, s) {
    const [n, ...a] = e;
    if (a.length === 0)
      this.set(n, s);
    else {
      const r = this.get(n, !0);
      if (q(r))
        r.setIn(a, s);
      else if (r === void 0 && this.schema)
        this.set(n, Ft(this.schema, a, s));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${a}`);
    }
  }
}
const Oa = (t) => t.replace(/^(?!$)(?: $)?/gm, "#");
function je(t, e) {
  return /^\n+$/.test(t) ? t.substring(1) : e ? t.replace(/^(?! *$)/gm, e) : t;
}
const Be = (t, e, s) => t.endsWith(`
`) ? je(s, e) : s.includes(`
`) ? `
` + je(s, e) : (t.endsWith(" ") ? "" : " ") + s, qn = "flow", js = "block", Pt = "quoted";
function Zt(t, e, s = "flow", { indentAtStart: n, lineWidth: a = 80, minContentWidth: r = 20, onFold: l, onOverflow: o } = {}) {
  if (!a || a < 0)
    return t;
  a < r && (r = 0);
  const d = Math.max(1 + r, 1 + a - e.length);
  if (t.length <= d)
    return t;
  const c = [], m = {};
  let f = a - e.length;
  typeof n == "number" && (n > a - Math.max(2, r) ? c.push(0) : f = a - n);
  let p, h, x = !1, u = -1, g = -1, k = -1;
  s === js && (u = rn(t, u, e.length), u !== -1 && (f = u + d));
  for (let S; S = t[u += 1]; ) {
    if (s === Pt && S === "\\") {
      switch (g = u, t[u + 1]) {
        case "x":
          u += 3;
          break;
        case "u":
          u += 5;
          break;
        case "U":
          u += 9;
          break;
        default:
          u += 1;
      }
      k = u;
    }
    if (S === `
`)
      s === js && (u = rn(t, u, e.length)), f = u + e.length + d, p = void 0;
    else {
      if (S === " " && h && h !== " " && h !== `
` && h !== "	") {
        const C = t[u + 1];
        C && C !== " " && C !== `
` && C !== "	" && (p = u);
      }
      if (u >= f)
        if (p)
          c.push(p), f = p + d, p = void 0;
        else if (s === Pt) {
          for (; h === " " || h === "	"; )
            h = S, S = t[u += 1], x = !0;
          const C = u > k + 1 ? u - 2 : g - 1;
          if (m[C])
            return t;
          c.push(C), m[C] = !0, f = C + d, p = void 0;
        } else
          x = !0;
    }
    h = S;
  }
  if (x && o && o(), c.length === 0)
    return t;
  l && l();
  let y = t.slice(0, c[0]);
  for (let S = 0; S < c.length; ++S) {
    const C = c[S], I = c[S + 1] || t.length;
    C === 0 ? y = `
${e}${t.slice(0, I)}` : (s === Pt && m[C] && (y += `${t[C]}\\`), y += `
${e}${t.slice(C + 1, I)}`);
  }
  return y;
}
function rn(t, e, s) {
  let n = e, a = e + 1, r = t[a];
  for (; r === " " || r === "	"; )
    if (e < a + s)
      r = t[++e];
    else {
      do
        r = t[++e];
      while (r && r !== `
`);
      n = e, a = e + 1, r = t[a];
    }
  return n;
}
const $t = (t, e) => ({
  indentAtStart: e ? t.indent.length : t.indentAtStart,
  lineWidth: t.options.lineWidth,
  minContentWidth: t.options.minContentWidth
}), _t = (t) => /^(%|---|\.\.\.)/m.test(t);
function Pa(t, e, s) {
  if (!e || e < 0)
    return !1;
  const n = e - s, a = t.length;
  if (a <= n)
    return !1;
  for (let r = 0, l = 0; r < a; ++r)
    if (t[r] === `
`) {
      if (r - l > n)
        return !0;
      if (l = r + 1, a - l <= n)
        return !1;
    }
  return !0;
}
function ht(t, e) {
  const s = JSON.stringify(t);
  if (e.options.doubleQuotedAsJSON)
    return s;
  const { implicitKey: n } = e, a = e.options.doubleQuotedMinMultiLineLength, r = e.indent || (_t(t) ? "  " : "");
  let l = "", o = 0;
  for (let d = 0, c = s[d]; c; c = s[++d])
    if (c === " " && s[d + 1] === "\\" && s[d + 2] === "n" && (l += s.slice(o, d) + "\\ ", d += 1, o = d, c = "\\"), c === "\\")
      switch (s[d + 1]) {
        case "u":
          {
            l += s.slice(o, d);
            const m = s.substr(d + 2, 4);
            switch (m) {
              case "0000":
                l += "\\0";
                break;
              case "0007":
                l += "\\a";
                break;
              case "000b":
                l += "\\v";
                break;
              case "001b":
                l += "\\e";
                break;
              case "0085":
                l += "\\N";
                break;
              case "00a0":
                l += "\\_";
                break;
              case "2028":
                l += "\\L";
                break;
              case "2029":
                l += "\\P";
                break;
              default:
                m.substr(0, 2) === "00" ? l += "\\x" + m.substr(2) : l += s.substr(d, 6);
            }
            d += 5, o = d + 1;
          }
          break;
        case "n":
          if (n || s[d + 2] === '"' || s.length < a)
            d += 1;
          else {
            for (l += s.slice(o, d) + `

`; s[d + 2] === "\\" && s[d + 3] === "n" && s[d + 4] !== '"'; )
              l += `
`, d += 2;
            l += r, s[d + 2] === " " && (l += "\\"), d += 1, o = d + 1;
          }
          break;
        default:
          d += 1;
      }
  return l = o ? l + s.slice(o) : s, n ? l : Zt(l, r, Pt, $t(e, !1));
}
function Ns(t, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && t.includes(`
`) || /[ \t]\n|\n[ \t]/.test(t))
    return ht(t, e);
  const s = e.indent || (_t(t) ? "  " : ""), n = "'" + t.replace(/'/g, "''").replace(/\n+/g, `$&
${s}`) + "'";
  return e.implicitKey ? n : Zt(n, s, qn, $t(e, !1));
}
function qe(t, e) {
  const { singleQuote: s } = e.options;
  let n;
  if (s === !1)
    n = ht;
  else {
    const a = t.includes('"'), r = t.includes("'");
    a && !r ? n = Ns : r && !a ? n = ht : n = s ? Ns : ht;
  }
  return n(t, e);
}
let vs;
try {
  vs = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  vs = /\n+(?!\n|$)/g;
}
function Bt({ comment: t, type: e, value: s }, n, a, r) {
  const { blockQuote: l, commentString: o, lineWidth: d } = n.options;
  if (!l || /\n[\t ]+$/.test(s))
    return qe(s, n);
  const c = n.indent || (n.forceBlockIndent || _t(s) ? "  " : ""), m = l === "literal" ? !0 : l === "folded" || e === T.BLOCK_FOLDED ? !1 : e === T.BLOCK_LITERAL ? !0 : !Pa(s, d, c.length);
  if (!s)
    return m ? `|
` : `>
`;
  let f, p;
  for (p = s.length; p > 0; --p) {
    const I = s[p - 1];
    if (I !== `
` && I !== "	" && I !== " ")
      break;
  }
  let h = s.substring(p);
  const x = h.indexOf(`
`);
  x === -1 ? f = "-" : s === h || x !== h.length - 1 ? (f = "+", r && r()) : f = "", h && (s = s.slice(0, -h.length), h[h.length - 1] === `
` && (h = h.slice(0, -1)), h = h.replace(vs, `$&${c}`));
  let u = !1, g, k = -1;
  for (g = 0; g < s.length; ++g) {
    const I = s[g];
    if (I === " ")
      u = !0;
    else if (I === `
`)
      k = g;
    else
      break;
  }
  let y = s.substring(0, k < g ? k + 1 : g);
  y && (s = s.substring(y.length), y = y.replace(/\n+/g, `$&${c}`));
  let C = (u ? c ? "2" : "1" : "") + f;
  if (t && (C += " " + o(t.replace(/ ?[\r\n]+/g, " ")), a && a()), !m) {
    const I = s.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let L = !1;
    const E = $t(n, !0);
    l !== "folded" && e !== T.BLOCK_FOLDED && (E.onOverflow = () => {
      L = !0;
    });
    const b = Zt(`${y}${I}${h}`, c, js, E);
    if (!L)
      return `>${C}
${c}${b}`;
  }
  return s = s.replace(/\n+/g, `$&${c}`), `|${C}
${c}${y}${s}${h}`;
}
function Ba(t, e, s, n) {
  const { type: a, value: r } = t, { actualString: l, implicitKey: o, indent: d, indentStep: c, inFlow: m } = e;
  if (o && r.includes(`
`) || m && /[[\]{},]/.test(r))
    return qe(r, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(r))
    return o || m || !r.includes(`
`) ? qe(r, e) : Bt(t, e, s, n);
  if (!o && !m && a !== T.PLAIN && r.includes(`
`))
    return Bt(t, e, s, n);
  if (_t(r)) {
    if (d === "")
      return e.forceBlockIndent = !0, Bt(t, e, s, n);
    if (o && d === c)
      return qe(r, e);
  }
  const f = r.replace(/\n+/g, `$&
${d}`);
  if (l) {
    const p = (u) => {
      var g;
      return u.default && u.tag !== "tag:yaml.org,2002:str" && ((g = u.test) == null ? void 0 : g.test(f));
    }, { compat: h, tags: x } = e.doc.schema;
    if (x.some(p) || h != null && h.some(p))
      return qe(r, e);
  }
  return o ? f : Zt(f, d, qn, $t(e, !1));
}
function Rs(t, e, s, n) {
  const { implicitKey: a, inFlow: r } = e, l = typeof t.value == "string" ? t : Object.assign({}, t, { value: String(t.value) });
  let { type: o } = t;
  o !== T.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(l.value) && (o = T.QUOTE_DOUBLE);
  const d = (m) => {
    switch (m) {
      case T.BLOCK_FOLDED:
      case T.BLOCK_LITERAL:
        return a || r ? qe(l.value, e) : Bt(l, e, s, n);
      case T.QUOTE_DOUBLE:
        return ht(l.value, e);
      case T.QUOTE_SINGLE:
        return Ns(l.value, e);
      case T.PLAIN:
        return Ba(l, e, s, n);
      default:
        return null;
    }
  };
  let c = d(o);
  if (c === null) {
    const { defaultKeyType: m, defaultStringType: f } = e.options, p = a && m || f;
    if (c = d(p), c === null)
      throw new Error(`Unsupported default string type ${p}`);
  }
  return c;
}
function Vn(t, e) {
  const s = Object.assign({
    blockQuote: !0,
    commentString: Oa,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: !1,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: !0,
    indentSeq: !0,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: !1,
    singleQuote: null,
    trailingComma: !1,
    trueStr: "true",
    verifyAliasOrder: !0
  }, t.schema.toStringOptions, e);
  let n;
  switch (s.collectionStyle) {
    case "block":
      n = !1;
      break;
    case "flow":
      n = !0;
      break;
    default:
      n = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: t,
    flowCollectionPadding: s.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof s.indent == "number" ? " ".repeat(s.indent) : "  ",
    inFlow: n,
    options: s
  };
}
function Da(t, e) {
  var a;
  if (e.tag) {
    const r = t.filter((l) => l.tag === e.tag);
    if (r.length > 0)
      return r.find((l) => l.format === e.format) ?? r[0];
  }
  let s, n;
  if (U(e)) {
    n = e.value;
    let r = t.filter((l) => {
      var o;
      return (o = l.identify) == null ? void 0 : o.call(l, n);
    });
    if (r.length > 1) {
      const l = r.filter((o) => o.test);
      l.length > 0 && (r = l);
    }
    s = r.find((l) => l.format === e.format) ?? r.find((l) => !l.format);
  } else
    n = e, s = t.find((r) => r.nodeClass && n instanceof r.nodeClass);
  if (!s) {
    const r = ((a = n == null ? void 0 : n.constructor) == null ? void 0 : a.name) ?? (n === null ? "null" : typeof n);
    throw new Error(`Tag not resolved for ${r} value`);
  }
  return s;
}
function Ra(t, e, { anchors: s, doc: n }) {
  if (!n.directives)
    return "";
  const a = [], r = (U(t) || q(t)) && t.anchor;
  r && Un(r) && (s.add(r), a.push(`&${r}`));
  const l = t.tag ?? (e.default ? null : e.tag);
  return l && a.push(n.directives.tagString(l)), a.join(" ");
}
function Ze(t, e, s, n) {
  var d;
  if (X(t))
    return t.toString(e, s, n);
  if (tt(t)) {
    if (e.doc.directives)
      return t.toString(e);
    if ((d = e.resolvedAliases) != null && d.has(t))
      throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(t) : e.resolvedAliases = /* @__PURE__ */ new Set([t]), t = t.resolve(e.doc);
  }
  let a;
  const r = V(t) ? t : e.doc.createNode(t, { onTagObj: (c) => a = c });
  a ?? (a = Da(e.doc.schema.tags, r));
  const l = Ra(r, a, e);
  l.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + l.length + 1);
  const o = typeof a.stringify == "function" ? a.stringify(r, e, s, n) : U(r) ? Rs(r, e, s, n) : r.toString(e, s, n);
  return l ? U(r) || o[0] === "{" || o[0] === "[" ? `${l} ${o}` : `${l}
${e.indent}${o}` : o;
}
function Ka({ key: t, value: e }, s, n, a) {
  const { allNullValues: r, doc: l, indent: o, indentStep: d, options: { commentString: c, indentSeq: m, simpleKeys: f } } = s;
  let p = V(t) && t.comment || null;
  if (f) {
    if (p)
      throw new Error("With simple keys, key nodes cannot have comments");
    if (q(t) || !V(t) && typeof t == "object") {
      const E = "With simple keys, collection cannot be used as a key value";
      throw new Error(E);
    }
  }
  let h = !f && (!t || p && e == null && !s.inFlow || q(t) || (U(t) ? t.type === T.BLOCK_FOLDED || t.type === T.BLOCK_LITERAL : typeof t == "object"));
  s = Object.assign({}, s, {
    allNullValues: !1,
    implicitKey: !h && (f || !r),
    indent: o + d
  });
  let x = !1, u = !1, g = Ze(t, s, () => x = !0, () => u = !0);
  if (!h && !s.inFlow && g.length > 1024) {
    if (f)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    h = !0;
  }
  if (s.inFlow) {
    if (r || e == null)
      return x && n && n(), g === "" ? "?" : h ? `? ${g}` : g;
  } else if (r && !f || e == null && h)
    return g = `? ${g}`, p && !x ? g += Be(g, s.indent, c(p)) : u && a && a(), g;
  x && (p = null), h ? (p && (g += Be(g, s.indent, c(p))), g = `? ${g}
${o}:`) : (g = `${g}:`, p && (g += Be(g, s.indent, c(p))));
  let k, y, S;
  V(e) ? (k = !!e.spaceBefore, y = e.commentBefore, S = e.comment) : (k = !1, y = null, S = null, e && typeof e == "object" && (e = l.createNode(e))), s.implicitKey = !1, !h && !p && U(e) && (s.indentAtStart = g.length + 1), u = !1, !m && d.length >= 2 && !s.inFlow && !h && bt(e) && !e.flow && !e.tag && !e.anchor && (s.indent = s.indent.substring(2));
  let C = !1;
  const I = Ze(e, s, () => C = !0, () => u = !0);
  let L = " ";
  if (p || k || y) {
    if (L = k ? `
` : "", y) {
      const E = c(y);
      L += `
${je(E, s.indent)}`;
    }
    I === "" && !s.inFlow ? L === `
` && S && (L = `

`) : L += `
${s.indent}`;
  } else if (!h && q(e)) {
    const E = I[0], b = I.indexOf(`
`), A = b !== -1, P = s.inFlow ?? e.flow ?? e.items.length === 0;
    if (A || !P) {
      let M = !1;
      if (A && (E === "&" || E === "!")) {
        let J = I.indexOf(" ");
        E === "&" && J !== -1 && J < b && I[J + 1] === "!" && (J = I.indexOf(" ", J + 1)), (J === -1 || b < J) && (M = !0);
      }
      M || (L = `
${s.indent}`);
    }
  } else (I === "" || I[0] === `
`) && (L = "");
  return g += L + I, s.inFlow ? C && n && n() : S && !C ? g += Be(g, s.indent, c(S)) : u && a && a(), g;
}
function Xn(t, e) {
  (t === "debug" || t === "warn") && console.warn(e);
}
const St = "<<", Ne = {
  identify: (t) => t === St || typeof t == "symbol" && t.description === St,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new T(Symbol(St)), {
    addToJSMap: Wn
  }),
  stringify: () => St
}, Fa = (t, e) => (Ne.identify(e) || U(e) && (!e.type || e.type === T.PLAIN) && Ne.identify(e.value)) && (t == null ? void 0 : t.doc.schema.tags.some((s) => s.tag === Ne.tag && s.default));
function Wn(t, e, s) {
  const n = Zn(t, s);
  if (bt(n))
    for (const a of n.items)
      os(t, e, a);
  else if (Array.isArray(n))
    for (const a of n)
      os(t, e, a);
  else
    os(t, e, n);
}
function os(t, e, s) {
  const n = Zn(t, s);
  if (!yt(n))
    throw new Error("Merge sources must be maps or map aliases");
  const a = n.toJSON(null, t, Map);
  for (const [r, l] of a)
    e instanceof Map ? e.has(r) || e.set(r, l) : e instanceof Set ? e.add(r) : Object.prototype.hasOwnProperty.call(e, r) || Object.defineProperty(e, r, {
      value: l,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  return e;
}
function Zn(t, e) {
  return t && tt(e) ? e.resolve(t.doc, t) : e;
}
function $n(t, e, { key: s, value: n }) {
  if (V(s) && s.addToJSMap)
    s.addToJSMap(t, e, n);
  else if (Fa(t, s))
    Wn(t, e, n);
  else {
    const a = he(s, "", t);
    if (e instanceof Map)
      e.set(a, he(n, a, t));
    else if (e instanceof Set)
      e.add(a);
    else {
      const r = Qa(s, a, t), l = he(n, r, t);
      r in e ? Object.defineProperty(e, r, {
        value: l,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }) : e[r] = l;
    }
  }
  return e;
}
function Qa(t, e, s) {
  if (e === null)
    return "";
  if (typeof e != "object")
    return String(e);
  if (V(t) && (s != null && s.doc)) {
    const n = Vn(s.doc, {});
    n.anchors = /* @__PURE__ */ new Set();
    for (const r of s.anchors.keys())
      n.anchors.add(r.anchor);
    n.inFlow = !0, n.inStringifyKey = !0;
    const a = t.toString(n);
    if (!s.mapKeyWarned) {
      let r = JSON.stringify(a);
      r.length > 40 && (r = r.substring(0, 36) + '..."'), Xn(s.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${r}. Set mapAsMap: true to use object keys.`), s.mapKeyWarned = !0;
    }
    return a;
  }
  return JSON.stringify(e);
}
function Ks(t, e, s) {
  const n = mt(t, void 0, s), a = mt(e, void 0, s);
  return new ie(n, a);
}
class ie {
  constructor(e, s = null) {
    Object.defineProperty(this, fe, { value: Qn }), this.key = e, this.value = s;
  }
  clone(e) {
    let { key: s, value: n } = this;
    return V(s) && (s = s.clone(e)), V(n) && (n = n.clone(e)), new ie(s, n);
  }
  toJSON(e, s) {
    const n = s != null && s.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return $n(s, n, this);
  }
  toString(e, s, n) {
    return e != null && e.doc ? Ka(this, e, s, n) : JSON.stringify(this);
  }
}
function _n(t, e, s) {
  return (e.inFlow ?? t.flow ? Ua : za)(t, e, s);
}
function za({ comment: t, items: e }, s, { blockItemPrefix: n, flowChars: a, itemIndent: r, onChompKeep: l, onComment: o }) {
  const { indent: d, options: { commentString: c } } = s, m = Object.assign({}, s, { indent: r, type: null });
  let f = !1;
  const p = [];
  for (let x = 0; x < e.length; ++x) {
    const u = e[x];
    let g = null;
    if (V(u))
      !f && u.spaceBefore && p.push(""), Qt(s, p, u.commentBefore, f), u.comment && (g = u.comment);
    else if (X(u)) {
      const y = V(u.key) ? u.key : null;
      y && (!f && y.spaceBefore && p.push(""), Qt(s, p, y.commentBefore, f));
    }
    f = !1;
    let k = Ze(u, m, () => g = null, () => f = !0);
    g && (k += Be(k, r, c(g))), f && g && (f = !1), p.push(n + k);
  }
  let h;
  if (p.length === 0)
    h = a.start + a.end;
  else {
    h = p[0];
    for (let x = 1; x < p.length; ++x) {
      const u = p[x];
      h += u ? `
${d}${u}` : `
`;
    }
  }
  return t ? (h += `
` + je(c(t), d), o && o()) : f && l && l(), h;
}
function Ua({ items: t }, e, { flowChars: s, itemIndent: n }) {
  const { indent: a, indentStep: r, flowCollectionPadding: l, options: { commentString: o } } = e;
  n += r;
  const d = Object.assign({}, e, {
    indent: n,
    inFlow: !0,
    type: null
  });
  let c = !1, m = 0;
  const f = [];
  for (let x = 0; x < t.length; ++x) {
    const u = t[x];
    let g = null;
    if (V(u))
      u.spaceBefore && f.push(""), Qt(e, f, u.commentBefore, !1), u.comment && (g = u.comment);
    else if (X(u)) {
      const y = V(u.key) ? u.key : null;
      y && (y.spaceBefore && f.push(""), Qt(e, f, y.commentBefore, !1), y.comment && (c = !0));
      const S = V(u.value) ? u.value : null;
      S ? (S.comment && (g = S.comment), S.commentBefore && (c = !0)) : u.value == null && (y != null && y.comment) && (g = y.comment);
    }
    g && (c = !0);
    let k = Ze(u, d, () => g = null);
    c || (c = f.length > m || k.includes(`
`)), x < t.length - 1 ? k += "," : e.options.trailingComma && (e.options.lineWidth > 0 && (c || (c = f.reduce((y, S) => y + S.length + 2, 2) + (k.length + 2) > e.options.lineWidth)), c && (k += ",")), g && (k += Be(k, n, o(g))), f.push(k), m = f.length;
  }
  const { start: p, end: h } = s;
  if (f.length === 0)
    return p + h;
  if (!c) {
    const x = f.reduce((u, g) => u + g.length + 2, 2);
    c = e.options.lineWidth > 0 && x > e.options.lineWidth;
  }
  if (c) {
    let x = p;
    for (const u of f)
      x += u ? `
${r}${a}${u}` : `
`;
    return `${x}
${a}${h}`;
  } else
    return `${p}${l}${f.join(" ")}${l}${h}`;
}
function Qt({ indent: t, options: { commentString: e } }, s, n, a) {
  if (n && a && (n = n.replace(/^\n+/, "")), n) {
    const r = je(e(n), t);
    s.push(r.trimStart());
  }
}
function De(t, e) {
  const s = U(e) ? e.value : e;
  for (const n of t)
    if (X(n) && (n.key === e || n.key === s || U(n.key) && n.key.value === s))
      return n;
}
class ue extends Gn {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(e) {
    super(Ie, e), this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(e, s, n) {
    const { keepUndefined: a, replacer: r } = n, l = new this(e), o = (d, c) => {
      if (typeof r == "function")
        c = r.call(s, d, c);
      else if (Array.isArray(r) && !r.includes(d))
        return;
      (c !== void 0 || a) && l.items.push(Ks(d, c, n));
    };
    if (s instanceof Map)
      for (const [d, c] of s)
        o(d, c);
    else if (s && typeof s == "object")
      for (const d of Object.keys(s))
        o(d, s[d]);
    return typeof e.sortMapEntries == "function" && l.items.sort(e.sortMapEntries), l;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(e, s) {
    var l;
    let n;
    X(e) ? n = e : !e || typeof e != "object" || !("key" in e) ? n = new ie(e, e == null ? void 0 : e.value) : n = new ie(e.key, e.value);
    const a = De(this.items, n.key), r = (l = this.schema) == null ? void 0 : l.sortMapEntries;
    if (a) {
      if (!s)
        throw new Error(`Key ${n.key} already set`);
      U(a.value) && Yn(n.value) ? a.value.value = n.value : a.value = n.value;
    } else if (r) {
      const o = this.items.findIndex((d) => r(n, d) < 0);
      o === -1 ? this.items.push(n) : this.items.splice(o, 0, n);
    } else
      this.items.push(n);
  }
  delete(e) {
    const s = De(this.items, e);
    return s ? this.items.splice(this.items.indexOf(s), 1).length > 0 : !1;
  }
  get(e, s) {
    const n = De(this.items, e), a = n == null ? void 0 : n.value;
    return (!s && U(a) ? a.value : a) ?? void 0;
  }
  has(e) {
    return !!De(this.items, e);
  }
  set(e, s) {
    this.add(new ie(e, s), !0);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(e, s, n) {
    const a = n ? new n() : s != null && s.mapAsMap ? /* @__PURE__ */ new Map() : {};
    s != null && s.onCreate && s.onCreate(a);
    for (const r of this.items)
      $n(s, a, r);
    return a;
  }
  toString(e, s, n) {
    if (!e)
      return JSON.stringify(this);
    for (const a of this.items)
      if (!X(a))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(a)} instead`);
    return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), _n(this, e, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: e.indent || "",
      onChompKeep: n,
      onComment: s
    });
  }
}
const nt = {
  collection: "map",
  default: !0,
  nodeClass: ue,
  tag: "tag:yaml.org,2002:map",
  resolve(t, e) {
    return yt(t) || e("Expected a mapping for this tag"), t;
  },
  createNode: (t, e, s) => ue.from(t, e, s)
};
class Fe extends Gn {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(e) {
    super(et, e), this.items = [];
  }
  add(e) {
    this.items.push(e);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    const s = Ct(e);
    return typeof s != "number" ? !1 : this.items.splice(s, 1).length > 0;
  }
  get(e, s) {
    const n = Ct(e);
    if (typeof n != "number")
      return;
    const a = this.items[n];
    return !s && U(a) ? a.value : a;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(e) {
    const s = Ct(e);
    return typeof s == "number" && s < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(e, s) {
    const n = Ct(e);
    if (typeof n != "number")
      throw new Error(`Expected a valid index, not ${e}.`);
    const a = this.items[n];
    U(a) && Yn(s) ? a.value = s : this.items[n] = s;
  }
  toJSON(e, s) {
    const n = [];
    s != null && s.onCreate && s.onCreate(n);
    let a = 0;
    for (const r of this.items)
      n.push(he(r, String(a++), s));
    return n;
  }
  toString(e, s, n) {
    return e ? _n(this, e, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (e.indent || "") + "  ",
      onChompKeep: n,
      onComment: s
    }) : JSON.stringify(this);
  }
  static from(e, s, n) {
    const { replacer: a } = n, r = new this(e);
    if (s && Symbol.iterator in Object(s)) {
      let l = 0;
      for (let o of s) {
        if (typeof a == "function") {
          const d = s instanceof Set ? o : String(l++);
          o = a.call(s, d, o);
        }
        r.items.push(mt(o, void 0, n));
      }
    }
    return r;
  }
}
function Ct(t) {
  let e = U(t) ? t.value : t;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
const it = {
  collection: "seq",
  default: !0,
  nodeClass: Fe,
  tag: "tag:yaml.org,2002:seq",
  resolve(t, e) {
    return bt(t) || e("Expected a sequence for this tag"), t;
  },
  createNode: (t, e, s) => Fe.from(t, e, s)
}, es = {
  identify: (t) => typeof t == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (t) => t,
  stringify(t, e, s, n) {
    return e = Object.assign({ actualString: !0 }, e), Rs(t, e, s, n);
  }
}, ts = {
  identify: (t) => t == null,
  createNode: () => new T(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new T(null),
  stringify: ({ source: t }, e) => typeof t == "string" && ts.test.test(t) ? t : e.options.nullStr
}, Fs = {
  identify: (t) => typeof t == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (t) => new T(t[0] === "t" || t[0] === "T"),
  stringify({ source: t, value: e }, s) {
    if (t && Fs.test.test(t)) {
      const n = t[0] === "t" || t[0] === "T";
      if (e === n)
        return t;
    }
    return e ? s.options.trueStr : s.options.falseStr;
  }
};
function ge({ format: t, minFractionDigits: e, tag: s, value: n }) {
  if (typeof n == "bigint")
    return String(n);
  const a = typeof n == "number" ? n : Number(n);
  if (!isFinite(a))
    return isNaN(a) ? ".nan" : a < 0 ? "-.inf" : ".inf";
  let r = Object.is(n, -0) ? "-0" : JSON.stringify(n);
  if (!t && e && (!s || s === "tag:yaml.org,2002:float") && /^-?\d/.test(r) && !r.includes("e")) {
    let l = r.indexOf(".");
    l < 0 && (l = r.length, r += ".");
    let o = e - (r.length - l - 1);
    for (; o-- > 0; )
      r += "0";
  }
  return r;
}
const ei = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: ge
}, ti = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : ge(t);
  }
}, si = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(t) {
    const e = new T(parseFloat(t)), s = t.indexOf(".");
    return s !== -1 && t[t.length - 1] === "0" && (e.minFractionDigits = t.length - s - 1), e;
  },
  stringify: ge
}, ss = (t) => typeof t == "bigint" || Number.isInteger(t), Qs = (t, e, s, { intAsBigInt: n }) => n ? BigInt(t) : parseInt(t.substring(e), s);
function ni(t, e, s) {
  const { value: n } = t;
  return ss(n) && n >= 0 ? s + n.toString(e) : ge(t);
}
const ii = {
  identify: (t) => ss(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (t, e, s) => Qs(t, 2, 8, s),
  stringify: (t) => ni(t, 8, "0o")
}, ai = {
  identify: ss,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (t, e, s) => Qs(t, 0, 10, s),
  stringify: ge
}, ri = {
  identify: (t) => ss(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (t, e, s) => Qs(t, 2, 16, s),
  stringify: (t) => ni(t, 16, "0x")
}, Ja = [
  nt,
  it,
  es,
  ts,
  Fs,
  ii,
  ai,
  ri,
  ei,
  ti,
  si
];
function ln(t) {
  return typeof t == "bigint" || Number.isInteger(t);
}
const At = ({ value: t }) => JSON.stringify(t), Ha = [
  {
    identify: (t) => typeof t == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (t) => t,
    stringify: At
  },
  {
    identify: (t) => t == null,
    createNode: () => new T(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: At
  },
  {
    identify: (t) => typeof t == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (t) => t === "true",
    stringify: At
  },
  {
    identify: ln,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (t, e, { intAsBigInt: s }) => s ? BigInt(t) : parseInt(t, 10),
    stringify: ({ value: t }) => ln(t) ? t.toString() : JSON.stringify(t)
  },
  {
    identify: (t) => typeof t == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (t) => parseFloat(t),
    stringify: At
  }
], Ya = {
  default: !0,
  tag: "",
  test: /^/,
  resolve(t, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(t)}`), t;
  }
}, Ga = [nt, it].concat(Ha, Ya), zs = {
  identify: (t) => t instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(t, e) {
    if (typeof atob == "function") {
      const s = atob(t.replace(/[\n\r]/g, "")), n = new Uint8Array(s.length);
      for (let a = 0; a < s.length; ++a)
        n[a] = s.charCodeAt(a);
      return n;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), t;
  },
  stringify({ comment: t, type: e, value: s }, n, a, r) {
    if (!s)
      return "";
    const l = s;
    let o;
    if (typeof btoa == "function") {
      let d = "";
      for (let c = 0; c < l.length; ++c)
        d += String.fromCharCode(l[c]);
      o = btoa(d);
    } else
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = T.BLOCK_LITERAL), e !== T.QUOTE_DOUBLE) {
      const d = Math.max(n.options.lineWidth - n.indent.length, n.options.minContentWidth), c = Math.ceil(o.length / d), m = new Array(c);
      for (let f = 0, p = 0; f < c; ++f, p += d)
        m[f] = o.substr(p, d);
      o = m.join(e === T.BLOCK_LITERAL ? `
` : " ");
    }
    return Rs({ comment: t, type: e, value: o }, n, a, r);
  }
};
function li(t, e) {
  if (bt(t))
    for (let s = 0; s < t.items.length; ++s) {
      let n = t.items[s];
      if (!X(n)) {
        if (yt(n)) {
          n.items.length > 1 && e("Each pair must have its own sequence indicator");
          const a = n.items[0] || new ie(new T(null));
          if (n.commentBefore && (a.key.commentBefore = a.key.commentBefore ? `${n.commentBefore}
${a.key.commentBefore}` : n.commentBefore), n.comment) {
            const r = a.value ?? a.key;
            r.comment = r.comment ? `${n.comment}
${r.comment}` : n.comment;
          }
          n = a;
        }
        t.items[s] = X(n) ? n : new ie(n);
      }
    }
  else
    e("Expected a sequence for this tag");
  return t;
}
function oi(t, e, s) {
  const { replacer: n } = s, a = new Fe(t);
  a.tag = "tag:yaml.org,2002:pairs";
  let r = 0;
  if (e && Symbol.iterator in Object(e))
    for (let l of e) {
      typeof n == "function" && (l = n.call(e, String(r++), l));
      let o, d;
      if (Array.isArray(l))
        if (l.length === 2)
          o = l[0], d = l[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${l}`);
      else if (l && l instanceof Object) {
        const c = Object.keys(l);
        if (c.length === 1)
          o = c[0], d = l[o];
        else
          throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
      } else
        o = l;
      a.items.push(Ks(o, d, s));
    }
  return a;
}
const Us = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: li,
  createNode: oi
};
class Ve extends Fe {
  constructor() {
    super(), this.add = ue.prototype.add.bind(this), this.delete = ue.prototype.delete.bind(this), this.get = ue.prototype.get.bind(this), this.has = ue.prototype.has.bind(this), this.set = ue.prototype.set.bind(this), this.tag = Ve.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(e, s) {
    if (!s)
      return super.toJSON(e);
    const n = /* @__PURE__ */ new Map();
    s != null && s.onCreate && s.onCreate(n);
    for (const a of this.items) {
      let r, l;
      if (X(a) ? (r = he(a.key, "", s), l = he(a.value, r, s)) : r = he(a, "", s), n.has(r))
        throw new Error("Ordered maps must not include duplicate keys");
      n.set(r, l);
    }
    return n;
  }
  static from(e, s, n) {
    const a = oi(e, s, n), r = new this();
    return r.items = a.items, r;
  }
}
Ve.tag = "tag:yaml.org,2002:omap";
const Js = {
  collection: "seq",
  identify: (t) => t instanceof Map,
  nodeClass: Ve,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(t, e) {
    const s = li(t, e), n = [];
    for (const { key: a } of s.items)
      U(a) && (n.includes(a.value) ? e(`Ordered maps must not include duplicate keys: ${a.value}`) : n.push(a.value));
    return Object.assign(new Ve(), s);
  },
  createNode: (t, e, s) => Ve.from(t, e, s)
};
function ci({ value: t, source: e }, s) {
  return e && (t ? di : ui).test.test(e) ? e : t ? s.options.trueStr : s.options.falseStr;
}
const di = {
  identify: (t) => t === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new T(!0),
  stringify: ci
}, ui = {
  identify: (t) => t === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new T(!1),
  stringify: ci
}, qa = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: ge
}, Va = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t.replace(/_/g, "")),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : ge(t);
  }
}, Xa = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(t) {
    const e = new T(parseFloat(t.replace(/_/g, ""))), s = t.indexOf(".");
    if (s !== -1) {
      const n = t.substring(s + 1).replace(/_/g, "");
      n[n.length - 1] === "0" && (e.minFractionDigits = n.length);
    }
    return e;
  },
  stringify: ge
}, wt = (t) => typeof t == "bigint" || Number.isInteger(t);
function ns(t, e, s, { intAsBigInt: n }) {
  const a = t[0];
  if ((a === "-" || a === "+") && (e += 1), t = t.substring(e).replace(/_/g, ""), n) {
    switch (s) {
      case 2:
        t = `0b${t}`;
        break;
      case 8:
        t = `0o${t}`;
        break;
      case 16:
        t = `0x${t}`;
        break;
    }
    const l = BigInt(t);
    return a === "-" ? BigInt(-1) * l : l;
  }
  const r = parseInt(t, s);
  return a === "-" ? -1 * r : r;
}
function Hs(t, e, s) {
  const { value: n } = t;
  if (wt(n)) {
    const a = n.toString(e);
    return n < 0 ? "-" + s + a.substr(1) : s + a;
  }
  return ge(t);
}
const Wa = {
  identify: wt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (t, e, s) => ns(t, 2, 2, s),
  stringify: (t) => Hs(t, 2, "0b")
}, Za = {
  identify: wt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (t, e, s) => ns(t, 1, 8, s),
  stringify: (t) => Hs(t, 8, "0")
}, $a = {
  identify: wt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (t, e, s) => ns(t, 0, 10, s),
  stringify: ge
}, _a = {
  identify: wt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (t, e, s) => ns(t, 2, 16, s),
  stringify: (t) => Hs(t, 16, "0x")
};
class Xe extends ue {
  constructor(e) {
    super(e), this.tag = Xe.tag;
  }
  add(e) {
    let s;
    X(e) ? s = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? s = new ie(e.key, null) : s = new ie(e, null), De(this.items, s.key) || this.items.push(s);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(e, s) {
    const n = De(this.items, e);
    return !s && X(n) ? U(n.key) ? n.key.value : n.key : n;
  }
  set(e, s) {
    if (typeof s != "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof s}`);
    const n = De(this.items, e);
    n && !s ? this.items.splice(this.items.indexOf(n), 1) : !n && s && this.items.push(new ie(e));
  }
  toJSON(e, s) {
    return super.toJSON(e, s, Set);
  }
  toString(e, s, n) {
    if (!e)
      return JSON.stringify(this);
    if (this.hasAllNullValues(!0))
      return super.toString(Object.assign({}, e, { allNullValues: !0 }), s, n);
    throw new Error("Set items must all have null values");
  }
  static from(e, s, n) {
    const { replacer: a } = n, r = new this(e);
    if (s && Symbol.iterator in Object(s))
      for (let l of s)
        typeof a == "function" && (l = a.call(s, l, l)), r.items.push(Ks(l, null, n));
    return r;
  }
}
Xe.tag = "tag:yaml.org,2002:set";
const Ys = {
  collection: "map",
  identify: (t) => t instanceof Set,
  nodeClass: Xe,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (t, e, s) => Xe.from(t, e, s),
  resolve(t, e) {
    if (yt(t)) {
      if (t.hasAllNullValues(!0))
        return Object.assign(new Xe(), t);
      e("Set items must all have null values");
    } else
      e("Expected a mapping for this tag");
    return t;
  }
};
function Gs(t, e) {
  const s = t[0], n = s === "-" || s === "+" ? t.substring(1) : t, a = (l) => e ? BigInt(l) : Number(l), r = n.replace(/_/g, "").split(":").reduce((l, o) => l * a(60) + a(o), a(0));
  return s === "-" ? a(-1) * r : r;
}
function hi(t) {
  let { value: e } = t, s = (l) => l;
  if (typeof e == "bigint")
    s = (l) => BigInt(l);
  else if (isNaN(e) || !isFinite(e))
    return ge(t);
  let n = "";
  e < 0 && (n = "-", e *= s(-1));
  const a = s(60), r = [e % a];
  return e < 60 ? r.unshift(0) : (e = (e - r[0]) / a, r.unshift(e % a), e >= 60 && (e = (e - r[0]) / a, r.unshift(e))), n + r.map((l) => String(l).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
const fi = {
  identify: (t) => typeof t == "bigint" || Number.isInteger(t),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (t, e, { intAsBigInt: s }) => Gs(t, s),
  stringify: hi
}, mi = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (t) => Gs(t, !1),
  stringify: hi
}, is = {
  identify: (t) => t instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(t) {
    const e = t.match(is.test);
    if (!e)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, s, n, a, r, l, o] = e.map(Number), d = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(s, n - 1, a, r || 0, l || 0, o || 0, d);
    const m = e[8];
    if (m && m !== "Z") {
      let f = Gs(m, !1);
      Math.abs(f) < 30 && (f *= 60), c -= 6e4 * f;
    }
    return new Date(c);
  },
  stringify: ({ value: t }) => (t == null ? void 0 : t.toISOString().replace(/(T00:00:00)?\.000Z$/, "")) ?? ""
}, on = [
  nt,
  it,
  es,
  ts,
  di,
  ui,
  Wa,
  Za,
  $a,
  _a,
  qa,
  Va,
  Xa,
  zs,
  Ne,
  Js,
  Us,
  Ys,
  fi,
  mi,
  is
], cn = /* @__PURE__ */ new Map([
  ["core", Ja],
  ["failsafe", [nt, it, es]],
  ["json", Ga],
  ["yaml11", on],
  ["yaml-1.1", on]
]), dn = {
  binary: zs,
  bool: Fs,
  float: si,
  floatExp: ti,
  floatNaN: ei,
  floatTime: mi,
  int: ai,
  intHex: ri,
  intOct: ii,
  intTime: fi,
  map: nt,
  merge: Ne,
  null: ts,
  omap: Js,
  pairs: Us,
  seq: it,
  set: Ys,
  timestamp: is
}, er = {
  "tag:yaml.org,2002:binary": zs,
  "tag:yaml.org,2002:merge": Ne,
  "tag:yaml.org,2002:omap": Js,
  "tag:yaml.org,2002:pairs": Us,
  "tag:yaml.org,2002:set": Ys,
  "tag:yaml.org,2002:timestamp": is
};
function cs(t, e, s) {
  const n = cn.get(e);
  if (n && !t)
    return s && !n.includes(Ne) ? n.concat(Ne) : n.slice();
  let a = n;
  if (!a)
    if (Array.isArray(t))
      a = [];
    else {
      const r = Array.from(cn.keys()).filter((l) => l !== "yaml11").map((l) => JSON.stringify(l)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${r} or define customTags array`);
    }
  if (Array.isArray(t))
    for (const r of t)
      a = a.concat(r);
  else typeof t == "function" && (a = t(a.slice()));
  return s && (a = a.concat(Ne)), a.reduce((r, l) => {
    const o = typeof l == "string" ? dn[l] : l;
    if (!o) {
      const d = JSON.stringify(l), c = Object.keys(dn).map((m) => JSON.stringify(m)).join(", ");
      throw new Error(`Unknown custom tag ${d}; use one of ${c}`);
    }
    return r.includes(o) || r.push(o), r;
  }, []);
}
const tr = (t, e) => t.key < e.key ? -1 : t.key > e.key ? 1 : 0;
class qs {
  constructor({ compat: e, customTags: s, merge: n, resolveKnownTags: a, schema: r, sortMapEntries: l, toStringDefaults: o }) {
    this.compat = Array.isArray(e) ? cs(e, "compat") : e ? cs(null, e) : null, this.name = typeof r == "string" && r || "core", this.knownTags = a ? er : {}, this.tags = cs(s, this.name, n), this.toStringOptions = o ?? null, Object.defineProperty(this, Ie, { value: nt }), Object.defineProperty(this, be, { value: es }), Object.defineProperty(this, et, { value: it }), this.sortMapEntries = typeof l == "function" ? l : l === !0 ? tr : null;
  }
  clone() {
    const e = Object.create(qs.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
}
function sr(t, e) {
  var d;
  const s = [];
  let n = e.directives === !0;
  if (e.directives !== !1 && t.directives) {
    const c = t.directives.toString(t);
    c ? (s.push(c), n = !0) : t.directives.docStart && (n = !0);
  }
  n && s.push("---");
  const a = Vn(t, e), { commentString: r } = a.options;
  if (t.commentBefore) {
    s.length !== 1 && s.unshift("");
    const c = r(t.commentBefore);
    s.unshift(je(c, ""));
  }
  let l = !1, o = null;
  if (t.contents) {
    if (V(t.contents)) {
      if (t.contents.spaceBefore && n && s.push(""), t.contents.commentBefore) {
        const f = r(t.contents.commentBefore);
        s.push(je(f, ""));
      }
      a.forceBlockIndent = !!t.comment, o = t.contents.comment;
    }
    const c = o ? void 0 : () => l = !0;
    let m = Ze(t.contents, a, () => o = null, c);
    o && (m += Be(m, "", r(o))), (m[0] === "|" || m[0] === ">") && s[s.length - 1] === "---" ? s[s.length - 1] = `--- ${m}` : s.push(m);
  } else
    s.push(Ze(t.contents, a));
  if ((d = t.directives) != null && d.docEnd)
    if (t.comment) {
      const c = r(t.comment);
      c.includes(`
`) ? (s.push("..."), s.push(je(c, ""))) : s.push(`... ${c}`);
    } else
      s.push("...");
  else {
    let c = t.comment;
    c && l && (c = c.replace(/^\n+/, "")), c && ((!l || o) && s[s.length - 1] !== "" && s.push(""), s.push(je(r(c), "")));
  }
  return s.join(`
`) + `
`;
}
class as {
  constructor(e, s, n) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, fe, { value: ks });
    let a = null;
    typeof s == "function" || Array.isArray(s) ? a = s : n === void 0 && s && (n = s, s = void 0);
    const r = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, n);
    this.options = r;
    let { version: l } = r;
    n != null && n._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (l = this.directives.yaml.version)) : this.directives = new ne({ version: l }), this.setSchema(l, n), this.contents = e === void 0 ? null : this.createNode(e, a, n);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const e = Object.create(as.prototype, {
      [fe]: { value: ks }
    });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = V(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  /** Adds a value to the document. */
  add(e) {
    Ue(this.contents) && this.contents.add(e);
  }
  /** Adds a value to the document. */
  addIn(e, s) {
    Ue(this.contents) && this.contents.addIn(e, s);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(e, s) {
    if (!e.anchor) {
      const n = Jn(this);
      e.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !s || n.has(s) ? Hn(s || "a", n) : s;
    }
    return new Ds(e.anchor);
  }
  createNode(e, s, n) {
    let a;
    if (typeof s == "function")
      e = s.call({ "": e }, "", e), a = s;
    else if (Array.isArray(s)) {
      const g = (y) => typeof y == "number" || y instanceof String || y instanceof Number, k = s.filter(g).map(String);
      k.length > 0 && (s = s.concat(k)), a = s;
    } else n === void 0 && s && (n = s, s = void 0);
    const { aliasDuplicateObjects: r, anchorPrefix: l, flow: o, keepUndefined: d, onTagObj: c, tag: m } = n ?? {}, { onAnchor: f, setAnchors: p, sourceObjects: h } = La(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      l || "a"
    ), x = {
      aliasDuplicateObjects: r ?? !0,
      keepUndefined: d ?? !1,
      onAnchor: f,
      onTagObj: c,
      replacer: a,
      schema: this.schema,
      sourceObjects: h
    }, u = mt(e, m, x);
    return o && q(u) && (u.flow = !0), p(), u;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(e, s, n = {}) {
    const a = this.createNode(e, null, n), r = this.createNode(s, null, n);
    return new ie(a, r);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    return Ue(this.contents) ? this.contents.delete(e) : !1;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    return ct(e) ? this.contents == null ? !1 : (this.contents = null, !0) : Ue(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(e, s) {
    return q(this.contents) ? this.contents.get(e, s) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, s) {
    return ct(e) ? !s && U(this.contents) ? this.contents.value : this.contents : q(this.contents) ? this.contents.getIn(e, s) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(e) {
    return q(this.contents) ? this.contents.has(e) : !1;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(e) {
    return ct(e) ? this.contents !== void 0 : q(this.contents) ? this.contents.hasIn(e) : !1;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(e, s) {
    this.contents == null ? this.contents = Ft(this.schema, [e], s) : Ue(this.contents) && this.contents.set(e, s);
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, s) {
    ct(e) ? this.contents = s : this.contents == null ? this.contents = Ft(this.schema, Array.from(e), s) : Ue(this.contents) && this.contents.setIn(e, s);
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(e, s = {}) {
    typeof e == "number" && (e = String(e));
    let n;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new ne({ version: "1.1" }), n = { resolveKnownTags: !1, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new ne({ version: e }), n = { resolveKnownTags: !0, schema: "core" };
        break;
      case null:
        this.directives && delete this.directives, n = null;
        break;
      default: {
        const a = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${a}`);
      }
    }
    if (s.schema instanceof Object)
      this.schema = s.schema;
    else if (n)
      this.schema = new qs(Object.assign(n, s));
    else
      throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json: e, jsonArg: s, mapAsMap: n, maxAliasCount: a, onAnchor: r, reviver: l } = {}) {
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: n === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof a == "number" ? a : 100
    }, d = he(this.contents, s ?? "", o);
    if (typeof r == "function")
      for (const { count: c, res: m } of o.anchors.values())
        r(m, c);
    return typeof l == "function" ? Ge(l, { "": d }, "", d) : d;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(e, s) {
    return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: s });
  }
  /** A YAML representation of the document. */
  toString(e = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const s = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return sr(this, e);
  }
}
function Ue(t) {
  if (q(t))
    return !0;
  throw new Error("Expected a YAML collection as document contents");
}
class pi extends Error {
  constructor(e, s, n, a) {
    super(), this.name = e, this.code = n, this.message = a, this.pos = s;
  }
}
class dt extends pi {
  constructor(e, s, n) {
    super("YAMLParseError", e, s, n);
  }
}
class nr extends pi {
  constructor(e, s, n) {
    super("YAMLWarning", e, s, n);
  }
}
const un = (t, e) => (s) => {
  if (s.pos[0] === -1)
    return;
  s.linePos = s.pos.map((o) => e.linePos(o));
  const { line: n, col: a } = s.linePos[0];
  s.message += ` at line ${n}, column ${a}`;
  let r = a - 1, l = t.substring(e.lineStarts[n - 1], e.lineStarts[n]).replace(/[\n\r]+$/, "");
  if (r >= 60 && l.length > 80) {
    const o = Math.min(r - 39, l.length - 79);
    l = "…" + l.substring(o), r -= o - 1;
  }
  if (l.length > 80 && (l = l.substring(0, 79) + "…"), n > 1 && /^ *$/.test(l.substring(0, r))) {
    let o = t.substring(e.lineStarts[n - 2], e.lineStarts[n - 1]);
    o.length > 80 && (o = o.substring(0, 79) + `…
`), l = o + l;
  }
  if (/[^ ]/.test(l)) {
    let o = 1;
    const d = s.linePos[1];
    (d == null ? void 0 : d.line) === n && d.col > a && (o = Math.max(1, Math.min(d.col - a, 80 - r)));
    const c = " ".repeat(r) + "^".repeat(o);
    s.message += `:

${l}
${c}
`;
  }
};
function $e(t, { flow: e, indicator: s, next: n, offset: a, onError: r, parentIndent: l, startOnNewline: o }) {
  let d = !1, c = o, m = o, f = "", p = "", h = !1, x = !1, u = null, g = null, k = null, y = null, S = null, C = null, I = null;
  for (const b of t)
    switch (x && (b.type !== "space" && b.type !== "newline" && b.type !== "comma" && r(b.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), x = !1), u && (c && b.type !== "comment" && b.type !== "newline" && r(u, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), u = null), b.type) {
      case "space":
        !e && (s !== "doc-start" || (n == null ? void 0 : n.type) !== "flow-collection") && b.source.includes("	") && (u = b), m = !0;
        break;
      case "comment": {
        m || r(b, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const A = b.source.substring(1) || " ";
        f ? f += p + A : f = A, p = "", c = !1;
        break;
      }
      case "newline":
        c ? f ? f += b.source : (!C || s !== "seq-item-ind") && (d = !0) : p += b.source, c = !0, h = !0, (g || k) && (y = b), m = !0;
        break;
      case "anchor":
        g && r(b, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), b.source.endsWith(":") && r(b.offset + b.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), g = b, I ?? (I = b.offset), c = !1, m = !1, x = !0;
        break;
      case "tag": {
        k && r(b, "MULTIPLE_TAGS", "A node can have at most one tag"), k = b, I ?? (I = b.offset), c = !1, m = !1, x = !0;
        break;
      }
      case s:
        (g || k) && r(b, "BAD_PROP_ORDER", `Anchors and tags must be after the ${b.source} indicator`), C && r(b, "UNEXPECTED_TOKEN", `Unexpected ${b.source} in ${e ?? "collection"}`), C = b, c = s === "seq-item-ind" || s === "explicit-key-ind", m = !1;
        break;
      case "comma":
        if (e) {
          S && r(b, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), S = b, c = !1, m = !1;
          break;
        }
      default:
        r(b, "UNEXPECTED_TOKEN", `Unexpected ${b.type} token`), c = !1, m = !1;
    }
  const L = t[t.length - 1], E = L ? L.offset + L.source.length : a;
  return x && n && n.type !== "space" && n.type !== "newline" && n.type !== "comma" && (n.type !== "scalar" || n.source !== "") && r(n.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), u && (c && u.indent <= l || (n == null ? void 0 : n.type) === "block-map" || (n == null ? void 0 : n.type) === "block-seq") && r(u, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: S,
    found: C,
    spaceBefore: d,
    comment: f,
    hasNewline: h,
    anchor: g,
    tag: k,
    newlineAfterProp: y,
    end: E,
    start: I ?? E
  };
}
function pt(t) {
  if (!t)
    return null;
  switch (t.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (t.source.includes(`
`))
        return !0;
      if (t.end) {
        for (const e of t.end)
          if (e.type === "newline")
            return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of t.items) {
        for (const s of e.start)
          if (s.type === "newline")
            return !0;
        if (e.sep) {
          for (const s of e.sep)
            if (s.type === "newline")
              return !0;
        }
        if (pt(e.key) || pt(e.value))
          return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function Ss(t, e, s) {
  if ((e == null ? void 0 : e.type) === "flow-collection") {
    const n = e.end[0];
    n.indent === t && (n.source === "]" || n.source === "}") && pt(e) && s(n, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function gi(t, e, s) {
  const { uniqueKeys: n } = t.options;
  if (n === !1)
    return !1;
  const a = typeof n == "function" ? n : (r, l) => r === l || U(r) && U(l) && r.value === l.value;
  return e.some((r) => a(r.key, s));
}
const hn = "All mapping items must start at the same column";
function ir({ composeNode: t, composeEmptyNode: e }, s, n, a, r) {
  var m;
  const l = (r == null ? void 0 : r.nodeClass) ?? ue, o = new l(s.schema);
  s.atRoot && (s.atRoot = !1);
  let d = n.offset, c = null;
  for (const f of n.items) {
    const { start: p, key: h, sep: x, value: u } = f, g = $e(p, {
      indicator: "explicit-key-ind",
      next: h ?? (x == null ? void 0 : x[0]),
      offset: d,
      onError: a,
      parentIndent: n.indent,
      startOnNewline: !0
    }), k = !g.found;
    if (k) {
      if (h && (h.type === "block-seq" ? a(d, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in h && h.indent !== n.indent && a(d, "BAD_INDENT", hn)), !g.anchor && !g.tag && !x) {
        c = g.end, g.comment && (o.comment ? o.comment += `
` + g.comment : o.comment = g.comment);
        continue;
      }
      (g.newlineAfterProp || pt(h)) && a(h ?? p[p.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else ((m = g.found) == null ? void 0 : m.indent) !== n.indent && a(d, "BAD_INDENT", hn);
    s.atKey = !0;
    const y = g.end, S = h ? t(s, h, g, a) : e(s, y, p, null, g, a);
    s.schema.compat && Ss(n.indent, h, a), s.atKey = !1, gi(s, o.items, S) && a(y, "DUPLICATE_KEY", "Map keys must be unique");
    const C = $e(x ?? [], {
      indicator: "map-value-ind",
      next: u,
      offset: S.range[2],
      onError: a,
      parentIndent: n.indent,
      startOnNewline: !h || h.type === "block-scalar"
    });
    if (d = C.end, C.found) {
      k && ((u == null ? void 0 : u.type) === "block-map" && !C.hasNewline && a(d, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), s.options.strict && g.start < C.found.offset - 1024 && a(S.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const I = u ? t(s, u, C, a) : e(s, d, x, null, C, a);
      s.schema.compat && Ss(n.indent, u, a), d = I.range[2];
      const L = new ie(S, I);
      s.options.keepSourceTokens && (L.srcToken = f), o.items.push(L);
    } else {
      k && a(S.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), C.comment && (S.comment ? S.comment += `
` + C.comment : S.comment = C.comment);
      const I = new ie(S);
      s.options.keepSourceTokens && (I.srcToken = f), o.items.push(I);
    }
  }
  return c && c < d && a(c, "IMPOSSIBLE", "Map comment with trailing content"), o.range = [n.offset, d, c ?? d], o;
}
function ar({ composeNode: t, composeEmptyNode: e }, s, n, a, r) {
  const l = (r == null ? void 0 : r.nodeClass) ?? Fe, o = new l(s.schema);
  s.atRoot && (s.atRoot = !1), s.atKey && (s.atKey = !1);
  let d = n.offset, c = null;
  for (const { start: m, value: f } of n.items) {
    const p = $e(m, {
      indicator: "seq-item-ind",
      next: f,
      offset: d,
      onError: a,
      parentIndent: n.indent,
      startOnNewline: !0
    });
    if (!p.found)
      if (p.anchor || p.tag || f)
        (f == null ? void 0 : f.type) === "block-seq" ? a(p.end, "BAD_INDENT", "All sequence items must start at the same column") : a(d, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        c = p.end, p.comment && (o.comment = p.comment);
        continue;
      }
    const h = f ? t(s, f, p, a) : e(s, p.end, m, null, p, a);
    s.schema.compat && Ss(n.indent, f, a), d = h.range[2], o.items.push(h);
  }
  return o.range = [n.offset, d, c ?? d], o;
}
function kt(t, e, s, n) {
  let a = "";
  if (t) {
    let r = !1, l = "";
    for (const o of t) {
      const { source: d, type: c } = o;
      switch (c) {
        case "space":
          r = !0;
          break;
        case "comment": {
          s && !r && n(o, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const m = d.substring(1) || " ";
          a ? a += l + m : a = m, l = "";
          break;
        }
        case "newline":
          a && (l += d), r = !0;
          break;
        default:
          n(o, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += d.length;
    }
  }
  return { comment: a, offset: e };
}
const ds = "Block collections are not allowed within flow collections", us = (t) => t && (t.type === "block-map" || t.type === "block-seq");
function rr({ composeNode: t, composeEmptyNode: e }, s, n, a, r) {
  var g;
  const l = n.start.source === "{", o = l ? "flow map" : "flow sequence", d = (r == null ? void 0 : r.nodeClass) ?? (l ? ue : Fe), c = new d(s.schema);
  c.flow = !0;
  const m = s.atRoot;
  m && (s.atRoot = !1), s.atKey && (s.atKey = !1);
  let f = n.offset + n.start.source.length;
  for (let k = 0; k < n.items.length; ++k) {
    const y = n.items[k], { start: S, key: C, sep: I, value: L } = y, E = $e(S, {
      flow: o,
      indicator: "explicit-key-ind",
      next: C ?? (I == null ? void 0 : I[0]),
      offset: f,
      onError: a,
      parentIndent: n.indent,
      startOnNewline: !1
    });
    if (!E.found) {
      if (!E.anchor && !E.tag && !I && !L) {
        k === 0 && E.comma ? a(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`) : k < n.items.length - 1 && a(E.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${o}`), E.comment && (c.comment ? c.comment += `
` + E.comment : c.comment = E.comment), f = E.end;
        continue;
      }
      !l && s.options.strict && pt(C) && a(
        C,
        // checked by containsNewline()
        "MULTILINE_IMPLICIT_KEY",
        "Implicit keys of flow sequence pairs need to be on a single line"
      );
    }
    if (k === 0)
      E.comma && a(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`);
    else if (E.comma || a(E.start, "MISSING_CHAR", `Missing , between ${o} items`), E.comment) {
      let b = "";
      e: for (const A of S)
        switch (A.type) {
          case "comma":
          case "space":
            break;
          case "comment":
            b = A.source.substring(1);
            break e;
          default:
            break e;
        }
      if (b) {
        let A = c.items[c.items.length - 1];
        X(A) && (A = A.value ?? A.key), A.comment ? A.comment += `
` + b : A.comment = b, E.comment = E.comment.substring(b.length + 1);
      }
    }
    if (!l && !I && !E.found) {
      const b = L ? t(s, L, E, a) : e(s, E.end, I, null, E, a);
      c.items.push(b), f = b.range[2], us(L) && a(b.range, "BLOCK_IN_FLOW", ds);
    } else {
      s.atKey = !0;
      const b = E.end, A = C ? t(s, C, E, a) : e(s, b, S, null, E, a);
      us(C) && a(A.range, "BLOCK_IN_FLOW", ds), s.atKey = !1;
      const P = $e(I ?? [], {
        flow: o,
        indicator: "map-value-ind",
        next: L,
        offset: A.range[2],
        onError: a,
        parentIndent: n.indent,
        startOnNewline: !1
      });
      if (P.found) {
        if (!l && !E.found && s.options.strict) {
          if (I)
            for (const F of I) {
              if (F === P.found)
                break;
              if (F.type === "newline") {
                a(F, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          E.start < P.found.offset - 1024 && a(P.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else L && ("source" in L && ((g = L.source) == null ? void 0 : g[0]) === ":" ? a(L, "MISSING_CHAR", `Missing space after : in ${o}`) : a(P.start, "MISSING_CHAR", `Missing , or : between ${o} items`));
      const M = L ? t(s, L, P, a) : P.found ? e(s, P.end, I, null, P, a) : null;
      M ? us(L) && a(M.range, "BLOCK_IN_FLOW", ds) : P.comment && (A.comment ? A.comment += `
` + P.comment : A.comment = P.comment);
      const J = new ie(A, M);
      if (s.options.keepSourceTokens && (J.srcToken = y), l) {
        const F = c;
        gi(s, F.items, A) && a(b, "DUPLICATE_KEY", "Map keys must be unique"), F.items.push(J);
      } else {
        const F = new ue(s.schema);
        F.flow = !0, F.items.push(J);
        const W = (M ?? A).range;
        F.range = [A.range[0], W[1], W[2]], c.items.push(F);
      }
      f = M ? M.range[2] : P.end;
    }
  }
  const p = l ? "}" : "]", [h, ...x] = n.end;
  let u = f;
  if ((h == null ? void 0 : h.source) === p)
    u = h.offset + h.source.length;
  else {
    const k = o[0].toUpperCase() + o.substring(1), y = m ? `${k} must end with a ${p}` : `${k} in block collection must be sufficiently indented and end with a ${p}`;
    a(f, m ? "MISSING_CHAR" : "BAD_INDENT", y), h && h.source.length !== 1 && x.unshift(h);
  }
  if (x.length > 0) {
    const k = kt(x, u, s.options.strict, a);
    k.comment && (c.comment ? c.comment += `
` + k.comment : c.comment = k.comment), c.range = [n.offset, u, k.offset];
  } else
    c.range = [n.offset, u, u];
  return c;
}
function hs(t, e, s, n, a, r) {
  const l = s.type === "block-map" ? ir(t, e, s, n, r) : s.type === "block-seq" ? ar(t, e, s, n, r) : rr(t, e, s, n, r), o = l.constructor;
  return a === "!" || a === o.tagName ? (l.tag = o.tagName, l) : (a && (l.tag = a), l);
}
function lr(t, e, s, n, a) {
  var p;
  const r = n.tag, l = r ? e.directives.tagName(r.source, (h) => a(r, "TAG_RESOLVE_FAILED", h)) : null;
  if (s.type === "block-seq") {
    const { anchor: h, newlineAfterProp: x } = n, u = h && r ? h.offset > r.offset ? h : r : h ?? r;
    u && (!x || x.offset < u.offset) && a(u, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const o = s.type === "block-map" ? "map" : s.type === "block-seq" ? "seq" : s.start.source === "{" ? "map" : "seq";
  if (!r || !l || l === "!" || l === ue.tagName && o === "map" || l === Fe.tagName && o === "seq")
    return hs(t, e, s, a, l);
  let d = e.schema.tags.find((h) => h.tag === l && h.collection === o);
  if (!d) {
    const h = e.schema.knownTags[l];
    if ((h == null ? void 0 : h.collection) === o)
      e.schema.tags.push(Object.assign({}, h, { default: !1 })), d = h;
    else
      return h ? a(r, "BAD_COLLECTION_TYPE", `${h.tag} used for ${o} collection, but expects ${h.collection ?? "scalar"}`, !0) : a(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${l}`, !0), hs(t, e, s, a, l);
  }
  const c = hs(t, e, s, a, l, d), m = ((p = d.resolve) == null ? void 0 : p.call(d, c, (h) => a(r, "TAG_RESOLVE_FAILED", h), e.options)) ?? c, f = V(m) ? m : new T(m);
  return f.range = c.range, f.tag = l, d != null && d.format && (f.format = d.format), f;
}
function or(t, e, s) {
  const n = e.offset, a = cr(e, t.options.strict, s);
  if (!a)
    return { value: "", type: null, comment: "", range: [n, n, n] };
  const r = a.mode === ">" ? T.BLOCK_FOLDED : T.BLOCK_LITERAL, l = e.source ? dr(e.source) : [];
  let o = l.length;
  for (let u = l.length - 1; u >= 0; --u) {
    const g = l[u][1];
    if (g === "" || g === "\r")
      o = u;
    else
      break;
  }
  if (o === 0) {
    const u = a.chomp === "+" && l.length > 0 ? `
`.repeat(Math.max(1, l.length - 1)) : "";
    let g = n + a.length;
    return e.source && (g += e.source.length), { value: u, type: r, comment: a.comment, range: [n, g, g] };
  }
  let d = e.indent + a.indent, c = e.offset + a.length, m = 0;
  for (let u = 0; u < o; ++u) {
    const [g, k] = l[u];
    if (k === "" || k === "\r")
      a.indent === 0 && g.length > d && (d = g.length);
    else {
      g.length < d && s(c + g.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), a.indent === 0 && (d = g.length), m = u, d === 0 && !t.atRoot && s(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += g.length + k.length + 1;
  }
  for (let u = l.length - 1; u >= o; --u)
    l[u][0].length > d && (o = u + 1);
  let f = "", p = "", h = !1;
  for (let u = 0; u < m; ++u)
    f += l[u][0].slice(d) + `
`;
  for (let u = m; u < o; ++u) {
    let [g, k] = l[u];
    c += g.length + k.length + 1;
    const y = k[k.length - 1] === "\r";
    if (y && (k = k.slice(0, -1)), k && g.length < d) {
      const C = `Block scalar lines must not be less indented than their ${a.indent ? "explicit indentation indicator" : "first line"}`;
      s(c - k.length - (y ? 2 : 1), "BAD_INDENT", C), g = "";
    }
    r === T.BLOCK_LITERAL ? (f += p + g.slice(d) + k, p = `
`) : g.length > d || k[0] === "	" ? (p === " " ? p = `
` : !h && p === `
` && (p = `

`), f += p + g.slice(d) + k, p = `
`, h = !0) : k === "" ? p === `
` ? f += `
` : p = `
` : (f += p + k, p = " ", h = !1);
  }
  switch (a.chomp) {
    case "-":
      break;
    case "+":
      for (let u = o; u < l.length; ++u)
        f += `
` + l[u][0].slice(d);
      f[f.length - 1] !== `
` && (f += `
`);
      break;
    default:
      f += `
`;
  }
  const x = n + a.length + e.source.length;
  return { value: f, type: r, comment: a.comment, range: [n, x, x] };
}
function cr({ offset: t, props: e }, s, n) {
  if (e[0].type !== "block-scalar-header")
    return n(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: a } = e[0], r = a[0];
  let l = 0, o = "", d = -1;
  for (let p = 1; p < a.length; ++p) {
    const h = a[p];
    if (!o && (h === "-" || h === "+"))
      o = h;
    else {
      const x = Number(h);
      !l && x ? l = x : d === -1 && (d = t + p);
    }
  }
  d !== -1 && n(d, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${a}`);
  let c = !1, m = "", f = a.length;
  for (let p = 1; p < e.length; ++p) {
    const h = e[p];
    switch (h.type) {
      case "space":
        c = !0;
      case "newline":
        f += h.source.length;
        break;
      case "comment":
        s && !c && n(h, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), f += h.source.length, m = h.source.substring(1);
        break;
      case "error":
        n(h, "UNEXPECTED_TOKEN", h.message), f += h.source.length;
        break;
      default: {
        const x = `Unexpected token in block scalar header: ${h.type}`;
        n(h, "UNEXPECTED_TOKEN", x);
        const u = h.source;
        u && typeof u == "string" && (f += u.length);
      }
    }
  }
  return { mode: r, indent: l, chomp: o, comment: m, length: f };
}
function dr(t) {
  const e = t.split(/\n( *)/), s = e[0], n = s.match(/^( *)/), r = [n != null && n[1] ? [n[1], s.slice(n[1].length)] : ["", s]];
  for (let l = 1; l < e.length; l += 2)
    r.push([e[l], e[l + 1]]);
  return r;
}
function ur(t, e, s) {
  const { offset: n, type: a, source: r, end: l } = t;
  let o, d;
  const c = (p, h, x) => s(n + p, h, x);
  switch (a) {
    case "scalar":
      o = T.PLAIN, d = hr(r, c);
      break;
    case "single-quoted-scalar":
      o = T.QUOTE_SINGLE, d = fr(r, c);
      break;
    case "double-quoted-scalar":
      o = T.QUOTE_DOUBLE, d = mr(r, c);
      break;
    default:
      return s(t, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${a}`), {
        value: "",
        type: null,
        comment: "",
        range: [n, n + r.length, n + r.length]
      };
  }
  const m = n + r.length, f = kt(l, m, e, s);
  return {
    value: d,
    type: o,
    comment: f.comment,
    range: [n, m, f.offset]
  };
}
function hr(t, e) {
  let s = "";
  switch (t[0]) {
    case "	":
      s = "a tab character";
      break;
    case ",":
      s = "flow indicator character ,";
      break;
    case "%":
      s = "directive indicator character %";
      break;
    case "|":
    case ">": {
      s = `block scalar indicator ${t[0]}`;
      break;
    }
    case "@":
    case "`": {
      s = `reserved character ${t[0]}`;
      break;
    }
  }
  return s && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${s}`), xi(t);
}
function fr(t, e) {
  return (t[t.length - 1] !== "'" || t.length === 1) && e(t.length, "MISSING_CHAR", "Missing closing 'quote"), xi(t.slice(1, -1)).replace(/''/g, "'");
}
function xi(t) {
  const e = /(.*?)\r?\n/sy;
  let s = e.exec(t);
  if (!s)
    return t;
  let n, a;
  try {
    n = new RegExp("(?<![ 	])[ 	]+$"), a = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
  } catch {
    n = /[ \t]+$/, a = /^[ \t]+|[ \t]+$/g;
  }
  let r = s[1].replace(n, ""), l = " ", o = e.lastIndex;
  for (; s = e.exec(t); ) {
    const c = s[1].replace(a, "");
    c === "" ? l === `
` ? r += l : l = `
` : (r += l + c, l = " "), o = e.lastIndex;
  }
  const d = /[ \t]*(.*)/sy;
  return d.lastIndex = o, s = d.exec(t), r + l + ((s == null ? void 0 : s[1]) ?? "");
}
function mr(t, e) {
  let s = "";
  for (let n = 1; n < t.length - 1; ++n) {
    const a = t[n];
    if (!(a === "\r" && t[n + 1] === `
`))
      if (a === `
`) {
        const { fold: r, offset: l } = pr(t, n);
        s += r, n = l;
      } else if (a === "\\") {
        let r = t[++n];
        const l = gr[r];
        if (l)
          s += l;
        else if (r === `
`)
          for (r = t[n + 1]; r === " " || r === "	"; )
            r = t[++n + 1];
        else if (r === "\r" && t[n + 1] === `
`)
          for (r = t[++n + 1]; r === " " || r === "	"; )
            r = t[++n + 1];
        else if (r === "x" || r === "u" || r === "U") {
          const o = r === "x" ? 2 : r === "u" ? 4 : 8;
          s += xr(t, n + 1, o, e), n += o;
        } else {
          const o = t.substr(n - 1, 2);
          e(n - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), s += o;
        }
      } else if (a === " " || a === "	") {
        const r = n;
        let l = t[n + 1];
        for (; l === " " || l === "	"; )
          l = t[++n + 1];
        l !== `
` && !(l === "\r" && t[n + 2] === `
`) && (s += n > r ? t.slice(r, n + 1) : a);
      } else
        s += a;
  }
  return (t[t.length - 1] !== '"' || t.length === 1) && e(t.length, "MISSING_CHAR", 'Missing closing "quote'), s;
}
function pr(t, e) {
  let s = "", n = t[e + 1];
  for (; (n === " " || n === "	" || n === `
` || n === "\r") && !(n === "\r" && t[e + 2] !== `
`); )
    n === `
` && (s += `
`), e += 1, n = t[e + 1];
  return s || (s = " "), { fold: s, offset: e };
}
const gr = {
  0: "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: `
`,
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "",
  // Unicode next line
  _: " ",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function xr(t, e, s, n) {
  const a = t.substr(e, s), l = a.length === s && /^[0-9a-fA-F]+$/.test(a) ? parseInt(a, 16) : NaN;
  try {
    return String.fromCodePoint(l);
  } catch {
    const o = t.substr(e - 2, s + 2);
    return n(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), o;
  }
}
function yi(t, e, s, n) {
  const { value: a, type: r, comment: l, range: o } = e.type === "block-scalar" ? or(t, e, n) : ur(e, t.options.strict, n), d = s ? t.directives.tagName(s.source, (f) => n(s, "TAG_RESOLVE_FAILED", f)) : null;
  let c;
  t.options.stringKeys && t.atKey ? c = t.schema[be] : d ? c = yr(t.schema, a, d, s, n) : e.type === "scalar" ? c = br(t, a, e, n) : c = t.schema[be];
  let m;
  try {
    const f = c.resolve(a, (p) => n(s ?? e, "TAG_RESOLVE_FAILED", p), t.options);
    m = U(f) ? f : new T(f);
  } catch (f) {
    const p = f instanceof Error ? f.message : String(f);
    n(s ?? e, "TAG_RESOLVE_FAILED", p), m = new T(a);
  }
  return m.range = o, m.source = a, r && (m.type = r), d && (m.tag = d), c.format && (m.format = c.format), l && (m.comment = l), m;
}
function yr(t, e, s, n, a) {
  var o;
  if (s === "!")
    return t[be];
  const r = [];
  for (const d of t.tags)
    if (!d.collection && d.tag === s)
      if (d.default && d.test)
        r.push(d);
      else
        return d;
  for (const d of r)
    if ((o = d.test) != null && o.test(e))
      return d;
  const l = t.knownTags[s];
  return l && !l.collection ? (t.tags.push(Object.assign({}, l, { default: !1, test: void 0 })), l) : (a(n, "TAG_RESOLVE_FAILED", `Unresolved tag: ${s}`, s !== "tag:yaml.org,2002:str"), t[be]);
}
function br({ atKey: t, directives: e, schema: s }, n, a, r) {
  const l = s.tags.find((o) => {
    var d;
    return (o.default === !0 || t && o.default === "key") && ((d = o.test) == null ? void 0 : d.test(n));
  }) || s[be];
  if (s.compat) {
    const o = s.compat.find((d) => {
      var c;
      return d.default && ((c = d.test) == null ? void 0 : c.test(n));
    }) ?? s[be];
    if (l.tag !== o.tag) {
      const d = e.tagString(l.tag), c = e.tagString(o.tag), m = `Value may be parsed as either ${d} or ${c}`;
      r(a, "TAG_RESOLVE_FAILED", m, !0);
    }
  }
  return l;
}
function wr(t, e, s) {
  if (e) {
    s ?? (s = e.length);
    for (let n = s - 1; n >= 0; --n) {
      let a = e[n];
      switch (a.type) {
        case "space":
        case "comment":
        case "newline":
          t -= a.source.length;
          continue;
      }
      for (a = e[++n]; (a == null ? void 0 : a.type) === "space"; )
        t += a.source.length, a = e[++n];
      break;
    }
  }
  return t;
}
const kr = { composeNode: bi, composeEmptyNode: Vs };
function bi(t, e, s, n) {
  const a = t.atKey, { spaceBefore: r, comment: l, anchor: o, tag: d } = s;
  let c, m = !0;
  switch (e.type) {
    case "alias":
      c = jr(t, e, n), (o || d) && n(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = yi(t, e, d, n), o && (c.anchor = o.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        c = lr(kr, t, e, s, n), o && (c.anchor = o.source.substring(1));
      } catch (f) {
        const p = f instanceof Error ? f.message : String(f);
        n(e, "RESOURCE_EXHAUSTION", p);
      }
      break;
    default: {
      const f = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
      n(e, "UNEXPECTED_TOKEN", f), m = !1;
    }
  }
  return c ?? (c = Vs(t, e.offset, void 0, null, s, n)), o && c.anchor === "" && n(o, "BAD_ALIAS", "Anchor cannot be an empty string"), a && t.options.stringKeys && (!U(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && n(d ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), r && (c.spaceBefore = !0), l && (e.type === "scalar" && e.source === "" ? c.comment = l : c.commentBefore = l), t.options.keepSourceTokens && m && (c.srcToken = e), c;
}
function Vs(t, e, s, n, { spaceBefore: a, comment: r, anchor: l, tag: o, end: d }, c) {
  const m = {
    type: "scalar",
    offset: wr(e, s, n),
    indent: -1,
    source: ""
  }, f = yi(t, m, o, c);
  return l && (f.anchor = l.source.substring(1), f.anchor === "" && c(l, "BAD_ALIAS", "Anchor cannot be an empty string")), a && (f.spaceBefore = !0), r && (f.comment = r, f.range[2] = d), f;
}
function jr({ options: t }, { offset: e, source: s, end: n }, a) {
  const r = new Ds(s.substring(1));
  r.source === "" && a(e, "BAD_ALIAS", "Alias cannot be an empty string"), r.source.endsWith(":") && a(e + s.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const l = e + s.length, o = kt(n, l, t.strict, a);
  return r.range = [e, l, o.offset], o.comment && (r.comment = o.comment), r;
}
function Nr(t, e, { offset: s, start: n, value: a, end: r }, l) {
  const o = Object.assign({ _directives: e }, t), d = new as(void 0, o), c = {
    atKey: !1,
    atRoot: !0,
    directives: d.directives,
    options: d.options,
    schema: d.schema
  }, m = $e(n, {
    indicator: "doc-start",
    next: a ?? (r == null ? void 0 : r[0]),
    offset: s,
    onError: l,
    parentIndent: 0,
    startOnNewline: !0
  });
  m.found && (d.directives.docStart = !0, a && (a.type === "block-map" || a.type === "block-seq") && !m.hasNewline && l(m.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), d.contents = a ? bi(c, a, m, l) : Vs(c, m.end, n, null, m, l);
  const f = d.contents.range[2], p = kt(r, f, !1, l);
  return p.comment && (d.comment = p.comment), d.range = [s, f, p.offset], d;
}
function ot(t) {
  if (typeof t == "number")
    return [t, t + 1];
  if (Array.isArray(t))
    return t.length === 2 ? t : [t[0], t[1]];
  const { offset: e, source: s } = t;
  return [e, e + (typeof s == "string" ? s.length : 1)];
}
function fn(t) {
  var a;
  let e = "", s = !1, n = !1;
  for (let r = 0; r < t.length; ++r) {
    const l = t[r];
    switch (l[0]) {
      case "#":
        e += (e === "" ? "" : n ? `

` : `
`) + (l.substring(1) || " "), s = !0, n = !1;
        break;
      case "%":
        ((a = t[r + 1]) == null ? void 0 : a[0]) !== "#" && (r += 1), s = !1;
        break;
      default:
        s || (n = !0), s = !1;
    }
  }
  return { comment: e, afterEmptyLine: n };
}
class vr {
  constructor(e = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (s, n, a, r) => {
      const l = ot(s);
      r ? this.warnings.push(new nr(l, n, a)) : this.errors.push(new dt(l, n, a));
    }, this.directives = new ne({ version: e.version || "1.2" }), this.options = e;
  }
  decorate(e, s) {
    const { comment: n, afterEmptyLine: a } = fn(this.prelude);
    if (n) {
      const r = e.contents;
      if (s)
        e.comment = e.comment ? `${e.comment}
${n}` : n;
      else if (a || e.directives.docStart || !r)
        e.commentBefore = n;
      else if (q(r) && !r.flow && r.items.length > 0) {
        let l = r.items[0];
        X(l) && (l = l.key);
        const o = l.commentBefore;
        l.commentBefore = o ? `${n}
${o}` : n;
      } else {
        const l = r.commentBefore;
        r.commentBefore = l ? `${n}
${l}` : n;
      }
    }
    if (s) {
      for (let r = 0; r < this.errors.length; ++r)
        e.errors.push(this.errors[r]);
      for (let r = 0; r < this.warnings.length; ++r)
        e.warnings.push(this.warnings[r]);
    } else
      e.errors = this.errors, e.warnings = this.warnings;
    this.prelude = [], this.errors = [], this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: fn(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(e, s = !1, n = -1) {
    for (const a of e)
      yield* this.next(a);
    yield* this.end(s, n);
  }
  /** Advance the composer by one CST token. */
  *next(e) {
    switch (e.type) {
      case "directive":
        this.directives.add(e.source, (s, n, a) => {
          const r = ot(e);
          r[0] += s, this.onError(r, "BAD_DIRECTIVE", n, a);
        }), this.prelude.push(e.source), this.atDirectives = !0;
        break;
      case "document": {
        const s = Nr(this.options, this.directives, e, this.onError);
        this.atDirectives && !s.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(s, !1), this.doc && (yield this.doc), this.doc = s, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(e.source);
        break;
      case "error": {
        const s = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new dt(ot(e), "UNEXPECTED_TOKEN", s);
        this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const n = "Unexpected doc-end without preceding document";
          this.errors.push(new dt(ot(e), "UNEXPECTED_TOKEN", n));
          break;
        }
        this.doc.directives.docEnd = !0;
        const s = kt(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), s.comment) {
          const n = this.doc.comment;
          this.doc.comment = n ? `${n}
${s.comment}` : s.comment;
        }
        this.doc.range[2] = s.offset;
        break;
      }
      default:
        this.errors.push(new dt(ot(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(e = !1, s = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (e) {
      const n = Object.assign({ _directives: this.directives }, this.options), a = new as(void 0, n);
      this.atDirectives && this.onError(s, "MISSING_CHAR", "Missing directives-end indicator line"), a.range = [0, s, s], this.decorate(a, !1), yield a;
    }
  }
}
const wi = "\uFEFF", ki = "", ji = "", Cs = "";
function Sr(t) {
  switch (t) {
    case wi:
      return "byte-order-mark";
    case ki:
      return "doc-mode";
    case ji:
      return "flow-error-end";
    case Cs:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case `
`:
    case `\r
`:
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (t[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}
function pe(t) {
  switch (t) {
    case void 0:
    case " ":
    case `
`:
    case "\r":
    case "	":
      return !0;
    default:
      return !1;
  }
}
const mn = new Set("0123456789ABCDEFabcdef"), Cr = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), Et = new Set(",[]{}"), Ar = new Set(` ,[]{}
\r	`), fs = (t) => !t || Ar.has(t);
class Er {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(e, s = !1) {
    if (e) {
      if (typeof e != "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
    }
    this.atEnd = !s;
    let n = this.next ?? "stream";
    for (; n && (s || this.hasChars(1)); )
      n = yield* this.parseNext(n);
  }
  atLineEnd() {
    let e = this.pos, s = this.buffer[e];
    for (; s === " " || s === "	"; )
      s = this.buffer[++e];
    return !s || s === "#" || s === `
` ? !0 : s === "\r" ? this.buffer[e + 1] === `
` : !1;
  }
  charAt(e) {
    return this.buffer[this.pos + e];
  }
  continueScalar(e) {
    let s = this.buffer[e];
    if (this.indentNext > 0) {
      let n = 0;
      for (; s === " "; )
        s = this.buffer[++n + e];
      if (s === "\r") {
        const a = this.buffer[n + e + 1];
        if (a === `
` || !a && !this.atEnd)
          return e + n + 1;
      }
      return s === `
` || n >= this.indentNext || !s && !this.atEnd ? e + n : -1;
    }
    if (s === "-" || s === ".") {
      const n = this.buffer.substr(e, 3);
      if ((n === "---" || n === "...") && pe(this.buffer[e + 3]))
        return -1;
    }
    return e;
  }
  getLine() {
    let e = this.lineEndPos;
    return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e));
  }
  hasChars(e) {
    return this.pos + e <= this.buffer.length;
  }
  setNext(e) {
    return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
  }
  peek(e) {
    return this.buffer.substr(this.pos, e);
  }
  *parseNext(e) {
    switch (e) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let e = this.getLine();
    if (e === null)
      return this.setNext("stream");
    if (e[0] === wi && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
      let s = e.length, n = e.indexOf("#");
      for (; n !== -1; ) {
        const r = e[n - 1];
        if (r === " " || r === "	") {
          s = n - 1;
          break;
        } else
          n = e.indexOf("#", n + 1);
      }
      for (; ; ) {
        const r = e[s - 1];
        if (r === " " || r === "	")
          s -= 1;
        else
          break;
      }
      const a = (yield* this.pushCount(s)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(e.length - a), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const s = yield* this.pushSpaces(!0);
      return yield* this.pushCount(e.length - s), yield* this.pushNewline(), "stream";
    }
    return yield ki, yield* this.parseLineStart();
  }
  *parseLineStart() {
    const e = this.charAt(0);
    if (!e && !this.atEnd)
      return this.setNext("line-start");
    if (e === "-" || e === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const s = this.peek(3);
      if ((s === "---" || s === "...") && pe(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, s === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !pe(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [e, s] = this.peek(2);
    if (!s && !this.atEnd)
      return this.setNext("block-start");
    if ((e === "-" || e === "?" || e === ":") && pe(s)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += n, "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const e = this.getLine();
    if (e === null)
      return this.setNext("doc");
    let s = yield* this.pushIndicators();
    switch (e[s]) {
      case "#":
        yield* this.pushCount(e.length - s);
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(fs), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return s += yield* this.parseBlockScalarHeader(), s += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - s), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let e, s, n = -1;
    do
      e = yield* this.pushNewline(), e > 0 ? (s = yield* this.pushSpaces(!1), this.indentValue = n = s) : s = 0, s += yield* this.pushSpaces(!0);
    while (e + s > 0);
    const a = this.getLine();
    if (a === null)
      return this.setNext("flow");
    if ((n !== -1 && n < this.indentNext && a[0] !== "#" || n === 0 && (a.startsWith("---") || a.startsWith("...")) && pe(a[3])) && !(n === this.indentNext - 1 && this.flowLevel === 1 && (a[0] === "]" || a[0] === "}")))
      return this.flowLevel = 0, yield ji, yield* this.parseLineStart();
    let r = 0;
    for (; a[r] === ","; )
      r += yield* this.pushCount(1), r += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (r += yield* this.pushIndicators(), a[r]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(a.length - r), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(fs), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const l = this.charAt(1);
        if (this.flowKey || pe(l) || l === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const e = this.charAt(0);
    let s = this.buffer.indexOf(e, this.pos + 1);
    if (e === "'")
      for (; s !== -1 && this.buffer[s + 1] === "'"; )
        s = this.buffer.indexOf("'", s + 2);
    else
      for (; s !== -1; ) {
        let r = 0;
        for (; this.buffer[s - 1 - r] === "\\"; )
          r += 1;
        if (r % 2 === 0)
          break;
        s = this.buffer.indexOf('"', s + 1);
      }
    const n = this.buffer.substring(0, s);
    let a = n.indexOf(`
`, this.pos);
    if (a !== -1) {
      for (; a !== -1; ) {
        const r = this.continueScalar(a + 1);
        if (r === -1)
          break;
        a = n.indexOf(`
`, r);
      }
      a !== -1 && (s = a - (n[a - 1] === "\r" ? 2 : 1));
    }
    if (s === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      s = this.buffer.length;
    }
    return yield* this.pushToIndex(s + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let e = this.pos;
    for (; ; ) {
      const s = this.buffer[++e];
      if (s === "+")
        this.blockScalarKeep = !0;
      else if (s > "0" && s <= "9")
        this.blockScalarIndent = Number(s) - 1;
      else if (s !== "-")
        break;
    }
    return yield* this.pushUntil((s) => pe(s) || s === "#");
  }
  *parseBlockScalar() {
    let e = this.pos - 1, s = 0, n;
    e: for (let r = this.pos; n = this.buffer[r]; ++r)
      switch (n) {
        case " ":
          s += 1;
          break;
        case `
`:
          e = r, s = 0;
          break;
        case "\r": {
          const l = this.buffer[r + 1];
          if (!l && !this.atEnd)
            return this.setNext("block-scalar");
          if (l === `
`)
            break;
        }
        default:
          break e;
      }
    if (!n && !this.atEnd)
      return this.setNext("block-scalar");
    if (s >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = s : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const r = this.continueScalar(e + 1);
        if (r === -1)
          break;
        e = this.buffer.indexOf(`
`, r);
      } while (e !== -1);
      if (e === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        e = this.buffer.length;
      }
    }
    let a = e + 1;
    for (n = this.buffer[a]; n === " "; )
      n = this.buffer[++a];
    if (n === "	") {
      for (; n === "	" || n === " " || n === "\r" || n === `
`; )
        n = this.buffer[++a];
      e = a - 1;
    } else if (!this.blockScalarKeep)
      do {
        let r = e - 1, l = this.buffer[r];
        l === "\r" && (l = this.buffer[--r]);
        const o = r;
        for (; l === " "; )
          l = this.buffer[--r];
        if (l === `
` && r >= this.pos && r + 1 + s > o)
          e = r;
        else
          break;
      } while (!0);
    return yield Cs, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const e = this.flowLevel > 0;
    let s = this.pos - 1, n = this.pos - 1, a;
    for (; a = this.buffer[++n]; )
      if (a === ":") {
        const r = this.buffer[n + 1];
        if (pe(r) || e && Et.has(r))
          break;
        s = n;
      } else if (pe(a)) {
        let r = this.buffer[n + 1];
        if (a === "\r" && (r === `
` ? (n += 1, a = `
`, r = this.buffer[n + 1]) : s = n), r === "#" || e && Et.has(r))
          break;
        if (a === `
`) {
          const l = this.continueScalar(n + 1);
          if (l === -1)
            break;
          n = Math.max(n, l - 2);
        }
      } else {
        if (e && Et.has(a))
          break;
        s = n;
      }
    return !a && !this.atEnd ? this.setNext("plain-scalar") : (yield Cs, yield* this.pushToIndex(s + 1, !0), e ? "flow" : "doc");
  }
  *pushCount(e) {
    return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
  }
  *pushToIndex(e, s) {
    const n = this.buffer.slice(this.pos, e);
    return n ? (yield n, this.pos += n.length, n.length) : (s && (yield ""), 0);
  }
  *pushIndicators() {
    let e = 0;
    e: for (; ; ) {
      switch (this.charAt(0)) {
        case "!":
          e += yield* this.pushTag(), e += yield* this.pushSpaces(!0);
          continue e;
        case "&":
          e += yield* this.pushUntil(fs), e += yield* this.pushSpaces(!0);
          continue e;
        case "-":
        case "?":
        case ":": {
          const s = this.flowLevel > 0, n = this.charAt(1);
          if (pe(n) || s && Et.has(n)) {
            s ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, e += yield* this.pushCount(1), e += yield* this.pushSpaces(!0);
            continue e;
          }
        }
      }
      break e;
    }
    return e;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let e = this.pos + 2, s = this.buffer[e];
      for (; !pe(s) && s !== ">"; )
        s = this.buffer[++e];
      return yield* this.pushToIndex(s === ">" ? e + 1 : e, !1);
    } else {
      let e = this.pos + 1, s = this.buffer[e];
      for (; s; )
        if (Cr.has(s))
          s = this.buffer[++e];
        else if (s === "%" && mn.has(this.buffer[e + 1]) && mn.has(this.buffer[e + 2]))
          s = this.buffer[e += 3];
        else
          break;
      return yield* this.pushToIndex(e, !1);
    }
  }
  *pushNewline() {
    const e = this.buffer[this.pos];
    return e === `
` ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(e) {
    let s = this.pos - 1, n;
    do
      n = this.buffer[++s];
    while (n === " " || e && n === "	");
    const a = s - this.pos;
    return a > 0 && (yield this.buffer.substr(this.pos, a), this.pos = s), a;
  }
  *pushUntil(e) {
    let s = this.pos, n = this.buffer[s];
    for (; !e(n); )
      n = this.buffer[++s];
    return yield* this.pushToIndex(s, !1);
  }
}
class Ir {
  constructor() {
    this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
      let s = 0, n = this.lineStarts.length;
      for (; s < n; ) {
        const r = s + n >> 1;
        this.lineStarts[r] < e ? s = r + 1 : n = r;
      }
      if (this.lineStarts[s] === e)
        return { line: s + 1, col: 1 };
      if (s === 0)
        return { line: 0, col: e };
      const a = this.lineStarts[s - 1];
      return { line: s, col: e - a + 1 };
    };
  }
}
function Ee(t, e) {
  for (let s = 0; s < t.length; ++s)
    if (t[s].type === e)
      return !0;
  return !1;
}
function pn(t) {
  for (let e = 0; e < t.length; ++e)
    switch (t[e].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return e;
    }
  return -1;
}
function Ni(t) {
  switch (t == null ? void 0 : t.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return !0;
    default:
      return !1;
  }
}
function It(t) {
  switch (t.type) {
    case "document":
      return t.start;
    case "block-map": {
      const e = t.items[t.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return t.items[t.items.length - 1].start;
    default:
      return [];
  }
}
function Je(t) {
  var s;
  if (t.length === 0)
    return [];
  let e = t.length;
  e: for (; --e >= 0; )
    switch (t[e].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break e;
    }
  for (; ((s = t[++e]) == null ? void 0 : s.type) === "space"; )
    ;
  return t.splice(e, t.length);
}
function zt(t, e) {
  if (e.length < 1e5)
    Array.prototype.push.apply(t, e);
  else
    for (let s = 0; s < e.length; ++s)
      t.push(e[s]);
}
function gn(t) {
  if (t.start.type === "flow-seq-start")
    for (const e of t.items)
      e.sep && !e.value && !Ee(e.start, "explicit-key-ind") && !Ee(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, Ni(e.value) ? e.value.end ? zt(e.value.end, e.sep) : e.value.end = e.sep : zt(e.start, e.sep), delete e.sep);
}
class Lr {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(e) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new Er(), this.onNewLine = e;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(e, s = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const n of this.lexer.lex(e, s))
      yield* this.next(n);
    s || (yield* this.end());
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(e) {
    if (this.source = e, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += e.length;
      return;
    }
    const s = Sr(e);
    if (s)
      if (s === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = s, yield* this.step(), s) {
          case "newline":
            this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
            break;
          case "space":
            this.atNewLine && e[0] === " " && (this.indent += e.length);
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            this.atNewLine && (this.indent += e.length);
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    else {
      const n = `Not a YAML token: ${e}`;
      yield* this.pop({ type: "error", offset: this.offset, message: n, source: e }), this.offset += e.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    for (; this.stack.length > 0; )
      yield* this.pop();
  }
  get sourceToken() {
    return {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  *step() {
    const e = this.peek(1);
    if (this.type === "doc-end" && (e == null ? void 0 : e.type) !== "doc-end") {
      for (; this.stack.length > 0; )
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!e)
      return yield* this.stream();
    switch (e.type) {
      case "document":
        return yield* this.document(e);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(e);
      case "block-scalar":
        return yield* this.blockScalar(e);
      case "block-map":
        return yield* this.blockMap(e);
      case "block-seq":
        return yield* this.blockSequence(e);
      case "flow-collection":
        return yield* this.flowCollection(e);
      case "doc-end":
        return yield* this.documentEnd(e);
    }
    yield* this.pop();
  }
  peek(e) {
    return this.stack[this.stack.length - e];
  }
  *pop(e) {
    const s = e ?? this.stack.pop();
    if (!s)
      yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
    else if (this.stack.length === 0)
      yield s;
    else {
      const n = this.peek(1);
      switch (s.type === "block-scalar" ? s.indent = "indent" in n ? n.indent : 0 : s.type === "flow-collection" && n.type === "document" && (s.indent = 0), s.type === "flow-collection" && gn(s), n.type) {
        case "document":
          n.value = s;
          break;
        case "block-scalar":
          n.props.push(s);
          break;
        case "block-map": {
          const a = n.items[n.items.length - 1];
          if (a.value) {
            n.items.push({ start: [], key: s, sep: [] }), this.onKeyLine = !0;
            return;
          } else if (a.sep)
            a.value = s;
          else {
            Object.assign(a, { key: s, sep: [] }), this.onKeyLine = !a.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const a = n.items[n.items.length - 1];
          a.value ? n.items.push({ start: [], value: s }) : a.value = s;
          break;
        }
        case "flow-collection": {
          const a = n.items[n.items.length - 1];
          !a || a.value ? n.items.push({ start: [], key: s, sep: [] }) : a.sep ? a.value = s : Object.assign(a, { key: s, sep: [] });
          return;
        }
        default:
          yield* this.pop(), yield* this.pop(s);
      }
      if ((n.type === "document" || n.type === "block-map" || n.type === "block-seq") && (s.type === "block-map" || s.type === "block-seq")) {
        const a = s.items[s.items.length - 1];
        a && !a.sep && !a.value && a.start.length > 0 && pn(a.start) === -1 && (s.indent === 0 || a.start.every((r) => r.type !== "comment" || r.indent < s.indent)) && (n.type === "document" ? n.end = a.start : n.items.push({ start: a.start }), s.items.splice(-1, 1));
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const e = {
          type: "document",
          offset: this.offset,
          start: []
        };
        this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(e) {
    if (e.value)
      return yield* this.lineEnd(e);
    switch (this.type) {
      case "doc-start": {
        pn(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        e.start.push(this.sourceToken);
        return;
    }
    const s = this.startBlockValue(e);
    s ? this.stack.push(s) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(e) {
    if (this.type === "map-value-ind") {
      const s = It(this.peek(2)), n = Je(s);
      let a;
      e.end ? (a = e.end, a.push(this.sourceToken), delete e.end) : a = [this.sourceToken];
      const r = {
        type: "block-map",
        offset: e.offset,
        indent: e.indent,
        items: [{ start: n, key: e, sep: a }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = r;
    } else
      yield* this.lineEnd(e);
  }
  *blockScalar(e) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        e.props.push(this.sourceToken);
        return;
      case "scalar":
        if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
          let s = this.source.indexOf(`
`) + 1;
          for (; s !== 0; )
            this.onNewLine(this.offset + s), s = this.source.indexOf(`
`, s) + 1;
        }
        yield* this.pop();
        break;
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(e) {
    var n;
    const s = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, s.value) {
          const a = "end" in s.value ? s.value.end : void 0, r = Array.isArray(a) ? a[a.length - 1] : void 0;
          (r == null ? void 0 : r.type) === "comment" ? a == null || a.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else s.sep ? s.sep.push(this.sourceToken) : s.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (s.value)
          e.items.push({ start: [this.sourceToken] });
        else if (s.sep)
          s.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(s.start, e.indent)) {
            const a = e.items[e.items.length - 2], r = (n = a == null ? void 0 : a.value) == null ? void 0 : n.end;
            if (Array.isArray(r)) {
              zt(r, s.start), r.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          s.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= e.indent) {
      const a = !this.onKeyLine && this.indent === e.indent, r = a && (s.sep || s.explicitKey) && this.type !== "seq-item-ind";
      let l = [];
      if (r && s.sep && !s.value) {
        const o = [];
        for (let d = 0; d < s.sep.length; ++d) {
          const c = s.sep[d];
          switch (c.type) {
            case "newline":
              o.push(d);
              break;
            case "space":
              break;
            case "comment":
              c.indent > e.indent && (o.length = 0);
              break;
            default:
              o.length = 0;
          }
        }
        o.length >= 2 && (l = s.sep.splice(o[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          r || s.value ? (l.push(this.sourceToken), e.items.push({ start: l }), this.onKeyLine = !0) : s.sep ? s.sep.push(this.sourceToken) : s.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !s.sep && !s.explicitKey ? (s.start.push(this.sourceToken), s.explicitKey = !0) : r || s.value ? (l.push(this.sourceToken), e.items.push({ start: l, explicitKey: !0 })) : this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken], explicitKey: !0 }]
          }), this.onKeyLine = !0;
          return;
        case "map-value-ind":
          if (s.explicitKey)
            if (s.sep)
              if (s.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (Ee(s.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: l, key: null, sep: [this.sourceToken] }]
                });
              else if (Ni(s.key) && !Ee(s.sep, "newline")) {
                const o = Je(s.start), d = s.key, c = s.sep;
                c.push(this.sourceToken), delete s.key, delete s.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: d, sep: c }]
                });
              } else l.length > 0 ? s.sep = s.sep.concat(l, this.sourceToken) : s.sep.push(this.sourceToken);
            else if (Ee(s.start, "newline"))
              Object.assign(s, { key: null, sep: [this.sourceToken] });
            else {
              const o = Je(s.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: o, key: null, sep: [this.sourceToken] }]
              });
            }
          else
            s.sep ? s.value || r ? e.items.push({ start: l, key: null, sep: [this.sourceToken] }) : Ee(s.sep, "map-value-ind") ? this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [], key: null, sep: [this.sourceToken] }]
            }) : s.sep.push(this.sourceToken) : Object.assign(s, { key: null, sep: [this.sourceToken] });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const o = this.flowScalar(this.type);
          r || s.value ? (e.items.push({ start: l, key: o, sep: [] }), this.onKeyLine = !0) : s.sep ? this.stack.push(o) : (Object.assign(s, { key: o, sep: [] }), this.onKeyLine = !0);
          return;
        }
        default: {
          const o = this.startBlockValue(e);
          if (o) {
            if (o.type === "block-seq") {
              if (!s.explicitKey && s.sep && !Ee(s.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else a && e.items.push({ start: l });
            this.stack.push(o);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(e) {
    var n;
    const s = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (s.value) {
          const a = "end" in s.value ? s.value.end : void 0, r = Array.isArray(a) ? a[a.length - 1] : void 0;
          (r == null ? void 0 : r.type) === "comment" ? a == null || a.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else
          s.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (s.value)
          e.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(s.start, e.indent)) {
            const a = e.items[e.items.length - 2], r = (n = a == null ? void 0 : a.value) == null ? void 0 : n.end;
            if (Array.isArray(r)) {
              zt(r, s.start), r.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          s.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (s.value || this.indent <= e.indent)
          break;
        s.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== e.indent)
          break;
        s.value || Ee(s.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : s.start.push(this.sourceToken);
        return;
    }
    if (this.indent > e.indent) {
      const a = this.startBlockValue(e);
      if (a) {
        this.stack.push(a);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(e) {
    const s = e.items[e.items.length - 1];
    if (this.type === "flow-error-end") {
      let n;
      do
        yield* this.pop(), n = this.peek(1);
      while ((n == null ? void 0 : n.type) === "flow-collection");
    } else if (e.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !s || s.sep ? e.items.push({ start: [this.sourceToken] }) : s.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !s || s.value ? e.items.push({ start: [], key: null, sep: [this.sourceToken] }) : s.sep ? s.sep.push(this.sourceToken) : Object.assign(s, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          !s || s.value ? e.items.push({ start: [this.sourceToken] }) : s.sep ? s.sep.push(this.sourceToken) : s.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const a = this.flowScalar(this.type);
          !s || s.value ? e.items.push({ start: [], key: a, sep: [] }) : s.sep ? this.stack.push(a) : Object.assign(s, { key: a, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          e.end.push(this.sourceToken);
          return;
      }
      const n = this.startBlockValue(e);
      n ? this.stack.push(n) : (yield* this.pop(), yield* this.step());
    } else {
      const n = this.peek(2);
      if (n.type === "block-map" && (this.type === "map-value-ind" && n.indent === e.indent || this.type === "newline" && !n.items[n.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && n.type !== "flow-collection") {
        const a = It(n), r = Je(a);
        gn(e);
        const l = e.end.splice(1, e.end.length);
        l.push(this.sourceToken);
        const o = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: r, key: e, sep: l }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = o;
      } else
        yield* this.lineEnd(e);
    }
  }
  flowScalar(e) {
    if (this.onNewLine) {
      let s = this.source.indexOf(`
`) + 1;
      for (; s !== 0; )
        this.onNewLine(this.offset + s), s = this.source.indexOf(`
`, s) + 1;
    }
    return {
      type: e,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(e) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = !0;
        const s = It(e), n = Je(s);
        return n.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, explicitKey: !0 }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const s = It(e), n = Je(s);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(e, s) {
    return this.type !== "comment" || this.indent <= s ? !1 : e.every((n) => n.type === "newline" || n.type === "space");
  }
  *documentEnd(e) {
    this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
  }
  *lineEnd(e) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop(), yield* this.step();
        break;
      case "newline":
        this.onKeyLine = !1;
      case "space":
      case "comment":
      default:
        e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
}
function Mr(t) {
  const e = t.prettyErrors !== !1;
  return { lineCounter: t.lineCounter || e && new Ir() || null, prettyErrors: e };
}
function Xs(t, e = {}) {
  const { lineCounter: s, prettyErrors: n } = Mr(e), a = new Lr(s == null ? void 0 : s.addNewLine), r = new vr(e);
  let l = null;
  for (const o of r.compose(a.parse(t), !0, t.length))
    if (!l)
      l = o;
    else if (l.options.logLevel !== "silent") {
      l.errors.push(new dt(o.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  return n && s && (l.errors.forEach(un(t, s)), l.warnings.forEach(un(t, s))), l;
}
function Tr(t, e, s) {
  let n;
  const a = Xs(t, s);
  if (!a)
    return null;
  if (a.warnings.forEach((r) => Xn(a.options.logLevel, r)), a.errors.length > 0) {
    if (a.options.logLevel !== "silent")
      throw a.errors[0];
    a.errors = [];
  }
  return a.toJS(Object.assign({ reviver: n }, s));
}
const v = (...t) => t.filter(Boolean).join(" ");
function $({ kind: t = "secondary", size: e = "md", className: s, ...n }) {
  return /* @__PURE__ */ i.jsx("button", { ...n, className: v(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
    // quiet buttons carry their own padding (below), so the size padding only applies to the other kinds
    t !== "quiet" && (e === "lg" ? "px-5 py-2.5 text-[14.5px]" : "px-3.5 py-2 text-[13.5px]"),
    t === "quiet" && (e === "lg" ? "text-[14.5px]" : "text-[13.5px]"),
    t === "primary" && "cta font-semibold",
    t === "secondary" && "border border-line-strong/70 bg-raised/60 text-ink hover:border-refract/60 hover:bg-raised",
    t === "quiet" && "text-mute hover:text-ink hover:bg-sunk px-3 py-2",
    t === "danger" && "border border-bad/50 text-bad hover:bg-bad hover:text-on-color",
    s
  ) });
}
function ee({ label: t, hint: e, children: s }) {
  return /* @__PURE__ */ i.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ i.jsx("span", { className: "block text-[13.5px] font-medium mb-1.5", children: t }),
    s,
    e && /* @__PURE__ */ i.jsx("span", { className: "block text-[12.5px] text-mute mt-1.5", children: e })
  ] });
}
const Z = "w-full rounded-lg border border-line-strong/70 bg-sunk px-3 py-2 text-[14px] text-ink placeholder:text-mute/70 focus:border-refract focus:shadow-glow-cyan outline-none transition-shadow";
function te({ tone: t = "neutral", children: e, icon: s, pulse: n }) {
  return /* @__PURE__ */ i.jsxs("span", { className: v(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium",
    t === "ok" && "border-ok/30 bg-ok/10 text-ok",
    t === "bad" && "border-bad/30 bg-bad/10 text-bad",
    t === "warn" && "border-warn/30 bg-warn/10 text-warn",
    t === "info" && "border-refract/30 bg-refract-soft text-refract",
    t === "prism" && "border-prism/30 bg-prism/10 text-prism",
    t === "neutral" && "border-line bg-sunk text-mute"
  ), children: [
    n && /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "pulse-dot" }),
    s && /* @__PURE__ */ i.jsx(s, { size: 13, "aria-hidden": !0 }),
    e
  ] });
}
function He({ summary: t, children: e, open: s }) {
  return /* @__PURE__ */ i.jsxs("details", { open: s, className: "group rounded-xl border border-line bg-surface/60", children: [
    /* @__PURE__ */ i.jsxs("summary", { className: "cursor-pointer select-none list-none px-4 py-2.5 text-[13.5px] font-medium flex items-center justify-between hover:text-refract", children: [
      t,
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "text-mute group-open:rotate-90 transition-transform", children: "›" })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "px-4 pb-4", children: e })
  ] });
}
function vi({ title: t, next: e }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center", children: [
    /* @__PURE__ */ i.jsx("p", { className: "text-[15px]", children: t }),
    e && /* @__PURE__ */ i.jsx("div", { className: "mt-3 text-[13px] text-mute", children: e })
  ] });
}
function ye({ className: t }) {
  return /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("skeleton block h-3", t) });
}
function rs({ rows: t = 3, label: e, className: s }) {
  return /* @__PURE__ */ i.jsx("div", { role: "progressbar", "aria-busy": "true", "aria-label": e, className: v("space-y-2.5", s), children: Array.from({ length: t }, (n, a) => /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ i.jsx(ye, { className: "h-4 w-4 rounded-full" }),
    /* @__PURE__ */ i.jsx(ye, { className: v("h-3", ["w-2/3", "w-1/2", "w-3/5", "w-2/5"][a % 4]) }),
    /* @__PURE__ */ i.jsx(ye, { className: "ml-auto h-3 w-14" })
  ] }, a)) });
}
function ms({ label: t, value: e, unit: s, tone: n, hint: a }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "card px-4 py-3.5", children: [
    /* @__PURE__ */ i.jsx("p", { className: "text-[12px] font-medium uppercase tracking-[0.06em] text-mute", children: t }),
    /* @__PURE__ */ i.jsxs("p", { className: v("mt-1 font-display text-[24px] font-semibold leading-tight tabnum tracking-[-0.02em]", n === "ok" && "text-ok", n === "refract" && "text-refract", n === "prism" && "text-prism"), children: [
      e,
      s && /* @__PURE__ */ i.jsx("span", { className: "ml-1 text-[13px] font-normal text-syn-unit", children: s })
    ] }),
    a && /* @__PURE__ */ i.jsx("p", { className: "mt-0.5 text-[12px] text-mute", children: a })
  ] });
}
const Or = /^([~≈<>]?\s*[−-]?[\d.,]+(?:\s*[KMB](?![a-z]))?)\s*(units?\/day|units?|GB\/day|GB|MB|KB|bytes?|series|values?|spans?\/day|logs?\/day|records?\/day|\/day|%|ms|s|×)$/i, Pr = /^[A-Za-z_][\w.:/-]*$/;
function We({ v: t, as: e = "auto" }) {
  const s = t == null ? "" : String(t), n = e === "key" ? null : s.match(Or);
  return n ? /* @__PURE__ */ i.jsxs("span", { className: "tabnum", children: [
    /* @__PURE__ */ i.jsx("span", { className: "syn-val", children: n[1] }),
    " ",
    /* @__PURE__ */ i.jsx("span", { className: "syn-unit", children: n[2] })
  ] }) : e === "key" || e === "auto" && Pr.test(s) && /[_.]/.test(s) ? /* @__PURE__ */ i.jsx("span", { className: "font-mono syn-key", children: s }) : /* @__PURE__ */ i.jsx("span", { className: "syn-val tabnum", children: s });
}
function ps({ code: t, lang: e = "yaml", fileName: s, className: n, maxH: a = "max-h-72", label: r }) {
  const [l, o] = N.useState("yaml"), [d, c] = N.useState(!1), m = (() => {
    if (e !== "yaml" || l !== "json") return null;
    try {
      const u = Xs(t);
      return u.errors.length ? null : JSON.stringify(u.toJSON(), null, 2);
    } catch {
      return null;
    }
  })(), f = e === "yaml" && (() => {
    try {
      const u = Tr(t);
      return u !== null && typeof u == "object";
    } catch {
      return !1;
    }
  })(), p = l === "json" && m ? m : t;
  N.useEffect(() => {
    if (!d) return;
    const u = setTimeout(() => c(!1), 1500);
    return () => clearTimeout(u);
  }, [d]);
  const h = () => {
    var u;
    return (u = navigator.clipboard) == null ? void 0 : u.writeText(p).then(() => c(!0)).catch(() => {
    });
  }, x = l === "json" && m ? "json" : e === "yaml" ? "yaml" : "txt";
  return /* @__PURE__ */ i.jsxs("div", { className: v("group/code relative rounded-xl border border-line bg-sunk", n), children: [
    /* @__PURE__ */ i.jsxs("div", { className: "absolute right-2 top-2 z-[1] flex items-center gap-0.5 rounded-full border border-line-strong/70 bg-raised/90 p-0.5 text-[11.5px] shadow-soft backdrop-blur", role: "toolbar", "aria-label": r ? `${r} actions` : "Code actions", children: [
      f && ["yaml", "json"].map((u) => /* @__PURE__ */ i.jsx("button", { type: "button", "aria-pressed": l === u, onClick: () => o(u), className: v("rounded-full px-2 py-0.5 font-mono font-medium uppercase", l === u ? "bg-refract text-on-refract" : "text-mute hover:text-ink"), children: u }, u)),
      /* @__PURE__ */ i.jsx("button", { type: "button", onClick: h, "aria-label": "Copy to clipboard", className: "flex items-center gap-1 rounded-full px-2 py-0.5 text-mute hover:text-ink", children: d ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx(xt, { size: 12, className: "text-ok" }),
        "Copied"
      ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx(Dn, { size: 12 }),
        "Copy"
      ] }) }),
      s && /* @__PURE__ */ i.jsxs("button", { type: "button", onClick: () => Kt(`${s}.${x}`, p), "aria-label": "Export as a file", className: "flex items-center gap-1 rounded-full px-2 py-0.5 text-mute hover:text-ink", children: [
        /* @__PURE__ */ i.jsx(Rn, { size: 12 }),
        "Export"
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("pre", { className: v("overflow-auto p-3 pt-10 text-[12px] leading-relaxed font-mono text-syn-val", a), children: p })
  ] });
}
function Br(t) {
  const e = () => {
    try {
      const a = localStorage.getItem("cxlens-theme");
      return a === "light" || a === "system" ? a : "dark";
    } catch {
      return "dark";
    }
  }, [s, n] = N.useState(e);
  return N.useEffect(() => {
    var l;
    const a = (l = t.current) == null ? void 0 : l.getRootNode();
    (a instanceof ShadowRoot ? a.host : document.documentElement).setAttribute("data-theme", s);
    try {
      localStorage.setItem("cxlens-theme", s);
    } catch {
    }
  }, [s]), [s, n];
}
function Dr({ value: t, onChange: e }) {
  const s = [["dark", "Dark", da], ["light", "Light", ma], ["system", "Match macOS", ca]];
  return /* @__PURE__ */ i.jsx("div", { role: "radiogroup", "aria-label": "Appearance", className: "inline-flex rounded-full border border-rail-line bg-white/[.03] p-0.5", children: s.map(([n, a, r]) => /* @__PURE__ */ i.jsx("button", { type: "button", role: "radio", "aria-checked": t === n, "aria-label": a, title: a, onClick: () => e(n), className: v("grid h-7 w-7 place-items-center rounded-full transition-colors", t === n ? "bg-white/10 text-step-done" : "text-rail-mute hover:text-rail-ink"), children: /* @__PURE__ */ i.jsx(r, { size: 14 }) }, n)) });
}
const se = (t) => t == null ? "TBD" : t >= 10 ? t.toFixed(1) : t.toFixed(t >= 1 ? 2 : 3), As = {
  1: { name: "Quick wins", long: "Config-only, no app changes", when: "1–2 weeks", cls: "text-p1", bg: "bg-p1", soft: "bg-p1/10" },
  2: { name: "Coordinated changes", long: "Helm upgrade or collector redeploy", when: "2–4 weeks", cls: "text-p2", bg: "bg-p2", soft: "bg-p2/10" },
  3: { name: "Strategic", long: "Application code or architecture", when: "About a quarter", cls: "text-p3", bg: "bg-p3", soft: "bg-p3/10" }
}, ve = {
  universal: { name: "Universal", icon: oa, color: "var(--universal)", text: "text-universal", bg: "bg-universal", border: "border-universal" },
  logs: { name: "Logs", icon: fa, color: "var(--logs)", text: "text-logs", bg: "bg-logs", border: "border-logs" },
  traces: { name: "Traces", icon: wa, color: "var(--traces)", text: "text-traces", bg: "bg-traces", border: "border-traces" },
  metrics: { name: "Metrics", icon: _i, color: "var(--metrics)", text: "text-metrics", bg: "bg-metrics", border: "border-metrics" }
}, yl = Object.fromEntries(Object.entries(ve).map(([t, e]) => [t, e.name])), Rr = {
  units: "Coralogix’s billing measure. Each GB costs a different number of units depending on data type and storage tier.",
  "TCO tier": "Storage priority (High, Medium, Low) that sets how data is indexed and what it costs per GB.",
  "tail sampling": "Deciding which traces to keep after seeing the whole trace, so errors and slow requests are always kept.",
  "protected labels": "Resource attributes that Infrastructure Explorer and AWS enrichment rely on. Lens never removes them.",
  "span metrics": "Request, error and latency metrics generated from traces. Alerts built on them work even when traces are sampled."
};
function Kr({ t, children: e }) {
  return /* @__PURE__ */ i.jsxs("span", { className: "relative inline-block group/term", children: [
    /* @__PURE__ */ i.jsx("span", { tabIndex: 0, className: "underline decoration-dotted decoration-mute/60 underline-offset-[3px] cursor-help", children: e ?? t }),
    /* @__PURE__ */ i.jsx("span", { role: "tooltip", className: "pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-64 rounded-lg border border-rail-line bg-raised px-3 py-2 text-[12.5px] leading-snug text-ink opacity-0 shadow-float transition-opacity group-hover/term:opacity-100 group-focus-within/term:opacity-100", children: Rr[t] ?? t })
  ] });
}
function Ut(t, e) {
  const s = t.filter((o) => e(o) && o.savings.kind === "units" && (o.savings.unitsPerDay ?? 0) > 0), n = new Set(s.map((o) => o.ruleId)), a = /* @__PURE__ */ new Map(), r = (o) => (a.get(o) ?? o) === o ? o : r(a.get(o));
  for (const o of s) a.set(o.ruleId, o.ruleId);
  for (const o of s) for (const d of o.overlapsWith ?? []) n.has(d) && a.set(r(d), r(o.ruleId));
  const l = /* @__PURE__ */ new Map();
  for (const o of s) {
    const d = r(o.ruleId);
    l.set(d, Math.max(l.get(d) ?? 0, o.savings.unitsPerDay));
  }
  return [...l.values()].reduce((o, d) => o + d, 0);
}
const Jt = [
  { title: "Connect", hint: "Pick the Coralogix team" },
  { title: "Customer context", hint: "Who this review is for" },
  { title: "Choose pillars", hint: "What to look at" },
  { title: "Config and versions", hint: "Optional collector config" },
  { title: "Run assessment", hint: "Read-only discovery" },
  { title: "Verify findings", hint: "Decide with the customer" },
  { title: "Remediate and report", hint: "Plan, config, exports" }
];
function Fr({ step: t, maxReached: e, onPick: s }) {
  return /* @__PURE__ */ i.jsx("nav", { "aria-label": "Review steps", className: "no-scrollbar overflow-x-auto", children: /* @__PURE__ */ i.jsx("ol", { className: "flex min-w-max items-center rounded-full border border-rail-line bg-white/[.025] p-1", children: Jt.map((n, a) => {
    const r = a < t, l = a === t, o = a <= e, d = /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v(
      "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold tabnum",
      r ? "border border-step-done/60 bg-step-done/15 text-step-done" : l ? "bg-[linear-gradient(135deg,#00DFBA,#06B6D4)] text-[#04121A]" : "border border-rail-line text-step-future"
    ), children: r ? /* @__PURE__ */ i.jsx(xt, { size: 11, strokeWidth: 3 }) : a + 1 }), c = /* @__PURE__ */ i.jsx("span", { className: v("whitespace-nowrap text-[13px] leading-none", l ? "font-semibold text-white" : r ? "text-step-done/90" : "text-step-future", !l && "hidden xl:inline"), children: n.title });
    return /* @__PURE__ */ i.jsxs("li", { className: "flex items-center", children: [
      a > 0 && /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("mx-0.5 h-px w-3 xl:w-4", a <= t ? "bg-step-done/50" : "bg-rail-line") }),
      l ? /* @__PURE__ */ i.jsx("span", { className: "rounded-full bg-[linear-gradient(135deg,rgba(0,223,186,.9),rgba(168,85,247,.85))] p-px shadow-[0_0_18px_-4px_rgba(0,223,186,.6)]", children: /* @__PURE__ */ i.jsxs("button", { onClick: () => s(a), "aria-current": "step", title: n.hint, className: "flex items-center gap-2 rounded-full bg-rail px-3 py-1.5", children: [
        d,
        c
      ] }) }) : /* @__PURE__ */ i.jsxs(
        "button",
        {
          disabled: !o,
          onClick: () => s(a),
          title: `${n.title}: ${n.hint}`,
          "aria-label": `Step ${a + 1}: ${n.title}${r ? " (done)" : ""}`,
          className: v("flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors", o ? "hover:bg-white/[.06]" : "cursor-default opacity-70"),
          children: [
            d,
            c
          ]
        }
      )
    ] }, n.title);
  }) }) });
}
function Si({ baseline: t, findings: e, compact: s }) {
  const n = Ut(e, (d) => d.verifyStatus === "verified"), a = Ut(e, (d) => d.verifyStatus !== "rejected"), r = Math.max(0, a - n), l = t ?? Math.max(a * 1.5, 1), o = (d) => `${Math.min(100, d / l * 100)}%`;
  return /* @__PURE__ */ i.jsxs("section", { "aria-label": "Value lens", className: v("hero", s ? "px-5 py-4" : "px-6 py-5"), children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-x-8 gap-y-3", children: [
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("p", { className: "text-[12px] font-medium uppercase tracking-[0.08em] text-rail-mute", children: "Daily usage today" }),
        /* @__PURE__ */ i.jsxs("p", { className: "font-display text-[32px] font-semibold leading-none tabnum tracking-[-0.02em] mt-1.5", children: [
          t == null ? "—" : se(t),
          /* @__PURE__ */ i.jsx("span", { className: "ml-1 font-mono text-[13px] font-normal text-[#A78BFA]", children: "units/day" })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("dl", { className: "flex gap-8 text-[13px]", children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsxs("dt", { className: "text-rail-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ i.jsx("span", { className: "h-2.5 w-2.5 rounded-sm bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,.7)]" }),
            "Verified headroom"
          ] }),
          /* @__PURE__ */ i.jsx("dd", { className: "font-display text-[21px] font-semibold tabnum text-[#34D399]", children: se(n) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsxs("dt", { className: "text-rail-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ i.jsx("span", { className: "h-2.5 w-2.5 rounded-sm text-[#C084FC] hatch border border-[#C084FC]" }),
            "Still to review"
          ] }),
          /* @__PURE__ */ i.jsx("dd", { className: "font-display text-[21px] font-semibold tabnum text-[#D8B4FE]", children: se(r) })
        ] }),
        t != null && /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("dt", { className: "text-rail-mute", children: "Share of today" }),
          /* @__PURE__ */ i.jsxs("dd", { className: "font-display text-[21px] font-semibold tabnum", children: [
            Math.round(a / l * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-white/[.07] ring-1 ring-inset ring-white/5", role: "img", "aria-label": `${se(n)} units per day verified, ${se(r)} still to review, out of ${t == null ? "unknown" : se(t)}`, children: [
      /* @__PURE__ */ i.jsx("div", { className: "flex-1 bg-[linear-gradient(90deg,rgba(6,182,212,.18),rgba(6,182,212,.08))]" }),
      /* @__PURE__ */ i.jsx("div", { className: "lens-grow h-full text-[#C084FC] hatch bg-[#A855F7]/25", style: { width: o(r) } }),
      /* @__PURE__ */ i.jsx("div", { className: "lens-grow h-full bg-[linear-gradient(90deg,#10B981,#34D399)] shadow-[0_0_14px_rgba(16,185,129,.6)]", style: { width: o(n) } })
    ] }),
    !s && /* @__PURE__ */ i.jsx("p", { className: "mt-2.5 text-[12.5px] text-rail-mute", children: "The bar is today’s usage. The coloured end is quota the customer can free and reinvest. Estimates can vary by about ±20%." })
  ] });
}
const Qr = "data:image/png;base64,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", gs = [
  { key: "high", name: "High", cls: "bg-[linear-gradient(90deg,#06B6D4,#00DFBA)]", dot: "bg-[#06B6D4]" },
  { key: "medium", name: "Medium", cls: "bg-[linear-gradient(90deg,#8B5CF6,#A855F7)]", dot: "bg-[#A855F7]" },
  { key: "low", name: "Low (archive)", cls: "bg-[#64748B]", dot: "bg-[#64748B]" }
], zr = (t) => /high|frequent/i.test(t) ? "high" : /medium|monitor/i.test(t) ? "medium" : "low";
function Ur(t) {
  var a, r;
  const e = (((a = t == null ? void 0 : t.usage) == null ? void 0 : a.fetchedAt) ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 10), s = (((r = t == null ? void 0 : t.usage) == null ? void 0 : r.days) ?? []).filter((l) => l.date.slice(0, 10) < e).slice(-7);
  if (!s.length) return null;
  const n = {};
  for (const l of s) for (const [o, d] of Object.entries(l.byPillarTier ?? {})) {
    const [c, m] = o.split(":"), f = zr(m ?? ""), p = n[c] ?? (n[c] = {}), h = p[f] ?? (p[f] = { units: 0, gb: 0 });
    h.units += (d.units ?? 0) / s.length, h.gb += (d.gb ?? 0) / s.length;
  }
  return { days: s.length, rows: Object.entries(n).map(([l, o]) => ({ pillar: l, tiers: o, total: Object.values(o).reduce((d, c) => d + c.units, 0) })).sort((l, o) => o.total - l.total) };
}
function Jr({ run: t }) {
  const e = Ur(t);
  if (!e || !e.rows.length) return null;
  const s = Math.max(...e.rows.map((n) => n.total), 1e-9);
  return /* @__PURE__ */ i.jsxs("section", { "aria-labelledby": "tier-title", className: "card p-5", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ i.jsxs("h2", { id: "tier-title", className: "flex items-center gap-2 text-[15px] font-semibold", children: [
        /* @__PURE__ */ i.jsx(ta, { size: 16, className: "text-refract" }),
        "Where today’s units go"
      ] }),
      /* @__PURE__ */ i.jsx("ul", { className: "flex flex-wrap gap-3 text-[12px] text-mute", "aria-label": "TCO tiers", children: gs.map((n) => /* @__PURE__ */ i.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ i.jsx("span", { className: v("h-2.5 w-2.5 rounded-sm", n.dot) }),
        n.name
      ] }, n.key)) })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "mt-0.5 text-[12.5px] text-mute", children: [
      "Average of the last ",
      e.days,
      " complete days, by data type and TCO tier. Bars share one scale."
    ] }),
    /* @__PURE__ */ i.jsx("ul", { className: "mt-4 space-y-3", children: e.rows.map((n) => {
      const a = ve[n.pillar];
      return /* @__PURE__ */ i.jsxs("li", { className: "grid grid-cols-[92px_1fr_auto] items-center gap-3", children: [
        /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-2 text-[13px] font-medium", children: [
          a ? /* @__PURE__ */ i.jsx(a.icon, { size: 14, className: a.text, "aria-hidden": !0 }) : null,
          (a == null ? void 0 : a.name) ?? n.pillar
        ] }),
        /* @__PURE__ */ i.jsx(
          "span",
          {
            className: "relative h-3 overflow-hidden rounded-full bg-sunk ring-1 ring-inset ring-line",
            role: "img",
            "aria-label": `${(a == null ? void 0 : a.name) ?? n.pillar}: ${gs.filter((r) => n.tiers[r.key]).map((r) => `${r.name} ${se(n.tiers[r.key].units)}`).join(", ")} units per day`,
            children: /* @__PURE__ */ i.jsx("span", { className: "absolute inset-y-0 left-0 flex", style: { width: `${n.total / s * 100}%` }, children: gs.map((r) => n.tiers[r.key] ? /* @__PURE__ */ i.jsx("span", { className: v("h-full first:rounded-l-full last:rounded-r-full", r.cls), style: { width: `${n.tiers[r.key].units / n.total * 100}%` }, title: `${r.name}: ${se(n.tiers[r.key].units)} units/day (${n.tiers[r.key].gb.toFixed(1)} GB/day)` }, r.key) : null) })
          }
        ),
        /* @__PURE__ */ i.jsx("span", { className: "w-28 text-right text-[12.5px]", children: /* @__PURE__ */ i.jsx(We, { v: `${se(n.total)} units/day` }) })
      ] }, n.pillar);
    }) })
  ] });
}
const Hr = {
  "high-cardinality": { label: "High cardinality", tone: "bad", pulse: !0 },
  churn: { label: "Churn", tone: "warn", pulse: !0 },
  constant: { label: "Same value everywhere", tone: "prism", pulse: !1 }
};
function Yr({ inventory: t, limit: e = 10 }) {
  const s = (t == null ? void 0 : t.rows) ?? [];
  if (!s.length) return null;
  const n = (c) => c.units ?? c.series ?? 0, a = (c) => c.kind === "high-cardinality" || c.kind === "churn", r = [...s].sort((c, m) => Number(a(m)) - Number(a(c)) || n(m) - n(c)).slice(0, e), l = s.filter((c) => c.kind === "high-cardinality" || c.kind === "churn").length, o = (c) => c.fraction ?? (t.totalSeries && c.series ? c.series / t.totalSeries : 0), d = Math.max(...r.map(o), 1e-9);
  return /* @__PURE__ */ i.jsxs("section", { "aria-labelledby": "labels-title", className: "card p-5", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ i.jsxs("h2", { id: "labels-title", className: "flex items-center gap-2 text-[15px] font-semibold", children: [
        /* @__PURE__ */ i.jsx(pa, { size: 16, className: "text-prism" }),
        "Metric labels by cost"
      ] }),
      l > 0 && /* @__PURE__ */ i.jsxs(te, { tone: "bad", pulse: !0, children: [
        l,
        " high-cardinality or churn label",
        l === 1 ? "" : "s"
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "mt-0.5 text-[12.5px] text-mute", children: [
      t.source === "usage-api" ? "Exact units from the Metric Usage API" : "Measured with PromQL through cx",
      t.date ? `, ${t.date}` : "",
      ". Protected labels are shown but never suggested for removal."
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "mt-3 overflow-x-auto", children: /* @__PURE__ */ i.jsxs("table", { className: "w-full text-[12.5px]", children: [
      /* @__PURE__ */ i.jsx("thead", { className: "text-left text-[11.5px] uppercase tracking-[0.06em] text-mute", children: /* @__PURE__ */ i.jsxs("tr", { children: [
        /* @__PURE__ */ i.jsx("th", { className: "py-1.5 pr-3 font-medium", children: "Label" }),
        /* @__PURE__ */ i.jsx("th", { className: "px-3 font-medium whitespace-nowrap", children: "Unique values" }),
        /* @__PURE__ */ i.jsx("th", { className: "px-3 font-medium whitespace-nowrap", children: "Share of cost" }),
        /* @__PURE__ */ i.jsx("th", { className: "px-3 font-medium text-right", children: "Units/day" }),
        /* @__PURE__ */ i.jsx("th", { className: "pl-3 font-medium", children: "Impact" })
      ] }) }),
      /* @__PURE__ */ i.jsx("tbody", { children: r.map((c) => {
        const m = Hr[c.kind];
        return /* @__PURE__ */ i.jsxs("tr", { className: "border-t border-line", children: [
          /* @__PURE__ */ i.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ i.jsx(We, { v: c.name, as: "key" }) }),
          /* @__PURE__ */ i.jsx("td", { className: "px-3 tabnum whitespace-nowrap", children: /* @__PURE__ */ i.jsx(We, { v: `${c.unique.toLocaleString()} ${c.unique === 1 ? "value" : "values"}` }) }),
          /* @__PURE__ */ i.jsx("td", { className: "px-3", children: /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ i.jsx("span", { className: "h-1.5 min-w-[96px] flex-1 overflow-hidden rounded-full bg-sunk", children: /* @__PURE__ */ i.jsx("span", { className: v("block h-full rounded-full", c.kind === "high-cardinality" ? "bg-bad" : c.kind === "churn" ? "bg-warn" : "bg-refract"), style: { width: `${o(c) / d * 100}%` } }) }),
            /* @__PURE__ */ i.jsxs("span", { className: "w-12 text-right text-mute tabnum", children: [
              (o(c) * 100).toFixed(1),
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ i.jsx("td", { className: "px-3 text-right", children: c.units != null ? /* @__PURE__ */ i.jsx(We, { v: se(c.units) }) : /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "—" }) }),
          /* @__PURE__ */ i.jsx("td", { className: "pl-3 whitespace-nowrap", children: c.locked === "protected" ? /* @__PURE__ */ i.jsx(te, { tone: "info", children: "Protected" }) : m ? /* @__PURE__ */ i.jsx(te, { tone: m.tone, pulse: m.pulse, children: m.label }) : /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "—" }) })
        ] }, c.name);
      }) })
    ] }) })
  ] });
}
const Gr = (t) => t.filter((e) => e.kind !== "del").map((e) => e.right ?? "").join(`
`);
function qr(t, e, s = 3) {
  const n = t.at(-1), a = n && n.kind === "same" && n.left === "" && n.right === "" ? t.slice(0, -1) : t, r = a.flatMap((m, f) => m.kind === "same" ? [] : [f]);
  if (!r.length) return "";
  const l = [];
  let o = Math.max(0, r[0] - s), d = Math.min(a.length - 1, r[0] + s);
  for (const m of r.slice(1))
    m - s <= d + 1 || (l.push([o, d]), o = Math.max(0, m - s)), d = Math.min(a.length - 1, m + s);
  l.push([o, d]);
  let c = `--- a/${e}
+++ b/${e}
`;
  for (const [m, f] of l) {
    const p = a.slice(m, f + 1), h = a.slice(0, m), x = p.filter((y) => y.kind !== "add").length, u = p.filter((y) => y.kind !== "del").length, g = h.filter((y) => y.kind !== "add").length, k = h.filter((y) => y.kind !== "del").length;
    c += `@@ -${x ? g + 1 : g},${x} +${u ? k + 1 : k},${u} @@
`, c += p.map((y) => y.kind === "same" ? ` ${y.left ?? ""}` : y.kind === "del" ? `-${y.left ?? ""}` : `+${y.right ?? ""}`).join(`
`) + `
`;
  }
  return c;
}
function Vr({ rows: t, fileBase: e, changed: s }) {
  const [n, a] = N.useState("split"), [r, l] = N.useState(!1);
  N.useEffect(() => {
    if (!r) return;
    const h = setTimeout(() => l(!1), 1500);
    return () => clearTimeout(h);
  }, [r]);
  const o = Gr(t), d = (() => {
    try {
      const h = Xs(o);
      return h.errors.length ? null : JSON.stringify(h.toJSON(), null, 2);
    } catch {
      return null;
    }
  })(), c = qr(t, `${e}.yaml`), m = n === "json" && d ? d : n === "split" ? c : o, f = () => {
    var h;
    return (h = navigator.clipboard) == null ? void 0 : h.writeText(m).then(() => l(!0)).catch(() => {
    });
  }, p = "flex items-center gap-1 rounded-full px-2.5 py-1 text-mute hover:text-ink";
  return /* @__PURE__ */ i.jsxs("div", { className: "card !overflow-visible", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5 text-[12.5px]", children: [
      /* @__PURE__ */ i.jsx("span", { className: "font-medium", children: n === "split" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "Current config" }),
        " ",
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "text-mute", children: "→" }),
        " With changes"
      ] }) : `New config as ${n.toUpperCase()}` }),
      /* @__PURE__ */ i.jsxs("span", { className: "text-mute tabnum", children: [
        s,
        " changed lines"
      ] }),
      /* @__PURE__ */ i.jsxs("div", { role: "toolbar", "aria-label": "Config change actions", className: "ml-auto flex flex-wrap items-center gap-0.5 rounded-full border border-line-strong/70 bg-raised/90 p-0.5 text-[11.5px] shadow-soft", children: [
        [["split", "Diff"], ["yaml", "YAML"], ["json", "JSON"]].map(([h, x]) => /* @__PURE__ */ i.jsx("button", { type: "button", "aria-pressed": n === h, disabled: h === "json" && !d, onClick: () => a(h), className: v("rounded-full px-2.5 py-1 font-mono font-medium disabled:opacity-40", n === h ? "bg-refract text-on-refract" : "text-mute hover:text-ink"), children: x }, h)),
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "mx-1 h-4 w-px bg-line-strong" }),
        /* @__PURE__ */ i.jsx("button", { type: "button", onClick: f, className: p, "aria-label": n === "split" ? "Copy the patch" : `Copy the new config as ${n.toUpperCase()}`, children: r ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
          /* @__PURE__ */ i.jsx(xt, { size: 12, className: "text-ok" }),
          "Copied"
        ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
          /* @__PURE__ */ i.jsx(Dn, { size: 12 }),
          "Copy"
        ] }) }),
        /* @__PURE__ */ i.jsxs("button", { type: "button", onClick: () => Kt(n === "json" && d ? `${e}.json` : `${e}.yaml`, n === "json" && d ? d : o), className: p, children: [
          /* @__PURE__ */ i.jsx(Rn, { size: 12 }),
          "Export ",
          n === "json" ? "JSON" : "YAML"
        ] }),
        /* @__PURE__ */ i.jsxs("button", { type: "button", disabled: !c, onClick: () => Kt(`${e}.diff`, c), className: v(p, "disabled:opacity-40"), title: "A unified diff you can apply with git apply and open as a pull request", children: [
          /* @__PURE__ */ i.jsx(la, { size: 12 }),
          "Export patch"
        ] })
      ] })
    ] }),
    n === "split" ? /* @__PURE__ */ i.jsx("div", { className: "max-h-[520px] overflow-auto rounded-b-2xl font-mono text-[11.5px] leading-[1.6]", role: "table", "aria-label": "Config diff", children: t.map((h, x) => /* @__PURE__ */ i.jsxs("div", { role: "row", className: "grid grid-cols-2", children: [
      /* @__PURE__ */ i.jsxs("div", { role: "cell", title: h.left, className: v("flex min-w-0", h.kind === "del" && "diff-del"), children: [
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "w-10 shrink-0 select-none pr-2 text-right text-mute/60 tabnum", children: h.ln ?? "" }),
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("w-4 shrink-0 select-none", h.kind === "del" ? "text-bad" : "text-transparent"), children: "−" }),
        /* @__PURE__ */ i.jsx("span", { className: v("min-w-0 overflow-hidden text-ellipsis whitespace-pre pr-2", h.kind === "same" ? "text-mute" : "text-ink"), children: h.left ?? "" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { role: "cell", title: h.right, className: v("flex min-w-0 border-l border-line", h.kind === "add" && "diff-add"), children: [
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "w-10 shrink-0 select-none pr-2 text-right text-mute/60 tabnum", children: h.rn ?? "" }),
        /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("w-4 shrink-0 select-none", h.kind === "add" ? "text-ok" : "text-transparent"), children: "+" }),
        /* @__PURE__ */ i.jsx("span", { className: v("min-w-0 overflow-hidden text-ellipsis whitespace-pre pr-2", h.kind === "same" ? "text-mute" : "text-ink"), children: h.right ?? "" })
      ] })
    ] }, x)) }) : /* @__PURE__ */ i.jsx("pre", { className: "max-h-[520px] overflow-auto rounded-b-2xl p-4 font-mono text-[12px] leading-relaxed text-syn-val", children: m })
  ] });
}
const xn = ["eu1", "eu2", "us1", "us2", "us3", "ap1", "ap2", "ap3", "gov1"], Ws = (t) => {
  var n, a;
  const e = (((n = t == null ? void 0 : t.usage) == null ? void 0 : n.fetchedAt) ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 10), s = (((a = t == null ? void 0 : t.usage) == null ? void 0 : a.days) ?? []).filter((r) => r.date.slice(0, 10) < e).slice(-7);
  return s.length ? s.reduce((r, l) => r + l.totalUnits, 0) / s.length : null;
}, Ht = { text: "", chartVersion: "", otelVersion: "", distribution: "otelcol-contrib", label: "" }, de = { helm: "Kubernetes", ecs: "ECS", ec2: "EC2", standalone: "Standalone" }, Xr = [["helm", "Kubernetes", "EKS or any cluster, Coralogix Helm chart"], ["ecs", "ECS", "Amazon ECS"], ["ec2", "EC2", "Amazon EC2"], ["standalone", "Standalone", "Any other host"]], Re = { windowHours: 24, dupWindowMinutes: 15, rowLimit: 200 }, Zs = (t) => {
  if (t % 24 === 0 && t >= 48) return `${t / 24} days`;
  if (Number.isInteger(t)) return t === 1 ? "1 hour" : `${t} hours`;
  const e = Math.round(t * 60);
  return `${Math.floor(e / 60)} h ${e % 60} min`;
}, Lt = (t) => String(t).padStart(2, "0"), xs = (t) => `${t.getFullYear()}-${Lt(t.getMonth() + 1)}-${Lt(t.getDate())}T${Lt(t.getHours())}:${Lt(t.getMinutes())}`, Yt = (t) => t ? new Date(t).toISOString() : "", Gt = (t) => t ? new Date(t).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
function ft(t) {
  if (t.mode !== "range") return null;
  if (!t.start || !t.end) return "Pick both a start and an end.";
  const e = new Date(t.start).getTime(), s = new Date(t.end).getTime();
  return !Number.isFinite(e) || !Number.isFinite(s) ? "Those dates are not valid." : s > Date.now() + 6e4 ? "The end is in the future. Pick a time that has already passed." : s <= e ? "The start must be before the end." : s - e < 36e5 ? "The range must be at least 1 hour long." : s - e > 168 * 36e5 ? "The range can be at most 7 days long." : null;
}
const Wr = (t) => (new Date(t.end).getTime() - new Date(t.start).getTime()) / 36e5, Ci = (t) => t.mode === "range" && !ft(t) ? `${Gt(t.start)} to ${Gt(t.end)}` : `the last ${Zs(t.windowHours)}`, Zr = (t) => ({ dupWindowMinutes: t.dupWindowMinutes, rowLimit: t.rowLimit, ...t.mode === "range" ? { range: { start: Yt(t.start), end: Yt(t.end) } } : { windowHours: t.windowHours } });
function Le({ step: t, lead: e, children: s }) {
  return /* @__PURE__ */ i.jsxs("header", { className: "mb-10", children: [
    /* @__PURE__ */ i.jsxs("p", { className: "mb-2 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-refract", children: [
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "h-px w-6 bg-refract/70" }),
      "Step ",
      t + 1,
      " of ",
      Jt.length
    ] }),
    /* @__PURE__ */ i.jsx("h1", { className: "font-display text-[32px] font-semibold tracking-[-0.025em] text-ink leading-tight", children: Jt[t].title }),
    /* @__PURE__ */ i.jsx("p", { className: "mt-3 text-[16px] text-mute max-w-[64ch] leading-relaxed", children: e }),
    s
  ] });
}
function Qe({ onBack: t, next: e, nextLabel: s, disabled: n, note: a, extra: r }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "sticky bottom-0 z-10 -mx-10 mt-12 border-t border-line bg-paper/85 backdrop-blur-xl px-10 py-4 flex items-center gap-4 shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.6)]", children: [
    t && /* @__PURE__ */ i.jsxs($, { kind: "quiet", onClick: t, className: "text-mute", children: [
      /* @__PURE__ */ i.jsx(ea, { size: 16 }),
      "Back"
    ] }),
    /* @__PURE__ */ i.jsx("p", { className: "flex-1 text-[13.5px] text-mute font-medium", children: a }),
    r,
    e && /* @__PURE__ */ i.jsx($, { kind: "primary", size: "lg", disabled: n, onClick: e, children: s })
  ] });
}
function bl() {
  const [t, e] = N.useState(0), [s, n] = N.useState(0), a = (R) => {
    var Y;
    e(R), n((z) => Math.max(z, R)), (Y = document.getElementById("main")) == null || Y.scrollTo({ top: 0 }), window.scrollTo({ top: 0 });
  }, [r, l] = N.useState(null), [o, d] = N.useState({ team: "", region: "ap1", demo: !1 }), [c, m] = N.useState({ name: "", environment: "", preparedBy: "", audience: "", criticalServices: [], nearRenewal: !1, teamCanVerify: !0, internalTerms: [] }), [f, p] = N.useState(["helm"]), h = f[0], [x, u] = N.useState(["universal", "logs", "traces", "metrics"]), [g, k] = N.useState({}), y = (R) => g[R] ?? Ht, [S, C] = N.useState(Re), [I, L] = N.useState({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only" }), [E, b] = N.useState(null), [A, P] = N.useState(null);
  N.useEffect(() => {
    G("/api/versions").then(l).catch(() => l({ error: !0 }));
  }, []);
  const M = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), [J, F] = N.useState(null), [W, we] = N.useState(null), [ke, Ce] = N.useState(null), [Me, me] = N.useState(!1), oe = (R, Y) => {
    Ce({ text: R, tone: Y }), setTimeout(() => Ce(null), 2600);
  }, Te = !!(c.name || Object.values(g).some((R) => R.text) || E || t > 0 || o.team || o.demo), j = () => ({ step: t, maxReached: s, conn: o, customer: c, deployments: f, pillars: x, cfgs: g, win: S, inv: I, runId: E }), B = async (R = !1) => {
    const Y = J ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const z = await G(`/api/drafts/${Y}`, { method: "PUT", body: JSON.stringify({ name: c.name || "Untitled review", step: t, state: j() }) });
      return F(z.id), we(z.savedAt), R || oe("Draft saved. Resume it any time from Connect."), !0;
    } catch (z) {
      return R || oe(`Could not save the draft: ${z.message}`, "bad"), !1;
    }
  };
  N.useEffect(() => {
    J && B(!0);
  }, [t, E]), N.useEffect(() => {
    const R = (Y) => {
      (Y.metaKey || Y.ctrlKey) && Y.key.toLowerCase() === "s" && (Y.preventDefault(), B());
    };
    return addEventListener("keydown", R), () => removeEventListener("keydown", R);
  });
  const Q = () => {
    d({ team: "", region: "ap1", demo: !1 }), m({ name: "", environment: "", preparedBy: "", audience: "", criticalServices: [], nearRenewal: !1, teamCanVerify: !0, internalTerms: [] }), p(["helm"]), u(["universal", "logs", "traces", "metrics"]), k({}), C(Re), L({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only" }), b(null), P(null), F(null), we(null), e(0), n(0), me(!1), window.scrollTo({ top: 0 });
  }, H = () => Te ? me(!0) : Q(), Oe = async (R) => {
    try {
      const Y = await G(`/api/drafts/${R}`), z = Y.state ?? {};
      d(z.conn ?? { team: "", region: "ap1", demo: !1 }), m({ ...c, ...z.customer }), p(z.deployments ?? [z.deployment ?? "helm"]), u(z.pillars ?? ["universal", "logs", "traces", "metrics"]), k(z.cfgs ?? (z.cfg ? { [z.deployment ?? "helm"]: { ...Ht, ...z.cfg } } : {})), C({ ...Re, ...z.win ?? {} }), L({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only", ...z.inv ?? {} });
      let xe = Math.min(z.step ?? 0, 6), Ae = null;
      z.runId ? (Ae = await G(`/api/runs/${z.runId}`).catch(() => null), Ae || (oe("The saved assessment is no longer available, so it will run again.", "bad"), xe = Math.min(xe, 3))) : xe = Math.min(xe, 3), b(Ae ? z.runId : null), P(Ae), F(Y.id), we(Y.savedAt), n(Math.max(xe, Math.min(z.maxReached ?? xe, Ae ? 6 : 3))), e(xe), oe(`Resumed “${Y.name}”.`);
    } catch (Y) {
      oe(`Could not open the draft: ${Y.message}`, "bad");
    }
  }, at = N.useRef(null), [jt, Nt] = Br(at), ze = A ? Ut(A.findings, (R) => R.verifyStatus !== "rejected") : 0, rt = A ? Ut(A.findings, (R) => R.verifyStatus === "verified") : 0, lt = A ? Ws(A) : null;
  return /* @__PURE__ */ i.jsxs("div", { ref: at, className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "relative z-20 shrink-0 border-b border-rail-line bg-rail text-rail-ink", children: [
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,223,186,.45),rgba(168,85,247,.4),transparent)]" }),
      /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-4 px-6 pt-3", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ i.jsx("img", { src: Qr, alt: "", width: 38, height: 38, className: "rounded-[10px] shadow-[0_0_18px_-4px_rgba(0,223,186,.55)]" }),
          /* @__PURE__ */ i.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ i.jsx("div", { className: "font-display text-[17px] font-semibold tracking-[-0.02em] leading-tight text-white", children: "Coralogix Lens" }),
            /* @__PURE__ */ i.jsx("div", { className: "text-[12px] text-rail-mute truncate", children: "Telemetry Health & Value Review" })
          ] })
        ] }),
        A && ze > 0 && /* @__PURE__ */ i.jsxs("div", { className: "hidden md:flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-1 text-[12.5px] shadow-[0_0_16px_-4px_rgba(16,185,129,.55)]", "aria-label": "Projected savings", children: [
          /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "pulse-dot text-[#34D399]" }),
          /* @__PURE__ */ i.jsx("span", { className: "text-rail-mute", children: "Projected savings" }),
          /* @__PURE__ */ i.jsxs("span", { className: "font-semibold tabnum text-[#6EE7B7]", children: [
            se(ze * 30),
            " ",
            /* @__PURE__ */ i.jsx("span", { className: "font-mono font-normal text-[#A78BFA]", children: "units/month" })
          ] }),
          lt ? /* @__PURE__ */ i.jsxs("span", { className: "tabnum text-rail-ink", children: [
            "· ",
            Math.round(ze / lt * 100),
            "% of today"
          ] }) : null,
          rt > 0 && /* @__PURE__ */ i.jsxs("span", { className: "tabnum text-rail-mute", children: [
            "· ",
            se(rt * 30),
            " verified"
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ i.jsx(Dr, { value: jt, onChange: Nt }),
          W && /* @__PURE__ */ i.jsxs("span", { className: "hidden lg:inline text-[12px] text-rail-mute", children: [
            "Saved ",
            new Date(W).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] }),
          /* @__PURE__ */ i.jsxs("button", { onClick: () => void B(), title: "Save draft (⌘S). Once saved, it keeps saving as you go.", className: "flex items-center gap-2 rounded-full border border-rail-line px-3 py-1.5 text-[13px] text-rail-ink hover:border-step-done/60 hover:bg-white/[.05] active:scale-[0.98] transition-all", children: [
            /* @__PURE__ */ i.jsx(ha, { size: 14, "aria-hidden": !0 }),
            /* @__PURE__ */ i.jsx("span", { children: "Save draft" }),
            /* @__PURE__ */ i.jsx("kbd", { className: "!bg-transparent !text-rail-mute !border-rail-line", children: "⌘S" })
          ] }),
          /* @__PURE__ */ i.jsxs("button", { onClick: H, className: "flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-rail-mute hover:text-rail-ink hover:bg-white/[.05] transition-all", children: [
            /* @__PURE__ */ i.jsx(Kn, { size: 14, "aria-hidden": !0 }),
            /* @__PURE__ */ i.jsx("span", { className: "sr-only xl:not-sr-only", children: "Start a new review" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "px-6 pb-3 pt-3", children: /* @__PURE__ */ i.jsx(Fr, { step: t, maxReached: s, onPick: a }) })
    ] }),
    /* @__PURE__ */ i.jsx("main", { id: "main", className: "relative min-h-0 min-w-0 flex-1 overflow-y-auto px-10 pt-9", children: /* @__PURE__ */ i.jsxs("div", { className: v("mx-auto", t >= 5 ? "max-w-[1180px]" : "max-w-[920px]"), children: [
      t === 0 && /* @__PURE__ */ i.jsx(tl, { conn: o, setConn: d, onNext: () => a(1), onResume: Oe }),
      t === 1 && /* @__PURE__ */ i.jsx(sl, { c, set: m, deployments: f, setDeployments: p, onBack: () => a(0), onNext: () => a(2) }),
      t === 2 && /* @__PURE__ */ i.jsx(nl, { inv: I, setInv: L, value: x, set: u, onBack: () => a(1), onNext: () => a(3) }),
      t === 3 && /* @__PURE__ */ i.jsx(ol, { win: S, setWin: C, deployments: f, cfgs: g, setCfgs: k, versions: r, onBack: () => a(2), onNext: () => a(4) }),
      t === 4 && /* @__PURE__ */ i.jsx(
        cl,
        {
          win: S,
          pillars: x,
          req: { options: { ...Zr(S), investigate: I }, team: o.team || void 0, region: o.region, demo: o.demo, customer: c, pillars: x, deployment: h, deployments: f, configs: Object.fromEntries(f.map((R) => [R, y(R).text])), versionsIn: Object.fromEntries(f.map((R) => [R, { chartVersion: y(R).chartVersion || void 0, otelVersion: y(R).otelVersion || void 0, distribution: y(R).distribution }])) },
          onDone: (R, Y) => {
            b(R), P(Y);
          },
          run: A,
          onNext: () => a(5),
          onBack: () => a(3)
        }
      ),
      t === 5 && A && /* @__PURE__ */ i.jsx(hl, { run: A, runId: E, setRun: P, onBack: () => a(4), onNext: () => a(6) }),
      t === 6 && A && /* @__PURE__ */ i.jsx(pl, { run: A, runId: E, onBack: () => a(5), onRestart: H })
    ] }) }),
    /* @__PURE__ */ i.jsx($r, { conn: o, customer: c, step: t, deployments: f, cfgOf: y, win: S, versions: r, today: M }),
    ke && /* @__PURE__ */ i.jsx("div", { role: "status", className: v("fixed bottom-28 right-8 z-30 rounded-xl px-4 py-3 text-[13.5px] font-medium shadow-float", ke.tone === "bad" ? "bg-bad text-on-color" : "border border-rail-line bg-rail text-rail-ink shadow-[0_0_24px_-6px_rgba(0,223,186,.5)]"), children: ke.text }),
    Me && /* @__PURE__ */ i.jsx("div", { className: "fixed inset-0 z-40 grid place-items-center bg-black/60 p-6 backdrop-blur-sm", onClick: () => me(!1), children: /* @__PURE__ */ i.jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "restart-title", onClick: (R) => R.stopPropagation(), className: "card w-full max-w-[460px] !bg-raised p-6 shadow-float", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ i.jsx("h2", { id: "restart-title", className: "text-[18px] font-bold tracking-tight", children: "Start a new review?" }),
        /* @__PURE__ */ i.jsx("button", { "aria-label": "Close", onClick: () => me(!1), className: "text-mute hover:text-ink", children: /* @__PURE__ */ i.jsx(ka, { size: 18 }) })
      ] }),
      /* @__PURE__ */ i.jsxs("p", { className: "mt-2 text-[14.5px] text-mute leading-relaxed", children: [
        "You’ll go back to Connect with everything cleared. ",
        W ? "Your draft is saved, so you can resume this review later." : "Save this review as a draft first if you want to come back to it."
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "mt-6 flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ i.jsx($, { kind: "quiet", onClick: () => me(!1), children: "Cancel" }),
        !W && /* @__PURE__ */ i.jsx($, { onClick: Q, children: "Start over without saving" }),
        /* @__PURE__ */ i.jsx($, { kind: "primary", autoFocus: !0, onClick: async () => {
          await B(!0) && (Q(), oe("Draft saved. Starting a new review."));
        }, children: W ? "Save and start over" : "Save draft and start over" })
      ] })
    ] }) })
  ] });
}
function $r({ conn: t, customer: e, step: s, deployments: n, cfgOf: a, win: r, versions: l, today: o }) {
  var c, m;
  const d = /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "text-line-strong", children: "·" });
  return /* @__PURE__ */ i.jsx("footer", { className: "shrink-0 border-t border-line bg-paper/90 px-6 py-2 text-[12px] text-mute backdrop-blur", "aria-label": "Status", children: /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
    t.demo ? /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-0.5 font-medium text-warn", children: [
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, children: "○" }),
      "Mock mode: demo data"
    ] }) : t.team ? /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-ok/40 bg-ok/10 px-2.5 py-0.5 font-medium text-ok", children: [
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "pulse-dot" }),
      "Coralogix [",
      String(t.region).toUpperCase(),
      "] · ",
      t.team
    ] }) : /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5", children: [
      /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, children: "○" }),
      "Not connected"
    ] }),
    e.name && /* @__PURE__ */ i.jsx(i.Fragment, { children: /* @__PURE__ */ i.jsxs("span", { className: "font-medium text-ink", children: [
      e.name,
      e.environment && /* @__PURE__ */ i.jsxs("span", { className: "font-normal text-mute", children: [
        " (",
        e.environment,
        ")"
      ] })
    ] }) }),
    s >= 3 && n.map((f) => /* @__PURE__ */ i.jsxs(Ji.Fragment, { children: [
      d,
      /* @__PURE__ */ i.jsxs("span", { children: [
        de[f],
        ": ",
        a(f).label || (a(f).text ? "config added" : "no config")
      ] })
    ] }, f)),
    s >= 3 && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      d,
      /* @__PURE__ */ i.jsxs("span", { children: [
        "Data from ",
        Ci(r)
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("span", { className: "ml-auto flex items-center gap-2", children: l && !l.error ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsxs("span", { children: [
        "Latest Helm chart ",
        /* @__PURE__ */ i.jsx("span", { className: "font-mono text-ink", children: l.chart })
      ] }),
      d,
      /* @__PURE__ */ i.jsxs("span", { children: [
        "Latest OTel Collector ",
        /* @__PURE__ */ i.jsx("span", { className: "font-mono text-ink", children: l.collector ?? "unknown" })
      ] }),
      d,
      /* @__PURE__ */ i.jsx("span", { children: ((c = l.checkedAt) == null ? void 0 : c.slice(0, 10)) === o ? "Checked today" : `Checked ${(m = l.checkedAt) == null ? void 0 : m.slice(0, 10)}${l.offline ? ", offline" : ""}` })
    ] }) : l != null && l.error ? "Could not check the latest versions." : /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-2", "aria-label": "Checking latest versions", children: [
      /* @__PURE__ */ i.jsx(ye, { className: "h-2.5 w-24" }),
      /* @__PURE__ */ i.jsx(ye, { className: "h-2.5 w-28" })
    ] }) })
  ] }) });
}
function yn({ icon: t, name: e, role: s, h: n, needTeam: a, optional: r }) {
  const l = a ? "idle" : n ? n.ok ? "ok" : "bad" : "loading";
  return /* @__PURE__ */ i.jsxs("li", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ i.jsx(t, { size: 18, className: "mt-0.5 text-mute", "aria-hidden": !0 }),
    /* @__PURE__ */ i.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ i.jsx("p", { className: "text-[14px] font-medium", children: e }),
      /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-mute", children: s }),
      l === "bad" && /* @__PURE__ */ i.jsx("p", { className: v("text-[12.5px] mt-1", r ? "text-mute" : "text-bad"), children: r ? "Not installed. Everything else works without it; the duplicate-field check is then left for you to scope." : n.detail })
    ] }),
    l === "ok" ? /* @__PURE__ */ i.jsx(te, { tone: "ok", icon: Se, children: "Ready" }) : l === "bad" ? r ? /* @__PURE__ */ i.jsx(te, { children: "Not installed" }) : /* @__PURE__ */ i.jsx(te, { tone: "bad", icon: Vt, children: "Not available" }) : l === "loading" ? /* @__PURE__ */ i.jsx("span", { role: "progressbar", "aria-busy": "true", "aria-label": "Checking", children: /* @__PURE__ */ i.jsx(ye, { className: "h-5 w-20 rounded-full" }) }) : /* @__PURE__ */ i.jsx(te, { children: "Pick a team first" })
  ] });
}
function _r({ team: t, region: e }) {
  const [s, n] = N.useState(null), [a, r] = N.useState(!1), [l, o] = N.useState(""), [d, c] = N.useState(""), [m, f] = N.useState(null), [p, h] = N.useState(!1), x = () => G(`/api/usage-keys?team=${encodeURIComponent(t)}`).then((y) => {
    n(y), y.keys.length || r(!0);
  }).catch((y) => f({ t: y.message, ok: !1 }));
  N.useEffect(() => {
    f(null), r(!1), x();
  }, [t]);
  const u = () => {
    h(!0), G(`/api/usage-keys/test?team=${encodeURIComponent(t)}&region=${e}`).then((y) => f({ t: y.detail, ok: y.ok })).catch((y) => f({ t: y.message, ok: !1 })).finally(() => h(!1));
  }, g = (y) => G("/api/usage-keys/select", { method: "PUT", body: JSON.stringify({ team: t, id: y }) }).then((S) => {
    n((C) => ({ ...C, ...S })), f(null);
  }), k = s == null ? void 0 : s.keys.find((y) => y.id === s.selected);
  return /* @__PURE__ */ i.jsxs("div", { className: "card p-4", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsxs("p", { className: "text-[14.5px] font-semibold", children: [
          "Exact metric usage ",
          /* @__PURE__ */ i.jsx("span", { className: "font-normal text-[13px] text-mute", children: "(optional)" })
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-mute", children: "Units per metric and per label, as in Settings › Metrics Data. Needs a key with the DataAnalytics preset; without one, metric savings are estimated from series." })
      ] }),
      /* @__PURE__ */ i.jsx("span", { className: "shrink-0 whitespace-nowrap", children: k ? m && !m.ok ? /* @__PURE__ */ i.jsx(te, { tone: "warn", icon: le, children: "Key not working" }) : /* @__PURE__ */ i.jsx(te, { tone: "ok", icon: Se, children: "Using a saved key" }) : /* @__PURE__ */ i.jsx(te, { children: "Estimated" }) })
    ] }),
    !s && !m && /* @__PURE__ */ i.jsx(rs, { rows: 2, label: "Loading saved keys", className: "mt-4" }),
    s && /* @__PURE__ */ i.jsxs("div", { className: "mt-3 flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ i.jsx(ee, { label: `Key for ${t}`, children: /* @__PURE__ */ i.jsxs("select", { "aria-label": "Saved metric usage key", className: v(Z, "min-w-[280px]"), value: a ? "__add" : s.selected ?? "", onChange: (y) => {
        const S = y.target.value;
        if (S === "__add") {
          r(!0);
          return;
        }
        r(!1), g(S || null);
      }, children: [
        /* @__PURE__ */ i.jsx("option", { value: "", children: "None (estimate from series)" }),
        s.keys.map((y) => /* @__PURE__ */ i.jsxs("option", { value: y.id, children: [
          y.label,
          y.teams.length && !y.teams.includes(t) ? ` (also used by ${y.teams.join(", ")})` : ""
        ] }, y.id)),
        /* @__PURE__ */ i.jsx("option", { value: "__add", children: "Add a new key…" })
      ] }) }),
      k && !a && /* @__PURE__ */ i.jsx($, { onClick: u, disabled: p, children: p ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx(Ke, { size: 15, className: "animate-spin" }),
        "Testing…"
      ] }) : "Test key" }),
      k && !a && /* @__PURE__ */ i.jsx($, { kind: "quiet", onClick: () => G(`/api/usage-keys/${k.id}`, { method: "DELETE" }).then(x), children: "Delete this key" })
    ] }),
    a && /* @__PURE__ */ i.jsxs("div", { className: "mt-3 rounded-lg bg-sunk p-3 space-y-3", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ i.jsx(ee, { label: "Name", children: /* @__PURE__ */ i.jsx("input", { className: Z, placeholder: `${t} – DataAnalytics`, value: l, onChange: (y) => o(y.target.value) }) }),
        /* @__PURE__ */ i.jsx(ee, { label: "API key", children: /* @__PURE__ */ i.jsx("input", { type: "password", autoComplete: "off", className: Z, value: d, onChange: (y) => c(y.target.value) }) })
      ] }),
      /* @__PURE__ */ i.jsxs("p", { className: "text-[12.5px] text-mute flex gap-1.5", children: [
        /* @__PURE__ */ i.jsx(Ts, { size: 13, className: "mt-0.5 shrink-0" }),
        "Saved in the macOS Keychain. Lens keeps only the name, so next time you pick it from the list. Used only for the read-only Metric Usage API."
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ i.jsxs($, { kind: "primary", disabled: !d || p, onClick: () => {
          h(!0), G("/api/usage-keys", { method: "POST", body: JSON.stringify({ label: l || `${t} – DataAnalytics`, apiKey: d, team: t }) }).then(() => (c(""), o(""), r(!1), x())).then(u).catch((y) => {
            f({ t: y.message, ok: !1 }), h(!1);
          });
        }, children: [
          "Save and use for ",
          t
        ] }),
        (s == null ? void 0 : s.keys.length) > 0 && /* @__PURE__ */ i.jsx($, { kind: "quiet", onClick: () => r(!1), children: "Cancel" })
      ] })
    ] }),
    m && /* @__PURE__ */ i.jsx("p", { role: "status", className: v("mt-2 text-[13px]", m.ok ? "text-ok" : "text-bad"), children: m.t })
  ] });
}
function el({ conn: t }) {
  const [e, s] = N.useState(null), [n, a] = N.useState(!1), r = () => {
    a(!0), s(null), G(`/api/prereqs${t.team ? `?team=${t.team}&region=${t.region}` : ""}`).then(s).catch((l) => s({ error: l.message })).finally(() => a(!1));
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ i.jsx($, { onClick: r, disabled: n, children: n ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(Ke, { size: 15, className: "animate-spin" }),
      "Checking…"
    ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(sa, { size: 15 }),
      "Check prerequisites"
    ] }) }),
    n && /* @__PURE__ */ i.jsx("div", { className: "mt-3 card p-4", children: /* @__PURE__ */ i.jsx(rs, { rows: 4, label: "Checking prerequisites" }) }),
    e && !e.error && /* @__PURE__ */ i.jsxs("div", { className: "mt-3 card", children: [
      /* @__PURE__ */ i.jsx("p", { className: v("px-4 py-2.5 text-[13.5px] font-semibold border-b border-line", e.ok ? "text-ok" : "text-warn"), children: e.ok ? "Ready: everything required is in place." : "Something required is missing." }),
      /* @__PURE__ */ i.jsx("ul", { className: "divide-y divide-line", children: e.checks.map((l) => /* @__PURE__ */ i.jsxs("li", { className: "flex items-start gap-3 px-4 py-2.5 text-[13.5px]", children: [
        l.ok ? /* @__PURE__ */ i.jsx(Se, { size: 16, className: "mt-0.5 text-ok shrink-0" }) : l.required ? /* @__PURE__ */ i.jsx(Vt, { size: 16, className: "mt-0.5 text-bad shrink-0" }) : /* @__PURE__ */ i.jsx(Dt, { size: 16, className: "mt-0.5 text-mute shrink-0" }),
        /* @__PURE__ */ i.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ i.jsxs("p", { className: "font-medium", children: [
            l.label.replace(" (optional, validates generated config)", " (validates generated config)"),
            !l.required && /* @__PURE__ */ i.jsx("span", { className: "font-normal text-mute", children: " (optional)" })
          ] }),
          /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute break-words", children: l.detail }),
          !l.ok && l.fix && /* @__PURE__ */ i.jsxs("p", { className: "mt-1 text-[12px] text-mute", children: [
            "Fix: ",
            /* @__PURE__ */ i.jsx("code", { className: "rounded bg-sunk px-1.5 py-0.5 break-all", children: l.fix })
          ] })
        ] })
      ] }, l.id)) })
    ] }),
    (e == null ? void 0 : e.error) && /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[13px] text-bad", children: e.error })
  ] });
}
function tl({ conn: t, setConn: e, onNext: s, onResume: n }) {
  const [a, r] = N.useState(null);
  N.useEffect(() => {
    G("/api/drafts").then(r).catch(() => r([]));
  }, []);
  const [l, o] = N.useState(null), [d, c] = N.useState(null), [m, f] = N.useState(!1), [p, h] = N.useState({ name: "", region: "ap1", apiKey: "" }), [x, u] = N.useState("");
  return N.useEffect(() => {
    G("/api/teams").then(o).catch(() => o([]));
  }, []), N.useEffect(() => {
    c(null), G(`/api/health${t.team ? `?team=${t.team}&region=${t.region}` : ""}`).then(c).catch((g) => c({ error: g.message }));
  }, [t.team, t.region]), /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 0, lead: "Choose the customer’s Coralogix team. Lens only reads data: it runs queries and usage reports, and never changes settings, policies or collectors." }),
    /* @__PURE__ */ i.jsxs("div", { className: "grid lg:grid-cols-[1fr_340px] gap-6", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ i.jsxs("div", { className: v("card p-5", t.team && !t.demo && "!border-refract/70 shadow-glow-cyan"), children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ i.jsx(na, { size: 18, className: "text-refract" }),
            /* @__PURE__ */ i.jsx("h2", { className: "text-[16px] font-semibold", children: "Use a connected team" })
          ] }),
          /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mb-4", children: "Teams come from your cx CLI profiles. Lens uses cx’s own sign-in, so it never needs your API key." }),
          /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-[1fr_140px] gap-3", children: [
            /* @__PURE__ */ i.jsx(ee, { label: "Team", children: l === null ? /* @__PURE__ */ i.jsxs("div", { className: v(Z, "flex h-[38px] items-center"), children: [
              /* @__PURE__ */ i.jsx("span", { className: "sr-only", children: "Loading teams…" }),
              /* @__PURE__ */ i.jsx(ye, { className: "h-2.5 w-36" })
            ] }) : l.length ? /* @__PURE__ */ i.jsxs("select", { className: Z, value: t.team, onChange: (g) => {
              const k = l.find((y) => y.name === g.target.value);
              e({ ...t, team: g.target.value, region: (k == null ? void 0 : k.region) ?? t.region, demo: !1 });
            }, children: [
              /* @__PURE__ */ i.jsx("option", { value: "", children: "Choose a team" }),
              l.map((g) => /* @__PURE__ */ i.jsx("option", { value: g.name, children: g.name }, g.name))
            ] }) : /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute py-2", children: "No teams yet. Add one below." }) }),
            /* @__PURE__ */ i.jsx(ee, { label: "Region", children: /* @__PURE__ */ i.jsx("select", { className: Z, value: t.region, onChange: (g) => e({ ...t, region: g.target.value }), children: xn.map((g) => /* @__PURE__ */ i.jsx("option", { children: g }, g)) }) })
          ] })
        ] }),
        t.team && /* @__PURE__ */ i.jsx(_r, { team: t.team, region: t.region }),
        /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ i.jsxs("button", { onClick: () => f(!m), "aria-expanded": m, className: v("card text-left p-5 transition-all hover:!border-refract/60 hover:-translate-y-px", m && "!border-refract/70 shadow-glow-cyan"), children: [
            /* @__PURE__ */ i.jsx(ua, { size: 18, className: "text-refract" }),
            /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[15px] font-semibold", children: "Add a team" }),
            /* @__PURE__ */ i.jsxs("p", { className: "text-[13px] text-mute mt-1", children: [
              "Only if the team has no cx profile. Easiest: run ",
              /* @__PURE__ */ i.jsx("code", { className: "font-mono text-[12px]", children: "cx profiles add" }),
              " in Terminal."
            ] })
          ] }),
          /* @__PURE__ */ i.jsxs("button", { onClick: () => {
            e({ ...t, demo: !0, team: "" }), s();
          }, className: "card text-left p-5 transition-all hover:!border-prism/60 hover:shadow-glow-purple hover:-translate-y-px", children: [
            /* @__PURE__ */ i.jsx(aa, { size: 18, className: "text-prism" }),
            /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[15px] font-semibold", children: "Use demo data" }),
            /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-mute mt-1", children: "Try the whole review with recorded, anonymised data." })
          ] })
        ] }),
        m && /* @__PURE__ */ i.jsxs("div", { className: "card !border-refract/60 p-5 space-y-3", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ i.jsx(ee, { label: "Name", children: /* @__PURE__ */ i.jsx("input", { className: Z, value: p.name, onChange: (g) => h({ ...p, name: g.target.value }) }) }),
            /* @__PURE__ */ i.jsx(ee, { label: "Region", children: /* @__PURE__ */ i.jsx("select", { className: Z, value: p.region, onChange: (g) => h({ ...p, region: g.target.value }), children: xn.map((g) => /* @__PURE__ */ i.jsx("option", { children: g }, g)) }) }),
            /* @__PURE__ */ i.jsx(ee, { label: "API key", children: /* @__PURE__ */ i.jsx("input", { type: "password", autoComplete: "off", className: Z, value: p.apiKey, onChange: (g) => h({ ...p, apiKey: g.target.value }) }) })
          ] }),
          /* @__PURE__ */ i.jsxs("p", { className: "text-[12.5px] text-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ i.jsx(Ts, { size: 13 }),
            "Stored in the Keychain only. Never written to disk or logs. Read access is enough."
          ] }),
          x && /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-bad", children: x }),
          /* @__PURE__ */ i.jsx($, { kind: "primary", disabled: !p.name || !p.apiKey, onClick: () => G("/api/teams", { method: "POST", body: JSON.stringify(p) }).then(() => {
            e({ team: p.name, region: p.region, demo: !1 }), f(!1), h({ name: "", region: "ap1", apiKey: "" });
          }).catch((g) => u(g.message)), children: "Save team" })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("aside", { className: "card px-5 py-2 self-start", children: [
        /* @__PURE__ */ i.jsx("h2", { className: "text-[14px] font-semibold pt-3", children: "What Lens uses on this Mac" }),
        /* @__PURE__ */ i.jsxs("ul", { className: "divide-y divide-line", children: [
          /* @__PURE__ */ i.jsx(yn, { icon: ga, name: "cx CLI", role: "Runs read-only log, trace and metric queries and usage reports, using its own sign-in", h: d == null ? void 0 : d.cx }),
          /* @__PURE__ */ i.jsx(yn, { optional: !0, icon: Fn, name: "claude CLI", role: "Investigate mode: analyses masked live samples. Use Check prerequisites to confirm it is signed in.", h: d == null ? void 0 : d.claude })
        ] }),
        /* @__PURE__ */ i.jsx(el, { conn: t }),
        /* @__PURE__ */ i.jsx("div", { className: "pb-4" })
      ] })
    ] }),
    !!(a != null && a.length) && /* @__PURE__ */ i.jsxs("section", { className: "mt-8", "aria-labelledby": "drafts-title", children: [
      /* @__PURE__ */ i.jsxs("h2", { id: "drafts-title", className: "text-[16px] font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ i.jsx(ra, { size: 17, className: "text-refract" }),
        "Saved drafts"
      ] }),
      /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: "Pick up where you left off. Drafts stay on this Mac and never contain API keys." }),
      /* @__PURE__ */ i.jsx("ul", { className: "mt-3 grid sm:grid-cols-2 gap-3", children: a.map((g) => /* @__PURE__ */ i.jsxs("li", { className: "flex items-center gap-3 card px-4 py-3", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ i.jsx("p", { className: "text-[14.5px] font-semibold truncate", children: g.name }),
          /* @__PURE__ */ i.jsxs("p", { className: "text-[12.5px] text-mute", children: [
            "Step ",
            g.step + 1,
            ": ",
            Jt[Math.min(g.step, 6)].title,
            g.demo ? ", demo data" : g.team ? `, ${g.team}` : "",
            ". Saved ",
            new Date(g.savedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsx($, { onClick: () => n(g.id), children: "Resume" }),
        /* @__PURE__ */ i.jsx("button", { "aria-label": `Delete draft ${g.name}`, onClick: () => G(`/api/drafts/${g.id}`, { method: "DELETE" }).then(() => r(a.filter((k) => k.id !== g.id))), className: "rounded-lg p-2 text-mute hover:text-bad hover:bg-sunk", children: /* @__PURE__ */ i.jsx(xa, { size: 16 }) })
      ] }, g.id)) })
    ] }),
    /* @__PURE__ */ i.jsx(Qe, { next: s, nextLabel: "Continue to customer details", disabled: !t.team, note: t.team ? `Connected to ${t.team}.` : "Choose a team, or use demo data." })
  ] });
}
function bn({ value: t, onChange: e, placeholder: s }) {
  const [n, a] = N.useState(""), r = () => {
    const l = n.split(",").map((o) => o.trim()).filter(Boolean);
    l.length && e([.../* @__PURE__ */ new Set([...t, ...l])]), a("");
  };
  return /* @__PURE__ */ i.jsxs("div", { className: v(Z, "flex flex-wrap gap-1.5 items-center"), children: [
    t.map((l) => /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-refract-soft text-refract px-2 py-0.5 text-[13px] font-medium", children: [
      l,
      /* @__PURE__ */ i.jsx("button", { "aria-label": `Remove ${l}`, className: "opacity-70 hover:opacity-100", onClick: () => e(t.filter((o) => o !== l)), children: "×" })
    ] }, l)),
    /* @__PURE__ */ i.jsx("input", { className: "flex-1 min-w-[140px] bg-transparent outline-none", value: n, placeholder: t.length ? "" : s, onChange: (l) => a(l.target.value), onKeyDown: (l) => {
      (l.key === "Enter" || l.key === ",") && (l.preventDefault(), r());
    }, onBlur: r })
  ] });
}
function sl({ c: t, set: e, deployments: s, setDeployments: n, onBack: a, onNext: r }) {
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 1, lead: "Tell Lens who the review is for. These details appear on the report, and the critical services decide which traces are always kept." }),
    /* @__PURE__ */ i.jsxs("div", { className: "space-y-7 max-w-[720px]", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ i.jsx(ee, { label: "Customer name", children: /* @__PURE__ */ i.jsx("input", { className: Z, value: t.name, onChange: (l) => e({ ...t, name: l.target.value }) }) }),
        /* @__PURE__ */ i.jsx(ee, { label: "Environment", children: /* @__PURE__ */ i.jsx("input", { className: Z, placeholder: "production", value: t.environment, onChange: (l) => e({ ...t, environment: l.target.value }) }) }),
        /* @__PURE__ */ i.jsx(ee, { label: "Prepared by", children: /* @__PURE__ */ i.jsx("input", { className: Z, value: t.preparedBy, onChange: (l) => e({ ...t, preparedBy: l.target.value }) }) })
      ] }),
      /* @__PURE__ */ i.jsxs("fieldset", { children: [
        /* @__PURE__ */ i.jsx("legend", { className: "text-[13.5px] font-medium mb-1", children: "How do they run the OpenTelemetry Collector?" }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute mb-2", children: "Select every type they use. You can add a config for each one in the next steps." }),
        /* @__PURE__ */ i.jsx("div", { className: "grid sm:grid-cols-4 gap-2", children: Xr.map(([l, o, d]) => {
          const c = s.includes(l);
          return /* @__PURE__ */ i.jsxs("label", { className: v("relative cursor-pointer rounded-xl border bg-surface/70 px-3 py-2.5 transition-all", c ? "border-refract/70 shadow-glow-cyan" : "border-line hover:border-line-strong"), children: [
            /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "sr-only", checked: c, onChange: () => n(c ? s.length > 1 ? s.filter((m) => m !== l) : s : [...s, l]) }),
            /* @__PURE__ */ i.jsxs("span", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ i.jsx("span", { className: "block text-[14px] font-medium", children: o }),
              /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("grid h-4 w-4 place-items-center rounded border", c ? "bg-refract border-refract text-on-color" : "border-line"), children: c && /* @__PURE__ */ i.jsx(xt, { size: 12, strokeWidth: 3 }) })
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "block text-[12.5px] text-mute", children: d })
          ] }, l);
        }) }),
        s.length > 1 && /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: "Data checks run once for the whole team, so savings are never counted twice. Config checks and generated configs are done per type." })
      ] }),
      /* @__PURE__ */ i.jsx(ee, { label: "Leadership slide is for", hint: "Shown above the one-slide summary at the top of the report. Leave empty for “leadership”.", children: /* @__PURE__ */ i.jsx("input", { className: Z, placeholder: "the CTO and co-founders", value: t.audience, onChange: (l) => e({ ...t, audience: l.target.value }) }) }),
      /* @__PURE__ */ i.jsx(ee, { label: "Critical services", hint: "Errors from these services are always kept by tail sampling, and their internal spans are never dropped. Press Enter after each name.", children: /* @__PURE__ */ i.jsx(bn, { value: t.criticalServices, onChange: (l) => e({ ...t, criticalServices: l }), placeholder: "checkout, payment" }) }),
      /* @__PURE__ */ i.jsx(ee, { label: "Names to keep out of the customer report", hint: "People, team names or project names. Links, account IDs and API keys are removed automatically.", children: /* @__PURE__ */ i.jsx(bn, { value: t.internalTerms, onChange: (l) => e({ ...t, internalTerms: l }), placeholder: "Optional" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "card p-4 space-y-2.5 text-[14px]", children: [
        /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] font-medium", children: "Before you start" }),
        /* @__PURE__ */ i.jsxs("label", { className: "flex gap-2.5 items-start", children: [
          /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: t.nearRenewal, onChange: (l) => e({ ...t, nearRenewal: l.target.checked }) }),
          /* @__PURE__ */ i.jsx("span", { children: "The customer is close to renewal" })
        ] }),
        /* @__PURE__ */ i.jsxs("label", { className: "flex gap-2.5 items-start", children: [
          /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: t.teamCanVerify, onChange: (l) => e({ ...t, teamCanVerify: l.target.checked }) }),
          /* @__PURE__ */ i.jsx("span", { children: "The customer’s team can join the Verify step" })
        ] }),
        (t.nearRenewal || !t.teamCanVerify) && /* @__PURE__ */ i.jsxs("div", { role: "note", className: "flex gap-2 rounded-lg bg-warnbg px-3 py-2.5 text-[13.5px] text-warn", children: [
          /* @__PURE__ */ i.jsx(le, { size: 16, className: "mt-0.5 shrink-0" }),
          /* @__PURE__ */ i.jsxs("div", { children: [
            t.nearRenewal && /* @__PURE__ */ i.jsx("p", { children: "Talk to the account owner before sharing this review." }),
            !t.teamCanVerify && /* @__PURE__ */ i.jsx("p", { children: "Without the customer in Verify, changes can break their dashboards or alerts. You can still run the assessment." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: a, next: r, nextLabel: "Continue to pillars", disabled: !t.name, note: t.name ? void 0 : "Add the customer name to continue." })
  ] });
}
const ys = {
  universal: { body: "Pipeline-wide fixes that help every signal at once.", checks: ["Unused resource attributes", "Memory protection and batching", "Kubernetes metadata allowlist", "Protected labels"] },
  logs: { body: "Where log volume comes from, and what nobody reads.", checks: ["Heavy attributes", "Split multi-line logs", "Duplicates and low-value logs", "TCO tier fit"] },
  traces: { body: "Keep the traces that explain problems; sample the rest.", checks: ["Tail sampling", "Health checks and probes", "Internal spans", "Span metrics first"] },
  metrics: { body: "Series that grow without adding insight.", checks: ["High-churn labels", "Span names per service", "Unused metrics", "Scrape intervals"] }
};
function nl({ value: t, set: e, onBack: s, onNext: n, inv: a, setInv: r }) {
  var l, o, d;
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 2, lead: "Choose what to review. Universal always runs first, because pipeline fixes change the numbers for every other pillar." }),
    /* @__PURE__ */ i.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: Object.keys(ys).map((c) => {
      const m = t.includes(c) || c === "universal", f = ve[c];
      return /* @__PURE__ */ i.jsxs(
        "button",
        {
          "aria-pressed": m,
          disabled: c === "universal",
          onClick: () => e(m ? t.filter((p) => p !== c) : [...t, c]),
          style: m ? { borderColor: f.color, boxShadow: `0 0 26px -14px ${f.color}` } : void 0,
          className: v("card text-left p-5 transition-all", !m && "hover:!border-line-strong", c === "universal" && "cursor-default"),
          children: [
            /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("absolute inset-x-0 top-0 h-1", m ? f.bg : "bg-transparent") }),
            /* @__PURE__ */ i.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ i.jsx("span", { className: v("grid h-10 w-10 place-items-center rounded-lg", m ? `${f.bg} text-on-color` : "bg-sunk text-mute"), children: /* @__PURE__ */ i.jsx(f.icon, { size: 20 }) }),
              /* @__PURE__ */ i.jsx("span", { className: v("grid h-6 w-6 place-items-center rounded-full border-2", m ? `${f.border} ${f.bg} text-on-color` : "border-line"), children: m && /* @__PURE__ */ i.jsx(xt, { size: 14, strokeWidth: 3 }) })
            ] }),
            /* @__PURE__ */ i.jsxs("p", { className: "mt-3 text-[17px] font-semibold", children: [
              f.name,
              c === "universal" && /* @__PURE__ */ i.jsx("span", { className: "ml-2 text-[12.5px] font-medium text-universal", children: "Always runs first" })
            ] }),
            /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: ys[c].body }),
            /* @__PURE__ */ i.jsx("ul", { className: "mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]", children: ys[c].checks.map((p) => /* @__PURE__ */ i.jsxs("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ i.jsx("span", { className: v("mt-[7px] h-1.5 w-1.5 rounded-full shrink-0", f.bg) }),
              p
            ] }, p)) })
          ]
        },
        c
      );
    }) }),
    /* @__PURE__ */ i.jsx("section", { "aria-labelledby": "inv-title", className: v("mt-6 card p-5", a.enabled && "!border-prism/60 shadow-glow-purple"), children: /* @__PURE__ */ i.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ i.jsx("span", { className: v("grid h-10 w-10 shrink-0 place-items-center rounded-lg", a.enabled ? "bg-prism text-on-color" : "bg-sunk text-mute"), children: /* @__PURE__ */ i.jsx(Rt, { size: 20 }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ i.jsx("h2", { id: "inv-title", className: "text-[17px] font-semibold", children: "Investigate with Claude" }),
          /* @__PURE__ */ i.jsx("span", { className: "text-[12.5px] text-mute", children: "Recommended" }),
          /* @__PURE__ */ i.jsxs("label", { className: "ml-auto flex items-center gap-2 text-[13.5px] font-medium", children: [
            /* @__PURE__ */ i.jsx("input", { type: "checkbox", checked: a.enabled, onChange: (c) => r({ ...a, enabled: c.target.checked }) }),
            "Turn on"
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-1 max-w-[72ch]", children: "Goes beyond the playbook checks. Lens finds what drives the most volume: log patterns, span operations, and the metrics and labels behind series cardinality. It pulls live samples with cx and asks Claude what each one is and how to optimise it. Lens then checks every suggestion against real data, simulates the change, and works out the saving from official rates." }),
        a.enabled && /* @__PURE__ */ i.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 text-[13.5px]", children: [
          /* @__PURE__ */ i.jsx("span", { className: "font-medium", children: "Contributors to analyse" }),
          /* @__PURE__ */ i.jsx("div", { role: "radiogroup", "aria-label": "Contributors to analyse", className: "inline-flex rounded-lg border border-line bg-sunk p-1 gap-1", children: [5, 8, 12].map((c) => /* @__PURE__ */ i.jsx("button", { role: "radio", "aria-checked": a.maxContributors === c, onClick: () => r({ ...a, maxContributors: c }), className: v("rounded-md px-3 py-1 font-medium", a.maxContributors === c ? "bg-raised shadow-sm ring-1 ring-prism/40" : "text-mute"), children: c === 8 ? "8 (default)" : c }, c)) }),
          /* @__PURE__ */ i.jsx("span", { className: "text-[12.5px] text-mute", children: "More contributors take longer. A typical run takes 1–3 minutes." })
        ] }),
        a.enabled && /* @__PURE__ */ i.jsxs("div", { className: "mt-4 rounded-lg bg-sunk px-4 py-3", children: [
          /* @__PURE__ */ i.jsxs("p", { className: "text-[13.5px] font-medium", children: [
            "TAM skills for metrics ",
            /* @__PURE__ */ i.jsx("span", { className: "font-normal text-mute", children: "(from the playbook’s AI Skills tab; run when Metrics is selected)" })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "mt-2 grid gap-2 text-[13.5px]", children: [
            /* @__PURE__ */ i.jsxs("label", { className: "flex gap-2 items-start", children: [
              /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: ((l = a.skills) == null ? void 0 : l.spanNames) !== !1, onChange: (c) => r({ ...a, skills: { ...a.skills, spanNames: c.target.checked } }) }),
              /* @__PURE__ */ i.jsxs("span", { children: [
                /* @__PURE__ */ i.jsx("span", { className: "font-medium", children: "span-name-cardinality-analyzer" }),
                /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: ": finds IDs and query strings in span names and writes the sanitisation patterns. Lens tests them on every real span name." })
              ] })
            ] }),
            /* @__PURE__ */ i.jsxs("label", { className: "flex gap-2 items-start", children: [
              /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: ((o = a.skills) == null ? void 0 : o.buckets) !== !1, onChange: (c) => r({ ...a, skills: { ...a.skills, buckets: c.target.checked } }) }),
              /* @__PURE__ */ i.jsxs("span", { children: [
                /* @__PURE__ */ i.jsx("span", { className: "font-medium", children: "span-metrics-bucket-optimizer" }),
                /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: ": proposes histogram buckets from the live latency distribution. Lens computes the percentiles and the series change." })
              ] })
            ] }),
            ((d = a.skills) == null ? void 0 : d.buckets) !== !1 && /* @__PURE__ */ i.jsxs("label", { className: "flex flex-wrap items-center gap-2 pl-6", children: [
              /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "Vendor the customer compares against" }),
              /* @__PURE__ */ i.jsx("select", { className: "rounded-lg border border-line bg-surface px-2 py-1", value: a.vendor, onChange: (c) => r({ ...a, vendor: c.target.value }), children: ["none / Coralogix-only", "Datadog", "New Relic", "Splunk Observability", "Grafana (Mimir/Prometheus)", "Dynatrace"].map((c) => /* @__PURE__ */ i.jsx("option", { children: c }, c)) })
            ] })
          ] }),
          /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[12px] text-mute", children: "Lens collects the data each skill needs through cx, so no API key is shared and Claude runs with tools off." })
        ] }),
        a.enabled && /* @__PURE__ */ i.jsxs("p", { className: "mt-3 text-[12.5px] text-mute flex gap-1.5", children: [
          /* @__PURE__ */ i.jsx(Ts, { size: 13, className: "mt-0.5 shrink-0" }),
          "Samples are masked on this Mac (emails, IPs, tokens, keys, card numbers) before they go to Claude through the claude CLI. Claude runs with tools switched off and nothing is saved as a session. The masked samples appear on each finding, exactly as sent."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: s, next: n, nextLabel: "Continue to config", note: `${(/* @__PURE__ */ new Set(["universal", ...t])).size} of 4 pillars selected.` })
  ] });
}
const wn = [[1, "1 hour", "Quickest, but misses daily patterns"], [6, "6 hours", ""], [24, "24 hours (default)", "Recommended: one full daily cycle"], [72, "3 days", ""], [168, "7 days", "Includes weekly patterns; slowest"]], il = [[5, "5 min"], [15, "15 min (default)"], [30, "30 min"], [60, "60 min"]], al = [100, 200, 500, 1e3];
function bs({ label: t, value: e, options: s, onChange: n }) {
  return /* @__PURE__ */ i.jsx("div", { role: "radiogroup", "aria-label": t, className: "inline-flex flex-wrap rounded-lg border border-line bg-sunk p-1 gap-1", children: s.map(([a, r]) => /* @__PURE__ */ i.jsx("button", { role: "radio", "aria-checked": e === a, onClick: () => n(a), className: v("rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-all", e === a ? "bg-raised text-ink shadow-sm ring-1 ring-refract/40" : "text-mute hover:text-ink"), children: r }, a)) });
}
function rl({ win: t, setWin: e }) {
  var p;
  const s = t.mode ?? "relative", n = ft(t), a = (p = wn.find(([h]) => h === t.windowHours)) == null ? void 0 : p[2], r = s !== "relative" || t.windowHours !== Re.windowHours || t.dupWindowMinutes !== Re.dupWindowMinutes || t.rowLimit !== Re.rowLimit, l = Intl.DateTimeFormat().resolvedOptions().timeZone, o = /* @__PURE__ */ new Date(), d = xs(o), c = (h, x) => e({ ...t, mode: "range", start: xs(h), end: xs(x) }), m = (h) => new Date(h.getFullYear(), h.getMonth(), h.getDate()), f = () => {
    const h = new Date(Math.floor(o.getTime() / 36e5) * 36e5);
    c(new Date(h.getTime() - t.windowHours * 36e5), h);
  };
  return /* @__PURE__ */ i.jsxs("section", { className: "mt-10", "aria-labelledby": "win-title", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex items-baseline justify-between gap-4", children: [
      /* @__PURE__ */ i.jsx("h2", { id: "win-title", className: "text-[16px] font-semibold", children: "Analysis window" }),
      r && /* @__PURE__ */ i.jsx($, { kind: "quiet", onClick: () => e(Re), children: "Reset to defaults" })
    ] }),
    /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-1 max-w-[68ch]", children: "How much data the checks look at. Whatever you choose, results are converted to a per-day figure. Usage numbers always use the last 7 complete days, leaving out today because it is still in progress." }),
    /* @__PURE__ */ i.jsxs("p", { className: "text-[13px] mt-2 mb-4", children: [
      /* @__PURE__ */ i.jsx("span", { className: "font-medium", children: "Defaults:" }),
      " ",
      /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "last 24 hours for volume checks, 15 minutes for duplicate checks, 200 rows per query." })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "card divide-y divide-line", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("p", { className: "text-[14px] font-medium", children: "Volume checks" }),
          /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute", children: "Attribute sizes, noisy logs, spans, metric series" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("div", { role: "radiogroup", "aria-label": "Time range", className: "grid sm:grid-cols-2 gap-2 max-w-[600px]", children: [["relative", "Recent period", "From 1 hour to 7 days, up to now"], ["range", "Specific dates", "A start and end you choose, up to 7 days"]].map(([h, x, u]) => {
            const g = s === h;
            return /* @__PURE__ */ i.jsxs(
              "button",
              {
                type: "button",
                role: "radio",
                "aria-checked": g,
                onClick: () => h === "range" && s !== "range" ? t.start && t.end ? e({ ...t, mode: "range" }) : f() : e({ ...t, mode: h }),
                className: v("flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all", g ? "border-refract bg-refract-soft" : "border-line hover:border-mute"),
                children: [
                  /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2", g ? "border-refract" : "border-line"), children: g && /* @__PURE__ */ i.jsx("span", { className: "h-2 w-2 rounded-full bg-refract" }) }),
                  /* @__PURE__ */ i.jsxs("span", { children: [
                    /* @__PURE__ */ i.jsx("span", { className: "block text-[14px] font-medium", children: x }),
                    /* @__PURE__ */ i.jsx("span", { className: "block text-[12.5px] text-mute", children: u })
                  ] })
                ]
              },
              h
            );
          }) }),
          /* @__PURE__ */ i.jsx("div", { className: "mt-3 max-w-[600px] rounded-lg border border-line bg-paper px-4 py-3.5", children: s === "relative" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] font-medium text-mute mb-2", children: "Look back over the last" }),
            /* @__PURE__ */ i.jsx(bs, { label: "Volume checks window", value: t.windowHours, options: wn.map(([h, x]) => [h, x]), onChange: (h) => e({ ...t, mode: "relative", windowHours: h }) }),
            a && /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: a }),
            t.windowHours > 24 && /* @__PURE__ */ i.jsx("p", { className: "mt-1 text-[12.5px] text-warn", children: "Longer windows scan more data, so queries take longer and may hit Coralogix query limits on very large accounts." })
          ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 max-w-[560px]", children: [
              /* @__PURE__ */ i.jsx(ee, { label: "Start", children: /* @__PURE__ */ i.jsx("input", { type: "datetime-local", className: Z, value: t.start ?? "", max: t.end || d, onChange: (h) => e({ ...t, start: h.target.value }) }) }),
              /* @__PURE__ */ i.jsx(ee, { label: "End", children: /* @__PURE__ */ i.jsx("input", { type: "datetime-local", className: Z, value: t.end ?? "", max: d, onChange: (h) => e({ ...t, end: h.target.value }) }) })
            ] }),
            /* @__PURE__ */ i.jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-[12.5px]", children: [
              /* @__PURE__ */ i.jsx("span", { className: "text-mute py-1", children: "Quick picks:" }),
              [["Yesterday", () => c(new Date(m(o).getTime() - 864e5), m(o))], ["Last 7 full days", () => c(new Date(m(o).getTime() - 7 * 864e5), m(o))], ["Same 24 h last week", () => {
                const h = new Date(Math.floor(o.getTime() / 36e5) * 36e5 - 6048e5);
                c(new Date(h.getTime() - 864e5), h);
              }]].map(([h, x]) => /* @__PURE__ */ i.jsx("button", { onClick: x, className: "rounded-full border border-line px-2.5 py-1 hover:border-refract hover:text-refract", children: h }, h))
            ] }),
            /* @__PURE__ */ i.jsx("p", { className: v("mt-2 text-[12.5px]", n ? "text-bad" : "text-mute"), role: n ? "alert" : void 0, children: n ?? `${Zs(Wr(t))} in your time zone (${l}): ${Yt(t.start).slice(0, 16).replace("T", " ")} to ${Yt(t.end).slice(0, 16).replace("T", " ")} UTC. Between 1 hour and 7 days; the end must be in the past.` })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("p", { className: "text-[14px] font-medium", children: "Duplicate checks" }),
          /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute", children: "Logs shipped more than once" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx(bs, { label: "Duplicate checks window", value: t.dupWindowMinutes, options: il, onChange: (h) => e({ ...t, dupWindowMinutes: h }) }),
          /* @__PURE__ */ i.jsxs("p", { className: "mt-2 text-[12.5px] text-mute", children: [
            s === "range" ? "Uses the final minutes of your custom range" : "A short window keeps this fast",
            "; the count is scaled up to a day."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("p", { className: "text-[14px] font-medium", children: "Rows per query" }),
          /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute", children: "Upper limit on results returned" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx(bs, { label: "Rows per query", value: t.rowLimit, options: al.map((h) => [h, h === 200 ? "200 (default)" : String(h)]), onChange: (h) => e({ ...t, rowLimit: h }) }),
          /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: "Totals are computed inside each query, so this mostly limits how many items (services, templates) are listed." })
        ] })
      ] })
    ] })
  ] });
}
function kn({ label: t, cur: e, latest: s, onChange: n, placeholder: a }) {
  const r = (() => {
    if (!e || !s) return null;
    const l = e.split(".").map(Number), o = s.split(".").map(Number);
    return l.some(isNaN) ? null : l[0] === o[0] && l[1] === o[1] ? o[2] - l[2] : (o[1] - l[1]) * 1e3;
  })();
  return /* @__PURE__ */ i.jsxs("div", { className: "card p-4", children: [
    /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] font-medium", children: t }),
    /* @__PURE__ */ i.jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
      /* @__PURE__ */ i.jsx("input", { "aria-label": `${t} in use`, className: v(Z, "w-32 tabnum"), placeholder: a, value: e, onChange: (l) => n(l.target.value) }),
      /* @__PURE__ */ i.jsx("span", { className: "text-mute text-[13px] whitespace-nowrap", children: "in use" }),
      /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "→" }),
      /* @__PURE__ */ i.jsx("span", { className: "tabnum text-[14px] font-medium", children: s ?? "…" }),
      /* @__PURE__ */ i.jsx("span", { className: "text-mute text-[13px]", children: "latest" })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "mt-2.5", children: e ? r === 0 ? /* @__PURE__ */ i.jsx(te, { tone: "ok", icon: Se, children: "Up to date" }) : r && r > 0 && r < 1e3 ? /* @__PURE__ */ i.jsxs(te, { tone: "warn", icon: le, children: [
      r,
      " versions behind"
    ] }) : /* @__PURE__ */ i.jsx(te, { tone: "warn", icon: le, children: "Behind the latest" }) : /* @__PURE__ */ i.jsx(te, { children: "Not set: the report assumes the latest" }) })
  ] });
}
function ll({ dep: t, cfg: e, set: s, versions: n }) {
  const [a, r] = N.useState(null), [l, o] = N.useState(!1), [d, c] = N.useState(!1);
  N.useEffect(() => {
    const p = setTimeout(() => G("/api/config/detect", { method: "POST", body: JSON.stringify({ text: e.text }) }).then((h) => {
      r(h), s((x) => ({ ...x, label: x.text ? h.label : "", chartVersion: x.chartVersion || h.chartVersion || "", otelVersion: x.otelVersion || h.collectorVersion || "" }));
    }).catch(() => {
    }), 300);
    return () => clearTimeout(p);
  }, [e.text]);
  const m = (p) => p.text().then((h) => s({ ...e, text: h })), f = e.text && a && a.format !== "empty" ? t === "helm" && a.format !== "helm-values" ? "This looks like a collector config, not Coralogix Helm values." : t !== "helm" && a.format === "helm-values" ? `This looks like Coralogix Helm values, not a ${de[t]} collector config.` : t !== "helm" && a.deployment && a.deployment !== t && a.deployment !== "standalone" ? `This looks like a ${de[a.deployment]} config.` : "" : "";
  return /* @__PURE__ */ i.jsxs("section", { className: "card", "aria-label": `${de[t]} config`, children: [
    /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3 border-b border-line px-5 py-3", children: [
      /* @__PURE__ */ i.jsx("h2", { className: "flex-1 text-[16px] font-semibold", children: de[t] }),
      e.text ? /* @__PURE__ */ i.jsxs("span", { className: "text-[13px] text-mute", children: [
        "We detected: ",
        /* @__PURE__ */ i.jsx("b", { className: "text-ink", children: (a == null ? void 0 : a.label) ?? "…" })
      ] }) : /* @__PURE__ */ i.jsx("span", { className: "text-[13px] text-mute", children: "Optional" }),
      e.text && /* @__PURE__ */ i.jsx($, { kind: "quiet", onClick: () => {
        s({ ...e, text: "", label: "" }), c(!1);
      }, children: "Remove" })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "p-5", children: [
      !e.text && !d ? /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsxs(
          "label",
          {
            onDragOver: (p) => {
              p.preventDefault(), o(!0);
            },
            onDragLeave: () => o(!1),
            onDrop: (p) => {
              p.preventDefault(), o(!1);
              const h = p.dataTransfer.files[0];
              h && m(h);
            },
            className: v("flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center cursor-pointer", l ? "border-refract bg-refract-soft" : "border-line hover:border-refract"),
            children: [
              /* @__PURE__ */ i.jsx(ya, { size: 22, className: "text-refract" }),
              /* @__PURE__ */ i.jsxs("span", { className: "mt-2 text-[14.5px] font-semibold", children: [
                "Drop the ",
                t === "helm" ? "values.yaml" : `${de[t]} collector config`
              ] }),
              /* @__PURE__ */ i.jsx("span", { className: "mt-1 text-[13px] text-mute", children: "or click to choose a file" }),
              /* @__PURE__ */ i.jsx("input", { type: "file", "aria-label": `Choose a ${de[t]} config file`, accept: ".yaml,.yml,.conf,.txt", className: "sr-only", onChange: (p) => {
                var h;
                return ((h = p.target.files) == null ? void 0 : h[0]) && m(p.target.files[0]);
              } })
            ]
          }
        ),
        /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-center", children: /* @__PURE__ */ i.jsx("button", { type: "button", onClick: () => c(!0), className: "text-[13.5px] text-refract hover:underline", "aria-label": `Paste the ${de[t]} config instead`, children: "Paste it instead" }) })
      ] }) : /* @__PURE__ */ i.jsx("textarea", { "aria-label": `Paste ${de[t]} configuration`, spellCheck: !1, className: "block w-full rounded-lg border border-line bg-paper px-3 py-2 font-mono text-[12.5px] h-44 outline-none resize-y", placeholder: "Paste YAML here", value: e.text, onChange: (p) => s({ ...e, text: p.target.value }) }),
      f && /* @__PURE__ */ i.jsxs("p", { role: "alert", className: "mt-2 flex gap-2 text-[13px] text-warn", children: [
        /* @__PURE__ */ i.jsx(le, { size: 15, className: "mt-0.5 shrink-0" }),
        f,
        " Check it is in the right slot."
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "mt-4 grid sm:grid-cols-2 gap-3", children: [
        t === "helm" && /* @__PURE__ */ i.jsx(kn, { label: "Coralogix Helm chart", cur: e.chartVersion, latest: n == null ? void 0 : n.chart, onChange: (p) => s({ ...e, chartVersion: p }), placeholder: n == null ? void 0 : n.chart }),
        /* @__PURE__ */ i.jsx(kn, { label: "OpenTelemetry Collector", cur: e.otelVersion, latest: n == null ? void 0 : n.collector, onChange: (p) => s({ ...e, otelVersion: p }), placeholder: "0.98.0" }),
        t !== "helm" && /* @__PURE__ */ i.jsx(ee, { label: "Distribution", hint: "otelcol-contrib is recommended.", children: /* @__PURE__ */ i.jsxs("select", { className: Z, value: e.distribution, onChange: (p) => s({ ...e, distribution: p.target.value }), children: [
          /* @__PURE__ */ i.jsx("option", { children: "otelcol-contrib" }),
          /* @__PURE__ */ i.jsx("option", { children: "otelcol" })
        ] }) })
      ] })
    ] })
  ] });
}
function ol({ deployments: t, cfgs: e, setCfgs: s, versions: n, onBack: a, onNext: r, win: l, setWin: o }) {
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 3, lead: t.length > 1 ? "Add a config for each deployment type, if you have them. Lens edits each one in place, keeping comments and structure, and writes a separate optimised (and, if needed, upgraded) config per type. Any slot can stay empty." : "Optional. Add the customer’s values.yaml or collector config and Lens will edit it in place, keeping their comments and structure. Without one, it still runs and writes fresh snippets." }),
    /* @__PURE__ */ i.jsx("div", { className: "space-y-5", children: t.map((d) => /* @__PURE__ */ i.jsx(ll, { dep: d, versions: n, cfg: e[d] ?? Ht, set: (c) => s((m) => ({ ...m, [d]: typeof c == "function" ? c(m[d] ?? Ht) : c })) }, d)) }),
    /* @__PURE__ */ i.jsx("p", { className: "mt-3 text-[13px] text-mute", children: "Lens always recommends the latest chart and collector. If a type is behind, it also writes an upgraded config for it and lists every breaking change." }),
    /* @__PURE__ */ i.jsx(rl, { win: l, setWin: o }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: a, next: r, nextLabel: "Run the assessment", disabled: !!ft(l), note: ft(l) ? `Fix the custom range first: ${ft(l)}` : "Nothing is changed in the customer’s environment." })
  ] });
}
function cl({ req: t, pillars: e, onDone: s, run: n, onNext: a, onBack: r, win: l }) {
  var L, E;
  const [o, d] = N.useState({}), [c, m] = N.useState(""), [f, p] = N.useState(!!n), h = N.useRef(!!n);
  N.useEffect(() => {
    h.current || (h.current = !0, G("/api/runs", { method: "POST", body: JSON.stringify(t) }).then(({ id: b }) => {
      let A = !1;
      const P = (F) => {
        F.type === "progress" && d((W) => ({ ...W, [F.checkId]: { ...W[F.checkId], ...F } })), F.type === "done" && !A && (A = !0, M(), clearInterval(J), G(`/api/runs/${b}`).then((W) => {
          s(b, W), p(!0);
        })), F.type === "error" && (A = !0, m(F.message), M(), clearInterval(J));
      }, M = ja(b, P), J = setInterval(() => {
        A || G(`/api/runs/${b}/events`).then((F) => F.forEach(P)).catch(() => {
        });
      }, 2e3);
    }).catch((b) => m(b.message)));
  }, []);
  const x = Object.values(o).filter((b) => b.checkId && b.checkId !== "gaps" && b.checkId !== "FINISHING" && b.checkId !== "LABELS"), u = o.FINISHING, g = (b) => b.startsWith("UNI") ? "universal" : b.startsWith("LOG") ? "logs" : b.startsWith("SPAN") ? "traces" : "metrics", k = x.find((b) => b.checkId === "INVESTIGATE"), y = x.filter((b) => ["done", "skipped", "failed"].includes(b.status)).length, S = f ? 100 : x.length ? Math.min(97, Math.round(y / x.length * 100)) : 4, C = ((L = n == null ? void 0 : n.findings) == null ? void 0 : L.length) ?? x.reduce((b, A) => {
    var P, M;
    return b + +(((M = (P = A.message) == null ? void 0 : P.match(/^(\d+) finding/)) == null ? void 0 : M[1]) ?? 0);
  }, 0), I = (b, A) => b === "done" && /finding/.test(A ?? "") ? /* @__PURE__ */ i.jsx(le, { size: 17, className: "text-refract" }) : b === "done" ? /* @__PURE__ */ i.jsx(Se, { size: 17, className: "text-ok" }) : b === "running" ? /* @__PURE__ */ i.jsx(Ke, { size: 17, className: "text-prism animate-spin" }) : b === "failed" ? /* @__PURE__ */ i.jsx(Vt, { size: 17, className: "text-bad" }) : b === "skipped" ? /* @__PURE__ */ i.jsx(Dt, { size: 17, className: "text-mute" }) : /* @__PURE__ */ i.jsx(Dt, { size: 17, className: "text-line" });
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 4, lead: `Lens is running the playbook’s discovery queries over ${l.mode === "range" ? `data from ${Ci(l)}` : `the last ${Zs(l.windowHours)} of data`}, one check at a time. Each check either finds something to improve, finds nothing, or is skipped with a reason.` }),
    c ? /* @__PURE__ */ i.jsxs("div", { className: "rounded-xl border border-bad/40 bg-surface px-5 py-4", children: [
      /* @__PURE__ */ i.jsxs("p", { className: "text-bad font-medium", children: [
        "The assessment stopped: ",
        c
      ] }),
      /* @__PURE__ */ i.jsx("p", { className: "text-mute text-[13.5px] mt-1", children: "Check the team in Connect, then run it again." })
    ] }) : /* @__PURE__ */ i.jsxs("div", { className: "hero px-6 py-5", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "flex items-end justify-between gap-6", children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-rail-mute", children: f ? "Assessment complete" : y === x.length && x.length ? `Finishing up${u != null && u.message ? `: ${u.message}` : "…"}` : "Running checks" }),
          /* @__PURE__ */ i.jsxs("p", { className: "font-display text-[28px] font-semibold tabnum leading-none mt-1", children: [
            S,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs("dl", { className: "flex gap-8 text-[13px] text-right", children: [
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx("dt", { className: "text-rail-mute", children: "Checks finished" }),
            /* @__PURE__ */ i.jsxs("dd", { className: "text-[20px] font-semibold tabnum", children: [
              y,
              "/",
              x.length || "…"
            ] })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx("dt", { className: "text-rail-mute", children: f ? "Findings" : "Findings so far" }),
            /* @__PURE__ */ i.jsx("dd", { className: "text-[20px] font-semibold tabnum", children: C })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "mt-4 h-2 rounded-full bg-white/[.07] overflow-hidden", children: /* @__PURE__ */ i.jsx("div", { className: "h-full rounded-full bg-[linear-gradient(90deg,#06B6D4,#00DFBA)] shadow-[0_0_14px_rgba(0,223,186,.7)] lens-grow", style: { width: `${S}%` } }) })
    ] }),
    k && /* @__PURE__ */ i.jsxs("section", { className: "mt-6 card !border-prism/60 shadow-glow-purple px-5 py-4", "aria-live": "polite", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ i.jsx(Rt, { size: 18, className: "text-prism" }),
        /* @__PURE__ */ i.jsx("h2", { className: "text-[15px] font-semibold flex-1", children: "Investigate with Claude" }),
        k.status === "running" ? /* @__PURE__ */ i.jsx(Ke, { size: 17, className: "text-prism animate-spin" }) : k.status === "done" ? /* @__PURE__ */ i.jsx(Se, { size: 17, className: "text-ok" }) : /* @__PURE__ */ i.jsx(le, { size: 17, className: "text-p2" })
      ] }),
      /* @__PURE__ */ i.jsx("p", { className: "mt-1 text-[13.5px] text-mute", children: k.message ?? "Waiting for the playbook checks to finish" })
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "mt-6 grid md:grid-cols-2 gap-4", children: ["universal", "logs", "traces", "metrics"].filter((b) => b === "universal" || e.includes(b)).map((b) => {
      const A = ve[b], P = x.filter((M) => M.checkId !== "INVESTIGATE" && g(M.checkId) === b);
      return /* @__PURE__ */ i.jsxs("section", { className: "card overflow-hidden", children: [
        /* @__PURE__ */ i.jsxs("h2", { className: "flex items-center gap-2 border-b border-line px-4 py-2.5 text-[14.5px] font-semibold", children: [
          /* @__PURE__ */ i.jsx("span", { className: v("grid h-6 w-6 place-items-center rounded-md text-on-color", A.bg), children: /* @__PURE__ */ i.jsx(A.icon, { size: 14 }) }),
          A.name,
          /* @__PURE__ */ i.jsxs("span", { className: "ml-auto text-[12.5px] font-normal text-mute", children: [
            P.filter((M) => M.status !== "waiting" && M.status !== "running").length,
            " of ",
            P.length
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("ul", { "aria-live": "polite", children: P.length ? P.map((M) => {
          var J;
          return /* @__PURE__ */ i.jsxs("li", { className: "flex items-start gap-2.5 px-4 py-2 text-[13.5px] border-b border-line last:border-0", children: [
            /* @__PURE__ */ i.jsx("span", { className: "mt-0.5", "aria-label": /finding/.test(M.message ?? "") ? "Found something to improve" : M.status, children: I(M.status, M.message) }),
            /* @__PURE__ */ i.jsxs("span", { className: "flex-1", children: [
              /* @__PURE__ */ i.jsx("span", { className: v(M.status === "waiting" && "text-mute"), children: M.title }),
              M.message && M.status !== "running" && /* @__PURE__ */ i.jsx("span", { className: v("block text-[12.5px]", /finding/.test(M.message) ? "text-refract font-medium" : "text-mute"), children: M.message === "Nothing to improve" ? "Already in good shape" : /finding/.test(M.message) ? `Found ${((J = M.message.match(/^\d+/)) == null ? void 0 : J[0]) ?? ""} thing${/^1 /.test(M.message) ? "" : "s"} to improve` : M.message })
            ] })
          ] }, M.checkId);
        }) : /* @__PURE__ */ i.jsx("li", { className: "px-4 py-3", children: /* @__PURE__ */ i.jsx(rs, { rows: 3, label: "Waiting to start" }) }) })
      ] }, b);
    }) }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: f ? void 0 : r, next: a, disabled: !f, nextLabel: f ? `Review ${((E = n == null ? void 0 : n.findings) == null ? void 0 : E.length) ?? 0} findings` : "Working…", note: f ? "Next, go through each finding with the customer." : "Read-only. You can watch each check finish." })
  ] });
}
const ws = [{ v: "verified", l: "Verified", k: "v", icon: Se, on: "bg-ok text-on-color border-ok shadow-glow-emerald" }, { v: "needs-scoping", l: "Needs scoping", k: "s", icon: Dt, on: "bg-p2 text-on-color border-p2" }, { v: "rejected", l: "Rejected", k: "r", icon: Vt, on: "bg-bad text-on-color border-bad" }], dl = { "not-started": "Not started", "in-progress": "In progress", done: "Done", pending: "Pending" }, ul = (t, e) => {
  var a, r;
  if (t.ruleId === "METRIC-HIGH-CHURN") return "churn";
  const s = /^INV:label:(.+)$/.exec(t.ruleId ?? ""), n = s ? (r = (a = e == null ? void 0 : e.rows) == null ? void 0 : a.find((l) => l.name === s[1])) == null ? void 0 : r.kind : null;
  return n === "high-cardinality" || n === "churn" ? n : null;
}, jn = (t) => t.savings.kind === "units" ? `${se(t.savings.unitsPerDay)} units/day` : t.savings.kind === "needs-scoping" ? "To be sized" : t.savings.kind === "severity-only" ? "Better error signal" : "Health fix";
function hl({ run: t, runId: e, setRun: s, onBack: n, onNext: a }) {
  var A, P, M, J, F, W, we, ke, Ce, Me, me, oe, Te, j, B, Q, H, Oe, at, jt, Nt, ze, rt, lt, R, Y, z, xe, Ae, $s;
  const [r, l] = N.useState(0), [o, d] = N.useState({}), [c, m] = N.useState("all"), [f, p] = N.useState("all"), h = t.findings, x = h.filter((w) => (c === "all" || w.pillar === c) && (f === "all" || (f === "open" ? w.verifyStatus === "candidate" : w.verifyStatus === f))), u = x[Math.min(r, x.length - 1)], g = Math.max(...h.map((w) => w.savings.unitsPerDay ?? 0), 1e-4), [k, y] = N.useState(""), S = (w, K) => G(`/api/runs/${e}/findings/${encodeURIComponent(w.ruleId)}`, { method: "PATCH", body: JSON.stringify(K) }).then((_) => {
    y(""), s((ce) => ({ ...ce, findings: ce.findings.map((re) => re.ruleId === _.ruleId ? _ : re) }));
  }).catch((_) => y(`Could not save that decision: ${_.message}`));
  N.useEffect(() => {
    const w = (K) => {
      const _ = K.target.tagName;
      if (_ === "INPUT" || _ === "SELECT" || _ === "TEXTAREA") return;
      (K.key === "j" || K.key === "ArrowDown") && (K.preventDefault(), l((re) => Math.min(x.length - 1, re + 1))), (K.key === "k" || K.key === "ArrowUp") && (K.preventDefault(), l((re) => Math.max(0, re - 1)));
      const ce = ws.find((re) => re.k === K.key);
      ce && u && S(u, { verifyStatus: ce.v });
    };
    return addEventListener("keydown", w), () => removeEventListener("keydown", w);
  }, [r, t, c, f]);
  const C = h.reduce((w, K) => ({ ...w, [K.verifyStatus]: (w[K.verifyStatus] ?? 0) + 1 }), {}), I = h.length - (C.candidate ?? 0), L = u ? ve[u.pillar] : null, E = u ? As[u.phase] : null, b = (A = u == null ? void 0 : u.evidence) == null ? void 0 : A.find((w) => w.text && w.text !== "skill");
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 5, lead: "Go through each finding with the customer. Mark it Verified when they agree, Needs scoping when more information is needed, or Rejected if they rely on that data. Only Verified findings go into the customer report and the generated config." }),
    k && /* @__PURE__ */ i.jsx("div", { role: "alert", className: "mb-3 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: k }),
    ((P = t.notes) == null ? void 0 : P.length) > 0 && /* @__PURE__ */ i.jsx(He, { summary: `Checks that found no data (${t.notes.length})`, children: /* @__PURE__ */ i.jsx("ul", { className: "space-y-1 text-[13.5px] list-disc pl-5", children: t.notes.map((w) => /* @__PURE__ */ i.jsx("li", { children: w }, w)) }) }),
    ((M = t.notes) == null ? void 0 : M.length) > 0 && /* @__PURE__ */ i.jsx("div", { className: "mb-3" }),
    (J = t.eligibility) == null ? void 0 : J.map((w) => /* @__PURE__ */ i.jsxs("div", { className: "mb-3 flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: [
      /* @__PURE__ */ i.jsx(le, { size: 16, className: "mt-0.5 shrink-0" }),
      w
    ] }, w)),
    /* @__PURE__ */ i.jsx(Si, { baseline: Ws(t), findings: h }),
    (((W = (F = t.usage) == null ? void 0 : F.days) == null ? void 0 : W.length) > 0 || ((ke = (we = t.labelInventory) == null ? void 0 : we.rows) == null ? void 0 : ke.length) > 0) && /* @__PURE__ */ i.jsxs("div", { className: v("mt-4 grid items-start gap-4", ((Me = (Ce = t.usage) == null ? void 0 : Ce.days) == null ? void 0 : Me.length) > 0 && ((oe = (me = t.labelInventory) == null ? void 0 : me.rows) == null ? void 0 : oe.length) > 0 && "2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"), children: [
      /* @__PURE__ */ i.jsx(Jr, { run: t }),
      ((j = (Te = t.labelInventory) == null ? void 0 : Te.rows) == null ? void 0 : j.length) > 0 && /* @__PURE__ */ i.jsx(Yr, { inventory: t.labelInventory })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2 text-[13px]", children: [
      /* @__PURE__ */ i.jsxs("span", { className: "mr-1 font-medium", children: [
        /* @__PURE__ */ i.jsx("span", { className: "tabnum", children: I }),
        " of ",
        h.length,
        " reviewed"
      ] }),
      /* @__PURE__ */ i.jsxs("span", { className: "text-ok", children: [
        C.verified ?? 0,
        " verified"
      ] }),
      /* @__PURE__ */ i.jsxs("span", { className: "text-p2", children: [
        C["needs-scoping"] ?? 0,
        " need scoping"
      ] }),
      /* @__PURE__ */ i.jsxs("span", { className: "text-bad", children: [
        C.rejected ?? 0,
        " rejected"
      ] }),
      /* @__PURE__ */ i.jsxs("span", { className: "ml-auto flex flex-wrap gap-1.5", children: [
        ["all", "universal", "logs", "traces", "metrics"].map((w) => /* @__PURE__ */ i.jsx("button", { "aria-pressed": c === w, onClick: () => {
          m(w), l(0);
        }, className: v("rounded-full border px-3 py-1", c === w ? "border-refract bg-refract text-on-refract shadow-glow-cyan" : "border-line bg-surface/70 hover:border-line-strong"), children: w === "all" ? "All pillars" : ve[w].name }, w)),
        /* @__PURE__ */ i.jsxs("select", { "aria-label": "Filter by status", value: f, onChange: (w) => {
          p(w.target.value), l(0);
        }, className: "rounded-full border border-line bg-surface/70 px-3 py-1", children: [
          /* @__PURE__ */ i.jsx("option", { value: "all", children: "Any status" }),
          /* @__PURE__ */ i.jsx("option", { value: "open", children: "To review" }),
          /* @__PURE__ */ i.jsx("option", { value: "verified", children: "Verified" }),
          /* @__PURE__ */ i.jsx("option", { value: "needs-scoping", children: "Needs scoping" }),
          /* @__PURE__ */ i.jsx("option", { value: "rejected", children: "Rejected" })
        ] })
      ] })
    ] }),
    h.length ? /* @__PURE__ */ i.jsxs("div", { className: "mt-3 grid lg:grid-cols-[380px_1fr] gap-4 items-start", children: [
      /* @__PURE__ */ i.jsxs("ol", { className: "card overflow-hidden lg:sticky lg:top-4 max-h-[70vh] overflow-y-auto", "aria-label": "Findings", children: [
        x.map((w, K) => {
          const _ = ve[w.pillar], ce = ws.find((re) => re.v === w.verifyStatus);
          return /* @__PURE__ */ i.jsx("li", { children: /* @__PURE__ */ i.jsxs("button", { onClick: () => l(K), "aria-current": K === r, className: v("w-full text-left flex gap-3 px-3.5 py-3 border-b border-line", K === r ? "bg-refract-soft/80 shadow-[inset_2px_0_0_var(--refract)]" : "hover:bg-sunk"), children: [
            /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: v("w-1 self-stretch rounded-full", _.bg) }),
            /* @__PURE__ */ i.jsxs("span", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-2 text-[12px] text-mute", children: [
                /* @__PURE__ */ i.jsx("span", { className: "tabnum", children: w.id }),
                /* @__PURE__ */ i.jsxs("span", { className: As[w.phase].cls, children: [
                  "Phase ",
                  w.phase
                ] }),
                w.priority === "high" && /* @__PURE__ */ i.jsx(an, { size: 13, className: "text-warn", "aria-label": "Protected label" }),
                w.source === "investigate" && /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1 text-prism", children: [
                  /* @__PURE__ */ i.jsx(Rt, { size: 12, "aria-hidden": !0 }),
                  "Live data"
                ] }),
                (() => {
                  const re = ul(w, t.labelInventory);
                  return re ? /* @__PURE__ */ i.jsxs("span", { className: v("inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[11px] font-medium", re === "churn" ? "border-warn/40 bg-warn/10 text-warn" : "border-bad/40 bg-bad/10 text-bad"), children: [
                    /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0, className: "pulse-dot !h-1.5 !w-1.5" }),
                    re === "churn" ? "Churn" : "High cardinality"
                  ] }) : null;
                })()
              ] }),
              /* @__PURE__ */ i.jsx("span", { className: "block text-[14px] font-medium leading-snug mt-0.5", children: w.title }),
              /* @__PURE__ */ i.jsxs("span", { className: "mt-1.5 flex items-center gap-2", children: [
                /* @__PURE__ */ i.jsx("span", { className: "h-1.5 flex-1 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ i.jsx("span", { className: v("block h-full rounded-full", _.bg), style: { width: `${(w.savings.unitsPerDay ?? 0) / g * 100}%` } }) }),
                /* @__PURE__ */ i.jsx("span", { className: "text-[12px] tabnum text-mute w-24 text-right", children: jn(w) })
              ] })
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "mt-0.5", children: ce ? /* @__PURE__ */ i.jsx(ce.icon, { size: 17, className: w.verifyStatus === "verified" ? "text-ok" : w.verifyStatus === "rejected" ? "text-bad" : "text-p2", "aria-label": ce.l }) : /* @__PURE__ */ i.jsx("span", { className: "block h-[17px] w-[17px] rounded-full border-2 border-line", "aria-label": "To review" }) })
          ] }) }, w.ruleId);
        }),
        !x.length && /* @__PURE__ */ i.jsx("li", { className: "px-4 py-6 text-[13.5px] text-mute", children: "No findings match these filters." })
      ] }),
      u && L && E && /* @__PURE__ */ i.jsxs("article", { className: "card overflow-hidden", "aria-label": u.title, children: [
        u.priority === "high" && /* @__PURE__ */ i.jsxs("div", { role: "alert", className: "flex gap-2 bg-warnbg px-5 py-2.5 text-[13.5px] text-warn font-medium", children: [
          /* @__PURE__ */ i.jsx(an, { size: 16, className: "mt-0.5" }),
          "Protected label warning: Infrastructure Explorer depends on these attributes."
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "px-6 pt-5 pb-6", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ i.jsxs("span", { className: v("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12.5px] font-medium text-on-color", L.bg), children: [
              /* @__PURE__ */ i.jsx(L.icon, { size: 13 }),
              L.name
            ] }),
            /* @__PURE__ */ i.jsxs("span", { className: v("rounded-md px-2 py-0.5 text-[12.5px] font-medium", E.soft, E.cls), children: [
              "Phase ",
              u.phase,
              ": ",
              E.name
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "text-[12.5px] text-mute tabnum", children: u.id }),
            u.source === "investigate" && /* @__PURE__ */ i.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-prism/10 px-2 py-0.5 text-[12.5px] font-medium text-prism", children: [
              /* @__PURE__ */ i.jsx(Rt, { size: 13 }),
              "Found in live data"
            ] })
          ] }),
          /* @__PURE__ */ i.jsx("h2", { className: "mt-2 font-display text-[22px] font-semibold tracking-[-0.01em] leading-snug", children: u.title }),
          /* @__PURE__ */ i.jsxs("div", { className: "mt-4 grid sm:grid-cols-3 gap-px rounded-lg overflow-hidden bg-line border border-line text-[13px]", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ i.jsx("p", { className: "text-mute", children: "Estimated impact" }),
              /* @__PURE__ */ i.jsx("p", { className: "mt-0.5 text-[17px] font-semibold tabnum", children: jn(u) })
            ] }),
            /* @__PURE__ */ i.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ i.jsx("p", { className: "text-mute", children: "Effort" }),
              /* @__PURE__ */ i.jsx("p", { className: "mt-0.5 text-[15px] font-medium capitalize", children: u.effort.replace("-", " to ") })
            ] }),
            /* @__PURE__ */ i.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ i.jsx("p", { className: "text-mute", children: "Who makes the change" }),
              /* @__PURE__ */ i.jsx("p", { className: "mt-0.5 text-[15px] font-medium", children: u.owner })
            ] })
          ] }),
          /* @__PURE__ */ i.jsx("h3", { className: "mt-5 text-[14px] font-semibold", children: "What’s happening" }),
          /* @__PURE__ */ i.jsx("p", { className: "mt-1 text-[15px] leading-relaxed max-w-[70ch]", children: u.plain }),
          u.observedVolume && /* @__PURE__ */ i.jsxs("p", { className: "mt-2 text-[13.5px] text-mute", children: [
            "Seen in the data: ",
            u.observedVolume
          ] }),
          ((H = (Q = (B = u.display) == null ? void 0 : B.samples) == null ? void 0 : Q.items) == null ? void 0 : H.length) > 0 && /* @__PURE__ */ i.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ i.jsxs("h3", { className: "text-[14px] font-semibold", children: [
              u.display.samples.label,
              u.display.samples.items.some((w) => w.after !== void 0) && ": before and after the change"
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: "mt-2 space-y-2", children: u.display.samples.items.slice(0, 3).map((w, K) => /* @__PURE__ */ i.jsxs("div", { className: v("grid gap-px rounded-lg overflow-hidden border border-line bg-line", w.after !== void 0 && "md:grid-cols-2"), children: [
              /* @__PURE__ */ i.jsxs("pre", { className: v("p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto", w.after !== void 0 ? "diff-del" : "bg-sunk"), children: [
                /* @__PURE__ */ i.jsx("span", { className: v("block text-[11px] font-sans font-semibold mb-1", w.after !== void 0 ? "text-bad" : "text-mute"), children: w.after !== void 0 ? "Before" : `Sample ${K + 1}` }),
                w.before
              ] }),
              w.after !== void 0 && /* @__PURE__ */ i.jsxs("pre", { className: "diff-add p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto", children: [
                /* @__PURE__ */ i.jsx("span", { className: "block text-[11px] font-sans font-semibold text-ok mb-1", children: "After" }),
                w.after
              ] })
            ] }, K)) }),
            u.display.samples.afterNote && /* @__PURE__ */ i.jsx("p", { className: "mt-1.5 text-[12.5px] text-mute", children: u.display.samples.afterNote })
          ] }),
          u.source === "investigate" && ((jt = (at = (Oe = u.display) == null ? void 0 : Oe.bars) == null ? void 0 : at.items) == null ? void 0 : jt.length) > 0 && /* @__PURE__ */ i.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ i.jsx("h3", { className: "text-[14px] font-semibold", children: u.display.bars.label }),
            /* @__PURE__ */ i.jsx("ul", { className: "mt-2 space-y-1.5", children: u.display.bars.items.map((w) => {
              const K = Math.max(...u.display.bars.items.map((_) => _.value), 1e-9);
              return /* @__PURE__ */ i.jsxs("li", { className: "grid grid-cols-[minmax(120px,220px)_1fr_auto] items-center gap-3 text-[13px]", children: [
                /* @__PURE__ */ i.jsx("span", { className: "font-mono text-[12px] truncate syn-key", title: w.name, children: w.name }),
                /* @__PURE__ */ i.jsx("span", { className: "h-2 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ i.jsx("span", { className: "block h-full rounded-full bg-[linear-gradient(90deg,#06B6D4,#A855F7)]", style: { width: `${w.value / K * 100}%` } }) }),
                /* @__PURE__ */ i.jsx("span", { className: "text-[12.5px]", children: /* @__PURE__ */ i.jsx(We, { v: w.text }) })
              ] }, w.name);
            }) })
          ] }),
          u.source === "investigate" && ((rt = (ze = (Nt = u.display) == null ? void 0 : Nt.table) == null ? void 0 : ze.rows) == null ? void 0 : rt.length) > 0 && /* @__PURE__ */ i.jsx("div", { className: "mt-4 overflow-x-auto rounded-lg border border-line", children: /* @__PURE__ */ i.jsxs("table", { className: "w-full text-[12.5px]", children: [
            /* @__PURE__ */ i.jsx("caption", { className: "text-left px-3 py-2 font-semibold text-[13.5px] bg-sunk/70", children: u.display.table.summary }),
            /* @__PURE__ */ i.jsx("thead", { className: "text-mute", children: /* @__PURE__ */ i.jsx("tr", { children: u.display.table.headers.map((w) => /* @__PURE__ */ i.jsx("th", { className: "text-left px-3 py-1.5 font-medium", children: w }, w)) }) }),
            /* @__PURE__ */ i.jsx("tbody", { children: u.display.table.rows.map((w, K) => /* @__PURE__ */ i.jsx("tr", { className: "border-t border-line", children: w.map((_, ce) => /* @__PURE__ */ i.jsx("td", { className: "px-3 py-1.5 tabnum", children: /* @__PURE__ */ i.jsx(We, { v: _, as: ce === 0 ? "key" : "auto" }) }, ce)) }, K)) })
          ] }) }),
          ((lt = u.display) == null ? void 0 : lt.validation) && /* @__PURE__ */ i.jsxs("div", { className: v("mt-4 rounded-lg px-4 py-3 text-[13.5px]", u.display.validation.ok ? "bg-ok/10" : "bg-warnbg"), children: [
            /* @__PURE__ */ i.jsxs("p", { className: v("font-semibold flex items-center gap-1.5", u.display.validation.ok ? "text-ok" : "text-warn"), children: [
              u.display.validation.ok ? /* @__PURE__ */ i.jsx(Se, { size: 15 }) : /* @__PURE__ */ i.jsx(le, { size: 15 }),
              u.display.validation.ok ? "Validated against live data" : "Not validated"
            ] }),
            /* @__PURE__ */ i.jsx("p", { className: "mt-1", children: u.display.validation.result }),
            /* @__PURE__ */ i.jsx("code", { className: "mt-1.5 block rounded-md bg-sunk/70 px-2 py-1 font-mono text-[11.5px] syn-key break-all", children: u.display.validation.query })
          ] }),
          ((Y = (R = u.display) == null ? void 0 : R.impact) == null ? void 0 : Y.length) > 0 && /* @__PURE__ */ i.jsx("div", { className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-line bg-line", children: u.display.impact.map((w, K) => /* @__PURE__ */ i.jsxs("div", { className: "bg-surface px-3 py-2.5", children: [
            /* @__PURE__ */ i.jsx("p", { className: "text-[12px] text-mute", children: w.label }),
            /* @__PURE__ */ i.jsx("p", { className: v("text-[14.5px] font-semibold tabnum", K === u.display.impact.length - 1 && "text-ok"), children: w.value })
          ] }, K)) }),
          u.source === "investigate" && ((z = u.change) == null ? void 0 : z.snippet) && /* @__PURE__ */ i.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ i.jsx("h3", { className: "text-[14px] font-semibold", children: u.change.snippet.startsWith("#") ? "Change at the source" : "Proposed transform" }),
            /* @__PURE__ */ i.jsx(ps, { className: "mt-2", code: u.change.snippet, lang: u.change.snippet.startsWith("#") ? "text" : "yaml", fileName: `${u.id}-change`, label: "Proposed transform" })
          ] }),
          /* @__PURE__ */ i.jsx("h3", { className: "mt-5 text-[14px] font-semibold", children: "What to do" }),
          /* @__PURE__ */ i.jsx("p", { className: "mt-1 text-[15px] leading-relaxed max-w-[70ch]", children: u.nextStep }),
          !!u.verifyChecklist.length && /* @__PURE__ */ i.jsxs("div", { className: "mt-5 rounded-lg bg-sunk px-4 py-3.5", children: [
            /* @__PURE__ */ i.jsxs("h3", { className: "text-[14px] font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ i.jsx(ba, { size: 16 }),
              "Verify with the customer"
            ] }),
            u.verifyChecklist.map((w) => {
              const K = u.ruleId + w;
              return /* @__PURE__ */ i.jsxs("label", { className: "flex gap-2.5 items-start text-[14px] py-1", children: [
                /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: !!o[K], onChange: (_) => d({ ...o, [K]: _.target.checked }) }),
                w
              ] }, K);
            })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [
            ws.map((w) => /* @__PURE__ */ i.jsxs("button", { "aria-pressed": u.verifyStatus === w.v, onClick: () => S(u, { verifyStatus: w.v }), className: v("inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[14px] font-medium", u.verifyStatus === w.v ? w.on : "border-line-strong/70 hover:bg-sunk"), children: [
              /* @__PURE__ */ i.jsx(w.icon, { size: 16 }),
              w.l,
              /* @__PURE__ */ i.jsx("kbd", { className: "ml-1 text-mute", children: w.k })
            ] }, w.v)),
            /* @__PURE__ */ i.jsxs("label", { className: "ml-auto flex items-center gap-2 text-[13px] text-mute", children: [
              "Progress",
              /* @__PURE__ */ i.jsx("select", { className: "rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px] text-ink", value: u.progress, onChange: (w) => S(u, { progress: w.target.value }), children: Object.entries(dl).map(([w, K]) => /* @__PURE__ */ i.jsx("option", { value: w, children: K }, w)) })
            ] })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "mt-6 space-y-2", children: [
            (u.detail || u.caveats.length > 0) && /* @__PURE__ */ i.jsxs(He, { summary: "Details and caveats", children: [
              u.detail && /* @__PURE__ */ i.jsx("p", { className: "whitespace-pre-wrap text-[13.5px] leading-relaxed", children: u.detail }),
              u.caveats.map((w) => /* @__PURE__ */ i.jsxs("p", { className: "mt-2 text-[13.5px] flex gap-2", children: [
                /* @__PURE__ */ i.jsx(le, { size: 14, className: "mt-0.5 shrink-0 text-p2" }),
                w
              ] }, w))
            ] }),
            /* @__PURE__ */ i.jsxs(He, { summary: "How the estimate was worked out", children: [
              /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] leading-relaxed", children: u.savings.basis }),
              b && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
                /* @__PURE__ */ i.jsxs("p", { className: "mt-3 text-[12.5px] text-mute", children: [
                  "Discovery query, ",
                  b.start ? `run over ${Gt(b.start)} to ${Gt(b.end)}` : `last ${b.window}`,
                  b.error ? "" : `, ${((xe = b.rows) == null ? void 0 : xe.length) ?? 0} rows`
                ] }),
                /* @__PURE__ */ i.jsx(ps, { className: "mt-1", code: b.text, lang: "text", maxH: "max-h-56", label: "Discovery query" }),
                b.error && /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-bad mt-1", children: b.error.slice(0, 200) })
              ] })
            ] }),
            ((Ae = u.change) == null ? void 0 : Ae.snippet) && /* @__PURE__ */ i.jsx(He, { summary: "Proposed config change", children: /* @__PURE__ */ i.jsx(ps, { code: u.change.snippet, fileName: `${u.id}-config`, label: "Proposed config change" }) }),
            /* @__PURE__ */ i.jsx(He, { summary: `Sources (${u.sources.length})`, children: /* @__PURE__ */ i.jsx("ul", { className: "text-[13.5px] space-y-1", children: u.sources.map((w, K) => /* @__PURE__ */ i.jsxs("li", { children: [
              w.url ? /* @__PURE__ */ i.jsx("a", { className: "text-refract hover:underline", href: w.url, target: "_blank", rel: "noreferrer", children: w.title }) : w.title,
              w.internal && /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: " (internal)" })
            ] }, K)) }) })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ i.jsx("div", { className: "mt-4", children: /* @__PURE__ */ i.jsx(vi, { title: "No findings: this environment already follows the playbook for the selected pillars.", next: "Try adding a config or more pillars." }) }),
    !!(($s = t.gaps) != null && $s.length) && /* @__PURE__ */ i.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ i.jsxs("h2", { className: "text-[17px] font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ i.jsx(Fn, { size: 17, className: "text-prism" }),
        "Where freed quota could go"
      ] }),
      /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: "Adoption gaps and expansion ideas. These are not savings." }),
      /* @__PURE__ */ i.jsx("ul", { className: "mt-3 grid sm:grid-cols-2 gap-3", children: t.gaps.map((w) => /* @__PURE__ */ i.jsxs("li", { className: "card px-4 py-3", children: [
        /* @__PURE__ */ i.jsx("p", { className: "text-[14.5px] font-semibold", children: w.area }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] text-mute mt-0.5", children: w.detail }),
        /* @__PURE__ */ i.jsx("p", { className: "text-[13.5px] mt-1.5", children: w.opportunity })
      ] }, w.area)) })
    ] }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: n, next: a, nextLabel: "Continue to remediation", note: /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      "Keys: ",
      /* @__PURE__ */ i.jsx("kbd", { children: "j" }),
      " ",
      /* @__PURE__ */ i.jsx("kbd", { children: "k" }),
      " move, ",
      /* @__PURE__ */ i.jsx("kbd", { children: "v" }),
      " verified, ",
      /* @__PURE__ */ i.jsx("kbd", { children: "s" }),
      " needs scoping, ",
      /* @__PURE__ */ i.jsx("kbd", { children: "r" }),
      " rejected."
    ] }) })
  ] });
}
const fl = {
  "report.customer.html": ["customer", "Customer report, ready to share or print to PDF"],
  "report.customer.md": ["customer", "Customer report as Markdown"],
  "report.json": ["customer", "Customer report data (JSON Schema 1.0)"],
  "report.internal.html": ["tam", "Internal report with queries, evidence and sources"],
  "report.internal.md": ["tam", "Internal report as Markdown"],
  "report.internal.json": ["tam", "Internal report data"],
  "optimized-config.yaml": ["config", "Their config on the current version, with Verified changes"],
  "optimized-config.diff": ["config", "What changed, line by line"],
  "original-config.yaml": ["config", "Backup of the config you added"],
  "upgraded-config.yaml": ["config", "Config moved to the latest version"],
  "upgraded-config.diff": ["config", "Changes for the upgrade"],
  "breaking-changes.md": ["config", "Every breaking change and what to do"],
  "tco-policy-drafts.json": ["tam", "TCO policy drafts (never created automatically)"]
};
function Nn(t, e) {
  const s = t.split("/"), n = s.at(-1), a = s.length > 1 ? `${de[{ kubernetes: "helm" }[s[0]] ?? s[0]] ?? s[0]}: ` : "", r = ml(n, e);
  return [r[0], a + r[1]];
}
function ml(t, e) {
  if (e) {
    if (t === e.customerHtml) return ["customer", "Customer report, ready to share or print to PDF"];
    if (t === e.customerMd) return ["customer", "Customer report as Markdown"];
    if (t === e.customerJson) return ["customer", "Customer report data (JSON Schema 1.0)"];
    if (t === e.internalHtml) return ["tam", "Internal report with queries, evidence and sources"];
    if (t === e.internalMd) return ["tam", "Internal report as Markdown"];
    if (t === e.internalJson) return ["tam", "Internal report data"];
  }
  return fl[t] ?? (t.endsWith(".csv") ? ["tam", "Metrics Label Analyzer export"] : ["tam", "Data export"]);
}
function pl({ run: t, runId: e, onBack: s, onRestart: n }) {
  var ke, Ce, Me, me, oe, Te;
  const [a, r] = N.useState(""), l = (j) => {
    var B;
    r(j ? "draft" : "final"), A(""), Na(`/api/runs/${e}/bundle`, { draft: j }, `${((B = t.customer) == null ? void 0 : B.name) || "report"}${j ? " (draft)" : ""}.zip`).catch((Q) => A(Q.message)).finally(() => r(""));
  }, [o, d] = N.useState("plan"), [c, m] = N.useState(null), [f, p] = N.useState(t.findings.filter((j) => {
    var B, Q;
    return j.verifyStatus === "verified" && ((Q = (B = j.change) == null ? void 0 : B.ops) == null ? void 0 : Q.length);
  }).map((j) => j.ruleId)), h = (ke = t.deployments) != null && ke.length ? t.deployments : [t.deployment], [x, u] = N.useState(h[0]), [g, k] = N.useState(null), [y, S] = N.useState(null), [C, I] = N.useState(!1), [L, E] = N.useState(!1), [b, A] = N.useState("");
  N.useEffect(() => {
    G(`/api/runs/${e}/report?audience=internal`).then(m);
  }, [e]), N.useEffect(() => {
    G(`/api/runs/${e}/preview`, { method: "POST", body: JSON.stringify({ selected: f, deployment: x }) }).then(k).catch((j) => k({ error: j.message }));
  }, [f.join(), x]);
  const P = t.findings.filter((j) => {
    var B, Q;
    return (Q = (B = j.change) == null ? void 0 : B.ops) == null ? void 0 : Q.length;
  }), M = () => {
    E(!0), A(""), G(`/api/runs/${e}/outputs`, { method: "POST", body: JSON.stringify({ allowDraft: C }) }).then(S).catch((j) => A(j.message)).finally(() => E(!1));
  };
  if (!c) return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 6, lead: "Building the roadmap from the findings you verified…" }),
    /* @__PURE__ */ i.jsx("div", { className: "grid md:grid-cols-3 gap-4", role: "progressbar", "aria-busy": "true", "aria-label": "Building the roadmap", children: [1, 2, 3].map((j) => /* @__PURE__ */ i.jsxs("div", { className: "card p-5 space-y-3", children: [
      /* @__PURE__ */ i.jsx(ye, { className: "h-3 w-16" }),
      /* @__PURE__ */ i.jsx(ye, { className: "h-5 w-40" }),
      /* @__PURE__ */ i.jsx(ye, { className: "h-8 w-28" }),
      /* @__PURE__ */ i.jsx(rs, { rows: 3, label: "" })
    ] }, j)) })
  ] });
  const J = ((Ce = g == null ? void 0 : g.rows) == null ? void 0 : Ce.filter((j) => j.kind !== "same").length) ?? 0, F = c.summary.currentUnitsPerDay, W = [["plan", "Phased roadmap"], ["config", "Config changes"], ...c.upgrade ? [["upgrade", "Upgrade"]] : [], ["export", "Export"]], we = t.findings.filter((j) => j.verifyStatus === "verified").length;
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(Le, { step: 6, lead: "Here is the plan. Changes are grouped by effort, so the team can start with quick, config-only wins while bigger changes are scheduled. Then review the config changes and export the reports." }),
    /* @__PURE__ */ i.jsx(Si, { baseline: Ws(t), findings: t.findings, compact: !0 }),
    /* @__PURE__ */ i.jsx("div", { role: "tablist", "aria-label": "Remediation", className: "mt-6 inline-flex gap-1 rounded-full border border-line bg-surface/70 p-1", children: W.map(([j, B]) => /* @__PURE__ */ i.jsx("button", { role: "tab", "aria-selected": o === j, onClick: () => d(j), className: v("rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-all", o === j ? "bg-refract text-on-refract shadow-glow-cyan" : "text-mute hover:text-ink"), children: B }, j)) }),
    /* @__PURE__ */ i.jsxs("div", { className: "mt-6", children: [
      o === "plan" && /* @__PURE__ */ i.jsxs("section", { "aria-label": "Phased roadmap", children: [
        /* @__PURE__ */ i.jsx("h2", { className: "sr-only", children: "Phased roadmap" }),
        /* @__PURE__ */ i.jsx("ol", { className: "grid md:grid-cols-3 gap-4", children: c.roadmap.map((j) => {
          const B = As[j.phase], Q = c.findings.filter((H) => H.phase === j.phase);
          return /* @__PURE__ */ i.jsxs("li", { className: "card overflow-hidden", children: [
            /* @__PURE__ */ i.jsx("div", { className: v("h-1.5", B.bg) }),
            /* @__PURE__ */ i.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ i.jsxs("p", { className: v("text-[13px] font-semibold", B.cls), children: [
                "Phase ",
                j.phase
              ] }),
              /* @__PURE__ */ i.jsx("p", { className: "text-[18px] font-semibold mt-0.5", children: B.name }),
              /* @__PURE__ */ i.jsxs("p", { className: "text-[13px] text-mute", children: [
                B.long,
                ". Usually ",
                B.when.toLowerCase(),
                "."
              ] }),
              /* @__PURE__ */ i.jsx("p", { className: "mt-4 text-[13px] text-mute", children: "Total saved after this phase" }),
              /* @__PURE__ */ i.jsxs("p", { className: "font-display text-[26px] font-semibold tabnum leading-tight", children: [
                se(j.cumulativeUnitsPerDay),
                /* @__PURE__ */ i.jsx("span", { className: "text-[13px] font-normal text-mute", children: " units/day" })
              ] }),
              F && /* @__PURE__ */ i.jsx("div", { className: "mt-2 h-1.5 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ i.jsx("div", { className: v("h-full", B.bg), style: { width: `${Math.min(100, j.cumulativeUnitsPerDay / F * 100)}%` } }) }),
              /* @__PURE__ */ i.jsx("ul", { className: "mt-4 space-y-1.5 text-[13.5px]", children: Q.length ? Q.map((H) => /* @__PURE__ */ i.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ i.jsx("span", { className: v("mt-1.5 h-2 w-2 rounded-full shrink-0", ve[H.pillar].bg) }),
                /* @__PURE__ */ i.jsx("span", { className: "flex-1", children: H.title }),
                /* @__PURE__ */ i.jsx("span", { className: "tabnum text-mute text-[12.5px]", children: H.savings.kind === "units" ? se(H.savings.unitsPerDay) : "—" })
              ] }, H.id)) : /* @__PURE__ */ i.jsx("li", { className: "text-mute", children: "Nothing in this phase." }) })
            ] })
          ] }, j.phase);
        }) }),
        c.combined.largest && /* @__PURE__ */ i.jsxs("p", { className: "mt-4 text-[14px] max-w-[80ch]", children: [
          "The largest single saving is ",
          /* @__PURE__ */ i.jsx("b", { children: c.combined.largest.title.toLowerCase() }),
          " (",
          se(c.combined.largest.unitsPerDay),
          " units/day)",
          (() => {
            var B;
            const j = (B = c.findings.find((Q) => Q.id === c.combined.largest.id)) == null ? void 0 : B.phase;
            return j > 1 ? `, and it sits in Phase ${j} because it needs more coordination, not because it matters less.` : ".";
          })(),
          " Start Phase 1 now: those changes carry almost no risk."
        ] }),
        c.overlaps.map((j) => /* @__PURE__ */ i.jsxs("p", { className: "mt-3 flex gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-[13.5px]", children: [
          /* @__PURE__ */ i.jsx(le, { size: 16, className: "mt-0.5 shrink-0 text-p2" }),
          j.note
        ] }, j.ids.join())),
        ((Me = c.trend) == null ? void 0 : Me.length) > 1 && /* @__PURE__ */ i.jsx(gl, { trend: c.trend })
      ] }),
      o === "config" && /* @__PURE__ */ i.jsxs("section", { children: [
        /* @__PURE__ */ i.jsxs("p", { className: "text-[14px] text-mute max-w-[70ch]", children: [
          "Tick a finding to see its change. Verified findings are ticked for you. The ",
          /* @__PURE__ */ i.jsx(Kr, { t: "protected labels" }),
          " check runs on every preview, and the customer’s comments and structure are kept."
        ] }),
        P.length ? /* @__PURE__ */ i.jsx("div", { className: "flex flex-wrap gap-2 my-4", children: P.map((j) => /* @__PURE__ */ i.jsxs("label", { className: v("flex gap-2 items-center rounded-lg border px-3 py-1.5 text-[13.5px] cursor-pointer", f.includes(j.ruleId) ? "border-refract bg-refract-soft" : "border-line bg-surface"), children: [
          /* @__PURE__ */ i.jsx("input", { type: "checkbox", checked: f.includes(j.ruleId), onChange: (B) => p(B.target.checked ? [...f, j.ruleId] : f.filter((Q) => Q !== j.ruleId)) }),
          /* @__PURE__ */ i.jsx("span", { className: v("h-2 w-2 rounded-full", ve[j.pillar].bg) }),
          j.title,
          j.verifyStatus !== "verified" && /* @__PURE__ */ i.jsx("span", { className: "text-mute", children: "(not verified)" })
        ] }, j.ruleId)) }) : /* @__PURE__ */ i.jsx("div", { className: "mt-4", children: /* @__PURE__ */ i.jsx(vi, { title: "No findings carry config changes." }) }),
        h.length > 1 && /* @__PURE__ */ i.jsx("div", { role: "radiogroup", "aria-label": "Deployment type", className: "mb-3 inline-flex rounded-lg border border-line bg-sunk p-1 gap-1", children: h.map((j) => {
          var B, Q, H, Oe;
          return /* @__PURE__ */ i.jsxs("button", { role: "radio", "aria-checked": x === j, onClick: () => u(j), className: v("rounded-md px-3 py-1.5 text-[13.5px] font-medium", x === j ? "bg-raised shadow-sm ring-1 ring-refract/40" : "text-mute"), children: [
            de[j],
            ((Q = (B = t.configs) == null ? void 0 : B[j]) == null ? void 0 : Q.format) === "empty" || !((Oe = (H = t.configs) == null ? void 0 : H[j]) != null && Oe.text) ? " (snippets)" : ""
          ] }, j);
        }) }),
        (g == null ? void 0 : g.error) && /* @__PURE__ */ i.jsx("p", { className: "text-bad text-[13.5px]", children: g.error }),
        (me = g == null ? void 0 : g.notes) == null ? void 0 : me.map((j) => /* @__PURE__ */ i.jsxs("p", { className: "mb-2 flex gap-2 text-[13.5px] text-warn", children: [
          /* @__PURE__ */ i.jsx(le, { size: 15, className: "mt-0.5 shrink-0" }),
          j
        ] }, j)),
        (g == null ? void 0 : g.rows) && /* @__PURE__ */ i.jsx(Vr, { rows: g.rows, changed: J, fileBase: h.length > 1 ? `${de[x].toLowerCase()}-optimized-config` : "optimized-config" })
      ] }),
      o === "upgrade" && c.upgrade && /* @__PURE__ */ i.jsxs("section", { children: [
        /* @__PURE__ */ i.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ i.jsx(ms, { label: "Moving to", value: /* @__PURE__ */ i.jsxs("span", { className: "text-[18px]", children: [
            c.upgrade.to.chart ? `Chart ${c.upgrade.to.chart}, ` : "",
            "collector ",
            c.upgrade.to.collector
          ] }), hint: `From ${c.upgrade.from.chart ? `chart ${c.upgrade.from.chart}, ` : ""}collector ${c.upgrade.from.collector ?? "unknown"}` }),
          /* @__PURE__ */ i.jsx(ms, { label: "Fixed automatically", value: c.versionStatus.autoFixed, tone: "ok", hint: "Renamed keys, moved settings, removed options" }),
          /* @__PURE__ */ i.jsx(ms, { label: "Need a decision", value: c.versionStatus.manual, tone: "prism", hint: "Explained in plain English below" })
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "mt-4 overflow-x-auto card", children: /* @__PURE__ */ i.jsxs("table", { className: "w-full text-[13px]", children: [
          /* @__PURE__ */ i.jsx("thead", { className: "bg-sunk text-mute text-left", children: /* @__PURE__ */ i.jsxs("tr", { children: [
            /* @__PURE__ */ i.jsx("th", { className: "px-4 py-2 font-medium", children: "Version" }),
            /* @__PURE__ */ i.jsx("th", { className: "px-4 font-medium", children: "Component" }),
            /* @__PURE__ */ i.jsx("th", { className: "px-4 font-medium", children: "What changed" }),
            /* @__PURE__ */ i.jsx("th", { className: "px-4 font-medium", children: "Status" })
          ] }) }),
          /* @__PURE__ */ i.jsx("tbody", { children: c.upgrade.changes.map((j, B) => /* @__PURE__ */ i.jsxs("tr", { className: "border-t border-line align-top", children: [
            /* @__PURE__ */ i.jsx("td", { className: "px-4 py-2.5 tabnum", children: j.version }),
            /* @__PURE__ */ i.jsx("td", { className: "px-4 py-2.5", children: j.component }),
            /* @__PURE__ */ i.jsxs("td", { className: "px-4 py-2.5 max-w-[60ch]", children: [
              j.what,
              j.explanation && /* @__PURE__ */ i.jsx("span", { className: "block text-mute mt-0.5", children: j.explanation })
            ] }),
            /* @__PURE__ */ i.jsx("td", { className: "px-4 py-2.5 whitespace-nowrap", children: j.status === "Auto-fixed" ? /* @__PURE__ */ i.jsx(te, { tone: "ok", children: "Fixed" }) : j.status === "Not applicable" ? /* @__PURE__ */ i.jsx(te, { children: "Not needed" }) : /* @__PURE__ */ i.jsx(te, { tone: "warn", children: "Decide" }) })
          ] }, B)) })
        ] }) }),
        /* @__PURE__ */ i.jsx("h3", { className: "mt-6 text-[15px] font-semibold", children: "How to upgrade safely" }),
        /* @__PURE__ */ i.jsx("ol", { className: "mt-2 list-decimal pl-5 space-y-1 text-[14px]", children: c.upgrade.steps.map((j) => /* @__PURE__ */ i.jsx("li", { children: j }, j)) })
      ] }),
      o === "export" && /* @__PURE__ */ i.jsxs("section", { children: [
        /* @__PURE__ */ i.jsxs("div", { className: "card p-5", children: [
          /* @__PURE__ */ i.jsxs("p", { className: "text-[14px]", children: [
            we,
            " verified finding",
            we === 1 ? "" : "s",
            " will go into the customer report and the generated config."
          ] }),
          /* @__PURE__ */ i.jsxs("label", { className: "mt-3 flex gap-2.5 items-start text-[14px]", children: [
            /* @__PURE__ */ i.jsx("input", { type: "checkbox", className: "mt-1", checked: C, onChange: (j) => I(j.target.checked) }),
            /* @__PURE__ */ i.jsx("span", { children: "Also include findings that aren’t verified yet. Outputs get a DRAFT watermark." })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ i.jsx($, { kind: "primary", size: "lg", disabled: !!a, onClick: () => l(!1), children: a === "final" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx(Ke, { size: 16, className: "animate-spin" }),
              "Preparing…"
            ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx(sn, { size: 16 }),
              "Download all reports (.zip)"
            ] }) }),
            /* @__PURE__ */ i.jsx($, { size: "lg", disabled: !!a, onClick: () => l(!0), children: a === "draft" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx(Ke, { size: 16, className: "animate-spin" }),
              "Preparing…"
            ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx(sn, { size: 16 }),
              "Download all as draft (.zip)"
            ] }) })
          ] }),
          /* @__PURE__ */ i.jsxs("p", { className: "mt-2 text-[12.5px] text-mute", children: [
            "Each zip holds every report and config, named after ",
            ((oe = t.customer) == null ? void 0 : oe.name) || "the customer",
            ". The draft version includes unverified findings and marks every report DRAFT."
          ] }),
          /* @__PURE__ */ i.jsx($, { className: "mt-4", disabled: L, onClick: M, children: L ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsx(Ke, { size: 16, className: "animate-spin" }),
            "Generating…"
          ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsx(nn, { size: 16 }),
            "Or pick individual files"
          ] }) }),
          b && /* @__PURE__ */ i.jsx("p", { className: "mt-2 text-bad text-[13.5px]", children: b })
        ] }),
        y && /* @__PURE__ */ i.jsxs("div", { className: "mt-5 space-y-4", children: [
          ((Te = y.customerIssues) == null ? void 0 : Te.length) > 0 ? /* @__PURE__ */ i.jsxs("div", { className: "flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: [
            /* @__PURE__ */ i.jsx(le, { size: 16, className: "mt-0.5" }),
            /* @__PURE__ */ i.jsxs("span", { children: [
              /* @__PURE__ */ i.jsx("b", { children: "Check before sending:" }),
              " the customer report still contains ",
              [...new Set(y.customerIssues.map((j) => j.kind))].join(", "),
              "."
            ] })
          ] }) : /* @__PURE__ */ i.jsxs("div", { className: "flex gap-2 rounded-xl bg-ok/10 px-4 py-3 text-[13.5px] text-ok", children: [
            /* @__PURE__ */ i.jsx(Se, { size: 16, className: "mt-0.5" }),
            "Customer report check passed: no internal names, links, account IDs or keys found."
          ] }),
          [["customer", "For the customer"], ["config", "Config files"], ["tam", "For you (internal)"]].map(([j, B]) => {
            const Q = Object.keys(y.files).filter((H) => Nn(H, y.reportNames)[0] === j).sort();
            return Q.length ? /* @__PURE__ */ i.jsxs("div", { children: [
              /* @__PURE__ */ i.jsx("h3", { className: "text-[14px] font-semibold mb-2", children: B }),
              /* @__PURE__ */ i.jsx("ul", { className: "grid sm:grid-cols-2 gap-2", children: Q.map((H) => /* @__PURE__ */ i.jsx("li", { children: /* @__PURE__ */ i.jsxs("button", { onClick: () => Kt(H, y.files[H]), className: "w-full flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-left hover:border-refract", children: [
                /* @__PURE__ */ i.jsx(ia, { size: 18, className: "text-refract shrink-0" }),
                /* @__PURE__ */ i.jsxs("span", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ i.jsx("span", { className: "block text-[13.5px] font-medium truncate", children: H }),
                  /* @__PURE__ */ i.jsx("span", { className: "block text-[12.5px] text-mute", children: Nn(H, y.reportNames)[1] })
                ] }),
                /* @__PURE__ */ i.jsx(nn, { size: 16, className: "text-mute", "aria-label": "Download" })
              ] }) }, H)) })
            ] }, j) : null;
          }),
          y.warnings.length > 0 && /* @__PURE__ */ i.jsx(He, { summary: `Notes (${y.warnings.length})`, children: y.warnings.map((j) => /* @__PURE__ */ i.jsx("p", { className: "text-[13px] text-mute mt-1", children: j }, j)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ i.jsx(Qe, { onBack: s, extra: /* @__PURE__ */ i.jsxs($, { onClick: n, children: [
      /* @__PURE__ */ i.jsx(Kn, { size: 15 }),
      "Start a new review"
    ] }), next: o !== "export" ? () => d(W[W.findIndex(([j]) => j === o) + 1][0]) : void 0, nextLabel: o === "plan" ? "Review config changes" : o === "config" && c.upgrade ? "Review the upgrade" : "Go to export", note: o === "export" ? "Re-run the assessment after Phase 1 to confirm the savings." : void 0 })
  ] });
}
function gl({ trend: t }) {
  const r = Math.max(...t.map((m) => m.total), 1e-3), l = (m) => 36 + m * 716 / Math.max(1, t.length - 1), o = (m) => 156 - m / r * 144, d = (m) => t.map((f, p) => `${p ? "L" : "M"}${l(p).toFixed(1)} ${o(f[m]).toFixed(1)}`).join(" "), c = [["total", "All data", "var(--ink)"], ["logs", "Logs", "var(--logs)"], ["traces", "Traces", "var(--traces)"], ["metrics", "Metrics", "var(--metrics)"]];
  return /* @__PURE__ */ i.jsxs("figure", { className: "mt-8 card p-5", children: [
    /* @__PURE__ */ i.jsxs("figcaption", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ i.jsxs("span", { className: "text-[15px] font-semibold", children: [
        "Usage, last ",
        t.length,
        " days"
      ] }),
      /* @__PURE__ */ i.jsx("span", { className: "flex gap-4 text-[12.5px] text-mute", children: c.map(([m, f, p]) => /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ i.jsx("span", { className: "h-0.5 w-4", style: { background: p } }),
        f
      ] }, m)) })
    ] }),
    /* @__PURE__ */ i.jsxs("svg", { viewBox: "0 0 760 180", className: "mt-3 w-full h-auto", role: "img", "aria-label": "Units per day over time by pillar", children: [
      [0, 0.5, 1].map((m) => /* @__PURE__ */ i.jsxs("g", { children: [
        /* @__PURE__ */ i.jsx("line", { x1: 36, x2: 752, y1: o(r * m), y2: o(r * m), stroke: "var(--line)" }),
        /* @__PURE__ */ i.jsx("text", { x: 30, y: o(r * m) + 4, textAnchor: "end", fontSize: "11", fill: "var(--mute)", children: (r * m).toFixed(1) })
      ] }, m)),
      c.map(([m, , f]) => /* @__PURE__ */ i.jsx("path", { d: d(m), fill: "none", stroke: f, strokeWidth: m === "total" ? 2.2 : 1.6, strokeLinejoin: "round" }, m)),
      /* @__PURE__ */ i.jsx("text", { x: 36, y: 174, fontSize: "11", fill: "var(--mute)", children: t[0].date.slice(0, 10) }),
      /* @__PURE__ */ i.jsx("text", { x: 752, y: 174, fontSize: "11", fill: "var(--mute)", textAnchor: "end", children: t.at(-1).date.slice(0, 10) })
    ] }),
    /* @__PURE__ */ i.jsx("p", { className: "text-[12.5px] text-mute mt-1", children: "Units per day." })
  ] });
}
export {
  bl as A,
  $ as B,
  ps as C,
  We as D,
  vi as E,
  ee as F,
  As as P,
  Jt as S,
  Kr as T,
  He as a,
  Fr as b,
  ve as c,
  yl as d,
  te as e,
  ye as f,
  rs as g,
  ms as h,
  Dr as i,
  i as j,
  Ut as k,
  v as l,
  Z as m,
  Br as n,
  N as r,
  xl as s,
  se as u
};
