import React, { ReactNode, createContext, useState } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}
interface CreateCycleData{
    task:string,
    minutesAmount:number

}

interface CycleContextType {
    cycles:Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  CreateNewCycle:(data:CreateCycleData)=>void;
  interruptedCurrentCycle:()=>void
}

interface CyclesContextProviderProps{
    children:ReactNode
}

export const CycleContext = createContext({} as CycleContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  // Estado para armazenar os ciclos de trabalho
  const [cycles, setCycles] = useState<Cycle[]>([]);
  // Estado para armazenar o ID do ciclo ativo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  // Estado para armazenar a quantidade de segundos passados
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Função para marcar o ciclo atual como terminado
  function markCurrentCycleAsFinished() {
    // Atualiza o estado dos ciclos marcando o ciclo atual como terminado
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }
  function CreateNewCycle(data: CreateCycleData) {
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
   
  }
   
  // Função para interromper o ciclo de trabalho
  function interruptedCurrentCycle() {
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


  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        CreateNewCycle,
        interruptedCurrentCycle
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}
