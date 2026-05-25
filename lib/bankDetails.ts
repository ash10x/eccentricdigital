export type WireDetail = {
  swiftCode: string;
  bankAddress: string;
  correspondentBank?: string;
  correspondentSwift?: string;
};

export type BankDetail = {
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  accountType: string;
  wire?: WireDetail;
};

export const BANK_DETAILS: BankDetail[] = [
  {
    bank: "NCB Jamaica",
    accountName: "Rodique Johnson",
    accountNumber: "XXXX-XXXX-XXXX",
    branch: "Bay West",
    accountType: "Savings",
    wire: {
      swiftCode: "JNCBJMKX",
      bankAddress: "32 Trafalgar Road, Kingston 10, Jamaica",
      correspondentBank: "CORRESPONDENT BANK NAME",
      correspondentSwift: "CORRESPONDENT SWIFT CODE",
    },
  },
  {
    bank: "Scotia Bank Jamaica",
    accountName: "Rodique Johnson",
    accountNumber: "10215-001012703",
    branch: "Sam Sharpe Square",
    accountType: "Savings",
    wire: {
      swiftCode: "NOSCJMKX",
      bankAddress:
        "Scotia Centre, Duke & Port Royal Streets, Kingston, Jamaica",
      correspondentBank: "CORRESPONDENT BANK NAME",
      correspondentSwift: "CORRESPONDENT SWIFT CODE",
    },
  },
];
