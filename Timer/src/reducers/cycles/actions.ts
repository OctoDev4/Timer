import { Cycle } from "./reducer";

export enum ActionTypes {
    ADD_NEW_CYCLE = "ADD_NEW_CYCLE", // Adicionar um novo ciclo
    INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE", // Interromper o ciclo atual
    MARK_CURRENT_CYCLE_AS_FINISHED = "MARK_CURRENT_CYCLE_AS_FINISHED" // Marcar o ciclo atual como concluído
  }

  export function addNewCycleAction(newCycle:Cycle){
    return {
        type: ActionTypes.ADD_NEW_CYCLE,
        payload:{
            newCycle,
        }
    }
  }


  export function markCurrentCycleAsFinishedAction(){
    return {
        type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
    }
  }


  export function InterruptedCurrentCycleAction(){
    return {
        type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
    }
  }