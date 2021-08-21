/**
 * ### Worker Message Types.
 * Use this in stead of hardcoding strings in worker messages
 * * types with $ at the end represent message from main thread to worker thread 
 * * types without $ at the end represent message from worker to main thread
 */

export enum WM {
    startTimer$ = 'startTimer',
    endTimer$ = 'endTimer',
    calculateScore$ = 'calculate Score',
    sendTypingArray$ = "send current typing object"

};

/**
 * Worker Message Format
 */

export interface WorkerMessage {
    type: WM,
    body: any;
}