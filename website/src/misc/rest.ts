import axios, { type AxiosResponse, type Method } from "axios";
import { useI18n } from "vue-i18n";

import { getToken } from "./token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASIC_AUTH_PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD;
const BASIC_AUTH_USERNAME = import.meta.env.VITE_BASIC_AUTH_USERNAME;
const INFO_BASE_URL = import.meta.env.VITE_INFO_BASE_URL;

export class AjaxError {
  public creation: Date;
  public raw: any;
  public status?: number;

  constructor(err: any) {
    this.raw = err;
    this.creation = new Date();

    if (err?.response?.data) {
      this.status = <number>err.response.status;
    }
  }

  public unauthorized(): boolean {
    return this.status === 401;
  }

  public toString(): string {
    const { t } = useI18n();
    return (
      this.raw?.response?.data?.error?.message ??
      this.raw?.response?.data?.message ??
      this.raw?.response?.data?.error_description ??
      this.raw?.response?.data?.error ??
      t('errors.unexpected')
    );
  }
}

export interface Options {
  method?: Method;
  params?: any;
  data?: any;
}

export function handleError(err: any): AjaxError {
  throw Object.freeze(new AjaxError(err));
}

function authHeader() {
  const token = getToken();
  return token ? { authorization: `Bearer ${token}` } : undefined;
}

export function fetchInfo(resource: string) {
  return axios
    .get(INFO_BASE_URL + resource)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchUserInfo() {
  return axios
    .get(API_BASE_URL + "userInfo/", {
      headers: authHeader(),
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function createEntity<T>(
  entity: string,
  payload?: any
): Promise<AxiosResponse<T>> {
  return axios.post<T>(`${API_BASE_URL}entities/${entity}`, payload, {
    headers: authHeader(),
  });
}

export function searchEntities<T>(
  entity: string,
  params?: any
): Promise<AxiosResponse<T[]>> {
  return axios.post<T[]>(`${API_BASE_URL}entities/${entity}/search`, params, {
    headers: authHeader(),
  });
}

export function fetchEntity<T>(
  entity: string,
  id: string,
  params?: any
): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${API_BASE_URL}entities/${entity}/${id}`, {
    headers: authHeader(),
    params: params,
  });
}

export function fetchEntities<T>(
  entity: string,
  params?: any
): Promise<AxiosResponse<T[]>> {
  return axios.get<T[]>(`${API_BASE_URL}entities/${entity}`, {
    headers: authHeader(),
    params: params,
  });
}

export function invokeService(
  service: string,
  method: string,
  options?: Options
) {
  return axios
    .request({
      url: `${API_BASE_URL}services/${service}/${method}`,
      headers: authHeader(),
      ...options,
    })
    .catch(handleError);
}

export function invokeQuery(query: string, method: string, options?: Options) {
  return axios
    .request({
      url: `${API_BASE_URL}queries/${query}/${method}`,
      headers: authHeader(),
      ...options,
    })
    .catch(handleError);
}

export function signIn(username: string, password: string) {
  const payload = new FormData();
  payload.append("grant_type", "password");
  payload.append("username", username);
  payload.append("password", password);

  return axios
    .post(API_BASE_URL + "oauth/token/", payload, {
      auth: {
        username: BASIC_AUTH_USERNAME,
        password: BASIC_AUTH_PASSWORD,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data.access_token;
    })
    .catch(handleError);
}

export function uploadFile(file: File) {
  const payload = new FormData();
  payload.append("file", file);

  return axios
    .post(API_BASE_URL + "files", payload, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch(handleError);
}

export default {
  AjaxError,

  createEntity,
  fetchEntity,
  fetchEntities,
  fetchInfo,
  fetchUserInfo,
  handleError,
  invokeService,
  invokeQuery,
  searchEntities,
  signIn,
  uploadFile,
};
