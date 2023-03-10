import { baseContainers, headerContents, sidebarContents, addProjectDialog, cancelProject, addProject, taskDiv, contentContents, addTaskDiv, addTaskButton} from "./Modules/UI";

window.onload = function() {
  document.body.appendChild(baseContainers());
  document.getElementById('header').appendChild(headerContents());
  document.getElementById('sidebar').appendChild(sidebarContents());
  document.getElementById('content').appendChild(contentContents());
  document.getElementById('contentContainer').appendChild(addTaskButton());
  document.getElementById('sidebarAddProject').onclick =  function() {
    addProjectDialog();
  }
}