import PropTypes from "prop-types";

export default function Logo({ className = "h-14 sm:h-25 w-auto" }) {
  return (
    <div className="flex items-center select-none group py-1">
      <img
        src="/logo.png"
        alt="BiharFast Logo"
        className={`${className} object-contain transition-transform duration-200 group-hover:scale-102 rounded-xl bg-white p-1 shadow-md`}
      />
    </div>
  );
}

Logo.propTypes = {
  className: PropTypes.string
};