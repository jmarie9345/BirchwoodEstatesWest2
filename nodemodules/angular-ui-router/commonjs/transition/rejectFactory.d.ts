export declare enum RejectType {
    SUPERSEDED = 2,
    ABORTED = 3,
    INVALID = 4,
    IGNORED = 5,
}
export declare class Rejection {
    type: number;
    message: string;
    detail: string;
    redirected: boolean;
    constructor(type: any, message?: any, detail?: any);
    toString(): string;
    toPromise(): any;
    /** Returns true if the obj is a rejected promise created from the `asPromise` factory */
    static isTransitionRejectionPromise(obj: any): boolean;
    /** Returns a TransitionRejection due to transition superseded */
    static superseded(detail?: any, options?: any): Rejection;
    /** Returns a TransitionRejection due to redirected transition */
    static redirected(detail?: any): Rejection;
    /** Returns a TransitionRejection due to invalid transition */
    static invalid(detail?: any): Rejection;
    /** Returns a TransitionRejection due to ignored transition */
    static ignored(detail?: any): Rejection;
    /** Returns a TransitionRejection due to aborted transition */
    static aborted(detail?: any): Rejection;
}
