import {useState} from "react";

interface IOwnProps {
  onClose: () => void;
  onCreateStory: (name: string, description: string) => void;
  isLoading: boolean;
}

const CreateStoryModal = ({onClose, onCreateStory, isLoading}: IOwnProps) => {

  const [storyName, setStoryName] = useState<string>("");
  const [storyDescription, setStoryDescription] = useState<string>("");

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    onClose();
  }

  const handleCreateStory = (event: any) => {
    event.preventDefault();
    onCreateStory(storyName, storyDescription);
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
          <div>
            <h2 className="text-base font-semibold text-gray-900">New story</h2>
            <p className="text-xs text-gray-400 mt-0.5">Create a story for your planning session.</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateStory} className="space-y-4">
          <div>
            <label htmlFor="storyName" className="block text-xs font-medium text-gray-500 mb-1.5">
              Story name
            </label>
            <input
              id="storyName"
              type="text"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              placeholder="e.g. User Authentication"
              required
              autoFocus
              disabled={isLoading}
              className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="storyDescription" className="block text-xs font-medium text-gray-500 mb-1.5">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="storyDescription"
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              placeholder="Add details about the story..."
              rows={3}
              disabled={isLoading}
              className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !storyName.trim()}
              className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating…
                </>
              ) : "Create →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStoryModal;
