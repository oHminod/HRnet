import { CircleX } from "lucide-react";

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
        className="bg-white p-4 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Success</h2>
        <p>Employee Created!</p>
        <button
          className="absolute -top-[12px] -right-[12px] bg-white rounded-full p-1"
          onClick={() => setIsOpenModal(false)}
        >
          <CircleX />
        </button>
      </div>
    </div>
  );
};

export default Modal;
