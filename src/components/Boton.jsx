import PropTypes from "prop-types";

const Boton = ({
  text,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
  disabled = false,
  dataTestId, // Nueva prop para data-testid
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-prymary-light transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      data-testid={dataTestId} // Agregamos data-testid
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{text}</span>
    </button>
  );
};

Boton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  dataTestId: PropTypes.string, // Agregamos PropTypes para la nueva prop
};

export default Boton;
