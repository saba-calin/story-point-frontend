import axiosInstance from "./axiosInstance.ts";

const jiraApi = {
  getProjects: () => axiosInstance.get("/jira/projects"),
  getStories: (projectKey: string) => axiosInstance.get(`/jira/stories?projectKey=${projectKey}`)
};

export default jiraApi;
