import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // turn off smooth scrolling for this jump, then restore it
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    html.scrollTop = 0;            // in case html is the scroller
    document.body.scrollTop = 0;   // in case body is the scroller

    html.style.scrollBehavior = prev;
  }, [pathname]);

  return null;
}

export default ScrollToTop;