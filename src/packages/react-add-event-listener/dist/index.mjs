import { useRef as x, useEffect as p } from "react";
import { jsx as y } from "react/jsx-runtime";
function T(g) {
  const {
    domEventRequiredInfo: e,
    windowEventRequiredInfo: t
  } = g, v = x(), f = x(), c = x((r) => {
    v.current !== void 0 && v.current.eventListener(r), f.current !== void 0 && f.current.eventListener(r);
  });
  function l(r) {
    return !(typeof r != "object" || r.current === void 0);
  }
  function N(r) {
    return !(typeof r != "string" || !r.startsWith("selector:") || r.length <= 10);
  }
  return p(() => {
    var o;
    const r = () => {
      var s, i;
      if (e !== void 0) {
        const {
          target: n,
          eventName: a,
          eventListener: L,
          options: m
        } = e;
        if (l(n))
          (s = n.current) == null || s.removeEventListener(a, c.current);
        else if (N(n)) {
          const u = document.querySelector(n.replace("selector:", ""));
          u == null || u.removeEventListener(a, c.current);
        }
      }
      if (v.current !== void 0) {
        const {
          target: n,
          eventName: a,
          eventListener: L,
          options: m
        } = v.current;
        if (l(n))
          (i = n.current) == null || i.removeEventListener(a, c.current);
        else if (N(n)) {
          const u = document.querySelector(n.replace("selector:", ""));
          u == null || u.removeEventListener(a, c.current);
        }
      }
    };
    if (r(), e !== void 0) {
      const {
        target: s,
        eventName: i,
        eventListener: n,
        options: a
      } = e;
      if (l(s))
        (o = s.current) == null || o.addEventListener(i, c.current, a);
      else if (N(s)) {
        const L = document.querySelector(s.replace("selector:", ""));
        L == null || L.addEventListener(i, c.current, a);
      }
    }
    return () => {
      r();
    };
  }, [e == null ? void 0 : e.target, e == null ? void 0 : e.eventName, e == null ? void 0 : e.eventListener, e == null ? void 0 : e.options]), p(() => {
    v.current = e;
  }, [e == null ? void 0 : e.target, e == null ? void 0 : e.eventName, e == null ? void 0 : e.eventListener, e == null ? void 0 : e.options]), p(() => {
    const r = () => {
      if (t !== void 0 && typeof window < "u") {
        const {
          eventName: o,
          eventListener: s,
          options: i
        } = t;
        window.removeEventListener(o, c.current);
      }
      if (f.current !== void 0 && typeof window < "u") {
        const {
          eventName: o,
          eventListener: s,
          options: i
        } = f.current;
        window.removeEventListener(o, c.current);
      }
    };
    if (r(), t !== void 0 && typeof window < "u") {
      const {
        eventName: o,
        eventListener: s,
        options: i
      } = t;
      window.addEventListener(o, c.current, i);
    }
    return () => {
      r();
    };
  }, [t == null ? void 0 : t.eventName, t == null ? void 0 : t.eventListener, t == null ? void 0 : t.options]), p(() => {
    f.current = t;
  }, [t == null ? void 0 : t.eventName, t == null ? void 0 : t.eventListener, t == null ? void 0 : t.options]), {};
}
const b = "_test-box_5wui8_1", _ = {
  "test-box": "_test-box_5wui8_1",
  testBox: b
};
function h() {
  return /* @__PURE__ */ y("div", { className: _["test-box"] });
}
export {
  h as TestBox,
  T as useAddEventListener
};
