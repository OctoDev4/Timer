// Importa a função differenceInSeconds da biblioteca date-fns
import { differenceInSeconds } from 'date-fns'
// Importa o hook useContext e useEffect do React
import { useContext, useEffect} from 'react'
// Importa estilos relacionados ao contador do arquivo styles.js
import { CountDownContainer, Separator } from './styles'
import { CycleContext } from '../../../../contexts/CyclesContexts'
// Importa o contexto dos ciclos de trabalho


// Componente responsável por renderizar o contador regressivo do ciclo de trabalho
export function Countdown() {
  // Obtém informações do ciclo de trabalho ativo do contexto
  const {activeCycle,activeCycleId,markCurrentCycleAsFinished,amountSecondsPassed,setSecondsPassed} = useContext(CycleContext)

  // Calcula o total de segundos do ciclo de trabalho ativo
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    // Inicia um intervalo para atualizar o contador a cada segundo, se houver um ciclo de trabalho ativo
    if (activeCycle) {
      interval = setInterval(() => {
        // Calcula a diferença de segundos entre a data atual e a data de início do ciclo
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        // Verifica se o tempo do ciclo de trabalho já se esgotou
        if (secondsDifference >= totalSeconds) {
          // Marca o ciclo como terminado e para o intervalo
          markCurrentCycleAsFinished()   
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          // Atualiza a quantidade de segundos passados
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // Limpa o intervalo quando o componente é desmontado ou quando o ciclo de trabalho é alterado
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId,markCurrentCycleAsFinished,setSecondsPassed])

  // Calcula os minutos e segundos restantes no ciclo de trabalho
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Atualiza o título da página com o tempo restante no ciclo de trabalho
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // Renderiza o contador regressivo
  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
