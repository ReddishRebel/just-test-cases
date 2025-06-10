export declare type RecursiveStringArray = (string | RecursiveStringArray)[];

export declare type TestCaseDTO = {
  id: string;
  title: string;
  description: string;
  priority: string;
  preconditions: RecursiveStringArray;
  steps: RecursiveStringArray;
  results: RecursiveStringArray;
};
