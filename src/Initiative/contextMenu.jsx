import "./contextMenu.css";

const ContextMenu = ({
  positionX,
  positionY,
  isToggled,
  buttons,
  contextMenuRef,
}) => {
  return (
    <menu
      style={{ top: positionY, left: positionX }}
      className={`context-menu ${isToggled ? "active" : ""}`}
      ref={contextMenuRef}
    >
      {buttons.map((button, index) => {
        function handleClick(e) {
          e.stopPropagation();
          button.onClick(e);
        }

        if (button.isSpacer) return <hr key={index} />;

        return (
          <button
            onClick={handleClick}
            key={index}
            className="context-menu-option"
          >
            <span>{button.text}</span>
            <span className="context-menu-icon">{button.icon}</span>
          </button>
        );
      })}
    </menu>
  );
};

export default ContextMenu;
