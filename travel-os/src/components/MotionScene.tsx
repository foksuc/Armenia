import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function MotionScene({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const image = document.querySelector(".hero-image");
        if (image)
          gsap.to(image, {
            yPercent: 8,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        document
          .querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((el) => {
            const show = () =>
              gsap.fromTo(
                el,
                { opacity: 0.55, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.65,
                  ease: "power3.out",
                  overwrite: true,
                },
              );
            ScrollTrigger.create({
              trigger: el,
              start: "top 94%",
              end: "bottom -40%",
              onEnter: show,
              onEnterBack: show,
              onLeave: () => gsap.set(el, { clearProps: "opacity,transform" }),
              onLeaveBack: () =>
                gsap.set(el, { clearProps: "opacity,transform" }),
            });
          });
      });
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [routeKey]);
  return null;
}
