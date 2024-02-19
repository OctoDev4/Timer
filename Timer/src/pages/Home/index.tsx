// Importa os ícones de HandPalm e Play da biblioteca Phosphor React
import { HandPalm, Play } from 'phosphor-react'

// Importa utilitários do react-hook-form para gerenciar formulários
import { FormProvider, useForm } from 'react-hook-form'

// Importa o resolver de validação zod do hookform
import { zodResolver } from '@hookform/resolvers/zod'

// Importa a biblioteca de validação Zod
import * as zod from 'zod'

// Importa createContext e useState do React
import { useContext } from 'react'

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

// Importa o contexto dos ciclos de trabalho
import { CycleContext} from '../../contexts/CyclesContexts'

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

// Componente principal da aplicação
export function Home() {
  // Extrai as funções CreateNewCycle e interruptedCurrentCycle, e o ciclo ativo do contexto
  const { CreateNewCycle, interruptedCurrentCycle, activeCycle } = useContext(CycleContext)

  // Hook useForm para gerenciar o formulário de criação de novo ciclo
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  // Desestruturação das funções e valores do hook useForm
  const { handleSubmit, watch,reset } = newCycleForm


  function handleCreateNewCycle(data:NewCycleFormData){
    CreateNewCycle(data)
    reset()
  }

  // Obtém o valor do campo 'task' do formulário
  const task = watch('task')

  // Verifica se o botão de submissão do formulário deve estar desabilitado
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* Fornecer o contexto dos ciclos de trabalho */}
        {/* Fornecer o estado e métodos do formulário de criação de novo ciclo */}
        <FormProvider {...newCycleForm}>
          {/* Renderizar o formulário de criação de novo ciclo */}
          <NewCycleForm />
        </FormProvider>
        {/* Renderizar o componente de contagem regressiva */}
        <Countdown />

        {/* Renderizar botão para interromper ou começar o ciclo de trabalho */}
        {activeCycle ? (
          <StopCountDownButton onClick={interruptedCurrentCycle} type="button">
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
