// Importa os ícones de HandPalm e Play da biblioteca Phosphor React
import { HandPalm, Play } from 'phosphor-react'
// Importa utilitários do react-hook-form para gerenciar formulários
import { FormProvider, useForm } from 'react-hook-form'
// Importa o resolver de validação zod do hookform
import { zodResolver } from '@hookform/resolvers/zod'
// Importa a biblioteca de validação Zod
import * as zod from 'zod'
// Importa createContext e useState do React
import { createContext, useState } from 'react'

// Importa os estilos e componentes do arquivo styles.js
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'
// Importa o componente NewCycleForm do arquivo components/NewCycleForm.js
import { NewCycleForm } from './components/NewCycleForm'
// Importa o componente Countdown do arquivo components/CountDown.js
import { Countdown } from './components/CountDown'

// Define a interface Cycle para tipar os ciclos de trabalho
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date,
}

// Define a interface CycleContextType para tipar o contexto dos ciclos de trabalho
interface CycleContextType {
  activeCycle:Cycle | undefined,
  activeCycleId:string | null,
  markCurrentCycleAsFinished: ()=> void,
  amountSecondsPassed:number,
  setSecondsPassed:(seconds:number)=> void
}

// Define o esquema de validação para o formulário de criação de novo ciclo
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

// Define o tipo dos dados do formulário de criação de novo ciclo
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

// Cria um contexto para compartilhar informações sobre os ciclos de trabalho
export const cycleContext = createContext({} as CycleContextType)

// Componente principal da aplicação
export function Home() {
  // Estado para armazenar os ciclos de trabalho
  const [cycles, setCycles] = useState<Cycle[]>([])
  // Estado para armazenar o ID do ciclo ativo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // Estado para armazenar a quantidade de segundos passados
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Encontra o ciclo ativo com base no ID
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Hook useForm para gerenciar o formulário de criação de novo ciclo
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const {handleSubmit, watch, reset } = newCycleForm

  // Função para marcar o ciclo atual como terminado
  function markCurrentCycleAsFinished(){
    // Atualiza o estado dos ciclos marcando o ciclo atual como terminado
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  // Função para criar um novo ciclo de trabalho
  function handleCreateNewCycle(data: NewCycleFormData) {
    // Gera um ID para o novo ciclo
    const id = String(new Date().getTime())
    // Cria um novo ciclo com os dados do formulário
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    // Atualiza o estado dos ciclos adicionando o novo ciclo
    setCycles((state) => [...state, newCycle])
    // Define o novo ciclo como o ciclo ativo
    setActiveCycleId(id)
    // Reinicia a contagem de segundos passados
    setAmountSecondsPassed(0)
    // Reseta o formulário
    reset()
  }
   
  // Função para interromper o ciclo de trabalho
  function handleInterruptCycle() {
    // Atualiza o estado dos ciclos marcando o ciclo atual como interrompido
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    // Define o ciclo ativo como nulo
    setActiveCycleId(null)
  }

  // Função para atualizar a quantidade de segundos passados
  function setSecondsPassed(seconds:number){
    setAmountSecondsPassed(seconds)
  }

  // Obtém o valor do campo 'task' do formulário
  const task = watch('task')
  // Verifica se o botão de submissão do formulário deve estar desabilitado
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* Fornecer o contexto dos ciclos de trabalho */}
        <cycleContext.Provider value= {{activeCycle , activeCycleId, markCurrentCycleAsFinished,amountSecondsPassed,setSecondsPassed}}>
          {/* Fornecer o estado e métodos do formulário de criação de novo ciclo */}
          <FormProvider {...newCycleForm}>
            {/* Renderizar o formulário de criação de novo ciclo */}
            <NewCycleForm />
          </FormProvider>
          {/* Renderizar o componente de contagem regressiva */}
          <Countdown/>
        </cycleContext.Provider>

        {/* Renderizar botão para interromper ou começar o ciclo de trabalho */}
        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )     
}
