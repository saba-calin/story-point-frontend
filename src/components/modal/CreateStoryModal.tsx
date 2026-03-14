import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.tsx";
import jiraApi from "../../api/jiraApi.ts";
import type {JiraStory} from "../../util/types.ts";

interface IOwnProps {
  onClose: () => void;
  onCreateStory: (name: string, description: string, issueKey?: string) => void;
  isLoading: boolean;
}

const CreateStoryModal = ({onClose, onCreateStory, isLoading}: IOwnProps) => {

  const {user} = useContext(AuthContext)!;

  const [storyName, setStoryName] = useState<string>("");
  const [storyDescription, setStoryDescription] = useState<string>("");
  const [isImportingFromJira, setIsImportingFromJira] = useState<boolean>(false);
  const [jiraStep, setJiraStep] = useState<string>("select-project");

  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(false);

  const [stories, setStories] = useState<JiraStory[]>([]);
  const [isFetchingStories, setIsFetchingStories] = useState<boolean>(false);
  const [selectedStory, setSelectedStory] = useState<JiraStory | null>(null);

  const handleImportFromJira = async () => {
    try {
      setIsFetchingProjects(true);

      const response = await jiraApi.getProjects();
      setProjects(response.data.projects);

      if (response.data.projects.length > 0) {
        setSelectedProject(response.data.projects[0]);
      }

      setIsImportingFromJira(true);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const handleFetchStories = async () => {
    try {
      setIsFetchingStories(true);

      const response = await jiraApi.getStories(selectedProject);
      setStories(response.data.stories);

      setJiraStep("select-stories");

    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingStories(false);
    }
  }

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

  if (isImportingFromJira) {
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
              <h2 className="text-base font-semibold text-gray-900">Import from Jira</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {jiraStep === "select-project"
                  ? "Select a project to import stories from."
                  : `Stories from ${selectedProject} without estimates.`}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {jiraStep === "select-project" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Project</label>
                {isFetchingProjects ? (
                  <div className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-sm text-gray-400">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Loading projects...
                  </div>
                ) : (
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all cursor-pointer"
                  >
                    {projects.map((project) => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsImportingFromJira(false)}
                  disabled={isFetchingStories}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isFetchingProjects || !selectedProject || isFetchingStories}
                  onClick={handleFetchStories}
                  className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isFetchingStories ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Loading...
                    </>
                  ) : "Next →"}
                </button>
              </div>
            </div>
          )}

          {jiraStep === "select-stories" && (
            <div className="space-y-4">
              {stories.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400">No unestimated stories found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                  {stories.map((story) => (
                    <div
                      key={story.key}
                      onClick={() => setSelectedStory(story)}
                      className={`px-3.5 py-3 cursor-pointer transition-colors ${
                        selectedStory?.key === story.key
                          ? "bg-gray-50 border-l-2 border-l-gray-900"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 shrink-0">{story.key}</span>
                        <span className="text-sm text-gray-900 font-medium truncate">{story.name}</span>
                      </div>
                      {story.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{story.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setJiraStep("select-project");
                    setSelectedStory(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedStory || isLoading}
                  onClick={() => onCreateStory(selectedStory!.name, selectedStory!.description, selectedStory?.key)}
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
            </div>
          )}
        </div>
      </div>
    );
  }

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

          {user?.hasJiraAccess && (
            <button
              type="button"
              disabled={isLoading || isFetchingProjects}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              onClick={handleImportFromJira}
            >
              {isFetchingProjects ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading projects...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.001-1.005zM17.294 0H5.736a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057a5.215 5.215 0 0 0 5.215 5.215V1.005A1.005 1.005 0 0 0 17.294 0z"/>
                  </svg>
                  Import from Jira
                </>
              )}
            </button>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || isFetchingProjects}
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
