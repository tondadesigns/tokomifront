export enum AuthenticationActionTypes {
    GUEST = "guest",
    LOGIN = "login",
    REGISTER = "register",
    LOGOUT = "logout",
}

export interface AuthenticationActions {
    label: string;
    type: AuthenticationActionTypes;
}
