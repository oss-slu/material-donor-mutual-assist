
function calculateImpact(donor) {
    let totalItemsDonated = 0;
    donor.donatedItems.forEach(item => {
      totalItemsDonated += item.quantity;
    });
  
    return totalItemsDonated;
  }
  
  module.exports = {
    calculateImpact
  };
  
