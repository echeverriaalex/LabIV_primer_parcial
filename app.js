const urlCareer = "https://utn-lubnan-api-2.herokuapp.com/api/Career";
const urlStudent = "https://utn-lubnan-api-2.herokuapp.com/api/Student";
const urlStudentDelete = "https://utn-lubnan-api-2.herokuapp.com/api/Student/";

let getAllCareers = function(url){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "json";

        request.onload = function(){
            if(request.status == 200){
                resolve(request.response);
            }
            else{
                reject(Error("Cannot get career list. " + request.statusText));
            }
        }

        request.onerror = function(){
            reject(Error("Problem network"));
        }

        request.send();
    })
}


function getArrayCareer(){
    return getAllCareers(urlCareer)
        .then((response)=>{
            return response.filter(career => (career.active == true))
        })
        .catch((error)=>{
            console.log(error);
        })
}


let getAllStudent = function(){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open("GET", urlStudent);
        request.responseType = "json"

        request.onload = function(){
            if(request.status){
                resolve(request.response)
            }
            else{
                reject(Error("Cannot get student list. " + request.statusText));
            }
        }

        request.onerror = function(){
            Error("Problem network")
        }

        request.send();
    })
}


function getArrayStudent(){
    return getAllStudent(urlStudent)
        .then((response)=>{

            // ordenar por lastname ascendente alfabeticamente
            return response.sort((a, b)=>{
                if(a.lastName < b.lastName)
                    return -1;
                else if(a.lastName > b.lastName)
                    return 1;
                else
                    return 0;
            })

            /*
            console.log("Estoy en then Ordene por lastname");

            console.log(response);

            students = response;

            console.log("fin del then");

            //let tbody = document.getElementById("data-list");
            //tbody.innerHTML = response

            return students;

            
            
            let studentInscripted = []
            response.forEach(student => {
                if(student.careerId){
                    studentInscripted.push(student)
                }
            });
            console.log(studentInscripted);
            return studentInscripted;
            */
        })
        .catch((error)=>{
            console.log(error);
        })
}



let deleteStudentById = function(idStudent, url){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open("DELETE", url + idStudent , true);
        request.responseType = "json"

        request.onload = function(){
            if(request.status){
                resolve(request.response)
            }
            else{
                reject(Error("Cannot delete student." + request.statusText));
            }
        }

        request.onerror = function(){
            Error("Problem network")
        }

        request.send();
    })
}


function deleteStudent(id, url){
    deleteStudentById(id, url)
        .then((response)=>{
            console.log('Student deleted ' + response);
        })
        .catch((error)=>{
            console.log(error);
        })
}

//console.log("Borre el studen 2");
//deleteStudent(2, urlStudentDelete)


function createRow(career, student){

    /*
    <tr>
        <th scope="row">3</th>
        <td>Research and Development</td>
        <td>Dowgill</td>
        <td>Ronnica</td>                
        <td>rdowgilla@printfriendly.com</td>
        <td><button type="button" class="btn btn-danger btn-sm">Delete</button></td>
    </tr>
    */

    let tr = document.createElement('tr')

    let th = document.createElement('th')
    th.setAttribute('scope', 'row')
    th.innerHTML = student.studentId
    tr.append(th)

    let tdC = document.createElement('td')
    tdC.innerHTML = career.name
    tr.append(tdC)

    let tdL = document.createElement('td')
    tdL.innerHTML = student.lastName
    tr.append(tdL)

    let tdF = document.createElement('td')
    tdF.innerHTML = student.firstName
    tr.append(tdF)

    let tdE = document.createElement('td')
    tdE.innerHTML = student.email
    tr.append(tdE)

    let button = document.createElement('button')
    button.setAttribute('class', "btn btn-danger btn-sm")
    button.innerHTML = "Delete"
    
    // agrego evento a cada boton que genero
    button.addEventListener('click', ()=>{
        deleteStudent(student.studentId, urlStudentDelete)
        let tbody = document.getElementById("data-list");
        tbody.innerHTML="" // pongo la tabla vacia
        // con esta funcion dibujo nuevamente la tabla 
        // (la actualizo cada vez que se borra un registro)
        addToTable()
    })

    let tdB = document.createElement('td')
    tdB.append(button)
    tr.append(tdB)

    return tr;
}


async function addToTable(){

    let tbody = document.getElementById("data-list");

    // Con esta funcion anda bien directamente obteniendo las careers
    // que es la primer funcion que obtiene la info de la api y retorna una promesa
    //let careers =  await getAllCareers(urlCareer)

    // Estas funciones gets tienen dentro una funcion que retorna una promesa
    // agarra esa promesa (un array) y los procesa y estas tambien devuelven
    // una promesa, entonces las tengo que esperar para que me retornen ese 
    // array ya procesado y recien aca lo puedo recorrer y mostrar en la tabla
    let careerList = await getArrayCareer()
    let studentList = await getArrayStudent()

    /*
    careerList.forEach(career => {
        console.log(career.name + " " + career.active);
    });

    console.log("Student list ");

    studentList.forEach(student =>{
        //console.log(student.firstName + " " + student.lastName);
    })
    */
    
    /*
    console.log("add get student");
    await getArrayStudent().then((res) => {
        console.log(res);
    });

    // esto fue una prueba de como dibujaria una fila en la tabla
    career = {careerId: 1, name: 'Marketing', active: true}
    student = {studentId: 1, careerId: 1, firstName: 'Oralle', lastName: 'Jerwood', email: 'ojerwood0@desdev.cn'}
    let row = createRow(career, student)
    tbody.appendChild(row);
    */

    studentList.forEach((student) =>{
        careerList.forEach((career) => {
            if(career.careerId == student.careerId){
                let row = createRow(career, student)
                tbody.appendChild(row);
            }
        });
    });
}

addToTable();