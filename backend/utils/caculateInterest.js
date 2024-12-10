
// Calculate interest based on deposit frequency and total deposits
const calculateInterest = (totalDeposits, frequency) => {
  const annualInterestRate = 0.07; // 7% interest rate
  let interest = 0;

  switch (frequency) {
    case "daily":
      interest = (totalDeposits * annualInterestRate) / 365;
      break;
    case "weekly":
      interest = (totalDeposits * annualInterestRate) / 52;
      break;
    case "monthly":
      interest = (totalDeposits * annualInterestRate) / 12;
      break;
    default:
      throw new Error("Invalid deposit frequency");
  }

  return interest;
};

module.exports = calculateInterest