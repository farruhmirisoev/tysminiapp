import { defineStore } from "pinia";

import rest, { AjaxError } from "@/misc/rest";
import { removeToken, setToken } from "@/misc/token";

interface AuthState {
  signingIn: boolean;
  signInError: AjaxError | null;

  signingUp: boolean;
  signUpError: AjaxError | null;

  resending: boolean;
  activating: boolean;
  activateError: AjaxError | null;

  sendingRecoveryCode: boolean;
  sendRecoveryCodeError: AjaxError | null;

  recoveringPassword: boolean;
  recoverPasswordError: AjaxError | null;

  changingPassword: boolean;
  changePasswordError: AjaxError | null;

  changingUsername: boolean;
  changeUsernameError: AjaxError | null;

  requestingPolicies: boolean;
  requestPoliciesError: AjaxError | null;

  data: any;
  fetching: boolean;
  fetchError: AjaxError | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    signingIn: false,
    signInError: null,

    signingUp: false,
    signUpError: null,

    resending: false,
    activating: false,
    activateError: null,

    sendingRecoveryCode: false,
    sendRecoveryCodeError: null,

    recoveringPassword: false,
    recoverPasswordError: null,

    changingPassword: false,
    changePasswordError: null,

    changingUsername: false,
    changeUsernameError: null,

    requestingPolicies: false,
    requestPoliciesError: null,

    data: null,
    fetching: false,
    fetchError: null,
  }),

  actions: {
    async signIn(username: string, password: string) {
      this.signingIn = true;
      this.signInError = null;

      try {
        const token: string = await rest.signIn(username, password);
        setToken(token);
        return;
      } catch (err) {
        this.signInError = <AjaxError>err;
        throw err;
      } finally {
        this.signingIn = false;
      }
    },

    async signUp(login: string, password: string) {
      this.signingUp = true;
      this.signUpError = null;

      try {
        const response = await rest.invokeService("UserService", "createUser", {
          method: "POST",
          data: { login, password },
        });

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.signUpError = <AjaxError>err;
        throw err;
      } finally {
        this.signingUp = false;
      }
    },

    async activate(login: string, smsCode: string) {
      this.activating = true;
      this.activateError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "activateUser",
          {
            method: "POST",
            data: { login, smsCode },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({
            response: {
              ...response,
              data: { message: "Неверный проверочный код" },
            },
          });
        }

        return;
      } catch (err) {
        this.activateError = <AjaxError>err;
        throw err;
      } finally {
        this.activating = false;
      }
    },

    async resendCode(login: string) {
      this.resending = true;
      this.activateError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "recoveryCode",
          {
            method: "POST",
            data: { login },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.activateError = <AjaxError>err;
        throw err;
      } finally {
        this.resending = false;
      }
    },

    async sendRecoveryCode(login: string) {
      this.sendingRecoveryCode = true;
      this.sendRecoveryCodeError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "recoveryCode",
          {
            method: "POST",
            data: { login },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.sendRecoveryCodeError = <AjaxError>err;
        throw err;
      } finally {
        this.sendingRecoveryCode = false;
      }
    },

    async recoverPassword(login: string, password: string, smsCode: string) {
      this.recoveringPassword = true;
      this.recoverPasswordError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "saveRecoveryPassword",
          {
            method: "POST",
            data: { login, password, smsCode },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.recoverPasswordError = <AjaxError>err;
        throw err;
      } finally {
        this.recoveringPassword = false;
      }
    },

    async changePassword(oldPassword: string, newPassword: string) {
      this.changingPassword = true;
      this.changePasswordError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "resetPassword",
          {
            method: "POST",
            data: { login: this.data.login, oldPassword, newPassword },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.changePasswordError = <AjaxError>err;
        throw err;
      } finally {
        this.changingPassword = false;
      }
    },

    async changeUsername(newLogin: string, smsCode: string | undefined) {
      this.changingUsername = true;
      this.changeUsernameError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "updateMobile",
          {
            method: "POST",
            data: { oldLogin: this.data.login, newLogin, smsCode },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.changeUsernameError = <AjaxError>err;
        throw err;
      } finally {
        this.changingUsername = false;
      }
    },

    async requestPolicies() {
      this.requestingPolicies = true;
      this.requestPoliciesError = null;

      try {
        const response = await rest.invokeService(
          "UserService",
          "updateContractForUser",
          {
            method: "POST",
            data: { login: this.data.login },
          }
        );

        if (!(response instanceof AjaxError) && !response.data.result) {
          rest.handleError({ response });
        }

        return;
      } catch (err) {
        this.requestPoliciesError = <AjaxError>err;
        throw err;
      } finally {
        this.requestingPolicies = false;
      }
    },

    async fetch() {
      this.fetching = true;
      this.fetchError = null;

      try {
        const user = await rest.fetchUserInfo();
        this.data = user;
        return;
      } catch (err) {
        this.fetchError = <AjaxError>err;
        throw err;
      } finally {
        this.fetching = false;
      }
    },

    clear() {
      removeToken();
      this.$reset();
    },
  },
});
