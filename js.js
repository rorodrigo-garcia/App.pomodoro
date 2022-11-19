//app de pomodoro , consiste en poder focalizarnos para poder realizar tareas en un periodo chico de tiempo,se trabaja el contador,las listas,como estar constantemente actualizando la interfaz
const tasks = []; //crea un array para almacenar las tareas
let time = 0; // aca va a llevar la cuenta regresiva
let timer = null; //va a tener asignada una funcion con el set interval
let timerBreak = null; //lo mismo pero para el descanso
let current = null ; //aca nos va a decir cual es la tarea actual que se ejecuta


const bAdd = document.querySelector(`#bAdd`) //traje varias de las etiquetas señaladas en el index
const itTask = document.querySelector(`#itTask`)
const form = document.querySelector(`#form`)
const taskName = document.querySelector('#time #taskName') //aca llamo a las etiquetas time y taskName , esta estaba en starButtonHandler,pero para no repetirla decidio ponerlo aca
renderTime();
renderTask();


form.addEventListener("submit" , (e)=>{
    e.preventDefault(); //con esto lo que hacemos es que cuando marquemos que se envie nuestro formulario en realidad no se envia , ya que con esto anulamos el funcionamiento nativo y validamos el if
    if(itTask.value !== ""){
        createTask(itTask.value); //crea una funcion que aun no existe pero la mete en el if 
        itTask.value= ""; //una vez realizada la tarea elimina el texto
        renderTask();
    }
});

function createTask(value){ //pide un value
    const newTask={ //definimos un nuevo objeto 
        id:(Math.random() * 100).toString(36).slice(3), //aca crea un id dinamico,al que transforma a la base ,que en este caso es 36 y con slice borra 3 caracteres que estan de mas
        title: value,
        completed: false,
    };
    tasks.unshift(newTask); //aca lo agregamos al arreglo
}

function renderTask (){  //con esta funcion agarrar cada elemento de las tareas y generar un html que va a insertar en un contenedor
const html = tasks.map((task )=>{
    return`
            <div class="task">
                <div class="completed"> ${task.completed ? `<span class="done">done</span>` : `<button class="start-button" data-id="${task.id}"> Start </button>` }</div>
                <div class="title"> ${task.title} </div>
                </div>
    `;
}); // con esto vamos a iterar sobre cada uno de los elementos del arreglo y para cada una se va a crear una operacion especial ,al final va a regresar un arreglo nuevo para cada elemento,osea generar un html para cada objeto
const tasksContainer = document.querySelector('#tasks') //lo traigo del html
tasksContainer.innerHTML = html.join(''); //el metodo maps regresa el string y con el join los tranformo a todos en uno

const startButtons = document.querySelectorAll('.task .start-button');  //asignamos una variable,eligio un selectorall ,para todas las coincidencias que se adjunten
startButtons.forEach(button => {  //aca lo itera
    button.addEventListener('click' , e =>{  //agrega un evento a los botones
        if(!timer){  //pregunta si no existe timer ,si es nulo llama a la funcion starthandler
            const id = button.getAttribute('data-id')  //aca le saca el id 
            startButtonHandler(id); //relaciono el id 
            button.textContent = 'in progress...' //lo cambia para cuando se inice
        }
    })
})
}

function startButtonHandler(id){ 
    time = 5;  //aca calcula los 25 min de la actividad principal
    current = id; //almacena el id de la actividad actual
    const taskIndex = tasks.findIndex((task )=> task.id == id); //aca encuentra la actividad de la tarea actual , con el findIndex , va a iterar cada uno de los elementos,luego cuando encuentre la tarea buscada lo va a almacenar
    //aca estaba la variable taskName
    taskName.textContent = tasks[taskIndex].title; //aca manda a llamar al elemnto con el array y el nombre donde almacena todo (taskName)
    renderTime();
    timer = setInterval(() =>{  //aca le da formato al tiempo,esta funcion me permite ejecutar una funcion de manera indefinida
        timerHandler(id);   //llamo una funcion llamada timehandler,y le pongo el id
    } , 1000);  //se va a ejecutar cada 1 seg
}
    function timerHandler(id){
        time -- ; //con esto decremento el valor uno a uno
        renderTime(); //con esto renderizo el tiempo

        if(time === 0){  //con esto detengo el tiempo
            clearInterval (timer); //con esto lo detengo al set interval
            markCompleted(id); 
            timer == null;
            renderTask();
            startBreak();
        }
    }
    function startBreak(){
        time =  3 ; //defino el tiempo de break
        taskName.textContent = 'break'; //aca defino el nombre 
        renderTime();
        timerBreak =  setInterval(() =>{
            timerBreakHandler();  //aplico una funcion 
         } , 1000)
    }

   function timerBreakHandler(){
        time -- ;
        renderTime() ;

        if ( time === 0) {
            clearInterval(timerBreak);
            current = null;
            timerBreak = null;
            taskName.textContent = "" ;
            renderTask();
        }
    }

    function renderTime(){ //esta funcion me permite darle formato a un numero
        const timeDiv = document.querySelector('#time #value')
        const minutes = parseInt(time / 60);
        const seconds = parseInt ( time % 60);

        timeDiv.textContent = `${minutes < 10 ? '0' : ""} ${minutes} :${seconds < 10 ? '0' : ""} ${seconds}`;
    }

    function markCompleted(id){
        const taskIndex = tasks.findIndex((task) => task.id == id);
        tasks[taskIndex].completed = true;
    }

