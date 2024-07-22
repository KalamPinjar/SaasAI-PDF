// @types/pca-js.d.ts
declare module "pca-js" {
  // Define the types for PCA functions and objects here if known
  // For a basic definition, you can start with:

  export default class PCA {
    constructor();
    fit(data: number[][]): PCA;
    transform(options?: { nComponents: number }): number[][];
  }
}
