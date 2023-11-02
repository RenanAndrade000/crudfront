class Funcionario{
    constructor(nome,cep,data,endereco,salario){
        this.nome = nome;
        this.cep = cep;
        this.endereco = endereco;
        this.salario = salario;
        this.data = data;
    }
}
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.endsWith("listagem.html")) {
    getLista();
  }
});


function listar(){
  window.location.href = "listagem.html"
  
}

function getLista() {
  var url = "http://localhost:8080/list"
  var tabela = document.getElementById("tbody")

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível obter os dados');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(funcionario => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `<th scope='row'>${funcionario.id}</th>
          <td contenteditable='true'>${funcionario.nome}</td>
          <td contenteditable='true'>${funcionario.cep}</td>
          <td contenteditable='true'>${funcionario.endereco}</td>
          <td contenteditable='true'>${funcionario.data}</td>
          <td contenteditable='true'>${funcionario.salario}</td>
          <td><button type='button' class='btn btn-info fas fa-edit'></button></td>
          <td><button type='button' class='btn btn-danger fas fa-trash'></button></td>`;

        const deleteButton = newRow.querySelector('.btn-danger');
        deleteButton.addEventListener('click', function () {
          const idToBeDeleted = funcionario.id;

          fetch(`http://localhost:8080/delete/${idToBeDeleted}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Não foi possível excluir o registro');
              }
              tabela.removeChild(newRow);
            })
            .catch(error => {
              console.error('Erro ao excluir: ' + error);
            });
        });

        const editButton = newRow.querySelector('.btn-info');
        editButton.addEventListener('click', () => {
          editButton.classList.remove('fa-edit');
          editButton.classList.add('fa-check');
          
          if (editButton.innerText === "Salvar") {

            const updatedFuncionario = {
              id: funcionario.id,
              nome: newRow.querySelector('td:nth-child(2)').textContent,
              cep: newRow.querySelector('td:nth-child(3)').textContent,
              endereco: newRow.querySelector('td:nth-child(4)').textContent,
              data: newRow.querySelector('td:nth-child(5)').textContent,
              salario: newRow.querySelector('td:nth-child(6)').textContent,
            };

            fetch(`http://localhost:8080/update/${updatedFuncionario.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedFuncionario),
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Não foi possível atualizar o registro');
                }
                editButton.innerText = "Editar";
              })
              .catch(error => {
                console.error('Erro ao atualizar: ' + error);
              });
          } else {
            editButton.innerText = "Salvar";
          }
        });

        tabela.appendChild(newRow);
      })
    })
    .catch(error => {
      console.error('Erro: ' + error);
    });
}




function telaRegistro(){
  window.location.href = "index.html"
}

function inserir(){
    var funcionario = new Funcionario();
    var alerta = document.getElementById("alerta");
    var url = "http://localhost:8080"

    funcionario.nome = document.getElementById("nome").value.toString();
    funcionario.endereco = document.getElementById("endereco").value.toString();
    funcionario.data = document.getElementById("data").value.toString();
    funcionario.salario = document.getElementById("salario").value.toString();
    funcionario.cep = document.getElementById("cep").value.toString();

    console.log(funcionario)

    var config ={
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(funcionario)
    };

    fetch(url + "/add", config)
  .then(function(response) {
    if (response.ok) {
        alerta.style.display = "block";
        setTimeout(function(){
            alerta.style.display ="none";
        },3000);

     
      if (response.status === 204) {
        alerta.style.display = "block";
        console.log('Resposta vazia');
      } else {
        return response.json();
      }
    } else {
      throw new Error('Falha na solicitação');
    }
  })
  .then(function(data) {
    console.log('Resposta da API:', data);
  })
  .catch(function(error) {
    console.error('Erro:', error);
  });


}