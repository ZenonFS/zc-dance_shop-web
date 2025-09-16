export interface IHttpResponse<T = any> {
  title: string;
  message: string;
  status: number;
  results?: T | null;
}
