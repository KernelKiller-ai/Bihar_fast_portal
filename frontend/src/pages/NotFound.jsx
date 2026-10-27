import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404 - Page Not Found | BiharFast";

    let robots = document.querySelector('meta[name="robots"]');
    const createdRobots = !robots;
    const previousRobots = robots?.getAttribute("content");
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
      if (createdRobots) {
        robots.remove();
      } else if (previousRobots === null) {
        robots.removeAttribute("content");
      } else {
        robots.setAttribute("content", previousRobots);
      }
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for could not be found.</p>
      <Link to="/" className="mt-6 inline-block font-bold text-blue-700 hover:underline">
        Return to BiharFast
      </Link>
    </main>
  );
}
