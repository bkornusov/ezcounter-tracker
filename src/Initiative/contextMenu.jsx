import "./contextMenu.css";

const contextMenu = ({
  positionX,
  positionY,
  isToggled,
  buttons,
  contextMenuRef,
}) => {
  return (
    <menu>
      {buttons.map((button, index) => {
        function handleClick(e) {
          e.stopPropagation();
          button.onClick(e, rightClickItem);
        }

        if (button.isSpacer) return <hr key={index} />;

        return <button onClick={handleClick} />;
      })}
    </menu>
  );
};

export default contextMenu;
