// Importando bibliotecas e componentes necessários
import { Play } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { differenceInSeconds} from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { CountDownContainer, FormContainer, HomeContainer, MinutosAmountInput, Separator, StartCountDownButton, TaskInput } from "./styles";

// Definindo o esquema de validação para os campos do formulário
const newCycleValidationFormSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"), // Campo 'task' deve ser uma string com pelo menos 1 caractere
    minutesAmount: zod.number().min(5, "O intervalo deve ser de pelo menos 5 minutos").max(60) // Campo 'minutesAmount' deve ser um número entre 5 e 60
});

// Tipo de dados para o formulário de novo ciclo
type NewCycleFormData = zod.infer<typeof newCycleValidationFormSchema>;

// Interface para representar um ciclo
interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date
}

// Definindo o componente funcional Home
export function Home() {
    // Estado para armazenar os ciclos
    const [cycles, setCycles] = useState<Cycle[]>([]);
    // Estado para armazenar o ID do ciclo ativo
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    // Estado para armazenar a quantidade de segundos passados
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    // Desestruturação do hook useForm para obter os métodos necessários
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleValidationFormSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        };
        setCycles(prev => [...prev, newCycle]);
        setActiveCycleId(id);
        reset();
    }
     // Obtendo o ciclo ativo
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    // Atualiza o contador de segundos passados a cada segundo
    useEffect(() => {
        setInterval(() => {
            if (activeCycle) {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date() , activeCycle.startDate)
                );  // comparando as data com o date fns
            }
        }, 1000);

    }, [activeCycle]);

    // Função para lidar com a submissão do formulário
   
    

    // Calculando o tempo restante do ciclo ativo
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = totalSeconds - amountSecondsPassed;
    const minutes = String(Math.floor(currentSeconds / 60)).padStart(2, "0");
    // função padstart: se não tiver 2 numeros ele coloca o 0
    const seconds = String(currentSeconds % 60).padStart(2, "0");

    // Obtendo o valor do campo 'task' do formulário
    const task = watch("task");

    // Verificando se o campo 'task' está vazio
    const isSubmitDisable = !task;

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
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="banana" />
                    </datalist>

                    {/* Campo de entrada para a quantidade de minutos */}
                    <label htmlFor="minutesAmount">Durante</label>
                    <MinutosAmountInput
                        type="number"
                        id="minutesAmount"
                        min={5}
                        max={60}
                        step={5}
                        placeholder="00"
                        {...register("minutesAmount", { valueAsNumber: true })} // Espalha as propriedades retornadas pelo registro do campo "task"
                    />
                    <span>minutos</span>
                </FormContainer>
           
                {/* Contador regressivo */}
                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountDownContainer>

                {/* Botão para iniciar a contagem regressiva */}
                <StartCountDownButton disabled={isSubmitDisable} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    );
}
