import { Link } from "react-router-dom";

export default function LegalBreadcrumbs({ currentPage }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-xs font-medium text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link to="/" className="hover:text-blue-700 hover:underline">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" className="font-semibold text-slate-700">{currentPage}</span></li>
      </ol>
    </nav>
  );
}
