// export type ApiResponse<T> = {
//   meta: {
//     status: boolean;
//     code: number;
//     message: string;
//   };
//   data: T | null;
// };

export interface Platform {
  id: number;
  name: string;
  slug: string;
}
