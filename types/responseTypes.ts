export type Result<T> = {
  success:true;
  data:T;
} | {
  success: false;
  code: number;
  error: string;
}
