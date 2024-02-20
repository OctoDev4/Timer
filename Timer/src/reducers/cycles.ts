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
  
  // Enumeração para definir os tipos de ações possíveis
  export enum ActionTypes {
    ADD_NEW_CYCLE = "ADD_NEW_CYCLE", // Adicionar um novo ciclo
    INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE", // Interromper o ciclo atual
    MARK_CURRENT_CYCLE_AS_FINISHED = "MARK_CURRENT_CYCLE_AS_FINISHED" // Marcar o ciclo atual como concluído
  }
  
  // Função redutora para gerenciar o estado dos ciclos com base nas ações
  export function CycleReducer(state: CyclesState, action: any) {
    switch (action.type) {
      // Caso de ação: adicionar um novo ciclo
      case ActionTypes.ADD_NEW_CYCLE:
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle], // Adiciona o novo ciclo ao array de ciclos
          activeCycleId: action.payload.newCycle.id // Define o ID do novo ciclo como o ciclo ativo
        };
      // Caso de ação: interromper o ciclo atual
      case ActionTypes.INTERRUPT_CURRENT_CYCLE:
        return {
          ...state,
          cycles: state.cycles.map((cycle: Cycle) =>
            cycle.id === state.activeCycleId // Verifica se o ciclo é o ciclo ativo
              ? { ...cycle, interruptedDate: new Date() } // Define a data de interrupção para o ciclo ativo
              : cycle
          ),
          activeCycleId: null // Define o ciclo ativo como nulo após a interrupção
        };
      // Caso de ação: marcar o ciclo atual como concluído
      case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
        return {
          ...state,
          cycles: state.cycles.map((cycle: Cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, finishedDate: new Date() }; // Define a data de conclusão para o ciclo ativo
            } else {
              return cycle;
            }
          })
        };
      // Caso padrão: retorna o estado atual sem modificar
      default:
        return state;
    }
  }
  