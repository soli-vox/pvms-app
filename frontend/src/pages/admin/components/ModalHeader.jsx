const ModalHeader = ({ onClose, isSaving }) => (
  <div className="flex justify-between items-center mb-1">
    <h2 className="text-lg font-bold text-gray-800 text-center flex-1">
      Membership Details
    </h2>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      disabled={isSaving}
    >
      <span className="text-lg">×</span>
    </button>
  </div>
);

export default ModalHeader;
