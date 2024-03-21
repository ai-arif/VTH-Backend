function generateRandomCaseNumber(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let caseNumber = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      caseNumber += charset[randomIndex];
    }
    
    return caseNumber;
  }
  
  export default generateRandomCaseNumber;
  