const input_field = document.querySelector("input")
const add_button = document.querySelector("#agregar")
const lista = document.querySelector("#lista")

// Se obtienen las tareas de la API
const getTasks = async () => {
    const response = await fetch("http://localhost:3000/tasks")
    const data = await response.json()

    if (data) {
        data.forEach((tarea) => addTask(tarea?.id, tarea?.descripcion, tarea.completada))
    }

    checkEmptyList()
}

// Método para reciclar y agregar las tareas a la interfaz
const addTask = (id, descripcion, completada = false) => {
    const li = document.createElement("li")
    li.id = id

    const p = document.createElement("p")
    const button = document.createElement("button")
    p.textContent = descripcion

    if (completada) {
        p.style.textDecoration = "line-through"
    }
    
    button.textContent = '-'
    button.addEventListener("click", deleteTask)

    p.addEventListener("click", toggleTask)
    li.appendChild(p)
    li.appendChild(button)

    lista.appendChild(li)
}

// Se borra la tarea de la lista
const deleteTask = async (event) => {
    const tarea = event.target.parentElement

    const response = await fetch(`http://localhost:3000/tasks/${tarea.id}`, {
        method: "DELETE"
    })

    if(!response.ok) {
        alert("API no disponible")
        return
    }
    
    lista.removeChild(tarea)

    checkEmptyList()
}

// Evento para añadir tarea utilizando el botón +
add_button.addEventListener("click", (event) => {
    event.preventDefault()

    const errorMsg = document.querySelector("#error-msg")
    const value = input_field.value

    if (value === '') {
        errorMsg.textContent = "No se puede agregar una tarea vacia"
        return 
    }
    
    errorMsg.textContent = ""

    const body = JSON.stringify({
        descripcion: value
    })

    fetch("http://localhost:3000/tasks", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    })
        .then(response => response.json())
        .then(data => addTask(data?.id, value))
        .catch(error => console.error(error))


    input_field.value = ""

    checkEmptyList()
})


// Se verifica si la lista esta vacia o no para mostrar el correspondiente mensaje
const checkEmptyList = () => {
    const tareas = document.querySelectorAll("li")
    const mensaje = document.querySelector("#lista-vacia")

    if (tareas.length === 0) {
        mensaje.style.display = "block";
    } else {
        mensaje.style.display = "none";
    }
}

// Se marca la tarea como completada
const toggleTask = (event) => {
    const id = event.target.parentElement.id
    const body = {
        completada: 0
    }
    
    if (event.target.style.textDecoration === "line-through") {
        body.completada = 0
        event.target.style.textDecoration = ""
    } else {
        body.completada = 1
        event.target.style.textDecoration = "line-through"
    }

    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => console.error(error))
}



getTasks()