import { ActionTypes } from "./actions";
import { produce } from "immer";

// Define a interface que representa o estado dos ciclos
interface CyclesState {
    cycles: Cycle[]; // Array de ciclos
    activeCycleId: string | null; // ID do ciclo ativo, pode ser uma string ou nulo
} 

// Define a interface que representa a estrutura de um ciclo
export interface Cycle {
    id: string; // ID único do ciclo
    task: string; // Descrição da tarefa associada ao ciclo
    minutesAmount: number; // Quantidade de minutos para o ciclo
    startDate: Date; // Data de início do ciclo
    interruptedDate?: Date; // Data de interrupção do ciclo (opcional)
    finishedDate?: Date; // Data de conclusão do ciclo (opcional)
}

// Função redutora para gerenciar o estado dos ciclos com base nas ações
export function CycleReducer(state: CyclesState, action: any) {
    switch (action.type) {
        // Caso de ação: adicionar um novo ciclo
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, draft => {
                draft.cycles.push(action.payload.newCycle)
                draft.activeCycleId = action.payload.newCycle.id
            });
        // Caso de ação: interromper o ciclo atual
        case ActionTypes.INTERRUPT_CURRENT_CYCLE:{

           const currentCycleIndex = state.cycles.findIndex((cycle)=>{
            return cycle.id === state.activeCycleId
           })

           if(currentCycleIndex < 0 ){
            return state
           }
            return produce(state, draft => {
               draft.activeCycleId = null
               draft.cycles[currentCycleIndex].interruptedDate = new Date()
            });
        // Caso de ação: marcar o ciclo atual como concluído
          }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:{
          const currentCycleIndex = state.cycles.findIndex((cycle)=>{
            return cycle.id === state.activeCycleId
           })

           if(currentCycleIndex < 0 ){
            return state
           }
            return produce(state, draft => {
               draft.activeCycleId = null
               draft.cycles[currentCycleIndex].finishedDate = new Date()
            });
        }
            
            
        // Caso padrão: retorna o estado atual sem modificar
        default:
            return state;
    }
}
