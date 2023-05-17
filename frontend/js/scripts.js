const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');
const inputDescription = document.querySelector('.input-task-description');
const taskDetail = document.querySelector('.task-detail');
const modal = document.querySelector('.modal');

const fetchTasks = async ()=>{
    const response = await fetch('http://localhost:3000/tasks');

    const tasks = await response.json();

    return tasks;
};

const addTask = async (event) =>{
    event.preventDefault();

    const task = { title: inputTask.value, description: inputDescription.value};

    await fetch('http://localhost:3000/tasks',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task),
    });

    loadTasks();
    inputTask.value = '';
    inputDescription.value = '';

};

const deleteTask = async (id) =>{

    await fetch(`http://localhost:3000/tasks/${id}`,{
        method: 'DELETE',
    });

    loadTasks();
};

const updateTask = async (task) =>{

    const {id, title, description, created_at, status} = task;

    console.log(task);

    await fetch(`http://localhost:3000/tasks/${id}`,{
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description, status}),
    });

    loadTasks();
}

const formatDate = (dateUTC) => {
    const options = {dateStyle: 'long', timeStyle: 'short'};
    const date = new Date(dateUTC);

    return date.toLocaleString('pt-br', options);
};

const createElement = (tag = '', innerText = '', innerHTML = '', elementClass) =>{
    const element = document.createElement(tag);

    if (elementClass) element.classList.add(elementClass);

    if(innerText){
        element.innerText = innerText;
    }
    if(innerHTML){
        element.innerHTML = innerHTML;
    }

    return element;
};

const createSelect = (value = '') =>{
    const option = `
    <option value="pendente">pendente</option>
    <option value="em andamento">em andamento</option>
    <option value="concluida">concluida</option>
    `;

    const select = createElement('select','',option);

    select.value = value.toLocaleLowerCase().trim();

    return select;
};

const createRow = (task) =>{

    const {id, description, title, created_at, status} = task;

    const tr = createElement('tr');
    const tdTitle = createElement('td',title);
    const tdDescription = createElement('td',description);
    const tdCreatedAt = createElement('td',formatDate(created_at));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');

    const selectStatus = createSelect(status);

    selectStatus.addEventListener('change',({target})=>updateTask({... task, status: target.value}));

    const editButton = createElement('button','','<span class="material-symbols-outlined">edit</span>','btn-action');
    const removeButton = createElement('button','','<span class="material-symbols-outlined">delete</span>','btn-action');

    tdDescription.addEventListener('click',()=>{
        createTaskDetail(task);
        modal.style.visibility = 'visible';
        modal.style.opacity = 1;
    });

    editButton.addEventListener('click',()=>{
        createTaskDetail(task);
        modal.style.visibility = 'visible';
        modal.style.opacity = 1;
    });

    removeButton.addEventListener('click',()=>deleteTask(id));

    tdStatus.appendChild(selectStatus);

    tdActions.appendChild(editButton);
    tdActions.appendChild(removeButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdDescription);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    return tr;
};

const closeModal = (event)=>{
    console.log(event);
    if(event.target.className == 'modal'){
        modal.style.visibility = 'hidden';
        modal.style.opacity = 0;
    }
};

const createTaskDetail = (task) =>{
    const {id, description, title, created_at, status} = task;
    
    const taskCreatedAt = createElement('p',formatDate(created_at),'','task-date');
    const formTask = createElement('form',);

    const taskStatus = createSelect(status);
    const taskTitle = createElement('h3',title,'','task-title');
    const textTitle = createElement('input',title,'','task-title');
    const taskDescription = createElement('p',description,'','task-description');
    const textDescription = createElement('textarea',description,'','task-description');
    const btnUpdate = createElement('button','Salvar','','task-update');

    textTitle.value = task.title;
    textDescription.value = task.description;

    taskTitle.addEventListener('click',()=>{
        textTitle.value = task.title;
        formTask.replaceChild(textTitle,taskTitle);
    });

    taskDescription.addEventListener('click',()=>{
        textDescription.value = task.description;
        formTask.replaceChild(textDescription,taskDescription);
    });

    formTask.addEventListener('submit',(event)=>{
        event.preventDefault();
    });

    btnUpdate.addEventListener('click',(event)=>{

        if (textTitle) task.title               = textTitle.value;
        if (textDescription) task.description   = textDescription.value;

        updateTask({...task})
        
        taskTitle.innerText = task.title;
        textDescription.innerText = task.description;

        formTask.replaceChild(taskTitle,textTitle);
        formTask.replaceChild(taskDescription,textDescription);
    });

    taskDetail.innerText = '';
    formTask.appendChild(taskTitle);
    formTask.appendChild(taskStatus);
    formTask.appendChild(taskDescription);
    formTask.appendChild(btnUpdate);
    taskDetail.appendChild(formTask);
    
    taskDetail.appendChild(taskCreatedAt);
};

const loadTasks = async () =>{
    const tasks = await fetchTasks();

    tbody.innerHTML = '';

    tasks.forEach(task => {
        const tr = createRow(task);

        tbody.appendChild(tr);
    });
};

addForm.addEventListener('submit',addTask)

loadTasks();
