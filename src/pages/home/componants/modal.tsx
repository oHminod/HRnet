const Modal = ({
  setIsOpenModal,
}: {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer -z-10"
        onClick={() => setIsOpenModal(false)}
      ></div>
      <div
        className="bg-white p-4 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Modal</h2>
        <p>This is a modal</p>
        <button onClick={() => setIsOpenModal(false)}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
