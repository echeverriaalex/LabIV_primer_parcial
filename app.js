const urlCareer = "https://utn-lubnan-api-2.herokuapp.com/api/Career";
const urlStudent = "https://utn-lubnan-api-2.herokuapp.com/api/Student";
const urlStudentDelete = "https://utn-lubnan-api-2.herokuapp.com/api/Student/";

let getAllCareers = function(url){
    return new Promise(function( resolve, reject){
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "json"

        request.onload = function(){
            if(request.status == 200){
                resolve(request.response)
            }
            else{
                reject(Error("Cannot get career list. " + request.statusText));
            }
        }

        request.onerror = function(){
            reject(Error("Problem network"))
        }

        request.send();
    })
}


async function getArrayCareer(){
    await getAllCareers(urlCareer)
        .then((response)=>{
            let careerActives = response.filter(career => (career.active == true))
            console.log('carrer then '+ careerActives);
            careerActives.forEach(c=>{
                console.log(c.name);
            })

            console.log('tyoe then ' + typeof(careerActives));

            
            return careerActives;
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
    
    getAllStudent(urlStudent)
        .then((response)=>{
            // console.log(response);
            let studentInscripted = []
            response.forEach(student => {
                if(student.careerId){
                    studentInscripted.push(student)
                }
            });
            console.log(studentInscripted);
            return studentInscripted;
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

    let tdB = document.createElement('td')
    tdB.append(button)
    tr.append(tdB)

    tr.addEventListener('click', ()=>{

        deleteStudent(student.id, urlStudentDelete)
        addToTable()
    })

    return tr;

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
}


 async function addToTable(){
    
    let tbody = document.getElementById("data-list");
    let careers = await getArrayCareer()
    console.log('add');
    console.log(careers);
    
    console.log('typo' + typeof(careers));


    let students = getArrayStudent();
    console.log(students);

    console.log('recorr los array o');



    career = {careerId: 1, name: 'Marketing', active: true}

    student = {studentId: 1, careerId: 1, firstName: 'Oralle', lastName: 'Jerwood', email: 'ojerwood0@desdev.cn'}

    let row = createRow(career, student)
    tbody.appendChild(row);

    /*

    careers.forEach((career) => {
        
        students.forEach((student) =>{
            
            if(career.careerId == student.careerId){
                console.log('en el if de add');
                let row = createRow(career, student)
                tbody.appendChild(row);

                
            }
        });
    });  

    */
}

addToTable();





