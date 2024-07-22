declare module 'ml-pca' {
  interface PCA {
    new (data: number[][]): PCA;
    getExplainedVariance(): number[];
    predict(options: { nComponents: number }): number[][];
  }

  const PCA: PCA;
  export default PCA;
}
