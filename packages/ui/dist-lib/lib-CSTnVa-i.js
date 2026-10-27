var lt = { exports: {} }, Te = {}, it = { exports: {} }, S = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ye = Symbol.for("react.element"), Ct = Symbol.for("react.portal"), St = Symbol.for("react.fragment"), Lt = Symbol.for("react.strict_mode"), Mt = Symbol.for("react.profiler"), At = Symbol.for("react.provider"), Tt = Symbol.for("react.context"), $t = Symbol.for("react.forward_ref"), Et = Symbol.for("react.suspense"), Dt = Symbol.for("react.memo"), It = Symbol.for("react.lazy"), We = Symbol.iterator;
function Pt(t) {
  return t === null || typeof t != "object" ? null : (t = We && t[We] || t["@@iterator"], typeof t == "function" ? t : null);
}
var ot = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, ct = Object.assign, dt = {};
function ue(t, s, a) {
  this.props = t, this.context = s, this.refs = dt, this.updater = a || ot;
}
ue.prototype.isReactComponent = {};
ue.prototype.setState = function(t, s) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, s, "setState");
};
ue.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function mt() {
}
mt.prototype = ue.prototype;
function Oe(t, s, a) {
  this.props = t, this.context = s, this.refs = dt, this.updater = a || ot;
}
var Ve = Oe.prototype = new mt();
Ve.constructor = Oe;
ct(Ve, ue.prototype);
Ve.isPureReactComponent = !0;
var Ge = Array.isArray, xt = Object.prototype.hasOwnProperty, He = { current: null }, pt = { key: !0, ref: !0, __self: !0, __source: !0 };
function ht(t, s, a) {
  var i, r = {}, c = null, n = null;
  if (s != null) for (i in s.ref !== void 0 && (n = s.ref), s.key !== void 0 && (c = "" + s.key), s) xt.call(s, i) && !pt.hasOwnProperty(i) && (r[i] = s[i]);
  var o = arguments.length - 2;
  if (o === 1) r.children = a;
  else if (1 < o) {
    for (var p = Array(o), d = 0; d < o; d++) p[d] = arguments[d + 2];
    r.children = p;
  }
  if (t && t.defaultProps) for (i in o = t.defaultProps, o) r[i] === void 0 && (r[i] = o[i]);
  return { $$typeof: ye, type: t, key: c, ref: n, props: r, _owner: He.current };
}
function Rt(t, s) {
  return { $$typeof: ye, type: t.type, key: s, ref: t.ref, props: t.props, _owner: t._owner };
}
function Be(t) {
  return typeof t == "object" && t !== null && t.$$typeof === ye;
}
function Ft(t) {
  var s = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(a) {
    return s[a];
  });
}
var Ke = /\/+/g;
function De(t, s) {
  return typeof t == "object" && t !== null && t.key != null ? Ft("" + t.key) : s.toString(36);
}
function ke(t, s, a, i, r) {
  var c = typeof t;
  (c === "undefined" || c === "boolean") && (t = null);
  var n = !1;
  if (t === null) n = !0;
  else switch (c) {
    case "string":
    case "number":
      n = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case ye:
        case Ct:
          n = !0;
      }
  }
  if (n) return n = t, r = r(n), t = i === "" ? "." + De(n, 0) : i, Ge(r) ? (a = "", t != null && (a = t.replace(Ke, "$&/") + "/"), ke(r, s, a, "", function(d) {
    return d;
  })) : r != null && (Be(r) && (r = Rt(r, a + (!r.key || n && n.key === r.key ? "" : ("" + r.key).replace(Ke, "$&/") + "/") + t)), s.push(r)), 1;
  if (n = 0, i = i === "" ? "." : i + ":", Ge(t)) for (var o = 0; o < t.length; o++) {
    c = t[o];
    var p = i + De(c, o);
    n += ke(c, s, a, p, r);
  }
  else if (p = Pt(t), typeof p == "function") for (t = p.call(t), o = 0; !(c = t.next()).done; ) c = c.value, p = i + De(c, o++), n += ke(c, s, a, p, r);
  else if (c === "object") throw s = String(t), Error("Objects are not valid as a React child (found: " + (s === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : s) + "). If you meant to render a collection of children, use an array instead.");
  return n;
}
function ve(t, s, a) {
  if (t == null) return t;
  var i = [], r = 0;
  return ke(t, i, "", "", function(c) {
    return s.call(a, c, r++);
  }), i;
}
function zt(t) {
  if (t._status === -1) {
    var s = t._result;
    s = s(), s.then(function(a) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = a);
    }, function(a) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = a);
    }), t._status === -1 && (t._status = 0, t._result = s);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var q = { current: null }, we = { transition: null }, _t = { ReactCurrentDispatcher: q, ReactCurrentBatchConfig: we, ReactCurrentOwner: He };
function ut() {
  throw Error("act(...) is not supported in production builds of React.");
}
S.Children = { map: ve, forEach: function(t, s, a) {
  ve(t, function() {
    s.apply(this, arguments);
  }, a);
}, count: function(t) {
  var s = 0;
  return ve(t, function() {
    s++;
  }), s;
}, toArray: function(t) {
  return ve(t, function(s) {
    return s;
  }) || [];
}, only: function(t) {
  if (!Be(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
S.Component = ue;
S.Fragment = St;
S.Profiler = Mt;
S.PureComponent = Oe;
S.StrictMode = Lt;
S.Suspense = Et;
S.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _t;
S.act = ut;
S.cloneElement = function(t, s, a) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var i = ct({}, t.props), r = t.key, c = t.ref, n = t._owner;
  if (s != null) {
    if (s.ref !== void 0 && (c = s.ref, n = He.current), s.key !== void 0 && (r = "" + s.key), t.type && t.type.defaultProps) var o = t.type.defaultProps;
    for (p in s) xt.call(s, p) && !pt.hasOwnProperty(p) && (i[p] = s[p] === void 0 && o !== void 0 ? o[p] : s[p]);
  }
  var p = arguments.length - 2;
  if (p === 1) i.children = a;
  else if (1 < p) {
    o = Array(p);
    for (var d = 0; d < p; d++) o[d] = arguments[d + 2];
    i.children = o;
  }
  return { $$typeof: ye, type: t.type, key: r, ref: c, props: i, _owner: n };
};
S.createContext = function(t) {
  return t = { $$typeof: Tt, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: At, _context: t }, t.Consumer = t;
};
S.createElement = ht;
S.createFactory = function(t) {
  var s = ht.bind(null, t);
  return s.type = t, s;
};
S.createRef = function() {
  return { current: null };
};
S.forwardRef = function(t) {
  return { $$typeof: $t, render: t };
};
S.isValidElement = Be;
S.lazy = function(t) {
  return { $$typeof: It, _payload: { _status: -1, _result: t }, _init: zt };
};
S.memo = function(t, s) {
  return { $$typeof: Dt, type: t, compare: s === void 0 ? null : s };
};
S.startTransition = function(t) {
  var s = we.transition;
  we.transition = {};
  try {
    t();
  } finally {
    we.transition = s;
  }
};
S.unstable_act = ut;
S.useCallback = function(t, s) {
  return q.current.useCallback(t, s);
};
S.useContext = function(t) {
  return q.current.useContext(t);
};
S.useDebugValue = function() {
};
S.useDeferredValue = function(t) {
  return q.current.useDeferredValue(t);
};
S.useEffect = function(t, s) {
  return q.current.useEffect(t, s);
};
S.useId = function() {
  return q.current.useId();
};
S.useImperativeHandle = function(t, s, a) {
  return q.current.useImperativeHandle(t, s, a);
};
S.useInsertionEffect = function(t, s) {
  return q.current.useInsertionEffect(t, s);
};
S.useLayoutEffect = function(t, s) {
  return q.current.useLayoutEffect(t, s);
};
S.useMemo = function(t, s) {
  return q.current.useMemo(t, s);
};
S.useReducer = function(t, s, a) {
  return q.current.useReducer(t, s, a);
};
S.useRef = function(t) {
  return q.current.useRef(t);
};
S.useState = function(t) {
  return q.current.useState(t);
};
S.useSyncExternalStore = function(t, s, a) {
  return q.current.useSyncExternalStore(t, s, a);
};
S.useTransition = function() {
  return q.current.useTransition();
};
S.version = "18.3.1";
it.exports = S;
var u = it.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ot = u, Vt = Symbol.for("react.element"), Ht = Symbol.for("react.fragment"), Bt = Object.prototype.hasOwnProperty, qt = Ot.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ut = { key: !0, ref: !0, __self: !0, __source: !0 };
function ft(t, s, a) {
  var i, r = {}, c = null, n = null;
  a !== void 0 && (c = "" + a), s.key !== void 0 && (c = "" + s.key), s.ref !== void 0 && (n = s.ref);
  for (i in s) Bt.call(s, i) && !Ut.hasOwnProperty(i) && (r[i] = s[i]);
  if (t && t.defaultProps) for (i in s = t.defaultProps, s) r[i] === void 0 && (r[i] = s[i]);
  return { $$typeof: Vt, type: t, key: c, ref: n, props: r, _owner: qt.current };
}
Te.Fragment = Ht;
Te.jsx = ft;
Te.jsxs = ft;
lt.exports = Te;
var e = lt.exports;
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wt = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), gt = (...t) => t.filter((s, a, i) => !!s && i.indexOf(s) === a).join(" ");
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Gt = {
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
const Kt = u.forwardRef(
  ({
    color: t = "currentColor",
    size: s = 24,
    strokeWidth: a = 2,
    absoluteStrokeWidth: i,
    className: r = "",
    children: c,
    iconNode: n,
    ...o
  }, p) => u.createElement(
    "svg",
    {
      ref: p,
      ...Gt,
      width: s,
      height: s,
      stroke: t,
      strokeWidth: i ? Number(a) * 24 / Number(s) : a,
      className: gt("lucide", r),
      ...o
    },
    [
      ...n.map(([d, g]) => u.createElement(d, g)),
      ...Array.isArray(c) ? c : [c]
    ]
  )
);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M = (t, s) => {
  const a = u.forwardRef(
    ({ className: i, ...r }, c) => u.createElement(Kt, {
      ref: c,
      iconNode: s,
      className: gt(`lucide-${Wt(t)}`, i),
      ...r
    })
  );
  return a.displayName = `${t}`, a;
};
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zt = M("Activity", [
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
const Ze = M("Archive", [
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
const Jt = M("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bt = M("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y = M("CircleAlert", [
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
const le = M("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ce = M("CircleDashed", [
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
const $e = M("CircleX", [
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
const Yt = M("ClipboardCheck", [
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
const Xt = M("Cloud", [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Je = M("Download", [
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
const Qt = M("FileText", [
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
const es = M("FlaskConical", [
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
const ts = M("FolderOpen", [
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
const jt = M("KeyRound", [
  ["path", { d: "M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z", key: "167ctg" }],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ss = M("Layers", [
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
const me = M("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Se = M("Microscope", [
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
const as = M("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yt = M("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rs = M("Save", [
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
const ns = M("ScrollText", [
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
const Ye = M("ShieldAlert", [
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
const vt = M("Sparkles", [
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
const ls = M("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const is = M("Trash2", [
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
const os = M("Upload", [
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
const cs = M("Users", [
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
const ds = M("Waypoints", [
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
const ms = M("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), qe = () => {
  var t;
  return ((t = document.querySelector('meta[name="cxlens-token"]')) == null ? void 0 : t.content) ?? window.__CXLENS_TOKEN__ ?? "";
};
let Ee = window.__CXLENS_API__ ?? "";
const _s = (t) => {
  Ee = t;
};
async function F(t, s = {}) {
  const a = await fetch(Ee + t, { ...s, headers: { "content-type": "application/json", "X-CxLens-Token": qe(), ...s.headers ?? {} } }), i = await a.json().catch(() => ({}));
  if (!a.ok) throw new Error(i.error ?? `Request failed (${a.status})`);
  return i;
}
function xs(t, s) {
  const a = new URL(Ee || location.href);
  a.protocol = a.protocol === "https:" ? "wss:" : "ws:", a.pathname = "/ws", a.search = `?run=${t}&token=${qe()}`;
  const i = new WebSocket(a);
  return i.onmessage = (r) => s(JSON.parse(r.data)), () => i.close();
}
function ps(t, s) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([s], { type: t.endsWith(".html") ? "text/html" : t.endsWith(".json") ? "application/json" : "text/plain" })), a.download = t, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 1e3);
}
async function hs(t, s, a) {
  const i = await fetch(Ee + t, { method: "POST", headers: { "content-type": "application/json", "X-CxLens-Token": qe() }, body: JSON.stringify(s) });
  if (!i.ok) {
    const p = await i.json().catch(() => ({}));
    throw new Error(p.error ?? `Download failed (${i.status})`);
  }
  const r = i.headers.get("content-disposition") ?? "", c = r.match(/filename\*=UTF-8''([^;]+)/) ?? r.match(/filename="([^"]+)"/), n = c ? decodeURIComponent(c[1]) : a, o = document.createElement("a");
  return o.href = URL.createObjectURL(await i.blob()), o.download = n, o.click(), setTimeout(() => URL.revokeObjectURL(o.href), 2e3), n;
}
const y = (...t) => t.filter(Boolean).join(" ");
function B({ kind: t = "secondary", size: s = "md", className: a, ...i }) {
  return /* @__PURE__ */ e.jsx("button", { ...i, className: y(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",
    // quiet buttons carry their own padding (below), so the size padding only applies to the other kinds
    t !== "quiet" && (s === "lg" ? "px-5 py-2.5 text-[14.5px]" : "px-3.5 py-2 text-[13.5px]"),
    t === "quiet" && (s === "lg" ? "text-[14.5px]" : "text-[13.5px]"),
    t === "primary" && "bg-refract text-[color:var(--on-refract)] hover:brightness-110 shadow-soft hover:shadow-float",
    t === "secondary" && "border border-line bg-surface hover:bg-sunk shadow-sm",
    t === "quiet" && "text-mute hover:text-ink hover:bg-sunk px-3 py-2",
    t === "danger" && "border border-bad/50 text-bad hover:bg-bad hover:text-on-color",
    a
  ) });
}
function H({ label: t, hint: s, children: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ e.jsx("span", { className: "block text-[13.5px] font-medium mb-1.5", children: t }),
    a,
    s && /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] text-mute mt-1.5", children: s })
  ] });
}
const V = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] placeholder:text-mute/70 focus:border-refract";
function J({ tone: t = "neutral", children: s, icon: a }) {
  return /* @__PURE__ */ e.jsxs("span", { className: y(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-medium",
    t === "ok" && "bg-ok/10 text-ok",
    t === "bad" && "bg-bad/10 text-bad",
    t === "warn" && "bg-warn/10 text-warn",
    t === "info" && "bg-refract-soft text-refract",
    t === "neutral" && "bg-sunk text-mute"
  ), children: [
    a && /* @__PURE__ */ e.jsx(a, { size: 13, "aria-hidden": !0 }),
    s
  ] });
}
function he({ summary: t, children: s, open: a }) {
  return /* @__PURE__ */ e.jsxs("details", { open: a, className: "group rounded-lg border border-line bg-surface", children: [
    /* @__PURE__ */ e.jsxs("summary", { className: "cursor-pointer select-none list-none px-4 py-2.5 text-[13.5px] font-medium flex items-center justify-between", children: [
      t,
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: "text-mute group-open:rotate-90 transition-transform", children: "›" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "px-4 pb-4", children: s })
  ] });
}
function ze({ title: t, next: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-dashed border-line px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[15px]", children: t }),
    s && /* @__PURE__ */ e.jsx("div", { className: "mt-3 text-[13px] text-mute", children: s })
  ] });
}
const ee = (t) => t == null ? "TBD" : t >= 10 ? t.toFixed(1) : t.toFixed(t >= 1 ? 2 : 3), _e = {
  1: { name: "Quick wins", long: "Config-only, no app changes", when: "1–2 weeks", cls: "text-p1", bg: "bg-p1", soft: "bg-p1/10" },
  2: { name: "Coordinated changes", long: "Helm upgrade or collector redeploy", when: "2–4 weeks", cls: "text-p2", bg: "bg-p2", soft: "bg-p2/10" },
  3: { name: "Strategic", long: "Application code or architecture", when: "About a quarter", cls: "text-p3", bg: "bg-p3", soft: "bg-p3/10" }
}, ne = {
  universal: { name: "Universal", icon: ss, color: "var(--universal)", text: "text-universal", bg: "bg-universal", border: "border-universal" },
  logs: { name: "Logs", icon: ns, color: "var(--logs)", text: "text-logs", bg: "bg-logs", border: "border-logs" },
  traces: { name: "Traces", icon: ds, color: "var(--traces)", text: "text-traces", bg: "bg-traces", border: "border-traces" },
  metrics: { name: "Metrics", icon: Zt, color: "var(--metrics)", text: "text-metrics", bg: "bg-metrics", border: "border-metrics" }
}, Os = Object.fromEntries(Object.entries(ne).map(([t, s]) => [t, s.name])), us = {
  units: "Coralogix’s billing measure. Each GB costs a different number of units depending on data type and storage tier.",
  "TCO tier": "Storage priority (High, Medium, Low) that sets how data is indexed and what it costs per GB.",
  "tail sampling": "Deciding which traces to keep after seeing the whole trace, so errors and slow requests are always kept.",
  "protected labels": "Resource attributes that Infrastructure Explorer and AWS enrichment rely on. Lens never removes them.",
  "span metrics": "Request, error and latency metrics generated from traces. Alerts built on them work even when traces are sampled."
};
function fs({ t, children: s }) {
  return /* @__PURE__ */ e.jsxs("span", { className: "relative inline-block group/term", children: [
    /* @__PURE__ */ e.jsx("span", { tabIndex: 0, className: "underline decoration-dotted decoration-mute/60 underline-offset-[3px] cursor-help", children: s ?? t }),
    /* @__PURE__ */ e.jsx("span", { role: "tooltip", className: "pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-64 rounded-lg bg-rail px-3 py-2 text-[12.5px] leading-snug text-rail-ink opacity-0 shadow-lg transition-opacity group-hover/term:opacity-100 group-focus-within/term:opacity-100", children: us[t] ?? t })
  ] });
}
function Xe(t, s) {
  const a = t.filter((o) => s(o) && o.savings.kind === "units" && (o.savings.unitsPerDay ?? 0) > 0), i = new Set(a.map((o) => o.ruleId)), r = /* @__PURE__ */ new Map(), c = (o) => (r.get(o) ?? o) === o ? o : c(r.get(o));
  for (const o of a) r.set(o.ruleId, o.ruleId);
  for (const o of a) for (const p of o.overlapsWith ?? []) i.has(p) && r.set(c(p), c(o.ruleId));
  const n = /* @__PURE__ */ new Map();
  for (const o of a) {
    const p = c(o.ruleId);
    n.set(p, Math.max(n.get(p) ?? 0, o.savings.unitsPerDay));
  }
  return [...n.values()].reduce((o, p) => o + p, 0);
}
const je = [
  { title: "Connect", hint: "Pick the Coralogix team" },
  { title: "Customer context", hint: "Who this review is for" },
  { title: "Choose pillars", hint: "What to look at" },
  { title: "Config and versions", hint: "Optional collector config" },
  { title: "Run assessment", hint: "Read-only discovery" },
  { title: "Verify findings", hint: "Decide with the customer" },
  { title: "Remediate and report", hint: "Plan, config, exports" }
];
function gs({ step: t, maxReached: s, onPick: a }) {
  return /* @__PURE__ */ e.jsx("nav", { "aria-label": "Review steps", children: /* @__PURE__ */ e.jsx("ol", { className: "relative", children: je.map((i, r) => {
    const c = r < t, n = r === t, o = r <= s, p = 2 * Math.PI * 11, d = c ? 1 : n ? 0.6 : 0;
    return /* @__PURE__ */ e.jsxs("li", { className: "relative", children: [
      r < je.length - 1 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: y("absolute left-[19px] top-[38px] h-[calc(100%-26px)] w-px", c ? "bg-refract" : "bg-rail-line") }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          disabled: !o,
          onClick: () => a(r),
          "aria-current": n ? "step" : void 0,
          className: y("relative flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left", n ? "bg-white/[.06]" : o ? "hover:bg-white/[.04]" : "opacity-50 cursor-default"),
          children: [
            /* @__PURE__ */ e.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 26 26", className: "mt-0.5 shrink-0", "aria-hidden": !0, children: [
              /* @__PURE__ */ e.jsx("circle", { cx: "13", cy: "13", r: "11", fill: "var(--rail)", stroke: "var(--rail-line)", strokeWidth: "2.5" }),
              /* @__PURE__ */ e.jsx("circle", { cx: "13", cy: "13", r: "11", fill: "none", stroke: c ? "#38BDF8" : "#A78BFA", strokeWidth: "2.5", strokeDasharray: p, strokeDashoffset: p * (1 - d), transform: "rotate(-90 13 13)", strokeLinecap: "round", style: { transition: "stroke-dashoffset .5s" } }),
              c ? /* @__PURE__ */ e.jsx("path", { d: "M8.5 13.2l3 3 6-6.4", fill: "none", stroke: "#38BDF8", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) : /* @__PURE__ */ e.jsx("text", { x: "13", y: "17.2", textAnchor: "middle", fontSize: "11.5", fontWeight: "600", fill: n ? "#fff" : "#8FB0B6", children: r + 1 })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[14px] leading-tight", n ? "text-white font-semibold" : "text-rail-ink"), children: i.title }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] text-rail-mute mt-0.5", children: i.hint })
            ] })
          ]
        }
      )
    ] }, i.title);
  }) }) });
}
function Nt({ baseline: t, findings: s, compact: a }) {
  const i = Xe(s, (p) => p.verifyStatus === "verified"), r = Xe(s, (p) => p.verifyStatus !== "rejected"), c = Math.max(0, r - i), n = t ?? Math.max(r * 1.5, 1), o = (p) => `${Math.min(100, p / n * 100)}%`;
  return /* @__PURE__ */ e.jsxs("section", { "aria-label": "Value lens", className: y("rounded-2xl bg-rail text-rail-ink", a ? "px-5 py-4" : "px-6 py-5"), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-x-8 gap-y-3", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-rail-mute", children: "Daily usage today" }),
        /* @__PURE__ */ e.jsxs("p", { className: "font-display text-[30px] font-semibold leading-none tabnum mt-1", children: [
          t == null ? "—" : ee(t),
          /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-normal text-rail-mute", children: " units/day" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("dl", { className: "flex gap-8 text-[13px]", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("dt", { className: "text-rail-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 rounded-sm bg-[#38BDF8]" }),
            "Verified headroom"
          ] }),
          /* @__PURE__ */ e.jsx("dd", { className: "font-display text-[20px] font-semibold tabnum", children: ee(i) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("dt", { className: "text-rail-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 rounded-sm text-[#A78BFA] hatch border border-[#A78BFA]" }),
            "Still to review"
          ] }),
          /* @__PURE__ */ e.jsx("dd", { className: "font-display text-[20px] font-semibold tabnum", children: ee(c) })
        ] }),
        t != null && /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("dt", { className: "text-rail-mute", children: "Share of today" }),
          /* @__PURE__ */ e.jsxs("dd", { className: "font-display text-[20px] font-semibold tabnum", children: [
            Math.round(r / n * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-white/10", role: "img", "aria-label": `${ee(i)} units per day verified, ${ee(c)} still to review, out of ${t == null ? "unknown" : ee(t)}`, children: [
      /* @__PURE__ */ e.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx("div", { className: "lens-grow h-full text-[#A78BFA] hatch bg-[#A78BFA]/25", style: { width: o(c) } }),
      /* @__PURE__ */ e.jsx("div", { className: "lens-grow h-full bg-[#38BDF8]", style: { width: o(i) } })
    ] }),
    !a && /* @__PURE__ */ e.jsx("p", { className: "mt-2.5 text-[12.5px] text-rail-mute", children: "The bar is today’s usage. The coloured end is quota the customer can free and reinvest. Estimates can vary by about ±20%." })
  ] });
}
const bs = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='150%20150%20724%20724'%20width='64'%20height='64'%3e%3ctitle%3eCoralogix%20Lens%3c/title%3e%3cdefs%3e%3clinearGradient%20id='bg'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3e%3cstop%20offset='0'%20stop-color='%23103A46'/%3e%3cstop%20offset='1'%20stop-color='%230A1F28'/%3e%3c/linearGradient%3e%3clinearGradient%20id='ib0'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3e%3cstop%20offset='0'%20stop-color='%233CC6CF'/%3e%3cstop%20offset='1'%20stop-color='%231A8F9A'/%3e%3c/linearGradient%3e%3clinearGradient%20id='ib1'%20x1='1'%20y1='0'%20x2='0'%20y2='1'%3e%3cstop%20offset='0'%20stop-color='%238F74FF'/%3e%3cstop%20offset='1'%20stop-color='%235B3FD0'/%3e%3c/linearGradient%3e%3cradialGradient%20id='glow'%20cx='.5'%20cy='.5'%20r='.5'%3e%3cstop%20offset='0'%20stop-color='%23FFFFFF'/%3e%3cstop%20offset='.35'%20stop-color='%23C9F4F7'/%3e%3cstop%20offset='1'%20stop-color='%233CC6CF'%20stop-opacity='0'/%3e%3c/radialGradient%3e%3cclipPath%20id='lens'%3e%3ccircle%20cx='512'%20cy='512'%20r='332'/%3e%3c/clipPath%3e%3c/defs%3e%3ccircle%20cx='512'%20cy='512'%20r='352'%20fill='%23071A21'/%3e%3cg%20clip-path='url(%23lens)'%3e%3cpath%20d='M576.00%20401.15%20L640.00%20512.00%20L687.93%20793.55%20A332%20332%200%200%200%20843.80%20500.41%20Z'%20fill='url(%23ib0)'/%3e%3cpath%20d='M576.00%20401.15%20L640.00%20512.00%20L687.93%20793.55%20A332%20332%200%200%200%20843.80%20500.41%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3cpath%20d='M640.00%20512.00%20L576.00%20622.85%20L356.14%20805.14%20A332%20332%200%200%200%20687.93%20793.55%20Z'%20fill='url(%23ib1)'/%3e%3cpath%20d='M640.00%20512.00%20L576.00%20622.85%20L356.14%20805.14%20A332%20332%200%200%200%20687.93%20793.55%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3cpath%20d='M576.00%20622.85%20L448.00%20622.85%20L180.20%20523.59%20A332%20332%200%200%200%20356.14%20805.14%20Z'%20fill='url(%23ib0)'/%3e%3cpath%20d='M576.00%20622.85%20L448.00%20622.85%20L180.20%20523.59%20A332%20332%200%200%200%20356.14%20805.14%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3cpath%20d='M448.00%20622.85%20L384.00%20512.00%20L336.07%20230.45%20A332%20332%200%200%200%20180.20%20523.59%20Z'%20fill='url(%23ib1)'/%3e%3cpath%20d='M448.00%20622.85%20L384.00%20512.00%20L336.07%20230.45%20A332%20332%200%200%200%20180.20%20523.59%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3cpath%20d='M384.00%20512.00%20L448.00%20401.15%20L667.86%20218.86%20A332%20332%200%200%200%20336.07%20230.45%20Z'%20fill='url(%23ib0)'/%3e%3cpath%20d='M384.00%20512.00%20L448.00%20401.15%20L667.86%20218.86%20A332%20332%200%200%200%20336.07%20230.45%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3cpath%20d='M448.00%20401.15%20L576.00%20401.15%20L843.80%20500.41%20A332%20332%200%200%200%20667.86%20218.86%20Z'%20fill='url(%23ib1)'/%3e%3cpath%20d='M448.00%20401.15%20L576.00%20401.15%20L843.80%20500.41%20A332%20332%200%200%200%20667.86%20218.86%20Z'%20fill='none'%20stroke='%230A2A33'%20stroke-opacity='.55'%20stroke-width='5'%20stroke-linejoin='round'/%3e%3c/g%3e%3ccircle%20cx='512'%20cy='512'%20r='341'%20fill='none'%20stroke='%23E8FBFC'%20stroke-opacity='.9'%20stroke-width='18'/%3e%3cpolygon%20points='576.50,400.28%20641.00,512.00%20576.50,623.72%20447.50,623.72%20383.00,512.00%20447.50,400.28'%20fill='%2306161C'/%3e%3ccircle%20cx='512'%20cy='512'%20r='74'%20fill='url(%23glow)'/%3e%3ccircle%20cx='512'%20cy='512'%20r='22'%20fill='%23FFFFFF'/%3e%3c/svg%3e", Qe = ["eu1", "eu2", "us1", "us2", "us3", "ap1", "ap2", "ap3", "gov1"], kt = (t) => {
  var i, r;
  const s = (((i = t == null ? void 0 : t.usage) == null ? void 0 : i.fetchedAt) ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 10), a = (((r = t == null ? void 0 : t.usage) == null ? void 0 : r.days) ?? []).filter((c) => c.date.slice(0, 10) < s).slice(-7);
  return a.length ? a.reduce((c, n) => c + n.totalUnits, 0) / a.length : null;
}, Le = { text: "", chartVersion: "", otelVersion: "", distribution: "otelcol-contrib", label: "" }, Q = { helm: "Kubernetes", ecs: "ECS", ec2: "EC2", standalone: "Standalone" }, js = [["helm", "Kubernetes", "EKS or any cluster, Coralogix Helm chart"], ["ecs", "ECS", "Amazon ECS"], ["ec2", "EC2", "Amazon EC2"], ["standalone", "Standalone", "Any other host"]], de = { windowHours: 24, dupWindowMinutes: 15, rowLimit: 200 }, Ue = (t) => {
  if (t % 24 === 0 && t >= 48) return `${t / 24} days`;
  if (Number.isInteger(t)) return t === 1 ? "1 hour" : `${t} hours`;
  const s = Math.round(t * 60);
  return `${Math.floor(s / 60)} h ${s % 60} min`;
}, Ne = (t) => String(t).padStart(2, "0"), Ie = (t) => `${t.getFullYear()}-${Ne(t.getMonth() + 1)}-${Ne(t.getDate())}T${Ne(t.getHours())}:${Ne(t.getMinutes())}`, Me = (t) => t ? new Date(t).toISOString() : "", Ae = (t) => t ? new Date(t).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
function be(t) {
  if (t.mode !== "range") return null;
  if (!t.start || !t.end) return "Pick both a start and an end.";
  const s = new Date(t.start).getTime(), a = new Date(t.end).getTime();
  return !Number.isFinite(s) || !Number.isFinite(a) ? "Those dates are not valid." : a > Date.now() + 6e4 ? "The end is in the future. Pick a time that has already passed." : a <= s ? "The start must be before the end." : a - s < 36e5 ? "The range must be at least 1 hour long." : a - s > 168 * 36e5 ? "The range can be at most 7 days long." : null;
}
const ys = (t) => (new Date(t.end).getTime() - new Date(t.start).getTime()) / 36e5, wt = (t) => t.mode === "range" && !be(t) ? `${Ae(t.start)} to ${Ae(t.end)}` : `the last ${Ue(t.windowHours)}`, vs = (t) => ({ dupWindowMinutes: t.dupWindowMinutes, rowLimit: t.rowLimit, ...t.mode === "range" ? { range: { start: Me(t.start), end: Me(t.end) } } : { windowHours: t.windowHours } });
function xe({ step: t, lead: s, children: a }) {
  return /* @__PURE__ */ e.jsxs("header", { className: "mb-10", children: [
    /* @__PURE__ */ e.jsxs("p", { className: "text-[13px] font-semibold text-refract uppercase tracking-wider mb-2", children: [
      "Step ",
      t + 1,
      " of ",
      je.length
    ] }),
    /* @__PURE__ */ e.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight text-ink leading-tight", children: je[t].title }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-[16px] text-mute max-w-[64ch] leading-relaxed", children: s }),
    a
  ] });
}
function pe({ onBack: t, next: s, nextLabel: a, disabled: i, note: r, extra: c }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "sticky bottom-0 z-10 -mx-10 mt-12 border-t border-line bg-paper/95 backdrop-blur-md px-10 py-5 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]", children: [
    t && /* @__PURE__ */ e.jsxs(B, { kind: "quiet", onClick: t, className: "text-mute", children: [
      /* @__PURE__ */ e.jsx(Jt, { size: 16 }),
      "Back"
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "flex-1 text-[13.5px] text-mute font-medium", children: r }),
    c,
    s && /* @__PURE__ */ e.jsx(B, { kind: "primary", size: "lg", disabled: i, onClick: s, children: a })
  ] });
}
function Vs() {
  var fe, ge;
  const [t, s] = u.useState(0), [a, i] = u.useState(0), r = (l) => {
    var b;
    s(l), i((C) => Math.max(C, l)), (b = document.getElementById("main")) == null || b.scrollTo({ top: 0 }), window.scrollTo({ top: 0 });
  }, [c, n] = u.useState(null), [o, p] = u.useState({ team: "", region: "ap1", demo: !1 }), [d, g] = u.useState({ name: "", environment: "", preparedBy: "", audience: "", criticalServices: [], nearRenewal: !1, teamCanVerify: !0, internalTerms: [] }), [v, j] = u.useState(["helm"]), h = v[0], [k, x] = u.useState(["universal", "logs", "traces", "metrics"]), [f, I] = u.useState({}), T = (l) => f[l] ?? Le, [U, G] = u.useState(de), [te, W] = u.useState({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only" }), [_, N] = u.useState(null), [$, D] = u.useState(null);
  u.useEffect(() => {
    F("/api/versions").then(n).catch(() => n({ error: !0 }));
  }, []);
  const L = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), [K, P] = u.useState(null), [z, se] = u.useState(null), [ae, re] = u.useState(null), [ie, X] = u.useState(!1), Z = (l, b) => {
    re({ text: l, tone: b }), setTimeout(() => re(null), 2600);
  }, oe = !!(d.name || Object.values(f).some((l) => l.text) || _ || t > 0 || o.team || o.demo), m = () => ({ step: t, maxReached: a, conn: o, customer: d, deployments: v, pillars: k, cfgs: f, win: U, inv: te, runId: _ }), w = async (l = !1) => {
    const b = K ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const C = await F(`/api/drafts/${b}`, { method: "PUT", body: JSON.stringify({ name: d.name || "Untitled review", step: t, state: m() }) });
      return P(C.id), se(C.savedAt), l || Z("Draft saved. Resume it any time from Connect."), !0;
    } catch (C) {
      return l || Z(`Could not save the draft: ${C.message}`, "bad"), !1;
    }
  };
  u.useEffect(() => {
    K && w(!0);
  }, [t, _]), u.useEffect(() => {
    const l = (b) => {
      (b.metaKey || b.ctrlKey) && b.key.toLowerCase() === "s" && (b.preventDefault(), w());
    };
    return addEventListener("keydown", l), () => removeEventListener("keydown", l);
  });
  const A = () => {
    p({ team: "", region: "ap1", demo: !1 }), g({ name: "", environment: "", preparedBy: "", audience: "", criticalServices: [], nearRenewal: !1, teamCanVerify: !0, internalTerms: [] }), j(["helm"]), x(["universal", "logs", "traces", "metrics"]), I({}), G(de), W({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only" }), N(null), D(null), P(null), se(null), s(0), i(0), X(!1), window.scrollTo({ top: 0 });
  }, E = () => oe ? X(!0) : A(), ce = async (l) => {
    try {
      const b = await F(`/api/drafts/${l}`), C = b.state ?? {};
      p(C.conn ?? { team: "", region: "ap1", demo: !1 }), g({ ...d, ...C.customer }), j(C.deployments ?? [C.deployment ?? "helm"]), x(C.pillars ?? ["universal", "logs", "traces", "metrics"]), I(C.cfgs ?? (C.cfg ? { [C.deployment ?? "helm"]: { ...Le, ...C.cfg } } : {})), G({ ...de, ...C.win ?? {} }), W({ enabled: !0, maxContributors: 8, skills: { spanNames: !0, buckets: !0 }, vendor: "none / Coralogix-only", ...C.inv ?? {} });
      let R = Math.min(C.step ?? 0, 6), O = null;
      C.runId ? (O = await F(`/api/runs/${C.runId}`).catch(() => null), O || (Z("The saved assessment is no longer available, so it will run again.", "bad"), R = Math.min(R, 3))) : R = Math.min(R, 3), N(O ? C.runId : null), D(O), P(b.id), se(b.savedAt), i(Math.max(R, Math.min(C.maxReached ?? R, O ? 6 : 3))), s(R), Z(`Resumed “${b.name}”.`);
    } catch (b) {
      Z(`Could not open the draft: ${b.message}`, "bad");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-full md:grid md:grid-cols-[272px_1fr]", children: [
    /* @__PURE__ */ e.jsxs("aside", { className: "bg-rail text-rail-ink px-4 py-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2 mb-8", children: [
        /* @__PURE__ */ e.jsx("img", { src: bs, alt: "", width: 36, height: 36 }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { className: "font-display text-[18px] font-semibold tracking-[-0.01em] leading-tight text-white", children: "Coralogix Lens" }),
          /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] text-rail-mute", children: "Telemetry Health & Value Review" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(gs, { step: t, maxReached: a, onPick: r }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-5 grid gap-2 px-1", children: [
        /* @__PURE__ */ e.jsxs("button", { onClick: () => void w(), className: "flex items-center gap-2 rounded-lg border border-rail-line px-3 py-2 text-left text-[13px] text-rail-ink hover:bg-white/[.06] active:scale-[0.98] transition-all", children: [
          /* @__PURE__ */ e.jsx(rs, { size: 15, "aria-hidden": !0 }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Save draft" }),
          /* @__PURE__ */ e.jsx("kbd", { className: "!bg-transparent !text-rail-mute !border-rail-line !shadow-none", children: "⌘S" })
        ] }),
        z && /* @__PURE__ */ e.jsxs("p", { className: "px-1 text-[12px] text-rail-mute", children: [
          "Saved ",
          new Date(z).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ". Keeps saving as you go."
        ] }),
        /* @__PURE__ */ e.jsxs("button", { onClick: E, className: "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-rail-mute hover:text-rail-ink hover:bg-white/[.06] transition-all", children: [
          /* @__PURE__ */ e.jsx(yt, { size: 15, "aria-hidden": !0 }),
          "Start a new review"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-auto pt-6 space-y-3 px-2 text-[12.5px]", children: [
        (d.name || o.team || o.demo) && /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-rail-line p-3 space-y-1.5", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-rail-mute", children: "This review" }),
          d.name && /* @__PURE__ */ e.jsxs("p", { className: "text-white font-medium", children: [
            d.name,
            d.environment && /* @__PURE__ */ e.jsxs("span", { className: "text-rail-mute font-normal", children: [
              " (",
              d.environment,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("p", { children: o.demo ? "Demo data" : o.team ? `Team ${o.team} in ${o.region}` : "" }),
          t >= 3 && v.map((l) => /* @__PURE__ */ e.jsxs("p", { children: [
            Q[l],
            ": ",
            T(l).label || (T(l).text ? "config added" : "no config")
          ] }, l)),
          t >= 3 && /* @__PURE__ */ e.jsxs("p", { children: [
            "Data from ",
            wt(U)
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "text-rail-mute leading-relaxed", children: c && !c.error ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          "Latest Helm chart ",
          /* @__PURE__ */ e.jsx("span", { className: "text-rail-ink tabnum", children: c.chart }),
          /* @__PURE__ */ e.jsx("br", {}),
          "Latest OTel Collector ",
          /* @__PURE__ */ e.jsx("span", { className: "text-rail-ink tabnum", children: c.collector ?? "unknown" }),
          /* @__PURE__ */ e.jsx("br", {}),
          ((fe = c.checkedAt) == null ? void 0 : fe.slice(0, 10)) === L ? "Checked today" : `Checked ${(ge = c.checkedAt) == null ? void 0 : ge.slice(0, 10)}${c.offline ? ", offline" : ""}`
        ] }) : c != null && c.error ? "Could not check the latest versions." : "Checking latest versions…" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("main", { id: "main", className: "min-w-0 px-10 pt-10", children: /* @__PURE__ */ e.jsxs("div", { className: y("mx-auto", t >= 5 ? "max-w-[1180px]" : "max-w-[900px]"), children: [
      t === 0 && /* @__PURE__ */ e.jsx(ws, { conn: o, setConn: p, onNext: () => r(1), onResume: ce }),
      t === 1 && /* @__PURE__ */ e.jsx(Cs, { c: d, set: g, deployments: v, setDeployments: j, onBack: () => r(0), onNext: () => r(2) }),
      t === 2 && /* @__PURE__ */ e.jsx(Ss, { inv: te, setInv: W, value: k, set: x, onBack: () => r(1), onNext: () => r(3) }),
      t === 3 && /* @__PURE__ */ e.jsx($s, { win: U, setWin: G, deployments: v, cfgs: f, setCfgs: I, versions: c, onBack: () => r(2), onNext: () => r(4) }),
      t === 4 && /* @__PURE__ */ e.jsx(
        Es,
        {
          win: U,
          pillars: k,
          req: { options: { ...vs(U), investigate: te }, team: o.team || void 0, region: o.region, demo: o.demo, customer: d, pillars: k, deployment: h, deployments: v, configs: Object.fromEntries(v.map((l) => [l, T(l).text])), versionsIn: Object.fromEntries(v.map((l) => [l, { chartVersion: T(l).chartVersion || void 0, otelVersion: T(l).otelVersion || void 0, distribution: T(l).distribution }])) },
          onDone: (l, b) => {
            N(l), D(b);
          },
          run: $,
          onNext: () => r(5),
          onBack: () => r(3)
        }
      ),
      t === 5 && $ && /* @__PURE__ */ e.jsx(Is, { run: $, runId: _, setRun: D, onBack: () => r(4), onNext: () => r(6) }),
      t === 6 && $ && /* @__PURE__ */ e.jsx(Fs, { run: $, runId: _, onBack: () => r(5), onRestart: E })
    ] }) }),
    ae && /* @__PURE__ */ e.jsx("div", { role: "status", className: y("fixed bottom-24 right-8 z-30 rounded-lg px-4 py-3 text-[13.5px] font-medium shadow-float", ae.tone === "bad" ? "bg-bad text-on-color" : "bg-rail text-rail-ink"), children: ae.text }),
    ie && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-40 grid place-items-center bg-black/40 p-6", onClick: () => X(!1), children: /* @__PURE__ */ e.jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "restart-title", onClick: (l) => l.stopPropagation(), className: "w-full max-w-[460px] rounded-2xl bg-surface p-6 shadow-float", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ e.jsx("h2", { id: "restart-title", className: "text-[18px] font-bold tracking-tight", children: "Start a new review?" }),
        /* @__PURE__ */ e.jsx("button", { "aria-label": "Close", onClick: () => X(!1), className: "text-mute hover:text-ink", children: /* @__PURE__ */ e.jsx(ms, { size: 18 }) })
      ] }),
      /* @__PURE__ */ e.jsxs("p", { className: "mt-2 text-[14.5px] text-mute leading-relaxed", children: [
        "You’ll go back to Connect with everything cleared. ",
        z ? "Your draft is saved, so you can resume this review later." : "Save this review as a draft first if you want to come back to it."
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-6 flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ e.jsx(B, { kind: "quiet", onClick: () => X(!1), children: "Cancel" }),
        !z && /* @__PURE__ */ e.jsx(B, { onClick: A, children: "Start over without saving" }),
        /* @__PURE__ */ e.jsx(B, { kind: "primary", autoFocus: !0, onClick: async () => {
          await w(!0) && (A(), Z("Draft saved. Starting a new review."));
        }, children: z ? "Save and start over" : "Save draft and start over" })
      ] })
    ] }) })
  ] });
}
function et({ icon: t, name: s, role: a, h: i, needTeam: r, optional: c }) {
  const n = r ? "idle" : i ? i.ok ? "ok" : "bad" : "loading";
  return /* @__PURE__ */ e.jsxs("li", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ e.jsx(t, { size: 18, className: "mt-0.5 text-mute", "aria-hidden": !0 }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[14px] font-medium", children: s }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-mute", children: a }),
      n === "bad" && /* @__PURE__ */ e.jsx("p", { className: y("text-[12.5px] mt-1", c ? "text-mute" : "text-bad"), children: c ? "Not installed. Everything else works without it; the duplicate-field check is then left for you to scope." : i.detail })
    ] }),
    n === "ok" ? /* @__PURE__ */ e.jsx(J, { tone: "ok", icon: le, children: "Ready" }) : n === "bad" ? c ? /* @__PURE__ */ e.jsx(J, { children: "Not installed" }) : /* @__PURE__ */ e.jsx(J, { tone: "bad", icon: $e, children: "Not available" }) : n === "loading" ? /* @__PURE__ */ e.jsx(J, { icon: me, children: "Checking" }) : /* @__PURE__ */ e.jsx(J, { children: "Pick a team first" })
  ] });
}
function Ns({ team: t, region: s }) {
  const [a, i] = u.useState(!1), [r, c] = u.useState(""), [n, o] = u.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface p-4 shadow-sm", children: [
    /* @__PURE__ */ e.jsxs("button", { onClick: () => i(!a), "aria-expanded": a, className: "w-full flex items-center justify-between text-left", children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[14.5px] font-semibold", children: "Exact metric usage" }),
        " ",
        /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-mute", children: "(optional)" }),
        /* @__PURE__ */ e.jsx("span", { className: "block text-[13px] text-mute", children: "Units per metric and per label, as in Settings › Metrics Data. Without it, metric savings are estimated from series." })
      ] }),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: "text-mute", children: a ? "−" : "+" })
    ] }),
    a && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 space-y-2", children: [
      /* @__PURE__ */ e.jsx(H, { label: `API key for ${t} with the DataAnalytics preset`, hint: "Stored in the macOS Keychain and used only for the read-only Metric Usage API. cx keeps its own sign-in.", children: /* @__PURE__ */ e.jsx("input", { type: "password", autoComplete: "off", className: V, value: r, onChange: (p) => c(p.target.value) }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx(B, { kind: "primary", disabled: !r, onClick: () => F("/api/teams", { method: "POST", body: JSON.stringify({ name: t, region: s, apiKey: r, kind: "metric-usage" }) }).then(() => {
          c(""), o({ t: "Saved. Use Check prerequisites to confirm it works.", ok: !0 });
        }).catch((p) => o({ t: p.message, ok: !1 })), children: "Save key" }),
        n && /* @__PURE__ */ e.jsx("span", { className: y("text-[13px]", n.ok ? "text-ok" : "text-bad"), children: n.t })
      ] })
    ] })
  ] });
}
function ks({ conn: t }) {
  const [s, a] = u.useState(null), [i, r] = u.useState(!1), c = () => {
    r(!0), a(null), F(`/api/prereqs${t.team ? `?team=${t.team}&region=${t.region}` : ""}`).then(a).catch((n) => a({ error: n.message })).finally(() => r(!1));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ e.jsx(B, { onClick: c, disabled: i, children: i ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(me, { size: 15, className: "animate-spin" }),
      "Checking…"
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(Yt, { size: 15 }),
      "Check prerequisites"
    ] }) }),
    s && !s.error && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 rounded-xl border border-line bg-surface shadow-sm", children: [
      /* @__PURE__ */ e.jsx("p", { className: y("px-4 py-2.5 text-[13.5px] font-semibold border-b border-line", s.ok ? "text-ok" : "text-warn"), children: s.ok ? "Ready: everything required is in place." : "Something required is missing." }),
      /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-line", children: s.checks.map((n) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-start gap-3 px-4 py-2.5 text-[13.5px]", children: [
        n.ok ? /* @__PURE__ */ e.jsx(le, { size: 16, className: "mt-0.5 text-ok shrink-0" }) : n.required ? /* @__PURE__ */ e.jsx($e, { size: 16, className: "mt-0.5 text-bad shrink-0" }) : /* @__PURE__ */ e.jsx(Ce, { size: 16, className: "mt-0.5 text-mute shrink-0" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "font-medium", children: [
            n.label.replace(" (optional, validates generated config)", " (validates generated config)"),
            !n.required && /* @__PURE__ */ e.jsx("span", { className: "font-normal text-mute", children: " (optional)" })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute break-words", children: n.detail }),
          !n.ok && n.fix && /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[12px] text-mute", children: [
            "Fix: ",
            /* @__PURE__ */ e.jsx("code", { className: "rounded bg-sunk px-1.5 py-0.5 break-all", children: n.fix })
          ] })
        ] })
      ] }, n.id)) })
    ] }),
    (s == null ? void 0 : s.error) && /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[13px] text-bad", children: s.error })
  ] });
}
function ws({ conn: t, setConn: s, onNext: a, onResume: i }) {
  const [r, c] = u.useState(null);
  u.useEffect(() => {
    F("/api/drafts").then(c).catch(() => c([]));
  }, []);
  const [n, o] = u.useState(null), [p, d] = u.useState(null), [g, v] = u.useState(!1), [j, h] = u.useState({ name: "", region: "ap1", apiKey: "" }), [k, x] = u.useState("");
  return u.useEffect(() => {
    F("/api/teams").then(o).catch(() => o([]));
  }, []), u.useEffect(() => {
    d(null), F(`/api/health${t.team ? `?team=${t.team}&region=${t.region}` : ""}`).then(d).catch((f) => d({ error: f.message }));
  }, [t.team, t.region]), /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 0, lead: "Choose the customer’s Coralogix team. Lens only reads data: it runs queries and usage reports, and never changes settings, policies or collectors." }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid lg:grid-cols-[1fr_340px] gap-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: y("rounded-xl border bg-surface p-5", t.team && !t.demo ? "border-refract" : "border-line"), children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ e.jsx(Xt, { size: 18, className: "text-refract" }),
            /* @__PURE__ */ e.jsx("h2", { className: "text-[16px] font-semibold", children: "Use a connected team" })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mb-4", children: "Teams come from your cx CLI profiles. Lens uses cx’s own sign-in, so it never needs your API key." }),
          /* @__PURE__ */ e.jsxs("div", { className: "grid sm:grid-cols-[1fr_140px] gap-3", children: [
            /* @__PURE__ */ e.jsx(H, { label: "Team", children: n === null ? /* @__PURE__ */ e.jsx("div", { className: V, children: "Loading teams…" }) : n.length ? /* @__PURE__ */ e.jsxs("select", { className: V, value: t.team, onChange: (f) => {
              const I = n.find((T) => T.name === f.target.value);
              s({ ...t, team: f.target.value, region: (I == null ? void 0 : I.region) ?? t.region, demo: !1 });
            }, children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Choose a team" }),
              n.map((f) => /* @__PURE__ */ e.jsx("option", { value: f.name, children: f.name }, f.name))
            ] }) : /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute py-2", children: "No teams yet. Add one below." }) }),
            /* @__PURE__ */ e.jsx(H, { label: "Region", children: /* @__PURE__ */ e.jsx("select", { className: V, value: t.region, onChange: (f) => s({ ...t, region: f.target.value }), children: Qe.map((f) => /* @__PURE__ */ e.jsx("option", { children: f }, f)) }) })
          ] })
        ] }),
        t.team && /* @__PURE__ */ e.jsx(Ns, { team: t.team, region: t.region }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("button", { onClick: () => v(!g), "aria-expanded": g, className: y("text-left rounded-xl border bg-surface p-5 hover:border-refract", g ? "border-refract" : "border-line"), children: [
            /* @__PURE__ */ e.jsx(as, { size: 18, className: "text-refract" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[15px] font-semibold", children: "Add a team" }),
            /* @__PURE__ */ e.jsxs("p", { className: "text-[13px] text-mute mt-1", children: [
              "Only if the team has no cx profile. Easiest: run ",
              /* @__PURE__ */ e.jsx("code", { className: "font-mono text-[12px]", children: "cx profiles add" }),
              " in Terminal."
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("button", { onClick: () => {
            s({ ...t, demo: !0, team: "" }), a();
          }, className: "text-left rounded-xl border border-line bg-surface p-5 hover:border-prism", children: [
            /* @__PURE__ */ e.jsx(es, { size: 18, className: "text-prism" }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[15px] font-semibold", children: "Use demo data" }),
            /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-mute mt-1", children: "Try the whole review with recorded, anonymised data." })
          ] })
        ] }),
        g && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-refract bg-surface p-5 space-y-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ e.jsx(H, { label: "Name", children: /* @__PURE__ */ e.jsx("input", { className: V, value: j.name, onChange: (f) => h({ ...j, name: f.target.value }) }) }),
            /* @__PURE__ */ e.jsx(H, { label: "Region", children: /* @__PURE__ */ e.jsx("select", { className: V, value: j.region, onChange: (f) => h({ ...j, region: f.target.value }), children: Qe.map((f) => /* @__PURE__ */ e.jsx("option", { children: f }, f)) }) }),
            /* @__PURE__ */ e.jsx(H, { label: "API key", children: /* @__PURE__ */ e.jsx("input", { type: "password", autoComplete: "off", className: V, value: j.apiKey, onChange: (f) => h({ ...j, apiKey: f.target.value }) }) })
          ] }),
          /* @__PURE__ */ e.jsxs("p", { className: "text-[12.5px] text-mute flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx(jt, { size: 13 }),
            "Stored in the Keychain only. Never written to disk or logs. Read access is enough."
          ] }),
          k && /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-bad", children: k }),
          /* @__PURE__ */ e.jsx(B, { kind: "primary", disabled: !j.name || !j.apiKey, onClick: () => F("/api/teams", { method: "POST", body: JSON.stringify(j) }).then(() => {
            s({ team: j.name, region: j.region, demo: !1 }), v(!1), h({ name: "", region: "ap1", apiKey: "" });
          }).catch((f) => x(f.message)), children: "Save team" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("aside", { className: "rounded-xl border border-line bg-surface px-5 py-2 self-start", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold pt-3", children: "What Lens uses on this Mac" }),
        /* @__PURE__ */ e.jsxs("ul", { className: "divide-y divide-line", children: [
          /* @__PURE__ */ e.jsx(et, { icon: ls, name: "cx CLI", role: "Runs read-only log, trace and metric queries and usage reports, using its own sign-in", h: p == null ? void 0 : p.cx }),
          /* @__PURE__ */ e.jsx(et, { optional: !0, icon: vt, name: "claude CLI", role: "Investigate mode: analyses masked live samples. Use Check prerequisites to confirm it is signed in.", h: p == null ? void 0 : p.claude })
        ] }),
        /* @__PURE__ */ e.jsx(ks, { conn: t }),
        /* @__PURE__ */ e.jsx("div", { className: "pb-4" })
      ] })
    ] }),
    !!(r != null && r.length) && /* @__PURE__ */ e.jsxs("section", { className: "mt-8", "aria-labelledby": "drafts-title", children: [
      /* @__PURE__ */ e.jsxs("h2", { id: "drafts-title", className: "text-[16px] font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ts, { size: 17, className: "text-refract" }),
        "Saved drafts"
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: "Pick up where you left off. Drafts stay on this Mac and never contain API keys." }),
      /* @__PURE__ */ e.jsx("ul", { className: "mt-3 grid sm:grid-cols-2 gap-3", children: r.map((f) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[14.5px] font-semibold truncate", children: f.name }),
          /* @__PURE__ */ e.jsxs("p", { className: "text-[12.5px] text-mute", children: [
            "Step ",
            f.step + 1,
            ": ",
            je[Math.min(f.step, 6)].title,
            f.demo ? ", demo data" : f.team ? `, ${f.team}` : "",
            ". Saved ",
            new Date(f.savedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(B, { onClick: () => i(f.id), children: "Resume" }),
        /* @__PURE__ */ e.jsx("button", { "aria-label": `Delete draft ${f.name}`, onClick: () => F(`/api/drafts/${f.id}`, { method: "DELETE" }).then(() => c(r.filter((I) => I.id !== f.id))), className: "rounded-lg p-2 text-mute hover:text-bad hover:bg-sunk", children: /* @__PURE__ */ e.jsx(is, { size: 16 }) })
      ] }, f.id)) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { next: a, nextLabel: "Continue to customer details", disabled: !t.team, note: t.team ? `Connected to ${t.team}.` : "Choose a team, or use demo data." })
  ] });
}
function tt({ value: t, onChange: s, placeholder: a }) {
  const [i, r] = u.useState(""), c = () => {
    const n = i.split(",").map((o) => o.trim()).filter(Boolean);
    n.length && s([.../* @__PURE__ */ new Set([...t, ...n])]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { className: y(V, "flex flex-wrap gap-1.5 items-center"), children: [
    t.map((n) => /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-refract-soft text-refract px-2 py-0.5 text-[13px] font-medium", children: [
      n,
      /* @__PURE__ */ e.jsx("button", { "aria-label": `Remove ${n}`, className: "opacity-70 hover:opacity-100", onClick: () => s(t.filter((o) => o !== n)), children: "×" })
    ] }, n)),
    /* @__PURE__ */ e.jsx("input", { className: "flex-1 min-w-[140px] bg-transparent outline-none", value: i, placeholder: t.length ? "" : a, onChange: (n) => r(n.target.value), onKeyDown: (n) => {
      (n.key === "Enter" || n.key === ",") && (n.preventDefault(), c());
    }, onBlur: c })
  ] });
}
function Cs({ c: t, set: s, deployments: a, setDeployments: i, onBack: r, onNext: c }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 1, lead: "Tell Lens who the review is for. These details appear on the report, and the critical services decide which traces are always kept." }),
    /* @__PURE__ */ e.jsxs("div", { className: "space-y-7 max-w-[720px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ e.jsx(H, { label: "Customer name", children: /* @__PURE__ */ e.jsx("input", { className: V, value: t.name, onChange: (n) => s({ ...t, name: n.target.value }) }) }),
        /* @__PURE__ */ e.jsx(H, { label: "Environment", children: /* @__PURE__ */ e.jsx("input", { className: V, placeholder: "production", value: t.environment, onChange: (n) => s({ ...t, environment: n.target.value }) }) }),
        /* @__PURE__ */ e.jsx(H, { label: "Prepared by", children: /* @__PURE__ */ e.jsx("input", { className: V, value: t.preparedBy, onChange: (n) => s({ ...t, preparedBy: n.target.value }) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("fieldset", { children: [
        /* @__PURE__ */ e.jsx("legend", { className: "text-[13.5px] font-medium mb-1", children: "How do they run the OpenTelemetry Collector?" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute mb-2", children: "Select every type they use. You can add a config for each one in the next steps." }),
        /* @__PURE__ */ e.jsx("div", { className: "grid sm:grid-cols-4 gap-2", children: js.map(([n, o, p]) => {
          const d = a.includes(n);
          return /* @__PURE__ */ e.jsxs("label", { className: y("relative cursor-pointer rounded-lg border bg-surface px-3 py-2.5", d ? "border-refract ring-1 ring-refract" : "border-line hover:border-mute"), children: [
            /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "sr-only", checked: d, onChange: () => i(d ? a.length > 1 ? a.filter((g) => g !== n) : a : [...a, n]) }),
            /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block text-[14px] font-medium", children: o }),
              /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: y("grid h-4 w-4 place-items-center rounded border", d ? "bg-refract border-refract text-on-color" : "border-line"), children: d && /* @__PURE__ */ e.jsx(bt, { size: 12, strokeWidth: 3 }) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] text-mute", children: p })
          ] }, n);
        }) }),
        a.length > 1 && /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: "Data checks run once for the whole team, so savings are never counted twice. Config checks and generated configs are done per type." })
      ] }),
      /* @__PURE__ */ e.jsx(H, { label: "Leadership slide is for", hint: "Shown above the one-slide summary at the top of the report. Leave empty for “leadership”.", children: /* @__PURE__ */ e.jsx("input", { className: V, placeholder: "the CTO and co-founders", value: t.audience, onChange: (n) => s({ ...t, audience: n.target.value }) }) }),
      /* @__PURE__ */ e.jsx(H, { label: "Critical services", hint: "Errors from these services are always kept by tail sampling, and their internal spans are never dropped. Press Enter after each name.", children: /* @__PURE__ */ e.jsx(tt, { value: t.criticalServices, onChange: (n) => s({ ...t, criticalServices: n }), placeholder: "checkout, payment" }) }),
      /* @__PURE__ */ e.jsx(H, { label: "Names to keep out of the customer report", hint: "People, team names or project names. Links, account IDs and API keys are removed automatically.", children: /* @__PURE__ */ e.jsx(tt, { value: t.internalTerms, onChange: (n) => s({ ...t, internalTerms: n }), placeholder: "Optional" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface p-4 space-y-2.5 text-[14px]", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] font-medium", children: "Before you start" }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex gap-2.5 items-start", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: t.nearRenewal, onChange: (n) => s({ ...t, nearRenewal: n.target.checked }) }),
          /* @__PURE__ */ e.jsx("span", { children: "The customer is close to renewal" })
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex gap-2.5 items-start", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: t.teamCanVerify, onChange: (n) => s({ ...t, teamCanVerify: n.target.checked }) }),
          /* @__PURE__ */ e.jsx("span", { children: "The customer’s team can join the Verify step" })
        ] }),
        (t.nearRenewal || !t.teamCanVerify) && /* @__PURE__ */ e.jsxs("div", { role: "note", className: "flex gap-2 rounded-lg bg-warnbg px-3 py-2.5 text-[13.5px] text-warn", children: [
          /* @__PURE__ */ e.jsx(Y, { size: 16, className: "mt-0.5 shrink-0" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            t.nearRenewal && /* @__PURE__ */ e.jsx("p", { children: "Talk to the account owner before sharing this review." }),
            !t.teamCanVerify && /* @__PURE__ */ e.jsx("p", { children: "Without the customer in Verify, changes can break their dashboards or alerts. You can still run the assessment." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { onBack: r, next: c, nextLabel: "Continue to pillars", disabled: !t.name, note: t.name ? void 0 : "Add the customer name to continue." })
  ] });
}
const Pe = {
  universal: { body: "Pipeline-wide fixes that help every signal at once.", checks: ["Unused resource attributes", "Memory protection and batching", "Kubernetes metadata allowlist", "Protected labels"] },
  logs: { body: "Where log volume comes from, and what nobody reads.", checks: ["Heavy attributes", "Split multi-line logs", "Duplicates and low-value logs", "TCO tier fit"] },
  traces: { body: "Keep the traces that explain problems; sample the rest.", checks: ["Tail sampling", "Health checks and probes", "Internal spans", "Span metrics first"] },
  metrics: { body: "Series that grow without adding insight.", checks: ["High-churn labels", "Span names per service", "Unused metrics", "Scrape intervals"] }
};
function Ss({ value: t, set: s, onBack: a, onNext: i, inv: r, setInv: c }) {
  var n, o, p;
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 2, lead: "Choose what to review. Universal always runs first, because pipeline fixes change the numbers for every other pillar." }),
    /* @__PURE__ */ e.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: Object.keys(Pe).map((d) => {
      const g = t.includes(d) || d === "universal", v = ne[d];
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          "aria-pressed": g,
          disabled: d === "universal",
          onClick: () => s(g ? t.filter((j) => j !== d) : [...t, d]),
          className: y("relative text-left rounded-xl border-2 bg-surface p-5 overflow-hidden", g ? v.border : "border-line hover:border-mute", d === "universal" && "cursor-default"),
          children: [
            /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: y("absolute inset-x-0 top-0 h-1", g ? v.bg : "bg-transparent") }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ e.jsx("span", { className: y("grid h-10 w-10 place-items-center rounded-lg", g ? `${v.bg} text-on-color` : "bg-sunk text-mute"), children: /* @__PURE__ */ e.jsx(v.icon, { size: 20 }) }),
              /* @__PURE__ */ e.jsx("span", { className: y("grid h-6 w-6 place-items-center rounded-full border-2", g ? `${v.border} ${v.bg} text-on-color` : "border-line"), children: g && /* @__PURE__ */ e.jsx(bt, { size: 14, strokeWidth: 3 }) })
            ] }),
            /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-[17px] font-semibold", children: [
              v.name,
              d === "universal" && /* @__PURE__ */ e.jsx("span", { className: "ml-2 text-[12.5px] font-medium text-universal", children: "Always runs first" })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: Pe[d].body }),
            /* @__PURE__ */ e.jsx("ul", { className: "mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]", children: Pe[d].checks.map((j) => /* @__PURE__ */ e.jsxs("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: y("mt-[7px] h-1.5 w-1.5 rounded-full shrink-0", v.bg) }),
              j
            ] }, j)) })
          ]
        },
        d
      );
    }) }),
    /* @__PURE__ */ e.jsx("section", { "aria-labelledby": "inv-title", className: y("mt-6 rounded-xl border-2 bg-surface p-5 shadow-sm", r.enabled ? "border-prism" : "border-line"), children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("grid h-10 w-10 shrink-0 place-items-center rounded-lg", r.enabled ? "bg-prism text-on-color" : "bg-sunk text-mute"), children: /* @__PURE__ */ e.jsx(Se, { size: 20 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ e.jsx("h2", { id: "inv-title", className: "text-[17px] font-semibold", children: "Investigate with Claude" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-mute", children: "Recommended" }),
          /* @__PURE__ */ e.jsxs("label", { className: "ml-auto flex items-center gap-2 text-[13.5px] font-medium", children: [
            /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: r.enabled, onChange: (d) => c({ ...r, enabled: d.target.checked }) }),
            "Turn on"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-1 max-w-[72ch]", children: "Goes beyond the playbook checks. Lens finds what drives the most volume: log patterns, span operations, and the metrics and labels behind series cardinality. It pulls live samples with cx and asks Claude what each one is and how to optimise it. Lens then checks every suggestion against real data, simulates the change, and works out the saving from official rates." }),
        r.enabled && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 text-[13.5px]", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium", children: "Contributors to analyse" }),
          /* @__PURE__ */ e.jsx("div", { role: "radiogroup", "aria-label": "Contributors to analyse", className: "inline-flex rounded-lg border border-line bg-sunk p-1 gap-1", children: [5, 8, 12].map((d) => /* @__PURE__ */ e.jsx("button", { role: "radio", "aria-checked": r.maxContributors === d, onClick: () => c({ ...r, maxContributors: d }), className: y("rounded-md px-3 py-1 font-medium", r.maxContributors === d ? "bg-surface shadow-sm" : "text-mute"), children: d === 8 ? "8 (default)" : d }, d)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-mute", children: "More contributors take longer. A typical run takes 1–3 minutes." })
        ] }),
        r.enabled && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 rounded-lg bg-sunk px-4 py-3", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "text-[13.5px] font-medium", children: [
            "TAM skills for metrics ",
            /* @__PURE__ */ e.jsx("span", { className: "font-normal text-mute", children: "(from the playbook’s AI Skills tab; run when Metrics is selected)" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 grid gap-2 text-[13.5px]", children: [
            /* @__PURE__ */ e.jsxs("label", { className: "flex gap-2 items-start", children: [
              /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: ((n = r.skills) == null ? void 0 : n.spanNames) !== !1, onChange: (d) => c({ ...r, skills: { ...r.skills, spanNames: d.target.checked } }) }),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("span", { className: "font-medium", children: "span-name-cardinality-analyzer" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: ": finds IDs and query strings in span names and writes the sanitisation patterns. Lens tests them on every real span name." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { className: "flex gap-2 items-start", children: [
              /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: ((o = r.skills) == null ? void 0 : o.buckets) !== !1, onChange: (d) => c({ ...r, skills: { ...r.skills, buckets: d.target.checked } }) }),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("span", { className: "font-medium", children: "span-metrics-bucket-optimizer" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: ": proposes histogram buckets from the live latency distribution. Lens computes the percentiles and the series change." })
              ] })
            ] }),
            ((p = r.skills) == null ? void 0 : p.buckets) !== !1 && /* @__PURE__ */ e.jsxs("label", { className: "flex flex-wrap items-center gap-2 pl-6", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: "Vendor the customer compares against" }),
              /* @__PURE__ */ e.jsx("select", { className: "rounded-lg border border-line bg-surface px-2 py-1", value: r.vendor, onChange: (d) => c({ ...r, vendor: d.target.value }), children: ["none / Coralogix-only", "Datadog", "New Relic", "Splunk Observability", "Grafana (Mimir/Prometheus)", "Dynatrace"].map((d) => /* @__PURE__ */ e.jsx("option", { children: d }, d)) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[12px] text-mute", children: "Lens collects the data each skill needs through cx, so no API key is shared and Claude runs with tools off." })
        ] }),
        r.enabled && /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-[12.5px] text-mute flex gap-1.5", children: [
          /* @__PURE__ */ e.jsx(jt, { size: 13, className: "mt-0.5 shrink-0" }),
          "Samples are masked on this Mac (emails, IPs, tokens, keys, card numbers) before they go to Claude through the claude CLI. Claude runs with tools switched off and nothing is saved as a session. The masked samples appear on each finding, exactly as sent."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx(pe, { onBack: a, next: i, nextLabel: "Continue to config", note: `${(/* @__PURE__ */ new Set(["universal", ...t])).size} of 4 pillars selected.` })
  ] });
}
const st = [[1, "1 hour", "Quickest, but misses daily patterns"], [6, "6 hours", ""], [24, "24 hours (default)", "Recommended: one full daily cycle"], [72, "3 days", ""], [168, "7 days", "Includes weekly patterns; slowest"]], Ls = [[5, "5 min"], [15, "15 min (default)"], [30, "30 min"], [60, "60 min"]], Ms = [100, 200, 500, 1e3];
function Re({ label: t, value: s, options: a, onChange: i }) {
  return /* @__PURE__ */ e.jsx("div", { role: "radiogroup", "aria-label": t, className: "inline-flex flex-wrap rounded-lg border border-line bg-sunk p-1 gap-1", children: a.map(([r, c]) => /* @__PURE__ */ e.jsx("button", { role: "radio", "aria-checked": s === r, onClick: () => i(r), className: y("rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-all", s === r ? "bg-surface text-ink shadow-sm" : "text-mute hover:text-ink"), children: c }, r)) });
}
function As({ win: t, setWin: s }) {
  var j;
  const a = t.mode ?? "relative", i = be(t), r = (j = st.find(([h]) => h === t.windowHours)) == null ? void 0 : j[2], c = a !== "relative" || t.windowHours !== de.windowHours || t.dupWindowMinutes !== de.dupWindowMinutes || t.rowLimit !== de.rowLimit, n = Intl.DateTimeFormat().resolvedOptions().timeZone, o = /* @__PURE__ */ new Date(), p = Ie(o), d = (h, k) => s({ ...t, mode: "range", start: Ie(h), end: Ie(k) }), g = (h) => new Date(h.getFullYear(), h.getMonth(), h.getDate()), v = () => {
    const h = new Date(Math.floor(o.getTime() / 36e5) * 36e5);
    d(new Date(h.getTime() - t.windowHours * 36e5), h);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "mt-10", "aria-labelledby": "win-title", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-4", children: [
      /* @__PURE__ */ e.jsx("h2", { id: "win-title", className: "text-[16px] font-semibold", children: "Analysis window" }),
      c && /* @__PURE__ */ e.jsx(B, { kind: "quiet", onClick: () => s(de), children: "Reset to defaults" })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-1 max-w-[68ch]", children: "How much data the checks look at. Whatever you choose, results are converted to a per-day figure. Usage numbers always use the last 7 complete days, leaving out today because it is still in progress." }),
    /* @__PURE__ */ e.jsxs("p", { className: "text-[13px] mt-2 mb-4", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-medium", children: "Defaults:" }),
      " ",
      /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: "last 24 hours for volume checks, 15 minutes for duplicate checks, 200 rows per query." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface divide-y divide-line shadow-sm", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[14px] font-medium", children: "Volume checks" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute", children: "Attribute sizes, noisy logs, spans, metric series" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Window type", className: "mb-3 inline-flex gap-4 text-[13.5px]", children: [["relative", "Last…"], ["range", "Custom date and time"]].map(([h, k]) => /* @__PURE__ */ e.jsx("button", { role: "tab", "aria-selected": a === h, onClick: () => h === "range" && a !== "range" ? t.start && t.end ? s({ ...t, mode: "range" }) : v() : s({ ...t, mode: h }), className: y("pb-1 border-b-2 font-medium", a === h ? "border-refract text-ink" : "border-transparent text-mute hover:text-ink"), children: k }, h)) }),
          a === "relative" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx(Re, { label: "Volume checks window", value: t.windowHours, options: st.map(([h, k]) => [h, k]), onChange: (h) => s({ ...t, mode: "relative", windowHours: h }) }),
            r && /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: r }),
            t.windowHours > 24 && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12.5px] text-warn", children: "Longer windows scan more data, so queries take longer and may hit Coralogix query limits on very large accounts." })
          ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 max-w-[560px]", children: [
              /* @__PURE__ */ e.jsx(H, { label: "Start", children: /* @__PURE__ */ e.jsx("input", { type: "datetime-local", className: V, value: t.start ?? "", max: t.end || p, onChange: (h) => s({ ...t, start: h.target.value }) }) }),
              /* @__PURE__ */ e.jsx(H, { label: "End", children: /* @__PURE__ */ e.jsx("input", { type: "datetime-local", className: V, value: t.end ?? "", max: p, onChange: (h) => s({ ...t, end: h.target.value }) }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-[12.5px]", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-mute py-1", children: "Quick picks:" }),
              [["Yesterday", () => d(new Date(g(o).getTime() - 864e5), g(o))], ["Last 7 full days", () => d(new Date(g(o).getTime() - 7 * 864e5), g(o))], ["Same 24 h last week", () => {
                const h = new Date(Math.floor(o.getTime() / 36e5) * 36e5 - 6048e5);
                d(new Date(h.getTime() - 864e5), h);
              }]].map(([h, k]) => /* @__PURE__ */ e.jsx("button", { onClick: k, className: "rounded-full border border-line px-2.5 py-1 hover:border-refract hover:text-refract", children: h }, h))
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: y("mt-2 text-[12.5px]", i ? "text-bad" : "text-mute"), role: i ? "alert" : void 0, children: i ?? `${Ue(ys(t))} in your time zone (${n}): ${Me(t.start).slice(0, 16).replace("T", " ")} to ${Me(t.end).slice(0, 16).replace("T", " ")} UTC. Between 1 hour and 7 days; the end must be in the past.` })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[14px] font-medium", children: "Duplicate checks" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute", children: "Logs shipped more than once" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(Re, { label: "Duplicate checks window", value: t.dupWindowMinutes, options: Ls, onChange: (h) => s({ ...t, dupWindowMinutes: h }) }),
          /* @__PURE__ */ e.jsxs("p", { className: "mt-2 text-[12.5px] text-mute", children: [
            a === "range" ? "Uses the final minutes of your custom range" : "A short window keeps this fast",
            "; the count is scaled up to a day."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 grid md:grid-cols-[220px_1fr] gap-3 items-start", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[14px] font-medium", children: "Rows per query" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute", children: "Upper limit on results returned" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(Re, { label: "Rows per query", value: t.rowLimit, options: Ms.map((h) => [h, h === 200 ? "200 (default)" : String(h)]), onChange: (h) => s({ ...t, rowLimit: h }) }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-[12.5px] text-mute", children: "Totals are computed inside each query, so this mostly limits how many items (services, templates) are listed." })
        ] })
      ] })
    ] })
  ] });
}
function at({ label: t, cur: s, latest: a, onChange: i, placeholder: r }) {
  const c = (() => {
    if (!s || !a) return null;
    const n = s.split(".").map(Number), o = a.split(".").map(Number);
    return n.some(isNaN) ? null : n[0] === o[0] && n[1] === o[1] ? o[2] - n[2] : (o[1] - n[1]) * 1e3;
  })();
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface p-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] font-medium", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("input", { "aria-label": `${t} in use`, className: y(V, "w-32 tabnum"), placeholder: r, value: s, onChange: (n) => i(n.target.value) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-mute text-[13px] whitespace-nowrap", children: "in use" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: "→" }),
      /* @__PURE__ */ e.jsx("span", { className: "tabnum text-[14px] font-medium", children: a ?? "…" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-mute text-[13px]", children: "latest" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-2.5", children: s ? c === 0 ? /* @__PURE__ */ e.jsx(J, { tone: "ok", icon: le, children: "Up to date" }) : c && c > 0 && c < 1e3 ? /* @__PURE__ */ e.jsxs(J, { tone: "warn", icon: Y, children: [
      c,
      " versions behind"
    ] }) : /* @__PURE__ */ e.jsx(J, { tone: "warn", icon: Y, children: "Behind the latest" }) : /* @__PURE__ */ e.jsx(J, { children: "Not set: the report assumes the latest" }) })
  ] });
}
function Ts({ dep: t, cfg: s, set: a, versions: i }) {
  const [r, c] = u.useState(null), [n, o] = u.useState(!1), [p, d] = u.useState(!1);
  u.useEffect(() => {
    const j = setTimeout(() => F("/api/config/detect", { method: "POST", body: JSON.stringify({ text: s.text }) }).then((h) => {
      c(h), a((k) => ({ ...k, label: k.text ? h.label : "", chartVersion: k.chartVersion || h.chartVersion || "", otelVersion: k.otelVersion || h.collectorVersion || "" }));
    }).catch(() => {
    }), 300);
    return () => clearTimeout(j);
  }, [s.text]);
  const g = (j) => j.text().then((h) => a({ ...s, text: h })), v = s.text && r && r.format !== "empty" ? t === "helm" && r.format !== "helm-values" ? "This looks like a collector config, not Coralogix Helm values." : t !== "helm" && r.format === "helm-values" ? `This looks like Coralogix Helm values, not a ${Q[t]} collector config.` : t !== "helm" && r.deployment && r.deployment !== t && r.deployment !== "standalone" ? `This looks like a ${Q[r.deployment]} config.` : "" : "";
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-2xl border border-line bg-surface shadow-sm", "aria-label": `${Q[t]} config`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 border-b border-line px-5 py-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "flex-1 text-[16px] font-semibold", children: Q[t] }),
      s.text ? /* @__PURE__ */ e.jsxs("span", { className: "text-[13px] text-mute", children: [
        "We detected: ",
        /* @__PURE__ */ e.jsx("b", { className: "text-ink", children: (r == null ? void 0 : r.label) ?? "…" })
      ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-mute", children: "Optional" }),
      s.text && /* @__PURE__ */ e.jsx(B, { kind: "quiet", onClick: () => {
        a({ ...s, text: "", label: "" }), d(!1);
      }, children: "Remove" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-5", children: [
      !s.text && !p ? /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs(
          "label",
          {
            onDragOver: (j) => {
              j.preventDefault(), o(!0);
            },
            onDragLeave: () => o(!1),
            onDrop: (j) => {
              j.preventDefault(), o(!1);
              const h = j.dataTransfer.files[0];
              h && g(h);
            },
            className: y("flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center cursor-pointer", n ? "border-refract bg-refract-soft" : "border-line hover:border-refract"),
            children: [
              /* @__PURE__ */ e.jsx(os, { size: 22, className: "text-refract" }),
              /* @__PURE__ */ e.jsxs("span", { className: "mt-2 text-[14.5px] font-semibold", children: [
                "Drop the ",
                t === "helm" ? "values.yaml" : `${Q[t]} collector config`
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-1 text-[13px] text-mute", children: "or click to choose a file" }),
              /* @__PURE__ */ e.jsx("input", { type: "file", "aria-label": `Choose a ${Q[t]} config file`, accept: ".yaml,.yml,.conf,.txt", className: "sr-only", onChange: (j) => {
                var h;
                return ((h = j.target.files) == null ? void 0 : h[0]) && g(j.target.files[0]);
              } })
            ]
          }
        ),
        /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-center", children: /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => d(!0), className: "text-[13.5px] text-refract hover:underline", "aria-label": `Paste the ${Q[t]} config instead`, children: "Paste it instead" }) })
      ] }) : /* @__PURE__ */ e.jsx("textarea", { "aria-label": `Paste ${Q[t]} configuration`, spellCheck: !1, className: "block w-full rounded-lg border border-line bg-paper px-3 py-2 font-mono text-[12.5px] h-44 outline-none resize-y", placeholder: "Paste YAML here", value: s.text, onChange: (j) => a({ ...s, text: j.target.value }) }),
      v && /* @__PURE__ */ e.jsxs("p", { role: "alert", className: "mt-2 flex gap-2 text-[13px] text-warn", children: [
        /* @__PURE__ */ e.jsx(Y, { size: 15, className: "mt-0.5 shrink-0" }),
        v,
        " Check it is in the right slot."
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid sm:grid-cols-2 gap-3", children: [
        t === "helm" && /* @__PURE__ */ e.jsx(at, { label: "Coralogix Helm chart", cur: s.chartVersion, latest: i == null ? void 0 : i.chart, onChange: (j) => a({ ...s, chartVersion: j }), placeholder: i == null ? void 0 : i.chart }),
        /* @__PURE__ */ e.jsx(at, { label: "OpenTelemetry Collector", cur: s.otelVersion, latest: i == null ? void 0 : i.collector, onChange: (j) => a({ ...s, otelVersion: j }), placeholder: "0.98.0" }),
        t !== "helm" && /* @__PURE__ */ e.jsx(H, { label: "Distribution", hint: "otelcol-contrib is recommended.", children: /* @__PURE__ */ e.jsxs("select", { className: V, value: s.distribution, onChange: (j) => a({ ...s, distribution: j.target.value }), children: [
          /* @__PURE__ */ e.jsx("option", { children: "otelcol-contrib" }),
          /* @__PURE__ */ e.jsx("option", { children: "otelcol" })
        ] }) })
      ] })
    ] })
  ] });
}
function $s({ deployments: t, cfgs: s, setCfgs: a, versions: i, onBack: r, onNext: c, win: n, setWin: o }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 3, lead: t.length > 1 ? "Add a config for each deployment type, if you have them. Lens edits each one in place, keeping comments and structure, and writes a separate optimised (and, if needed, upgraded) config per type. Any slot can stay empty." : "Optional. Add the customer’s values.yaml or collector config and Lens will edit it in place, keeping their comments and structure. Without one, it still runs and writes fresh snippets." }),
    /* @__PURE__ */ e.jsx("div", { className: "space-y-5", children: t.map((p) => /* @__PURE__ */ e.jsx(Ts, { dep: p, versions: i, cfg: s[p] ?? Le, set: (d) => a((g) => ({ ...g, [p]: typeof d == "function" ? d(g[p] ?? Le) : d })) }, p)) }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-[13px] text-mute", children: "Lens always recommends the latest chart and collector. If a type is behind, it also writes an upgraded config for it and lists every breaking change." }),
    /* @__PURE__ */ e.jsx(As, { win: n, setWin: o }),
    /* @__PURE__ */ e.jsx(pe, { onBack: r, next: c, nextLabel: "Run the assessment", disabled: !!be(n), note: be(n) ? `Fix the custom range first: ${be(n)}` : "Nothing is changed in the customer’s environment." })
  ] });
}
function Es({ req: t, pillars: s, onDone: a, run: i, onNext: r, onBack: c, win: n }) {
  var W, _;
  const [o, p] = u.useState({}), [d, g] = u.useState(""), [v, j] = u.useState(!!i), h = u.useRef(!!i);
  u.useEffect(() => {
    h.current || (h.current = !0, F("/api/runs", { method: "POST", body: JSON.stringify(t) }).then(({ id: N }) => {
      let $ = !1;
      const D = (P) => {
        P.type === "progress" && p((z) => ({ ...z, [P.checkId]: { ...z[P.checkId], ...P } })), P.type === "done" && !$ && ($ = !0, L(), clearInterval(K), F(`/api/runs/${N}`).then((z) => {
          a(N, z), j(!0);
        })), P.type === "error" && ($ = !0, g(P.message), L(), clearInterval(K));
      }, L = xs(N, D), K = setInterval(() => {
        $ || F(`/api/runs/${N}/events`).then((P) => P.forEach(D)).catch(() => {
        });
      }, 2e3);
    }).catch((N) => g(N.message)));
  }, []);
  const k = Object.values(o).filter((N) => N.checkId && N.checkId !== "gaps" && N.checkId !== "FINISHING" && N.checkId !== "LABELS"), x = o.FINISHING, f = (N) => N.startsWith("UNI") ? "universal" : N.startsWith("LOG") ? "logs" : N.startsWith("SPAN") ? "traces" : "metrics", I = k.find((N) => N.checkId === "INVESTIGATE"), T = k.filter((N) => ["done", "skipped", "failed"].includes(N.status)).length, U = v ? 100 : k.length ? Math.min(97, Math.round(T / k.length * 100)) : 4, G = ((W = i == null ? void 0 : i.findings) == null ? void 0 : W.length) ?? k.reduce((N, $) => {
    var D, L;
    return N + +(((L = (D = $.message) == null ? void 0 : D.match(/^(\d+) finding/)) == null ? void 0 : L[1]) ?? 0);
  }, 0), te = (N, $) => N === "done" && /finding/.test($ ?? "") ? /* @__PURE__ */ e.jsx(Y, { size: 17, className: "text-refract" }) : N === "done" ? /* @__PURE__ */ e.jsx(le, { size: 17, className: "text-ok" }) : N === "running" ? /* @__PURE__ */ e.jsx(me, { size: 17, className: "text-prism animate-spin" }) : N === "failed" ? /* @__PURE__ */ e.jsx($e, { size: 17, className: "text-bad" }) : N === "skipped" ? /* @__PURE__ */ e.jsx(Ce, { size: 17, className: "text-mute" }) : /* @__PURE__ */ e.jsx(Ce, { size: 17, className: "text-line" });
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 4, lead: `Lens is running the playbook’s discovery queries over ${n.mode === "range" ? `data from ${wt(n)}` : `the last ${Ue(n.windowHours)} of data`}, one check at a time. Each check either finds something to improve, finds nothing, or is skipped with a reason.` }),
    d ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-bad/40 bg-surface px-5 py-4", children: [
      /* @__PURE__ */ e.jsxs("p", { className: "text-bad font-medium", children: [
        "The assessment stopped: ",
        d
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-mute text-[13.5px] mt-1", children: "Check the team in Connect, then run it again." })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl bg-rail text-rail-ink px-6 py-5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-end justify-between gap-6", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-rail-mute", children: v ? "Assessment complete" : T === k.length && k.length ? `Finishing up${x != null && x.message ? `: ${x.message}` : "…"}` : "Running checks" }),
          /* @__PURE__ */ e.jsxs("p", { className: "font-display text-[28px] font-semibold tabnum leading-none mt-1", children: [
            U,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "flex gap-8 text-[13px] text-right", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { className: "text-rail-mute", children: "Checks finished" }),
            /* @__PURE__ */ e.jsxs("dd", { className: "text-[20px] font-semibold tabnum", children: [
              T,
              "/",
              k.length || "…"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { className: "text-rail-mute", children: v ? "Findings" : "Findings so far" }),
            /* @__PURE__ */ e.jsx("dd", { className: "text-[20px] font-semibold tabnum", children: G })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-4 h-2 rounded-full bg-white/10 overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full bg-[#38BDF8] lens-grow", style: { width: `${U}%` } }) })
    ] }),
    I && /* @__PURE__ */ e.jsxs("section", { className: "mt-6 rounded-xl border-2 border-prism bg-surface px-5 py-4 shadow-sm", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx(Se, { size: 18, className: "text-prism" }),
        /* @__PURE__ */ e.jsx("h2", { className: "text-[15px] font-semibold flex-1", children: "Investigate with Claude" }),
        I.status === "running" ? /* @__PURE__ */ e.jsx(me, { size: 17, className: "text-prism animate-spin" }) : I.status === "done" ? /* @__PURE__ */ e.jsx(le, { size: 17, className: "text-ok" }) : /* @__PURE__ */ e.jsx(Y, { size: 17, className: "text-p2" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13.5px] text-mute", children: I.message ?? "Waiting for the playbook checks to finish" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-6 grid md:grid-cols-2 gap-4", children: ["universal", "logs", "traces", "metrics"].filter((N) => N === "universal" || s.includes(N)).map((N) => {
      const $ = ne[N], D = k.filter((L) => L.checkId !== "INVESTIGATE" && f(L.checkId) === N);
      return /* @__PURE__ */ e.jsxs("section", { className: "rounded-xl border border-line bg-surface overflow-hidden", children: [
        /* @__PURE__ */ e.jsxs("h2", { className: "flex items-center gap-2 border-b border-line px-4 py-2.5 text-[14.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("span", { className: y("grid h-6 w-6 place-items-center rounded-md text-on-color", $.bg), children: /* @__PURE__ */ e.jsx($.icon, { size: 14 }) }),
          $.name,
          /* @__PURE__ */ e.jsxs("span", { className: "ml-auto text-[12.5px] font-normal text-mute", children: [
            D.filter((L) => L.status !== "waiting" && L.status !== "running").length,
            " of ",
            D.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("ul", { "aria-live": "polite", children: D.length ? D.map((L) => {
          var K;
          return /* @__PURE__ */ e.jsxs("li", { className: "flex items-start gap-2.5 px-4 py-2 text-[13.5px] border-b border-line last:border-0", children: [
            /* @__PURE__ */ e.jsx("span", { className: "mt-0.5", "aria-label": /finding/.test(L.message ?? "") ? "Found something to improve" : L.status, children: te(L.status, L.message) }),
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: y(L.status === "waiting" && "text-mute"), children: L.title }),
              L.message && L.status !== "running" && /* @__PURE__ */ e.jsx("span", { className: y("block text-[12.5px]", /finding/.test(L.message) ? "text-refract font-medium" : "text-mute"), children: L.message === "Nothing to improve" ? "Already in good shape" : /finding/.test(L.message) ? `Found ${((K = L.message.match(/^\d+/)) == null ? void 0 : K[0]) ?? ""} thing${/^1 /.test(L.message) ? "" : "s"} to improve` : L.message })
            ] })
          ] }, L.checkId);
        }) : /* @__PURE__ */ e.jsx("li", { className: "px-4 py-3 text-[13px] text-mute", children: "Waiting to start…" }) })
      ] }, N);
    }) }),
    /* @__PURE__ */ e.jsx(pe, { onBack: v ? void 0 : c, next: r, disabled: !v, nextLabel: v ? `Review ${((_ = i == null ? void 0 : i.findings) == null ? void 0 : _.length) ?? 0} findings` : "Working…", note: v ? "Next, go through each finding with the customer." : "Read-only. You can watch each check finish." })
  ] });
}
const Fe = [{ v: "verified", l: "Verified", k: "v", icon: le, on: "bg-ok text-on-color border-ok" }, { v: "needs-scoping", l: "Needs scoping", k: "s", icon: Ce, on: "bg-p2 text-on-color border-p2" }, { v: "rejected", l: "Rejected", k: "r", icon: $e, on: "bg-bad text-on-color border-bad" }], Ds = { "not-started": "Not started", "in-progress": "In progress", done: "Done", pending: "Pending" }, rt = (t) => t.savings.kind === "units" ? `${ee(t.savings.unitsPerDay)} units/day` : t.savings.kind === "needs-scoping" ? "To be sized" : t.savings.kind === "severity-only" ? "Better error signal" : "Health fix";
function Is({ run: t, runId: s, setRun: a, onBack: i, onNext: r }) {
  var $, D, L, K, P, z, se, ae, re, ie, X, Z, oe, m, w, A, E, ce, fe, ge;
  const [c, n] = u.useState(0), [o, p] = u.useState({}), [d, g] = u.useState("all"), [v, j] = u.useState("all"), h = t.findings, k = h.filter((l) => (d === "all" || l.pillar === d) && (v === "all" || (v === "open" ? l.verifyStatus === "candidate" : l.verifyStatus === v))), x = k[Math.min(c, k.length - 1)], f = Math.max(...h.map((l) => l.savings.unitsPerDay ?? 0), 1e-4), [I, T] = u.useState(""), U = (l, b) => F(`/api/runs/${s}/findings/${encodeURIComponent(l.ruleId)}`, { method: "PATCH", body: JSON.stringify(b) }).then((C) => {
    T(""), a((R) => ({ ...R, findings: R.findings.map((O) => O.ruleId === C.ruleId ? C : O) }));
  }).catch((C) => T(`Could not save that decision: ${C.message}`));
  u.useEffect(() => {
    const l = (b) => {
      const C = b.target.tagName;
      if (C === "INPUT" || C === "SELECT" || C === "TEXTAREA") return;
      (b.key === "j" || b.key === "ArrowDown") && (b.preventDefault(), n((O) => Math.min(k.length - 1, O + 1))), (b.key === "k" || b.key === "ArrowUp") && (b.preventDefault(), n((O) => Math.max(0, O - 1)));
      const R = Fe.find((O) => O.k === b.key);
      R && x && U(x, { verifyStatus: R.v });
    };
    return addEventListener("keydown", l), () => removeEventListener("keydown", l);
  }, [c, t, d, v]);
  const G = h.reduce((l, b) => ({ ...l, [b.verifyStatus]: (l[b.verifyStatus] ?? 0) + 1 }), {}), te = h.length - (G.candidate ?? 0), W = x ? ne[x.pillar] : null, _ = x ? _e[x.phase] : null, N = ($ = x == null ? void 0 : x.evidence) == null ? void 0 : $.find((l) => l.text && l.text !== "skill");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 5, lead: "Go through each finding with the customer. Mark it Verified when they agree, Needs scoping when more information is needed, or Rejected if they rely on that data. Only Verified findings go into the customer report and the generated config." }),
    I && /* @__PURE__ */ e.jsx("div", { role: "alert", className: "mb-3 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: I }),
    ((D = t.notes) == null ? void 0 : D.length) > 0 && /* @__PURE__ */ e.jsx(he, { summary: `Checks that found no data (${t.notes.length})`, children: /* @__PURE__ */ e.jsx("ul", { className: "space-y-1 text-[13.5px] list-disc pl-5", children: t.notes.map((l) => /* @__PURE__ */ e.jsx("li", { children: l }, l)) }) }),
    ((L = t.notes) == null ? void 0 : L.length) > 0 && /* @__PURE__ */ e.jsx("div", { className: "mb-3" }),
    (K = t.eligibility) == null ? void 0 : K.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "mb-3 flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: [
      /* @__PURE__ */ e.jsx(Y, { size: 16, className: "mt-0.5 shrink-0" }),
      l
    ] }, l)),
    /* @__PURE__ */ e.jsx(Nt, { baseline: kt(t), findings: h }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2 text-[13px]", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "mr-1 font-medium", children: [
        /* @__PURE__ */ e.jsx("span", { className: "tabnum", children: te }),
        " of ",
        h.length,
        " reviewed"
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-ok", children: [
        G.verified ?? 0,
        " verified"
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-p2", children: [
        G["needs-scoping"] ?? 0,
        " need scoping"
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-bad", children: [
        G.rejected ?? 0,
        " rejected"
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "ml-auto flex flex-wrap gap-1.5", children: [
        ["all", "universal", "logs", "traces", "metrics"].map((l) => /* @__PURE__ */ e.jsx("button", { "aria-pressed": d === l, onClick: () => {
          g(l), n(0);
        }, className: y("rounded-full border px-3 py-1", d === l ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-mute"), children: l === "all" ? "All pillars" : ne[l].name }, l)),
        /* @__PURE__ */ e.jsxs("select", { "aria-label": "Filter by status", value: v, onChange: (l) => {
          j(l.target.value), n(0);
        }, className: "rounded-full border border-line bg-surface px-3 py-1", children: [
          /* @__PURE__ */ e.jsx("option", { value: "all", children: "Any status" }),
          /* @__PURE__ */ e.jsx("option", { value: "open", children: "To review" }),
          /* @__PURE__ */ e.jsx("option", { value: "verified", children: "Verified" }),
          /* @__PURE__ */ e.jsx("option", { value: "needs-scoping", children: "Needs scoping" }),
          /* @__PURE__ */ e.jsx("option", { value: "rejected", children: "Rejected" })
        ] })
      ] })
    ] }),
    h.length ? /* @__PURE__ */ e.jsxs("div", { className: "mt-3 grid lg:grid-cols-[380px_1fr] gap-4 items-start", children: [
      /* @__PURE__ */ e.jsxs("ol", { className: "rounded-xl border border-line bg-surface overflow-hidden lg:sticky lg:top-4 max-h-[70vh] overflow-y-auto", "aria-label": "Findings", children: [
        k.map((l, b) => {
          const C = ne[l.pillar], R = Fe.find((O) => O.v === l.verifyStatus);
          return /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs("button", { onClick: () => n(b), "aria-current": b === c, className: y("w-full text-left flex gap-3 px-3.5 py-3 border-b border-line", b === c ? "bg-refract-soft" : "hover:bg-sunk"), children: [
            /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: y("w-1 self-stretch rounded-full", C.bg) }),
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 text-[12px] text-mute", children: [
                /* @__PURE__ */ e.jsx("span", { className: "tabnum", children: l.id }),
                /* @__PURE__ */ e.jsxs("span", { className: _e[l.phase].cls, children: [
                  "Phase ",
                  l.phase
                ] }),
                l.priority === "high" && /* @__PURE__ */ e.jsx(Ye, { size: 13, className: "text-warn", "aria-label": "Protected label" }),
                l.source === "investigate" && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 text-prism", children: [
                  /* @__PURE__ */ e.jsx(Se, { size: 12, "aria-hidden": !0 }),
                  "Live data"
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[14px] font-medium leading-snug mt-0.5", children: l.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "mt-1.5 flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-1.5 flex-1 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: y("block h-full rounded-full", C.bg), style: { width: `${(l.savings.unitsPerDay ?? 0) / f * 100}%` } }) }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] tabnum text-mute w-24 text-right", children: rt(l) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "mt-0.5", children: R ? /* @__PURE__ */ e.jsx(R.icon, { size: 17, className: l.verifyStatus === "verified" ? "text-ok" : l.verifyStatus === "rejected" ? "text-bad" : "text-p2", "aria-label": R.l }) : /* @__PURE__ */ e.jsx("span", { className: "block h-[17px] w-[17px] rounded-full border-2 border-line", "aria-label": "To review" }) })
          ] }) }, l.ruleId);
        }),
        !k.length && /* @__PURE__ */ e.jsx("li", { className: "px-4 py-6 text-[13.5px] text-mute", children: "No findings match these filters." })
      ] }),
      x && W && _ && /* @__PURE__ */ e.jsxs("article", { className: "rounded-xl border border-line bg-surface overflow-hidden", "aria-label": x.title, children: [
        x.priority === "high" && /* @__PURE__ */ e.jsxs("div", { role: "alert", className: "flex gap-2 bg-warnbg px-5 py-2.5 text-[13.5px] text-warn font-medium", children: [
          /* @__PURE__ */ e.jsx(Ye, { size: 16, className: "mt-0.5" }),
          "Protected label warning: Infrastructure Explorer depends on these attributes."
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "px-6 pt-5 pb-6", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ e.jsxs("span", { className: y("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12.5px] font-medium text-on-color", W.bg), children: [
              /* @__PURE__ */ e.jsx(W.icon, { size: 13 }),
              W.name
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: y("rounded-md px-2 py-0.5 text-[12.5px] font-medium", _.soft, _.cls), children: [
              "Phase ",
              x.phase,
              ": ",
              _.name
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-mute tabnum", children: x.id }),
            x.source === "investigate" && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-prism/10 px-2 py-0.5 text-[12.5px] font-medium text-prism", children: [
              /* @__PURE__ */ e.jsx(Se, { size: 13 }),
              "Found in live data"
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("h2", { className: "mt-2 font-display text-[22px] font-semibold tracking-[-0.01em] leading-snug", children: x.title }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-4 grid sm:grid-cols-3 gap-px rounded-lg overflow-hidden bg-line border border-line text-[13px]", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ e.jsx("p", { className: "text-mute", children: "Estimated impact" }),
              /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[17px] font-semibold tabnum", children: rt(x) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ e.jsx("p", { className: "text-mute", children: "Effort" }),
              /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[15px] font-medium capitalize", children: x.effort.replace("-", " to ") })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "bg-surface px-4 py-3", children: [
              /* @__PURE__ */ e.jsx("p", { className: "text-mute", children: "Who makes the change" }),
              /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[15px] font-medium", children: x.owner })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("h3", { className: "mt-5 text-[14px] font-semibold", children: "What’s happening" }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[15px] leading-relaxed max-w-[70ch]", children: x.plain }),
          x.observedVolume && /* @__PURE__ */ e.jsxs("p", { className: "mt-2 text-[13.5px] text-mute", children: [
            "Seen in the data: ",
            x.observedVolume
          ] }),
          ((se = (z = (P = x.display) == null ? void 0 : P.samples) == null ? void 0 : z.items) == null ? void 0 : se.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ e.jsxs("h3", { className: "text-[14px] font-semibold", children: [
              x.display.samples.label,
              x.display.samples.items.some((l) => l.after !== void 0) && ": before and after the change"
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "mt-2 space-y-2", children: x.display.samples.items.slice(0, 3).map((l, b) => /* @__PURE__ */ e.jsxs("div", { className: y("grid gap-px rounded-lg overflow-hidden border border-line bg-line", l.after !== void 0 && "md:grid-cols-2"), children: [
              /* @__PURE__ */ e.jsxs("pre", { className: "bg-bad/5 bg-surface p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] font-sans font-semibold text-mute mb-1", children: l.after !== void 0 ? "Before" : `Sample ${b + 1}` }),
                l.before
              ] }),
              l.after !== void 0 && /* @__PURE__ */ e.jsxs("pre", { className: "bg-surface p-3 text-[12px] font-mono whitespace-pre-wrap break-words max-h-48 overflow-auto", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] font-sans font-semibold text-ok mb-1", children: "After" }),
                l.after
              ] })
            ] }, b)) }),
            x.display.samples.afterNote && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[12.5px] text-mute", children: x.display.samples.afterNote })
          ] }),
          x.source === "investigate" && ((ie = (re = (ae = x.display) == null ? void 0 : ae.bars) == null ? void 0 : re.items) == null ? void 0 : ie.length) > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold", children: x.display.bars.label }),
            /* @__PURE__ */ e.jsx("ul", { className: "mt-2 space-y-1.5", children: x.display.bars.items.map((l) => {
              const b = Math.max(...x.display.bars.items.map((C) => C.value), 1e-9);
              return /* @__PURE__ */ e.jsxs("li", { className: "grid grid-cols-[minmax(120px,220px)_1fr_auto] items-center gap-3 text-[13px]", children: [
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[12px] truncate", title: l.name, children: l.name }),
                /* @__PURE__ */ e.jsx("span", { className: "h-2 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-metrics", style: { width: `${l.value / b * 100}%` } }) }),
                /* @__PURE__ */ e.jsx("span", { className: "text-mute tabnum", children: l.text })
              ] }, l.name);
            }) })
          ] }),
          x.source === "investigate" && ((oe = (Z = (X = x.display) == null ? void 0 : X.table) == null ? void 0 : Z.rows) == null ? void 0 : oe.length) > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-4 overflow-x-auto rounded-lg border border-line", children: /* @__PURE__ */ e.jsxs("table", { className: "w-full text-[12.5px]", children: [
            /* @__PURE__ */ e.jsx("caption", { className: "text-left px-3 py-2 font-semibold text-[13.5px] bg-sunk", children: x.display.table.summary }),
            /* @__PURE__ */ e.jsx("thead", { className: "text-mute", children: /* @__PURE__ */ e.jsx("tr", { children: x.display.table.headers.map((l) => /* @__PURE__ */ e.jsx("th", { className: "text-left px-3 py-1.5 font-medium", children: l }, l)) }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: x.display.table.rows.map((l, b) => /* @__PURE__ */ e.jsx("tr", { className: "border-t border-line", children: l.map((C, R) => /* @__PURE__ */ e.jsx("td", { className: "px-3 py-1.5 tabnum", children: C }, R)) }, b)) })
          ] }) }),
          ((m = x.display) == null ? void 0 : m.validation) && /* @__PURE__ */ e.jsxs("div", { className: y("mt-4 rounded-lg px-4 py-3 text-[13.5px]", x.display.validation.ok ? "bg-ok/10" : "bg-warnbg"), children: [
            /* @__PURE__ */ e.jsxs("p", { className: y("font-semibold flex items-center gap-1.5", x.display.validation.ok ? "text-ok" : "text-warn"), children: [
              x.display.validation.ok ? /* @__PURE__ */ e.jsx(le, { size: 15 }) : /* @__PURE__ */ e.jsx(Y, { size: 15 }),
              x.display.validation.ok ? "Validated against live data" : "Not validated"
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "mt-1", children: x.display.validation.result }),
            /* @__PURE__ */ e.jsx("code", { className: "mt-1 block text-[12px] text-mute break-all", children: x.display.validation.query })
          ] }),
          ((A = (w = x.display) == null ? void 0 : w.impact) == null ? void 0 : A.length) > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-line bg-line", children: x.display.impact.map((l, b) => /* @__PURE__ */ e.jsxs("div", { className: "bg-surface px-3 py-2.5", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-mute", children: l.label }),
            /* @__PURE__ */ e.jsx("p", { className: y("text-[14.5px] font-semibold tabnum", b === x.display.impact.length - 1 && "text-ok"), children: l.value })
          ] }, b)) }),
          x.source === "investigate" && ((E = x.change) == null ? void 0 : E.snippet) && /* @__PURE__ */ e.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold", children: x.change.snippet.startsWith("#") ? "Change at the source" : "Proposed transform" }),
            /* @__PURE__ */ e.jsx("pre", { className: "mt-2 overflow-x-auto rounded-lg bg-sunk p-3 text-[12px] font-mono max-h-72", children: x.change.snippet })
          ] }),
          /* @__PURE__ */ e.jsx("h3", { className: "mt-5 text-[14px] font-semibold", children: "What to do" }),
          /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[15px] leading-relaxed max-w-[70ch]", children: x.nextStep }),
          !!x.verifyChecklist.length && /* @__PURE__ */ e.jsxs("div", { className: "mt-5 rounded-lg bg-sunk px-4 py-3.5", children: [
            /* @__PURE__ */ e.jsxs("h3", { className: "text-[14px] font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ e.jsx(cs, { size: 16 }),
              "Verify with the customer"
            ] }),
            x.verifyChecklist.map((l) => {
              const b = x.ruleId + l;
              return /* @__PURE__ */ e.jsxs("label", { className: "flex gap-2.5 items-start text-[14px] py-1", children: [
                /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: !!o[b], onChange: (C) => p({ ...o, [b]: C.target.checked }) }),
                l
              ] }, b);
            })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [
            Fe.map((l) => /* @__PURE__ */ e.jsxs("button", { "aria-pressed": x.verifyStatus === l.v, onClick: () => U(x, { verifyStatus: l.v }), className: y("inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[14px] font-medium", x.verifyStatus === l.v ? l.on : "border-line hover:bg-sunk"), children: [
              /* @__PURE__ */ e.jsx(l.icon, { size: 16 }),
              l.l,
              /* @__PURE__ */ e.jsx("kbd", { className: "ml-1 text-mute", children: l.k })
            ] }, l.v)),
            /* @__PURE__ */ e.jsxs("label", { className: "ml-auto flex items-center gap-2 text-[13px] text-mute", children: [
              "Progress",
              /* @__PURE__ */ e.jsx("select", { className: "rounded-lg border border-line bg-surface px-2 py-1.5 text-[13px] text-ink", value: x.progress, onChange: (l) => U(x, { progress: l.target.value }), children: Object.entries(Ds).map(([l, b]) => /* @__PURE__ */ e.jsx("option", { value: l, children: b }, l)) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-6 space-y-2", children: [
            (x.detail || x.caveats.length > 0) && /* @__PURE__ */ e.jsxs(he, { summary: "Details and caveats", children: [
              x.detail && /* @__PURE__ */ e.jsx("p", { className: "whitespace-pre-wrap text-[13.5px] leading-relaxed", children: x.detail }),
              x.caveats.map((l) => /* @__PURE__ */ e.jsxs("p", { className: "mt-2 text-[13.5px] flex gap-2", children: [
                /* @__PURE__ */ e.jsx(Y, { size: 14, className: "mt-0.5 shrink-0 text-p2" }),
                l
              ] }, l))
            ] }),
            /* @__PURE__ */ e.jsxs(he, { summary: "How the estimate was worked out", children: [
              /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] leading-relaxed", children: x.savings.basis }),
              N && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("p", { className: "mt-3 text-[12.5px] text-mute", children: [
                  "Discovery query, ",
                  N.start ? `run over ${Ae(N.start)} to ${Ae(N.end)}` : `last ${N.window}`,
                  N.error ? "" : `, ${((ce = N.rows) == null ? void 0 : ce.length) ?? 0} rows`
                ] }),
                /* @__PURE__ */ e.jsx("pre", { className: "mt-1 overflow-x-auto rounded-lg bg-sunk p-3 text-[12px] font-mono", children: N.text }),
                N.error && /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-bad mt-1", children: N.error.slice(0, 200) })
              ] })
            ] }),
            ((fe = x.change) == null ? void 0 : fe.snippet) && /* @__PURE__ */ e.jsx(he, { summary: "Proposed config change", children: /* @__PURE__ */ e.jsx("pre", { className: "overflow-x-auto rounded-lg bg-sunk p-3 text-[12px] font-mono max-h-72", children: x.change.snippet }) }),
            /* @__PURE__ */ e.jsx(he, { summary: `Sources (${x.sources.length})`, children: /* @__PURE__ */ e.jsx("ul", { className: "text-[13.5px] space-y-1", children: x.sources.map((l, b) => /* @__PURE__ */ e.jsxs("li", { children: [
              l.url ? /* @__PURE__ */ e.jsx("a", { className: "text-refract hover:underline", href: l.url, target: "_blank", rel: "noreferrer", children: l.title }) : l.title,
              l.internal && /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: " (internal)" })
            ] }, b)) }) })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "mt-4", children: /* @__PURE__ */ e.jsx(ze, { title: "No findings: this environment already follows the playbook for the selected pillars.", next: "Try adding a config or more pillars." }) }),
    !!((ge = t.gaps) != null && ge.length) && /* @__PURE__ */ e.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "text-[17px] font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(vt, { size: 17, className: "text-prism" }),
        "Where freed quota could go"
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-1", children: "Adoption gaps and expansion ideas. These are not savings." }),
      /* @__PURE__ */ e.jsx("ul", { className: "mt-3 grid sm:grid-cols-2 gap-3", children: t.gaps.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "rounded-xl border border-line bg-surface px-4 py-3", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[14.5px] font-semibold", children: l.area }),
        /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] text-mute mt-0.5", children: l.detail }),
        /* @__PURE__ */ e.jsx("p", { className: "text-[13.5px] mt-1.5", children: l.opportunity })
      ] }, l.area)) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { onBack: i, next: r, nextLabel: "Continue to remediation", note: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Keys: ",
      /* @__PURE__ */ e.jsx("kbd", { children: "j" }),
      " ",
      /* @__PURE__ */ e.jsx("kbd", { children: "k" }),
      " move, ",
      /* @__PURE__ */ e.jsx("kbd", { children: "v" }),
      " verified, ",
      /* @__PURE__ */ e.jsx("kbd", { children: "s" }),
      " needs scoping, ",
      /* @__PURE__ */ e.jsx("kbd", { children: "r" }),
      " rejected."
    ] }) })
  ] });
}
const Ps = {
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
function nt(t, s) {
  const a = t.split("/"), i = a.at(-1), r = a.length > 1 ? `${Q[{ kubernetes: "helm" }[a[0]] ?? a[0]] ?? a[0]}: ` : "", c = Rs(i, s);
  return [c[0], r + c[1]];
}
function Rs(t, s) {
  if (s) {
    if (t === s.customerHtml) return ["customer", "Customer report, ready to share or print to PDF"];
    if (t === s.customerMd) return ["customer", "Customer report as Markdown"];
    if (t === s.customerJson) return ["customer", "Customer report data (JSON Schema 1.0)"];
    if (t === s.internalHtml) return ["tam", "Internal report with queries, evidence and sources"];
    if (t === s.internalMd) return ["tam", "Internal report as Markdown"];
    if (t === s.internalJson) return ["tam", "Internal report data"];
  }
  return Ps[t] ?? (t.endsWith(".csv") ? ["tam", "Metrics Label Analyzer export"] : ["tam", "Data export"]);
}
function Fs({ run: t, runId: s, onBack: a, onRestart: i }) {
  var ae, re, ie, X, Z, oe;
  const [r, c] = u.useState(""), n = (m) => {
    var w;
    c(m ? "draft" : "final"), $(""), hs(`/api/runs/${s}/bundle`, { draft: m }, `${((w = t.customer) == null ? void 0 : w.name) || "report"}${m ? " (draft)" : ""}.zip`).catch((A) => $(A.message)).finally(() => c(""));
  }, [o, p] = u.useState("plan"), [d, g] = u.useState(null), [v, j] = u.useState(t.findings.filter((m) => {
    var w, A;
    return m.verifyStatus === "verified" && ((A = (w = m.change) == null ? void 0 : w.ops) == null ? void 0 : A.length);
  }).map((m) => m.ruleId)), h = (ae = t.deployments) != null && ae.length ? t.deployments : [t.deployment], [k, x] = u.useState(h[0]), [f, I] = u.useState(null), [T, U] = u.useState(null), [G, te] = u.useState(!1), [W, _] = u.useState(!1), [N, $] = u.useState("");
  u.useEffect(() => {
    F(`/api/runs/${s}/report?audience=internal`).then(g);
  }, [s]), u.useEffect(() => {
    F(`/api/runs/${s}/preview`, { method: "POST", body: JSON.stringify({ selected: v, deployment: k }) }).then(I).catch((m) => I({ error: m.message }));
  }, [v.join(), k]);
  const D = t.findings.filter((m) => {
    var w, A;
    return (A = (w = m.change) == null ? void 0 : w.ops) == null ? void 0 : A.length;
  }), L = () => {
    _(!0), $(""), F(`/api/runs/${s}/outputs`, { method: "POST", body: JSON.stringify({ allowDraft: G }) }).then(U).catch((m) => $(m.message)).finally(() => _(!1));
  };
  if (!d) return /* @__PURE__ */ e.jsx(ze, { title: "Building the roadmap…" });
  const K = ((re = f == null ? void 0 : f.rows) == null ? void 0 : re.filter((m) => m.kind !== "same").length) ?? 0, P = d.summary.currentUnitsPerDay, z = [["plan", "Phased roadmap"], ["config", "Config changes"], ...d.upgrade ? [["upgrade", "Upgrade"]] : [], ["export", "Export"]], se = t.findings.filter((m) => m.verifyStatus === "verified").length;
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xe, { step: 6, lead: "Here is the plan. Changes are grouped by effort, so the team can start with quick, config-only wins while bigger changes are scheduled. Then review the config changes and export the reports." }),
    /* @__PURE__ */ e.jsx(Nt, { baseline: kt(t), findings: t.findings, compact: !0 }),
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Remediation", className: "mt-6 flex gap-1 border-b border-line", children: z.map(([m, w]) => /* @__PURE__ */ e.jsx("button", { role: "tab", "aria-selected": o === m, onClick: () => p(m), className: y("px-4 py-2.5 text-[14px] font-medium -mb-px border-b-2", o === m ? "border-refract text-ink" : "border-transparent text-mute hover:text-ink"), children: w }, m)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-6", children: [
      o === "plan" && /* @__PURE__ */ e.jsxs("section", { "aria-label": "Phased roadmap", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "sr-only", children: "Phased roadmap" }),
        /* @__PURE__ */ e.jsx("ol", { className: "grid md:grid-cols-3 gap-4", children: d.roadmap.map((m) => {
          const w = _e[m.phase], A = d.findings.filter((E) => E.phase === m.phase);
          return /* @__PURE__ */ e.jsxs("li", { className: "rounded-xl border border-line bg-surface overflow-hidden", children: [
            /* @__PURE__ */ e.jsx("div", { className: y("h-1.5", w.bg) }),
            /* @__PURE__ */ e.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ e.jsxs("p", { className: y("text-[13px] font-semibold", w.cls), children: [
                "Phase ",
                m.phase
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[18px] font-semibold mt-0.5", children: w.name }),
              /* @__PURE__ */ e.jsxs("p", { className: "text-[13px] text-mute", children: [
                w.long,
                ". Usually ",
                w.when.toLowerCase(),
                "."
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] text-mute", children: "Total saved after this phase" }),
              /* @__PURE__ */ e.jsxs("p", { className: "font-display text-[26px] font-semibold tabnum leading-tight", children: [
                ee(m.cumulativeUnitsPerDay),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-normal text-mute", children: " units/day" })
              ] }),
              P && /* @__PURE__ */ e.jsx("div", { className: "mt-2 h-1.5 rounded-full bg-sunk overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: y("h-full", w.bg), style: { width: `${Math.min(100, m.cumulativeUnitsPerDay / P * 100)}%` } }) }),
              /* @__PURE__ */ e.jsx("ul", { className: "mt-4 space-y-1.5 text-[13.5px]", children: A.length ? A.map((E) => /* @__PURE__ */ e.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: y("mt-1.5 h-2 w-2 rounded-full shrink-0", ne[E.pillar].bg) }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: E.title }),
                /* @__PURE__ */ e.jsx("span", { className: "tabnum text-mute text-[12.5px]", children: E.savings.kind === "units" ? ee(E.savings.unitsPerDay) : "—" })
              ] }, E.id)) : /* @__PURE__ */ e.jsx("li", { className: "text-mute", children: "Nothing in this phase." }) })
            ] })
          ] }, m.phase);
        }) }),
        d.combined.largest && /* @__PURE__ */ e.jsxs("p", { className: "mt-4 text-[14px] max-w-[80ch]", children: [
          "The largest single saving is ",
          /* @__PURE__ */ e.jsx("b", { children: d.combined.largest.title.toLowerCase() }),
          " (",
          ee(d.combined.largest.unitsPerDay),
          " units/day)",
          (() => {
            var w;
            const m = (w = d.findings.find((A) => A.id === d.combined.largest.id)) == null ? void 0 : w.phase;
            return m > 1 ? `, and it sits in Phase ${m} because it needs more coordination, not because it matters less.` : ".";
          })(),
          " Start Phase 1 now: those changes carry almost no risk."
        ] }),
        d.overlaps.map((m) => /* @__PURE__ */ e.jsxs("p", { className: "mt-3 flex gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-[13.5px]", children: [
          /* @__PURE__ */ e.jsx(Y, { size: 16, className: "mt-0.5 shrink-0 text-p2" }),
          m.note
        ] }, m.ids.join())),
        ((ie = d.trend) == null ? void 0 : ie.length) > 1 && /* @__PURE__ */ e.jsx(zs, { trend: d.trend })
      ] }),
      o === "config" && /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-[14px] text-mute max-w-[70ch]", children: [
          "Tick a finding to see its change. Verified findings are ticked for you. The ",
          /* @__PURE__ */ e.jsx(fs, { t: "protected labels" }),
          " check runs on every preview, and the customer’s comments and structure are kept."
        ] }),
        D.length ? /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-2 my-4", children: D.map((m) => /* @__PURE__ */ e.jsxs("label", { className: y("flex gap-2 items-center rounded-lg border px-3 py-1.5 text-[13.5px] cursor-pointer", v.includes(m.ruleId) ? "border-refract bg-refract-soft" : "border-line bg-surface"), children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: v.includes(m.ruleId), onChange: (w) => j(w.target.checked ? [...v, m.ruleId] : v.filter((A) => A !== m.ruleId)) }),
          /* @__PURE__ */ e.jsx("span", { className: y("h-2 w-2 rounded-full", ne[m.pillar].bg) }),
          m.title,
          m.verifyStatus !== "verified" && /* @__PURE__ */ e.jsx("span", { className: "text-mute", children: "(not verified)" })
        ] }, m.ruleId)) }) : /* @__PURE__ */ e.jsx("div", { className: "mt-4", children: /* @__PURE__ */ e.jsx(ze, { title: "No findings carry config changes." }) }),
        h.length > 1 && /* @__PURE__ */ e.jsx("div", { role: "radiogroup", "aria-label": "Deployment type", className: "mb-3 inline-flex rounded-lg border border-line bg-sunk p-1 gap-1", children: h.map((m) => {
          var w, A, E, ce;
          return /* @__PURE__ */ e.jsxs("button", { role: "radio", "aria-checked": k === m, onClick: () => x(m), className: y("rounded-md px-3 py-1.5 text-[13.5px] font-medium", k === m ? "bg-surface shadow-sm" : "text-mute"), children: [
            Q[m],
            ((A = (w = t.configs) == null ? void 0 : w[m]) == null ? void 0 : A.format) === "empty" || !((ce = (E = t.configs) == null ? void 0 : E[m]) != null && ce.text) ? " (snippets)" : ""
          ] }, m);
        }) }),
        (f == null ? void 0 : f.error) && /* @__PURE__ */ e.jsx("p", { className: "text-bad text-[13.5px]", children: f.error }),
        (X = f == null ? void 0 : f.notes) == null ? void 0 : X.map((m) => /* @__PURE__ */ e.jsxs("p", { className: "mb-2 flex gap-2 text-[13.5px] text-warn", children: [
          /* @__PURE__ */ e.jsx(Y, { size: 15, className: "mt-0.5 shrink-0" }),
          m
        ] }, m)),
        (f == null ? void 0 : f.rows) && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line overflow-hidden", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 bg-sunk text-[12.5px] text-mute", children: [
            /* @__PURE__ */ e.jsx("span", { className: "px-3 py-2", children: "Current config" }),
            /* @__PURE__ */ e.jsxs("span", { className: "px-3 py-2 border-l border-line flex justify-between", children: [
              "With changes",
              /* @__PURE__ */ e.jsxs("span", { children: [
                K,
                " changed lines"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "max-h-[480px] overflow-auto font-mono text-[11.5px] bg-surface", children: f.rows.map((m, w) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2", children: [
            /* @__PURE__ */ e.jsxs("div", { title: m.left, className: y("min-w-0 px-2 whitespace-pre overflow-hidden text-ellipsis", m.kind === "del" && "bg-bad/10"), children: [
              /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: "text-mute mr-1", children: m.kind === "del" ? "−" : " " }),
              m.left ?? ""
            ] }),
            /* @__PURE__ */ e.jsxs("div", { title: m.right, className: y("min-w-0 px-2 whitespace-pre overflow-hidden text-ellipsis border-l border-line", m.kind === "add" && "bg-ok/10"), children: [
              /* @__PURE__ */ e.jsx("span", { "aria-hidden": !0, className: "text-mute mr-1", children: m.kind === "add" ? "+" : " " }),
              m.right ?? ""
            ] })
          ] }, w)) })
        ] })
      ] }),
      o === "upgrade" && d.upgrade && /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: [["Moving to", `${d.upgrade.to.chart ? `Chart ${d.upgrade.to.chart}, ` : ""}collector ${d.upgrade.to.collector}`, `From ${d.upgrade.from.chart ? `chart ${d.upgrade.from.chart}, ` : ""}collector ${d.upgrade.from.collector ?? "unknown"}`], ["Fixed automatically", d.versionStatus.autoFixed, "Renamed keys, moved settings, removed options"], ["Need a decision", d.versionStatus.manual, "Explained in plain English below"]].map(([m, w, A]) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface p-4", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-mute", children: m }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[20px] font-semibold tabnum mt-0.5", children: w }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute", children: A })
        ] }, m)) }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-4 overflow-x-auto rounded-xl border border-line bg-surface", children: /* @__PURE__ */ e.jsxs("table", { className: "w-full text-[13px]", children: [
          /* @__PURE__ */ e.jsx("thead", { className: "bg-sunk text-mute text-left", children: /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("th", { className: "px-4 py-2 font-medium", children: "Version" }),
            /* @__PURE__ */ e.jsx("th", { className: "px-4 font-medium", children: "Component" }),
            /* @__PURE__ */ e.jsx("th", { className: "px-4 font-medium", children: "What changed" }),
            /* @__PURE__ */ e.jsx("th", { className: "px-4 font-medium", children: "Status" })
          ] }) }),
          /* @__PURE__ */ e.jsx("tbody", { children: d.upgrade.changes.map((m, w) => /* @__PURE__ */ e.jsxs("tr", { className: "border-t border-line align-top", children: [
            /* @__PURE__ */ e.jsx("td", { className: "px-4 py-2.5 tabnum", children: m.version }),
            /* @__PURE__ */ e.jsx("td", { className: "px-4 py-2.5", children: m.component }),
            /* @__PURE__ */ e.jsxs("td", { className: "px-4 py-2.5 max-w-[60ch]", children: [
              m.what,
              m.explanation && /* @__PURE__ */ e.jsx("span", { className: "block text-mute mt-0.5", children: m.explanation })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-4 py-2.5 whitespace-nowrap", children: m.status === "Auto-fixed" ? /* @__PURE__ */ e.jsx(J, { tone: "ok", children: "Fixed" }) : m.status === "Not applicable" ? /* @__PURE__ */ e.jsx(J, { children: "Not needed" }) : /* @__PURE__ */ e.jsx(J, { tone: "warn", children: "Decide" }) })
          ] }, w)) })
        ] }) }),
        /* @__PURE__ */ e.jsx("h3", { className: "mt-6 text-[15px] font-semibold", children: "How to upgrade safely" }),
        /* @__PURE__ */ e.jsx("ol", { className: "mt-2 list-decimal pl-5 space-y-1 text-[14px]", children: d.upgrade.steps.map((m) => /* @__PURE__ */ e.jsx("li", { children: m }, m)) })
      ] }),
      o === "export" && /* @__PURE__ */ e.jsxs("section", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-line bg-surface p-5", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "text-[14px]", children: [
            se,
            " verified finding",
            se === 1 ? "" : "s",
            " will go into the customer report and the generated config."
          ] }),
          /* @__PURE__ */ e.jsxs("label", { className: "mt-3 flex gap-2.5 items-start text-[14px]", children: [
            /* @__PURE__ */ e.jsx("input", { type: "checkbox", className: "mt-1", checked: G, onChange: (m) => te(m.target.checked) }),
            /* @__PURE__ */ e.jsx("span", { children: "Also include findings that aren’t verified yet. Outputs get a DRAFT watermark." })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ e.jsx(B, { kind: "primary", size: "lg", disabled: !!r, onClick: () => n(!1), children: r === "final" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(me, { size: 16, className: "animate-spin" }),
              "Preparing…"
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(Ze, { size: 16 }),
              "Download all reports (.zip)"
            ] }) }),
            /* @__PURE__ */ e.jsx(B, { size: "lg", disabled: !!r, onClick: () => n(!0), children: r === "draft" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(me, { size: 16, className: "animate-spin" }),
              "Preparing…"
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(Ze, { size: 16 }),
              "Download all as draft (.zip)"
            ] }) })
          ] }),
          /* @__PURE__ */ e.jsxs("p", { className: "mt-2 text-[12.5px] text-mute", children: [
            "Each zip holds every report and config, named after ",
            ((Z = t.customer) == null ? void 0 : Z.name) || "the customer",
            ". The draft version includes unverified findings and marks every report DRAFT."
          ] }),
          /* @__PURE__ */ e.jsx(B, { className: "mt-4", disabled: W, onClick: L, children: W ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx(me, { size: 16, className: "animate-spin" }),
            "Generating…"
          ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx(Je, { size: 16 }),
            "Or pick individual files"
          ] }) }),
          N && /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-bad text-[13.5px]", children: N })
        ] }),
        T && /* @__PURE__ */ e.jsxs("div", { className: "mt-5 space-y-4", children: [
          ((oe = T.customerIssues) == null ? void 0 : oe.length) > 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 rounded-xl bg-warnbg px-4 py-3 text-[13.5px] text-warn", children: [
            /* @__PURE__ */ e.jsx(Y, { size: 16, className: "mt-0.5" }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("b", { children: "Check before sending:" }),
              " the customer report still contains ",
              [...new Set(T.customerIssues.map((m) => m.kind))].join(", "),
              "."
            ] })
          ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 rounded-xl bg-ok/10 px-4 py-3 text-[13.5px] text-ok", children: [
            /* @__PURE__ */ e.jsx(le, { size: 16, className: "mt-0.5" }),
            "Customer report check passed: no internal names, links, account IDs or keys found."
          ] }),
          [["customer", "For the customer"], ["config", "Config files"], ["tam", "For you (internal)"]].map(([m, w]) => {
            const A = Object.keys(T.files).filter((E) => nt(E, T.reportNames)[0] === m).sort();
            return A.length ? /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold mb-2", children: w }),
              /* @__PURE__ */ e.jsx("ul", { className: "grid sm:grid-cols-2 gap-2", children: A.map((E) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs("button", { onClick: () => ps(E, T.files[E]), className: "w-full flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-left hover:border-refract", children: [
                /* @__PURE__ */ e.jsx(Qt, { size: 18, className: "text-refract shrink-0" }),
                /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block text-[13.5px] font-medium truncate", children: E }),
                  /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] text-mute", children: nt(E, T.reportNames)[1] })
                ] }),
                /* @__PURE__ */ e.jsx(Je, { size: 16, className: "text-mute", "aria-label": "Download" })
              ] }) }, E)) })
            ] }, m) : null;
          }),
          T.warnings.length > 0 && /* @__PURE__ */ e.jsx(he, { summary: `Notes (${T.warnings.length})`, children: T.warnings.map((m) => /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-mute mt-1", children: m }, m)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { onBack: a, extra: /* @__PURE__ */ e.jsxs(B, { onClick: i, children: [
      /* @__PURE__ */ e.jsx(yt, { size: 15 }),
      "Start a new review"
    ] }), next: o !== "export" ? () => p(z[z.findIndex(([m]) => m === o) + 1][0]) : void 0, nextLabel: o === "plan" ? "Review config changes" : o === "config" && d.upgrade ? "Review the upgrade" : "Go to export", note: o === "export" ? "Re-run the assessment after Phase 1 to confirm the savings." : void 0 })
  ] });
}
function zs({ trend: t }) {
  const c = Math.max(...t.map((g) => g.total), 1e-3), n = (g) => 36 + g * 716 / Math.max(1, t.length - 1), o = (g) => 156 - g / c * 144, p = (g) => t.map((v, j) => `${j ? "L" : "M"}${n(j).toFixed(1)} ${o(v[g]).toFixed(1)}`).join(" "), d = [["total", "All data", "var(--ink)"], ["logs", "Logs", "var(--logs)"], ["traces", "Traces", "var(--traces)"], ["metrics", "Metrics", "var(--metrics)"]];
  return /* @__PURE__ */ e.jsxs("figure", { className: "mt-8 rounded-xl border border-line bg-surface p-5", children: [
    /* @__PURE__ */ e.jsxs("figcaption", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-[15px] font-semibold", children: [
        "Usage, last ",
        t.length,
        " days"
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex gap-4 text-[12.5px] text-mute", children: d.map(([g, v, j]) => /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-0.5 w-4", style: { background: j } }),
        v
      ] }, g)) })
    ] }),
    /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 760 180", className: "mt-3 w-full h-auto", role: "img", "aria-label": "Units per day over time by pillar", children: [
      [0, 0.5, 1].map((g) => /* @__PURE__ */ e.jsxs("g", { children: [
        /* @__PURE__ */ e.jsx("line", { x1: 36, x2: 752, y1: o(c * g), y2: o(c * g), stroke: "var(--line)" }),
        /* @__PURE__ */ e.jsx("text", { x: 30, y: o(c * g) + 4, textAnchor: "end", fontSize: "11", fill: "var(--mute)", children: (c * g).toFixed(1) })
      ] }, g)),
      d.map(([g, , v]) => /* @__PURE__ */ e.jsx("path", { d: p(g), fill: "none", stroke: v, strokeWidth: g === "total" ? 2.2 : 1.6, strokeLinejoin: "round" }, g)),
      /* @__PURE__ */ e.jsx("text", { x: 36, y: 174, fontSize: "11", fill: "var(--mute)", children: t[0].date.slice(0, 10) }),
      /* @__PURE__ */ e.jsx("text", { x: 752, y: 174, fontSize: "11", fill: "var(--mute)", textAnchor: "end", children: t.at(-1).date.slice(0, 10) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-mute mt-1", children: "Units per day." })
  ] });
}
export {
  Vs as A,
  B,
  he as D,
  ze as E,
  H as F,
  _e as P,
  je as S,
  fs as T,
  gs as a,
  ne as b,
  Os as c,
  J as d,
  Xe as e,
  y as f,
  V as i,
  e as j,
  u as r,
  _s as s,
  ee as u
};
