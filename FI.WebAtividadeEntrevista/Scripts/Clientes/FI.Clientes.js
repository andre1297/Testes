
const DadosCliente = {
    nome: document.getElementById("Nome"),
    cep: document.getElementById("CEP"),
    email: document.getElementById("Email"),
    sobrenome: document.getElementById("Sobrenome"),
    nacionalidade: document.getElementById("Nacionalidade"),
    estado: document.getElementById("Estado"),
    UF: document.getElementById("uf"),
    cidade: document.getElementById("Cidade"),
    logradouro: document.getElementById("Logradouro"),
    telefone: document.getElementById("Telefone"),
    cpf: document.getElementById("cpf"),

    cpfBeneficiario: document.getElementById("cpfBeneficiario"),
    NomeBeneficiario: document.getElementById("NomeBeneficiario")
}

$(document).ready(function () {
    $('#formCadastro').submit(function (e) {

        e.preventDefault();
        
        let tableBody = document.getElementById("tabelaBeneficiarios").getElementsByTagName("tr");
        let dadosBeneficiarios = [];

        $.each(tableBody, function (index, item) {
            if (index !== 0) {
                let beneficiario = {
                    "CPF": item.children[0].innerHTML.replace(/([^0-9])+/g, ""),
                    "Nome": item.children[1].innerHTML
                }

                dadosBeneficiarios.push(beneficiario);
            }
        });

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": DadosCliente.nome.value,
                "CEP": DadosCliente.cep.value.replace(/([^0-9])+/g, ""),
                "Email": DadosCliente.email.value,
                "Sobrenome": DadosCliente.sobrenome.value,
                "Nacionalidade": DadosCliente.nacionalidade.value,
                "Estado": DadosCliente.UF.value,
                "Cidade": DadosCliente.cidade.value,
                "Logradouro": DadosCliente.logradouro.value,
                "Telefone": DadosCliente.telefone.value.replace(/([^0-9])+/g, ""),
                "CPF": DadosCliente.cpf.value.replace(/([^0-9])+/g, ""),

                "Beneficiario": dadosBeneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    })

})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function AplicarMascara(mascaraInput) {
    const maximoInput = document.getElementById(`${mascaraInput}`).maxLength;
    let valorInput = document.getElementById(`${mascaraInput}`).value;
    let valorSemPonto = document.getElementById(`${mascaraInput}`).value.replace(/([^0-9])+/g, "");

    const mascaras = {
        cpf: valorInput.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
        Telefone: valorInput.replace(/[^\d]/g, "").replace(/^(\d{2})(\d{4})(\d{4})/, "($1)$2-$3"),
        CEP: valorInput.replace(/[^\d]/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),

        cpfBeneficiario: valorInput.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    };

    mascaras[mascaraInput].length === maximoInput ?
        document.getElementById(`${mascaraInput}`).value = mascaras[mascaraInput] :
        document.getElementById(`${mascaraInput}`).value = valorSemPonto;

    if (mascaraInput === 'cpf' || mascaraInput === 'cpfBeneficiario')
        ValidarCPF(document.getElementById(`${mascaraInput}`).value);

    if (mascaraInput === 'CEP') {
        BuscarCep(document.getElementById(`${mascaraInput}`).value)
    }
}

function ValidarCPF(cpf) {
    let modal = document.getElementById('modalBeneficiarios');

    let msgCpfInvalido = modal.style.display === 'block' ?
        document.getElementById("msgCpfInvalidoBeneficiario") :
        document.getElementById("msgCpfInvalido");


    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == '') {
        msgCpfInvalido.hidden = false;
        return;
    };

    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") {

        msgCpfInvalido.hidden = false;
        return;
    }

    // Valida 1o digito	
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9))) {
        msgCpfInvalido.hidden = false;
        return;
    }
    // Valida 2o digito	
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10))) {
        msgCpfInvalido.hidden = false;
        return;
    }

    msgCpfInvalido.hidden = true;
    return;
}

function BuscarCep(cep) {
    let msgCepInvalido = document.getElementById("msgCepInvalido");

    let numeroCep = cep.replace(/[^0-9]/gi, "");

    if (numeroCep.length == 8) {
        msgCepInvalido.hidden = true;

        $.ajax({
            url: "../Cliente/BuscarEndereco",
            method: "GET",
            data: {
                numeroCep: numeroCep
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (data) {
                    DadosCliente.logradouro.value = data.logradouro;
                    DadosCliente.estado.value = data.estado;
                    DadosCliente.UF.value = data.uf;
                    DadosCliente.cidade.value = data.localidade;
                }
        });

        return;
    }

    msgCepInvalido.hidden = false;
    return;
}

function IncluirBeneficiario() {
    let table = document.getElementById("tabelaBeneficiarios").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();
    newRow.id = DadosCliente.cpfBeneficiario.value.replace(/([^0-9])+/g, "");


    let campoCpf = newRow.insertCell(0);
    let campoNome = newRow.insertCell(1);
    let campoAcoes = newRow.insertCell(2);

    campoCpf.innerHTML = DadosCliente.cpfBeneficiario.value;
    campoNome.innerHTML = DadosCliente.NomeBeneficiario.value;
    campoAcoes.innerHTML =
        "<button id='" + newRow.id + "' type='submit' class='btn btn-sm btn-primary' onclick='AlterarBeneficiario(this)'>Alterar</button>" +
        "<button id='" + newRow.id + "' type='submit' class='btn btn-sm btn-primary' onclick='ExcluirBeneficiario(this)' style='margin-left: 5px;'>Excluir</button>";

    DadosCliente.cpfBeneficiario.value = '';
    DadosCliente.NomeBeneficiario.value = '';
}

function ExcluirBeneficiario(event) {
    let idLinhaClicada = event.attributes.id.nodeValue;
    let linhaClicada = document.getElementById(idLinhaClicada);

    linhaClicada.remove();
}

function AlterarBeneficiario(event) {

    let idLinhaClicada = event.attributes.id.nodeValue;

    let linhaClicada = document.getElementById(idLinhaClicada);

    debugger;

    DadosCliente.cpfBeneficiario.value = linhaClicada.children[0].innerHTML;
    DadosCliente.NomeBeneficiario.value = linhaClicada.children[1].innerHTML;

    linhaClicada.remove();
}