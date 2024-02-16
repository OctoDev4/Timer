// Importando os componentes e estilos necessários do arquivo styles.ts
import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutosAmountInput, Separator, StartCountDownButton, TaskInput } from "./styles";

// Importando o hook useForm do react-hook-form para lidar com formulários de forma eficiente
import { useForm } from "react-hook-form"
import{zodResolver} from "@hookform/resolvers/zod"
import * as zod from "zod"

// Definindo o esquema de validação para os campos do formulário
const newCicleValidationFormSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"), // Campo 'task' deve ser uma string com pelo menos 1 caractere
    minutesAmount: zod.number().min(5, "O intervalo deve ser de pelo menos 5 minutos").max(60) // Campo 'minutesAmount' deve ser um número entre 5 e 60
});

// Definindo o componente funcional Home
export function Home() {
    // Desestruturação do hook useForm para obter os métodos necessários
    const { register, handleSubmit , watch, formState } = useForm({
        resolver: zodResolver(newCicleValidationFormSchema) // Usando o esquema de validação com o resolver do zod
    })

    // Função para lidar com a submissão do formulário
    function handleCreateNewCycle(data:any) {
        console.log(data); // Exibindo os dados do formulário no console quando o formulário é submetido
    }

    console.log(formState.errors); // Exibindo erros de validação no console

    // Obtendo o valor do campo 'task' do formulário
    const task = watch("task");

    // Verificando se o campo 'task' está vazio
    const isSubmitDisable = task === 0; // Verifica se 'task' é igual a 0 (talvez você queira verificar se é uma string vazia em vez de 0)

    // Retornando a estrutura JSX do componente Home
    return (
        <HomeContainer>
            {/* Formulário para inserção de dados */}
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    {/* Campo de entrada para o nome do projeto */}
                    <label htmlFor="task">Vou Trabalhar em</label>
                    <TaskInput
                     type="text" 
                     id="task" 
                     placeholder="Nome para o seu projeto" 
                     list="task-suggestion"
                     {...register("task")} // Espalha as propriedades retornadas pelo registro do campo "task"
                     />
                     {/* Sugestões de nomes de projeto */}
                     <datalist id="task-suggestion">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="banana"/>
                     </datalist>

                    {/* Campo de entrada para a quantidade de minutos */}
                    <label htmlFor="minutesAmount">Durante</label>
                    <MinutosAmountInput
                     type="number"
                      id="minutesAmount" 
                      placeholder="00"
                      {...register("minutesAmount", {valueAsNumber:true})} // Espalha as propriedades retornadas pelo registro do campo "task"
                      />
                    <span>minutos</span>
                </FormContainer>
           
            {/* Contador regressivo */}
            <CountDownContainer>
                <span>0 </span>
                <span>0</span>
                <Separator>:</Separator>
                <span>0</span>
                <span>0</span>
            </CountDownContainer>

            {/* Botão para iniciar a contagem regressiva */}
            <StartCountDownButton  disabled={isSubmitDisable} type="submit">
                <Play size={24}/>
                Começar
            </StartCountDownButton>
            </form>
        </HomeContainer>
    );
}
