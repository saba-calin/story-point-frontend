interface IOwnProps {
  onClose: () => void;
  onSetActive: () => void;
  storyName: string;
  storyDescription: string;
  isLoading: boolean;
  isActive: boolean;
  isRoomOwner: boolean;
}

const SetActiveStoryModal = ({onClose, onSetActive, storyName, storyDescription, isLoading, isActive, isRoomOwner}: IOwnProps) => {

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    onClose();
  }

  const handleSetActive = () => {
    onSetActive();
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          {(isActive || !isRoomOwner) ? (
            <div>
              <h2 className="text-base font-semibold text-gray-900">Story details</h2>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-semibold text-gray-900">Set active story</h2>
              <p className="text-xs text-gray-400 mt-0.5">Make this story active for voting.</p>
            </div>
          )}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Story name</p>
            <p className="text-sm font-semibold text-gray-900">{storyName}</p>
          </div>

          {storyDescription && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-600">{storyDescription}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          >
            Back
          </button>
          {(!isActive && isRoomOwner) && (
            <button
              type="button"
              onClick={handleSetActive}
              disabled={isLoading}
              className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Setting…
                </>
              ) : "Set Active →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SetActiveStoryModal;
