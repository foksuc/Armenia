import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function MotionScene({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(
            ".hero .title-line",
            { yPercent: 115, rotate: 3 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.15,
              stagger: 0.13,
              clearProps: "transform",
            },
            0.12,
          )
          .fromTo(
            ".hero-image",
            { scale: 1.18, opacity: 0.6 },
            { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" },
            0,
          )
          .fromTo(
            ".hero-bottom, .trip-summary, .trip-hero-actions, .trip-meta",
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              clearProps: "opacity,transform",
            },
            0.7,
          )
          .fromTo(
            ".hero-trip-card",
            { y: 45, rotate: 5, opacity: 0 },
            {
              y: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.95,
              clearProps: "transform,opacity",
            },
            0.85,
          );
        const heroImage = document.querySelector(".hero-image");
        if (heroImage)
          gsap.to(heroImage, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        const title = document.querySelector(".hero h1");
        if (title)
          gsap.to(title, {
            y: -65,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom 25%",
              scrub: 0.8,
            },
          });
        document
          .querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((el) => {
            const enter = () =>
              gsap.fromTo(
                el,
                { y: 36, opacity: 0.25 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  overwrite: "auto",
                  clearProps: "transform,opacity",
                },
              );
            ScrollTrigger.create({
              trigger: el,
              start: "top 91%",
              end: "bottom -45%",
              onEnter: enter,
              onEnterBack: enter,
              onLeave: () => gsap.set(el, { clearProps: "transform,opacity" }),
              onLeaveBack: () =>
                gsap.set(el, { clearProps: "transform,opacity" }),
            });
          });
        const scene = document.querySelector(".scenic-story");
        if (scene) {
          gsap.fromTo(
            ".scene-media",
            { scale: 0.88, clipPath: "inset(6% 5% 6% 5% round 32px)" },
            {
              scale: 1.08,
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top 95%",
                end: "bottom 10%",
                scrub: 1,
              },
            },
          );
          gsap.fromTo(
            ".scene-copy .title-line",
            { yPercent: 90 },
            {
              yPercent: 0,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top 80%",
                end: "center 55%",
                scrub: 0.8,
              },
            },
          );
          const path = document.querySelector<SVGPathElement>(
            ".editorial-line path",
          );
          if (path) {
            const length = path.getTotalLength();
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top 65%",
                  end: "bottom 55%",
                  scrub: 1,
                },
              },
            );
          }
        }
        document
          .querySelectorAll<HTMLElement>(".trip-card-image,.day-portrait")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { clipPath: "inset(9% 0% 0% 0% round 24px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              },
            ),
          );
      });
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [routeKey]);
  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(".trip-nav a"),
    ];
    const sections = links
      .map((a) => document.querySelector(a.hash))
      .filter((s): s is Element => Boolean(s));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            for (const a of links) {
              const active = a.hash === `#${e.target.id}`;
              a.classList.toggle("is-current", active);
              if (active) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            }
          }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    const onScroll = () =>
      document
        .querySelector(".topbar")
        ?.classList.toggle("is-scrolled", window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [routeKey]);
  return null;
}
