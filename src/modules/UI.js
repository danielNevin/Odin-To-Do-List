import 'lodash';
import moment from 'moment';
import { upperCase } from 'lodash';
import './style.css';
import addTask from '../assets/doubleTick.png'
import { createProject } from './data';
import { isNullOrUndefined } from 'util';

function task(title, priority, dueDate, project) {
  this.title = title;
  this.priority = priority;
  this.dueDate = dueDate;
  this.project = project;
}

function baseContainers() {
  let container = document.createElement('div');
  container.setAttribute('id', 'container');

  let header = document.createElement('div');
  header.setAttribute('id', 'header');
  container.appendChild(header);

  let sidebar = document.createElement('div');
  sidebar.setAttribute('id', 'sidebar');
  container.appendChild(sidebar);

  let content = document.createElement('div');
  content.setAttribute('id', 'content');
  container.appendChild(content);

  return container;
}

function headerContents() {
  let title = document.createElement('div');
  title.setAttribute('id', 'headerTitle');
  title.innerHTML = upperCase('Things to Do');

  return title;
}

function sidebarContents() {
  let container = document.createElement('div')
  container.setAttribute('id', 'sidebarContainer');

  let home = document.createElement('div');
  home.setAttribute('id', 'sidebarHome');
  home.classList.add('sidebar-text');
  home.innerHTML = upperCase('Home');
  container.appendChild(home);
  
  let allTasksImg = document.createElement('img');
  allTasksImg.src = addTask;

  let allTasks = document.createElement('button');
  allTasks.setAttribute('id', 'sidebarAllTasks');
  allTasks.classList.add('sidebar-button');
  allTasks.appendChild(allTasksImg);
  allTasks.innerHTML = ('All Tasks');
  allTasks.onclick = function() {
    let container = document.getElementById('contentContainer');
    container.removeAttribute('data-tag');
    container.replaceChildren()
    taskArray.sort(function(a, b) {
      return parseInt(a.dueDate) - parseInt(b.dueDate);
    })
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      container.appendChild(taskDiv(task));
    }
    container.appendChild(addTaskButton());
    cancelProject();
  }
  container.appendChild(allTasks);

  let today = document.createElement('button');
  today.setAttribute('id', 'sidebarToday');
  today.classList.add('sidebar-button');
  today.appendChild(allTasksImg);
  today.innerHTML = ('Today');
  today.onclick = function() {
    let container = document.getElementById('contentContainer');
    container.removeAttribute('data-tag');
    container.replaceChildren()
    taskArray.sort(function(a, b) {
      return parseInt(a.dueDate) - parseInt(b.dueDate);
    })
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      let date = new Date();
      let day = date.getDate()
      if (parseInt((task.dueDate).slice(-2)) === day) {
        container.appendChild(taskDiv(task));
      }
    }
    container.appendChild(addTaskButton());
    cancelProject();
  }
  container.appendChild(today);

/*   let thisWeek = document.createElement('button');
  thisWeek.setAttribute('id', 'sidebarThisWeek');
  thisWeek.classList.add('sidebar-button');
  thisWeek.appendChild(allTasksImg);
  thisWeek.innerHTML = ('This Week');
  thisWeek.onclick = function() {
    let container = document.getElementById('contentContainer');
    container.removeAttribute('data-tag');
    cancelProject();
  }
  container.appendChild(thisWeek); */

  let projects = document.createElement('div');
  projects.setAttribute('id', 'sidebarProject');
  projects.classList.add('sidebar-text');
  projects.innerHTML = upperCase('Projects');
  container.appendChild(projects);

  let addProjectButton = document.createElement('button');
  addProjectButton.setAttribute('id', 'sidebarAddProject');
  addProjectButton.classList.add('sidebar-button');
  addProjectButton.appendChild(allTasksImg);
  addProjectButton.innerHTML = ('Add Project');
  container.appendChild(addProjectButton);

  return container;
}

function contentContents() {
  let container = document.createElement('div');
  container.setAttribute('id', 'contentContainer');

  return container;
}

function addTaskButton() {
  let addTask = document.createElement('button');
  addTask.setAttribute('id', 'addTaskButton');
  addTask.classList.add('content-button');
  addTask.innerHTML = upperCase('Add Task');
  
  addTask.onclick = function () {
    let div = document.getElementById('addTaskButton');
    let upperdiv = div.parentNode;
    upperdiv.removeChild(upperdiv.lastChild);
    upperdiv.appendChild(addTaskDiv());
    document.getElementById('addTaskDueDate').valueAsDate = new Date();
  }

  return addTask;
}

function addProjectDialog() {
  let div = document.getElementById('sidebarContainer');
  div.removeChild(div.lastChild);

  let container = document.createElement('div');
  container.setAttribute('id', 'addProjectContainer');
  container.classList.add('add-project-container')

  let input = document.createElement('input');
  input.setAttribute('id', 'addProjectInput');
  input.setAttribute('required', 'required');
  input.setAttribute('placeholder', 'Project Name');
  container.appendChild(input);

  let add = document.createElement('button');
  add.setAttribute('id', 'addProjectAdd');
  add.onclick = function() {
    if (document.getElementById('addProjectInput').value.length < 1) {
      document.getElementById('addProjectInput').style.backgroundColor = 'rgb(255, 180, 180)';
      alert('Your Project needs a name!')
    } else {
      addProject();
    }
  }
  add.innerHTML = upperCase("Add");
  container.appendChild(add);

  let cancel = document.createElement('button');
  cancel.setAttribute('id', 'addProjectCancel');
  cancel.onclick = function() {
    cancelProject();
  }
  cancel.innerHTML = upperCase("Cancel");
  container.appendChild(cancel);

  div.appendChild(container);
}

function cancelProject() {
  let div = document.getElementById('sidebarContainer');
  div.removeChild(div.lastChild);

  let addProjectButton = document.createElement('button');
  addProjectButton.setAttribute('id', 'sidebarAddProject');
  addProjectButton.classList.add('sidebar-button');
  addProjectButton.innerHTML = ('Add Project');
  addProjectButton.onclick = function() {
    addProjectDialog();
  }
  div.appendChild(addProjectButton);
}

function addProject() {
  let projectName = document.getElementById('addProjectInput').value;

  let div = document.createElement('button');
  div.innerHTML = projectName;
  div.setAttribute('id', projectName);
  div.classList.add('sidebar-button')
  div.onclick = function() {
    let container = document.getElementById('contentContainer');
    container.setAttribute('data-tag', projectName);
    container.replaceChildren();
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      if (task.project === projectName) {
        container.appendChild(taskDiv(task));
      }
    }
    let contentHeaderDiv = document.createElement('div');
    contentHeaderDiv.setAttribute('id', 'contentHeaderDiv');
    
    let titleDiv = document.createElement('div');
    titleDiv.innerHTML = upperCase(projectName);
    contentHeaderDiv.appendChild(titleDiv);

    let projectDelete = document.createElement('button');
    projectDelete.innerHTML = upperCase('Delete');
    projectDelete.setAttribute('id', 'projectDeleteButton');
    projectDelete.onclick = function() {
      for (let i = 0; i < taskArray.length; i++) {
        let task = taskArray[i];
        if (task.project === projectName) {
          taskArray.splice(i, 1);
          i -= 1;
        }
      }
      container.replaceChildren();
      container.appendChild(addTaskButton());
      document.getElementById('sidebarContainer').removeChild(document.getElementById(projectName));
      document.getElementById('contentContainer').removeAttribute('data-tag');
    }
    contentHeaderDiv.appendChild(projectDelete);

    container.insertBefore(contentHeaderDiv, container.firstChild);
    container.appendChild(addTaskButton());
  }
  let container = document.getElementById('sidebarContainer');
  container.insertBefore(div, container.lastChild);

  createProject(projectName);

  cancelProject();
}

function taskDiv(task) {
  let wrapper = document.createElement('div');
  wrapper.classList.add('content-wrapper');

  let projectDiv = document.createElement('div');
  projectDiv.innerHTML = task.project;
  projectDiv.setAttribute('id', 'projectNameDiv');

  let container = document.createElement('div');

  let checkbox = document.createElement('button');
  checkbox.setAttribute('id', 'taskCheckbox');
  checkbox.onmouseover = function() {
    checkbox.innerHTML = '✓';
  }
  checkbox.onmouseout = function() {
    checkbox.innerHTML = '';
  }
  checkbox.onclick = function() {
    for (let i = 0; i < taskArray.length; i++) {
      let task = taskArray[i];
      let div = checkbox.nextElementSibling;
      if ((task.title === div.id) || (task.title === div.nextElementSibling.id)) {
        taskArray.splice(i, 1);
      }
    }
    checkbox.closest('div.content-wrapper').remove();
  }
  container.appendChild(checkbox);

  if (task.project === undefined) {
    container.setAttribute('id', 'taskContainer');
  } else {
    container.setAttribute('id', 'taskContainerProject');
    container.appendChild(projectDiv);
  }

  let title = document.createElement('div');
  title.setAttribute('id', task.title);
  title.classList.add('task-div-title');
  title.innerHTML = task.title
  container.appendChild(title);

  let dueDateLabel = document.createElement('label');
  dueDateLabel.innerHTML = 'Due Date: ';
  container.appendChild(dueDateLabel);

  let dueDate = document.createElement('div');
  dueDate.setAttribute('id', 'taskDueDate');
  let dueDateDisplay = moment(task.dueDate, "YYYYMMDD").format('MMMM Do YYYY');
  dueDate.innerHTML = dueDateDisplay;
  container.appendChild(dueDate);

  let dueDateRelative = document.createElement('div');
  dueDateRelative.setAttribute('id', 'taskDueDateRelative');
  let dueDateRelativeDisplay = moment(task.dueDate, "YYYYMMDD").fromNow()
  dueDateRelative.innerHTML = ("(" + dueDateRelativeDisplay + ")");
  container.appendChild(dueDateRelative);

  wrapper.appendChild(container);

  return wrapper;
}

function addTaskDiv() {
  let container = document.getElementById('contentContainer');

  let wrapper = document.createElement('div');
  wrapper.classList.add('content-wrapper');

  let div = document.createElement('form');
  div.setAttribute('id', 'taskSubmission');

  let taskLabel = document.createElement('label');
  taskLabel.innerHTML = 'Task: ';
  taskLabel.setAttribute('id', 'addTaskLabel');
  div.appendChild(taskLabel);

  let input = document.createElement('input');
  input.setAttribute('id', 'taskInput');
  input.setAttribute('placeholder', 'Your Task');
  div.appendChild(input);

  let priorityLabel = document.createElement('label');
  priorityLabel.innerHTML = 'Priority: ';
  priorityLabel.setAttribute('id', 'addTaskLabel');
  div.appendChild(priorityLabel);

  let priority = document.createElement('select');
  priority.setAttribute('id', 'addTaskPriority');
  let option1 = document.createElement('option');
  let option2 = document.createElement('option');
  let option3 = document.createElement('option');
  option1.innerHTML = 'High';
  option2.innerHTML = 'Medium';
  option3.innerHTML = 'Low';
  priority.appendChild(option1);
  priority.appendChild(option2);
  priority.appendChild(option3);
  div.appendChild(priority);

  let dateLabel = document.createElement('label');
  dateLabel.innerHTML = 'Due Date: ';
  dateLabel.setAttribute('id', 'addTaskLabel');
  div.appendChild(dateLabel);

  let date = '<input type="date" id="addTaskDueDate" min=(new Date())>'
  div.insertAdjacentHTML("beforeend", date);

  let submit = document.createElement('button');
  submit.innerHTML = upperCase('Add');
  submit.setAttribute('id', 'taskAddSubmit');
  submit.setAttribute('type', 'button');
  submit.classList.add('task-add-button');
  submit.onclick = function() {
    if ((document.getElementById('taskInput').value === "") || (document.getElementById('taskInput').value === null) || (document.getElementById('taskInput').value === undefined)) {
      document.getElementById('taskInput').style.backgroundColor = 'rgb(255, 180, 180)';
      alert('Your Task needs a description!')
    } else {
      let div = document.getElementById('taskSubmission');
      let upperdiv = (div.parentNode).parentNode;
      let container = document.getElementById('contentContainer');
      if (document.getElementById('contentContainer').hasAttribute('data-tag')) {
        let title = document.getElementById('taskInput').value;
        let priority = document.getElementById('addTaskPriority').value;
        let dueDateRaw = document.getElementById('addTaskDueDate').value;
        let dueDate = dueDateRaw.replace(/-/g, "");
        let project = document.getElementById('contentContainer').getAttribute('data-tag');
        const theTask = new task(title, priority, dueDate, project);
        taskArray.push(theTask);
        upperdiv.removeChild(upperdiv.lastChild);
        upperdiv.appendChild(taskDiv(theTask));
        upperdiv.appendChild(addTaskButton());
      } else {
        let title = document.getElementById('taskInput').value;
        let priority = document.getElementById('addTaskPriority').value;
        let dueDateRaw = document.getElementById('addTaskDueDate').value;
        let dueDate = dueDateRaw.replace(/-/g, "");
        const theTask = new task(title, priority, dueDate);
        taskArray.push(theTask);
        upperdiv.removeChild(upperdiv.lastChild);
        upperdiv.appendChild(taskDiv(theTask));
        upperdiv.appendChild(addTaskButton());
      }
    }
  }
  div.appendChild(submit);

  let cancel = document.createElement('button');
  cancel.innerHTML = upperCase('Cancel');
  cancel.setAttribute('id', 'taskAddCancel');
  cancel.classList.add('task-add-button');
  cancel.onclick = function () {
    let div = document.getElementById('taskSubmission');
    let upperdiv = (div.parentNode).parentNode;
    upperdiv.removeChild(upperdiv.lastChild);
    upperdiv.appendChild(addTaskButton());
  }
  div.appendChild(cancel);

  wrapper.appendChild(div);

  return wrapper;
}

export { baseContainers, headerContents, sidebarContents, addProjectDialog, cancelProject, addProject, contentContents, addTaskDiv, addTaskButton };